'use client';

import * as React from 'react';
import { Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useReactHookForm, useWatch } from 'react-hook-form';
import { QuoteSchema, QuoteFormInput } from '@/lib/validators/quote';
import { useRouter, useSearchParams } from 'next/navigation';
import { PalletPreview } from './pallet-preview';
import { useTranslation } from '@/lib/i18n/i18n-context';
import { cn } from '@/lib/utils';

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

  // Helper for Polish postal code formatting
  const formatPostalCode = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}`;
    }
    return cleaned;
  };

  // 1. Calculate Volumetric Weight (L*W*H / 4000)
  const volWeight = (Number(watchedValues.length) * Number(watchedValues.width) * Number(watchedValues.height)) / 4000;
  const actWeight = Number(watchedValues.weight) || 0;
  const chargeableWeight = Math.max(actWeight, volWeight);
  const isNonStandard = chargeableWeight > 1200 || Number(watchedValues.length) > 300 || Number(watchedValues.width) > 300 || Number(watchedValues.height) > 250 || watchedValues.palletType === 'custom';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
      {/* Pallet Type Selector */}
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-faint)] block mb-4">{t.quote.selector.label}</label>
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
                      : 'border-[var(--color-divider)] bg-[var(--color-surface-container)] hover:border-[var(--color-primary)]/20 hover:bg-[var(--color-surface-primary)]'
                  }`}
                >
                  <span className={`material-symbols-outlined mb-2 transition-transform duration-300 group-hover:scale-110 ${field.value === p.id ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-faint)]'}`} style={{ fontSize: '24px' }}>{p.icon}</span>
                  <span className={`text-[13px] font-bold text-center ${field.value === p.id ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-background)]'}`}>{p.label}</span>
                  <span className={`text-[10px] font-medium uppercase tracking-tight ${field.value === p.id ? 'text-[var(--color-primary)]/60' : 'text-[var(--color-text-faint)]'}`}>{p.dim}</span>
                </button>
              ))}
            </div>
          )}
        />
        {errors.palletType && <p className="text-[var(--color-error)] text-xs mt-2">{errors.palletType.message}</p>}
      </div>

      {/* Route and country */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-[24px] border border-[var(--color-divider)] p-6 bg-[var(--color-surface-container)]/50">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">location_on</span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-faint)]">{t.quote.sender.title}</div>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <div className="flex-1">
              <label className="text-xs font-bold text-[var(--color-text-muted)] block mb-2">{t.quote.sender.postalCode}</label>
              <div className="relative group">
                <input
                  {...register('senderPostalCode', {
                    onChange: (e) => {
                      if (watchedValues.senderCountry === 'PL') {
                        e.target.value = formatPostalCode(e.target.value);
                      }
                    }
                  })}
                  className={cn(
                    "w-full px-4 py-3 bg-[var(--color-surface-primary)] border border-[var(--color-divider)] rounded-xl font-mono text-base text-[var(--color-on-background)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all placeholder:text-[var(--color-text-faint)]",
                    errors.senderPostalCode && "border-[var(--color-error)] focus:ring-[var(--color-error)]/10"
                  )}
                  placeholder="00-000"
                  type="text"
                  maxLength={watchedValues.senderCountry === 'PL' ? 6 : 10}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[var(--color-text-faint)] group-focus-within:text-[var(--color-primary)] transition-colors">PL</span>
              </div>
              {errors.senderPostalCode && <p className="text-[var(--color-error)] text-[10px] font-bold mt-1.5 ml-1 animate-in fade-in slide-in-from-left-1">{errors.senderPostalCode.message}</p>}
            </div>
            <div className="w-32">
              <label className="text-xs font-bold text-[var(--color-text-muted)] block mb-2">{t.quote.sender.country}</label>
              <div className="relative">
                <select
                  {...register('senderCountry')}
                  className="w-full py-3 pl-4 pr-10 bg-[var(--color-surface-primary)] border border-[var(--color-divider)] rounded-xl text-sm font-bold text-[var(--color-on-background)] focus:border-[var(--color-primary)] outline-none cursor-pointer appearance-none"
                >
                  {countries.map((country) => (
                    <option key={country.value} value={country.value}>{country.label}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-[var(--color-divider)] p-6 bg-[var(--color-surface-container)]/50">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">flag</span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-faint)]">{t.quote.recipient.title}</div>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <div className="flex-1">
              <label className="text-xs font-bold text-[var(--color-text-muted)] block mb-2">{t.quote.recipient.postalCode}</label>
              <div className="relative group">
                <input
                  {...register('recipientPostalCode', {
                    onChange: (e) => {
                      if (watchedValues.recipientCountry === 'PL') {
                        e.target.value = formatPostalCode(e.target.value);
                      }
                    }
                  })}
                  className={cn(
                    "w-full px-4 py-3 bg-[var(--color-surface-primary)] border border-[var(--color-divider)] rounded-xl font-mono text-base text-[var(--color-on-background)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all placeholder:text-[var(--color-text-faint)]",
                    errors.recipientPostalCode && "border-[var(--color-error)] focus:ring-[var(--color-error)]/10"
                  )}
                  placeholder="00-000"
                  type="text"
                  maxLength={watchedValues.recipientCountry === 'PL' ? 6 : 10}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[var(--color-text-faint)] group-focus-within:text-[var(--color-primary)] transition-colors">PL</span>
              </div>
              {errors.recipientPostalCode && <p className="text-[var(--color-error)] text-[10px] font-bold mt-1.5 ml-1 animate-in fade-in slide-in-from-left-1">{errors.recipientPostalCode.message}</p>}
            </div>
            <div className="w-32">
              <label className="text-xs font-bold text-[var(--color-text-muted)] block mb-2">{t.quote.recipient.country}</label>
              <div className="relative">
                <select
                  {...register('recipientCountry')}
                  className="w-full py-3 pl-4 pr-10 bg-[var(--color-surface-primary)] border border-[var(--color-divider)] rounded-xl text-sm font-bold text-[var(--color-on-background)] focus:border-[var(--color-primary)] outline-none cursor-pointer appearance-none"
                >
                  {countries.map((country) => (
                    <option key={country.value} value={country.value}>{country.label}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Routing */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label className="text-xs font-bold text-[var(--color-text-muted)] block mb-2">{t.quote.palletCount}</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] text-lg group-focus-within:text-[var(--color-primary)] transition-colors">inventory_2</span>
            <input
              {...register('palletCount', { valueAsNumber: true })}
              className={cn(
                "w-full pl-12 pr-12 py-3 bg-[var(--color-surface-container)] border border-[var(--color-divider)] rounded-xl font-mono text-base text-[var(--color-on-background)] focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-all",
                errors.palletCount && "border-[var(--color-error)]"
              )}
              placeholder="1"
              type="number"
              min={1}
              max={33}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[var(--color-text-faint)]">szt.</span>
          </div>
          {errors.palletCount && <p className="text-[var(--color-error)] text-[10px] font-bold mt-1.5 ml-1">{errors.palletCount.message}</p>}
        </div>
        <div>
          <label className="text-xs font-bold text-[var(--color-text-muted)] block mb-2">{t.quote.weight}</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] text-lg group-focus-within:text-[var(--color-primary)] transition-colors">scale</span>
            <input
              {...register('weight', { valueAsNumber: true })}
              className={cn(
                "w-full pl-12 pr-12 py-3 bg-[var(--color-surface-container)] border border-[var(--color-divider)] rounded-xl font-mono text-base text-[var(--color-on-background)] focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-all",
                errors.weight && "border-[var(--color-error)]"
              )} 
              placeholder="350"
              type="number"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[var(--color-text-faint)]">kg</span>
          </div>
          {errors.weight && <p className="text-[var(--color-error)] text-[10px] font-bold mt-1.5 ml-1">{errors.weight.message}</p>}
        </div>
        <div>
          <label className="text-xs font-bold text-[var(--color-text-muted)] block mb-2">{t.quote.height}</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] text-lg group-focus-within:text-[var(--color-primary)] transition-colors">height</span>
            <input
              {...register('height', { valueAsNumber: true })}
              className={cn(
                "w-full pl-12 pr-12 py-3 bg-[var(--color-surface-container)] border border-[var(--color-divider)] rounded-xl font-mono text-base text-[var(--color-on-background)] focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-all",
                errors.height && "border-[var(--color-error)]"
              )} 
              placeholder="140"
              type="number"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[var(--color-text-faint)]">cm</span>
          </div>
          {errors.height && <p className="text-[var(--color-error)] text-[10px] font-bold mt-1.5 ml-1">{errors.height.message}</p>}
        </div>
      </div>

      {/* Dimensions */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold text-[var(--color-text-muted)] block mb-2">{t.quote.length}</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] text-lg group-focus-within:text-[var(--color-primary)] transition-colors">straighten</span>
            <input
              {...register('length', { valueAsNumber: true })}
              className={cn(
                "w-full pl-12 pr-12 py-3 rounded-xl font-mono text-base outline-none transition-all",
                watchedPalletType === 'custom' 
                  ? 'bg-[var(--color-surface-primary)] border border-[var(--color-divider)] text-[var(--color-on-background)] focus:border-[var(--color-primary)]' 
                  : 'bg-[var(--color-surface-container)] border border-transparent text-[var(--color-text-faint)] cursor-not-allowed',
                errors.length && "border-[var(--color-error)]"
              )}
              placeholder="120"
              type="number"
              readOnly={watchedPalletType !== 'custom'}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[var(--color-text-faint)]">cm</span>
          </div>
          {errors.length && <p className="text-[var(--color-error)] text-[10px] font-bold mt-1.5 ml-1">{errors.length.message}</p>}
        </div>
        <div>
          <label className="text-xs font-bold text-[var(--color-text-muted)] block mb-2">{t.quote.width}</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] text-lg group-focus-within:text-[var(--color-primary)] transition-colors">straighten</span>
            <input
              {...register('width', { valueAsNumber: true })}
              className={cn(
                "w-full pl-12 pr-12 py-3 rounded-xl font-mono text-base outline-none transition-all",
                watchedPalletType === 'custom' 
                  ? 'bg-[var(--color-surface-primary)] border border-[var(--color-divider)] text-[var(--color-on-background)] focus:border-[var(--color-primary)]' 
                  : 'bg-[var(--color-surface-container)] border border-transparent text-[var(--color-text-faint)] cursor-not-allowed',
                errors.width && "border-[var(--color-error)]"
              )}
              placeholder="80"
              type="number"
              readOnly={watchedPalletType !== 'custom'}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[var(--color-text-faint)]">cm</span>
          </div>
          {errors.width && <p className="text-[var(--color-error)] text-[10px] font-bold mt-1.5 ml-1">{errors.width.message}</p>}
        </div>
      </div>

      {/* Options */}
      <div className="rounded-[24px] border border-[var(--color-divider)] p-6 bg-[var(--color-surface-container)]/30">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-faint)] mb-5">{t.quote.conditions.title}</div>
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
                className="w-5 h-5 rounded-lg border-2 border-[var(--color-divider)] text-[var(--color-primary)] focus:ring-0 cursor-pointer transition-all checked:bg-[var(--color-primary)]" 
              />
              <span className="text-sm font-medium text-[var(--color-text-muted)] group-hover:text-[var(--color-on-background)] transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Visual Preview */}
      <div className="bg-[var(--color-secondary)] rounded-[32px] p-8 overflow-hidden relative group border border-white/5 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 to-transparent opacity-50" />
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
            <div className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-[0.2em] mb-2">{t.quote.estimatedCost}</div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-on-secondary)] mb-3 tracking-tighter whitespace-nowrap">
              {isNonStandard ? (
                <span className="text-2xl sm:text-3xl">Wycena indywidualna</span>
              ) : (
                <>
                  {Math.max(
                    120,
                    chargeableWeight * (Number(watchedValues.palletCount) || 1) * 0.2 +
                      (Number(watchedValues.height) || 0) * 0.5
                  ).toFixed(2).replace('.', ',')} <span className="text-lg sm:text-xl opacity-40">{t.quote.currency}</span>
                </>
              )}
            </div>
            <p className="text-xs sm:text-sm opacity-50 whitespace-normal break-words max-w-[280px] sm:max-w-none font-medium">
              {isNonStandard 
                ? "Parametry wykraczają poza standard. Po przejściu dalej będziesz mógł wysłać zapytanie o wycenę indywidualną."
                : t.quote.estimatedCostNote}
            </p>
            {volWeight > actWeight && !isNonStandard && (
              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-primary)] bg-white/10 w-fit px-2 py-1 rounded-full border border-white/10">
                <span className="material-symbols-outlined text-[12px]">info</span>
                <span>Wycena na podstawie wagi gabarytowej: {volWeight.toFixed(0)}kg</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-[var(--color-primary)] text-white font-bold text-lg py-5 rounded-2xl shadow-2xl shadow-[var(--color-primary)]/30 hover:shadow-[var(--color-primary)]/50 transition-premium flex justify-center items-center gap-3 disabled:opacity-70 active:scale-95"
      >
        <span>{isSubmitting ? t.quote.submitting : t.quote.submit}</span>
        {!isSubmitting && <span className="material-symbols-outlined">arrow_forward</span>}
      </button>

    </form>
  );
}
