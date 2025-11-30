'use client';
import { useTranslations, useLocale } from 'next-intl';

interface FlightInfoProps {
  cabinClass: string;
  hasReturnFlight: boolean;
}

const FlightInfo: React.FC<FlightInfoProps> = ({
  cabinClass,
  hasReturnFlight,
}) => {
  const t = useTranslations('BookingPage.booking_sidebar');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <>
      {/* Flight Class */}
      <div className="row y-gap-5 justify-between">
        <div className="col-auto">
          <div className="text-15">{t('cabin_class')}:</div>
        </div>
        <div className="col-auto">
          <div className="fw-500">{cabinClass || 'Economy'}</div>
        </div>
      </div>

      {/* Trip Type */}
      <div className="row y-gap-5 justify-between pt-5">
        <div className="col-auto">
          <div className="text-15">{t('trip_type')}:</div>
        </div>
        <div className="col-auto">
          <div className="fw-500">
            {hasReturnFlight ? t('round_trip') : t('one_way')}
          </div>
        </div>
      </div>
    </>
  );
};

export default FlightInfo;
