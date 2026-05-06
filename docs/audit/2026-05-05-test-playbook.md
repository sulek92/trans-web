# Playbook Testow (Admin-First)

## 1. Srodowiska
- `local`: deweloperskie z `docker-compose` (Postgres + Redis).
- `test`: izolowana baza + mocki integracji zewnetrznych.
- `staging`: produkcyjnie zblizone dane i konfiguracja.
- Wymagane zmienne auth session store:
  - `REDIS_URL`
  - `AUTH_REDIS_PREFIX`
- Kontrola fallbacku auth:
  - `LEGACY_AUTH_FALLBACK_ENABLED` (`false` = DB-only auth)

## 2. Komendy bazowe
- Docker live (localhost:3000):
  - `docker compose up -d --build api web`
  - `docker compose logs -f web`
  - `docker compose logs -f api`
- API unit: `npm test --workspace apps/api -- --runInBand`
- API e2e: `npm run test:e2e --workspace apps/api -- --runInBand`
- Web lint: `npm run lint --workspace apps/web`
- Web build: `npm run build --workspace apps/web`
- Web e2e (Playwright): `npx playwright test` (uruchamiane z `apps/web`)
- Web e2e (script): `npm run test:e2e --workspace apps/web`
- Web e2e na Docker `localhost:3000`: `npm run test:e2e:docker --workspace apps/web`
- Web visual smoke (rozszerzony): `npx playwright test tests/e2e/visual-routes.spec.ts`
- Web visual smoke na Docker `localhost:3000`: `npm run test:e2e:visual:docker --workspace apps/web`
- Web admin navigation smoke: `npx playwright test tests/e2e/admin-navigation.spec.ts`
- Web admin CMS media smoke: `npx playwright test tests/e2e/admin-navigation.spec.ts -g "admin can upload homepage media and publish cms changes"`

## 3. Unit Tests
- Serwisy:
  - logika wyceny (limity, sortowanie, doplaty).
  - mapowanie statusow tracking.
- Walidatory:
  - DTO quote/order i zod frontendu.
- Store/helpers:
  - store checkout, utilsy dat/cen.

## 4. Integration Tests
- API endpointy:
  - `POST /quotes`: happy path, non-standard path, validation errors.
  - `POST /orders` + `GET /orders/:id`.
  - `POST /auth/*`, `GET /auth/verify`.
  - `POST/GET /custom-quotes`.
  - `GET /tracking/:trackingNumber`.
- Middleware chain:
  - walidacja globalna.
  - CORS i bledy.

## 5. E2E - Panel Admina (priorytet)

### Autentykacja i autoryzacja
- logowanie poprawne/niepoprawne.
- wygasniecie sesji.
- dostep bez roli admin -> `403`/redirect.
- refresh token (`POST /auth/refresh`) + rotacja tokenow.
- logout (`POST /auth/logout`) + revocation (stary access token odrzucony).
- lockout po serii blednych logowan (`429`).
- reset hasla (`/auth/password-reset/request`, `/auth/password-reset/confirm`).
- blokada po N probach.
- anti-enumeration dla resetu hasla (brak ujawniania, czy email istnieje).
- RBAC: `customer` nie ma dostepu do `/admin/*`, `/users`, `/orders` (lista globalna).
- automatyzacja e2e:
  - `tests/e2e/auth-reset.spec.ts` (request + confirm + login z nowym haslem).

### CRUD i zarzadzanie encjami
- zamowienia: lista, filtrowanie, sortowanie, paginacja, edycja statusu.
- leady: lista, status, przypisanie handlowca, notatki.
- uzytkownicy: utworzenie, rola, dezaktywacja, reaktywacja (`PUT /users/:id/status`).
- cms: publikacja i podglad.
- cms (home media): walidacja pol `heroVisualImage`, `supportVisualImage`, `ctaVisualImage`, `testimonials[].avatarImage` i fallbacku grafik.
- cms (home media upload): upload pliku, przypiecie do pola Hero, publikacja i cleanup (DELETE `/cms/media`).
- audit log: `GET /admin/audit-log` (ostatnie operacje administracyjne).
- automatyzacja e2e:
  - `tests/e2e/lead-funnel.spec.ts` (formularz `/kontakt` -> widocznosc leada w `/admin/leady`).

### Layout i nawigacja
- menu admin (wszystkie linki).
- breadcrumbs.
- responsive: 375, 768, 1280, 1920.
- brak poziomego scrolla i broken icon/font.
- integralnosc assetow login (`/payment/*.svg`) + screenshoty baseline na wielu viewportach.
- integralnosc assetow homepage (`/images/home-*.jpg`, `/images/avatars/*.jpg`) + widocznosc na `/`.
- kazdy link menu admin prowadzi do poprawnego URL i widoku (assert heading + route).

### Edge cases
- timeout API i brak polaczenia.
- edycja usunietego rekordu.
- race condition (dwoch adminow).
- puste stany.
- nieuprawniony `customer` na endpointach admin/users/orders (`403`).
- reset hasla: invalid token (`400`) i unknown email bez ujawniania istnienia konta.

## 6. Testy wydajnosci
- k6:
  - load: 100, 300, 500 VU.
  - stress: ramp-up do progu bledu > 2%.
  - soak: 60-120 min.
- endpointy krytyczne:
  - `POST /quotes`
  - `POST /orders`
  - `GET /tracking/:trackingNumber`

## 7. Testy bezpieczenstwa
- OWASP Top 10 checklist.
- SQLi/XSS/CSRF/IDOR.
- brute force na auth.
- security headers scan.
- ekspozycja danych wrazliwych w logach i payloadach.
- CSRF regression:
  - `POST` z cookie sesyjnym + obcy `Origin` => `403`.
  - `POST` z cookie sesyjnym + trusted `Origin` => `2xx/4xx` zgodnie z logika endpointu (nie `403` od guardu).

## 8. Regresja i CI
- Po kazdym merge:
  - API unit + e2e
  - Web lint + build
  - E2E smoke admin
- Nightly:
  - rozszerzony e2e + performance smoke
- Visual regression:
  - baseline screenshoty panelu admin.
