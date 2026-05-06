import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  decimal,
  jsonb,
  timestamp,
  date,
  index,
} from 'drizzle-orm/pg-core';

export const companies = pgTable('companies', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  nip: varchar('nip', { length: 20 }),
  vatEu: varchar('vat_eu', { length: 30 }),
  addressLine: varchar('address_line', { length: 255 }),
  city: varchar('city', { length: 100 }),
  postalCode: varchar('postal_code', { length: 20 }),
  country: varchar('country', { length: 10 }).default('PL'),
  creditLimit: decimal('credit_limit', { precision: 10, scale: 2 }).default(
    '0',
  ),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    passwordHash: varchar('password_hash', { length: 255 }),
    role: varchar('role', { length: 50 }).default('customer').notNull(),
    isVerified: boolean('is_verified').default(false),
    authProvider: varchar('auth_provider', { length: 50 }).default('local'),
    externalId: varchar('external_id', { length: 255 }),
    companyId: uuid('company_id').references(() => companies.id),
    apiKey: varchar('api_key', { length: 255 }).unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      roleIdx: index('users_role_idx').on(table.role),
      apiKeyIdx: index('users_api_key_idx').on(table.apiKey),
    };
  },
);

export const addresses = pgTable(
  'addresses',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    label: varchar('label', { length: 100 }),
    name: varchar('name', { length: 255 }).notNull(),
    companyName: varchar('company_name', { length: 255 }),
    phone: varchar('phone', { length: 30 }),
    email: varchar('email', { length: 255 }),
    addressLine: varchar('address_line', { length: 255 }).notNull(),
    city: varchar('city', { length: 100 }).notNull(),
    postalCode: varchar('postal_code', { length: 20 }).notNull(),
    country: varchar('country', { length: 10 }).default('PL'),
    isDefaultSender: boolean('is_default_sender').default(false),
    isDefaultRecipient: boolean('is_default_recipient').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index('addresses_user_id_idx').on(table.userId),
    defaultSenderIdx: index('addresses_default_sender_idx').on(
      table.isDefaultSender,
    ),
  }),
);

export const palletTemplates = pgTable('pallet_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  palletType: varchar('pallet_type', { length: 50 }).notNull(),
  length: decimal('length', { precision: 6, scale: 1 }),
  width: decimal('width', { precision: 6, scale: 1 }),
  height: decimal('height', { precision: 6, scale: 1 }),
  weight: decimal('weight', { precision: 8, scale: 2 }),
  stackable: boolean('stackable').default(false),
  fragile: boolean('fragile').default(false),
  adr: boolean('adr').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const carrierServices = pgTable('carrier_services', {
  id: uuid('id').defaultRandom().primaryKey(),
  carrierCode: varchar('carrier_code', { length: 50 }).notNull(),
  serviceName: varchar('service_name', { length: 100 }).notNull(),
  palletTypes: text('pallet_types').array().notNull(),
  maxLength: decimal('max_length', { precision: 6, scale: 1 }),
  maxWidth: decimal('max_width', { precision: 6, scale: 1 }),
  maxHeight: decimal('max_height', { precision: 6, scale: 1 }),
  maxWeight: decimal('max_weight', { precision: 8, scale: 2 }),
  countries: text('countries').array(),
  isActive: boolean('is_active').default(true),
  basePriceRules: jsonb('base_price_rules'),
  surchargeRules: jsonb('surcharge_rules'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const quotes = pgTable(
  'quotes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id),
    sessionToken: varchar('session_token', { length: 255 }),
    palletType: varchar('pallet_type', { length: 50 }).notNull(),
    length: decimal('length', { precision: 6, scale: 1 }),
    width: decimal('width', { precision: 6, scale: 1 }),
    height: decimal('height', { precision: 6, scale: 1 }),
    weight: decimal('weight', { precision: 8, scale: 2 }),
    senderPostal: varchar('sender_postal', { length: 20 }),
    senderCountry: varchar('sender_country', { length: 10 }),
    recipientPostal: varchar('recipient_postal', { length: 20 }),
    recipientCountry: varchar('recipient_country', { length: 10 }),
    options: jsonb('options'),
    results: jsonb('results'),
    currency: varchar('currency', { length: 10 }).default('PLN'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index('quotes_user_id_idx').on(table.userId),
    sessionIdx: index('quotes_session_idx').on(table.sessionToken),
    createdAtIdx: index('quotes_created_at_idx').on(table.createdAt),
  }),
);

export const invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  invoiceNumber: varchar('invoice_number', { length: 30 }).unique().notNull(),
  userId: uuid('user_id').references(() => users.id),
  companyId: uuid('company_id').references(() => companies.id),
  status: varchar('status', { length: 30 }).default('UNPAID'),
  totalNetto: decimal('total_netto', { precision: 10, scale: 2 }),
  totalVat: decimal('total_vat', { precision: 10, scale: 2 }),
  totalBrutto: decimal('total_brutto', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 10 }).default('PLN'),
  paymentMethod: varchar('payment_method', { length: 50 }),
  paymentId: varchar('payment_id', { length: 255 }),
  pdfUrl: varchar('pdf_url', { length: 500 }),
  correctionFor: uuid('correction_for').references((): any => invoices.id),
  dueDate: date('due_date'),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const orders = pgTable(
  'orders',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orderNumber: varchar('order_number', { length: 30 }).unique().notNull(),
    userId: uuid('user_id').references(() => users.id),
    quoteId: uuid('quote_id').references(() => quotes.id),
    carrierCode: varchar('carrier_code', { length: 50 }).notNull(),
    carrierService: varchar('carrier_service', { length: 100 }).notNull(),
    status: varchar('status', { length: 50 }).default('PENDING'),
    senderAddress: jsonb('sender_address').notNull(),
    recipientAddress: jsonb('recipient_address').notNull(),
    palletData: jsonb('pallet_data').notNull(),
    additionalServices: jsonb('additional_services'),
    priceNetto: decimal('price_netto', { precision: 10, scale: 2 }),
    priceVat: decimal('price_vat', { precision: 10, scale: 2 }),
    priceBrutto: decimal('price_brutto', { precision: 10, scale: 2 }),
    currency: varchar('currency', { length: 10 }).default('PLN'),
    couponCode: varchar('coupon_code', { length: 50 }),
    discountAmount: decimal('discount_amount', {
      precision: 10,
      scale: 2,
    }).default('0'),
    carrierLabelUrl: varchar('carrier_label_url', { length: 500 }),
    carrierTrackingNumber: varchar('carrier_tracking_number', { length: 100 }),
    invoiceId: uuid('invoice_id').references(() => invoices.id),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      statusIdx: index('orders_status_idx').on(table.status),
      userIdIdx: index('orders_user_id_idx').on(table.userId),
      createdAtIdx: index('orders_created_at_idx').on(table.createdAt),
      orderNumberIdx: index('orders_number_idx').on(table.orderNumber),
    };
  },
);

