import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { SignJWT } from 'jose';

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'local-secret');
const viewports = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
  { width: 1920, height: 1080 },
];

const publicRoutes = [
  '/',
  '/blog',
  '/cennik',
  '/dla-firm',
  '/faq',
  '/kariera',
  '/kontakt',
  '/logowanie',
  '/o-nas',
  '/pomoc',
  '/regulamin',
  '/sledzenie',
  '/typy-palet',
  '/wycena',
];

const adminRoutes = ['/admin', '/admin/zamowienia', '/admin/uzytkownicy', '/admin/leady', '/admin/cms', '/admin/ustawienia'];
const accountRoutes = ['/konto', '/konto/adresy', '/konto/zamowienia'];

async function createToken(role: 'admin' | 'customer') {
  const now = Math.floor(Date.now() / 1000);
  const email = role === 'admin' ? 'admin@paletbroker.pl' : 'user@paletbroker.pl';
  return new SignJWT({ 
    sub: role === 'admin' ? 'admin-1' : 'customer-1', 
    email, 
    role,
    type: 'access',
    jti: `test-vis-${role}-${now}`
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + 60 * 60)
    .sign(jwtSecret);
}

async function newContextWithRole(browser: Browser, baseURL: string, role?: 'admin' | 'customer'): Promise<BrowserContext> {
  const context = await browser.newContext();
  if (!role) return context;

  const host = new URL(baseURL).hostname;
  await context.addCookies([
    { name: 'pb_auth_token', value: await createToken(role), domain: host, path: '/' },
    { name: 'pb_user_role', value: role, domain: host, path: '/' },
  ]);

  return context;
}

async function assertPageVisualHealth(page: Page, route: string) {
  const failedAssets: string[] = [];
  const brokenResponses: string[] = [];

  page.on('requestfailed', (req) => {
    const type = req.resourceType();
    if (type === 'image' || type === 'font' || type === 'stylesheet') {
      failedAssets.push(`${type} ${req.url()} :: ${req.failure()?.errorText || 'unknown'}`);
    }
  });

  page.on('response', (res) => {
    const type = res.request().resourceType();
    if ((type === 'image' || type === 'font' || type === 'stylesheet') && res.status() >= 400) {
      brokenResponses.push(`${res.status()} ${res.url()}`);
    }
  });

  await page.goto(route, { waitUntil: 'domcontentloaded' });

  const noHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  expect(noHorizontalOverflow, `horizontal overflow on ${route}`).toBeTruthy();

  const iconsUseProperFont = await page.evaluate(() => {
    const icons = Array.from(document.querySelectorAll<HTMLElement>('.material-symbols-outlined'));
    if (icons.length === 0) return true;
    return icons.every((icon) => getComputedStyle(icon).fontFamily.toLowerCase().includes('material symbols'));
  });
  expect(iconsUseProperFont, `material symbols font fallback detected on ${route}`).toBeTruthy();

  const images = page.locator('img');
  const imageCount = await images.count();
  for (let i = 0; i < imageCount; i += 1) {
    await expect(images.nth(i), `image ${i} not visible on ${route}`).toBeVisible();
  }

  expect(failedAssets, `failed static assets on ${route}:\n${failedAssets.join('\n')}`).toEqual([]);
  expect(brokenResponses, `broken static responses on ${route}:\n${brokenResponses.join('\n')}`).toEqual([]);
}

test.describe.configure({ timeout: 180_000 });

test('public routes: visuals and assets are healthy on all target viewports', async ({ browser, baseURL }, testInfo) => {
  const resolvedBaseURL = baseURL || 'http://localhost:3101';
  const context = await newContextWithRole(browser, resolvedBaseURL);

  for (const viewport of viewports) {
    for (const route of publicRoutes) {
      const page = await context.newPage();
      await page.setViewportSize(viewport);
      await assertPageVisualHealth(page, `${resolvedBaseURL}${route}`);
      await page.screenshot({
        path: testInfo.outputPath(`public-${route.replace(/\//g, '_') || 'home'}-${viewport.width}x${viewport.height}.png`),
        fullPage: true,
      });
      await page.close();
    }
  }

  await context.close();
});

test('admin routes: visuals and assets are healthy on all target viewports', async ({ browser, baseURL }, testInfo) => {
  const resolvedBaseURL = baseURL || 'http://localhost:3101';
  const context = await newContextWithRole(browser, resolvedBaseURL, 'admin');

  for (const viewport of viewports) {
    for (const route of adminRoutes) {
      const page = await context.newPage();
      await page.setViewportSize(viewport);
      await assertPageVisualHealth(page, `${resolvedBaseURL}${route}`);
      await page.screenshot({
        path: testInfo.outputPath(`admin-${route.replace(/\//g, '_')}-${viewport.width}x${viewport.height}.png`),
        fullPage: true,
      });
      await page.close();
    }
  }

  await context.close();
});

test('customer routes: visuals and assets are healthy on all target viewports', async ({ browser, baseURL }, testInfo) => {
  const resolvedBaseURL = baseURL || 'http://localhost:3101';
  const context = await newContextWithRole(browser, resolvedBaseURL, 'customer');

  for (const viewport of viewports) {
    for (const route of accountRoutes) {
      const page = await context.newPage();
      await page.setViewportSize(viewport);
      await assertPageVisualHealth(page, `${resolvedBaseURL}${route}`);
      await page.screenshot({
        path: testInfo.outputPath(`account-${route.replace(/\//g, '_')}-${viewport.width}x${viewport.height}.png`),
        fullPage: true,
      });
      await page.close();
    }
  }

  await context.close();
});
