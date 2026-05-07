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
      <h3 className="text-xl font-display font-semibold mb-6">{t.pricing.result.availableOffers}</h3>
      {offers.map((offer) => {
        const isExpanded = expandedOffer === offer.carrierId;
        return (
          <Card key={offer.carrierId} className="overflow-hidden border-2 transition-all hover:border-[var(--color-primary-highlight)]">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="h-12 w-12 rounded-lg bg-[var(--color-surface-offset)] flex items-center justify-center font-bold text-lg uppercase text-[var(--color-on-background)]">
                    {offer.carrierCode}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--color-on-background)]">{offer.serviceName}</h4>
                    <div className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] mt-1">
                      <Truck className="h-4 w-4" />
                      <span>{t.pricing.result.delivery} {offer.eta}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <div className="text-2xl font-bold font-display text-[var(--color-on-background)]">
                      {offer.priceNetto.toFixed(2)} zł <span className="text-sm font-normal text-[var(--color-on-surface-variant)]">{t.pricing.result.netto}</span>
                    </div>
                    <div className="text-sm text-[var(--color-on-surface-variant)]">
                      {offer.priceBrutto.toFixed(2)} {t.pricing.result.brutto}
                    </div>
                  </div>
                  <Button size="lg" onClick={() => onSelect(offer)}>
                    {t.pricing.result.order}
                  </Button>
                </div>
              </div>

              <div className="bg-[var(--color-surface-offset)] border-t border-[var(--color-outline-variant)] px-6 py-2">
                <button 
                  onClick={() => setExpandedOffer(isExpanded ? null : offer.carrierId)}
                  className="flex items-center gap-2 text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-background)] transition-colors w-full"
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {t.pricing.result.details}
                </button>
                
                {isExpanded && (
                  <div className="py-4 space-y-2 text-sm text-[var(--color-on-background)] animate-in slide-in-from-top-2">
                    <div className="flex justify-between">
                      <span>{t.pricing.result.basePrice}</span>
                      <span>{offer.surchargeBreakdown.basePrice.toFixed(2)} zł</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.pricing.result.surcharges}</span>
                      <span>{offer.surchargeBreakdown.surcharges.toFixed(2)} zł</span>
                    </div>
                    <div className="flex justify-between border-t border-[var(--color-outline-variant)] pt-2 mt-2 font-medium">
                      <span>{t.pricing.result.total}</span>
                      <span>{offer.priceNetto.toFixed(2)} zł</span>
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
