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

### 21. Playwright pod Docker `localhost:3000` + stabilizacja asercji admin
- Przed:
  - Testy E2E web domyslnie uruchamialy osobny serwer (`next build + next start`), przez co brakowalo prostego trybu "testuj dokladnie to, co dziala w Dockerze na 3000".
  - Asercje naglowkow w admin mogly byc flaky przy legalnych stanach ladowania danych (`Ładowanie ...`).
- Po:
  - Dodano tryb zewnetrznego `baseURL` w Playwright (`PLAYWRIGHT_BASE_URL`) i skrypty:
    - `npm run test:e2e:docker --workspace apps/web`
    - `npm run test:e2e:visual:docker --workspace apps/web`
  - Uodporniono testy admin na stany ladowania (asercja tresci `main`, nie tylko finalnego `h1`).
  - Potwierdzono: `test:e2e:docker` przechodzi `11/11` na zywych kontenerach.
- Pliki:
  - [playwright.config.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/playwright.config.ts)
  - [package.json](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/package.json)
  - [admin-and-graphics.spec.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/tests/e2e/admin-and-graphics.spec.ts)
  - [admin-navigation.spec.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/tests/e2e/admin-navigation.spec.ts)

### 22. Redis-backed auth session store (revocation / lockout / password reset)
- Przed:
  - Revocation tokenow, lockout loginu i tokeny resetu hasla dzialaly tylko in-memory (utrata stanu po restarcie API).
- Po:
  - Dodano obsluge Redis jako persystentnego store dla:
    - revocation `jti`,
    - lockout/failed-attempt counters,
    - password reset tokens.
  - Pozostawiono fallback in-memory, gdy Redis jest niedostepny (z logowaniem ostrzezen).
  - Przepieto auth flow na async dla operacji sesyjnych:
    - `login` (lock checks / failed attempts),
    - `refresh`/`logout` (revocation),
    - `password-reset request/confirm`.
  - Zweryfikowano: `apps/api` lint/build/e2e (`18/18`) przechodza.
- Pliki:
  - [auth-session.service.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/auth/auth-session.service.ts)
  - [auth.service.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/auth/auth.service.ts)
  - [jwt-auth.guard.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/auth/jwt-auth.guard.ts)
  - [apps/api/package.json](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/package.json)
  - [docker-compose.yml](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/docker-compose.yml)
  - [.env.example](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/.env.example)

### 23. CSRF hardening (origin/referer guard dla state-changing requests)
- Przed:
  - Brak aktywnej ochrony CSRF dla metod modyfikujacych w scenariuszach cookie-based.
- Po:
  - Dodano middleware security:
    - obejmuje `POST/PUT/PATCH/DELETE`,
    - aktywuje sie, gdy request niesie cookie sesyjne (`pb_auth_token` / `pb_refresh_token`),
    - wymusza poprawny `Origin` lub `Referer` z allowlisty (`CORS_ORIGIN` + fallback `APP_URL/NEXTAUTH_URL`),
    - odrzuca niezgodne originy kodem `403`.
  - Rozszerzono E2E API o testy:
    - blokada cross-origin z cookie sesyjnym,
    - przepuszczenie trusted origin.
  - Zweryfikowano: `apps/api` lint/build/e2e (`20/20`) przechodza.
- Pliki:
  - [app.setup.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/app.setup.ts)
  - [app.e2e-spec.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/test/app.e2e-spec.ts)

### 24. Controlled rollout: DB-only auth (legacy fallback flag)
- Przed:
  - Legacy fallback byl stale aktywny i trudniejszy do bezpiecznego wygaszenia.
- Po:
  - Dodano feature flag:
    - `LEGACY_AUTH_FALLBACK_ENABLED` (domyslnie `true` dla kompatybilnosci),
    - gdy `false`: logowanie i reset hasla dzialaja tylko przez DB (bez kont ENV jako fallback).
  - W Docker live ustawiono:
    - `LEGACY_AUTH_FALLBACK_ENABLED=false` (DB-only auth na `localhost` stacku).
  - Zweryfikowano:
    - API lint/build/e2e (`20/20`) zielone,
    - login admin dziala na live (`201`, token zwracany),
    - web E2E docker (`11/11`) zielone.
- Pliki:
  - [auth.service.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/auth/auth.service.ts)
  - [docker-compose.yml](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/docker-compose.yml)
  - [.env.example](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/.env.example)

### 25. Admin CRUD hardening + audit log API (CMS/Leads/Pricing/Users)
- Przed:
  - Brak centralnego logu zmian administracyjnych.
  - Czesci operacji admin nie zostawiala sladu audytowego.
  - `/users` nie zwracalo modelu zgodnego z UI admina (`companyName`, `nip`, `status`), a akcje statusu nie byly podlaczone.
