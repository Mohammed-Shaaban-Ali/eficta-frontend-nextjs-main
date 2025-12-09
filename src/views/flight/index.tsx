'use client';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  useSearchFlightsQuery,
  useSearchFlightsSabreQuery,
} from '@/reactQuery/flight.api';
import Sidebar from './Sidebar';
import FlightProperties from './FlightCards';
import LoadingScreen from '@/components/parts/LoadingScreen';
import FlightSearchBox from '@/views/home/hero/flight-search-box';
import {
  setPriceRange,
  setReturnFlightsActualPriceRange,
} from '@/store/flightFilterSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useMemo, useRef, useEffect } from 'react';
import { calculateReturnFlightFilterOptions } from '@/utils/returnFlightFilterUtils';
import { mergeFlightFilterOptions } from '@/utils/mergeFlightFilterOptions';
import { mergeFlightData } from '@/utils/mergeFlightData';

const FlightSerachResults = () => {
  const t = useTranslations('FlightSearch');
  const dispatch = useDispatch();
  const currentFilterType = useSelector(
    (state: RootState) => state.flightFilter.currentFilterType,
  );

  // URL parameters for flight search
  const searchParams = useSearchParams();
  const fromAirport = searchParams.get('fromAirport') || '';
  const toAirport = searchParams.get('toAirport') || '';
  const fromAirportCity = searchParams.get('fromAirportCity') || '';
  const toAirportCity = searchParams.get('toAirportCity') || '';
  const departureDate = searchParams.get('departureDate') || '';
  const returnDate = searchParams.get('returnDate') as any;
  const adults = parseInt(searchParams.get('adults') || '1', 10);
  const children = parseInt(searchParams.get('children') || '0', 10);
  const infants = parseInt(searchParams.get('infants') || '0', 10);
  const cabinClass = searchParams.get('cabinClass') || 'ECONOMY';

  // API calls - both endpoints
  const {
    data: iatiData,
    isFetching: isIatiFetching,
    error: iatiError,
  } = useSearchFlightsQuery({
    adults,
    children,
    infants,
    cabinClass,
    fromAirport,
    toAirport,
    departureDate,
    ...(returnDate && { returnDate }),
  });

  const {
    data: sabreData,
    isFetching: isSabreFetching,
    error: sabreError,
  } = useSearchFlightsSabreQuery({
    adults,
    children,
    infants,
    cabinClass,
    fromAirport,
    toAirport,
    departureDate,
    ...(returnDate && { returnDate }),
  });

  // Merge data from both endpoints
  const mergedData = useMemo(() => {
    if (!iatiData && !sabreData) return undefined;

    const mergedFlights = mergeFlightData(iatiData?.data, sabreData?.data);
    const mergedFilteringOptions = mergeFlightFilterOptions(
      iatiData?.filteringOptions,
      sabreData?.filteringOptions,
    );

    console.log(iatiData?.meta, 'iatiData?.meta');
    console.log(sabreData?.meta, 'sabreData?.meta');
    return {
      data: mergedFlights,
      filteringOptions: mergedFilteringOptions,
      sortingOptions:
        iatiData?.sortingOptions || sabreData?.sortingOptions || [],
      meta: iatiData?.meta || sabreData?.meta,
    };
  }, [iatiData, sabreData]);

  // Determine loading and error states
  const isFetching = isIatiFetching && isSabreFetching; // Both loading = show full loading
  const isPartialLoading = isIatiFetching || isSabreFetching; // One still loading = show small indicator
  const error = iatiError || sabreError;

  // Use merged data
  const data = mergedData;
  // Get filtering options from merged data
  const filteringOptions = data?.filteringOptions;

  // Get matching return flights from Redux
  const matchingReturnFlights = useSelector(
    (state: RootState) => state.flightFilter.matchingReturnFlights,
  );

  // Calculate filtering options based on current filter type
  const currentFilteringOptions = useMemo(() => {
    if (currentFilterType === 'return' && matchingReturnFlights.length > 0) {
      // Calculate from matching return flights
      const returnOptions = calculateReturnFlightFilterOptions(
        matchingReturnFlights,
      );
      // Convert airline format to match API format
      return {
        airline: returnOptions.airline.map((a) => ({
          id: a.id,
          text: a.text,
          count: a.count.toString(),
        })),
        stops: returnOptions.stops,
        provider: returnOptions.provider.map((p) => ({
          id: p.id,
          text: p.text,
          count: p.count,
        })),
        minPrice: returnOptions.minPrice,
        maxPrice: returnOptions.maxPrice,
      };
    } else {
      // Use API filtering options for departure
      return {
        airline: filteringOptions?.airline || [],
        stops: filteringOptions?.stops || [],
        provider: filteringOptions?.provider || [],
        minPrice: filteringOptions?.minPrice || 0,
        maxPrice: filteringOptions?.maxPrice || 5000,
      };
    }
  }, [currentFilterType, matchingReturnFlights, filteringOptions]);

  // Initialize price range from API when available (only for departure)
  useEffect(() => {
    if (
      currentFilterType === 'departure' &&
      filteringOptions?.minPrice !== undefined &&
      filteringOptions?.maxPrice !== undefined
    ) {
      dispatch(
        setPriceRange({
          priceRange: {
            min: filteringOptions.minPrice,
            max: filteringOptions.maxPrice,
          },
          flightType: 'departure',
        }),
      );
    }
  }, [filteringOptions, dispatch, currentFilterType]);

  // Track previous matching return flights to prevent infinite loops
  const prevMatchingReturnsRef = useRef<string>('');
  const prevFilterTypeRef = useRef<'departure' | 'return'>('departure');

  // Initialize price range for return flights when matching returns are available
  useEffect(() => {
    // Create a stable key from matching returns to detect actual changes
    const matchingReturnsKey = JSON.stringify(
      matchingReturnFlights.map((f: any) => f.fares?.[0]?.fare_key || ''),
    );
    const hasChanged =
      matchingReturnsKey !== prevMatchingReturnsRef.current ||
      currentFilterType !== prevFilterTypeRef.current;

    if (
      hasChanged &&
      currentFilterType === 'return' &&
      matchingReturnFlights.length > 0
    ) {
      const returnOptions = calculateReturnFlightFilterOptions(
        matchingReturnFlights,
      );
      // Set slider range: min = 0, max = (actualMax - actualMin)
      dispatch(
        setPriceRange({
          priceRange: {
            min: returnOptions.minPrice,
            max: returnOptions.maxPrice,
          },
          flightType: 'return',
        }),
      );
      // Store actual price range for filtering
      if (
        returnOptions.actualMinPrice !== undefined &&
        returnOptions.actualMaxPrice !== undefined
      ) {
        dispatch(
          setReturnFlightsActualPriceRange({
            min: returnOptions.actualMinPrice,
            max: returnOptions.actualMaxPrice,
          }),
        );
      }
      // Update refs
      prevMatchingReturnsRef.current = matchingReturnsKey;
      prevFilterTypeRef.current = currentFilterType;
    } else if (
      currentFilterType !== 'return' ||
      matchingReturnFlights.length === 0
    ) {
      // Clear actual price range when not filtering return flights
      if (prevFilterTypeRef.current === 'return') {
        dispatch(setReturnFlightsActualPriceRange(null));
      }
      prevFilterTypeRef.current = currentFilterType;
      prevMatchingReturnsRef.current = '';
    }
  }, [currentFilterType, matchingReturnFlights, dispatch]);

  // Show full loading screen only if both are loading and no data yet
  if (isFetching && !data) {
    return <LoadingScreen />;
  }

  // Calculate total flight count
  const flightCount =
    currentFilterType === 'return'
      ? matchingReturnFlights.length
      : data?.data?.departure_flights?.length || 0;

  // Calculate price range
  const priceRange = {
    min: currentFilteringOptions.minPrice,
    max: currentFilteringOptions.maxPrice,
  };
  return (
    <>
      <section className="layout-pt-sm layout-pb-sm bg-light-2">
        <FlightSearchBox />
        <div
          style={{
            paddingTop: '50px',
          }}
          className="container "
        >
          <div className="row y-gap-30">
            <div className="col-xl-3">
              <aside className="sidebar py-20 px-20 lg:d-none bg-white">
                <div className="row y-gap-40">
                  <Sidebar
                    availableAirlines={currentFilteringOptions.airline}
                    stops={currentFilteringOptions.stops}
                    providers={currentFilteringOptions.provider}
                    priceRange={priceRange}
                    flightCount={flightCount}
                    sortingOptions={data?.sortingOptions}
                    flightType={currentFilterType}
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
                      availableAirlines={currentFilteringOptions.airline}
                      stops={currentFilteringOptions.stops}
                      priceRange={priceRange}
                      flightCount={flightCount}
                      providers={currentFilteringOptions.provider}
                      sortingOptions={data?.sortingOptions}
                      flightType={currentFilterType}
                    />
                  </aside>
                </div>
              </div>
            </div>

            <div className="col-xl-9">
              <div className="row">
                {/* Small loading indicator when one endpoint is still loading */}
                {isPartialLoading && data && (
                  <div className="col-12 mb-3">
                    <div className="d-flex align-items-center gap-2 p-3 bg-light rounded">
                      <div
                        className="spinner-border spinner-border-sm text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <span className="text-14 text-dark-1">
                        Loading more results...
                      </span>
                    </div>
                  </div>
                )}
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
                  fromAirportCity={fromAirportCity}
                  toAirportCity={toAirportCity}
                  adults={adults}
                  childrens={children}
                  infants={infants}
                  apiPriceRange={priceRange}
                  isPartialLoading={isPartialLoading}
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
