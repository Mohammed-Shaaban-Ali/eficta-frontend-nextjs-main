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
      const formattedDate = date.toISOString().split('T')[0];
      setValue('departureDate', formattedDate, { shouldValidate: true });
    } else {
      setValue('departureDate', '', { shouldValidate: true });
    }
  };

  const currentValue = watch('departureDate');
  const selectedDate = currentValue ? new Date(currentValue) : null;

  return (
    <div className="searchMenu-date px-30 lg:py-20 lg:px-0 js-form-dd js-calendar">
      <div className="text-15 text-light-1 ls-2 lh-16">
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
      </div>
    </div>
  );
};

export default DepartureDatePicker;
