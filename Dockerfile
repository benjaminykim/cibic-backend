FROM node:12.16.1-alpine
WORKDIR /app

COPY . /app
RUN apk add git && npm install

EXPOSE 3000
CMD [ "npm", "run", "start:dev" ]
