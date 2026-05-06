import { db } from './index';
import { hash } from 'bcryptjs';
import { carrierServices, users, cmsPages } from './schema';

async function main() {
  console.log('Seeding carrier services...');

  await db.insert(carrierServices).values([
    {
      carrierCode: 'dhl',
      serviceName: 'DHL Pallet',
      palletTypes: ['euro', 'semi_euro'],
      maxLength: '120.0',
      maxWidth: '80.0',
      maxHeight: '210.0',
      maxWeight: '1000.0',
      countries: ['PL', 'DE'],
      isActive: true,
      basePriceRules: { base: 150 },
      surchargeRules: { residential: 20 },
    },
    {
      carrierCode: 'dpd',
      serviceName: 'DPD Pallet',
      palletTypes: ['euro'],
      maxLength: '120.0',
      maxWidth: '80.0',
      maxHeight: '180.0',
      maxWeight: '700.0',
      countries: ['PL', 'DE'],
      isActive: true,
      basePriceRules: { base: 160 },
      surchargeRules: { residential: 25 },
    },
    {
      carrierCode: 'fedex',
      serviceName: 'FedEx Pallet',
      palletTypes: ['euro', 'industrial'],
      maxLength: '120.0',
      maxWidth: '120.0',
      maxHeight: '180.0',
      maxWeight: '1000.0',
      countries: ['PL', 'DE'],
      isActive: true,
      basePriceRules: { base: 170 },
      surchargeRules: { residential: 15 },
    },
  ]);

  console.log('Seeding users...');

  const adminEmail = (
    process.env.ADMIN_EMAIL || 'admin@paletbroker.pl'
  ).toLowerCase();
  const customerEmail = (
    process.env.DEMO_USER_EMAIL || 'user@paletbroker.pl'
  ).toLowerCase();
  const adminPasswordHash = await hash(
    process.env.ADMIN_PASSWORD || 'admin123',
    10,
  );
  const customerPasswordHash = await hash(
    process.env.DEMO_USER_PASSWORD || 'user123',
    10,
  );

  const superAdminPasswordHash = await hash('admin1', 10);

  await db
    .insert(users)
    .values([
      {
        email: 'sulek92@gmail.com',
        passwordHash: superAdminPasswordHash,
        role: 'superadmin',
        isVerified: true,
      },
      {
        email: adminEmail,
        passwordHash: adminPasswordHash,
        role: 'admin',
        isVerified: true,
      },
      {
        email: customerEmail,
        passwordHash: customerPasswordHash,
        role: 'customer',
        isVerified: true,
      },
    ])
    .onConflictDoNothing({ target: users.email });

  // ── CMS Pages ──────────────────────────────────────────────────────
  console.log('Seeding CMS pages...');

  const cmsSeedData = [
    {
      slug: 'home',
      title: 'Strona Główna',
      isPublished: true,
      content: JSON.stringify({
        heroTitle: 'Transport paletowy bez niespodzianek.',
        heroSubtitle:
          'Skupiamy się wyłącznie na logistyce paletowej. Gwarantujemy przewidywalność, brak ukrytych kosztów i precyzyjne śledzenie B2B, którego potrzebuje Twój biznes.',
        heroBadge: 'Logistyka B2B dla profesjonalistów',
        heroVisualImage: '/images/home-hero-logistics.jpg',
        heroVisualCaption: 'Operacje paletowe 24/7',
        partners: [
          'DHL Freight',
          'FedEx Express',
          'Raben',
          'DSV',
          'DB Schenker',
        ],
        activityTicker: [
          { city: 'Warszawa', status: 'Odebrano', time: '2 min temu' },
          { city: 'Berlin', status: 'W trasie', time: '5 min temu' },
          { city: 'Kraków', status: 'Dostarczono', time: '12 min temu' },
          { city: 'Praga', status: 'Odebrano', time: '15 min temu' },
          { city: 'Wrocław', status: 'Dostarczono', time: '20 min temu' },
        ],
        howItWorks: [
          {
            step: '01',
            title: 'Wyceń online',
            desc: 'Podaj kody pocztowe i wymiary palety w naszym kalkulatorze.',
            icon: 'search',
          },
          {
            step: '02',
            title: 'Wybierz kuriera',
            desc: 'Porównaj ceny i czasy dostawy topowych przewoźników B2B.',
            icon: 'compare_arrows',
          },
          {
            step: '03',
            title: 'Zleć odbiór',
            desc: 'Opłać zamówienie i czekaj na kuriera. Etykietę dostaniesz na maila.',
            icon: 'local_shipping',
          },
        ],
        stats: [
          { label: 'Obsłużonych palet', end: 45000, suffix: '+' },
          { label: 'Aktywnych klientów', end: 1200, suffix: '+' },
          { label: 'Krajów w sieci', end: 28, suffix: '' },
          { label: 'Średnia oszczędność', end: 22, suffix: '%' },
        ],
        testimonials: [
          {
            name: 'Marek Jankowski',
            role: 'CEO, E-com Group',
            text: 'Przejście na PaletBroker skróciło czas nadawania przesyłek o połowę. Faktura zbiorcza to zbawienie dla naszej księgowości.',
            avatar: 'person',
            avatarImage: '/images/avatars/client-1.jpg',
          },
          {
            name: 'Anna Nowak',
            role: 'Logistics Manager, TechFood',
            text: 'Najbardziej cenimy sobie dedykowanego opiekuna. W branży spożywczej liczy się każda godzina, a tu zawsze mamy wsparcie.',
            avatar: 'person_3',
            avatarImage: '/images/avatars/client-2.jpg',
          },
          {
            name: 'Robert Wilk',
            role: 'Właściciel, Wilk Meble',
            text: 'Ceny są bezkonkurencyjne, a system śledzenia przesyłek pozwala nam spać spokojnie. Polecam każdemu producentowi.',
            avatar: 'person_4',
            avatarImage: '/images/avatars/client-3.jpg',
          },
        ],
        supportTitle: 'Zawsze do Twojej dyspozycji',
        supportSubtitle:
          'Logistyka to branża, w której liczy się czas i precyzja. Nasz zespół wsparcia czuwa nad Twoimi przesyłkami i odpowie na każde pytanie w mniej niż 15 minut.',
        supportVisualImage: '/images/home-support-team.jpg',
        ctaTitle: 'Zacznij wysyłać taniej już dziś',
        ctaSubtitle:
          'Dołącz do 1200+ firm, które zaufały technologii PaletBroker. Twoja pierwsza przesyłka może być u odbiorcy już jutro.',
        ctaVisualImage: '/images/home-cta-warehouse.jpg',
      }),
    },
    {
      slug: 'o-nas',
      title: 'O nas',
      isPublished: true,
      content: JSON.stringify({
        heroTitle: 'Budujemy mosty w logistyce paletowej.',
        heroDesc:
          'PaletBroker powstał z połączenia pasji do technologii i wieloletniego doświadczenia w branży TSL. Naszym celem jest uproszczenie transportu ciężkiego dla każdego biznesu.',
        heroStats: [
          { value: '1200+', label: 'Zaufanych firm' },
          { value: '500k+', label: 'Wysłanych palet' },
          { value: '98%', label: 'Terminowości' },
        ],
        quote:
          'Logistyka to nie tylko paczki, to obietnica dostarczona na czas.',
        quoteAuthor: '— Zarząd PaletBroker',
        values: [
          {
            title: 'Innowacja',
            icon: 'auto_awesome',
            desc: 'Nieustannie rozwijamy nasze systemy API i algorytmy optymalizacji tras, aby obniżać koszty Twojej logistyki.',
          },
          {
            title: 'Niezawodność',
            icon: 'verified_user',
            desc: 'Współpracujemy wyłącznie z certyfikowanymi przewoźnikami o ugruntowanej pozycji rynkowej i doskonałej opinii.',
          },
          {
            title: 'Ludzkie podejście',
            icon: 'groups',
            desc: 'Za zaawansowaną technologią stoją ludzie. Każdy nasz klient biznesowy posiada dedykowanego opiekuna, który zna specyfikę jego branży.',
          },
        ],
        team: [
          { name: 'Adam Nowicki', role: 'Founder & CEO', icon: 'person' },
          {
            name: 'Karolina Wiśniewska',
            role: 'Head of Operations',
            icon: 'support_agent',
          },
          { name: 'Michał Król', role: 'CTO', icon: 'code' },
          {
            name: 'Marta Kowalska',
            role: 'Customer Success',
            icon: 'sentiment_very_satisfied',
          },
        ],
        ctaTitle: 'Gotowy na nową jakość\nw transporcie Twojej firmy?',
      }),
    },
    {
      slug: 'cennik',
      title: 'Cennik',
      isPublished: true,
      content: JSON.stringify({
        title: 'Stawki skrojone pod biznes',
        subtitle:
          'Podane stawki są cenami bazowymi netto. Dzięki umowom z największymi przewoźnikami oferujemy ceny o 40% niższe niż cenniki detaliczne.',
        exchangeRate: 4.32,
        domesticRates: [
          {
            type: 'Półpaleta (do 200kg)',
            price: '120,00',
            icon: 'inventory_2',
          },
          { type: 'Paleta Euro (do 300kg)', price: '145,00', icon: 'pallet' },
          { type: 'Paleta Euro (do 600kg)', price: '165,00', icon: 'pallet' },
          { type: 'Paleta Euro (do 1000kg)', price: '195,00', icon: 'pallet' },
          { type: 'Przemysłowa (do 1200kg)', price: '240,00', icon: 'widgets' },
        ],
        internationalRates: [
          { country: 'Niemcy', price: '85,00', eta: '2-3 dni' },
          { country: 'Czechy', price: '75,00', eta: '1-2 dni' },
          { country: 'Francja', price: '120,00', eta: '3-4 dni' },
          { country: 'Włochy', price: '135,00', eta: '3-5 dni' },
          { country: 'Benelux', price: '115,00', eta: '2-4 dni' },
        ],
        guaranteeTitle: 'Gwarancja najniższej ceny',
        guaranteeDesc:
          'Jeśli znajdziesz tańszą ofertę na transport paletowy o tych samych parametrach, zwrócimy Ci różnicę i damy dodatkowe 5% rabatu na kolejne zlecenie.',
        guaranteeBoxes: [
          {
            label: 'Ubezpieczenie',
            value: 'W cenie',
            sub: 'OCP Przewoźnika',
          },
          {
            label: 'Dopłata paliwowa',
            value: '0%',
            sub: 'Zawsze w cenie',
          },
        ],
        pricingFaq: [
          {
            q: 'Czy podane ceny są brutto?',
            a: 'Nie, wszystkie ceny w cenniku i kalkulatorze są cenami netto. Należy doliczyć 23% VAT dla usług krajowych.',
          },
          {
            q: 'Kiedy otrzymam fakturę?',
            a: 'Faktura VAT jest generowana automatycznie po opłaceniu zlecenia i przesyłana na Twój adres e-mail.',
          },
          {
            q: 'Jakie są metody płatności?',
            a: 'Obsługujemy szybkie przelewy (PayU), BLIK, karty płatnicze oraz przelewy tradycyjne (dla stałych klientów).',
          },
          {
            q: 'Czy ceny się zmieniają?',
            a: 'Stawki mogą ulegać zmianie w zależności od sezonowości i cen paliw, ale po opłaceniu zlecenia cena jest gwarantowana.',
          },
        ],
      }),
    },
    {
      slug: 'faq',
      title: 'FAQ',
      isPublished: true,
      content: JSON.stringify({
        items: [
          {
            q: 'Jak zapakować paletę?',
            a: 'Paleta musi być owinięta folią stretch. Towar nie może wystawać poza obrys palety.',
          },
          {
            q: 'Ile kosztuje wysyłka palety?',
            a: 'Cena zależy od wymiarów, wagi i kodu pocztowego. Użyj naszego kalkulatora aby sprawdzić cenę.',
          },
          {
            q: 'Czy mogę ubezpieczyć przesyłkę?',
            a: 'Tak, oferujemy dodatkowe ubezpieczenie w kroku wyboru usług w koszyku.',
          },
        ],
      }),
    },
    {
      slug: 'pomoc',
      title: 'Centrum Pomocy',
      isPublished: true,
      content: JSON.stringify({
        title: 'W czym możemy pomóc?',
        subtitle:
          'Najważniejsze zasady działania platformy, płatności i realizacji zleceń w jednym miejscu.',
        categories: [
          { title: 'Konto i logowanie', icon: 'badge', count: 4 },
          { title: 'Wycena i limity', icon: 'calculate', count: 5 },
          { title: 'Płatności i dokumenty', icon: 'payments', count: 4 },
          { title: 'Transport i statusy', icon: 'local_shipping', count: 5 },
        ],
        faqItems: [
          {
            q: 'Jakie dane są wymagane do szybkiej wyceny?',
            a: 'W formularzu podajesz typ palety, kod pocztowy nadania i dostawy, wagę oraz wymiary ładunku. Dla standardowych typów palet część wymiarów uzupełnia się automatycznie.',
          },
          {
            q: 'Jakie są limity automatycznej wyceny?',
            a: 'Automatyczna wycena działa dla parametrów do 300 cm (długość), 300 cm (szerokość), 250 cm (wysokość) i 1500 kg. Powyżej limitów system kieruje do ścieżki obsługi niestandardowej.',
          },
          {
            q: 'Jakie kody pocztowe i kraje obsługuje formularz?',
            a: 'System waliduje format kodu pocztowego PL (XX-XXX) lub DE (XXXXX). W aktualnej konfiguracji formularza dostępne są kierunki PL i DE.',
          },
          {
            q: 'Jakie metody płatności są dostępne?',
            a: 'Płatności online realizowane są przez Stripe. W checkout mogą być dostępne m.in. karta, BLIK i Przelewy24 – zależnie od konfiguracji i dostępności operatora.',
          },
          {
            q: 'Kiedy status zamówienia zmienia się na opłacone?',
            a: 'Po potwierdzeniu płatności przez webhook operatora płatności status zamówienia jest aktualizowany automatycznie, a system może uruchomić dalsze kroki realizacji.',
          },
          {
            q: 'Jak sprawdzić status przesyłki?',
            a: 'W zakładce Śledzenie wpisz numer zamówienia (np. OR-...). System pokaże aktualny status i historię zdarzeń, jeśli są dostępne dla przesyłki.',
          },
          {
            q: 'Czy mogę zresetować hasło samodzielnie?',
            a: 'Tak. Na stronie logowania dostępny jest reset hasła. Token resetu jest czasowy, a po ustawieniu nowego hasła poprzednie dane logowania przestają obowiązywać.',
          },
          {
            q: 'Jak skontaktować się w sprawie zlecenia lub reklamacji?',
            a: 'Najszybciej przez formularz kontaktowy lub e-mail z numerem zamówienia i opisem sprawy. Dzięki temu zespół może od razu sprawdzić historię operacyjną.',
          },
        ],
        ctaTitle: 'Nie widzisz odpowiedzi na swoje pytanie?',
        ctaSubtitle:
          'Skontaktuj się z nami bezpośrednio. W zgłoszeniu podaj numer zamówienia i opis problemu, a szybciej przeprowadzimy weryfikację.',
      }),
    },
    {
      slug: 'kontakt',
      title: 'Kontakt',
      isPublished: true,
      content: JSON.stringify({
        title: 'Jesteśmy tu,\nby Ci pomóc.',
        subtitle:
          'Masz pytania dotyczące transportu lub potrzebujesz indywidualnej wyceny dla swojej firmy? Skontaktuj się z nami w najwygodniejszy dla Ciebie sposób.',
        phone: '+48 22 123 45 67',
        phoneHours: 'Pon - Pt: 8:00 - 17:00',
        email: 'kontakt@paletbroker.pl',
        emailResponseTime: 'Odpowiemy w 2 godziny',
        companyName: 'PaletBroker Sp. z o.o.',
        street: 'ul. Logistyczna 12',
        city: '00-001 Warszawa',
      }),
    },
    {
      slug: 'dla-firm',
      title: 'Oferta B2B',
      isPublished: true,
      content: JSON.stringify({
        heroBadge: 'Program Partnerski B2B',
        heroTitle: 'Zoptymalizuj logistykę w swojej firmie',
        heroDesc:
          'Dedykowane rozwiązania dla e-commerce, hurtowni i producentów. Skaluj swój biznes z partnerem, który rozumie potrzeby transportu ciężkiego.',
        benefits: [
          {
            title: 'Faktura zbiorcza',
            icon: 'receipt_long',
            desc: 'Otrzymuj jedną fakturę za wszystkie zlecenia w miesiącu. Uprość księgowość i zarządzanie kosztami w Twojej firmie.',
          },
          {
            title: 'Dedykowane API',
            icon: 'integration_instructions',
            desc: 'Zintegruj swój sklep lub system ERP bezpośrednio z naszą platformą. Automatyzuj proces nadawania przesyłek.',
          },
          {
            title: 'Opiekun konta',
            icon: 'support_agent',
            desc: 'Indywidualne wsparcie specjalisty, który pomoże Ci w trudnych sytuacjach i zoptymalizuje koszty logistyki.',
          },
          {
            title: 'Ceny negocjowane',
            icon: 'trending_down',
            desc: 'Wysyłasz powyżej 50 palet miesięcznie? Przygotujemy dla Ciebie indywidualny cennik z gwarancją stawek.',
          },
          {
            title: 'Ubezpieczenie CARGO',
            icon: 'security',
            desc: 'Rozszerzona ochrona ubezpieczeniowa dla Twoich towarów w standardzie dla naszych stałych partnerów B2B.',
          },
          {
            title: 'Panel analityczny',
            icon: 'bar_chart',
            desc: 'Analizuj koszty logistyki, czasy dostaw i kierunki wysyłek w czasie rzeczywistym dzięki naszym raportom.',
          },
        ],
        integrations: [
          'SAP',
          'Oracle',
          'PrestaShop',
          'WooCommerce',
          'Allegro',
          'Magento',
        ],
      }),
    },
    {
      slug: 'blog',
      title: 'Blog',
      isPublished: true,
      content: JSON.stringify({
        newsletterTitle: 'Zostań ekspertem w logistyce',
        newsletterDesc:
          'Zapisz się do newslettera i otrzymuj raz w miesiącu wyselekcjonowane treści o rynku TSL oraz ekskluzywne rabaty na wysyłki.',
      }),
    },
    {
      slug: 'kariera',
      title: 'Kariera',
      isPublished: true,
      content: JSON.stringify({
        heroTitle: 'Buduj z nami przyszłość logistyki',
        heroDesc:
          'PaletBroker to nie tylko platforma, to zespół pasjonatów technologii i transportu. Szukamy osób, które chcą realnie zmieniać branżę TSL.',
        reasons: [
          {
            title: 'Nowoczesny Stack',
            icon: 'code',
            desc: 'Pracujemy na najnowszych technologiach (Next.js 15, AI), eliminując dług technologiczny.',
          },
          {
            title: 'Realny wpływ',
            icon: 'trending_up',
            desc: 'Twoje pomysły są wdrażane w życie. Cenimy inicjatywę i kreatywne podejście do problemów.',
          },
          {
            title: 'Elastyczność',
            icon: 'calendar_month',
            desc: 'Stawiamy na work-life balance. Oferujemy pracę zdalną i elastyczne godziny pracy.',
          },
        ],
        jobOffers: [
          {
            title: 'Spedytor Międzynarodowy',
            location: 'Warszawa / Hybrydowo',
            type: 'Pełny etat',
          },
          {
            title: 'Fullstack Developer (Next.js)',
            location: 'Zdalnie',
            type: 'B2B / Umowa o pracę',
          },
          {
            title: 'Key Account Manager B2B',
            location: 'Warszawa',
            type: 'Pełny etat',
          },
        ],
      }),
    },
    {
      slug: 'typy-palet',
      title: 'Typy palet',
      isPublished: true,
      content: JSON.stringify({
        palletTypes: [
          {
            name: 'Paleta Euro (EPAL)',
            dims: '1200 x 800 mm',
            weight: 'ok. 25 kg',
            capacity: 'do 1500 kg',
            desc: 'Najpopularniejszy standard w Europie. Posiada standaryzowane oznaczenia EPAL/EUR. Idealna do transportu międzynarodowego.',
            icon: 'widgets',
          },
          {
            name: 'Paleta Przemysłowa',
            dims: '1200 x 1000 mm',
            weight: 'ok. 30 kg',
            capacity: 'do 2000 kg',
            desc: 'Szersza wersja palety, często stosowana w przemyśle spożywczym i chemicznym. Zapewnia większą powierzchnię załadunku.',
            icon: 'category',
          },
          {
            name: 'Półpaleta',
            dims: '600 x 800 mm',
            weight: 'ok. 10 kg',
            capacity: 'do 500 kg',
            desc: 'Zajmuje połowę miejsca palety Euro. Często wykorzystywana do ekspozycji towaru w sklepach (tzw. paleta displayowa).',
            icon: 'view_quilt',
          },
        ],
        measurementTips: [
          'Zawsze podawaj wymiary całkowite (podstawa + towar).',
          'Towar nie powinien wystawać poza obrys palety.',
          'Wysokość palety mierzymy od podłoża do najwyższego punktu towaru.',
          'Waga rzeczywista obejmuje wagę towaru wraz z paletą i opakowaniem.',
        ],
      }),
    },
    {
      slug: 'regulamin',
      title: 'Regulamin',
      isPublished: true,
      content: JSON.stringify({
        lastUpdated: '06 maja 2026 r.',
        sections: [
          {
            title: 'Zakres i charakter usługi',
            content:
              'PaletBroker jest platformą cyfrową do wyceny i obsługi zleceń transportu paletowego. Przewóz realizują przewoźnicy współpracujący; PaletBroker odpowiada za działanie platformy i obsługę procesu zamówienia.',
          },
          {
            title: 'Wycena i limity automatyczne',
            content:
              'Automatyczna wycena dotyczy przesyłek o parametrach do: 300 cm (długość), 300 cm (szerokość), 250 cm (wysokość), 1500 kg (waga). Powyżej limitów system kieruje do obsługi niestandardowej.',
          },
          {
            title: 'Składanie zamówienia i płatność',
            content:
              'Zamówienie składa się po wyborze oferty, uzupełnieniu danych adresowych i przejściu płatności online. Płatności internetowe realizowane są przez Stripe (metody zależne od konfiguracji checkout).',
          },
          {
            title: 'Obowiązki nadawcy i reklamacje',
            content:
              'Nadawca odpowiada za prawidłowe przygotowanie i zabezpieczenie ładunku oraz zgodność danych zlecenia. Zgłoszenia dotyczące realizacji usługi należy kierować przez kanały kontaktowe z podaniem numeru zamówienia i opisu sprawy.',
          },
        ],
      }),
    },
    {
      slug: 'polityka-prywatnosci',
      title: 'Polityka Prywatności',
      isPublished: true,
      content: JSON.stringify({
        lastUpdated: '06 maja 2026 r.',
        sections: [
          {
            title: 'Administrator danych i kontakt',
            content:
              'Administratorem danych jest podmiot prowadzący serwis PaletBroker. Aktualne dane identyfikacyjne i kontaktowe administratora są publikowane w zakładce Kontakt oraz w stopce serwisu.',
          },
          {
            title: 'Zakres danych i cele przetwarzania',
            content:
              'Przetwarzamy dane konta, dane firmy, dane przesyłek i dane kontaktowe z formularzy w celu wyceny, obsługi zamówień, płatności, dokumentów księgowych i komunikacji operacyjnej.',
          },
          {
            title: 'Twoje prawa',
            content:
              'Przysługuje Ci prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych oraz sprzeciwu – w zakresie przewidzianym RODO. Przysługuje Ci również prawo wniesienia skargi do Prezesa UODO.',
          },
          {
            title: 'Cookies i bezpieczeństwo',
            content:
              'Serwis używa cookies m.in. do utrzymania sesji logowania, zapamiętania ustawień (np. język, motyw) i ochrony żądań. Stosujemy też mechanizmy bezpieczeństwa, w tym walidację danych wejściowych, role dostępu oraz ograniczenia liczby żądań.',
          },
        ],
      }),
    },
    {
      slug: 'global-settings',
      title: 'Ustawienia Globalne',
      isPublished: true,
      content: JSON.stringify({
        brandName: 'PaletBroker',
        footerTagline: 'Logistyka napędzana technologią.',
        bannerText:
          'Promocja: -10% na wszystkie kierunki UE z kodem: START2024',
        bannerCode: 'START2024',
        bannerEnabled: false,
        maintenanceMode: false,
        fuelSurcharge: 14.2,
        newsletterEnabled: true,
        supportStatusLabel: 'System Status: Online',
        navLinks: [
          { label: 'Wycena', href: '/wycena' },
          { label: 'Cennik', href: '/cennik' },
          { label: 'Śledzenie', href: '/sledzenie' },
          { label: 'O nas', href: '/o-nas' },
          { label: 'Kontakt', href: '/kontakt' },
        ],
        footerCompanyLinks: [
          { label: 'O nas', href: '/o-nas' },
          { label: 'Kariera', href: '/kariera' },
          { label: 'Kontakt', href: '/kontakt' },
          { label: 'Blog logistyczny', href: '/blog' },
        ],
        footerToolLinks: [
          { label: 'Kalkulator palet', href: '/wycena' },
          { label: 'Śledzenie przesyłki', href: '/sledzenie' },
          { label: 'API & Integracje', href: '/api' },
          { label: 'Przewodnik po paletach', href: '/typy-palet' },
        ],
        footerSupportLinks: [
          { label: 'Centrum pomocy', href: '/pomoc' },
          { label: 'Regulamin serwisu', href: '/regulamin' },
          { label: 'Polityka prywatności', href: '/polityka-prywatnosci' },
          { label: 'Panel Administratora', href: '/admin' },
        ],
        footerDesc:
          'Profesjonalna platforma logistyczna B2B. Skupiamy się na dostarczaniu najwyższej jakości usług transportu paletowego w Europie.',
        phone: '+48 22 123 45 67',
        email: 'kontakt@paletbroker.pl',
        companyName: 'PaletBroker Sp. z o.o.',
        street: 'ul. Logistyczna 12',
        city: '00-001 Warszawa',
      }),
    },
    {
      slug: 'theme',
      title: 'Konfiguracja Wyglądu',
      isPublished: true,
      content: JSON.stringify({
        presetName: 'PaletBroker Teal',
        colorPrimary: '#005258',
        colorSecondary: '#006d30',
        colorTertiary: '#713c17',
        colorBackground: '#f7fafa',
        colorSurface: '#ffffff',
        colorDivider: '#dde0e5',
        darkModeEnabled: true,
        colorDarkBg: '#0f1117',
        colorDarkSurface: '#1a1d27',
        colorDarkPrimary: '#2dd4bf',
        fontDisplay: 'Plus Jakarta Sans',
        fontBody: 'Outfit',
        fontMono: 'Outfit',
        radiusScale: 'default',
        colorCtaBg: '#005258',
        gradientFrom: '#005258',
        gradientTo: '#00a1a1',
      }),
    },
  ];

  await db
    .insert(cmsPages)
    .values(cmsSeedData)
    .onConflictDoNothing({ target: cmsPages.slug });

  console.log('Seeding done.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
