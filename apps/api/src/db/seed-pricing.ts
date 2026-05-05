import { db } from './index';
import { pricingRules } from './schema';

async function seed() {
  console.log('Seeding pricing rules...');

  const rules = [
    {
      carrierCode: 'DPD',
      serviceName: 'Paleta Standard',
      basePrice: '145.00',
      kmRate: '0.00',
      marginPercent: '15.00',
      minWeight: '0.00',
      maxWeight: '1200.00',
      isActive: true,
    },
    {
      carrierCode: 'DHL',
      serviceName: 'DHL Pallet',
      basePrice: '160.00',
      kmRate: '0.00',
      marginPercent: '12.00',
      minWeight: '0.00',
      maxWeight: '1000.00',
      isActive: true,
    },
    {
      carrierCode: 'RABEN',
      serviceName: 'Domestic Pallet',
      basePrice: '120.00',
      kmRate: '0.85',
      marginPercent: '20.00',
      minWeight: '0.00',
      maxWeight: '1200.00',
      isActive: true,
    },
  ];

  for (const rule of rules) {
    await db.insert(pricingRules).values(rule);
  }

  console.log('Seed completed successfully.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
