# 🚀 Команды для деплоя GRITHER

## Быстрый деплой на Vercel (рекомендуется)

```bash
# 1. Установка Vercel CLI
npm install -g vercel

# 2. Логин в Vercel
vercel login

# 3. Деплой (из корневой папки проекта)
vercel --prod

# 4. После деплоя получите URL вида: https://grither-app-xxx.vercel.app
```

## Деплой на Netlify

```bash
# 1. Сборка проекта
npm run build

# 2. Установка Netlify CLI (опционально)
npm install -g netlify-cli

# 3. Логин в Netlify
netlify login

# 4. Деплой
netlify deploy --prod --dir=dist

# Или просто перетащите папку dist/ на https://netlify.com/drop
```

## Подготовка проекта

```bash
# Установка зависимостей
npm install

# Проверка сборки
npm run build

# Локальный preview
npm run preview
```

## После деплоя

1. **Скопируйте URL** вашего приложения
2. **Настройте Telegram Bot** (см. telegram-bot-setup.md)
3. **Обновите Web App URL** в @BotFather
4. **Протестируйте** в Telegram

## Автоматический деплой через Git

### Vercel (автоматически деплоит из GitHub)

1. Подключите репозиторий на vercel.com
2. При каждом push в main будет автоматический деплой

### Netlify (автоматически деплоит из GitHub)

1. Подключите репозиторий на netlify.com  
2. Настройки сборки уже в netlify.toml

## Проверка перед деплоем

```bash
# Проверка типов TypeScript
npm run type-check

# Проверка линтера
npm run lint

# Тест сборки
npm run build && npm run preview
```

## Переменные окружения для production

Создайте в Vercel/Netlify:

```env
NODE_ENV=production
VITE_API_URL=https://your-api.com
VITE_TELEGRAM_BOT_USERNAME=grither_game_bot
```

## Мониторинг после деплоя

- **Vercel Analytics**: Автоматически включается
- **Vercel Speed Insights**: Для отслеживания производительности
- **Sentry**: Для отслеживания ошибок (опционально)

## Обновление приложения

```bash
# 1. Внесите изменения в код
# 2. Commit и push
git add .
git commit -m "Update features"
git push origin main

# 3. Автоматический редеплой (если настроен CI/CD)
# Или ручной редеплой:
vercel --prod
```

## Готовые команды для настройки Telegram Bot

После получения URL замените YOUR_DOMAIN:

```
/setmenubutton
@your_bot_username  
🎮 Открыть GRITHER
https://YOUR_DOMAIN.vercel.app
```

```
/setcommands
@your_bot_username

start - 🚀 Запустить GRITHER
game - 🎮 Открыть игру
profile - 👤 Мой профиль  
help - ❓ Помощь
stats - 📊 Статистика
```

## Troubleshooting

### Ошибка сборки
```bash
# Очистка кэша
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Проблемы с Telegram Web App
- Проверьте HTTPS URL
- Убедитесь что CSP заголовки корректные
- Проверьте console в DevTools Telegram

### Медленная загрузка
- Включите сжатие в настройках хостинга
- Оптимизируйте изображения
- Используйте code splitting

Удачного деплоя! 🚀