# SPA Manager MVP

Веб-приложение для управления спа-объектом.

## Быстрый старт

```bash
npm install
npm run dev
```

## Запуск через Docker

```bash
docker compose up --build
```

Приложение будет доступно по адресу: http://localhost:5173

## Технологический стек

- **React** (JavaScript) + **Vite**
- **Tailwind CSS** - стилизация
- **Mantine UI** - компоненты интерфейса
- **TanStack React Query** - работа с API
- **Recharts** - графики и диаграммы
- **Axios** - HTTP клиент

## Структура проекта

```
src/
├── api/           # Слой взаимодействия с сервером
├── app/           # Глобальные настройки и провайдеры
├── components/    # Переиспользуемые UI компоненты
├── features/      # Бизнес-логика по экранам
├── hooks/         # Кастомные хуки
└── main.jsx       # Точка входа
```

## Переменные окружения

Создайте файл `.env` в корне проекта:

```
VITE_API_URL=http://localhost:8000/api
```
