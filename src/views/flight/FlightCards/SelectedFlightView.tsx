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
                <div className="col-auto d-flex flex-column max-w-20 ">
                  <div className="">
                    <img
                      src={selectedDepartureData?.legs?.[0]?.airline_info?.logo}
                      alt={
                        selectedDepartureData?.legs?.[0]?.airline_info
                          ?.carrier_code
                      }
                      width={50}
                      height={50}
                    />
                  </div>
                  <p className="text-truncate small">
                    {
                      selectedDepartureData?.legs?.[0]?.airline_info
                        ?.carrier_name
                    }
                  </p>
                  <p className="small">
                    ({selectedDepartureData?.legs?.[0]?.flight_number})
                  </p>
                  {/* provider */}
                  <p className="small fw-bold">
                    {selectedDepartureData?.provider_key}
                  </p>
                </div>

                {/* Flight Route */}
                <div className="col ">
                  <div className="d-flex align-items-center position-relative">
                    <div className="text-center">
                      <div className="h5 fw-bold text-dark mb-1">
                        {formatTime(
                          selectedDepartureData?.legs?.[0]?.departure_info
                            ?.date || '',
                        )}
                      </div>
                      <div className="small text-muted fw-semibold">
                        {
                          selectedDepartureData?.legs?.[0]?.departure_info
                            ?.airport_code
                        }
                      </div>
                      <div className="small text-muted fw-semibold">
                        {formatDate(
                          selectedDepartureData?.legs?.[0]?.departure_info
                            ?.date || '',
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
                          selectedDepartureData?.legs?.[
                            selectedDepartureData?.legs?.length - 1
                          ]?.arrival_info?.date || '',
                        )}
                      </div>
                      <div className="small text-muted fw-semibold">
                        {
                          selectedDepartureData?.legs?.[
                            selectedDepartureData?.legs?.length - 1
                          ]?.arrival_info?.airport_code
                        }
                      </div>
                      <div className="small text-muted fw-semibold">
                        {formatDate(
                          selectedDepartureData?.legs?.[
                            selectedDepartureData?.legs?.length - 1
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
                              selectedDepartureData?.legs?.[0]?.time_info
                                ?.flight_time_hour *
                                60 +
                                selectedDepartureData?.legs?.[0]?.time_info
                                  ?.flight_time_minute,
                            )}
                          </span>
                        </div>
                        {selectedDepartureData?.legs?.length === 1 ? (
                          <div className="d-flex flex-row align-items-center justify-content-center gap-2 mt-2">
                            <span className="badge bg-primary text-white rounded p-2">
                              {t('nonstop')}
                            </span>
                          </div>
                        ) : (
                          selectedDepartureData?.legs?.map(
                            (leg: any, i: number) => {
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
                            },
                          )
                        )}
                      </div>
                    </div>
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
                      {selectedDepartureData?.minimum_package_price}
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
                        formatDate={formatDate}
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
