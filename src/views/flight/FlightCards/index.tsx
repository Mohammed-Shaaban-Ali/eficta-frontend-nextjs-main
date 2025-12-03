'use client';
import {
  useState,
  useMemo,
  useCallback,
  lazy,
  Suspense,
  useEffect,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslations, useLocale } from 'next-intl';
import { RootState } from '@/store/store';

// Components
import FlightCard from './FlightCard';
import Pagination from './Pagination';
import NoResultsPage from './NoResultsPage';
import ResultsSummary from './ResultsSummary';
import SelectedFlightView from './SelectedFlightView';

// Hooks
import { useFlightUtils, useFlightData } from '@/hooks/useFlightUtils';
import {
  useFlightPagination,
  useReturnFlightsMap,
} from '@/hooks/useFlightData';

import LoadingScreen from '@/components/parts/LoadingScreen';
// Lazy load heavy components
const FlightDetails = lazy(() => import('../flight-details'));

// Types
interface SelectedFlight {
  departureFareKey: string;
  returnFareKey?: string;
  adults: number;
  children: number;
  infants: number;
}

// Import FlightFilterState type
import type { FlightFilterState } from '@/store/flightFilterSlice';
import { resetFilters } from '@/store/flightFilterSlice';

interface FlightPropertiesProps {
  data?: any;
  isFetching?: boolean;
  error?: any;
  fromAirport: string;
  toAirport: string;
  adults: number;
  childrens: number;
  infants: number;
  returnDate: string;
  departureDate: string;
  childrenCount: number;
  cabinClass: string;
  apiPriceRange?: { min: number; max: number };
}

