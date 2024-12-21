#!/bin/bash
set -e

# Run the original postgres entrypoint script
docker-entrypoint.sh postgres &

# Wait for PostgreSQL to be ready
until PGPASSWORD=$POSTGRES_PASSWORD psql -h localhost -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q' 2>/dev/null; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - executing restore"

# Check if database is empty (no tables)
TABLES=$(PGPASSWORD=$POSTGRES_PASSWORD psql -h localhost -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" -t | xargs)

if [ "$TABLES" = "0" ]; then
    echo "Database is empty, restoring from backup..."
    # Restore the database
    PGPASSWORD=$POSTGRES_PASSWORD pg_restore -h localhost -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v /docker-entrypoint-initdb.d/directus_backup.dump
else
    echo "Database already has tables, skipping restore"
fi

# Wait for the postgres process
wait $!
