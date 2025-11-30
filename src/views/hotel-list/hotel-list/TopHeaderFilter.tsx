'use client';
import { useHotelFilterRedux } from '@/hooks/useHotelFilterRedux';
import { MdOutlineFilterAltOff } from 'react-icons/md';
import { useTranslations } from 'next-intl';

const TopHeaderFilter = ({ count }: { count: number }) => {
  const t = useTranslations('HotelList');
  const {
    resetFilters,
    hotels,
    filteredHotels,
    selectedRating,
    selectedChains,
    selectedPropertyTypes,
    selectedFacilities,
    hotelName,
    priceRange,
    appliedFilters,
  } = useHotelFilterRedux();
  // Only consider filters active if specific user-applied filters are selected
  const filtersActive =
    selectedRating !== null ||
    selectedChains.length > 0 ||
    selectedPropertyTypes.length > 0 ||
    selectedFacilities.length > 0 ||
    hotelName.trim() !== '' ||
    priceRange.min > 0 ||
    priceRange.max < 500;

  return (
    <>
      <div className="row y-gap-10 items-center justify-between">
        {typeof count === 'number' && !isNaN(count) && (
          <div className="col-auto">
            <div className="text-18">
              <span className="fw-500">{count} properties</span>
              {filtersActive &&
                hotels.length > 0 &&
                count !== hotels.length && (
                  <span className="text-15 text-light-1 ml-10">
                    (filtered from {hotels.length})
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
                  onClick={resetFilters}
                  className="button -blue-1 h-40 px-20 rounded-100 bg-blue-1-05 text-15 text-blue-1"
                >
                  <MdOutlineFilterAltOff className="mr-10 text-14" />
                  {t('sidebar.reset_filters')}
                </button>
              </div>
            )}

            <div className="col-auto">
              <button className="button -blue-1 h-40 px-20 rounded-100 bg-blue-1-05 text-15 text-blue-1">
                <i className="icon-up-down text-14 mr-10" />
                Top picks for your search
              </button>
            </div>
            {/* End .col */}

            <div className="col-auto d-none xl:d-block">
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
          {/* End .row */}
        </div>
        {/* End .col */}
      </div>
      {/* End .row */}
    </>
  );
};

export default TopHeaderFilter;
