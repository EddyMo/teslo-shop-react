import { RouterProvider } from 'react-router';
import { appRouter } from './app.router';

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner';
// import { checkAuthAction } from './auth/actions/check-auth.action';
import type { PropsWithChildren } from 'react';
import { CustomFullScreenLoading } from './components/custom/CustomFullScreenLoading';
import { useAuthStore } from './auth/store/auth.store';

const queryClient = new QueryClient();

const CkeckAuthProvider = ({ children }: PropsWithChildren) => {
  const { checkAuthStatus } = useAuthStore();
  const { isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: checkAuthStatus,
    // queryFn: checkAuthAction,
    retry: false,
    refetchInterval: 1000 * 60 * 1.5,
    refetchOnWindowFocus: true,
  });
  // console.log(isLoading);
  if (isLoading) return <CustomFullScreenLoading />;
  return children;
}

export const TesloShopApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />

      {/* The rest of your application */}
      <CkeckAuthProvider>
        <RouterProvider router={appRouter} />
      </CkeckAuthProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
};
