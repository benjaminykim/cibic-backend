FROM node:12.16.1-alpine
WORKDIR /app
COPY ./app/package.* .
RUN npm install
COPY ./PostgresDriver.js ./node_modules/typeorm/driver/postgres/PostgresDriver.js
ENTRYPOINT [ "npm", "run" ]
