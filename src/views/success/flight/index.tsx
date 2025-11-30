'use client';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useGetFlightBookQuery } from '@/reactQuery/flight.api';
import { FlightBookingTypes } from '@/types/app/flightBookingTypes';
import NotFoundBooking from '../../booking-page/hotel/NotFoundBooking';
import { FaPlane } from 'react-icons/fa';

interface FlightSuccessProps {
  isBookingDetails?: boolean;
}

const FlightSuccess: React.FC<FlightSuccessProps> = ({ isBookingDetails }) => {
  const t = useTranslations('Success');
  const params = useParams();
  const booking_Id = params.booking_Id as string;
  const { data, isFetching } = useGetFlightBookQuery(booking_Id);

  if (isFetching) {
    return <span className="dual-circle-spinner"></span>;
  }
  if (!data?.data) return <NotFoundBooking />;

  const booking: FlightBookingTypes = data.data;
  const userData = {
    customer_name: booking.contact_info?.name || '',
    customer_email: booking.contact_info?.email || '',
    customer_mobile: booking.contact_info?.phone || '',
    adults: booking.adult || 0,
    children: booking.child || 0,
    infants: booking.infant || 0,
  };

  // Extract flight information
  const departureFlights =
    booking.offer_details?.departure_selected_flights || [];
  const returnFlights = booking.offer_details?.return_selected_flight || [];
  const fareDetail = booking.offer_details?.fare_detail;

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

  return (
    <div className="container-lg mx-auto" style={{ paddingTop: '50px' }}>
      <div className="w-full">
        <div className="order-completed-wrapper mx-auto">
          {!isBookingDetails && (
            <div className="d-flex flex-column items-center mt-40 lg:md-40 sm:mt-24">
              <div className="size-80 flex-center rounded-full bg-dark-3">
                <i className="icon-check text-30 text-white" />
              </div>
              <div className="text-30 lh-1 fw-600 mt-20">
                {t('order_completed', { name: userData?.customer_name })}
              </div>
              <div className="text-15 text-light-1 mt-10">
                {t('booking_details', { email: userData.customer_email })}
              </div>
            </div>
          )}
          {/* End header */}

          <div className="border-type-1 rounded-8 px-50 py-35 mt-40">
            <div className="row">
              <div className="col-lg-3 col-md-6">
                <div className="text-15 lh-12">{t('order_number')}</div>
                <div className="text-15 lh-12 fw-500 text-blue-1 mt-10">
                  {booking?.booking_number || t('not_available')}
                </div>
              </div>
              {/* End .col */}
              <div className="col-lg-3 col-md-6">
                <div className="text-15 lh-12">{t('booking_reference')}</div>
                <div className="text-15 lh-12 fw-500 text-blue-1 mt-10">
                  {booking?.booking_reference ||
                    booking?.airline_booking_reference ||
                    t('not_available')}
                </div>
              </div>
              {/* End .col */}
              <div className="col-lg-3 col-md-6">
                <div className="text-15 lh-12">{t('total')}</div>
                <div className="text-15 lh-12 fw-500 text-blue-1 mt-10">
                  {fareDetail?.price_info ? (
                    <span className="d-flex items-center gap-2">
                      <p style={{ fontSize: '20px', color: '#000' }}>
                        {fareDetail.price_info.total_fare}
                      </p>
                      <span style={{ fontSize: '16px', color: '#666' }}>
                        {fareDetail.currency_code}
                      </span>
                    </span>
                  ) : (
                    t('not_available')
                  )}
                </div>
              </div>
              {/* End .col */}
              <div className="col-lg-3 col-md-6">
                <div className="text-15 lh-12">{t('payment_method')}</div>
                <div className="text-15 lh-12 fw-500 text-blue-1 mt-10">
                  {t('direct_bank_transfer')}
                </div>
              </div>
            </div>
          </div>

          <div className="border-light rounded-8 px-50 py-40 mt-40">
            <h4 className="text-20 fw-500 mb-30">{t('your_information')}</h4>
            <div className="row y-gap-10">
              {[
                { label: t('first_name'), value: userData.customer_name },
                { label: t('email'), value: userData.customer_email },
                { label: t('phone'), value: userData.customer_mobile },
                { label: t('adult'), value: userData.adults },
                { label: t('children'), value: userData.children },
              ].map((item, index) => (
                <div className="col-12" key={index}>
                  <div
                    className={`d-flex justify-between ${index !== 0 ? 'border-top-light pt-10' : ''}`}
                  >
                    <div className="text-15 lh-16">{item.label}</div>
                    <div className="text-15 lh-16 fw-500 text-blue-1">
                      {item.value || t('not_available')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Passengers Section */}
          {booking.passengers && booking.passengers.length > 0 && (
            <div className="border-light rounded-8 px-50 py-40 mt-40">
              <h4 className="text-20 fw-500 mb-30">{t('passengers')}</h4>
              <div className="row">
                {booking.passengers.map((passenger: any, idx: number) => {
                  return (
                    <div className="col-md-4 mb-4" key={idx}>
                      <div
                        className="card h-100 shadow border-0 passenger-card"
                        style={{
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          borderRadius: 16,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          className="card-header d-flex align-items-center"
                          style={{
                            background:
                              passenger.type === 'ADULT'
                                ? '#e3f2fd'
                                : '#fff3e0',
                            borderBottom: 'none',
                          }}
                        >
                          <i
                            className={`bi ${
                              passenger.type === 'ADULT'
                                ? 'bi-person-fill'
                                : 'bi-person-bounding-box'
                            } me-2 text-primary`}
                            style={{ fontSize: 22 }}
                          />
                          <span className="fw-bold">
                            {t('passenger')} {idx + 1}
                          </span>
                        </div>
                        <div className="card-body">
                          <h5 className="card-title mb-2">
                            {passenger.name} {passenger.lastName}
                          </h5>
                          <ul className="list-group list-group-flush mb-2">
                            <li className="list-group-item px-0 py-1 border-0">
                              <strong>{t('type')}:</strong>{' '}
                              <span
                                className={`badge ${
                                  passenger.type === 'ADULT'
                                    ? 'bg-primary'
                                    : 'bg-warning text-dark'
                                }`}
                              >
                                {passenger.type === 'ADULT'
                                  ? t('adult')
                                  : t('child')}
                              </span>
                            </li>
                            <li className="list-group-item px-0 py-1 border-0">
                              <strong>{t('gender')}:</strong>{' '}
                              {passenger.gender || t('not_available')}
                            </li>
                            <li className="list-group-item px-0 py-1 border-0">
                              <strong>{t('birth_date')}:</strong>{' '}
                              {passenger.birthDate || t('not_available')}
                            </li>
                            {passenger.identityInfo?.passport && (
                              <li className="list-group-item px-0 py-1 border-0">
                                <strong>{t('passport')}:</strong>{' '}
                                {passenger.identityInfo.passport.no ||
                                  t('not_available')}
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <style>
                {`
                  .passenger-card:hover {
                    transform: translateY(-6px) scale(1.02);
                    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
                  }
                `}
              </style>
            </div>
          )}

          {/* Flight Information Section */}
          {(departureFlights.length > 0 || returnFlights.length > 0) && (
            <div className="border-light rounded-8 px-50 py-40 mt-40">
              <h4 className="text-20 fw-500 mb-30">
                {t('flight_information')}
              </h4>

              <div className="p-3">
                {/* Flight Summary Card */}
                <div className="card border-0 shadow-sm mb-3">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div>
                          <h5 className="mb-1 fw-bold">
                            {t('flight_journey')}
                          </h5>
                          <p className="mb-0 text-muted small">
                            {t('complete_itinerary')}
                          </p>
                        </div>
                      </div>
                      <div className="text-end d-flex">
                        <h5 className="mb-1 fw-bold text-primary">
                          {fareDetail?.price_info ? (
                            <>
                              {fareDetail.currency_code}{' '}
                              {fareDetail.price_info.total_fare}
                            </>
                          ) : (
                            t('not_available')
                          )}
                        </h5>
                      </div>
                    </div>

                    {departureFlights.map((flight, index) => (
                      <div key={index}>
                        {/* Flight Header */}
                        <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3 mb-3">
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
                                <span className="badge bg-primary">
                                  {flight.flight.operator_airline_code}{' '}
                                  {flight.flight.flight_number}
                                </span>
                                <span className="small text-muted">
                                  {formatDate(flight.flight.departure_time)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-end">
                            <div className="small text-muted">
                              {t('duration')}
                            </div>
                            <div className="fw-bold">{t('direct')}</div>
                          </div>
                        </div>

                        {/* Modern Flight Timeline */}
                        <div className="row g-0 align-items-center mb-4">
                          <div className="col-5">
                            <div className="text-center">
                              <div className="h4 fw-bold text-dark mb-1">
                                {formatTime(flight.flight.departure_time)}
                              </div>
                              <div className="h6 fw-semibold text-primary mb-1">
                                {flight.flight.from}
                              </div>
                              <div className="small text-muted">
                                <i
                                  className="icon-calendar me-1"
                                  style={{ fontSize: '10px' }}
                                ></i>
                                {formatDate(flight.flight.departure_time)}
                              </div>
                            </div>
                          </div>

                          <div className="col-2">
                            <div className="d-flex align-items-center justify-content-center mb-1">
                              <div
                                className="bg-primary rounded-pill flex-grow-1"
                                style={{ height: '2px' }}
                              ></div>
                              <FaPlane
                                className="text-primary mx-2"
                                size={14}
                              />
                              <div
                                className="bg-primary rounded-pill flex-grow-1"
                                style={{ height: '2px' }}
                              ></div>
                            </div>
                          </div>

                          <div className="col-5">
                            <div className="text-center">
                              <div className="h4 fw-bold text-dark mb-1">
                                {formatTime(flight.flight.arrival_time)}
                              </div>
                              <div className="h6 fw-semibold text-success mb-1">
                                {flight.flight.to}
                              </div>
                              <div className="small text-muted">
                                <i
                                  className="icon-location-pin me-1"
                                  style={{ fontSize: '10px' }}
                                ></i>
                                {t('arrival')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Return Flight */}
                    {returnFlights.length > 0 && (
                      <div className="border-top pt-4 mt-4">
                        <div className="d-flex align-items-center gap-3 mb-4">
                          <div className="bg-secondary bg-opacity-10 rounded-circle p-2">
                            <i
                              className="icon-plane text-secondary"
                              style={{
                                fontSize: '18px',
                                transform: 'scaleX(-1)',
                              }}
                            ></i>
                          </div>
                          <div>
                            <h5 className="mb-1 fw-bold text-secondary">
                              {t('return_flight')}
                            </h5>
                            <p className="mb-0 text-muted small">
                              {t('return_journey')}
                            </p>
                          </div>
                        </div>

                        {returnFlights.map((flight, index) => (
                          <div key={index}>
                            {/* Flight Header */}
                            <div className="d-flex align-items-center justify-content-between p-3 bg-secondary bg-opacity-10 rounded-3 mb-3">
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
                                    <span className="badge bg-secondary">
                                      {flight.flight.operator_airline_code}{' '}
                                      {flight.flight.flight_number}
                                    </span>
                                    <span className="small text-muted">
                                      {formatDate(flight.flight.departure_time)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-end">
                                <div className="small text-muted">
                                  {t('duration')}
                                </div>
                                <div className="fw-bold">{t('direct')}</div>
                              </div>
                            </div>

                            {/* Modern Flight Timeline */}
                            <div className="row g-0 align-items-center mb-4">
                              <div className="col-5">
                                <div className="text-center">
                                  <div className="h4 fw-bold text-dark mb-1">
                                    {formatTime(flight.flight.departure_time)}
                                  </div>
                                  <div className="h6 fw-semibold text-secondary mb-1">
                                    {flight.flight.from}
                                  </div>
                                  <div className="small text-muted">
                                    <i
                                      className="icon-calendar me-1"
                                      style={{ fontSize: '10px' }}
                                    ></i>
                                    {formatDate(flight.flight.departure_time)}
                                  </div>
                                </div>
                              </div>

                              <div className="col-2">
                                <div className="d-flex align-items-center justify-content-center mb-1">
                                  <div
                                    className="bg-secondary rounded-pill flex-grow-1"
                                    style={{ height: '2px' }}
                                  ></div>
                                  <FaPlane
                                    className="text-secondary mx-2"
                                    size={14}
                                  />
                                  <div
                                    className="bg-secondary rounded-pill flex-grow-1"
                                    style={{ height: '2px' }}
                                  ></div>
                                </div>
                              </div>

                              <div className="col-5">
                                <div className="text-center">
                                  <div className="h4 fw-bold text-dark mb-1">
                                    {formatTime(flight.flight.arrival_time)}
                                  </div>
                                  <div className="h6 fw-semibold text-warning mb-1">
                                    {flight.flight.to}
                                  </div>
                                  <div className="small text-muted">
                                    <i
                                      className="icon-location-pin me-1"
                                      style={{ fontSize: '10px' }}
                                    ></i>
                                    {t('arrival')}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightSuccess;
