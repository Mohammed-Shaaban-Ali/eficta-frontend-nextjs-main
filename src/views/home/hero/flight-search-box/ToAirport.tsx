'use client';

import { useTranslations, useLocale } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import usePerfectScrollbar from '@/hooks/usePerfectScrollbar';
import { useGetAllAirportsQuery } from '@/reactQuery/airports.api';
import { airportTypes } from '@/types/app/airportTypes';

interface SearchBarProps {
  form: UseFormReturn<any>;
}

const ToAirport = ({ form }: SearchBarProps) => {
  const t = useTranslations('HomePage.hero_section.flight.location');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const scrollRef = usePerfectScrollbar({
    suppressScrollX: true,
    wheelPropagation: false,
  });
  const { setValue, watch } = form;
  const [displayValue, setDisplayValue] = useState('');
  const debouncedSearch = useDebounce(displayValue, 500);

  const { data, isFetching } = useGetAllAirportsQuery({
    search: debouncedSearch,
    page: '1',
  });
  const { data: airports } = data || {};

  const handleOptionClick = (item: airportTypes) => {
    setValue('toAirport', item.iata_code);
    setDisplayValue(`${item.name} (${item.iata_code})`);
  };

  return (
    <>
      <div className="searchMenu-date lg:py-20 js-form-dd js-calendar">
        <div
          data-bs-toggle="dropdown"
          data-bs-auto-close="true"
          data-bs-offset="0,22"
        >
          <div className="text-15 text-light-1 ls-2 lh-16">
            <input
              autoComplete="off"
              type="search"
              placeholder={t('to_placeholder')}
              className="js-search js-dd-focus"
              value={displayValue}
              onChange={(e) => {
                setDisplayValue(e.target.value);
                if (!e.target.value) {
                  setValue('toAirport', '');
                }
              }}
            />
          </div>
        </div>
        <div className="shadow-2 dropdown-menu min-width-400">
          <div className="bg-white sm:px-0 sm:py-15 rounded-4">
            <div
              ref={scrollRef}
              style={{ position: 'relative', maxHeight: '400px' }}
            >
              {isFetching ? (
                <div className="d-flex justify-content-center align-items-center p-4">
                  <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">{t('loading')}</span>
                  </div>
                </div>
              ) : (
                <ul className="y-gap-5 js-results">
                  {airports?.map((item: airportTypes) => (
                    <li
                      className={`-link d-block col-12 ${isRTL ? 'text-right' : 'text-left'} rounded-4 px-20 py-15 js-search-option mb-1`}
                      key={item.iata_code}
                      role="button"
                      onClick={() => handleOptionClick(item)}
                    >
                      <div className="d-flex">
                        <div className="icon-location-2 text-light-1 text-20 pt-4" />
                        <div className={isRTL ? 'mr-10' : 'ml-10'}>
                          <div className="text-15 lh-12 fw-500 js-search-option-target">
                            {item.name} ({item.iata_code})
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToAirport;
