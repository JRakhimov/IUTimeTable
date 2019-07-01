# IUTimeTable Bot

### First things first...

You will need to generate a Telegram bot API key and that it's easy, just follow [this](https://core.telegram.org/bots#3-how-do-i-create-a-bot) step-by-step. Also you need to create Firebase project.

## Installing

Now it is a good time to create your environment variables file to save the API keys that was granted to you by BotFather Firebase Database credentials. To create the file just run still at the root project folder:

```bash
touch .env
```

Once the file is created, just open it and past the following environment variables with their respective values that you own, just remember that those keys are related to you and must not be shared with anyone else, remember to always have this file in your .gitignore so that way you do not push it accidentally. Your .env file must be something like this:

```js
BOT_TOKEN = '';
BOT_USERNAME = '';
IS_NOW = ''; // (Boolean) is for now.sh

API_URL = ''; // cd ../api

// Firebase credentials
PRIVATE_KEY = '';
PRIVATE_KEY_ID = '';
PROJECT_ID = '';
CLIENT_EMAIL = '';
CLIENT_ID = '';
CLIENT_CERT_URL = '';
```

## Running

For development, you don't need webhook, just run this in your terminal:

```bash
npm install

npm run dev
```

For production, you should specify webhook url in .env file (look for property: `HOST`) and then:

```bash
npm install

npm run start
```

All of your bot's requests will be logged in your terminal.
