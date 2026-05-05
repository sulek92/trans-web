'use client';

import * as React from 'react';
import { Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useReactHookForm, useWatch } from 'react-hook-form';
import { QuoteSchema, QuoteFormInput } from '@/lib/validators/quote';
import { useRouter, useSearchParams } from 'next/navigation';
import { PalletPreview } from './pallet-preview';

const palletTypes = ['euro', 'semi_euro', 'industrial', 'semi_industrial', 'custom'] as const;

function parsePalletType(value: string | null): QuoteFormInput['palletType'] {
  return palletTypes.includes(value as QuoteFormInput['palletType'])
    ? (value as QuoteFormInput['palletType'])
    : 'euro';
}

export function QuoteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPalletType = parsePalletType(searchParams.get('palletType'));

  const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting } } = useReactHookForm<QuoteFormInput>({
    resolver: zodResolver(QuoteSchema),
    defaultValues: {
      palletType: initialPalletType,
      senderCountry: 'PL',
      recipientCountry: 'PL',
      isStackable: false,
      isFragile: false,
      hasAdr: false,
      senderIsPrivate: false,
      recipientIsPrivate: false,
    }
  });

  React.useEffect(() => {
    const pType = searchParams.get('palletType');
    if (pType) {
      setValue('palletType', parsePalletType(pType));
    }
  }, [searchParams, setValue]);

  const watchedValues = useWatch({ control });

  const onSubmit = async (data: QuoteFormInput) => {
    // Symulacja ładowania dla efektu premium
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    // Przekierowanie po krótkim opóźnieniu
    setTimeout(() => {
      router.push(`/wycena?${params.toString()}`);
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Pallet Type Selector */}
      <div>
        <label className="font-label-sm text-[14px] text-[var(--color-on-surface-variant)] block mb-3 font-medium">Wybierz typ palety</label>
        <Controller
          name="palletType"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => field.onChange('euro')}
                className={`flex flex-col items-center justify-center p-3 border-2 rounded transition-all ${
                  field.value === 'euro' 
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-highlight)] bg-opacity-20' 
                    : 'border-[var(--color-outline-variant)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-offset)]'
                }`}
              >
                <span className={`material-symbols-outlined mb-1 ${field.value === 'euro' ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}`}>pallet</span>
                <span className={`font-data-mono text-[13px] text-center ${field.value === 'euro' ? 'text-[var(--color-primary)] font-medium' : 'text-[var(--color-on-surface-variant)]'}`}>Euro<br/>120x80</span>
              </button>
              
              <button
                type="button"
                onClick={() => field.onChange('semi_euro')}
                className={`flex flex-col items-center justify-center p-3 border rounded transition-all ${
                  field.value === 'semi_euro' 
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-highlight)] border-2 bg-opacity-20' 
                    : 'border-[var(--color-outline-variant)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-offset)]'
                }`}
              >
                <span className={`material-symbols-outlined mb-1 ${field.value === 'semi_euro' ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}`} style={{ fontSize: '20px' }}>pallet</span>
                <span className={`font-data-mono text-[13px] text-center ${field.value === 'semi_euro' ? 'text-[var(--color-primary)] font-medium' : 'text-[var(--color-on-surface-variant)]'}`}>Półpaleta<br/>80x60</span>
              </button>
              
              <button
                type="button"
                onClick={() => field.onChange('industrial')}
                className={`flex flex-col items-center justify-center p-3 border rounded transition-all ${
                  field.value === 'industrial' 
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-highlight)] border-2 bg-opacity-20' 
                    : 'border-[var(--color-outline-variant)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-offset)]'
                }`}
              >
                <span className={`material-symbols-outlined mb-1 ${field.value === 'industrial' ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}`}>pallet</span>
                <span className={`font-data-mono text-[13px] text-center ${field.value === 'industrial' ? 'text-[var(--color-primary)] font-medium' : 'text-[var(--color-on-surface-variant)]'}`}>Przemysł.<br/>120x100</span>
              </button>
              
              <button
                type="button"
                onClick={() => field.onChange('custom')}
                className={`flex flex-col items-center justify-center p-3 border rounded transition-all ${
                  field.value === 'custom' 
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-highlight)] border-2 bg-opacity-20' 
                    : 'border-[var(--color-outline-variant)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-offset)]'
                }`}
              >
                <span className={`material-symbols-outlined mb-1 ${field.value === 'custom' ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}`} style={{ fontSize: '28px' }}>pallet</span>
                <span className={`font-data-mono text-[13px] text-center ${field.value === 'custom' ? 'text-[var(--color-primary)] font-medium' : 'text-[var(--color-on-surface-variant)]'}`}>Niestand.<br/>Inna</span>
              </button>

              <button
                type="button"
                onClick={() => field.onChange('semi_industrial')}
                className={`flex flex-col items-center justify-center p-3 border rounded transition-all ${
                  field.value === 'semi_industrial' 
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-highlight)] border-2 bg-opacity-20' 
                    : 'border-[var(--color-outline-variant)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-offset)]'
                }`}
              >
                <span className={`material-symbols-outlined mb-1 ${field.value === 'semi_industrial' ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}`}>inventory_2</span>
                <span className={`font-data-mono text-[13px] text-center ${field.value === 'semi_industrial' ? 'text-[var(--color-primary)] font-medium' : 'text-[var(--color-on-surface-variant)]'}`}>Półprzem.<br/>120x100</span>
              </button>
            </div>
          )}
        />
        {errors.palletType && <p className="text-[var(--color-error)] text-xs mt-1">{errors.palletType.message}</p>}
      </div>

      {/* Routing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-label-sm text-[14px] text-[var(--color-on-surface-variant)] block mb-1 font-medium">Skąd (Kod pocztowy)</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-outline)]">location_on</span>
            <input 
              {...register('senderPostalCode')}
              className="w-full pl-10 pr-3 py-2 bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded font-data-mono text-[16px] text-[var(--color-on-surface)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" 
              placeholder="00-000" 
              type="text"
            />
          </div>
          {errors.senderPostalCode && <p className="text-[var(--color-error)] text-xs mt-1">{errors.senderPostalCode.message}</p>}
        </div>
        <div>
          <label className="font-label-sm text-[14px] text-[var(--color-on-surface-variant)] block mb-1 font-medium">Dokąd (Kod pocztowy)</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-outline)]">flag</span>
            <input 
              {...register('recipientPostalCode')}
              className="w-full pl-10 pr-3 py-2 bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded font-data-mono text-[16px] text-[var(--color-on-surface)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" 
              placeholder="00-000" 
              type="text"
            />
          </div>
          {errors.recipientPostalCode && <p className="text-[var(--color-error)] text-xs mt-1">{errors.recipientPostalCode.message}</p>}
        </div>
      </div>

      {/* Dimensions */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-label-sm text-[14px] text-[var(--color-on-surface-variant)] block mb-1 font-medium">Waga (kg)</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-outline)]">scale</span>
            <input 
              {...register('weight', { valueAsNumber: true })}
              className="w-full pl-10 pr-3 py-2 bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded font-data-mono text-[16px] text-[var(--color-on-surface)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" 
              placeholder="Np. 500" 
              type="number"
            />
          </div>
          {errors.weight && <p className="text-[var(--color-error)] text-xs mt-1">{errors.weight.message}</p>}
        </div>
        <div>
          <label className="font-label-sm text-[14px] text-[var(--color-on-surface-variant)] block mb-1 font-medium">Wysokość z paletą (cm)</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-outline)]">height</span>
            <input 
              {...register('height', { valueAsNumber: true })}
              className="w-full pl-10 pr-3 py-2 bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded font-data-mono text-[16px] text-[var(--color-on-surface)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" 
              placeholder="Np. 150" 
              type="number"
            />
          </div>
          {errors.height && <p className="text-[var(--color-error)] text-xs mt-1">{errors.height.message}</p>}
        </div>
      </div>

      {/* Live Estimation */}
      {/* Visual Preview */}
      <div className="mb-6">
        <PalletPreview 
          width={Number(watchedValues.width) || 80}
          length={Number(watchedValues.length) || 120}
          height={Number(watchedValues.height) || 100}
          type={watchedValues.palletType || 'euro'}
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6 group hover:bg-white hover:border-[var(--color-primary)] transition-premium">
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Szacowany koszt od</div>
        <div className="text-2xl font-bold text-[var(--color-primary)] font-data-mono">
          {Math.max(120, (Number(watchedValues.weight) || 0) * 0.2 + (Number(watchedValues.height) || 0) * 0.5).toFixed(2).replace('.', ',')} PLN
        </div>
        <div className="text-[10px] text-slate-400 mt-1">Cena netto, zależna od przewoźnika</div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] font-body-medium text-[16px] font-medium py-4 rounded-xl shadow-lg hover:bg-[var(--color-surface-tint)] transition-premium flex justify-center items-center gap-2 mt-2 disabled:opacity-70 active:scale-95"
      >
        <span>{isSubmitting ? 'Przeliczam oferty...' : 'Sprawdź dostępne opcje'}</span>
        {!isSubmitting && <span className="material-symbols-outlined">arrow_forward</span>}
      </button>
    </form>
  );
}
