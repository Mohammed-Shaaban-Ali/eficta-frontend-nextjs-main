import { useTranslations } from 'next-intl';

const PaymentSchedule = () => {
  const t = useTranslations('BookingPage.booking_sidebar');

  return (
    <div className="px-30 py-30 border-light rounded-4 mt-30">
      <div className="text-20 fw-500 mb-20">{t('your_payment_schedule')}</div>
      <div className="row y-gap-5 justify-between">
        <div className="col-auto">
          <div className="text-15">{t('before_stay')}</div>
        </div>
        {/* End col */}
        <div className="col-auto">
          <div className="text-15">US$4,047</div>
        </div>
        {/* End col */}
      </div>
      {/* End row */}
    </div>
  );
};

export default PaymentSchedule;
