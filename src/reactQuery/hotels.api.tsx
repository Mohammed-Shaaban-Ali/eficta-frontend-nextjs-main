import { useMutation, useQuery } from '@tanstack/react-query';
import { executeApiRequest } from '@/utils/executeApiRequest';
import { cityTypes } from '@/types/app/cityTypes';
import { metaTypes } from '@/types/glopal/metaTypes';
import {
  hotelDetailsTypes,
  hotelSeachTypes,
  roomTypes,
} from '@/types/app/hotelTypes';
import { searchHotelsParams } from '@/types/requests/searchHotelRequestTypes';
import { bookHotelRequest } from '@/types/requests/bookHotelRequest';
import { bookingTypes } from '@/types/app/bookTypes';
import { cancellationPolicyTypes } from '@/types/app/privacyTypes';

const url = process.env.NEXT_PUBLIC_APP_EFICTA;

export function useSearchHotelsQuery(data: searchHotelsParams) {
  return useQuery({
    queryFn: async () => {
      return executeApiRequest<{
        errors: [];
        data: hotelSeachTypes[];
        searchId: string;
        uuid: string;
        filters: {
          propertyTypes: { id: string; text: string; count: string }[];
          chains: { id: string; text: string; count: string }[];
          facilities: { id: string; text: string; count: string }[];
        };
      }>({
        method: 'POST',
        url: `${url}/api/hotels/b2c/search-hotels`,
        data,
      });
    },
    queryKey: ['Hotel', JSON.stringify(data)],
    enabled: !!data,
    staleTime: 0,
  });
}

export function useGetHotelBookQuery(bookingId: string) {
  return useQuery({
    queryFn: async () => {
      return executeApiRequest<{ success: string; data: bookingTypes }>({
        method: 'GET',
        url: `${url}/api/hotels/b2c/bookings/${bookingId}`,
      });
    },
    queryKey: ['Hotel', bookingId],
  });
}

export function useHotelBookMutation() {
  return useMutation({
    mutationFn: async (data: bookHotelRequest) => {
      return executeApiRequest<{ paymentId: string; bookingId: string }>({
        method: 'POST',
        url: `${url}/api/hotels/b2c/book`,
        data,
      });
    },
    mutationKey: ['Hotel'],
  });
}

export function useHotelConfirmBookMutation() {
  return useMutation({
    mutationFn: async (data: { bookingId: string; paymentId: string }) => {
      return executeApiRequest({
        method: 'POST',
        url: `${url}/api/hotels/b2c/confirm-booking`,
        data,
      });
    },
    mutationKey: ['Hotel'],
  });
}

export function useGetHotelDetailsQuery({
  uuid,
  hotelID,
}: {
  uuid: string;
  hotelID: string;
}) {
  return useQuery({
    queryFn: async () => {
      return executeApiRequest<{
        errors: [];
        packages: hotelDetailsTypes[];
        roomsContent: { rooms: { RoomKey: roomTypes }[] };
        hotelContent: {
          descriptions: {
            title: string;
            description: string;
            language: string;
            line: number;
          }[];
          facilities: {
            facility: string;
            facilityType: string;
          }[];
          images: string[];
        };
        uuid: string;
      }>({
        method: 'POST',
        url: `${url}/api/hotels/b2c/packages`,
        data: { uuid, hotelID, roomNameResponseLanguage: 'ar' },
      });
    },
    queryKey: ['Hotel', uuid, hotelID],
    staleTime: Infinity,
  });
}

export function useGetHotelCancellationRequestQuery({
  uuid,
  hotelID,
  packageID,
}: {
  uuid: string;
  hotelID: string;
  packageID: string;
}) {
  return useQuery({
    queryFn: async () => {
      return executeApiRequest<{
        errors: [];
        data: cancellationPolicyTypes;
      }>({
        method: 'POST',
        url: `${url}/api/hotels/b2c/cancellation-policy`,
        data: { uuid, hotelID, packageID },
      });
    },
    queryKey: ['HotelCancellation', uuid, hotelID, packageID],
    staleTime: Infinity,
  });
}
