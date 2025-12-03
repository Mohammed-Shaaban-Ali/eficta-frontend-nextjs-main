'use client';
import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { MdOutlineFilterAltOff, MdSort, MdFilterList } from 'react-icons/md';
import { resetFilters } from '@/store/flightFilterSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { FlightFilterState } from '@/store/flightFilterSlice';

interface ResultsSummaryProps {
  totalFlights: number;
  totalUnfilteredFlights?: number;
  currentPage: number;
  totalPages: number;
  flightsPerPage: number;
}

const ResultsSummary = memo<ResultsSummaryProps>(
  ({
    totalFlights,
    totalUnfilteredFlights,
    currentPage,
    totalPages,
    flightsPerPage,
  }) => {
    const t = useTranslations('FlightSearch.results');

    const dispatch = useDispatch();

    // Get applied filters count from Redux based on current filter type
    const { currentFilterType, departureFilters, returnFilters } = useSelector(
      (state: RootState) => state.flightFilter,
    );
    const currentFilters = currentFilterType === 'departure' ? departureFilters : returnFilters;
    const appliedFiltersCount = currentFilters.appliedFiltersCount;

    // Check if any filters are active
    const filtersActive = appliedFiltersCount > 0;

    // Handle reset filters
    const handleResetFilters = () => {
      dispatch(resetFilters({ flightType: currentFilterType }));
    };

    // Calculate current range of flights being shown
    const firstResult = (currentPage - 1) * flightsPerPage + 1;
    const lastResult = Math.min(currentPage * flightsPerPage, totalFlights);

    return (
      <div className="results-summary mb-20">
        <div className="card bg-white shadow-sm rounded-4">
          <div className="card-body p-20">
            <div className="row y-gap-10 justify-between items-center">
              <div className="col-auto">
                <div className="d-flex items-center">
                  <div className="icon-search text-blue-1 text-20 mr-10"></div>
                  <div>
                    <div className="text-18 fw-500">
                      {totalFlights} {t('flights_found', { count: totalFlights })}
                      {filtersActive &&
                        totalUnfilteredFlights &&
                        totalFlights !== totalUnfilteredFlights && (
                          <span className="text-15 text-light-1 ml-10">
                            (filtered from {totalUnfilteredFlights})
                          </span>
                        )}
                    </div>
                    <div className="text-14 text-light-1">
                      {t('showing_results', {
                        from: firstResult,
                        to: lastResult,
                        total: totalFlights,
                      })}
                      {filtersActive && (
                        <span className="badge bg-blue-1 text-white ms-2 py-1 px-2">
                          {appliedFiltersCount}{' '}
                          {appliedFiltersCount === 1 ? 'filter' : 'filters'}{' '}
                          applied
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-auto">
                <div className="d-flex gap-2">
                  {filtersActive && (
                    <button
                      onClick={handleResetFilters}
                      className="button -blue-1 h-40 px-20 rounded-100 bg-blue-1-05 text-15 text-blue-1"
                    >
                      <MdOutlineFilterAltOff className="mr-10 text-16" />
                      Reset Filters
                    </button>
                  )}

                  {/* <div className="dropdown">
                    <button
                      className="button -blue-1 h-40 px-20 rounded-100 bg-blue-1-05 text-15 text-blue-1 dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <MdSort className="mr-10 text-16" />
                      Sort By
                    </button>
                    <ul className="dropdown-menu" style={{ zIndex: 9999 }}>
                      <li>
                        <a className="dropdown-item" href="#">
                          Price: Low to High
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Price: High to Low
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Duration: Shortest
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Departure: Earliest
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Arrival: Earliest
                        </a>
                      </li>
                    </ul>
                  </div> */}

                  <button
                    data-bs-toggle="offcanvas"
                    data-bs-target="#listingSidebar"
                    className="button -blue-1 h-40 px-20 rounded-100 bg-blue-1-05 text-15 text-blue-1 d-none xl:d-flex items-center"
                  >
                    <MdFilterList className="mr-10 text-16" />
                    {t('filter_flights')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ResultsSummary.displayName = 'ResultsSummary';

export default ResultsSummary;
