import Composer from "telegraf/composer";

const passwordHandler = new Composer();

passwordHandler.on("text", (ctx) => {
  ctx.scene.session.password = ctx.message.text;

  ctx.methods.removeMarkup(ctx, ctx.scene.state.messageID);

  const { studentID, password } = ctx.scene.session;

  let messageText = "<b>Is it right?</b>\n\n";

  messageText += `<b>StudentID:</b> <code>${studentID}</code>\n`;
  messageText += `<b>Password:</b> <code>${password}</code>`;

  ctx.methods.replyWithConfirmButtons(ctx, messageText);

  return ctx.wizard.next();
});

passwordHandler.on("message", (ctx) => {
  ctx.methods.reply(ctx, "Make sure that you sent a text!");
});

export { passwordHandler };
