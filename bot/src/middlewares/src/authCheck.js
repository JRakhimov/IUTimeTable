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
    const { data } = await ctx.requests.getStudentInfo(studentData.studentID, jwt);

    if (data.status) {
      const newStudentData = {
        ...data.student,
        stage: ctx.formaters.getStage(data.student.studentID),
        fullName: ctx.formaters.formatName(data.student.fullName)
      };

      ctx.session.studentData = newStudentData;
      return next();
    }
  }

  if (isCallbackQuery) {
    ctx.answerCbQuery("Login required 👮‍♂️");
  }

  const messageText = "We have detected that you are not logged in with Your StudentID, please log in with command => 🎫 Log In";

  return ctx.methods.replyWithLogInKeyboard(ctx, messageText);
};
