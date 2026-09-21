import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStock, getProduct, getBatches, getMovements } from '../../api/services';
import { useObjectSwitch } from '../../hooks/useObjectSwitch';
import { 
  Card, Title, Group, Text, Table, Badge, Button, 
  Stack, Box, Loader, Center, Pagination, Select, 
  Checkbox, Modal, Tabs
} from '@mantine/core';

export const InventoryPage = () => {
  const { selectedObject } = useObjectSwitch();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [belowMinOnly, setBelowMinOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSku, setSelectedSku] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);
  const queryClient = useQueryClient();

  const { data: stockData, isLoading } = useQuery({
    queryKey: ['stock', selectedObject, selectedCategory, belowMinOnly, currentPage],
    queryFn: () => getStock({
      location: selectedObject,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      below_min: belowMinOnly,
      limit: 20,
      offset: (currentPage - 1) * 20,
    }),
  });

  const { data: productData } = useQuery({
    queryKey: ['product', selectedSku],
    queryFn: () => getProduct(selectedSku),
    enabled: !!selectedSku,
  });

  const { data: batchesData } = useQuery({
    queryKey: ['batches', selectedSku],
    queryFn: () => getBatches({ sku: selectedSku }),
    enabled: !!selectedSku,
  });

  const { data: movementsData } = useQuery({
    queryKey: ['movements', selectedSku],
    queryFn: () => getMovements({ sku: selectedSku, limit: 10 }),
    enabled: !!selectedSku,
  });

  const stock = stockData?.data || {};
  const items = stock.items || [];
  const total = stock.total || 0;

  const openProductModal = (sku) => {
    setSelectedSku(sku);
    setModalOpened(true);
  };

  return (
    <Stack gap="lg">
      <Title order={2}>Остатки ({selectedObject})</Title>

      {/* Filters */}
      <Card p="md" withBorder>
        <Group gap="md">
          <Select
            label="Категория"
            value={selectedCategory}
            onChange={setSelectedCategory}
            data={[
              { value: 'all', label: 'Все категории' },
              { value: 'cosmetics', label: 'Косметика' },
              { value: 'consumables', label: 'Расходники' },
              { value: 'textiles', label: 'Текстиль' },
            ]}
            w={200}
            size="sm"
          />
          <Checkbox
            mt={22}
            checked={belowMinOnly}
            onChange={(e) => setBelowMinOnly(e.currentTarget.checked)}
            label="Только ниже минимума"
          />
        </Group>
      </Card>

      {/* Stock Table */}
      <Card p="md" withBorder>
        {isLoading ? (
          <Center h="200px"><Loader type="dots" /></Center>
        ) : items.length === 0 ? (
          <Text c="dimmed" ta="center">Нет данных для отображения</Text>
        ) : (
          <>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>SKU</Table.Th>
                  <Table.Th>Название</Table.Th>
                  <Table.Th>Категория</Table.Th>
                  <Table.Th>Остаток</Table.Th>
                  <Table.Th>Запас в днях</Table.Th>
                  <Table.Th>Страховой запас</Table.Th>
                  <Table.Th>Срок годности</Table.Th>
                  <Table.Th>Статус</Table.Th>
                  <Table.Th>Действия</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {items.map((item) => (
                  <Table.Tr key={item.sku}>
                    <Table.Td>{item.sku}</Table.Td>
                    <Table.Td>{item.name}</Table.Td>
                    <Table.Td>{item.category}</Table.Td>
                    <Table.Td>{item.quantity}</Table.Td>
                    <Table.Td>
                      <Badge 
                        color={item.days_of_stock < 7 ? 'red' : item.days_of_stock < 14 ? 'orange' : 'green'}
                        variant="light"
                      >
                        {item.days_of_stock} дн.
                      </Badge>
                    </Table.Td>
                    <Table.Td>{item.safety_stock}</Table.Td>
                    <Table.Td>{item.expiry_date || '—'}</Table.Td>
                    <Table.Td>
                      {item.is_below_min && (
                        <Badge color="red" variant="dot">Ниже минимума</Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Button size="xs" variant="subtle" onClick={() => openProductModal(item.sku)}>
                        Карточка
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            <Group justify="space-between" mt="md">
              <Text size="sm" c="dimmed">
                Показано {items.length} из {total}
              </Text>
              <Pagination
                value={currentPage}
                onChange={setCurrentPage}
                total={Math.ceil(total / 20)}
              />
            </Group>
          </>
        )}
      </Card>

      {/* Product Modal */}
      <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title="Карточка позиции" size="xl">
        {selectedSku && (
          <Tabs defaultValue="info">
            <Tabs.List>
              <Tabs.Tab value="info">Информация</Tabs.Tab>
              <Tabs.Tab value="batches">Партии</Tabs.Tab>
              <Tabs.Tab value="movements">Движение</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="info" pt="xs">
              {productData?.data && (
                <Stack>
                  <Text><strong>SKU:</strong> {productData.data.sku}</Text>
                  <Text><strong>Название:</strong> {productData.data.name}</Text>
                  <Text><strong>Категория:</strong> {productData.data.category}</Text>
                  <Text><strong>Ед. измерения:</strong> {productData.data.unit}</Text>
                </Stack>
              )}
            </Tabs.Panel>

            <Tabs.Panel value="batches" pt="xs">
              {batchesData?.data?.batches?.map((batch) => (
                <Card key={batch.id} p="sm" mb="xs" withBorder>
                  <Group justify="space-between">
                    <Text>Партия: {batch.batch_number}</Text>
                    <Badge color={batch.days_until_expiry < 30 ? 'red' : 'green'}>
                      {batch.days_until_expiry} дн. до истечения
                    </Badge>
                  </Group>
                  <Text size="sm">Количество: {batch.quantity}</Text>
                </Card>
              ))}
            </Tabs.Panel>

            <Tabs.Panel value="movements" pt="xs">
              {movementsData?.data?.movements?.map((movement) => (
                <Group key={movement.id} justify="space-between" mb="xs">
                  <Text>{movement.date}</Text>
                  <Badge color={movement.type === 'in' ? 'green' : 'red'}>
                    {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                  </Badge>
                  <Text size="sm">{movement.reason}</Text>
                </Group>
              ))}
            </Tabs.Panel>
          </Tabs>
        )}
      </Modal>
    </Stack>
  );
};
