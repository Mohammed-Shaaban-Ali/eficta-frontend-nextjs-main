'use client';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useLocale } from 'next-intl';
import { FaArrowRightLong } from 'react-icons/fa6';

interface RouteDisplayProps {
  fromAirport: string;
  toAirport: string;
  fromAirportCity?: string;
  toAirportCity?: string;
  forceType?: 'departure' | 'return';
  routeNumber?: string;
}

const RouteDisplay: React.FC<RouteDisplayProps> = ({
  fromAirport,
  toAirport,
  fromAirportCity,
  toAirportCity,
  forceType,
  routeNumber,
}) => {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const currentFilterType = useSelector(
    (state: RootState) => state.flightFilter.currentFilterType,
  );
  console.log(routeNumber, 'routeNumber');
  // Use city from props, fallback to airport code if city not provided
  const fromCity = fromAirportCity || fromAirport;
  const toCity = toAirportCity || toAirport;

  // Determine display order based on forceType or filter type
  const displayRoute = useMemo(() => {
    const type = forceType || currentFilterType;

    if (routeNumber == '2') {
      // For return: to → from
      return {
        from: fromCity,
        to: toCity,
        number: routeNumber || '2',
      };
    } else {
      // For departure: from → to
      return {
        from: fromCity,
        to: toCity,
        number: routeNumber || '1',
      };
    }
  }, [forceType, currentFilterType, fromCity, toCity, routeNumber]);

  return (
    <div className="route-display mb-20">
      <div className="flex items-center gap-2">
        <span className="text-22 fw-600 ">{displayRoute.number}.</span>
        <div className="text-22 fw-500 text-dark-1 flex items-center gap-2">
          {displayRoute.from}

          <FaArrowRightLong className="mx-2  " />

          {displayRoute.to}
        </div>
      </div>
    </div>
  );
};

export default RouteDisplay;
