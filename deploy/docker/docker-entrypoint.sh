#!/usr/bin/env sh
set -eu

echo "Starting up with these env variables... host: $INITIALIZR_SERVICE_HOST, uri: $INITIALIZR_SERVICE_URI"

envsubst '$INITIALIZR_SERVICE_HOST $INITIALIZR_SERVICE_URI' < /etc/nginx/templates/initializr-web.conf.template > /etc/nginx/sites-enabled/initializr.conf

# cat /etc/nginx/sites-enabled/initializr.conf 

exec "$@"