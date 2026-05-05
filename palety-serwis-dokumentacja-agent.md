# Dokumentacja Serwisu Wysyłki Palet — Instrukcja dla Agenta AI

> **Wersja:** 1.0 | **Język docelowy:** Polski | **Typ produktu:** Web App B2B — broker przesyłek paletowych
> **Stack docelowy:** Next.js 15 + TypeScript + NestJS + PostgreSQL + Redis

---

## 1. Cel i kontekst projektu

Zbuduj kompletny serwis webowy do wyceny, zamawiania i śledzenia przesyłek **wyłącznie paletowych** — działający jako broker/porównywarka przewoźników paletowych na rynku polskim.

### 1.1 Pozycjonowanie produktu

- **Nie** kopiuj Furgonetki ani epaka 1:1.
- Bądź **specjalistą od palet** — to Twoja jedyna kategoria. Żadnych paczek, kopert, automatów paczkowych.
- Przewaga nad generalnymi brokerami: prostszy UX, mniej błędów kwalifikacji, lepsza treść SEO, pełna czytelność limitów per przewoźnik.
- Docelowy klient: firma (B2B) lub klient indywidualny wysyłający duże ładunki — hurtownie, producenci, e-commerce z ciężkim towarem, warsztaty, sklepy budowlane, importerzy.

### 1.2 Typy palet obsługiwanych przez serwis

| Typ palety | Wymiary podstawy | Max. wysokość (typowo) | Max. waga (typowo) |
|---|---|---|---|
| Paleta Euro (EUR/EPAL) | 120 cm × 80 cm | 180–210 cm | 700–1000 kg |
| Półpaleta Euro | 80 cm × 60 cm | 160–180 cm | 200 kg |
| Paleta przemysłowa | 120 cm × 100 cm lub 120 cm × 120 cm | 180 cm | 200–1000 kg |
| Półpaleta przemysłowa | 120 cm × 100 cm | 180 cm | 200 kg |
| Paleta niestandardowa | dowolne | — | — → tryb zapytania |

> **Reguła krytyczna:** jeśli parametry przekraczają limity automatycznej wyceny któregokolwiek przewoźnika, system NIE wyświetla błędnej ceny — przełącza użytkownika na formularz **„Wycena indywidualna"**.

### 1.3 Rynki docelowe (MVP)

- Polska — przesyłki krajowe
- Polska ↔ Niemcy — kierunek zagraniczny nr 1

---

## 2. Mapa strony (Sitemap)

```
/ ......................................... Strona główna (Home)
/wycena ................................... Kalkulator wyceny
/zamowienie ............................... Checkout — wizard zamówienia
/zamowienie/potwierdzenie ................. Potwierdzenie złożenia zamówienia
/sledzenie ................................ Tracking
/dla-firm ................................. Landing B2B
/typy-palet ............................... Hub typów palet
/typy-palet/paleta-euro ................... Strona SEO — Paleta Euro
/typy-palet/polpaleta-euro ................ Strona SEO — Półpaleta Euro
/typy-palet/paleta-przemyslowa ............ Strona SEO — Paleta przemysłowa
/typy-palet/paleta-niestandardowa ......... Strona SEO — Paleta niestandardowa
/jak-przygotowac-palete ................... Poradnik pakowania
/cennik ................................... Cennik orientacyjny i dopłaty
/blog ..................................... Lista artykułów
/blog/[slug] .............................. Artykuł blogowy
/faq ...................................... Często zadawane pytania
/kontakt .................................. Strona kontaktowa / formularz
/regulamin ................................ Regulamin serwisu
/polityka-prywatnosci ..................... Polityka prywatności / RODO
/reklamacje ............................... Procedura reklamacyjna

--- STREFY CHRONIONE ---

/konto .................................... Dashboard klienta
/konto/historia ........................... Historia przesyłek
/konto/nowe-zamowienie .................... Skrót do kalkulatora
/konto/adresy ............................. Książka adresowa
/konto/szablony-palet ..................... Zapisane szablony palet
/konto/faktury ............................ Faktury i płatności
/konto/reklamacje ......................... Moje reklamacje

/admin .................................... Panel administracyjny
/admin/cenniki ............................ Zarządzanie cennikami
/admin/przewoznicy ........................ Zarządzanie przewoźnikami
/admin/zamowienia ......................... Lista zamówień
/admin/leady .............................. Leady z formularzy niestandardowych
/admin/cms ................................ CMS treści i artykułów
/admin/kupony ............................. Kody rabatowe
/admin/ustawienia ......................... Ustawienia globalne
```

---

## 3. User Flows

### Flow 1 — Szybka wycena (gość, bez logowania)

```
[Strona główna]
  → Kalkulator w hero sekcji
  → Wypełnij: typ palety / kod pocztowy nadania / kod pocztowy doręczenia / waga / wysokość
  → Kliknij "Wycen przesyłkę"
  → Wynik: lista ofert przewoźników z ceną, ETA, ograniczeniami i dopłatami
  → Kliknij "Zamów" przy wybranej ofercie
  → Redirect: /zamowienie (krok 1)
```

### Flow 2 — Zamówienie (klient zalogowany)

```
Krok 1: Parametry ładunku (wstępnie wypełnione z kalkulatora)
  → Walidacja wymiarów/wagi per przewoźnik
  → Sygnalizacja: standard / niestandardowy
Krok 2: Dane nadawcy
  → Adres z książki adresowej lub nowy
Krok 3: Dane odbiorcy
  → Adres z książki adresowej lub nowy
  → Tryb: firma / osoba prywatna (dopłata za dostawę na adres prywatny)
Krok 4: Usługi dodatkowe
  → Ubezpieczenie (kwota), pobranie, winda, awizacja, dokumenty eksportowe
Krok 5: Podsumowanie i płatność
  → Wyświetl cenę netto/brutto ze wszystkimi dopłatami
  → Metody płatności: Przelewy24/Stripe/przelew
Krok 6: Potwierdzenie
  → Numer zlecenia, etykieta do pobrania, tracking link
  → E-mail z potwierdzeniem
```

### Flow 3 — Paleta niestandardowa

