'use client';

import { useState } from 'react';
import Pagination from '../../common/Pagination';
import ActionsButton from './ActionsButton';
import { useGetUserBookingsQuery } from '@/reactQuery/bookings.api';
import { bookingTypes } from '@/types/app/bookTypes';
import { useTranslations } from 'next-intl';
import ViewPrice from '@/components/parts/ViewPrice';
import '@/styles/booking.css';

const BookingTable = () => {
  const t = useTranslations('Profile.booking');
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of bookings per page

  const { data } = useGetUserBookingsQuery();
  const bookings = data?.data as bookingTypes[] | undefined;

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const tabItems = [
    t('all_booking'),
    t('completed'),
    t('processing'),
    t('confirmed'),
    t('cancelled'),
    t('paid'),
    t('unpaid'),
    t('partial_payment'),
  ];

  // Translate status values for filtering
  const getStatusTranslationKey = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'completed';
      case 'hold':
        return 'processing';
      case 'confirmed':
        return 'confirmed';
      case 'cancelled':
        return 'cancelled';
      default:
        return status || '';
    }
  };

  const getPaymentStatusTranslationKey = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'paid';
      case 'unpaid':
        return 'unpaid';
      case 'partial payment':
        return 'partial_payment';
      default:
        return status || '';
    }
  };

  // Filter bookings based on active tab
  const filteredBookings = bookings?.filter((booking) => {
    if (activeTab === 0) return true; // All bookings
    if (activeTab === 1) return booking.status === 'Completed';
    if (activeTab === 2) return booking.status === 'hold';
    if (activeTab === 3) return booking.status === 'Confirmed';
    if (activeTab === 4) return booking.status === 'Cancelled';
    if (activeTab === 5) return booking.payment_status === 'Paid';
    if (activeTab === 6) return booking.payment_status === 'Unpaid';
    if (activeTab === 7) return booking.payment_status === 'Partial Payment';
    return true;
  });

  // Calculate pagination
  const totalItems = filteredBookings?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedBookings = filteredBookings?.slice(startIndex, endIndex);

  return (
    <>
      <div className="tabs -underline-2 js-tabs">
        <div className="tabs__controls row x-gap-40 y-gap-10 js-tabs-controls">
          {tabItems.map((item, index) => (
            <div className="col-auto" key={index}>
              <button
                className={`tabs__button text-14 text-light-1 fw-500 pb-5 lg:pb-0 js-tabs-button ${
                  activeTab === index ? 'is-tab-el-active' : ''
                }`}
                onClick={() => handleTabClick(index)}
              >
                {item}
              </button>
            </div>
          ))}
        </div>
        {/* End tabs */}

        <div className="tabs__content pt-20 js-tabs-content">
          <div className="tabs__pane -tab-item-1 is-tab-el-active"></div>
          <div className="position-relative">
            <div
              className="table-responsive"
              style={{ overflowX: 'auto', overflowY: 'visible' }}
            >
              <table
                className="table-3 -border-bottom"
                style={{ minWidth: '1200px', width: '100%' }}
              >
                <thead className="bg-light-2">
                  <tr className="text-10">
                    <th>{t('hotel_name')}</th>
                    <th>{t('order_id')}</th>
                    <th>{t('customer')}</th>
                    <th>{t('guests')}</th>
                    <th>{t('total')}</th>
                    <th>{t('payment_status')}</th>
                    <th>{t('status')}</th>
                    <th>{t('action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBookings?.map((booking) => {
                    const hotelName =
                      booking.hotel_content?.descriptions?.[0]?.title || 'N/A';
                    const totalPrice =
                      booking.booking?.[0]?.totalPrice?.finalPrice || 0;

                    // Get translation keys for status and payment status
                    const paymentStatusKey = getPaymentStatusTranslationKey(
                      booking.payment_status,
                    );
                    const statusKey = getStatusTranslationKey(booking.status);

                    return (
                      <tr key={booking.id} className="text-11">
                        <td className="text-11">{hotelName}</td>
                        <td className="text-11">
                          {booking.booking?.[0]?.bookingReference || booking.id}
                        </td>
                        <td className="lh-16">
                          <div className="fw-500">
                            {booking.customer_name || t('not_available')}
                          </div>
                          <div className="text-11 text-light-1">
                            {booking.customer_email || t('not_available')}
                          </div>
                          <div className="text-11 text-light-1">
                            {booking.customer_mobile || t('not_available')}
                          </div>
                        </td>
                        <td className="lh-16 text-11">
                          {t('adults')}: {booking.adults}
                          <br />
                          {t('children')}: {booking.children}
                        </td>
                        <td className="fw-500 text-11">
                          <ViewPrice
                            includes_taxes={false}
                            finalPrice={totalPrice}
                          />
                        </td>
                        <td>
                          <span
                            className={`rounded-100 py-4 px-10 text-center text-11 fw-500
                            ${
                              booking.payment_status?.toLowerCase() === 'paid'
                                ? 'bg-green-1 text-green-2'
                                : booking.payment_status?.toLowerCase() ===
                                    'unpaid'
                                  ? 'bg-red-3 text-red-2'
                                  : 'bg-yellow-4 text-yellow-3'
                            }`}
                          >
                            {paymentStatusKey
                              ? t(paymentStatusKey as any)
                              : booking.payment_status}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`rounded-100 py-4 px-10 text-center text-11 fw-500
                            ${
                              booking.status?.toLowerCase() === 'completed'
                                ? 'bg-green-1 text-green-2'
                                : booking.status?.toLowerCase() === 'cancelled'
                                  ? 'bg-red-3 text-red-2'
                                  : 'bg-yellow-4 text-yellow-3'
                            }`}
                          >
                            {statusKey ? t(statusKey as any) : booking.status}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <ActionsButton booking={booking} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default BookingTable;
