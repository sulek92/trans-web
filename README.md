# PaletBroker — Platforma logistyki paletowej B2B

Profesjonalna platforma do wyceny, zamawiania i śledzenia transportu paletowego. Porównuje oferty DHL, DPD, FedEx i innych przewoźników w czasie rzeczywistym.

## Tech stack

| Warstwa | Technologia |
|---------|-------------|
| Frontend | Next.js 16, React 18, Tailwind CSS v4, Zustand, Framer Motion |
| Backend | NestJS 11, Drizzle ORM, PostgreSQL, Redis |
| Auth | JWT (access + refresh), Passport (Google, Azure AD) |
| Płatności | Stripe |
| Monitoring | Sentry |
| CI/CD | GitHub Actions + Docker Compose |

## Szybki start (lokalnie)

```bash
# 1. Sklonuj i zainstaluj
git clone <repo-url> && cd Strona-transport-wizytowka
npm ci

# 2. Skonfiguruj środowisko
cp .env.example .env
# Edytuj .env — ustaw SUPERADMIN_PASSWORD, ADMIN_PASSWORD, JWT_SECRET

# 3. Uruchom infrastrukturę (PostgreSQL, Redis)
docker compose up -d postgres redis

# 4. Zainicjalizuj bazę danych
npm run db:push
npm run db:seed

# 5. Uruchom aplikację
npm run dev

# 6. Otwórz http://localhost:3000
```

## Testy

### Backend unit tests
```bash
cd apps/api && npm test           # 5 testów
```

### Backend e2e tests (wymaga PostgreSQL + Redis)
```bash
cd apps/api && npm run test:e2e   # 21 testów
```

### Frontend Playwright E2E
```bash
cd apps/web && npm run test:e2e    # 26 tests (including admin panels)
```

## E2E Test Suite (Playwright)

The full admin‑panel regression suite is located at `apps/web/tests/e2e/admin-panels.spec.ts`. It covers Leads, Orders, Newsletter, and Users panels and uses JWT authentication.

Run locally:
```bash
cd apps/web
npm run test:e2e
```

## CI Pipeline
A GitHub Actions workflow runs the full Playwright suite against the production Docker stack.

- Workflow file: `.github/workflows/ci-e2e.yml`
- Triggers on pushes and pull‑requests to `main`.
- Builds Docker images, starts services, waits for health checks, then executes `npm run test:e2e`.

## Port Verification
The production Docker compose maps:
- Web server → **port 3000**
- API server → **port 4000**

You can verify the mapping with:
```bash
docker ps
```
Ensure you see `0.0.0.0:3000->3000/tcp` and `0.0.0.0:4000->4000/tcp` among the containers.

## Wdrożenie produkcyjne

Szczegółowe instrukcje: [docs/PRODUCTION.md](docs/PRODUCTION.md)

## Status projektu i znane problemy
[TODO] Update with current status.

## Bezpieczeństwo i Autentykacja (v1.2.0+)

W wersji 1.2.0 wprowadzono utwardzone mechanizmy sesji i modernizację UI:
- **HttpOnly Cookies**: Tokeny `pb_auth_token` i `pb_refresh_token` są teraz przechowywane w bezpiecznych ciasteczkach, niedostępnych dla JavaScript, co drastycznie zwiększa odporność na ataki XSS.
- **Metadata Cookies**: Stan interfejsu (rola, imię) jest synchronizowany przez ciasteczko `pb_user_meta` (dostępne dla JS), co pozwala na płynną nawigację przy zachowaniu pełnego bezpieczeństwa.
- **Standard apiFetch**: Frontend korzysta z centralnego wrappera `apiFetch`, który zapewnia spójne przesyłanie poświadczeń (`credentials: include`) i upraszcza komunikację z API.
- **Premium Dark Mode**: Cały system przeszedł audyt wizualny pod kątem dostępności i estetyki w trybie ciemnym (Dark Mode), z użyciem semantycznych zmiennych projektowych.

## Struktura projektu

```
├── apps/
│   ├── api/          # NestJS backend (port 4000)
│   │   └── src/modules/  # 27 modułów biznesowych
│   └── web/          # Next.js frontend (port 3000)
│       ├── src/app/  # App Router (14+ stron)
│       └── tests/e2e/ # Testy Playwright
├── packages/shared/  # Współdzielone typy TypeScript
├── docs/             # Dokumentacja i audyty
└── docker-compose.yml
```

## Licencja

Proprietary — All rights reserved.
