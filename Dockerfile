FROM node:21 AS build
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

FROM phusion/passenger-nodejs:3.0.1
COPY --from=build /usr/src /usr/share/initializr/www
RUN chown -R app:app /usr/share/initializr/www
RUN apt-get update && apt-get install -y gettext-base
RUN rm /etc/nginx/sites-enabled/default
RUN rm -f /etc/service/nginx/down
RUN sed -i "s|daemon off;|#daemon off; |g" /etc/nginx/nginx.conf
RUN echo "env INITIALIZR_SERVICE_HOST;" >> /etc/nginx/main.d/default.conf
RUN echo "env INITIALIZR_SERVICE_URI;" >> /etc/nginx/main.d/default.conf
COPY deploy/docker/initializr-web.conf.template /etc/nginx/templates/
COPY deploy/docker/docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh
ENTRYPOINT [ "./docker-entrypoint.sh" ]
CMD ["nginx", "-g", "daemon off;"]

# cat /etc/nginx/sites-enabled/initializr.conf
# tail -f /var/log/nginx/access.log
# tail -f /var/log/nginx/error.log