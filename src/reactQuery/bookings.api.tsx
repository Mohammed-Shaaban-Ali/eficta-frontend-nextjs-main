import { useMutation, useQuery } from '@tanstack/react-query';
import { executeApiRequest } from '@/utils/executeApiRequest';
import { bookingTypes } from '@/types/app/bookTypes';

const url = process.env.NEXT_PUBLIC_APP_EFICTA;

export function useGetUserBookingsQuery() {
  return useQuery({
    queryFn: async () => {
      return executeApiRequest<{ data: bookingTypes[] }>({
        method: 'GET',
        url: `${url}/api/hotels/b2c/bookings`,
      });
    },
    queryKey: ['Bookings'],
  });
}

export function useCancelUserBookMutation({
  bookingReference,
}: {
  bookingReference: string;
}) {
  return useMutation({
    mutationFn: async () => {
      return executeApiRequest({
        method: 'DELETE',
        url: `${url}/api/hotels/b2c/bookings/${bookingReference}`,
      });
    },
    mutationKey: ['Bookings', bookingReference],
  });
}
