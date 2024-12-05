FROM node:20

WORKDIR /bot

COPY package.json .
COPY dist ./dist
COPY config.json .
COPY .env .

RUN npm install

CMD ["npm", "run", "start"]
