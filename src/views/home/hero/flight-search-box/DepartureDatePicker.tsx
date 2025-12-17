'use client';

import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { UseFormReturn } from 'react-hook-form';
import { useTranslations, useLocale } from 'next-intl';
import { ar } from 'date-fns/locale/ar';
import { enUS as en } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

// Register locales
registerLocale('ar', ar);
registerLocale('en', en);

interface DepartureDatePickerProps {
  form: UseFormReturn<any>;
}

const DepartureDatePicker: React.FC<DepartureDatePickerProps> = ({ form }) => {
  const t = useTranslations('HomePage.hero_section.flight.date');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const { setValue, watch } = form;
  const [isFocused, setIsFocused] = useState(false);

  const handleDepartureDateChange = (date: Date | null) => {
    if (date) {
      // Format date in local timezone to avoid timezone offset issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setValue('departureDate', formattedDate, { shouldValidate: true });
    } else {
      setValue('departureDate', '', { shouldValidate: true });
    }
  };

  const currentValue = watch('departureDate');
  // Parse date string in local timezone to avoid timezone offset issues
  const selectedDate = React.useMemo(() => {
    if (!currentValue || typeof currentValue !== 'string') {
      return null;
    }

    try {
      const parts = currentValue.split('-');
      if (parts.length !== 3) {
        return null;
      }

      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);

      // Validate date values
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return null;
      }

      if (year < 1900 || year > 2100) {
        return null;
      }

      if (month < 1 || month > 12) {
        return null;
      }

      if (day < 1 || day > 31) {
        return null;
      }

      const date = new Date(year, month - 1, day);

      // Check if date is valid
      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      ) {
        return null;
      }

      return date;
    } catch (error) {
      console.error('Error parsing departure date:', error);
      return null;
    }
  }, [currentValue]);

  const isActive = isFocused || !!currentValue;

  return (
    <div className="searchMenu-date  js-form-dd js-calendar">
      <div
        className="relative flex items-center px-4! h-[64px]! bg-white! border border-transparent!
         border-r! border-r-gray-300!  rounded-l-lg!
        hover:border hover:border-gray-500! transition-all duration-300"
      >
        <label
          htmlFor="departureDate"
          className={`absolute transition-all duration-200 pointer-events-none ${
            isActive
              ? 'top-2! text-[11px]! text-gray-500!'
              : 'top-1/2! -translate-y-1/2! text-[15px]! text-gray-400!'
          }`}
        >
          {t('departure_date')}
        </label>
        <DatePicker
          id="departureDate"
          selected={selectedDate}
          onChange={handleDepartureDateChange}
          dateFormat="yyyy-MM-dd"
          minDate={new Date()}
          className={`w-full! text-[15px]! font-medium! text-gray-900! bg-transparent! border-none! outline-none! p-0! ${
            isActive ? 'mt-4!' : ''
          }`}
          autoComplete="off"
          showPopperArrow={false}
          popperPlacement={isRTL ? 'bottom-end' : 'bottom-start'}
          isClearable={true}
          locale={isRTL ? 'ar' : 'en'}
          calendarClassName={isRTL ? 'rtl-calendar' : ''}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    </div>
  );
};

export default DepartureDatePicker;
