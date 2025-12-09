'use client';

import React from 'react';
import usePerfectScrollbar from '@/hooks/usePerfectScrollbar';
import { UseFormReturn } from 'react-hook-form';
import { useTranslations, useLocale } from 'next-intl';

interface FlightSearchParams {
  fromAirport: string;
  toAirport: string;
  departureDate: string;
  returnDate?: string;
  tripType: 'roundTrip' | 'oneWay';
  adults: number;
  children: number;
  infants: number;
  cabinClass: 'ECONOMY' | 'BUSINESS';
}

interface GuestSearchProps {
  form: UseFormReturn<FlightSearchParams>;
}

const FlightPassenger = ({ form }: GuestSearchProps) => {
  const t = useTranslations('HomePage.hero_section.flight.passenger');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const scrollRef = usePerfectScrollbar({
    suppressScrollX: true,
    wheelPropagation: false,
  });

  const { setValue, watch } = form;
  const adults = watch('adults') || 1;
  const children = watch('children') || 0;
  const infants = watch('infants') || 0;
  const cabinClass = watch('cabinClass') || 'ECONOMY';

  const handleAdultChange = (value: number) => {
    setValue('adults', Math.max(1, value));
  };

  const handleChildrenChange = (value: number) => {
    setValue('children', Math.max(0, value));
  };

  const handleInfantsChange = (value: number) => {
    setValue('infants', Math.max(0, value));
  };

  const handleCabinClassChange = (value: 'ECONOMY' | 'BUSINESS') => {
    setValue('cabinClass', value);
  };

  const getTotalPassengers = () => {
    return adults + children + infants;
  };

  return (
    <div className="searchMenu-guests px-30 lg:py-20 lg:px-0 js-form-dd js-form-counters position-relative">
      <div
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-expanded="false"
        data-bs-offset="0,22"
      >
        <div className="text-15 text-light-1 ls-2 lh-16">
          {getTotalPassengers()} {t('passengers')} - {cabinClass}
        </div>
      </div>

      <div className="shadow-2 dropdown-menu min-width-400">
        <div
          className="bg-white px-30 py-30 rounded-4 counter-box"
          style={{
            maxHeight: '500px',
            position: 'relative',
            overflow: 'hidden',
          }}
          ref={scrollRef}
        >
          {/* Adults */}
          <div className="row y-gap-10 justify-between items-center mb-3">
            <div className="col-auto">
              <div className="text-15 lh-12 fw-500">{t('adults')}</div>
              <div className="text-14 lh-12 text-light-1 mt-5">
                {t('adults_description')}
              </div>
            </div>
            <div className="col-auto">
              <div className="d-flex items-center js-counter">
                <button
                  type="button"
                  className="button -outline-blue-1 text-blue-1 size-38 rounded-4"
                  onClick={() => handleAdultChange(adults - 1)}
                >
                  <i className="icon-minus text-12" />
                </button>
                <div
                  className={`flex-center size-20 ${isRTL ? 'mr-15 ml-15' : 'ml-15 mr-15'}`}
                >
                  <div className="text-15">{adults}</div>
                </div>
                <button
                  type="button"
                  className="button -outline-blue-1 text-blue-1 size-38 rounded-4"
                  onClick={() => handleAdultChange(adults + 1)}
                >
                  <i className="icon-plus text-12" />
                </button>
              </div>
            </div>
          </div>

          {/* Children */}
          <div className="row y-gap-10 justify-between items-center mb-3">
            <div className="col-auto">
              <div className="text-15 lh-12 fw-500">{t('children')}</div>
              <div className="text-14 lh-12 text-light-1 mt-5">
                {t('children_description')}
              </div>
            </div>
            <div className="col-auto">
              <div className="d-flex items-center js-counter">
                <button
                  type="button"
                  className="button -outline-blue-1 text-blue-1 size-38 rounded-4"
                  onClick={() => handleChildrenChange(children - 1)}
                >
                  <i className="icon-minus text-12" />
                </button>
                <div
                  className={`flex-center size-20 ${isRTL ? 'mr-15 ml-15' : 'ml-15 mr-15'}`}
                >
                  <div className="text-15">{children}</div>
                </div>
                <button
                  type="button"
                  className="button -outline-blue-1 text-blue-1 size-38 rounded-4"
                  onClick={() => handleChildrenChange(children + 1)}
                >
                  <i className="icon-plus text-12" />
                </button>
              </div>
            </div>
          </div>

          {/* Infants */}
          <div className="row y-gap-10 justify-between items-center mb-3">
            <div className="col-auto">
              <div className="text-15 lh-12 fw-500">{t('infants')}</div>
              <div className="text-14 lh-12 text-light-1 mt-5">
                {t('infants_description')}
              </div>
            </div>
            <div className="col-auto">
              <div className="d-flex items-center js-counter">
                <button
                  type="button"
                  className="button -outline-blue-1 text-blue-1 size-38 rounded-4"
                  onClick={() => handleInfantsChange(infants - 1)}
                >
                  <i className="icon-minus text-12" />
                </button>
                <div
                  className={`flex-center size-20 ${isRTL ? 'mr-15 ml-15' : 'ml-15 mr-15'}`}
                >
                  <div className="text-15">{infants}</div>
                </div>
                <button
                  type="button"
                  className="button -outline-blue-1 text-blue-1 size-38 rounded-4"
                  onClick={() => handleInfantsChange(infants + 1)}
                >
                  <i className="icon-plus text-12" />
                </button>
              </div>
            </div>
          </div>

          {/* Cabin Class */}
          <div className="border-top-light pt-3">
            <div className="text-15 lh-12 fw-500 mb-3">{t('cabin_class')}</div>
            <div className="row">
              <div className="col-6">
                <button
                  type="button"
                  className={`btn w-100 ${
                    cabinClass === 'ECONOMY'
                      ? 'btn-primary'
                      : 'btn-outline-primary'
                  }`}
                  onClick={() => handleCabinClassChange('ECONOMY')}
                >
                  {t('economy')}
                </button>
              </div>
              <div className="col-6">
                <button
                  type="button"
                  className={`btn w-100 ${
                    cabinClass === 'BUSINESS'
                      ? 'btn-primary'
                      : 'btn-outline-primary'
                  }`}
                  onClick={() => handleCabinClassChange('BUSINESS')}
                >
                  {t('business')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightPassenger;
