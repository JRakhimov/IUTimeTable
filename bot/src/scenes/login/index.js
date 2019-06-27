import WizardScene from "telegraf/scenes/wizard";

import { confirmHandler, passwordHandler, studentIDHandler } from "./composers";

const logInScene = new WizardScene(
  "logInScene",
  async (ctx) => {
    const messageText = "To log in, first of all, please send me your StudentID:";

    // eslint-disable-next-line camelcase
    const { message_id } = await ctx.methods.replyWithCancelButton(ctx, messageText);

    // eslint-disable-next-line camelcase
    ctx.scene.state.messageID = message_id;

    return ctx.wizard.next();
  },
  studentIDHandler,
  passwordHandler,
  confirmHandler
);

logInScene.action("cancel:", (ctx) => {
  ctx.editMessageText("Log in is canceled 🙁");
  ctx.answerCbQuery("Canceled 🙁");
  return ctx.scene.leave();
});

export { logInScene };
