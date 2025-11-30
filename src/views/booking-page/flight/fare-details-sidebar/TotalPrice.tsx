'use client';
import { useTranslations, useLocale } from 'next-intl';
import { FaCreditCard, FaInfoCircle } from 'react-icons/fa';

interface PaxFare {
  pax_type: string;
  number_of_pax: number;
  price_info: {
    base_fare: number;
    tax: number;
    service_fee: number;
    total_fare: number;
  };
  currency_code: string;
}

interface TotalPriceProps {
  displayPrice: {
    amount: number;
    currency: string;
  };
  formatPrice: (amount: number, currency: string) => string;
  priceBreakdown?: {
    pax_fares: PaxFare[];
    currency_code: string;
    total_fare: number;
  };
}

const TotalPrice: React.FC<TotalPriceProps> = ({
  displayPrice,
  formatPrice,
  priceBreakdown,
}) => {
  const t = useTranslations('BookingPage.booking_sidebar');
  const tDetails = useTranslations('FlightSearch.details');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <>
      <div className="border-top-light mt-30 mb-20" />

      {/* Price Breakdown Card */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-20">
          <div className="d-flex align-items-center gap-10 mb-20">
            <FaCreditCard className="text-warning" size={18} />
            <h5 className="mb-0 fw-600">{tDetails('price_breakdown')}</h5>
          </div>

          {/* Detailed Price Breakdown */}
          {priceBreakdown && priceBreakdown.pax_fares ? (
            <>
              {priceBreakdown.pax_fares.map((fare: PaxFare, index: number) => (
                <div key={index} className="mb-20">
                  <div className="d-flex justify-content-between align-items-center mb-10">
                    <span className="fw-500 text-dark">
                      {fare.pax_type} × {fare.number_of_pax}
                    </span>
                    <span className="text-16 fw-600">
                      {formatPrice(
                        fare.price_info.base_fare,
                        fare.currency_code,
                      )}
                    </span>
                  </div>

                  <div className={`ps-15 ${isRTL ? 'pe-15 ps-0' : ''}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                      <span className="text-14 text-light-1">
                        {tDetails('taxes_fees')}
                      </span>
                      <span className="text-14 fw-500">
                        {formatPrice(fare.price_info.tax, fare.currency_code)}
                      </span>
                    </div>

                    {fare.price_info.service_fee > 0 && (
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-14 text-light-1">
                          {tDetails('service_fee')}
                        </span>
                        <span className="text-14 fw-500">
                          {formatPrice(
                            fare.price_info.service_fee,
                            fare.currency_code,
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Total Amount */}
              <div className="border-top border-2 border-primary pt-15">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-18 fw-600 text-dark">
                    {tDetails('total_amount')}
                  </span>
                  <span className="text-20 fw-700 text-blue-1">
                    {formatPrice(
                      priceBreakdown.total_fare,
                      priceBreakdown.currency_code,
                    )}
                  </span>
                </div>
              </div>

              {/* Price Lock Info */}
              <div className="mt-15">
                <div className="bg-blue-1-05 rounded-4 p-15">
                  <div className="d-flex align-items-start gap-10">
                    <FaInfoCircle className="text-blue-1 mt-2" size={14} />
                    <div className="text-14 text-blue-1">
                      <strong>{tDetails('price_lock')}</strong>{' '}
                      {tDetails('price_lock_desc')}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Simple Total Price Display */
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-18 fw-500">{t('total_price')}:</span>
              <span className="text-20 fw-600 text-blue-1">
                {formatPrice(displayPrice.amount, displayPrice.currency)}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TotalPrice;
