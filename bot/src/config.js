export const config = {
  token: process.env.BOT_TOKEN,

  botOptions: {
    username: process.env.BOT_USERNAME,
    telegram: { webhookReply: false },
    retryAfter: 0
  },

  rateLimitOptions: {
    limit: 1500,
    window: 1
  }
};
