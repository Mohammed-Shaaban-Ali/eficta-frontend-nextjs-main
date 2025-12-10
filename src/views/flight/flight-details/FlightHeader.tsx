'use client';
import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { FaTimes, FaUsers, FaCheckCircle } from 'react-icons/fa';

interface FlightHeaderProps {
  onClose: () => void;
  adults: number;
  childrens: number;
  infants: number;
  hasData: boolean;
}

const FlightHeader: React.FC<FlightHeaderProps> = ({
  onClose,
  adults,
  childrens,
  infants,
  hasData,
}) => {
  const t = useTranslations('FlightSearch.details');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const totalPassengers = adults + childrens + infants;

  return (
    <div className="position-relative overflow-hidden">
      <div
        className="p-4 text-white position-relative"
        style={{
          background:
            'linear-gradient(135deg, rgb(21 34 93) 0%, rgb(13 40 183) 100%)',
        }}
      >
        <div className="position-relative">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h3 className="mb-1 fw-bold">{t('title')}</h3>
              <p className="mb-0 opacity-90 small text-white">
                {t('review_booking')}
              </p>
            </div>
            <button
              className="btn btn-light btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center"
              style={{ width: '40px', height: '40px' }}
              onClick={onClose}
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* {hasData && (
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <div className="bg-white bg-opacity-20 rounded-pill px-3 py-2 d-flex align-items-center">
                <FaUsers className={isRTL ? 'ms-2' : 'me-2'} size={14} />
                <span className="small fw-semibold text-black">
                  {totalPassengers}{' '}
                  {totalPassengers > 1 ? t('travelers') : t('traveler')}
                </span>
              </div>
              <div className="bg-success bg-opacity-80 rounded-pill px-3 py-2 d-flex align-items-center">
                <FaCheckCircle className={isRTL ? 'ms-2' : 'me-2'} size={14} />
                <span className="small fw-semibold">
                  {t('instant_booking')}
                </span>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default FlightHeader;
