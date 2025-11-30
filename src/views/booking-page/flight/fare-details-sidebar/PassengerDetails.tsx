'use client';
import { useTranslations, useLocale } from 'next-intl';

interface PassengerDetailsProps {
  members: any[];
}

const PassengerDetails: React.FC<PassengerDetailsProps> = ({ members }) => {
  const t = useTranslations('BookingPage.booking_sidebar');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const getTotalPassengers = () => {
    return members.length;
  };

  return (
    <>
      <div className="text-18 fw-500 mb-15">{t('passenger_details')}</div>

      <div className="row y-gap-20 justify-between items-center">
        <div className="col-auto">
          <div className="d-flex align-items-center gap-15">
            <i className="icon-user text-blue-1"></i>
            <div>
              <div className="text-16 fw-500">
                {getTotalPassengers()}{' '}
                {getTotalPassengers() === 1 ? t('passenger') : t('passengers')}
              </div>
              <div className="text-14 text-light-1">
                {members.filter((m) => m.type === 'ADULT').length > 0 &&
                  `${members.filter((m) => m.type === 'ADULT').length} ${t('adults')}`}
                {members.filter((m) => m.type === 'CHILD').length > 0 &&
                  `, ${members.filter((m) => m.type === 'CHILD').length} ${t('children')}`}
                {members.filter((m) => m.type === 'INFANT').length > 0 &&
                  `, ${members.filter((m) => m.type === 'INFANT').length} ${t('infants')}`}
              </div>
            </div>
          </div>
        </div>

        <div className="col-auto">
          <a href="#" className="text-15 text-blue-1 underline">
            {t('change_selection')}
          </a>
        </div>
      </div>
    </>
  );
};

export default PassengerDetails;
