import { useTranslations, useLocale } from 'next-intl';

const DepartingFrom = () => {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const defaultAirports = [
    { code: 'BOS', name: 'Boston', count: 92 },
    { code: 'PVD', name: 'Providence', count: 45 },
  ];
  return (
    <div>
      {defaultAirports.map((airport, index) => (
        <div key={index} className="row y-gap-10 items-center justify-between">
          <div className="col-auto">
            <div className="form-checkbox d-flex items-center">
              <input type="checkbox" name={`departure-${index}`} />
              <div className="form-checkbox__mark">
                <div className="form-checkbox__icon icon-check" />
              </div>
              <div className={`text-15 ${isRTL ? 'mr-10' : 'ml-10'}`}>
                {airport.code} {airport.name}
              </div>
            </div>
          </div>
          <div className="col-auto">
            <div className="text-15 text-light-1">{airport.count || 0}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DepartingFrom;
