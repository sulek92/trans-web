'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Package } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { getApiBaseUrl } from '@/lib/api-url';

interface CustomQuoteFormValues {
  name: string;
  company?: string;
  email: string;
  phone: string;
  from: string;
  to: string;
  description: string;
}

export default function CustomQuotePage() {
  const [submitted, setSubmitted] = React.useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CustomQuoteFormValues>();

  const onSubmit = async (data: CustomQuoteFormValues) => {
    try {
      await fetch(`${getApiBaseUrl()}/custom-quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      void 0;
    }
    await new Promise(r => setTimeout(r, 1000));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Card className="max-w-xl w-full text-center border-2 border-[var(--color-primary-highlight)]">
          <CardContent className="p-8 md:p-12">
            <div className="flex justify-center mb-6">
              <CheckCircle2 className="h-20 w-20 text-[var(--color-success)]" />
            </div>
            <h1 className="text-3xl font-display font-bold text-[var(--color-on-background)] mb-4">
              Zapytanie wysłane
            </h1>
            <p className="text-[var(--color-on-surface-variant)] mb-8">
              Otrzymaliśmy Twoje zgłoszenie dotyczące przesyłki niestandardowej. Nasz doradca skontaktuje się z Tobą w ciągu 2 godzin, aby przedstawić dedykowaną wycenę.
            </p>
            <Button onClick={() => setSubmitted(false)}>Wyślij kolejne zapytanie</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-2xl bg-[var(--color-primary-highlight)] flex items-center justify-center text-[var(--color-primary)]">
            <Package className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-4xl font-display font-bold text-[var(--color-on-background)] mb-4">
          Wycena indywidualna
        </h1>
        <p className="text-lg text-[var(--color-on-surface-variant)]">
          Twoja przesyłka przekracza standardowe wymiary lub wymaga specjalnej obsługi? Wypełnij formularz, a przygotujemy dedykowaną ofertę szytą na miarę.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-display font-semibold border-b border-[var(--color-outline-variant)] pb-2">Dane kontaktowe</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Imię i nazwisko" {...register('name', { required: 'Wymagane' })} error={errors.name?.message as string} />
                <Input label="Nazwa firmy (opcjonalnie)" {...register('company')} />
                <Input label="Adres e-mail" type="email" {...register('email', { required: 'Wymagane' })} error={errors.email?.message as string} />
                <Input label="Numer telefonu" type="tel" {...register('phone', { required: 'Wymagane' })} error={errors.phone?.message as string} />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-display font-semibold border-b border-[var(--color-outline-variant)] pb-2">Szczegóły ładunku</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Skąd wysyłasz? (Kod pocztowy, Miejscowość)" {...register('from', { required: 'Wymagane' })} />
                <Input label="Dokąd wysyłasz? (Kod pocztowy, Miejscowość)" {...register('to', { required: 'Wymagane' })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-on-background)] mb-1">
                  Opis ładunku (wymiary, waga, rodzaj towaru)
                </label>
                <textarea 
                  className="flex min-h-[120px] w-full rounded-md border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] transition-colors"
                  placeholder="Napisz co chcesz przewieźć..."
                  {...register('description', { required: 'Wymagane' })}
                />
                {errors.description && <span className="text-xs text-[var(--color-error)] mt-1">{errors.description.message as string}</span>}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full text-lg" isLoading={isSubmitting}>
              Wyślij zapytanie o wycenę
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
