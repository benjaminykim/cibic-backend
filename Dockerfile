FROM node:12.16.1-alpine
WORKDIR /app

COPY . /app
RUN if [ "$DEPLOY_ENV" = "testing" ]; \
	then	apt install git; \
		    npm install -g jest; \
	fi; \
	npm install

EXPOSE 3000
CMD [ "npm", "run", "start:dev" ]
