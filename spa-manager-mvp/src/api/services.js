import apiClient from './client';
import * as endpoints from './endpoints';

// Meta API
export const getMeta = () => apiClient.get(endpoints.META);

// Dashboard API
export const getDashboard = (location) => 
  apiClient.get(endpoints.DASHBOARD, { params: { location } });

// Stock API
export const getStock = (params) => 
  apiClient.get(endpoints.STOCK, { params });

// Product API
export const getProduct = (sku) => 
  apiClient.get(endpoints.PRODUCT(sku));

// Batches API
export const getBatches = (params) => 
  apiClient.get(endpoints.BATCHES, { params });

// Movements API
export const getMovements = (params) => 
  apiClient.get(endpoints.MOVEMENTS, { params });

// Alerts API
export const getAlerts = (params) => 
  apiClient.get(endpoints.ALERTS, { params });

// Forecast API
export const postForecast = (data) => 
  apiClient.post(endpoints.FORECAST, data);

// Reorder List API
export const getReorderList = (params) => 
  apiClient.get(endpoints.REORDER_LIST, { params });

// Purchase Plan API
export const postPurchasePlan = (data) => 
  apiClient.post(endpoints.PURCHASE_PLAN, data);

// Budget API
export const postBudget = (data) => 
  apiClient.post(endpoints.BUDGET, data);

// Price Dynamics API
export const getPriceDynamics = (params) => 
  apiClient.get(endpoints.PRICE_DYNAMICS, { params });

// Service Cost API
export const getServiceCost = (serviceId) => 
  apiClient.get(endpoints.SERVICE_COST(serviceId));

// Service Cost Simulate API
export const postServiceCostSimulate = (data) => 
  apiClient.post(endpoints.SERVICE_COST_SIMULATE, data);

// Chat API
export const postChat = (data) => 
  apiClient.post(endpoints.CHAT, data);

// Chat Examples API
export const getChatExamples = () => 
  apiClient.get(endpoints.CHAT_EXAMPLES);

// Chat History API
export const getChatHistory = () => 
  apiClient.get(endpoints.CHAT_HISTORY);
