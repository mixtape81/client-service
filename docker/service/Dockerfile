FROM node:8

WORKDIR /app

ADD server ./server
ADD database ./database

COPY package.json package-lock.json ./
COPY .babelrc ./

RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]
