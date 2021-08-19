FROM node:14
WORKDIR /usr/application/kara-api
COPY ./package.json .
RUN npm install --only=prod
