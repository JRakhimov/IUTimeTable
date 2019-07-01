# IUTimeTable Web

## Installing

Now it is a good time to create your environment variables file to keep the URL of our API server. To create the file just run still at the root project folder:

```bash
touch .env.local
```

Once the file is created, just open it and past the following environment variables with their respective values that you own, just remember that those keys are related to you and must not be shared with anyone else, remember to always have this file in your .gitignore so that way you do not push it accidentally. Your .env file should contain these variables:

```js
VUE_APP_HOST_URL = '';
```

## Running

For development just run this in your terminal:

```bash
npm install

npm run serve
```

For production:

```bash
npm install

npm run build
```
