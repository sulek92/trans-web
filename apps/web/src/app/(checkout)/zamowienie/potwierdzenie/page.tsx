import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Zamówienie przyjęte - PaletyBroker',
};

export default function ConfirmationPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="max-w-xl w-full text-center border-2 border-[var(--color-primary-highlight)]">
        <CardContent className="p-8 md:p-12">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="h-20 w-20 text-[var(--color-success)]" />
          </div>
          <h1 className="text-3xl font-display font-bold text-[var(--color-on-background)] mb-4">
            Zamówienie opłacone!
          </h1>
          <p className="text-[var(--color-on-surface-variant)] mb-8">
            Dziękujemy za złożenie zamówienia. Otrzymaliśmy Twoją płatność. Numer zamówienia to <strong>#OR-987654321</strong>.
          </p>
          
          <div className="bg-[var(--color-surface-offset)] p-6 rounded-xl text-left mb-8 space-y-4">
            <div className="flex items-start gap-4">
              <FileText className="h-6 w-6 text-[var(--color-primary)] shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-[var(--color-on-background)]">Pobierz etykietę i list przewozowy</h3>
                <p className="text-sm text-[var(--color-on-surface-variant)] mt-1 mb-3">Etykieta musi zostać naklejona w widocznym miejscu na palecie.</p>
                <button className="inline-flex h-8 items-center justify-center rounded-md bg-[var(--color-surface-container-low)] px-3 text-sm font-medium text-[var(--color-on-background)] hover:bg-[var(--color-surface-container-highest)] transition-colors">
                  Pobierz PDF
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/konto" className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--color-surface-container-low)] px-4 py-2 font-medium text-[var(--color-on-background)] hover:bg-[var(--color-surface-container-highest)] transition-colors">
              Przejdź do Panelu
            </Link>
            <Link href="/" className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-4 py-2 font-medium text-[var(--color-on-primary)] hover:bg-[var(--color-surface-tint)] transition-colors">
              Nowe zamówienie <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
