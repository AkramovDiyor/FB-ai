// Endpoints API для SPA Manager

export const ENDPOINTS = {
  // Дашборд
  dashboard: {
    kpi: '/api/dashboard/kpi',
    alerts: '/api/dashboard/alerts',
    upcomingOrders: '/api/dashboard/upcoming-orders',
  },
  
  // Остатки и инвентарь
  inventory: {
    list: '/api/inventory',
    item: (id) => `/api/inventory/${id}`,
    batches: (id) => `/api/inventory/${id}/batches`,
    movement: (id) => `/api/inventory/${id}/movement`,
  },
  
  // Предупреждения
  alerts: {
    list: '/api/alerts',
    acknowledge: (id) => `/api/alerts/${id}/acknowledge`,
  },
  
  // Расчет закупки
  forecast: {
    calculate: '/api/forecast',
  },
  
  // Что заказать
  reorder: {
    list: '/api/reorder-list',
  },
  
  // План и бюджет
  planning: {
    purchasePlan: '/api/purchase-plan',
    budget: '/api/budget',
  },
  
  // Цены и экономика
  economics: {
    priceDynamics: '/api/price-dynamics',
    serviceCostSimulate: '/api/service-cost/simulate',
  },
  
  // Чат с ИИ
  chat: {
    send: '/api/chat',
  },
};

export default ENDPOINTS;
