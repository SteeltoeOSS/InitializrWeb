FROM node:10 AS build
WORKDIR /usr/src
COPY package.json ./
COPY yarn.lock ./
COPY setupJest.js ./
COPY .babelrc ./
COPY src/ ./src/
COPY dev/ ./dev/
COPY static/ ./static/
COPY webpack.common.js ./
COPY webpack.prod.js ./
COPY webpack.dev.js ./
RUN yarn install
RUN yarn build

FROM phusion/passenger-nodejs:1.0.11
COPY --from=build /usr/src /usr/share/initializr/www
RUN chown -R app:app usr/share/initializr/www
RUN rm /etc/nginx/sites-enabled/default
RUN rm -f /etc/service/nginx/down
COPY deploy/docker/initializr-web.conf /etc/nginx/sites-enabled/


