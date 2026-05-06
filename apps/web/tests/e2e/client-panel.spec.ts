import { test, expect } from '@playwright/test';
import { SignJWT } from 'jose';

const jwtSecret = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'local-secret',
);

async function createCustomerToken() {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({
    sub: 'user-1',
    email: 'user@paletbroker.pl',
    role: 'customer',
    type: 'access',
    jti: `user-${now}`,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + 60 * 60)
    .sign(jwtSecret);
}

test.describe('Client Panel Operations', () => {
  test.beforeEach(async ({ context, baseURL }) => {
    const resolvedBaseURL = baseURL || 'http://127.0.0.1:3101';
    const host = new URL(resolvedBaseURL).hostname;

    await context.addCookies([
      {
        name: 'pb_auth_token',
        value: await createCustomerToken(),
        domain: host,
        path: '/',
      },
      { name: 'pb_user_role', value: 'customer', domain: host, path: '/' },
    ]);
  });

  test('should view dashboard stats', async ({ page, baseURL }) => {
    const resolvedBaseURL = baseURL || 'http://127.0.0.1:3101';
    await page.goto(`${resolvedBaseURL}/panel`);
    
    // Check if dashboard loaded
    await expect(page.locator('h1')).toContainText('Witaj w Panelu Klienta');
    await expect(page.locator('main')).toContainText('Zarządzaj swoimi przesyłkami');
  });

  test('should view order history', async ({ page, baseURL }) => {
    const resolvedBaseURL = baseURL || 'http://127.0.0.1:3101';
    await page.goto(`${resolvedBaseURL}/panel/orders`);
    
    await expect(page.locator('h1')).toContainText('Moje zamówienia');
    // It should at least show the table or "brak zamówień"
    await expect(page.locator('main')).toContainText('Nie złożyłeś jeszcze żadnego zamówienia');
  });

  test('should manage address book', async ({ page, baseURL }) => {
    const resolvedBaseURL = baseURL || 'http://127.0.0.1:3101';
    await page.goto(`${resolvedBaseURL}/panel/addresses`);
    
    await expect(page.locator('h1')).toContainText('Książka adresowa');
    
    // Click "Dodaj adres"
    await page.click('button:has-text("Dodaj adres")');
    
    // Fill form
    await page.fill('input:near(:text("Imię i Nazwisko"))', 'TEST_CONTACT');
    await page.fill('input:near(:text("Etykieta"))', 'TEST_LABEL');
    await page.fill('input:near(:text("Ulica"))', 'Testowa 123');
    await page.fill('input:near(:text("Kod pocztowy"))', '00-001');
    await page.fill('input:near(:text("Miasto"))', 'Warszawa');
    await page.fill('input:near(:text("Telefon"))', '123123123');
    await page.fill('input:near(:text("E-mail"))', 'test@example.com');
    
    // Save
    const savePromise = page.waitForResponse(r => r.url().includes('/users/me/addresses') && r.request().method() === 'POST');
    await page.click('button:has-text("Zapisz adres")');
    await savePromise;
    
    // Check for success toast or the new address in list
    await expect(page.locator('text=TEST_CONTACT')).toBeVisible();
  });

  test('should load settings page', async ({ page, baseURL }) => {
    const resolvedBaseURL = baseURL || 'http://127.0.0.1:3101';
    await page.goto(`${resolvedBaseURL}/panel/settings`);
    
    await expect(page.locator('h1')).toContainText('Ustawienia profilu');
    await expect(page.locator('text=Zmiana Hasła')).toBeVisible();
  });
});
