# Zammad

Zammad is a web based open source helpdesk/customer support system

[GitHub](https://github.com/zammad/zammad)

1. [Clone the repository](https://github.com/zammad/zammad-docker-compose) made specifically for running Zammad with Docker Compose.
2. Edit the `docker-compose.yml` file to expose PostgreSQL on port `5432` for migration.
   ```
   ...
   ports:
     - 5432:5432
   ```
3. Run the application:

   ```
   docker compose -f docker-compose.yml up
   ```

4. Visit the application UI at http://localhost:8080.
5. Run the application setup via UI prompts.
6. Execute offline migration.
7. Edit `docker-compose.yml` to point to YugabyteDB.
   ```
   ...
   POSTGRESQL_HOST: ${POSTGRES_HOST:-host.docker.internal}
   POSTGRESQL_USER: ${POSTGRES_USER:-yugabyte}
   POSTGRESQL_PASS: ${POSTGRES_PASS:-yugabyte}
   POSTGRESQL_PORT: ${POSTGRES_PORT:-5433}
   ```
8. Restart the application services with this new configuration.
   ```
   docker compose -f docker-compose.yml up
   ```
9. Revisit the UI at http://localhost:8080 and confirm all entities have been migrated successfully.
