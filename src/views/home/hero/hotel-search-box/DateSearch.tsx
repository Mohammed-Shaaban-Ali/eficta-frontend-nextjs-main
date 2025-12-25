'use client';

import React, { useRef, useEffect } from 'react';
import DatePicker, { DatePickerRef } from 'react-multi-date-picker';
import type { Value } from 'react-multi-date-picker';
import DateObject from 'react-date-object';
import { UseFormReturn } from 'react-hook-form';
import { useTranslations, useLocale } from 'next-intl';
import gregorian from 'react-date-object/calendars/gregorian';
import gregorian_en from 'react-date-object/locales/gregorian_en';
import gregorian_ar from 'react-date-object/locales/gregorian_ar';
import { RiCalendar2Fill } from 'react-icons/ri';
import { BsCalendar2DateFill } from 'react-icons/bs';

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
  const datePickerRef = useRef<DatePickerRef>(null);

  // Set default dates on mount: check-in = today, check-out = tomorrow
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (!form.getValues('checkIn')) {
      setValue('checkIn', formatDate(today));
    }
    if (!form.getValues('checkOut')) {
      setValue('checkOut', formatDate(tomorrow));
    }
  }, [setValue, form]);

  // Minimum date is today
  const minDate = new DateObject();

  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');

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

  // Format date for display like "Wed, 17 Dec 2025"
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return t('placeholder');
    const date = new Date(dateStr);
    return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const openDatePicker = () => {
    datePickerRef.current?.openCalendar();
  };

  return (
    <div className="searchMenu-date col-span-2 js-form-dd js-calendar">
      <div
        className="flex items- rounded-lg! h-[64px]! 
         transition-all duration-300 cursor-pointer"
        onClick={openDatePicker}
      >
        {/* Check In */}
        <div className="flex-1 px-3! py-2! flex flex-col justify-center">
          <div className=" font-semibold!  text-[#737373]! mb-0!">Check In</div>
          <div className="font-bold! text-black! -mt-1! flex items-center gap-1 text-nowrap">
            <BsCalendar2DateFill size={18} className="text-[#737373]" />
            {formatDisplayDate(checkIn)}
          </div>
        </div>

        {/* Divider */}
        {/* <div className="w-px h-[64px] bg-gray-300" /> */}

        {/* Check Out */}
        <div className="flex-1 px-3! py-2 flex flex-col justify-center">
          <div className=" font-semibold!  text-[#737373]! mb-0!">
            Check Out
          </div>
          <div className="font-bold! text-black! -mt-1! flex items-center gap-1 text-nowrap">
            <BsCalendar2DateFill size={18} className="text-[#737373] " />
            {formatDisplayDate(checkOut)}
          </div>
        </div>
      </div>

      {/* Hidden DatePicker */}
      <DatePicker
        ref={datePickerRef}
        containerClassName="custom_container-picker"
        numberOfMonths={2}
        offsetY={10}
        range
        rangeHover
        format="YYYY-MM-DD"
        value={[checkIn, checkOut]}
        onChange={handleDateChange}
        calendar={calendarConfig.calendar}
        locale={calendarConfig.locale}
        calendarPosition={isRTL ? 'bottom-right' : 'bottom-left'}
        minDate={minDate}
        render={<></>}
      />
    </div>
  );
};

export default DateSearch;
