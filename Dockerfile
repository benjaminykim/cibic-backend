FROM node:12.16.1-alpine
WORKDIR /app
COPY ./app/package.* .
RUN npm install
ENTRYPOINT [ "npm", "run" ]
