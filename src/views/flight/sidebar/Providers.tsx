import { useLocale } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { toggleProvider } from '@/store/flightFilterSlice';
import { RootState } from '@/store/store';

const Providers = ({
  providers = [],
}: {
  providers?: {
    id: string;
    text: string;
    count: number;
  }[];
}) => {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const dispatch = useDispatch();
  const selectedProviders = useSelector(
    (state: RootState) => state.flightFilter.providers,
  );

  const handleStopToggle = (stopId: string) => {
    dispatch(toggleProvider(stopId));
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
                <div className={`text-15 ${isRTL ? 'mr-10' : 'ml-10'}`}>
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