- Po:
  - Dodano modul audit log:
    - `AuditLogService` z endpointem `GET /admin/audit-log`,
    - zapis zdarzen dla kluczowych operacji admin:
      - `pricing_rule.created` / `pricing_rule.updated`,
      - `cms.page_updated`,
      - `lead.status_updated`,
      - `user.status_updated`.
  - Dodano fallback audit log do pamieci, gdy tabela/DB jest niedostepna (bez wywalenia endpointu).
  - Rozszerzono CRUD users:
    - `GET /users` zwraca shape zgodny z panelem admin,
    - `PUT /users/:id/status` aktualizuje status konta i loguje zdarzenie.
  - Panel admin `/admin/uzytkownicy` ma aktywne akcje `Aktywuj`/`Blokuj` (realne zapisy API).
  - Zweryfikowano:
    - API lint/build/e2e: `21/21`,
    - web lint/build: OK,
    - web E2E docker: `11/11`,
    - live: `GET /admin/audit-log` zwraca `200`.
- Pliki:
  - [audit-log.service.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/audit-log/audit-log.service.ts)
  - [audit-log.module.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/audit-log/audit-log.module.ts)
  - [admin.controller.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/admin/admin.controller.ts)
  - [cms.controller.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/cms/cms.controller.ts)
  - [cms.service.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/cms/cms.service.ts)
  - [leads.controller.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/leads/leads.controller.ts)
  - [leads.service.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/leads/leads.service.ts)
  - [users.controller.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/users/users.controller.ts)
  - [uzytkownicy/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(admin)/admin/uzytkownicy/page.tsx)

### 26. Dynamiczna migracja CMS i Edytor Treści (Faza 3)
- Przed:
  - Wiekszosc stron publicznych miala tresci hardcoded w kodzie React.
  - Edytor CMS w panelu admina byl jedynie makieta.
- Po:
  - Pelna migracja 12 stron publicznych na dynamiczny CMS API:
    - Wdrozenie wzorca `Server Component (Fetch) -> Client Component (Render)` dla zachowania SEO i wydajności.
    - Dodano mechanizm `Fallbacks` zapewniajacy wyswietlanie strony nawet przy bledach API.
  - Przepisano `admin/cms/page.tsx` na funkcjonalny edytor wspierajacy 13 sekcji:
    - Edycja pol tekstowych, list dynamicznych i przelaczników.
    - Live fetch/save kazdej sekcji CMS.
- Pliki (wybor):
  - [home-client.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/home-client.tsx)
  - [o-nas/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/o-nas/page.tsx)
  - [cms/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(admin)/admin/cms/page.tsx)
  - [pricing-client.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/cennik/pricing-client.tsx)
  - [help-client.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/pomoc/help-client.tsx)

### 27. Silnik Tematyczny (Theme Engine) i Edytor Wygladu (Faza 7)
- Przed:
  - Wyglad aplikacji bazowal na statycznych zmiennych CSS w `globals.css`.
  - Brak mozliwosci zmiany brandingu bez modyfikacji kodu.
- Po:
  - Wdrozenie `ThemeProvider` (Server Component) wstrzykujacego nadpisania zmiennych CSS pobrane z CMS (`slug: theme`).
  - Automatyczna generacja wariantów kolorystycznych (hover, highlight, container) z kolorów bazowych.
  - Dodanie panelu `/admin/wyglad` (Theme Editor):
    - 6 gotowych presetów kolorystycznych (Teal, Royal, Forest, etc.).
    - Selektor typografii (Google Fonts) i zaokrągleń (Radius).
    - Konfiguracja trybu ciemnego (Dark Mode).
    - Podgląd na żywo (Live Preview) zmian przed zapisem.
- Pliki:
  - [theme-provider.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/components/theme/theme-provider.tsx)
  - [admin/wyglad/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(admin)/admin/wyglad/page.tsx)
  - [layout.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/layout.tsx)

### 28. Rozbudowa nawigacji admina i weryfikacja builda
- Przed:
  - Brak dostepu do nowych modulów (Wygląd, Cennik) z menu bocznego.
- Po:
  - Zaktualizowano `admin/layout.tsx` o nowe pozycje menu.
  - Wykonano build produkcyjny (`next build`): 42 strony wygenerowane pomyslnie, 0 bledów typów.
- Pliki:
  - [admin layout.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(admin)/admin/layout.tsx)

