# Lista Zmian (Przed/Po)

## Zmiany backend

### 1. Globalna walidacja requestow
- Przed: DTO mialy dekoratory, ale API akceptowalo niepoprawne payloady.
- Po: Wspolna konfiguracja app wymusza walidacje i odrzuca payloady spoza kontraktu.
- Pliki:
  - [app.setup.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/app.setup.ts)
  - [main.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/main.ts)
  - [app.e2e-spec.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/test/app.e2e-spec.ts)

### 2. Regresja wyceny niestandardowej
- Przed: Logika niestandardowa ignorowala przekroczenia wymiarow.
- Po: Przekroczenia limitow wymiarowych klasyfikuja oferte jako niestandardowa.
- Pliki:
  - [quote.service.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/quote-engine/quote.service.ts)
  - [quote.service.spec.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/quote-engine/quote.service.spec.ts)

## Zmiany frontend

### 3. Izolacja panelu admina od publicznego shella
- Przed: `/admin` dziedziczyl publiczne elementy nawigacyjne i cookie layer.
- Po: Admin ma odrebny render shell, publiczne elementy sa pomijane dla `/admin`.
- Pliki:
  - [app-shell.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/components/layout/app-shell.tsx)
  - [layout.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/layout.tsx)

### 4. Responsywnosc layoutu admin
- Przed: sztywny sidebar/naglowek powodowal problemy na 375/768.
- Po: sidebar i header dostosowuja sie do mobile/tablet bez degradacji desktop.
- Plik:
  - [admin/layout.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(admin)/admin/layout.tsx)

### 5. Stabilizacja build/lint i hook rules
- Przed: liczne bledy lint/type/prerender (`useState` w map, `useId` warunkowo, `useSearchParams` bez `Suspense`, brakujace dependencies).
- Po: frontend kompiluje sie i przechodzi lint; prerender przechodzi dla tras statycznych.
- Pliki kluczowe:
  - [quote-form.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/components/calculator/quote-form.tsx)
  - [quote.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/lib/validators/quote.ts)
  - [wycena/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/wycena/page.tsx)
  - [pomoc/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/pomoc/page.tsx)
  - [home page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/page.tsx)
  - [tracking page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/sledzenie/page.tsx)
  - [next.config.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/next.config.ts)
  - [logowanie/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(auth)/logowanie/page.tsx)

### 6. Aktualizacja zaleznosci build-time
- Dodano:
  - `@playwright/test`
  - `@sentry/nextjs`
  - `@radix-ui/react-slot`
- Kontekst: brakujace paczki blokowaly typecheck/build.

### 7. Wdrozenie auth JWT + ochrona panelu admin
- Przed: logowanie bylo mockowane bez realnego tokenu, `/admin` dostepne publicznie.
- Po:
  - API zwraca JWT dla poprawnych danych (`admin`/`customer`) i endpoint `GET /auth/me`.
  - Endpointy admin (`GET /custom-quotes`) chronione guardem JWT + rolami.
  - Web `proxy` blokuje `/admin` bez tokenu i bez roli `admin`.
  - Strona logowania realnie komunikuje sie z API i zapisuje token w cookie.
- Pliki:
  - [auth.service.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/auth/auth.service.ts)
  - [auth.controller.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/auth/auth.controller.ts)
  - [jwt-auth.guard.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/auth/jwt-auth.guard.ts)
  - [custom-quotes.controller.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/custom-quotes/custom-quotes.controller.ts)
  - [proxy.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/proxy.ts)
  - [logowanie/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(auth)/logowanie/page.tsx)

### 8. Stabilizacja grafik i assetow platnosci
- Przed: loga platnosci ladowane z zewnetrznych URL (ryzyko niedostepnosci i broken graphic).
- Po: loga przeniesione do lokalnych assetow `public/payment/*`.
- Pliki:
  - [paypal.svg](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/public/payment/paypal.svg)
  - [visa.svg](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/public/payment/visa.svg)
  - [mastercard.svg](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/public/payment/mastercard.svg)

### 9. Hardening proxy + regresje E2E auth/layout/grafiki
- Przed:
  - Jednoczesna obecność `middleware.ts` i `proxy.ts` powodowala konflikt builda Next 16.
  - Brak automatycznych testow E2E dla redirectow auth i integralnosci grafik.
