'use client';
import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { FaCheck, FaSuitcase, FaBriefcase } from 'react-icons/fa';
import { FlightOffer } from '@/types/app/fareTypes';

interface OfferCardProps {
  offer: FlightOffer;
  isSelected: boolean;
  onSelect: () => void;
  priceDifference: number;
  currency: string;
  isPopular?: boolean;
  displayPrice?: number;
  isReturnPhase?: boolean;
}

const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  isSelected,
  onSelect,
  priceDifference,
  currency,
  isPopular = false,
  displayPrice,
  isReturnPhase = false,
}) => {
  const t = useTranslations('FlightSearch.offers');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const formatPrice = (amount: number) => {
    if (isRTL) {
      return `${amount.toFixed(2)} ${currency}`;
    }
    return `${currency} ${amount.toFixed(2)}`;
  };

  const getBaggageInfo = () => {
    const cabinBag = offer.cabin_baggages_text?.[0];
    const checkedBag = offer.baggages_text?.[0];
    return {
      cabin: cabinBag,
      checked: checkedBag,
    };
  };

  const baggage = getBaggageInfo();

  return (
    <div
      className={`card border position-relative offer-card ${
        isSelected ? 'border-warning shadow-sm' : 'border-secondary'
      }`}
      style={{
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        backgroundColor: isSelected ? 'rgba(255, 193, 7, 0.03)' : '#fff',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div className="card-body p-3 d-flex flex-column">
        {/* Header & Price Row */}
        <div className="d-flex align-items-start justify-content-between mb-2">
          <div className="flex-grow-1 min-w-0">
            {isReturnPhase ? (
              <div>
                <p
                  className="text-muted small mb-0"
                  style={{ fontSize: '0.7rem' }}
                >
                  {offer.offer_details[0]?.descriptions || 'Departure'}
                </p>
                <p
                  className="fw-bold mb-0 text-truncate"
                  style={{ fontSize: '0.9rem' }}
                >
                  {offer.offer_details[1]?.descriptions || 'Return'}
                </p>
              </div>
            ) : (
              <p
                className="fw-bold mb-0 text-truncate"
                style={{ fontSize: '0.95rem' }}
              >
                {offer.offer_details[0]?.descriptions[0] ||
                  offer.offer_details[0]?.name}
              </p>
            )}
          </div>
          <div
            className={`fw-bold ${isSelected ? 'text-warning' : 'text-dark'}`}
            style={{ fontSize: '1.1rem' }}
          >
            {isReturnPhase && <span className="text-muted me-1">+</span>}
            {formatPrice(
              displayPrice !== undefined
                ? displayPrice
                : offer.minimum_offer_price,
            )}
          </div>
        </div>

        {/* Baggage Info */}
        <div className="d-flex flex-column  gap-2 mb-3">
          <div className="">
            <div className="d-flex align-items-center gap-2 bg-light rounded p-2">
              <FaBriefcase
                className={isSelected ? 'text-warning' : 'text-secondary'}
                size={14}
              />
              <div>
                <div
                  className="small fw-semibold"
                  style={{ fontSize: '0.75rem', lineHeight: '1.2' }}
                >
                  {baggage.cabin}
                </div>
                <div className="text-muted" style={{ fontSize: '0.65rem' }}>
                  {t('cabin_baggage')}
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="d-flex align-items-center gap-2 bg-light rounded p-2">
              <FaSuitcase
                className={isSelected ? 'text-warning' : 'text-secondary'}
                size={14}
              />
              <div>
                <div
                  className="small fw-semibold"
                  style={{ fontSize: '0.75rem', lineHeight: '1.2' }}
                >
                  {baggage.checked}
                </div>
                <div className="text-muted" style={{ fontSize: '0.65rem' }}>
                  {t('checked_baggage')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Select Button */}
        <button
          className={`btn w-100 fw-semibold ${
            isSelected ? 'btn-warning text-dark' : 'btn-outline-secondary'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          style={{ fontSize: '0.85rem', padding: '0.5rem' }}
        >
          {isSelected ? (
            <>
              <FaCheck size={11} className={isRTL ? 'ms-1' : 'me-1'} />
              {t('selected')}
            </>
          ) : (
            t('select')
          )}
        </button>
      </div>

      {/* Selection Check */}
      {isSelected && (
        <div
          className="position-absolute top-0 end-0 bg-warning text-dark rounded-bottom-start d-flex align-items-center justify-content-center"
          style={{ width: '24px', height: '24px' }}
        >
          <FaCheck size={10} />
        </div>
      )}
    </div>
  );
};

export default OfferCard;
