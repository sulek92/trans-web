import { test, expect } from '@playwright/test';

test('unauthenticated user is redirected when accessing /admin', async ({ page }) => {
  await page.goto('/admin');
  // Expect to be redirected to login page
  await expect(page).toHaveURL(/\/logowanie\?next=%2Fadmin$/);
});
