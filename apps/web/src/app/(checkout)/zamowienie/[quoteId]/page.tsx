'use client';

import * as React from 'react';
import { useCheckoutStore, Address } from '@/lib/store/checkout-store';
import { Input } from '@/components/ui/input';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

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
  const router = useRouter();
  const params = useParams();
  const quoteId = params.quoteId as string;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const handleNext = async () => {
    if (currentStep === 6) {
      setIsSubmitting(true);
      try {
        const orderData = {
          quoteId: quoteId || storeQuoteId,
          carrierId: selectedOffer?.carrierId,
          sender: {
            ...sender,
            country: 'PL',
          },
          recipient: {
            ...recipient,
            country: 'PL',
          },
          dimensions: {
            length: 120, // To powinno być w store, ale na razie hardcode lub z URL
            width: 80,
            height: 140,
            weight: 350,
          },
          palletType: 'euro',
          items: [
            {
              description: 'Przesyłka paletowa B2B',
              weight: 350,
              dimensions: { length: 120, width: 80, height: 140 },
              quantity: 1,
            }
          ],
          options: additionalServices,
        };

        const res = await fetch(`${API_URL}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });

        if (res.ok) {
          const data = await res.json();
          router.push(`/zamowienie/potwierdzenie?id=${data.id}`);
        } else {
          const err = await res.json();
          alert(`Błąd składania zamówienia: ${err.message || 'Nieznany błąd'}`);
        }
      } catch (err) {
        console.error('Order submission failed:', err);
        alert('Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    nextStep();
  };

  return (
    <main className="flex-grow pt-8 pb-16 min-h-screen bg-[var(--color-background)]">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Header & Progress Bar */}
        <div className="mb-[32px]">
          <h1 className="font-display-bold text-[32px] text-[var(--color-on-background)] mb-8 font-bold">Finalizacja zamówienia</h1>
          
          <div className="relative">
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
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-[var(--color-background)] ${
                      isCompleted ? 'bg-[var(--color-primary)]' : isActive ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-surface-container-highest)]'
                    }`}>
                      {isCompleted ? (
                        <span className="material-symbols-outlined text-[var(--color-on-primary)]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                      ) : (
                        <span className={`font-body-medium text-[16px] font-medium ${isActive ? 'text-[var(--color-on-primary)]' : 'text-[var(--color-on-surface-variant)]'}`}>{stepNum}</span>
                      )}
                    </div>
                    <span className={`mt-2 font-label-sm text-[14px] font-medium ${
                      isCompleted ? 'text-[var(--color-on-background)]' : isActive ? 'text-[var(--color-primary)] font-bold' : 'text-[var(--color-on-surface-variant)]'
                    }`}>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px] items-start">
          {/* Left Column: Forms */}
          <div className="lg:col-span-8 space-y-6">
            {currentStep === 1 && <Step1Offer />}
            {currentStep === 2 && <StepSender title="Dane Nadawcy" type="sender" />}
            {currentStep === 3 && <StepSender title="Dane Odbiorcy" type="recipient" />}
            {currentStep === 4 && <Step4Services />}
            {currentStep === 5 && <Step5Payment />}
            {currentStep === 6 && <Step6Confirmation />}

            <div className="flex justify-between items-center mt-12 pt-8 border-t border-[var(--color-divider)]">
              <button 
                onClick={prevStep} 
                disabled={currentStep === 1 || isSubmitting}
                className="px-8 py-3 border border-[var(--color-outline)] text-[var(--color-on-surface-variant)] font-body-medium text-[16px] font-medium rounded hover:bg-[var(--color-surface-container-low)] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Wstecz
              </button>
              <button 
                onClick={handleNext}
                disabled={isSubmitting}
                className="px-10 py-3 bg-[var(--color-primary)] text-[var(--color-on-primary)] font-body-medium text-[16px] font-medium rounded shadow-md hover:bg-[var(--color-surface-tint)] transition-all flex items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin material-symbols-outlined text-sm">sync</span>
                    Przetwarzanie...
                  </>
                ) : (
                  <>
                    {currentStep === STEPS.length ? 'Zapłać i zamów' : 'Kontynuuj'}
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-4 sticky top-24">
            <OrderSummary />
          </div>
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
  const data = type === 'sender' ? sender : recipient;
  const setter = type === 'sender' ? setSender : setRecipient;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setter({ ...data, [name]: value } as Address);
  };

  return (
    <div className="bg-[var(--color-surface-primary)] p-8 rounded-xl shadow-sm border border-[var(--color-divider)]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-h2-medium text-[24px] font-bold text-[var(--color-on-background)]">{title}</h2>
        <button className="text-[var(--color-primary)] font-medium flex items-center gap-2 hover:underline text-sm">
          <span className="material-symbols-outlined text-sm">menu_book</span>
          Książka adresowa
        </button>
      </div>

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
    <div className="bg-[var(--color-surface-primary)] p-8 rounded-xl shadow-sm border border-[var(--color-divider)]">
      <h2 className="font-h2-medium text-[24px] font-bold text-[var(--color-on-background)] mb-8">Usługi dodatkowe</h2>
      
      <div className="space-y-6">
        <div className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${additionalServices.insurance ? 'border-[var(--color-primary)] bg-[var(--color-primary-highlight)] bg-opacity-10' : 'border-[var(--color-divider)]'}`}
             onClick={() => setAdditionalServices({...additionalServices, insurance: !additionalServices.insurance})}>
          <div className="flex items-center gap-4">
            <div className={`w-6 h-6 rounded border flex items-center justify-center ${additionalServices.insurance ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-[var(--color-outline)]'}`}>
              {additionalServices.insurance && <span className="material-symbols-outlined text-white text-xs">check</span>}
            </div>
            <div className="flex-grow">
              <div className="font-bold text-[var(--color-on-background)]">Dodatkowe ubezpieczenie przesyłki</div>
              <div className="text-sm text-[var(--color-on-surface-variant)] mt-1">Ochrona towaru do pełnej wartości faktury netto.</div>
            </div>
            <div className="font-bold text-[var(--color-primary)]">+25.00 PLN</div>
          </div>
          {additionalServices.insurance && (
            <div className="mt-4 pl-10">
              <Input label="Wartość towaru (PLN)" type="number" placeholder="Np. 5000" />
            </div>
          )}
        </div>

        <div className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${additionalServices.cod ? 'border-[var(--color-primary)] bg-[var(--color-primary-highlight)] bg-opacity-10' : 'border-[var(--color-divider)]'}`}
             onClick={() => setAdditionalServices({...additionalServices, cod: !additionalServices.cod})}>
          <div className="flex items-center gap-4">
            <div className={`w-6 h-6 rounded border flex items-center justify-center ${additionalServices.cod ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-[var(--color-outline)]'}`}>
              {additionalServices.cod && <span className="material-symbols-outlined text-white text-xs">check</span>}
            </div>
            <div className="flex-grow">
              <div className="font-bold text-[var(--color-on-background)]">Przesyłka pobraniowa (COD)</div>
              <div className="text-sm text-[var(--color-on-surface-variant)] mt-1">Kurier pobierze gotówkę przy doręczeniu.</div>
            </div>
            <div className="font-bold text-[var(--color-primary)]">+15.00 PLN</div>
          </div>
          {additionalServices.cod && (
            <div className="mt-4 pl-10">
              <Input label="Kwota pobrania (PLN)" type="number" placeholder="Np. 1200" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Step5Payment() {
  return (
    <div className="bg-[var(--color-surface-primary)] p-8 rounded-xl shadow-sm border border-[var(--color-divider)]">
      <h2 className="font-h2-medium text-[24px] font-bold text-[var(--color-on-background)] mb-8">Metoda płatności</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="relative cursor-pointer group">
          <input type="radio" name="payment" className="peer sr-only" defaultChecked />
          <div className="p-6 border-2 border-[var(--color-divider)] rounded-lg peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary-highlight)] bg-opacity-5 transition-all group-hover:bg-[var(--color-surface-container-low)]">
            <div className="font-bold mb-1">Przelew natychmiastowy</div>
            <div className="text-xs text-[var(--color-on-surface-variant)]">Blik, Karty, Szybkie przelewy</div>
          </div>
        </label>
        <label className="relative cursor-pointer group">
          <input type="radio" name="payment" className="peer sr-only" />
          <div className="p-6 border-2 border-[var(--color-divider)] rounded-lg peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary-highlight)] bg-opacity-5 transition-all group-hover:bg-[var(--color-surface-container-low)]">
            <div className="font-bold mb-1">Faktura z odroczonym terminem</div>
            <div className="text-xs text-[var(--color-on-surface-variant)]">Tylko dla stałych klientów B2B</div>
          </div>
        </label>
      </div>
    </div>
  );
}

function Step6Confirmation() {
  return (
    <div className="bg-[var(--color-surface-primary)] p-12 rounded-xl shadow-md border border-[var(--color-divider)] text-center">
      <div className="w-20 h-20 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
      </div>
      <h2 className="text-3xl font-bold text-[var(--color-on-background)] mb-4">Wszystko gotowe!</h2>
      <p className="text-[var(--color-on-surface-variant)] max-w-md mx-auto mb-8">Twoje dane zostały poprawnie uzupełnione. Po kliknięciu w przycisk poniżej zostaniesz przekierowany do bramki płatności.</p>
      <div className="flex flex-col gap-3 max-w-sm mx-auto">
        <div className="flex justify-between py-2 border-b border-[var(--color-divider)]">
          <span className="text-sm text-[var(--color-on-surface-variant)]">Nr Wyceny</span>
          <span className="font-bold text-sm">#Q-2024-8832</span>
        </div>
        <div className="flex justify-between py-2 border-b border-[var(--color-divider)]">
          <span className="text-sm text-[var(--color-on-surface-variant)]">Przewoźnik</span>
          <span className="font-bold text-sm">DHL Freight</span>
        </div>
      </div>
    </div>
  );
}

function OrderSummary() {
  const { sender, recipient, additionalServices, selectedOffer } = useCheckoutStore();

  const basePrice = selectedOffer?.priceNetto || selectedOffer?.price || 185;
  const fuelSurcharge = basePrice * 0.14;
  const insurancePrice = additionalServices.insurance ? 25 : 0;
  const codPrice = additionalServices.cod ? 15 : 0;
  
  const totalNetto = basePrice + fuelSurcharge + insurancePrice + codPrice;
  const vat = totalNetto * 0.23;
  const totalBrutto = totalNetto + vat;

  return (
    <div className="bg-[var(--color-surface-container-low)] rounded-xl shadow-lg border border-[var(--color-divider)] overflow-hidden">
      <div className="bg-white p-5 border-b border-[var(--color-divider)] flex items-center justify-between">
        <h3 className="font-h2-medium text-[20px] font-bold text-[var(--color-on-background)]">Podsumowanie</h3>
        <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">Netto</span>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-on-surface-variant)]">{selectedOffer?.serviceName || 'Przewóz Standard'}</span>
            <span className="font-bold">{basePrice.toFixed(2)} PLN</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-on-surface-variant)]">Opłata paliwowa (14%)</span>
            <span className="font-bold">{fuelSurcharge.toFixed(2)} PLN</span>
          </div>
          {additionalServices.insurance && (
            <div className="flex justify-between text-sm text-[var(--color-primary)] font-medium">
              <span>Ubezpieczenie cargo</span>
              <span>{insurancePrice.toFixed(2)} PLN</span>
            </div>
          )}
          {additionalServices.cod && (
            <div className="flex justify-between text-sm text-[var(--color-primary)] font-medium">
              <span>Pobranie (COD)</span>
              <span>{codPrice.toFixed(2)} PLN</span>
            </div>
          )}
        </div>

        <div className="border-t border-divider pt-4 space-y-2">
          <div className="flex justify-between text-[var(--color-on-background)] font-bold text-xl">
            <span>Razem Netto</span>
            <span>{totalNetto.toFixed(2)} PLN</span>
          </div>
          <div className="flex justify-between text-xs text-[var(--color-on-surface-variant)]">
            <span>Podatek VAT (23%)</span>
            <span>{vat.toFixed(2)} PLN</span>
          </div>
        </div>

        <div className="bg-[var(--color-primary)] rounded-lg p-5 text-white shadow-inner">
          <div className="text-xs opacity-80 mb-1 uppercase tracking-widest font-bold">Do zapłaty Brutto</div>
          <div className="text-4xl font-bold">
            {totalBrutto.toFixed(2)} <span className="text-lg">PLN</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[var(--color-divider)] space-y-4 shadow-sm">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-slate-400">upload</span>
            <div className="text-xs">
              <div className="font-bold text-[var(--color-on-background)]">Nadawca</div>
              <div className="text-[var(--color-on-surface-variant)] mt-1">{sender?.name || 'Nie podano'}</div>
              <div className="text-[var(--color-on-surface-variant)]">{sender?.postalCode} {sender?.city}</div>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-slate-400">download</span>
            <div className="text-xs">
              <div className="font-bold text-[var(--color-on-background)]">Odbiorca</div>
              <div className="text-[var(--color-on-surface-variant)] mt-1">{recipient?.name || 'Nie podano'}</div>
              <div className="text-[var(--color-on-surface-variant)]">{recipient?.postalCode} {recipient?.city}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
