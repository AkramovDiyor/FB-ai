import { Box, AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      header={{ height: 80 }}
      navbar={{
        width: 260,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      
      <AppShell.Navbar p="xs">
        <Sidebar />
      </AppShell.Navbar>
      
      <AppShell.Main>
        <Box style={{ minHeight: 'calc(100vh - 100px)' }}>
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;
