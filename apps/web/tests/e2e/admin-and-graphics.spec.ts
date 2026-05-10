import { test, expect } from '@playwright/test';
import { SignJWT } from 'jose';

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'local-secret');

async function createToken(role: 'admin' | 'customer') {
  const now = Math.floor(Date.now() / 1000);
  const email = role === 'admin' ? 'admin@paletbroker.pl' : 'user@paletbroker.pl';
  return new SignJWT({ 
    sub: role === 'admin' ? 'admin-1' : 'customer-1', 
    email, 
    role,
    type: 'access',
    jti: `test-${role}-${now}`
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + 60 * 60)
    .sign(jwtSecret);
}

test('redirects anonymous user from admin to login', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/logowanie\?next=%2Fadmin$/);
});

test('redirects anonymous user from account area to login', async ({ page }) => {
  await page.goto('/konto');
  await expect(page).toHaveURL(/\/logowanie\?next=%2Fkonto$/);
});

test('allows admin and blocks customer for admin panel', async ({ browser, baseURL }) => {
  const resolvedBaseUrl = baseURL || 'http://localhost:3001';
  const host = new URL(resolvedBaseUrl).hostname;

  const adminContext = await browser.newContext();
  await adminContext.addCookies([
    { name: 'pb_auth_token', value: await createToken('admin'), domain: host, path: '/' },
    { name: 'pb_user_role', value: 'admin', domain: host, path: '/' },
  ]);
  const adminPage = await adminContext.newPage();
  await adminPage.goto(`${resolvedBaseUrl}/admin`);
  await expect(adminPage).toHaveURL(/\/admin$/);
  await expect(adminPage.locator('main')).toContainText(/Witaj, Administratorze|Ładowanie statystyk/i);
  await adminContext.close();

  const customerContext = await browser.newContext();
  await customerContext.addCookies([
    { name: 'pb_auth_token', value: await createToken('customer'), domain: host, path: '/' },
    { name: 'pb_user_role', value: 'customer', domain: host, path: '/' },
  ]);
  const customerPage = await customerContext.newPage();
  await customerPage.goto(`${resolvedBaseUrl}/admin`);
  await expect(customerPage).toHaveURL(/\/logowanie\?forbidden=1$/);
  await customerContext.close();
});

test('allows authenticated customer to account area', async ({ browser, baseURL }) => {
  const resolvedBaseUrl = baseURL || 'http://localhost:3001';
  const host = new URL(resolvedBaseUrl).hostname;
  const customerContext = await browser.newContext();

  await customerContext.addCookies([
    { name: 'pb_auth_token', value: await createToken('customer'), domain: host, path: '/' },
    { name: 'pb_user_role', value: 'customer', domain: host, path: '/' },
  ]);

  const page = await customerContext.newPage();
  await page.goto(`${resolvedBaseUrl}/konto`);
  await expect(page).toHaveURL(/\/konto$/);
  await expect(page.locator('h1')).toContainText(/Cześć,/i);
  await customerContext.close();
});

test('login payment logos load correctly across viewports without horizontal overflow', async ({ page, request }) => {
  const failedRequests: string[] = [];
  const failedImageResponses: string[] = [];

  page.on('requestfailed', (req) => {
    const type = req.resourceType();
    if (type === 'image' || type === 'stylesheet') {
      failedRequests.push(`${type}: ${req.url()} :: ${req.failure()?.errorText || 'unknown'}`);
    }
  });

  page.on('response', (res) => {
    if (res.request().resourceType() === 'image' && res.status() >= 400) {
      failedImageResponses.push(`${res.status()}: ${res.url()}`);
    }
  });

  const viewports = [
    { width: 375, height: 812 },
    { width: 768, height: 1024 },
    { width: 1280, height: 800 },
    { width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto('/logowanie');
    await expect(page.getByRole('img', { name: /PayPal/i })).toBeVisible();
    await expect(page.getByRole('img', { name: /Visa/i })).toBeVisible();
    await expect(page.getByRole('img', { name: /Mastercard/i })).toBeVisible();
    for (const assetPath of ['/payment/paypal.svg', '/payment/visa.svg', '/payment/mastercard.svg']) {
      const response = await request.get(assetPath);
      expect(response.status(), `asset failed (${assetPath}) at ${viewport.width}x${viewport.height}`).toBe(200);
    }

    const noHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
    expect(noHorizontalOverflow, `horizontal overflow at ${viewport.width}x${viewport.height}`).toBeTruthy();

    await page.screenshot({
      path: test.info().outputPath(`login-${viewport.width}x${viewport.height}.png`),
      fullPage: true,
    });
  }

  expect(failedRequests, `failed asset requests: ${failedRequests.join('\n')}`).toEqual([]);
  expect(failedImageResponses, `failed image responses: ${failedImageResponses.join('\n')}`).toEqual([]);
});

test('login panel keeps correct width and is not visually clipped', async ({ page }) => {
  const viewports = [
    { width: 375, height: 812, minFormWidth: 260 },
    { width: 768, height: 1024, minFormWidth: 340 },
    { width: 1280, height: 800, minFormWidth: 360 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/logowanie?next=%2Fadmin');
    await expect(page.getByRole('heading', { name: /Witaj ponownie/i })).toBeVisible();

    const formBox = await page.locator('form').first().boundingBox();
    expect(formBox?.width ?? 0, `form width too small at ${viewport.width}x${viewport.height}`).toBeGreaterThanOrEqual(viewport.minFormWidth);

    const noHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
    expect(noHorizontalOverflow, `horizontal overflow at ${viewport.width}x${viewport.height}`).toBeTruthy();
  }
});
