'use client';

import React from 'react';
import DatePicker from 'react-multi-date-picker';
import type { Value } from 'react-multi-date-picker';
import DateObject from 'react-date-object';
import { UseFormReturn } from 'react-hook-form';
import { useTranslations, useLocale } from 'next-intl';
import gregorian from 'react-date-object/calendars/gregorian';
import gregorian_en from 'react-date-object/locales/gregorian_en';
import gregorian_ar from 'react-date-object/locales/gregorian_ar';

interface DateSearchProps {
  form: UseFormReturn<{
    checkIn: string;
    checkOut: string;
    [key: string]: any;
  }>;
}

const DateSearch: React.FC<DateSearchProps> = ({ form }) => {
  const t = useTranslations('HomePage.hero_section.hotel.date');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const { setValue, watch } = form;

  // Configure calendar based on locale - always use Gregorian calendar but display according to locale
  const calendarConfig = {
    calendar: gregorian,
    locale: isRTL ? gregorian_ar : gregorian_en,
  };

  const handleDateChange = (
    dates: DateObject[],
    {
      validatedValue,
      input,
      isTyping,
    }: {
      validatedValue: string | string[];
      input: HTMLElement;
      isTyping: boolean;
    },
  ) => {
    if (Array.isArray(dates) && dates.length === 2 && dates[0] && dates[1]) {
      const startDate = dates[0];
      const endDate = dates[1];

      // Convert to a standard ISO string format and then extract YYYY-MM-DD
      // This avoids locale-specific formatting issues
      const formatDateToYYYYMMDD = (date: DateObject) => {
        // Get year, month, day as numbers
        const year = date.year;
        // Month is 0-based in DateObject, so add 1
        const month = String(date.month).padStart(2, '0');
        const day = String(date.day).padStart(2, '0');

        return `${year}-${month}-${day}`;
      };

      const formattedStartDate = formatDateToYYYYMMDD(startDate);
      const formattedEndDate = formatDateToYYYYMMDD(endDate);

      setValue('checkIn', formattedStartDate, {
        shouldValidate: true,
      });
      setValue('checkOut', formattedEndDate, {
        shouldValidate: true,
      });
    }
  };

  // Display format should use locale
  const displayFormat = isRTL ? 'YYYY/MM/DD' : 'YYYY-MM-DD';

  return (
    <div className="searchMenu-date px-30 lg:py-20 lg:px-0 js-form-dd js-calendar">
      <div className="text-15 text-light-1 ls-2 lh-16 custom_dual_datepicker">
        <DatePicker
          inputClass="custom_input-picker"
          containerClassName="custom_container-picker"
          placeholder={t('placeholder')}
          numberOfMonths={2}
          offsetY={10}
          range
          rangeHover
          format={displayFormat}
          value={[watch('checkIn'), watch('checkOut')]}
          onChange={handleDateChange}
          calendar={calendarConfig.calendar}
          locale={calendarConfig.locale}
          calendarPosition={isRTL ? 'bottom-right' : 'bottom-left'}
        />
      </div>
    </div>
  );
};

export default DateSearch;
