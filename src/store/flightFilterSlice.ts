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

export interface FlightFilterState {
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

  // Available options (populated from API/props)
  availableAirlines: AirlineItem[];
}

const initialState: FlightFilterState = {
  priceRange: { min: 0, max: 5000 },
  selectedAirlines: [],
  providers: [],
  stops: [],
  sortBy: null,
  sortOrder: 'asc',
  appliedFiltersCount: 0,
  availableAirlines: [],
};

const flightFilterSlice = createSlice({
  name: 'flightFilter',
  initialState,
  reducers: {
    // Price range actions
    setPriceRange: (state, action: PayloadAction<PriceRange>) => {
      state.priceRange = action.payload;
      updateAppliedFiltersCount(state);
    },

    // Airlines actions
    toggleAirline: (state, action: PayloadAction<string>) => {
      const airline = action.payload;
      const index = state.selectedAirlines.indexOf(airline);
      if (index > -1) {
        state.selectedAirlines.splice(index, 1);
      } else {
        state.selectedAirlines.push(airline);
      }
      updateAppliedFiltersCount(state);
    },

    setSelectedAirlines: (state, action: PayloadAction<string[]>) => {
      state.selectedAirlines = action.payload;
      updateAppliedFiltersCount(state);
    },

    // Providers actions
    toggleProvider: (state, action: PayloadAction<string>) => {
      const provider = action.payload;
      const index = state.providers.indexOf(provider);
      if (index > -1) {
        state.providers.splice(index, 1);
      } else {
        state.providers.push(provider);
      }
      updateAppliedFiltersCount(state);
    },
    setProviders: (state, action: PayloadAction<string[]>) => {
      state.providers = action.payload;
      updateAppliedFiltersCount(state);
    },

    // Stops actions
    toggleStop: (state, action: PayloadAction<number>) => {
      // state.stops[stopType] = !state.stops[stopType];

      const stopType = action.payload;
      const index = state.stops.indexOf(stopType);
      if (index > -1) {
        state.stops.splice(index, 1);
      } else {
        state.stops.push(stopType);
      }
      updateAppliedFiltersCount(state);
    },

    setStops: (state, action: PayloadAction<number[]>) => {
      state.stops = action.payload;
      updateAppliedFiltersCount(state);
    },

    // Sorting actions
    setSortBy: (state, action: PayloadAction<FlightFilterState['sortBy']>) => {
      state.sortBy = action.payload;
    },

    setSortOrder: (
      state,
      action: PayloadAction<FlightFilterState['sortOrder']>,
    ) => {
      state.sortOrder = action.payload;
    },

    // Available options setters (to be called when data is fetched)
    setAvailableAirlines: (state, action: PayloadAction<AirlineItem[]>) => {
      state.availableAirlines = action.payload;
    },

    // Reset actions
    resetFilters: (state) => {
      state.priceRange = { min: 0, max: 5000 };
      state.selectedAirlines = [];
      state.stops = [];
      state.sortBy = null;
      state.sortOrder = 'asc';
      updateAppliedFiltersCount(state);
    },

    resetPriceFilter: (state) => {
      state.priceRange = { min: 0, max: 5000 };
      updateAppliedFiltersCount(state);
    },

    resetStopsFilter: (state) => {
      state.stops = initialState.stops;
      updateAppliedFiltersCount(state);
    },
  },
});

// Helper function to count applied filters
const updateAppliedFiltersCount = (state: FlightFilterState) => {
  let count = 0;

  // Count price filter - if price range is not at default values
  const isDefaultPriceRange =
    state.priceRange.min === 0 && state.priceRange.max === 5000;
  if (!isDefaultPriceRange) count++;

  // Count airlines filter
  if (state.selectedAirlines.length > 0) count++;

  // Count stops filter
  if (state.stops.length > 0) count++;

  state.appliedFiltersCount = count;
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
  resetFilters,
  resetPriceFilter,
  resetStopsFilter,
} = flightFilterSlice.actions;

export default flightFilterSlice.reducer;
