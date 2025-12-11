import { useTranslations } from 'next-intl';

const FlyingFromLocation = ({
  bookingId,
  setBookingId,
}: {
  bookingId: string;
  setBookingId: (value: string) => void;
}) => {
  const t = useTranslations('CheckBooking');

  return (
    <>
      <div className="searchMenu-loc px-24 lg:py-4 lg:px-0 js-form-dd js-liverSearch">
        <div
          data-bs-toggle="dropdown"
          data-bs-auto-close="true"
          data-bs-offset="0,22"
        >
          <h4 className="text-15 fw-500 ls-2 lh-16">{t('booking_id')}</h4>
          <div className="text-15 text-light-1 ls-2 lh-16">
            <input
              autoComplete="off"
              type="search"
              placeholder={t('booking_id_placeholder')}
              className="js-search js-dd-focus"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FlyingFromLocation;
