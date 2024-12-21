#!/bin/bash

# Wait for PostgreSQL to be ready
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - executing restore"

# Restore the database
PGPASSWORD=$POSTGRES_PASSWORD pg_restore -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v /docker-entrypoint-initdb.d/directus_backup.dump
