FROM node:12.16.1-alpine
WORKDIR /app
ARG DEPLOY_ENV
EXPOSE 3000
COPY ./app/package.* /app
RUN if [ ! $DEPLOY_ENV = 'production' ]; then apk add git; npm install -g jest; fi; npm install
ENTRYPOINT [ "npm", "run" ]
