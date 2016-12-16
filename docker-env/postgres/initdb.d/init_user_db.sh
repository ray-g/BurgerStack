#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER burgerstack WITH PASSWORD 'changeme';
    CREATE DATABASE burgerstack_dev;
    GRANT ALL PRIVILEGES ON DATABASE burgerstack_dev TO burgerstack;
EOSQL
