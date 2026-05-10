import { TranslationType } from './pl';

export const it: TranslationType = {
  common: {
    login: 'Accedi',
    register: 'Registrati',
    logout: 'Disconnetti',
    dashboard: 'Dashboard',
    orders: 'Ordini',
    settings: 'Impostazioni',
    to: 'a',
  },
  nav: {
    pricing: 'Tariffe',
    tracking: 'Tracciamento',
    contact: 'Contatti',
    about: 'Chi siamo',
  },
  home: {
    hero: {
      badge: 'Logistica B2B per professionisti',
      visualCaption: 'Operazioni pallet 24/7',
    },
    calculator: {
      title: 'Calcolatore di Preventivi',
      subtitle: 'Inserisca i parametri di base della Sua spedizione. Il nostro algoritmo abbinerà il miglior corriere alle Sue esigenze e alla Sua localizzazione.',
      badge: 'PREZZO GARANTITO',
      loading: 'Caricamento calcolatore...',
    },
    tracking: {
      title: 'Monitoraggio Spedizione',
      placeholder: 'Inserisca il numero dell\'ordine (es. OR-1234)',
      button: 'Verifica stato',
      searching: 'Ricerca in corso...',
      error: 'Inserisca il numero dell\'ordine',
    },
    partners: {
      title: 'Partner Logistici di Fiducia',
    },
    howItWorks: {
      step1: { title: 'Preventivo online', desc: 'Inserisca i codici postali e le dimensioni del pallet nel nostro calcolatore.' },
      step2: { title: 'Scelga il corriere', desc: 'Confronti prezzi e tempi di consegna dei migliori corrieri B2B.' },
      step3: { title: 'Affidi il ritiro', desc: 'Paghi l\'ordine e attenda il corriere. Riceverà l\'etichetta via e-mail.' },
    },
    stats: {
      pallets: 'Pallet gestiti',
      clients: 'Clienti attivi',
      countries: 'Paesi nella rete',
      savings: 'Risparmio medio',
    },
    ticker: {
      received: 'Ricevuto',
      inTransit: 'In transito',
      delivered: 'Consegnato',
      ago: 'min fa',
    },
    testimonials: {
      title: 'Cosa dicono i nostri clienti',
      subtitle: 'La fiducia si costruisce su puntualità e trasparenza. Scopra le opinioni delle aziende che hanno ottimizzato la loro logistica con noi.',
      items: [
        {
          name: 'Marek Jankowski',
          role: 'CEO, E-com Group',
          text: 'Il passaggio a PaletBroker ha dimezzato i tempi di spedizione. Il sistema di preventivazione è imbattibile sul mercato polacco.',
        },
        {
          name: 'Anna Nowak',
          role: 'Logistics Manager, TechFood',
          text: 'Apprezziamo particolarmente l\'account manager dedicato e l\'automazione documentale. Abbiamo tutto in un unico posto.',
        },
        {
          name: 'Robert Wilk',
          role: 'Titolare, Wilk Meble',
          text: 'I prezzi sono imbattibili e la gestione dell\'import dalla Germania è impeccabile. Consiglio a ogni imprenditore.',
        },
      ]
    },
    support: {
      title: 'Sempre a Sua disposizione',
      subtitle: 'La logistica è un settore in cui tempo e precisione sono fondamentali. Il nostro team di supporto monitora le Sue spedizioni e risponde a ogni domanda in meno di 15 minuti.',
      badge: 'Supporto Tecnico',
      responseTime: 'Tempo di risposta',
      monitoring: 'Monitoraggio spedizioni',
      form: {
        title: 'Scriva al nostro esperto',
        name: 'Nome e cognome',
        email: 'E-mail aziendale',
        message: 'In cosa possiamo aiutarLa? (Es. richiesta integrazione API, condizioni di collaborazione continuativa)',
        button: 'Invia richiesta',
        sending: 'Invio in corso...',
        success: {
          title: 'Messaggio inviato',
          description: 'La ringraziamo. Le risponderemo entro 15 minuti.',
        },
        error: {
          title: 'Errore di invio',
          description: 'Impossibile inviare il modulo.',
        }
      }
    },
    cta: {
      title: 'Inizi a spedire a prezzi più bassi già oggi',
      subtitle: 'Si unisca a oltre 1200 aziende che hanno scelto la tecnologia PaletBroker. La Sua prima spedizione può essere a destino già domani.',
      buttonRegister: 'Creare account aziendale',
      buttonQuote: 'Consulta le tariffe',
      imageAlt: 'Magazzino e trasporto pallet',
    },
    testimonialsLabel: 'La voce dei nostri clienti',
    testimonialsTitle: 'I leader del settore hanno scelto noi',
    testimonialsDesc: 'Scopra come la tecnologia PaletBroker ottimizza le catene di fornitura delle più grandi aziende della regione.',
    quickQuoteLabel: 'Preventivo spedizione',
    quickQuoteButton: 'Preventivo Rapido',
    b2bOffer: 'Offerta B2B',
    partnerComparison: 'Confrontiamo le offerte',
    carriers: 'corrieri',
    carriersSuffix: '+',
    realtimeComparison: 'in tempo reale.',
  },
  hero: {
    title: 'Il trasporto pallet più economico in Polonia e in Europa',
    subtitle: 'Confronti i prezzi dei maggiori corrieri e prenoti il trasporto in 2 minuti. Risparmi fino al 40% su ogni spedizione.',
    cta: 'Calcoli il preventivo',
  },
  pricing: {
    title: 'Tariffe studiate per il business',
    subtitle: 'Le tariffe indicate sono prezzi base netti. Grazie agli accordi con i principali corrieri, offriamo prezzi inferiori del 40% rispetto ai listini al dettaglio.',
    tabs: {
      domestic: 'Trasporto Nazionale',
      international: 'Import / Export UE',
    },
    labels: {
      standardRates: 'Tariffe Standard',
      bestOffer: 'Migliore offerta',
      europeanRoutes: 'Destinazioni Europee',
      guaranteedEta: 'ETA Garantito',
      from: 'da',
      customRoute: 'Preventivo per tratta specifica',
      askOther: 'Richieda un\'altra destinazione',
      billingQuestions: 'Domande sulla fatturazione',
      helpAndSupport: 'Aiuto e Supporto',
      service247: 'Operatività 24/7',
    },
    guarantee: {
      title: 'Garanzia del prezzo più basso',
      desc: 'Se trova un\'offerta più economica per il trasporto pallet con gli stessi parametri, Le rimborsiamo la differenza e Le offriamo un ulteriore 5% di sconto sul prossimo ordine.',
      insurance: 'Assicurazione',
      fuelSurcharge: 'Supplemento carburante',
      included: 'Incluso nel prezzo',
      alwaysIncluded: 'Sempre incluso',
      carrierOcp: 'RC del Corriere',
    },
    faq: {
      q1: 'I prezzi indicati sono IVA inclusa?',
      a1: 'No, tutti i prezzi nel listino e nel calcolatore sono prezzi netti. Occorre aggiungere l\'IVA al 23% per i servizi nazionali.',
      q2: 'Quando riceverò la fattura?',
      a2: 'La fattura viene generata automaticamente dopo il pagamento dell\'ordine e inviata al Suo indirizzo e-mail.',
      q3: 'Quali sono i metodi di pagamento?',
      a3: 'Accettiamo bonifici istantanei (PayU), BLIK, carte di pagamento e bonifici tradizionali (per clienti abituali).',
      q4: 'I prezzi possono variare?',
      a4: 'Le tariffe possono subire variazioni in base alla stagionalità e al prezzo del carburante, ma dopo il pagamento dell\'ordine il prezzo è garantito.',
    },
    countries: {
      germany: 'Germania',
      czechia: 'Repubblica Ceca',
      france: 'Francia',
      italy: 'Italia',
      benelux: 'Benelux',
    },
    pallets: {
      semi_euro: 'Mezzo Pallet',
      euro: 'Pallet Euro',
      industrial: 'Pallet Industriale',
      semi_industrial: 'Mezzo Industriale',
    },
    result: {
      availableOffers: 'Offerte disponibili',
      delivery: 'Consegna:',
      netto: 'netto',
      brutto: 'PLN IVA inclusa',
      order: 'Ordina',
      details: 'Dettagli del preventivo',
      basePrice: 'Prezzo base:',
      surcharges: 'Supplementi (zona, servizi):',
      total: 'Totale netto:',
      orderNow: 'Ordina ora',
    },
  },
  footer: {
    desc: 'Piattaforma logistica B2B professionale. Ci dedichiamo a fornire servizi di trasporto pallet della massima qualità in Europa.',
    newsletterTitle: 'Newsletter logistica',
    newsletterPlaceholder: 'La Sua e-mail',
    sections: {
      company: 'Azienda',
      tools: 'Strumenti',
      support: 'Supporto',
    },
    links: {
      about: 'Chi siamo',
      career: 'Lavora con noi',
      contact: 'Contatti',
      blog: 'Blog logistico',
      calculator: 'Calcolatore pallet',
      tracking: 'Tracciamento spedizione',
      api: 'API e Integrazioni',
      guide: 'Guida ai pallet',
      help: 'Centro assistenza',
      terms: 'Termini di servizio',
      privacy: 'Informativa sulla privacy',
      admin: 'Pannello Amministratore',
    },
    allRightsReserved: 'Tutti i diritti riservati.',
    tagline: 'Logistica alimentata dalla tecnologia.',
  },
  cookies: {
    text: 'Utilizziamo cookie necessari per il corretto funzionamento del sito e, con il tuo consenso, cookie analitici e di marketing. Puoi accettare tutti, rifiutare quelli opzionali o personalizzare le impostazioni.',
    privacyPolicy: 'Informativa sulla Privacy',
    settings: 'Impostazioni',
    acceptAll: 'Accetto tutti',
    rejectAll: 'Rifiuta tutti',
    alwaysActive: 'Sempre attivo',
    title: 'Rispettiamo la tua privacy',
    settingsTitle: 'Impostazioni cookie',
    settingsSubtitle: 'Puoi decidere a quali categorie di cookie acconsentire. I cookie necessari sono richiesti per il funzionamento del sito e non possono essere disattivati in questo pannello.',
    essential: 'Essenziali',
    essentialDesc: 'Questi file sono necessari per il funzionamento del sito, ad esempio per salvare le impostazioni sulla privacy, la sicurezza, le sessioni o i moduli.',
    analytics: 'Analitici',
    analyticsDesc: 'Ci aiutano ad analizzare l\'uso del sito, come il numero di visite, la popolarità delle pagine e le fonti di traffico.',
    marketing: 'Marketing',
    marketingDesc: 'Ci permettono di misurare l\'efficacia pubblicitaria e condurre campagne di remarketing.',
    cancel: 'Annulla',
    save: 'Salva le mie scelte',
  },
  faq: {
    title: 'Domande frequenti',
    subtitle: 'Tutto ciò che deve sapere sulla spedizione di pallet con PaletBroker.',
    searchPlaceholder: 'Cerchi una domanda...',
    contactTitle: 'Non ha trovato la risposta?',
    contactDesc: 'Il nostro team di esperti logistici è pronto ad assisterLa.',
    contactCta: 'Ci contatti',
    items: [
      { q: 'Come imballare un pallet?', a: 'Il pallet deve essere avvolto con pellicola estensibile. La merce non deve sporgere oltre il perimetro del pallet (80x120 cm per Euro). Tutti gli elementi devono essere fissati saldamente alla base.' },
      { q: 'Quanto costa spedire un pallet?', a: 'Il prezzo dipende da dimensioni, peso e codice postale. Grazie ai nostri accordi con i corrieri, offriamo tariffe fino al 40% inferiori a quelle di mercato.' },
      { q: 'Posso assicurare la spedizione?', a: 'Sì, l\'assicurazione RC standard del corriere è inclusa nel prezzo. Può acquistare un\'assicurazione Cargo supplementare per merci di alto valore.' },
      { q: 'Quando il corriere ritirerà il pallet?', a: 'Di norma il ritiro avviene il giorno lavorativo successivo al pagamento dell\'ordine, se l\'ordine è stato effettuato entro le ore 12:00.' }
    ]
  },
  careers: {
    title: 'Costruisca con noi il futuro della logistica',
    subtitle: 'Cerchiamo appassionati di tecnologia e trasporti che vogliano trasformare concretamente il settore TSL.',
    whyJoin: 'Perché PaletBroker?',
    values: [
      { title: 'Stack Moderno', icon: 'code', desc: 'Lavoriamo con le tecnologie più recenti, eliminando il debito tecnico.' },
      { title: 'Impatto Reale', icon: 'trending_up', desc: 'Le Sue idee vengono implementate. Valorizziamo l\'iniziativa.' },
      { title: 'Flessibilità', icon: 'calendar_month', desc: 'Offriamo lavoro da remoto e orari flessibili.' }
    ],
    openPositions: 'Posizioni aperte',
    applyNow: 'Candidati ora',
    noPositions: 'Al momento non abbiamo selezioni aperte, ma siamo sempre lieti di conoscere persone di talento. Ci scriva!',
    offers: [
      { title: 'Spedizioniere Internazionale', location: 'Varsavia / Ibrido', type: 'Tempo pieno' },
      { title: 'Fullstack Developer (Next.js)', location: 'Remoto', type: 'B2B / Contratto di lavoro' },
      { title: 'Key Account Manager B2B', location: 'Varsavia', type: 'Tempo pieno' }
    ]
  },
  legal: {
    terms: {
      title: 'Termini e Condizioni di Servizio',
      lastUpdated: 'Ultimo aggiornamento: 06 maggio 2026',
      sections: [
        {
          title: 'Ambito e natura del servizio',
          content:
            'PaletBroker è una piattaforma digitale per la preventivazione e la gestione degli ordini di trasporto pallet. Il servizio mette a disposizione un calcolatore di preventivi, la scelta dell\'offerta del corriere, un pannello cliente e un pannello di amministrazione. Il trasporto è effettuato dai corrieri partner; PaletBroker è responsabile del funzionamento della piattaforma e della gestione del processo d\'ordine.',
        },
        {
          title: 'Account utente e accesso',
          content:
            'La registrazione richiede almeno un indirizzo e-mail e una password. L\'utente è responsabile della riservatezza delle credenziali di accesso. Il sistema può bloccare temporaneamente l\'accesso dopo una serie di tentativi falliti. I ruoli di accesso (es. cliente, amministratore) determinano l\'insieme delle funzionalità visibili.',
        },
        {
          title: 'Preventivo e limiti automatici',
          content:
            'Il preventivo automatico riguarda spedizioni entro i limiti tecnici del modulo: lunghezza fino a 300 cm, larghezza fino a 300 cm, altezza fino a 250 cm e peso fino a 1500 kg. Per parametri che superano i limiti o spedizioni non standard, il sistema reindirizza alla modalità di gestione manuale.',
        },
        {
          title: 'Effettuazione dell\'ordine',
          content:
            'L\'ordine viene effettuato dopo la scelta dell\'offerta, la compilazione dei dati del mittente e del destinatario e il passaggio al pagamento. È obbligatorio fornire dati anagrafici e di contatto corretti. Dati errati possono causare ritardi, la necessità di rettifiche o costi aggiuntivi da parte dell\'operatore logistico.',
        },
        {
          title: 'Pagamenti e documenti fiscali',
          content:
            'Il pagamento online è gestito da Stripe (inclusi i metodi disponibili nel checkout, ad es. carta, BLIK, Przelewy24 – in base alla configurazione e disponibilità). Dopo l\'accredito del pagamento lo stato dell\'ordine viene aggiornato e i documenti contabili sono resi disponibili tramite le funzionalità di sistema.',
        },
        {
          title: 'Obblighi del mittente nella preparazione del carico',
          content:
            'Il mittente è responsabile della corretta preparazione del pallet: disposizione stabile della merce, messa in sicurezza del carico e conformità dei parametri a quanto dichiarato. Le merci che richiedono condizioni di trasporto particolari (es. delicate o ADR) devono essere indicate nel modulo.',
        },
        {
          title: 'Tracciamento e comunicazione degli stati',
          content:
            'La piattaforma consente di visualizzare lo stato della spedizione in base al numero d\'ordine e ai dati operativi registrati nel sistema. La disponibilità e il dettaglio delle informazioni dipendono dagli stati restituiti dal processo logistico e dalle integrazioni con i corrieri.',
        },
        {
          title: 'Reclami e segnalazioni',
          content:
            'Le segnalazioni relative all\'esecuzione del servizio, a difformità dei dati o a problematiche operative devono essere inoltrate attraverso i canali di contatto indicati nel sito (sezione Contatti/Assistenza). Nella segnalazione occorre indicare il numero d\'ordine e la descrizione dell\'evento, per accelerare la verifica.',
        },
        {
          title: 'Disposizioni finali',
          content:
            'I termini di servizio sono in vigore dal momento della pubblicazione e possono essere aggiornati in caso di modifiche funzionali, legali o di sicurezza. La versione aggiornata è pubblicata su questa pagina con la data dell\'ultimo aggiornamento.',
        },
      ]
    },
    privacy: {
      title: 'Informativa sulla Privacy',
      lastUpdated: 'Ultimo aggiornamento: 06 maggio 2026',
      sections: [
        {
          title: 'Titolare del trattamento e contatti',
          content:
            'Il titolare del trattamento è PaletBroker Sp. z o.o., ul. Logistyczna 12, 00-001 Varsavia, e-mail: kontakt@paletbroker.pl, tel.: +48 22 123 45 67. I dati di contatto sono pubblicati anche nella sezione Contatti e nel footer del sito.',
        },
        {
          title: 'Quali dati trattiamo',
          content:
            'Trattiamo i dati forniti nei moduli e nel pannello, in particolare: dati dell\'account (e-mail, password in forma hash), dati aziendali e di fatturazione, dati del mittente/destinatario, dati della spedizione (dimensioni, peso, tratta), dati dei lead di contatto e informazioni tecniche relative alla sicurezza e al funzionamento del servizio.',
        },
        {
          title: 'Finalità e basi giuridiche del trattamento',
          content:
            'Trattiamo i dati per: l\'esecuzione di misure precontrattuali e l\'adempimento del servizio (art. 6, par. 1, lett. b GDPR), l\'adempimento di obblighi legali, inclusi quelli contabili e fiscali (art. 6, par. 1, lett. c GDPR), e per il legittimo interesse del titolare, ad es. sicurezza del sistema, protezione da abusi e tutela dei diritti (art. 6, par. 1, lett. f GDPR).',
        },
        {
          title: 'Destinatari dei dati',
          content:
            'I dati possono essere comunicati a soggetti che supportano l\'erogazione del servizio: corrieri, operatore di pagamento Stripe, fornitori di infrastruttura e servizi tecnici (hosting, posta elettronica, monitoraggio errori) e autorità pubbliche competenti – esclusivamente nei limiti previsti dalla legge.',
        },
        {
          title: 'Cookie e dati tecnici',
          content:
            'Il sito utilizza cookie e tecnologie simili, tra l\'altro, per mantenere la sessione di login (es. token di sessione), memorizzare le impostazioni (es. lingua, tema) e proteggere la sicurezza delle richieste. Il banner dei cookie serve a gestire il consenso/l\'interazione dell\'utente a livello di interfaccia.',
        },
        {
          title: 'Periodo di conservazione',
          content:
            'Conserviamo i dati per il periodo necessario al conseguimento della finalità del trattamento e, nel caso di documenti contabili, per il periodo previsto dalla legge. I dati tecnici di sicurezza (es. informazioni sui tentativi di accesso o token di reset) sono conservati a breve termine secondo la configurazione di sistema.',
        },
        {
          title: 'I Suoi diritti',
          content:
            'Lei ha il diritto di accedere ai dati, di rettificarli, cancellarli, limitarne il trattamento, alla portabilità dei dati e di opposizione – nei limiti previsti dal GDPR. Può inoltre presentare un reclamo al Presidente dell\'Autorità per la Protezione dei Dati Personali.',
        },
        {
          title: 'Sicurezza',
          content:
            'Adottiamo misure tecniche e organizzative adeguate al rischio, tra cui la validazione dei dati di input, il controllo degli accessi basato sui ruoli, la limitazione del numero di richieste e i meccanismi di protezione della sessione. Le password degli utenti sono conservate esclusivamente in forma di hash crittografici.',
        },
        {
          title: 'Modifiche all\'informativa',
          content:
            'L\'informativa sulla privacy può essere aggiornata in caso di modifiche funzionali, tecnologiche o legali. La versione aggiornata è pubblicata su questa pagina con la data dell\'ultimo aggiornamento.',
        },
      ]
    },
    questions: 'Ha domande?',
    questionsDesc: 'Il nostro team legale e operativo è a disposizione per chiarire ogni dubbio sui termini di servizio.',
    contactCta: 'Ci contatti',
  },
  quote: {
    selector: {
      label: 'Selezioni il tipo di pallet',
      euro: 'Euro',
      semi_euro: 'Mezzo Pallet',
      industrial: 'Industriale',
      semi_industrial: 'Mezzo Ind.',
      custom: 'Altro',
      customDesc: 'Non standard',
    },
    sender: {
      title: 'Luogo di Spedizione',
      postalCode: 'Codice postale',
      country: 'Paese',
    },
    recipient: {
      title: 'Luogo di Consegna',
      postalCode: 'Codice postale',
      country: 'Paese',
    },
    palletCount: 'Numero di pallet',
    weight: 'Peso (kg)',
    height: 'Altezza (cm)',
    length: 'Lunghezza (cm)',
    width: 'Larghezza (cm)',
    conditions: {
      title: 'Condizioni Aggiuntive',
      stackable: 'Sovrapponibile',
      fragile: 'Merce fragile',
      adr: 'Materiale ADR',
      privateSender: 'Mittente privato',
      privateRecipient: 'Destinatario privato',
    },
    estimatedCost: 'Costo Stimato',
    estimatedCostNote: 'Il prezzo finale dipende dal corriere selezionato e dai supplementi carburante correnti.',
    submit: 'Confronta Offerte dei Corrieri',
    submitting: 'Elaborazione offerte in corso...',
    currency: 'PLN netto',
    preview: {
      title: 'Anteprima del carico',
      euro: 'Euro 120x80',
      semi_euro: 'Mezzo Pallet 80x60',
      industrial: 'Industriale 120x100',
      semi_industrial: 'Mezzo Industriale 120x100',
      custom: 'Non standard',
    },
    results: {
      title: 'Risultati del Preventivo',
      subtitle: 'Abbiamo trovato le migliori offerte per la Sua spedizione da',
      to: 'a',
      loading: 'Analisi offerte in corso...',
      loadingOffers: 'Caricamento offerte...',
      config: 'La Sua Configurazione',
      edit: 'Modifica',
      palletType: 'Tipo di pallet',
      palletCount: 'Numero di pallet',
      weightDims: 'Peso e Dimensioni',
      chargeableWeight: 'Peso tassabile',
      route: 'Tratta',
      conditions: 'Condizioni',
      found: 'Trovate',
      offers: 'offerte',
      nonStandard: 'Preventivo Non Standard',
      contactManual: 'Ci contatti per un preventivo manuale',
      noOffers: 'Non abbiamo trovato offerte per i parametri indicati. Provi a modificare dimensioni o peso.',
      stackableYes: 'Sovrapponibile: SÌ',
      stackableNo: 'Sovrapponibile: NO',
      fragileYes: 'Fragile: SÌ',
      fragileNo: 'Fragile: NO',
      adrYes: 'ADR: SÌ',
      adrNo: 'ADR: NO',
      privateAddressYes: 'Indirizzo privato: SÌ',
      privateAddressNo: 'Indirizzo privato: NO',
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
    label: 'Tracciamento',
    title: 'Dov\'è la mia spedizione?',
    subtitle: 'Inserisca il numero d\'ordine (es. OR-...) e verifichi lo stato della Sua spedizione pallet in tempo reale.',
    placeholder: 'Inserisca il numero d\'ordine, es. OR-12345',
    search: 'Cerca',
    searching: 'Ricerca in corso...',
    notFound: 'Nessuna spedizione trovata con il numero indicato.',
    searchError: 'Si è verificato un errore durante la ricerca.',
    noEvents: 'Nessun evento trovato per questa spedizione',
    checkNumber: 'Verifichi la correttezza del numero d\'ordine e riprovi.',
    status: {
      created: 'Creato',
      paid: 'Pagato',
      confirmed: 'Confermato',
      pickup: 'Ritiro',
      in_transit: 'In transito',
      delivered: 'Consegnato',
      cancelled: 'Annullato',
    },
  },
  banner: {
    maintenance: 'Manutenzione in corso. L\'inserimento di nuovi ordini è temporaneamente sospeso.',
  },
  business: {
    lead: {
      name: 'Nome e cognome',
      namePlaceholder: 'Jan Kowalski',
      email: 'E-mail aziendale',
      emailPlaceholder: 'kontakt@twojafirma.pl',
      company: 'Azienda',
      companyPlaceholder: 'Nome della Sua azienda',
      volume: 'Volume (mensile)',
      phone: 'Telefono di contatto',
      phonePlaceholder: '+48 000 000 000',
      submit: 'Richieda un preventivo B2B gratuito',
      submitting: 'Invio in corso...',
      success: 'Richiesta inviata',
      successDesc: 'La ringraziamo. Un consulente B2B La contatterà entro 2 ore.',
      error: 'Errore di invio',
      errorDesc: 'Impossibile salvare la richiesta.',
    },
  },
  errors: {
    formFailed: 'Impossibile inviare il modulo.',
  },
};
