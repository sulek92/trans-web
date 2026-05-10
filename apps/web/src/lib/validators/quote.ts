import { z } from 'zod';

export const QuoteSchema = z.object({
  palletType: z.enum(['euro', 'semi_euro', 'industrial', 'semi_industrial', 'custom'], {
    message: 'Wybierz typ palety',
  }),
  palletCount: z.number({ error: 'Podaj liczbę palet' }).int('Liczba palet musi być całkowita').min(1, 'Minimum 1 paleta').max(33, 'Maksymalnie 33 palety'),
  length: z.number({ error: 'Podaj długość' }).min(1, 'Długość musi być > 0').max(300, 'Zbyt duża długość'),
  width: z.number({ error: 'Podaj szerokość' }).min(1, 'Szerokość musi być > 0').max(300, 'Zbyt duża szerokość'),
  height: z.number({ error: 'Podaj wysokość' }).min(1, 'Wysokość musi być > 0').max(250, 'Zbyt duża wysokość'),
  weight: z.number({ error: 'Podaj wagę' }).min(1, 'Waga musi być > 0').max(1500, 'Zbyt duża waga'),
  senderPostalCode: z.string().regex(/^(\d{2}-\d{3}|\d{5})$/, 'Nieprawidłowy kod pocztowy'),
  senderCountry: z.enum(['PL', 'DE', 'FR', 'IT', 'NL', 'ES']).default('PL'),
  recipientPostalCode: z.string().regex(/^(\d{2}-\d{3}|\d{5})$/, 'Nieprawidłowy kod pocztowy'),
  recipientCountry: z.enum(['PL', 'DE', 'FR', 'IT', 'NL', 'ES']).default('PL'),
  isStackable: z.boolean().default(false),
  isFragile: z.boolean().default(false),
  hasAdr: z.boolean().default(false),
  senderIsPrivate: z.boolean().default(false),
  recipientIsPrivate: z.boolean().default(false),
});

export type QuoteFormInput = z.input<typeof QuoteSchema>;
export type QuoteFormValues = z.output<typeof QuoteSchema>;