```
Użytkownik wypełnia kalkulator
  → Parametry przekraczają limity
  → System wyświetla komunikat z wyjaśnieniem dlaczego jest niestandardowa
  → Przycisk: "Wyślij zapytanie ofertowe"
  → Formularz: dane kontaktowe, opis ładunku, terminy, uwagi
  → Submit → lead trafia do /admin/leady
  → Auto-email do klienta: "Skontaktujemy się w ciągu 2 godzin w dni robocze"
```

### Flow 4 — Rejestracja firmy

```
Kliknij "Zarejestruj się" → /rejestracja
  → E-mail + hasło (lub magic link)
  → Dane firmy: NIP, nazwa, adres
  → Akceptacja regulaminu i RODO
  → E-mail weryfikacyjny → link aktywacyjny
  → Redirect: /konto/dashboard
```

### Flow 5 — Tracking bez logowania

```
Strona główna lub /sledzenie
  → Pole: "Wpisz numer przesyłki"
  → Wyświetl: oś czasu ze statusami, ostatnia pozycja, ETA
  → Opcja powiadomień e-mail/SMS o zmianie statusu
```

### Flow 6 — Ponów zamówienie

```
/konto/historia → Lista zamówień
  → Kliknij "Ponów" przy wybranym zamówieniu
  → Formularz pre-filled danymi z poprzedniej przesyłki
  → Możliwość edycji przed złożeniem
  → Checkout od kroku 5 (podsumowanie + płatność)
```

---

## 4. Wymagania funkcjonalne

### 4.1 Kalkulator wyceny

- **Pola obowiązkowe:**
  - Typ palety (dropdown: Euro / Półpaleta Euro / Przemysłowa / Półpaleta Przemysłowa / Niestandardowa)
  - Kod pocztowy nadania (+ kraj: PL / DE)
  - Kod pocztowy doręczenia (+ kraj: PL / DE)
  - Waga brutto (kg)
  - Wysokość całkowita z towarem (cm)
- **Pola opcjonalne:**
  - Towar piętrowalny (tak/nie)
  - Towar delikatny / kruchy
  - Towary niebezpieczne ADR (tak/nie)
  - Odbiór: firma / adres prywatny
  - Doręczenie: firma / adres prywatny
  - Usługi dodatkowe (lista checkboxów)
