'use client';

import * as React from 'react';
import { Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useReactHookForm, useWatch } from 'react-hook-form';
import { QuoteSchema, QuoteFormInput } from '@/lib/validators/quote';
import { useRouter, useSearchParams } from 'next/navigation';
import { PalletPreview } from './pallet-preview';
import { useTranslation } from '@/lib/i18n/i18n-context';

const palletTypes = ['euro', 'semi_euro', 'industrial', 'semi_industrial', 'custom'] as const;
const countries = [
  { value: 'PL', label: 'Polska' },
  { value: 'DE', label: 'Niemcy' },
  { value: 'FR', label: 'Francja' },
  { value: 'IT', label: 'Włochy' },
  { value: 'NL', label: 'Holandia' },
  { value: 'ES', label: 'Hiszpania' },
] as const;

const palletPresets: Record<Exclude<QuoteFormInput['palletType'], 'custom'>, { length: number; width: number }> = {
  euro: { length: 120, width: 80 },
  semi_euro: { length: 80, width: 60 },
  industrial: { length: 120, width: 100 },
  semi_industrial: { length: 120, width: 100 },
};

function parsePalletType(value: string | null): QuoteFormInput['palletType'] {
  return palletTypes.includes(value as QuoteFormInput['palletType'])
    ? (value as QuoteFormInput['palletType'])
    : 'euro';
}

function toNumberOrFallback(value: string | null, fallback: number): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
}

function toBooleanOrFallback(value: string | null, fallback = false): boolean {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
}

function getPresetDimensions(palletType: QuoteFormInput['palletType']) {
  if (palletType === 'custom') return { length: 120, width: 80 };
  return palletPresets[palletType];
}

