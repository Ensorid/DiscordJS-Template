FROM node:20-slim

WORKDIR /bot

COPY package.json .
COPY dist ./dist
COPY config.json .

RUN npm install

CMD ["npm", "run", "start"]