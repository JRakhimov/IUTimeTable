FROM node:11.15-alpine

RUN apk update && apk add python g++ make && rm -rf /var/cache/apk/*

RUN python --version

# Project folder
RUN mkdir -p /app
WORKDIR /app

RUN npm install -g @vue/cli
RUN npm install -g http-server

COPY package*.json ./
RUN npm install

COPY . .

RUN npm rebuild node-sass
RUN npm run docker-build

WORKDIR /app/dist

EXPOSE 8080

CMD ["http-server", "-s"]
