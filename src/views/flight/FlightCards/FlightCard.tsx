'use client';
import '@/styles/flight-card.css';
import { memo } from 'react';
import { FaClock, FaUsers } from 'react-icons/fa';
import { useTranslations, useLocale } from 'next-intl';
import ReturnFlightsSection from './ReturnFlightsSection';

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
        className={`card shadow-sm mb-3 border-0 position-relative overflow-hidden flight-card-animation ${
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
            <div className="col-auto">
              <div
                className="badge bg-primary rounded-pill d-flex align-items-center justify-content-center text-white fw-bold"
                style={{ width: '50px', height: '50px', fontSize: '14px' }}
              >
                {departureFlightData?.legs?.[0]?.airline_info?.carrier_code}
              </div>
            </div>

            {/* Flight Route */}
            <div className="col">
              <div className="d-flex align-items-center">
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
                        ?.airport_name
                    }
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
                      ]?.arrival_info?.airport_name
                    }
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-center mt-3 gap-3">
                <span className="badge bg-success text-white rounded-pill d-flex align-items-center gap-1">
                  <FaClock size={10} />
                  {formatDuration(
                    departureFlightData?.legs?.[0]?.time_info
                      ?.leg_duration_time_minute || 0,
                  )}
                </span>
                {departureFlightData?.legs?.[0]?.time_info?.number_of_stops ===
                '0' ? (
                  <span className="badge bg-info text-white rounded-pill">
                    {t('nonstop')}
                  </span>
                ) : (
                  <span className="badge bg-warning text-dark rounded-pill">
                    {departureFlightData?.legs?.[0]?.time_info?.number_of_stops}{' '}
                    {departureFlightData?.legs?.[0]?.time_info
                      ?.number_of_stops === '1'
                      ? t('stop', { count: 1 })
                      : t('stops_plural', {
                          count:
                            departureFlightData?.legs?.[0]?.time_info
                              ?.number_of_stops,
                        })}
                  </span>
                )}
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
                  {
                    departureFlightData?.fares?.[0]?.fare_info?.fare_detail
                      ?.price_info?.total_fare
                  }
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
