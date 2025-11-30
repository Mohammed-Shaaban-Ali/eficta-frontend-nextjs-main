import { useTranslations, useLocale } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { toggleStop } from '@/store/flightFilterSlice';
import { RootState } from '@/store/store';

interface StopItem {
  id: number;
  text: string;
  count: number;
}

const Stops = ({ stops = [] }: { stops?: StopItem[] }) => {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const dispatch = useDispatch();
  const selectedStops = useSelector(
    (state: RootState) => state.flightFilter.stops,
  );

  // Map API stop IDs to Redux stop types
  const stopTypeMapping: {
    [key: number]: 'direct' | 'oneStopOrLess';
  } = {
    0: 'direct', // Direct flights (0 stops)
    1: 'oneStopOrLess', // 1 stop or less
  };

  const handleStopToggle = (stopId: number) => {
    const stopType = stopTypeMapping[stopId];
    if (stopType) {
      dispatch(toggleStop(stopType));
    }
  };

  const stopsToRender = stops.length > 0 ? stops : [];

  return (
    <div>
      {stopsToRender.map((stop, index) => {
        const stopType = stopTypeMapping[stop.id];
        const isChecked = stopType ? selectedStops[stopType] : false;

        return (
          <div
            key={index}
            className="row y-gap-10 items-center justify-between"
          >
            <div className="col-auto">
              <div className="form-checkbox d-flex items-center">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleStopToggle(stop.id)}
                />
                <div className="form-checkbox__mark">
                  <div className="form-checkbox__icon icon-check" />
                </div>
                <div className={`text-15 ${isRTL ? 'mr-10' : 'ml-10'}`}>
                  {stop.text}
                </div>
              </div>
            </div>
            <div className="col-auto">
              <div className="text-15 text-light-1">{stop.count || 0}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stops;
