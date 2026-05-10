import { test, expect } from '@playwright/test';
import { SignJWT } from 'jose';
import path from 'node:path';

const jwtSecret = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'local-secret',
);

async function createAdminToken() {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({
    sub: 'admin-1',
    email: 'admin@paletbroker.pl',
    role: 'admin',
    type: 'access',
    jti: `admin-${now}`,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + 60 * 60)
    .sign(jwtSecret);
}

test('admin sidebar navigation routes to the correct views', async ({
  browser,
  baseURL,
}) => {
  const resolvedBaseURL = baseURL || 'http://localhost:3000';
  const host = new URL(resolvedBaseURL).hostname;

  const context = await browser.newContext();
  await context.addCookies([
    {
      name: 'pb_auth_token',
      value: await createAdminToken(),
      domain: host,
      path: '/',
    },
    { name: 'pb_user_role', value: 'admin', domain: host, path: '/' },
  ]);

  const page = await context.newPage();
  await page.goto(`${resolvedBaseURL}/admin`);
  await expect(page.locator('main')).toContainText(/Witaj, Administratorze|Ładowanie statystyk/i);

  const flows = [
    {
      link: 'Zamówienia',
      url: '/admin/zamowienia',
      content: /Zarządzanie Zamówieniami|Ładowanie zamówień/i,
    },
    {
      link: 'Klienci B2B',
      url: '/admin/uzytkownicy',
      content: /Baza Klientów B2B|Ładowanie bazy klientów/i,
    },
    {
      link: 'Zapytania \\(Leady\\)',
      url: '/admin/leady',
      content: /Zapytania i Leady|Ładowanie zapytań/i,
    },
    {
      link: 'Zarządzanie treścią',
      url: '/admin/cms',
      content: /Zarządzanie treścią \(CMS\)|Ładowanie treści CMS/i,
    },
    {
      link: 'Wygląd',
      url: '/admin/wyglad',
      content: /Edytor wyglądu|Podgląd na żywo/i,
    },
    {
      link: 'Cennik',
      url: '/admin/cennik',
      content: /Reguły Cennika|Wczytywanie reguł cennika/i,
    },
    {
      link: 'Finanse',
      url: '/admin/finanse',
      content: /Finanse i Księgowość|Eksport Faktur do ZIP/i,
    },
    {
      link: 'Logi systemowe',
      url: '/admin/logi-systemowe',
      content: /Logi Systemowe|Szczegóły Zmian/i,
    },
    {
      link: 'Ustawienia',
      url: '/admin/ustawienia',
      content: /Ustawienia i System|Status usług/i,
    },
    {
      link: 'Dashboard',
      url: '/admin',
      content: /Witaj, Administratorze|Ładowanie statystyk/i,
    },
  ];

  for (const flow of flows) {
    await page.getByRole('link', { name: new RegExp(flow.link, 'i') }).click();
    await expect(page).toHaveURL(new RegExp(`${flow.url}$`));
    await expect(page.locator('main')).toContainText(flow.content);

    if (flow.url === '/admin/cms') {
      await expect(page.locator('main')).toContainText(/Hero image URL/i);
      await expect(page.locator('main')).toContainText(/Support image URL/i);
      await expect(page.locator('main')).toContainText(/CTA image URL/i);
    }
  }

  await context.close();
});

test('admin can upload homepage media and publish cms changes', async ({
  browser,
  baseURL,
  request,
}) => {
  const resolvedBaseURL = baseURL || 'http://localhost:3000';
  const host = new URL(resolvedBaseURL).hostname;
  const adminToken = await createAdminToken();

  const context = await browser.newContext();
  await context.addCookies([
    {
      name: 'pb_auth_token',
      value: adminToken,
      domain: host,
      path: '/',
    },
    { name: 'pb_user_role', value: 'admin', domain: host, path: '/' },
  ]);

  const page = await context.newPage();
  await page.goto(`${resolvedBaseURL}/admin/cms?section=home`);
  await expect(page.getByRole('heading', { name: /Zarządzanie treścią \(CMS\)/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Grafiki strony głównej/i })).toBeVisible();

  const filePath = path.resolve(
    __dirname,
    '../../public/images/home-hero-logistics.jpg',
  );
  await page.locator('input[type="file"]').first().setInputFiles(filePath);
  await expect(page.locator('main')).toContainText(
    /Wgrano grafikę i podpięto do pola/i,
  );

  await page.getByRole('button', { name: /Ustaw Hero/i }).first().click();
  const heroImageInput = page.getByLabel('Hero image URL');
  await expect(heroImageInput).toHaveValue(/\/images\/uploads\//);
  const uploadedUrl = await heroImageInput.inputValue();

  await page.getByRole('button', { name: /Opublikuj zmiany/i }).click();
  await expect(page.locator('main')).toContainText(/Zmiany opublikowane/i);

  await page.goto(`${resolvedBaseURL}/`);
  await expect(
    page.getByRole('img', { name: /Centrum operacyjne logistyki paletowej/i }),
  ).toBeVisible();

  const removeResponse = await request.delete(
    'http://localhost:4000/cms/media',
    {
      data: { url: uploadedUrl },
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    },
  );
  expect(removeResponse.ok()).toBeTruthy();

  await page.goto(`${resolvedBaseURL}/admin/cms?section=home`);
  await page
    .getByRole('button', { name: /Przywróć domyślną/i })
    .first()
    .click();
  await page.getByRole('button', { name: /Opublikuj zmiany/i }).click();
  await expect(page.locator('main')).toContainText(/Zmiany opublikowane/i);

  await context.close();
});
