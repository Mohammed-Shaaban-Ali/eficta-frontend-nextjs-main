import { useTranslations, useLocale } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';

const Alliance = () => {
  const t = useTranslations('FlightSearch.filters');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const alliancesData = [
    'oneworld',
    'Star Alliance',
    'SkyTeam',
    'Value Alliance',
    'U-FLY Alliance',
    'Vanilla Alliance',
    'Future Travel Alliance',
    'Globalia Alliance',
    'Airline Alliance',
    'Regional Airline Alliance',
  ];
  return (
    <div>
      {alliancesData.map((alliance, index) => (
        <div key={index} className="row y-gap-10 items-center justify-between">
          <div className="col-auto">
            <div className="form-checkbox d-flex items-center">
              <input type="checkbox" name={`alliance-${index}`} />
              <div className="form-checkbox__mark">
                <div className="form-checkbox__icon icon-check" />
              </div>
              <div className={`text-15 ${isRTL ? 'mr-10' : 'ml-10'}`}>
                {t(alliance as any)}
              </div>
            </div>
          </div>
          <div className="col-auto">
            <div className="text-15 text-light-1">{alliance}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Alliance;
