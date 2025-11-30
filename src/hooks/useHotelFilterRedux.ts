import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
  setSelectedRating,
  setPriceRange,
  setHotels as setHotelsAction,
  toggleChain,
  togglePropertyType,
  toggleFacility,
  resetFilters,
  setSelectedChains,
  setSelectedPropertyTypes,
  setSelectedFacilities,
  setHotelName,
} from '@/store/hotelFilterSlice';
import { hotelSeachTypes } from '@/types/app/hotelTypes';

// Custom hook to access and modify hotel filter state
export const useHotelFilterRedux = () => {
  const dispatch = useDispatch();
  const hotelFilterState = useSelector((state: RootState) => state.hotelFilter);

  // Compute if any filters are currently active
  const hasActiveFilters =
    hotelFilterState.selectedRating !== null ||
    hotelFilterState.selectedChains.length > 0 ||
    hotelFilterState.selectedPropertyTypes.length > 0 ||
    hotelFilterState.selectedFacilities.length > 0 ||
    hotelFilterState.hotelName.trim() !== '' ||
    hotelFilterState.priceRange.min > 0 ||
    hotelFilterState.priceRange.max < 15000;

  return {
    // State selectors
    selectedRating: hotelFilterState.selectedRating,
    priceRange: hotelFilterState.priceRange,
    filteredHotels: hotelFilterState.filteredHotels,
    hotels: hotelFilterState.hotels,
    selectedChains: hotelFilterState.selectedChains,
    selectedPropertyTypes: hotelFilterState.selectedPropertyTypes,
    selectedFacilities: hotelFilterState.selectedFacilities,
    hotelName: hotelFilterState.hotelName,

    // Add hasActiveFilters attribute
    hasActiveFilters,

    // Information about applied filters
    appliedFilters: {
      rating:
        hotelFilterState.selectedRating !== null
          ? hotelFilterState.selectedRating
          : null,
      priceRange:
        hotelFilterState.priceRange.min > 0 ||
        hotelFilterState.priceRange.max < 15000
          ? hotelFilterState.priceRange
          : null,
      chains:
        hotelFilterState.selectedChains.length > 0
          ? hotelFilterState.selectedChains
          : null,
      propertyTypes:
        hotelFilterState.selectedPropertyTypes.length > 0
          ? hotelFilterState.selectedPropertyTypes
          : null,
      facilities:
        hotelFilterState.selectedFacilities.length > 0
          ? hotelFilterState.selectedFacilities
          : null,
      hotelName:
        hotelFilterState.hotelName.trim() !== ''
          ? hotelFilterState.hotelName
          : null,
    },

    // Action dispatchers
    setSelectedRating: (rating: number | null) => {
      dispatch(setSelectedRating(rating));
    },
    setPriceRange: (range: { min: number; max: number }) => {
      dispatch(setPriceRange(range));
    },
    setHotels: (hotels: hotelSeachTypes[]) => {
      dispatch(setHotelsAction(hotels));
    },
    // Hotel name filter
    setHotelNameFilter: (name: string) => {
      dispatch(setHotelName(name));
    },
    // Chain actions
    toggleChain: (chainId: string) => {
      dispatch(toggleChain(chainId));
    },
    setSelectedChains: (chainIds: string[]) => {
      dispatch(setSelectedChains(chainIds));
    },
    // Property type actions
    togglePropertyType: (propertyTypeId: string) => {
      dispatch(togglePropertyType(propertyTypeId));
    },
    setSelectedPropertyTypes: (propertyTypeIds: string[]) => {
      dispatch(setSelectedPropertyTypes(propertyTypeIds));
    },
    // Facility actions
    toggleFacility: (facilityId: string) => {
      dispatch(toggleFacility(facilityId));
    },
    setSelectedFacilities: (facilityIds: string[]) => {
      dispatch(setSelectedFacilities(facilityIds));
    },
    // Reset all filters
    resetFilters: () => {
      dispatch(resetFilters());
    },
  };
};
