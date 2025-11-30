'use client';
import { memo, useState, useCallback, lazy, Suspense } from 'react';
import { FaClock, FaUsers, FaArrowLeft, FaPlane } from 'react-icons/fa';
import { useTranslations, useLocale } from 'next-intl';
import ReturnFlightCard from './ReturnFlightCard';

// Lazy load FlightDetails
const FlightDetails = lazy(() => import('../flight-details'));

// Types
interface SelectedFlight {
  departureFareKey: string;
  returnFareKey?: string;
  adults: number;
  children: number;
  infants: number;
}

interface SelectedFlightViewProps {
  selectedDepartureData: any;
  matchingReturns: any[];
  onSelectFlight: (departureFlightData: any, returnFlightData?: any) => void;
  onBackToList: () => void;
  formatTime: (dateString: string) => string;
  formatDuration: (minutes: number) => string;
  formatDate: (dateString: string) => string;
  adults: number;
  childrens: number;
  infants: number;
}

const SelectedFlightView = memo<SelectedFlightViewProps>(
  ({
    selectedDepartureData,
    matchingReturns,
    onSelectFlight,
    onBackToList,
    formatTime,
    formatDuration,
    formatDate,
    adults,
    childrens,
    infants,
  }) => {
    const t = useTranslations('FlightSearch.card');
    const tReturn = useTranslations('FlightSearch.return_flights');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    // Local state for FlightDetails
    const [selectedFlight, setSelectedFlight] = useState<SelectedFlight | null>(
      null,
    );
    const [selectedReturnIndex, setSelectedReturnIndex] = useState<
      number | null
    >(null);

    const departureInfo = selectedDepartureData?.legs?.[0]?.departure_info;
    const arrivalInfo =
      selectedDepartureData?.legs?.[selectedDepartureData?.legs?.length - 1]
        ?.arrival_info;

    // Handle flight selection and show FlightDetails
    const handleSelectFlight = useCallback(
      (
        departureFlightData: any,
        returnFlightData?: any,
        returnIndex?: number,
      ) => {
        setSelectedFlight({
          departureFareKey: departureFlightData?.fares?.[0]?.fare_key || '',
          returnFareKey: returnFlightData?.fares?.[0]?.fare_key,
          adults,
          children: childrens,
          infants,
        });
        // Update selected return index
        if (returnIndex !== undefined) {
          setSelectedReturnIndex(returnIndex);
        }
        // Also call the parent handler if needed
        onSelectFlight(departureFlightData, returnFlightData);
      },
      [adults, childrens, infants, onSelectFlight],
    );

    const handleCloseFlightDetails = useCallback(() => {
      setSelectedFlight(null);
    }, []);

    const handleBackToList = useCallback(() => {
      setSelectedReturnIndex(null);
      setSelectedFlight(null);
      onBackToList();
    }, [onBackToList]);

    return (
      <div className="container-fluid px-0" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Back button */}
        <div className="mb-4">
          <button
            className="btn btn-outline-primary d-flex align-items-center gap-2"
            onClick={handleBackToList}
          >
            <FaArrowLeft className={isRTL ? 'order-2' : ''} />
            {t('back_to_results')}
          </button>
        </div>

        {/* Selected Departure Flight */}
        <>
          <div className="card-header text-white my-2">
            <div className="d-flex text-primary align-items-center gap-2">
              <FaPlane />
              <h5 className="mb-0">{t('departure_flight')}</h5>
            </div>
          </div>
          <div className="card shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="row align-items-center g-3">
                {/* Airline */}
                <div className="col-auto">
                  <div
                    className="badge bg-primary rounded-pill d-flex align-items-center justify-content-center text-white fw-bold"
                    style={{ width: '60px', height: '60px', fontSize: '16px' }}
                  >
                    {
                      selectedDepartureData?.legs?.[0]?.airline_info
                        ?.carrier_code
                    }
                  </div>
                </div>

                {/* Flight Route */}
                <div className="col">
                  <div className="d-flex align-items-center">
                    <div className="text-center">
                      <div className="h4 fw-bold text-dark mb-1">
                        {formatTime(departureInfo?.date || '')}
                      </div>
                      <div className="fw-semibold text-muted">
                        {departureInfo?.airport_code}
                      </div>
                      <div className="small text-muted">
                        {departureInfo?.airport_name}
                      </div>
                    </div>

                    <div className="flex-grow-1 mx-4 position-relative">
                      <div className="d-flex align-items-center justify-content-center">
                        <div
                          className="bg-success rounded-pill flex-grow-1"
                          style={{ height: '3px' }}
                        ></div>
                        <div className="mx-3 text-center">
                          <FaPlane className="text-success" size={20} />
                          <div className="small text-muted mt-1">
                            {formatDuration(
                              selectedDepartureData?.legs?.[0]?.time_info
                                ?.leg_duration_time_minute || 0,
                            )}
                          </div>
                        </div>
                        <div
                          className="bg-success rounded-pill flex-grow-1"
                          style={{ height: '3px' }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="h4 fw-bold text-dark mb-1">
                        {formatTime(arrivalInfo?.date || '')}
                      </div>
                      <div className="fw-semibold text-muted">
                        {arrivalInfo?.airport_code}
                      </div>
                      <div className="small text-muted">
                        {arrivalInfo?.airport_name}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-center mt-3 gap-3">
                    <span className="badge bg-success text-white rounded-pill d-flex align-items-center gap-1 p-2">
                      <FaClock size={12} />
                      {formatDuration(
                        selectedDepartureData?.legs?.[0]?.time_info
                          ?.leg_duration_time_minute || 0,
                      )}
                    </span>
                    {selectedDepartureData?.legs?.[0]?.time_info
                      ?.number_of_stops === '0' ? (
                      <span className="badge bg-info text-white rounded-pill p-2">
                        {t('nonstop')}
                      </span>
                    ) : (
                      <span className="badge bg-warning text-dark rounded-pill p-2">
                        {
                          selectedDepartureData?.legs?.[0]?.time_info
                            ?.number_of_stops
                        }{' '}
                        {selectedDepartureData?.legs?.[0]?.time_info
                          ?.number_of_stops === '1'
                          ? t('stop', { count: 1 })
                          : t('stops_plural', {
                              count:
                                selectedDepartureData?.legs?.[0]?.time_info
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
                    style={{ minWidth: '180px' }}
                  >
                    <div className="h3 fw-bold mb-2">
                      {
                        selectedDepartureData?.fares?.[0]?.fare_info
                          ?.fare_detail?.currency_code
                      }{' '}
                      {
                        selectedDepartureData?.fares?.[0]?.fare_info
                          ?.fare_detail?.price_info?.total_fare
                      }
                    </div>
                    <div className="small opacity-75 mb-2">
                      <FaUsers size={12} className={isRTL ? 'ms-1' : 'me-1'} />
                      {
                        selectedDepartureData?.fares?.[0]?.fare_info?.free_seats
                      }{' '}
                      {t('seats_left')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
        {/* Return Flights Section */}
        {matchingReturns.length > 0 ? (
          <>
            <div className="p-2 rounded-2 text-primary">
              <div className="d-flex align-items-center text-primary gap-2">
                <FaPlane className="fa-flip-horizontal" />
                <h5 className="mb-0">{tReturn('title')}</h5>
                <span className="badge bg-white text-primary ms-auto">
                  {tReturn('options', { count: matchingReturns.length })}
                </span>
              </div>
            </div>
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <div className="row g-3">
                  {matchingReturns.map((returnFlight: any, index: number) => (
                    <div key={index} className="col-12">
                      <ReturnFlightCard
                        returnFlight={returnFlight}
                        index={index}
                        isSelected={selectedReturnIndex === index}
                        departureFlightData={selectedDepartureData}
                        onSelectFlight={handleSelectFlight}
                        formatTime={formatTime}
                        formatDuration={formatDuration}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 text-center">
              <div className="mb-4">
                <FaPlane className="text-muted" size={48} />
                <h5 className="mt-3 mb-2">{tReturn('no_return_flights')}</h5>
                <p className="text-muted">{tReturn('no_return_description')}</p>
              </div>
              <button
                className="btn btn-primary btn-lg px-4 py-2 rounded-pill"
                onClick={() => handleSelectFlight(selectedDepartureData)}
              >
                <FaPlane className={isRTL ? 'ms-2' : 'me-2'} size={16} />
                {tReturn('continue_one_way')}
              </button>
            </div>
          </div>
        )}

        {/* Flight Details Drawer - Lazy loaded */}
        {selectedFlight && (
          <Suspense fallback={<div>Loading...</div>}>
            <FlightDetails
              isOpen={!!selectedFlight}
              onClose={handleCloseFlightDetails}
              departureFareKey={selectedFlight.departureFareKey}
              returnFareKey={selectedFlight.returnFareKey}
              adults={selectedFlight.adults}
              childrens={selectedFlight.children}
              infants={selectedFlight.infants}
            />
          </Suspense>
        )}
      </div>
    );
  },
);

SelectedFlightView.displayName = 'SelectedFlightView';

export default SelectedFlightView;
