'use client';

import toast from 'react-hot-toast';
import { getError } from '@/utils/getError';
import { useForm } from 'react-hook-form';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import FromAirport from './FromAirport';
import ToAirport from './ToAirport';
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
      adults: 1,
      children: 0,
      infants: 0,
      cabinClass: 'ECONOMY',
    },
  });

  const onSubmit = async (data: FlightSearchParams) => {
    try {
      // Create URLSearchParams object
      const searchParams = new URLSearchParams();

      // Add flight search parameters
      if (data.fromAirport)
        searchParams.append('fromAirport', data.fromAirport);
      if (data.toAirport) searchParams.append('toAirport', data.toAirport);
      if (data.departureDate)
        searchParams.append(
          'departureDate',
          new Date(data.departureDate).toISOString().split('T')[0],
        );
      if (data.returnDate)
        searchParams.append(
          'returnDate',
          new Date(data.returnDate).toISOString().split('T')[0],
        );
      if (data.adults) searchParams.append('adults', data.adults.toString());
      if (data.children && data.children > 0)
        searchParams.append('children', data.children.toString());
      if (data.infants && data.infants > 0)
        searchParams.append('infants', data.infants.toString());
      if (data.cabinClass) searchParams.append('cabinClass', data.cabinClass);

      // Navigate to flight search page with query params
      localStorage.setItem('flightSearch', JSON.stringify(data));
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
        <div
          className="container bg-white rounded search-container"
          style={{ maxWidth: '1100px' }}
        >
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="row h-100 align-items-center"
            style={{ width: '100%' }}
          >
            <div className="col-md search-column">
              <FromAirport form={form} />
            </div>
            <div className="col-md search-column">
              <ToAirport form={form} />
            </div>
            <div className="col-md search-column">
              <DepartureDatePicker form={form} />
            </div>
            <div className="col-md search-column">
              <ReturnDatePicker form={form} />
            </div>
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
    </>
  );
};

export default FlightSearchBox;
