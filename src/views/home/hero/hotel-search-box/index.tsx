'use client';

import DateSearch from './DateSearch';
import GuestSearch from './GuestSearch';
import LocationSearch from './LocationSearch';
import toast from 'react-hot-toast';
import { getError } from '@/utils/getError';
import { useForm } from 'react-hook-form';
import { searchHotelsParams } from '@/types/requests/searchHotelRequestTypes';
import { searchFormResolver } from '@/utils/validationResolver';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

const HotelSearchBox = () => {
  const t = useTranslations('HomePage.hero_section.hotel');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const Router = useRouter();

  const form = useForm<searchHotelsParams>({
    resolver: searchFormResolver,
    defaultValues: {
      country: 'US',
      radiusInMeters: 10000,
      rooms: [
        {
          AdultsCount: 2,
          KidsAges: [],
        },
      ],
    },
  });

  const onSubmit = async (data: searchHotelsParams) => {
    try {
      // Create URLSearchParams object
      const searchParams = new URLSearchParams();

      // Add basic parameters
      if (data.country) searchParams.append('country', data.country);
      if (data.checkIn)
        searchParams.append(
          'checkIn',
          new Date(data.checkIn).toISOString().split('T')[0],
        );
      if (data.checkOut)
        searchParams.append(
          'checkOut',
          new Date(data.checkOut).toISOString().split('T')[0],
        );
      if (data.location?.latitude)
        searchParams.append('lat', data.location.latitude.toString());
      if (data.location?.longitude)
        searchParams.append('lng', data.location.longitude.toString());

      // Add rooms data (serialized as JSON because it's complex)
      if (data.rooms) searchParams.append('rooms', JSON.stringify(data.rooms));

      // Navigate to search page with query params
      localStorage.setItem('search', JSON.stringify(data));
      Router.push(`/search?${searchParams.toString()}`);
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
          style={{ maxWidth: '960px' }}
        >
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className={`row h-100 align-items-center`}
            style={{ width: '100%' }}
          >
            <div className="col-md search-column">
              <LocationSearch form={form} />
            </div>
            <div className="col-md search-column">
              <DateSearch form={form as any} />
            </div>
            <div className="col-md search-column">
              <GuestSearch form={form} />
            </div>
            <div className="col-md-auto d-flex items-content-center p-2">
              <button
                type="submit"
                className="btn btn-primary w-100"
                style={{ fontSize: '20px' }}
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

export default HotelSearchBox;
