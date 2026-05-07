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
git clone <repo-url> && cd strona-transport-wizytowka
npm ci

# 2. Skonfiguruj środowisko
cp .env.example .env
# Edytuj .env — ustaw SUPERADMIN_PASSWORD, ADMIN_PASSWORD, JWT_SECRET

# 3. Uruchom z Docker
docker compose up -d

# 4. Zseeduj bazę
cd apps/api && npx ts-node src/db/seed.ts

# 5. Otwórz http://localhost:3000
```

## Testy

```bash
# Backend unit tests
cd apps/api && npm test           # 5 testów

# Backend e2e tests (wymaga PostgreSQL + Redis)
cd apps/api && npm run test:e2e   # 21 testów

# Frontend Playwright E2E
cd apps/web && npm run test:e2e:docker  # 26 testów
```

## Wdrożenie produkcyjne

Szczegółowe instrukcje: [docs/PRODUCTION.md](docs/PRODUCTION.md)

Status projektu i znane problemy: [TASK.md](TASK.md)

Wymagane zmienne środowiskowe: [.env.example](.env.example)

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
