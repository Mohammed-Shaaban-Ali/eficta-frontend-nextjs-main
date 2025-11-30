'use client';
import { useTranslations, useLocale } from 'next-intl';
import { FaCheck, FaPlus, FaStar, FaAward } from 'react-icons/fa';

interface Service {
  service_id: string;
  service_type: string;
  description: string;
  chargeable_type: string;
  offer_legs: any[];
  supplier_code: string;
  service_name?: string;
}

interface OfferSelectionProps {
  offers: any[];
  selectedOffer: any;
  onOfferSelect: (offer: any) => void;
  formatPrice: (amount: number, currency: string) => string;
}

const OfferSelection: React.FC<OfferSelectionProps> = ({
  offers,
  selectedOffer,
  onOfferSelect,
  formatPrice,
}) => {
  const tOffers = useTranslations('FlightSearch.offers');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // Get cheapest price for comparison
  const getCheapestPrice = () => {
    if (offers.length > 0) {
      return Math.min(...offers.map((offer) => offer.total_price));
    }
    return 0;
  };

  const getOfferBadge = (offer: any, index: number) => {
    const cheapestPrice = getCheapestPrice();

    if (index === 1 && offers.length === 3) {
      return {
        text: tOffers('most_popular'),
        icon: <FaStar size={12} />,
        className: 'bg-warning text-dark',
      };
    }
    if (offer.total_price === cheapestPrice) {
      return {
        text: tOffers('best_value'),
        icon: <FaAward size={12} />,
        className: 'bg-success text-white',
      };
    }
    return null;
  };

  if (offers.length === 0) return null;

  return (
    <>
      <div className="border-top-light mt-30 mb-20" />
      <div className="text-18 fw-500 mb-15">{tOffers('fare_options')}</div>

      <div className="row g-15">
        {offers.map((offer, index) => {
          const isSelected =
            selectedOffer?.offer_details?.[0]?.name ===
            offer.offer_details?.[0]?.name;
          const badge = getOfferBadge(offer, index);
          const priceDifference = offer.total_price - getCheapestPrice();

          return (
            <div
              key={offer.offer_details?.[0]?.name || offer.offer_key}
              className="col-12"
            >
              <div
                className={`card border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary bg-primary bg-opacity-10'
                    : 'border-light hover-border-primary'
                }`}
                onClick={() => onOfferSelect(offer)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-body p-15">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center justify-content-between gap-10 mb-10">
                        <div className="fw-600 text-16">
                          {offer.offer_details?.[0]?.name ||
                            tOffers('fare_option')}
                        </div>
                        {badge && (
                          <span className={`badge ${badge.className}`}>
                            {badge.icon}
                            {badge.text}
                          </span>
                        )}
                      </div>
                      <div className="text-start">
                        <div className="text-18 fw-600 text-primary">
                          {formatPrice(offer.total_price, offer.currency_code)}
                        </div>
                        {isSelected && (
                          <div className="text-12 text-success mt-5">
                            <FaCheck size={10} className="me-5" />
                            {tOffers('selected')}
                          </div>
                        )}
                      </div>
                      {/* Services */}
                      {offer.services && offer.services.length > 0 && (
                        <div className="d-flex flex-wrap gap-10 mb-10">
                          {offer.services
                            .slice(0, 3)
                            .map((service: Service, sIndex: number) => (
                              <div
                                key={sIndex}
                                className="d-flex align-items-center gap-5"
                              >
                                {service.chargeable_type ===
                                'INCLUDED_IN_PRICE' ? (
                                  <FaCheck className="text-success" size={10} />
                                ) : (
                                  <FaPlus className="text-warning" size={10} />
                                )}
                                <span className="text-12 text-light-1">
                                  {service.description}
                                </span>
                              </div>
                            ))}
                        </div>
                      )}

                      {priceDifference > 0 && (
                        <div className="text-12 text-primary">
                          +{formatPrice(priceDifference, offer.currency_code)}{' '}
                          {tOffers('vs_cheapest')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default OfferSelection;
