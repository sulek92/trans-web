import { test, expect } from '@playwright/test';
import { SignJWT } from 'jose';

const jwtSecret = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'local-secret',
);

async function createAdminToken() {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({
    sub: 'admin-1',
    email: 'admin@paletbroker.pl',
    role: 'admin',
    type: 'access',
    jti: `admin-${now}`,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + 60 * 60)
    .sign(jwtSecret);
}

test.describe('Admin Dashboard CRUD Operations', () => {
  test.beforeEach(async ({ context, baseURL }) => {
    const resolvedBaseURL = baseURL || 'http://127.0.0.1:3101';
    const host = new URL(resolvedBaseURL).hostname;

    await context.addCookies([
      {
        name: 'pb_auth_token',
        value: await createAdminToken(),
        domain: host,
        path: '/',
      },
      { name: 'pb_user_role', value: 'admin', domain: host, path: '/' },
    ]);
  });

  test('should add and manage pricing rules', async ({ page, baseURL }) => {
    const resolvedBaseURL = baseURL || 'http://127.0.0.1:3101';
    await page.goto(`${resolvedBaseURL}/admin/cennik`);
    
    // Check if page loaded
    await expect(page.locator('h1')).toContainText('Reguły Cennika');

    // Click "Nowa Reguła"
    await page.click('button:has-text("Nowa Reguła")');

    // Fill form
    await page.fill('input:near(:text("Kod Przewoźnika"))', 'TEST_CARRIER');
    await page.fill('input:near(:text("Nazwa Usługi"))', 'Test Service');
    await page.fill('input[type="number"]:near(:text("Cena Bazowa"))', '100');
    await page.fill('input[type="number"]:near(:text("Marża"))', '25');

    // Submit
    const postPromise = page.waitForResponse(r => r.url().includes('/admin/pricing-rules') && r.request().method() === 'POST');
    await page.click('button:has-text("Zapisz Regułę")');
    await postPromise;

    // Verify it's in the list
    await expect(page.locator('table')).toContainText('TEST_CARRIER', { timeout: 10000 });
  });

  test('should update CMS content', async ({ page, baseURL }) => {
    const resolvedBaseURL = baseURL || 'http://127.0.0.1:3101';
    await page.goto(`${resolvedBaseURL}/admin/cms`);
    
    // Select "O nas" section from sidebar
    await page.click('button:has-text("O nas")');

    // Fill a field in the CMS form
    const heroTitleInput = page.locator('input[placeholder*="Tytuł Hero"]').first();
    if (await heroTitleInput.isVisible()) {
        await heroTitleInput.fill('TEST_CMS_TITLE');
        
        // Save
        const savePromise = page.waitForResponse(r => r.url().includes('/cms/pages/') && r.request().method() === 'PUT');
        await page.click('button:has-text("Opublikuj zmiany"), button:has-text("Zapisz zmiany")');
        await savePromise;
        
        // Verify success message
        await expect(page.locator('text=Zmiany opublikowane!')).toBeVisible();
    }
  });

  test('should navigate through all admin sections', async ({ page, baseURL }) => {
    const resolvedBaseURL = baseURL || 'http://127.0.0.1:3101';
    await page.goto(`${resolvedBaseURL}/admin`);

    const sections = [
      { name: 'Zamówienia', url: '/admin/zamowienia' },
      { name: 'Klienci B2B', url: '/admin/uzytkownicy' },
      { name: 'Zarządzanie treścią', url: '/admin/cms' },
      { name: 'Wygląd', url: '/admin/wyglad' },
      { name: 'Cennik', url: '/admin/cennik' },
    ];

    for (const section of sections) {
      await page.click(`aside a:has-text("${section.name}")`);
      await expect(page).toHaveURL(new RegExp(section.url));
    }
  });
});
