#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER warmpet WITH PASSWORD 'changeme';
    CREATE DATABASE warmpet_dev;
    GRANT ALL PRIVILEGES ON DATABASE warmpet_dev TO warmpet;
EOSQL
