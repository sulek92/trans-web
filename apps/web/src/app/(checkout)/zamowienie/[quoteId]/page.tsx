'use client';

import * as React from 'react';
import { useCheckoutStore, Address } from '@/lib/store/checkout-store';
import { Input } from '@/components/ui/input';
import { useRouter, useParams } from 'next/navigation';
import { useToastStore } from '@/lib/store/toast-store';
import { AddressBookModal } from '@/components/checkout/AddressBookModal';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiBaseUrl } from '@/lib/api-url';

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

  const API_URL = getApiBaseUrl();

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
    <main className="flex-grow pt-12 pb-24 min-h-screen bg-[var(--color-background)] overflow-hidden transition-colors duration-500">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
        {/* Header & Progress Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="font-display font-bold text-4xl sm:text-5xl text-[var(--color-on-background)] mb-3 tracking-tight">Finalizacja zamówienia</h1>
              <p className="text-[var(--color-text-muted)] text-lg font-medium">Uzupełnij dane, aby wygenerować list przewozowy.</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-4 py-2 rounded-full">
              <span className="material-symbols-outlined text-sm">lock</span>
              Bezpieczne połączenie SSL
            </div>
          </div>
          
          <div className="relative mb-12 px-4 sm:px-0">
            <div aria-hidden="true" className="absolute inset-0 flex items-center px-6">
              <div className="w-full border-t-2 border-[var(--color-divider)]"></div>
            </div>
            <div className="relative flex justify-between">
              {STEPS.map((step, idx) => {
                const stepNum = idx + 1;
                const isCompleted = currentStep > stepNum;
                const isActive = currentStep === stepNum;
                
                return (
                  <div key={step} className="flex flex-col items-center">
                    <motion.div 
                      animate={{ 
                        scale: isActive ? 1.1 : 1, 
                        backgroundColor: isCompleted || isActive ? 'var(--color-primary)' : 'var(--color-surface-primary)',
                        borderColor: isCompleted || isActive ? 'var(--color-primary)' : 'var(--color-divider)'
                      }}
                      className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center border-2 ring-8 ring-[var(--color-background)] shadow-xl transition-all z-10`}
                    >
                      {isCompleted ? (
                        <span className="material-symbols-outlined text-[var(--color-on-primary)] text-xl sm:text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                      ) : (
                        <span className={`font-display text-lg font-bold ${isActive ? 'text-[var(--color-on-primary)]' : 'text-[var(--color-text-faint)]'}`}>{stepNum}</span>
                      )}
                    </motion.div>
                    <span className={`mt-4 font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] text-center max-w-[80px] sm:max-w-none ${
                      isCompleted ? 'text-[var(--color-on-background)]' : isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-faint)]'
                    }`}>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Forms */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-10"
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
              className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-16 pt-12 border-t border-[var(--color-divider)]"
            >
              <button 
                onClick={prevStep} 
                disabled={currentStep === 1 || isSubmitting}
                className="w-full sm:w-auto px-10 py-5 border-2 border-[var(--color-divider)] text-[var(--color-text-muted)] font-bold rounded-2xl hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-background)] transition-premium disabled:opacity-30 flex items-center justify-center gap-2 group"
              >
                <span className="material-symbols-outlined text-xl transition-transform group-hover:-translate-x-1">arrow_back</span>
                Wstecz
              </button>
              <button 
                onClick={handleNext}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-12 py-5 bg-[var(--color-primary)] text-white font-bold rounded-2xl shadow-2xl shadow-[var(--color-primary)]/20 hover:bg-[var(--color-surface-tint)] transition-premium flex items-center justify-center gap-2 group disabled:opacity-70 active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Przetwarzanie...
                  </>
                ) : (
                  <>
                    {currentStep === STEPS.length ? 'Finalizuj i zamów' : 'Kontynuuj'}
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
      <div className="bg-[var(--color-surface-primary)] p-10 rounded-[40px] shadow-[var(--shadow-premium)] border border-[var(--color-divider)]">
        <h2 className="text-2xl font-bold text-[var(--color-on-background)] mb-6 tracking-tight">Nie wybrano oferty</h2>
        <Link href="/wycena" className="inline-flex items-center gap-2 text-[var(--color-primary)] font-bold hover:underline">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Wróć do wyceny
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface-primary)] p-8 sm:p-12 rounded-[40px] shadow-[var(--shadow-premium)] border border-[var(--color-divider)] relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
        <span className="material-symbols-outlined text-[120px]">local_shipping</span>
      </div>
      
      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-on-background)] mb-8 tracking-tight">Wybrana oferta przewozu</h2>
      <div className="flex flex-col sm:flex-row sm:items-center gap-8 p-8 bg-[var(--color-surface-container)]/50 rounded-3xl border border-[var(--color-divider)] shadow-inner">
        <div className="w-24 h-24 bg-[var(--color-surface-primary)] border border-[var(--color-divider)] rounded-2xl flex items-center justify-center font-bold text-[var(--color-primary)] text-2xl shadow-premium shrink-0">
          {selectedOffer.carrierCode?.toUpperCase() || 'LOGO'}
        </div>
        <div>
          <div className="text-2xl font-bold text-[var(--color-on-background)] tracking-tight">{selectedOffer.serviceName || selectedOffer.name}</div>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <span className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm font-medium">
              <span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">schedule</span>
              Czas: {selectedOffer.eta}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-divider)]" />
            <span className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm font-medium">
              <span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">task_alt</span>
              Ubezpieczenie w cenie
            </span>
          </div>
        </div>
      </div>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex items-start gap-4 p-5 rounded-2xl bg-[var(--color-surface-container)]/30 border border-[var(--color-divider)]">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-emerald-500 text-xl">verified</span>
          </div>
          <div className="text-sm text-[var(--color-text-muted)] leading-relaxed font-medium">
            Gwarancja bezpiecznego transportu na palecie <span className="text-[var(--color-on-background)] font-bold">EPAL</span>.
          </div>
        </div>
        <div className="flex items-start gap-4 p-5 rounded-2xl bg-[var(--color-surface-container)]/30 border border-[var(--color-divider)]">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-blue-500 text-xl">print</span>
          </div>
          <div className="text-sm text-[var(--color-text-muted)] leading-relaxed font-medium">
            Wymagane wydrukowanie i naklejenie <span className="text-[var(--color-on-background)] font-bold">etykiety transportowej</span>.
          </div>
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
    <div className="bg-[var(--color-surface-primary)] p-8 sm:p-12 rounded-[40px] shadow-[var(--shadow-premium)] border border-[var(--color-divider)]">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-on-background)] tracking-tight">{title}</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold rounded-xl hover:bg-[var(--color-primary)] hover:text-white transition-premium text-sm w-fit"
        >
          <span className="material-symbols-outlined text-[18px]">menu_book</span>
          Książka adresowa
        </button>
      </div>

      <AddressBookModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={handleSelect} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-2">Nazwa firmy / Imię i Nazwisko</label>
          <Input 
            name="name"
            value={data?.name || ''}
            onChange={handleChange}
            placeholder="Np. PaletBroker Sp. z o.o." 
            className="h-14 rounded-2xl bg-[var(--color-surface-container)]/50 border-[var(--color-divider)] focus:border-[var(--color-primary)] font-bold shadow-inner"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-2">Ulica i numer</label>
          <Input 
            name="street"
            value={data?.street || ''}
            onChange={handleChange}
            placeholder="ul. Logistyczna 12" 
            className="h-14 rounded-2xl bg-[var(--color-surface-container)]/50 border-[var(--color-divider)] focus:border-[var(--color-primary)] font-bold shadow-inner"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-2">Kod pocztowy</label>
            <Input 
              name="postalCode"
              value={data?.postalCode || ''}
              onChange={handleChange}
              placeholder="00-000" 
              className="h-14 rounded-2xl bg-[var(--color-surface-container)]/50 border-[var(--color-divider)] focus:border-[var(--color-primary)] font-bold shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-2">Miasto</label>
            <Input 
              name="city"
              value={data?.city || ''}
              onChange={handleChange}
              placeholder="Warszawa" 
              className="h-14 rounded-2xl bg-[var(--color-surface-container)]/50 border-[var(--color-divider)] focus:border-[var(--color-primary)] font-bold shadow-inner"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-2">E-mail do powiadomień</label>
          <Input 
            name="email"
            value={data?.email || ''}
            onChange={handleChange}
            placeholder="kontakt@firma.pl" 
            className="h-14 rounded-2xl bg-[var(--color-surface-container)]/50 border-[var(--color-divider)] focus:border-[var(--color-primary)] font-bold shadow-inner"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-2">Telefon kontaktowy</label>
          <Input 
            name="phone"
            value={data?.phone || ''}
            onChange={handleChange}
            placeholder="+48 000 000 000" 
            className="h-14 rounded-2xl bg-[var(--color-surface-container)]/50 border-[var(--color-divider)] focus:border-[var(--color-primary)] font-bold shadow-inner"
          />
        </div>
      </div>
    </div>
  );
}

