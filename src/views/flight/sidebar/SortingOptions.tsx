import { useLocale } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { setSortBy, toggleProvider } from '@/store/flightFilterSlice';
import { RootState } from '@/store/store';

const SortingOptions = ({
  sortingOptions = [],
}: {
  sortingOptions?: {
    id: string;
    text: string;
  }[];
}) => {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const dispatch = useDispatch();
  const selectedSortBy = useSelector(
    (state: RootState) => state.flightFilter.sortBy,
  );

  const handleStopToggle = (stopId: 'price' | 'duration') => {
    dispatch(setSortBy(stopId));
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