- **Wynik:**
  - Lista kart przewoźników: logo, cena netto + VAT, ETA (np. „1–2 dni robocze"), dostępne usługi dodatkowe, ewentualne ograniczenia
  - Sortowanie: domyślnie po cenie rosnąco; opcja: po czasie dostawy
  - Filtr: tylko dostępni przewoźnicy
- **Walidacja:**
  - Jeśli wymiary/waga > limit przewoźnika → nie pokazuj tej oferty lub pokaż z informacją o niestandardzie
  - Jeśli ŻADEN przewoźnik nie obsługuje parametrów → pełny redirect do flow niestandardowego

### 4.2 Wizard zamówienia

- Wieloetapowy (6 kroków jak w sekcji 3 Flow 2)
- Progress bar na górze (widoczny na każdym kroku)
- Wróć do poprzedniego kroku bez utraty danych
- Walidacja inline (przy blur z pola), nie tylko przy submit
- Dane sesji trzymane w pamięci aplikacji React (nie localStorage)
- Podsumowanie zamówienia stale widoczne w sticky sidebar (desktop) lub pod formularzem (mobile)

### 4.3 Panel klienta

- **Dashboard:** ostatnie 5 przesyłek, skrót do nowego zamówienia, powiadomienia
- **Historia zamówień:** tabela z filtrowaniem (status, data, numer), paginacja, eksport CSV
- **Szczegóły zamówienia:** pełne dane, oś czasu, etykieta PDF, faktura PDF, akcje (anuluj, reklamuj, ponów)
- **Książka adresowa:** CRUD adresów, oznaczanie domyślnych nadawcy/odbiorcy
- **Szablony palet:** zapisane konfiguracje ładunków do szybkiego ponownego użycia
- **Faktury:** lista, pobierz PDF, status płatności
- **Reklamacje:** formularz, status rozpatrzenia, historia komunikacji

### 4.4 Panel admina

- **Zarządzanie przewoźnikami:** włącz/wyłącz, tabele limitów, credentiale API
- **Cenniki:** edytor reguł cenowych (base price + dopłaty: strefa, waga, wysokość, adres prywatny, winda, pobranie, ubezpieczenie), wersjonowanie zmian
- **Reguły marży:** per przewoźnik, per typ palety, per strefa
- **Zamówienia:** lista wszystkich, zmiana statusu, notatki wewnętrzne, eksport
- **Leady (zapytania niestandardowe):** widok leadów, przypisanie do handlowca, status, notatki, odpowiedź z wycenę
- **CMS:** WYSIWYG do artykułów blogowych, FAQ, stron SEO; zarządzanie meta tags
- **Kody rabatowe:** tworzenie, limity użycia, daty ważności
- **Audit log:** historia zmian cen i statusów zamówień

### 4.5 Tracking

- Ujednolicony model statusów wewnętrznych (niezależny od nomenklatury przewoźnika):
  `CREATED → PICKED_UP → IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED | EXCEPTION`
- Oś czasu z ikonami i znacznikami czasu
- Subskrypcja powiadomień e-mail/SMS per etap
- Tracking bez logowania (publiczny, po numerze przesyłki)

### 4.6 Płatności

- Obsługiwane metody: Przelewy24 lub Stripe Payments + przelew bankowy (dla firm z limitem kredytowym)
- Faktura VAT generowana automatycznie po opłaceniu zamówienia
- Dla klientów firmowych: opcja limitu kredytowego (płatność po dostawie)

### 4.7 Powiadomienia

- E-mail transakcyjny (SendGrid / Postmark):
  - Rejestracja (potwierdzenie e-mail)
  - Potwierdzenie zamówienia + etykieta
  - Odbiór przez kuriera
  - Dostawa
  - Reklamacja otwarta / zamknięta
  - Faktura do zapłaty (limit kredytowy)
- SMS (Twilio lub polskie API): Odbiór i Dostawa (opcjonalne, opt-in)

---

## 5. Wymagania niefunkcjonalne

| Obszar | Wymaganie |
|---|---|
| Dostępność | WCAG 2.1 poziom AA |
| Performance | Core Web Vitals: LCP < 2.5 s, INP < 200 ms, CLS < 0.1 |
| SEO | SSR/SSG dla wszystkich stron publicznych; meta tags dynamiczne; sitemap.xml; robots.txt |
| Responsywność | Mobile-first; breakpointy: 375px, 768px, 1024px, 1280px+ |
| Bezpieczeństwo | HTTPS, CSRF protection, rate limiting na endpointach wyceny i auth |
| Audit log | Każda zmiana ceny i statusu zamówienia zapisana z timestampem i user ID |
| Monitoring | Logi błędów + retry dla webhooków trackingowych; alerty na błędy integracji |
| RODO | Polityka prywatności, zgody marketingowe, mechanizm usunięcia konta |

---

## 6. Design System

### 6.1 Kierunek artystyczny

```css
/* Art direction: broker logistyczny B2B → zaufanie, precyzja, efektywność
   Palette: neutral warm surfaces + deep navy/teal accent
   Typography: display — Satoshi Bold; body — General Sans Regular
   Density: balanced — dużo whitespace w hero, dense w tabelach i formularzach */
```

### 6.2 Tokeny kolorów (Light Mode)

```css
:root {
  /* Surfaces */
  --color-bg:             #f5f6f8;
  --color-surface:        #ffffff;
  --color-surface-2:      #f9fafb;
  --color-surface-offset: #eef0f3;
  --color-divider:        #dde0e5;
  --color-border:         #d1d5db;

  /* Text */
  --color-text:           #111827;
  --color-text-muted:     #6b7280;
  --color-text-faint:     #9ca3af;
  --color-text-inverse:   #ffffff;

  /* Primary accent — deep teal */
  --color-primary:        #0e6c73;
  --color-primary-hover:  #0a555b;
  --color-primary-active: #073d42;
  --color-primary-highlight: #d1ecee;

  /* Success */
  --color-success:        #15803d;
  --color-success-highlight: #dcfce7;

  /* Warning */
  --color-warning:        #b45309;
  --color-warning-highlight: #fef3c7;

  /* Error */
  --color-error:          #b91c1c;
  --color-error-highlight: #fee2e2;

  /* Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(17,24,39,0.06);
  --shadow-md: 0 4px 12px rgba(17,24,39,0.08);
  --shadow-lg: 0 12px 32px rgba(17,24,39,0.12);
}
```

### 6.3 Typografia

```css
/* Fontshare */
/* https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&f[]=general-sans@400,500&display=swap */

:root {
  --font-display: 'Satoshi', 'Inter', sans-serif;
  --font-body:    'General Sans', 'Inter', sans-serif;
}

/* Skala typograficzna */
:root {
  --text-xs:   clamp(0.75rem,  0.7rem  + 0.25vw, 0.875rem);
  --text-sm:   clamp(0.875rem, 0.8rem  + 0.35vw, 1rem);
  --text-base: clamp(1rem,     0.95rem + 0.25vw, 1.125rem);
  --text-lg:   clamp(1.125rem, 1rem    + 0.75vw, 1.5rem);
  --text-xl:   clamp(1.5rem,   1.2rem  + 1.25vw, 2.25rem);
  --text-2xl:  clamp(2rem,     1.2rem  + 2.5vw,  3.5rem);
}
```

**Zasady:**
- Display font (`Satoshi`) → wyłącznie dla `h1`, `h2`, hero headingów; minimum `--text-xl` (24px)
- Body font (`General Sans`) → cały tekst poniżej 24px: body, przyciski, labele, tabele, formularze
- Web app caps: maksymalny heading `--text-xl` na stronach funkcjonalnych (kalkulator, panel, checkout)
- Hero na stronie głównej i stronach SEO może używać `--text-2xl`

### 6.4 Komponenty UI (lista do zaimplementowania)

```
[ ] Button — primary, secondary, ghost, destructive, loading state
[ ] Input — text, number, select, checkbox, radio — z labelem, placeholderem, walidacją inline
[ ] Card — karta przewoźnika (logo, cena, ETA, usługi, CTA)
[ ] PalletTypeSelector — wielki selector z ikonami typów palet
[ ] ZoneInput — pole kodu pocztowego z walidacją strefy kurierskiej
[ ] PriceResult — lista wyników wyceny z sortowaniem
[ ] StepWizard — progress bar + nawigacja krokami
[ ] TrackingTimeline — oś czasu przesyłki
[ ] DataTable — tabela z sortowaniem, filtrowaniem, paginacją
[ ] StatusBadge — chip statusu przesyłki
[ ] Modal — dialog z tytułem i przyciskiem zamknięcia
[ ] Toast — powiadomienie tymczasowe (tylko dla nieważnych info)
[ ] SkeletonLoader — shimmer dla ładujących się danych
[ ] EmptyState — animowana ikonka + wiadomość + CTA
[ ] FAQ Accordion
[ ] PalletLimitTable — tabela limitów per przewoźnik
[ ] AddressCard — karta adresu z akcjami edit/delete/default
[ ] FileDownload — przycisk pobierania etykiety / faktury
[ ] LeadForm — formularz zapytania o wycenę niestandardową
[ ] ThemeToggle — przełącznik dark/light mode
```

### 6.5 UX — reguły krytyczne

1. **Hero = kalkulator** — kalkulator musi być widoczny bez scrollowania na desktop (1280px) i powinien być pierwszym elementem po navbarze
2. **Krok 1 formularza = kwalifikacja palety** — użytkownik musi rozumieć typ swojej palety ZANIM poda wymiary; umieść mini-legendę z rysunkami
3. **Błędy muszą być konkretne**: nie `"Błąd walidacji"`, tylko `"Waga 1200 kg przekracza limit 1000 kg dla DHL. Wycenę na zapytanie znajdziesz poniżej."`
4. **Nie mieszaj kategorii** — na żadnej stronie serwisu nie pojawia się słowo „paczka", „koperta" ani „kurier paczek" — serwis to broker **palet**
5. **Dopłaty transparentne** — każda cena w wycenie musi mieć rozwijany breakdown: cena bazowa + lista dopłat z kwotami
6. **Limity czytelne per przewoźnik** — na każdej stronie z wynikami wyceny i na `/typy-palet` widoczna tabela limitów per carrier
7. **Social proof B2B** — liczba obsłużonych palet, opinie firm (nie konsumentów), loga partnerów
8. **Mobile one-thumb** — wszystkie główne CTA w zasięgu kciuka na 375px; sticky bottom bar na mobile dla checkoutu

---

## 7. Architektura techniczna

### 7.1 Stos technologiczny

| Warstwa | Technologia | Uzasadnienie |
|---|---|---|
| Frontend | Next.js 15, TypeScript, App Router | SSR/SSG, SEO, server components |
| UI | Tailwind CSS 4, własne tokeny | Szybkość, design system bez gotowego template |
| State management | Zustand | Lekki, bez boilerplate, dobry do wizard flows |
| Formularze | React Hook Form + Zod | Walidacja inline, schema-first |
| Backend | NestJS, TypeScript | Modularna architektura, dobra do wielu integracji |
| ORM | Drizzle ORM | Type-safe, dobry z PostgreSQL |
| Baza danych | PostgreSQL | ACID, JSON columns dla danych zewnętrznych |
| Cache / Queue | Redis + BullMQ | Cache wyników wyceny, kolejki webhooków trackingowych |
| Storage | MinIO lub AWS S3 | Etykiety PDF, faktury PDF, załączniki |
| Auth | NextAuth.js v5 (lub własne JWT) | E-mail + hasło + magic link |
| Płatności | Stripe lub Przelewy24 | Webhook-driven, automatyczne faktury |
| E-mail | Resend lub Postmark | Transakcyjny, wysoka dostarczalność |
| Monitoring | Sentry + Prometheus + Grafana | Błędy + metryki |

### 7.2 Struktura katalogów — Frontend

```
apps/web/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                  # Strona główna
│   │   ├── wycena/page.tsx           # Kalkulator
│   │   ├── zamowienie/
│   │   │   ├── page.tsx              # Checkout wizard
│   │   │   └── potwierdzenie/page.tsx
│   │   ├── sledzenie/page.tsx
│   │   ├── dla-firm/page.tsx
│   │   ├── typy-palet/
│   │   │   ├── page.tsx              # Hub
│   │   │   └── [slug]/page.tsx       # Strona per typ palety
│   │   ├── jak-przygotowac-palete/page.tsx
│   │   ├── cennik/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── kontakt/page.tsx
│   │   ├── regulamin/page.tsx
│   │   ├── polityka-prywatnosci/page.tsx
│   │   └── reklamacje/page.tsx
│   ├── (auth)/
│   │   ├── logowanie/page.tsx
│   │   └── rejestracja/page.tsx
│   ├── (dashboard)/
│   │   └── konto/
│   │       ├── page.tsx              # Dashboard
│   │       ├── historia/page.tsx
│   │       ├── adresy/page.tsx
│   │       ├── szablony-palet/page.tsx
│   │       ├── faktury/page.tsx
│   │       └── reklamacje/page.tsx
│   └── (admin)/
│       └── admin/
│           ├── page.tsx
│           ├── cenniki/page.tsx
│           ├── przewoznicy/page.tsx
│           ├── zamowienia/page.tsx
│           ├── leady/page.tsx
│           ├── cms/page.tsx
│           ├── kupony/page.tsx
│           └── ustawienia/page.tsx
├── components/
│   ├── ui/                           # Atomy: Button, Input, Badge, Card itd.
│   ├── calculator/                   # PalletTypeSelector, ZoneInput, PriceResult
│   ├── checkout/                     # StepWizard, kroки formularza
│   ├── tracking/                     # TrackingTimeline
│   ├── dashboard/                    # DataTable, StatusBadge, AddressCard
│   ├── admin/                        # Tabele admina, edytory CMS
│   └── layout/                       # Navbar, Footer, Sidebar
├── lib/
│   ├── api/                          # Klient HTTP do backendu
│   ├── validators/                   # Schematy Zod
│   ├── utils/
│   └── constants/                    # Limity palet per przewoźnik (front-side walidacja)
└── styles/
    ├── globals.css                   # Tokeny, base reset
    └── components.css
```

### 7.3 Struktura katalogów — Backend

```
apps/api/
└── src/
    ├── modules/
    │   ├── quote-engine/             # Silnik wycen
    │   │   ├── quote.controller.ts
    │   │   ├── quote.service.ts
    │   │   ├── quote.module.ts
    │   │   └── dto/
    │   ├── carrier-connectors/       # Adaptery do API przewoźników
    │   │   ├── carriers.module.ts
    │   │   ├── interfaces/carrier.interface.ts
    │   │   ├── dpd/
    │   │   ├── dhl/
    │   │   ├── fedex/
    │   │   └── ambro/
    │   ├── orders/                   # Zamówienia i workflow
    │   ├── tracking/                 # Aggregator statusów
    │   ├── billing/                  # Płatności i faktury
    │   ├── accounts/                 # Users, Companies, Auth
    │   ├── cms/                      # Strony, artykuły
    │   ├── admin/                    # Admin endpoints
    │   ├── lead-management/          # Zapytania niestandardowe
    │   └── notifications/            # E-mail, SMS
    ├── common/
    │   ├── guards/
    │   ├── interceptors/
    │   ├── filters/
    │   └── decorators/
    └── config/
```

---

## 8. Model danych (Database Schema)

### 8.1 Tabela: users

```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role          VARCHAR(50) NOT NULL DEFAULT 'customer', -- customer | sales | admin
  is_verified   BOOLEAN DEFAULT FALSE,
  company_id    UUID REFERENCES companies(id),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### 8.2 Tabela: companies

```sql
CREATE TABLE companies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255) NOT NULL,
  nip           VARCHAR(20),
  vat_eu        VARCHAR(30),
  address_line  VARCHAR(255),
  city          VARCHAR(100),
  postal_code   VARCHAR(20),
  country       VARCHAR(10) DEFAULT 'PL',
  credit_limit  DECIMAL(10,2) DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### 8.3 Tabela: addresses

