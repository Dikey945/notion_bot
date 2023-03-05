import TelegramApi from 'node-telegram-bot-api'
import { ExpensesData } from "./types/ExpensesData";
import {expensesAPI} from "./expensesAPI";
import { Telegraf } from 'telegraf';

const BOT_API_TOKEN = '5821012315:AAElq5rg_H1RYqS-gGvFykQJrYdmcOJxdZY';
export const bot = new TelegramApi(BOT_API_TOKEN, { polling: true });

const menuOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: 'Enter expenses', callback_data: 'expenses' }, { text: 'Enter income', callback_data: 'income' }],
      [{text: 'Нє, всьо покашо', callback_data: 'cancel'}]
    ]
  })
}

const forcedReply = {
  reply_markup: JSON.stringify({
    force_reply: true
  })
}

const categories = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: 'Food', callback_data: 'food' }, { text: 'Home', callback_data: 'home' }],
      [{ text: 'Entertainment', callback_data: 'entertainment' }, { text: 'Transport', callback_data: 'transport' }],
      [{ text: 'Clothes', callback_data: 'clothes' }],
    ]
  })
}


bot.setMyCommands([
  { command: '/start', description: 'Start bot' },
  { command: '/info', description: 'Get info' },
  { command: '/menu', description: 'Get menu' },
])

bot.on('message', async (msg) => {
  const text = await msg.text;
  const chatId = msg.chat.id;
  if(text === '/menu' || text === '/start') {
    bot.sendMessage(chatId, `Choose an option`, menuOptions as any)
  }
})

const botMenuReply = async (query: TelegramApi.CallbackQuery) => {
  try {
    const data = await query.data;
    const chatId = query.message!.chat.id;
    const messageId = query.message!.message_id;
    let expensesData: ExpensesData = {
      name: '',
      date: new Date(),
      amount: 0,
      category: 'food'
    };
    if(data === 'expenses') {
      await expensesAPI(chatId, forcedReply, expensesData, menuOptions, categories)
    } else if(data === 'income') {
      console.log('income')
    } else if(data === 'cancel') {
      const onCancelMessage = async () => {
        await bot.sendMessage(chatId, 'Давай котик, дєнєжку треба заробляти');
        // Remove event listeners
        bot.removeListener('message', onCancelMessage);
      }
      const replyMarkupOptions = {
        chat_id: chatId,
        message_id: messageId
      }
      await bot.editMessageReplyMarkup(
        {inline_keyboard: [],},
        replyMarkupOptions as any
      );

      onCancelMessage();
    }
  } catch (e) {
    console.log(e)
  }
}


bot.on('callback_query', async (query) => {
  try {
    await botMenuReply(query);
  } catch (e) {
    console.log(e)
  }

})

