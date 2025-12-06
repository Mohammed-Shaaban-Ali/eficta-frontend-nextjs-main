import { useMutation, useQuery } from '@tanstack/react-query';
import { executeApiRequest } from '@/utils/executeApiRequest';
import { metaTypes } from '@/types/glopal/metaTypes';
import { FlightFilteringOptions, flightTypes } from '@/types/app/flightTypes';
import { FlightFareResponse } from '@/types/app/fareTypes';
import { FlightBookingRequest } from '@/types/requests/flightBookingRequest';
import { FlightBookingTypes } from '@/types/app/flightBookingTypes';

const url = process.env.NEXT_PUBLIC_APP_EFICTA;

export interface FlightSearchParams {
  fromAirport: string;
  toAirport: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: string;
}

interface FlightSearchResponse {
  data: flightTypes;
  filteringOptions: FlightFilteringOptions;
  sortingOptions: {
    id: 'price' | 'duration';
    text: string;
  }[];
  meta: metaTypes;
}
interface FlightFairRequest {
  departureFareKey: string;
  returnFareKey?: string;
  adults: number;
  children: number;
  infants: number;
  provider?: 'iati' | 'sabre';
}

export function useSearchFlightsQuery(data: FlightSearchParams) {
  return useQuery({
    queryFn: async () => {
      return executeApiRequest<FlightSearchResponse>({
        method: 'POST',
        url: `${url}/api/iati/search`,
        data,
      });
    },
    queryKey: ['Flights', 'iati', JSON.stringify(data)],
    enabled: !!data,
    staleTime: 0,
  });
}

export function useSearchFlightsSabreQuery(data: FlightSearchParams) {
  return useQuery({
    queryFn: async () => {
      return executeApiRequest<FlightSearchResponse>({
        method: 'POST',
        url: `${url}/api/sabre/search`,
        data,
      });
    },
    queryKey: ['Flights', 'sabre', JSON.stringify(data)],
    enabled: !!data,
    staleTime: 0,
  });
}

export function useFlightFareQuery(data: FlightFairRequest) {
  const provider = data.provider || 'iati';
  return useQuery({
    queryFn: async () => {
      return executeApiRequest<FlightFareResponse>({
        method: 'POST',
        url: `${url}/api/${provider}/fare`,
        data,
      });
    },
    queryKey: ['Flights', provider, JSON.stringify(data)],
    enabled: !!data,
  });
}
export function useFlightBookMutation() {
  return useMutation({
    mutationFn: async (data: FlightBookingRequest) => {
      return executeApiRequest<{
        success: boolean;
        message: string;
        bookingId: number;
        redirectUrl: string;
      }>({
        method: 'POST',
        url: `${url}/api/iati/book`,
        data,
      });
    },
    mutationKey: ['FlightBooking'],
  });
}

export function useGetFlightBookQuery(bookingId: string) {
  return useQuery({
    queryFn: async () => {
      return executeApiRequest<{ success: string; data: FlightBookingTypes }>({
        method: 'GET',
        url: `${url}/api/iati/bookings/${bookingId}`,
      });
    },
    queryKey: ['FlightBooking', bookingId],
  });
}
