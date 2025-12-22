import { useQuery } from '@tanstack/react-query';
import { executeApiRequest } from '@/utils/executeApiRequest';

const url = 'https://gita.sa';

export interface ClientItem {
  id: number;
  text: string;
}

interface ClientsResponse {
  items: ClientItem[];
  hasMore: boolean;
}

interface ClientsQueryParams {
  search?: string;
  page?: string;
}

export function useGetClientsQuery({
  search = '',
  page = '1',
}: ClientsQueryParams) {
  return useQuery({
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (page) params.append('page', page);

      return executeApiRequest<ClientsResponse>({
        method: 'GET',
        url: `${url}/dashboard/information/select2/clients?${params.toString()}`,
      });
    },
    queryKey: ['Clients', search, page],
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
    enabled: true,
  });
}
