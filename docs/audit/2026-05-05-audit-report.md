# Raport Audytu Aplikacji (2026-05-05)

## Zakres i podejscie
Audyt wykonano od panelu administratora, a nastepnie rozszerzono na backend/API, baze danych, frontend globalny, testowalnosc i wydajnosc.

## 1) Panel Admina (priorytet)
### Status po zmianach
- Panel admina całkowicie odseparowany od publicznego shella.
- **Premium UI/UX**: Skeleton Loadery, Toasty, Modale.
- **Advanced Admin Analytics**: Nowy moduł raportowania przychodów (per waluta), trendów zamówień oraz statystyk TOP klientów.
- **System Logs UI**: Wdrożono nową stronę "Logi Systemowe" umożliwiającą administratorom przeglądanie zmian w formacie JSON diff.
- **Financial Management UI**: Wdrożono interfejs wystawiania korekt faktur bezpośrednio z listy zamówień.
- **Operacje Masowe**: Zbiorcze etykiety i statusy.

## 2) Backend/API & Wydajność
### Status po zmianach
- **Advanced Caching**: Redis Caching dla cen i walut.
- **Reporting & Financials**: Dwujęzyczne, wielowalutowe faktury VAT PDF.
- **Advanced Audit Trail**: Zintegrowany system `AuditLogService` z logowaniem różnicowym (diff) dla reguł cennika.
- **Observability**: Endpointy `/health` i `/metrics`.

## 3) Integracje i Logistyka
### Status po zmianach
- **B2B Programmatic Access**: System **API Key**.
- **Carrier Integration Layer**: Zrefaktoryzowany DHL/DPD (Sandbox/Prod).
- **Multi-currency Support**: PLN, EUR, USD, GBP.
- **Enterprise SSO**: Aktywne strategie **Google OAuth2** oraz **Azure AD (OIDC)**.
- **Invoice Corrections**: Automatyczne generowanie faktur korygujących (Backend + Frontend).

## 4) Frontend i UX
### Status po zmianach
- **Wielojęzyczność (i18n)**: PL/EN Switcher.
- **User Analytics**: Statystyki wydatków i przewoźników dla klienta.
- **Real-time UX**: Powiadomienia przez WebSockets.

## 5) Testy i Stabilność
### Status po zmianach
- **Playwright E2E**: Checkout, Admin, Client Panel.
- **TypeScript**: Czysty build produkcyjny.

## 6) Następne Kroki
1. **Produkcyjne API Przewoźników**: Aktywacja DHL/DPD po otrzymaniu poświadczeń.
2. **International Expansion**: Integracja z UPS i FedEx.
3. **Mobile App**: Aplikacja mobilna dla kurierów i klientów.
4. **Predictive Analytics**: AI-driven cost prediction.

## 7) Aktualizacja 2026-05-06 (Frontend/Admin)
### Wdrozone poprawki
- Naprawiono problem ucinania szerokosci formularza logowania (`/logowanie`) i dopracowano responsywnosc.
- Ujednolicono frontend admina pod katem API i auth:
  - logi systemowe pobierane z `/admin/audit-log`,
  - edytor wygladu zapisuje przez token cookie (`pb_auth_token`),
  - menu admina rozszerzone o `Finanse` i `Logi systemowe`.
- Wyeliminowano regresje assetow:
  - naprawiono fallback ikon PWA (manifest + rewrites),
  - poprawiono zgodnosc z Next 16 (`themeColor` przeniesione do `viewport`).
- Potwierdzono regresja E2E (Playwright): `7/7` zielone dla zakresu admin/navigation/login-grafiki.

### Bloker
- **Backend API dev-watch niekompletnie startuje** (41 bledow kompilacji TypeScript w istniejacych modulach niezaleznych od aktualnego patcha).
- Priorytet na kolejna iteracje: stabilizacja `apps/api` do pelnego startu watch i przywrocenia live danych we wszystkich widokach admin.

## 8) Aktualizacja 2026-05-06 (CMS zarzadzanie frontendem)
### Zakres
- Rozszerzono panel admina tak, by realnie sterowal publicznym frontendem (navbar + footer) bez zmian kodu po stronie uzytkownika.

### Wdrozenia
- `global-settings` otrzymalo nowe obszary:
  - brand (`brandName`, `footerTagline`),
  - menu top (`navLinks`),
  - kolumny linkow stopki (`footerCompanyLinks`, `footerToolLinks`, `footerSupportLinks`),
  - toggles i etykiety (`newsletterEnabled`, `supportStatusLabel`).
- Publiczne komponenty `Navbar` i `Footer` korzystaja teraz z tych danych dynamicznie, z bezpiecznym fallbackiem.
- CMS admin:
  - obsluga `?section=` i zachowanie sekcji w URL,
  - szybki podglad edytowanej strony bez wychodzenia z workflow.

