FROM node:12.16.1-alpine
WORKDIR /srv

COPY . /srv
RUN npm install

EXPOSE 443
CMD [ "node", "server.js"]
