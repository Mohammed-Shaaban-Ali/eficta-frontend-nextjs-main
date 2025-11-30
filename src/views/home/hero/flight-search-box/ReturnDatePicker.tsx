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

interface ReturnDatePickerProps {
  form: UseFormReturn<any>;
}

const ReturnDatePicker: React.FC<ReturnDatePickerProps> = ({ form }) => {
  const t = useTranslations('HomePage.hero_section.flight.date');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const { setValue, watch } = form;

  const departureDate = watch('departureDate');
  const currentValue = watch('returnDate');

  const handleReturnDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      setValue('returnDate', formattedDate, { shouldValidate: true });
    } else {
      setValue('returnDate', '', { shouldValidate: true });
    }
  };

  const selectedDate = currentValue ? new Date(currentValue) : null;
  const minDate = departureDate ? new Date(departureDate) : new Date();

  return (
    <div className="searchMenu-date px-30 lg:py-20 lg:px-0 js-form-dd js-calendar">
      <div className="text-15 text-light-1 ls-2 lh-16">
        <DatePicker
          selected={selectedDate}
          onChange={handleReturnDateChange}
          placeholderText={t('return_date')}
          dateFormat="yyyy-MM-dd"
          minDate={minDate}
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

export default ReturnDatePicker;
