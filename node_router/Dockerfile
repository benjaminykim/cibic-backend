FROM node:12-buster
WORKDIR /srv

COPY . /srv
RUN npm install

EXPOSE 443
CMD [ "node", "server.js"]
