export const startHandler = (ctx) => {
  const { studentData } = ctx.session;

  const messageText = `You are logged in as <b>${studentData.fullName}</b> ✨`;

  ctx.methods.replyWithMainMenuKeyboard(ctx, messageText);
};
