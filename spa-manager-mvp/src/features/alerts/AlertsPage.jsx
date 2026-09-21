import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAlerts } from '../api/services';
import { useObjectSwitch } from '../hooks/useObjectSwitch';
import { 
  Card, Title, Group, Text, Badge, Stack, 
  Loader, Center, Select, Box, Alert
} from '@mantine/core';
import { IconInfoCircle, IconAlertTriangle, IconExclamationCircle } from '@tabler/icons-react';

const severityIcons = {
  critical: IconExclamationCircle,
  high: IconAlertTriangle,
  medium: IconInfoCircle,
  low: IconInfoCircle,
};

const severityColors = {
  critical: 'red',
  high: 'orange',
  medium: 'yellow',
  low: 'blue',
};

export const AlertsPage = () => {
  const { selectedObject } = useObjectSwitch();
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['alerts', selectedObject, filterType, filterSeverity],
    queryFn: () => getAlerts({
      location: selectedObject,
      type: filterType !== 'all' ? filterType : undefined,
      severity: filterSeverity !== 'all' ? filterSeverity : undefined,
    }),
  });

  const alerts = data?.data?.alerts || [];

  return (
    <Stack gap="lg">
      <Title order={2}>Предупреждения ({selectedObject})</Title>

      {/* Filters */}
      <Card p="md" withBorder>
        <Group gap="md">
          <Select
            label="Тип предупреждения"
            value={filterType}
            onChange={setFilterType}
            data={[
              { value: 'all', label: 'Все типы' },
              { value: 'risk_of_shortage', label: 'Риск дефицита' },
              { value: 'low_stock', label: 'Низкий остаток' },
              { value: 'overstock', label: 'Излишек' },
              { value: 'no_movement', label: 'Отсутствие движения' },
              { value: 'expiry_approaching', label: 'Приближение срока годности' },
              { value: 'demand_spike', label: 'Резкое изменение расхода' },
              { value: 'price_increase', label: 'Рост закупочных цен' },
            ]}
            w={250}
            size="sm"
          />
          <Select
            label="Уровень критичности"
            value={filterSeverity}
            onChange={setFilterSeverity}
            data={[
              { value: 'all', label: 'Все уровни' },
              { value: 'critical', label: 'Критический' },
              { value: 'high', label: 'Высокий' },
              { value: 'medium', label: 'Средний' },
              { value: 'low', label: 'Низкий' },
            ]}
            w={200}
            size="sm"
          />
        </Group>
      </Card>

      {/* Alerts List */}
      {isLoading ? (
        <Center h="200px"><Loader type="dots" /></Center>
      ) : alerts.length === 0 ? (
        <Alert icon={<IconInfoCircle />} title="Нет предупреждений" color="blue">
          На текущий момент нет активных предупреждений для выбранных фильтров.
        </Alert>
      ) : (
        <Stack gap="md">
          {alerts.map((alert) => {
            const Icon = severityIcons[alert.severity] || IconInfoCircle;
            return (
              <Card key={alert.id} p="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Group gap="xs">
                    <Icon 
                      size={24} 
                      color={severityColors[alert.severity]} 
                      stroke={1.5} 
                    />
                    <Badge 
                      color={severityColors[alert.severity]}
                      variant="filled"
                    >
                      {alert.severity}
                    </Badge>
                    <Text fw={600}>{alert.title}</Text>
                  </Group>
                  <Badge variant="outline">{alert.type}</Badge>
                </Group>

                <Box ml={34}>
                  <Stack gap="xs">
                    {alert.description && (
                      <Text size="sm">{alert.description}</Text>
                    )}
                    
                    {alert.metrics && Object.keys(alert.metrics).length > 0 && (
                      <Card p="sm" bg="gray.0" radius="sm">
                        <Text size="xs" fw={700} c="dimmed" mb="xs">Метрики:</Text>
                        <Group gap="xs">
                          {Object.entries(alert.metrics).map(([key, value]) => (
                            <Badge key={key} variant="light" size="sm">
                              {key}: {typeof value === 'number' ? value.toLocaleString() : value}
                            </Badge>
                          ))}
                        </Group>
                      </Card>
                    )}

                    {alert.recommendation && (
                      <Alert 
                        icon={<IconInfoCircle size={16} />} 
                        title="Рекомендация" 
                        color="blue" 
                        variant="light"
                      >
                        {alert.recommendation}
                      </Alert>
                    )}

                    <Group gap="xs" mt="xs">
                      <Text size="xs" c="dimmed">Объект: {alert.location}</Text>
                      {alert.sku && (
                        <Text size="xs" c="dimmed">SKU: {alert.sku}</Text>
                      )}
                      {alert.created_at && (
                        <Text size="xs" c="dimmed">Создано: {new Date(alert.created_at).toLocaleDateString()}</Text>
                      )}
                    </Group>
                  </Stack>
                </Box>
              </Card>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};
