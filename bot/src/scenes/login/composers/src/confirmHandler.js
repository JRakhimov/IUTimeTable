import Composer from "telegraf/composer";

const confirmHandler = new Composer();

confirmHandler.action("confirm:", async (ctx) => {
  let QueryMessageID = ctx.callbackQuery.message.message_id;

  const { studentID, password } = ctx.scene.session;

  const { data } = await ctx.requests.studentAuth(studentID, password);

  if (data.status) {
    ctx.answerCbQuery("StudentID and Password confirmed😎");

    const studentData = {
      ...data.student,
      stage: ctx.formaters.getStage(data.student.studentID),
      fullName: ctx.formaters.formatName(data.student.fullName)
    };

    const messageText = `Logged in as <b>${studentData.fullName}</b> 🥳`;

    ctx.session.jwt = data.jwt;
    ctx.session.studentData = studentData;

    await ctx.deleteMessage(QueryMessageID);
    await ctx.methods.replyWithMainMenuKeyboard(ctx, messageText);

    return ctx.scene.leave();
  }

  ctx.answerCbQuery("Error 🤨");
  await ctx.editMessageText("Make sure that you entered the right password!");

  return ctx.scene.reenter();
});

export { confirmHandler };
