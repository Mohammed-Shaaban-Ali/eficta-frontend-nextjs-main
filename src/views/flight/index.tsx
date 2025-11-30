'use client';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useSearchFlightsQuery } from '@/reactQuery/flight.api';
import Sidebar from './Sidebar';
import FlightProperties from './FlightCards';
import LoadingScreen from '@/components/parts/LoadingScreen';
import { setPriceRange } from '@/store/flightFilterSlice';

const FlightSerachResults = () => {
  const t = useTranslations('FlightSearch');
  const dispatch = useDispatch();

  // URL parameters for flight search
  const searchParams = useSearchParams();
  const fromAirport = searchParams.get('fromAirport') || '';
  const toAirport = searchParams.get('toAirport') || '';
  const departureDate = searchParams.get('departureDate') || '';
  const returnDate = searchParams.get('returnDate') as any;
  const adults = parseInt(searchParams.get('adults') || '1', 10);
  const children = parseInt(searchParams.get('children') || '0', 10);
  const infants = parseInt(searchParams.get('infants') || '0', 10);
  const cabinClass = searchParams.get('cabinClass') || 'ECONOMY';

  // API call
  const { data, isFetching, error } = useSearchFlightsQuery({
    adults,
    children,
    infants,
    cabinClass,
    fromAirport,
    toAirport,
    departureDate,
    ...(returnDate && { returnDate }),
  });
  // Get filtering options directly from the API response
  const filteringOptions = data?.filteringOptions;

  // Initialize price range from API when available
  useEffect(() => {
    if (
      filteringOptions?.minPrice !== undefined &&
      filteringOptions?.maxPrice !== undefined
    ) {
      dispatch(
        setPriceRange({
          min: filteringOptions.minPrice,
          max: filteringOptions.maxPrice,
        }),
      );
    }
  }, [filteringOptions, dispatch]);

  // Show loading state
  if (isFetching) {
    return <LoadingScreen />;
  }

  // Calculate total flight count
  const flightCount = data?.data?.departure_flights?.length || 0;

  // Calculate price range
  const priceRange = {
    min: filteringOptions?.minPrice || 0,
    max: filteringOptions?.maxPrice || 5000,
  };

  return (
    <>
      <section className="layout-pt-md layout-pb-md bg-light-2">
        <div className="container">
          <div className="row y-gap-30">
            <div className="col-xl-3">
              <aside className="sidebar py-20 px-20 lg:d-none bg-white">
                <div className="row y-gap-40">
                  <Sidebar
                    availableAirlines={data?.filteringOptions?.airline}
                    stops={data?.filteringOptions?.stops}
                    priceRange={priceRange}
                    flightCount={flightCount}
                  />
                </div>
              </aside>

              <div className="offcanvas offcanvas-start" id="listingSidebar">
                <div className="offcanvas-header">
                  <h5 className="offcanvas-title" id="offcanvasLabel">
                    {t('results.filter_flights')}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  ></button>
                </div>
                {/* End offcanvas header */}

                <div className="offcanvas-body">
                  <aside className="sidebar y-gap-40 lg:d-block">
                    <Sidebar
                      availableAirlines={data?.filteringOptions?.airline}
                      stops={data?.filteringOptions?.stops}
                      priceRange={priceRange}
                      flightCount={flightCount}
                    />
                  </aside>
                </div>
              </div>
            </div>

            <div className="col-xl-9">
              <div className="row">
                <FlightProperties
                  data={data}
                  isFetching={isFetching}
                  error={error}
                  cabinClass={cabinClass}
                  childrenCount={children}
                  departureDate={departureDate}
                  returnDate={returnDate}
                  fromAirport={fromAirport}
                  toAirport={toAirport}
                  adults={adults}
                  childrens={children}
                  infants={infants}
                  apiPriceRange={priceRange}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FlightSerachResults;
