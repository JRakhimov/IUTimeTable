export const timeTableHandler = async (ctx) => {
  const { dayCode, dayName } = ctx.formaters.getTodayDate();

  if (dayCode === 0 || dayCode === 6) {
    const msgText = "<b>Today is your holiday, Enjoy it! 🥳</b>\nGet timetable for:";

    return ctx.methods.replyWithTimeTableButtons(ctx, msgText);
  }

  const { studentData, jwt } = ctx.session;

  const { data } = await ctx.requests.getTimeTable(studentData.groupName, jwt);

  if (data.status) {
    if (data.timetable[dayName] && data.timetable[dayName].length) {
      const timetable = data.timetable[dayName];
      const timeTableText = ctx.formaters.timeTableText(timetable);
      const messageText = `<b>Here is your schedule for Today:</b>\n${timeTableText}`;

      return ctx.methods.replyWithTimeTableButtons(ctx, messageText);
    }

    const messageText = "You're one of the lucky guys who don't have any lessons today. Enjoy your day off 👻";

    return ctx.methods.replyWithTimeTableButtons(ctx, messageText);
  }
};
