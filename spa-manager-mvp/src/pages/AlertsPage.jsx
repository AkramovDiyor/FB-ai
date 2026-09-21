import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAlerts } from '../api/services';
import { useAppContext } from '../contexts/AppContext';
import { 
  Stack, Text, Loader, Center, Group, Select, Card, Badge, 
  Accordion, Box 
} from '@mantine/core';
import { IconAlertTriangle, IconInfoCircle, IconCheck } from '@tabler/icons-react';

const severityColors = {
  critical: 'red',
  high: 'orange',
  medium: 'yellow',
  low: 'blue',
  info: 'gray',
};

export const AlertsPage = () => {
  const { selectedObject } = useAppContext();
  const [type, setType] = useState('');
  const [severity, setSeverity] = useState('');

  const params = {
    location: selectedObject,
    type: type || undefined,
    severity: severity || undefined,
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['alerts', params],
    queryFn: () => getAlerts(params),
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

  const alertTypes = [...new Set(data?.items?.map(a => a.type) || [])];
  const severities = [...new Set(data?.items?.map(a => a.severity) || [])];

  return (
    <Stack gap="lg">
      <Text size="xl" fw={500}>Предупреждения</Text>
      
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group gap="md">
          <Select
            label="Тип"
            placeholder="Все типы"
            clearable
            data={alertTypes}
            value={type}
            onChange={setType}
            w={200}
          />
          <Select
            label="Severity"
            placeholder="Все уровни"
            clearable
            data={severities}
            value={severity}
            onChange={setSeverity}
            w={200}
          />
        </Group>
      </Card>

      {data?.items?.length === 0 ? (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text c="dimmed" ta="center">Нет предупреждений</Text>
        </Card>
      ) : (
        <Stack gap="md">
          {data?.items?.map((alert, idx) => (
            <Card key={idx} shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="sm">
                <Group gap="sm">
                  <IconAlertTriangle 
                    size={24} 
                    color={severityColors[alert.severity]} 
                  />
                  <div>
                    <Text fw={500}>{alert.title}</Text>
                    <Text size="sm" c="dimmed">{alert.sku} — {alert.product_name}</Text>
                  </div>
                </Group>
                <Badge 
                  color={severityColors[alert.severity]} 
                  variant="light"
                >
                  {alert.severity}
                </Badge>
              </Group>
              
              <Accordion variant="separated" mt="md">
                <Accordion.Item value="details">
                  <Accordion.Control icon={<IconInfoCircle size={16} />}>
                    Детали и метрики
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Box style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                      <pre>{JSON.stringify(alert.metrics, null, 2)}</pre>
                    </Box>
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value="recommendation">
                  <Accordion.Control icon={<IconCheck size={16} />}>
                    Рекомендация
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text>{alert.recommendation}</Text>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default AlertsPage;
