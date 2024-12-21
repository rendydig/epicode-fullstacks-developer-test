#!/bin/bash
set -e

# Run the original postgres entrypoint script to initialize the database
docker-entrypoint.sh "postgres" "$@" &
POSTGRES_PID=$!

# Function to check if PostgreSQL is ready
is_postgres_ready() {
    pg_isready -h "127.0.0.1" -p 5432 -U "$POSTGRES_USER" >/dev/null 2>&1
}

# Function to check if database is empty
is_database_empty() {
    TABLES=$(PGPASSWORD=$POSTGRES_PASSWORD psql -h "127.0.0.1" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
    [ "$TABLES" = "0" ]
}

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until is_postgres_ready; do
    echo "PostgreSQL is unavailable - sleeping"
    sleep 1
done

echo "PostgreSQL is up"

# Wait a bit more to ensure PostgreSQL is fully initialized
sleep 5

# Check if database is empty and restore if needed
if is_database_empty; then
    echo "Database is empty, restoring from backup..."
    PGPASSWORD=$POSTGRES_PASSWORD pg_restore -h "127.0.0.1" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v /docker-entrypoint-initdb.d/directus_backup.dump
    echo "Restore completed"
else
    echo "Database already has tables, skipping restore"
fi

# Wait for the postgres process
wait $POSTGRES_PID
