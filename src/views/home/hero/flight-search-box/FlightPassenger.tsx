'use client';

import React, { useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);
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

  const [isCabinOpen, setIsCabinOpen] = useState(false);

  const getPassengersText = () => {
    return `${getTotalPassengers()} ${t('passengers')}`;
  };

  const getCabinText = () => {
    return cabinClass === 'ECONOMY' ? t('economy') : t('business');
  };

  return (
    <div className="flex items-center gap-4">
      {/* Passengers Dropdown */}
      <div className="searchMenu-guests js-form-dd js-form-counters position-relative">
        <div
          className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-gray-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-sm">{getPassengersText()}</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {isOpen && (
          <div
            className="absolute z-50 mt-1 w-full min-w-[320px] bg-white rounded-lg shadow-lg border border-gray-200"
            style={{ top: '100%', left: 0 }}
          >
            <div
              className="p-4"
              style={{
                maxHeight: '400px',
                position: 'relative',
                overflow: 'auto',
              }}
              ref={scrollRef}
            >
              {/* Adults */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-sm font-medium">{t('adults')}</div>
                  <div className="text-xs text-gray-500">
                    {t('adults_description')}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    onClick={() => handleAdultChange(adults - 1)}
                  >
                    <span className="text-lg">-</span>
                  </button>
                  <span className="w-6 text-center">{adults}</span>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    onClick={() => handleAdultChange(adults + 1)}
                  >
                    <span className="text-lg">+</span>
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-sm font-medium">{t('children')}</div>
                  <div className="text-xs text-gray-500">
                    {t('children_description')}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    onClick={() => handleChildrenChange(children - 1)}
                  >
                    <span className="text-lg">-</span>
                  </button>
                  <span className="w-6 text-center">{children}</span>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    onClick={() => handleChildrenChange(children + 1)}
                  >
                    <span className="text-lg">+</span>
                  </button>
                </div>
              </div>

              {/* Infants */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-sm font-medium">{t('infants')}</div>
                  <div className="text-xs text-gray-500">
                    {t('infants_description')}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    onClick={() => handleInfantsChange(infants - 1)}
                  >
                    <span className="text-lg">-</span>
                  </button>
                  <span className="w-6 text-center">{infants}</span>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    onClick={() => handleInfantsChange(infants + 1)}
                  >
                    <span className="text-lg">+</span>
                  </button>
                </div>
              </div>

              {/* Done button */}
              <button
                type="button"
                className="w-full mt-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                {isRTL ? 'تم' : 'Done'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cabin Class Dropdown */}
      <div className="position-relative">
        <div
          className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-gray-900"
          onClick={() => setIsCabinOpen(!isCabinOpen)}
        >
          <span className="text-sm">{getCabinText()}</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {isCabinOpen && (
          <div
            className="absolute z-50 mt-1 min-w-[150px] bg-white rounded-lg shadow-lg border border-gray-200"
            style={{ top: '100%', left: 0 }}
          >
            <div className="py-2">
              <button
                type="button"
                className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 ${
                  cabinClass === 'ECONOMY'
                    ? 'text-primary font-medium'
                    : 'text-gray-700'
                }`}
                onClick={() => {
                  handleCabinClassChange('ECONOMY');
                  setIsCabinOpen(false);
                }}
              >
                {t('economy')}
              </button>
              <button
                type="button"
                className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 ${
                  cabinClass === 'BUSINESS'
                    ? 'text-primary font-medium'
                    : 'text-gray-700'
                }`}
                onClick={() => {
                  handleCabinClassChange('BUSINESS');
                  setIsCabinOpen(false);
                }}
              >
                {t('business')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightPassenger;
