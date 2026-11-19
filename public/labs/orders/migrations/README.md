# Migrations

One `.sql` file per change to the database, named so they sort in the order they
should run: `001_create_tables.sql`, `002_add_an_index.sql`, and so on.

Never edit a migration that has already run somewhere. Add a new one.
