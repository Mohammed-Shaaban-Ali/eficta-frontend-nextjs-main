'use client';
import { useGetHotelBookQuery } from '@/reactQuery/hotels.api';
import NotFoundBooking from '../../booking-page/hotel/NotFoundBooking';
import AvailableRooms from '../../hotel-single/AvailableRooms';
import Overview from '../../hotel-single/Overview';
import Facilities from '../../hotel-single/Facilities';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface SuccessProps {
  isBookingDetails?: boolean;
}

const Success: React.FC<SuccessProps> = ({ isBookingDetails }) => {
  const t = useTranslations('Success');
  const params = useParams();
  const booking_Id = params.booking_Id as string;
  const { data, isFetching } = useGetHotelBookQuery(booking_Id);

  if (isFetching) {
    return <span className="dual-circle-spinner"></span>;
  }
  if (!data?.data) return <NotFoundBooking />;

  const booking = data.data.booking?.[0] || null;
  const provider_reference = data?.data?.provider_reference || null;
  const userData = {
    customer_name: data.data.customer_name,
    customer_email: data.data.customer_email,
    customer_mobile: data.data.customer_mobile,
    adults: data.data.adults,
    children: data.data.children,
  };
  const hotel = {
    packages: [data?.data.package],
  };

  // Extract passengers array from booking data
  const passengers = data?.data?.passengers || [];

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
                  {booking?.bookingID || t('not_available')}
                </div>
              </div>
              {/* End .col */}
              <div className="col-lg-3 col-md-6">
                <div className="text-15 lh-12">{t('booking_reference')}</div>
                <div className="text-15 lh-12 fw-500 text-blue-1 mt-10">
                  {provider_reference || t('not_available')}
                </div>
              </div>
              {/* End .col */}
              <div className="col-lg-3 col-md-6">
                <div className="text-15 lh-12">{t('total')}</div>
                <div className="text-15 lh-12 fw-500 text-blue-1 mt-10">
                  {booking?.totalPrice ? (
                    <span className="d-flex items-center gap-2">
                      <p style={{ fontSize: '20px', color: '#000' }}>
                        {booking.totalPrice.finalPrice}
                      </p>
                      <img
                        src={
                          'https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg'
                        }
                        alt="Currency"
                        width={20}
                        height={20}
                      />
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
          {passengers.length > 0 && (
            <div className="border-light rounded-8 px-50 py-40 mt-40">
              <h4 className="text-20 fw-500 mb-30">{t('passengers')}</h4>
              <div className="row">
                {passengers.map((pax: any, idx: number) => {
                  const isLead = pax.Id === 'lead-passenger-id';
                  const paxType =
                    pax.PersonDetails?.Type === 0 ? t('adult') : t('child');
                  return (
                    <div className="col-md-4 mb-4" key={pax.Id || idx}>
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
                              paxType === t('adult') ? '#e3f2fd' : '#fff3e0',
                            borderBottom: 'none',
                          }}
                        >
                          <i
                            className={`bi ${
                              paxType === t('adult')
                                ? 'bi-person-fill'
                                : 'bi-person-bounding-box'
                            } me-2 text-primary`}
                            style={{ fontSize: 22 }}
                          />
                          <span className="fw-bold">
                            {t('passenger')} {idx + 1}
                          </span>
                          {isLead && (
                            <span className="badge bg-success ms-2">
                              {t('lead')}
                            </span>
                          )}
                        </div>
                        <div className="card-body">
                          <h5 className="card-title mb-2">
                            {pax.PersonDetails?.Name?.NamePrefix || ''}{' '}
                            {pax.PersonDetails?.Name?.GivenName || ''}{' '}
                            {pax.PersonDetails?.Name?.Surname || ''}
                          </h5>
                          <ul className="list-group list-group-flush mb-2">
                            <li className="list-group-item px-0 py-1 border-0">
                              <strong>{t('email')}:</strong>{' '}
                              {pax.Email?.Value || t('not_available')}
                            </li>
                            <li className="list-group-item px-0 py-1 border-0">
                              <strong>{t('phone')}:</strong>{' '}
                              {pax.Telephone?.PhoneNumber || t('not_available')}
                            </li>
                            <li className="list-group-item px-0 py-1 border-0">
                              <strong>{t('type')}:</strong>{' '}
                              <span
                                className={`badge ${paxType === t('adult') ? 'bg-primary' : 'bg-warning text-dark'}`}
                              >
                                {paxType}
                              </span>
                            </li>
                            {pax.PersonDetails?.Age !== undefined && (
                              <li className="list-group-item px-0 py-1 border-0">
                                <strong>{t('age')}:</strong>{' '}
                                {pax.PersonDetails.Age}
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
        </div>
      </div>
      <Overview descriptions={data?.data?.hotel_content.descriptions} />
      <AvailableRooms hotel={hotel as any} isPreview />
      <section className="mt-40" id="facilities">
        <div className="container">
          <div className="row x-gap-40 y-gap-40">
            <div className="col-12">
              <h3 className="text-22 fw-500">
                {t('facilities_of_this_hotel')}
              </h3>
              <div className="row x-gap-40 y-gap-40 pt-20">
                <Facilities
                  amenities={data?.data?.hotel_content?.facilities as any}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Success;
