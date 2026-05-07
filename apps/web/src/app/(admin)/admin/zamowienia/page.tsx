'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';
import { getApiBaseUrl } from '@/lib/api-url';
import { useToastStore } from '@/lib/store/toast-store';
import { Skeleton } from '@/components/ui/skeleton';

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  senderAddress?: { name?: string; companyName?: string };
  recipientAddress?: { city?: string };
  carrierCode: string;
  status: string;
  priceBrutto: string;
  invoiceId?: string;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Unexpected error';
}

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = React.useState('wszystkie');
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isBulkUpdating, setIsBulkUpdating] = React.useState(false);
  const [correctionData, setCorrectionData] = React.useState<{ orderId: string; invoiceId: string } | null>(null);
  const [correctionAmount, setCorrectionAmount] = React.useState('');
  const [correctionReason, setCorrectionReason] = React.useState('');
  const [isCorrecting, setIsCorrecting] = React.useState(false);
  const { addToast } = useToastStore();

  const API_URL = getApiBaseUrl();

  const fetchOrders = React.useCallback(async () => {
    const token = getCookie('pb_auth_token');
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      addToast({ title: 'Błąd', description: 'Nie udało się pobrać zamówień.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, addToast]);

  React.useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED': case 'DORĘCZONE': return 'bg-emerald-100 text-emerald-800';
      case 'PENDING': case 'OCZEKIWANIE': return 'bg-amber-100 text-amber-800';
      case 'ERROR': case 'BŁĄD': return 'bg-red-100 text-red-800';
      case 'CANCELLED': case 'ANULOWANE': return 'bg-slate-100 text-slate-500';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.senderAddress?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.senderAddress?.companyName || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'wszystkie') return matchesSearch;
    if (activeTab === 'nowe') return matchesSearch && (order.status.toUpperCase() === 'PENDING' || order.status.toUpperCase() === 'OCZEKIWANIE');
    if (activeTab === 'zakonczone') return matchesSearch && (order.status.toUpperCase() === 'DELIVERED' || order.status.toUpperCase() === 'DORĘCZONE');
    if (activeTab === 'problemy') return matchesSearch && (order.status.toUpperCase() === 'ERROR' || order.status.toUpperCase() === 'BŁĄD');
    
    return matchesSearch;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map(o => o.id));
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedIds.length === 0) return;
    setIsBulkUpdating(true);
    const token = getCookie('pb_auth_token');
    try {
      const response = await fetch(`${API_URL}/orders/bulk-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids: selectedIds, status })
      });
      if (response.ok) {
        setOrders(prev => prev.map(o => selectedIds.includes(o.id) ? { ...o, status } : o));
        setSelectedIds([]);
        addToast({ title: 'Aktualizacja masowa', description: `Zmieniono status ${selectedIds.length} zamówień.`, type: 'success' });
      }
    } catch (error) {
      void error;
      addToast({ title: 'Błąd', description: 'Nie udało się zaktualizować zamówień.', type: 'error' });
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    const token = getCookie('pb_auth_token');
    try {
      const response = await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
        addToast({ title: 'Status zmieniony', description: `Zamówienie ${id} ma nowy status.`, type: 'success' });
      }
    } catch (error) {
      void error;
      addToast({ title: 'Błąd', description: 'Nie udało się zmienić statusu zamówienia.', type: 'error' });
    }
  };

  const handleCorrection = async () => {
    if (!correctionData || !correctionAmount || !correctionReason) return;
    setIsCorrecting(true);
    const token = getCookie('pb_auth_token');
    try {
      const response = await fetch(`${API_URL}/invoices/correction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          originalInvoiceId: correctionData.invoiceId,
          diffAmountNet: parseFloat(correctionAmount),
          reason: correctionReason
        })
      });
      if (response.ok) {
        addToast({ title: 'Korekta wystawiona', description: 'Nowa faktura korygująca została wygenerowana.', type: 'success' });
        setCorrectionData(null);
        setCorrectionAmount('');
        setCorrectionReason('');
      } else {
        throw new Error('Failed to create correction');
      }
    } catch (error) {
      void error;
      addToast({ title: 'Błąd', description: 'Nie udało się wystawić korekty.', type: 'error' });
    } finally {
      setIsCorrecting(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-8 relative">
      {/* Floating Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-8 animate-in slide-in-from-bottom-10 duration-300">
          <div className="flex items-center gap-3 pr-8 border-r border-white/10">
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center font-bold text-sm">{selectedIds.length}</div>
            <div className="text-sm font-bold tracking-tight">Zaznaczono zamówienia</div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Akcje masowe:</span>
            <div className="flex gap-2">
              <button 
                onClick={() => handleBulkStatusUpdate('DELIVERED')}
                disabled={isBulkUpdating}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Doręczone
              </button>
              <button 
                onClick={() => handleBulkStatusUpdate('CANCELLED')}
                disabled={isBulkUpdating}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">cancel</span>
                Anuluj
              </button>
            </div>
            <button 
              onClick={() => setSelectedIds([])}
              className="ml-4 text-xs font-bold text-white/50 hover:text-white transition-colors"
            >
              Anuluj wybór
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-display-bold text-3xl font-bold text-[var(--color-on-background)] mb-2">Zarządzanie Zamówieniami</h1>
          <p className="text-[var(--color-on-surface-variant)]">Podgląd i edycja wszystkich zleceń transportowych w systemie.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={async () => {
              const token = getCookie('pb_auth_token');
              const res = await fetch(`${API_URL}/orders/export/csv`, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'zamowienia.csv';
                a.click();
                addToast({ title: 'Pobrano CSV', description: 'Lista zamówień została wyeksportowana.', type: 'success' });
              }
            }}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-[var(--color-divider)] rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-premium shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Eksport CSV
          </button>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-[var(--color-primary)]">search</span>
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white border border-[var(--color-divider)] rounded-xl text-xs font-bold outline-none focus:border-[var(--color-primary)] transition-premium shadow-sm" 
              placeholder="Szukaj ID lub klienta..." 
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-[var(--color-divider)] pb-px">
        {['wszystkie', 'nowe', 'zakonczone', 'problemy'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
              activeTab === tab ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-[var(--color-divider)] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  <th className="px-6 py-5 w-10">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.length > 0 && selectedIds.length === filteredOrders.length}
                      onChange={selectAll}
                      className="w-4 h-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    />
                  </th>
                  <th className="px-8 py-5">Data / ID</th>
                  <th className="px-8 py-5">Klient / Firma</th>
                  <th className="px-8 py-5">Przewoźnik</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Kwota (Brutto)</th>
                  <th className="px-8 py-5">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-divider)]">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className={`hover:bg-slate-50/50 transition-colors group ${selectedIds.includes(o.id) ? 'bg-blue-50/50' : ''}`}>
                    <td className="px-6 py-5">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(o.id)}
                        onChange={() => toggleSelect(o.id)}
                        className="w-4 h-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      />
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-xs text-slate-400 mb-1">{new Date(o.createdAt).toLocaleDateString('pl-PL')}</div>
                      <div className="font-bold text-sm text-[var(--color-primary)]">{o.orderNumber}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-[var(--color-on-background)]">{o.senderAddress?.name || o.senderAddress?.companyName || 'Brak danych'}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">{o.carrierCode}</div>
                        <span className="text-sm font-medium text-slate-600">{o.carrierCode}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <select 
                        value={o.status}
                        onChange={(e) => handleStatusUpdate(o.id, e.target.value)}
                        className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-full outline-none cursor-pointer ${getStatusStyle(o.status)}`}
                      >
                        <option value="PENDING">Oczekiwanie</option>
                        <option value="IN_TRANSIT">W transporcie</option>
                        <option value="DELIVERED">Doręczone</option>
                        <option value="CANCELLED">Anulowane</option>
                        <option value="ERROR">Błąd</option>
                      </select>
                    </td>
                    <td className="px-8 py-5 text-right font-bold text-sm">
                      {o.priceBrutto} PLN
                    </td>
                    <td className="px-8 py-5 text-right flex items-center justify-end gap-2">
                      <button 
                        onClick={async () => {
                          const token = getCookie('pb_auth_token');
                          const res = await fetch(`${API_URL}/documents/label/${o.id}`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                          });
                          if (res.ok) {
                            const blob = await res.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `etykieta-${o.orderNumber}.pdf`;
                            a.click();
                          }
                        }}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[var(--color-primary)] transition-colors"
                        title="Drukuj etykietę"
                      >
                        <span className="material-symbols-outlined text-sm">label</span>
                      </button>
                      <button 
                        onClick={async () => {
                          const token = getCookie('pb_auth_token');
                          const res = await fetch(`${API_URL}/documents/invoice/${o.id}`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                          });
                          if (res.ok) {
                            const blob = await res.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `faktura-${o.orderNumber}.pdf`;
                            a.click();
                          }
                        }}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                        title="Pobierz fakturę"
                      >
                        <span className="material-symbols-outlined text-sm">receipt_long</span>
                      </button>
                      {o.invoiceId && (
                        <button 
                          onClick={() => setCorrectionData({ orderId: o.id, invoiceId: o.invoiceId! })}
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-amber-600 transition-colors"
                          title="Wystaw korektę"
                        >
                          <span className="material-symbols-outlined text-sm">edit_note</span>
                        </button>
                      )}
                      <button className="bg-slate-50 hover:bg-slate-100 p-2 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-slate-400 text-sm">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrders.length === 0 && (
              <div className="p-20 text-center text-slate-400 font-bold">Brak zamówień spełniających kryteria.</div>
            )}
          </div>
        )}
      </div>

      {/* Correction Modal */}
      {correctionData && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setCorrectionData(null)}></div>
          <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--color-on-background)] mb-1">Wystaw Korektę</h2>
                  <p className="text-sm text-slate-400 font-bold">Faktura pierwotna: {correctionData.invoiceId.slice(0,8)}...</p>
                </div>
                <button onClick={() => setCorrectionData(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <span className="material-symbols-outlined text-slate-400">close</span>
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Kwota Korekty (Netto)</label>
                  <input 
                    type="number"
                    value={correctionAmount}
                    onChange={(e) => setCorrectionAmount(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-[var(--color-primary)] transition-all"
                    placeholder="Wpisz różnicę kwoty..."
                  />
                  <p className="text-[10px] text-slate-400 px-1 italic">* Kwota o jaką zmieniasz cenę netto (dodatnia lub ujemna).</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Powód Korekty</label>
                  <textarea 
                    value={correctionReason}
                    onChange={(e) => setCorrectionReason(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-[var(--color-primary)] transition-all min-h-[100px]"
                    placeholder="Np. Błędna waga palety, dopłata za rozładunek..."
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    onClick={() => setCorrectionData(null)}
                    className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl text-xs font-bold transition-all uppercase tracking-widest"
                  >
                    Anuluj
                  </button>
                  <button 
                    onClick={handleCorrection}
                    disabled={isCorrecting || !correctionAmount || !correctionReason}
                    className="flex-[2] py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-[var(--color-primary)]/20 uppercase tracking-widest disabled:opacity-50"
                  >
                    {isCorrecting ? 'Wystawianie...' : 'Wystaw Korektę'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
