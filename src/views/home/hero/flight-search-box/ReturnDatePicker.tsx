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

interface ReturnDatePickerProps {
  form: UseFormReturn<any>;
}

const ReturnDatePicker: React.FC<ReturnDatePickerProps> = ({ form }) => {
  const t = useTranslations('HomePage.hero_section.flight.date');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const { setValue, watch } = form;
  const [isFocused, setIsFocused] = useState(false);

  const departureDate = watch('departureDate');
  const currentValue = watch('returnDate');

  const handleReturnDateChange = (date: Date | null) => {
    if (date) {
      // Format date in local timezone to avoid timezone offset issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setValue('returnDate', formattedDate, { shouldValidate: true });
    } else {
      setValue('returnDate', '', { shouldValidate: true });
    }
  };

  // Helper function to parse and validate date string
  const parseDate = (dateString: string | undefined | null): Date | null => {
    if (!dateString || typeof dateString !== 'string') {
      return null;
    }

    try {
      const parts = dateString.split('-');
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
      console.error('Error parsing date:', error);
      return null;
    }
  };

  // Parse date string in local timezone to avoid timezone offset issues
  const selectedDate = React.useMemo(() => {
    return parseDate(currentValue);
  }, [currentValue]);

  const minDate = React.useMemo(() => {
    const parsed = parseDate(departureDate);
    return parsed || new Date();
  }, [departureDate]);

  const isActive = isFocused || !!currentValue;

  return (
    <div className="searchMenu-date js-form-dd js-calendar">
      <div
        className="relative flex items-center px-4! h-[64px]! 
         bg-white!   rounded-r-lg! border! border-transparent!  
        hover:border hover:border-gray-500! transition-all! duration-300"
      >
        <label
          htmlFor="returnDate"
          className={`absolute transition-all duration-200 pointer-events-none ${
            isActive
              ? 'top-2! text-[11px]! text-gray-500!'
              : 'top-1/2! -translate-y-1/2! text-[15px]! text-gray-400!'
          }`}
        >
          {t('return_date')}
        </label>
        <DatePicker
          id="returnDate"
          selected={selectedDate}
          onChange={handleReturnDateChange}
          dateFormat="yyyy-MM-dd"
          minDate={minDate}
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

export default ReturnDatePicker;
