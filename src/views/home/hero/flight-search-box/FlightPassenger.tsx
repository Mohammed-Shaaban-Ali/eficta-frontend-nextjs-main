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
    <div className="flex items-center gap-2">
      {/* Passengers Dropdown */}
      <div className="searchMenu-guests js-form-dd js-form-counters position-relative">
        <div
          className="
            p-2 hover:bg-gray-100! rounded-lg! transition-all duration-300
          flex items-center gap-1 cursor-pointer text-gray-700 hover:text-gray-900"
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
              className="p-3"
              style={{
                maxHeight: '400px',
                position: 'relative',
                overflow: 'auto',
              }}
              ref={scrollRef}
            >
              {/* Adults */}
              <div className="flex items-center gap-3 mb-3!">
                {/* Icon */}
                <div className="shrink-0">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                {/* Text */}
                <div className="flex-1">
                  <div className="text-sm font-medium">{t('adults')}</div>
                  <div className="text-xs text-gray-500">
                    {t('adults_description')}
                  </div>
                </div>
                {/* Controls */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                      adults <= 1
                        ? 'bg-gray-300! cursor-not-allowed'
                        : 'bg-gray-300! hover:bg-gray-400!'
                    }`}
                    onClick={() => handleAdultChange(adults - 1)}
                    disabled={adults <= 1}
                  >
                    <span className="text-white text-lg font-medium">-</span>
                  </button>
                  <span className="w-8 text-center text-sm font-medium">
                    {adults}
                  </span>
                  <button
                    type="button"
                    className="w-6 h-6 rounded bg-primary hover:opacity-90 flex items-center justify-center transition-colors"
                    onClick={() => handleAdultChange(adults + 1)}
                  >
                    <span className="text-white text-lg font-medium">+</span>
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center gap-3 mb-3!">
                {/* Icon */}
                <div className="shrink-0">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                {/* Text */}
                <div className="flex-1">
                  <div className="text-sm font-medium">{t('children')}</div>
                  <div className="text-xs text-gray-500">
                    {t('children_description')}
                  </div>
                </div>
                {/* Controls */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                      children <= 0
                        ? 'bg-gray-300! cursor-not-allowed'
                        : 'bg-gray-300! hover:bg-gray-400!'
                    }`}
                    onClick={() => handleChildrenChange(children - 1)}
                    disabled={children <= 0}
                  >
                    <span className="text-white text-lg font-medium">-</span>
                  </button>
                  <span className="w-8 text-center text-sm font-medium">
                    {children}
                  </span>
                  <button
                    type="button"
                    className="w-6 h-6 rounded bg-primary hover:opacity-90 flex items-center justify-center transition-colors"
                    onClick={() => handleChildrenChange(children + 1)}
                  >
                    <span className="text-white text-lg font-medium">+</span>
                  </button>
                </div>
              </div>

              {/* Infants */}
              <div className="flex items-center gap-3 mb-3!">
                {/* Icon */}
                <div className="shrink-0">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                {/* Text */}
                <div className="flex-1">
                  <div className="text-sm font-medium">{t('infants')}</div>
                  <div className="text-xs text-gray-500">
                    {t('infants_description')}
                  </div>
                </div>
                {/* Controls */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                      infants <= 0
                        ? 'bg-gray-300! cursor-not-allowed'
                        : 'bg-gray-300! hover:bg-gray-400!'
                    }`}
                    onClick={() => handleInfantsChange(infants - 1)}
                    disabled={infants <= 0}
                  >
                    <span className="text-white text-lg font-medium">-</span>
                  </button>
                  <span className="w-8 text-center text-sm font-medium">
                    {infants}
                  </span>
                  <button
                    type="button"
                    className="w-6 h-6 rounded bg-primary hover:opacity-90 flex items-center justify-center transition-colors"
                    onClick={() => handleInfantsChange(infants + 1)}
                  >
                    <span className="text-white text-lg font-medium">+</span>
                  </button>
                </div>
              </div>

              {/* Apply button */}
              <div className="flex justify-end mt-4! border-t! border-gray-300! pt-1!">
                <button
                  type="button"
                  className="
                      p-2 py-1 hover:bg-gray-100! rounded-lg! transition-all duration-300
                  text-primary text-sm font-medium "
                  onClick={() => setIsOpen(false)}
                >
                  {isRTL ? 'تطبيق' : 'Apply'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cabin Class Dropdown */}
      <div className="position-relative">
        <div
          className="
          p-2 hover:bg-gray-100! rounded-lg! transition-all duration-300
          flex items-center gap-1 cursor-pointer text-gray-700 hover:text-gray-900"
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
            <div className="p-2 ">
              <button
                type="button"
                className={`
                    p-2 hover:bg-gray-100! rounded-lg! transition-all duration-300
                  w-full text-sm text-left  ${
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
                className={`w-full p-2 hover:bg-gray-100! rounded-lg! transition-all duration-300 text-sm text-left  ${
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
