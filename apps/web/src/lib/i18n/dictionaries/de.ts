import { TranslationType } from './pl';

export const de: TranslationType = {
  common: {
    login: 'Anmelden',
    register: 'Registrieren',
    logout: 'Abmelden',
    dashboard: 'Dashboard',
    orders: 'Aufträge',
    settings: 'Einstellungen',
    to: 'nach',
  },
  nav: {
    pricing: 'Preise',
    tracking: 'Sendungsverfolgung',
    contact: 'Kontakt',
    about: 'Über uns',
  },
  home: {
    hero: {
      badge: 'B2B-Logistik für Profis',
      visualCaption: 'Palettenbetrieb 24/7',
    },
    calculator: {
      title: 'Preisrechner',
      subtitle: 'Geben Sie die grundlegenden Parameter Ihrer Sendung ein. Unser Algorithmus findet den besten Spediteur für Ihre Anforderungen und Standorte.',
      badge: 'PREISGARANTIE',
      loading: 'Rechner wird geladen...',
    },
    tracking: {
      title: 'Sendungsverfolgung',
      placeholder: 'Geben Sie die Auftragsnummer ein (z. B. OR-1234)',
      button: 'Status prüfen',
      searching: 'Suche...',
      error: 'Geben Sie die Auftragsnummer ein',
    },
    partners: {
      title: 'Vertrauenswürdige Logistikpartner',
    },
    howItWorks: {
      step1: { title: 'Online kalkulieren', desc: 'Geben Sie Postleitzahlen und Palettenabmessungen in unseren Rechner ein.' },
      step2: { title: 'Spediteur wählen', desc: 'Vergleichen Sie Preise und Lieferzeiten der führenden B2B-Spediteure.' },
      step3: { title: 'Abholung beauftragen', desc: 'Bezahlen Sie den Auftrag und warten Sie auf den Kurier. Das Etikett erhalten Sie per E-Mail.' },
    },
    stats: {
      pallets: 'Abgewickelte Paletten',
      clients: 'Aktive Kunden',
      countries: 'Länder im Netzwerk',
      savings: 'Durchschnittliche Ersparnis',
    },
    ticker: {
      received: 'Abgeholt',
      inTransit: 'Unterwegs',
      delivered: 'Zugestellt',
      ago: 'Min. her',
    },
    testimonials: {
      title: 'Was unsere Kunden sagen',
      subtitle: 'Vertrauen basiert auf Pünktlichkeit und Transparenz. Erfahren Sie, was Unternehmen sagen, die ihre Logistik mit uns optimiert haben.',
      items: [
        {
          name: 'Marek Jankowski',
          role: 'CEO, E-com Group',
          text: 'Der Wechsel zu PaletBroker hat unsere Versandzeit halbiert. Das Preissystem ist auf dem polnischen Markt unübertroffen.',
        },
        {
          name: 'Anna Nowak',
          role: 'Logistics Manager, TechFood',
          text: 'Am meisten schätzen wir den dedizierten Betreuer und die Dokumentenautomatisierung. Alles an einem Ort.',
        },
        {
          name: 'Robert Wilk',
          role: 'Inhaber, Wilk Meble',
          text: 'Die Preise sind unschlagbar und die Abwicklung von Importen aus Deutschland läuft vorbildlich. Ich kann es jedem Unternehmer empfehlen.',
        },
      ]
    },
    support: {
      title: 'Immer zu Ihrer Verfügung',
      subtitle: 'Logistik ist eine Branche, in der Zeit und Präzision zählen. Unser Support-Team überwacht Ihre Sendungen und beantwortet jede Frage in weniger als 15 Minuten.',
      badge: 'Technischer Support',
      responseTime: 'Antwortzeit',
      monitoring: 'Sendungsüberwachung',
      form: {
        title: 'Schreiben Sie unserem Experten',
        name: 'Vor- und Nachname',
        email: 'Geschäftliche E-Mail',
        message: 'Wobei können wir helfen? (z. B. API-Integrationsanfrage, Bedingungen für dauerhafte Zusammenarbeit)',
        button: 'Anfrage senden',
        sending: 'Wird gesendet...',
        success: {
          title: 'Nachricht gesendet',
          description: 'Vielen Dank. Wir antworten innerhalb von 15 Minuten.',
        },
        error: {
          title: 'Sendefehler',
          description: 'Das Formular konnte nicht gesendet werden.',
        }
      }
    },
    cta: {
      title: 'Starten Sie noch heute mit günstigerem Versand',
      subtitle: 'Schließen Sie sich über 1200 Unternehmen an, die auf die Technologie von PaletBroker vertrauen. Ihre erste Sendung kann bereits morgen beim Empfänger sein.',
      buttonRegister: 'Firmenkonto erstellen',
      buttonQuote: 'Preise ansehen',
      imageAlt: 'Lager und Palettentransport',
    },
    testimonialsLabel: 'Die Stimme unserer Kunden',
    testimonialsTitle: 'Branchenführer vertrauen uns',
    testimonialsDesc: 'Sehen Sie, wie die PaletBroker-Technologie die Lieferketten der größten Unternehmen in der Region optimiert.',
    quickQuoteLabel: 'Sendung kalkulieren',
    quickQuoteButton: 'Schnellkalkulation',
    b2bOffer: 'B2B-Angebot',
    partnerComparison: 'Wir vergleichen Angebote von',
    carriers: 'Spediteuren',
    carriersSuffix: '+',
    realtimeComparison: 'in Echtzeit.',
  },
  hero: {
    title: 'Der günstigste Palettentransport in Polen und Europa',
    subtitle: 'Vergleichen Sie die Preise der größten Spediteure und beauftragen Sie den Transport in 2 Minuten. Sparen Sie bis zu 40 % bei jeder Sendung.',
    cta: 'Sendung kalkulieren',
  },
  pricing: {
    title: 'Auf Ihr Business zugeschnittene Tarife',
    subtitle: 'Die angegebenen Preise sind Netto-Grundtarife. Dank unserer Verträge mit den größten Spediteuren bieten wir Preise, die 40 % unter den Einzelhandelstarifen liegen.',
    tabs: {
      domestic: 'Inlandstransport',
      international: 'EU-Import / Export',
    },
    labels: {
      standardRates: 'Standardtarife',
      bestOffer: 'Bestes Angebot',
      europeanRoutes: 'Europäische Routen',
      guaranteedEta: 'Garantierte ETA',
      from: 'ab',
      customRoute: 'Konkrete Route kalkulieren',
      askOther: 'Nach anderer Route fragen',
      billingQuestions: 'Fragen zur Abrechnung',
      helpAndSupport: 'Hilfe & Support',
      service247: 'Ausführung 24/7',
    },
    guarantee: {
      title: 'Tiefpreisgarantie',
      desc: 'Wenn Sie ein günstigeres Angebot für Palettentransport mit denselben Parametern finden, erstatten wir Ihnen die Differenz und geben Ihnen zusätzlich 5 % Rabatt auf den nächsten Auftrag.',
      insurance: 'Versicherung',
      fuelSurcharge: 'Kraftstoffzuschlag',
      included: 'Im Preis inbegriffen',
      alwaysIncluded: 'Immer im Preis inbegriffen',
      carrierOcp: 'Spediteur-Haftpflicht',
    },
    faq: {
      q1: 'Sind die angegebenen Preise Bruttopreise?',
      a1: 'Nein, alle Preise in der Preisliste und im Rechner sind Nettopreise. Für Inlandsdienstleistungen sind 23 % MwSt. hinzuzurechnen.',
      q2: 'Wann erhalte ich die Rechnung?',
      a2: 'Die Rechnung wird automatisch nach Bezahlung des Auftrags erstellt und an Ihre E-Mail-Adresse gesendet.',
      q3: 'Welche Zahlungsmethoden gibt es?',
      a3: 'Wir unterstützen Schnellüberweisungen (PayU), BLIK, Kreditkarten sowie traditionelle Überweisungen (für Stammkunden).',
      q4: 'Ändern sich die Preise?',
      a4: 'Die Tarife können je nach Saison und Kraftstoffpreisen variieren, aber nach Bezahlung des Auftrags ist der Preis garantiert.',
    },
    countries: {
      germany: 'Deutschland',
      czechia: 'Tschechien',
      france: 'Frankreich',
      italy: 'Italien',
      benelux: 'Benelux',
    },
    pallets: {
      semi_euro: 'Halbe Palette',
      euro: 'Europalette',
      industrial: 'Industriepalette',
      semi_industrial: 'Halbe Industriepalette',
    },
    result: {
      availableOffers: 'Verfügbare Angebote',
      delivery: 'Lieferung:',
      netto: 'netto',
      brutto: 'PLN brutto',
      order: 'Bestellen',
      details: 'Preisdetails',
      basePrice: 'Grundpreis:',
      surcharges: 'Zuschläge (Zone, Dienstleistungen):',
      total: 'Nettosumme:',
      orderNow: 'Jetzt bestellen',
    },
  },
  footer: {
    desc: 'Professionelle B2B-Logistikplattform. Wir konzentrieren uns auf die Bereitstellung hochwertiger Palettentransportdienste in Europa.',
    newsletterTitle: 'Logistik-Newsletter',
    newsletterPlaceholder: 'Ihre E-Mail',
    sections: {
      company: 'Unternehmen',
      tools: 'Tools',
      support: 'Support',
    },
    links: {
      about: 'Über uns',
      career: 'Karriere',
      contact: 'Kontakt',
      blog: 'Logistik-Blog',
      calculator: 'Palettenrechner',
      tracking: 'Sendungsverfolgung',
      api: 'API & Integrationen',
      guide: 'Paletten-Ratgeber',
      help: 'Hilfe-Center',
      terms: 'Nutzungsbedingungen',
      privacy: 'Datenschutzerklärung',
      admin: 'Admin-Bereich',
    },
    allRightsReserved: 'Alle Rechte vorbehalten.',
    tagline: 'Technologiegetriebene Logistik.',
  },
  cookies: {
    text: 'Wir verwenden Cookies, die für den ordnungsgemäßen Betrieb der Website erforderlich sind, sowie mit Ihrer Zustimmung Analyse- und Marketing-Cookies. Sie können alle akzeptieren, optionale ablehnen oder die Einstellungen anpassen.',
    privacyPolicy: 'Datenschutzerklärung',
    settings: 'Einstellungen',
    acceptAll: 'Alle akzeptieren',
    rejectAll: 'Alle ablehnen',
    alwaysActive: 'Immer aktiv',
    title: 'Wir respektieren Ihre Privatsphäre',
    settingsTitle: 'Cookie-Einstellungen',
    settingsSubtitle: 'Sie können entscheiden, welchen Cookie-Kategorien Sie zustimmen. Notwendige Cookies sind für den Betrieb der Website erforderlich und können in diesem Panel nicht deaktiviert werden.',
    essential: 'Notwendig',
    essentialDesc: 'Diese Dateien sind für den Betrieb der Website erforderlich, z.B. zum Speichern von Datenschutzeinstellungen, Sicherheit, Sitzungen oder Formularfunktionen.',
    analytics: 'Analyse',
    analyticsDesc: 'Helfen uns zu analysieren, wie Sie die Website nutzen, z.B. Besucherzahlen, Beliebtheit von Seiten und Verkehrsquellen.',
    marketing: 'Marketing',
    marketingDesc: 'Ermöglichen uns, die Wirksamkeit von Werbung zu messen und Remarketing-Kampagnen durchzuführen.',
    cancel: 'Abbrechen',
    save: 'Meine Auswahl speichern',
  },
  faq: {
    title: 'Häufig gestellte Fragen',
    subtitle: 'Alles, was Sie über den Palettenversand mit PaletBroker wissen müssen.',
    searchPlaceholder: 'Frage suchen...',
    contactTitle: 'Keine Antwort gefunden?',
    contactDesc: 'Unser Team von Logistikexperten steht Ihnen gerne zur Verfügung.',
    contactCta: 'Kontaktieren Sie uns',
    items: [
      { q: 'Wie verpacke ich eine Palette?', a: 'Die Palette muss mit Stretchfolie umwickelt sein. Die Ware darf nicht über den Palettenrand hinausragen (80 x 120 cm bei Europaletten). Alle Elemente müssen stabil auf der Palette befestigt sein.' },
      { q: 'Was kostet der Versand einer Palette?', a: 'Der Preis hängt von Abmessungen, Gewicht und Postleitzahl ab. Dank unserer Verträge mit Spediteuren bieten wir Tarife, die bis zu 40 % unter dem Marktpreis liegen.' },
      { q: 'Kann ich die Sendung versichern?', a: 'Ja, die Standard-Haftpflichtversicherung des Spediteurs ist im Preis inbegriffen. Sie können eine zusätzliche Cargo-Versicherung für hochwertige Waren abschließen.' },
      { q: 'Wann holt der Kurier die Palette ab?', a: 'Die Abholung erfolgt in der Regel am nächsten Werktag nach Bezahlung des Auftrags, sofern dieser bis 12:00 Uhr erteilt wurde.' }
    ]
  },
  careers: {
    title: 'Gestalten Sie mit uns die Zukunft der Logistik',
    subtitle: 'Wir suchen Technologie- und Transportbegeisterte, die die TSL-Branche wirklich verändern wollen.',
    whyJoin: 'Warum PaletBroker?',
    values: [
      { title: 'Moderner Stack', icon: 'code', desc: 'Wir arbeiten mit den neuesten Technologien und vermeiden technische Schulden.' },
      { title: 'Echter Einfluss', icon: 'trending_up', desc: 'Ihre Ideen werden umgesetzt. Wir schätzen Eigeninitiative.' },
      { title: 'Flexibilität', icon: 'calendar_month', desc: 'Wir bieten Remote-Arbeit und flexible Arbeitszeiten.' }
    ],
    openPositions: 'Aktuelle Stellenangebote',
    applyNow: 'Jetzt bewerben',
    noPositions: 'Derzeit haben wir keine offenen Stellen, aber wir lernen immer gerne talentierte Menschen kennen. Schreiben Sie uns!',
    offers: [
      { title: 'Internationaler Spediteur', location: 'Warschau / Hybrid', type: 'Vollzeit' },
      { title: 'Fullstack Developer (Next.js)', location: 'Remote', type: 'B2B / Arbeitsvertrag' },
      { title: 'Key Account Manager B2B', location: 'Warschau', type: 'Vollzeit' }
    ]
  },
  legal: {
    terms: {
      title: 'Nutzungsbedingungen',
      lastUpdated: 'Letzte Aktualisierung: 06. Mai 2026',
      sections: [
        {
          title: 'Umfang und Art der Dienstleistung',
          content:
            'PaletBroker ist eine digitale Plattform zur Preisberechnung und Abwicklung von Palettentransportaufträgen. Der Dienst stellt einen Preisrechner, die Auswahl von Speditionsangeboten, ein Kunden-Dashboard und einen Admin-Bereich zur Verfügung. Der Transport wird von kooperierenden Spediteuren durchgeführt; PaletBroker ist für den Betrieb der Plattform und die Abwicklung des Bestellprozesses verantwortlich.',
        },
        {
          title: 'Benutzerkonto und Zugang',
          content:
            'Die Registrierung erfordert mindestens die Angabe einer E-Mail-Adresse und eines Passworts. Der Benutzer ist für die Vertraulichkeit der Zugangsdaten verantwortlich. Das System kann den Zugang nach einer Reihe fehlgeschlagener Anmeldeversuche vorübergehend sperren. Zugriffsrollen (z. B. Kunde, Administrator) bestimmen den Umfang der sichtbaren Funktionen.',
        },
        {
          title: 'Preisberechnung und automatische Grenzen',
          content:
            'Die automatische Preisberechnung gilt für Sendungen innerhalb der technischen Grenzen des Formulars: Länge bis 300 cm, Breite bis 300 cm, Höhe bis 250 cm und Gewicht bis 1500 kg. Bei Parametern, die diese Grenzen überschreiten, oder bei nicht standardmäßigen Sendungen leitet das System in den manuellen Bearbeitungsmodus weiter.',
        },
        {
          title: 'Auftragserteilung',
          content:
            'Ein Auftrag wird nach Auswahl eines Angebots, Vervollständigung der Absender- und Empfängerdaten und Übergang zur Zahlung erteilt. Die Angabe korrekter Adress- und Kontaktdaten ist verpflichtend. Fehlerhafte Daten können zu Verzögerungen, Korrekturbedarf oder zusätzlichen Kosten des Logistikdienstleisters führen.',
        },
        {
          title: 'Zahlungen und Verkaufsdokumente',
          content:
            'Die Online-Zahlung wird über Stripe abgewickelt (einschließlich der im Checkout verfügbaren Methoden, z. B. Karte, BLIK, Przelewy24 – je nach Konfiguration und Verfügbarkeit). Nach Zahlungseingang wird der Auftragsstatus aktualisiert und die Buchhaltungsdokumente werden im Rahmen der Systemfunktionen bereitgestellt.',
        },
        {
          title: 'Pflichten des Absenders bei der Ladungsvorbereitung',
          content:
            'Der Absender ist für die ordnungsgemäße Vorbereitung der Palette verantwortlich: stabile Anordnung der Ware, Ladungssicherung und Übereinstimmung der Parameter mit der Deklaration. Waren, die besondere Transportbedingungen erfordern (z. B. empfindliche oder ADR-Waren), sind im Formular zu kennzeichnen.',
        },
        {
          title: 'Sendungsverfolgung und Statusmitteilungen',
          content:
            'Die Plattform bietet eine Statusübersicht der Sendung anhand der Auftragsnummer und der im System gespeicherten Betriebsdaten. Die Verfügbarkeit und Detailliertheit der Informationen hängt von den Statusmeldungen des Logistikprozesses und den Spediteur-Integrationen ab.',
        },
        {
          title: 'Reklamationen und Meldungen',
          content:
            'Meldungen zur Leistungserbringung, Datenabweichungen oder betrieblichen Problemen sind über die im Dienst angegebenen Kontaktkanäle (Registerkarte Kontakt/Hilfe) einzureichen. In der Meldung sind die Auftragsnummer und eine Beschreibung des Vorfalls anzugeben, was die Überprüfung beschleunigt.',
        },
        {
          title: 'Schlussbestimmungen',
          content:
            'Die Nutzungsbedingungen gelten ab dem Zeitpunkt der Veröffentlichung und können bei funktionalen, rechtlichen oder sicherheitsrelevanten Änderungen aktualisiert werden. Die aktuelle Fassung wird auf dieser Seite zusammen mit dem Datum der letzten Aktualisierung veröffentlicht.',
        },
      ]
    },
    privacy: {
      title: 'Datenschutzerklärung',
      lastUpdated: 'Letzte Aktualisierung: 06. Mai 2026',
      sections: [
        {
          title: 'Verantwortlicher und Kontakt',
          content:
            'Verantwortlicher für die Datenverarbeitung ist PaletBroker Sp. z o.o., ul. Logistyczna 12, 00-001 Warschau, E-Mail: kontakt@paletbroker.pl, Tel.: +48 22 123 45 67. Die Kontaktdaten sind auch im Bereich Kontakt und in der Fußzeile des Dienstes veröffentlicht.',
        },
        {
          title: 'Welche Daten wir verarbeiten',
          content:
            'Wir verarbeiten Daten, die in Formularen und im Dashboard angegeben werden, insbesondere: Kontodaten (E-Mail, Passwort als Hash), Firmen- und Abrechnungsdaten, Absender-/Empfängerdaten, Sendungsdaten (Abmessungen, Gewicht, Route), Kontakt-Lead-Daten sowie technische Informationen im Zusammenhang mit der Sicherheit und dem Betrieb des Dienstes.',
        },
        {
          title: 'Zwecke und Rechtsgrundlagen der Verarbeitung',
          content:
            'Wir verarbeiten Daten zu folgenden Zwecken: Durchführung vorvertraglicher Maßnahmen und Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO), Erfüllung rechtlicher Verpflichtungen, einschließlich Buchhaltungs- und Steuerpflichten (Art. 6 Abs. 1 lit. c DSGVO), sowie im berechtigten Interesse des Verantwortlichen, z. B. Systemsicherheit, Schutz vor Missbrauch und Rechtsverfolgung (Art. 6 Abs. 1 lit. f DSGVO).',
        },
        {
          title: 'Datenempfänger',
          content:
            'Daten können an Stellen weitergegeben werden, die die Leistungserbringung unterstützen: Spediteure, Zahlungsdienstleister Stripe, Infrastruktur- und Technikdienstleister (Hosting, E-Mail, Fehlerüberwachung) sowie berechtigte öffentliche Stellen – ausschließlich im gesetzlich vorgesehenen Umfang.',
        },
        {
          title: 'Cookies und technische Daten',
          content:
            'Der Dienst verwendet Cookies und ähnliche Technologien u. a. zur Aufrechterhaltung der Anmeldesitzung (z. B. Session-Tokens), zur Speicherung von Einstellungen (z. B. Sprache, Design) und zum Schutz der Anfragesicherheit. Das Cookie-Banner dient der Verwaltung der Benutzereinwilligung/-interaktion auf der Benutzeroberfläche.',
        },
        {
          title: 'Speicherdauer',
          content:
            'Wir speichern Daten für den Zeitraum, der zur Erfüllung des Verarbeitungszwecks erforderlich ist, und im Falle von Buchhaltungsdokumenten für den gesetzlich vorgeschriebenen Zeitraum. Technische Sicherheitsdaten (z. B. Informationen über Anmeldeversuche oder Reset-Tokens) werden kurzfristig gemäß der Systemkonfiguration gespeichert.',
        },
        {
          title: 'Ihre Rechte',
          content:
            'Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch – im Rahmen der DSGVO. Sie können auch eine Beschwerde bei der zuständigen Datenschutzaufsichtsbehörde einreichen.',
        },
        {
          title: 'Sicherheit',
          content:
            'Wir setzen technische und organisatorische Maßnahmen ein, die dem Risiko angemessen sind, einschließlich Eingabevalidierung, rollenbasierter Zugriffskontrolle, Ratenbegrenzung und Sitzungsschutzmechanismen. Benutzerpasswörter werden ausschließlich in Form kryptografischer Hashes gespeichert.',
        },
        {
          title: 'Änderungen der Richtlinie',
          content:
            'Die Datenschutzerklärung kann bei funktionalen, technologischen oder rechtlichen Änderungen aktualisiert werden. Die aktuelle Fassung wird auf dieser Seite zusammen mit dem Datum der letzten Aktualisierung veröffentlicht.',
        },
      ]
    },
    questions: 'Haben Sie Fragen?',
    questionsDesc: 'Unser Rechts- und Betriebsteam erläutert gerne alle Fragen zu den Nutzungsbedingungen.',
    contactCta: 'Kontaktieren Sie uns',
  },
  quote: {
    selector: {
      label: 'Palettentyp wählen',
      euro: 'Euro',
      semi_euro: 'Halbe Palette',
      industrial: 'Industrie.',
      semi_industrial: 'Halbindustrie.',
      custom: 'Andere',
      customDesc: 'Sonder.',
    },
    sender: {
      title: 'Abholort',
      postalCode: 'Postleitzahl',
      country: 'Land',
    },
    recipient: {
      title: 'Lieferort',
      postalCode: 'Postleitzahl',
      country: 'Land',
    },
    palletCount: 'Palettenanzahl',
    weight: 'Gewicht (kg)',
    height: 'Höhe (cm)',
    length: 'Länge (cm)',
    width: 'Breite (cm)',
    conditions: {
      title: 'Zusätzliche Bedingungen',
      stackable: 'Stapelbar',
      fragile: 'Zerbrechliche Ware',
      adr: 'ADR-Material',
      privateSender: 'Privater Absender',
      privateRecipient: 'Privater Empfänger',
    },
    estimatedCost: 'Geschätzte Kosten',
    estimatedCostNote: 'Der endgültige Preis hängt vom gewählten Spediteur und den aktuellen Kraftstoffzuschlägen ab.',
    submit: 'Speditionsangebote vergleichen',
    submitting: 'Angebote werden berechnet...',
    currency: 'PLN netto',
    preview: {
      title: 'Ladungsvorschau',
      euro: 'Euro 120x80',
      semi_euro: 'Halbe Palette 80x60',
      industrial: 'Industrie 120x100',
      semi_industrial: 'Halbindustrie 120x100',
      custom: 'Sondermaß',
    },
    results: {
      title: 'Preisergebnisse',
      subtitle: 'Wir haben die besten Angebote für Ihre Sendung von',
      to: 'nach',
      loading: 'Angebote werden analysiert...',
      loadingOffers: 'Angebote werden geladen...',
      config: 'Ihre Konfiguration',
      edit: 'Bearbeiten',
      palletType: 'Palettentyp',
      palletCount: 'Palettenanzahl',
      weightDims: 'Gewicht & Abmessungen',
      chargeableWeight: 'Berechnungsgewicht',
      route: 'Route',
      conditions: 'Bedingungen',
      found: 'Gefunden',
      offers: 'Angebote',
      nonStandard: 'Sonderpreisberechnung',
      contactManual: 'Kontaktieren Sie uns für eine manuelle Kalkulation',
      noOffers: 'Wir haben keine Angebote für die angegebenen Parameter gefunden. Versuchen Sie, die Abmessungen oder das Gewicht zu ändern.',
      stackableYes: 'Stapelbar: JA',
      stackableNo: 'Stapelbar: NEIN',
      fragileYes: 'Zerbrechlich: JA',
      fragileNo: 'Zerbrechlich: NEIN',
      adrYes: 'ADR: JA',
      adrNo: 'ADR: NEIN',
      privateAddressYes: 'Privatadresse: JA',
      privateAddressNo: 'Privatadresse: NEIN',
      noOffersTitle: 'Keine verfügbaren Angebote',
      bestPrice: 'Bester Preis',
      includesTitle: 'Was ist im Preis enthalten?',
      ocpTitle: 'OCP-Versicherung',
      ocpDesc: 'Im Spediteurpreis enthalten',
      invoiceTitle: 'Mehrwertsteuerrechnung',
      invoiceDesc: 'Automatisch ausgestellt',
      fuelTitle: 'Kraftstoffzuschlag',
      fuelDesc: 'Immer inklusive',
      noConditions: 'Keine zusätzlichen Bedingungen',
    },
  },
  tracking: {
    label: 'Sendungsverfolgung',
    title: 'Wo ist meine Sendung?',
    subtitle: 'Geben Sie die Auftragsnummer (z. B. OR-...) ein und prüfen Sie den Status Ihrer Palettensendung in Echtzeit.',
    placeholder: 'Geben Sie die Auftragsnummer ein, z. B. OR-12345',
    search: 'Suchen',
    searching: 'Suche...',
    notFound: 'Keine Sendung mit der angegebenen Nummer gefunden.',
    searchError: 'Bei der Suche ist ein Fehler aufgetreten.',
    noEvents: 'Keine Ereignisse für diese Sendung gefunden',
    checkNumber: 'Überprüfen Sie die Auftragsnummer und versuchen Sie es erneut.',
    status: {
      created: 'Erstellt',
      paid: 'Bezahlt',
      confirmed: 'Bestätigt',
      pickup: 'Abholung',
      in_transit: 'Unterwegs',
      delivered: 'Zugestellt',
      cancelled: 'Storniert',
    },
  },
  banner: {
    maintenance: 'Wartungsarbeiten im Gange. Die Erteilung neuer Aufträge ist vorübergehend ausgesetzt.',
  },
  business: {
    lead: {
      name: 'Vor- und Nachname',
      namePlaceholder: 'Jan Kowalski',
      email: 'Geschäftliche E-Mail',
      emailPlaceholder: 'kontakt@ihrefirma.pl',
      company: 'Unternehmen',
      companyPlaceholder: 'Name Ihres Unternehmens',
      volume: 'Volumen (monatlich)',
      phone: 'Kontakttelefon',
      phonePlaceholder: '+48 000 000 000',
      submit: 'Kostenlose B2B-Kalkulation anfordern',
      submitting: 'Wird gesendet...',
      success: 'Anfrage gesendet',
      successDesc: 'Vielen Dank. Ein B2B-Berater wird sich innerhalb von 2 Stunden mit Ihnen in Verbindung setzen.',
      error: 'Sendefehler',
      errorDesc: 'Die Anfrage konnte nicht gespeichert werden.',
    },
  },
  errors: {
    formFailed: 'Das Formular konnte nicht gesendet werden.',
  },
};
