import { useLocale } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { toggleProvider } from '@/store/flightFilterSlice';
import { RootState } from '@/store/store';

const Providers = ({
  providers = [],
  flightType = 'departure',
}: {
  providers?: {
    id: string;
    text: string;
    count: number;
  }[];
  flightType?: 'departure' | 'return';
}) => {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const dispatch = useDispatch();
  const { departureFilters, returnFilters } = useSelector(
    (state: RootState) => state.flightFilter,
  );
  const filters = flightType === 'departure' ? departureFilters : returnFilters;
  const selectedProviders = filters.providers;

  const handleStopToggle = (stopId: string) => {
    dispatch(toggleProvider({ provider: stopId, flightType }));
  };

  const providersToRender = providers.length > 0 ? providers : [];

  return (
    <div>
      {providersToRender.map((provider, index) => {
        // const stopType = stopTypeMapping[stop.id];
        const isChecked = selectedProviders.includes(provider.id);

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
                  onChange={() => handleStopToggle(provider.id)}
                />
                <div className="form-checkbox__mark">
                  <div className="form-checkbox__icon icon-check" />
                </div>
                <div
                  // line-clamp-3

                  className={`text-15 line-clamp-1 ${isRTL ? 'mr-10' : 'ml-10'}`}
                >
                  {provider.text}
                </div>
              </div>
            </div>
            <div className="col-auto">
              <div className="text-15 text-light-1">{provider.count || 0}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Providers;
