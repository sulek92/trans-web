import { TranslationType } from './pl';

export const es: TranslationType = {
  common: {
    login: 'Iniciar sesión',
    register: 'Registrarse',
    logout: 'Cerrar sesión',
    dashboard: 'Panel',
    orders: 'Pedidos',
    settings: 'Configuración',
    to: 'a',
  },
  nav: {
    pricing: 'Tarifas',
    tracking: 'Seguimiento',
    contact: 'Contacto',
    about: 'Quiénes somos',
  },
  home: {
    hero: {
      badge: 'Logística B2B para profesionales',
      visualCaption: 'Operaciones de pallets 24/7',
    },
    calculator: {
      title: 'Calculadora de Cotización',
      subtitle: 'Introduzca los parámetros básicos de su envío. Nuestro algoritmo selecciona al mejor transportista según sus necesidades y ubicación.',
      badge: 'GARANTÍA DE PRECIO',
      loading: 'Cargando calculadora...',
    },
    tracking: {
      title: 'Seguimiento de Envíos',
      placeholder: 'Introduzca el número de pedido (ej. OR-1234)',
      button: 'Consultar estado',
      searching: 'Buscando...',
      error: 'Introduzca el número de pedido',
    },
    partners: {
      title: 'Socios Logísticos de Confianza',
    },
    howItWorks: {
      step1: { title: 'Cotice en línea', desc: 'Introduzca los códigos postales y las dimensiones del pallet en nuestra calculadora.' },
      step2: { title: 'Elija transportista', desc: 'Compare precios y tiempos de entrega de los principales operadores B2B.' },
      step3: { title: 'Solicite la recogida', desc: 'Pague el pedido y espere al transportista. Recibirá la etiqueta por correo electrónico.' },
    },
    stats: {
      pallets: 'Pallets gestionados',
      clients: 'Clientes activos',
      countries: 'Países en la red',
      savings: 'Ahorro medio',
    },
    ticker: {
      received: 'Recogido',
      inTransit: 'En tránsito',
      delivered: 'Entregado',
      ago: 'min atrás',
    },
    testimonials: {
      title: 'Qué dicen nuestros clientes',
      subtitle: 'La confianza se construye con puntualidad y transparencia. Conozca las opiniones de las empresas que han optimizado su logística con nosotros.',
      items: [
        {
          name: 'Marek Jankowski',
          role: 'CEO, E-com Group',
          text: 'Migrar a PaletBroker redujo a la mitad el tiempo de preparación de envíos. El sistema de cotización no tiene competencia en el mercado polaco.',
        },
        {
          name: 'Anna Nowak',
          role: 'Directora de Logística, TechFood',
          text: 'Lo que más valoramos es contar con un gestor dedicado y la automatización documental. Todo en un solo lugar.',
        },
        {
          name: 'Robert Wilk',
          role: 'Propietario, Wilk Meble',
          text: 'Los precios son imbatibles y la gestión de importaciones desde Alemania funciona de manera ejemplar. Se lo recomiendo a cualquier empresario.',
        },
      ]
    },
    support: {
      title: 'Siempre a su disposición',
      subtitle: 'La logística es un sector donde el tiempo y la precisión son clave. Nuestro equipo de soporte supervisa sus envíos y responde a cualquier consulta en menos de 15 minutos.',
      badge: 'Soporte Técnico',
      responseTime: 'Tiempo de respuesta',
      monitoring: 'Monitorización de envíos',
      form: {
        title: 'Escriba a nuestro experto',
        name: 'Nombre y apellidos',
        email: 'Correo electrónico corporativo',
        message: '¿En qué podemos ayudarle? (Ej. consulta sobre integración API, condiciones de colaboración permanente)',
        button: 'Enviar consulta',
        sending: 'Enviando...',
        success: {
          title: 'Mensaje enviado',
          description: 'Gracias. Le responderemos en menos de 15 minutos.',
        },
        error: {
          title: 'Error de envío',
          description: 'No se ha podido enviar el formulario.',
        }
      }
    },
    cta: {
      title: 'Empiece a enviar más barato hoy mismo',
      subtitle: 'Únase a las más de 1200 empresas que ya confían en la tecnología de PaletBroker. Su primer envío puede llegar a destino mañana mismo.',
      buttonRegister: 'Crear cuenta empresarial',
      buttonQuote: 'Consultar tarifas',
      imageAlt: 'Almacén y transporte de pallets',
    },
    testimonialsLabel: 'La voz de nuestros clientes',
    testimonialsTitle: 'Líderes del sector confían en nosotros',
    testimonialsDesc: 'Descubra cómo la tecnología de PaletBroker optimiza las cadenas de suministro de las mayores empresas de la región.',
    quickQuoteLabel: 'Cotice su envío',
    quickQuoteButton: 'Cotización Rápida',
    b2bOffer: 'Oferta B2B',
    partnerComparison: 'Comparamos ofertas de',
    carriers: 'transportistas',
    carriersSuffix: '+',
    realtimeComparison: 'en tiempo real.',
  },
  hero: {
    title: 'El transporte de pallets más económico de Polonia y Europa',
    subtitle: 'Compare precios de los principales transportistas y contrate el envío en 2 minutos. Ahorre hasta un 40 % en cada envío.',
    cta: 'Cotice su envío',
  },
  pricing: {
    title: 'Tarifas diseñadas para empresas',
    subtitle: 'Las tarifas indicadas son precios base netos. Gracias a nuestros acuerdos con los principales transportistas, ofrecemos precios un 40 % más bajos que las tarifas minoristas.',
    tabs: {
      domestic: 'Transporte Nacional',
      international: 'Importación / Exportación UE',
    },
    labels: {
      standardRates: 'Tarifas Estándar',
      bestOffer: 'Mejor oferta',
      europeanRoutes: 'Rutas Europeas',
      guaranteedEta: 'ETA Garantizado',
      from: 'desde',
      customRoute: 'Cotice una ruta específica',
      askOther: 'Consultar otro destino',
      billingQuestions: 'Consultas de facturación',
      helpAndSupport: 'Ayuda y Soporte',
      service247: 'Servicio 24/7',
    },
    guarantee: {
      title: 'Garantía del mejor precio',
      desc: 'Si encuentra una oferta más económica para un transporte de pallets con los mismos parámetros, le devolvemos la diferencia y le damos un 5 % de descuento adicional en su próximo pedido.',
      insurance: 'Seguro',
      fuelSurcharge: 'Recargo por combustible',
      included: 'Incluido',
      alwaysIncluded: 'Siempre incluido',
      carrierOcp: 'OCP del Transportista',
    },
    faq: {
      q1: '¿Los precios indicados incluyen IVA?',
      a1: 'No, todos los precios de la tabla de tarifas y la calculadora son precios netos. Debe añadirse el 23 % de IVA para servicios nacionales.',
      q2: '¿Cuándo recibiré la factura?',
      a2: 'La factura con IVA se genera automáticamente tras el pago del pedido y se envía a su dirección de correo electrónico.',
      q3: '¿Qué métodos de pago aceptan?',
      a3: 'Aceptamos transferencias rápidas (PayU), BLIK, tarjetas de crédito/débito y transferencias tradicionales (para clientes habituales).',
      q4: '¿Pueden cambiar los precios?',
      a4: 'Las tarifas pueden variar en función de la estacionalidad y el precio del combustible, pero una vez pagado el pedido, el precio queda garantizado.',
    },
    countries: {
      germany: 'Alemania',
      czechia: 'Chequia',
      france: 'Francia',
      italy: 'Italia',
      benelux: 'Benelux',
    },
    pallets: {
      semi_euro: 'Media paleta',
      euro: 'Paleta Euro',
      industrial: 'Paleta Industrial',
      semi_industrial: 'Semiindustrial',
    },
    result: {
      availableOffers: 'Ofertas disponibles',
      delivery: 'Entrega:',
      netto: 'neto',
      brutto: 'PLN bruto',
      order: 'Contratar',
      details: 'Detalles de la cotización',
      basePrice: 'Precio base:',
      surcharges: 'Recargos (zona, servicios):',
      total: 'Total neto:',
      orderNow: 'Contratar ahora',
    },
  },
  footer: {
    desc: 'Plataforma logística profesional B2B. Nos dedicamos a ofrecer servicios de transporte de pallets de la más alta calidad en Europa.',
    newsletterTitle: 'Newsletter logístico',
    newsletterPlaceholder: 'Su correo electrónico',
    sections: {
      company: 'Empresa',
      tools: 'Herramientas',
      support: 'Soporte',
    },
    links: {
      about: 'Quiénes somos',
      career: 'Carrera profesional',
      contact: 'Contacto',
      blog: 'Blog logístico',
      calculator: 'Calculadora de pallets',
      tracking: 'Seguimiento de envíos',
      api: 'API e Integraciones',
      guide: 'Guía de pallets',
      help: 'Centro de ayuda',
      terms: 'Términos del servicio',
      privacy: 'Política de privacidad',
      admin: 'Panel de Administración',
    },
    allRightsReserved: 'Todos los derechos reservados.',
    tagline: 'Logística impulsada por tecnología.',
  },
  cookies: {
    text: 'Utilizamos cookies necesarias para el correcto funcionamiento del sitio web y, con su consentimiento, cookies analíticas y de marketing. Puede aceptar todas, rechazar las opcionales o personalizar la configuración.',
    privacyPolicy: 'Política de Privacidad',
    settings: 'Configuración',
    acceptAll: 'Aceptar todas',
    rejectAll: 'Rechazar todas',
    alwaysActive: 'Siempre activo',
    title: 'Respetamos su privacidad',
    settingsTitle: 'Configuración de cookies',
    settingsSubtitle: 'Puede decidir a qué categorías de cookies da su consentimiento. Las cookies necesarias son requeridas para el funcionamiento del sitio y no se pueden desactivar en este panel.',
    essential: 'Esenciales',
    essentialDesc: 'Estos archivos son necesarios para el funcionamiento del sitio, por ejemplo, para guardar la configuración de privacidad, seguridad, sesiones o formularios.',
    analytics: 'Analíticas',
    analyticsDesc: 'Nos ayudan a analizar el uso del sitio, como el número de visitas, la popularidad de las páginas y las fuentes de tráfico.',
    marketing: 'Marketing',
    marketingDesc: 'Nos permiten medir la eficacia publicitaria y realizar campañas de remarketing.',
    cancel: 'Cancelar',
    save: 'Guardar mis elecciones',
  },
  faq: {
    title: 'Preguntas frecuentes',
    subtitle: 'Todo lo que necesita saber sobre el envío de pallets con PaletBroker.',
    searchPlaceholder: 'Buscar pregunta...',
    contactTitle: '¿No ha encontrado respuesta?',
    contactDesc: 'Nuestro equipo de expertos en logística está listo para ayudarle.',
    contactCta: 'Contáctenos',
    items: [
      { q: '¿Cómo debo embalar el pallet?', a: 'El pallet debe ir envuelto con film estirable. La mercancía no puede sobresalir del contorno del pallet (80x120 cm para Euro). Todos los elementos deben estar firmemente fijados a la base.' },
      { q: '¿Cuánto cuesta enviar un pallet?', a: 'El precio depende de las dimensiones, el peso y el código postal. Gracias a nuestros acuerdos con transportistas, ofrecemos tarifas hasta un 40 % más bajas que las del mercado.' },
      { q: '¿Puedo asegurar el envío?', a: 'Sí, el seguro OCP estándar del transportista va incluido. Puede contratar un seguro de carga adicional para mercancías de alto valor.' },
      { q: '¿Cuándo recogerá el transportista el pallet?', a: 'Normalmente, la recogida se realiza el siguiente día hábil tras el pago del pedido, si este se ha realizado antes de las 12:00.' }
    ]
  },
  careers: {
    title: 'Construya con nosotros el futuro de la logística',
    subtitle: 'Buscamos apasionados de la tecnología y el transporte que quieran transformar de verdad el sector TSL.',
    whyJoin: '¿Por qué PaletBroker?',
    values: [
      { title: 'Stack Moderno', icon: 'code', desc: 'Trabajamos con las últimas tecnologías, eliminando la deuda técnica.' },
      { title: 'Impacto real', icon: 'trending_up', desc: 'Sus ideas se llevan a la práctica. Valoramos la iniciativa.' },
      { title: 'Flexibilidad', icon: 'calendar_month', desc: 'Ofrecemos trabajo remoto y horarios flexibles.' }
    ],
    openPositions: 'Ofertas de empleo actuales',
    applyNow: 'Postúlese ahora',
    noPositions: 'Actualmente no tenemos procesos de selección abiertos, pero siempre nos interesa conocer a personas con talento. ¡Escríbanos!',
    offers: [
      { title: 'Agente de Carga Internacional', location: 'Varsovia / Híbrido', type: 'Jornada completa' },
      { title: 'Desarrollador Fullstack (Next.js)', location: 'Remoto', type: 'B2B / Contrato laboral' },
      { title: 'Key Account Manager B2B', location: 'Varsovia', type: 'Jornada completa' }
    ]
  },
  legal: {
    terms: {
      title: 'Términos y Condiciones del Servicio',
      lastUpdated: 'Última actualización: 06 de mayo de 2026',
      sections: [
        {
          title: 'Alcance y naturaleza del servicio',
          content:
            'PaletBroker es una plataforma digital para la cotización y gestión de pedidos de transporte de pallets. El sitio web ofrece una calculadora de cotización, selección de ofertas de transportistas, panel de cliente y panel de administración. El transporte es realizado por transportistas asociados; PaletBroker es responsable del funcionamiento de la plataforma y de la gestión del proceso de pedido.',
        },
        {
          title: 'Cuenta de usuario y acceso',
          content:
            'El registro requiere como mínimo una dirección de correo electrónico y una contraseña. El usuario es responsable de la confidencialidad de sus datos de acceso. El sistema puede bloquear temporalmente el inicio de sesión tras varios intentos fallidos. Los roles de acceso (p. ej., cliente, administrador) determinan el alcance de las funciones visibles.',
        },
        {
          title: 'Cotización y límites automáticos',
          content:
            'La cotización automática se aplica a envíos dentro de los límites técnicos del formulario: longitud hasta 300 cm, anchura hasta 300 cm, altura hasta 250 cm y peso hasta 1500 kg. Para parámetros que superen estos límites o envíos no estándar, el sistema redirige al modo de gestión manual.',
        },
        {
          title: 'Realización del pedido',
          content:
            'El pedido se realiza tras seleccionar una oferta, completar los datos del remitente y del destinatario, y proceder al pago. Es obligatorio proporcionar datos de dirección y contacto correctos. Los datos incorrectos pueden causar retrasos, necesidad de corrección o costes adicionales por parte del operador logístico.',
        },
        {
          title: 'Pagos y documentos de venta',
          content:
            'El pago en línea es gestionado por Stripe (incluyendo los métodos disponibles en el checkout, p. ej., tarjeta, BLIK, Przelewy24 — según configuración y disponibilidad). Una vez registrado el pago, el estado del pedido se actualiza y los documentos contables se ponen a disposición a través de las funciones del sistema.',
        },
        {
          title: 'Obligaciones del remitente en la preparación de la carga',
          content:
            'El remitente es responsable de la correcta preparación del pallet: colocación estable de la mercancía, aseguramiento de la carga y conformidad de los parámetros con lo declarado. En el caso de mercancías que requieran condiciones especiales de transporte (p. ej., frágiles o ADR), deberán indicarse en el formulario.',
        },
        {
          title: 'Seguimiento y comunicación de estados',
          content:
            'La plataforma permite consultar el estado del envío mediante el número de pedido y los datos operativos registrados en el sistema. La disponibilidad y el nivel de detalle de la información dependen de los estados devueltos por el proceso logístico y las integraciones con los transportistas.',
        },
        {
          title: 'Reclamaciones e incidencias',
          content:
            'Las incidencias relacionadas con la prestación del servicio, discrepancias de datos o problemas operativos deben comunicarse a través de los canales de contacto indicados en el sitio web (sección Contacto/Ayuda). La comunicación debe incluir el número de pedido y la descripción del incidente, lo que agiliza la verificación.',
        },
        {
          title: 'Disposiciones finales',
          content:
            'Los presentes términos entran en vigor desde el momento de su publicación y pueden actualizarse en caso de cambios funcionales, legales o de seguridad. La versión vigente se publica en esta página junto con la fecha de la última actualización.',
        },
      ]
    },
    privacy: {
      title: 'Política de Privacidad',
      lastUpdated: 'Última actualización: 06 de mayo de 2026',
      sections: [
        {
          title: 'Responsable del tratamiento y contacto',
          content:
            'El responsable del tratamiento es PaletBroker Sp. z o.o., ul. Logistyczna 12, 00-001 Warszawa, correo electrónico: kontakt@paletbroker.pl, tel.: +48 22 123 45 67. Los datos de contacto también se publican en la sección de Contacto y en el pie de página del sitio web.',
        },
        {
          title: 'Qué datos tratamos',
          content:
            'Tratamos los datos proporcionados en los formularios y en el panel, en particular: datos de cuenta (correo electrónico, contraseña en forma de hash), datos de empresa y facturación, datos del remitente/destinatario, datos del envío (dimensiones, peso, ruta), datos de contactos comerciales e información técnica relacionada con la seguridad y el funcionamiento del sitio web.',
        },
        {
          title: 'Fines y bases legales del tratamiento',
          content:
            'Tratamos los datos con los siguientes fines: ejecución de medidas precontractuales y prestación del servicio (art. 6, apdo. 1, letra b del RGPD), cumplimiento de obligaciones legales, incluidas las contables y fiscales (art. 6, apdo. 1, letra c del RGPD), y en interés legítimo del responsable, p. ej., seguridad del sistema, protección contra usos abusivos y reclamaciones (art. 6, apdo. 1, letra f del RGPD).',
        },
        {
          title: 'Destinatarios de los datos',
          content:
            'Los datos pueden ser comunicados a entidades que apoyan la prestación del servicio: transportistas, el operador de pagos Stripe, proveedores de infraestructura y servicios técnicos (alojamiento, correo, monitorización de errores) y autoridades públicas competentes — exclusivamente en la medida prevista por la ley.',
        },
        {
          title: 'Cookies y datos técnicos',
          content:
            'El sitio web utiliza cookies y tecnologías similares, entre otros fines, para mantener la sesión de inicio de sesión (p. ej., tokens de sesión), recordar preferencias (p. ej., idioma, tema) y proteger la seguridad de las solicitudes. El banner de cookies sirve para gestionar el consentimiento y la interacción del usuario a nivel de interfaz.',
        },
        {
          title: 'Período de conservación',
          content:
            'Conservamos los datos durante el tiempo necesario para la finalidad del tratamiento y, en el caso de documentos contables, durante el período exigido por la ley. Los datos técnicos de seguridad (p. ej., información sobre intentos de inicio de sesión o tokens de restablecimiento) se conservan a corto plazo de acuerdo con la configuración del sistema.',
        },
        {
          title: 'Sus derechos',
          content:
            'Usted tiene derecho a acceder a sus datos, rectificarlos, suprimirlos, limitar su tratamiento, a la portabilidad de los datos y a oponerse — en el marco previsto por el RGPD. También puede presentar una reclamación ante la autoridad de protección de datos competente.',
        },
        {
          title: 'Seguridad',
          content:
            'Aplicamos medidas técnicas y organizativas adecuadas al riesgo, incluyendo la validación de datos de entrada, el control de acceso basado en roles, la limitación del número de solicitudes y mecanismos de protección de sesiones. Las contraseñas de los usuarios se almacenan exclusivamente en forma de hashes criptográficos.',
        },
        {
          title: 'Modificaciones de la política',
          content:
            'La política de privacidad puede actualizarse en caso de cambios funcionales, tecnológicos o legales. La versión vigente se publica en esta página junto con la fecha de la última actualización.',
        },
      ]
    },
    questions: '¿Tiene preguntas?',
    questionsDesc: 'Nuestro equipo jurídico y operativo estará encantado de aclarar cualquier duda sobre los términos y condiciones.',
    contactCta: 'Contáctenos',
  },
  quote: {
    selector: {
      label: 'Seleccione el tipo de pallet',
      euro: 'Euro',
      semi_euro: 'Media paleta',
      industrial: 'Industrial',
      semi_industrial: 'Semiind.',
      custom: 'Otro',
      customDesc: 'No estándar',
    },
    sender: {
      title: 'Lugar de Recogida',
      postalCode: 'Código postal',
      country: 'País',
    },
    recipient: {
      title: 'Lugar de Entrega',
      postalCode: 'Código postal',
      country: 'País',
    },
    palletCount: 'Número de pallets',
    weight: 'Peso (kg)',
    height: 'Altura (cm)',
    length: 'Longitud (cm)',
    width: 'Anchura (cm)',
    conditions: {
      title: 'Condiciones Adicionales',
      stackable: 'Apilable posible',
      fragile: 'Mercancía frágil',
      adr: 'Material ADR',
      privateSender: 'Remitente particular',
      privateRecipient: 'Destinatario particular',
    },
    estimatedCost: 'Coste Estimado',
    estimatedCostNote: 'El precio final depende del transportista seleccionado y de los recargos por combustible vigentes.',
    submit: 'Comparar Ofertas de Transportistas',
    submitting: 'Calculando ofertas...',
    currency: 'PLN neto',
    preview: {
      title: 'Vista previa de la carga',
      euro: 'Euro 120x80',
      semi_euro: 'Media paleta 80x60',
      industrial: 'Industrial 120x100',
      semi_industrial: 'Semiindustrial 120x100',
      custom: 'No estándar',
    },
    results: {
      title: 'Resultados de la Cotización',
      subtitle: 'Hemos encontrado las mejores ofertas para su envío desde',
      to: 'a',
      loading: 'Analizando ofertas...',
      loadingOffers: 'Cargando ofertas...',
      config: 'Su configuración',
      edit: 'Editar',
      palletType: 'Tipo de pallet',
      palletCount: 'Número de pallets',
      weightDims: 'Peso y dimensiones',
      chargeableWeight: 'Peso tasable',
      route: 'Ruta',
      conditions: 'Condiciones',
      found: 'Encontradas',
      offers: 'ofertas',
      nonStandard: 'Cotización No Estándar',
      contactManual: 'Contáctenos para una cotización manual',
      noOffers: 'No hemos encontrado ofertas para los parámetros indicados. Intente modificar las dimensiones o el peso.',
      stackableYes: 'Apilable: SÍ',
      stackableNo: 'Apilable: NO',
      fragileYes: 'Frágil: SÍ',
      fragileNo: 'Frágil: NO',
      adrYes: 'ADR: SÍ',
      adrNo: 'ADR: NO',
      privateAddressYes: 'Dirección particular: SÍ',
      privateAddressNo: 'Dirección particular: NO',
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
    label: 'Seguimiento',
    title: '¿Dónde está mi envío?',
    subtitle: 'Introduzca el número de pedido (ej. OR-...) y consulte el estado de su envío de pallets en tiempo real.',
    placeholder: 'Introduzca el número de pedido, ej. OR-12345',
    search: 'Buscar',
    searching: 'Buscando...',
    notFound: 'No se ha encontrado ningún envío con el número indicado.',
    searchError: 'Se ha producido un error durante la búsqueda.',
    noEvents: 'No se han encontrado eventos para este envío',
    checkNumber: 'Verifique que el número de pedido sea correcto e inténtelo de nuevo.',
    status: {
      created: 'Creado',
      paid: 'Pagado',
      confirmed: 'Confirmado',
      pickup: 'Recogida',
      in_transit: 'En tránsito',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    },
  },
  banner: {
    maintenance: 'Estamos realizando tareas de mantenimiento. La creación de nuevos pedidos está temporalmente suspendida.',
  },
  business: {
    lead: {
      name: 'Nombre y apellidos',
      namePlaceholder: 'Jan Kowalski',
      email: 'Correo electrónico corporativo',
      emailPlaceholder: 'contacto@suempresa.es',
      company: 'Empresa',
      companyPlaceholder: 'Nombre de su empresa',
      volume: 'Volumen (mensual)',
      phone: 'Teléfono de contacto',
      phonePlaceholder: '+48 000 000 000',
      submit: 'Solicitar cotización B2B gratuita',
      submitting: 'Enviando...',
      success: 'Consulta enviada',
      successDesc: 'Gracias. Un asesor B2B se pondrá en contacto con usted en menos de 2 horas.',
      error: 'Error de envío',
      errorDesc: 'No se ha podido registrar la consulta.',
    },
  },
  errors: {
    formFailed: 'No se ha podido enviar el formulario.',
  },
};
