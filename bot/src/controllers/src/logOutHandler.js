export const logOutHandler = async (ctx) => {
  await ctx.methods.replyWithLogInKeyboard(
    ctx,
    `Logging out from <b>${ctx.session.studentData.fullName}...</b>`
  );

  ctx.session.jwt = null;
  ctx.session.studentData = null;
};
