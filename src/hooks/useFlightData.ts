import { useMemo, useCallback } from 'react';

interface UseFlightPaginationProps {
  flights: any[];
  currentPage: number;
  flightsPerPage: number;
}

export const useFlightPagination = ({
  flights,
  currentPage,
  flightsPerPage,
}: UseFlightPaginationProps) => {
  // Memoized calculations
  const totalFlights = useMemo(() => flights?.length || 0, [flights]);

  const totalPages = useMemo(
    () => Math.ceil(totalFlights / flightsPerPage),
    [totalFlights, flightsPerPage],
  );

  // Paginated flights
  const paginatedFlights = useMemo(() => {
    const startIndex = (currentPage - 1) * flightsPerPage;
    const endIndex = startIndex + flightsPerPage;
    return flights?.slice(startIndex, endIndex) || [];
  }, [flights, currentPage, flightsPerPage]);

  return {
    totalFlights,
    totalPages,
    paginatedFlights,
  };
};

interface UseReturnFlightsMapProps {
  returnFlights: any[];
}

export const useReturnFlightsMap = ({
  returnFlights,
}: UseReturnFlightsMapProps) => {
  // Memoized return flights lookup using composite key (performance critical)
  const returnFlightsMap = useMemo(() => {
    const map = new Map();
    returnFlights?.forEach((returnFlight: any) => {
      const packageKey = returnFlight.package_info.package_key;
      const providerKey = returnFlight.provider_key;
      // Create composite key combining both provider and package keys
      const compositeKey = `${providerKey}:${packageKey}`;

      if (!map.has(compositeKey)) {
        map.set(compositeKey, []);
      }
      map.get(compositeKey).push(returnFlight);
    });
    return map;
  }, [returnFlights]);

  // Get matching return flights for a departure flight's package key and provider key
  const getMatchingReturnFlights = useCallback(
    (packageKey: string, providerKey: string) => {
      const compositeKey = `${providerKey}:${packageKey}`;
      return returnFlightsMap.get(compositeKey) || [];
    },
    [returnFlightsMap],
  );

  return {
    returnFlightsMap,
    getMatchingReturnFlights,
  };
};
