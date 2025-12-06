'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useFlightFareQuery } from '@/reactQuery/flight.api';
import {
  FaUsers,
  FaCreditCard,
  FaInfoCircle,
  FaArrowRight,
} from 'react-icons/fa';
import { useRouter } from '@/i18n/navigation';
import FlightHeader from './FlightHeader';
import FlightJourney from './FlightJourney';
import OfferSelection from './OfferSelection';
import '@/styles/flight-details-drawer.css';
import '@/styles/offer-selection.css';

interface FlightDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  departureFareKey: string;
  returnFareKey?: string;
  adults: number;
  childrens: number;
  infants: number;
  departureFlightData?: any;
  returnFlightData?: any;
}

const FlightDetails: React.FC<FlightDetailsProps> = ({
  isOpen,
  onClose,
  departureFareKey,
  returnFareKey,
  adults,
  childrens,
  infants,
  departureFlightData,
  returnFlightData,
}) => {
  const t = useTranslations('FlightSearch.details');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [selectedOfferKey, setSelectedOfferKey] = useState<string | undefined>(
    undefined,
  );

  // Determine provider from flight data endpoint immediately
  const provider = useMemo((): 'iati' | 'sabre' => {
    const endpoint =
      departureFlightData?.endpoint || returnFlightData?.endpoint;
    if (endpoint) {
      const providerName = endpoint.toLowerCase();
      if (providerName === 'sabre' || providerName === 'iati') {
        return providerName as 'iati' | 'sabre';
      }
    }
    return 'iati'; // Default to iati if endpoint not found
  }, [departureFlightData?.endpoint, returnFlightData?.endpoint]);

  const { data, isFetching, error } = useFlightFareQuery({
    departureFareKey,
    ...(returnFareKey && { returnFareKey }),
    adults,
    children: childrens,
    infants,
    provider,
  });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Set default selected offer when data loads
  useEffect(() => {
    if (
      data?.data?.offers &&
      data.data.offers.length > 0 &&
      !selectedOfferKey
    ) {
      setSelectedOfferKey(data.data.offers[0].offer_key);
      setSelectedOffer(data.data.offers[0]);
    }
  }, [data?.data?.offers, selectedOfferKey]);

  const formatPrice = (amount: number, currency: string) => {
    if (isRTL) {
      return `${amount.toFixed(2)} ${currency}`;
    }
    return `${currency} ${amount.toFixed(2)}`;
  };

  // Get the selected offer or default price
  const getDisplayPrice = () => {
    if (selectedOfferKey && data?.data?.offers) {
      const selectedOffer = data.data.offers.find(
        (offer) => offer.offer_key === selectedOfferKey,
      );
      if (selectedOffer) {
        return {
          amount: selectedOffer.total_price,
          currency: selectedOffer.currency_code,
        };
      }
    }
    return {
      amount: data?.data?.fare_detail.price_info.total_fare || 0,
      currency: data?.data?.fare_detail.currency_code || '',
    };
  };

  // Get the selected offer's fare breakdown or default fare detail
  const getPriceBreakdown = () => {
    if (selectedOfferKey && data?.data?.offers) {
      const selectedOffer = data.data.offers.find(
        (offer) => offer.offer_key === selectedOfferKey,
      );
      if (selectedOffer && selectedOffer.fares) {
        return {
          pax_fares: selectedOffer.fares,
          currency_code: selectedOffer.currency_code,
          total_fare: selectedOffer.total_price,
        };
      }
    }
    // Fall back to base fare detail
    return {
      pax_fares: data?.data?.fare_detail.pax_fares || [],
      currency_code: data?.data?.fare_detail.currency_code || '',
      total_fare: data?.data?.fare_detail.price_info.total_fare || 0,
    };
  };

  if (!isVisible) return null;
  return (
    <>
      {/* Backdrop */}
      <div
        className={`position-fixed top-0 start-0 w-100 h-100 bg-dark transition-all bg-  ${
          isOpen ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        style={{
          zIndex: 1040,
          backdropFilter: isOpen ? 'blur(4px)' : 'none',
        }}
        onClick={onClose}
      />

      {/* Sliding Panel */}
      <div
        className={`position-fixed top-0 h-100 bg-white d-flex flex-column flight-details-panel ${
          isOpen ? 'slide-in' : 'slide-out'
        }`}
        style={{
          width: '100%',
          maxWidth: '500px',
          zIndex: 1050,
          boxShadow: isRTL
            ? '2px 0 30px rgba(0, 0, 0, 0.12)'
            : '-2px 0 30px rgba(0, 0, 0, 0.12)',
          [isRTL ? 'left' : 'right']: 0,
        }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <FlightHeader
          onClose={onClose}
          adults={adults}
          childrens={childrens}
          infants={infants}
          hasData={!!data?.data}
        />

        {/* Content Area */}
        <div className="flex-grow-1 overflow-hidden bg-light">
          {isFetching ? (
            <div className="d-flex flex-column align-items-center justify-content-center p-5">
              <div className="mb-4">
                <div
                  className="spinner-border text-primary"
                  style={{ width: '3rem', height: '3rem' }}
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
              <h5 className="text-dark mb-2">{t('loading_title')}</h5>
              <p className="text-muted text-center mb-0">{t('loading_desc')}</p>
            </div>
          ) : error ? (
            <div className="d-flex flex-column align-items-center justify-content-center p-5">
              <div
                className="bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mb-4"
                style={{ width: '80px', height: '80px' }}
              >
                <FaInfoCircle className="text-danger" size={32} />
              </div>
              <h5 className="text-danger mb-2">{t('error_title')}</h5>
              <p className="text-muted text-center mb-0">{t('error_desc')}</p>
            </div>
          ) : (
            data?.data && (
              <div className="h-100 overflow-y-auto overflow-x-hidden">
                <div className="p-3">
                  {/* Flight Journey */}
                  <FlightJourney
                    departureFlights={
                      data.data.departure_selected_flights || []
                    }
                    returnFlights={data.data.return_selected_flight}
                    totalFare={data.data.fare_detail.price_info.total_fare}
                    currencyCode={data.data.fare_detail.currency_code}
                  />

                  {/* Passengers & Services */}
                  <div className="card border-0 shadow-sm mb-3">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <FaUsers className="text-success" size={18} />
                        <h5 className="mb-0 fw-bold">
                          {t('passengers_services')}
                        </h5>
                      </div>

                      {/* Passenger Count */}
                      <div className="row g-2 mb-4">
                        {adults > 0 && (
                          <div className="col-auto">
                            <div className="bg-success bg-opacity-10 text-success rounded-3 px-3 py-2 text-center">
                              <div className="h5 fw-bold mb-0">{adults}</div>
                              <div className="small">{t('adults')}</div>
                            </div>
                          </div>
                        )}
                        {childrens > 0 && (
                          <div className="col-auto">
                            <div className="bg-primary bg-opacity-10 text-primary rounded-3 px-3 py-2 text-center">
                              <div className="h5 fw-bold mb-0">{childrens}</div>
                              <div className="small">{t('children')}</div>
                            </div>
                          </div>
                        )}
                        {infants > 0 && (
                          <div className="col-auto">
                            <div className="bg-warning bg-opacity-10 text-warning rounded-3 px-3 py-2 text-center">
                              <div className="h5 fw-bold mb-0">{infants}</div>
                              <div className="small">{t('infants')}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Offer Selection */}
                  {data.data.offers && data.data.offers.length > 0 && (
                    <div className="card border-0 shadow-sm mb-3">
                      <div className="card-body p-4">
                        <OfferSelection
                          offers={data.data.offers}
                          selectedOfferKey={selectedOfferKey}
                          onOfferSelect={(offerKey) => {
                            setSelectedOfferKey(offerKey);
                            setSelectedOffer(
                              data.data.offers.find(
                                (offer) => offer.offer_key === offerKey,
                              ),
                            );
                          }}
                          currency={data.data.fare_detail.currency_code}
                        />
                      </div>
                    </div>
                  )}

                  {/* Price Breakdown */}
                  <div className="card border-0 shadow-sm mb-3">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <FaCreditCard className="text-warning" size={18} />
                        <h5 className="mb-0 fw-bold">{t('price_breakdown')}</h5>
                      </div>

                      {(() => {
                        const priceBreakdown = getPriceBreakdown() as any;
                        return priceBreakdown.pax_fares.map(
                          (fare: any, index: number) => (
                            <div key={index} className="mb-3">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="fw-semibold text-dark">
                                  {fare.pax_type} × {fare.number_of_pax}
                                </span>
                                <span className="h6 fw-bold mb-0">
                                  {formatPrice(
                                    fare.price_info.base_fare,
                                    fare.currency_code,
                                  )}
                                </span>
                              </div>

                              <div
                                className={`ps-3 ${isRTL ? 'pe-3 ps-0' : ''}`}
                              >
                                <div className="d-flex justify-content-between align-items-center">
                                  <span className="small text-muted">
                                    {t('taxes_fees')}
                                  </span>
                                  <span className="small fw-semibold">
                                    {formatPrice(
                                      fare.price_info.tax,
                                      fare.currency_code,
                                    )}
                                  </span>
                                </div>

                                {fare.price_info.service_fee > 0 && (
                                  <div className="d-flex justify-content-between align-items-center">
                                    <span className="small text-muted">
                                      {t('service_fee')}
                                    </span>
                                    <span className="small fw-semibold">
                                      {formatPrice(
                                        fare.price_info.service_fee,
                                        fare.currency_code,
                                      )}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ),
                        );
                      })()}

                      <div className="border-top border-2 border-primary pt-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="h5 fw-bold mb-0 text-dark">
                            {t('total_amount')}
                          </span>
                          <span className="h4 fw-bold text-primary mb-0">
                            {(() => {
                              const priceBreakdown = getPriceBreakdown();
                              return formatPrice(
                                priceBreakdown.total_fare,
                                priceBreakdown.currency_code,
                              );
                            })()}
                          </span>
                        </div>
                      </div>

                      {/* Price Guarantee */}
                      <div className="mt-3">
                        <div className="bg-info bg-opacity-10 rounded-3 p-3">
                          <div className="d-flex align-items-start gap-2">
                            <FaInfoCircle
                              className="text-info mt-1"
                              size={14}
                            />
                            <div className="small text-info">
                              <strong>{t('price_lock')}</strong>{' '}
                              {t('price_lock_desc')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer CTA */}
        {data?.data && !isFetching && (
          <div className="border-top bg-white p-4">
            <button
              className="btn btn-primary btn-lg w-100 rounded-3 d-flex align-items-center justify-content-between shadow-sm"
              onClick={() => {
                let offerKeyParam = '';
                if (selectedOffer && selectedOffer.offer_details) {
                  const departureName =
                    selectedOffer.offer_details[0]?.name || '';
                  const returnName = selectedOffer.offer_details[1]?.name || '';
                  if (returnName) {
                    offerKeyParam = `&offerKey=${departureName}|${returnName}`;
                  } else {
                    offerKeyParam = `&offerKey=${departureName}`;
                  }
                }
                router.push(
                  `/book-flight?departureFareKey=${departureFareKey}${returnFareKey ? `&returnFareKey=${returnFareKey}` : ''}${offerKeyParam}&children=${childrens}&adults=${adults}&infants=${infants}`,
                );
              }}
              disabled={isFetching}
              style={{ height: '60px' }}
            >
              <div className="d-flex align-items-center gap-3">
                <div className={`text-${isRTL ? 'end' : 'start'}`}>
                  <div className="small opacity-90">{t('continue_book')}</div>
                  <div className="fw-bold fs-5">
                    {(() => {
                      const displayPrice = getDisplayPrice();
                      return formatPrice(
                        displayPrice.amount,
                        displayPrice.currency,
                      );
                    })()}
                  </div>
                </div>
              </div>
              <FaArrowRight
                size={16}
                style={{ transform: isRTL ? 'scaleX(-1)' : 'scaleX(1)' }}
              />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default FlightDetails;