function Step4Services() {
  const { additionalServices, setAdditionalServices } = useCheckoutStore();

  return (
    <div className="bg-[var(--color-surface-primary)] p-8 sm:p-12 rounded-[40px] shadow-[var(--shadow-premium)] border border-[var(--color-divider)]">
      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-on-background)] mb-10 flex items-center gap-4 tracking-tight">
        <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">add_task</span>
        Usługi dodatkowe
      </h2>
      
      <div className="grid grid-cols-1 gap-6">
        <div 
          className={`p-6 sm:p-8 rounded-[28px] border-2 transition-all cursor-pointer group ${additionalServices.insurance ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-lg' : 'border-[var(--color-divider)] bg-[var(--color-surface-container)]/30 hover:border-[var(--color-primary)]/30'}`}
          onClick={() => setAdditionalServices({...additionalServices, insurance: !additionalServices.insurance})}
        >
          <div className="flex items-center gap-6">
            <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${additionalServices.insurance ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-[var(--color-divider)] bg-[var(--color-surface-primary)]'}`}>
              {additionalServices.insurance && <span className="material-symbols-outlined text-white text-lg font-bold">check</span>}
            </div>
            <div className="flex-grow">
              <div className="font-bold text-lg text-[var(--color-on-background)] tracking-tight">Dodatkowe ubezpieczenie</div>
              <div className="text-xs text-[var(--color-text-muted)] mt-1 font-medium">Pełna ochrona wartości towaru do zadeklarowanej kwoty.</div>
            </div>
            <div className="text-xl font-display font-bold text-[var(--color-primary)]">+25.00 PLN</div>
          </div>
          {additionalServices.insurance && (
            <div className="mt-8 pl-14" onClick={(e) => e.stopPropagation()}>
              <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest mb-2 block ml-2">Wartość towaru (PLN netto)</label>
              <input 
                type="number" 
                placeholder="Np. 5000" 
                className="w-full bg-[var(--color-surface-primary)] border border-[var(--color-divider)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-on-background)] focus:border-[var(--color-primary)] outline-none transition-all shadow-inner"
                value={additionalServices.insuranceValue || ''}
                onChange={(e) => setAdditionalServices({...additionalServices, insuranceValue: parseFloat(e.target.value) || 0})}
              />
            </div>
          )}
        </div>

        <div 
          className={`p-6 sm:p-8 rounded-[28px] border-2 transition-all cursor-pointer group ${additionalServices.cod ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-lg' : 'border-[var(--color-divider)] bg-[var(--color-surface-container)]/30 hover:border-[var(--color-primary)]/30'}`}
          onClick={() => setAdditionalServices({...additionalServices, cod: !additionalServices.cod})}
        >
          <div className="flex items-center gap-6">
            <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${additionalServices.cod ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-[var(--color-divider)] bg-[var(--color-surface-primary)]'}`}>
              {additionalServices.cod && <span className="material-symbols-outlined text-white text-lg font-bold">check</span>}
            </div>
            <div className="flex-grow">
              <div className="font-bold text-lg text-[var(--color-on-background)] tracking-tight">Przesyłka pobraniowa (COD)</div>
              <div className="text-xs text-[var(--color-text-muted)] mt-1 font-medium">Kurier pobierze gotówkę przy doręczeniu i przekaże na Twoje konto.</div>
            </div>
            <div className="text-xl font-display font-bold text-[var(--color-primary)]">+15.00 PLN</div>
          </div>
          {additionalServices.cod && (
            <div className="mt-8 pl-14" onClick={(e) => e.stopPropagation()}>
              <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest mb-2 block ml-2">Kwota pobrania (PLN)</label>
              <input 
                type="number" 
                placeholder="Np. 1200" 
                className="w-full bg-[var(--color-surface-primary)] border border-[var(--color-divider)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-on-background)] focus:border-[var(--color-primary)] outline-none transition-all shadow-inner"
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
    <div className="bg-[var(--color-surface-primary)] p-8 sm:p-12 rounded-[40px] shadow-[var(--shadow-premium)] border border-[var(--color-divider)]">
      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-on-background)] mb-10 flex items-center gap-4 tracking-tight">
        <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">account_balance_wallet</span>
        Metoda płatności
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="relative cursor-pointer group">
          <input type="radio" name="payment" className="peer sr-only" defaultChecked />
          <div className="p-8 border-2 border-[var(--color-divider)] bg-[var(--color-surface-container)]/30 rounded-[28px] peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary)]/5 transition-all shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="material-symbols-outlined text-3xl text-[var(--color-text-faint)] group-hover:text-[var(--color-primary)] transition-colors">credit_card</span>
              <div className="w-6 h-6 rounded-full border-2 border-[var(--color-divider)] flex items-center justify-center peer-checked:border-[var(--color-primary)]">
                <div className="w-3 h-3 rounded-full bg-transparent peer-checked:bg-[var(--color-primary)] transition-all"></div>
              </div>
            </div>
            <div className="font-bold text-lg text-[var(--color-on-background)] mb-1 tracking-tight">Przelew natychmiastowy</div>
            <div className="text-xs text-[var(--color-text-muted)] font-medium">Blik, Karty, Szybkie przelewy (Stripe)</div>
          </div>
        </label>
        <label className="relative cursor-pointer group">
          <input type="radio" name="payment" className="peer sr-only" />
          <div className="p-8 border-2 border-[var(--color-divider)] bg-[var(--color-surface-container)]/30 rounded-[28px] peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary)]/5 transition-all shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="material-symbols-outlined text-3xl text-[var(--color-text-faint)] group-hover:text-[var(--color-primary)] transition-colors">description</span>
              <div className="w-6 h-6 rounded-full border-2 border-[var(--color-divider)] flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-transparent"></div>
              </div>
            </div>
            <div className="font-bold text-lg text-[var(--color-on-background)] mb-1 tracking-tight">Faktura terminowa</div>
            <div className="text-xs text-[var(--color-text-muted)] font-medium">Dostępne dla stałych klientów B2B</div>
          </div>
        </label>
      </div>
    </div>
  );
}

