# metabase

The simplest, fastest way to get business intelligence and analytics to everyone in your company 😋

[GitHub](https://github.com/metabase/metabase)

1. Clone the [repository](https://github.com/metabase/metabase).
2. Create a `docker-compose.yml` file with the contents outlined [here](https://www.metabase.com/docs/latest/installation-and-operation/running-metabase-on-docker).
3. Run the application and database using using `docker compose`.

   ```
   docker compose up -d
   ```

4. Visit the application UI at http://localhost:3000 and follow prompts to set up the application.
5. Perform offline migration.
6. Update environment variables in `docker-compose.yml`.
   ```
   ...
   MB_DB_PORT: 5433
   MB_DB_USER: yugabyte
   MB_DB_PASS: yugabyte
   MB_DB_HOST: "host.docker.internal"
   ```
7. Re-run application, pointing to YugabyteDB.
   ```
   docker compose up -d
   ```
8. Verify application.
