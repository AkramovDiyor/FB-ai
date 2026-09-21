import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Создаем базовый axios инстанс
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор запроса - добавляем текущий объект если есть в localStorage
apiClient.interceptors.request.use(
  (config) => {
    const currentObject = localStorage.getItem('selectedObject');
    if (currentObject) {
      config.headers['X-Object-Id'] = currentObject;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор ответа - централизованная обработка ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Обработка ошибок сети
    if (!error.response) {
      console.error('Network error:', error.message);
      throw new Error('Нет соединения с сервером. Проверьте подключение к API.');
    }

    // Обработка HTTP ошибок
    const status = error.response.status;
    
    if (status === 401) {
      console.error('Unauthorized access');
      // Можно добавить редирект на логин или обновление токена
    } else if (status === 403) {
      console.error('Forbidden access');
    } else if (status === 404) {
      console.error('Resource not found');
    } else if (status >= 500) {
      console.error('Server error:', status);
      throw new Error(`Ошибка сервера: ${status}. Попробуйте позже.`);
    }

    // Возвращаем структурированную ошибку
    const errorMessage = error.response.data?.message || error.response.data?.error || 'Произошла неизвестная ошибка';
    const structuredError = {
      status,
      message: errorMessage,
      data: error.response.data,
      originalError: error,
    };
    
    return Promise.reject(structuredError);
  }
);

// Экспортируем методы для удобного использования
export const api = {
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  patch: (url, data, config) => apiClient.patch(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),
};

export default apiClient;
