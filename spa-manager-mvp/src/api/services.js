import apiClient from './client';
import { endpoints } from './endpoints';

// Мета данные
export const getMeta = () => apiClient.get(endpoints.meta);

// Дашборд
export const getDashboard = (location) => 
  apiClient.get(endpoints.dashboard, { params: { location } });

// Склад и товары
export const getStock = (params) => 
  apiClient.get(endpoints.stock, { params });

export const getProduct = (sku) => 
  apiClient.get(endpoints.products(sku));

export const getBatches = (params) => 
  apiClient.get(endpoints.batches, { params });

export const getMovements = (params) => 
  apiClient.get(endpoints.movements, { params });

// Предупреждения
export const getAlerts = (params) => 
  apiClient.get(endpoints.alerts, { params });

// Прогнозы и закупки
export const postForecast = (data) => 
  apiClient.post(endpoints.forecast, data);

export const getReorderList = (params) => 
  apiClient.get(endpoints.reorderList, { params });

export const postPurchasePlan = (data) => 
  apiClient.post(endpoints.purchasePlan, data);

export const postBudget = (data) => 
  apiClient.post(endpoints.budget, data);

// Цены и экономика
export const getPriceDynamics = (params) => 
  apiClient.get(endpoints.priceDynamics, { params });

export const getServiceCost = (serviceId) => 
  apiClient.get(endpoints.serviceCost(serviceId));

export const postServiceCostSimulate = (data) => 
  apiClient.post(endpoints.serviceCostSimulate, data);

// Чат
export const postChat = (data) => 
  apiClient.post(endpoints.chat, data);

export const getChatHistory = () => 
  apiClient.get(endpoints.chat);

export const getChatExamples = () => 
  apiClient.get(endpoints.chatExamples);
