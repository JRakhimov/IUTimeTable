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

const bot = new Telegraf(config.token, config.botOptions);
const log = Logger("Bot:Main");

bot.context.constants = constants;
bot.context.formaters = formaters;
bot.context.requests = requests;
bot.context.methods = methods;

bot.use(rateLimit(config.rateLimitOptions));
bot.use(firebaseSession(firebase.database().ref("sessions")));
bot.use(scenes.middleware());
bot.use(authCheck);

bot.start(startHandler);
bot.hears("🎫 Log In", logInHandler);
bot.hears("👨‍👧‍👦 My Group", groupHandler);
bot.hears("😿 Log Out", logOutHandler);
bot.hears("🤓 Profile", profileHandler);
bot.hears("📅 TimeTable", timeTableHandler);
bot.hears("👥 Developers", developersHandler);

bot.on("callback_query", timeTableCbHandler);

bot.use(startHandler);

bot.startPolling();
log.info(".::Bot Started::.");
