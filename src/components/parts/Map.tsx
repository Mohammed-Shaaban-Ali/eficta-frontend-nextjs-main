'use client';
import { hotelSeachTypes } from '@/types/app/hotelTypes';
import MapPropertyFinder from './MapPropertyFinder';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { getSearchParamsData } from '@/utils/getSearchParams';

const Map = ({
  hotels,
  autoFocus = false,
}: {
  hotels: hotelSeachTypes[];
  autoFocus?: boolean;
}) => {
  const t = useTranslations('Components.Parts.Map');
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>();

  useEffect(() => {
    const searchParams = getSearchParamsData();
    setLocation(searchParams?.location);
  }, []);

  // Calculate center from hotels if autoFocus is true and hotels are available
  const getMapCenter = () => {
    if (hotels && hotels?.length > 0) {
      // Use average of all hotel coordinates for center
      const totalHotels = hotels.length;
      const sumCoords = hotels.reduce(
        (sum, hotel) => {
          if (hotel?.location) {
            return {
              latitude: sum.latitude + (hotel.location.latitude || 0),
              longitude: sum.longitude + (hotel.location.longitude || 0),
            };
          }
          return sum;
        },
        { latitude: 0, longitude: 0 },
      );

      // If we have valid coordinates, return the average
      if (totalHotels > 0) {
        return {
          lat: sumCoords.latitude / totalHotels,
          lng: sumCoords.longitude / totalHotels,
        };
      }
    }

    // Fall back to the search location if autoFocus is false or no hotels
    return {
      lat: location?.latitude as number,
      lng: location?.longitude as number,
    };
  };

  return (
    <>
      <div
        className="flex-center"
        style={{
          backgroundImage: 'url(/img/general/map.png)',
          height: '180px',
        }}
      >
        <button
          className="button py-15 px-24 -blue-1 bg-white text-dark-1 absolute"
          data-bs-toggle="modal"
          data-bs-target="#mapModal"
        >
          <i className="icon-destination text-22 mr-10" />
          {hotels.length > 0
            ? t('show_hotels_on_map', { count: hotels.length })
            : t('show_on_map')}
        </button>
      </div>

      <div
        className="modal fade"
        id="mapModal"
        tabIndex={-1}
        aria-labelledby="mapModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="mapModalLabel">
                {hotels.length > 0
                  ? t('hotels_found', { count: hotels.length })
                  : t('hotel_locations')}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-0" style={{ height: '70vh' }}>
              <MapPropertyFinder hotels={hotels} center={getMapCenter()} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Map;
