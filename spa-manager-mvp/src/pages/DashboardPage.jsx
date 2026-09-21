import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '../api/services';
import { useAppContext } from '../contexts/AppContext';
import { SimpleGrid, Card, Text, Group, Loader, Center, Stack, Badge } from '@mantine/core';

export const DashboardPage = () => {
  const { selectedObject } = useAppContext();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard', selectedObject],
    queryFn: () => getDashboard(selectedObject),
    enabled: !!selectedObject,
    select: (response) => response.data,
  });

  if (isLoading) {
    return (
      <Center h="300px">
        <Loader />
      </Center>
    );
  }

  if (error) {
    return <Text color="red">Ошибка загрузки: {error.message}</Text>;
  }

  if (!data) {
    return <Text>Нет данных</Text>;
  }

  const kpis = [
    { label: 'Стоимость запаса', value: data.kpi?.inventory_value, suffix: '₽' },
    { label: 'Ниже точки заказа', value: data.kpi?.below_min_count },
    { label: 'Истекающий срок', value: data.kpi?.expiring_batches },
    { label: 'Открытые заказы', value: data.kpi?.open_orders },
    { label: 'Критичные предупреждения', value: data.kpi?.critical_alerts },
    { label: 'План на месяц', value: data.kpi?.monthly_plan, suffix: '₽' },
    { label: 'Процедур за 30 дней', value: data.kpi?.procedures_30d },
  ];

  return (
    <Stack gap="lg">
      <Text size="xl" fw={500}>Дашборд объекта {selectedObject}</Text>
      
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        {kpis.map((kpi, index) => (
          <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                  {kpi.label}
                </Text>
                <Text fw={700} size="xl" mt="xs">
                  {kpi.value !== null && kpi.value !== undefined 
                    ? `${kpi.value}${kpi.suffix || ''}` 
                    : '—'}
                </Text>
              </div>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      {data.top_alerts?.length > 0 && (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text fw={500} mb="md">Топ предупреждений</Text>
          <Stack gap="xs">
            {data.top_alerts.slice(0, 5).map((alert, idx) => (
              <Group key={idx} justify="space-between">
                <Text size="sm">{alert.title}</Text>
                <Badge 
                  color={alert.severity === 'critical' ? 'red' : 
                         alert.severity === 'high' ? 'orange' : 'blue'}
                  variant="light"
                >
                  {alert.severity}
                </Badge>
              </Group>
            ))}
          </Stack>
        </Card>
      )}

      {data.upcoming_orders?.length > 0 && (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text fw={500} mb="md">Ближайшие заказы</Text>
          <Stack gap="xs">
            {data.upcoming_orders.slice(0, 5).map((order, idx) => (
              <Group key={idx} justify="space-between">
                <Text size="sm">{order.product_name}</Text>
                <Text size="sm" c="dimmed">{order.expected_date}</Text>
              </Group>
            ))}
          </Stack>
        </Card>
      )}
    </Stack>
  );
};

export default DashboardPage;
