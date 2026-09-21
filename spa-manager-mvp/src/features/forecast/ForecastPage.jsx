import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { postForecast, getReorderList } from '../api/services';
import { useObjectSwitch } from '../hooks/useObjectSwitch';
import { 
  Card, Title, Group, Text, Stack, NumberInput, 
  Button, Loader, Center, Alert, Box, Badge, Divider, SimpleGrid
} from '@mantine/core';
import { IconInfoCircle, IconAlertTriangle, IconCalculator } from '@tabler/icons-react';

export const ForecastPage = () => {
  const { selectedObject } = useObjectSwitch();
  const [formData, setFormData] = useState({
    sku: 'OIL-001',
    location: selectedObject,
    horizon_months: 3,
    safety_stock_days: 14,
    budget_limit: null,
  });

  const mutation = useMutation({
    mutationFn: postForecast,
  });

  const handleCalculate = () => {
    mutation.mutate({
      ...formData,
      location: selectedObject,
    });
  };

  const result = mutation.data?.data;
  const explanation = result?.explanation;
  const warnings = result?.warnings || [];

  return (
    <Stack gap="lg">
      <Title order={2}>Расчёт закупки</Title>

      {/* Input Form */}
      <Card p="md" withBorder>
        <Stack gap="md">
          <Group grow>
            <NumberInput
              label="SKU (пример: OIL-001)"
              value={formData.sku}
              onChange={(val) => setFormData({ ...formData, sku: val })}
              placeholder="Введите SKU"
            />
            <NumberInput
              label="Период прогноза (месяцев)"
              value={formData.horizon_months}
              onChange={(val) => setFormData({ ...formData, horizon_months: val })}
              min={1}
              max={12}
            />
            <NumberInput
              label="Страховой запас (дней)"
              value={formData.safety_stock_days}
              onChange={(val) => setFormData({ ...formData, safety_stock_days: val })}
              min={0}
              max={90}
            />
            <NumberInput
              label="Бюджетный лимит (₽)"
              value={formData.budget_limit}
              onChange={(val) => setFormData({ ...formData, budget_limit: val })}
              placeholder="Не ограничено"
              prefix="₽ "
            />
          </Group>
          <Button onClick={handleCalculate} loading={mutation.isPending} leftSection={<IconCalculator size={18} />}>
            Рассчитать закупку
          </Button>
        </Stack>
      </Card>

      {/* Loading State */}
      {mutation.isPending && (
        <Center h="200px"><Loader type="dots" /></Center>
      )}

      {/* Error State */}
      {mutation.isError && (
        <Alert icon={<IconAlertTriangle />} title="Ошибка расчёта" color="red">
          {mutation.error.message}
        </Alert>
      )}

      {/* Results */}
      {result && (
        <>
          <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="md">
            <MetricCard
              label="Прогнозный расход"
              value={result.forecasted_consumption}
              unit="шт."
              color="blue"
            />
            <MetricCard
              label="Текущий остаток"
              value={result.current_stock}
              unit="шт."
              color="green"
            />
            <MetricCard
              label="Поставки в пути"
              value={result.incoming_shipments}
              unit="шт."
              color="purple"
            />
            <MetricCard
              label="Ожидаемый остаток без закупки"
              value={result.expected_stock_without_order}
              unit="шт."
              color={result.expected_stock_without_order < 0 ? 'red' : 'orange'}
            />
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
            <MetricCard
              label="Страховой запас"
              value={result.safety_stock}
              unit="шт."
              color="cyan"
            />
            <MetricCard
              label="Точка заказа"
              value={result.reorder_point}
              unit="шт."
              color="indigo"
            />
            <MetricCard
              label="Рекомендуемый объём"
              value={result.recommended_quantity}
              unit="шт."
              color="green"
              highlight
            />
            <MetricCard
              label="Ориентировочная стоимость"
              value={result.estimated_cost}
              unit="₽"
              color="blue"
              highlight
            />
          </SimpleGrid>

          <Group gap="xl" mt="md">
            <Box>
              <Text size="sm" c="dimmed">Рекомендуемая дата заказа</Text>
              <Text fz="lg" fw={600}>{result.recommended_order_date || '—'}</Text>
            </Box>
            <Box>
              <Text size="sm" c="dimmed">Прогноз исчерпания</Text>
              <Text fz="lg" fw={600} c={result.stockout_forecast ? 'red' : 'green'}>
                {result.stockout_forecast || 'Не ожидается'}
              </Text>
            </Box>
          </Group>

          {/* Warnings */}
          {warnings.length > 0 && (
            <Stack gap="xs" mt="md">
              {warnings.map((warning, idx) => (
                <Alert 
                  key={idx} 
                  icon={<IconAlertTriangle />} 
                  title={warning.title} 
                  color="orange"
                  variant="light"
                >
                  {warning.message}
                </Alert>
              ))}
            </Stack>
          )}

          {/* Explanation Block */}
          {explanation && (
            <Card p="lg" mt="md" bg="gray.0" radius="md">
              <Title order={4} mb="md">Объяснение расчёта</Title>
              <Stack gap="sm">
                {explanation.data_used && (
                  <Box>
                    <Text size="xs" fw={700} c="dimmed">Использованные данные:</Text>
                    <Text size="sm">{explanation.data_used}</Text>
                  </Box>
                )}
                {explanation.period && (
                  <Box>
                    <Text size="xs" fw={700} c="dimmed">Период анализа:</Text>
                    <Text size="sm">{explanation.period}</Text>
                  </Box>
                )}
                {explanation.formulas && (
                  <Box>
                    <Text size="xs" fw={700} c="dimmed">Формулы:</Text>
                    <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{explanation.formulas}</Text>
                  </Box>
                )}
                {explanation.assumptions && (
                  <Box>
                    <Text size="xs" fw={700} c="dimmed">Допущения:</Text>
                    <Text size="sm">{explanation.assumptions}</Text>
                  </Box>
                )}
                {explanation.as_of && (
                  <Box>
                    <Text size="xs" fw={700} c="dimmed">Актуально на:</Text>
                    <Text size="sm">{new Date(explanation.as_of).toLocaleString()}</Text>
                  </Box>
                )}
              </Stack>
            </Card>
          )}
        </>
      )}
    </Stack>
  );
};

const MetricCard = ({ label, value, unit, color, highlight }) => (
  <Card p="lg" radius="md" withBorder bg={highlight ? 'blue.0' : undefined}>
    <Text c="dimmed" size="xs" tt="uppercase" fw={700}>{label}</Text>
    <Group gap="xs" align="flex-end" mt={5}>
      <Text fz="xl" fw={700} c={highlight ? 'blue' : undefined}>
        {value !== null && value !== undefined ? value.toLocaleString() : '—'}
      </Text>
      {unit && <Text size="sm" c="dimmed">{unit}</Text>}
    </Group>
  </Card>
);
