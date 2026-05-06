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
      lastUpdated: 'Last updated: May 05, 2024',
      sections: [
        { title: 'General Provisions', content: 'These terms and conditions define the rules for using the PaletBroker platform and the rules for mediation in the provision of transport services.' },
        { title: 'Placing Orders', content: 'The user places an order by filling out the valuation form and paying for the order. The Broker forwards the order to the selected Carrier.' },
        { title: 'Packing and Preparation', content: 'The Ordering Party is obliged to properly prepare the shipment in accordance with the instructions available on the website.' },
        { title: 'Complaints', content: 'Complaints regarding damage to goods should be reported within 24 hours of delivery along with a damage report.' }
      ]
    },
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated: May 05, 2024',
      sections: [
        { title: 'Data Administrator', content: 'The administrator of your personal data is PaletBroker Sp. z o.o. based in Warsaw.' },
        { title: 'Purpose of Data Processing', content: 'Data is processed for the purpose of providing transport services, issuing invoices, and logistics communication.' },
        { title: 'Your Rights', content: 'In accordance with GDPR, you have the right to access your data, rectify it, and delete it.' },
        { title: 'Cookies', content: 'Our website uses cookies to ensure the proper functioning of the customer panel.' }
      ]
    }
  }
};