```sql
CREATE TABLE addresses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  label         VARCHAR(100),
  name          VARCHAR(255) NOT NULL,
  company_name  VARCHAR(255),
  phone         VARCHAR(30),
  email         VARCHAR(255),
  address_line  VARCHAR(255) NOT NULL,
  city          VARCHAR(100) NOT NULL,
  postal_code   VARCHAR(20) NOT NULL,
  country       VARCHAR(10) DEFAULT 'PL',
  is_default_sender   BOOLEAN DEFAULT FALSE,
  is_default_recipient BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### 8.4 Tabela: pallet_templates

```sql
CREATE TABLE pallet_templates (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  name          VARCHAR(100) NOT NULL,
  pallet_type   VARCHAR(50) NOT NULL, -- euro | semi_euro | industrial | semi_industrial | custom
  length        DECIMAL(6,1),
  width         DECIMAL(6,1),
  height        DECIMAL(6,1),
  weight        DECIMAL(8,2),
  stackable     BOOLEAN DEFAULT FALSE,
  fragile       BOOLEAN DEFAULT FALSE,
  adr           BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### 8.5 Tabela: carrier_services

```sql
CREATE TABLE carrier_services (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carrier_code     VARCHAR(50) NOT NULL, -- dpd | dhl | fedex | ambro
  service_name     VARCHAR(100) NOT NULL,
  pallet_types     TEXT[] NOT NULL,      -- obsługiwane typy palet
  max_length       DECIMAL(6,1),
  max_width        DECIMAL(6,1),
  max_height       DECIMAL(6,1),
  max_weight       DECIMAL(8,2),
  countries        TEXT[],              -- ['PL', 'DE']
  is_active        BOOLEAN DEFAULT TRUE,
  base_price_rules JSONB,               -- tabela strefowa
  surcharge_rules  JSONB,               -- dopłaty
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
```

### 8.6 Tabela: quotes

```sql
CREATE TABLE quotes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES users(id),
  session_token    VARCHAR(255),         -- dla gości
  pallet_type      VARCHAR(50) NOT NULL,
  length           DECIMAL(6,1),
  width            DECIMAL(6,1),
  height           DECIMAL(6,1),
  weight           DECIMAL(8,2),
  sender_postal    VARCHAR(20),
  sender_country   VARCHAR(10),
  recipient_postal VARCHAR(20),
  recipient_country VARCHAR(10),
  options          JSONB,                -- dodatkowe opcje
  results          JSONB,                -- wyniki wyceny z API
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
```

### 8.7 Tabela: orders

```sql
CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number     VARCHAR(30) UNIQUE NOT NULL,
  user_id          UUID REFERENCES users(id),
  quote_id         UUID REFERENCES quotes(id),
  carrier_code     VARCHAR(50) NOT NULL,
  carrier_service  VARCHAR(100) NOT NULL,
  status           VARCHAR(50) DEFAULT 'PENDING',
  -- PENDING | PAID | LABEL_GENERATED | PICKED_UP | IN_TRANSIT | OUT_FOR_DELIVERY | DELIVERED | CANCELLED | EXCEPTION
  sender_address   JSONB NOT NULL,
  recipient_address JSONB NOT NULL,
  pallet_data      JSONB NOT NULL,
  additional_services JSONB,
  price_netto      DECIMAL(10,2),
  price_vat        DECIMAL(10,2),
  price_brutto     DECIMAL(10,2),
  coupon_code      VARCHAR(50),
  discount_amount  DECIMAL(10,2) DEFAULT 0,
  carrier_label_url VARCHAR(500),
  carrier_tracking_number VARCHAR(100),
  invoice_id       UUID REFERENCES invoices(id),
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
```

### 8.8 Tabela: tracking_events

```sql
CREATE TABLE tracking_events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id         UUID REFERENCES orders(id) ON DELETE CASCADE,
  internal_status  VARCHAR(50) NOT NULL,
  carrier_status   VARCHAR(100),
  carrier_status_description TEXT,
  location         VARCHAR(255),
  occurred_at      TIMESTAMPTZ NOT NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
```

### 8.9 Tabela: invoices

```sql
CREATE TABLE invoices (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number   VARCHAR(30) UNIQUE NOT NULL,
  user_id          UUID REFERENCES users(id),
  company_id       UUID REFERENCES companies(id),
  status           VARCHAR(30) DEFAULT 'UNPAID', -- UNPAID | PAID | OVERDUE
  total_netto      DECIMAL(10,2),
  total_vat        DECIMAL(10,2),
  total_brutto     DECIMAL(10,2),
  payment_method   VARCHAR(50),
  payment_id       VARCHAR(255),     -- ID z Stripe/P24
  pdf_url          VARCHAR(500),
  due_date         DATE,
  paid_at          TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
```

### 8.10 Tabela: leads

```sql
CREATE TABLE leads (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             VARCHAR(255) NOT NULL,
  email            VARCHAR(255) NOT NULL,
  phone            VARCHAR(30),
  company          VARCHAR(255),
  pallet_type      VARCHAR(100),
  description      TEXT NOT NULL,
  dimensions       VARCHAR(255),
  weight           VARCHAR(100),
  route            VARCHAR(255),
  preferred_date   DATE,
  status           VARCHAR(30) DEFAULT 'NEW', -- NEW | IN_PROGRESS | QUOTED | CLOSED_WON | CLOSED_LOST
  assigned_to      UUID REFERENCES users(id),
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
```

### 8.11 Tabela: cms_pages / cms_articles

```sql
CREATE TABLE cms_pages (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             VARCHAR(255) UNIQUE NOT NULL,
  title            VARCHAR(500) NOT NULL,
  content          TEXT,
  meta_title       VARCHAR(500),
  meta_description VARCHAR(500),
  is_published     BOOLEAN DEFAULT FALSE,
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cms_articles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             VARCHAR(255) UNIQUE NOT NULL,
  title            VARCHAR(500) NOT NULL,
  excerpt          TEXT,
  content          TEXT,
  category         VARCHAR(100),
  meta_title       VARCHAR(500),
  meta_description VARCHAR(500),
  is_published     BOOLEAN DEFAULT FALSE,
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 9. API Specification

### 9.1 Wycena

```
POST /api/quotes
Body: {
  palletType: 'euro' | 'semi_euro' | 'industrial' | 'semi_industrial' | 'custom',
  dimensions: { length: number, width: number, height: number },
  weight: number,
  sender: { postalCode: string, country: 'PL' | 'DE' },
  recipient: { postalCode: string, country: 'PL' | 'DE' },
  options?: {
    stackable?: boolean,
    fragile?: boolean,
    adr?: boolean,
    senderPrivate?: boolean,
    recipientPrivate?: boolean,
    additionalServices?: string[]
  }
}
Response: {
  quoteId: string,
  results: CarrierOffer[],
  isNonStandard: boolean,
  nonStandardReason?: string
}

GET /api/quotes/:id
```

### 9.2 Zamówienia

```
POST /api/orders                     # Utwórz zamówienie
GET  /api/orders                     # Lista zamówień użytkownika
GET  /api/orders/:id                 # Szczegóły zamówienia
POST /api/orders/:id/cancel          # Anuluj zamówienie
GET  /api/orders/:id/label           # Pobierz etykietę PDF
GET  /api/orders/:id/invoice         # Pobierz fakturę PDF

POST /api/orders/:id/payment         # Inicjuj płatność
POST /api/orders/payment/webhook     # Webhook z bramki płatności
```

### 9.3 Tracking

```
GET  /api/tracking/:trackingNumber   # Publiczny tracking
POST /api/tracking/webhooks/:carrier # Webhook statusów od przewoźnika
GET  /api/orders/:id/tracking        # Tracking dla zalogowanego użytkownika
```

### 9.4 Konto użytkownika

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/magic-link
GET  /api/auth/me

GET  /api/account/addresses
POST /api/account/addresses
PUT  /api/account/addresses/:id
DELETE /api/account/addresses/:id

GET  /api/account/pallet-templates
POST /api/account/pallet-templates
PUT  /api/account/pallet-templates/:id
DELETE /api/account/pallet-templates/:id
```

### 9.5 Admin

```
GET  /api/admin/orders               # Wszystkie zamówienia z filtrowaniem
PUT  /api/admin/orders/:id/status    # Zmień status
GET  /api/admin/leads                # Lista leadów
PUT  /api/admin/leads/:id            # Aktualizuj lead
GET  /api/admin/carriers             # Lista przewoźników
PUT  /api/admin/carriers/:id/pricing # Aktualizuj cennik
GET  /api/admin/coupons
POST /api/admin/coupons
```

### 9.6 Leady

```
POST /api/leads                      # Publiczny formularz zapytania
GET  /api/leads                      # Lista (admin)
GET  /api/leads/:id                  # Szczegóły (admin)
PUT  /api/leads/:id                  # Aktualizacja (admin)
```

---

## 10. Logika biznesowa — Quote Engine

### 10.1 Algorytm wyceny

```typescript
// Pseudokod quote engine
async function calculateQuote(params: QuoteParams): Promise<QuoteResult> {
  const carriers = await getActiveCarriers();
  const results: CarrierOffer[] = [];

  for (const carrier of carriers) {
    const eligibility = checkEligibility(carrier, params);

    if (!eligibility.eligible) {
      // Nie dodawaj tej oferty do wyników
      // Loguj powód odrzucenia do debuggingu
      continue;
    }

    const basePrice = calculateBasePrice(carrier, params);
    const surcharges = calculateSurcharges(carrier, params);
    const margin = applyMargin(carrier, basePrice + surcharges.total);
    const vatAmount = (basePrice + surcharges.total + margin) * 0.23;

    results.push({
      carrierId: carrier.id,
      carrierCode: carrier.carrierCode,
      serviceName: carrier.serviceName,
      priceNetto: basePrice + surcharges.total + margin,
      priceBrutto: basePrice + surcharges.total + margin + vatAmount,
      surchargeBreakdown: surcharges.breakdown,
      eta: carrier.getETA(params.sender.country, params.recipient.country),
      availableAdditionalServices: carrier.additionalServices
    });
  }

  const isNonStandard = results.length === 0;

  return {
    results: sortBy(results, 'priceNetto'),
    isNonStandard,
    nonStandardReason: isNonStandard ? buildNonStandardReason(carriers, params) : null
  };
}
```

### 10.2 Reguły kwalifikacji palet — dane referencyjne

```typescript
// Limity do wgrania do carrier_services jako JSONB
const CARRIER_LIMITS = {
  dhl: {
    euro: { maxHeight: 210, maxWeight: 1000, base: '120x80' },
    semi_euro: { maxHeight: 160, maxWeight: 200, base: '80x60' }
  },
  dpd: {
    euro: { maxHeight: 180, maxWeight: 700, base: '120x80' },
    // DPD: paleta musi tworzyć prostopadłościan
    note: 'Ładunek musi być prostopadłościenny'
  },
  fedex: {
    euro: { maxHeight: 180, maxWeight: 1000, base: '120x80' }
  },
  ambro: {
    euro:               { maxHeight: 180, maxWeight: 200, base: '120x80' },
    semi_euro:          { maxHeight: 180, maxWeight: 200, base: '80x60' },
    industrial:         { maxHeight: 180, maxWeight: 200, base: '120x100 / 120x120' },
    semi_industrial:    { maxHeight: 180, maxWeight: 200, base: '120x100' }
  }
};
```

### 10.3 Silnik dopłat — kategorie

Każdy przewoźnik ma tabelę JSONB `surcharge_rules` z następującymi kategoriami:

```
zone_surcharge         — dopłata strefowa (na podstawie kodu pocztowego)
weight_surcharge       — dopłata za przekroczenie wagowego progu bazowego
height_surcharge       — dopłata za przekroczenie wysokości bazowej
residential_surcharge  — dopłata za dostawę na adres prywatny
lift_surcharge         — dopłata za windę przy odbiorze lub dostawie
cod_surcharge          — dopłata za pobranie
insurance_surcharge    — procent wartości ubezpieczenia lub stała opłata
notification_surcharge — SMS / awizacja
export_docs_surcharge  — dokumenty eksportowe (trasy do Niemiec)
fuel_surcharge         — aktualny narzut paliwa (updatowany ręcznie w panelu admina)
```

---

## 11. Treści strony — copy i SEO

### 11.1 Strona główna — sekcje

**Sekcja 1: Hero**
- Nagłówek H1: `Wyślij paletę tanio i bezpiecznie`
- Podtytuł: `Porównaj oferty DHL, DPD, FedEx i innych — wybierz najlepszą cenę na transport palety.`
- Kalkulator wyceny widoczny bez scrollowania
- Nie używaj słów: paczka, kurier paczek, koperta

**Sekcja 2: Jak to działa (3 kroki)**
- Krok 1: Podaj wymiary i trasę
- Krok 2: Porównaj oferty przewoźników
- Krok 3: Zamów i czekaj na kuriera

**Sekcja 3: Typy palet (4 karty)**
- Paleta Euro, Półpaleta Euro, Paleta Przemysłowa, Niestandardowa
- Każda karta: ikona, wymiary, link do szczegółów

**Sekcja 4: Dlaczego my (social proof B2B)**
- Liczba obsłużonych palet
- Loga obsługiwanych przewoźników
- Krótka opinia firmy (nie konsumenta)

**Sekcja 5: Dla firm**
- Krótki pitch B2B + CTA do `/dla-firm`

**Sekcja 6: FAQ — top 5 pytań**

**Sekcja 7: Footer**
- Logo + tagline
- Linki: Typy palet, Cennik, Dla firm, Blog, FAQ, Kontakt, Regulamin, Polityka prywatności, Reklamacje
- Dane firmy + NIP

### 11.2 Treści SEO — artykuły do wygenerowania

| Slug | Tytuł | Fraza kluczowa |
|---|---|---|
| `/typy-palet/paleta-euro` | Paleta Euro — wymiary, waga, jak wysłać | paleta euro wymiary |
| `/typy-palet/polpaleta-euro` | Półpaleta Euro — co to jest i jak wysłać | półpaleta euro |
| `/typy-palet/paleta-przemyslowa` | Paleta przemysłowa — specyfika i transport | paleta przemysłowa |
| `/typy-palet/paleta-niestandardowa` | Paleta niestandardowa — jak wysłać i ile kosztuje | paleta niestandardowa wysyłka |
| `/jak-przygotowac-palete` | Jak przygotować paletę do wysyłki kurierem | jak przygotować paletę |
| `/cennik` | Cennik wysyłki palet 2025 — DHL, DPD, FedEx | cennik wysyłki palet |
| `/blog/rampa-rampa-burta-burta` | Rampa-Rampa vs Burta-Burta — czym się różnią | rampa rampa burta burta |
| `/blog/wysylka-palety-do-niemiec` | Wysyłka palety do Niemiec — jak to zrobić | wysyłka palety do niemiec |
| `/blog/ile-waży-paleta` | Ile waży paleta? Typy i wagi | ile waży paleta |
| `/blog/jak-zmierzyc-palete` | Jak zmierzyć paletę przed wysyłką | jak zmierzyć paletę |

### 11.3 Słownik pojęć (dla użytkownika)

Dodaj sekcję `/faq` lub tooltip w formularzu z wyjaśnieniami:

- **Paleta Euro (EUR/EPAL):** 120 × 80 cm, standard europejski, obsługiwana przez wszystkich przewoźników
- **Półpaleta Euro:** 80 × 60 cm, idealna dla mniejszych ładunków
- **Paleta przemysłowa:** 120 × 100 cm lub 120 × 120 cm, większa powierzchnia dla przemysłu
- **Rampa-Rampa:** załadunek i rozładunek po stronie klienta (wymaga rampy lub wózka widłowego)
- **Burta-Burta:** kierowca przyjeżdża pod drzwi, odpowiada za załadunek i rozładunek
- **Piętrowalność:** możliwość układania palet jedna na drugiej
- **Strefa kurierska:** obszar geograficzny wpływający na cenę dostawy

---

## 12. Backlog — Epiki i Taski MVP

### Epik 1: Infrastruktura i setup (Sprint 1)

- [ ] Monorepo: Turborepo z pakietami `web`, `api`, `shared`
- [ ] Next.js 15 + TypeScript + Tailwind 4 — setup z tokenami
- [ ] NestJS — setup z modułami
- [ ] PostgreSQL + Drizzle ORM — migracje
- [ ] Redis — setup lokalny i produkcyjny
- [ ] Docker Compose — dev environment
- [ ] CI/CD — GitHub Actions + deploy na VPS/cloud
- [ ] Zmienne środowiskowe i sekrety

### Epik 2: Design System (Sprint 1–2)

- [ ] Tokeny kolorów light/dark w globals.css
- [ ] Typografia: Satoshi + General Sans z Fontshare
- [ ] Komponenty atomowe: Button, Input, Select, Checkbox
- [ ] Komponenty złożone: Card, Modal, Toast, DataTable
- [ ] PalletTypeSelector — wielki selektor z ikonami
- [ ] ThemeToggle light/dark
- [ ] Responsive layout: Navbar + Footer
- [ ] SkeletonLoader + EmptyState

### Epik 3: Kalkulator wyceny (Sprint 2–3)

- [ ] Formularz kalkulatora — pola i walidacja Zod
- [ ] Endpoint POST /api/quotes
- [ ] Seed danych: carrier_services z limitami i regułami cenowymi
- [ ] Silnik wyceny: eligibility check + basePrice + surcharges + margin
- [ ] Komponent PriceResult — lista ofert z sortowaniem
- [ ] Breakdown dopłat (expand/collapse)
- [ ] Obsługa trybu niestandardowego — redirect do formularza
- [ ] Cache wyników wyceny w Redis (TTL: 15 min)

### Epik 4: Auth i konta (Sprint 3)

- [ ] Rejestracja: e-mail + hasło + dane firmy (NIP)
- [ ] Logowanie
- [ ] Magic link (opcjonalnie)
- [ ] E-mail weryfikacyjny
- [ ] Role: customer / sales / admin
- [ ] Middleware autoryzacji w Next.js i NestJS
- [ ] Strona /konto/dashboard — szkielet

### Epik 5: Checkout i zamówienie (Sprint 3–4)

- [ ] Wizard 6-krokowy z progress barem
- [ ] Krok 1: dane ładunku (pre-filled z kalkulatora)
- [ ] Krok 2–3: adresy z książką adresową
- [ ] Krok 4: usługi dodatkowe
- [ ] Krok 5: podsumowanie z pełnym breakdownem ceny
- [ ] Krok 6: płatność (Stripe webhook)
- [ ] Generowanie etykiety PDF po opłaceniu
- [ ] E-mail potwierdzenia z etykietą
- [ ] Strona /zamowienie/potwierdzenie

### Epik 6: Panel klienta (Sprint 4–5)

- [ ] Historia zamówień z filtrowaniem i paginacją
- [ ] Szczegóły zamówienia + oś czasu trackingu
- [ ] Pobierz etykietę / fakturę
- [ ] Anuluj zamówienie (jeśli status PENDING/PAID)
- [ ] Ponów zamówienie (pre-fill formularza)
- [ ] Książka adresowa CRUD
- [ ] Szablony palet CRUD
- [ ] Lista faktur

### Epik 7: Tracking (Sprint 5)

- [ ] Endpoint GET /api/tracking/:trackingNumber (publiczny)
- [ ] Komponent TrackingTimeline
- [ ] Strona /sledzenie
- [ ] Webhook odbiornik od przewoźników → BullMQ
- [ ] Mapowanie statusów zewnętrznych na wewnętrzny model
- [ ] Powiadomienia e-mail przy zmianie statusu (opt-in)

### Epik 8: Leady niestandardowe (Sprint 5)

- [ ] Formularz /wycena — tryb niestandardowy
- [ ] Endpoint POST /api/leads
- [ ] E-mail auto-potwierdzenie do klienta
- [ ] Widok leadów w panelu admina
- [ ] Status workflow leadów

### Epik 9: Panel admina (Sprint 6)

- [ ] Layout admina z sidebar
- [ ] Lista wszystkich zamówień z filtrowaniem
- [ ] Zmiana statusu zamówienia + notatki
- [ ] Edytor cenników per przewoźnik
- [ ] Zarządzanie kuponami rabatowymi
- [ ] Lista i zarządzanie leadami
- [ ] Audit log — podgląd zmian

### Epik 10: CMS i SEO (Sprint 6–7)

- [ ] WYSIWYG editor dla artykułów i stron CMS
- [ ] Strony SEO per typ palety (5 stron)
- [ ] Strona /jak-przygotowac-palete
- [ ] Strona /cennik z tabelami dopłat
- [ ] Blog: lista + artykuł
- [ ] FAQ z accordionem
- [ ] Dynamiczne meta tags per strona
- [ ] sitemap.xml + robots.txt
- [ ] Schema.org structured data (FAQPage, BreadcrumbList)

### Epik 11: Strona główna i landing pages (Sprint 7)

- [ ] Hero z kalkulatorem wbudowanym
- [ ] Sekcja "Jak to działa"
- [ ] Karty typów palet
- [ ] Social proof B2B
- [ ] Sekcja /dla-firm — pełny landing
- [ ] Footer z pełną nawigacją

### Epik 12: QA i launch (Sprint 8)

- [ ] Testy e2e (Playwright): wycena → zamówienie → tracking
- [ ] Testy jednostkowe silnika wycen
- [ ] WCAG AA audit (axe-core)
- [ ] Core Web Vitals: LCP < 2.5 s
- [ ] Mobile audit: 375px, 768px
- [ ] Dark mode audit
- [ ] RODO compliance check
- [ ] Load testing wyceny (Redis cache)
- [ ] Monitoring: Sentry setup
- [ ] Deploy produkcyjny + domeny + SSL

---

## 13. Kryteria akceptacji (Definition of Done)

| Kryterium | Jak zmierzyć |
|---|---|
| Użytkownik od wejścia do wyboru oferty w max 90 sekund | Test z 5 osobami niebędącymi w branży |
| Brak jakichkolwiek elementów dotyczących paczek/kopert | Automatyczny grep/test na słowa: paczka, koperta, paczkomat |
| Kalkulator nie wyświetla błędnych cen dla niestandardów | Unit testy silnika wycen z edge cases |
| Panel klienta pozwala ponowić wysyłkę w 2 kliknięciach | E2E test Playwright |
| Admin zmienia marżę bez deploya | Manual test + audit log |
| LCP < 2.5 s na mobile 4G | Lighthouse CI w GitHub Actions |
| WCAG AA | axe-core automated + manual keyboard nav |
| Wszystkie e-maile transakcyjne wysyłane | Integration test z mock SMTP |

---

## 14. Zmienne środowiskowe — template

```bash
# .env.example

# App
APP_URL=https://twoja-domena.pl
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/palety_db

# Redis
REDIS_URL=redis://localhost:6379

# Auth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://twoja-domena.pl

# Storage (S3-compatible)
S3_ENDPOINT=https://s3.eu-central-1.amazonaws.com
S3_BUCKET=palety-files
S3_ACCESS_KEY=
S3_SECRET_KEY=

# Payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
# lub PRZELEWY24_MERCHANT_ID=, PRZELEWY24_CRC=

# Email
RESEND_API_KEY=
EMAIL_FROM=noreply@twoja-domena.pl

# SMS (opcjonalne)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=

# Carriers
DHL_API_KEY=
DHL_API_URL=https://api.dhl.com
DPD_API_KEY=
DPD_API_URL=
FEDEX_API_KEY=
FEDEX_API_URL=
AMBRO_API_KEY=
AMBRO_API_URL=

# Monitoring
SENTRY_DSN=
```

---

## 15. Checklist uruchomienia (Go-Live)

- [ ] Domena i SSL skonfigurowane
- [ ] Wszystkie zmienne środowiskowe ustawione na produkcji
- [ ] Baza danych: migracje, seed danych (przewoźnicy, cenniki)
- [ ] Stripe/P24: webhooks przetestowane w trybie live
- [ ] Integracje z przewoźnikami: przetestowane nadania testowe
- [ ] E-maile transakcyjne: przetestowane wszystkie flow
- [ ] Strony prawne: Regulamin, Polityka prywatności, Reklamacje — zatwierdzone przez prawnika
- [ ] RODO: mechanizm usunięcia konta działa
- [ ] Backup bazy danych: skonfigurowany automatyczny backup
- [ ] Monitoring: Sentry aktywny, alerty skonfigurowane
- [ ] Google Search Console: sitemp.xml przesłany
- [ ] Google Analytics / Plausible: tracking aktywny
- [ ] Testy smoke na produkcji: wycena → zamówienie → e-mail → tracking

---

*Koniec dokumentacji. Wersja 1.0 — MVP.*
