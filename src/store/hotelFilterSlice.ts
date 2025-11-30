import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { hotelSeachTypes } from '@/types/app/hotelTypes';

export interface HotelFilterState {
  selectedRating: number | null;
  priceRange: { min: number; max: number };
  hotels: hotelSeachTypes[];
  filteredHotels: hotelSeachTypes[];
  selectedChains: string[];
  selectedPropertyTypes: string[];
  selectedFacilities: string[];
  hotelName: string;
}

const initialState: HotelFilterState = {
  selectedRating: null,
  priceRange: { min: 0, max: 15000 },
  hotels: [],
  filteredHotels: [],
  selectedChains: [],
  selectedPropertyTypes: [],
  selectedFacilities: [],
  hotelName: '',
};

export const hotelFilterSlice = createSlice({
  name: 'hotelFilter',
  initialState,
  reducers: {
    setSelectedRating: (state, action: PayloadAction<number | null>) => {
      state.selectedRating = action.payload;
      applyFiltersToState(state);
    },
    setPriceRange: (
      state,
      action: PayloadAction<{ min: number; max: number }>,
    ) => {
      state.priceRange = action.payload;
      applyFiltersToState(state);
    },
    setHotels: (state, action: PayloadAction<hotelSeachTypes[]>) => {
      state.hotels = action.payload;
      applyFiltersToState(state);
    },
    setSelectedChains: (state, action: PayloadAction<string[]>) => {
      state.selectedChains = action.payload;
      applyFiltersToState(state);
    },
    toggleChain: (state, action: PayloadAction<string>) => {
      const chainId = action.payload;
      if (state.selectedChains.includes(chainId)) {
        state.selectedChains = state.selectedChains.filter(
          (id) => id !== chainId,
        );
      } else {
        state.selectedChains.push(chainId);
      }
      applyFiltersToState(state);
    },
    setSelectedPropertyTypes: (state, action: PayloadAction<string[]>) => {
      state.selectedPropertyTypes = action.payload;
      applyFiltersToState(state);
    },
    togglePropertyType: (state, action: PayloadAction<string>) => {
      const propertyTypeId = action.payload;
      if (state.selectedPropertyTypes.includes(propertyTypeId)) {
        state.selectedPropertyTypes = state.selectedPropertyTypes.filter(
          (id) => id !== propertyTypeId,
        );
      } else {
        state.selectedPropertyTypes.push(propertyTypeId); // Allow multiple selections
      }
      applyFiltersToState(state);
    },
    setSelectedFacilities: (state, action: PayloadAction<string[]>) => {
      state.selectedFacilities = action.payload;
      applyFiltersToState(state);
    },
    toggleFacility: (state, action: PayloadAction<string>) => {
      const facilityId = action.payload;
      if (state.selectedFacilities.includes(facilityId)) {
        state.selectedFacilities = state.selectedFacilities.filter(
          (id) => id !== facilityId,
        );
      } else {
        state.selectedFacilities.push(facilityId);
      }
      applyFiltersToState(state);
    },
    setHotelName: (state, action: PayloadAction<string>) => {
      state.hotelName = action.payload;
      applyFiltersToState(state);
    },
    resetFilters: (state) => {
      state.selectedRating = null;
      state.priceRange = { min: 0, max: 15000 };
      state.selectedChains = [];
      state.selectedPropertyTypes = [];
      state.selectedFacilities = [];
      state.hotelName = '';
      applyFiltersToState(state);
    },
    applyFilters: (state) => {
      applyFiltersToState(state);
    },
  },
});

const applyFiltersToState = (state: HotelFilterState) => {
  // If there are no hotels, make sure filtered hotels is also empty
  if (!state.hotels || state.hotels.length === 0) {
    state.filteredHotels = [];
    return;
  }

  // If no active filters are applied, show all hotels without filtering
  const hasActiveFilters =
    state.selectedRating !== null ||
    state.selectedChains.length > 0 ||
    state.selectedPropertyTypes.length > 0 ||
    state.selectedFacilities.length > 0 ||
    state.hotelName.trim() !== '' ||
    state.priceRange.min > 0 ||
    state.priceRange.max < 15000;

  // If no filters are applied, just set filteredHotels to all hotels
  if (!hasActiveFilters) {
    state.filteredHotels = [...state.hotels];
    return;
  }

  // For debugging
  console.log('Applied filters:', {
    rating: state.selectedRating,
    priceRange: state.priceRange,
    chains: state.selectedChains,
    propertyTypes: state.selectedPropertyTypes,
    facilities: state.selectedFacilities,
    hotelName: state.hotelName,
  });

  const filtered = state.hotels.filter((hotel) => {
    // Skip null or undefined hotels
    if (!hotel) return false;

    // Filter by hotel name if provided
    if (state.hotelName.trim() !== '') {
      const hotelNameLower = hotel.displayName?.toLowerCase() || '';
      const searchTermLower = state.hotelName.toLowerCase().trim();

      if (!hotelNameLower.includes(searchTermLower)) {
        return false;
      }
    }

    // Filter by star rating if selected
    if (state.selectedRating !== null) {
      // The key fix: properly compare star ratings by converting both values to numbers
      const selectedRating = Number(state.selectedRating);
      const hotelRating = Number(hotel.starRating);

      // Check if both are valid numbers
      if (isNaN(hotelRating) || hotelRating !== selectedRating) {
        return false;
      }
    }

    // Filter by price range
    const hotelPrice = Number(hotel.price);
    if (
      !isNaN(hotelPrice) &&
      (hotelPrice < state.priceRange.min || hotelPrice > state.priceRange.max)
    ) {
      return false;
    }

    // Filter by hotel chain
    if (state.selectedChains.length > 0) {
      // Handle both object structure and string structure
      const chainId =
        typeof hotel.chain === 'object' ? hotel.chain?.id : hotel.chain;
      if (!chainId || !state.selectedChains.includes(chainId)) {
        return false;
      }
    }

    // Filter by property type
    if (state.selectedPropertyTypes.length > 0) {
      if (!hotel.propertyType) return false;

      if (!state.selectedPropertyTypes.includes(hotel.propertyType)) {
        return false;
      }
    }

    // Filter by facilities
    if (state.selectedFacilities.length > 0) {
      // Check if hotel has any of the selected facilities
      if (
        !hotel.facilities ||
        !Array.isArray(hotel.facilities) ||
        hotel.facilities.length === 0
      ) {
        return false;
      }

      // Check if any selected facility ID matches a facility in the hotel
      const hotelHasSelectedFacility = state.selectedFacilities.some(
        (facilityId) =>
          hotel?.facilities?.some((facility) =>
            typeof facility === 'object'
              ? facility.id === facilityId
              : facility === facilityId,
          ),
      );

      if (!hotelHasSelectedFacility) {
        return false;
      }
    }

    return true;
  });

  state.filteredHotels = filtered;
};

export const {
  setSelectedRating,
  setPriceRange,
  setHotels,
  setSelectedChains,
  toggleChain,
  setSelectedPropertyTypes,
  togglePropertyType,
  setSelectedFacilities,
  toggleFacility,
  resetFilters,
  applyFilters,
  setHotelName, // Export the new action
} = hotelFilterSlice.actions;

export default hotelFilterSlice.reducer;
