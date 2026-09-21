import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Базовый axios инстанс для всех API запросов
 * - Централизованная обработка ошибок
 * - Автоматическое добавление базового URL
 * - Интерцепторы для логирования и обработки ответов
 */
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 секунд таймаут для долгих запросов
});

// Интерцептор запроса - можно добавлять токены, заголовки объектов и т.д.
apiClient.interceptors.request.use(
  (config) => {
    // Здесь можно добавить заголовок с текущим выбранным объектом (MS-01, MS-02)
    // Например: config.headers['X-Spa-Object'] = currentObjectId;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор ответа - централизованная обработка ошибок
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Обработка различных типов ошибок
    let errorMessage = 'Произошла неизвестная ошибка';
    
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Превышено время ожидания ответа от сервера';
    } else if (error.response) {
      // Сервер ответил с ошибкой
      const status = error.response.status;
      
      switch (status) {
        case 400:
          errorMessage = 'Некорректный запрос. Проверьте введенные данные.';
          break;
        case 401:
          errorMessage = 'Требуется авторизация';
          break;
        case 403:
          errorMessage = 'Доступ запрещен';
          break;
        case 404:
          errorMessage = 'Ресурс не найден';
          break;
        case 500:
          errorMessage = 'Ошибка сервера. Попробуйте позже.';
          break;
        default:
          errorMessage = error.response.data?.message || `Ошибка ${status}`;
      }
    } else if (error.request) {
      // Запрос был отправлен, но ответа нет (сеть offline)
      errorMessage = 'Нет соединения с сервером. Проверьте подключение к сети.';
    }
    
    // Добавляем понятное сообщение об ошибке в объект ошибки
    error.userMessage = errorMessage;
    
    // Логируем ошибку для отладки (в продакшене можно отправить в мониторинг)
    console.error('[API Error]', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: errorMessage,
    });
    
    return Promise.reject(error);
  }
);

/**
 * Универсальный метод для GET запросов
 * @param {string} url - Эндпоинт
 * @param {object} params - Query параметры
 * @returns {Promise} - Ответ от API
 */
export const get = (url, params = {}) => {
  return apiClient.get(url, { params });
};

/**
 * Универсальный метод для POST запросов
 * @param {string} url - Эндпоинт
 * @param {object} data - Тело запроса
 * @returns {Promise} - Ответ от API
 */
export const post = (url, data = {}) => {
  return apiClient.post(url, data);
};

/**
 * Универсальный метод для PUT запросов
 * @param {string} url - Эндпоинт
 * @param {object} data - Тело запроса
 * @returns {Promise} - Ответ от API
 */
export const put = (url, data = {}) => {
  return apiClient.put(url, data);
};

/**
 * Универсальный метод для DELETE запросов
 * @param {string} url - Эндпоинт
 * @returns {Promise} - Ответ от API
 */
export const del = (url) => {
  return apiClient.delete(url);
};

export default apiClient;
