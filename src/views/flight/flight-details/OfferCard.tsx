'use client';
import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { FaCheck, FaPlus, FaSuitcase, FaBriefcase } from 'react-icons/fa';

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

interface OfferCardProps {
  offer: Offer;
  isSelected: boolean;
  onSelect: () => void;
  priceDifference: number;
  currency: string;
  isPopular?: boolean;
}

const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  isSelected,
  onSelect,
  priceDifference,
  currency,
  isPopular = false,
}) => {
  const t = useTranslations('FlightSearch.offers');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [showDetails, setShowDetails] = useState(false);

  const formatPrice = (amount: number) => {
    if (isRTL) {
      return `${amount.toFixed(2)} ${currency}`;
    }
    return `${currency} ${amount.toFixed(2)}`;
  };

  const getServiceStatus = (service: Service) => {
    if (service.chargeable_type === 'INCLUDED_IN_PRICE') {
      return {
        icon: <FaCheck className="text-success" size={10} />,
        text: t('included'),
        className: 'text-success',
      };
    } else {
      return {
        icon: <FaPlus className="text-warning" size={10} />,
        text: t('available_for_charge'),
        className: 'text-warning',
      };
    }
  };

  const getBaggageInfo = () => {
    const cabinBag = offer.cabin_baggage_allowances?.[0];
    const checkedBag = offer.baggage_allowances?.[0];

    return {
      cabin: cabinBag
        ? `${cabinBag.max_weight_kg}${t('kg')}`
        : t('not_included'),
      checked: checkedBag
        ? `${checkedBag.max_weight_kg}${t('kg')}`
        : t('not_included'),
    };
  };

  const baggage = getBaggageInfo();

  return (
    <div
      className={`card h-100 border-2 position-relative transition-all offer-card ${
        isSelected
          ? 'border-warning shadow-lg selected'
          : isPopular
            ? 'border-warning shadow'
            : 'border-secondary shadow-sm'
      }`}
      style={{
        cursor: 'pointer',
        minHeight: '320px',
        transition: 'all 0.3s ease',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        backgroundColor: isSelected
          ? 'rgba(255, 193, 7, 0.05)'
          : 'rgba(108, 117, 125, 0.05)',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.classList.add('shadow');
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.classList.remove('shadow');
        }
      }}
    >
      <div className="card-body p-3 d-flex flex-column">
        {/* Header */}
        <div className="d-flex align-items-start justify-content-between mb-2">
          <div className="flex-grow-1 min-w-0">
            {/* <h6 className="fw-bold mb-1 text-truncate">
              {offer.offer_details[0]?.name}
            </h6> */}
            <p className="fw-bold mb-1 text-truncate">
              {offer.offer_details[0]?.descriptions[0]}
            </p>
          </div>
          {isSelected && (
            <div
              className="bg-warning rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ms-2"
              style={{ width: '20px', height: '20px' }}
            >
              <FaCheck className="text-dark" size={10} />
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="d-flex align-items-baseline gap-1">
            <h5
              className={`fw-bold mb-0 ${isSelected ? 'text-warning' : 'text-secondary'}`}
            >
              {formatPrice(offer.total_price)}
            </h5>
            {/* {priceDifference > 0 && (
              <span className="text-muted small">
                +{formatPrice(priceDifference)}
              </span>
            )} */}
          </div>
          {/* <p className="text-muted small mb-0">{t('per_person')}</p> */}
        </div>

        {/* Key Features */}
        <div className="mb-3 flex-grow-1">
          <div className="row g-1 text-center">
            <div className="col-6">
              <div
                className="bg-light border rounded-2 p-2 transition-all"
                style={{ transition: 'all 0.2s ease' }}
              >
                <FaBriefcase
                  className={`mb-1 ${isSelected ? 'text-warning' : 'text-secondary'}`}
                  size={12}
                />
                <div className="small fw-semibold">{baggage.cabin}</div>
                <div className="small text-muted">{t('cabin_baggage')}</div>
              </div>
            </div>
            <div className="col-6">
              <div
                className="bg-light border rounded-2 p-2 transition-all"
                style={{ transition: 'all 0.2s ease' }}
              >
                <FaSuitcase
                  className={`mb-1 ${isSelected ? 'text-warning' : 'text-secondary'}`}
                  size={12}
                />
                <div className="small fw-semibold">{baggage.checked}</div>
                <div className="small text-muted">{t('checked_baggage')}</div>
              </div>
            </div>
          </div>

          {/* Services Preview */}
          {offer.services && offer.services.length > 0 && (
            <div className="mt-3">
              <h6 className="fw-semibold mb-2 small">{t('services')}</h6>
              <div className="d-flex flex-column gap-1">
                {offer.services.slice(0, 2).map((service, index) => {
                  const status = getServiceStatus(service);
                  return (
                    <div
                      key={index}
                      className="d-flex align-items-center gap-2"
                    >
                      {status.icon}
                      <span className="small text-muted flex-grow-1 text-truncate">
                        {service.service_name || service.description}
                      </span>
                    </div>
                  );
                })}
                {offer.services.length > 2 && (
                  <div className="small text-muted">
                    +{offer.services.length - 2} {t('more_services')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Select Button */}
        <button
          className={`btn w-100 fw-semibold mt-auto ${
            isSelected ? 'btn-warning text-dark' : 'btn-outline-secondary'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          style={{ fontSize: '0.85rem' }}
        >
          {isSelected ? (
            <>
              <FaCheck size={12} className={isRTL ? 'ms-1' : 'me-1'} />
              {t('selected')}
            </>
          ) : (
            t('select')
          )}
        </button>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div
          className="position-absolute top-0 end-0 bg-warning text-dark rounded-bottom-start px-2 py-1"
          style={{ fontSize: '0.7rem' }}
        >
          <FaCheck size={8} />
        </div>
      )}
    </div>
  );
};

export default OfferCard;
