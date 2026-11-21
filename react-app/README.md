# react-app

Vite + React-каркас. Скопируйте его в общий репозиторий команды и наращивайте под свой проект: тематику, экраны и данные определяет ваш блюпринт и дизайн-макет.

## Запуск

```
npm i
npm run dev
```

Откроется на `http://localhost:5173`.

## Зависимости

- `react`, `react-dom` — React 19
- `react-router-dom` — маршрутизация
- `zustand` — управление состоянием
- `@consta/uikit` + `@consta/icons` — UI-kit

## Структура

```
src/
  main.jsx        — точка входа, подключает роутер
  App.jsx         — корневой компонент, маршруты и обёртка Theme (Consta)
  pages/          — страницы
  components/     — переиспользуемые компоненты
  store/          — Zustand-хранилища