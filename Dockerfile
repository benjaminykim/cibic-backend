FROM node:12-buster
WORKDIR /app

COPY . /app
RUN npm install

EXPOSE 3000
CMD [ "npm", "run", "start:dev" ]
