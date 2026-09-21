# SPA Manager MVP

ИИ-помощник по складскому учёту и планированию закупок спа-оператора.

## Быстрый старт

### 1. Запуск Mock API (отдельный терминал)

```bash
git clone https://gitverse.ru/kkk_s/moc_api_spa.git
cd moc_api_spa
docker compose up --build
```

Документация API: http://localhost:8000/docs

### 2. Запуск фронтенда

```bash
cd spa-manager-mvp
npm install
npm run dev
```

### 3. Открыть в браузере

http://localhost:5173

## Стек

- React + Vite
- Mantine UI
- Tailwind CSS
- TanStack Query
- Recharts
- Axios

## Структура проекта

```
src/
├── api/           # API клиент, эндпоинты, сервисы
├── components/    # UI компоненты
├── contexts/      # React Context
├── features/      # Бизнес-логика по экранам
├── hooks/         # Кастомные хуки
├── pages/         # Страницы приложения
└── App.jsx        # Точка входа с роутингом
```

## Docker

```bash
docker compose up --build
```

## API Endpoints

- GET /api/meta — метаданные объектов
- GET /api/dashboard — KPI дашборда
- GET /api/stock — остатки склада
- POST /api/forecast — расчёт закупки
- GET /api/reorder-list — список заказов
- POST /api/purchase-plan — план закупок
- POST /api/budget — бюджет
- GET /api/alerts — предупреждения
- POST /api/chat — чат с ИИ
