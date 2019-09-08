import { Logger } from "../../utils";

export const authCheck = async (ctx, next) => {
  const log = Logger("AuthCheck");

  const isCallbackQuery = ctx.updateType === "callback_query";

  if (!isCallbackQuery) {
    const isExceptionText = ctx.message.text === "👥 Developers" || ctx.message.text === "🎫 Log In";

    if (isExceptionText) {
      return next();
    }
  }

  const { jwt, studentData } = ctx.session;

  if (jwt && studentData) {
    return next();
  }

  if (isCallbackQuery) {
    ctx.answerCbQuery("Login required 👮‍♂️");
  }

  const messageText = "We have detected that you are not logged in with Your StudentID, please log in with command => 🎫 Log In";

  return ctx.methods.replyWithLogInKeyboard(ctx, messageText);
};
