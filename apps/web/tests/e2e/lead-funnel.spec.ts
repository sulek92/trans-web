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
    jti: `admin-lead-${now}`,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + 60 * 60)
    .sign(jwtSecret);
}

test('contact form lead is visible in admin leads panel', async ({ browser, page, baseURL }) => {
  const uniqueSuffix = Date.now().toString(36);
  const uniqueEmail = `kontakt-${uniqueSuffix}@example.com`;

  await page.goto('/kontakt');
  await page.getByPlaceholder('Jan Kowalski').fill('Test Kontakt');
  await page.getByPlaceholder('Nazwa Twojej firmy').fill('Firma Testowa');
  await page.getByPlaceholder('twoj@email.pl').fill(uniqueEmail);
  await page.getByPlaceholder('+48 000 000 000').fill('+48 600 700 800');
  await page.getByPlaceholder('W czym możemy pomóc?').fill('Potrzebujemy oferty transportu palet na przyszly tydzien.');
  const leadResponsePromise = page.waitForResponse((response) => (
    response.url().includes('/leads') &&
    response.request().method() === 'POST'
  ));
  await page.getByRole('button', { name: /Wyślij wiadomość|Wyslij wiadomosc/i }).click();
  const leadResponse = await leadResponsePromise;
  expect(leadResponse.status()).toBe(201);

  const resolvedBaseURL = baseURL || 'http://127.0.0.1:3000';
  const host = new URL(resolvedBaseURL).hostname;
  const adminContext = await browser.newContext();
  await adminContext.addCookies([
    {
      name: 'pb_auth_token',
      value: await createAdminToken(),
      domain: host,
      path: '/',
    },
    { name: 'pb_user_role', value: 'admin', domain: host, path: '/' },
  ]);

  const adminPage = await adminContext.newPage();
  await adminPage.goto(`${resolvedBaseURL}/admin/leady`);
  await expect(adminPage.locator('main')).toContainText(/Zapytania i Leady|Ladowanie zapytan/i);
  await expect(adminPage.locator('main')).toContainText(uniqueEmail, { timeout: 15000 });

  await adminContext.close();
});
