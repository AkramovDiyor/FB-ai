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
  (error) => Promise.reject(error)
);

// Интерцептор ответа - централизованная обработка ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Сервер вернул ошибку
      console.error('API Error:', error.response.status, error.response.data);
      
      // Специфичные обработки по кодам
      switch (error.response.status) {
        case 404:
          throw new Error('Ресурс не найден');
        case 500:
          throw new Error('Ошибка сервера. Попробуйте позже.');
        case 400:
          throw new Error(error.response.data?.detail || 'Некорректный запрос');
        default:
          throw new Error(error.response.data?.detail || 'Произошла ошибка при запросе');
      }
    } else if (error.request) {
      // Запрос ушел, но ответа нет (сеть)
      console.error('Network Error:', error.request);
      throw new Error('Ошибка сети. Проверьте подключение к интернету.');
    } else {
      // Ошибка до отправки запроса
      console.error('Request Error:', error.message);
      throw new Error(error.message || 'Произошла неизвестная ошибка');
    }
  }
);

export default apiClient;
