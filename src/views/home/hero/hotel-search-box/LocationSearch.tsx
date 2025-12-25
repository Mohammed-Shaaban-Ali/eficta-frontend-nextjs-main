'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useGetAllCitiesQuery } from '@/reactQuery/cities.api';
import { cityTypes } from '@/types/app/cityTypes';
import { UseFormReturn } from 'react-hook-form';
import useDebounce from '@/hooks/useDebounce';
import usePerfectScrollbar from '@/hooks/usePerfectScrollbar';
import { RiMapPin2Fill } from 'react-icons/ri';

interface SearchBarProps {
  form: UseFormReturn<any>;
}

const SearchBar = ({ form }: SearchBarProps) => {
  const t = useTranslations('HomePage.hero_section.hotel.location');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [isFocused, setIsFocused] = useState(false);
  const scrollRef = usePerfectScrollbar({
    suppressScrollX: true,
    wheelPropagation: false,
  });
  const { register, setValue, watch } = form;
  const selectedLocation = watch('location');
  const searchValue = watch('searchValue');
  const debouncedSearch = useDebounce(searchValue, 500);

  const { data, isFetching } = useGetAllCitiesQuery({
    code: '',
    name: debouncedSearch,
  });
  const { data: cities } = data || {};

  const handleOptionClick = (item: cityTypes) => {
    setValue('searchValue', item.name);
    setValue('location', {
      latitude: item.latitude,
      longitude: item.longitude,
    });
  };

  const hasValue = searchValue && searchValue.length > 0;
  const isActive = isFocused || hasValue;

  return (
    <>
      <div className="searchMenu-date  col-span-1 sm:col-span-2 md:col-span-1 js-form-dd js-calendar">
        <div
          data-bs-toggle="dropdown"
          data-bs-auto-close="true"
          data-bs-offset="0,22"
        >
          {/* label */}
          <div
            className="relative flex items-center  px-4! h-[64px] bg-transparent!
           transition-all duration-300"
          >
            <label
              htmlFor="searchValue"
              className={`absolute transition-all font-semibold! duration-200 pointer-events-none ${
                isActive
                  ? '-top-0.5!  text-[#737373]!'
                  : 'top-1/2! -translate-y-1/2! text-[#737373]!'
              }`}
            >
              Destination
            </label>
            <div className="flex items-center gap-1 relative ">
              <RiMapPin2Fill
                size={20}
                className={` 
                  absolute top-[19px]!  left-0
                  ${isActive ? 'text-[#737373]' : 'text-transparent'}`}
              />
              <input
                autoComplete="off"
                type="search"
                className={`js-search js-dd-focus w-full font-bold! text-black! bg-transparent! border-none! outline-none! p-0! ${
                  isActive ? 'mt-4! pl-6!' : ''
                }`}
                {...register('searchValue')}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </div>
          </div>
        </div>
        <div className="shadow-2 dropdown-menu min-width-400 ">
          <div className="bg-white sm:px-0 rounded-4">
            <div
              ref={scrollRef}
              style={{ position: 'relative', maxHeight: '400px' }}
            >
              {isFetching ? (
                <div className="d-flex justify-content-center align-items-center p-4">
                  <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <ul className="y-gap-5 js-results">
                  {cities?.map((item: cityTypes) => (
                    <li
                      className={`-link d-block col-12
                        cursor-pointer hover:bg-gray-100 transition-all duration-300
                        ${isRTL ? 'text-right' : 'text-left'} rounded-4 px-20 py-15 js-search-option mb-1 ${
                          selectedLocation?.latitude === item.latitude &&
                          selectedLocation?.longitude === item.longitude
                            ? 'active'
                            : ''
                        }`}
                      key={item.id}
                      role="button"
                      onClick={() => handleOptionClick(item)}
                    >
                      <div className="d-flex">
                        <div className="icon-location-2 text-light-1 text-20 pt-4" />
                        <div className={isRTL ? 'mr-10' : 'ml-10'}>
                          <div className="text-15 lh-12 fw-500 js-search-option-target">
                            {item.name}
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

export default SearchBar;
