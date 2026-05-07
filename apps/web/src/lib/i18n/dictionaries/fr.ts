import { TranslationType } from './pl';

export const fr: TranslationType = {
  common: {
    login: 'Connexion',
    register: 'Inscription',
    logout: 'Déconnexion',
    dashboard: 'Tableau de bord',
    orders: 'Commandes',
    settings: 'Paramètres',
    to: 'à',
  },
  nav: {
    pricing: 'Tarifs',
    tracking: 'Suivi',
    contact: 'Contact',
    about: 'À propos',
  },
  home: {
    hero: {
      badge: 'Logistique B2B pour professionnels',
      visualCaption: 'Opérations de palettes 24h/24 et 7j/7',
    },
    calculator: {
      title: 'Calculateur de devis',
      subtitle: 'Saisissez les paramètres de base de votre envoi. Notre algorithme sélectionnera le meilleur transporteur en fonction de vos besoins et de votre localisation.',
      badge: 'PRIX GARANTI',
      loading: 'Chargement du calculateur...',
    },
    tracking: {
      title: 'Suivi d\'expédition',
      placeholder: 'Saisissez le numéro de commande (ex. : OR-1234)',
      button: 'Vérifier le statut',
      searching: 'Recherche en cours...',
      error: 'Veuillez saisir un numéro de commande',
    },
    partners: {
      title: 'Partenaires logistiques de confiance',
    },
    howItWorks: {
      step1: { title: 'Évaluez en ligne', desc: 'Saisissez les codes postaux et les dimensions de la palette dans notre calculateur.' },
      step2: { title: 'Choisissez un transporteur', desc: 'Comparez les prix et les délais de livraison des meilleurs transporteurs B2B.' },
      step3: { title: 'Planifiez l\'enlèvement', desc: 'Réglez votre commande et attendez le transporteur. L\'étiquette vous sera envoyée par e-mail.' },
    },
    stats: {
      pallets: 'Palettes traitées',
      clients: 'Clients actifs',
      countries: 'Pays dans le réseau',
      savings: 'Économie moyenne',
    },
    ticker: {
      received: 'Réceptionné',
      inTransit: 'En transit',
      delivered: 'Livré',
      ago: 'min',
    },
    testimonials: {
      title: 'Ce que disent nos clients',
      subtitle: 'La confiance se construit sur la ponctualité et la transparence. Découvrez les avis des entreprises qui ont optimisé leur logistique avec nous.',
      items: [
        {
          name: 'Marek Jankowski',
          role: 'PDG, E-com Group',
          text: 'Le passage à PaletBroker a réduit de moitié le temps de traitement des envois. Le système de devis est inégalé sur le marché polonais.',
        },
        {
          name: 'Anna Nowak',
          role: 'Responsable Logistique, TechFood',
          text: 'Ce que nous apprécions le plus, c\'est le conseiller dédié et l\'automatisation des documents. Tout est centralisé au même endroit.',
        },
        {
          name: 'Robert Wilk',
          role: 'Propriétaire, Wilk Meble',
          text: 'Les prix sont imbattables et la gestion des importations depuis l\'Allemagne est exemplaire. Je recommande à tout entrepreneur.',
        },
      ]
    },
    support: {
      title: 'Toujours à votre disposition',
      subtitle: 'La logistique est un secteur où le temps et la précision sont essentiels. Notre équipe d\'assistance veille sur vos envois et répond à toutes vos questions en moins de 15 minutes.',
      badge: 'Support technique',
      responseTime: 'Délai de réponse',
      monitoring: 'Suivi des expéditions',
      form: {
        title: 'Écrivez à notre expert',
        name: 'Nom et prénom',
        email: 'E-mail professionnel',
        message: 'Comment pouvons-nous vous aider ? (Ex. : demande d\'intégration API, conditions de collaboration permanente)',
        button: 'Envoyer la demande',
        sending: 'Envoi en cours...',
        success: {
          title: 'Message envoyé',
          description: 'Merci. Nous répondrons dans les 15 minutes.',
        },
        error: {
          title: 'Erreur d\'envoi',
          description: 'Échec de l\'envoi du formulaire.',
        }
      }
    },
    cta: {
      title: 'Commencez à expédier moins cher dès aujourd\'hui',
      subtitle: 'Rejoignez plus de 1 200 entreprises qui font confiance à la technologie PaletBroker. Votre premier envoi peut être livré dès demain.',
      buttonRegister: 'Créer un compte professionnel',
      buttonQuote: 'Consulter les tarifs',
      imageAlt: 'Entrepôt et transport de palettes',
    },
    testimonialsLabel: 'La voix de nos clients',
    testimonialsTitle: 'Des leaders sectoriels nous font confiance',
    testimonialsDesc: 'Découvrez comment la technologie PaletBroker optimise les chaînes d\'approvisionnement des plus grandes entreprises de la région.',
    quickQuoteLabel: 'Évaluez votre envoi',
    quickQuoteButton: 'Devis rapide',
    b2bOffer: 'Offre B2B',
    partnerComparison: 'Nous comparons les offres',
    carriers: 'transporteurs',
    carriersSuffix: '+',
    realtimeComparison: 'en temps réel.',
  },
  hero: {
    title: 'Le transport de palettes le moins cher en Pologne et en Europe',
    subtitle: 'Comparez les prix des plus grands transporteurs et commandez votre transport en 2 minutes. Économisez jusqu\'à 40 % sur chaque envoi.',
    cta: 'Évaluez votre envoi',
  },
  pricing: {
    title: 'Des tarifs adaptés à votre activité',
    subtitle: 'Les tarifs indiqués sont des prix de base hors taxes. Grâce à nos accords avec les plus grands transporteurs, nous proposons des prix inférieurs de 40 % aux grilles tarifaires classiques.',
    tabs: {
      domestic: 'Transport national',
      international: 'Import / Export UE',
    },
    labels: {
      standardRates: 'Tarifs standard',
      bestOffer: 'Meilleure offre',
      europeanRoutes: 'Destinations européennes',
      guaranteedEta: 'ETA garanti',
      from: 'à partir de',
      customRoute: 'Évaluez un itinéraire spécifique',
      askOther: 'Demandez une autre destination',
      billingQuestions: 'Questions de facturation',
      helpAndSupport: 'Aide et support',
      service247: 'Service 24h/24 et 7j/7',
    },
    guarantee: {
      title: 'Garantie du prix le plus bas',
      desc: 'Si vous trouvez une offre moins chère pour un transport de palette avec les mêmes paramètres, nous vous remboursons la différence et vous offrons 5 % de réduction supplémentaire sur votre prochaine commande.',
      insurance: 'Assurance',
      fuelSurcharge: 'Surcharge carburant',
      included: 'Inclus',
      alwaysIncluded: 'Toujours inclus',
      carrierOcp: 'OCP Transporteur',
    },
    faq: {
      q1: 'Les prix indiqués sont-ils TTC ?',
      a1: 'Non, tous les prix figurant dans la grille tarifaire et le calculateur sont des prix hors taxes. La TVA de 23 % doit être ajoutée pour les services nationaux.',
      q2: 'Quand recevrai-je la facture ?',
      a2: 'La facture de TVA est générée automatiquement après le paiement de la commande et envoyée à votre adresse e-mail.',
      q3: 'Quels sont les moyens de paiement ?',
      a3: 'Nous acceptons les virements rapides (PayU), BLIK, les cartes bancaires ainsi que les virements traditionnels (pour les clients réguliers).',
      q4: 'Les prix changent-ils ?',
      a4: 'Les tarifs peuvent varier en fonction de la saisonnalité et du prix du carburant, mais une fois la commande payée, le prix est garanti.',
    },
    countries: {
      germany: 'Allemagne',
      czechia: 'République tchèque',
      france: 'France',
      italy: 'Italie',
      benelux: 'Benelux',
    },
    pallets: {
      semi_euro: 'Demi-palette',
      euro: 'Palette Euro',
      industrial: 'Palette industrielle',
      semi_industrial: 'Demi-palette industrielle',
    },
    result: {
      availableOffers: 'Offres disponibles',
      delivery: 'Livraison :',
      netto: 'HT',
      brutto: 'PLN TTC',
      order: 'Commander',
      details: 'Détails du devis',
      basePrice: 'Prix de base :',
      surcharges: 'Suppléments (zone, services) :',
      total: 'Total HT :',
      orderNow: 'Commander maintenant',
    },
  },
  footer: {
    desc: 'Plateforme logistique B2B professionnelle. Nous nous engageons à fournir des services de transport de palettes de la plus haute qualité en Europe.',
    newsletterTitle: 'Newsletter logistique',
    newsletterPlaceholder: 'Votre e-mail',
    sections: {
      company: 'Entreprise',
      tools: 'Outils',
      support: 'Support',
    },
    links: {
      about: 'À propos',
      career: 'Carrière',
      contact: 'Contact',
      blog: 'Blog logistique',
      calculator: 'Calculateur de palettes',
      tracking: 'Suivi d\'expédition',
      api: 'API & Intégrations',
      guide: 'Guide des palettes',
      help: 'Centre d\'aide',
      terms: 'Conditions d\'utilisation',
      privacy: 'Politique de confidentialité',
      admin: 'Panneau d\'administration',
    },
    allRightsReserved: 'Tous droits réservés.',
    tagline: 'La logistique propulsée par la technologie.',
  },
  cookies: {
    text: 'Nous utilisons des cookies nécessaires au bon fonctionnement du site et, avec votre consentement, des cookies analytiques et marketing. Vous pouvez tout accepter, refuser les optionnels ou personnaliser les paramètres.',
    privacyPolicy: 'Politique de confidentialité',
    settings: 'Paramètres',
    acceptAll: 'Tout accepter',
    rejectAll: 'Tout refuser',
    alwaysActive: 'Toujours actif',
    title: 'Nous respectons votre vie privée',
    settingsTitle: 'Paramètres des cookies',
    settingsSubtitle: 'Vous pouvez décider des catégories de cookies auxquelles vous consentez. Les cookies nécessaires sont requis pour le fonctionnement du site et ne peuvent pas être désactivés dans ce panneau.',
    essential: 'Essentiels',
    essentialDesc: 'Ces fichiers sont nécessaires au fonctionnement du site, par exemple pour enregistrer les paramètres de confidentialité, la sécurité, les sessions ou les formulaires.',
    analytics: 'Analytiques',
    analyticsDesc: 'Nous aident à analyser votre utilisation du site, comme le nombre de visites, la popularité des pages et les sources de trafic.',
    marketing: 'Marketing',
    marketingDesc: 'Nous permettent de mesurer l\'efficacité publicitaire et de mener des campagnes de remarketing.',
    cancel: 'Annuler',
    save: 'Enregistrer mes choix',
  },
  faq: {
    title: 'Foire aux questions',
    subtitle: 'Tout ce que vous devez savoir sur l\'expédition de palettes avec PaletBroker.',
    searchPlaceholder: 'Rechercher une question...',
    contactTitle: 'Vous n\'avez pas trouvé de réponse ?',
    contactDesc: 'Notre équipe d\'experts logistiques est prête à vous aider.',
    contactCta: 'Contactez-nous',
    items: [
      { q: 'Comment emballer une palette ?', a: 'La palette doit être enveloppée d\'un film étirable. La marchandise ne doit pas dépasser du contour de la palette (80×120 cm pour l\'Euro). Tous les éléments doivent être solidement fixés à la base.' },
      { q: 'Combien coûte l\'expédition d\'une palette ?', a: 'Le prix dépend des dimensions, du poids et du code postal. Grâce à nos accords avec les transporteurs, nous proposons des tarifs jusqu\'à 40 % inférieurs à ceux du marché.' },
      { q: 'Puis-je assurer mon envoi ?', a: 'Oui, l\'assurance OCP standard du transporteur est incluse. Vous pouvez souscrire une assurance Cargo complémentaire pour les marchandises de grande valeur.' },
      { q: 'Quand le transporteur viendra-t-il chercher la palette ?', a: 'L\'enlèvement a généralement lieu le jour ouvré suivant le paiement de la commande, si celle-ci a été passée avant 12h00.' }
    ]
  },
  careers: {
    title: 'Construisez l\'avenir de la logistique avec nous',
    subtitle: 'Nous recherchons des passionnés de technologie et de transport qui souhaitent transformer concrètement le secteur TSL.',
    whyJoin: 'Pourquoi PaletBroker ?',
    values: [
      { title: 'Stack moderne', icon: 'code', desc: 'Nous travaillons avec les dernières technologies, en éliminant la dette technique.' },
      { title: 'Impact réel', icon: 'trending_up', desc: 'Vos idées sont mises en œuvre. Nous valorisons l\'initiative.' },
      { title: 'Flexibilité', icon: 'calendar_month', desc: 'Nous offrons le télétravail et des horaires flexibles.' }
    ],
    openPositions: 'Offres d\'emploi actuelles',
    applyNow: 'Postulez maintenant',
    noPositions: 'Nous n\'avons pas de recrutement en cours actuellement, mais nous sommes toujours ravis de rencontrer des talents. Écrivez-nous !',
    offers: [
      { title: 'Agent de fret international', location: 'Varsovie / Hybride', type: 'Temps plein' },
      { title: 'Développeur Fullstack (Next.js)', location: 'Télétravail', type: 'B2B / CDI' },
      { title: 'Key Account Manager B2B', location: 'Varsovie', type: 'Temps plein' }
    ]
  },
  legal: {
    terms: {
      title: 'Conditions générales de service',
      lastUpdated: 'Dernière mise à jour : 06 mai 2026',
      sections: [
        {
          title: 'Périmètre et nature du service',
          content:
            'PaletBroker est une plateforme numérique de devis et de gestion des commandes de transport de palettes. Le site met à disposition un calculateur de devis, une sélection d\'offres de transporteurs, un espace client et un panneau d\'administration. Le transport est assuré par des transporteurs partenaires ; PaletBroker est responsable du fonctionnement de la plateforme et de la gestion du processus de commande.',
        },
        {
          title: 'Compte utilisateur et accès',
          content:
            'L\'inscription requiert au minimum une adresse e-mail et un mot de passe. L\'utilisateur est responsable de la confidentialité de ses identifiants de connexion. Le système peut temporairement bloquer l\'accès après une série de tentatives infructueuses. Les rôles d\'accès (ex. : client, administrateur) déterminent l\'étendue des fonctionnalités visibles.',
        },
        {
          title: 'Devis et limites automatiques',
          content:
            'Le devis automatique concerne les envois dans les limites techniques du formulaire : longueur jusqu\'à 300 cm, largeur jusqu\'à 300 cm, hauteur jusqu\'à 250 cm et poids jusqu\'à 1 500 kg. Pour les paramètres dépassant ces limites ou les envois non standard, le système redirige vers un traitement manuel.',
        },
        {
          title: 'Passation de commande',
          content:
            'La commande est passée après sélection de l\'offre, saisie des coordonnées de l\'expéditeur et du destinataire, et accès au paiement. La fourniture de données d\'adresse et de contact exactes est obligatoire. Des données erronées peuvent entraîner des retards, la nécessité d\'une correction ou des frais supplémentaires de la part de l\'opérateur logistique.',
        },
        {
          title: 'Paiements et documents comptables',
          content:
            'Le paiement en ligne est traité par Stripe (incluant les méthodes disponibles lors du paiement, par exemple carte bancaire, BLIK, Przelewy24 — selon la configuration et la disponibilité). Une fois le paiement comptabilisé, le statut de la commande est mis à jour et les documents comptables sont mis à disposition via les fonctionnalités du système.',
        },
        {
          title: 'Obligations de l\'expéditeur concernant la préparation du chargement',
          content:
            'L\'expéditeur est responsable de la préparation correcte de la palette : disposition stable de la marchandise, sécurisation du chargement et conformité des paramètres avec la déclaration. Pour les marchandises nécessitant des conditions de transport particulières (ex. : fragiles ou ADR), celles-ci doivent être signalées dans le formulaire.',
        },
        {
          title: 'Suivi et communication des statuts',
          content:
            'La plateforme permet de consulter le statut de l\'envoi à l\'aide du numéro de commande et des données opérationnelles enregistrées dans le système. La disponibilité et le niveau de détail des informations dépendent des statuts renvoyés par le processus logistique et des intégrations des transporteurs.',
        },
        {
          title: 'Réclamations et signalements',
          content:
            'Les signalements concernant l\'exécution du service, les incohérences de données ou les problèmes opérationnels doivent être adressés via les canaux de contact indiqués sur le site (rubrique Contact/Aide). Le signalement doit inclure le numéro de commande et la description de l\'incident, ce qui accélère la vérification.',
        },
        {
          title: 'Dispositions finales',
          content:
            'Les présentes conditions générales entrent en vigueur dès leur publication et peuvent être mises à jour en cas de modifications fonctionnelles, juridiques ou de sécurité. La version en vigueur est publiée sur cette page avec la date de la dernière mise à jour.',
        },
      ]
    },
    privacy: {
      title: 'Politique de confidentialité',
      lastUpdated: 'Dernière mise à jour : 06 mai 2026',
      sections: [
        {
          title: 'Responsable du traitement et contact',
          content:
            'Le responsable du traitement des données est PaletBroker Sp. z o.o., ul. Logistyczna 12, 00-001 Varsovie, e-mail : kontakt@paletbroker.pl, tél. : +48 22 123 45 67. Les coordonnées sont également publiées dans la rubrique Contact et dans le pied de page du site.',
        },
        {
          title: 'Quelles données traitons-nous',
          content:
            'Nous traitons les données fournies dans les formulaires et l\'espace client, notamment : les données de compte (e-mail, mot de passe sous forme de hachage), les données de l\'entreprise et de facturation, les données de l\'expéditeur/du destinataire, les données d\'envoi (dimensions, poids, itinéraire), les données de prospects ainsi que les informations techniques liées à la sécurité et au fonctionnement du site.',
        },
        {
          title: 'Finalités et bases juridiques du traitement',
          content:
            'Nous traitons les données aux fins suivantes : exécution des mesures précontractuelles et du service (art. 6, par. 1, point b du RGPD), respect des obligations légales, y compris comptables et fiscales (art. 6, par. 1, point c du RGPD), et dans l\'intérêt légitime du responsable du traitement, par exemple pour la sécurité du système, la protection contre les abus et la défense des droits (art. 6, par. 1, point f du RGPD).',
        },
        {
          title: 'Destinataires des données',
          content:
            'Les données peuvent être transmises aux entités participant à l\'exécution du service : transporteurs, opérateur de paiement Stripe, prestataires d\'infrastructure et techniques (hébergement, messagerie, surveillance des erreurs) ainsi qu\'aux autorités publiques compétentes — uniquement dans la mesure prévue par la loi.',
        },
        {
          title: 'Cookies et données techniques',
          content:
            'Le site utilise des cookies et des technologies similaires notamment pour maintenir la session de connexion (ex. : jetons de session), mémoriser les paramètres (ex. : langue, thème) et protéger la sécurité des requêtes. Le bandeau cookies sert à gérer le consentement/l\'interaction de l\'utilisateur au niveau de l\'interface.',
        },
        {
          title: 'Durée de conservation',
          content:
            'Nous conservons les données pendant la durée nécessaire à la réalisation de la finalité du traitement et, dans le cas des documents comptables, pendant la durée requise par la loi. Les données techniques de sécurité (ex. : informations sur les tentatives de connexion ou les jetons de réinitialisation) sont conservées à court terme conformément à la configuration du système.',
        },
        {
          title: 'Vos droits',
          content:
            'Vous disposez d\'un droit d\'accès à vos données, de rectification, d\'effacement, de limitation du traitement, de portabilité des données et d\'opposition — dans les limites prévues par le RGPD. Vous pouvez également introduire une réclamation auprès du Président de l\'Office de protection des données personnelles.',
        },
        {
          title: 'Sécurité',
          content:
            'Nous mettons en œuvre des mesures techniques et organisationnelles adaptées au risque, notamment la validation des données d\'entrée, le contrôle d\'accès basé sur les rôles, la limitation du nombre de requêtes et les mécanismes de protection des sessions. Les mots de passe des utilisateurs sont stockés exclusivement sous forme de hachages cryptographiques.',
        },
        {
          title: 'Modifications de la politique',
          content:
            'La politique de confidentialité peut être mise à jour en cas de changements fonctionnels, technologiques ou juridiques. La version en vigueur est publiée sur cette page avec la date de la dernière mise à jour.',
        },
      ]
    },
    questions: 'Des questions ?',
    questionsDesc: 'Notre équipe juridique et opérationnelle se tient à votre disposition pour clarifier tout point concernant les conditions générales.',
    contactCta: 'Contactez-nous',
  },
  quote: {
    selector: {
      label: 'Choisissez le type de palette',
      euro: 'Euro',
      semi_euro: 'Demi-palette',
      industrial: 'Industr.',
      semi_industrial: 'Demi-ind.',
      custom: 'Autre',
      customDesc: 'Non std.',
    },
    sender: {
      title: 'Lieu d\'expédition',
      postalCode: 'Code postal',
      country: 'Pays',
    },
    recipient: {
      title: 'Lieu de livraison',
      postalCode: 'Code postal',
      country: 'Pays',
    },
    palletCount: 'Nombre de palettes',
    weight: 'Poids (kg)',
    height: 'Hauteur (cm)',
    length: 'Longueur (cm)',
    width: 'Largeur (cm)',
    conditions: {
      title: 'Conditions supplémentaires',
      stackable: 'Gerbage possible',
      fragile: 'Marchandise fragile',
      adr: 'Matière ADR',
      privateSender: 'Expéditeur particulier',
      privateRecipient: 'Destinataire particulier',
    },
    estimatedCost: 'Coût estimé',
    estimatedCostNote: 'Le prix final dépend du transporteur choisi et des surcharges carburant en vigueur.',
    submit: 'Comparer les offres des transporteurs',
    submitting: 'Calcul des offres en cours...',
    currency: 'PLN HT',
    preview: {
      title: 'Aperçu du chargement',
      euro: 'Euro 120×80',
      semi_euro: 'Demi-palette 80×60',
      industrial: 'Industrielle 120×100',
      semi_industrial: 'Demi-industrielle 120×100',
      custom: 'Non standard',
    },
    results: {
      title: 'Résultats du devis',
      subtitle: 'Nous avons trouvé les meilleures offres pour votre envoi de',
      to: 'à',
      loading: 'Analyse des offres...',
      loadingOffers: 'Chargement des offres...',
      config: 'Votre configuration',
      edit: 'Modifier',
      palletType: 'Type de palette',
      palletCount: 'Nombre de palettes',
      weightDims: 'Poids et dimensions',
      chargeableWeight: 'Poids taxable',
      route: 'Itinéraire',
      conditions: 'Conditions',
      found: 'Trouvé(e)s',
      offers: 'offres',
      nonStandard: 'Devis non standard',
      contactManual: 'Contactez-nous pour un devis manuel',
      noOffers: 'Aucune offre trouvée pour les paramètres indiqués. Essayez de modifier les dimensions ou le poids.',
      stackableYes: 'Gerbage : OUI',
      stackableNo: 'Gerbage : NON',
      fragileYes: 'Fragile : OUI',
      fragileNo: 'Fragile : NON',
      adrYes: 'ADR : OUI',
      adrNo: 'ADR : NON',
      privateAddressYes: 'Adresse privée : OUI',
      privateAddressNo: 'Adresse privée : NON',
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
    label: 'Suivi',
    title: 'Où est mon envoi ?',
    subtitle: 'Saisissez le numéro de commande (ex. : OR-...) et consultez le statut de votre envoi de palette en temps réel.',
    placeholder: 'Saisissez le numéro de commande, ex. : OR-12345',
    search: 'Rechercher',
    searching: 'Recherche en cours...',
    notFound: 'Aucun envoi trouvé avec ce numéro.',
    searchError: 'Une erreur est survenue lors de la recherche.',
    noEvents: 'Aucun événement trouvé pour cet envoi',
    checkNumber: 'Vérifiez l\'exactitude du numéro de commande et réessayez.',
    status: {
      created: 'Créé',
      paid: 'Payé',
      confirmed: 'Confirmé',
      pickup: 'Enlèvement',
      in_transit: 'En transit',
      delivered: 'Livré',
      cancelled: 'Annulé',
    },
  },
  banner: {
    maintenance: 'Maintenance en cours. La passation de nouvelles commandes est temporairement suspendue.',
  },
  business: {
    lead: {
      name: 'Nom et prénom',
      namePlaceholder: 'Jean Dupont',
      email: 'E-mail professionnel',
      emailPlaceholder: 'contact@votreentreprise.fr',
      company: 'Entreprise',
      companyPlaceholder: 'Nom de votre entreprise',
      volume: 'Volume (par mois)',
      phone: 'Téléphone de contact',
      phonePlaceholder: '+33 0 00 00 00 00',
      submit: 'Demander un devis B2B gratuit',
      submitting: 'Envoi en cours...',
      success: 'Demande envoyée',
      successDesc: 'Merci. Un conseiller B2B vous contactera dans les 2 heures.',
      error: 'Erreur d\'envoi',
      errorDesc: 'Échec de l\'enregistrement de la demande.',
    },
  },
  errors: {
    formFailed: 'Échec de l\'envoi du formulaire.',
  },
};
