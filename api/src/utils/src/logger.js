import appRoot from "app-root-path";
import log4js from "log4js";

log4js.configure({
  appenders: {
    logger: {
      type: "file",
      maxLogSize: 10 * 1024 * 1024, // = 10Mb
      filename: `${appRoot}/logs/app.log`,
      compress: true,
      encoding: "utf-8",
      mode: 0o0640
    },

    out: {
      type: "stdout"
    }
  },

  categories: {
    default: { appenders: [ "logger", "out" ], level: "trace" }
  }
});

export default (prefix) => log4js.getLogger(prefix);
