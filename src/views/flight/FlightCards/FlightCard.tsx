'use client';
import '@/styles/flight-card.css';
import { memo } from 'react';
import { FaClock, FaUsers } from 'react-icons/fa';
import { useTranslations, useLocale } from 'next-intl';
import ReturnFlightsSection from './ReturnFlightsSection';
import Image from 'next/image';

interface FlightCardProps {
  departureFlightData: any;
  index: number;
  isSelected: boolean;
  matchingReturns: any[];
  onSelectDeparture: (departureFareKey: string, departureData: any) => void;
  onSelectFlight: (departureFlightData: any, returnFlightData?: any) => void;
  formatTime: (dateString: string) => string;
  formatDuration: (minutes: number) => string;
  formatDate: (dateString: string) => string;
}

const FlightCard = memo<FlightCardProps>(
  ({
    departureFlightData,
    index,
    isSelected,
    matchingReturns,
    onSelectDeparture,
    onSelectFlight,
    formatTime,
    formatDuration,
    formatDate,
  }) => {
    const t = useTranslations('FlightSearch.card');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const handleSelectDeparture = () => {
      const departureFareKey = departureFlightData.fares?.[0]?.fare_key || '';
      onSelectDeparture(departureFareKey, departureFlightData);
    };
    return (
      <div
        onClick={handleSelectDeparture}
        className={`card shadow-sm mb-3  border-0  position-relative overflow-hidden flight-card-animation ${
          isSelected
            ? 'border-success border-2 bg-light bg-opacity-50'
            : 'border border-light'
        }`}
        style={{
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          transform: isSelected ? 'translateY(-2px)' : 'none',
        }}
      >
        <div className="card-body p-3 p-md-4">
          {/* Main Departure Flight Row */}
          <div className="row align-items-center g-3">
            {/* Airline */}
            <div className="col-auto d-flex flex-column max-w-20 ">
              <div className="">
                <img
                  src={departureFlightData?.legs?.[0]?.airline_info?.logo}
                  alt={
                    departureFlightData?.legs?.[0]?.airline_info?.carrier_code
                  }
                  width={50}
                  height={50}
                />
              </div>
              <p className="text-truncate">
                {departureFlightData?.legs?.[0]?.airline_info?.carrier_name}
              </p>
              <p className="">
                ({departureFlightData?.legs?.[0]?.flight_number})
              </p>
            </div>

            {/* Flight Route */}
            <div className="col ">
              <div className="d-flex align-items-center position-relative">
                <div className="text-center">
                  <div className="h5 fw-bold text-dark mb-1">
                    {formatTime(
                      departureFlightData?.legs?.[0]?.departure_info?.date ||
                        '',
                    )}
                  </div>
                  <div className="small text-muted fw-semibold">
                    {
                      departureFlightData?.legs?.[0]?.departure_info
                        ?.airport_code
                    }
                  </div>
                  <div className="small text-muted fw-semibold">
                    {formatDate(
                      departureFlightData?.legs?.[0]?.departure_info?.date ||
                        '',
                    )}
                  </div>
                </div>

                <div className="flex-grow-1 mx-3 position-relative flight-route-line">
                  <div
                    className="bg-primary rounded-pill"
                    style={{ height: '2px' }}
                  ></div>
                </div>

                <div className="text-center">
                  <div className="h5 fw-bold text-dark mb-1">
                    {formatTime(
                      departureFlightData?.legs?.[
                        departureFlightData?.legs?.length - 1
                      ]?.arrival_info?.date || '',
                    )}
                  </div>
                  <div className="small text-muted fw-semibold">
                    {
                      departureFlightData?.legs?.[
                        departureFlightData?.legs?.length - 1
                      ]?.arrival_info?.airport_code
                    }
                  </div>
                  <div className="small text-muted fw-semibold">
                    {formatDate(
                      departureFlightData?.legs?.[
                        departureFlightData?.legs?.length - 1
                      ]?.arrival_info?.date || '',
                    )}
                  </div>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                  }}
                  className="d-flex flex-row align-items-center justify-content-center mt-3 gap-3"
                >
                  {departureFlightData?.legs?.length === 1 ? (
                    <span className="badge bg-info text-white rounded-pill">
                      {t('nonstop')}
                    </span>
                  ) : (
                    <div className="d-flex flex-row align-items-center justify-content-center gap-2 position-relative">
                      <div
                        style={{
                          position: 'absolute',
                          top: '-20px',
                          left: '0',
                          right: '0',
                          marginBottom: '20px',
                          color: 'gray',
                          whiteSpace: 'nowrap',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        className="d-flex align-items-center gap-1 "
                      >
                        <span className="small bg-transparent text-center  d-flex align-items-center gap-1 ">
                          {/* <FaClock size={10} /> */}
                          {formatDuration(
                            departureFlightData?.legs?.[0]?.time_info
                              ?.flight_time_hour *
                              60 +
                              departureFlightData?.legs?.[0]?.time_info
                                ?.flight_time_minute,
                          )}
                        </span>
                      </div>
                      {departureFlightData?.legs?.map((leg: any, i: number) => {
                        if (i === 0) return null;
                        return (
                          <div
                            key={i}
                            className="d-flex flex-row align-items-center justify-content-center gap-2 mt-2"
                          >
                            <span className="badge border border-dark text-dark rounded p-2 bg-white ">
                              {leg.departure_info?.airport_code}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="col-auto">
              <div
                className="bg-warning text-dark rounded-3 p-3 text-center shadow-sm"
                style={{ minWidth: '160px' }}
              >
                <div className="h4 fw-bold mb-2">
                  {
                    departureFlightData?.fares?.[0]?.fare_info?.fare_detail
                      ?.currency_code
                  }{' '}
                  {departureFlightData?.minimum_package_price}
                </div>
                <div className="small opacity-75 mb-2">
                  <FaUsers size={10} className={isRTL ? 'ms-1' : 'me-1'} />
                  {departureFlightData?.fares?.[0]?.fare_info?.free_seats}{' '}
                  {t('seats_left')}
                </div>
              </div>
            </div>
          </div>

          {/* Return flights section - only render when selected */}
          {isSelected && (
            <div className="mt-4 pt-3 border-top">
              <ReturnFlightsSection
                matchingReturns={matchingReturns}
                departureFlightData={departureFlightData}
                onSelectFlight={onSelectFlight}
                formatTime={formatTime}
                formatDuration={formatDuration}
                formatDate={formatDate}
              />
            </div>
          )}
        </div>
      </div>
    );
  },
);

FlightCard.displayName = 'FlightCard';

export default FlightCard;