export function QuoteForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPalletType = parsePalletType(searchParams.get('palletType'));
  const initialPreset = getPresetDimensions(initialPalletType);
  const initialLength = toNumberOrFallback(searchParams.get('length'), initialPreset.length);
  const initialWidth = toNumberOrFallback(searchParams.get('width'), initialPreset.width);
  const initialHeight = toNumberOrFallback(searchParams.get('height'), 150);
  const initialWeight = toNumberOrFallback(searchParams.get('weight'), 350);
  const initialPalletCount = toNumberOrFallback(searchParams.get('palletCount'), 1);

  const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting } } = useReactHookForm<QuoteFormInput>({
    resolver: zodResolver(QuoteSchema),
    defaultValues: {
      palletType: initialPalletType,
      palletCount: initialPalletCount,
      length: initialLength,
      width: initialWidth,
      height: initialHeight,
      weight: initialWeight,
      senderCountry: 'PL',
      recipientCountry: 'PL',
      senderPostalCode: searchParams.get('senderPostalCode') || '',
      recipientPostalCode: searchParams.get('recipientPostalCode') || '',
      isStackable: toBooleanOrFallback(searchParams.get('isStackable')),
      isFragile: toBooleanOrFallback(searchParams.get('isFragile')),
      hasAdr: toBooleanOrFallback(searchParams.get('hasAdr')),
      senderIsPrivate: toBooleanOrFallback(searchParams.get('senderIsPrivate')),
      recipientIsPrivate: toBooleanOrFallback(searchParams.get('recipientIsPrivate')),
    }
  });

  const watchedPalletType = useWatch({ control, name: 'palletType' });
  const watchedLength = useWatch({ control, name: 'length' });
  const watchedWidth = useWatch({ control, name: 'width' });
  React.useEffect(() => {
    const pType = searchParams.get('palletType');
    if (pType) {
      const parsedType = parsePalletType(pType);
      setValue('palletType', parsedType);
      const preset = getPresetDimensions(parsedType);
      if (parsedType !== 'custom') {
        setValue('length', preset.length, { shouldValidate: true });
        setValue('width', preset.width, { shouldValidate: true });
      }
    }
  }, [searchParams, setValue]);

  React.useEffect(() => {
    if (!watchedPalletType || watchedPalletType === 'custom') return;

    const preset = getPresetDimensions(watchedPalletType);
    if (watchedLength !== preset.length) {
      setValue('length', preset.length, { shouldValidate: true });
    }
    if (watchedWidth !== preset.width) {
      setValue('width', preset.width, { shouldValidate: true });
    }
  }, [setValue, watchedLength, watchedPalletType, watchedWidth]);

  const watchedValues = useWatch({ control });

  const onSubmit = async (data: QuoteFormInput) => {
    const params = new URLSearchParams();
    const senderCountry = data.senderCountry ?? 'PL';
    const recipientCountry = data.recipientCountry ?? 'PL';
    const isStackable = data.isStackable ?? false;
    const isFragile = data.isFragile ?? false;
    const hasAdr = data.hasAdr ?? false;
    const senderIsPrivate = data.senderIsPrivate ?? false;
    const recipientIsPrivate = data.recipientIsPrivate ?? false;

    params.set('palletType', data.palletType);
    params.set('palletCount', data.palletCount.toString());
    params.set('senderPostalCode', data.senderPostalCode);
    params.set('senderCountry', senderCountry);
    params.set('recipientPostalCode', data.recipientPostalCode);
    params.set('recipientCountry', recipientCountry);
    params.set('weight', data.weight.toString());
    params.set('length', data.length.toString());
    params.set('width', data.width.toString());
    params.set('height', data.height.toString());
    params.set('isStackable', String(isStackable));
    params.set('isFragile', String(isFragile));
    params.set('hasAdr', String(hasAdr));
    params.set('senderIsPrivate', String(senderIsPrivate));
    params.set('recipientIsPrivate', String(recipientIsPrivate));

    setTimeout(() => {
      router.push(`/wycena?${params.toString()}`);
    }, 200);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
      {/* Pallet Type Selector */}
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-4">{t.quote.selector.label}</label>
        <Controller
          name="palletType"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { id: 'euro', label: t.quote.selector.euro, dim: '120x80', icon: 'pallet' },
                { id: 'semi_euro', label: t.quote.selector.semi_euro, dim: '80x60', icon: 'inventory' },
                { id: 'industrial', label: t.quote.selector.industrial, dim: '120x100', icon: 'pallet' },
                { id: 'semi_industrial', label: t.quote.selector.semi_industrial, dim: '120x100', icon: 'inventory_2' },
                { id: 'custom', label: t.quote.selector.custom, dim: t.quote.selector.customDesc, icon: 'square_foot' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => field.onChange(p.id)}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-[20px] transition-all duration-300 group ${
                    field.value === p.id 
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-inner' 
                      : 'border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white'
                  }`}
                >
                  <span className={`material-symbols-outlined mb-2 transition-transform duration-300 group-hover:scale-110 ${field.value === p.id ? 'text-[var(--color-primary)]' : 'text-slate-400'}`} style={{ fontSize: '24px' }}>{p.icon}</span>
                  <span className={`text-[13px] font-bold text-center ${field.value === p.id ? 'text-[var(--color-primary)]' : 'text-slate-600'}`}>{p.label}</span>
                  <span className={`text-[10px] font-medium uppercase tracking-tight ${field.value === p.id ? 'text-[var(--color-primary)]/60' : 'text-slate-400'}`}>{p.dim}</span>
                </button>
              ))}
            </div>
          )}
        />
        {errors.palletType && <p className="text-[var(--color-error)] text-xs mt-2">{errors.palletType.message}</p>}
      </div>

      {/* Route and country */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-[24px] border border-slate-100 p-6 bg-slate-50/50">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">location_on</span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{t.quote.sender.title}</div>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-2">{t.quote.sender.postalCode}</label>
              <input
                {...register('senderPostalCode')}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-data-mono text-base text-slate-900 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all placeholder:text-slate-300"
                placeholder="00-000"
                type="text"
              />
              {errors.senderPostalCode && <p className="text-[var(--color-error)] text-xs mt-2">{errors.senderPostalCode.message}</p>}
            </div>
            <div className="w-32">
              <label className="text-xs font-bold text-slate-600 block mb-2">{t.quote.sender.country}</label>
              <select
                {...register('senderCountry')}
                className="w-full py-3 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:border-[var(--color-primary)] outline-none cursor-pointer"
              >
                {countries.map((country) => (
                  <option key={country.value} value={country.value}>{country.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-100 p-6 bg-slate-50/50">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">flag</span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{t.quote.recipient.title}</div>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-2">{t.quote.recipient.postalCode}</label>
              <input
                {...register('recipientPostalCode')}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-data-mono text-base text-slate-900 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all placeholder:text-slate-300"
                placeholder="00-000"
                type="text"
              />
              {errors.recipientPostalCode && <p className="text-[var(--color-error)] text-xs mt-2">{errors.recipientPostalCode.message}</p>}
            </div>
            <div className="w-32">
              <label className="text-xs font-bold text-slate-600 block mb-2">{t.quote.recipient.country}</label>
              <select
                {...register('recipientCountry')}
                className="w-full py-3 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:border-[var(--color-primary)] outline-none cursor-pointer"
              >
                {countries.map((country) => (
                  <option key={country.value} value={country.value}>{country.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Routing */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label className="text-xs font-bold text-slate-600 block mb-2">{t.quote.palletCount}</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-lg">inventory_2</span>
            <input
              {...register('palletCount', { valueAsNumber: true })}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-data-mono text-base text-slate-900 focus:bg-white focus:border-[var(--color-primary)] outline-none transition-all"
              placeholder="1"
              type="number"
              min={1}
              max={33}
            />
          </div>
          {errors.palletCount && <p className="text-[var(--color-error)] text-xs mt-2">{errors.palletCount.message}</p>}
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600 block mb-2">{t.quote.weight}</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-lg">scale</span>
            <input
              {...register('weight', { valueAsNumber: true })}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-data-mono text-base text-slate-900 focus:bg-white focus:border-[var(--color-primary)] outline-none transition-all" 
              placeholder="500"
              type="number"
            />
          </div>
          {errors.weight && <p className="text-[var(--color-error)] text-xs mt-2">{errors.weight.message}</p>}
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600 block mb-2">{t.quote.height}</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-lg">height</span>
            <input
              {...register('height', { valueAsNumber: true })}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-data-mono text-base text-slate-900 focus:bg-white focus:border-[var(--color-primary)] outline-none transition-all" 
              placeholder="150"
              type="number"
            />
          </div>
          {errors.height && <p className="text-[var(--color-error)] text-xs mt-2">{errors.height.message}</p>}
        </div>
      </div>

      {/* Dimensions */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold text-slate-600 block mb-2">{t.quote.length}</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-lg">straighten</span>
            <input
              {...register('length', { valueAsNumber: true })}
              className={`w-full pl-12 pr-4 py-3 rounded-xl font-data-mono text-base outline-none transition-all ${
                watchedPalletType === 'custom' 
                  ? 'bg-white border border-slate-200 text-slate-900 focus:border-[var(--color-primary)]' 
                  : 'bg-slate-100 border border-transparent text-slate-400 cursor-not-allowed'
              }`}
              placeholder="120"
              type="number"
              readOnly={watchedPalletType !== 'custom'}
            />
          </div>
          {errors.length && <p className="text-[var(--color-error)] text-xs mt-2">{errors.length.message}</p>}
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600 block mb-2">{t.quote.width}</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-lg">straighten</span>
            <input
              {...register('width', { valueAsNumber: true })}
              className={`w-full pl-12 pr-4 py-3 rounded-xl font-data-mono text-base outline-none transition-all ${
                watchedPalletType === 'custom' 
                  ? 'bg-white border border-slate-200 text-slate-900 focus:border-[var(--color-primary)]' 
                  : 'bg-slate-100 border border-transparent text-slate-400 cursor-not-allowed'
              }`}
              placeholder="80"
              type="number"
              readOnly={watchedPalletType !== 'custom'}
            />
          </div>
          {errors.width && <p className="text-[var(--color-error)] text-xs mt-2">{errors.width.message}</p>}
        </div>
      </div>

      {/* Options */}
      <div className="rounded-[24px] border border-slate-100 p-6 bg-slate-50/30">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-5">{t.quote.conditions.title}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
          {[
            { id: 'isStackable', label: t.quote.conditions.stackable },
            { id: 'isFragile', label: t.quote.conditions.fragile },
            { id: 'hasAdr', label: t.quote.conditions.adr },
            { id: 'senderIsPrivate', label: t.quote.conditions.privateSender },
            { id: 'recipientIsPrivate', label: t.quote.conditions.privateRecipient },
          ].map((opt) => (
            <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                {...register(opt.id as any)} 
                className="w-5 h-5 rounded-lg border-2 border-slate-200 text-[var(--color-primary)] focus:ring-0 cursor-pointer transition-all checked:bg-[var(--color-primary)]" 
              />
              <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Visual Preview */}
      <div className="bg-slate-900 rounded-[32px] p-8 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-transparent opacity-50" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          <div className="flex-shrink-0">
            <PalletPreview 
              width={Number(watchedValues.width) || 80}
              length={Number(watchedValues.length) || 120}
              height={Number(watchedValues.height) || 100}
              type={watchedValues.palletType || 'euro'}
            />
          </div>
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-2">{t.quote.estimatedCost}</div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 font-display-bold whitespace-nowrap">
              {Math.max(
                120,
                (Number(watchedValues.weight) || 0) * (Number(watchedValues.palletCount) || 1) * 0.2 +
                  (Number(watchedValues.height) || 0) * 0.5
              ).toFixed(2).replace('.', ',')} <span className="text-lg sm:text-xl text-white/40">{t.quote.currency}</span>
            </div>
            <p className="text-xs sm:text-sm text-white/40 whitespace-normal break-words max-w-[280px] sm:max-w-none">{t.quote.estimatedCostNote}</p>
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-[var(--color-primary)] text-white font-bold text-lg py-5 rounded-2xl shadow-2xl shadow-[var(--color-primary)]/30 hover:scale-[1.01] transition-premium flex justify-center items-center gap-3 disabled:opacity-70 active:scale-95"
      >
        <span>{isSubmitting ? t.quote.submitting : t.quote.submit}</span>
        {!isSubmitting && <span className="material-symbols-outlined">arrow_forward</span>}
      </button>

    </form>
  );
}
