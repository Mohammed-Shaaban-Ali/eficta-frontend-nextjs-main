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
import { FaSearch } from 'react-icons/fa';

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
      <div className="relative  ">
        <div
          className="container bg-[#E7F3F1] p-2! py-4 sm:p-4! rounded-b-2xl! md:rounded-tr-2xl! "
          style={{ width: '100%' }}
        >
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className={`grid grid-cols-1! md:grid-cols-5! gap-x-2! gap-y-4! w-full! `}
            style={{ width: '100%' }}
          >
            <LocationSearch form={form} />
            <DateSearch form={form as any} />
            <GuestSearch form={form} />
            <div className="flex justify-end! items-center! col-span-1 mt-2 ">
              <button
                type="submit"
                className=" bg-[#0E8571]! hover:bg-[#0E8571]/80! cursor-pointer 
                text-white! px-4! sm:px-6! w-full! sm:w-[200px]!
                flex items-center justify-center gap-2 rounded-[30px]! h-11 
                font-bold! transition-all duration-300
                "
                style={{ fontSize: '16px' }}
              >
                <FaSearch />

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