export const trackingEvents = pgTable(
  'tracking_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orderId: uuid('order_id').references(() => orders.id, {
      onDelete: 'cascade',
    }),
    internalStatus: varchar('internal_status', { length: 50 }).notNull(),
    carrierStatus: varchar('carrier_status', { length: 100 }),
    carrierStatusDescription: text('carrier_status_description'),
    location: varchar('location', { length: 255 }),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    orderIdIdx: index('tracking_events_order_id_idx').on(table.orderId),
    occurredAtIdx: index('tracking_events_occurred_at_idx').on(
      table.occurredAt,
    ),
  }),
);

export const leads = pgTable(
  'leads',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 30 }),
    company: varchar('company', { length: 255 }),
    palletType: varchar('pallet_type', { length: 100 }),
    description: text('description').notNull(),
    dimensions: varchar('dimensions', { length: 255 }),
    weight: varchar('weight', { length: 100 }),
    route: varchar('route', { length: 255 }),
    preferredDate: date('preferred_date'),
    status: varchar('status', { length: 30 }).default('NEW'),
    assignedTo: uuid('assigned_to').references(() => users.id),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      statusIdx: index('leads_status_idx').on(table.status),
      createdAtIdx: index('leads_created_at_idx').on(table.createdAt),
      emailIdx: index('leads_email_idx').on(table.email),
    };
  },
);

export const cmsPages = pgTable('cms_pages', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  content: text('content'),
  metaTitle: varchar('meta_title', { length: 500 }),
  metaDescription: varchar('meta_description', { length: 500 }),
  isPublished: boolean('is_published').default(false),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const cmsArticles = pgTable('cms_articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  excerpt: text('excerpt'),
  content: text('content'),
  category: varchar('category', { length: 100 }),
  metaTitle: varchar('meta_title', { length: 500 }),
  metaDescription: varchar('meta_description', { length: 500 }),
  isPublished: boolean('is_published').default(false),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const pricingRules = pgTable(
  'pricing_rules',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    carrierCode: varchar('carrier_code', { length: 50 }).notNull(),
    serviceName: varchar('service_name', { length: 100 }).notNull(),
    basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
    kmRate: decimal('km_rate', { precision: 10, scale: 2 }).default('0'),
    marginPercent: decimal('margin_percent', {
      precision: 5,
      scale: 2,
    }).default('15.00'),
    minWeight: decimal('min_weight', { precision: 10, scale: 2 }).default('0'),
    maxWeight: decimal('max_weight', { precision: 10, scale: 2 }).default(
      '1200',
    ),
    currency: varchar('currency', { length: 10 }).default('PLN'),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    carrierIdx: index('pricing_rules_carrier_idx').on(table.carrierCode),
    activeIdx: index('pricing_rules_active_idx').on(table.isActive),
  }),
);

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    actorUserId: uuid('actor_user_id').references(() => users.id),
    actorEmail: varchar('actor_email', { length: 255 }),
    action: varchar('action', { length: 120 }).notNull(),
    entityType: varchar('entity_type', { length: 120 }).notNull(),
    entityId: varchar('entity_id', { length: 255 }),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      actionIdx: index('audit_logs_action_idx').on(table.action),
      entityTypeIdx: index('audit_logs_entity_type_idx').on(table.entityType),
      createdAtIdx: index('audit_logs_created_at_idx').on(table.createdAt),
    };
  },
);
