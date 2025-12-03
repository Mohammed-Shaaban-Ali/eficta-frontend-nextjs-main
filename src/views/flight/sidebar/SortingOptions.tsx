import { useLocale } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { setSortBy, toggleProvider } from '@/store/flightFilterSlice';
import { RootState } from '@/store/store';

const SortingOptions = ({
  sortingOptions = [],
  flightType = 'departure',
}: {
  sortingOptions?: {
    id: string;
    text: string;
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
  const selectedSortBy = filters.sortBy;

  const handleStopToggle = (stopId: 'price' | 'duration') => {
    dispatch(setSortBy({ sortBy: stopId, flightType }));
  };

  const sortingOptionsToRender =
    sortingOptions.length > 0 ? sortingOptions : [];

  return (
    <div>
      {sortingOptionsToRender.map((sortingOption, index) => {
        // const stopType = stopTypeMapping[stop.id];
        const isChecked = selectedSortBy === sortingOption.id;

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
                  onChange={() => handleStopToggle(sortingOption.id as any)}
                />
                <div className="form-checkbox__mark">
                  <div className="form-checkbox__icon icon-check" />
                </div>
                <div className={`text-15 ${isRTL ? 'mr-10' : 'ml-10'}`}>
                  {sortingOption.text}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SortingOptions;