### [2026-05-05 21:30] Panel Klienta & Zaawansowany Admin (Faza 10-12)
- **Panel Klienta (CRUD Adresy)**:
  - Wdrożono pełny system zarządzania książką adresową (Dodawanie, Edycja, Usuwanie).
  - Dodano modale interaktywne i logikę domyślnych adresów nadawcy/odbiorcy.
  - Pliki: `panel/addresses/page.tsx`, `users.controller.ts`.
- **Profil Firmy & Bezpieczeństwo**:
  - Uruchomiono edycję danych firmy oraz moduł zmiany hasła z walidacją starego hasła.
  - Pliki: `panel/company/page.tsx`, `panel/settings/page.tsx`.
- **Narzędzia Eksportu (CSV)**:
  - Dodano endpointy API do generowania raportów CSV dla zamówień i leadów.
  - Zaimplementowano bezpieczne pobieranie plików (fetch + blob) w panelu admina.
  - Pliki: `orders.controller.ts`, `leads.controller.ts`.
- **Globalne Wyszukiwanie**:
  - Dodano asynchroniczny Search Bar w nagłówku admina przeszukujący 3 moduły jednocześnie (Orders, Leads, Users).
  - Pliki: `admin/layout.tsx`, `admin.controller.ts`.
- **UI/UX Polish**:
  - Dodano animacje wejścia (animate-fade-in), statusy ladowania i poprawiono responsywność tabel.

### [2026-05-05 22:05] Akcje Masowe & Zarządzanie Danymi (Faza 13)
- **Bulk Actions (Zamówienia)**:
  - Wdrożono system masowej selekcji zamówień z pływającym paskiem akcji (Floating Action Bar).
  - Dodano endpoint API `POST /orders/bulk-status` do masowej zmiany statusów.
- **Zarządzanie Leadami (Notatki)**:
  - Dodano pole notatek handlowych w widoku leadów z automatycznym zapisem (`onBlur`).
  - Rozbudowano API o endpoint `PUT /leads/:id/notes`.
- **Zarządzanie Użytkownikami**:
  - Implementacja modala edycji użytkownika (Email, Rola).
  - Dodano endpoint `PUT /users/:id` dla administratorów.
  - Odświeżono UI listy użytkowników z szybką blokadą konta.

### [2026-05-05 22:10] Dashboard KPI & Analytics (Faza 14)
- **Analityka API**:
  - Wdrożono endpoint `/admin/analytics` agregujący dane o przychodach z ostatnich 30 dni.
  - Obliczanie statystyk przewoźników i sumarycznych przychodów brutto.
- **Interaktywny Dashboard**:
  - Dodano dynamiczny wykres słupkowy przychodów (Custom SVG) z interaktywnymi tooltipami.
  - Wdrożono widget "Ostatnia Aktywność" pobierający dane z logów audytowych w czasie rzeczywistym.
  - Odświeżono karty statystyk o dynamiczne dane z bazy.

### [2026-05-05 22:12] SEO, Performance & Final Polish (Faza 15)
- **SEO & Social Media**:
  - Wdrożono zaawansowane Metadata (OpenGraph, Twitter Cards) w `layout.tsx`.
  - Dodano system szablonów tytułów (`%s | PaletyBroker`).
- **Optymalizacja Bazy Danych**:
  - Dodano krytyczne indeksy wydajnościowe na `orders(orderNumber, createdAt)` oraz `leads(email, status)`.
- **UI & Navigation**:
  - Implementacja stanów "Active" w nawigacji głównej i mobilnej (podświetlanie aktualnej podstrony).
  - Poprawiono responsywność menu mobilnego.
- **Wydajność**:
  - Weryfikacja builda produkcyjnego i optymalizacja fontów (swap display).

### [2026-05-06 00:35] Admin-Frontend hardening + poprawa logowania (kontynuacja)
- **Logowanie / UX / grafiki**:
  - Poprawiono responsywny kontener logowania (szerszy wrapper, bez ucinania, lepsze paddingi).
  - Dodano `flex-wrap` dla logo płatności, aby uniknąć ryzyka przycięcia na małych ekranach.
- **Panel admina (spójność endpointów i nawigacji)**:
  - Ujednolicono endpoint logów systemowych na frontendzie do `/admin/audit-log?limit=200`.
  - Dodano bezpieczne renderowanie rekordów logów dla `null` (`actorEmail`, `entityId`).
  - Rozszerzono menu admina o sekcje `Finanse` i `Logi systemowe`.
  - Edytor wyglądu (`/admin/wyglad`) używa teraz tego samego mechanizmu auth cookie (`pb_auth_token`) co reszta panelu.
