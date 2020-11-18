FROM node:10 AS build
WORKDIR /usr/src
COPY start-client/package.json ./
COPY start-client/yarn.lock ./
COPY start-client/setupJest.js ./
COPY start-client/.babelrc ./
COPY start-client/src/ ./src/
COPY start-client/dev/ ./dev/
COPY start-client/static/ ./static/
COPY start-client/webpack.common.js ./
COPY start-client/webpack.prod.js ./
COPY start-client/webpack.dev.js ./
COPY start-client/BuildVersion.json ./
RUN yarn install
RUN yarn build

FROM phusion/passenger-nodejs:1.0.11
COPY --from=build /usr/src /usr/share/initializr/www
RUN chown -R app:app /usr/share/initializr/www
RUN rm /etc/nginx/sites-enabled/default
RUN rm -f /etc/service/nginx/down
COPY deploy/docker/initializr-web.conf /etc/nginx/sites-enabled/
