'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';
import { useToastStore } from '@/lib/store/toast-store';
import { Skeleton } from '@/components/ui/skeleton';
import { getApiBaseUrl } from '@/lib/api-url';

interface PricingRule {
  id: string;
  carrierCode: string;
  serviceName: string;
  basePrice: string;
  marginPercent: string;
  isActive: boolean;
  minWeight?: string;
  maxWeight?: string;
}

export default function AdminPricingRulesPage() {
  const [rules, setRules] = React.useState<PricingRule[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [editingRule, setEditingRule] = React.useState<PricingRule | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const { addToast } = useToastStore();

  const fetchRules = React.useCallback(async () => {
    const token = getCookie('pb_auth_token');
    try {
      const response = await fetch(`${getApiBaseUrl()}/admin/pricing-rules`, {
        headers: { 'Authorization': `Bearer ${token}` }
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
  }, [addToast]);

  React.useEffect(() => {
    void fetchRules();
  }, [fetchRules]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;

    setIsSaving(true);
    const token = getCookie('pb_auth_token');
    try {
      const response = await fetch(`${getApiBaseUrl()}/admin/pricing-rules`, {
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

  return (
    <div className="space-y-10 animate-fade-in relative pb-20">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-xs mb-3 block">Silnik Wyceń</span>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Reguły Cennika</h1>
          <p className="text-slate-500 text-lg">Konfiguruj marże i ceny bazowe dla usług przewoźników.</p>
        </div>
        <button 
          onClick={() => setEditingRule({ id: '', carrierCode: '', serviceName: '', basePrice: '0', marginPercent: '15', isActive: true })}
          className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-[var(--color-primary)]/20 hover:bg-[var(--color-surface-tint)] transition-premium flex items-center gap-2 active:scale-95"
        >
          <span className="material-symbols-outlined">add</span>
          Dodaj Regułę
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-64 w-full rounded-[40px]" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rules.map((rule) => (
            <div key={rule.id} className="group bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm hover:shadow-2xl transition-premium relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -z-10 group-hover:bg-[var(--color-primary-highlight)] transition-colors opacity-50" />
              
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-[var(--color-primary)] flex items-center justify-center font-bold text-sm uppercase">
                  {rule.carrierCode}
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${rule.isActive ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                  {rule.isActive ? 'Aktywna' : 'Włączona'}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-[var(--color-primary)] transition-colors">{rule.serviceName}</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">{rule.carrierCode} Service</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cena Bazowa</div>
                  <div className="text-lg font-bold text-slate-900">{rule.basePrice} <span className="text-[10px] font-normal text-slate-400">PLN</span></div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Marża</div>
                  <div className="text-lg font-bold text-[var(--color-primary)]">{rule.marginPercent}%</div>
                </div>
              </div>

              <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-50">
                <div className="text-[10px] text-slate-400 font-medium">
                  Waga: {rule.minWeight || 0} - {rule.maxWeight || 1200} kg
                </div>
                <button 
                  onClick={() => setEditingRule(rule)} 
                  className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-premium shadow-lg shadow-slate-900/10 active:scale-90"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
              </div>
            </div>
          ))}
          {rules.length === 0 && (
            <div className="col-span-full p-20 text-center text-slate-300 border-2 border-dashed border-slate-100 rounded-[40px] font-bold">
              Brak zdefiniowanych reguł. Kliknij &quot;Dodaj Regułę&quot;, aby zacząć.
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingRule && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setEditingRule(null)}
        >
          <div 
            className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{editingRule.id ? 'Edytuj Regułę' : 'Nowa Reguła'}</h2>
                <p className="text-sm text-slate-400 font-medium">Skonfiguruj parametry wyceny usługi.</p>
              </div>
              <button onClick={() => setEditingRule(null)} className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Kod Przewoźnika</label>
                  <input 
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-inner"
                    value={editingRule.carrierCode}
                    onChange={e => setEditingRule({...editingRule, carrierCode: e.target.value.toUpperCase()})}
                    placeholder="np. DHL"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Nazwa Usługi</label>
                  <input 
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-inner"
                    value={editingRule.serviceName}
                    onChange={e => setEditingRule({...editingRule, serviceName: e.target.value})}
                    placeholder="np. Paleta Standard"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Cena Bazowa (PLN)</label>
                  <div className="relative">
                    <input 
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full pl-6 pr-16 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-inner"
                      value={editingRule.basePrice}
                      onChange={e => setEditingRule({...editingRule, basePrice: e.target.value})}
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">PLN</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Marża (%)</label>
                  <div className="relative">
                    <input 
                      type="number"
                      min="0"
                      className="w-full pl-6 pr-16 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-inner"
                      value={editingRule.marginPercent}
                      onChange={e => setEditingRule({...editingRule, marginPercent: e.target.value})}
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    id="isActive"
                    className="sr-only peer"
                    checked={editingRule.isActive}
                    onChange={e => setEditingRule({...editingRule, isActive: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                </div>
                <label htmlFor="isActive" className="text-sm font-bold text-slate-700 cursor-pointer">Reguła aktywna</label>
              </div>

              <div className="flex gap-6 pt-4">
                <button 
                  type="button"
                  onClick={() => setEditingRule(null)}
                  className="flex-1 px-8 py-5 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-premium"
                >
                  Anuluj
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex-[2] px-8 py-5 rounded-2xl bg-[var(--color-primary)] text-white font-bold shadow-xl shadow-[var(--color-primary)]/20 hover:bg-[var(--color-surface-tint)] transition-premium disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3"
                >
                  {isSaving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                  {isSaving ? 'Zapisywanie...' : 'Zatwierdź Regułę'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
