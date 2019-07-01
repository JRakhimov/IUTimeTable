FROM node:11.15-alpine

# Project folder
ARG APP_DIR=app
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

RUN npm install babel-cli@6.10.1 -g --save

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
