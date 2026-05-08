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
