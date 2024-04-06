FROM node:20.11.1-alpine

WORKDIR /usr/src/app

COPY package.json .

RUN npm install -g pnpm@8.15.4

RUN pnpm install

COPY . .

RUN pnpm build

CMD ["pnpm", "start"]