import { db } from './db';
import { cmsPages } from './db/schema';

async function seed() {
  console.log('Seeding database...');

  // Seed CMS pages
  await db
    .insert(cmsPages)
    .values([
      {
        slug: 'home',
        title: 'Strona Główna',
        content: JSON.stringify({
          heroTitle: 'Transport paletowy bez niespodzianek.',
          heroSubtitle:
            'Skupiamy się wyłącznie na logistyce paletowej. Gwarantujemy przewidywalność i brak ukrytych kosztów.',
        }),
        isPublished: true,
      },
      {
        slug: 'b2b',
        title: 'Oferta B2B',
        content: JSON.stringify({
          title: 'Rozwiązania dla biznesu',
          description: 'Dedykowane warunki dla stałych partnerów.',
        }),
        isPublished: true,
      },
    ])
    .onConflictDoNothing();

  console.log('Seeding completed.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