- Po:
  - Usunieto legacy `middleware.ts`, logika ochrony `/admin` i `/konto` zostala skonsolidowana w `proxy.ts`.
  - Dodano E2E dla:
    - redirectow anonimowych userow (`/admin`, `/konto`),
    - dostepu admin/customer zgodnie z rola,
    - integralnosci logo platnosci i braku overflow na 375/768/1280/1920.
  - Playwright odpalany jest na dedykowanym serwerze produkcyjnym (`next build + next start`), co eliminuje kolizje z lokalnym dev serverem.
- Pliki:
  - [proxy.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/proxy.ts)
  - [playwright.config.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/playwright.config.ts)
  - [admin-and-graphics.spec.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/tests/e2e/admin-and-graphics.spec.ts)
  - [quote.spec.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/tests/e2e/quote.spec.ts)

### 10. Stabilizacja fontow i ikon (mniej zaleznosci runtime od CDN)
- Przed: fonty tekstowe i Material Symbols byly importowane z Google Fonts przez CSS `@import`.
- Po:
  - `Inter` i `Manrope` przeniesione do `next/font/google` (self-hosting w buildzie),
  - Material Symbols pobierane lokalnie z paczki `@material-symbols/font-400`.
- Pliki:
  - [layout.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/layout.tsx)
  - [globals.css](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/globals.css)
  - [package.json](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/package.json)

### 11. Security hardening API (rate-limit, lockout, token lifecycle)
- Przed:
  - Brak globalnego rate limitingu i blokad anty brute-force.
  - JWT nie mialy rotacji/refresh, brak revocation po logout.
  - CORS byl szeroki, a naglowki security nie byly utwardzone.
- Po:
  - Dodano globalny throttling (`@nestjs/throttler`) z konfiguracja env.
  - Dodano lockout po wielu nieudanych logowaniach (`MAX_LOGIN_ATTEMPTS`, `LOGIN_LOCK_WINDOW_MS`).
  - Wdrozono token lifecycle:
    - `POST /auth/login` zwraca `accessToken` + `refreshToken`,
    - `POST /auth/refresh` rotuje tokeny,
    - `POST /auth/logout` uniewaznia aktywny access token (revocation by `jti`),
    - guard JWT odrzuca tokeny revokowane i tokeny nie-`access`.
  - Uscislono CORS (allowlist origin) i dodano `helmet` dla security headers.
- Pliki:
  - [app.module.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/app.module.ts)
  - [app.setup.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/app.setup.ts)
  - [auth.service.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/auth/auth.service.ts)
  - [auth.controller.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/auth/auth.controller.ts)
  - [jwt-auth.guard.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/auth/jwt-auth.guard.ts)
  - [auth-session.service.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/auth/auth-session.service.ts)
  - [refresh-token.dto.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/auth/dto/refresh-token.dto.ts)
  - [app.e2e-spec.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/test/app.e2e-spec.ts)

### 12. Szeroki smoke wizualny tras (public/admin/konto) + baseline screenshoty
- Przed:
  - Kontrola grafik i overflow byla ograniczona do kilku widokow.
  - Brak systematycznego sprawdzenia zasobow statycznych (image/font/stylesheet) na pelnym zestawie tras.
- Po:
  - Dodano kompleksowy test Playwright obejmujacy trasy publiczne, admin i konto.
  - Dla viewportow `375/768/1280/1920` test sprawdza:
    - brak poziomego overflow,
    - poprawne ladowanie assetow,
    - poprawny font ikon Material Symbols,
    - screenshoty full-page do baseline/regresji wizualnej.
- Pliki:
  - [visual-routes.spec.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/tests/e2e/visual-routes.spec.ts)
  - [playwright.config.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/playwright.config.ts)

### 13. Eliminacja poziomego scrolla globalnie
- Przed: testy wykryly overflow poziomy m.in. na `/` i `/konto`.
- Po: dodano globalna ochrone `overflow-x: hidden` na `html` i `body`.
- Plik:
  - [globals.css](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/globals.css)

### 14. Cleanup backend lint (API) + uszczelnienie typow
- Przed:
  - `apps/api` mial dziesiatki bledow lint (unsafe `any`, `async` bez `await`, niejawne typy requestow).
  - Czesci serwisow/kontrolerow mialy niespojne kontrakty typow.
