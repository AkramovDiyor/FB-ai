import { useState, useEffect } from 'react';
import { useObjectSwitch } from '../hooks/useObjectSwitch';
import { useObjects } from '../hooks/useObjects';
import { AppShell, Group, Text, Select, ActionIcon } from '@mantine/core';
import { IconWarehouse, IconMenu2 } from '@tabler/icons-react';

export const Header = ({ onMenuToggle }) => {
  const { selectedObject, setSelectedObject } = useObjectSwitch();
  const { objects, isLoading } = useObjects();

  return (
    <AppShell.Header h={60} px="md">
      <Group h="100%" justify="space-between">
        <Group>
          <ActionIcon variant="subtle" onClick={onMenuToggle}>
            <IconMenu2 size={24} />
          </ActionIcon>
          <Group gap="xs">
            <IconWarehouse size={28} color="#3b82f6" />
            <Text fw={700} fz="lg">SPA Manager</Text>
          </Group>
        </Group>
        
        <Group gap="xs">
          <Text size="sm" c="dimmed">Объект:</Text>
          <Select
            value={selectedObject}
            onChange={setSelectedObject}
            data={objects.map(o => ({ value: o.id, label: o.name }))}
            loading={isLoading}
            w={250}
            size="sm"
          />
        </Group>
      </Group>
    </AppShell.Header>
  );
};
