import { useRef, useEffect } from 'react';
import { Map, Marker } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export type viewStateType = {
  longitude: number;
  latitude: number;
  zoom: number;
};

export type HotelLocationType = {
  id: string;
  longitude: number;
  latitude: number;
  price: number;
  name: string;
};

type Props = {
  viewState: viewStateType;
  hotels: HotelLocationType[];
  onHotelSelect?: (hotel: HotelLocationType) => void;
};

const ViewMap = ({ viewState, hotels, onHotelSelect }: Props) => {
  //@ts-expect-error error
  const mapRef = useRef<MapRef>();

  useEffect(() => {
    mapRef.current?.flyTo({
      center: [
        viewState.longitude || 55.296249,
        viewState.latitude || 25.276987,
      ],
      zoom: viewState.zoom,
    });
  }, [viewState]);

  return (
    <div
      className="bs-full is-full"
      style={{ width: '100%', height: '100%', minHeight: '500px' }}
    >
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAP_AKIKEY}
        ref={mapRef}
        initialViewState={viewState}
        mapStyle="mapbox://styles/mapbox/light-v12"
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
        reuseMaps
      >
        {hotels.map((hotel) => (
          <Marker
            key={hotel.id}
            longitude={hotel.longitude}
            latitude={hotel.latitude}
            onClick={() => onHotelSelect?.(hotel)}
          >
            <div className="hotel-marker">
              <div className="price-tag">${hotel?.price}</div>
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
};

export default ViewMap;
