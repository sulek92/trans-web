import * as React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronDown, ChevronUp, Truck } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/i18n-context';

export interface CarrierOffer {
  carrierId: string;
  carrierCode: string;
  serviceName: string;
  priceNetto: number;
  priceBrutto: number;
  surchargeBreakdown: {
    basePrice: number;
    margin: number;
    surcharges: number;
  };
  eta: string;
}

interface PriceResultProps {
  offers: CarrierOffer[];
  onSelect: (offer: CarrierOffer) => void;
}

export function PriceResult({ offers, onSelect }: PriceResultProps) {
  const { t } = useTranslation();
  const [expandedOffer, setExpandedOffer] = React.useState<string | null>(null);

  if (offers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-xl font-display font-bold text-[var(--color-on-background)] mb-6 text-left">{t.pricing.result.availableOffers}</h3>
      {offers.map((offer) => {
        const isExpanded = expandedOffer === offer.carrierId;
        return (
          <Card key={offer.carrierId} className="overflow-hidden border border-[var(--color-divider)] bg-[var(--color-surface-primary)] transition-all hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-premium-hover)]">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="h-16 w-16 rounded-2xl bg-[var(--color-surface-container)] flex items-center justify-center font-display font-black text-2xl uppercase text-[var(--color-primary)] shadow-inner border border-[var(--color-divider)]">
                    {offer.carrierCode}
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-lg text-[var(--color-on-background)]">{offer.serviceName}</h4>
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mt-1">
                      <Truck className="h-4 w-4" />
                      <span>{t.pricing.result.delivery} {offer.eta}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <div className="text-3xl font-bold font-display text-[var(--color-primary)] tracking-tight">
                      {offer.priceNetto.toFixed(2)} zł <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-faint)] ml-1">{t.pricing.result.netto}</span>
                    </div>
                    <div className="text-sm font-medium text-[var(--color-text-muted)] mt-0.5">
                      {offer.priceBrutto.toFixed(2)} {t.pricing.result.brutto}
                    </div>
                  </div>
                  <Button 
                    size="lg" 
                    onClick={() => onSelect(offer)}
                    className="bg-[var(--color-on-background)] text-[var(--color-background)] hover:bg-[var(--color-primary)] hover:text-white rounded-xl px-8 h-12 font-bold transition-premium active:scale-95"
                  >
                    {t.pricing.result.order}
                  </Button>
                </div>
              </div>

              <div className="bg-[var(--color-surface-container)]/50 border-t border-[var(--color-divider)] px-6 py-3">
                <button 
                  onClick={() => setExpandedOffer(isExpanded ? null : offer.carrierId)}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-faint)] hover:text-[var(--color-primary)] transition-colors w-full"
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {t.pricing.result.details}
                </button>
                
                {isExpanded && (
                  <div className="py-6 space-y-3 text-sm text-[var(--color-on-background)] animate-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between items-center px-4 py-2 bg-[var(--color-surface-primary)] rounded-xl border border-[var(--color-divider)]/30">
                      <span className="text-[var(--color-text-muted)] font-medium">{t.pricing.result.basePrice}</span>
                      <span className="font-bold">{offer.surchargeBreakdown.basePrice.toFixed(2)} zł</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-2 bg-[var(--color-surface-primary)] rounded-xl border border-[var(--color-divider)]/30">
                      <span className="text-[var(--color-text-muted)] font-medium">{t.pricing.result.surcharges}</span>
                      <span className="font-bold">{offer.surchargeBreakdown.surcharges.toFixed(2)} zł</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-4 mt-4 border-t-2 border-dashed border-[var(--color-divider)] font-bold text-lg">
                      <span className="text-[var(--color-on-background)]">{t.pricing.result.total}</span>
                      <span className="text-[var(--color-primary)]">{offer.priceNetto.toFixed(2)} zł</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
