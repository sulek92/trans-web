import { TranslationType } from './pl';

export const en: TranslationType = {
  common: {
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    dashboard: 'Dashboard',
    orders: 'Orders',
    settings: 'Settings',
    to: 'up to',
  },
  nav: {
    pricing: 'Pricing',
    tracking: 'Tracking',
    contact: 'Contact',
    about: 'About',
  },
  home: {
    hero: {
      badge: 'B2B Logistics for Professionals',
      visualCaption: '24/7 Pallet Operations',
    },
    calculator: {
      title: 'Quote Calculator',
      subtitle: 'Provide the basic parameters of your shipment. Our algorithm will match the best carrier to your needs and location.',
      badge: 'PRICE GUARANTEE',
      loading: 'Loading calculator...',
    },
    tracking: {
      title: 'Shipment Tracking',
      placeholder: 'Enter order number (e.g., OR-1234)',
      button: 'Check status',
      searching: 'Searching...',
      error: 'Enter order number',
    },
    partners: {
      title: 'Trusted Logistics Partners',
    },
    howItWorks: {
      step1: { title: 'Quote online', desc: 'Enter postal codes and pallet dimensions in our calculator.' },
      step2: { title: 'Choose carrier', desc: 'Compare prices and delivery times of top B2B carriers.' },
      step3: { title: 'Book pickup', desc: 'Pay for the order and wait for the courier. You will receive the label via email.' },
    },
    stats: {
      pallets: 'Pallets handled',
      clients: 'Active clients',
      countries: 'Countries in network',
      savings: 'Average savings',
    },
    ticker: {
      received: 'Received',
      inTransit: 'In transit',
      delivered: 'Delivered',
      ago: 'min ago',
    },
    testimonials: {
      title: 'What our clients say',
      subtitle: 'Trust is built on punctuality and transparency. Discover the opinions of companies that have optimized their logistics with us.',
      items: [
        {
          name: 'Mark Jankowski',
          role: 'CEO, E-com Group',
          text: 'Switching to PaletBroker halved our shipping time. The quoting system is unrivaled on the market.',
        },
        {
          name: 'Ann Nowak',
          role: 'Logistics Manager, TechFood',
          text: 'We mostly value the dedicated account manager and document automation. Everything is in one place.',
        },
        {
          name: 'Robert Wolf',
          role: 'Owner, Wolf Furniture',
          text: 'The prices are unbeatable, and the import service from Germany is exemplary. I recommend it to every entrepreneur.',
        },
      ]
    },
    support: {
      title: 'Always at your service',
      subtitle: 'Logistics is an industry where time and precision matter. Our support team monitors your shipments and will answer any question in less than 15 minutes.',
      badge: 'Technical Support',
      responseTime: 'Response time',
      monitoring: 'Shipment monitoring',
      form: {
        title: 'Write to our expert',
        name: 'Full Name',
        email: 'Business Email',
        message: 'How can we help? (E.g. API integration inquiry, long-term cooperation terms)',
        button: 'Send Inquiry',
        sending: 'Sending...',
        success: {
          title: 'Message sent',
          description: 'Thank you. We will respond within 15 minutes.',
        },
        error: {
          title: 'Send error',
          description: 'Failed to send the form.',
        }
      }
    },
    cta: {
      title: 'Start shipping cheaper today',
      subtitle: 'Join 1200+ companies that have trusted PaletBroker technology. Your first shipment could be with the recipient tomorrow.',
      buttonRegister: 'Create business account',
      buttonQuote: 'Check pricing',
      imageAlt: 'Warehouse and pallet transport',
    }
  },
  hero: {
    title: 'Cheapest Pallet Transport in Poland and Europe',
    subtitle: 'Compare prices from major carriers and book transport in 2 minutes. Save up to 40% on every shipment.',
    cta: 'Get a Quote',
  },
  pricing: {
    title: 'Rates Tailored for Business',
    subtitle: 'Prices shown are base net rates. Thanks to agreements with major carriers, we offer prices 40% lower than retail price lists.',
    tabs: {
      domestic: 'Domestic Transport',
      international: 'EU Import / Export',
    },
    labels: {
      standardRates: 'Standard Rates',
      bestOffer: 'Best Offer',
      europeanRoutes: 'European Destinations',
      guaranteedEta: 'Guaranteed ETA',
      from: 'from',
      customRoute: 'Quote Specific Route',
      askOther: 'Ask About Other Direction',
      billingQuestions: 'Billing Questions',
      helpAndSupport: 'Help and Support',
    },
    guarantee: {
      title: 'Lowest Price Guarantee',
      desc: 'If you find a cheaper offer for pallet transport with the same parameters, we will refund the difference and give you an additional 5% discount on your next order.',
      insurance: 'Insurance',
      fuelSurcharge: 'Fuel Surcharge',
      included: 'Included',
      alwaysIncluded: 'Always Included',
      carrierOcp: 'Carrier OCP',
    },
    faq: {
      q1: 'Are these prices gross?',
      a1: 'No, all prices in the price list and calculator are net prices. 23% VAT should be added for domestic services.',
      q2: 'When will I receive the invoice?',
      a2: 'A VAT invoice is automatically generated after the order is paid and sent to your email address.',
      q3: 'What are the payment methods?',
      a3: 'We support fast transfers (PayU), BLIK, payment cards, and traditional transfers (for regular customers).',
      q4: 'Do prices change?',
      a4: 'Rates may change depending on seasonality and fuel prices, but the price is guaranteed once the order is paid.',
    },
    countries: {
      germany: 'Germany',
      czechia: 'Czech Republic',
      france: 'France',
      italy: 'Italy',
      benelux: 'Benelux',
    },
    pallets: {
      semi_euro: 'Half-pallet',
      euro: 'Euro Pallet',
      industrial: 'Industrial Pallet',
      semi_industrial: 'Semi-Industrial',
    },
  },
  footer: {
    desc: 'Professional B2B logistics platform. We focus on providing the highest quality pallet transport services in Europe.',
    newsletterTitle: 'Logistics Newsletter',
    newsletterPlaceholder: 'Your e-mail',
    sections: {
      company: 'Company',
      tools: 'Tools',
      support: 'Support',
    },
    links: {
      about: 'About Us',
      career: 'Careers',
      contact: 'Contact',
      blog: 'Logistics Blog',
      calculator: 'Pallet Calculator',
      tracking: 'Shipment Tracking',
      api: 'API & Integrations',
      guide: 'Pallet Guide',
      help: 'Help Center',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      admin: 'Admin Panel',
    },
    allRightsReserved: 'All rights reserved.',
    tagline: 'Logistics driven by technology.',
  },
  cookies: {
    text: 'We use cookies to ensure the proper functioning of the website and for analytical purposes. You can accept all or manage settings.',
    privacyPolicy: 'Privacy Policy',
    settings: 'Settings',
    acceptAll: 'Accept All',
  },
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about shipping pallets with PaletBroker.',
    searchPlaceholder: 'Search questions...',
    contactTitle: 'Didn\'t find an answer?',
    contactDesc: 'Our team of logistics experts is ready to help.',
    contactCta: 'Contact Us',
    items: [
      { q: 'How to pack a pallet?', a: 'The pallet must be wrapped in stretch film. The goods must not protrude beyond the outline of the pallet (80x120cm for Euro). All elements must be stably attached to the base.' },
      { q: 'How much does it cost to ship a pallet?', a: 'The price depends on the dimensions, weight, and zip code. Thanks to our agreements with carriers, we offer rates up to 40% lower than market rates.' },
      { q: 'Can I insure the shipment?', a: 'Yes, standard carrier OCP insurance is included. You can purchase additional Cargo insurance for high-value goods.' },
      { q: 'When will the courier pick up the pallet?', a: 'Usually, pickup occurs on the next business day after the order is paid, if it was placed before 12:00 PM.' }
    ]
  },
  careers: {
    title: 'Build the Future of Logistics with Us',
    subtitle: 'We are looking for technology and transport enthusiasts who want to realy change the TSL industry.',
    whyJoin: 'Why PaletBroker?',
    values: [
      { title: 'Modern Stack', icon: 'code', desc: 'We work on the latest technologies, eliminating technical debt.' },
      { title: 'Real Impact', icon: 'trending_up', desc: 'Your ideas are put into practice. We value initiative.' },
      { title: 'Flexibility', icon: 'calendar_month', desc: 'We offer remote work and flexible working hours.' }
    ],
    openPositions: 'Current Job Openings',
    applyNow: 'Apply Now',
    noPositions: 'We currently don\'t have any open recruitments, but we\'re always happy to meet talented people. Write to us!',
    offers: [
      { title: 'International Freight Forwarder', location: 'Warsaw / Hybrid', type: 'Full-time' },
      { title: 'Fullstack Developer (Next.js)', location: 'Remote', type: 'B2B / Employment Contract' },
      { title: 'Key Account Manager B2B', location: 'Warsaw', type: 'Full-time' }
    ]
  },
  legal: {
    terms: {
      title: 'Terms of Service',
      lastUpdated: 'Last updated: May 06, 2026',
      sections: [
        {
          title: 'Scope of the Service',
          content:
            'PaletBroker is a digital platform for pallet-shipping quotes and order handling. The service provides a quote calculator, carrier offer selection, a customer panel, and an admin panel. Transport is performed by cooperating carriers; PaletBroker provides the platform and process orchestration.',
        },
        {
          title: 'User Account and Access',
          content:
            'Account registration requires at least an email address and password. Users are responsible for protecting their credentials. The platform may temporarily block login after repeated failed attempts. Access roles (for example, customer or admin) define available features.',
        },
        {
          title: 'Quote and Automatic Limits',
          content:
            'Automatic quoting applies within technical limits: length up to 300 cm, width up to 300 cm, height up to 250 cm, and weight up to 1500 kg. Shipments outside these limits or custom cases are routed to manual handling.',
        },
        {
          title: 'Placing an Order',
          content:
            'An order is placed after selecting an offer, filling sender and recipient details, and completing payment. Providing correct address and contact data is mandatory. Incorrect data can cause delays, corrections, or additional operator fees.',
        },
        {
          title: 'Payments and Invoices',
          content:
            'Online payments are handled via Stripe (including methods available in checkout, such as cards, BLIK, and Przelewy24, subject to configuration and availability). After payment confirmation, the order status is updated and accounting documents are made available through platform features.',
        },
        {
          title: 'Shipment Preparation Obligations',
          content:
            'The sender is responsible for proper pallet preparation: stable loading, proper securing, and consistency with declared parameters. Goods requiring special conditions (for example fragile or ADR) must be marked in the form.',
        },
        {
          title: 'Tracking and Status Communication',
          content:
            'The platform provides shipment status tracking based on order number and operational data stored in the system. Availability and detail level depend on logistics status data and carrier integrations.',
        },
        {
          title: 'Complaints and Support Requests',
          content:
            'Issues related to service execution, data inconsistencies, or operations should be submitted through channels listed in Contact/Help pages. Please include the order number and a detailed description to speed up verification.',
        },
        {
          title: 'Final Provisions',
          content:
            'These terms apply from publication and may be updated due to functional, legal, or security changes. The latest version is always available on this page with its update date.',
        },
      ]
    },
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated: May 06, 2026',
      sections: [
        {
          title: 'Data Controller and Contact',
          content:
            'The data controller is PaletBroker Sp. z o.o., ul. Logistyczna 12, 00-001 Warszawa, Poland, email: kontakt@paletbroker.pl, phone: +48 22 123 45 67. Contact details are also published on the Contact page and in the website footer.',
        },
        {
          title: 'What Data We Process',
          content:
            'We process data provided in forms and panels, including: account data (email, password hash), company and billing data, sender/recipient data, shipment parameters (dimensions, weight, route), contact lead data, and technical data related to security and service operation.',
        },
        {
          title: 'Purposes and Legal Bases',
          content:
            'Data is processed for: pre-contract and contract performance (GDPR Art. 6(1)(b)), legal obligations including tax/accounting (Art. 6(1)(c)), and the controller’s legitimate interests such as platform security, abuse prevention, and claims handling (Art. 6(1)(f)).',
        },
        {
          title: 'Data Recipients',
          content:
            'Data may be shared with entities supporting service delivery: carriers, Stripe as the payment operator, infrastructure/technical providers (hosting, email, error monitoring), and authorized public authorities when required by law.',
        },
        {
          title: 'Cookies and Technical Data',
          content:
            'The service uses cookies and similar technologies, for example to maintain login sessions (session tokens), store preferences (language, theme), and support request security. The cookie banner is used to handle user-level consent interactions in the UI.',
        },
        {
          title: 'Retention Periods',
          content:
            'We retain data for as long as needed for processing purposes, and accounting documents for periods required by law. Security-related technical data (for example failed login metadata or password-reset tokens) is retained short-term according to system configuration.',
        },
        {
          title: 'Your Rights',
          content:
            'You have rights under GDPR, including access, rectification, erasure, restriction, portability, and objection (where applicable). You may also lodge a complaint with your competent supervisory authority.',
        },
        {
          title: 'Security',
          content:
            'We apply technical and organizational measures appropriate to risk, including input validation, role-based access control, request throttling, and session-protection mechanisms. User passwords are stored only as cryptographic hashes.',
        },
        {
          title: 'Policy Updates',
          content:
            'This policy may be updated due to functional, technological, or legal changes. The latest version is always published on this page together with the update date.',
        },
      ]
    }
  }
};
