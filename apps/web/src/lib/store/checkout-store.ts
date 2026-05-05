import { create } from 'zustand';

export interface Address {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
}

export interface CarrierOffer {
  id?: string;
  name?: string;
  service?: string;
  price?: number;
  logo?: string;
  carrierId?: string;
  carrierCode?: string;
  serviceName?: string;
  priceNetto?: number;
  priceBrutto?: number;
  eta?: string;
  availableAdditionalServices?: string[];
}

interface AdditionalServices {
  insurance: boolean;
  insuranceValue?: number;
  cod: boolean;
  codValue?: number;
}

interface CheckoutState {
  currentStep: number;
  quoteId: string | null;
  selectedOffer: CarrierOffer | null;
  sender: Address | null;
  recipient: Address | null;
  additionalServices: AdditionalServices;
  pickupDate: string | null;
  
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setQuoteId: (id: string) => void;
  setSelectedOffer: (offer: CarrierOffer | null) => void;
  setSender: (sender: Address) => void;
  setRecipient: (recipient: Address) => void;
  setAdditionalServices: (services: AdditionalServices) => void;
  setPickupDate: (date: string) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 1,
  quoteId: null,
  selectedOffer: null,
  sender: null,
  recipient: null,
  additionalServices: { insurance: false, cod: false },
  pickupDate: null,
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
  ...initialState,
  
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  
  setQuoteId: (quoteId) => set({ quoteId }),
  setSelectedOffer: (selectedOffer) => set({ selectedOffer }),
  setSender: (sender) => set({ sender }),
  setRecipient: (recipient) => set({ recipient }),
  setAdditionalServices: (additionalServices) => set({ additionalServices }),
  setPickupDate: (pickupDate) => set({ pickupDate }),
  
  reset: () => set(initialState),
}));
