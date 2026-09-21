import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getPriceDynamics, getServiceCost, postServiceCostSimulate } from '../api/services';
import { useObjectSwitch } from '../hooks/useObjectSwitch';
import { 
  Card, Title, Group, Text, Stack, TextInput, NumberInput, 
  Button, Loader, Center, Alert, Box, Table, Badge, SimpleGrid
} from '@mantine/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IconTrendingUp, IconCalculator } from '@tabler/icons-react';

export const PricingPage = () => {
  const { selectedObject } = useObjectSwitch();
  const [selectedSku, setSelectedSku] = useState('OIL-001');
  const [serviceId, setServiceId] = useState('massage_basic');
  const [priceIncrease, setPriceIncrease] = useState(10);

  const { data: priceData, isLoading: priceLoading } = useQuery({
    queryKey: ['price-dynamics', selectedSku],
    queryFn: () => getPriceDynamics({ sku: selectedSku }),
  });

  const { data: serviceData, isLoading: serviceLoading } = useQuery({
    queryKey: ['service-cost', serviceId],
    queryFn: () => getServiceCost(serviceId),
  });

  const simulateMutation = useMutation({
    mutationFn: postServiceCostSimulate,
  });

  const handleSimulate = () => {
    simulateMutation.mutate({
      service_id: serviceId,
      price_increase_percent: priceIncrease,
    });
  };

  const priceDynamics = priceData?.data;
  const serviceCost = serviceData?.data;
  const simulationResult = simulateMutation.data?.data;

  return (
    <Stack gap="lg">
      <Title order={2}>Цены и экономика услуг</Title>

      {/* Price Dynamics Section */}
      <Card p="md" withBorder>
        <Title order={3} mb="md">Динамика цен поставщика</Title>
        <Group gap="md" mb="md">
          <TextInput
            label="SKU товара"
            value={selectedSku}
            onChange={(e) => setSelectedSku(e.currentTarget.value)}
            placeholder="Например: OIL-001"
            w={200}
          />
        </Group>

        {priceLoading && <Center h="200px"><Loader type="dots" /></Center>}

        {priceDynamics && (
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
              <Card p="sm" withBorder>
                <Text size="sm" c="dimmed">Базовая цена</Text>
                <Text fz="lg" fw={700}>{priceDynamics.base_price?.toLocaleString()} ₽</Text>
              </Card>
              <Card p="sm" withBorder>
                <Text size="sm" c="dimmed">Текущая цена</Text>
                <Text fz="lg" fw={700}>{priceDynamics.current_price?.toLocaleString()} ₽</Text>
              </Card>
              <Card p="sm" withBorder>
                <Text size="sm" c="dimmed">Изменение</Text>
                <Text 
                  fz="lg" 
                  fw={700} 
                  c={priceDynamics.change_percent > 0 ? 'red' : 'green'}
                >
                  {priceDynamics.change_percent > 0 ? '+' : ''}{priceDynamics.change_percent}%
                </Text>
                <Text size="xs" c="dimmed">
                  ({priceDynamics.change_amount > 0 ? '+' : ''}{priceDynamics.change_amount?.toLocaleString()} ₽)
                </Text>
              </Card>
            </SimpleGrid>

            {priceDynamics.history && priceDynamics.history.length > 0 && (
              <Box>
                <Text fw={600} mb="sm">История изменений цены</Text>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={priceDynamics.history}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="price" stroke="#3b82f6" name="Цена (₽)" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            )}

            {priceDynamics.purchases && (
              <Box mt="md">
                <Text fw={600} mb="sm">Последние закупки</Text>
                <Table striped>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Дата</Table.Th>
                      <Table.Th>Поставщик</Table.Th>
                      <Table.Th>Количество</Table.Th>
                      <Table.Th>Цена за ед.</Table.Th>
                      <Table.Th>Сумма</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {priceDynamics.purchases.map((purchase, idx) => (
                      <Table.Tr key={idx}>
                        <Table.Td>{purchase.date}</Table.Td>
                        <Table.Td>{purchase.supplier}</Table.Td>
                        <Table.Td>{purchase.quantity}</Table.Td>
                        <Table.Td>{purchase.unit_price?.toLocaleString()} ₽</Table.Td>
                        <Table.Td>{purchase.total?.toLocaleString()} ₽</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Box>
            )}
          </Stack>
        )}
      </Card>

      {/* Service Cost Section */}
      <Card p="md" withBorder>
        <Title order={3} mb="md">Себестоимость услуги</Title>
        <Group gap="md" mb="md">
          <TextInput
            label="ID услуги"
            value={serviceId}
            onChange={(e) => setServiceId(e.currentTarget.value)}
            placeholder="Например: massage_basic"
            w={200}
          />
        </Group>

        {serviceLoading && <Center h="200px"><Loader type="dots" /></Center>}

        {serviceCost && (
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
              <Card p="sm" withBorder>
                <Text size="sm" c="dimmed">Себестоимость</Text>
                <Text fz="lg" fw={700}>{serviceCost.cost?.toLocaleString()} ₽</Text>
              </Card>
              <Card p="sm" withBorder>
                <Text size="sm" c="dimmed">Цена для клиента</Text>
                <Text fz="lg" fw={700}>{serviceCost.price?.toLocaleString()} ₽</Text>
              </Card>
              <Card p="sm" withBorder>
                <Text size="sm" c="dimmed">Маржинальность</Text>
                <Text 
                  fz="lg" 
                  fw={700} 
                  c={serviceCost.margin_percent > 0 ? 'green' : 'red'}
                >
                  {serviceCost.margin_percent}%
                </Text>
              </Card>
            </SimpleGrid>

            {serviceCost.components && (
              <Box>
                <Text fw={600} mb="sm">Компоненты себестоимости</Text>
                <Stack gap="xs">
                  {serviceCost.components.map((component, idx) => (
                    <Group key={idx} justify="space-between">
                      <Text>{component.name}</Text>
                      <Text fw={600}>{component.cost?.toLocaleString()} ₽</Text>
                    </Group>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        )}

        <Divider my="md" />

        {/* Simulation Section */}
        <Title order={4} mb="md">Сценарий "Что если"</Title>
        <Group gap="md" mb="md">
          <NumberInput
            label="Рост цены закупки (%)"
            value={priceIncrease}
            onChange={setPriceIncrease}
            min={0}
            max={100}
            suffix="%"
            w={200}
          />
          <Button 
            mt={28}
            onClick={handleSimulate}
            loading={simulateMutation.isPending}
            leftSection={<IconCalculator size={18} />}
          >
            Рассчитать
          </Button>
        </Group>

        {simulationResult && (
          <Alert 
            title="Результат симуляции" 
            color={simulationResult.new_margin_percent < serviceCost?.margin_percent ? 'orange' : 'blue'}
          >
            <Stack gap="xs">
              <Text>Новая себестоимость: <strong>{simulationResult.new_cost?.toLocaleString()} ₽</strong></Text>
              <Text>Новая маржинальность: <strong>{simulationResult.new_margin_percent}%</strong></Text>
              <Text>Изменение маржи: <strong>{simulationResult.margin_change}%</strong></Text>
            </Stack>
          </Alert>
        )}
      </Card>
    </Stack>
  );
};
