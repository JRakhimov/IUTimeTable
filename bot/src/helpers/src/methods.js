import Markup from "telegraf/markup";
import Extra from "telegraf/extra";

export const methods = {
  directReply(ctx, messageText) {
    const { message_id: messageID } = ctx.update.message;
    const extra = Extra.HTML().inReplyTo(messageID);

    return ctx.telegram.sendMessage(ctx.chat.id, messageText, extra);
  },

  removeMarkup(ctx, messageID) {
    return ctx.telegram.editMessageReplyMarkup(ctx.from.id, messageID, messageID, {}).catch();
  },

  replyWithMainMenuKeyboard(ctx, messageText) {
    const markup = Markup.keyboard([
      [ "📅 TimeTable" ],
      [ "👨‍👩‍👧‍👦 My Friends", "👨‍👧‍👦 My Group" ],
      [ "👥 Developers", "📬 Subscribe" ],
      [ "🤓 Profile", "😿 Log Out" ]
    ]).resize();

    return ctx.reply(messageText, Extra.HTML().markup(markup));
  },

  replyWithLogInKeyboard(ctx, messageText) {
    const markup = Markup.keyboard([ [ "🎫 Log In" ], [ "👥 Developers" ] ])
      .oneTime()
      .resize();

    return ctx.reply(messageText, Extra.HTML().markup(markup));
  },

  replyWithCancelButton(ctx, messageText) {
    const markup = Markup.inlineKeyboard([ Markup.callbackButton("Cancel 🏃", "cancel:") ]);

    return ctx.reply(messageText, Extra.HTML().markup(markup));
  },

  editWithCancelButton(ctx, messageText) {
    const markup = Markup.inlineKeyboard([ Markup.callbackButton("Cancel 🏃", "cancel:") ]);

    return ctx.editMessageText(messageText, Extra.HTML().markup(markup));
  },

  replyWithConfirmButtons(ctx, messageText) {
    const markup = Markup.inlineKeyboard([
      Markup.callbackButton("Yep! 😎", "confirm:"),
      Markup.callbackButton("Cancel 🏃", "cancel:")
    ]);

    return ctx.reply(messageText, Extra.HTML().markup(markup));
  },

  replyWithTimeTableButtons(ctx, messageText) {
    const markup = Markup.inlineKeyboard([
      [ Markup.callbackButton("Monday ☹️", "day:1"), Markup.callbackButton("Tuesday 🙁", "day:2") ],
      [ Markup.callbackButton("Wednesday 😌", "day:3"), Markup.callbackButton("Thursday 🙂", "day:4") ],
      [ Markup.callbackButton("Friday 😃", "day:5") ],
      [ Markup.urlButton("Web App 🖥📲", "https://iutimetable.netlify.com") ]
    ]);

    return ctx.reply(messageText, Extra.HTML().markup(markup));
  },

  editWithTimeTableButtons(ctx, messageText) {
    const markup = Markup.inlineKeyboard([
      [ Markup.callbackButton("Monday ☹️", "day:1"), Markup.callbackButton("Tuesday 🙁", "day:2") ],
      [ Markup.callbackButton("Wednesday 😌", "day:3"), Markup.callbackButton("Thursday 🙂", "day:4") ],
      [ Markup.callbackButton("Friday 😃", "day:5") ],
      [ Markup.urlButton("Web App 🖥📲", "https://iutimetable.netlify.com") ]
    ]);

    return ctx.editMessageText(messageText, Extra.HTML().markup(markup)).catch();
  }
};
