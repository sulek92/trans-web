import { Metadata } from 'next';
import { DataTable, Column } from '@/components/ui/data-table';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Historia zamówień - PaletyBroker',
};

interface OrderHistoryItem {
  id: string;
  date: string;
  recipient: string;
  carrier: string;
  status: string;
  price: string;
}

const mockOrders: OrderHistoryItem[] = [
  { id: 'OR-987654321', date: '2026-05-05', recipient: 'Jan Kowalski, Warszawa', carrier: 'DHL', status: 'Oczekuje na kuriera', price: '184.50 zł' },
  { id: 'OR-123456789', date: '2026-05-01', recipient: 'Firma ABC, Kraków', carrier: 'DPD', status: 'Dostarczone', price: '196.80 zł' },
];

const columns: Column<OrderHistoryItem>[] = [
  { header: 'ID Zamówienia', accessorKey: 'id' },
  { header: 'Data', accessorKey: 'date' },
  { header: 'Odbiorca', accessorKey: 'recipient' },
  { header: 'Przewoźnik', accessorKey: 'carrier' },
  { 
    header: 'Status', 
    cell: (item) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Dostarczone' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-blue-500/10 text-blue-500'}`}>
        {item.status}
      </span>
    )
  },
  { header: 'Kwota', accessorKey: 'price' },
  {
    header: 'Akcje',
    cell: (item) => (
      <Link
        href={`/konto/zamowienia/${item.id}`}
        className="inline-flex h-8 items-center justify-center rounded-md bg-transparent px-3 text-sm font-medium text-[var(--color-on-background)] hover:bg-[var(--color-surface-container-low)] transition-colors"
      >
        Szczegóły
      </Link>
    )
  }
];

export default function OrdersPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-[var(--color-on-background)]">
          Historia zamówień
        </h1>
        <Link href="/" className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--color-primary)] px-4 py-2 font-medium text-[var(--color-on-primary)] hover:bg-[var(--color-surface-tint)] transition-colors">
          Nowa paczka
        </Link>
      </div>

      <DataTable data={mockOrders} columns={columns} />
    </div>
  );
}
