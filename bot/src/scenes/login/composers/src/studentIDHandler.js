import Composer from "telegraf/composer";

const studentIDHandler = new Composer();

studentIDHandler.hears(/U\d\d\d\d\d\d\d/gi, async (ctx) => {
  let [ studentID ] = ctx.match;

  if (studentID.length !== 8) {
    return;
  }

  ctx.scene.session.studentID = studentID;

  ctx.methods.removeMarkup(ctx, ctx.scene.state.messageID);

  const messageText = "Now send me your eClass password:";

  const { message_id: messageID } = await ctx.methods.replyWithCancelButton(ctx, messageText);

  ctx.scene.state.messageID = messageID;

  return ctx.wizard.next();
});

studentIDHandler.on("text", (ctx) => {
  ctx.methods.reply(ctx, "Make sure that you sent your id in this form: U*******");
});

studentIDHandler.on("message", (ctx) => {
  ctx.methods.reply(ctx, "Make sure that you sent a text!");
});

export { studentIDHandler };
