# ConstructorBot

## Installation

### First things first...

You will need to generate a Telegram bot API key and that it's easy, just follow [this](https://core.telegram.org/bots#3-how-do-i-create-a-bot) step-by-step.

### Now the environment part...

Install npm and Node.js on your machine, open a terminal then navigate to the folder where you want your project to be, then run this command:

```bash
git clone https://github.com/JRakhimov/BotConstructor.git
```

You should see something like this:

```bash
Cloning into 'BotConstructor'...
remote: Counting objects: 17, done.
remote: Compressing objects: 100% (15/15), done.
remote: Total 17 (delta 3), reused 12 (delta 2), pack-reused 0
Unpacking objects: 100% (17/17), done.
```

## Installing

Now it is a good time to create your environment variables file to save the API keys that was granted to you by BotFather . To create the file just run still at the root project folder:

```bash
touch .env
```

Once the file is created, just open it and past the following environment variables with their respective values that you own, just remember that those keys are related to you and must not be shared with anyone else, remember to always have this file in your .gitignore so that way you do not push it accidentally. Your .env file must be something like this:

```js
ENV = 'dev'; // or "prod"
DEBUG = 'Express,Bot:*'; // what we want to debug
```

### P.S. Note that all the bot configuration constants are in the config.js file!

## Running

For development, you don't need webhook, just run this in your terminal:

```bash
npm install

npm run dev
```

For production, you should specify webhook url in config.js file in `prodConfig` (look for property: `hostURL`) and then:

```bash
npm install

npm run start
```

All of your bot's requests will be logged in your terminal.
