import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getReorderList } from '../api/services';
import { useObjectSwitch } from '../hooks/useObjectSwitch';
import { 
  Card, Title, Group, Text, Table, Badge, Stack, 
  Loader, Center, Select, Box, NumberInput, Button
} from '@mantine/core';
import { IconShoppingCart, IconCalendar } from '@tabler/icons-react';

export const ReorderPage = () => {
  const { selectedObject } = useObjectSwitch();
  const [horizonDays, setHorizonDays] = useState(14);

  const { data, isLoading } = useQuery({
    queryKey: ['reorder-list', selectedObject, horizonDays],
    queryFn: () => getReorderList({ 
      location: selectedObject, 
      horizon_days: horizonDays 
    }),
  });

  const reorderList = data?.data?.items || [];
  const totalAmount = data?.data?.total_amount || 0;

  const priorityColors = {
    critical: 'red',
    high: 'orange',
    normal: 'blue',
  };

  return (
    <Stack gap="lg">
      <Title order={2}>Что заказать ({selectedObject})</Title>

      {/* Horizon Selector */}
      <Card p="md" withBorder>
        <Group gap="md">
          <NumberInput
            label="Горизонт планирования (дней)"
            value={horizonDays}
            onChange={(val) => setHorizonDays(val)}
            min={1}
            max={90}
            w={200}
          />
          <Button mt={28} leftSection={<IconShoppingCart size={18} />}>
            Экспортировать список
          </Button>
        </Group>
      </Card>

      {/* Results */}
      {isLoading ? (
        <Center h="200px"><Loader type="dots" /></Center>
      ) : reorderList.length === 0 ? (
        <Card p="lg" withBorder>
          <Text c="dimmed" ta="center">
            Нет позиций для заказа в ближайшие {horizonDays} дней
          </Text>
        </Card>
      ) : (
        <>
          <Card p="md" withBorder bg="blue.0">
            <Group justify="space-between">
              <Text fw={600}>Итоговая сумма заказа:</Text>
              <Text fz="xl" fw={700}>{totalAmount.toLocaleString()} ₽</Text>
            </Group>
          </Card>

          <Card p="md" withBorder>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Приоритет</Table.Th>
                  <Table.Th>SKU</Table.Th>
                  <Table.Th>Название</Table.Th>
                  <Table.Th>Запас в днях</Table.Th>
                  <Table.Th>Дата исчерпания</Table.Th>
                  <Table.Th>Рекомендуемый объём</Table.Th>
                  <Table.Th>Стоимость</Table.Th>
                  <Table.Th>Заказать до</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {reorderList.map((item) => (
                  <Table.Tr key={item.sku}>
                    <Table.Td>
                      <Badge 
                        color={priorityColors[item.priority] || 'gray'}
                        variant="filled"
                      >
                        {item.priority === 'critical' ? 'Критический' : 
                         item.priority === 'high' ? 'Высокий' : 'Обычный'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>{item.sku}</Table.Td>
                    <Table.Td>{item.name}</Table.Td>
                    <Table.Td>
                      <Badge 
                        color={item.days_of_stock < 7 ? 'red' : item.days_of_stock < 14 ? 'orange' : 'green'}
                        variant="light"
                      >
                        {item.days_of_stock} дн.
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <IconCalendar size={16} />
                        {item.exhaustion_date || '—'}
                      </Group>
                    </Table.Td>
                    <Table.Td>{item.recommended_quantity} {item.unit}</Table.Td>
                    <Table.Td>{item.cost?.toLocaleString()} ₽</Table.Td>
                    <Table.Td>
                      <Text c={item.order_by_date ? 'red' : 'dimmed'} fw={500}>
                        {item.order_by_date || '—'}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </>
      )}
    </Stack>
  );
};
