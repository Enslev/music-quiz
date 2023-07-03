FROM node:20-alpine3.17

WORKDIR /srv/app/music-quiz-client

COPY package*.json ./

RUN npm install

COPY . /srv/app/music-quiz-client

CMD ["npm", "start"]