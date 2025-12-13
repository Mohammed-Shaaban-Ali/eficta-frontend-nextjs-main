'use client';
import moment from 'moment';
import { useTranslations, useLocale } from 'next-intl';

import { FlightPackage } from '@/types/app/fareTypes';
import FlightCard from './FlightCard';

interface FlightRouteProps {
  departureFlights: FlightPackage;
  returnFlights: FlightPackage;
  hasReturnFlight: boolean;
}

const FlightRoute: React.FC<FlightRouteProps> = ({
  departureFlights,
  returnFlights,
  hasReturnFlight,
}) => {
  const t = useTranslations('BookingPage.booking_sidebar');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div className="">
      <FlightCard flightData={departureFlights} />
      {hasReturnFlight && (
        <div
          style={{
            height: '1px',
          }}
          className=" w-full! bg-gray-200  mb-3! mt-2 "
        ></div>
      )}
      {hasReturnFlight && <FlightCard flightData={returnFlights} />}
    </div>
  );
};

export default FlightRoute;
