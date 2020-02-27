FROM node:12-buster
WORKDIR /user/src/app

COPY . .
RUN npm install

EXPOSE 3000
CMD [ "npm", "run", "start:watch" ]
