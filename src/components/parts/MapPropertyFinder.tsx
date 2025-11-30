'use client';

import { MapLightStyles } from '@/styles/map.light.styles';
import { Currency_ENUM, hotelSeachTypes } from '@/types/app/hotelTypes';
import { GoogleMap, OverlayView, useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useState, useEffect } from 'react';
import Image from 'next/image';

type Props = {
  hotels?: hotelSeachTypes[];
  center?: {
    lat: number;
    lng: number;
  };
};

const containerStyle = {
  width: '100%',
  height: '70vh',
  position: 'relative' as const,
};

const defaultCenter = {
  lat: 25.276987,
  lng: 55.296249,
};

const validateCoords = (lat?: number, lng?: number) => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

const PriceMarker = ({
  position,
  price,
}: {
  position: google.maps.LatLng;
  price: number;
}) => {
  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div className="map-marker-container">
        <div className="price-tag d-flex align-items-center gap-2">
          <span className="currency">
            <span className="amount">{price?.toLocaleString()}</span>
            <img
              src={
                'https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg'
              }
              alt="Currency"
              width={20}
              height={20}
              className='me-2'
              style={{
                filter: 'brightness(0) invert(1)',
              }}
            />
          </span>
        </div>
        <div className="marker-pin"></div>
      </div>
    </OverlayView>
  );
};

export default function MapPropertyFinder({ hotels = [], center }: Props) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(function callback(mapInstance: google.maps.Map) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  useEffect(() => {
    if (map && hotels.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      let validHotels = 0;

      hotels.forEach((hotel) => {
        const lat = Number(hotel?.location?.latitude);
        const lng = Number(hotel?.location?.longitude);

        if (validateCoords(lat, lng)) {
          bounds.extend({ lat, lng });
          validHotels++;
        }
      });

      if (validHotels > 0) {
        map.fitBounds(bounds);
      } else {
        // Default to a safe location if no valid coordinates
        map.setCenter(defaultCenter);
        map.setZoom(12);
      }
    }
  }, [map, hotels]);

  if (!isLoaded) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const validCenter =
    center && validateCoords(center.lat, center.lng) ? center : defaultCenter;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={validCenter}
      zoom={12}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        styles: MapLightStyles as any,
        disableDefaultUI: true,
      }}
    >
      {hotels.map((hotel) => {
        const lat = Number(hotel?.location?.latitude);
        const lng = Number(hotel?.location?.longitude);

        if (!validateCoords(lat, lng)) return null;

        return (
          <PriceMarker
            key={hotel.id}
            position={new google.maps.LatLng(lat, lng)}
            price={hotel?.price as number}
          />
        );
      })}
    </GoogleMap>
  );
}
