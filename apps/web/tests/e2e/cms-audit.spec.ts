import { test, expect } from '@playwright/test';
import { SignJWT } from 'jose';

const jwtSecret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'local-secret',
);

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

test.describe('Exhaustive CMS & Data Flow Audit', () => {
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

  test('Audit: Home Page CMS Update', async ({ page, baseURL }) => {
    const testTitle = `Nowoczesna Logistyka ${Date.now()}`;
    
    // 1. Update in Admin
    await page.goto(`${baseURL}/admin/cms?section=home`);
    const heroTitleInput = page.locator('input[placeholder*="Tytuł Hero"]').first();
    await heroTitleInput.fill(testTitle);
    
    const savePromise = page.waitForResponse(r => r.url().includes('/cms/pages/home') && r.request().method() === 'PUT');
    await page.click('button:has-text("Opublikuj zmiany")');
    await savePromise;
    await expect(page.locator('text=Zmiany opublikowane')).toBeVisible();

    // 2. Verify on Public Page
    await page.goto(`${baseURL}/`);
    await expect(page.locator('h1')).toContainText(testTitle);
  });

  test('Audit: Blog Article Management', async ({ page, baseURL }) => {
    const articleTitle = `Test Audit Artykuł ${Date.now()}`;
    
    // 1. Create Article
    await page.goto(`${baseURL}/admin/cms/articles/new`);
    await page.fill('input[placeholder*="Tytuł artykułu"]', articleTitle);
    await page.fill('textarea[placeholder*="Krótki opis"]', 'Opis testowy dla audytu CMS.');
    
    // Set content in Quill/RichText if possible, or just submit
    const createPromise = page.waitForResponse(r => r.url().includes('/cms/articles') && r.request().method() === 'POST');
    await page.click('button:has-text("Utwórz artykuł")');
    await createPromise;

    // 2. Verify in Blog Index
    await page.goto(`${baseURL}/blog`);
    await expect(page.locator('main')).toContainText(articleTitle);
  });

  test('Audit: Pricing Rule & Calculator Sync', async ({ page, baseURL }) => {
    const carrierCode = `AUDIT_${Date.now()}`;
    
    // 1. Add Pricing Rule
    await page.goto(`${baseURL}/admin/cennik`);
    await page.click('button:has-text("Dodaj Regułę")');
    await page.fill('input:near(:text("Kod Przewoźnika"))', carrierCode);
    await page.fill('input:near(:text("Nazwa Usługi"))', 'Usługa Audytowa');
    await page.fill('input[type="number"]:near(:text("Cena Bazowa"))', '999');
    await page.fill('input[type="number"]:near(:text("Marża"))', '0');
    
    const savePromise = page.waitForResponse(r => r.url().includes('/admin/pricing-rules') && r.request().method() === 'POST');
    await page.click('button:has-text("Zatwierdź Regułę")');
    await savePromise;

    // 2. Verify in Calculator
    await page.goto(`${baseURL}/`);
    await page.locator('input[name="senderPostalCode"]').fill('00-001');
    await page.locator('input[name="recipientPostalCode"]').fill('30-001');
    await page.locator('input[name="palletCount"]').fill('1');
    await page.locator('input[name="weight"]').fill('100');
    await page.click('button:has-text("Porównaj Oferty")');
    
    await expect(page).toHaveURL(/\/wycena\?/);
    // The results might take a second to load from API
    await expect(page.locator('main')).toContainText(carrierCode, { timeout: 15000 });
    await expect(page.locator('main')).toContainText('999');
  });

  test('Audit: Contact Form & Lead Generation', async ({ page, baseURL }) => {
    const testName = `Audit User ${Date.now()}`;
    const testEmail = `audit-${Date.now()}@example.com`;
    
    // 1. Submit Contact Form
    await page.goto(`${baseURL}/kontakt`);
    await page.fill('input[name="name"]', testName);
    await page.fill('input[name="email"]', testEmail);
    await page.fill('textarea[name="message"]', 'Wiadomość testowa audytu CMS.');
    
    const submitPromise = page.waitForResponse(r => r.url().includes('/leads') && r.request().method() === 'POST');
    await page.click('button:has-text("Wyślij wiadomość")');
    await submitPromise;
    await expect(page.locator('text=Wiadomość wysłana')).toBeVisible();

    // 2. Verify in Admin Leads
    await page.goto(`${baseURL}/admin/leady`);
    await expect(page.locator('table')).toContainText(testName);
    await expect(page.locator('table')).toContainText(testEmail);
  });

  test('Audit: Newsletter Subscription', async ({ page, baseURL }) => {
    const testEmail = `news-${Date.now()}@example.com`;
    
    // 1. Subscribe on Home Page
    await page.goto(`${baseURL}/`);
    const newsInput = page.locator('input[placeholder*="Twój adres e-mail"]');
    await newsInput.scrollIntoViewIfNeeded();
    await newsInput.fill(testEmail);
    
    const subPromise = page.waitForResponse(r => r.url().includes('/newsletter/subscribe') && r.request().method() === 'POST');
    await page.click('button:has-text("Zapisz się")');
    await subPromise;
    await expect(page.locator('text=Dziękujemy za zapis')).toBeVisible();

    // 2. Verify in Admin Dashboard
    await page.goto(`${baseURL}/admin/dashboard`); // Or where newsletter stats are shown
  });
});