const FlightProperties: React.FC<FlightPropertiesProps> = ({
  data,
  isFetching,
  error,
  fromAirport,
  toAirport,
  adults,
  childrens,
  infants,
  returnDate,
  departureDate,
  childrenCount,
  cabinClass,
  apiPriceRange,
}) => {
  const t = useTranslations('FlightSearch');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // Redux filters
  const filters = useSelector((state: RootState) => state.flightFilter);
  const dispatch = useDispatch();

  // Custom hooks - using props data instead of making new API call
  const { flights } = useFlightData(data);
  const { formatTime, formatDuration, formatDate } = useFlightUtils();

  // Reset filters when component mounts
  useEffect(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDeparture, setSelectedDeparture] = useState<string | null>(
    null,
  );
  const [selectedFlight, setSelectedFlight] = useState<SelectedFlight | null>(
    null,
  );
  const [selectedDepartureData, setSelectedDepartureData] = useState<any>(null);

  // Constants
  const flightsPerPage = 10;

  // Memoized data processing
  const departureFlights = useMemo(
    () => flights?.departure_flights || [],
    [flights],
  );
  const returnFlights = useMemo(() => flights?.return_flights || [], [flights]);

  // Apply filters to flight data
  const filteredFlights = useMemo(() => {
    if (!departureFlights.length) return [];

    let filtered = [...departureFlights];
    console.log('Starting with', filtered.length, 'flights');

    // Price filter - check if price range has been modified from API values
    const apiMin = apiPriceRange?.min || 0;
    const apiMax = apiPriceRange?.max || 10000;
    const typedFilters = filters as FlightFilterState;
    if (
      typedFilters.priceRange.min > apiMin ||
      typedFilters.priceRange.max < apiMax
    ) {
      const beforeCount = filtered.length;
      filtered = filtered.filter((flight: any) => {
        const price =
          flight.fares?.[0]?.fare_info?.fare_detail?.price_info?.total_fare ||
          0;
        return (
          price >= typedFilters.priceRange.min &&
          price <= typedFilters.priceRange.max
        );
      });
      console.log(
        `Price filter: ${beforeCount} -> ${filtered.length} flights (range: ${typedFilters.priceRange.min}-${typedFilters.priceRange.max})`,
      );
    }

    // Airlines filter - using carrier code (ID) which matches the filteringOptions.airline.id
    if (typedFilters.selectedAirlines.length > 0) {
      const beforeCount = filtered.length;
      filtered = filtered.filter((flight: any) => {
        const carrierCode = flight.legs?.[0]?.airline_info?.carrier_code;
        return (
          carrierCode && typedFilters.selectedAirlines.includes(carrierCode)
        );
      });
    }

    // Stops filter - using correct data structure and logic matching API
    // Note: API provides mutually exclusive categories, so "1 Stops or less" means exactly 1 stop
    if (typedFilters.stops.length > 0) {
      const beforeCount = filtered.length;
      filtered = filtered.filter((flight: any) => {
        const legCount = flight.legs?.length - 1;
        return typedFilters.stops.includes(legCount);
      });
    }

    // Providers filter
    if (typedFilters.providers.length > 0) {
      filtered = filtered.filter((flight: any) => {
        const provider_key = flight.provider_key;
        return typedFilters.providers.includes(provider_key);
      });
    }

    // Sort by => price => lowest to highest || duration => shortest to longest
    if (typedFilters.sortBy) {
      filtered.sort((a: any, b: any) => {
        let aValue, bValue;

        switch (typedFilters.sortBy) {
          case 'price':
            aValue = a.fares?.minimum_package_price || 0;
            bValue = b.fares?.minimum_package_price || 0;
            break;
          case 'duration':
            aValue =
              a.legs?.[0]?.time_info?.flight_time_hour * 60 +
                a.legs?.[0]?.time_info?.flight_time_minute || 0;
            bValue =
              b.legs?.[0]?.time_info?.flight_time_hour * 60 +
                b.legs?.[0]?.time_info?.flight_time_minute || 0;
            break;

          default:
            return 0;
        }

        const multiplier = typedFilters.sortOrder === 'desc' ? -1 : 1;
        return (aValue - bValue) * multiplier;
      });
    }

    return filtered;
  }, [departureFlights, filters, apiPriceRange]);

  // Custom hooks for data processing with filtered data
  const { totalFlights, totalPages, paginatedFlights } = useFlightPagination({
    flights: filteredFlights,
    currentPage,
    flightsPerPage,
  });

  const { getMatchingReturnFlights } = useReturnFlightsMap({
    returnFlights,
  });

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedDeparture(null);
    setSelectedDepartureData(null);
  }, [filters]);

  // Event handlers
  const handleSelectDeparture = useCallback(
    (departureFareKey: string, departureData: any) => {
      if (selectedDeparture === departureFareKey) {
        // If clicking the same card, deselect it
        setSelectedDeparture(null);
        setSelectedDepartureData(null);
      } else {
        // Select the new card
        setSelectedDeparture(departureFareKey);
        setSelectedDepartureData(departureData);
      }
    },
    [selectedDeparture],
  );

  const handleSelectFlight = useCallback(
    (departureFlightData: any, returnFlightData?: any) => {
      setSelectedFlight({
        departureFareKey: departureFlightData?.fares?.[0]?.fare_key || '',
        returnFareKey: returnFlightData?.fares?.[0]?.fare_key,
        adults,
        children: childrens,
        infants,
      });
      setSelectedFlight(null);
    },
    [adults, childrens, infants],
  );

  const handleCloseFlightDetails = useCallback(() => {
    setSelectedFlight(null);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedDeparture(null);
    setSelectedDepartureData(null);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setSelectedDeparture(null);
    setSelectedDepartureData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Loading state
  if (isFetching) return <LoadingScreen />;

  // Error or no results
  if (error || !departureFlights || departureFlights.length === 0) {
    return (
      <NoResultsPage
        adults={adults}
        cabinClass={cabinClass}
        childrenCount={childrenCount}
        departureDate={departureDate}
        infants={infants}
        error={error}
        returnDate={returnDate}
        fromAirport={fromAirport}
        toAirport={toAirport}
      />
    );
  }

  if (filteredFlights.length === 0) {
    return (
      <NoResultsPage
        adults={adults}
        cabinClass={cabinClass}
        childrenCount={childrenCount}
        departureDate={departureDate}
        infants={infants}
        error={error}
        returnDate={returnDate}
        fromAirport={fromAirport}
        toAirport={toAirport}
      />
    );
  }

  // Show selected flight view when a departure is selected
  if (selectedDeparture && selectedDepartureData) {
    const packageKey = selectedDepartureData.package_info.package_key;
    // provider key
    const providerKey = selectedDepartureData.provider_key;
    const matchingReturns = getMatchingReturnFlights(packageKey, providerKey);

    return (
      <SelectedFlightView
        selectedDepartureData={selectedDepartureData}
        matchingReturns={matchingReturns}
        onSelectFlight={handleSelectFlight}
        onBackToList={handleBackToList}
        formatTime={formatTime}
        formatDuration={formatDuration}
        formatDate={formatDate}
        adults={adults}
        childrens={childrens}
        infants={infants}
      />
    );
  }

  return (
    <div className="container-fluid px-0" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Results summary */}
      <ResultsSummary
        totalFlights={totalFlights}
        totalUnfilteredFlights={departureFlights.length}
        currentPage={currentPage}
        totalPages={totalPages}
        flightsPerPage={flightsPerPage}
      />

      <div>
        {/* Flight cards */}
        {paginatedFlights.map((departureFlightData: any, index: number) => {
          const actualIndex = (currentPage - 1) * flightsPerPage + index;
          const packageKey = departureFlightData.package_info.package_key;
          const providerKey = departureFlightData.provider_key;
          const departureFareKey =
            departureFlightData.fares?.[0]?.fare_key || '';
          const matchingReturns = getMatchingReturnFlights(
            packageKey,
            providerKey,
          );
          const isSelected = selectedDeparture === departureFareKey;

          return (
            <FlightCard
              key={departureFareKey}
              departureFlightData={departureFlightData}
              index={actualIndex}
              isSelected={isSelected}
              matchingReturns={matchingReturns}
              onSelectDeparture={handleSelectDeparture}
              onSelectFlight={handleSelectFlight}
              formatTime={formatTime}
              formatDuration={formatDuration}
              formatDate={formatDate}
            />
          );
        })}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalResults={totalFlights}
          resultsPerPage={flightsPerPage}
        />

        {/* Flight Details Drawer - Lazy loaded */}
        {selectedFlight && (
          <Suspense fallback={<div>{t('messages.loading')}</div>}>
            <FlightDetails
              isOpen={!!selectedFlight}
              onClose={handleCloseFlightDetails}
              departureFareKey={selectedFlight.departureFareKey}
              returnFareKey={selectedFlight.returnFareKey}
              adults={selectedFlight.adults}
              childrens={selectedFlight.children}
              infants={selectedFlight.infants}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default FlightProperties;
