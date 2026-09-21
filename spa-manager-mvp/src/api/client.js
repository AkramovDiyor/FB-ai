import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Создаем базовый инстанс axios
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор запроса - добавляем текущий объект если он есть
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

// Интерцептор ответа - обработка ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Сервер вернул ошибку
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Запрос был отправлен, но нет ответа
      console.error('Network Error:', error.message);
    } else {
      // Другая ошибка
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
