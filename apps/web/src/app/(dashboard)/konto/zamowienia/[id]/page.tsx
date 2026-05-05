import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Download, Package } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Szczegóły zamówienia - PaletyBroker',
};

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/konto/zamowienia" className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-transparent text-[var(--color-on-background)] hover:bg-[var(--color-surface-container-low)] transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-display font-bold text-[var(--color-on-background)]">
          Zamówienie #{params.id}
        </h1>
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-500 ml-auto">
          Oczekuje na kuriera
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dane nadawcy</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[var(--color-on-surface-variant)] space-y-1">
            <p className="font-semibold text-[var(--color-on-background)]">Moja Firma Sp. z o.o.</p>
            <p>ul. Przykładowa 12/3</p>
            <p>00-001 Warszawa</p>
            <p>Polska</p>
            <p className="pt-2">Tel: +48 123 456 789</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dane odbiorcy</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[var(--color-on-surface-variant)] space-y-1">
            <p className="font-semibold text-[var(--color-on-background)]">Jan Kowalski</p>
            <p>ul. Odbiorcza 45</p>
            <p>30-002 Kraków</p>
            <p>Polska</p>
            <p className="pt-2">Tel: +48 987 654 321</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Szczegóły ładunku</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-[var(--color-surface-offset)] flex items-center justify-center text-[var(--color-primary)]">
              <Package className="h-6 w-6" />
            </div>
            <div className="text-sm text-[var(--color-on-surface-variant)]">
              <p><strong className="text-[var(--color-on-background)]">Paleta Euro</strong> (120x80x150 cm)</p>
              <p>Waga: 450 kg</p>
              <p>Usługi dodatkowe: Brak</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 pt-4 border-t border-[var(--color-outline-variant)]">
        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[var(--color-surface-container-low)] px-4 py-2 font-medium text-[var(--color-on-background)] hover:bg-[var(--color-surface-container-highest)] transition-colors">
          <Download className="h-4 w-4" /> Pobierz Etykietę
        </button>
        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[var(--color-surface-container-low)] px-4 py-2 font-medium text-[var(--color-on-background)] hover:bg-[var(--color-surface-container-highest)] transition-colors">
          <Download className="h-4 w-4" /> Pobierz Fakturę
        </button>
      </div>
    </div>
  );
}
