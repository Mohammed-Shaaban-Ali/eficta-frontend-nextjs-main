'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useGetAllCitiesQuery } from '@/reactQuery/cities.api';
import { cityTypes } from '@/types/app/cityTypes';
import { UseFormReturn } from 'react-hook-form';
import useDebounce from '@/hooks/useDebounce';
import usePerfectScrollbar from '@/hooks/usePerfectScrollbar';

interface SearchBarProps {
  form: UseFormReturn<any>;
}

const SearchBar = ({ form }: SearchBarProps) => {
  const t = useTranslations('HomePage.hero_section.hotel.location');
  const locale = useLocale();
  const isRTL = locale === 'ar';
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
              placeholder={t('placeholder')}
              className="js-search js-dd-focus"
              {...register('searchValue')}
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
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <ul className="y-gap-5 js-results">
                  {cities?.map((item: cityTypes) => (
                    <li
                      className={`-link d-block col-12 ${isRTL ? 'text-right' : 'text-left'} rounded-4 px-20 py-15 js-search-option mb-1 ${
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
