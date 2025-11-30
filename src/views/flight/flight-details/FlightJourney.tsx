'use client';
import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { FaPlane, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

interface Flight {
  flight: {
    from: string;
    to: string;
    operator_airline_code: string;
    flight_number: string;
    departure_time: string;
    arrival_time: string;
  };
}

interface FlightJourneyProps {
  departureFlights: Flight[];
  returnFlights?: Flight[];
  totalFare: number;
  currencyCode: string;
}

const FlightJourney: React.FC<FlightJourneyProps> = ({
  departureFlights,
  returnFlights,
  totalFare,
  currencyCode,
}) => {
  const t = useTranslations('FlightSearch.details');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const formatPrice = (amount: number, currency: string) => {
    if (isRTL) {
      return `${amount.toFixed(2)} ${currency}`;
    }
    return `${currency} ${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const renderFlightCard = (
    flight: Flight,
    index: number,
    isReturn = false,
  ) => (
    <div key={index}>
      {/* Flight Header */}
      <div
        className={`d-flex align-items-center justify-content-between p-3 ${isReturn ? 'bg-secondary bg-opacity-10' : 'bg-light'} rounded-3 mb-3`}
      >
        <div className="d-flex align-items-center gap-3">
          <div className="bg-white rounded-2 p-2 shadow-sm">
            <img
              src={`https://images.kiwi.com/airlines/64/${flight.flight.operator_airline_code}.png`}
              alt={flight.flight.operator_airline_code}
              className="d-block"
              style={{ width: '28px', height: '28px' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div>
            <h6 className="mb-1 fw-bold">
              {flight.flight.from} → {flight.flight.to}
            </h6>
            <div className="d-flex align-items-center gap-2">
              <span
                className={`badge ${isReturn ? 'bg-secondary' : 'bg-primary'}`}
              >
                {flight.flight.operator_airline_code}{' '}
                {flight.flight.flight_number}
              </span>
              <span className="small text-muted">
                {formatDate(flight.flight.departure_time)}
              </span>
            </div>
          </div>
        </div>
        <div className={`text-${isRTL ? 'start' : 'end'}`}>
          <div className="small text-muted">{t('duration')}</div>
          <div className="fw-bold">{t('direct')}</div>
        </div>
      </div>

      {/* Flight Timeline */}
      <div className="row g-0 align-items-center mb-4">
        <div className="col-5">
          <div className="text-center">
            <div className="h4 fw-bold text-dark mb-1">
              {formatTime(flight.flight.departure_time)}
            </div>
            <div
              className={`h6 fw-semibold ${isReturn ? 'text-secondary' : 'text-primary'} mb-1`}
            >
              {flight.flight.from}
            </div>
            <div className="small text-muted">
              <FaCalendarAlt size={10} className={isRTL ? 'ms-1' : 'me-1'} />
              {formatDate(flight.flight.departure_time)}
            </div>
          </div>
        </div>

        <div className="col-2">
          <div className="text-center">
            <div
              className="position-relative mx-auto"
              style={{ width: '60px' }}
            >
              <div
                className={`border-top ${isReturn ? 'border-secondary' : 'border-primary'} border-2 w-100 position-relative`}
              >
                <div
                  className={`position-absolute top-50 start-50 translate-middle ${isReturn ? 'bg-secondary' : 'bg-primary'} rounded-circle d-flex align-items-center justify-content-center`}
                  style={{ width: '30px', height: '30px' }}
                >
                  <FaPlane
                    className="text-white"
                    size={12}
                    style={{
                      transform:
                        isReturn && !isRTL ? 'scaleX(-1)' : 'scaleX(1)',
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="small text-muted mt-2 fw-semibold">
              {t('direct')}
            </div>
          </div>
        </div>

        <div className="col-5">
          <div className="text-center">
            <div className="h4 fw-bold text-dark mb-1">
              {formatTime(flight.flight.arrival_time)}
            </div>
            <div
              className={`h6 fw-semibold ${isReturn ? 'text-warning' : 'text-success'} mb-1`}
            >
              {flight.flight.to}
            </div>
            <div className="small text-muted">
              <FaMapMarkerAlt size={10} className={isRTL ? 'ms-1' : 'me-1'} />
              {t('arrival')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-3">
            <div>
              <h5 className="mb-1 fw-bold">{t('flight_journey')}</h5>
              <p className="mb-0 text-muted small">{t('complete_itinerary')}</p>
            </div>
          </div>
          <div className="text-end d-flex">
            <h5 className="mb-1 fw-bold text-primary">
              {formatPrice(totalFare, currencyCode)}
            </h5>
          </div>
        </div>

        {/* Departure Flights */}
        {departureFlights?.map((flight, index) =>
          renderFlightCard(flight, index, false),
        )}

        {/* Return Flights */}
        {returnFlights && returnFlights.length > 0 && (
          <div className="border-top pt-4 mt-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="bg-secondary bg-opacity-10 rounded-circle p-2">
                <FaPlane
                  className="text-secondary"
                  size={18}
                  style={{ transform: isRTL ? 'scaleX(1)' : 'scaleX(-1)' }}
                />
              </div>
              <div>
                <h5 className="mb-1 fw-bold text-secondary">
                  {t('return_flight')}
                </h5>
                <p className="mb-0 text-muted small">{t('return_journey')}</p>
              </div>
            </div>
            {returnFlights.map((flight, index) =>
              renderFlightCard(flight, index, true),
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightJourney;