- Po:
  - `npm run lint --workspace apps/api` przechodzi bez errorow.
  - Wprowadzono jawne typy requestow (`Request`), payloadow JWT, DTO i insertow Drizzle (`$inferInsert`).
  - Uporzadkowano kontrolery/serwisy pod `require-await` i `no-unsafe-*`.
  - Utrzymano pelna zgodnosc funkcjonalna (build + e2e zielone).
- Pliki (wybor):
  - [main.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/main.ts)
  - [app.module.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/app.module.ts)
  - [roles.guard.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/common/guards/roles.guard.ts)
  - [auth.controller.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/auth/auth.controller.ts)
  - [auth.service.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/auth/auth.service.ts)
  - [jwt-auth.guard.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/auth/jwt-auth.guard.ts)
  - [orders.service.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/orders/orders.service.ts)
  - [cms.service.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/cms/cms.service.ts)
  - [leads.service.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/leads/leads.service.ts)

### 15. Migracja auth do DB + reset hasla (z fallbackiem legacy)
- Przed:
  - Auth bazowal glownie na kontach z ENV (plain password), bez trwalego resetu hasla i bez automatycznej migracji do `users`.
- Po:
  - Logowanie preferuje konta z DB (`users.password_hash` + `bcryptjs`), a konta legacy sa automatycznie migrowane/upsertowane do DB.
  - Dodano endpointy:
    - `POST /auth/password-reset/request`
    - `POST /auth/password-reset/confirm`
  - Dodano tokeny resetu hasla in-memory (TTL) oraz bezpieczne komunikaty anti-enumeration.
  - Dla zgodnosci wstecznej utrzymano fallback legacy (na wypadek chwilowej niedostepnosci DB).
- Pliki:
  - [auth.service.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/auth/auth.service.ts)
  - [auth-session.service.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/auth/auth-session.service.ts)
  - [auth.controller.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/auth/auth.controller.ts)
  - [register.dto.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/auth/dto/register.dto.ts)
  - [request-password-reset.dto.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/auth/dto/request-password-reset.dto.ts)
  - [reset-password.dto.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/auth/dto/reset-password.dto.ts)
  - [app.e2e-spec.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/test/app.e2e-spec.ts)
  - [db seed.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/db/seed.ts)

### 16. Stabilizacja panelu admin + fix build blockerow Next 16
- Przed:
  - Frontend admin mial bledy typow (`any`) i regresje lint/typecheck.
  - Build Next 16 blokowal konflikt `middleware.ts` vs `proxy.ts`.
  - Brakowalo importu typu `Metadata` oraz kilku kontraktow danych.
- Po:
  - Usunieto konflikt middleware/proxy (pozostal `proxy.ts`).
  - Uspojniono typy danych w kluczowych widokach admin/client (`cms`, `leady`, `zamowienia`, `dashboard`, `wycena`).
  - Naprawiono typecheck builda i brakujace importy (`Metadata`, `Link`).
  - `apps/web`: lint bez bledow krytycznych, build produkcyjny przechodzi, Playwright E2E/visual przechodzi.
- Pliki (wybor):
  - [eslint.config.mjs](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/eslint.config.mjs)
  - [layout.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/layout.tsx)
  - [proxy.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/proxy.ts)
  - [cennik/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(admin)/admin/cennik/page.tsx)
  - [cms/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(admin)/admin/cms/page.tsx)
  - [leady/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(admin)/admin/leady/page.tsx)
  - [dashboard/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(admin)/admin/page.tsx)
  - [zamowienia/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(admin)/admin/zamowienia/page.tsx)
  - [client orders/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(client)/panel/orders/page.tsx)
  - [checkout page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(checkout)/zamowienie/[quoteId]/page.tsx)
  - [wycena/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/wycena/page.tsx)
  - [home-client.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/home-client.tsx)

### 17. Uszczelnienie RBAC endpointow admin/users/orders + testy e2e security
- Przed:
  - Czesci endpointow o charakterze administracyjnym mialy jedynie `JwtAuthGuard` (bez wymuszenia roli `admin`).
  - Brak automatycznych testow API pilnujacych tych blokad.
