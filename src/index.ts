const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, againOptions } = require('./options')

const token: string = '6250594115:AAHG7QNpRiTOBjbn2e10J_ACj1-VNsFurio';

const bot = new TelegramApi(token, { polling: true });

interface Chats {
  [key: number]: number;
}

const chats: Chats = {};

const startGame = async (chatId: number): Promise<void> => {
  await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`);
  const randomNumber: number = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадывай 🤔', gameOptions);
};

const start = (): void => {
  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' },
    { command: '/info', description: 'Получить детальную информацию о пользователе' },
    { command: '/game', description: 'Игра угадай цифру' },
  ]);

  bot.on('message', async (msg: any) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://media.npr.org/assets/img/2017/09/12/macaca_nigra_self-portrait-3e0070aa19a7fe36e802253048411a38f14a79f8-s1100-c50.jpg');
      return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот WhoAreYou`);
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут: First name: ${msg.from.first_name},  username: ${msg.from.username}`);
    }
    if (text === '/game') {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!');
  });

  bot.on('callback_query', (msg: any) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
      return startGame(chatId);
    }

    if (data === String(chats[chatId])) {
      return bot.sendMessage(chatId, `Поздравляю, ты угадал цифру ${chats[chatId]}`, againOptions);
    } else {
      return bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions);
    }
  });
};

start();
