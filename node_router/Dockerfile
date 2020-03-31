FROM node:12-buster
WORKDIR /app

COPY . /app
RUN npm install

EXPOSE 80
CMD [ "node", "server.js"]
