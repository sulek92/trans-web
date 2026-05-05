import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Plus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Książka adresowa - PaletyBroker',
};

const addresses = [
  { id: 1, type: 'Nadawca', name: 'Główny Magazyn', address: 'ul. Logistyczna 1', city: '00-001 Warszawa', country: 'Polska' },
  { id: 2, type: 'Odbiorca', name: 'Jan Kowalski', address: 'ul. Odbiorcza 45', city: '30-002 Kraków', country: 'Polska' },
];

export default function AddressesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-[var(--color-on-background)]">
          Książka adresowa
        </h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Dodaj adres
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addresses.map(addr => (
          <Card key={addr.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[var(--color-on-surface-variant)]">{addr.type}</CardTitle>
              <MapPin className="h-4 w-4 text-[var(--color-primary)]" />
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-lg text-[var(--color-on-background)]">{addr.name}</p>
              <p className="text-sm text-[var(--color-on-surface-variant)] mt-2">{addr.address}</p>
              <p className="text-sm text-[var(--color-on-surface-variant)]">{addr.city}</p>
              <p className="text-sm text-[var(--color-on-surface-variant)]">{addr.country}</p>
              
              <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--color-outline-variant)]">
                <Button variant="secondary" size="sm" className="flex-1">Edytuj</Button>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">Usuń</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
