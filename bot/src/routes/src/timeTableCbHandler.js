import Router from "telegraf/router";

const timeTableCbHandler = new Router((ctx) => {
  const { callbackQuery } = ctx;

  if (!callbackQuery.data) {
    return;
  }

  let [ route, dayCode ] = callbackQuery.data.split(":");

  let state = {
    dayCode: Number(dayCode),
    dayName: ctx.constants.DAYS.properties[dayCode]
  };

  return {
    route,
    state
  };
});

timeTableCbHandler.on("day", async (ctx) => {
  const { dayName } = ctx.state;
  const { studentData, jwt } = ctx.session;

  ctx.answerCbQuery(`${dayName} 📅`);

  const { data } = await ctx.requests.getTimeTable(studentData.groupName, jwt);

  if (data.status) {
    if (data.timetable[dayName] && data.timetable[dayName].length) {
      const timetable = data.timetable[dayName];
      const timeTableText = ctx.formaters.timeTableText(timetable);
      const messageText = `<b>Here is your schedule for ${dayName}:</b>\n${timeTableText}`;

      return ctx.methods.editWithTimeTableButtons(ctx, messageText);
    }

    const messageText = "On this day you don't have any lessons! 🥳";

    return ctx.methods.editWithTimeTableButtons(ctx, messageText);
  }
});

export { timeTableCbHandler };
