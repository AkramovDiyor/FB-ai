import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStock } from '../api/services';
import { useAppContext } from '../contexts/AppContext';
import { 
  Table, Text, Loader, Center, Stack, Group, Select, TextInput, 
  Checkbox, Card, Badge, Pagination 
} from '@mantine/core';

export const InventoryPage = () => {
  const { selectedObject } = useAppContext();
  const [category, setCategory] = useState('');
  const [belowMin, setBelowMin] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;

  const params = {
    location: selectedObject,
    category: category || undefined,
    below_min: belowMin ? true : undefined,
    limit,
    offset: (page - 1) * limit,
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['stock', params],
    queryFn: () => getStock(params),
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

  const rows = data?.items?.map((item) => (
    <Table.Tr key={item.sku}>
      <Table.Td>{item.sku}</Table.Td>
      <Table.Td>{item.product_name}</Table.Td>
      <Table.Td>{item.category}</Table.Td>
      <Table.Td>{item.stock_qty}</Table.Td>
      <Table.Td>{item.days_of_supply}</Table.Td>
      <Table.Td>{item.safety_stock}</Table.Td>
      <Table.Td>
        {item.is_below_min ? (
          <Badge color="red" variant="light">Ниже мин.</Badge>
        ) : (
          <Badge color="green" variant="light">Норма</Badge>
        )}
      </Table.Td>
      <Table.Td>{item.expiry_date}</Table.Td>
      <Table.Td>{item.stock_value} ₽</Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="lg">
      <Text size="xl" fw={500}>Остатки склада</Text>
      
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group gap="md">
          <Select
            label="Категория"
            placeholder="Все категории"
            clearable
            data={data?.categories || []}
            value={category}
            onChange={setCategory}
            w={200}
          />
          <Checkbox
            label="Только ниже минимума"
            checked={belowMin}
            onChange={(e) => setBelowMin(e.currentTarget.checked)}
          />
        </Group>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {data?.items?.length === 0 ? (
          <Text c="dimmed" ta="center">Нет данных для отображения</Text>
        ) : (
          <>
            <Table highlightOnHover striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>SKU</Table.Th>
                  <Table.Th>Название</Table.Th>
                  <Table.Th>Категория</Table.Th>
                  <Table.Th>Остаток</Table.Th>
                  <Table.Th>Запас (дни)</Table.Th>
                  <Table.Th>Страховой</Table.Th>
                  <Table.Th>Статус</Table.Th>
                  <Table.Th>Годность</Table.Th>
                  <Table.Th>Стоимость</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
            
            {data.total > limit && (
              <Pagination
                total={Math.ceil(data.total / limit)}
                value={page}
                onChange={setPage}
                mt="md"
                justify="center"
              />
            )}
          </>
        )}
      </Card>
    </Stack>
  );
};

export default InventoryPage;
