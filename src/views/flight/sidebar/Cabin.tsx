import { useTranslations, useLocale } from 'next-intl';

const Cabin = () => {
  const t = useTranslations('FlightSearch.filters');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const cabinData = [
    { key: 'economy', label: t('economy'), count: 92 },
    { key: 'premium_economy', label: t('premium_economy'), count: 72 },
    { key: 'business', label: t('business'), count: 62 },
  ];

  return (
    <div>
      {cabinData.map((cabin, index) => (
        <div key={index} className="row y-gap-10 items-center justify-between">
          <div className="col-auto">
            <div className="form-checkbox d-flex items-center">
              <input type="checkbox" />
              <div className="form-checkbox__mark">
                <div className="form-checkbox__icon icon-check" />
              </div>
              <div className={`text-15 ${isRTL ? 'mr-10' : 'ml-10'}`}>
                {cabin.label}
              </div>
            </div>
          </div>
          <div className="col-auto">
            <div className="text-15 text-light-1">{cabin.count}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cabin;