- **Stabilizacja frontu pod Next 16**:
  - Naprawiono błąd parsowania w `admin/zamowienia/page.tsx` (brakujący `catch`).
  - Usunięto zależność runtime od brakującego `sonner` w hooku websocket i podpięto lokalny `toast-store`.
  - Przeniesiono `themeColor` z `metadata` do `viewport` (zgodnie z nowym API Next).
  - Dodano rewrites dla starych ikon PWA (`/icons/icon-192x192.png`, `/icons/icon-512x512.png`) oraz poprawiono `manifest.json`, aby wyeliminować broken assety.
- **Regresja E2E**:
  - Zaktualizowano test nawigacji admina o nowe sekcje (`Wygląd`, `Cennik`, `Finanse`, `Logi systemowe`).
  - Uruchomiono E2E: `7/7` testów przeszło (admin-navigation + admin-and-graphics).
- **Pliki**:
  - [logowanie/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(auth)/logowanie/page.tsx)
  - [admin layout.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(admin)/admin/layout.tsx)
  - [logi-systemowe/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(admin)/admin/logi-systemowe/page.tsx)
  - [wyglad/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(admin)/admin/wyglad/page.tsx)
  - [zamowienia/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(admin)/admin/zamowienia/page.tsx)
  - [use-websocket.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/hooks/use-websocket.ts)
  - [layout.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/layout.tsx)
  - [next.config.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/next.config.ts)
  - [manifest.json](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/public/manifest.json)
  - [admin-navigation.spec.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/tests/e2e/admin-navigation.spec.ts)

### [2026-05-06 00:36] Bloker wykryty (API dev watch)
- `api` w trybie `nest start --watch` nie startuje poprawnie z powodu istniejących, niezależnych od bieżącego patcha błędów TypeScript/dependency (41 errors w kompilacji watch).
- Wpływ:
  - frontend działa i aktualizuje się live na `localhost:3000`,
  - część funkcji admina wymagających live API może nie zwracać danych do czasu stabilizacji backendu.
- Kolejny krok:
  - dedykowany sprint stabilizacyjny backendu (kompilacja `apps/api` od `CRITICAL` do `LOW`).

### [2026-05-06 00:58] CMS Frontend Management v2 (user-facing sterowanie z panelu admina)
- **Rozbudowa zarządzania frontendem przez admina (bez duplikacji istniejących modułów)**:
  - Dodano nowe pola `global-settings` do zarządzania publicznym frontendem:
    - `brandName`, `footerTagline`, `newsletterEnabled`, `supportStatusLabel`,
    - `navLinks` (menu górne),
    - `footerCompanyLinks`, `footerToolLinks`, `footerSupportLinks` (3 kolumny stopki).
  - Rozszerzono edytor CMS (`/admin/cms`) o sekcje:
    - Brand,
    - Nawigacja główna,
    - Linki stopki (3 kolumny),
    - Dodatkowe opcje stopki.
- **Publiczny frontend podpięty pod CMS**:
  - `Navbar` dynamicznie pobiera nazwę marki i linki menu z `global-settings` (z fallbackiem do dotychczasowych wartości).
  - `Footer` dynamicznie pobiera:
    - nazwę marki i tagline,
    - konfigurację newslettera,
    - etykietę statusu systemu,
    - wszystkie kolumny linków.
  - Dodano normalizację i walidację linków (`/slug` fallback) aby uniknąć błędnych URL.
- **UX panelu admina (CMS)**:
  - `?section=global-settings` i inne `?section=*` działają poprawnie (autowybór sekcji).
  - Klikanie sekcji aktualizuje URL query (`history.replaceState`) bez przeładowania.
  - Dodano przycisk „Podgląd strony” dla sekcji mających odpowiadającą trasę publiczną.
- **Seed danych**:
  - Uzupełniono `global-settings` w seederze o nowe pola i domyślne struktury linków.
- **Walidacja**:
  - Lint dotkniętych plików frontend: OK.
  - E2E: `admin-navigation` + `admin-and-graphics` zielone (`7/7`), dodatkowo `admin-and-graphics` (`6/6`).
- Pliki:
  - [cms/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(admin)/admin/cms/page.tsx)
  - [navbar.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/components/layout/navbar.tsx)
  - [footer.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/components/layout/footer.tsx)
  - [global-data-provider.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/components/providers/global-data-provider.tsx)
  - [seed.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/db/seed.ts)
  - [logowanie/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(auth)/logowanie/page.tsx)

### [2026-05-06 06:58] Frontend -> Admin funnel v3 (leady + reset hasla + live Docker stabilizacja)
- **User-facing formularze podlaczone do realnego API leadow**:
  - Usunieto `alert()` i wdrozono zapis leadow do `POST /leads` dla:
    - formularza kontaktu (`/kontakt`),
    - formularza wsparcia na homepage (`/`),
    - formularza B2B (`/dla-firm`).
  - W panelu admina `/admin/leady` rozszerzono widok o dodatkowe dane leada (`phone`, `route`) dla lepszej obslugi handlowej.
