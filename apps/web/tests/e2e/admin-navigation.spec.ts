import { test, expect } from '@playwright/test';
import { SignJWT } from 'jose';

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
  const resolvedBaseURL = baseURL || 'http://127.0.0.1:3000';
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
  await expect(page.getByRole('heading', { name: /Witaj, Administratorze/i })).toBeVisible();

  const flows = [
    {
      link: 'Zamówienia',
      url: '/admin/zamowienia',
      heading: /Zarządzanie Zamówieniami/i,
    },
    {
      link: 'Klienci B2B',
      url: '/admin/uzytkownicy',
      heading: /Baza Klientów B2B/i,
    },
    {
      link: 'Zapytania \\(Leady\\)',
      url: '/admin/leady',
      heading: /Zapytania i Leady/i,
    },
    {
      link: 'Zarządzanie treścią',
      url: '/admin/cms',
      heading: /Zarządzanie treścią \(CMS\)/i,
    },
    {
      link: 'Ustawienia marż',
      url: '/admin/ustawienia',
      heading: /Ustawienia Systemowe/i,
    },
    {
      link: 'Dashboard',
      url: '/admin',
      heading: /Witaj, Administratorze/i,
    },
  ];

  for (const flow of flows) {
    await page.getByRole('link', { name: new RegExp(flow.link, 'i') }).click();
    await expect(page).toHaveURL(new RegExp(`${flow.url}$`));
    await expect(page.getByRole('heading', { name: flow.heading })).toBeVisible();
  }

  await context.close();
});
