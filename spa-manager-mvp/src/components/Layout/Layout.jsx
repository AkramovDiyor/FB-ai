import { useState } from 'react';
import { AppShell, Burger, Group, Select, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSpa } from '@tabler/icons-react';
import { useObject } from '../hooks/useObject';

export function Layout({ children }) {
  const [opened, { toggle }] = useDisclosure();
  const { selectedObject, changeObject } = useObject();

  const objects = [
    { value: 'MS-01', label: 'MS-01 - Москва Центр' },
    { value: 'MS-02', label: 'MS-02 - Москва Север' },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Group gap="sm">
              <IconSpa size={28} stroke={1.5} />
              <Title order={4}>SPA Manager</Title>
            </Group>
          </Group>
          
          <Group>
            <Select
              label="Объект"
              data={objects}
              value={selectedObject}
              onChange={changeObject}
              w={250}
              size="sm"
            />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <nav>
          {/* Навигация будет добавлена в следующей итерации */}
        </nav>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

export default Layout;
