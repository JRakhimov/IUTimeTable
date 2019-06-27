export const startHandler = (ctx) => {
  const { studentData } = ctx.session;
  const messageText = `You are logged in as ${studentData.fullName} ✨`;

  ctx.methods.replyWithMainMenuKeyboard(ctx, messageText);
};