- **Reset hasla (pelny frontend flow)**:
  - Dodano nowa trase `/reset-hasla` (request token + confirm new password).
  - Podpieto link z `/logowanie` ("Nie pamietasz?").
  - Dodano obsluge tego widoku w shellu auth (`AppShell`) bez publicznej nawigacji/stopki.
- **CRITICAL fix dla Docker dev (`localhost:3000`)**:
  - Naprawiono blokade hydracji client-side przez Next 16 dev-origin policy:
    - dodano `allowedDevOrigins` w `next.config.ts`.
  - Efekt:
    - event handlery znow sa aktywne (koniec natywnego submit `GET ?name=...`),
    - formularze i akcje admin dzialaja poprawnie live przez Docker.
- **Bloker API/Auth usuniety**:
  - Naprawiono DI backendu (`DocumentsService`, `AnalyticsService`) oraz uruchomiono API watch bez crashu.
  - Zsynchronizowano runtime DB z aktualnym modelem auth (dodane kolumny `users.auth_provider`, `users.external_id`, `users.api_key` + indeksy), co przywrocilo dzialanie `POST /auth/register` i `POST /auth/login`.
- **Regresja i walidacja**:
  - `eslint` (dotkniete pliki): OK.
  - Playwright Docker:
    - `auth-reset.spec.ts` + `lead-funnel.spec.ts` + `admin-navigation.spec.ts`: `3/3` zielone.
    - `admin-and-graphics.spec.ts`: `6/6` zielone.
- Pliki:
  - [leads.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/lib/leads.ts)
  - [lead-form.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/components/business/lead-form.tsx)
  - [contact-client.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/kontakt/contact-client.tsx)
  - [home-client.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/home-client.tsx)
  - [reset-hasla/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(auth)/reset-hasla/page.tsx)
  - [logowanie/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(auth)/logowanie/page.tsx)
  - [app-shell.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/components/layout/app-shell.tsx)
  - [admin/leady/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(admin)/admin/leady/page.tsx)
  - [admin/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(admin)/admin/page.tsx)
  - [next.config.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/next.config.ts)
  - [auth-reset.spec.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/tests/e2e/auth-reset.spec.ts)
  - [lead-funnel.spec.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/tests/e2e/lead-funnel.spec.ts)
  - [documents.module.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/documents/documents.module.ts)
  - [analytics.module.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/analytics/analytics.module.ts)

### [2026-05-06 07:20] Frontend visual management v4 (grafiki sterowane z CMS + polish UX)
- **Rozbudowa CMS -> frontend (strona główna)**:
  - Dodano pola zarządzania grafikami dla `home`:
    - `heroVisualImage`, `heroVisualCaption`,
    - `supportVisualImage`,
    - `ctaVisualImage`,
    - `testimonials[].avatarImage` (opcjonalne zdjęcie avatara).
  - Publiczny frontend wykorzystuje te pola w runtime z bezpiecznym fallbackiem lokalnych assetów.
- **Nowe lokalne assety wizualne (stabilne pod Docker/live)**:
  - `apps/web/public/images/home-hero-logistics.jpg`
  - `apps/web/public/images/home-support-team.jpg`
  - `apps/web/public/images/home-cta-warehouse.jpg`
  - `apps/web/public/images/avatars/client-1.jpg`
  - `apps/web/public/images/avatars/client-2.jpg`
  - `apps/web/public/images/avatars/client-3.jpg`
- **UX / techniczne polish (Next 16)**:
  - Usunięto ostrzeżenie o `<script>` renderowanym w komponencie React:
    - pasek progresu scrolla przeniesiony do `useEffect` w `AppShell`.
  - Usunięto ostrzeżenia obrazków płatności na `/logowanie`:
    - stabilne wymiary `next/image` bez runtime resize mismatch.
  - Naprawiono bloker parsera w `admin/zamowienia` po restarcie Dockera (stabilny render tras `/admin/*`, koniec losowych `404` po błędzie kompilacji segmentu).
- **Testy / walidacja**:
  - ESLint (dotknięte pliki web+api): OK.
  - Playwright Docker (`localhost:3000`):
    - `admin-and-graphics.spec.ts` + `admin-navigation.spec.ts`: `7/7` pass.
  - Rozszerzono test nawigacji admina o asercję nowych pól CMS grafik (`Hero image URL`, `Support image URL`, `CTA image URL`).
