FROM node:20-alpine3.17

WORKDIR /srv/app/music-quiz-server

COPY package*.json ./

RUN npm install

COPY . /srv/app/music-quiz-server

CMD ["npm", "run", "dev"]