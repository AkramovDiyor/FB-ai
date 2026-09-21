import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { postPurchasePlan, postBudget } from '../api/services';
import { useObjectSwitch } from '../hooks/useObjectSwitch';
import { 
  Card, Title, Group, Text, Stack, Select, NumberInput, 
  Button, Loader, Center, Alert, Box, SimpleGrid, Divider
} from '@mantine/core';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IconChartBar, IconTrendingUp } from '@tabler/icons-react';

export const PlanningPage = () => {
  const { selectedObject } = useObjectSwitch();
  const [planPeriod, setPlanPeriod] = useState('quarter');
  const [budgetLimit, setBudgetLimit] = useState(null);
  const [budgetPeriod, setBudgetPeriod] = useState('month');

  const planMutation = useMutation({
    mutationFn: postPurchasePlan,
  });

  const budgetMutation = useMutation({
    mutationFn: postBudget,
  });

  const handlePlanCalculate = () => {
    planMutation.mutate({
      location: selectedObject,
      period: planPeriod,
      budget_limit: budgetLimit,
    });
  };

  const handleBudgetCalculate = () => {
    budgetMutation.mutate({
      location: selectedObject,
      period: budgetPeriod,
    });
  };

  const planResult = planMutation.data?.data;
  const budgetResult = budgetMutation.data?.data;

  return (
    <Stack gap="lg">
      <Title order={2}>План закупок и бюджет</Title>

      {/* Purchase Plan Section */}
      <Card p="md" withBorder>
        <Title order={3} mb="md">План закупок</Title>
        <Group gap="md" mb="md">
          <Select
            label="Период"
            value={planPeriod}
            onChange={setPlanPeriod}
            data={[
              { value: 'month', label: 'Месяц' },
              { value: 'quarter', label: 'Квартал' },
              { value: 'half_year', label: 'Полугодие' },
              { value: 'year', label: 'Год' },
            ]}
            w={200}
          />
          <NumberInput
            label="Бюджетный лимит (₽)"
            value={budgetLimit}
            onChange={setBudgetLimit}
            placeholder="Не ограничено"
            prefix="₽ "
            w={200}
          />
          <Button 
            mt={28} 
            onClick={handlePlanCalculate} 
            loading={planMutation.isPending}
            leftSection={<IconChartBar size={18} />}
          >
            Рассчитать план
          </Button>
        </Group>

        {planMutation.isPending && <Center h="100px"><Loader type="dots" /></Center>}
        
        {planResult && (
          <Stack gap="md">
            {planResult.over_limit_by && (
              <Alert color="orange" title="Превышение бюджета">
                План превышает лимит на {planResult.over_limit_by.toLocaleString()} ₽
              </Alert>
            )}
            
            {planResult.by_month && (
              <Box>
                <Text fw={600} mb="sm">План по месяцам</Text>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={planResult.by_month}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amount" fill="#3b82f6" name="Сумма (₽)" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}

            {planResult.by_category && (
              <Box>
                <Text fw={600} mb="sm">План по категориям</Text>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  {planResult.by_category.map((cat) => (
                    <Card key={cat.category} p="sm" withBorder>
                      <Text size="sm" c="dimmed">{cat.category}</Text>
                      <Text fz="lg" fw={700}>{cat.amount?.toLocaleString()} ₽</Text>
                    </Card>
                  ))}
                </SimpleGrid>
              </Box>
            )}
          </Stack>
        )}
      </Card>

      {/* Budget Section */}
      <Card p="md" withBorder>
        <Title order={3} mb="md">Анализ бюджета</Title>
        <Group gap="md" mb="md">
          <Select
            label="Период"
            value={budgetPeriod}
            onChange={setBudgetPeriod}
            data={[
              { value: 'month', label: 'Месяц' },
              { value: 'quarter', label: 'Квартал' },
              { value: 'half_year', label: 'Полугодие' },
              { value: 'year', label: 'Год' },
            ]}
            w={200}
          />
          <Button 
            mt={28} 
            onClick={handleBudgetCalculate} 
            loading={budgetMutation.isPending}
            leftSection={<IconTrendingUp size={18} />}
          >
            Сравнить с периодом
          </Button>
        </Group>

        {budgetMutation.isPending && <Center h="100px"><Loader type="dots" /></Center>}

        {budgetResult && (
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
              <Card p="sm" withBorder>
                <Text size="sm" c="dimmed">Текущий период</Text>
                <Text fz="xl" fw={700}>{budgetResult.current_period?.toLocaleString()} ₽</Text>
              </Card>
              <Card p="sm" withBorder>
                <Text size="sm" c="dimmed">Предыдущий период</Text>
                <Text fz="xl" fw={700}>{budgetResult.previous_period?.toLocaleString()} ₽</Text>
              </Card>
              <Card p="sm" withBorder>
                <Text size="sm" c="dimmed">Изменение</Text>
                <Text 
                  fz="xl" 
                  fw={700} 
                  c={budgetResult.change_percent > 0 ? 'red' : 'green'}
                >
                  {budgetResult.change_percent > 0 ? '+' : ''}{budgetResult.change_percent}%
                </Text>
                <Text size="xs" c="dimmed">
                  ({budgetResult.change_amount > 0 ? '+' : ''}{budgetResult.change_amount?.toLocaleString()} ₽)
                </Text>
              </Card>
            </SimpleGrid>

            {budgetResult.drivers && (
              <Box>
                <Text fw={600} mb="sm">Драйверы изменений</Text>
                <Stack gap="xs">
                  {budgetResult.drivers.demand && (
                    <Group justify="space-between">
                      <Text>Вклад спроса:</Text>
                      <Badge>{budgetResult.drivers.demand}%</Badge>
                    </Group>
                  )}
                  {budgetResult.drivers.prices && (
                    <Group justify="space-between">
                      <Text>Вклад цен:</Text>
                      <Badge>{budgetResult.drivers.prices}%</Badge>
                    </Group>
                  )}
                  {budgetResult.drivers.safety_stock && (
                    <Group justify="space-between">
                      <Text>Вклад страхового запаса:</Text>
                      <Badge>{budgetResult.drivers.safety_stock}%</Badge>
                    </Group>
                  )}
                </Stack>
              </Box>
            )}
          </Stack>
        )}
      </Card>
    </Stack>
  );
};
