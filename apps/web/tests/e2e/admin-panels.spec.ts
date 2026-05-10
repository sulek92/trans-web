import { test, expect } from '@playwright/test';
import { SignJWT } from 'jose';

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET || 'local-secret');

async function createAdminToken() {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({
    sub: 'admin-1',
    email: 'admin@paletbroker.pl',
    role: 'admin',
    type: 'access',
    jti: `admin-audit-${now}`,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + 60 * 60)
    .sign(jwtSecret);
}

// Run tests serially to ensure audit log actions can be verified reliably
test.describe.configure({ mode: 'serial' });

test.describe('Admin Panels Comprehensive Audit', () => {
  let adminToken: string;

  test.beforeAll(async () => {
    adminToken = await createAdminToken();
  });

  test.beforeEach(async ({ context, baseURL }) => {
    const host = new URL(baseURL || 'http://localhost:3000').hostname;
    await context.addCookies([
      { name: 'pb_auth_token', value: adminToken, domain: host, path: '/' },
      { name: 'pb_user_role', value: 'admin', domain: host, path: '/' },
    ]);
  });

  test('Leads: List, Update Status, and Export CSV', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/admin/leady`);
    
    // Verify title and basic layout
    await expect(page.locator('h1')).toContainText('Zapytania i Leady');

    // Test Export CSV
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Eksport CSV")');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('leady.csv');

    // Test Status Update (take lead)
    const takeLeadBtn = page.locator('button:has-text("Przejmij lead")').first();
    if (await takeLeadBtn.isVisible()) {
      await takeLeadBtn.click();
      await expect(page.locator('text=Status zaktualizowany')).toBeVisible();
    }
  });

  test('Orders: List and Export CSV', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/admin/zamowienia`);
    await expect(page.locator('h1')).toBeVisible();
    
    // Test Export CSV
    const exportPromise = page.waitForResponse(r => r.url().includes('/orders/export') && r.request().method() === 'GET');
    await page.click('button:has-text("Eksport CSV")');
    const response = await exportPromise;
    expect(response.headers()['content-type']).toContain('text/csv');
  });

  test('Newsletter: Manage Subscribers', async ({ page, baseURL }) => {
    const email = `test-audit-${Date.now()}@example.com`;
    await page.goto(`${baseURL}/admin/newsletter`);
    
    // Add subscriber
    await page.fill('input[placeholder*="Podaj adres e-mail"]', email);
    await page.click('button:has-text("Dodaj")');
    
    // Verify in list using expect().toPass() to handle any potential delay/caching
    await expect(async () => {
      await expect(page.locator('table')).toContainText(email);
    }).toPass({ timeout: 10000 });
    
    // Delete subscriber
    page.on('dialog', dialog => dialog.accept());
    const row = page.locator(`tr:has-text("${email}")`);
    await row.locator('button:has-text("delete")').click();
    
    // Verify gone
    await expect(async () => {
      await expect(page.locator('table')).not.toContainText(email);
    }).toPass();
  });

  test('Users: List and Block/Unblock', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/admin/uzytkownicy`);
    
    // Pick a user row (nth(1) skips header)
    const userRow = page.locator('tr').nth(1);
    if (await userRow.isVisible()) {
       const blockBtn = userRow.locator('button:has-text("Zablokuj")');
       const unblockBtn = userRow.locator('button:has-text("Aktywuj")');
       
       if (await blockBtn.isVisible()) {
         await blockBtn.click();
         await expect(page.locator('text=Status zmieniony')).toBeVisible();
       } else if (await unblockBtn.isVisible()) {
         await unblockBtn.click();
         await expect(page.locator('text=Status zmieniony')).toBeVisible();
       }
    }
  });

  test('Audit Logs: Visibility and Freshness', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/admin/logi-systemowe`);
    
    // Verify logs are visible
    await expect(page.locator('h1')).toContainText('Logi');
    
    // Verify recent actions from previous tests are logged
    // Use toPass to account for any slight delay in DB persistence or cache
    await expect(async () => {
      await expect(page.locator('table')).toContainText('admin@paletbroker.pl');
      // Look for a specific action like newsletter subscription or user update
      await expect(page.locator('table')).toContainText(/user|newsletter/i);
    }).toPass({ timeout: 15000 });
  });
});
