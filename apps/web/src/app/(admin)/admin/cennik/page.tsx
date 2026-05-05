'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';

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
      console.error('Failed to fetch pricing rules:', err);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  React.useEffect(() => {
    void fetchRules();
  }, [fetchRules]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Reguły Cennika</h1>
          <p className="text-slate-500">Zarządzaj marżami i cenami bazowymi przewoźników.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined">add</span>
          Nowa Reguła
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
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
                  <button className="text-slate-300 hover:text-blue-600 transition-colors">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                </td>
              </tr>
            ))}
            {rules.length === 0 && !isLoading && (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center text-slate-400 italic">
                  Brak zdefiniowanych reguł cennika.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