- Pliki:
  - [home-client.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/home-client.tsx)
  - [cms/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(admin)/admin/cms/page.tsx)
  - [app-shell.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/components/layout/app-shell.tsx)
  - [logowanie/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(auth)/logowanie/page.tsx)
  - [seed.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/db/seed.ts)
  - [admin-navigation.spec.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/tests/e2e/admin-navigation.spec.ts)

### [2026-05-06 08:15] Admin CMS media library v5 (upload + autokreacja stron CMS)
- **Domkniecie zarzadzania frontendem z panelu admina przy pustej bazie CMS**:
  - Naprawiono krytyczny przypadek `cms_pages = []`: panel CMS nie gubil juz zmian lokalnych i pozwala na publikacje nawet przy pierwszej edycji.
  - Frontend CMS tworzy lokalny wpis sekcji podczas pierwszej zmiany (`slug`, `title`, `content`) zamiast ignorowac update.
  - `PUT /cms/pages/:slug` działa teraz jak bezpieczny upsert:
    - aktualizuje, gdy strona istnieje,
    - tworzy, gdy brak rekordu (`cms.page_created` w audit log),
    - ma fallback aktualizacji przy konflikcie rownoleglym.
- **Nowy komponent admin UX dla grafiki homepage**:
  - Dodano `HomeImageFieldEditor` (preview + URL + upload + restore default),
  - Podpieto kopiowanie URL do schowka z feedbackiem.
- **Nowy test E2E (admin-first)**:
  - rozszerzono `admin-navigation.spec.ts` o scenariusz:
    - upload grafiki w `/admin/cms?section=home`,
    - przypiecie `Ustaw Hero`,
    - publikacja zmian,
    - cleanup uploadu przez `DELETE /cms/media`.
- **Weryfikacja**:
  - ESLint (dotkniete pliki): OK.
  - Playwright Docker (`localhost:3000`):
    - `admin-navigation.spec.ts`: `2/2` pass,
    - `admin-and-graphics.spec.ts`: `6/6` pass.
- **Smoke API po zmianie**:
  - `GET /cms/pages` po publikacji z panelu zwraca rekord `home` (koniec pustej listy jako bloker edycji).
- Pliki:
  - [cms/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/(admin)/admin/cms/page.tsx)
  - [cms.service.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/api/src/modules/cms/cms.service.ts)
  - [admin-navigation.spec.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/tests/e2e/admin-navigation.spec.ts)
  - [2026-05-05-api-openapi.yaml](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/docs/audit/2026-05-05-api-openapi.yaml)

### [2026-05-06 08:40] Domkniecie paska postepu (frontend flow + reset hasla + E2E Docker)
- Zweryfikowano, ze wymagane flow sa zakonczone i dzialaja bez dodatkowych zmian kodu:
  - formularze user-facing (`/kontakt`, homepage support, `/dla-firm`) sa podlaczone do `POST /leads` i maja statusy UX (`loading`, `success/error toast`, `disabled submit`),
  - ekran `/reset-hasla` jest dostepny i podlaczony z `/logowanie`,
  - testy E2E nowych flow sa uruchamialne na Docker `localhost:3000`.
- Wykonana regresja Docker:
  - `npm run test:e2e:docker -- tests/e2e/lead-funnel.spec.ts tests/e2e/auth-reset.spec.ts` => `2/2` pass.
- Ten wpis jest finalnym potwierdzeniem wykonania (bez duplikowania opisu implementacji z poprzednich sekcji).

### [2026-05-06 09:35] Full check CMS -> Frontend (wszystkie sekcje) + fix Docker server-side API
- **Wykryty i naprawiony bloker reakcji frontendu po publikacji CMS w Docker**:
  - Przyczyna: server-side Next.js (RSC) używał `NEXT_PUBLIC_API_URL=http://localhost:4000`, co w kontenerze `web` wskazywało na sam kontener, a nie `api`.
  - Skutek: strony frontend często renderowały fallback i nie odzwierciedlały zmian z panelu admina.
- **Wdrożona poprawka**:
  - dodano resolver API URL: [api-url.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/lib/api-url.ts),
  - `getCmsContent` korzysta z URL wewnętrznego na serwerze (`API_URL_INTERNAL`) i `no-store`,
  - homepage (`app/page.tsx`) pobiera CMS przez ten sam mechanizm,
  - Docker `web` otrzymał `API_URL_INTERNAL=http://api:4000`.
- **Walidacja end-to-end (sekcja po sekcji)**:
  - wykonano automatyczny check 13/13 sekcji CMS:
    - panel admina renderuje poprawnie każdą sekcję,
    - edycja + publikacja działa,
    - odpowiadający widok frontend aktualizuje się poprawnie,
    - brak poziomego overflow po zmianie,
    - rollback do wartości pierwotnej wykonany po każdym teście.
  - wynik: **13/13 PASS**.
