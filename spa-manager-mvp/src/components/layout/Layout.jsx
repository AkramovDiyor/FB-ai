import { useState } from 'react';
import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ 
        width: sidebarOpen ? 280 : 60, 
        breakpoint: 'sm',
        collapsed: { mobile: !sidebarOpen }
      }}
      padding="md"
    >
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} />
      <AppShell.Main bg="gray.0">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};