### Weryfikacja
- Lint dotknietych plikow frontend: OK.
- E2E smoke (admin + grafiki/logowanie): zielone.

### Ryzyko rezydualne
- Pelna funkcjonalnosc zapis/odczyt CMS zalezy od stabilizacji backend watch (`apps/api`) opisanej w sekcji blokerow.

## 9) Aktualizacja 2026-05-06 (Frontend funnel + stabilizacja Docker live)
### Wdrozone poprawki
- Domknieto przeplyw **uzytkownik -> panel admina** dla leadow:
  - formularze `/`, `/kontakt`, `/dla-firm` zapisują dane do `POST /leads`,
  - `/admin/leady` pokazuje dodatkowe informacje operacyjne (`phone`, `route`).
- Wdrozono pelny frontend resetu hasla:
  - nowa strona `/reset-hasla` (request + confirm),
  - podpiecie z `/logowanie`.
- Naprawiono krytyczny problem Next 16 w Docker dev:
  - dodano `allowedDevOrigins` w `next.config.ts`,
  - przywrocono poprawna hydracje klienta dla hosta `127.0.0.1` (koniec degradacji formularzy do natywnego `GET`).
- Usunieto bloker API watch:
  - poprawki DI (`DocumentsService`, `AnalyticsService`) przywrocily stabilny start `apps/api`.
- Przywrocono sprawnosc auth DB-only:
  - runtime schema `users` uzupelniono o kolumny wymagane przez aktualny kod (`auth_provider`, `external_id`, `api_key`) i indeksy.

### Weryfikacja
- Playwright Docker (`localhost:3000`):
  - `auth-reset.spec.ts`, `lead-funnel.spec.ts`, `admin-navigation.spec.ts`: `3/3` pass,
  - `admin-and-graphics.spec.ts`: `6/6` pass.
- Ręczny smoke API:
  - `POST /auth/register`: `201`,
  - `POST /auth/login`: `201`,
  - `POST /auth/password-reset/request`: `201`,
  - `POST /leads`: `201`.

### Ryzyko rezydualne
- Czesci endpointow i modulow legacy nadal wymagaja pelnej synchronizacji migracyjnej DB (zalecenie: uporzadkowany pipeline migracji zamiast hotfixow runtime).

## 10) Aktualizacja 2026-05-06 (Frontend visual management z panelu admina)
### Wdrozone poprawki
- Rozszerzono sekcje `home` w CMS o zarzadzanie grafikami:
  - hero (`heroVisualImage`, `heroVisualCaption`),
  - wsparcie (`supportVisualImage`),
  - CTA (`ctaVisualImage`),
  - avatary testimoniali (`avatarImage`).
- Publiczna strona glowna renderuje te media z fallbackiem do lokalnych assetow, co eliminuje ryzyko pustych grafik.
- Dodano i podpieto lokalne obrazy (`/images/*`) tak, aby dzialaly stabilnie na `localhost:3000` w Docker.
- Usunieto warning Next 16 dotyczacy `<script>` w komponencie React (`AppShell` -> `useEffect`).
- Usunieto warningi renderu ikon platnosci na logowaniu przez stabilizacje parametrow `next/image`.
- Usunieto bloker kompilacji segmentu admin (`/admin/zamowienia`), ktory po restarcie potrafil powodowac `404` na trasach panelu.

### Weryfikacja
- ESLint: dotkniete pliki web + api przechodza bez errorow.
- Playwright Docker: `admin-and-graphics` + `admin-navigation` -> `7/7` pass.
- W testach admin navigation dodano asercje obecnosci nowych pol CMS grafik.

### Ryzyko rezydualne
- CMS nadal przechowuje URL obrazow jako wolny tekst; zalecane jako kolejny krok:
  - walidacja dozwolonych hostow / sciezek,
  - dedykowany upload manager dla admina (zamiast manualnego URL).

## 11) Aktualizacja 2026-05-06 (CMS media upload + upsert odporny na pusta tabele)
### Problem (HIGH)
- Przy pustej tabeli `cms_pages` panel `/admin/cms` wizualnie dzialal, ale:
  - pola nie utrzymywaly zmian,
  - `PUT /cms/pages/:slug` zwracal `404`,
  - realne sterowanie frontendem z panelu admina bylo zablokowane.

### Implementacja naprawy
- Frontend CMS:
  - lokalny fallback tworzy wpis sekcji przy pierwszej edycji (`slug`, `title`, `content`) zamiast no-op.
  - `handleSave` wysyla zawsze sensowny `title` (fallback do etykiety sekcji), co stabilizuje pierwszy zapis.
  - dodano komponent `HomeImageFieldEditor` (upload + URL + preview + restore default).
