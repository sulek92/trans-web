import { db } from './index';
import { hash } from 'bcryptjs';
import { carrierServices, users } from './schema';

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

  await db
    .insert(users)
    .values([
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

  console.log('Seeding done.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
