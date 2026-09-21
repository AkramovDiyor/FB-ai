import { AppShell, NavLink, Group, Text, ScrollArea } from '@mantine/core';
import { 
  IconDashboard, 
  IconPackage, 
  IconAlertTriangle, 
  IconCalculator, 
  IconShoppingCart, 
  IconChartBar, 
  IconCurrencyDollar, 
  IconMessageChatbot 
} from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: IconDashboard, label: 'Дашборд', path: '/' },
  { icon: IconPackage, label: 'Остатки', path: '/inventory' },
  { icon: IconAlertTriangle, label: 'Предупреждения', path: '/alerts' },
  { icon: IconCalculator, label: 'Расчёт закупки', path: '/forecast' },
  { icon: IconShoppingCart, label: 'Что заказать', path: '/reorder' },
  { icon: IconChartBar, label: 'План и бюджет', path: '/planning' },
  { icon: IconCurrencyDollar, label: 'Цены и экономика', path: '/pricing' },
  { icon: IconMessageChatbot, label: 'Чат с ИИ', path: '/chat' },
];

export const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppShell.Navbar p="xs" w={{ base: isOpen ? 280 : 60 }}>
      <ScrollArea>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              href={item.path}
              label={isOpen ? item.label : null}
              leftSection={<item.icon size={20} stroke={1.5} />}
              active={isActive}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
              }}
              variant={isActive ? 'light' : 'subtle'}
              py="sm"
            />
          );
        })}
      </ScrollArea>
    </AppShell.Navbar>
  );
};
