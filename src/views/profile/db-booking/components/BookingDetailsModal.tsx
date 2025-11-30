'use client';

import { bookingTypes } from '@/types/app/bookTypes';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
// Import Swiper React components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: bookingTypes;
  onSubmit: () => void;
}

const BookingDetailsModal = ({
  isOpen,
  onClose,
  booking,
  onSubmit,
}: BookingDetailsModalProps) => {
  const t = useTranslations('Profile.booking.details_modal');
  const [activeTab, setActiveTab] = useState('general');

  // Close modal with Escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Extract data
  const hotelImages = booking.hotel_content?.images || [];
  const roomImages = booking.package?.images || [];
  const allImages = [...hotelImages, ...roomImages];

  const hotelName = booking.hotel_content?.descriptions?.[0]?.title || 'Hotel';

  const totalPrice = booking.package?.price?.finalPrice || 0;
  // const currency = (
  //   <img
  //     src={
  //       'https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg'
  //     }
  //     alt="Currency"
  //     width={20}
  //     height={20}
  //   />
  // );

  const facilities = booking.hotel_content?.facilities || [];
  const roomFacilities = facilities.filter(
    (f) => f.facilityType === 'RoomFacility',
  );
  const hotelFacilities = facilities.filter(
    (f) => f.facilityType === 'HotelFacility',
  );

  return (
    <div
      className={`modal fade ${isOpen ? 'show d-block' : ''}`}
      tabIndex={-1}
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
    >
      <div
        className="modal-dialog modal-xl modal-dialog-scrollable h-90"
        style={{ maxHeight: '90vh' }}
      >
        <div className="modal-content h-100">
          {/* Header */}
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title fs-4 fw-bold">{t('title')}</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Content */}
          <div className="modal-body p-3 overflow-auto">
            <div className="row g-4">
              {/* Left column - Hotel info and image gallery */}
              <div className="col-md-8">
                {/* Replace image carousel with Swiper */}
                <div
                  className="position-relative mb-4"
                  style={{ height: '300px' }}
                >
                  {allImages.length > 0 ? (
                    <Swiper
                      modules={[Navigation, Pagination, Autoplay]}
                      spaceBetween={0}
                      slidesPerView={1}
                      navigation
                      pagination={{ clickable: true }}
                      autoplay={{ delay: 5000, disableOnInteraction: false }}
                      loop={true}
                      className="h-100 rounded overflow-hidden"
                    >
                      {allImages.map((image, index) => (
                        <SwiperSlide key={index}>
                          <img
                            src={image}
                            alt={`${t('common.hotel_image')} ${index + 1}`}
                            className="w-100 h-100 object-fit-cover"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center rounded">
                      <span className="text-muted small">
                        {t('common.no_images_available')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tabs menu */}
                <ul className="nav nav-tabs mb-3">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'general' ? 'active' : ''}`}
                      onClick={() => setActiveTab('general')}
                    >
                      {t('tabs.general_info')}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'rooms' ? 'active' : ''}`}
                      onClick={() => setActiveTab('rooms')}
                    >
                      {t('tabs.room_details')}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'guests' ? 'active' : ''}`}
                      onClick={() => setActiveTab('guests')}
                    >
                      {t('tabs.guests')}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'facilities' ? 'active' : ''}`}
                      onClick={() => setActiveTab('facilities')}
                    >
                      {t('tabs.facilities')}
                    </button>
                  </li>
                </ul>

                {/* Tab content */}
                <div className="tab-content mb-4">
                  {/* General tab */}
                  <div
                    className={`tab-pane fade ${activeTab === 'general' ? 'show active' : ''}`}
                  >
                    <h4 className="fs-5 fw-bold mb-3">
                      {hotelName || t('general.hotel_details')}
                    </h4>
                    <div className="container mb-20">
                      {booking.hotel_content.descriptions?.map((des) => (
                        <div
                          key={des.line}
                          className="row align-items-center mb-2"
                        >
                          <div className="col-auto">
                            <i className="icon-check text-15" />
                          </div>
                          <div className="col px-0">
                            <div className="text-15">{des.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rooms tab */}
                  <div
                    className={`tab-pane fade ${activeTab === 'rooms' ? 'show active' : ''}`}
                  >
                    {booking.package?.rooms?.map((room, index) => (
                      <div
                        key={index}
                        className="card mb-3 bg-light bg-opacity-50"
                      >
                        <div className="card-body">
                          <h5 className="card-title fs-6 fw-bold mb-3">
                            {room.roomName}
                          </h5>

                          {/* Room image gallery with Swiper if room has images */}
                          {room.images && room.images.length > 0 && (
                            <div className="mb-3" style={{ height: '180px' }}>
                              <Swiper
                                modules={[Navigation, Pagination]}
                                spaceBetween={0}
                                slidesPerView={1}
                                navigation
                                pagination={{ clickable: true }}
                                loop={true}
                                className="rounded overflow-hidden"
                                style={{ height: '20rem' }}
                              >
                                {room.images.map((image, imgIndex) => (
                                  <SwiperSlide key={imgIndex}>
                                    <img
                                      src={image}
                                      alt={`Room image ${imgIndex + 1}`}
                                      className="w-100 h-100 object-fit-cover"
                                    />
                                  </SwiperSlide>
                                ))}
                              </Swiper>
                            </div>
                          )}

                          <div className="row">
                            <div className="col-md-6">
                              <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                                <span className="text-muted">
                                  {t('room.type')}
                                </span>
                                <span>{room.roomType}</span>
                              </div>
                              <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                                <span className="text-muted">
                                  {t('room.basis')}
                                </span>
                                <span>{room.roomBasis}</span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                                <span className="text-muted">
                                  {t('room.adults')}
                                </span>
                                <span>{room.adultsCount}</span>
                              </div>
                              <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                                <span className="text-muted">
                                  {t('room.price')}
                                </span>
                                <span className="fw-bold">
                                  <img
                                    src={
                                      'https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg'
                                    }
                                    alt={t('common.currency')}
                                    width={20}
                                    height={20}
                                  />
                                  <p>{room.price.finalPrice}</p>
                                </span>
                              </div>
                            </div>
                          </div>

                          {room.descriptions &&
                            room.descriptions.length > 0 && (
                              <div className="mt-3">
                                <div
                                  className="small"
                                  dangerouslySetInnerHTML={{
                                    __html: room.descriptions[0],
                                  }}
                                />
                              </div>
                            )}

                          {room.specialDeals &&
                            room.specialDeals.length > 0 && (
                              <div className="mt-3">
                                <span className="badge bg-warning text-dark">
                                  {room.specialDeals.join(', ')}
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Guests tab */}
                  <div
                    className={`tab-pane fade ${activeTab === 'guests' ? 'show active' : ''}`}
                  >
                    <div className="card mb-4 bg-primary bg-opacity-10">
                      <div className="card-body">
                        <h5 className="card-title fs-6 fw-bold mb-3">
                          {t('guests.primary_contact')}
                        </h5>
                        <div className="row">
                          <div className="col-md-4 mb-2">
                            <span className="text-muted d-block">
                              {t('guests.customer')}
                            </span>
                            <span className="fw-bold">
                              {booking.customer_name}
                            </span>
                          </div>
                          <div className="col-md-4 mb-2">
                            <span className="text-muted d-block">
                              {t('guests.email')}
                            </span>
                            <span className="fw-bold">
                              {booking.customer_email}
                            </span>
                          </div>
                          <div className="col-md-4 mb-2">
                            <span className="text-muted d-block">
                              {t('guests.mobile')}
                            </span>
                            <span className="fw-bold">
                              {booking.customer_mobile}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h5 className="fs-6 fw-bold mt-4 mb-3">
                      {t('guests.all_passengers')}
                    </h5>
                    {booking.passengers?.map((passenger, index) => (
                      <div key={index} className="card mb-3">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6 mb-2">
                              <span className="text-muted d-block">
                                {t('guests.name')}
                              </span>
                              <span className="fw-bold">
                                {passenger.PersonDetails?.Name?.NamePrefix}{' '}
                                {passenger.PersonDetails?.Name?.GivenName}{' '}
                                {passenger.PersonDetails?.Name?.Surname}
                              </span>
                            </div>
                            <div className="col-md-6 mb-2">
                              <span className="text-muted d-block">
                                {t('guests.type')}
                              </span>
                              <span>
                                {passenger.PersonDetails?.Type === 0
                                  ? t('guests.adult')
                                  : t('guests.child')}
                              </span>
                            </div>

                            {passenger.Email && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted d-block">
                                  {t('guests.email')}
                                </span>
                                <span>{passenger.Email.Value}</span>
                              </div>
                            )}

                            {passenger.Telephone && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted d-block">
                                  {t('guests.phone')}
                                </span>
                                <span>{passenger.Telephone.PhoneNumber}</span>
                              </div>
                            )}

                            {passenger.PersonDetails?.Age && (
                              <div className="col-md-6 mb-2">
                                <span className="text-muted d-block">
                                  {t('guests.age')}
                                </span>
                                <span>{passenger.PersonDetails.Age}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Facilities tab */}
                  <div
                    className={`tab-pane fade ${activeTab === 'facilities' ? 'show active' : ''}`}
                  >
                    <div className="row">
                      <div className="col-md-6">
                        <h5 className="fs-6 fw-bold mb-3">
                          {t('facilities.hotel_facilities')}
                        </h5>
                        <div className="row">
                          {hotelFacilities.map((facility, index) => (
                            <div key={index} className="col-md-6 mb-2">
                              <div className="d-flex align-items-center">
                                <i className="bi bi-check-circle-fill text-primary me-2 small"></i>
                                <span className="small">
                                  {facility.facility}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h5 className="fs-6 fw-bold mb-3">
                          {t('facilities.room_facilities')}
                        </h5>
                        <div className="row">
                          {roomFacilities.map((facility, index) => (
                            <div key={index} className="col-md-6 mb-2">
                              <div className="d-flex align-items-center">
                                <i className="bi bi-check-circle-fill text-primary me-2 small"></i>
                                <span className="small">
                                  {facility.facility}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column - Customer info and booking summary */}
              <div className="col-md-4">
                {/* Customer information card */}
                <div className="card mb-4 bg-primary bg-opacity-10">
                  <div className="card-body">
                    <h5 className="card-title fs-6 fw-bold mb-3">
                      <i className="bi bi-person me-2"></i>
                      {t('sidebar.customer_information')}
                    </h5>
                    <div className="mb-2">
                      <div className="d-flex align-items-center mb-2">
                        <span className="text-muted me-2 w-25">
                          {t('sidebar.name')}
                        </span>
                        <span className="fw-bold">{booking.customer_name}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <span className="text-muted me-2 w-25">
                          {t('sidebar.email')}
                        </span>
                        <span className="small">{booking.customer_email}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="text-muted me-2 w-25">
                          {t('sidebar.phone')}
                        </span>
                        <span className="small">{booking.customer_mobile}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking summary card */}
                <div className="card mb-4">
                  <div className="card-body">
                    <h5 className="card-title fs-6 fw-bold mb-3">
                      <i className="bi bi-receipt me-2"></i>
                      {t('sidebar.booking_summary')}
                    </h5>
                    <div className="mb-2">
                      <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                        <span className="text-muted">
                          {t('sidebar.booking_id')}
                        </span>
                        <span className="fw-bold">{booking.id}</span>
                      </div>
                      <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                        <span className="text-muted">
                          {t('sidebar.status')}
                        </span>
                        <span
                          className={`badge ${
                            booking.status === 'Completed'
                              ? 'bg-success'
                              : booking.status === 'Cancelled'
                                ? 'bg-danger'
                                : 'bg-warning'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                        <span className="text-muted">
                          {t('sidebar.payment')}
                        </span>
                        <span
                          className={`badge ${
                            booking.payment_status === 'Paid'
                              ? 'bg-success'
                              : booking.payment_status === 'Unpaid'
                                ? 'bg-danger'
                                : 'bg-warning'
                          }`}
                        >
                          {booking.payment_status}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                        <span className="text-muted">
                          {t('sidebar.total_amount')}
                        </span>
                        <span className="fs-5 fw-bold d-flex align-items-center gap-2">
                          <img
                            src={
                              'https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg'
                            }
                            alt={t('common.currency')}
                            width={20}
                            height={20}
                          />
                          <p>{totalPrice}</p>
                        </span>
                      </div>
                      <div className="d-flex justify-content-between pb-2">
                        <span className="text-muted">
                          {t('sidebar.guests')}
                        </span>
                        <span>
                          {t('sidebar.adults')} {booking.adults},{' '}
                          {t('sidebar.children')} {booking.children}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="d-grid gap-2">
                  {/* <button className="btn btn-dark">
                    <i className="bi bi-file-earmark-text me-2"></i>
                    {t('actions.view_invoice')}
                  </button>
                  <button className="btn btn-primary">
                    <i className="bi bi-printer me-2"></i>
                    {t('actions.print_details')}
                  </button>
                  {booking.payment_status === 'Unpaid' && (
                    <button className="btn btn-success">
                      <i className="bi bi-credit-card me-2"></i>
                      {t('actions.pay_now')}
                    </button>
                  )} */}
                  {booking.status === 'confirmed' && (
                    <button onClick={onSubmit} className="btn btn-danger">
                      <i className="bi bi-trash me-2"></i>
                      {t('actions.cancel_booking')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
