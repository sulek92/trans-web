'use client';

import * as React from 'react';
import { useCheckoutStore, Address } from '@/lib/store/checkout-store';
import { Input } from '@/components/ui/input';
import { useRouter, useParams } from 'next/navigation';
import { useToastStore } from '@/lib/store/toast-store';
import { AddressBookModal } from '@/components/checkout/AddressBookModal';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  'Oferta',
  'Nadawca',
  'Odbiorca',
  'Usługi',
  'Płatność',
  'Potwierdzenie'
];

export default function CheckoutWizard() {
  const { currentStep, nextStep, prevStep, sender, recipient, selectedOffer, additionalServices, quoteId: storeQuoteId } = useCheckoutStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const addToast = useToastStore(state => state.addToast);
  const router = useRouter();
  const params = useParams();
  const quoteId = params.quoteId as string;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const validateStep = () => {
    if (currentStep === 2) {
      if (!sender?.name || !sender?.street || !sender?.city || !sender?.postalCode) {
        addToast({ title: 'Błąd walidacji', description: 'Proszę uzupełnić wszystkie dane nadawcy.', type: 'error' });
        return false;
      }
    }
    if (currentStep === 3) {
      if (!recipient?.name || !recipient?.street || !recipient?.city || !recipient?.postalCode) {
        addToast({ title: 'Błąd walidacji', description: 'Proszę uzupełnić wszystkie dane odbiorcy.', type: 'error' });
        return false;
      }
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    if (currentStep === 6) {
      setIsSubmitting(true);
      try {
        const orderData = {
          quoteId: quoteId || storeQuoteId,
          carrierId: selectedOffer?.carrierId,
          sender: { ...sender, country: 'PL' },
          recipient: { ...recipient, country: 'PL' },
          dimensions: { length: 120, width: 80, height: 140, weight: 350 },
          palletType: 'euro',
          items: [{ description: 'Przesyłka paletowa B2B', weight: 350, dimensions: { length: 120, width: 80, height: 140 }, quantity: 1 }],
          options: additionalServices,
        };

        const res = await fetch(`${API_URL}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });

        if (res.ok) {
          const data = await res.json();
          addToast({ title: 'Sukces', description: 'Zamówienie zostało złożone pomyślnie.', type: 'success' });
          router.push(`/zamowienie/sukces?orderId=${data.orderId}`);
        } else {
          const err = await res.json();
          addToast({ title: 'Błąd', description: err.message || 'Nie udało się złożyć zamówienia.', type: 'error' });
        }
      } catch (err) {
        addToast({ title: 'Błąd', description: 'Wystąpił problem z połączeniem.', type: 'error' });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    nextStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="flex-grow pt-8 pb-16 min-h-screen bg-[var(--color-background)] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Header & Progress Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-[32px]"
        >
          <h1 className="font-display-bold text-4xl text-[var(--color-on-background)] mb-10 font-bold tracking-tight">Finalizacja zamówienia</h1>
          
          <div className="relative mb-12">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-divider)]"></div>
            </div>
            <div className="relative flex justify-between">
              {STEPS.map((step, idx) => {
                const stepNum = idx + 1;
                const isCompleted = currentStep > stepNum;
                const isActive = currentStep === stepNum;
                
                return (
                  <div key={step} className="flex flex-col items-center">
                    <motion.div 
                      animate={{ scale: isActive ? 1.1 : 1, backgroundColor: isCompleted || isActive ? 'var(--color-primary)' : 'var(--color-surface-container-highest)' }}
                      className={`h-12 w-12 rounded-full flex items-center justify-center ring-8 ring-[var(--color-background)] shadow-sm transition-all`}
                    >
                      {isCompleted ? (
                        <span className="material-symbols-outlined text-[var(--color-on-primary)]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                      ) : (
                        <span className={`font-body-medium text-[16px] font-bold ${isActive ? 'text-[var(--color-on-primary)]' : 'text-[var(--color-on-surface-variant)]'}`}>{stepNum}</span>
                      )}
                    </motion.div>
                    <span className={`mt-3 font-bold text-xs uppercase tracking-widest ${
                      isCompleted ? 'text-[var(--color-on-background)]' : isActive ? 'text-[var(--color-primary)]' : 'text-slate-300'
                    }`}>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px] items-start">
          {/* Left Column: Forms */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {currentStep === 1 && <Step1Offer />}
                {currentStep === 2 && <StepSender title="Dane Nadawcy" type="sender" />}
                {currentStep === 3 && <StepSender title="Dane Odbiorcy" type="recipient" />}
                {currentStep === 4 && <Step4Services />}
                {currentStep === 5 && <Step5Payment />}
                {currentStep === 6 && <Step6Confirmation />}
              </motion.div>
            </AnimatePresence>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-between items-center mt-12 pt-10 border-t border-[var(--color-divider)]"
            >
              <button 
                onClick={prevStep} 
                disabled={currentStep === 1 || isSubmitting}
                className="px-10 py-4 border-2 border-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-premium disabled:opacity-30 flex items-center gap-2 group"
              >
                <span className="material-symbols-outlined text-xl transition-transform group-hover:-translate-x-1">arrow_back</span>
                Wstecz
              </button>
              <button 
                onClick={handleNext}
                disabled={isSubmitting}
                className="px-12 py-4 bg-[var(--color-primary)] text-white font-bold rounded-2xl shadow-xl shadow-[var(--color-primary-highlight)] hover:bg-[var(--color-surface-tint)] transition-premium flex items-center gap-2 group disabled:opacity-70 active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Przetwarzanie...
                  </>
                ) : (
                  <>
                    {currentStep === STEPS.length ? 'Finalizuj i zamów' : 'Dalej'}
                    <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </>
                )}
              </button>
            </motion.div>
          </div>

          {/* Right Column: Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-4 sticky top-24"
          >
            <OrderSummary />
          </motion.div>
        </div>
      </div>
    </main>
  );
}

function Step1Offer() {
  const { selectedOffer } = useCheckoutStore();

  if (!selectedOffer) {
    return (
      <div className="bg-[var(--color-surface-primary)] p-8 rounded-xl shadow-sm border border-[var(--color-divider)]">
        <h2 className="font-h2-medium text-[24px] font-bold text-[var(--color-on-background)] mb-6">Nie wybrano oferty</h2>
        <Link href="/wycena" className="text-[var(--color-primary)] font-bold underline">Wróć do wyceny</Link>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface-primary)] p-8 rounded-xl shadow-sm border border-[var(--color-divider)]">
      <h2 className="font-h2-medium text-[24px] font-bold text-[var(--color-on-background)] mb-6">Wybrana oferta przewozu</h2>
      <div className="flex items-center gap-6 p-6 bg-[var(--color-surface-container-low)] rounded-lg border border-[var(--color-outline-variant)]">
        <div className="w-20 h-20 bg-white border border-[var(--color-divider)] rounded flex items-center justify-center font-bold text-teal-800 text-xl shadow-sm">
          {selectedOffer.carrierCode?.toUpperCase() || 'LOGO'}
        </div>
        <div>
          <div className="text-xl font-bold text-[var(--color-on-background)]">{selectedOffer.serviceName || selectedOffer.name}</div>
          <div className="text-[var(--color-on-surface-variant)] mt-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">schedule</span>
            Przewidywany czas: {selectedOffer.eta}
          </div>
        </div>
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex items-start gap-3 text-sm text-[var(--color-on-surface-variant)]">
          <span className="material-symbols-outlined text-teal-600">verified</span>
          <div>Gwarancja bezpiecznego transportu na palecie EPAL.</div>
        </div>
        <div className="flex items-start gap-3 text-sm text-[var(--color-on-surface-variant)]">
          <span className="material-symbols-outlined text-teal-600">print</span>
          <div>Wymagane wydrukowanie i naklejenie etykiety transportowej.</div>
        </div>
      </div>
    </div>
  );
}

function StepSender({ title, type }: { title: string, type: 'sender' | 'recipient' }) {
  const { sender, recipient, setSender, setRecipient } = useCheckoutStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const data = type === 'sender' ? sender : recipient;
  const setter = type === 'sender' ? setSender : setRecipient;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setter({ ...data, [name]: value } as Address);
  };

  const handleSelect = (savedAddr: any) => {
    setter({
      name: savedAddr.name,
      street: savedAddr.street,
      city: savedAddr.city,
      postalCode: savedAddr.postalCode,
      phone: savedAddr.phone,
      email: savedAddr.email,
    } as Address);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-[var(--color-surface-primary)] p-8 rounded-xl shadow-sm border border-[var(--color-divider)]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-h2-medium text-[24px] font-bold text-[var(--color-on-background)]">{title}</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="text-[var(--color-primary)] font-medium flex items-center gap-2 hover:underline text-sm"
        >
          <span className="material-symbols-outlined text-sm">menu_book</span>
          Książka adresowa
        </button>
      </div>

      <AddressBookModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={handleSelect} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input 
            label="Nazwa firmy / Imię i Nazwisko" 
            name="name"
            value={data?.name || ''}
            onChange={handleChange}
            placeholder="Np. PaletBroker Sp. z o.o." 
          />
        </div>
        <Input 
          label="Ulica i numer" 
          name="street"
          value={data?.street || ''}
          onChange={handleChange}
          placeholder="ul. Logistyczna 12" 
        />
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Kod pocztowy" 
            name="postalCode"
            value={data?.postalCode || ''}
            onChange={handleChange}
            placeholder="00-000" 
          />
          <Input 
            label="Miasto" 
            name="city"
            value={data?.city || ''}
            onChange={handleChange}
            placeholder="Warszawa" 
          />
        </div>
        <Input 
          label="E-mail" 
          name="email"
          value={data?.email || ''}
          onChange={handleChange}
          placeholder="kontakt@firma.pl" 
        />
        <Input 
          label="Telefon" 
          name="phone"
          value={data?.phone || ''}
          onChange={handleChange}
          placeholder="+48 000 000 000" 
        />
      </div>
    </div>
  );
}

function Step4Services() {
  const { additionalServices, setAdditionalServices } = useCheckoutStore();

  return (
    <div className="bg-white p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm">
      <h2 className="text-2xl font-bold text-[var(--color-on-background)] mb-8 flex items-center gap-3">
        <span className="material-symbols-outlined text-[var(--color-primary)]">add_task</span>
        Usługi dodatkowe
      </h2>
      
      <div className="grid grid-cols-1 gap-6">
        <div className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${additionalServices.insurance ? 'border-[var(--color-primary)] bg-[var(--color-primary-highlight)] bg-opacity-5' : 'border-[var(--color-divider)] hover:border-slate-300'}`}
             onClick={() => setAdditionalServices({...additionalServices, insurance: !additionalServices.insurance})}>
          <div className="flex items-center gap-4">
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${additionalServices.insurance ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-slate-300'}`}>
              {additionalServices.insurance && <span className="material-symbols-outlined text-white text-xs font-bold">check</span>}
            </div>
            <div className="flex-grow">
              <div className="font-bold text-[var(--color-on-background)]">Dodatkowe ubezpieczenie</div>
              <div className="text-xs text-[var(--color-on-surface-variant)] mt-1 font-medium">Ochrona towaru do pełnej wartości faktury netto.</div>
            </div>
            <div className="text-lg font-bold text-[var(--color-primary)]">+25.00 PLN</div>
          </div>
          {additionalServices.insurance && (
            <div className="mt-6 pl-10" onClick={(e) => e.stopPropagation()}>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Wartość towaru (PLN)</label>
              <input 
                type="number" 
                placeholder="Np. 5000" 
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[var(--color-primary)] outline-none transition-all shadow-sm"
                value={additionalServices.insuranceValue || ''}
                onChange={(e) => setAdditionalServices({...additionalServices, insuranceValue: parseFloat(e.target.value) || 0})}
              />
            </div>
          )}
        </div>

        <div className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${additionalServices.cod ? 'border-[var(--color-primary)] bg-[var(--color-primary-highlight)] bg-opacity-5' : 'border-[var(--color-divider)] hover:border-slate-300'}`}
             onClick={() => setAdditionalServices({...additionalServices, cod: !additionalServices.cod})}>
          <div className="flex items-center gap-4">
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${additionalServices.cod ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-slate-300'}`}>
              {additionalServices.cod && <span className="material-symbols-outlined text-white text-xs font-bold">check</span>}
            </div>
            <div className="flex-grow">
              <div className="font-bold text-[var(--color-on-background)]">Przesyłka pobraniowa (COD)</div>
              <div className="text-xs text-[var(--color-on-surface-variant)] mt-1 font-medium">Kurier pobierze gotówkę przy doręczeniu.</div>
            </div>
            <div className="text-lg font-bold text-[var(--color-primary)]">+15.00 PLN</div>
          </div>
          {additionalServices.cod && (
            <div className="mt-6 pl-10" onClick={(e) => e.stopPropagation()}>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Kwota pobrania (PLN)</label>
              <input 
                type="number" 
                placeholder="Np. 1200" 
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[var(--color-primary)] outline-none transition-all shadow-sm"
                value={additionalServices.codValue || ''}
                onChange={(e) => setAdditionalServices({...additionalServices, codValue: parseFloat(e.target.value) || 0})}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Step5Payment() {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm">
      <h2 className="text-2xl font-bold text-[var(--color-on-background)] mb-8 flex items-center gap-3">
        <span className="material-symbols-outlined text-[var(--color-primary)]">account_balance_wallet</span>
        Metoda płatności
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="relative cursor-pointer group">
          <input type="radio" name="payment" className="peer sr-only" defaultChecked />
          <div className="p-6 border-2 border-[var(--color-divider)] rounded-2xl peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary-highlight)] bg-opacity-5 transition-all group-hover:bg-slate-50">
            <div className="font-bold text-[var(--color-on-background)] mb-1">Przelew natychmiastowy</div>
            <div className="text-xs text-[var(--color-on-surface-variant)]">Blik, Karty, Szybkie przelewy (Stripe)</div>
          </div>
        </label>
        <label className="relative cursor-pointer group">
          <input type="radio" name="payment" className="peer sr-only" />
          <div className="p-6 border-2 border-[var(--color-divider)] rounded-2xl peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary-highlight)] bg-opacity-5 transition-all group-hover:bg-slate-50">
            <div className="font-bold text-[var(--color-on-background)] mb-1">Faktura terminowa</div>
            <div className="text-xs text-[var(--color-on-surface-variant)]">Dostępne dla stałych klientów B2B</div>
          </div>
        </label>
      </div>
    </div>
  );
}

function Step6Confirmation() {
  return (
    <div className="bg-white p-12 rounded-[40px] border border-[var(--color-divider)] shadow-sm text-center">
      <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
        <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
      </div>
      <h2 className="text-3xl font-bold text-[var(--color-on-background)] mb-4 tracking-tight">Dane gotowe do wysyłki!</h2>
      <p className="text-[var(--color-on-surface-variant)] max-w-md mx-auto mb-10 leading-relaxed font-medium">Wszystkie pola zostały poprawnie uzupełnione. Potwierdź zamówienie, aby przejść do płatności i wygenerować list przewozowy.</p>
      
      <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-100 max-w-sm mx-auto">
         <div className="flex justify-between items-center py-2 border-b border-slate-200">
           <span className="text-[10px] uppercase font-bold text-slate-400">Przewoźnik</span>
           <span className="text-xs font-bold text-slate-800">DHL Freight</span>
         </div>
         <div className="flex justify-between items-center py-2">
           <span className="text-[10px] uppercase font-bold text-slate-400">Szacowany czas</span>
           <span className="text-xs font-bold text-slate-800">1-2 dni robocze</span>
         </div>
      </div>
    </div>
  );
}
function OrderSummary() {
  const { additionalServices, selectedOffer, sender, recipient } = useCheckoutStore();

  const basePrice = selectedOffer?.priceNetto || selectedOffer?.price || 185;
  const fuelSurchargePercent = 0.14; 
  const fuelSurcharge = basePrice * fuelSurchargePercent;
  const insurancePrice = additionalServices.insurance ? 25 : 0;
  const codPrice = additionalServices.cod ? 15 : 0;
  
  const totalNetto = basePrice + fuelSurcharge + insurancePrice + codPrice;
  const vat = totalNetto * 0.23;
  const totalBrutto = totalNetto + vat;

  return (
    <div className="bg-white rounded-[32px] border border-[var(--color-divider)] shadow-xl overflow-hidden sticky top-8">
      <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-lg text-slate-800">Twoje Zamówienie</h3>
        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Podsumowanie</span>
      </div>
      
      <div className="p-8 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 font-medium">{selectedOffer?.serviceName || 'Usługa transportowa'}</span>
            <span className="font-bold text-slate-900">{basePrice.toFixed(2)} PLN</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 font-medium">Opłata paliwowa (14%)</span>
            <span className="font-bold text-slate-900">{fuelSurcharge.toFixed(2)} PLN</span>
          </div>
          {additionalServices.insurance && (
            <div className="flex justify-between text-sm text-[var(--color-primary)] font-bold">
              <span>Ubezpieczenie cargo</span>
              <span>{insurancePrice.toFixed(2)} PLN</span>
            </div>
          )}
          {additionalServices.cod && (
            <div className="flex justify-between text-sm text-[var(--color-primary)] font-bold">
              <span>Pobranie (COD)</span>
              <span>{codPrice.toFixed(2)} PLN</span>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 pt-6 space-y-2">
          <div className="flex justify-between text-slate-400 font-bold text-xs uppercase tracking-widest">
            <span>Razem Netto</span>
            <span>{totalNetto.toFixed(2)} PLN</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span>Podatek VAT (23%)</span>
            <span>{vat.toFixed(2)} PLN</span>
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-all">
            <span className="material-symbols-outlined text-6xl">payments</span>
          </div>
          <div className="text-[10px] opacity-60 mb-2 uppercase tracking-[0.2em] font-bold">Łącznie do zapłaty</div>
          <div className="text-4xl font-bold tracking-tight">
            {totalBrutto.toFixed(2)} <span className="text-lg font-medium opacity-60 ml-1">PLN</span>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="material-symbols-outlined text-slate-300">upload</span>
            <div className="text-xs">
              <div className="font-bold text-slate-800 uppercase tracking-tighter mb-1">Nadawca</div>
              <div className="text-slate-600 truncate max-w-[150px]">{sender?.name || '---'}</div>
              <div className="text-slate-400">{sender?.postalCode} {sender?.city}</div>
            </div>
          </div>
          <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="material-symbols-outlined text-slate-300">download</span>
            <div className="text-xs">
              <div className="font-bold text-slate-800 uppercase tracking-tighter mb-1">Odbiorca</div>
              <div className="text-slate-600 truncate max-w-[150px]">{recipient?.name || '---'}</div>
              <div className="text-slate-400">{recipient?.postalCode} {recipient?.city}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest justify-center mt-4">
           <span className="material-symbols-outlined text-sm text-emerald-500">verified_user</span>
           Bezpieczna płatność SSL
        </div>
      </div>
    </div>
  );
}
