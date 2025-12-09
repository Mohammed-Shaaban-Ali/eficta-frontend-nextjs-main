import { useQuery } from '@tanstack/react-query';
import { airportTypes } from '@/types/app/airportTypes';
import { metaTypes } from '@/types/glopal/metaTypes';
import { executeApiRequest } from '@/utils/executeApiRequest';

// const url = process.env.NEXT_PUBLIC_APP_EFICTA;
const url = process.env.NEXT_PUBLIC_APP_AIRPORTS;

interface AirportQueryParams {
  search: string;
  page: string;
}

interface AirportResponse {
  // data: airportTypes[];
  // meta: metaTypes;
  // status: string;
  items: airportTypes[];
  hasMore: boolean;
}

export function useGetAllAirportsQuery({ search, page }: AirportQueryParams) {
  return useQuery({
    queryFn: async () => {
      return executeApiRequest<AirportResponse>({
        method: 'GET',
        // url: `${url}/api/iati/airports?page=${page}&search=${search}`,//old url
        url: `${url}/api/flights-core/select2/airports?page=${page}&search=${search}`, //new url
      });
    },
    queryKey: ['Airports', search, page],
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    enabled: !!search,
  });
}
