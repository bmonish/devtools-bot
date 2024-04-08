FROM node:20.11.1-alpine

ARG BOT_TOKEN
ENV BOT_TOKEN=$BOT_TOKEN

WORKDIR /usr/src/app

COPY package.json .

RUN npm install -g pnpm@8.15.4

RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]