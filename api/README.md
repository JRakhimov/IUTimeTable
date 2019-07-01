# IUTimeTable API

### First things first...

Contact main [developer](https://t.me/Rakhimov_J) to get E-Class authorization url and jwt token for it, without these you cannot run the project properly. Also you need to create Firebase project.

## Installing

Now it is a good time to create your environment variables file to keep the E-Class authorization API variables and Firebase Database credentials. To create the file just run still at the root project folder:

```bash
touch .env
```

Once the file is created, just open it and past the following environment variables with their respective values that you own, just remember that those keys are related to you and must not be shared with anyone else, remember to always have this file in your .gitignore so that way you do not push it accidentally. Your .env file should contain these variables:

```js
PORT = '';
IS_NOW = ''; // (Boolean) is for now.sh

ECLASS_AUTH_URL = '';
ECLASS_AUTH_TOKEN = '';

STUDENT_SALT = '';
ADMIN_SALT = '';

// Firebase credentials
PRIVATE_KEY = '';
PRIVATE_KEY_ID = '';
PROJECT_ID = '';
CLIENT_EMAIL = '';
CLIENT_ID = '';
CLIENT_CERT_URL = '';
```

## Running

For development just run this in your terminal:

```bash
npm install

npm run dev
```

For production:

```bash
npm install

npm run start
```

or

```bash
npm install

npm run build
```

All logs will be logged in your terminal.
