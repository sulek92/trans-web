import * as React from 'react';
import Link from 'next/link';

export default function OrdersPage() {
  const orders = [
    { id: 'OR-987654321', date: '25.05.2024', carrier: 'DHL Freight', sender: 'Warszawa', recipient: 'Kraków', status: 'W doręczeniu', price: '245.00 PLN' },
    { id: 'OR-987654322', date: '22.05.2024', carrier: 'FedEx Express', sender: 'Wrocław', recipient: 'Poznań', status: 'Doręczona', price: '312.50 PLN' },
    { id: 'OR-987654323', date: '18.05.2024', carrier: 'Raben Logistics', sender: 'Gdańsk', recipient: 'Łódź', status: 'Doręczona', price: '198.00 PLN' },
  ];

  return (
    <main className="pt-24 pb-16 min-h-screen bg-[var(--color-background)]">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="font-display-bold text-[32px] font-bold text-[var(--color-on-background)] mb-2">Moje Zamówienia</h1>
            <p className="text-[var(--color-on-surface-variant)]">Zarządzaj swoimi przesyłkami i śledź ich status w czasie rzeczywistym.</p>
          </div>
          <Link href="/" className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-[var(--color-surface-tint)] transition-premium">
            <span className="material-symbols-outlined">add</span>
            Nowa przesyłka
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl border border-[var(--color-divider)] mb-6 flex flex-col md:flex-row gap-4 items-center shadow-sm">
          <div className="relative flex-grow w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--color-divider)] focus:border-[var(--color-primary)] outline-none text-sm" placeholder="Szukaj po numerze zamówienia, nadawcy lub odbiorcy..." />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <select className="px-4 py-2 rounded-lg border border-[var(--color-divider)] text-sm bg-white outline-none focus:border-[var(--color-primary)]">
              <option>Wszystkie statusy</option>
              <option>W doręczeniu</option>
              <option>Doręczona</option>
              <option>Anulowana</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-[var(--color-divider)] rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Filtry
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[var(--color-divider)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-container-low)] border-b border-[var(--color-divider)]">
                  <th className="px-6 py-4 font-bold text-sm text-[var(--color-on-background)]">Numer zamówienia</th>
                  <th className="px-6 py-4 font-bold text-sm text-[var(--color-on-background)]">Data</th>
                  <th className="px-6 py-4 font-bold text-sm text-[var(--color-on-background)]">Przewoźnik</th>
                  <th className="px-6 py-4 font-bold text-sm text-[var(--color-on-background)]">Trasa</th>
                  <th className="px-6 py-4 font-bold text-sm text-[var(--color-on-background)]">Status</th>
                  <th className="px-6 py-4 font-bold text-sm text-[var(--color-on-background)]">Cena</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-divider)]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[var(--color-surface-container-lowest)] transition-colors">
                    <td className="px-6 py-4 font-data-mono text-sm font-bold text-[var(--color-primary)]">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-[var(--color-on-surface-variant)]">{order.date}</td>
                    <td className="px-6 py-4 text-sm font-medium text-[var(--color-on-background)]">{order.carrier}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--color-on-background)]">{order.sender}</span>
                        <span className="material-symbols-outlined text-xs text-[var(--color-on-surface-variant)]">arrow_forward</span>
                        <span className="text-[var(--color-on-background)]">{order.recipient}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        order.status === 'W doręczeniu' ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-sm text-[var(--color-on-background)]">{order.price}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/sledzenie?number=${order.id}`} className="text-[var(--color-primary)] hover:underline text-sm font-bold">
                        Szczegóły
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
