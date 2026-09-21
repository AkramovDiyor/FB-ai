import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboard, getAlerts } from '../api/services';
import { useObjectSwitch } from '../hooks/useObjectSwitch';
import { 
  SimpleGrid, Card, Text, Group, Stack, 
  Loader, Center, Title, Badge, Box 
} from '@mantine/core';
import { 
  IconPackage, IconAlertTriangle, IconClock, 
  IconTrendingUp, IconCalendar, IconDollarSign 
} from '@tabler/icons-react';

const KPICard = ({ icon: Icon, label, value, color }) => (
  <Card p="lg" radius="md" withBorder>
    <Group justify="space-between">
      <div>
        <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
          {label}
        </Text>
        <Text fz="xl" fw={700} mt={5}>{value || '—'}</Text>
      </div>
      <Icon size={32} color={color} stroke={1.5} />
    </Group>
  </Card>
);

export const DashboardPage = () => {
  const { selectedObject } = useObjectSwitch();

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['dashboard', selectedObject],
    queryFn: () => getDashboard(selectedObject),
  });

  const { data: alertsData, isLoading: alertsLoading } = useQuery({
    queryKey: ['alerts', selectedObject],
    queryFn: () => getAlerts({ location: selectedObject, limit: 5 }),
  });

  const dashboard = dashboardData?.data;
  const alerts = alertsData?.data?.alerts || [];

  if (dashboardLoading || alertsLoading) {
    return (
      <Center h="400px">
        <Loader type="dots" />
      </Center>
    );
  }

  return (
    <Stack gap="lg">
      <Title order={2}>Дашборд объекта {selectedObject}</Title>
      
      {/* KPI Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        <KPICard
          icon={IconDollarSign}
          label="Стоимость запаса"
          value={dashboard?.inventory_value ? `${dashboard.inventory_value.toLocaleString()} ₽` : '—'}
          color="#3b82f6"
        />
        <KPICard
          icon={IconPackage}
          label="Позиции ниже точки заказа"
          value={dashboard?.below_reorder_point || 0}
          color="#ef4444"
        />
        <KPICard
          icon={IconClock}
          label="Партии с истекающим сроком"
          value={dashboard?.expiring_batches || 0}
          color="#f59e0b"
        />
        <KPICard
          icon={IconCalendar}
          label="Открытые заказы"
          value={dashboard?.open_orders || 0}
          color="#8b5cf6"
        />
        <KPICard
          icon={IconAlertTriangle}
          label="Критичные предупреждения"
          value={dashboard?.critical_alerts || 0}
          color="#dc2626"
        />
        <KPICard
          icon={IconTrendingUp}
          label="Процедур за 30 дней"
          value={dashboard?.procedures_30d || 0}
          color="#10b981"
        />
      </SimpleGrid>

      {/* Top Alerts */}
      <Card p="lg" radius="md" withBorder>
        <Title order={4} mb="md">Топ предупреждений</Title>
        {alerts.length === 0 ? (
          <Text c="dimmed">Нет активных предупреждений</Text>
        ) : (
          <Stack gap="sm">
            {alerts.map((alert) => (
              <Group key={alert.id} justify="space-between" wrap="nowrap">
                <Badge 
                  color={
                    alert.severity === 'critical' ? 'red' :
                    alert.severity === 'high' ? 'orange' :
                    alert.severity === 'medium' ? 'yellow' : 'blue'
                  }
                  variant="light"
                >
                  {alert.type}
                </Badge>
                <Box style={{ flex: 1 }} mx="md">
                  <Text size="sm">{alert.title}</Text>
                  <Text size="xs" c="dimmed">{alert.recommendation}</Text>
                </Box>
                <Text size="xs" c="dimmed">{alert.location}</Text>
              </Group>
            ))}
          </Stack>
        )}
      </Card>
    </Stack>
  );
};
