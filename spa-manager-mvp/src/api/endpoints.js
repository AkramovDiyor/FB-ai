// Эндпоинты API
export const endpoints = {
  // Мета данные
  meta: '/api/meta',
  health: '/health',
  
  // Дашборд
  dashboard: '/api/dashboard',
  
  // Склад и товары
  stock: '/api/stock',
  products: (sku) => `/api/products/${sku}`,
  batches: '/api/batches',
  movements: '/api/movements',
  
  // Предупреждения
  alerts: '/api/alerts',
  
  // Прогнозы и закупки
  forecast: '/api/forecast',
  reorderList: '/api/reorder-list',
  purchasePlan: '/api/purchase-plan',
  budget: '/api/budget',
  
  // Цены и экономика
  priceDynamics: '/api/price-dynamics',
  serviceCost: (serviceId) => `/api/service-cost/${serviceId}`,
  serviceCostSimulate: '/api/service-cost/simulate',
  
  // Чат
  chat: '/api/chat',
  chatExamples: '/api/chat/examples',
};

export default endpoints;
