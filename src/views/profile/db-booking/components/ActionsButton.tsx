'use client';
import { bookingTypes } from '@/types/app/bookTypes';
import { useState, useEffect } from 'react';
import BookingDetailsModal from './BookingDetailsModal';
import { useCancelUserBookMutation } from '@/reactQuery/bookings.api';
import toast from 'react-hot-toast';
import { getError } from '@/utils/getError';
import { useTranslations } from 'next-intl';

const ActionsButton = ({ booking }: { booking: bookingTypes }) => {
  // Define translations with explicit namespace to avoid resolution issues
  const t = useTranslations('Profile.booking');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { mutateAsync } = useCancelUserBookMutation({
    bookingReference: booking.provider_reference as string,
  });
  // Position dropdown and close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdownContainer = document.getElementById(
        `dropdown-container-${booking.id}`,
      );
      if (
        dropdownContainer &&
        !dropdownContainer.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);

      // Position dropdown relative to button
      const button = document.getElementById(`dropdown-btn-${booking.id}`);
      const dropdown = document.getElementById(`dropdown-menu-${booking.id}`);

      if (button && dropdown) {
        const rect = button.getBoundingClientRect();
        dropdown.style.top = `${rect.bottom + 2}px`;
        dropdown.style.left = `${rect.left}px`;
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [booking.id, showDropdown]);

  const handleAction = (action: string) => {
    setShowDropdown(false);

    switch (action) {
      case 'view':
        setIsModalOpen(true);
        break;
      case 'cancel':
        console.log('Cancel booking:', booking.id);
        // Logic for cancellation confirmation could go here
        break;
      case 'modify':
        console.log('Modify booking:', booking.id);
        break;
      case 'print':
        console.log('Print booking:', booking.id);
        break;
      case 'download':
        console.log('Download details for booking:', booking.id);
        break;
      default:
        break;
    }
  };

  const onSubmit = async () => {
    try {
      await mutateAsync();
      toast.success('your booking is cancelled successfully');
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <div className="dropdown" id={`dropdown-container-${booking.id}`}>
      {/* Bootstrap Dropdown Button */}
      <button
        id={`dropdown-btn-${booking.id}`}
        className="btn btn-outline-primary dropdown-toggle d-flex align-items-center"
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-expanded={showDropdown}
      >
        <i className="bi bi-gear-fill me-2"></i>
        <span>{t('action', { fallback: 'Action' })}</span>
      </button>

      {/* Custom Bootstrap Dropdown Menu */}
      {showDropdown && (
        <div
          id={`dropdown-menu-${booking.id}`}
          className="dropdown-menu shadow show"
          style={{
            position: 'fixed',
            zIndex: 10000,
            minWidth: '220px',
            maxHeight: 'none',
            overflow: 'visible',
            backgroundColor: '#fff',
            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(0,0,0,.15)',
            borderRadius: '0.375rem',
          }}
        >
          <button
            className="dropdown-item d-flex align-items-center"
            onClick={() => handleAction('view')}
          >
            <i className="bi bi-eye-fill me-2 text-info"></i>
            <span>{t('viewDetails', { fallback: 'View Details' })}</span>
          </button>

          {/* <button
            className="dropdown-item d-flex align-items-center"
            onClick={() => handleAction('modify')}
          >
            <i className="bi bi-pencil-fill me-2 text-primary"></i>
            <span>{t('modifyBooking')}</span>
          </button>

          <button
            className="dropdown-item d-flex align-items-center"
            onClick={() => handleAction('print')}
          >
            <i className="bi bi-printer-fill me-2 text-secondary"></i>
            <span>{t('printItinerary')}</span>
          </button>

          <button
            className="dropdown-item d-flex align-items-center"
            onClick={() => handleAction('download')}
          >
            <i className="bi bi-file-earmark-arrow-down-fill me-2 text-success"></i>
            <span>{t('downloadConfirmation')} </span>
          </button> */}

          <div className="dropdown-divider"></div>

          {booking.status === 'confirmed' && (
            <button
              className="dropdown-item d-flex align-items-center text-danger"
              onClick={onSubmit}
            >
              <i className="bi bi-x-circle-fill me-2"></i>
              <span>{t('cancelBooking', { fallback: 'Cancel Booking' })}</span>
            </button>
          )}
        </div>
      )}

      {/* Booking Details Modal */}
      <BookingDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        booking={booking}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ActionsButton;
