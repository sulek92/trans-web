'use client';

import * as React from 'react';
import Link from 'next/link';
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

interface CennikCmsData {
  title?: string;
  subtitle?: string;
  exchangeRate?: number;
  domesticRates?: { type: string; price: string; icon: string }[];
  internationalRates?: { country: string; price: string; eta: string }[];
}

interface CennikClientProps {
  initialRules: PricingRule[];
  initialCmsData: CennikCmsData | null;
}

export function CennikClient({ initialRules, initialCmsData }: CennikClientProps) {
  const [rules, setRules] = React.useState<PricingRule[]>(initialRules);
  const [cmsData] = React.useState<CennikCmsData | null>(initialCmsData);
  const [isLoading, setIsLoading] = React.useState(initialRules.length === 0);
  const [editingRule, setEditingRule] = React.useState<PricingRule | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const { addToast } = useToastStore();

  React.useEffect(() => {
    if (initialRules.length > 0) {
      setIsLoading(false);
    }
  }, [initialRules]);

  const fetchRules = async () => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/admin/pricing-rules`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setRules(data);
      }
    } catch {
      addToast({ title: 'Błąd', description: 'Nie udało się pobrać reguł cennika.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (!initialRules || initialRules.length === 0) {
      fetchRules();
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;

    setIsSaving(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/admin/pricing-rules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(editingRule)
      });
      if (response.ok) {
        await fetchRules();
        setEditingRule(null);
        addToast({ title: 'Zapisano', description: 'Reguła cennika została zaktualizowana.', type: 'success' });
      }
    } catch {
      addToast({ title: 'Błąd zapisu', description: 'Nie udało się zapisać reguły.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in relative pb-20">
      <div>
        <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-xs mb-3 block">Cennik</span>
        <h1 className="text-4xl font-bold text-[var(--color-on-background)] mb-2 tracking-tight">Zarządzanie Cennikiem</h1>
        <p className="text-[var(--color-text-muted)] text-lg">Stawki wyświetlane użytkownikom oraz reguły silnika wycen.</p>
      </div>

      {/* ===== Static Cennik Preview (what users see on /cennik) ===== */}
      <section className="bg-[var(--color-surface-primary)] p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl">visibility</span>
            <div>
              <h2 className="text-xl font-bold">Stawki wyświetlane na stronie</h2>
              <p className="text-sm text-[var(--color-text-faint)]">To widzą użytkownicy na podstronie /cennik</p>
            </div>
          </div>
          <Link
            href="/admin/cms/pages/edit/cennik"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--color-primary)] text-[var(--color-background)] font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-[var(--color-primary)]/20"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            Edytuj stawki
          </Link>
        </div>

        {cmsData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Domestic Rates */}
            <div className="bg-[var(--color-surface-container)] rounded-2xl p-6 border border-[var(--color-divider)]">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[var(--color-primary)]">flag</span>
                <h3 className="font-bold text-sm uppercase tracking-widest text-[var(--color-text-muted)]">Stawki Krajowe</h3>
              </div>
              <div className="space-y-2">
                {(cmsData.domesticRates || []).map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[var(--color-surface-primary)] rounded-xl border border-[var(--color-divider)]">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[var(--color-text-faint)] text-sm">{r.icon || 'package'}</span>
                      <span className="text-sm font-medium">{r.type}</span>
                    </div>
                    <span className="font-bold text-[var(--color-primary)]">{r.price} PLN</span>
                  </div>
                ))}
                {(!cmsData.domesticRates || cmsData.domesticRates.length === 0) && (
                  <p className="text-sm text-[var(--color-text-faint)] p-3">Brak stawek krajowych</p>
                )}
              </div>
            </div>

            {/* International Rates */}
            <div className="bg-[var(--color-surface-container)] rounded-2xl p-6 border border-[var(--color-divider)]">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[var(--color-primary)]">public</span>
                <h3 className="font-bold text-sm uppercase tracking-widest text-[var(--color-text-muted)]">Stawki Międzynarodowe</h3>
              </div>
              <div className="space-y-2">
                {(cmsData.internationalRates || []).map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[var(--color-surface-primary)] rounded-xl border border-[var(--color-divider)]">
                    <div>
                      <span className="text-sm font-medium">{r.country}</span>
                      <span className="text-xs text-[var(--color-text-faint)] ml-2">{r.eta}</span>
                    </div>
                    <span className="font-bold text-[var(--color-primary)]">{r.price} PLN</span>
                  </div>
                ))}
                {(!cmsData.internationalRates || cmsData.internationalRates.length === 0) && (
                  <p className="text-sm text-[var(--color-text-faint)] p-3">Brak stawek międzynarodowych</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center border-2 border-dashed border-[var(--color-divider)] rounded-2xl">
            <p className="text-[var(--color-text-faint)] text-sm mb-3">Brak danych cennika w CMS.</p>
            <Link href="/admin/cms/pages/edit/cennik" className="text-[var(--color-primary)] font-bold text-sm hover:underline">
              Skonfiguruj stawki cennika
            </Link>
          </div>
        )}
      </section>

      {/* ===== Pricing Rules (Quote Engine) ===== */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl">settings</span>
              <h2 className="text-xl font-bold">Reguły Silnika Wycen</h2>
            </div>
            <p className="text-sm text-[var(--color-text-faint)]">Konfiguruj marże i ceny bazowe dla kalkulatora wycen.</p>
          </div>
          <button
            onClick={() => setEditingRule({ id: '', carrierCode: '', serviceName: '', basePrice: '0', marginPercent: '15', isActive: true })}
            className="bg-[var(--color-primary)] text-[var(--color-background)] px-8 py-4 rounded-2xl font-bold shadow-xl shadow-[var(--color-primary)]/20 hover:bg-[var(--color-surface-tint)] transition-premium flex items-center gap-2 active:scale-95"
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
              <div key={rule.id} className="group bg-[var(--color-surface-primary)] rounded-[40px] border border-[var(--color-divider)] p-8 shadow-sm hover:shadow-2xl transition-premium relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-surface-container)] rounded-bl-[100px] -z-10 group-hover:bg-[var(--color-primary-highlight)] transition-colors opacity-50" />

                <div className="flex justify-between items-start mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-container)] text-[var(--color-primary)] flex items-center justify-center font-bold text-sm uppercase">
                    {rule.carrierCode}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${rule.isActive ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-[var(--color-surface-container-high)] text-[var(--color-text-muted)] border-[var(--color-divider)]'}`}>
                    {rule.isActive ? 'Aktywna' : 'Nieaktywna'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[var(--color-on-background)] mb-1 group-hover:text-[var(--color-primary)] transition-colors">{rule.serviceName}</h3>
                <p className="text-xs text-[var(--color-text-faint)] font-bold uppercase tracking-widest mb-8">{rule.carrierCode} Service</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-[var(--color-surface-container)] p-4 rounded-2xl border border-[var(--color-divider)]">
                    <div className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest mb-1">Cena Bazowa</div>
                    <div className="text-lg font-bold text-[var(--color-on-background)]">{rule.basePrice} <span className="text-[10px] font-normal text-[var(--color-text-faint)]">PLN</span></div>
                  </div>
                  <div className="bg-[var(--color-surface-container)] p-4 rounded-2xl border border-[var(--color-divider)]">
                    <div className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest mb-1">Marża</div>
                    <div className="text-lg font-bold text-[var(--color-primary)]">{rule.marginPercent}%</div>
                  </div>
                </div>

                <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-50">
                  <div className="text-[10px] text-[var(--color-text-faint)] font-medium">
                    Waga: {rule.minWeight || 0} - {rule.maxWeight || 1200} kg
                  </div>
                  <button
                    onClick={() => setEditingRule(rule)}
                    className="p-3 bg-[var(--color-on-background)] text-[var(--color-background)] rounded-xl hover:bg-slate-800 transition-premium shadow-lg shadow-slate-900/10 active:scale-90"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                </div>
              </div>
            ))}
            {rules.length === 0 && !isLoading && (
              <div className="col-span-full p-20 text-center text-[var(--color-text-faint)] border-2 border-dashed border-[var(--color-divider)] rounded-[40px] font-bold">
                Brak zdefiniowanych reguł. Kliknij &quot;Dodaj Regułę&quot;, aby zacząć.
              </div>
            )}
          </div>
        )}
      </section>

      {/* Edit Modal */}
      {editingRule && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--color-on-background)]/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setEditingRule(null)}
        >
          <div
            className="bg-[var(--color-surface-primary)] rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-10 border-b border-[var(--color-divider)] flex justify-between items-center bg-[var(--color-surface-container)]/30">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-on-background)]">{editingRule.id ? 'Edytuj Regułę' : 'Nowa Reguła'}</h2>
                <p className="text-sm text-[var(--color-text-faint)] font-medium">Skonfiguruj parametry wyceny usługi.</p>
              </div>
              <button onClick={() => setEditingRule(null)} className="w-10 h-10 flex items-center justify-center bg-[var(--color-surface-primary)] rounded-full text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)] shadow-sm border border-[var(--color-divider)]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-[var(--color-text-faint)] tracking-widest px-1">Kod Przewoźnika</label>
                  <input
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-[var(--color-surface-container)] border border-[var(--color-divider)] text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-[var(--color-surface-primary)] transition-all shadow-inner"
                    value={editingRule.carrierCode}
                    onChange={e => setEditingRule({...editingRule, carrierCode: e.target.value.toUpperCase()})}
                    placeholder="np. DHL"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-[var(--color-text-faint)] tracking-widest px-1">Nazwa Usługi</label>
                  <input
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-[var(--color-surface-container)] border border-[var(--color-divider)] text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-[var(--color-surface-primary)] transition-all shadow-inner"
                    value={editingRule.serviceName}
                    onChange={e => setEditingRule({...editingRule, serviceName: e.target.value})}
                    placeholder="np. Paleta Standard"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-[var(--color-text-faint)] tracking-widest px-1">Cena Bazowa (PLN)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full pl-6 pr-16 py-4 rounded-2xl bg-[var(--color-surface-container)] border border-[var(--color-divider)] text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-[var(--color-surface-primary)] transition-all shadow-inner"
                      value={editingRule.basePrice}
                      onChange={e => setEditingRule({...editingRule, basePrice: e.target.value})}
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--color-text-faint)]">PLN</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-[var(--color-text-faint)] tracking-widest px-1">Marża (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      className="w-full pl-6 pr-16 py-4 rounded-2xl bg-[var(--color-surface-container)] border border-[var(--color-divider)] text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-[var(--color-surface-primary)] transition-all shadow-inner"
                      value={editingRule.marginPercent}
                      onChange={e => setEditingRule({...editingRule, marginPercent: e.target.value})}
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--color-text-faint)]">%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 bg-[var(--color-surface-container)] rounded-3xl border border-[var(--color-divider)] shadow-inner">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="isActive"
                    className="sr-only peer"
                    checked={editingRule.isActive}
                    onChange={e => setEditingRule({...editingRule, isActive: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--color-surface-primary)] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                </div>
                <label htmlFor="isActive" className="text-sm font-bold text-[var(--color-text-muted)] cursor-pointer">Reguła aktywna</label>
              </div>

              <div className="flex gap-6 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingRule(null)}
                  className="flex-1 px-8 py-5 rounded-2xl font-bold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-container)] transition-premium"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-[2] px-8 py-5 rounded-2xl bg-[var(--color-primary)] text-[var(--color-background)] font-bold shadow-xl shadow-[var(--color-primary)]/20 hover:bg-[var(--color-surface-tint)] transition-premium disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3"
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
