import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { postForecast } from '../api/services';
import { useAppContext } from '../contexts/AppContext';
import { 
  Stack, Text, Loader, Center, Group, Card, NumberInput, 
  Select, Button, Box, Badge, Divider, Accordion
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

export const ForecastPage = () => {
  const { selectedObject } = useAppContext();
  const [sku, setSku] = useState('');
  const [horizonMonths, setHorizonMonths] = useState(3);
  const [safetyStockDays, setSafetyStockDays] = useState(7);
  const [budgetLimit, setBudgetLimit] = useState('');

  const mutation = useMutation({
    mutationFn: (data) => postForecast(data),
    onSuccess: (response) => response.data,
    onError: (error) => {
      notifications.show({
        title: 'Ошибка',
        message: error.message,
        color: 'red',
      });
    },
  });

  const handleCalculate = () => {
    if (!sku) {
      notifications.show({
        title: 'Предупреждение',
        message: 'Выберите SKU товара',
        color: 'yellow',
      });
      return;
    }

    mutation.mutate({
      sku,
      location: selectedObject,
      horizon_months: horizonMonths,
      safety_stock_days: safetyStockDays,
      budget_limit: budgetLimit ? Number(budgetLimit) : undefined,
    });
  };

  const data = mutation.data?.data;

  return (
    <Stack gap="lg">
      <Text size="xl" fw={500}>Расчёт закупки</Text>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group gap="md" align="flex-end">
          <NumberInput
            label="SKU"
            placeholder="Например: OIL-001"
            value={sku}
            onChange={(val) => setSku(val)}
            w={200}
          />
          <Select
            label="Период (месяцы)"
            data={['1', '3', '6', '12'].map(String)}
            value={String(horizonMonths)}
            onChange={(val) => setHorizonMonths(Number(val))}
            w={150}
          />
          <NumberInput
            label="Страховой запас (дни)"
            value={safetyStockDays}
            onChange={(val) => setSafetyStockDays(Number(val))}
            w={150}
          />
          <NumberInput
            label="Лимит бюджета (₽)"
            placeholder="Опционально"
            value={budgetLimit}
            onChange={(val) => setBudgetLimit(val)}
            w={200}
          />
          <Button 
            onClick={handleCalculate} 
            loading={mutation.isPending}
          >
            Рассчитать
          </Button>
        </Group>
      </Card>

      {mutation.isPending && (
        <Center h="200px">
          <Loader />
        </Center>
      )}

      {data && (
        <>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text c="dimmed" size="xs">Прогнозный расход</Text>
              <Text fw={700} size="xl">{data.forecasted_consumption}</Text>
            </Card>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text c="dimmed" size="xs">Текущий остаток</Text>
              <Text fw={700} size="xl">{data.current_stock}</Text>
            </Card>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text c="dimmed" size="xs">Рекомендуемый объём</Text>
              <Text fw={700} size="xl" c="blue">{data.recommended_qty}</Text>
            </Card>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text c="dimmed" size="xs">Ориентировочная стоимость</Text>
              <Text fw={700} size="xl" c="green">{data.estimated_cost} ₽</Text>
            </Card>
          </SimpleGrid>

          {data.warnings?.length > 0 && (
            <Card shadow="sm" padding="lg" radius="md" withBorder bg="orange.0">
              <Group gap="sm" mb="sm">
                <Badge color="orange">Внимание</Badge>
                <Text fw={500}>Предупреждения системы</Text>
              </Group>
              <ul>
                {data.warnings.map((w, i) => (
                  <li key={i}><Text size="sm">{w}</Text></li>
                ))}
              </ul>
            </Card>
          )}

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Accordion variant="separated">
              <Accordion.Item value="explanation">
                <Accordion.Control>Объяснение расчёта</Accordion.Control>
                <Accordion.Panel>
                  <Box style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                    <pre>{JSON.stringify(data.explanation, null, 2)}</pre>
                  </Box>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Card>
        </>
      )}
    </Stack>
  );
};

export default ForecastPage;
