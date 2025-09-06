# 🤖 Настройка Telegram Bot для GRITHER

## Шаг 1: Создание бота

1. Откройте Telegram и найдите [@BotFather](https://t.me/BotFather)
2. Отправьте команду `/newbot`
3. Введите имя бота: `GRITHER Game Bot`
4. Введите username бота: `grither_game_bot` (или другой доступный)
5. Сохраните полученный **Bot Token** - он понадобится для API

## Шаг 2: Настройка Web App

После деплоя на Vercel/Netlify:

```
/setmenubutton
@grither_game_bot
🎮 Открыть GRITHER
https://your-domain.vercel.app
```

## Шаг 3: Настройка команд бота

```
/setcommands
@grither_game_bot

start - 🚀 Запустить GRITHER
game - 🎮 Открыть игру  
profile - 👤 Мой профиль
help - ❓ Помощь
```

## Шаг 4: Настройка описания

```
/setdescription
@grither_game_bot

🎮 GRITHER - игровое приложение с системой достижений, баттлов и лидерборда. 

Соревнуйтесь с коллегами, выполняйте задачи, открывайте кейсы и покупайте награды!

⚔️ Баттлы с коллегами
🏆 Система достижений  
📋 Выполнение задач
🛍️ Магазин наград
📦 Кейсы с призами
```

## Шаг 5: Настройка короткого описания

```
/setabouttext
@grither_game_bot

Игровое приложение с достижениями и баттлами
```

## Шаг 6: Настройка изображения бота

Загрузите логотип GRITHER как аватар бота:
```
/setuserpic
@grither_game_bot
```

## Шаг 7: Базовый код бота (Node.js)

Создайте простой бот для обработки команд:

```javascript
const TelegramBot = require('node-telegram-bot-api');

const token = 'YOUR_BOT_TOKEN';
const webAppUrl = 'https://your-domain.vercel.app';

const bot = new TelegramBot(token, { polling: true });

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🎮 Открыть GRITHER', web_app: { url: webAppUrl } }]
      ]
    }
  };
  
  bot.sendMessage(chatId, 
    '🎮 Добро пожаловать в GRITHER!\n\n' +
    'Игровое приложение с системой достижений, баттлов и наград.\n\n' +
    'Нажмите кнопку ниже, чтобы начать игру!', 
    opts
  );
});

// Команда /game
bot.onText(/\/game/, (msg) => {
  const chatId = msg.chat.id;
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🎮 Открыть игру', web_app: { url: webAppUrl } }]
      ]
    }
  };
  
  bot.sendMessage(chatId, '🎮 Открыть GRITHER:', opts);
});

// Команда /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId,
    '❓ *Помощь по GRITHER*\n\n' +
    '🎮 `/game` - Открыть игру\n' +
    '👤 `/profile` - Мой профиль\n' +
    '🏆 `/stats` - Статистика\n\n' +
    '*Возможности:*\n' +
    '⚔️ Баттлы с другими игроками\n' +
    '🏆 Система достижений\n' +
    '📋 Выполнение задач\n' +
    '🛍️ Магазин наград\n' +
    '📦 Открытие кейсов\n' +
    '📊 Лидерборд\n\n' +
    'Для начала игры нажмите /game',
    { parse_mode: 'Markdown' }
  );
});

console.log('🤖 GRITHER Bot запущен...');
```

## Шаг 8: Переменные окружения

Для backend API добавьте:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_WEBHOOK_URL=https://your-api.com/webhook
WEB_APP_URL=https://your-domain.vercel.app
DATABASE_URL=your_database_url
```

## Шаг 9: Webhook для уведомлений

```javascript
// Отправка уведомления в Telegram
async function sendTelegramNotification(userId, message) {
  try {
    await bot.sendMessage(userId, message, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🎮 Открыть GRITHER', web_app: { url: webAppUrl } }]
        ]
      }
    });
  } catch (error) {
    console.error('Ошибка отправки уведомления:', error);
  }
}

// Примеры уведомлений
sendTelegramNotification(userId, '🏆 Новое достижение разблокировано!');
sendTelegramNotification(userId, '⚔️ Вас вызывают на баттл!');
sendTelegramNotification(userId, '📋 Новая задача назначена');
```

## Шаг 10: Тестирование

1. Найдите своего бота в Telegram
2. Отправьте `/start`
3. Нажмите кнопку "Открыть GRITHER"
4. Проверьте, что приложение открывается корректно
5. Проверьте получение данных пользователя

## Полезные команды BotFather

- `/mybots` - Управление ботами
- `/setname` - Изменить имя бота
- `/setdescription` - Изменить описание
- `/setabouttext` - Короткое описание
- `/setuserpic` - Установить аватар
- `/setcommands` - Настроить команды
- `/deletebot` - Удалить бота

## Следующие шаги

После настройки бота:

1. **Деплой приложения** на Vercel/Netlify
2. **Создание Backend API** для работы с данными
3. **Настройка базы данных** (PostgreSQL/Supabase)
4. **Интеграция с Telegram Bot API**
5. **Настройка CI/CD** для автоматического деплоя

Когда будет готов URL приложения, обновите Web App URL в настройках бота!