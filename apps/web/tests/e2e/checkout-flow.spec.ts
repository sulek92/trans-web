import { test, expect } from '@playwright/test';

test('complete checkout flow from home to confirmation', async ({ page }) => {
  // 1. Home Page & Calculator
  await page.goto('/');
  await expect(page).toHaveTitle(/Palet(y|)Broker/i);

  // Fill calculator
  await page.getByPlaceholder('00-000').first().fill('00-001');
  await page.getByPlaceholder('00-000').last().fill('31-001');
  await page.getByPlaceholder('Np. 500').fill('350');
  await page.getByPlaceholder('Np. 150').fill('140');
  
  // Submit calculator
  await page.getByRole('button', { name: /Sprawdź dostępne opcje/i }).click();

  // 2. Offers Page
  await page.waitForURL(/\/wycena/);
  await expect(page.getByText('Wyniki Wyceny')).toBeVisible();
  
  // Select first offer
  await page.getByRole('link', { name: /Zamów teraz/i }).first().click();

  // 3. Checkout Wizard - Step 1: Offer Review
  await page.waitForURL(/\/zamowienie/);
  await expect(page.getByText('Wybrana oferta przewozu')).toBeVisible();
  await page.getByRole('button', { name: /Kontynuuj/i }).click();

  // 4. Step 2: Sender Data
  await expect(page.getByText('Dane Nadawcy')).toBeVisible();
  await page.locator('input[name="name"]').fill('Jan Kowalski');
  await page.locator('input[name="street"]').fill('Testowa 1');
  await page.locator('input[name="postalCode"]').fill('00-001');
  await page.locator('input[name="city"]').fill('Warszawa');
  await page.locator('input[name="email"]').fill('jan@kowalski.pl');
  await page.locator('input[name="phone"]').fill('123456789');
  await page.getByRole('button', { name: /Kontynuuj/i }).click();

  // 5. Step 3: Recipient Data
  await expect(page.getByText('Dane Odbiorcy')).toBeVisible();
  await page.locator('input[name="name"]').fill('Anna Nowak');
  await page.locator('input[name="street"]').fill('Dostawy 2');
  await page.locator('input[name="postalCode"]').fill('31-001');
  await page.locator('input[name="city"]').fill('Kraków');
  await page.locator('input[name="email"]').fill('anna@nowak.pl');
  await page.locator('input[name="phone"]').fill('987654321');
  await page.getByRole('button', { name: /Kontynuuj/i }).click();

  // 6. Step 4: Additional Services
  await expect(page.getByText('Usługi dodatkowe')).toBeVisible();
  await page.getByText('Dodatkowe ubezpieczenie').click();
  await page.getByPlaceholder('Np. 5000').fill('1000');
  await page.getByRole('button', { name: /Kontynuuj/i }).click();

  // 7. Step 5: Payment
  await expect(page.getByText('Metoda płatności')).toBeVisible();
  await page.getByText('Przelew natychmiastowy').click();
  await page.getByRole('button', { name: /Kontynuuj/i }).click();

  // 8. Step 6: Final Confirmation
  await expect(page.getByText('Dane gotowe do wysyłki!')).toBeVisible();
  
  // Submit final order
  await page.getByRole('button', { name: /Zapłać i zamów/i }).click();

  // 9. Redirect to Payment (Mock) or Success
  await page.waitForURL(/stripe\.com|confirmation/);
});
