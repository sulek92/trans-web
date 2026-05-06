import { test, expect } from '@playwright/test';

test('unauthenticated user is redirected when accessing /admin', async ({ page }) => {
  await page.goto('/admin');
  // Expect to be redirected to home page
  await expect(page).toHaveURL('/');
});
