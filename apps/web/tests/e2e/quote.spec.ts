import { test, expect } from '@playwright/test';

async function acceptCookiesIfVisible(page: import('@playwright/test').Page) {
  const acceptCookiesButton = page.getByRole('button', { name: /Akceptuj(e|ę) wszystkie/i });
  if (await acceptCookiesButton.isVisible().catch(() => false)) {
    await acceptCookiesButton.click();
  }
}

test('has hero header and calculator', async ({ page }) => {
  await page.goto('/');
  await acceptCookiesIfVisible(page);

  await expect(page).toHaveTitle(/Palet(y|)Broker/i);
  await expect(page.locator('h1')).toContainText(/transport paletowy/i);
  await expect(page.getByRole('heading', { name: /Błyskawiczna wycena/i })).toBeVisible();
});

test('quick quote form accepts key shipment data and navigates to results', async ({ page }) => {
  await page.goto('/');
  await acceptCookiesIfVisible(page);

  await page.locator('input[name="senderPostalCode"]').fill('00-001');
  await page.locator('input[name="recipientPostalCode"]').fill('30-001');
  await page.locator('input[name="palletCount"]').fill('2');
  await page.locator('input[name="weight"]').fill('320');
  await page.locator('input[name="height"]').fill('165');
  await page.locator('input[name="senderIsPrivate"]').check();

  await page.getByRole('button', { name: /Porównaj Oferty Kurierów/i }).click();
  await expect(page).toHaveURL(/\/wycena\?/);
  await expect(page.getByRole('heading', { name: /Wyniki Wyceny/i })).toBeVisible();
  await expect(page.getByText('00-001 → 30-001')).toBeVisible();
  await expect(page.getByText('Liczba palet')).toBeVisible();
});

test('quote section stays responsive and visible across target desktop/mobile viewports', async ({ page }) => {
  const targets = [
    { width: 375, height: 812, minSectionWidth: 340 },
    { width: 768, height: 1024, minSectionWidth: 700 },
    { width: 1280, height: 900, minSectionWidth: 1200 },
    { width: 1920, height: 1080, minSectionWidth: 1200 },
  ] as const;

  for (const target of targets) {
    await page.setViewportSize({ width: target.width, height: target.height });
    await page.goto('/');
    await acceptCookiesIfVisible(page);

    const calculator = page.locator('#calculator');
    await expect(calculator).toBeVisible();
    const calculatorBounds = await calculator.boundingBox();
    expect(calculatorBounds?.width ?? 0).toBeGreaterThan(target.minSectionWidth);

    await expect(page.getByText('Podgląd ładunku')).toBeVisible();
    await expect(page.getByText(/120 × 80 × 150 cm/)).toBeVisible();
    await expect(page.getByRole('button', { name: /Porównaj Oferty Kurierów/i })).toBeVisible();

    const horizontalOverflow = await page.evaluate(() => (
      document.documentElement.scrollWidth - document.documentElement.clientWidth
    ));
    expect(horizontalOverflow).toBeLessThanOrEqual(2);
  }
});