- Backend CMS:
  - `PUT /cms/pages/:slug` zmieniono na tryb upsert:
    - update jesli rekord istnieje,
    - insert jesli brak,
    - fallback update przy konflikcie rownoleglym.
  - audit log rozroznia `cms.page_updated` i `cms.page_created`.

### Wplyw na system
- Przeplyw **uzytkownik -> admin -> frontend** dla zarzadzania grafika i trescia homepage jest domkniety bez re-seedingu DB.
- Pierwsza publikacja z panelu admina odtwarza rekordy CMS i odblokowuje kolejne edycje.

### Weryfikacja
- Docker live (`localhost:3000`) po restarcie `web` i `api`: OK.
- E2E:
  - `tests/e2e/admin-navigation.spec.ts`: `2/2` pass (w tym upload + publish + cleanup),
  - `tests/e2e/admin-and-graphics.spec.ts`: `6/6` pass.
- API smoke:
  - `GET /cms/pages` po publikacji zawiera rekord `home`.

### Ryzyko rezydualne
- Brak twardego ograniczenia liczby plikow w bibliotece mediów (zalecane: limit + cleanup policy).
- URL mediów nadal może wskazywać zewnętrzny host; rekomendowana whitelista źródeł.

## 12) Status zamkniecia zakresu (wymagania user-facing/admin)
Stan na 2026-05-06:
- **Formularze user-facing -> `/leads`**: zamkniete i zweryfikowane (`/kontakt`, homepage support, `/dla-firm`).
- **Reset hasla + link z logowania**: zamkniete i zweryfikowane (`/reset-hasla`, link z `/logowanie`).
- **E2E dla nowych flow na Docker localhost:3000**: zamkniete i zweryfikowane.
  - `lead-funnel.spec.ts`: PASS
  - `auth-reset.spec.ts`: PASS
- **Dokumentacja `docs/audit`**: uzupelniona wpisem finalizujacym bez powielania szczegolow implementacji.

## 13) Walidacja wszystkich sekcji CMS (admin -> frontend) na Docker
### Wynik
- `13/13` sekcji przeszło pełny scenariusz:
  1. wejście do sekcji w `/admin/cms`,
  2. edycja treści,
  3. publikacja,
  4. weryfikacja zmiany na odpowiadającej stronie frontend,
  5. rollback wartości.

### Naprawiony problem krytyczny
- Przyczyną wcześniejszego braku reakcji frontendu był błędny URL API po stronie serwera Next.js w Docker (`localhost` z perspektywy kontenera `web`).
- Dodano rozdzielenie URL:
  - `NEXT_PUBLIC_API_URL` dla przeglądarki,
  - `API_URL_INTERNAL=http://api:4000` dla renderowania serwerowego.
- Po poprawce publikacja z panelu admina jest widoczna na frontendzie bez opóźnień cache.

## 14) Aktualizacja 2026-05-06 (wyrównanie strony głównej)
### Problem
- Hero na stronie głównej był wizualnie nierówny: lewa kolumna (headline + CTA) była osadzona zbyt nisko względem prawej kolumny (obraz + kalkulator), co tworzyło duży pusty obszar u góry.

### Przyczyna
- Siatka hero używała `items-center`, a prawa kolumna była znacznie wyższa od lewej.
- Dodatkowo cała prawa kolumna miała animację `animate-float`, co potęgowało wrażenie „rozjechania”.

### Wdrożone poprawki
- Hero grid: zmiana wyrównania pionowego z `items-center` na `items-start`.
- Usunięcie `animate-float` z kontenera prawej kolumny hero.
- Przebudowa hero na układ dwuczęściowy:
  - górny pas: treść + obraz,
  - dolny pas: pełnoszeroka sekcja `Błyskawiczna wycena` (bez wąskiej kolumny bocznej).
- Ujednolicenie poziomych odstępów między sekcjami homepage (`px-4 sm:px-6 lg:px-8`).
- Dopracowanie responsywności CTA (padding, promienie, skalowanie typografii).
- Stabilizacja fallbacku grafik CMS bez `setState` w `useEffect` (bez kaskadowych renderów).

### Weryfikacja
- Docker live: `docker compose up -d --build web` (zaktualizowane i uruchomione na `localhost:3000`).
- Screenshoty Playwright:
  - desktop: `1920x1080`, `1280x900`,
  - mobile: `375x900`.
- Wynik: hero i sekcje są wyrównane i spójne wizualnie.

## 15) Aktualizacja 2026-05-06 (functional quote intake na homepage)
### Problem
- Sekcja `Błyskawiczna wycena` była zbyt uproszczona i nie zbierała pełnego zestawu danych do realnej wyceny (m.in. brakowało jawnej obsługi części pól oraz kompletnego przekazania parametrów do `/wycena`).