- Pliki:
  - [api-url.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/lib/api-url.ts)
  - [cms.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/lib/cms.ts)
  - [page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/page.tsx)
  - [docker-compose.yml](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/docker-compose.yml)

### [2026-05-06 12:25] Homepage visual alignment fix (hero + sekcje)
- **Naprawiony glowny problem nierownego ukladu hero**:
  - przyczyna: `items-center` w siatce hero przy znacznie wyzszej prawej kolumnie (obraz + kalkulator + tracking),
  - poprawka: wyrownanie siatki do gornej krawedzi (`items-start`) i usuniecie animacji `animate-float` z calej prawej kolumny.
- **Dalsza korekta po review UI (pelna szerokosc wyceny)**:
  - sekcje przebudowano do ukladu 2-etapowego: hero (tekst + obraz) oraz osobny blok wyceny pod spodem,
  - `Blyskawiczna wycena` przeniesiona do pelnoszerokiego kontenera (`id="calculator"`), co usuwa nadmiar pustej przestrzeni na desktopie,
  - tracking pozostaje bezposrednio pod kalkulatorem jako osobny, rowniez szeroki panel.
- **Ujednolicenie sekcji strony glownej**:
  - wszystkie glowne kontenery dostaly spójny responsywny padding (`px-4 sm:px-6 lg:px-8`),
  - poprawiono responsywnosc sekcji CTA (mniejsze promienie i padding na mniejszych viewportach, skalowanie typografii naglowka/opisu).
- **Stabilizacja fallbacku obrazow CMS w homepage**:
  - usunieto `setState` wykonywany w `useEffect` (lint `react-hooks/set-state-in-effect`),
  - fallback obrazka realizowany bezposrednio w `onError`, bez kaskadowych renderow.
- **Weryfikacja Docker live**:
  - przebudowano i zrestartowano kontenery (`web` + `api`) na `localhost:3000`,
  - wykonano screenshoty Playwright dla `1920x1080`, `1280x900`, `375x900` i potwierdzono poprawne wyrownanie hero oraz spojnosc sekcji.
- Pliki:
  - [home-client.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/home-client.tsx)

### [2026-05-06 13:05] Rozbudowa panelu "Blyskawiczna wycena" (functional quote intake)
- **Zakres UX/formularza**:
  - rozszerzono formularz o komplet danych operacyjnych potrzebnych do szybkiej wyceny:
    - typ palety,
    - nadanie/dostawa: kod pocztowy + kraj,
    - liczba palet,
    - waga jednej palety,
    - wymiary (dlugosc/szerokosc/wysokosc),
    - warunki przewozu (`stackable`, `fragile`, `ADR`, adresy prywatne).
- **Funkcjonalnosc i walidacja**:
  - dodano walidacje `palletCount` (1-33) w schemacie Zod,
  - poprawiono krytyczny brak danych wymiarowych (`length`/`width`) w formularzu, ktory wczesniej mogl blokowac submit,
  - dla standardowych typow palet dlugosc i szerokosc ustawiane sa automatycznie wg presetu; dla `custom` pola sa edytowalne.
- **Integracja z wycena wynikowa (`/wycena`)**:
  - przekazywanie wszystkich kluczowych pol przez query params,
  - `palletCount` jest uwzgledniany w kalkulacji wagi do requestu API (`weight = weightPerPallet * palletCount`),
  - payload `/quotes` zawiera pelne `sender/recipient country` oraz `options` z warunkami przewozu.
  - panel "Twoja konfiguracja" na stronie wynikow pokazuje teraz liczbe palet, wage jednostkowa, wage laczna, trase z krajami i warunki przewozu.
- **Testy / Docker live**:
  - nowe/aktualizowane E2E:
    - `quote.spec.ts`:
      - smoke hero + kalkulator,
      - flow: wypelnienie najwazniejszych danych i przejscie do `/wycena`.
  - wynik:
    - `npm run test:e2e:docker --workspace apps/web -- tests/e2e/quote.spec.ts` => `2/2` pass,
    - `npm run test:e2e:visual:docker --workspace apps/web` => `3/3` pass.
  - potwierdzono dzialanie po rebuild/restart Docker na `localhost:3000`.
- Pliki:
  - [quote-form.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/components/calculator/quote-form.tsx)
  - [quote.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/lib/validators/quote.ts)
  - [wycena/page.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/wycena/page.tsx)
  - [quote.spec.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/tests/e2e/quote.spec.ts)

