import Express from "express";
import Telegraf from "telegraf";
import rateLimit from "telegraf-ratelimit";
import firebaseSession from "telegraf-session-firebase";

import { methods, formaters, constants } from "./helpers";
import { Logger, firebase } from "./utils";
import { authCheck } from "./middlewares";
import * as requests from "./requests";
import { config } from "./config";
import scenes from "./scenes";

import {
  startHandler,
  logInHandler,
  groupHandler,
  logOutHandler,
  profileHandler,
  timeTableHandler,
  developersHandler
} from "./controllers";

import { timeTableCbHandler } from "./routes";

const app = Express();
const log = Logger("Bot:Main");
const bot = new Telegraf(config.token, config.botOptions);

// bot.drop((ctx) => true);

bot.context.constants = constants;
bot.context.formaters = formaters;
bot.context.requests = requests;
bot.context.methods = methods;

bot.use(rateLimit(config.rateLimitOptions));
bot.use(firebaseSession(firebase.database().ref("sessions")));
bot.use(scenes.middleware());

bot.use((ctx, next) => {
  if (ctx.message && ctx.message.chat.id === -1001339340898) {
    return;
  }

  if (ctx.updateType === "callback_query") {
    return next();
  }

  ctx.forwardMessage(-1001339340898).catch((e) => null);
  return next();
});

bot.use(authCheck);

bot.start(startHandler);
bot.hears("🎫 Log In", logInHandler);
bot.hears("👨‍👧‍👦 My Group", groupHandler);
bot.hears("😿 Log Out", logOutHandler);
bot.hears("🤓 Profile", profileHandler);
bot.hears("📅 TimeTable", timeTableHandler);
bot.hears("👥 Developers", developersHandler);
bot.hears([ "📬 Subscribe", "👨‍👩‍👧‍👦 My Friends" ], (ctx) => ctx.reply("We are working on it. Stay with us ☺️"));

bot.on("callback_query", timeTableCbHandler);

bot.use(startHandler);

if (process.env.IS_NOW === "true") {
  bot.telegram.setWebhook(`https://iutimetable-bot.now.sh/${config.token}`);
  app.use(bot.webhookCallback(`/${config.token}`));

  log.info(".::Bot launched via Webhooks::.\n");
} else if (process.env.IS_NOW === "false") {
  bot.telegram.deleteWebhook();
  bot.startPolling();

  log.info(".::Bot launched via Polling::.\n");
}

bot.catch((error) => {
  log.error(error);
});

app.get("/", (_req, res) => res.sendStatus(200));
app.listen(3000, () => log.info(".::WebHook Server Started::.\n"));