### Wdrożone poprawki
- Rozbudowano formularz o kluczowe dane operacyjne:
  - trasa: kod pocztowy + kraj (nadanie i dostawa),
  - parametry ładunku: liczba palet, waga jednej palety, długość/szerokość/wysokość,
  - warunki przewozu: piętrowanie, delikatny towar, ADR, nadawca/odbiorca prywatny.
- Dla standardowych typów palet długość i szerokość uzupełniane są automatycznie z presetów; dla `custom` pozostają edytowalne.
- Uspójniono walidację danych:
  - dodano `palletCount` do Zod (1-33),
  - usunięto blokujący gap formularza związany z wymaganymi wymiarami.
- Zintegrowano dane z flow wyników:
  - `/wycena` pobiera i przekazuje komplet parametrów do API `/quotes`,
  - liczba palet wpływa na wagę kalkulacyjną requestu (`weightPerPallet * palletCount`),
  - sekcja konfiguracji na `/wycena` prezentuje rozszerzony zestaw danych wejściowych.

### Weryfikacja
- Docker live po `docker compose up -d --build web`: OK (`localhost:3000`).
- E2E Docker:
  - `tests/e2e/quote.spec.ts`: `2/2` pass (w tym flow szybkiej wyceny),
  - `tests/e2e/visual-routes.spec.ts`: `3/3` pass.

## 16) Aktualizacja 2026-05-06 (stabilizacja podglądu ładunku + responsywność sekcji)
### Problem
- Podgląd ładunku był zbyt mały względem kontenera i sprawiał wrażenie pustej sekcji.

### Wdrożone poprawki
- Przebudowano komponent preview:
  - skalowanie wymiarów z clamp i rozsądnymi minimami/maksimami,
  - poprawiona perspektywa 3D (`perspective` + `transformStyle: preserve-3d`),
  - czytelniejsze elementy bryły (front/top/side), cień i grid tła,
  - stały panel informacji (typ palety + wymiary) widoczny również na mobile.
- Dostosowano panel kosztu do układu responsywnego:
  - mobile: układ pionowy,
  - desktop: trzy segmenty w jednej linii.

### Weryfikacja
- Docker live (`localhost:3000`) po przebudowie kontenera `web`: OK.
- E2E Docker:
  - `tests/e2e/quote.spec.ts`: `2/2` pass,
  - `tests/e2e/visual-routes.spec.ts`: `3/3` pass.

## 17) Aktualizacja 2026-05-06 (mikro-optymalizacje desktop/mobile homepage)
### Problem
- Po poprzedniej stabilizacji nadal widoczne byly nadmiarowe odstepy i zbyt "duza" skala niektorych elementow na mobile (szczegolnie testimonials/support/CTA).
- Podglad ladunku nadal mogl wygladac na zbyt maly wzgledem dostepnej powierzchni.

### Wdrozone poprawki
- **Pallet preview**:
  - zwiekszono zakresy normalizacji wymiarow bryly 3D (`clamp`) i wysokosc kontenera, aby lepiej wypelnic sekcje.
- **Homepage responsiveness**:
  - ograniczono pionowe odstępy na mniejszych viewportach w kluczowych sekcjach,
  - dostrojono wielkosci naglowkow, tekstow i CTA na telefonach,
  - zoptymalizowano sekcje opinii: paddings, radius, typografie cytatu, rozmiary avatarow,
  - dodano `aria-label` do przyciskow poprzednia/nastepna opinia.

### Weryfikacja
- Lint (dotkniete pliki): OK.
- E2E Docker:
  - `tests/e2e/quote.spec.ts`: `2/2` pass,
  - `tests/e2e/visual-routes.spec.ts`: `3/3` pass.
- Wizualna walidacja screenshotami Playwright dla: `375`, `768`, `1280`, `1920`.

## 18) Aktualizacja 2026-05-06 (automatyczny guard regresji layoutu sekcji wyceny)
### Cel
- Zmniejszenie ryzyka ponownego "rozjechania" sekcji `Błyskawiczna wycena` po kolejnych zmianach frontendu.

### Wdrozenie
- Rozszerzono `tests/e2e/quote.spec.ts` o test responsywnosci sekcji wyceny dla viewportow:
  - `375x812`,
  - `768x1024`,
  - `1280x900`,
  - `1920x1080`.
- Test waliduje:
  - obecność kluczowych elementów (`Podgląd ładunku`, etykieta wymiarów, przycisk CTA),
  - minimalną szerokość renderowanej sekcji kalkulatora,
  - brak poziomego overflow dokumentu.
- Dodano helper akceptacji cookies dla stabilnego przebiegu testów.

### Weryfikacja
- `npm run test:e2e:docker --workspace apps/web -- tests/e2e/quote.spec.ts` => `3/3` pass.
- `npm run test:e2e:docker --workspace apps/web -- tests/e2e/admin-navigation.spec.ts` => `2/2` pass (potwierdzony przeplyw admin -> frontend).
