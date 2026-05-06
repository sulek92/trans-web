import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/app.setup';

type LoginResponseBody = {
  accessToken: string;
  refreshToken: string;
  user?: { role?: string };
};

type PasswordResetRequestBody = {
  status?: string;
  resetToken?: string;
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/quotes (POST) rejects invalid quote payloads', () => {
    return request(app.getHttpServer())
      .post('/quotes')
      .send({
        palletType: 'euro',
        dimensions: { length: 120, width: 80, height: 999 },
        weight: -1,
        sender: { postalCode: 'not-a-postal-code', country: 'PL' },
        recipient: { postalCode: '30-001', country: 'PL' },
      })
      .expect(400);
  });

  it('/auth/login (POST) returns jwt for valid admin credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: process.env.ADMIN_EMAIL || 'admin@paletbroker.pl',
        password: process.env.ADMIN_PASSWORD || 'admin123',
      })
      .expect(201);

    const body = response.body as LoginResponseBody;
    expect(body.accessToken).toBeDefined();
    expect(body.refreshToken).toBeDefined();
    expect(body.user?.role).toBe('admin');
  });

  it('/auth/refresh (POST) returns fresh access token', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: process.env.ADMIN_EMAIL || 'admin@paletbroker.pl',
        password: process.env.ADMIN_PASSWORD || 'admin123',
      })
      .expect(201);

    const loginBody = loginResponse.body as LoginResponseBody;
    const refreshResponse = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: loginBody.refreshToken })
      .expect(201);

    const refreshBody = refreshResponse.body as LoginResponseBody;
    expect(refreshBody.accessToken).toBeDefined();
    expect(refreshBody.refreshToken).toBeDefined();
  });

  it('/auth/logout (POST) revokes access token', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: process.env.ADMIN_EMAIL || 'admin@paletbroker.pl',
        password: process.env.ADMIN_PASSWORD || 'admin123',
      })
      .expect(201);

    const loginBody = loginResponse.body as LoginResponseBody;
    await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${loginBody.accessToken}`)
      .expect(201);

    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${loginBody.accessToken}`)
      .expect(401);
  });

  it('/auth/login (POST) locks account key after too many failed attempts', async () => {
    const email = 'blocked-user@paletbroker.pl';
    const password = 'wrong123';

    let isLocked = false;
    for (let i = 0; i < 5; i += 1) {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email, password });
      if (response.status === 429) {
        isLocked = true;
        break;
      }
      expect(response.status).toBe(401);
    }

    const finalResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password });

    expect(isLocked || finalResponse.status === 429).toBeTruthy();
    if (!isLocked) {
      expect(finalResponse.status).toBe(429);
    }
  });

  it('/auth/password-reset/* (POST) resets password and allows login with new password', async () => {
    const email = process.env.ADMIN_EMAIL || 'admin@paletbroker.pl';
    const currentPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const newPassword = 'Admin123!Reset';

    const requestReset = await request(app.getHttpServer())
      .post('/auth/password-reset/request')
      .send({ email })
      .expect(201);
    const resetBody = requestReset.body as PasswordResetRequestBody;

    expect(resetBody.status).toBe('success');
    expect(resetBody.resetToken).toBeDefined();

    await request(app.getHttpServer())
      .post('/auth/password-reset/confirm')
      .send({
        token: resetBody.resetToken,
        newPassword,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password: newPassword,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password: currentPassword,
      })
      .expect(401);
  });

  it('/auth/password-reset/request (POST) does not leak user existence', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/password-reset/request')
      .send({ email: 'unknown-user@paletbroker.pl' })
      .expect(201);

    const body = response.body as PasswordResetRequestBody;
    expect(body.status).toBe('success');
    expect(body.resetToken).toBeUndefined();
  });

  it('/auth/password-reset/request (POST) blocks cross-origin state-changing request when session cookie is present', async () => {
    await request(app.getHttpServer())
      .post('/auth/password-reset/request')
      .set('Cookie', 'pb_auth_token=fake-session-token')
      .set('Origin', 'https://evil.example')
      .send({ email: process.env.ADMIN_EMAIL || 'admin@paletbroker.pl' })
      .expect(403);
  });

  it('/auth/password-reset/request (POST) allows trusted origin when session cookie is present', async () => {
    await request(app.getHttpServer())
      .post('/auth/password-reset/request')
      .set('Cookie', 'pb_auth_token=fake-session-token')
      .set('Origin', 'http://localhost:3000')
      .send({ email: process.env.ADMIN_EMAIL || 'admin@paletbroker.pl' })
      .expect(201);
  });

  it('/auth/password-reset/confirm (POST) rejects invalid token', async () => {
    await request(app.getHttpServer())
      .post('/auth/password-reset/confirm')
      .send({
        token: 'invalid-token-value',
        newPassword: 'StrongPass123!',
      })
      .expect(400);
  });

  it('/custom-quotes (GET) blocks anonymous user', () => {
    return request(app.getHttpServer()).get('/custom-quotes').expect(401);
  });

  it('/custom-quotes (GET) blocks non-admin role', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: process.env.DEMO_USER_EMAIL || 'user@paletbroker.pl',
        password: process.env.DEMO_USER_PASSWORD || 'user123',
      })
      .expect(201);

    const loginBody = loginResponse.body as LoginResponseBody;
    await request(app.getHttpServer())
      .get('/custom-quotes')
      .set('Authorization', `Bearer ${loginBody.accessToken}`)
      .expect(403);
  });

  it('/custom-quotes (GET) allows admin role', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: process.env.ADMIN_EMAIL || 'admin@paletbroker.pl',
        password: process.env.ADMIN_PASSWORD || 'admin123',
      })
      .expect(201);

    const loginBody = loginResponse.body as LoginResponseBody;
    await request(app.getHttpServer())
      .get('/custom-quotes')
      .set('Authorization', `Bearer ${loginBody.accessToken}`)
      .expect(200);
  });

  it('/admin/stats (GET) blocks non-admin role', async () => {
    const customerLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: process.env.DEMO_USER_EMAIL || 'user@paletbroker.pl',
        password: process.env.DEMO_USER_PASSWORD || 'user123',
      })
      .expect(201);

    const customerLoginBody = customerLoginResponse.body as LoginResponseBody;
    await request(app.getHttpServer())
      .get('/admin/stats')
      .set('Authorization', `Bearer ${customerLoginBody.accessToken}`)
      .expect(403);
  });

  it('/users (GET) blocks non-admin role', async () => {
    const customerLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: process.env.DEMO_USER_EMAIL || 'user@paletbroker.pl',
        password: process.env.DEMO_USER_PASSWORD || 'user123',
      })
      .expect(201);

    const customerLoginBody = customerLoginResponse.body as LoginResponseBody;
    await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${customerLoginBody.accessToken}`)
      .expect(403);
  });

  it('/orders (GET) blocks non-admin role', async () => {
    const customerLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: process.env.DEMO_USER_EMAIL || 'user@paletbroker.pl',
        password: process.env.DEMO_USER_PASSWORD || 'user123',
      })
      .expect(201);

    const customerLoginBody = customerLoginResponse.body as LoginResponseBody;
    await request(app.getHttpServer())
      .get('/orders')
      .set('Authorization', `Bearer ${customerLoginBody.accessToken}`)
      .expect(403);
  });

  it('/admin/pricing-rules (GET) blocks anonymous and non-admin role', async () => {
    await request(app.getHttpServer()).get('/admin/pricing-rules').expect(401);

    const customerLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: process.env.DEMO_USER_EMAIL || 'user@paletbroker.pl',
        password: process.env.DEMO_USER_PASSWORD || 'user123',
      })
      .expect(201);

    const customerLoginBody = customerLoginResponse.body as LoginResponseBody;
    await request(app.getHttpServer())
      .get('/admin/pricing-rules')
      .set('Authorization', `Bearer ${customerLoginBody.accessToken}`)
      .expect(403);
  });

  it('/admin/audit-log (GET) allows admin role', async () => {
    const adminLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: process.env.ADMIN_EMAIL || 'admin@paletbroker.pl',
        password: process.env.ADMIN_PASSWORD || 'admin123',
      })
      .expect(201);

    const adminLoginBody = adminLoginResponse.body as LoginResponseBody;
    await request(app.getHttpServer())
      .get('/admin/audit-log?limit=10')
      .set('Authorization', `Bearer ${adminLoginBody.accessToken}`)
      .expect(200);
  });

  it('/cms/pages/:slug (PUT) blocks anonymous update attempt', async () => {
    await request(app.getHttpServer())
      .put('/cms/pages/home')
      .send({
        title: 'Blocked update attempt',
        content: '{"heroTitle":"Blocked"}',
      })
      .expect(401);
  });

  it('/leads (POST) rejects invalid lead payload', async () => {
    await request(app.getHttpServer())
      .post('/leads')
      .send({
        name: '',
        email: 'invalid-email',
      })
      .expect(400);
  });

  afterEach(async () => {
    await app.close();
  });
});
