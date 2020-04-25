FROM node:12.16.1-alpine
WORKDIR /app
ARG DEPLOY_ENV
COPY . /app
RUN if [ ! $DEPLOY_ENV = 'production' ]; then apk add git; npm install -g jest; fi; npm install
EXPOSE 3000
ENTRYPOINT [ "npm", "run" ]
