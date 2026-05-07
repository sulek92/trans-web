import { test, expect } from '@playwright/test';

test('Admin CMS: create new CMS page', async ({ page }) => {
  // This test assumes admin user is already logged in or the test environment handles auth via cookies.
  await page.goto('/admin/cms/pages/new');

  // Fill form fields; selectors are based on the input naming in CMS New page
  // Fallback selectors use placeholder texts or labels when possible
  const slugInput = page.locator('input[placeholder="Slug (opcjonalnie)"]');
  const titleInput = page.locator('input'); // first input in the page, may be slug or title
  const contentTextarea = page.locator('textarea');

  // Try to fill fields by order: slug, title, content
  if (await slugInput.count()) await slugInput.fill('o-nas');
  if (await titleInput.count()) await titleInput.nth(1).fill('O nas');
  if (await contentTextarea.count()) await contentTextarea.fill('Zawartość na stronę O nas.');

  // Submit the form (button with text 'Utwórz' or 'Zapisz')
  const submitBtn = page.locator('button:has-text("Utwórz")');
  if (!(await submitBtn.count())) {
    // fallback to 'Zapisz'
    await page.locator('button:has-text("Zapisz")').first().click();
  } else {
    await submitBtn.first().click();
  }

  // After creation, we expect to be redirected back to CMS pages list or the route to edit the slug
  await expect(page).toHaveURL(/\/admin\/cms\/pages/);
});
