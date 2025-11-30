'use client';
import { memo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  FaPlane,
  FaClock,
  FaUsers,
  FaCheckCircle,
  FaExchangeAlt,
  FaChevronDown,
} from 'react-icons/fa';

interface ReturnFlightsSectionProps {
  matchingReturns: any[];
  departureFlightData: any;
  onSelectFlight: (departureFlightData: any, returnFlightData?: any) => void;
  formatTime: (dateString: string) => string;
  formatDuration: (minutes: number) => string;
}

const ReturnFlightsSection = memo<ReturnFlightsSectionProps>(
  ({
    matchingReturns,
    departureFlightData,
    onSelectFlight,
    formatTime,
    formatDuration,
  }) => {
    const t = useTranslations('FlightSearch.return_flights');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const [selectedReturnIndex, setSelectedReturnIndex] = useState<
      number | null
    >(null);
    const [showAllFlights, setShowAllFlights] = useState(false);

    if (matchingReturns.length === 0) {
      return (
        <div className="bg-light bg-opacity-50 rounded-4 p-4 mb-4">
          <div className="text-center py-5">
            <div className="mb-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle p-3 mb-3">
                <FaPlane className="text-primary" size={32} />
              </div>
              <h5 className="text-dark mb-2">{t('no_return_flights')}</h5>
              <p className="text-muted mb-4">{t('no_return_description')}</p>
            </div>
            <button
              className="btn btn-primary btn-lg px-4 py-2 rounded-pill"
              onClick={() => onSelectFlight(departureFlightData)}
            >
              <FaPlane className={isRTL ? 'ms-2' : 'me-2'} size={16} />
              {t('continue_one_way')}
            </button>
          </div>
        </div>
      );
    }

    const handleSelectReturn = (returnFlight: any, index: number) => {
      setSelectedReturnIndex(index);
      onSelectFlight(departureFlightData, returnFlight);
    };

    const displayedFlights = showAllFlights
      ? matchingReturns
      : matchingReturns.slice(0, 10);

    return (
      <div
        className="bg-white rounded-4 shadow-sm p-4 mb-4"
        onClick={(e) => e.stopPropagation()}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header Section */}
        <div className="border-bottom pb-3 mb-4">
          <div className="d-flex align-items-center gap-3">
            <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle p-2">
              <FaExchangeAlt className="text-primary" size={18} />
            </div>
            <div>
              <h5 className="mb-1 text-dark fw-bold">{t('title')}</h5>
              <p className="text-muted small mb-0">{t('description')}</p>
            </div>
            <span className="badge bg-light text-dark px-3 py-2 rounded-pill ms-auto">
              <FaPlane className={isRTL ? 'ms-1' : 'me-1'} size={12} />
              {t('options', { count: matchingReturns.length })}
            </span>
          </div>
        </div>

        {/* Full Width Flight Cards */}
        <div className="d-flex flex-column gap-3">
          {displayedFlights.map((returnFlight: any, index: number) => {
            const isSelected = selectedReturnIndex === index;
            const departureInfo = returnFlight?.legs?.[0]?.departure_info;
            const arrivalInfo =
              returnFlight?.legs?.[returnFlight?.legs?.length - 1]
                ?.arrival_info;
            const fareInfo = returnFlight?.fares?.[0]?.fare_info;
            const stops = returnFlight?.legs?.[0]?.time_info?.number_of_stops;

            return (
              <div
                key={index}
                className={`card border-0 shadow-sm position-relative overflow-hidden ${
                  isSelected
                    ? 'border-primary border-2 bg-primary bg-opacity-10'
                    : 'border-light'
                }`}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => handleSelectReturn(returnFlight, index)}
              >
                <div className="card-body p-3">
                  <div className="row align-items-center g-3">
                    {/* Airline Info */}
                    <div className="col-auto">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="badge bg-primary rounded-pill d-flex align-items-center justify-content-center text-white fw-bold"
                          style={{
                            width: '40px',
                            height: '40px',
                            fontSize: '12px',
                          }}
                        >
                          {returnFlight?.legs?.[0]?.airline_info?.carrier_code}
                        </div>
                        <div>
                          <div className="fw-bold text-dark small">
                            {
                              returnFlight?.legs?.[0]?.airline_info
                                ?.flight_number
                            }
                          </div>
                          {stops === '0' ? (
                            <span className="badge bg-success small">
                              {t('direct')}
                            </span>
                          ) : (
                            <span className="badge bg-warning text-dark small">
                              {stops}{' '}
                              {parseInt(stops) === 1 ? t('stop') : t('stops')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Flight Route */}
                    <div className="col">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="text-center">
                          <div className="h6 fw-bold text-dark mb-1">
                            {formatTime(departureInfo?.date || '')}
                          </div>
                          <div className="small text-muted fw-semibold">
                            {departureInfo?.airport_code}
                          </div>
                          <div className="small text-muted">
                            {departureInfo?.airport_name}
                          </div>
                        </div>

                        <div className="text-center flex-grow-1 mx-4">
                          <div className="d-flex align-items-center justify-content-center mb-1">
                            <div
                              className="bg-primary rounded-pill flex-grow-1"
                              style={{ height: '2px' }}
                            ></div>
                            <FaPlane className="text-primary mx-2" size={14} />
                            <div
                              className="bg-primary rounded-pill flex-grow-1"
                              style={{ height: '2px' }}
                            ></div>
                          </div>
                          <div className="small text-muted d-flex align-items-center justify-content-center gap-1">
                            <FaClock size={10} />
                            {formatDuration(
                              returnFlight?.legs?.[0]?.time_info
                                ?.leg_duration_time_minute || 0,
                            )}
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="h6 fw-bold text-dark mb-1">
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
                    </div>

                    {/* Price and Action */}
                    <div className="col-auto">
                      <div
                        className="text-center"
                        style={{ minWidth: '160px' }}
                      >
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
                            isSelected ? 'btn-success' : 'btn-outline-primary'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectReturn(returnFlight, index);
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
          })}
        </div>

        {/* Show All Button */}
        {matchingReturns.length > 10 && !showAllFlights && (
          <div className="text-center mt-4">
            <button
              className="btn btn-outline-primary"
              onClick={() => setShowAllFlights(true)}
            >
              {t('show_all')} ({matchingReturns.length - 10})
              <FaChevronDown className={isRTL ? 'me-2' : 'ms-2'} size={12} />
            </button>
          </div>
        )}

        {/* One-way booking option */}
        <div className="mt-4">
          <div className="text-center mb-3">
            <hr className="my-3" />
            <span className="bg-white px-3 text-muted small">{t('or')}</span>
          </div>

          <div className="card border-1 border-dashed">
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <div className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle p-2">
                    <FaPlane className="text-primary" />
                  </div>
                  <div>
                    <h6 className="mb-1">{t('book_one_way_only')}</h6>
                    <p className="mb-0 text-muted small">
                      {t('continue_departure_only')}
                    </p>
                  </div>
                </div>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => onSelectFlight(departureFlightData)}
                >
                  {t('book_one_way')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ReturnFlightsSection.displayName = 'ReturnFlightsSection';

export default ReturnFlightsSection;
