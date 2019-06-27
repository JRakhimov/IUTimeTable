export const groupHandler = async (ctx) => {
  const { studentData, jwt } = ctx.session;

  const { data } = await ctx.requests.getGroupStudents(studentData.groupName, jwt);

  if (data.status) {
    const groupmatesText = ctx.formaters.groupmatesText(data.group, studentData.groupName);

    return ctx.replyWithHTML(groupmatesText);
  }

  return ctx.reply(data.message);
};
