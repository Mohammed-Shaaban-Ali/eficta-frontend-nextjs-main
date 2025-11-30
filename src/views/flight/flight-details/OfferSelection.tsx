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

interface Service {
  service_id: string;
  service_type: string;
  description: string;
  chargeable_type: string;
  offer_legs: any[];
  supplier_code: string;
  service_name?: string;
}

interface OfferDetail {
  name: string;
  descriptions: string[];
}

interface Offer {
  offer_key: string;
  offer_details: OfferDetail[];
  services: Service[];
  total_price: number;
  currency_code: string;
  fare_type?: string;
  non_refundable?: boolean;
  can_book?: boolean;
  can_rezerve?: boolean;
  baggage_allowances?: any[];
  cabin_baggage_allowances?: any[];
}

interface OfferSelectionProps {
  offers: Offer[];
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
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Get the cheapest price for comparison
  const cheapestPrice = Math.min(...offers.map((offer) => offer.total_price));

  // Handle pagination click
  const handlePaginationClick = (index: number) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
      setActiveIndex(index);
    }
  };

  const getOfferBadge = (offer: Offer, index: number) => {
    if (index === 1 && offers.length === 3) {
      return {
        text: t('most_popular'),
        icon: <FaStar size={12} />,
        className: 'bg-warning text-dark',
      };
    }
    if (offer.total_price === cheapestPrice) {
      return {
        text: t('best_value'),
        icon: <FaAward size={12} />,
        className: 'bg-success text-white',
      };
    }
    if (index === offers.length - 1) {
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

      {/* Swiper Container */}
      <div className="position-relative mb-3">
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination]}
          spaceBetween={16}
          slidesPerView={'auto'}
          centeredSlides={false}
          navigation={{
            prevEl: '.swiper-button-prev-custom',
            nextEl: '.swiper-button-next-custom',
          }}
          pagination={{
            el: '.swiper-pagination-custom',
            clickable: true,
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
            dynamicBullets: false,
            renderBullet: (index: number, className: string) => {
              return `<span class="${className}" data-index="${index}"></span>`;
            },
          }}
          breakpoints={{
            480: {
              spaceBetween: 16,
            },
            768: {
              spaceBetween: 20,
            },
            1200: {
              spaceBetween: 24,
            },
          }}
          watchSlidesProgress={true}
          dir={isRTL ? 'rtl' : 'ltr'}
          className="offer-swiper pb-4"
          onSwiper={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
            setActiveIndex(swiper.activeIndex);

            // Add data attribute for CSS targeting
            if (swiper.el) {
              swiper.el.setAttribute('data-slides', offers.length.toString());
            }
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
            setActiveIndex(swiper.activeIndex);
          }}
          onBreakpoint={(swiper) => {
            // Recalculate navigation state on breakpoint change
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);

            // Re-add data attribute after breakpoint change
            if (swiper.el) {
              swiper.el.setAttribute('data-slides', offers.length.toString());
            }
          }}
        >
          {offers.map((offer, index) => {
            const badge = getOfferBadge(offer, index);
            const isSelected = selectedOfferKey === offer.offer_key;
            const priceDifference = offer.total_price - cheapestPrice;

            return (
              <SwiperSlide key={offer.offer_key} className="h-auto d-flex">
                <div className="position-relative h-100 w-100 d-flex flex-column">
                  {/* Badge */}
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
                      onSelect={() => onOfferSelect(offer.offer_key)}
                      priceDifference={priceDifference}
                      currency={currency}
                      isPopular={index === 1 && offers.length === 3}
                    />
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button
          className={`swiper-button-prev-custom btn btn-sm position-absolute top-50 start-0 translate-middle-y rounded-circle d-flex align-items-center justify-content-center shadow-sm ${
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
          className={`swiper-button-next-custom btn btn-sm position-absolute top-50 end-0 translate-middle-y rounded-circle d-flex align-items-center justify-content-center shadow-sm ${
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

      {/* Custom Pagination */}
      {offers.length > 1 && (
        <div className="swiper-pagination-custom d-flex justify-content-center align-items-center gap-2 mb-4">
          {offers.map((_, index) => (
            <button
              key={index}
              className={`swiper-pagination-bullet ${
                index === activeIndex ? 'swiper-pagination-bullet-active' : ''
              }`}
              onClick={() => handlePaginationClick(index)}
              aria-label={`Go to slide ${index + 1}`}
              style={{
                border: 'none',
                outline: 'none',
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OfferSelection;
