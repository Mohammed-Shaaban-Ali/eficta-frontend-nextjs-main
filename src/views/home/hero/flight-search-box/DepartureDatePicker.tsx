'use client';

import React from 'react';
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

  return (
    <div className="searchMenu-date px-30 lg:py-20 lg:px-0 js-form-dd js-calendar">
      <div className="text-15 text-light-1 ls-2 lh-16 position-relative">
        <DatePicker
          selected={selectedDate}
          onChange={handleDepartureDateChange}
          placeholderText={t('departure_date')}
          dateFormat="yyyy-MM-dd"
          minDate={new Date()}
          className="custom_input-picker w-100"
          autoComplete="off"
          showPopperArrow={false}
          popperPlacement={isRTL ? 'bottom-end' : 'bottom-start'}
          isClearable={true}
          locale={isRTL ? 'ar' : 'en'}
          calendarClassName={isRTL ? 'rtl-calendar' : ''}
        />
        {/* {currentValue && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setValue('departureDate', '', { shouldValidate: true });
            }}
            className="position-absolute"
            style={{
              right: isRTL ? undefined : '8px',
              left: isRTL ? '8px' : undefined,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
            aria-label={isRTL ? 'مسح' : 'Clear'}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="#666"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )} */}
      </div>
    </div>
  );
};

export default DepartureDatePicker;
