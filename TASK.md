# TASK.md — Status projektu

**Data:** 07.05.2026
**Projekt:** PaletBroker — Platforma logistyki paletowej B2B
**Gałąź:** `stable/main-base-2026-05-06`

---

## Podsumowanie wykonanych prac

| Faza | Status | Opis |
|------|--------|------|
| 1. Bezpieczeństwo | ✔️ Done | Usunięcie zahardkodowanych haseł, poprawa middleware, JWT secret |
| 2. Jakość kodu | ✔️ Done | Error boundaries, usunięcie console.log, DOMPurify, porządki |
| 3. Testy backend | ✔️ Done | 5/5 unit tests, 21/21 e2e tests pass |
| 4. Testy frontend | ⚠️ Partial | 11/26 pass — selektory Playwright wymagają aktualizacji do obecnego UI |
| 5. CI/CD | ✔️ Done | Dodano PostgreSQL + Redis do GitHub Actions CI |
| 6. Dokumentacja | ✔️ Done | PRODUCTION.md, ENV-VARIABLES.md, TASK.md |
| 7. Finalizacja | ✔️ Done | Lint (0 errors), TypeScript build passes |

---

## Znane problemy (production readiness)

### Krytyczne — naprawione
- [x] Zahardkodowane hasło superadmina `admin1` → przeniesione do `SUPERADMIN_PASSWORD` env
- [x] Domyślne hasła-fallback (`admin123`/`user123`) → wymagane env vars w produkcji
- [x] Fallback JWT_SECRET `local-secret` → rzuca błąd w produkcji
- [x] Rola `pb_user_role` w ciasteczku do odczytu → middleware dekoduje JWT
- [x] `verifyEmail` stub → oznaczony `@deprecated`

### Średnie — udokumentowane
- [ ] 324 ostrzeżenia ESLint (głównie `any` types) — dług technologiczny, nie blokuje produkcji
- [ ] `pb_auth_token` ciasteczko nie jest HttpOnly (ustawiane przez `document.cookie` w JS)
- [ ] `pb_auth_token` wysyłany jako Bearer token w nagłówkach API (w porządku dla SPA)

### Niskie — do poprawy w przyszłości
- [ ] Brak integracji newslettera z Mailchimp/MailerLite
- [ ] Brak integracji email (Resend)
- [ ] `dangerouslySetInnerHTML` w CMS article preview (dodano DOMPurify jako warstwę ochronną)
- [ ] Testy Playwright (11/26) wymagają aktualizacji selektorów

---

## Tech stack

| Warstwa | Technologia |
|---------|-------------|
| Frontend | Next.js 16.2.4, React 18, Tailwind CSS v4, Zustand, Framer Motion |
| Backend | NestJS 11, Drizzle ORM, PostgreSQL, Redis |
| Auth | JWT (access + refresh), Passport (Google, Azure AD) |
| Payments | Stripe |
| Monitoring | Sentry |
| CI/CD | GitHub Actions + Docker Compose |
| Infra | Docker (5 services: web, api, postgres, redis, tunnel) |

---

## Uruchomienie lokalne

```bash
# 1. Skopiuj .env.example do .env i uzupełnij zmienne
cp .env.example .env

# 2. Wymagane zmienne:
#    SUPERADMIN_PASSWORD=<hasło>
#    ADMIN_PASSWORD=<hasło>
#    JWT_SECRET=<losowy-sekret>
#    DATABASE_URL=postgresql://user:pass@localhost:5432/palety_db

# 3. Uruchom Docker
docker compose up -d

# 4. Zseeduj bazę
cd apps/api && npx ts-node src/db/seed.ts

# 5. Aplikacja dostępna na http://localhost:3000
```

## Uruchomienie testów

```bash
# Backend unit tests
cd apps/api && npm test

# Backend e2e tests (wymaga PostgreSQL i Redis)
cd apps/api && npm run test:e2e

# Frontend Playwright (wymaga działającej aplikacji)
cd apps/web && PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npx playwright test
```

---

## Struktura projektu

```
├── apps/
│   ├── api/          # NestJS backend (port 4000)
│   │   └── src/modules/  # 27 modułów
│   └── web/          # Next.js frontend (port 3000)
│       └── src/app/  # App Router (14+ stron)
├── packages/
│   └── shared/       # Typy współdzielone
├── docs/             # Dokumentacja i audyty
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Endpointy API (główne)

| Moduł | Ścieżka |
|--------|---------|
| Auth | POST /auth/login, /auth/register, /auth/refresh, /auth/logout |
| Auth | POST /auth/password-reset/request, /auth/password-reset/confirm |
| Quotes | POST /quotes |
| Orders | GET/POST /orders |
| CMS | GET/PUT /cms/pages/:slug |
| Leads | POST /leads |
| Tracking | GET /tracking/:orderNumber |
| Health | GET /health |
| WebSocket | /notifications (Socket.io) |
