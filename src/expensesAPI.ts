import TelegramApi from "node-telegram-bot-api";
import {ExpensesData} from "./types/ExpensesData";
import {notionApi} from "./notionApi";
import {bot} from "./server";

export const expensesAPI = async(
  chatId: number,
  forcedReply: any,
  expensesData: ExpensesData,
  menuOptions: any,
  categories: {reply_markup: string}
  ) => {
  await bot.sendMessage(
    chatId,
    `Що купив, транжира`,
    forcedReply as any);

  const onNameMessage = async (nameMessage: TelegramApi.Message) => {
    expensesData.name = nameMessage.text!;
    const expensesQuestion = await bot.sendMessage(
      chatId,
      `Ну що? Скільки на цей раз?`,
      forcedReply as any
    );

    const onAmountMessage = async (amountMessage: TelegramApi.Message) => {
      expensesData.amount = +amountMessage.text!;
      const categoryQuestion = await bot.sendMessage(
        chatId,
        `Ну і на що ти витратила на цей раз?`,
        categories as any
      );

      const onCategoryQuery = async (categoryQuery: TelegramApi.CallbackQuery) => {
        expensesData.category = categoryQuery.data as ExpensesData['category'];
        await bot.answerCallbackQuery(
          {
            callback_query_id: categoryQuery.id,
            text: `'Я все запам\'ятав транжиро'`
          });

        console.log(expensesData);

        const replyMarkupOptions = {
          chat_id: chatId,
          message_id: categoryQuestion.message_id
        }

        await bot.editMessageReplyMarkup(
          {inline_keyboard: []},
          replyMarkupOptions as any
        );

        await notionApi.updateExpensesDB(expensesData);

        await bot.sendMessage(chatId, 'Я всьо запомнів транжира, чи ти ще щось витратив?', menuOptions as any);
        // Remove event listeners
        bot.removeListener('callback_query', onCategoryQuery);
      };

      bot.on('callback_query', onCategoryQuery);
      // Remove event listeners
      bot.removeListener('message', onAmountMessage);
    };

    bot.on('message', onAmountMessage);
    // Remove event listeners
    bot.removeListener('message', onNameMessage);
  };

  bot.on('message', onNameMessage);
}