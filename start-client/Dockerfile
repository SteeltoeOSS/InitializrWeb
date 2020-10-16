FROM node:14
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
COPY .babelrc ./
RUN yarn install
COPY dev/ ./dev/
COPY src/ ./src/
COPY static/ ./static/
COPY setupJest.js ./
COPY webpack.common.js ./
COPY webpack.prod.js ./
COPY webpack.dev.js ./
COPY InitializrApiConfig.js ./
CMD [ "yarn", "public-start" ]
