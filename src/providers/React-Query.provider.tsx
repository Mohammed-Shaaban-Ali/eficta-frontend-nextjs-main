'use client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import React from 'react';

function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )[0];

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default ReactQueryProvider;
