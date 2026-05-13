#!/bin/sh
export PORT=${PORT:-80}

# Build proper JDBC URL from Railway Postgres vars (DATABASE_URL is postgresql://, not jdbc:)
export SPRING_DATASOURCE_URL="jdbc:postgresql://${PGHOST}:${PGPORT}/${PGDATABASE}"
export SPRING_DATASOURCE_USERNAME="${PGUSER}"
export SPRING_DATASOURCE_PASSWORD="${PGPASSWORD}"

envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
exec supervisord -c /etc/supervisord.conf
