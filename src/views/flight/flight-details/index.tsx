'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useFlightFareQuery } from '@/reactQuery/flight.api';
import {
  FaUsers,
  FaCreditCard,
  FaInfoCircle,
  FaArrowRight,
  FaCheck,
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
  const [selectedDepartureOffer, setSelectedDepartureOffer] = useState<
    string | null
  >(null);
  const [showReturnOffers, setShowReturnOffers] = useState(false);

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

  // Set default selection when offers are empty
  useEffect(() => {
    if (
      data?.data &&
      (!data.data.offers || data.data.offers.length === 0) &&
      data.data.fare_detail
    ) {
      // Auto-select default offer when no offers available
      setSelectedDepartureOffer('default');
      if (returnFareKey) {
        setShowReturnOffers(true);
        setSelectedOfferKey('default');
      }
    }
  }, [data?.data, returnFareKey]);

  // Reset when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedDepartureOffer(null);
      setShowReturnOffers(false);
      setSelectedOfferKey(undefined);
      setSelectedOffer(null);
    }
  }, [isOpen]);

  const formatPrice = (amount: number | undefined | null, currency: string) => {
    const safeAmount = amount ?? 0;
    if (isRTL) {
      return `${safeAmount.toFixed(2)} ${currency}`;
    }
    return `${currency} ${safeAmount.toFixed(2)}`;
  };

  // Get the selected offer or default price
  const getDisplayPrice = () => {
    // If default offer is selected (no offers available)
    if (
      selectedDepartureOffer === 'default' &&
      (!data?.data?.offers || data?.data?.offers.length === 0) &&
      data?.data?.fare_detail
    ) {
      return {
        amount: data.data.fare_detail.price_info.total_fare || 0,
        currency: data.data.fare_detail.currency_code || '',
      };
    }

    // If return is selected, show total price
    // Must search by both departure and return to get the correct offer
    if (selectedOfferKey && selectedDepartureOffer && data?.data?.offers) {
      const selectedOffer = data.data.offers.find(
        (offer) =>
          offer.offer_details?.[0]?.name === selectedDepartureOffer &&
          offer.offer_details?.[1]?.name === selectedOfferKey,
      );
      if (selectedOffer) {
        return {
          amount: selectedOffer.total_price,
          currency: selectedOffer.currency_code,
        };
      }
    }

    // If only departure is selected, show departure price only
    if (selectedDepartureOffer && data?.data?.offers) {
      const departureOffer = data.data.offers.find(
        (offer) => offer.offer_details?.[0]?.name === selectedDepartureOffer,
      );
      if (departureOffer) {
        return {
          amount: departureOffer.minimum_offer_price,
          currency: departureOffer.currency_code,
        };
      }
    }

    // Fallback to default fare
    return {
      amount: data?.data?.fare_detail.price_info.total_fare || 0,
      currency: data?.data?.fare_detail.currency_code || '',
    };
  };

  // Get the selected offer's fare breakdown or default fare detail
  const getPriceBreakdown = () => {
    // If return offer is selected, use its breakdown
    // Must search by both departure and return to get the correct offer
    if (selectedOfferKey && selectedDepartureOffer && data?.data?.offers) {
      const foundOffer = data.data.offers.find(
        (offer) =>
          offer.offer_details?.[0]?.name === selectedDepartureOffer &&
          offer.offer_details?.[1]?.name === selectedOfferKey,
      );
      if (foundOffer && foundOffer.fares) {
        return {
          pax_fares: foundOffer.fares,
          currency_code: foundOffer.currency_code,
          total_fare: foundOffer.total_price,
        };
      }
    }

    // If only departure is selected, show departure breakdown
    if (selectedDepartureOffer && !showReturnOffers && data?.data?.offers) {
      const departureOffer = data.data.offers.find(
        (offer) => offer.offer_details?.[0]?.name === selectedDepartureOffer,
      );
      if (departureOffer && departureOffer.fares) {
        // Calculate departure-only price from fares
        const departureFares = departureOffer.fares.filter(
          (fare: any) => fare.pax_type !== 'RETURN',
        );
        const departureTotal = departureFares.reduce(
          (sum: number, fare: any) =>
            sum +
            fare.price_info.base_fare +
            fare.price_info.tax +
            (fare.price_info.service_fee || 0),
          0,
        );
        return {
          pax_fares: departureFares,
          currency_code: departureOffer.currency_code,
          total_fare: departureOffer.minimum_offer_price,
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
                  {/* Offer Selection */}
                  {data.data.offers && data.data.offers.length > 0 ? (
                    <div className="card border-0 shadow-sm mb-3">
                      <div className="card-body p-4">
                        {/* Back button to return to departure selection */}
                        {showReturnOffers && returnFareKey && (
                          <button
                            className="btn btn-outline-secondary btn-sm mb-3 d-flex align-items-center gap-2"
                            onClick={() => {
                              setShowReturnOffers(false);
                              setSelectedOfferKey(undefined);
                              setSelectedOffer(null);
                            }}
                          >
                            <FaArrowRight
                              size={12}
                              style={{
                                transform: isRTL ? 'scaleX(1)' : 'scaleX(-1)',
                              }}
                            />
                            {t('back_to_departure')}
                          </button>
                        )}
                        <OfferSelection
                          offers={data.data.offers}
                          selectedOfferKey={selectedOfferKey}
                          selectedDepartureOffer={selectedDepartureOffer}
                          showReturnOffers={showReturnOffers}
                          showDepartureOffers={!showReturnOffers}
                          onDepartureSelect={(departureName) => {
                            setSelectedDepartureOffer(departureName);
                            setShowReturnOffers(false);
                            setSelectedOfferKey(undefined);
                            setSelectedOffer(null);
                          }}
                          onOfferSelect={(offerKey) => {
                            setSelectedOfferKey(offerKey);
                            // Must search by both departure and return to get the correct offer
                            setSelectedOffer(
                              data.data.offers.find(
                                (offer) =>
                                  offer.offer_details?.[0]?.name ===
                                    selectedDepartureOffer &&
                                  offer.offer_details?.[1]?.name === offerKey,
                              ),
                            );
                          }}
                          currency={data.data.fare_detail.currency_code}
                        />
                      </div>
                    </div>
                  ) : (
                    // Default Offer Display
                    data.data.fare_detail && (
                      <div className="card border-0 shadow-sm mb-3">
                        <div className="card-body p-4">
                          <div className="mb-4">
                            <h3 className="h5 fw-bold text-dark mb-2">
                              {t('title')}
                            </h3>
                            <p className="text-muted mb-0 small">
                              Default offer available
                            </p>
                          </div>

                          {/* Default Departure Offer */}
                          {!showReturnOffers && (
                            <div className="mb-3">
                              <h4 className="h6 fw-bold text-dark mb-3">
                                Departure Flight
                              </h4>
                              <div
                                className={`card border position-relative offer-card border-warning shadow-sm`}
                                style={{
                                  backgroundColor: 'rgba(255, 193, 7, 0.03)',
                                }}
                              >
                                <div className="card-body p-3 d-flex flex-column">
                                  <div className="d-flex align-items-start justify-content-between mb-2">
                                    <div className="flex-grow-1 min-w-0">
                                      <p
                                        className="fw-bold mb-0 text-truncate"
                                        style={{ fontSize: '0.95rem' }}
                                      >
                                        Default Offer
                                      </p>
                                    </div>
                                    <div
                                      className="fw-bold text-warning"
                                      style={{ fontSize: '1.1rem' }}
                                    >
                                      {formatPrice(
                                        data.data.fare_detail.price_info
                                          .total_fare,
                                        data.data.fare_detail.currency_code,
                                      )}
                                    </div>
                                  </div>

                                  <div className="d-flex flex-column gap-2 mb-3">
                                    <div>
                                      <div className="d-flex align-items-center gap-2 bg-light rounded p-2">
                                        <FaInfoCircle
                                          className="text-warning"
                                          size={14}
                                        />
                                        <div>
                                          <div
                                            className="small fw-semibold"
                                            style={{
                                              fontSize: '0.75rem',
                                              lineHeight: '1.2',
                                            }}
                                          >
                                            {(data.data.fare_detail as any)
                                              .cabin_baggages_text?.[0] ||
                                              'N/A'}
                                          </div>
                                          <div
                                            className="text-muted"
                                            style={{ fontSize: '0.65rem' }}
                                          >
                                            Cabin Baggage
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="d-flex align-items-center gap-2 bg-light rounded p-2">
                                        <FaInfoCircle
                                          className="text-warning"
                                          size={14}
                                        />
                                        <div>
                                          <div
                                            className="small fw-semibold"
                                            style={{
                                              fontSize: '0.75rem',
                                              lineHeight: '1.2',
                                            }}
                                          >
                                            {(data.data.fare_detail as any)
                                              .baggages_text?.[0] || 'N/A'}
                                          </div>
                                          <div
                                            className="text-muted"
                                            style={{ fontSize: '0.65rem' }}
                                          >
                                            Checked Baggage
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <button
                                    className="btn w-100 fw-semibold btn-warning text-dark"
                                    onClick={() => {
                                      if (returnFareKey) {
                                        setShowReturnOffers(true);
                                        setSelectedOfferKey('default');
                                      }
                                    }}
                                    style={{
                                      fontSize: '0.85rem',
                                      padding: '0.5rem',
                                    }}
                                  >
                                    <FaCheck
                                      size={11}
                                      className={isRTL ? 'ms-1' : 'me-1'}
                                    />
                                    Selected
                                  </button>
                                </div>

                                <div className="position-absolute top-0 end-0 bg-warning text-dark rounded-bottom-start d-flex align-items-center justify-content-center">
                                  <FaCheck size={10} />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Default Return Offer */}
                          {showReturnOffers && returnFareKey && (
                            <div>
                              <button
                                className="btn btn-outline-secondary btn-sm mb-3 d-flex align-items-center gap-2"
                                onClick={() => {
                                  setShowReturnOffers(false);
                                  setSelectedOfferKey(undefined);
                                }}
                              >
                                <FaArrowRight
                                  size={12}
                                  style={{
                                    transform: isRTL
                                      ? 'scaleX(1)'
                                      : 'scaleX(-1)',
                                  }}
                                />
                                {t('back_to_departure')}
                              </button>
                              <h4 className="h6 fw-bold text-dark mb-3">
                                Return Flight
                              </h4>
                              <div
                                className={`card border position-relative offer-card ${
                                  selectedOfferKey === 'default'
                                    ? 'border-warning shadow-sm'
                                    : 'border-secondary'
                                }`}
                                style={{
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  backgroundColor:
                                    selectedOfferKey === 'default'
                                      ? 'rgba(255, 193, 7, 0.03)'
                                      : '#fff',
                                }}
                                onClick={() => {
                                  setSelectedOfferKey('default');
                                }}
                              >
                                <div className="card-body p-3 d-flex flex-column">
                                  <div className="d-flex align-items-start justify-content-between mb-2">
                                    <div className="flex-grow-1 min-w-0">
                                      <p
                                        className="text-muted small mb-0"
                                        style={{ fontSize: '0.7rem' }}
                                      >
                                        Departure
                                      </p>
                                      <p
                                        className="fw-bold mb-0 text-truncate"
                                        style={{ fontSize: '0.9rem' }}
                                      >
                                        Default Offer
                                      </p>
                                    </div>
                                    <div
                                      className={`fw-bold ${
                                        selectedOfferKey === 'default'
                                          ? 'text-warning'
                                          : 'text-dark'
                                      }`}
                                      style={{ fontSize: '1.1rem' }}
                                    >
                                      {formatPrice(
                                        data.data.fare_detail.price_info
                                          .total_fare,
                                        data.data.fare_detail.currency_code,
                                      )}
                                    </div>
                                  </div>

                                  <div className="d-flex flex-column gap-2 mb-3">
                                    <div>
                                      <div className="d-flex align-items-center gap-2 bg-light rounded p-2">
                                        <FaInfoCircle
                                          className={
                                            selectedOfferKey === 'default'
                                              ? 'text-warning'
                                              : 'text-secondary'
                                          }
                                          size={14}
                                        />
                                        <div>
                                          <div
                                            className="small fw-semibold"
                                            style={{
                                              fontSize: '0.75rem',
                                              lineHeight: '1.2',
                                            }}
                                          >
                                            {(data.data.fare_detail as any)
                                              .cabin_baggages_text?.[1] ||
                                              'N/A'}
                                          </div>
                                          <div
                                            className="text-muted"
                                            style={{ fontSize: '0.65rem' }}
                                          >
                                            Cabin Baggage
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="d-flex align-items-center gap-2 bg-light rounded p-2">
                                        <FaInfoCircle
                                          className={
                                            selectedOfferKey === 'default'
                                              ? 'text-warning'
                                              : 'text-secondary'
                                          }
                                          size={14}
                                        />
                                        <div>
                                          <div
                                            className="small fw-semibold"
                                            style={{
                                              fontSize: '0.75rem',
                                              lineHeight: '1.2',
                                            }}
                                          >
                                            {(data.data.fare_detail as any)
                                              .baggages_text?.[1] || 'N/A'}
                                          </div>
                                          <div
                                            className="text-muted"
                                            style={{ fontSize: '0.65rem' }}
                                          >
                                            Checked Baggage
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <button
                                    className={`btn w-100 fw-semibold ${
                                      selectedOfferKey === 'default'
                                        ? 'btn-warning text-dark'
                                        : 'btn-outline-secondary'
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedOfferKey('default');
                                    }}
                                    style={{
                                      fontSize: '0.85rem',
                                      padding: '0.5rem',
                                    }}
                                  >
                                    {selectedOfferKey === 'default' ? (
                                      <>
                                        <FaCheck
                                          size={11}
                                          className={isRTL ? 'ms-1' : 'me-1'}
                                        />
                                        Selected
                                      </>
                                    ) : (
                                      'Select'
                                    )}
                                  </button>
                                </div>

                                {selectedOfferKey === 'default' && (
                                  <div className="position-absolute top-0 end-0 bg-warning text-dark rounded-bottom-start d-flex align-items-center justify-content-center">
                                    <FaCheck size={10} />
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}

                  {/* Price Breakdown */}
                  {/* <div className="card border-0 shadow-sm mb-3">
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
                                    fare.price_info?.base_fare,
                                    fare.currency_code ||
                                      priceBreakdown.currency_code,
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
                                      fare.price_info?.tax,
                                      fare.currency_code ||
                                        priceBreakdown.currency_code,
                                    )}
                                  </span>
                                </div>

                                {(fare.price_info?.service_fee || 0) > 0 && (
                                  <div className="d-flex justify-content-between align-items-center">
                                    <span className="small text-muted">
                                      {t('service_fee')}
                                    </span>
                                    <span className="small fw-semibold">
                                      {formatPrice(
                                        fare.price_info?.service_fee,
                                        fare.currency_code ||
                                          priceBreakdown.currency_code,
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
                  </div> */}
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer CTA */}
        {data?.data &&
          !isFetching &&
          (selectedDepartureOffer ||
            showReturnOffers ||
            !data.data.offers ||
            data.data.offers.length === 0) && (
            <div className="border-top bg-white p-4">
              <button
                className="btn btn-primary btn-lg w-100 rounded-3 d-flex align-items-center justify-content-between shadow-sm"
                onClick={() => {
                  // If return offers are not shown yet, show them
                  if (!showReturnOffers && returnFareKey) {
                    setShowReturnOffers(true);
                    // Reset return selection when showing return offers
                    setSelectedOfferKey(undefined);
                    setSelectedOffer(null);
                    return;
                  }

                  // If return is selected or no return flight, proceed to booking
                  let offerKeyParam = '';
                  // Handle default offer (no offers available)
                  if (
                    selectedDepartureOffer === 'default' &&
                    (!data?.data?.offers || data?.data?.offers.length === 0)
                  ) {
                    if (selectedOfferKey === 'default' && returnFareKey) {
                      offerKeyParam = '&offerKey=default|default';
                    } else {
                      offerKeyParam = '&offerKey=default';
                    }
                  } else if (selectedOffer && selectedOffer.offer_details) {
                    const departureName =
                      selectedOffer.offer_details[0]?.name || '';
                    const returnName =
                      selectedOffer.offer_details[1]?.name || '';
                    if (returnName) {
                      offerKeyParam = `&offerKey=${departureName}|${returnName}`;
                    } else {
                      offerKeyParam = `&offerKey=${departureName}`;
                    }
                  } else if (selectedDepartureOffer) {
                    // Use selected departure offer if no return selected
                    offerKeyParam = `&offerKey=${selectedDepartureOffer}`;
                  }
                  router.push(
                    `/book-flight?departureFareKey=${departureFareKey}${returnFareKey ? `&returnFareKey=${returnFareKey}` : ''}${offerKeyParam}&children=${childrens}&adults=${adults}&infants=${infants}`,
                  );
                }}
                disabled={
                  isFetching ||
                  (!!returnFareKey &&
                    showReturnOffers &&
                    selectedOfferKey === undefined &&
                    !(
                      selectedDepartureOffer === 'default' &&
                      (!data?.data?.offers || data?.data?.offers.length === 0)
                    ))
                }
                style={{ height: '60px' }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className={`text-${isRTL ? 'end' : 'start'}`}>
                    <div className="small opacity-90">
                      {showReturnOffers &&
                      (selectedOfferKey ||
                        (selectedDepartureOffer === 'default' &&
                          (!data?.data?.offers ||
                            data?.data?.offers.length === 0)))
                        ? t('continue_book')
                        : returnFareKey
                          ? t('continue')
                          : t('continue_book')}
                    </div>
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
