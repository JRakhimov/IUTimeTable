export const profileHandler = (ctx) => {
  const { fullName, groupName, stage, studentID } = ctx.session.studentData;

  let messageText = "👨 <b>Your profile</b>  👩\n";

  messageText += `<b>Name: </b> ${fullName}\n`;
  messageText += `<b>StudentID: </b> ${studentID}\n`;
  messageText += `<b>Group: </b> ${groupName}\n`;
  messageText += `<b>Stage: </b> ${stage}`;

  return ctx.replyWithHTML(messageText);
};
