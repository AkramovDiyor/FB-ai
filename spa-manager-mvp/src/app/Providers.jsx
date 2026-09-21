import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ObjectProvider from '../hooks/useObject';

const theme = createTheme({
  primaryColor: 'teal',
  fontFamily: 'Inter, sans-serif',
  headings: {
    fontFamily: 'Inter, sans-serif',
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 минут
    },
  },
});

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <ObjectProvider>
          <Notifications position="top-right" />
          {children}
        </ObjectProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default AppProviders;
