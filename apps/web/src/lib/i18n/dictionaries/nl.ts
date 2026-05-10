import { TranslationType } from './pl';

export const nl: TranslationType = {
  common: {
    login: 'Inloggen',
    register: 'Registreren',
    logout: 'Uitloggen',
    dashboard: 'Dashboard',
    orders: 'Bestellingen',
    settings: 'Instellingen',
    to: 'naar',
  },
  nav: {
    pricing: 'Tarieven',
    tracking: 'Track & Trace',
    contact: 'Contact',
    about: 'Over ons',
  },
  home: {
    hero: {
      badge: 'B2B-logistiek voor professionals',
      visualCaption: 'Palletoperaties 24/7',
    },
    calculator: {
      title: 'Tariefcalculator',
      subtitle: 'Voer de basisparameters van uw zending in. Ons algoritme koppelt de beste vervoerder aan uw behoeften en locatie.',
      badge: 'PRIJSGARANTIE',
      loading: 'Calculator laden...',
    },
    tracking: {
      title: 'Zending Volgen',
      placeholder: 'Voer uw ordernummer in (bijv. OR-1234)',
      button: 'Status bekijken',
      searching: 'Zoeken...',
      error: 'Voer een ordernummer in',
    },
    partners: {
      title: 'Vertrouwde Logistieke Partners',
    },
    howItWorks: {
      step1: { title: 'Bereken online', desc: 'Voer postcodes en palletafmetingen in onze calculator in.' },
      step2: { title: 'Kies een koerier', desc: 'Vergelijk prijzen en levertijden van top B2B-vervoerders.' },
      step3: { title: 'Plan de ophaling', desc: 'Betaal uw bestelling en wacht op de koerier. U ontvangt het label per e-mail.' },
    },
    stats: {
      pallets: 'Pallets vervoerd',
      clients: 'Actieve klanten',
      countries: 'Landen in netwerk',
      savings: 'Gemiddelde besparing',
    },
    ticker: {
      received: 'Ontvangen',
      inTransit: 'Onderweg',
      delivered: 'Afgeleverd',
      ago: 'min geleden',
    },
    testimonials: {
      title: 'Wat onze klanten zeggen',
      subtitle: 'Vertrouwen bouwt u op met stiptheid en transparantie. Lees de ervaringen van bedrijven die hun logistiek met ons hebben geoptimaliseerd.',
      items: [
        {
          name: 'Marek Jankowski',
          role: 'CEO, E-com Group',
          text: 'De overstap naar PaletBroker halveerde onze verwerkingstijd voor zendingen. Het prijssysteem is ongeëvenaard op de Poolse markt.',
        },
        {
          name: 'Anna Nowak',
          role: 'Logistics Manager, TechFood',
          text: 'Wij waarderen vooral onze toegewijde accountmanager en de documentautomatisering. Alles op één centrale plek.',
        },
        {
          name: 'Robert Wilk',
          role: 'Eigenaar, Wilk Meble',
          text: 'De prijzen zijn zeer concurrerend en de importafhandeling vanuit Duitsland verloopt vlekkeloos. Een aanrader voor elke ondernemer.',
        },
      ]
    },
    support: {
      title: 'Altijd tot uw beschikking',
      subtitle: 'In de logistiek draait het om tijd en precisie. Ons supportteam bewaakt uw zendingen en beantwoordt elke vraag binnen 15 minuten.',
      badge: 'Technische Ondersteuning',
      responseTime: 'Responstijd',
      monitoring: 'Zendingmonitoring',
      form: {
        title: 'Schrijf naar onze expert',
        name: 'Voor- en achternaam',
        email: 'Zakelijk e-mailadres',
        message: 'Waarmee kunnen wij u helpen? (Bijv. API-integratie, voorwaarden voor vaste samenwerking)',
        button: 'Verstuur aanvraag',
        sending: 'Verzenden...',
        success: {
          title: 'Bericht verzonden',
          description: 'Dank u wel. Wij reageren binnen 15 minuten.',
        },
        error: {
          title: 'Verzendfout',
          description: 'Het formulier kon niet worden verzonden.',
        }
      }
    },
    cta: {
      title: 'Begin vandaag nog voordeliger te verzenden',
      subtitle: 'Sluit u aan bij 1200+ bedrijven die vertrouwen op de technologie van PaletBroker. Uw eerste zending kan morgen al bij de ontvanger zijn.',
      buttonRegister: 'Zakelijk account aanmaken',
      buttonQuote: 'Bekijk tarieven',
      imageAlt: 'Magazijn en pallettransport',
    },
    testimonialsLabel: 'De stem van onze klanten',
    testimonialsTitle: 'Brancheleiders vertrouwen op ons',
    testimonialsDesc: 'Ontdek hoe PaletBroker-technologie de toeleveringsketens van de grootste bedrijven in de regio optimaliseert.',
    quickQuoteLabel: 'Bereken uw zending',
    quickQuoteButton: 'Snelle Prijsopgave',
    b2bOffer: 'B2B-aanbod',
    partnerComparison: 'Wij vergelijken aanbiedingen van',
    carriers: 'vervoerders',
    carriersSuffix: '+',
    realtimeComparison: 'in realtime.',
  },
  hero: {
    title: 'Het voordeligste pallettransport in Polen en Europa',
    subtitle: 'Vergelijk prijzen van de grootste vervoerders en boek transport in 2 minuten. Bespaar tot 40% op elke zending.',
    cta: 'Bereken uw zending',
  },
  pricing: {
    title: 'Tarieven op maat van uw bedrijf',
    subtitle: 'De vermelde tarieven zijn netto basisprijzen. Dankzij contracten met de grootste vervoerders bieden wij prijzen die tot 40% lager liggen dan de standaardtarieven.',
    tabs: {
      domestic: 'Binnenlands Transport',
      international: 'Import / Export EU',
    },
    labels: {
      standardRates: 'Standaardtarieven',
      bestOffer: 'Beste aanbieding',
      europeanRoutes: 'Europese Bestemmingen',
      guaranteedEta: 'Gegarandeerde ETA',
      from: 'vanaf',
      customRoute: 'Bereken een specifieke route',
      askOther: 'Vraag naar een andere bestemming',
      billingQuestions: 'Vragen over facturering',
      helpAndSupport: 'Hulp & Ondersteuning',
      service247: 'Uitvoering 24/7',
    },
    guarantee: {
      title: 'Laagsteprijsgarantie',
      desc: 'Vindt u een voordeliger aanbod voor pallettransport met dezelfde parameters, dan vergoeden wij het verschil en geven wij u 5% extra korting op uw volgende opdracht.',
      insurance: 'Verzekering',
      fuelSurcharge: 'Brandstoftoeslag',
      included: 'Inbegrepen',
      alwaysIncluded: 'Altijd inbegrepen',
      carrierOcp: 'Vervoerdersaansprakelijkheid (OCP)',
    },
    faq: {
      q1: 'Zijn de vermelde prijzen inclusief btw?',
      a1: 'Nee, alle prijzen in de tarievenlijst en calculator zijn nettoprijzen. Voor binnenlandse diensten dient 23% btw te worden bijgeteld.',
      q2: 'Wanneer ontvang ik de factuur?',
      a2: 'De btw-factuur wordt automatisch gegenereerd na betaling van de opdracht en verzonden naar uw e-mailadres.',
      q3: 'Welke betaalmethoden zijn er?',
      a3: 'Wij ondersteunen snelle online betalingen (PayU), BLIK, betaalkaarten en traditionele overboekingen (voor vaste klanten).',
      q4: 'Veranderen de prijzen?',
      a4: 'Tarieven kunnen fluctueren afhankelijk van seizoensinvloeden en brandstofprijzen, maar na betaling van de opdracht is de prijs gegarandeerd.',
    },
    countries: {
      germany: 'Duitsland',
      czechia: 'Tsjechië',
      france: 'Frankrijk',
      italy: 'Italië',
      benelux: 'Benelux',
    },
    pallets: {
      semi_euro: 'Halve pallet',
      euro: 'Europallet',
      industrial: 'Industriepallet',
      semi_industrial: 'Halve industriepallet',
    },
    result: {
      availableOffers: 'Beschikbare aanbiedingen',
      delivery: 'Levering:',
      netto: 'netto',
      brutto: 'PLN bruto',
      order: 'Bestellen',
      details: 'Offertedetails',
      basePrice: 'Basisprijs:',
      surcharges: 'Toeslagen (zone, diensten):',
      total: 'Totaal netto:',
      orderNow: 'Nu bestellen',
    },
  },
  footer: {
    desc: 'Professioneel B2B-logistiekplatform. Wij richten ons op het leveren van pallettransportdiensten van de hoogste kwaliteit in heel Europa.',
    newsletterTitle: 'Logistieke nieuwsbrief',
    newsletterPlaceholder: 'Uw e-mailadres',
    sections: {
      company: 'Bedrijf',
      tools: 'Tools',
      support: 'Ondersteuning',
    },
    links: {
      about: 'Over ons',
      career: 'Carrière',
      contact: 'Contact',
      blog: 'Logistiek blog',
      calculator: 'Palletcalculator',
      tracking: 'Zending volgen',
      api: 'API & Integraties',
      guide: 'Palletgids',
      help: 'Helpcentrum',
      terms: 'Algemene Voorwaarden',
      privacy: 'Privacybeleid',
      admin: 'Beheerpaneel',
    },
    allRightsReserved: 'Alle rechten voorbehouden.',
    tagline: 'Logistiek aangedreven door technologie.',
  },
  cookies: {
    text: 'Wij gebruiken cookies die nodig zijn voor de correcte werking van de website en, met uw toestemming, analytische en marketingcookies. U kunt alles accepteren, optionele weigeren of instellingen aanpassen.',
    privacyPolicy: 'Privacybeleid',
    settings: 'Instellingen',
    acceptAll: 'Alles accepteren',
    rejectAll: 'Alles weigeren',
    alwaysActive: 'Altijd actief',
    title: 'Wij respecteren uw privacy',
    settingsTitle: 'Cookie-instellingen',
    settingsSubtitle: 'U kunt beslissen voor welke cookiecategorieën u toestemming geeft. Noodzakelijke cookies zijn vereist voor de werking van de website en kunnen niet worden uitgeschakeld in dit paneel.',
    essential: 'Essentieel',
    essentialDesc: 'Deze bestanden zijn nodig voor de werking van de website, zoals het opslaan van privacy-instellingen, beveiliging, sessies of formulieren.',
    analytics: 'Analytisch',
    analyticsDesc: 'Helpen ons te analyseren hoe u de website gebruikt, zoals bezoekersaantallen, paginapopulariteit en verkeersbronnen.',
    marketing: 'Marketing',
    marketingDesc: 'Stellen ons in staat om de effectiviteit van advertenties te meten en remarketingcampagnes uit te voeren.',
    cancel: 'Annuleren',
    save: 'Mijn keuzes opslaan',
  },
  faq: {
    title: 'Veelgestelde vragen',
    subtitle: 'Alles wat u moet weten over palletverzending met PaletBroker.',
    searchPlaceholder: 'Zoek een vraag...',
    contactTitle: 'Geen antwoord gevonden?',
    contactDesc: 'Ons team van logistieke experts staat voor u klaar.',
    contactCta: 'Neem contact met ons op',
    items: [
      { q: 'Hoe verpak ik een pallet?', a: 'De pallet moet worden omwikkeld met rekfolie. De goederen mogen niet buiten de palletomtrek uitsteken (80x120 cm voor Euro). Alle onderdelen moeten stevig aan de basis zijn bevestigd.' },
      { q: 'Wat kost het verzenden van een pallet?', a: 'De prijs is afhankelijk van afmetingen, gewicht en postcode. Dankzij onze contracten met vervoerders bieden wij tarieven die tot 40% lager zijn dan de markttarieven.' },
      { q: 'Kan ik mijn zending verzekeren?', a: 'Ja, de standaard vervoerdersaansprakelijkheidsverzekering (OCP) is inbegrepen. U kunt een aanvullende Cargo-verzekering afsluiten voor hoogwaardige goederen.' },
      { q: 'Wanneer haalt de koerier de pallet op?', a: 'De ophaling vindt doorgaans plaats op de eerstvolgende werkdag na betaling van de opdracht, mits deze vóór 12:00 uur is geplaatst.' }
    ]
  },
  careers: {
    title: 'Bouw samen met ons aan de toekomst van logistiek',
    subtitle: 'Wij zoeken enthousiastelingen op het gebied van technologie en transport die de TSL-sector daadwerkelijk willen veranderen.',
    whyJoin: 'Waarom PaletBroker?',
    values: [
      { title: 'Moderne Tech Stack', icon: 'code', desc: 'Wij werken met de nieuwste technologieën en elimineren technische schuld.' },
      { title: 'Echte Impact', icon: 'trending_up', desc: 'Uw ideeën worden werkelijkheid. Wij waarderen initiatief.' },
      { title: 'Flexibiliteit', icon: 'calendar_month', desc: 'Wij bieden werken op afstand en flexibele werktijden.' }
    ],
    openPositions: 'Actuele vacatures',
    applyNow: 'Nu solliciteren',
    noPositions: 'Op dit moment hebben wij geen openstaande vacatures, maar wij staan altijd open voor talent. Stuur ons een bericht!',
    offers: [
      { title: 'Internationaal Expediteur', location: 'Warschau / Hybride', type: 'Fulltime' },
      { title: 'Fullstack Developer (Next.js)', location: 'Op afstand', type: 'B2B / Arbeidscontract' },
      { title: 'Key Account Manager B2B', location: 'Warschau', type: 'Fulltime' }
    ]
  },
  legal: {
    terms: {
      title: 'Algemene Voorwaarden',
      lastUpdated: 'Laatst bijgewerkt: 06 mei 2026',
      sections: [
        {
          title: 'Reikwijdte en aard van de dienst',
          content:
            'PaletBroker is een digitaal platform voor het berekenen en afhandelen van pallettransportopdrachten. De dienst biedt een tariefcalculator, keuze uit vervoerdersaanbiedingen, een klantenportaal en een beheerpaneel. Het transport wordt uitgevoerd door partnervervoerders; PaletBroker is verantwoordelijk voor de werking van het platform en de afhandeling van het bestelproces.',
        },
        {
          title: 'Gebruikersaccount en toegang',
          content:
            'Voor registratie zijn minimaal een e-mailadres en wachtwoord vereist. De gebruiker is verantwoordelijk voor de vertrouwelijkheid van de inloggegevens. Het systeem kan de login tijdelijk blokkeren na een reeks mislukte pogingen. Toegangsrollen (bijv. klant, beheerder) bepalen het bereik van de zichtbare functies.',
        },
        {
          title: 'Offerte en automatische limieten',
          content:
            'De automatische prijsopgave geldt voor zendingen binnen de technische limieten van het formulier: lengte tot 300 cm, breedte tot 300 cm, hoogte tot 250 cm en gewicht tot 1500 kg. Voor parameters die de limieten overschrijden of voor niet-standaard zendingen wordt het systeem omgeleid naar handmatige verwerking.',
        },
        {
          title: 'Plaatsen van een bestelling',
          content:
            'Een bestelling wordt geplaatst na het kiezen van een aanbieding, het invullen van de gegevens van afzender en ontvanger en het doorlopen van de betaling. Het verstrekken van correcte adres- en contactgegevens is verplicht. Onjuiste gegevens kunnen leiden tot vertraging, correcties of extra kosten van de logistieke operator.',
        },
        {
          title: 'Betalingen en verkoopdocumenten',
          content:
            'Online betaling wordt afgehandeld via Stripe (inclusief methoden beschikbaar in de checkout, zoals kaart, BLIK, Przelewy24 – afhankelijk van configuratie en beschikbaarheid). Na boeking van de betaling wordt de bestelstatus bijgewerkt en worden de boekhoudkundige documenten beschikbaar gesteld binnen de systeemfuncties.',
        },
        {
          title: 'Verplichtingen van de afzender met betrekking tot ladingvoorbereiding',
          content:
            'De afzender is verantwoordelijk voor de correcte voorbereiding van de pallet: stabiele plaatsing van de goederen, zekering van de lading en overeenstemming van de parameters met de opgave. Bij goederen die bijzondere transportvoorwaarden vereisen (bijv. breekbaar of ADR) dienen deze in het formulier te worden aangegeven.',
        },
        {
          title: 'Tracking en statuscommunicatie',
          content:
            'Het platform biedt inzicht in de zendingstatus op basis van het ordernummer en de in het systeem opgeslagen operationele gegevens. De beschikbaarheid en gedetailleerdheid van de informatie is afhankelijk van de statussen die door het logistieke proces en de vervoerdersintegraties worden geretourneerd.',
        },
        {
          title: 'Klachten en meldingen',
          content:
            'Meldingen met betrekking tot de dienstverlening, gegevensafwijkingen of operationele problemen dienen te worden ingediend via de op de website aangegeven contactkanalen (tabblad Contact/Help). Vermeld bij de melding het ordernummer en een beschrijving van het voorval om de verificatie te versnellen.',
        },
        {
          title: 'Slotbepalingen',
          content:
            'De voorwaarden zijn van kracht vanaf het moment van publicatie en kunnen worden bijgewerkt bij functionele, juridische of beveiligingswijzigingen. De actuele versie wordt op deze pagina gepubliceerd met de datum van de laatste update.',
        },
      ]
    },
    privacy: {
      title: 'Privacybeleid',
      lastUpdated: 'Laatst bijgewerkt: 06 mei 2026',
      sections: [
        {
          title: 'Gegevensbeheerder en contact',
          content:
            'De gegevensbeheerder is PaletBroker Sp. z o.o., ul. Logistyczna 12, 00-001 Warschau, e-mail: kontakt@paletbroker.pl, tel.: +48 22 123 45 67. Contactgegevens worden ook gepubliceerd op de Contact-pagina en in de footer van de website.',
        },
        {
          title: 'Welke gegevens verwerken wij',
          content:
            'Wij verwerken gegevens die in formulieren en het portaal worden verstrekt, met name: accountgegevens (e-mail, wachtwoord in gehashte vorm), bedrijfs- en factureringsgegevens, gegevens van afzender/ontvanger, zendinggegevens (afmetingen, gewicht, route), contactleadgegevens en technische informatie met betrekking tot beveiliging en werking van de website.',
        },
        {
          title: 'Doeleinden en rechtsgrondslagen van verwerking',
          content:
            'Wij verwerken gegevens voor: het uitvoeren van precontractuele maatregelen en de uitvoering van de dienst (art. 6 lid 1 sub b AVG), het nakomen van wettelijke verplichtingen, waaronder boekhoudkundige en fiscale verplichtingen (art. 6 lid 1 sub c AVG), en op basis van gerechtvaardigd belang van de beheerder, bijv. systeembeveiliging, misbruikpreventie en rechtsvorderingen (art. 6 lid 1 sub f AVG).',
        },
        {
          title: 'Ontvangers van gegevens',
          content:
            'Gegevens kunnen worden gedeeld met entiteiten die de dienstverlening ondersteunen: vervoerders, betalingsverwerker Stripe, infrastructuur- en technische dienstverleners (hosting, e-mail, foutmonitoring) en bevoegde overheidsinstanties – uitsluitend voor zover wettelijk vereist.',
        },
        {
          title: 'Cookies en technische gegevens',
          content:
            'De website maakt gebruik van cookies en vergelijkbare technologieën voor onder meer: het behouden van de inlogsessie (bijv. sessietokens), het onthouden van instellingen (bijv. taal, thema) en het waarborgen van de beveiliging van verzoeken. De cookiebanner dient voor het beheer van toestemming/interactie op gebruikersniveau.',
        },
        {
          title: 'Bewaartermijn',
          content:
            'Wij bewaren gegevens gedurende de periode die noodzakelijk is voor het verwerkingsdoel en, in het geval van boekhoudkundige documenten, gedurende de wettelijk vereiste termijn. Technische beveiligingsgegevens (bijv. inlogpogingen of resettokens) worden kort bewaard conform de systeemconfiguratie.',
        },
        {
          title: 'Uw rechten',
          content:
            'U hebt recht op inzage, rectificatie, verwijdering, beperking van verwerking, gegevensoverdraagbaarheid en bezwaar – binnen de reikwijdte van de AVG. U kunt ook een klacht indienen bij de toezichthoudende autoriteit voor gegevensbescherming.',
        },
        {
          title: 'Beveiliging',
          content:
            'Wij treffen technische en organisatorische maatregelen die passend zijn bij het risico, waaronder validatie van invoergegevens, toegangscontrole op basis van rollen, rate limiting en sessiebeveiligingsmechanismen. Gebruikerswachtwoorden worden uitsluitend opgeslagen in de vorm van cryptografische hashes.',
        },
        {
          title: 'Wijzigingen van het beleid',
          content:
            'Het privacybeleid kan worden bijgewerkt bij functionele, technologische of juridische wijzigingen. De actuele versie wordt op deze pagina gepubliceerd met de datum van de laatste update.',
        },
      ]
    },
    questions: 'Heeft u vragen?',
    questionsDesc: 'Ons juridisch en operationeel team beantwoordt graag al uw vragen over de voorwaarden.',
    contactCta: 'Neem contact op',
  },
  quote: {
    selector: {
      label: 'Kies pallettype',
      euro: 'Euro',
      semi_euro: 'Halve pallet',
      industrial: 'Industr.',
      semi_industrial: 'Halve ind.',
      custom: 'Anders',
      customDesc: 'Maatwerk',
    },
    sender: {
      title: 'Ophaallocatie',
      postalCode: 'Postcode',
      country: 'Land',
    },
    recipient: {
      title: 'Afleverlocatie',
      postalCode: 'Postcode',
      country: 'Land',
    },
    palletCount: 'Aantal pallets',
    weight: 'Gewicht (kg)',
    height: 'Hoogte (cm)',
    length: 'Lengte (cm)',
    width: 'Breedte (cm)',
    conditions: {
      title: 'Aanvullende Voorwaarden',
      stackable: 'Stapelbaar',
      fragile: 'Breekbare goederen',
      adr: 'ADR-materiaal',
      privateSender: 'Particuliere afzender',
      privateRecipient: 'Particuliere ontvanger',
    },
    estimatedCost: 'Geschatte Kosten',
    estimatedCostNote: 'De uiteindelijke prijs is afhankelijk van de gekozen vervoerder en de actuele brandstoftoeslagen.',
    submit: 'Vergelijk Koeriersaanbiedingen',
    submitting: 'Offertes berekenen...',
    currency: 'PLN netto',
    preview: {
      title: 'Ladingvoorbeeld',
      euro: 'Euro 120x80',
      semi_euro: 'Halve pallet 80x60',
      industrial: 'Industrieel 120x100',
      semi_industrial: 'Halve industrieel 120x100',
      custom: 'Maatwerk',
    },
    results: {
      title: 'Offrerezultaten',
      subtitle: 'Wij hebben de beste aanbiedingen voor uw zending gevonden van',
      to: 'naar',
      loading: 'Offertes analyseren...',
      loadingOffers: 'Offertes laden...',
      config: 'Uw Configuratie',
      edit: 'Bewerken',
      palletType: 'Pallettype',
      palletCount: 'Aantal pallets',
      weightDims: 'Gewicht & Afmetingen',
      chargeableWeight: 'Chargeerbaar gewicht',
      route: 'Route',
      conditions: 'Voorwaarden',
      found: 'Gevonden',
      offers: 'aanbiedingen',
      nonStandard: 'Offerte op Maat',
      contactManual: 'Neem contact met ons op voor een handmatige offerte',
      noOffers: 'Wij hebben geen aanbiedingen gevonden voor de opgegeven parameters. Probeer de afmetingen of het gewicht aan te passen.',
      stackableYes: 'Stapelbaar: JA',
      stackableNo: 'Stapelbaar: NEE',
      fragileYes: 'Breekbaar: JA',
      fragileNo: 'Breekbaar: NEE',
      adrYes: 'ADR: JA',
      adrNo: 'ADR: NEE',
      privateAddressYes: 'Particulier adres: JA',
      privateAddressNo: 'Particulier adres: NEE',
      noOffersTitle: 'No offers available',
      bestPrice: 'Best price',
      includesTitle: "What's included?",
      ocpTitle: 'OCP Insurance',
      ocpDesc: 'Included in carrier price',
      invoiceTitle: 'VAT Invoice',
      invoiceDesc: 'Issued automatically',
      fuelTitle: 'Fuel surcharge',
      fuelDesc: 'Always included',
      noConditions: 'No additional conditions',
    },
  },
  tracking: {
    label: 'Track & Trace',
    title: 'Waar is mijn zending?',
    subtitle: 'Voer uw ordernummer in (bijv. OR-...) en bekijk de status van uw palletzending in realtime.',
    placeholder: 'Voer het ordernummer in, bijv. OR-12345',
    search: 'Zoeken',
    searching: 'Zoeken...',
    notFound: 'Geen zending gevonden met dit nummer.',
    searchError: 'Er is een fout opgetreden tijdens het zoeken.',
    noEvents: 'Geen gebeurtenissen gevonden voor deze zending',
    checkNumber: 'Controleer het ordernummer en probeer het opnieuw.',
    status: {
      created: 'Aangemaakt',
      paid: 'Betaald',
      confirmed: 'Bevestigd',
      pickup: 'Ophaling',
      in_transit: 'Onderweg',
      delivered: 'Afgeleverd',
      cancelled: 'Geannuleerd',
    },
  },
  banner: {
    maintenance: 'Er wordt onderhoud uitgevoerd. Het plaatsen van nieuwe opdrachten is tijdelijk niet mogelijk.',
  },
  business: {
    lead: {
      name: 'Voor- en achternaam',
      namePlaceholder: 'Jan Jansen',
      email: 'Zakelijk e-mailadres',
      emailPlaceholder: 'contact@uwbedrijf.nl',
      company: 'Bedrijf',
      companyPlaceholder: 'Naam van uw bedrijf',
      volume: 'Volume (maandelijks)',
      phone: 'Telefoonnummer',
      phonePlaceholder: '+31 000 000 000',
      submit: 'Vraag gratis B2B-offerte aan',
      submitting: 'Verzenden...',
      success: 'Aanvraag verzonden',
      successDesc: 'Dank u wel. Een B2B-adviseur neemt binnen 2 uur contact met u op.',
      error: 'Verzendfout',
      errorDesc: 'De aanvraag kon niet worden opgeslagen.',
    },
  },
  errors: {
    formFailed: 'Het formulier kon niet worden verzonden.',
  },
};
