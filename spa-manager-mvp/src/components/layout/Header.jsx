import { Group, Select, Title, Box } from '@mantine/core';
import { IconBuildingWarehouse } from '@tabler/icons-react';
import { useAppContext } from '../../contexts/AppContext';

export const Header = () => {
  const { selectedObject, setObject, locations } = useAppContext();

  // Формируем данные для селекта
  const locationData = locations.map((loc) => ({
    value: loc.id,
    label: `${loc.id} — ${loc.name}`,
  }));

  return (
    <Box px="md" py="sm" bg="white" style={{ borderBottom: '1px solid #e9ecef' }}>
      <Group justify="space-between" align="center">
        <Group gap="sm">
          <IconBuildingWarehouse size={28} stroke={1.5} />
          <Title order={3}>SPA Manager</Title>
        </Group>
        
        {locations.length > 0 && (
          <Select
            label="Объект"
            placeholder="Выберите объект"
            data={locationData}
            value={selectedObject}
            onChange={setObject}
            w={250}
            allowDeselect={false}
          />
        )}
      </Group>
    </Box>
  );
};

export default Header;
