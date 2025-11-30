import { useQuery } from '@tanstack/react-query';
import { airportTypes } from '@/types/app/airportTypes';
import { metaTypes } from '@/types/glopal/metaTypes';
import { executeApiRequest } from '@/utils/executeApiRequest';

const url = process.env.NEXT_PUBLIC_APP_EFICTA;

interface AirportQueryParams {
  search: string;
  page: string;
}

interface AirportResponse {
  data: airportTypes[];
  meta: metaTypes;
  status: string;
}

export function useGetAllAirportsQuery({ search, page }: AirportQueryParams) {
  return useQuery({
    queryFn: async () => {
      return executeApiRequest<AirportResponse>({
        method: 'GET',
        url: `${url}/api/iati/airports?page=${page}&search=${search}`,
      });
    },
    queryKey: ['Airports', search, page],
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    enabled: !!search,
  });
}
