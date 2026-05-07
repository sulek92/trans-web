import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wycena transportu palet – porównaj ceny DHL, DPD, FedEx | PaletyBroker',
  description: 'Błyskawiczna wycena transportu paletowego online. Porównaj oferty DHL, DPD, FedEx i wybierz najlepszą cenę. Kalkulator stawek w czasie rzeczywistym.',
};

export default function WycenaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
