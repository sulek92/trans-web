import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Regulamin świadczenia usług | PaletyBroker',
  description: 'Regulamin platformy PaletyBroker. Zakres usług, wycena, limity automatyczne, składanie zamówień, płatności, obowiązki nadawcy i reklamacje.',
};

export default function RegulaminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