function Step6Confirmation() {
  return (
    <div className="bg-[var(--color-surface-primary)] p-12 rounded-[40px] border border-[var(--color-divider)] shadow-[var(--shadow-premium)] text-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner relative z-10">
        <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
      </div>
      <h2 className="text-3xl font-bold text-[var(--color-on-background)] mb-4 tracking-tight relative z-10">Dane gotowe do wysyłki!</h2>
      <p className="text-[var(--color-text-muted)] max-w-md mx-auto mb-10 leading-relaxed font-medium relative z-10">Wszystkie pola zostały poprawnie uzupełnione. Potwierdź zamówienie, aby przejść do płatności i wygenerować list przewozowy.</p>
      
      <div className="bg-[var(--color-surface-container)]/50 rounded-2xl p-8 text-left border border-[var(--color-divider)] max-w-sm mx-auto relative z-10 shadow-inner">
         <div className="flex justify-between items-center py-3 border-b border-[var(--color-divider)]">
           <span className="text-[10px] uppercase font-bold text-[var(--color-text-faint)] tracking-widest">Przewoźnik</span>
           <span className="text-sm font-bold text-[var(--color-on-background)]">DHL Freight</span>
         </div>
         <div className="flex justify-between items-center py-3">
           <span className="text-[10px] uppercase font-bold text-[var(--color-text-faint)] tracking-widest">Szacowany czas</span>
           <span className="text-sm font-bold text-[var(--color-on-background)]">1-2 dni robocze</span>
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
    <div className="bg-[var(--color-surface-primary)] rounded-[40px] border border-[var(--color-divider)] shadow-[var(--shadow-premium)] overflow-hidden sticky top-8 transition-all">
      <div className="bg-[var(--color-surface-container)]/80 backdrop-blur-md p-8 border-b border-[var(--color-divider)] flex items-center justify-between">
        <h3 className="font-bold text-xl text-[var(--color-on-background)] tracking-tight">Twoje Zamówienie</h3>
        <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Podsumowanie</span>
      </div>
      
      <div className="p-8 sm:p-10 space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-muted)] font-medium">{selectedOffer?.serviceName || 'Usługa transportowa'}</span>
            <span className="font-bold text-[var(--color-on-background)] tabular-nums">{basePrice.toFixed(2)} PLN</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-muted)] font-medium">Opłata paliwowa (14%)</span>
            <span className="font-bold text-[var(--color-on-background)] tabular-nums">{fuelSurcharge.toFixed(2)} PLN</span>
          </div>
          {additionalServices.insurance && (
            <div className="flex justify-between text-sm text-[var(--color-primary)] font-bold">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                Ubezpieczenie cargo
              </span>
              <span className="tabular-nums">{insurancePrice.toFixed(2)} PLN</span>
            </div>
          )}
          {additionalServices.cod && (
            <div className="flex justify-between text-sm text-[var(--color-primary)] font-bold">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">payments</span>
                Pobranie (COD)
              </span>
              <span className="tabular-nums">{codPrice.toFixed(2)} PLN</span>
            </div>
          )}
        </div>

        <div className="border-t border-[var(--color-divider)] pt-8 space-y-3">
          <div className="flex justify-between text-[var(--color-text-faint)] font-bold text-[10px] uppercase tracking-widest">
            <span>Razem Netto</span>
            <span className="tabular-nums">{totalNetto.toFixed(2)} PLN</span>
          </div>
          <div className="flex justify-between text-[11px] text-[var(--color-text-faint)] font-medium">
            <span>Podatek VAT (23%)</span>
            <span className="tabular-nums">{vat.toFixed(2)} PLN</span>
          </div>
        </div>

        <div className="bg-[var(--color-primary)] rounded-3xl p-8 text-[var(--color-on-primary)] shadow-2xl shadow-[var(--color-primary)]/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-all">
            <span className="material-symbols-outlined text-6xl">payments</span>
          </div>
          <div className="text-[10px] opacity-70 mb-2 uppercase tracking-[0.2em] font-bold">Łącznie do zapłaty</div>
          <div className="text-4xl font-display font-bold tracking-tight tabular-nums">
            {totalBrutto.toFixed(2)} <span className="text-lg font-medium opacity-70 ml-1">PLN</span>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex gap-4 p-5 rounded-2xl bg-[var(--color-surface-container)]/30 border border-[var(--color-divider)]">
            <span className="material-symbols-outlined text-[var(--color-text-faint)]">upload</span>
            <div className="text-xs">
              <div className="font-bold text-[var(--color-on-background)] uppercase tracking-widest mb-1 text-[10px]">Nadawca</div>
              <div className="text-[var(--color-text-muted)] truncate max-w-[150px] font-medium">{sender?.name || '---'}</div>
              <div className="text-[var(--color-text-faint)] font-medium">{sender?.postalCode} {sender?.city}</div>
            </div>
          </div>
          <div className="flex gap-4 p-5 rounded-2xl bg-[var(--color-surface-container)]/30 border border-[var(--color-divider)]">
            <span className="material-symbols-outlined text-[var(--color-text-faint)]">download</span>
            <div className="text-xs">
              <div className="font-bold text-[var(--color-on-background)] uppercase tracking-widest mb-1 text-[10px]">Odbiorca</div>
              <div className="text-[var(--color-text-muted)] truncate max-w-[150px] font-medium">{recipient?.name || '---'}</div>
              <div className="text-[var(--color-text-faint)] font-medium">{recipient?.postalCode} {recipient?.city}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-faint)] font-bold uppercase tracking-widest justify-center mt-6">
           <span className="material-symbols-outlined text-[16px] text-emerald-500">lock</span>
           Bezpieczna płatność SSL
        </div>
      </div>
    </div>
  );
}