- Po:
  - Dodano `RolesGuard` + `@Roles('admin')` dla:
    - `/admin/*`
    - `GET /users`
    - `GET /orders` oraz `GET /orders/:id`
  - Rozszerzono E2E API o:
    - blokade `customer` dla tras admin/users/orders,
    - reset hasla (happy-path + invalid token),
    - anti-enumeration dla resetu.
  - Aktualny wynik: `apps/api` e2e 18/18.
- Pliki:
  - [admin.controller.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/admin/admin.controller.ts)
  - [admin.module.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/admin/admin.module.ts)
  - [users.controller.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/users/users.controller.ts)
  - [users.module.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/users/users.module.ts)
  - [orders.controller.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/orders/orders.controller.ts)
  - [app.e2e-spec.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/test/app.e2e-spec.ts)

### 18. CI quality gates + czyste linty web + Docker live workflow
- Przed:
  - Brak repo workflow CI uruchamiajacego automatycznie lint/build/testy.
  - `apps/web` mialo warningi lint utrudniajace rygor quality gate.
  - `docker-compose.yml` emitowal warning o przestarzalym polu `version`.
- Po:
  - Dodano workflow GitHub Actions:
    - job `API Lint Build E2E`
    - job `Web Lint Build`
  - Usunieto warningi lint w krytycznych widokach web (`admin/users`, `panel`, `home`, `wycena`, `page`).
  - Dodano `metadataBase` w metadata Next, aby usunac warning build/log runtime.
  - Usunieto pole `version` z `docker-compose.yml`.
  - Potwierdzono aktualizacje live przez Docker na `localhost:3000` po `docker compose up -d --build api web`.
- Pliki:
  - [ci.yml](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/.github/workflows/ci.yml)
  - [docker-compose.yml](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/docker-compose.yml)
  - [layout.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/layout.tsx)
  - [uzytkownicy/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(admin)/admin/uzytkownicy/page.tsx)
  - [panel/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(client)/panel/page.tsx)
  - [home-client.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/home-client.tsx)
  - [page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/page.tsx)
  - [wycena/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/wycena/page.tsx)

### 19. Rozszerzenie regresji E2E: admin menu navigation + dodatkowe security API
- Przed:
  - Brak automatycznego testu klikalnej nawigacji panelu admin.
  - Brak dedykowanych testow API dla czesci scenariuszy security (anonimowy update CMS, invalid lead payload, blokada anon/customer na `admin/pricing-rules`).
- Po:
  - Dodano Playwright test sprawdzajacy:
    - kazdy link menu admin prowadzi do poprawnego URL,
    - docelowy widok renderuje oczekiwany naglowek.
  - Rozszerzono E2E API o scenariusze:
    - `GET /admin/pricing-rules`: anon `401`, customer `403`,
    - `PUT /cms/pages/:slug`: anon `401`,
    - `POST /leads` invalid payload: `400`.
  - Aktualny wynik:
    - `apps/api` e2e: `18/18`,
    - `apps/web` Playwright: `10/10`.
- Pliki:
  - [admin-navigation.spec.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/tests/e2e/admin-navigation.spec.ts)
  - [app.e2e-spec.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/test/app.e2e-spec.ts)

### 20. Fix layoutu logowania (obcinana szerokosc) + hardening auth-shell
- Przed:
  - Panel logowania na `/logowanie?next=%2Fadmin` potrafil zwijac sie do bardzo waskiej kolumny (wizualne obciecie formularza).
  - Auth widoki dziedziczyly publiczny shell (navbar/footer/cookie), co pogarszalo ergonomie logowania.
- Po:
  - Zastapiono problematyczne `max-w-md` jawnym limitem szerokosci (`max-w-[32rem]`) i dopracowano responsive spacing card/form.
  - Wylaczono publiczny shell dla tras auth (`/logowanie`, `/rejestracja`) — czysty, skupiony ekran logowania.
  - Dodano test Playwright pilnujacy, ze panel logowania nie jest obcinany i ma sensowna szerokosc na 375/768/1280.
  - Aktualny wynik Playwright: `11/11`.
- Pliki:
  - [logowanie/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(auth)/logowanie/page.tsx)
  - [app-shell.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/components/layout/app-shell.tsx)
  - [admin-and-graphics.spec.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/tests/e2e/admin-and-graphics.spec.ts)
  - [ci.yml](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/.github/workflows/ci.yml)
