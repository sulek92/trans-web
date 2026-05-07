import { test, expect } from '@playwright/test';
import { SignJWT } from 'jose';

const jwtSecret = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'local-secret',
);

async function createAdminToken() {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({
    sub: '00000000-0000-0000-0000-000000000001',
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

test.describe('Admin User Management', () => {
  test.beforeEach(async ({ context, baseURL }) => {
    const resolvedBaseURL = baseURL || 'http://localhost:3101';
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

  test('should toggle user status', async ({ page, baseURL }) => {
    const resolvedBaseURL = baseURL || 'http://localhost:3101';
    await page.goto(`${resolvedBaseURL}/admin/uzytkownicy`);
    
    await expect(page.locator('h1')).toContainText('Baza Klientów B2B');

    // Wait for data to load
    const firstRow = page.locator('[data-testid="user-row"]').first();
    await expect(firstRow).toBeVisible({ timeout: 15000 });

    const statusBadge = firstRow.locator('[data-testid="user-status"]');
    const initialStatus = await statusBadge.innerText();
    
    // Find toggle button
    const toggleBtn = firstRow.locator('[data-testid="status-toggle-btn"]');
    
    // Click button
    const putPromise = page.waitForResponse(r => r.url().includes('/status') && r.request().method() === 'PUT');
    await toggleBtn.click();
    await putPromise;

    // Verify status changed in UI
    const expectedStatus = initialStatus.trim().toUpperCase() === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    await expect(statusBadge).toContainText(expectedStatus, { ignoreCase: true });
  });

  test('should support bulk selection and status updates', async ({ page, baseURL }) => {
    const resolvedBaseURL = baseURL || 'http://localhost:3101';
    await page.goto(`${resolvedBaseURL}/admin/uzytkownicy`);

    // Wait for data
    const rows = page.locator('[data-testid="user-row"]');
    await expect(rows.first()).toBeVisible({ timeout: 15000 });

    // Select first two users
    const checkboxes = page.locator('[data-testid="user-checkbox"]');
    await checkboxes.nth(0).check();
    await checkboxes.nth(1).check();

    // Bulk toolbar should appear
    await expect(page.locator('text=Wybrano użytkowników')).toBeVisible();

    // Perform bulk activation
    const bulkPromise = page.waitForResponse(r => r.url().includes('/bulk-status') && r.request().method() === 'POST');
    await page.click('button:has-text("Aktywuj zaznaczonych")');
    await bulkPromise;

    // Toolbar should disappear
    await expect(page.locator('text=Wybrano użytkowników')).not.toBeVisible();
  });

  test('should search and filter users', async ({ page, baseURL }) => {
    const resolvedBaseURL = baseURL || 'http://localhost:3101';
    await page.goto(`${resolvedBaseURL}/admin/uzytkownicy`);

    const searchInput = page.locator('input[placeholder*="Szukaj po email"]');
    await searchInput.fill('nonexistent@user.com');

    // Table should be empty or show "no results"
    await expect(page.locator('table tbody tr')).toHaveCount(0);
  });
  
  test('should not show superadmin users', async ({ page, baseURL }) => {
    const resolvedBaseURL = baseURL || 'http://localhost:3101';
    await page.goto(`${resolvedBaseURL}/admin/uzytkownicy`);
    
    // Wait for data
    await expect(page.locator('[data-testid="user-row"]').first()).toBeVisible({ timeout: 15000 });
    
    // Verify sulek92@gmail.com (superadmin) is not in the list
    const superadminRow = page.locator('[data-user-email="sulek92@gmail.com"]');
    await expect(superadminRow).not.toBeVisible();
  });
});
