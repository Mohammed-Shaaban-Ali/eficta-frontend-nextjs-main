'use client';

import { useTranslations, useLocale } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import useDebounce from '@/hooks/useDebounce';
import usePerfectScrollbar from '@/hooks/usePerfectScrollbar';
import { useGetAllAirportsQuery } from '@/reactQuery/airports.api';
import { airportTypes } from '@/types/app/airportTypes';

interface SearchBarProps {
  form: UseFormReturn<any>;
}

export interface FromAirportRef {
  setDisplayValue: (value: string) => void;
  getDisplayValue: () => string;
  getCity: () => string;
  setCity: (value: string) => void;
}

const FromAirport = forwardRef<FromAirportRef, SearchBarProps>(
  ({ form }, ref) => {
    const t = useTranslations('HomePage.hero_section.flight.location');
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const scrollRef = usePerfectScrollbar({
      suppressScrollX: true,
      wheelPropagation: false,
    });
    const dropdownToggleRef = useRef<HTMLDivElement>(null);
    const { setValue, watch } = form;
    const [displayValue, setDisplayValue] = useState('');
    const [city, setCity] = useState<string>('');
    const isInternalUpdateRef = useRef(false);
    const isUserTypingRef = useRef(false);
    const lastFormValueRef = useRef<string>('');
    const [searchById, setSearchById] = useState('');
    const debouncedSearch = useDebounce(displayValue, 500);
    const debouncedSearchById = useDebounce(searchById, 100);
    const formFromAirport = watch('fromAirport');

    // Search for airport by ID when form value exists but display value is empty (from localStorage)
    useEffect(() => {
      if (
        formFromAirport &&
        !displayValue &&
        !isUserTypingRef.current &&
        !isInternalUpdateRef.current
      ) {
        setSearchById(formFromAirport);
      } else if (!formFromAirport || displayValue) {
        setSearchById('');
      }
    }, [formFromAirport, displayValue]);

    const { data, isFetching } = useGetAllAirportsQuery({
      search: debouncedSearch || debouncedSearchById,
      page: '1',
    });
    const { items: airports } = data || {};

    // Auto-open dropdown when typing or when results are available
    useEffect(() => {
      if (typeof window !== 'undefined' && dropdownToggleRef.current) {
        const toggleElement = dropdownToggleRef.current;
        const hasResults = airports && airports.length > 0;
        // Check if airport is already selected (displayValue contains airport code in parentheses)
        const isAirportSelected =
          formFromAirport &&
          displayValue.includes('(') &&
          displayValue.includes(')');
        const shouldShow =
          (displayValue || debouncedSearch || debouncedSearchById) &&
          (hasResults || isFetching) &&
          !isAirportSelected;

        if (shouldShow && !isInternalUpdateRef.current) {
          // Use Bootstrap Dropdown API if available
          const bootstrap = (window as any).bootstrap;
          if (bootstrap) {
            const dropdown = bootstrap.Dropdown.getInstance(toggleElement);
            if (dropdown) {
              dropdown.show();
            } else {
              const newDropdown = new bootstrap.Dropdown(toggleElement);
              newDropdown.show();
            }
          } else {
            // Fallback: manually add show class
            const dropdownMenu =
              toggleElement.nextElementSibling as HTMLElement;
            if (
              dropdownMenu &&
              dropdownMenu.classList.contains('dropdown-menu')
            ) {
              dropdownMenu.classList.add('show');
              toggleElement.setAttribute('aria-expanded', 'true');
            }
          }
        }
      }
    }, [
      displayValue,
      airports,
      debouncedSearch,
      debouncedSearchById,
      isFetching,
      formFromAirport,
    ]);

    // Expose setDisplayValue, getDisplayValue, getCity, and setCity via ref
    useImperativeHandle(ref, () => ({
      setDisplayValue: (value: string) => {
        isInternalUpdateRef.current = true;
        setDisplayValue(value);
        // Reset flag after state update
        setTimeout(() => {
          isInternalUpdateRef.current = false;
        }, 0);
      },
      getDisplayValue: () => displayValue,
      getCity: () => city,
      setCity: (value: string) => {
        setCity(value);
      },
    }));

    // Sync displayValue with form value when changed externally (not from user typing)
    useEffect(() => {
      // Only sync if form value actually changed (not just airports array)
      if (formFromAirport === lastFormValueRef.current) {
        return;
      }

      if (isInternalUpdateRef.current || isUserTypingRef.current) {
        lastFormValueRef.current = formFromAirport;
        return;
      }

      // Update last form value
      lastFormValueRef.current = formFromAirport;

      // Only sync when formFromAirport changes externally
      if (formFromAirport) {
        // Find the airport in the current list
        const airport = airports?.find(
          (a: airportTypes) => a.id === formFromAirport,
        );
        if (airport) {
          const newDisplayValue = `${airport.name} (${airport.id})`;
          setDisplayValue((prev) =>
            prev !== newDisplayValue ? newDisplayValue : prev,
          );
          if (airport.city) {
            setCity(airport.city);
          }
        }
        // If airport not found in current list, don't clear displayValue
        // It might be from a previous search or the user is still typing
      } else {
        // Only clear if form value is empty and user is not typing
        setDisplayValue((prev) => (prev && !formFromAirport ? '' : prev));
      }
    }, [formFromAirport, airports]);

    const handleOptionClick = (item: airportTypes) => {
      isInternalUpdateRef.current = true;
      isUserTypingRef.current = false; // User selected, not typing
      lastFormValueRef.current = item.id;
      setValue('fromAirport', item.id);
      setDisplayValue(`${item.name} (${item.id})`);
      if (item.city) {
        setCity(item.city);
      }
      setTimeout(() => {
        isInternalUpdateRef.current = false;
      }, 0);
    };

    return (
      <>
        <div className="searchMenu-date lg:py-20 js-form-dd js-calendar">
          <div
            ref={dropdownToggleRef}
            data-bs-toggle="dropdown"
            data-bs-auto-close="true"
            data-bs-offset="0,22"
          >
            <div className="text-15 text-light-1 ls-2 lh-16 position-relative">
              <input
                autoComplete="off"
                type="search"
                placeholder={t('from_placeholder')}
                className="js-search js-dd-focus"
                value={displayValue}
                onFocus={() => {
                  if (
                    typeof window !== 'undefined' &&
                    dropdownToggleRef.current
                  ) {
                    const toggleElement = dropdownToggleRef.current;
                    const hasResults = airports && airports.length > 0;
                    // Check if airport is already selected (displayValue contains airport code in parentheses)
                    const isAirportSelected =
                      formFromAirport &&
                      displayValue.includes('(') &&
                      displayValue.includes(')');
                    const shouldShow =
                      (displayValue ||
                        debouncedSearch ||
                        debouncedSearchById) &&
                      (hasResults || isFetching) &&
                      !isAirportSelected;

                    if (shouldShow) {
                      const bootstrap = (window as any).bootstrap;
                      if (bootstrap) {
                        const dropdown =
                          bootstrap.Dropdown.getInstance(toggleElement);
                        if (dropdown) {
                          dropdown.show();
                        } else {
                          const newDropdown = new bootstrap.Dropdown(
                            toggleElement,
                          );
                          newDropdown.show();
                        }
                      } else {
                        const dropdownMenu =
                          toggleElement.nextElementSibling as HTMLElement;
                        if (
                          dropdownMenu &&
                          dropdownMenu.classList.contains('dropdown-menu')
                        ) {
                          dropdownMenu.classList.add('show');
                          toggleElement.setAttribute('aria-expanded', 'true');
                        }
                      }
                    }
                  }
                }}
                onChange={(e) => {
                  isUserTypingRef.current = true;
                  setDisplayValue(e.target.value);
                  if (!e.target.value) {
                    setValue('fromAirport', '');
                  }
                  // Reset flag after a delay to allow sync if needed
                  setTimeout(() => {
                    isUserTypingRef.current = false;
                  }, 600);
                }}
                style={{
                  paddingRight: displayValue ? '30px' : undefined,
                }}
              />
              {displayValue && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    isInternalUpdateRef.current = true;
                    isUserTypingRef.current = false;
                    setDisplayValue('');
                    setValue('fromAirport', '');
                    lastFormValueRef.current = '';
                    setTimeout(() => {
                      isInternalUpdateRef.current = false;
                    }, 0);
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
              )}
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
                        className={`-link d-block col-12 ${isRTL ? 'text-right' : 'text-left'} rounded-4 px-20 py-15 js-search-option mb-1 ${
                          displayValue === item.id ? 'active' : ''
                        }`}
                        key={item.id}
                        role="button"
                        onClick={() => handleOptionClick(item)}
                      >
                        <div className="d-flex">
                          <div className="icon-location-2 text-light-1 text-20 pt-4" />
                          <div className={isRTL ? 'mr-10' : 'ml-10'}>
                            <div className="text-15 lh-12 fw-500 js-search-option-target">
                              {item.name} ({item.id}) <br />{' '}
                              <span className="text-12 text-light-1">
                                {item.city}
                              </span>
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
  },
);

FromAirport.displayName = 'FromAirport';

export default FromAirport;
