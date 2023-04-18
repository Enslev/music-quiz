FROM node:14.21-alpine

WORKDIR /srv/app/music-quiz-server

COPY package*.json ./

RUN npm install

COPY . /srv/app/music-quiz-server

CMD ["npm", "run", "dev"]