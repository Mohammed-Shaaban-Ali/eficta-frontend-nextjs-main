'use client';

import toast from 'react-hot-toast';
import { getError } from '@/utils/getError';
import { useForm } from 'react-hook-form';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useCallback, useRef, useState, useEffect } from 'react';
import FromAirport, { FromAirportRef } from './FromAirport';
import ToAirport, { ToAirportRef } from './ToAirport';
import FlightPassenger from './FlightPassenger';
import DepartureDatePicker from './DepartureDatePicker';
import ReturnDatePicker from './ReturnDatePicker';
import { joiResolver } from '@hookform/resolvers/joi';
import { flightSearchFormSchema } from '@/validations/FlightsearchFormSchema';

interface FlightSearchParams {
  fromAirport: string;
  toAirport: string;
  departureDate: string;
  returnDate?: string;
  tripType: 'roundTrip' | 'oneWay';
  adults: number;
  children: number;
  infants: number;
  cabinClass: 'ECONOMY' | 'BUSINESS';
}

const FlightSearchBox = () => {
  const t = useTranslations('HomePage.hero_section.hotel');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const Router = useRouter();

  const form = useForm<FlightSearchParams>({
    resolver: joiResolver(flightSearchFormSchema),
    defaultValues: {
      fromAirport: '',
      toAirport: '',
      departureDate: '',
      returnDate: '',
      tripType: 'roundTrip',
      adults: 1,
      children: 0,
      infants: 0,
      cabinClass: 'ECONOMY',
    },
  });

  const tripType = form.watch('tripType');
  const fromAirportRef = useRef<FromAirportRef | null>(null);
  const toAirportRef = useRef<ToAirportRef | null>(null);
  const [isSwapHovered, setIsSwapHovered] = useState(false);

  // Load saved search data from localStorage on mount (client-side only)
  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window === 'undefined') return;

    // Delay to ensure hydration is complete and refs are ready
    const timer = setTimeout(() => {
      try {
        const savedData = localStorage.getItem('flightSearch');
        if (savedData) {
          const parsedData = JSON.parse(savedData) as FlightSearchParams & {
            fromAirportDisplay?: string;
            toAirportDisplay?: string;
            fromAirportCity?: string;
            toAirportCity?: string;
          };

          // Restore form values first
          if (parsedData.fromAirport) {
            form.setValue('fromAirport', parsedData.fromAirport, {
              shouldValidate: false,
            });
          }
          if (parsedData.toAirport) {
            form.setValue('toAirport', parsedData.toAirport, {
              shouldValidate: false,
            });
          }

          // Restore display values and city after a small delay to ensure refs are ready
          setTimeout(() => {
            if (parsedData.fromAirportDisplay && fromAirportRef.current) {
              fromAirportRef.current.setDisplayValue(
                parsedData.fromAirportDisplay,
              );
            }
            if (parsedData.fromAirportCity && fromAirportRef.current) {
              fromAirportRef.current.setCity(parsedData.fromAirportCity);
            }
            if (parsedData.toAirportDisplay && toAirportRef.current) {
              toAirportRef.current.setDisplayValue(parsedData.toAirportDisplay);
            }
            if (parsedData.toAirportCity && toAirportRef.current) {
              toAirportRef.current.setCity(parsedData.toAirportCity);
            }
          }, 50);
          if (parsedData.departureDate) {
            form.setValue('departureDate', parsedData.departureDate, {
              shouldValidate: false,
            });
          }
          if (parsedData.returnDate) {
            form.setValue('returnDate', parsedData.returnDate, {
              shouldValidate: false,
            });
          }
          if (parsedData.tripType) {
            form.setValue('tripType', parsedData.tripType, {
              shouldValidate: false,
            });
          }
          if (parsedData.adults !== undefined) {
            form.setValue('adults', parsedData.adults, {
              shouldValidate: false,
            });
          }
          if (parsedData.children !== undefined) {
            form.setValue('children', parsedData.children, {
              shouldValidate: false,
            });
          }
          if (parsedData.infants !== undefined) {
            form.setValue('infants', parsedData.infants, {
              shouldValidate: false,
            });
          }
          if (parsedData.cabinClass) {
            form.setValue('cabinClass', parsedData.cabinClass, {
              shouldValidate: false,
            });
          }

          // Restore display values for airports (need to fetch airport names)
          // This will be handled by the components' useEffect when they detect form values
        }
      } catch (error) {
        console.error('Error loading saved search data:', error);
      }
    }, 100); // Small delay to ensure hydration is complete

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const handleTripTypeChange = (type: 'roundTrip' | 'oneWay') => {
    form.setValue('tripType', type);
    if (type === 'oneWay') {
      form.setValue('returnDate', '');
    }
  };

  const handleSwapAirports = useCallback(() => {
    const fromAirport = form.getValues('fromAirport');
    const toAirport = form.getValues('toAirport');

    // Get current display values
    const fromDisplayValue = fromAirportRef.current?.getDisplayValue() || '';
    const toDisplayValue = toAirportRef.current?.getDisplayValue() || '';

    // Swap form values
    form.setValue('fromAirport', toAirport, { shouldValidate: false });
    form.setValue('toAirport', fromAirport, { shouldValidate: false });

    // Swap display values
    if (fromAirportRef.current && toAirportRef.current) {
      fromAirportRef.current.setDisplayValue(toDisplayValue);
      toAirportRef.current.setDisplayValue(fromDisplayValue);
    }
  }, [form]);

  // Helper function to format date to yyyy-MM-dd format
  const formatDateToString = (
    date: string | Date | null | undefined,
  ): string => {
    if (!date) return '';

    // If it's already a string in the correct format, return it
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    // If it's a Date object, format it
    let dateObj: Date;
    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'string') {
      // Try to parse the string
      const parsed = new Date(date);
      if (isNaN(parsed.getTime())) {
        return '';
      }
      dateObj = parsed;
    } else {
      return '';
    }

    // Format to yyyy-MM-dd
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const onSubmit = async (data: FlightSearchParams) => {
    try {
      // Format dates to string format
      const formattedData: FlightSearchParams = {
        ...data,
        departureDate: formatDateToString(data.departureDate),
        returnDate: data.returnDate
          ? formatDateToString(data.returnDate)
          : undefined,
      };

      // Create URLSearchParams object
      const searchParams = new URLSearchParams();

      // Add flight search parameters
      if (formattedData.fromAirport)
        searchParams.append('fromAirport', formattedData.fromAirport);
      if (formattedData.toAirport)
        searchParams.append('toAirport', formattedData.toAirport);
      if (formattedData.departureDate)
        searchParams.append('departureDate', formattedData.departureDate);
      if (formattedData.tripType)
        searchParams.append('tripType', formattedData.tripType);
      if (formattedData.returnDate && formattedData.tripType === 'roundTrip')
        searchParams.append('returnDate', formattedData.returnDate);
      if (formattedData.adults)
        searchParams.append('adults', formattedData.adults.toString());
      if (formattedData.children && formattedData.children > 0)
        searchParams.append('children', formattedData.children.toString());
      if (formattedData.infants && formattedData.infants > 0)
        searchParams.append('infants', formattedData.infants.toString());
      if (formattedData.cabinClass)
        searchParams.append('cabinClass', formattedData.cabinClass);

      // Get display values and city names for airports before saving
      const fromDisplayValue = fromAirportRef.current?.getDisplayValue() || '';
      const toDisplayValue = toAirportRef.current?.getDisplayValue() || '';
      const fromCity = fromAirportRef.current?.getCity() || '';
      const toCity = toAirportRef.current?.getCity() || '';

      // Add city names to URL params
      if (fromCity) {
        searchParams.append('fromAirportCity', fromCity);
      }
      if (toCity) {
        searchParams.append('toAirportCity', toCity);
      }

      // Save to localStorage with display values
      const dataToSave = {
        ...formattedData,
        fromAirportDisplay: fromDisplayValue,
        toAirportDisplay: toDisplayValue,
        fromAirportCity: fromCity,
        toAirportCity: toCity,
      };
      localStorage.setItem('flightSearch', JSON.stringify(dataToSave));

      // Navigate to flight search page with query params
      Router.push(`/search/flights?${searchParams.toString()}`);
    } catch (error) {
      toast.error(getError(error));
    }
  };

  const onError = (errors: any) => {
    const errorMessages = Object.values(errors)
      .map((error: any) => error.message)
      .join('\n');
    toast.error(errorMessages);
  };

  return (
    <>
      <div className="position-relative mt-30 md:mt-20 js-tabs-content">
        <div className="container">
          {/* Trip Type Selector */}
          <div
            className="w-fit rounded-top p-2 mb-0 d-flex gap-2"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px 12px 0 0',
              width: 'fit-content',
            }}
          >
            <button
              type="button"
              onClick={() => handleTripTypeChange('roundTrip')}
              className="flex-1"
              style={{
                backgroundColor:
                  tripType === 'roundTrip' ? '#007bff' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                padding: '8px 16px',
                color: tripType === 'roundTrip' ? '#ffffff' : '#000000',
                cursor: 'pointer',
              }}
            >
              {isRTL ? 'ذهاب وعودة' : 'Round Trip'}
            </button>
            <button
              type="button"
              onClick={() => handleTripTypeChange('oneWay')}
              className="flex-1"
              style={{
                backgroundColor:
                  tripType === 'oneWay' ? '#007bff' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                padding: '8px 16px',
                color: tripType === 'oneWay' ? '#ffffff' : '#000000',
                cursor: 'pointer',
              }}
            >
              {isRTL ? 'ذهاب فقط' : 'One Way'}
            </button>
          </div>

          <div
            className="bg-white  search-container"
            style={{
              borderRadius: '0 12px 12px 12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="row h-100 align-items-center"
              style={{ width: '100%' }}
            >
              <div className="col-md search-column">
                <FromAirport form={form} ref={fromAirportRef} />
              </div>
              <div className="col-md-auto d-flex align-items-center justify-content-center px-2">
                <button
                  type="button"
                  onClick={handleSwapAirports}
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: isSwapHovered ? '#007bff' : '#f0f0f0',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: '0',
                  }}
                  onMouseEnter={() => setIsSwapHovered(true)}
                  onMouseLeave={() => setIsSwapHovered(false)}
                  aria-label={isRTL ? 'تبديل المطارات' : 'Swap airports'}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 7L16 7M16 7L13 4M16 7L13 10M16 17L8 17M8 17L11 20M8 17L11 14"
                      stroke={isSwapHovered ? '#ffffff' : '#007bff'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ transition: 'stroke 0.3s ease' }}
                    />
                  </svg>
                </button>
              </div>
              <div className="col-md search-column">
                <ToAirport form={form} ref={toAirportRef} />
              </div>
              <div className="col-md search-column">
                <DepartureDatePicker form={form} />
              </div>
              {tripType === 'roundTrip' && (
                <div className="col-md search-column">
                  <ReturnDatePicker form={form} />
                </div>
              )}
              <div className="col-md search-column">
                <FlightPassenger form={form} />
              </div>
              <div className="col-md-auto d-flex items-content-center p-2">
                <button type="submit" className="btn btn-primary w-100">
                  {t('search')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlightSearchBox;
