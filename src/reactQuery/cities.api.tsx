import { useQuery } from '@tanstack/react-query';
import { cityTypes } from '@/types/app/cityTypes';
import { metaTypes } from '@/types/glopal/metaTypes';
import axios from 'axios';
import { executeApiRequest } from '@/utils/executeApiRequest';

const url = process.env.NEXT_PUBLIC_APP_EFICTA;

interface CitiesQueryParams {
  name: string;
  code: string;
}

interface CitiesResponse {
  data: cityTypes[];
  meta: metaTypes;
  status: string;
}

export function useGetAllCitiesQuery({ name, code }: CitiesQueryParams) {
  return useQuery({
    queryFn: async () => {
      return executeApiRequest<CitiesResponse>({
        method: 'GET',
        url: `${url}/api/hotels/cities?name=${name}&code=${code}`,
      });
    },
    queryKey: ['cities', name, code],
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    enabled: !!name,
  });
}
