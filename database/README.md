# Database migrations

Run the SQL migration files in `migrations/` against your local Postgres database.

Quick example using Docker and psql:

1. Start Postgres with Docker Compose or `docker run`.
2. Copy and run the migration inside the container or from host using `psql`.

Example (host psql):

psql -h localhost -p 5432 -U postgres -d aio -f ./database/migrations/001_init.sql
