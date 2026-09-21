import { NavLink } from '@mantine/core';
import { 
  IconDashboard, 
  IconPackage, 
  IconAlertTriangle, 
  IconCalculator,
  IconShoppingCart,
  IconChartBar,
  IconTag,
  IconMessageChatbot
} from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { label: 'Дашборд', icon: IconDashboard, path: '/' },
  { label: 'Остатки', icon: IconPackage, path: '/inventory' },
  { label: 'Предупреждения', icon: IconAlertTriangle, path: '/alerts' },
  { label: 'Расчёт закупки', icon: IconCalculator, path: '/forecast' },
  { label: 'Что заказать', icon: IconShoppingCart, path: '/reorder' },
  { label: 'План и бюджет', icon: IconChartBar, path: '/planning' },
  { label: 'Цены и экономика', icon: IconTag, path: '/pricing' },
  { label: 'Чат с ИИ', icon: IconMessageChatbot, path: '/chat' },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav style={{ padding: '1rem' }}>
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          href={item.path}
          label={item.label}
          leftSection={<item.icon size={18} />}
          active={location.pathname === item.path}
          onClick={(e) => {
            e.preventDefault();
            navigate(item.path);
          }}
          style={{ marginBottom: '4px' }}
        />
      ))}
    </nav>
  );
};

export default Sidebar;
