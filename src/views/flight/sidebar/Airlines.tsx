import { useTranslations, useLocale } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAirline } from '@/store/flightFilterSlice';
import { RootState } from '@/store/store';

const Airlines = () => {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const dispatch = useDispatch();
  const { selectedAirlines, availableAirlines } = useSelector(
    (state: RootState) => state.flightFilter,
  );

  const handleAirlineToggle = (airlineName: string) => {
    dispatch(toggleAirline(airlineName));
  };

  return (
    <div>
      {availableAirlines?.map((airline, index) => (
        <div key={index} className="row y-gap-10 items-center justify-between">
          <div className="col-auto">
            <div className="form-checkbox d-flex items-center">
              <input
                type="checkbox"
                name={`airline-${index}`}
                checked={selectedAirlines.includes(airline.id || '')}
                onChange={() => handleAirlineToggle(airline.id || '')}
              />
              <div className="form-checkbox__mark">
                <div className="form-checkbox__icon icon-check" />
              </div>
              <div className={`text-15 ${isRTL ? 'mr-10' : 'ml-10'}`}>
                {airline.text}
              </div>
            </div>
          </div>
          <div className="col-auto">
            <div className="text-15 text-light-1">{airline.count || 0}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Airlines;
