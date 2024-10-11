# Kuwala

Kuwala is the no-code data platform for BI analysts and engineers enabling you to build powerful analytics workflows.

[GitHub](https://github.com/kuwala-io/kuwala)

1. [Clone the repository](https://github.com/kuwala-io/kuwala).
2. Run the application services using Docker Compose.

   **NOTE: Kuwala runs PostgreSQL on port 5433, which is the YugabyteDB default. During migration, it's easiest to run YugbabyteDB on port 5434 as a workaround. When running the application while pointing to YugabyteDB, stop the PostgreSQL database and change the YugabyteDB port 5433.**

   ```
   docker-compose --profile kuwala up
   ```

3. Visit the UI at http://localhost:3000 and create some entities.
4. Perform offline migration.
5. Point backend to YugabyteDB in `docker-compose.yml`.
   ```
   ...
   backend:
    environment:
      - DATABASE_USER=yugabyte
      - DATABASE_PASSWORD=yugabyte
      - DATABASE_NAME=kuwala
      - DATABASE_HOST=host.docker.internal
   ```
6. Re-run application services.

   ```
   docker compose --profile kuwala down
   docker compose --profile kuwala up
   ```

7. Visit the UI at http://localhost:3000 to verify application.
