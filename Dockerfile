FROM node:20-slim

WORKDIR /bot

COPY package.json .
COPY dist ./dist
COPY config.json .
COPY .env .

RUN npm install

CMD ["node", "dist/deploy-commands", "&&", "node", "."]