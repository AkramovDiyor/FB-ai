// Meta endpoints
export const META = '/api/meta';

// Dashboard
export const DASHBOARD = '/api/dashboard';

// Stock & Products
export const STOCK = '/api/stock';
export const PRODUCT = (sku) => `/api/products/${sku}`;
export const BATCHES = '/api/batches';
export const MOVEMENTS = '/api/movements';

// Alerts
export const ALERTS = '/api/alerts';

// Forecast
export const FORECAST = '/api/forecast';

// Reorder list
export const REORDER_LIST = '/api/reorder-list';

// Planning & Budget
export const PURCHASE_PLAN = '/api/purchase-plan';
export const BUDGET = '/api/budget';

// Pricing & Economics
export const PRICE_DYNAMICS = '/api/price-dynamics';
export const SERVICE_COST = (serviceId) => `/api/service-cost/${serviceId}`;
export const SERVICE_COST_SIMULATE = '/api/service-cost/simulate';

// Chat
export const CHAT = '/api/chat';
export const CHAT_EXAMPLES = '/api/chat/examples';
export const CHAT_HISTORY = '/api/chat';
