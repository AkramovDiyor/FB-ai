import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AppProvider } from './contexts/AppContext';
import { Layout } from './components/layout';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import AlertsPage from './pages/AlertsPage';

// Placeholder страницы для остальных экранов
const PlaceholderPage = ({ title }) => (
  <div style={{ padding: '2rem' }}>
    <h1>{title}</h1>
    <p>Страница в разработке...</p>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <MantineProvider>
      <Notifications />
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<DashboardPage />} />
                <Route path="inventory" element={<InventoryPage />} />
                <Route path="alerts" element={<AlertsPage />} />
                <Route path="forecast" element={<PlaceholderPage title="Расчёт закупки" />} />
                <Route path="reorder" element={<PlaceholderPage title="Что заказать" />} />
                <Route path="planning" element={<PlaceholderPage title="План и бюджет" />} />
                <Route path="pricing" element={<PlaceholderPage title="Цены и экономика" />} />
                <Route path="chat" element={<PlaceholderPage title="Чат с ИИ" />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
}

export default App;
