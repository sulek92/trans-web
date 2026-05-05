# Raport Audytu Aplikacji (2026-05-05)

## Zakres i podejscie
Audyt wykonano od panelu administratora, a nastepnie rozszerzono na backend/API, baze danych, frontend globalny, testowalnosc i wydajnosc.

## 1) Panel Admina (priorytet)

### Znalezione problemy
- `CRITICAL`: Brak rzeczywistej ochrony panelu `/admin` po stronie auth/RBAC. Widoki byly publicznie dostepne.
- `HIGH`: Panel admina dziedziczyl publiczny shell (`Navbar`, `Footer`, `CookieConsent`), co psulo UX operacyjny i zwiekszalo ryzyko bledow nawigacji.
- `MEDIUM`: Layout admina mial problemy responsywne (zbyt sztywny sidebar i naglowek dla 375/768 px).
- `MEDIUM`: Widoki admina byly glownie statyczne (mock data, brak podpiecia CRUD do API).

### Status po zmianach
- `CRITICAL/HIGH` zneutralizowane dla warstwy routingu web:
  - Panel admina zostal odseparowany od publicznego shella.
  - Responsywnosc admin layoutu poprawiona.
  - Dostep do `/admin` i `/konto` jest chroniony przez `proxy` (JWT + role check dla admin).
- Dodatkowo wykonano:
  - migracje auth na DB-first (hash `bcryptjs`, auto-upsert legacy users),
  - pelny flow resetu hasla (`request`/`confirm`) z TTL tokenem.
  - uszczelnienie RBAC w API dla tras administracyjnych (`/admin/*`, `GET /users`, `GET /orders*`).

## 2) Backend/API

### Znalezione problemy
- `CRITICAL`: Dekoratory DTO istnialy, ale globalny `ValidationPipe` nie byl podlaczony.
- `HIGH`: Brak jednolitej konfiguracji bootstrap/test (inne zachowanie aplikacji runtime vs e2e).
- `HIGH`: Auth jest mockowane (`mock-jwt-token`), brak realnego JWT/session lifecycle.
- `MEDIUM`: Czesci endpointow to atrapy MVP bez trwalego zapisu i bez transakcji.

### Status po zmianach
- `CRITICAL` naprawione:
  - Dodano globalna walidacje (`whitelist`, `forbidNonWhitelisted`, `transform`) i wspolna konfiguracje app dla runtime + e2e.
- `HIGH` naprawione (baseline):
  - Auth nie jest juz mockiem; `POST /auth/login` wydaje realny JWT, endpointy admin sa chronione guardami JWT + rolami.
  - Login opiera sie o rekordy `users` z hashem; legacy ENV pozostaje jako fallback kompatybilnosci.
- `MEDIUM` naprawione:
  - Regula niestandardowej wyceny uwzglednia teraz tez przekroczenia wymiarow.

## 3) Baza danych i model danych

### Ocena
- Schemat Drizzle jest szeroki i dobrze przygotowany pod docelowe funkcje (orders, tracking, cms, leads, invoices).
- Ryzyka:
  - Brak widocznych migracji runtime w repo (sam `schema.ts` + `seed.ts`).
  - Brak udokumentowanej strategii indeksow pod krytyczne filtry (statusy, daty, foreign keys, tracking).
  - Brak wyeksponowanego mechanizmu soft-delete dla glownych encji.

## 4) Frontend i UX

### Znalezione problemy
- `HIGH`: Build frontendu byl niestabilny (brakujace dependencies, konflikty typow, prerender errors).
- `HIGH`: Bledy hookow (`useState` w map, warunkowe `useId`, niepoprawny `useSearchParams` bez `Suspense`).
- `MEDIUM`: Niespojne typy danych w formularzach i store (`any` i niedopasowane kontrakty).

### Status po zmianach
- `HIGH` naprawione:
  - Lint bez errorow krytycznych (pozostale warningi nie blokuja CI).
  - Build Next.js przechodzi.
  - Prerendering krytycznych tras przechodzi.
- `MEDIUM` naprawione:
  - Usunieto krytyczne `any` i stabilizowano kontrakty typow.

## 5) Bezpieczenstwo (stan aktualny)

### Ryzyka otwarte
- `HIGH`: Brak CSRF strategii tam, gdzie beda cookie-based sesje.
- `MEDIUM`: Brak persystentnej sesji/revocation/reset-token store (obecnie in-memory; rekomendowane Redis).
- `MEDIUM`: Nadal istnieje fallback legacy ENV dla zgodnosci; docelowo nalezy wymusic DB-only auth.

## 6) Priorytety naprawcze (kolejnosc)
1. Przeniesc revocation/lockout/reset-token store do Redis (HA i restarty bez utraty stanu).
2. Dodac CSRF strategię dla flow cookie-based.
3. Zamknac fallback legacy i przejsc na DB-only auth po rollout planie.
4. Podlaczyc CRUD admina do DB i API (orders/leads/users/cms/settings) z audit logiem.
5. Dodac indeksy DB + benchmarki endpointow + baseline CWV.
6. Rozszerzyc testy integracyjne i e2e o pelne flow admina.
