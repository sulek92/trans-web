import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.PLAYWRIGHT_API_URL || 'http://127.0.0.1:4000';

test('password reset flow works from request to login with new password', async ({ page, request }) => {
  const randomId = Date.now().toString(36);
  const email = `reset-${randomId}@example.com`;
  const initialPassword = 'TempPass123!';
  const newPassword = 'NoweHaslo123!';

  const registerResponse = await request.post(`${API_BASE_URL}/auth/register`, {
    data: {
      email,
      password: initialPassword,
      role: 'customer',
    },
  });
  expect(registerResponse.ok()).toBeTruthy();

  await page.goto('/reset-hasla');
  await page.getByPlaceholder('np. jan.kowalski@firma.pl').fill(email);
  await page.getByRole('button', { name: /Wyslij instrukcje/i }).click();

  await expect(page.getByText(/Token testowy \(dev\)/i)).toBeVisible();
  const token = (await page.locator('code').first().textContent())?.trim() || '';
  expect(token.length).toBeGreaterThan(10);

  await page.getByPlaceholder('Minimum 8 znakow').fill(newPassword);
  await page.getByPlaceholder('Powtorz nowe haslo').fill(newPassword);
  await page.getByRole('button', { name: /Zmien haslo/i }).click();
  await expect(page.getByText(/Haslo zmienione/i)).toBeVisible();

  await page.goto('/logowanie');
  await page.getByPlaceholder('np. jan.kowalski@firma.pl').fill(email);
  await page.locator('input[type="password"]').fill(newPassword);
  await page.getByRole('button', { name: /Zaloguj się/i }).click();
  await expect(page).toHaveURL(/\/konto$/);
});
