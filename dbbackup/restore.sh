#!/bin/bash

# Wait for PostgreSQL to be ready
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "localhost" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - executing restore"

# Restore the database
PGPASSWORD=$POSTGRES_PASSWORD pg_restore -h "localhost" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v --clean --if-exists /docker-entrypoint-initdb.d/directus_backup.dump
