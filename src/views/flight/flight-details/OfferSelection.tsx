'use client';
import React, { useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import OfferCard from './OfferCard';
import {
  FaExchangeAlt,
  FaStar,
  FaAward,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import custom styles
import '@/styles/offer-selection.css';
import { FlightOffer } from '@/types/app/fareTypes';

interface OfferSelectionProps {
  offers: FlightOffer[];
  selectedOfferKey?: string;
  onOfferSelect: (offerKey: string) => void;
  currency: string;
}

const OfferSelection: React.FC<OfferSelectionProps> = ({
  offers,
  selectedOfferKey,
  onOfferSelect,
  currency,
}) => {
  const t = useTranslations('FlightSearch.offers');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const swiperRef = useRef<any>(null);
  const returnSwiperRef = useRef<any>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [returnIsBeginning, setReturnIsBeginning] = useState(true);
  const [returnIsEnd, setReturnIsEnd] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [returnActiveIndex, setReturnActiveIndex] = useState(0);
  const [selectedDepartureName, setSelectedDepartureName] = useState<
    string | null
  >(null);
  const [selectedReturnOfferKey, setSelectedReturnOfferKey] = useState<
    string | null
  >(null);

  // Get unique departure names (from offer_details[0].name)
  const uniqueDepartureNames = React.useMemo(() => {
    const names = offers
      .map((offer) => offer.offer_details[0]?.name)
      .filter((name): name is string => !!name);
    return Array.from(new Set(names));
  }, [offers]);

  // Get departure offers (unique by name)
  const departureOffers = React.useMemo(() => {
    const seen = new Set<string>();
    return offers.filter((offer) => {
      const name = offer.offer_details[0]?.name;
      if (!name || seen.has(name)) return false;
      seen.add(name);
      return true;
    });
  }, [offers]);

  // Get return offers that match selected departure
  const returnOffers = React.useMemo(() => {
    if (!selectedDepartureName) return [];
    return offers.filter(
      (offer) => offer.offer_details[0]?.name === selectedDepartureName,
    );
  }, [offers, selectedDepartureName]);

  // Set default selected departure and return on mount
  React.useEffect(() => {
    if (departureOffers.length > 0 && !selectedDepartureName) {
      const firstDeparture = departureOffers[0];
      const firstDepartureName = firstDeparture.offer_details[0]?.name;
      if (firstDepartureName) {
        setSelectedDepartureName(firstDepartureName);
      }
    }
  }, [departureOffers, selectedDepartureName]);

  // Set default selected return when departure changes
  React.useEffect(() => {
    if (selectedDepartureName && returnOffers.length > 0) {
      const firstReturn = returnOffers[0];
      if (firstReturn && selectedReturnOfferKey !== firstReturn.offer_key) {
        setSelectedReturnOfferKey(firstReturn.offer_key);
        onOfferSelect(firstReturn.offer_key);
      }
    } else if (!selectedDepartureName) {
      setSelectedReturnOfferKey(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDepartureName, returnOffers.length]);

  // Get the cheapest price for comparison
  const cheapestDeparturePrice = React.useMemo(() => {
    if (departureOffers.length === 0) return 0;
    return Math.min(
      ...departureOffers.map((offer) => offer.minimum_offer_price),
    );
  }, [departureOffers]);

  const cheapestReturnPrice = React.useMemo(() => {
    if (returnOffers.length === 0) return 0;
    return Math.min(
      ...returnOffers.map(
        (offer) => offer.total_price - offer.minimum_offer_price,
      ),
    );
  }, [returnOffers]);

  // Handle pagination click
  const handlePaginationClick = (index: number) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
      setActiveIndex(index);
    }
  };

  // Handle departure selection
  const handleDepartureSelect = (departureName: string) => {
    setSelectedDepartureName(departureName);
    setSelectedReturnOfferKey(null);
    setReturnActiveIndex(0);
    // Reset return swiper to beginning
    if (returnSwiperRef.current && returnSwiperRef.current.swiper) {
      returnSwiperRef.current.swiper.slideTo(0);
    }
  };

  // Handle return offer selection
  const handleReturnSelect = (offerKey: string) => {
    setSelectedReturnOfferKey(offerKey);
    onOfferSelect(offerKey);
  };

  // Handle return pagination click
  const handleReturnPaginationClick = (index: number) => {
    if (returnSwiperRef.current && returnSwiperRef.current.swiper) {
      returnSwiperRef.current.swiper.slideTo(index);
      setReturnActiveIndex(index);
    }
  };

  const getDepartureBadge = (offer: FlightOffer, index: number) => {
    if (index === 1 && departureOffers.length === 3) {
      return {
        text: t('most_popular'),
        icon: <FaStar size={12} />,
        className: 'bg-warning text-dark',
      };
    }
    if (offer.minimum_offer_price === cheapestDeparturePrice) {
      return {
        text: t('best_value'),
        icon: <FaAward size={12} />,
        className: 'bg-success text-white',
      };
    }
    if (index === departureOffers.length - 1) {
      return {
        text: t('maximum_flexibility'),
        icon: <FaExchangeAlt size={12} />,
        className: 'bg-primary text-white',
      };
    }
    return null;
  };

  const getReturnBadge = (offer: FlightOffer, index: number) => {
    if (index === 1 && returnOffers.length === 3) {
      return {
        text: t('most_popular'),
        icon: <FaStar size={12} />,
        className: 'bg-warning text-dark',
      };
    }
    const returnPrice = offer.total_price - offer.minimum_offer_price;
    if (returnPrice === cheapestReturnPrice) {
      return {
        text: t('best_value'),
        icon: <FaAward size={12} />,
        className: 'bg-success text-white',
      };
    }
    if (index === returnOffers.length - 1) {
      return {
        text: t('maximum_flexibility'),
        icon: <FaExchangeAlt size={12} />,
        className: 'bg-primary text-white',
      };
    }
    return null;
  };

  const formatPrice = (amount: number) => {
    if (isRTL) {
      return `${amount.toFixed(2)} ${currency}`;
    }
    return `${currency} ${amount.toFixed(2)}`;
  };

  return (
    <div className="offer-selection-container">
      {/* Header */}
      <div className="mb-4">
        <h3 className="h5 fw-bold text-dark mb-2">{t('title')}</h3>
        <p className="text-muted mb-0 small">{t('subtitle')}</p>
      </div>

      {/* Departure Flights Section */}
      <div className="mb-4">
        <h4 className="h6 fw-bold text-dark mb-3">Departure Flights</h4>
        <div className="position-relative mb-3">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={'auto'}
            centeredSlides={false}
            navigation={{
              prevEl: '.swiper-button-prev-departure',
              nextEl: '.swiper-button-next-departure',
            }}
            pagination={{
              el: '.swiper-pagination-departure',
              clickable: true,
              bulletClass: 'swiper-pagination-bullet',
              bulletActiveClass: 'swiper-pagination-bullet-active',
            }}
            breakpoints={{
              480: { spaceBetween: 16 },
              768: { spaceBetween: 20 },
              1200: { spaceBetween: 24 },
            }}
            watchSlidesProgress={true}
            dir={isRTL ? 'rtl' : 'ltr'}
            className="offer-swiper pb-4"
            onSwiper={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
              setActiveIndex(swiper.activeIndex);
            }}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
              setActiveIndex(swiper.activeIndex);
            }}
          >
            {departureOffers.map((offer, index) => {
              const badge = getDepartureBadge(offer, index);
              const isSelected =
                selectedDepartureName === offer.offer_details[0]?.name;
              const priceDifference =
                offer.minimum_offer_price - cheapestDeparturePrice;

              return (
                <SwiperSlide key={offer.offer_key} className="h-auto d-flex">
                  <div className="position-relative h-100 w-100 d-flex flex-column">
                    {badge && (
                      <div
                        className="position-absolute top-0 start-50 translate-middle-x"
                        style={{ zIndex: 5, marginTop: '-0.5rem' }}
                      >
                        <div
                          className={`badge ${badge.className} d-flex align-items-center gap-1 px-2 py-1 rounded-pill shadow-sm`}
                          style={{ fontSize: '0.7rem' }}
                        >
                          {badge.icon}
                          <span className="fw-semibold">{badge.text}</span>
                        </div>
                      </div>
                    )}
                    <div
                      className="flex-grow-1 d-flex"
                      style={{ marginTop: badge ? '1.5rem' : '0' }}
                    >
                      <OfferCard
                        offer={offer}
                        isSelected={isSelected}
                        onSelect={() =>
                          handleDepartureSelect(
                            offer.offer_details[0]?.name || '',
                          )
                        }
                        priceDifference={priceDifference}
                        currency={currency}
                        isPopular={index === 1 && departureOffers.length === 3}
                        displayPrice={offer.minimum_offer_price}
                        isReturnPhase={false}
                      />
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Departure Navigation Buttons */}
          <button
            className={`swiper-button-prev-departure btn btn-sm position-absolute top-50 start-0 translate-middle-y rounded-circle d-flex align-items-center justify-content-center shadow-sm ${
              isBeginning ? 'btn-secondary disabled' : 'btn-warning'
            }`}
            style={{
              width: '36px',
              height: '36px',
              zIndex: 10,
              [isRTL ? 'right' : 'left']: '-18px',
              pointerEvents: isBeginning ? 'none' : 'auto',
              opacity: isBeginning ? 0.5 : 1,
            }}
            disabled={isBeginning}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (!isBeginning && swiperRef.current) {
                swiperRef.current.swiper.slidePrev();
              }
            }}
          >
            {isRTL ? (
              <FaChevronRight
                className={isBeginning ? 'text-light' : 'text-dark'}
                size={12}
              />
            ) : (
              <FaChevronLeft
                className={isBeginning ? 'text-light' : 'text-dark'}
                size={12}
              />
            )}
          </button>

          <button
            className={`swiper-button-next-departure btn btn-sm position-absolute top-50 end-0 translate-middle-y rounded-circle d-flex align-items-center justify-content-center shadow-sm ${
              isEnd ? 'btn-secondary disabled' : 'btn-warning'
            }`}
            style={{
              width: '36px',
              height: '36px',
              zIndex: 10,
              [isRTL ? 'left' : 'right']: '-18px',
              pointerEvents: isEnd ? 'none' : 'auto',
              opacity: isEnd ? 0.5 : 1,
            }}
            disabled={isEnd}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (!isEnd && swiperRef.current) {
                swiperRef.current.swiper.slideNext();
              }
            }}
          >
            {isRTL ? (
              <FaChevronLeft
                className={isEnd ? 'text-light' : 'text-dark'}
                size={12}
              />
            ) : (
              <FaChevronRight
                className={isEnd ? 'text-light' : 'text-dark'}
                size={12}
              />
            )}
          </button>
        </div>

        {/* Departure Pagination */}
        {departureOffers.length > 1 && (
          <div className="swiper-pagination-departure d-flex justify-content-center align-items-center gap-2 mb-4" />
        )}
      </div>

      {/* Return Flights Section */}
      {selectedDepartureName && returnOffers.length > 0 && (
        <div className="mb-4">
          <h4 className="h6 fw-bold text-dark mb-3">Return Flights</h4>
          <div className="position-relative mb-3">
            <Swiper
              ref={returnSwiperRef}
              modules={[Navigation, Pagination]}
              spaceBetween={16}
              slidesPerView={'auto'}
              centeredSlides={false}
              navigation={{
                prevEl: '.swiper-button-prev-return',
                nextEl: '.swiper-button-next-return',
              }}
              pagination={{
                el: '.swiper-pagination-return',
                clickable: true,
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active',
              }}
              breakpoints={{
                480: { spaceBetween: 16 },
                768: { spaceBetween: 20 },
                1200: { spaceBetween: 24 },
              }}
              watchSlidesProgress={true}
              dir={isRTL ? 'rtl' : 'ltr'}
              className="offer-swiper pb-4"
              onSwiper={(swiper) => {
                setReturnIsBeginning(swiper.isBeginning);
                setReturnIsEnd(swiper.isEnd);
                setReturnActiveIndex(swiper.activeIndex);
              }}
              onSlideChange={(swiper) => {
                setReturnIsBeginning(swiper.isBeginning);
                setReturnIsEnd(swiper.isEnd);
                setReturnActiveIndex(swiper.activeIndex);
              }}
            >
              {returnOffers.map((offer, index) => {
                const badge = getReturnBadge(offer, index);
                const isSelected = selectedReturnOfferKey === offer.offer_key;
                const returnPrice =
                  offer.total_price - offer.minimum_offer_price;
                const priceDifference = returnPrice - cheapestReturnPrice;

                return (
                  <SwiperSlide key={offer.offer_key} className="h-auto d-flex">
                    <div className="position-relative h-100 w-100 d-flex flex-column">
                      {badge && (
                        <div
                          className="position-absolute top-0 start-50 translate-middle-x"
                          style={{ zIndex: 5, marginTop: '-0.5rem' }}
                        >
                          <div
                            className={`badge ${badge.className} d-flex align-items-center gap-1 px-2 py-1 rounded-pill shadow-sm`}
                            style={{ fontSize: '0.7rem' }}
                          >
                            {badge.icon}
                            <span className="fw-semibold">{badge.text}</span>
                          </div>
                        </div>
                      )}
                      <div
                        className="flex-grow-1 d-flex"
                        style={{ marginTop: badge ? '1.5rem' : '0' }}
                      >
                        <OfferCard
                          offer={offer}
                          isSelected={isSelected}
                          onSelect={() => handleReturnSelect(offer.offer_key)}
                          priceDifference={priceDifference}
                          currency={currency}
                          isPopular={index === 1 && returnOffers.length === 3}
                          displayPrice={returnPrice}
                          isReturnPhase={true}
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* Return Navigation Buttons */}
            <button
              className={`swiper-button-prev-return btn btn-sm position-absolute top-50 start-0 translate-middle-y rounded-circle d-flex align-items-center justify-content-center shadow-sm ${
                returnIsBeginning ? 'btn-secondary disabled' : 'btn-warning'
              }`}
              style={{
                width: '36px',
                height: '36px',
                zIndex: 10,
                [isRTL ? 'right' : 'left']: '-18px',
                pointerEvents: returnIsBeginning ? 'none' : 'auto',
                opacity: returnIsBeginning ? 0.5 : 1,
              }}
              disabled={returnIsBeginning}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (!returnIsBeginning && returnSwiperRef.current) {
                  returnSwiperRef.current.swiper.slidePrev();
                }
              }}
            >
              {isRTL ? (
                <FaChevronRight
                  className={returnIsBeginning ? 'text-light' : 'text-dark'}
                  size={12}
                />
              ) : (
                <FaChevronLeft
                  className={returnIsBeginning ? 'text-light' : 'text-dark'}
                  size={12}
                />
              )}
            </button>

            <button
              className={`swiper-button-next-return btn btn-sm position-absolute top-50 end-0 translate-middle-y rounded-circle d-flex align-items-center justify-content-center shadow-sm ${
                returnIsEnd ? 'btn-secondary disabled' : 'btn-warning'
              }`}
              style={{
                width: '36px',
                height: '36px',
                zIndex: 10,
                [isRTL ? 'left' : 'right']: '-18px',
                pointerEvents: returnIsEnd ? 'none' : 'auto',
                opacity: returnIsEnd ? 0.5 : 1,
              }}
              disabled={returnIsEnd}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (!returnIsEnd && returnSwiperRef.current) {
                  returnSwiperRef.current.swiper.slideNext();
                }
              }}
            >
              {isRTL ? (
                <FaChevronLeft
                  className={returnIsEnd ? 'text-light' : 'text-dark'}
                  size={12}
                />
              ) : (
                <FaChevronRight
                  className={returnIsEnd ? 'text-light' : 'text-dark'}
                  size={12}
                />
              )}
            </button>
          </div>

          {/* Return Pagination */}
          {returnOffers.length > 1 && (
            <div className="swiper-pagination-return d-flex justify-content-center align-items-center gap-2 mb-4" />
          )}
        </div>
      )}
    </div>
  );
};

export default OfferSelection;
