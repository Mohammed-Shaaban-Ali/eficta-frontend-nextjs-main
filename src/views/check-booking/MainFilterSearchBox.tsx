import { useState } from 'react';
import FlyingFromLocation from './FlyingFromLocation';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

const MainFilterSearchBox = () => {
  const router = useRouter();
  const t = useTranslations('CheckBooking');
  const [bookingId, setBookingId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingId.trim()) {
      router.push(`/booking/${bookingId}`);
    }
  };
  return (
    <>
      <div className="mainSearch -col-4 -w-1070 bg-white shadow-1 rounded-4 pr-20 py-20 lg:px-20 lg:pt-5 lg:pb-20 mt-15">
        <div className="button-grid items-center">
          <FlyingFromLocation
            setBookingId={setBookingId}
            bookingId={bookingId}
          />

          <div className="button-item">
            <button
              onClick={handleSubmit}
              className="mainSearch__submit button -blue-1 py-15 px-35 h-60 col-12 rounded-4 bg-dark-1 text-white"
            >
              <i className="icon-search text-20 mr-10" />
              {t('search')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainFilterSearchBox;
