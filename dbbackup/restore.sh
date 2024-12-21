#!/bin/bash
set -e

# Function to check if PostgreSQL is ready
is_postgres_ready() {
    pg_isready -h "postgres" -p 5432 -U "$POSTGRES_USER" >/dev/null 2>&1
}

# Function to check if database is empty
is_database_empty() {
    TABLES=$(PGPASSWORD=$POSTGRES_PASSWORD psql -h "postgres" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
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
    PGPASSWORD=$POSTGRES_PASSWORD pg_restore -h "postgres" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v /directus_backup.dump
    echo "Restore completed successfully"
else
    echo "Database already has tables, skipping restore"
fi

# Exit successfully
exit 0
