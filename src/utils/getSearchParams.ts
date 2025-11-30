import { searchHotelsParams } from '@/types/requests/searchHotelRequestTypes';

/**
 * Extracts search parameters for hotel searches from URL query parameters or local storage.
 *
 * This function first attempts to extract search parameters from the current URL's query string.
 * If the required parameters (such as 'country') are present in the URL, those values are used.
 * Otherwise, it falls back to retrieving saved search parameters from local storage.
 *
 * @returns A searchHotelsParams object containing the search parameters if they exist
 * either in the URL or in local storage, or undefined if neither source has valid data.
 */
export const getSearchParamsData = (): searchHotelsParams | undefined => {
  // Get search params from URL
  const searchParams = new URLSearchParams(window.location.search);

  // Parse the search parameters
  const searchValues: Partial<searchHotelsParams> = {
    country: searchParams.get('country') || undefined,
    radiusInMeters: 20000,
    checkIn: searchParams.get('checkIn') || undefined,
    checkOut: searchParams.get('checkOut') || undefined,
    location: {
      latitude: searchParams.get('lat')
        ? parseFloat(searchParams.get('lat') || '0')
        : 0,
      longitude: searchParams.get('lng')
        ? parseFloat(searchParams.get('lng') || '0')
        : 0,
    },
    rooms: searchParams.get('rooms')
      ? JSON.parse(decodeURIComponent(searchParams.get('rooms') || '[]'))
      : undefined,
  };

  // Return from URL params if we have necessary parameters
  if (searchValues.country) {
    return searchValues as searchHotelsParams;
  }

  // Fallback to localStorage if URL params are missing
  const localStorageData = localStorage.getItem('search');
  if (localStorageData) {
    return JSON.parse(localStorageData) as searchHotelsParams;
  }

  return undefined;
};
