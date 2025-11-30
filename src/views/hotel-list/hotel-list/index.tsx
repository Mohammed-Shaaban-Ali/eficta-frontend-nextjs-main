'use client';
import Sidebar from './Sidebar';
import NoHotelsFound from './NoHotelsFound';
import TopHeaderFilter from './TopHeaderFilter';
import HotelProperties from './HotelProperties';
import { useTranslations } from 'next-intl';
import { useSearchHotelsQuery } from '@/reactQuery/hotels.api';
import { useEffect, useState, useRef, Suspense } from 'react';
import { searchHotelsParams } from '@/types/requests/searchHotelRequestTypes';
import { useHotelFilterRedux } from '@/hooks/useHotelFilterRedux';
import { getSearchParamsData } from '@/utils/getSearchParams';
import InactivityModal from '@/components/modals/InactivityModal';
import LoadingScreen from '@/components/parts/LoadingScreen';

const HotelsList = () => {
  const t = useTranslations('HotelList');
  const { filteredHotels, setHotels } = useHotelFilterRedux();
  const [searchData, setSearchData] = useState<searchHotelsParams>();
  const hotelsSetRef = useRef(false);

  useEffect(() => {
    const searchParams = getSearchParamsData();
    setSearchData(searchParams);
  }, []);
  const { data, isFetching, isLoading, isPending, isInitialLoading } =
    useSearchHotelsQuery(searchData as any);
  const { data: Hotels, uuid, filters } = data || {};
  const { chains, facilities, propertyTypes } = filters || {};
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // Fixed useEffect to prevent infinite loop
  useEffect(() => {
    // Only run this effect when Hotels changes AND we haven't set hotels yet
    if (
      Hotels &&
      Array.isArray(Hotels) &&
      Hotels.length > 0 &&
      !hotelsSetRef.current
    ) {
      hotelsSetRef.current = true; // Set flag before updating state to prevent potential re-renders
      setHotels(Hotels);
    }
  }, [Hotels, setHotels]); // Include setHotels in dependency array

  // Reset the ref when Hotels becomes null/undefined (e.g., when navigating away)
  useEffect(() => {
    if (!Hotels) {
      hotelsSetRef.current = false;
    }
  }, [Hotels]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      hotelsSetRef.current = false;
    };
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to first page when filtered results change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredHotels?.length]);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedHotels = filteredHotels?.slice(startIndex, endIndex) || [];

  // Simplified loading state - show loading screen for any fetching operation
  const isAnyLoading =
    !searchData || isLoading || isPending || isInitialLoading || isFetching;
  const showNoResults =
    !isAnyLoading && filteredHotels && filteredHotels.length === 0;

  // Show loading screen when any loading/fetching is happening
  if (isAnyLoading) {
    return <LoadingScreen />;
  }
  return (
    <>
      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row y-gap-30">
            <div className="col-xl-3">
              <aside className="sidebar y-gap-40 xl:d-none">
                <Sidebar
                  hotels={Hotels || []}
                  chains={chains}
                  facilities={facilities}
                  propertyTypes={propertyTypes}
                  displayedHotels={displayedHotels}
                />
              </aside>

              <div
                className="offcanvas offcanvas-start"
                tabIndex={1}
                id="listingSidebar"
              >
                <div className="offcanvas-header">
                  <h5 className="offcanvas-title" id="offcanvasLabel">
                    {t('sidebar.title')}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  ></button>
                </div>

                <div className="offcanvas-body">
                  <aside className="sidebar y-gap-40  xl:d-block">
                    <Sidebar
                      hotels={Hotels || []}
                      chains={chains}
                      facilities={facilities}
                      propertyTypes={propertyTypes}
                      displayedHotels={displayedHotels}
                    />
                  </aside>
                </div>
              </div>
            </div>
            <div className="col-xl-9 ">
              <TopHeaderFilter count={filteredHotels?.length || 0} />
              <div className="mt-30"></div>
              <div className="row y-gap-30">
                {showNoResults ? (
                  <NoHotelsFound />
                ) : (
                  <HotelProperties
                    filteredHotels={filteredHotels}
                    isFetching={isFetching}
                    uuid={uuid as string}
                    displayedHotels={displayedHotels}
                    handlePageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Inactivity Modal */}
      <InactivityModal timeoutMinutes={5} />
    </>
  );
};

export default HotelsList;
