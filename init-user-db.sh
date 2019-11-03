#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER redcross;
    CREATE DATABASE dc510;
    GRANT ALL PRIVILEGES ON DATABASE dc510 TO redcross;
EOSQL
