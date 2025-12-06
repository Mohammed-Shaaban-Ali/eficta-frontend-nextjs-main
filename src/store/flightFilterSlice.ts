import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PriceRange {
  min: number;
  max: number;
}

// interface StopsFilter {

// }

// Interface for airline data from API
interface AirlineItem {
  id: string;
  text: string;
  count: number;
}

interface FlightFilters {
  // Price filter
  priceRange: PriceRange;

  // Airlines filter
  selectedAirlines: string[];

  // Providers filter
  providers: string[];

  // Stops filter
  stops: number[];

  // Sorting
  sortBy: 'price' | 'duration' | null;

  sortOrder: 'asc' | 'desc';

  // Applied filters tracking
  appliedFiltersCount: number;
}

export interface FlightFilterState {
  // Separate filters for departure and return flights
  departureFilters: FlightFilters;
  returnFilters: FlightFilters;

  // Current filter context - which flight type are we filtering?
  currentFilterType: 'departure' | 'return';

  // Available options (populated from API/props)
  availableAirlines: AirlineItem[];

  // Matching return flights for current selected departure
  matchingReturnFlights: any[];

  // Actual price range for return flights (needed for filtering)
  returnFlightsActualPriceRange: { min: number; max: number } | null;
}

const createInitialFilters = (): FlightFilters => ({
  priceRange: { min: 0, max: 5000 },
  selectedAirlines: [],
  providers: [],
  stops: [],
  sortBy: 'price', // Default to lowest price
  sortOrder: 'asc',
  appliedFiltersCount: 0,
});

const initialState: FlightFilterState = {
  departureFilters: createInitialFilters(),
  returnFilters: createInitialFilters(),
  currentFilterType: 'departure',
  availableAirlines: [],
  matchingReturnFlights: [],
  returnFlightsActualPriceRange: null,
};

