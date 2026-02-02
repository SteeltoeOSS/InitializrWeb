FROM node:20 AS build
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
ENV GOOGLE_TAGMANAGER_ID="G-2778ZJCYZ4"
RUN yarn build

FROM nginx:1-alpine
# Copy the build artifacts from the build stage
COPY --from=build /usr/src/public /usr/share/nginx/html

# Copy the nginx configuration template
# nginx:alpine automatically runs envsubst on files in /etc/nginx/templates/
# and outputs them to /etc/nginx/conf.d/
COPY deploy/docker/initializr-web.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
