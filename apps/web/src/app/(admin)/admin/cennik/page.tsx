'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';
import { useToastStore } from '@/lib/store/toast-store';
import { Skeleton } from '@/components/ui/skeleton';

interface PricingRule {
  id: string;
  carrierCode: string;
  serviceName: string;
  basePrice: string;
  marginPercent: string;
  isActive: boolean;
}

export default function AdminPricingRulesPage() {
  const [rules, setRules] = React.useState<PricingRule[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [editingRule, setEditingRule] = React.useState<PricingRule | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const { addToast } = useToastStore();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const fetchRules = React.useCallback(async () => {
    const token = getCookie('pb_auth_token');
    try {
      const response = await fetch(`${API_URL}/admin/pricing-rules`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRules(data);
      }
    } catch (err) {
      addToast({ title: 'Błąd', description: 'Nie udało się pobrać reguł cennika.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, addToast]);

  React.useEffect(() => {
    void fetchRules();
  }, [fetchRules]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;

    setIsSaving(true);
    const token = getCookie('pb_auth_token');
    try {
      const response = await fetch(`${API_URL}/admin/pricing-rules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingRule)
      });
      if (response.ok) {
        await fetchRules();
        setEditingRule(null);
        addToast({ title: 'Zapisano', description: 'Reguła cennika została zaktualizowana.', type: 'success' });
      }
    } catch (err) {
      addToast({ title: 'Błąd zapisu', description: 'Nie udało się zapisać reguły.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEditingRule(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Reguły Cennika</h1>
          <p className="text-slate-500">Zarządzaj marżami i cenami bazowymi przewoźników.</p>
        </div>
        <button 
          onClick={() => setEditingRule({ id: '', carrierCode: '', serviceName: '', basePrice: '0', marginPercent: '15', isActive: true })}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          Nowa Reguła
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                <th className="px-8 py-5">Przewoźnik</th>
                <th className="px-8 py-5">Usługa</th>
                <th className="px-8 py-5">Cena Bazowa</th>
                <th className="px-8 py-5">Marża (%)</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-900 uppercase">{rule.carrierCode}</div>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-600">{rule.serviceName}</td>
                  <td className="px-8 py-6 font-medium">{rule.basePrice} PLN</td>
                  <td className="px-8 py-6 font-bold text-blue-600">{rule.marginPercent}%</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${rule.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {rule.isActive ? 'Aktywna' : 'Nieaktywna'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => setEditingRule(rule)} className="text-slate-300 hover:text-blue-600 transition-colors">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  </td>
                </tr>
              ))}
              {rules.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400 italic">
                    Brak zdefiniowanych reguł cennika.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {editingRule && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setEditingRule(null)}
        >
          <div 
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg min-w-[360px] overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold">{editingRule.id ? 'Edytuj Regułę' : 'Nowa Reguła'}</h2>
              <button onClick={() => setEditingRule(null)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Kod Przewoźnika</label>
                  <input 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 transition-colors"
                    value={editingRule.carrierCode}
                    onChange={e => setEditingRule({...editingRule, carrierCode: e.target.value})}
                    placeholder="np. DHL"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Nazwa Usługi</label>
                  <input 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 transition-colors"
                    value={editingRule.serviceName}
                    onChange={e => setEditingRule({...editingRule, serviceName: e.target.value})}
                    placeholder="np. Paleta Standard"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Cena Bazowa (PLN)</label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:border-blue-500 transition-colors"
                    value={editingRule.basePrice}
                    onChange={e => setEditingRule({...editingRule, basePrice: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Marża (%)</label>
                  <input 
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:border-blue-500 transition-colors"
                    value={editingRule.marginPercent}
                    onChange={e => setEditingRule({...editingRule, marginPercent: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <input 
                  type="checkbox"
                  id="isActive"
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={editingRule.isActive}
                  onChange={e => setEditingRule({...editingRule, isActive: e.target.checked})}
                />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-700 cursor-pointer">Reguła aktywna</label>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setEditingRule(null)}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Anuluj
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-6 py-4 rounded-2xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Zapisywanie...' : 'Zapisz Regułę'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
