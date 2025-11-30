'use client';
import { memo } from 'react';
import { FaClock, FaUsers, FaPlane, FaCheckCircle } from 'react-icons/fa';
import { useTranslations, useLocale } from 'next-intl';

interface ReturnFlightCardProps {
  returnFlight: any;
  index: number;
  isSelected: boolean;
  departureFlightData: any;
  onSelectFlight: (
    departureFlightData: any,
    returnFlightData?: any,
    returnIndex?: number,
  ) => void;
  formatTime: (dateString: string) => string;
  formatDuration: (minutes: number) => string;
}

const ReturnFlightCard = memo<ReturnFlightCardProps>(
  ({
    returnFlight,
    index,
    isSelected,
    departureFlightData,
    onSelectFlight,
    formatTime,
    formatDuration,
  }) => {
    const t = useTranslations('FlightSearch.return_flights');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const departureInfo = returnFlight?.legs?.[0]?.departure_info;
    const arrivalInfo =
      returnFlight?.legs?.[returnFlight?.legs?.length - 1]?.arrival_info;
    const fareInfo = returnFlight?.fares?.[0]?.fare_info;
    const stops = returnFlight?.legs?.[0]?.time_info?.number_of_stops;

    const handleSelectReturn = () => {
      onSelectFlight(departureFlightData, returnFlight, index);
    };

    return (
      <div
        className={`card border-0 shadow-sm position-relative overflow-hidden ${
          isSelected
            ? 'border-primary border-2 bg-primary bg-opacity-10'
            : 'border-light'
        }`}
        style={{
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          transform: isSelected ? 'translateY(-2px)' : 'none',
        }}
        onClick={handleSelectReturn}
      >
        <div className="card-body p-3">
          <div className="row align-items-center g-3">
            {/* Airline Info */}
            <div className="col-auto">
              <div
                className="badge bg-primary rounded-pill d-flex align-items-center justify-content-center text-white fw-bold"
                style={{
                  width: '50px',
                  height: '50px',
                  fontSize: '14px',
                }}
              >
                {returnFlight?.legs?.[0]?.airline_info?.carrier_code}
              </div>
            </div>

            {/* Flight Route - Opposite Direction */}
            <div className="col">
              <div className="d-flex align-items-center">
                {/* Arrival (destination) shown first for return flights */}
                <div className="text-center">
                  <div className="h5 fw-bold text-dark mb-1">
                    {formatTime(departureInfo?.date || '')}
                  </div>
                  <div className="small text-muted fw-semibold">
                    {departureInfo?.airport_code}
                  </div>
                  <div className="small text-muted">
                    {departureInfo?.airport_name}
                  </div>
                </div>

                <div className="flex-grow-1 mx-3 position-relative">
                  <div className="d-flex align-items-center justify-content-center">
                    <div
                      className="bg-primary rounded-pill flex-grow-1"
                      style={{ height: '2px' }}
                    ></div>
                    <div className="mx-2 text-center">
                      <FaPlane
                        className="text-primary fa-flip-horizontal"
                        size={16}
                        style={{ transform: 'scaleX(-1)' }}
                      />
                    </div>
                    <div
                      className="bg-primary rounded-pill flex-grow-1"
                      style={{ height: '2px' }}
                    ></div>
                  </div>
                </div>

                {/* Origin shown second for return flights */}
                <div className="text-center">
                  <div className="h5 fw-bold text-dark mb-1">
                    {formatTime(arrivalInfo?.date || '')}
                  </div>
                  <div className="small text-muted fw-semibold">
                    {arrivalInfo?.airport_code}
                  </div>
                  <div className="small text-muted">
                    {arrivalInfo?.airport_name}
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-center mt-3 gap-3">
                <span className="badge bg-success text-white rounded-pill d-flex align-items-center gap-1">
                  <FaClock size={10} />
                  {formatDuration(
                    returnFlight?.legs?.[0]?.time_info
                      ?.leg_duration_time_minute || 0,
                  )}
                </span>
                {stops === '0' ? (
                  <span className="badge bg-info text-white rounded-pill">
                    {t('direct')}
                  </span>
                ) : (
                  <span className="badge bg-warning text-dark rounded-pill">
                    {stops} {parseInt(stops) === 1 ? t('stop') : t('stops')}
                  </span>
                )}
              </div>
            </div>

            {/* Price and Action */}
            <div className="col-auto">
              <div className="text-center" style={{ minWidth: '160px' }}>
                <div className="h5 fw-bold text-primary mb-1">
                  {isRTL ? (
                    <>
                      {fareInfo?.fare_detail?.price_info?.total_fare}{' '}
                      {fareInfo?.fare_detail?.currency_code}
                    </>
                  ) : (
                    <>
                      {fareInfo?.fare_detail?.currency_code}{' '}
                      {fareInfo?.fare_detail?.price_info?.total_fare}
                    </>
                  )}
                </div>
                <div className="small text-muted mb-2 d-flex align-items-center justify-content-center gap-1">
                  <FaUsers size={10} />
                  {fareInfo?.free_seats} {t('seats_left')}
                </div>
                <button
                  className={`btn btn-sm w-100 ${
                    isSelected ? 'btn-success' : 'btn-primary'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectReturn();
                  }}
                >
                  {isSelected ? (
                    <>
                      <FaCheckCircle
                        className={isRTL ? 'ms-1' : 'me-1'}
                        size={12}
                      />
                      {t('selected')}
                    </>
                  ) : (
                    t('select_return')
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ReturnFlightCard.displayName = 'ReturnFlightCard';

export default ReturnFlightCard;