### [2026-05-06 13:35] Naprawa "Podglad ladunku" + dopasowanie sekcji pod desktop/mobile
- **Naprawa kluczowego problemu UI**:
  - `Podglad ladunku` byl nieczytelny (miniaturowy obiekt na duzej pustej powierzchni).
  - Komponent preview dostal nowy model skalowania responsywnego:
    - clamp wymiarow pod viewport,
    - realna perspektywa (`perspective`) i `transformStyle: preserve-3d`,
    - stale czytelny podpis i metadane wymiarow.
- **Zmiany wizualne preview**:
  - dodano siatke tla (reference grid),
  - mocniejszy obiekt 3D (widoczny front/top/side + cien pod obiektem),
  - dolny pasek informacyjny zawsze widoczny (typ palety + wymiary), a nie tylko na hover.
- **Dodatkowe dostosowania responsywne sekcji wyceny**:
  - panel kosztu (`Szacowany koszt od`) zmieniony na responsywny grid:
    - mobile: pionowe stackowanie,
    - desktop: trzykolumnowy uklad bez scisku tekstu.
- **Weryfikacja**:
  - lint dotknietych plikow: OK,
  - Docker live (`localhost:3000`) po rebuild/restart: OK,
  - regresja:
    - `tests/e2e/quote.spec.ts`: `2/2` pass,
    - `tests/e2e/visual-routes.spec.ts`: `3/3` pass.
- Pliki:
  - [pallet-preview.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/components/calculator/pallet-preview.tsx)
  - [quote-form.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/components/calculator/quote-form.tsx)

### [2026-05-06 14:20] Dalsze doszlifowanie homepage (desktop + mobile)
- **Podglad ladunku - lepsze wykorzystanie przestrzeni**:
  - powiekszono bryle 3D (wieksze zakresy clamp dla dlugosci/szerokosci/wysokosci),
  - zwiekszono wysokosc kontenera preview na wszystkich breakpointach,
  - utrzymano pelna czytelnosc podpisow i metadanych.
- **Responsywnosc sekcji strony glownej**:
  - zmniejszono nadmierne pionowe odstepy na mobile (hero, how-it-works, stats, testimonials, support, CTA),
  - poprawiono skale elementow (przyciski hero, naglowki, teksty pomocnicze),
  - przebudowano testimoniale pod mobile:
    - mniejsze paddings i promienie,
    - mniejsza typografia cytatu i avatarow,
    - przyciski nawigacji dostaly `aria-label`.
- **Spojnosc desktop/mobile**:
  - utrzymano ten sam wizualny jezyk komponentow przy mniejszym "rozstrzale" na telefonach,
  - zweryfikowano wyglad na 375/768/1280/1920.
- **Weryfikacja**:
  - lint: OK dla dotknietych plikow,
  - E2E Docker:
    - `tests/e2e/quote.spec.ts` => `2/2` pass,
    - `tests/e2e/visual-routes.spec.ts` => `3/3` pass.
- Pliki:
  - [home-client.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/app/home-client.tsx)
  - [pallet-preview.tsx](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/src/components/calculator/pallet-preview.tsx)

### [2026-05-06 14:40] Test regresyjny responsywnosci sekcji wyceny
- Dodano nowy test E2E w `quote.spec.ts`, ktory waliduje sekcje `Blyskawiczna wycena` na docelowych viewportach:
  - `375x812`, `768x1024`, `1280x900`, `1920x1080`.
- Test sprawdza:
  - widocznosc sekcji i kluczowych elementow (`Podglad ladunku`, koszt, CTA),
  - brak horyzontalnego overflow (`scrollWidth - clientWidth <= 2`),
  - utrzymanie minimalnej szerokosci obszaru kalkulatora.
- Dodano helper akceptacji cookies na starcie testow, aby ograniczyc flaky przy overlapie bannera.
- Wynik:
  - `npm run test:e2e:docker --workspace apps/web -- tests/e2e/quote.spec.ts` => `3/3` pass.
- Pliki:
  - [quote.spec.ts](/Users/damiansulkowski/Documents/Strona-transport-wizytowka/apps/web/tests/e2e/quote.spec.ts)

### [2026-05-06 14:50] Rewalidacja przeplywu admin -> frontend po zmianach UI
- Po doszlifowaniu homepage i testach responsywnosci wykonano dodatkowy smoke E2E panelu admina:
  - `tests/e2e/admin-navigation.spec.ts` => `2/2` pass.
- Potwierdzono, ze kluczowy przeplyw nie zostal naruszony:
  - nawigacja panelu admina,
  - upload mediow i publikacja zmian CMS na frontendzie.
