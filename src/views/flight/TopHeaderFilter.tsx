'use client';
import { useSelector, useDispatch } from 'react-redux';
import { MdOutlineFilterAltOff } from 'react-icons/md';
import { useTranslations } from 'next-intl';
import { resetFilters } from '@/store/flightFilterSlice';
import { RootState } from '@/store/store';

interface TopHeaderFilterProps {
  count: number;
  totalFlights?: number;
}

const TopHeaderFilter = ({ count, totalFlights }: TopHeaderFilterProps) => {
  const t = useTranslations('FlightSearch');
  const dispatch = useDispatch();

  // Get applied filters count from Redux
  const appliedFiltersCount = useSelector(
    (state: RootState) => state.flightFilter.appliedFiltersCount,
  );

  // Check if any filters are active
  const filtersActive = appliedFiltersCount > 0;

  // Handle reset filters
  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  return (
    <>
      <div className="row y-gap-10 items-center justify-between mb-20 px-0">
        {typeof count === 'number' && !isNaN(count) && (
          <div className="col-auto">
            <div className="text-18">
              <span className="fw-500">{count} flights</span>
              {filtersActive && totalFlights && count !== totalFlights && (
                <span className="text-15 text-light-1 ml-10">
                  (filtered from {totalFlights})
                </span>
              )}
            </div>
          </div>
        )}
        {/* End .col */}

        <div className="col-auto">
          <div className="row x-gap-20 y-gap-20">
            {/* Reset Filters Button - only show when filters are active */}
            {filtersActive && (
              <div className="col-auto">
                <button
                  onClick={handleResetFilters}
                  className="button -blue-1 h-40 px-20 rounded-100 bg-blue-1-05 text-15 text-blue-1"
                >
                  <MdOutlineFilterAltOff className="mr-10 text-14" />
                  Reset Filters
                </button>
              </div>
            )}

            {/* <div className="col-auto">
              <button className="button -blue-1 h-40 px-20 rounded-100 bg-blue-1-05 text-15 text-blue-1">
                <i className="icon-up-down text-14 mr-10" />
                Sort by Price
              </button>
            </div> */}
            {/* End .col */}

            <div className="col-auto d-none xl:d-block px-0">
              <button
                data-bs-toggle="offcanvas"
                data-bs-target="#listingSidebar"
                className="button -blue-1 h-40 px-20 rounded-100 bg-blue-1-05 text-15 text-blue-1"
              >
                <i className="icon-up-down text-14 mr-10" />
                Filter
              </button>
            </div>
            {/* End .col */}
          </div>
        </div>
      </div>
    </>
  );
};

export default TopHeaderFilter;
