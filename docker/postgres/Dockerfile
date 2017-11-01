FROM node:8

WORKDIR /app

ADD database ./database

COPY package.json package-lock.json ./
COPY .babelrc ./

RUN npm install

EXPOSE 1337