const flightFilterSlice = createSlice({
  name: 'flightFilter',
  initialState,
  reducers: {
    // Price range actions - for departure flights
    setPriceRange: (
      state,
      action: PayloadAction<{
        priceRange: PriceRange;
        flightType?: 'departure' | 'return';
      }>,
    ) => {
      const flightType = action.payload.flightType || 'departure';
      const filters =
        flightType === 'departure'
          ? state.departureFilters
          : state.returnFilters;
      filters.priceRange = action.payload.priceRange;
      updateAppliedFiltersCount(filters);
    },

    // Airlines actions - for departure flights
    toggleAirline: (
      state,
      action: PayloadAction<{
        airline: string;
        flightType?: 'departure' | 'return';
      }>,
    ) => {
      const flightType = action.payload.flightType || 'departure';
      const filters =
        flightType === 'departure'
          ? state.departureFilters
          : state.returnFilters;
      const airline = action.payload.airline;
      const index = filters.selectedAirlines.indexOf(airline);
      if (index > -1) {
        filters.selectedAirlines.splice(index, 1);
      } else {
        filters.selectedAirlines.push(airline);
      }
      updateAppliedFiltersCount(filters);
    },

    setSelectedAirlines: (
      state,
      action: PayloadAction<{
        airlines: string[];
        flightType?: 'departure' | 'return';
      }>,
    ) => {
      const flightType = action.payload.flightType || 'departure';
      const filters =
        flightType === 'departure'
          ? state.departureFilters
          : state.returnFilters;
      filters.selectedAirlines = action.payload.airlines;
      updateAppliedFiltersCount(filters);
    },

    // Providers actions
    toggleProvider: (
      state,
      action: PayloadAction<{
        provider: string;
        flightType?: 'departure' | 'return';
      }>,
    ) => {
      const flightType = action.payload.flightType || 'departure';
      const filters =
        flightType === 'departure'
          ? state.departureFilters
          : state.returnFilters;
      const provider = action.payload.provider;
      const index = filters.providers.indexOf(provider);
      if (index > -1) {
        filters.providers.splice(index, 1);
      } else {
        filters.providers.push(provider);
      }
      updateAppliedFiltersCount(filters);
    },
    setProviders: (
      state,
      action: PayloadAction<{
        providers: string[];
        flightType?: 'departure' | 'return';
      }>,
    ) => {
      const flightType = action.payload.flightType || 'departure';
      const filters =
        flightType === 'departure'
          ? state.departureFilters
          : state.returnFilters;
      filters.providers = action.payload.providers;
      updateAppliedFiltersCount(filters);
    },

    // Stops actions
    toggleStop: (
      state,
      action: PayloadAction<{
        stop: number;
        flightType?: 'departure' | 'return';
      }>,
    ) => {
      const flightType = action.payload.flightType || 'departure';
      const filters =
        flightType === 'departure'
          ? state.departureFilters
          : state.returnFilters;
      const stopType = action.payload.stop;
      const index = filters.stops.indexOf(stopType);
      if (index > -1) {
        filters.stops.splice(index, 1);
      } else {
        filters.stops.push(stopType);
      }
      updateAppliedFiltersCount(filters);
    },

    setStops: (
      state,
      action: PayloadAction<{
        stops: number[];
        flightType?: 'departure' | 'return';
      }>,
    ) => {
      const flightType = action.payload.flightType || 'departure';
      const filters =
        flightType === 'departure'
          ? state.departureFilters
          : state.returnFilters;
      filters.stops = action.payload.stops;
      updateAppliedFiltersCount(filters);
    },

    // Sorting actions
    setSortBy: (
      state,
      action: PayloadAction<{
        sortBy: 'price' | 'duration' | null;
        flightType?: 'departure' | 'return';
      }>,
    ) => {
      const flightType = action.payload.flightType || 'departure';
      const filters =
        flightType === 'departure'
          ? state.departureFilters
          : state.returnFilters;
      filters.sortBy = action.payload.sortBy;
    },

    setSortOrder: (
      state,
      action: PayloadAction<{
        sortOrder: 'asc' | 'desc';
        flightType?: 'departure' | 'return';
      }>,
    ) => {
      const flightType = action.payload.flightType || 'departure';
      const filters =
        flightType === 'departure'
          ? state.departureFilters
          : state.returnFilters;
      filters.sortOrder = action.payload.sortOrder;
    },

    // Available options setters (to be called when data is fetched)
    setAvailableAirlines: (state, action: PayloadAction<AirlineItem[]>) => {
      state.availableAirlines = action.payload;
    },

    // Set current filter type (departure or return)
    setCurrentFilterType: (
      state,
      action: PayloadAction<'departure' | 'return'>,
    ) => {
      state.currentFilterType = action.payload;
    },

    // Set matching return flights
    setMatchingReturnFlights: (state, action: PayloadAction<any[]>) => {
      state.matchingReturnFlights = action.payload;
    },

    // Set actual price range for return flights
    setReturnFlightsActualPriceRange: (
      state,
      action: PayloadAction<{ min: number; max: number } | null>,
    ) => {
      state.returnFlightsActualPriceRange = action.payload;
    },

    // Reset actions
    resetFilters: {
      reducer: (
        state,
        action: PayloadAction<{ flightType?: 'departure' | 'return' }>,
      ) => {
        const flightType = action.payload?.flightType || 'departure';
        const filters =
          flightType === 'departure'
            ? state.departureFilters
            : state.returnFilters;
        filters.priceRange = { min: 0, max: 5000 };
        filters.selectedAirlines = [];
        filters.providers = [];
        filters.stops = [];
        filters.sortBy = 'price'; // Default to lowest price
        filters.sortOrder = 'asc';
        updateAppliedFiltersCount(filters);
      },
      prepare: (payload?: { flightType?: 'departure' | 'return' }) => ({
        payload: payload || { flightType: 'departure' as const },
      }),
    },

    resetPriceFilter: (
      state,
      action?: PayloadAction<{ flightType?: 'departure' | 'return' }>,
    ) => {
      const flightType = action?.payload?.flightType || 'departure';
      const filters =
        flightType === 'departure'
          ? state.departureFilters
          : state.returnFilters;
      filters.priceRange = { min: 0, max: 5000 };
      updateAppliedFiltersCount(filters);
    },

    resetStopsFilter: (
      state,
      action?: PayloadAction<{ flightType?: 'departure' | 'return' }>,
    ) => {
      const flightType = action?.payload?.flightType || 'departure';
      const filters =
        flightType === 'departure'
          ? state.departureFilters
          : state.returnFilters;
      filters.stops = [];
      updateAppliedFiltersCount(filters);
    },
  },
});

// Helper function to count applied filters
const updateAppliedFiltersCount = (filters: FlightFilters) => {
  let count = 0;

  // Count price filter - if price range is not at default values
  const isDefaultPriceRange =
    filters.priceRange.min === 0 && filters.priceRange.max === 5000;
  if (!isDefaultPriceRange) count++;

  // Count airlines filter
  if (filters.selectedAirlines.length > 0) count++;

  // Count providers filter
  if (filters.providers.length > 0) count++;

  // Count stops filter
  if (filters.stops.length > 0) count++;

  filters.appliedFiltersCount = count;
};

export const {
  setPriceRange,
  toggleAirline,
  setSelectedAirlines,
  toggleProvider,
  setProviders,
  toggleStop,
  setStops,
  setSortBy,
  setSortOrder,
  setAvailableAirlines,
  setCurrentFilterType,
  setMatchingReturnFlights,
  setReturnFlightsActualPriceRange,
  resetFilters,
  resetPriceFilter,
  resetStopsFilter,
} = flightFilterSlice.actions;

export default flightFilterSlice.reducer;
