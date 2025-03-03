FROM node:20-slim

WORKDIR /bot

COPY package.json .
COPY config.json .
COPY dist ./dist
COPY settings ./settings

RUN npm install

CMD ["npm", "run", "start"]