import { test, expect } from '@playwright/test';

test('has hero header and calculator', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Palet(y|)Broker/i);
  await expect(page.locator('h1')).toContainText('Transport paletowy');
  await expect(page.getByRole('heading', { name: /Błyskawiczna wycena/i })).toBeVisible();
});
