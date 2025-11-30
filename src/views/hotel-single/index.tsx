'use client';
import 'photoswipe/dist/photoswipe.css';
import PopularFacilities from './PopularFacilities';
import PropertyHighlights from './PropertyHighlights';
import RatingTag from './RatingTag';
import StickyHeader from './StickyHeader';
import SidebarRight from './SidebarRight';
import AvailableRooms from './AvailableRooms';
import Facilities from './Facilities';
import GalleryOne from './GalleryOne';
import { useGetHotelDetailsQuery } from '@/reactQuery/hotels.api';
import { useEffect, useState } from 'react';
import { hotelSeachTypes } from '@/types/app/hotelTypes';
import { BiHomeAlt2 } from 'react-icons/bi';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from '@/i18n/navigation';
import Overview from './Overview';
import Map from '@/components/parts/Map';
import LoadingScreen from '@/components/parts/LoadingScreen';
import InactivityModal from '@/components/modals/InactivityModal';
import { useTranslations } from 'next-intl';

export const metadata = {
  title: 'Hotel Single v1 || Efica ',
  description: 'Efica ',
};

export default function SingleHotel({
  hotelID,
  uuid,
}: {
  hotelID: string;
  uuid: string;
}) {
  const router = useRouter();
  const t = useTranslations('HotelSingle');
  const commonT = useTranslations('Common');

  const { data, isFetching, isError } = useGetHotelDetailsQuery({
    hotelID,
    uuid,
  });
  const [hotelData, setHotelData] = useState<
    hotelSeachTypes & { packages: any; amenities: string[] }
  >();
  useEffect(() => {
    const LocalStorage = localStorage.getItem('hotel');
    if (!LocalStorage) return;

    const parsedHotel = JSON.parse(LocalStorage);

    // Get all unique amenities across all rooms
    const allAmenities = new Set<string>();
    data?.roomsContent?.rooms?.forEach((room) => {
      room.RoomKey?.Amenities?.forEach((amenity) => {
        allAmenities.add(amenity);
      });
    });

    // Find the package with the lowest price
    const sortedPackages = [...(data?.packages || [])].sort(
      (a, b) => (a.price?.finalPrice || 0) - (b.price?.finalPrice || 0),
    );
    const cheapestPackage = sortedPackages[0];

    // Get all room details
    const rooms =
      data?.roomsContent?.rooms?.map((room) => ({
        key: room.RoomKey?.RoomKey,
        name: room.RoomKey?.RoomName,
        amenities: room.RoomKey?.Amenities || [],
        description: room.RoomKey?.RoomDescription,
      })) || [];

    const hotel = {
      id: parsedHotel.id || 0,
      address: parsedHotel.address || '',
      propertyType: parsedHotel.propertyType || '',
      displayName: parsedHotel.displayName || '',
      defaultImage: parsedHotel.defaultImage || {},
      tripAdvisor: parsedHotel.tripAdvisor || {},
      location: parsedHotel.location || {},
      reviews: parsedHotel.reviews || {},
      starRating: parsedHotel.starRating || '',
      packages: data?.packages || [],
      facilities: data?.hotelContent?.facilities || [],
      rooms: rooms,
      gallery: data?.hotelContent?.images,
      description: cheapestPackage?.description || '',
      price: cheapestPackage?.price?.finalPrice || 0,
      // currency: cheapestPackage?.price?.currency || 'USD',
    };

    setHotelData(hotel as any);
  }, [data]);

  if (isFetching) {
    return <LoadingScreen />;
  }
  if (isError) {
    return (
      <div className="container">
        <div className="row min-vh-100">
          <div className="col-12 d-flex flex-column justify-content-center align-items-center">
            <div className="text-center">
              <h1 className="display-1 fw-bold text-danger">
                {commonT('error')}
              </h1>
              <p className="fs-3 text-secondary">{t('error_details')}</p>
              <p className="lead">{t('error_try_again')}</p>
              <div className="d-flex gap-3 justify-content-center mt-4">
                <button
                  className="btn btn-primary d-flex align-items-center gap-2"
                  onClick={() => router.push('/')}
                >
                  <BiHomeAlt2 size={20} />
                  {commonT('go_home')}
                </button>
                <button
                  className="btn btn-secondary d-flex align-items-center gap-2"
                  onClick={() => router.push('/hotel-list')}
                >
                  <FaSearch size={18} />
                  {commonT('search_hotels')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      {/* <TopBreadCrumb /> */}
      {/* End top breadcrumb */}

      <StickyHeader hotel={hotelData} />
      {/* sticky single header for hotel single */}

      <GalleryOne hotel={hotelData} />

      <section className="pt-30">
        <div className="container">
          <div className="row y-gap-30">
            <div className="col-xl-8">
              <div className="row y-gap-40">
                <div className="col-12">
                  <h3 className="text-22 fw-500">{t('property_highlights')}</h3>
                  <PropertyHighlights />
                </div>

                <div id="overview" className="col-12">
                  <Overview descriptions={data?.hotelContent.descriptions} />
                </div>

                <div className="col-12">
                  <h3 className="text-22 fw-500 pt-40 border-top-light">
                    {t('popular_facilities')}
                  </h3>
                  <div className="row y-gap-10 pt-20">
                    <PopularFacilities />
                  </div>
                </div>

                {/* <div className="col-12">
                  <RatingTag />
                </div> */}
              </div>
            </div>

            <div className="col-xl-4">
              <SidebarRight hotel={hotelData} />
            </div>
            <div className="sidebar__item -no-border position-relative pb-20">
              <Map hotels={[hotelData as any]} />
            </div>
          </div>
        </div>
      </section>

      <section id="rooms" className="pt-30">
        <div className="container">
          <AvailableRooms hotel={hotelData as any} />
        </div>
      </section>

      <section className="mt-40" id="facilities">
        <div className="container">
          <div className="row x-gap-40 y-gap-40">
            <div className="col-12">
              <h3 className="text-22 fw-500">{t('facilities')}</h3>
              <div className="row x-gap-40 y-gap-40 pt-20">
                <Facilities amenities={hotelData?.facilities as any} />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Inactivity Modal */}
      <InactivityModal timeoutMinutes={5} />
    </>
  );
}
