'use client';
import moment from 'moment';
import { useTranslations, useLocale } from 'next-intl';
import {
  IoIosArrowDown,
  IoIosCheckmarkCircle,
  IoIosCloseCircle,
} from 'react-icons/io';
import TestDesign from './TestDesign';

interface FlightRouteProps {
  departureFlights: any[];
  returnFlights: any[];
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

  const formatTime = (dateTime: string) => {
    return moment(dateTime).format('HH:mm');
  };

  const formatDate = (dateTime: string) => {
    return moment(dateTime).format('DD MMM YYYY');
  };

  return (
    <div className="row x-gap-15 y-gap-20">
      {/* Outbound Flight */}
      {/* {departureFlights.length > 0 && (
        <div className="col-12">
          <div className="flight-route-card border rounded-4 p-20 bg-blue-1-05 p-3">
            <div className="d-flex align-items-center justify-content-between mb-15">
              <div className="d-flex align-items-center gap-10">
                <i className="icon-plane text-blue-1 text-20"></i>
                <span className="fw-500">{t('outbound_flight')}</span>
              </div>
              {departureFlights[0]?.flight?.operator_airline_code && (
                <div className="d-flex align-items-center gap-10">
                  <img
                    src={`https://images.kiwi.com/airlines/32/${departureFlights[0].flight.operator_airline_code}.png`}
                    alt={departureFlights[0].flight.operator_airline_code}
                    style={{ width: '24px', height: '24px' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="text-14">
                    {departureFlights[0].flight.operator_airline_code}
                  </span>
                </div>
              )}
            </div>

            <div className="flight-route d-flex align-items-center justify-content-between">
              <div className="text-center">
                <div className="text-18 fw-600">
                  {departureFlights[0]?.flight?.from || 'Origin'}
                </div>
                <div className="text-14 text-light-1">
                  {departureFlights[0]?.flight?.departure_time
                    ? formatTime(departureFlights[0].flight.departure_time)
                    : '--:--'}
                </div>
                <div className="text-12 text-light-1">
                  {departureFlights[0]?.flight?.departure_time
                    ? formatDate(departureFlights[0].flight.departure_time)
                    : ''}
                </div>
              </div>

              <div className="flex-grow-1 mx-20">
                <div className="d-flex align-items-center">
                  <div className="h-1 bg-border flex-grow-1"></div>
                  <i className="icon-plane text-blue-1 mx-10"></i>
                  <div className="h-1 bg-border flex-grow-1"></div>
                </div>
                <div className="text-center text-12 text-light-1 mt-5">
                  {departureFlights[0]?.flight?.flight_number ||
                    t('direct_flight')}
                </div>
              </div>

              <div className="text-center">
                <div className="text-18 fw-600">
                  {departureFlights[0]?.flight?.to || 'Destination'}
                </div>
                <div className="text-14 text-light-1">
                  {departureFlights[0]?.flight?.arrival_time
                    ? formatTime(departureFlights[0].flight.arrival_time)
                    : '--:--'}
                </div>
                <div className="text-12 text-light-1">
                  {departureFlights[0]?.flight?.arrival_time
                    ? formatDate(departureFlights[0].flight.arrival_time)
                    : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
      {/* Return Flight */}
      {/* {hasReturnFlight && returnFlights.length > 0 && (
        <div className="col-12">
          <div className="flight-route-card border rounded-4 p-20 bg-light-2 p-3">
            <div className="d-flex align-items-center justify-content-between mb-15">
              <div className="d-flex align-items-center gap-10">
                <i
                  className="icon-plane text-blue-1 text-20"
                  style={{ transform: 'scaleX(-1)' }}
                ></i>
                <span className="fw-500">{t('return_flight')}</span>
              </div>
              {returnFlights[0]?.flight?.operator_airline_code && (
                <div className="d-flex align-items-center gap-10">
                  <img
                    src={`https://images.kiwi.com/airlines/32/${returnFlights[0].flight.operator_airline_code}.png`}
                    alt={returnFlights[0].flight.operator_airline_code}
                    style={{ width: '24px', height: '24px' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="text-14">
                    {returnFlights[0].flight.operator_airline_code}
                  </span>
                </div>
              )}
            </div>

            <div className="flight-route d-flex align-items-center justify-content-between">
              <div className="text-center">
                <div className="text-18 fw-600">
                  {returnFlights[0]?.flight?.from || 'Origin'}
                </div>
                <div className="text-14 text-light-1">
                  {returnFlights[0]?.flight?.departure_time
                    ? formatTime(returnFlights[0].flight.departure_time)
                    : '--:--'}
                </div>
                <div className="text-12 text-light-1">
                  {returnFlights[0]?.flight?.departure_time
                    ? formatDate(returnFlights[0].flight.departure_time)
                    : ''}
                </div>
              </div>

              <div className="flex-grow-1 mx-20">
                <div className="d-flex align-items-center">
                  <div className="h-1 bg-border flex-grow-1"></div>
                  <i
                    className="icon-plane text-blue-1 mx-10"
                    style={{ transform: 'scaleX(-1)' }}
                  ></i>
                  <div className="h-1 bg-border flex-grow-1"></div>
                </div>
                <div className="text-center text-12 text-light-1 mt-5">
                  {returnFlights[0]?.flight?.flight_number ||
                    t('direct_flight')}
                </div>
              </div>

              <div className="text-center">
                <div className="text-18 fw-600">
                  {returnFlights[0]?.flight?.to || 'Destination'}
                </div>
                <div className="text-14 text-light-1">
                  {returnFlights[0]?.flight?.arrival_time
                    ? formatTime(returnFlights[0].flight.arrival_time)
                    : '--:--'}
                </div>
                <div className="text-12 text-light-1">
                  {returnFlights[0]?.flight?.arrival_time
                    ? formatDate(returnFlights[0].flight.arrival_time)
                    : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
      {/* test design */}
      <TestDesign />
    </div>
  );
};

export default FlightRoute;
