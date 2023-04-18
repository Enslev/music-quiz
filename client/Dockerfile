FROM node:14.21-alpine

WORKDIR /srv/app/music-quiz-client

COPY package*.json ./

RUN npm install

COPY . /srv/app/music-quiz-client

CMD ["npm", "start"]