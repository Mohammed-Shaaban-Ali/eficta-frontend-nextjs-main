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
  const savedReturnDateRef = useRef<string | undefined>(undefined);

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
            // Also save to ref so it can be restored when switching trip types
            savedReturnDateRef.current = parsedData.returnDate;
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
    const currentTripType = form.getValues('tripType');
    const currentReturnDate = form.getValues('returnDate');

    if (currentTripType === 'roundTrip' && type === 'oneWay') {
      // Save the return date before clearing it
      if (currentReturnDate) {
        savedReturnDateRef.current = currentReturnDate;
      }
      form.setValue('tripType', type);
      form.setValue('returnDate', '');
    } else if (currentTripType === 'oneWay' && type === 'roundTrip') {
      // Restore the saved return date when switching back to round trip
      form.setValue('tripType', type);
      if (savedReturnDateRef.current) {
        form.setValue('returnDate', savedReturnDateRef.current, {
          shouldValidate: false,
        });
      }
    } else {
      // Same type, just update it
      form.setValue('tripType', type);
    }
  };

  const handleSwapAirports = useCallback(() => {
    const fromAirport = form.getValues('fromAirport');
    const toAirport = form.getValues('toAirport');

    // Get current display values
    const fromDisplayValue = fromAirportRef.current?.getDisplayValue() || '';
    const toDisplayValue = toAirportRef.current?.getDisplayValue() || '';

    // Get current city values
    const fromCity = fromAirportRef.current?.getCity() || '';
    const toCity = toAirportRef.current?.getCity() || '';

    // Swap form values
    form.setValue('fromAirport', toAirport, { shouldValidate: false });
    form.setValue('toAirport', fromAirport, { shouldValidate: false });

    // Swap display values and city values
    if (fromAirportRef.current && toAirportRef.current) {
      fromAirportRef.current.setDisplayValue(toDisplayValue);
      toAirportRef.current.setDisplayValue(fromDisplayValue);
      fromAirportRef.current.setCity(toCity);
      toAirportRef.current.setCity(fromCity);
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
      <div className="relative mt-4!">
        <div
          className="container bg-white p-4! rounded-2xl!"
          style={{ width: '100%' }}
        >
          {/* Trip Type Selector */}
          <div className="w-fit flex gap-2 mb-4!">
            {[
              {
                label: isRTL ? 'ذهاب وعودة' : 'Round Trip',
                value: 'roundTrip',
              },
              {
                label: isRTL ? 'ذهاب فقط' : 'One Way',
                value: 'oneWay',
              },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  handleTripTypeChange(item.value as 'roundTrip' | 'oneWay')
                }
                className={`flex-1 text-nowrap rounded-[30px]! px-4! py-2! transition-all duration-300
                  ${
                    tripType === item.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100! text-gray-700! hover:bg-gray-200!'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="grid grid-cols-1 md:grid-cols-4 gap-2.5 w-full!"
            style={{ width: '100%' }}
          >
            <div
              className={` flex items-center relative ${tripType === 'oneWay' ? 'md:col-span-3' : 'md:col-span-2'}`}
            >
              <div className="flex items-center  gap-4! w-full relative">
                <FromAirport form={form} ref={fromAirportRef} />
                <div
                  className="absolute left-1/2 -translate-x-1/2  top-0 bottom-0 
                
                 z-10 
                rounded-full
                flex items-center justify-center
                "
                >
                  <button
                    type="button"
                    onClick={handleSwapAirports}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white border!
                    
                     hover:border-gray-500!
                     border-gray-300! cursor-pointer transition-all duration-300 p-0 shrink-0 hover:bg-gray-50 -mx-[1px] z-10"
                    onMouseEnter={() => setIsSwapHovered(true)}
                    onMouseLeave={() => setIsSwapHovered(false)}
                    aria-label={isRTL ? 'تبديل المطارات' : 'Swap airports'}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 7L16 7M16 7L12 3M16 7L12 11M16 17L8 17M8 17L12 13M8 17L12 21"
                        stroke="#9ca3af"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                <ToAirport form={form} ref={toAirportRef} />
              </div>
            </div>
            <div
              className={`flex items-center gap-0  border! border-gray-300 rounded-lg! ${tripType === 'oneWay' ? 'col-span-1' : 'col-span-2'}`}
            >
              <div className="flex-1">
                <DepartureDatePicker form={form} />
              </div>
              {tripType === 'roundTrip' && (
                <div className="flex-1">
                  <ReturnDatePicker form={form} />
                </div>
              )}
            </div>
            <div className="flex justify-end! items-center gap-6 col-span-5 mt-2">
              <FlightPassenger form={form} />
              <button
                type="submit"
                className="btn btn-primary w-[140px]! rounded-[30px]! h-11"
                style={{ fontSize: '16px' }}
              >
                {t('search')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FlightSearchBox;
