# gravitee

Gravitee.io - OpenSource API Management

[GitHub](https://github.com/gravitee-io/gravitee-api-management/tree/master)

1. Clone the [repository](git@github.com:gravitee-io/gravitee-api-management.git).
2. Download JDBC following the instructions in the [PostgreSQL Quick Start README](https://github.com/gravitee-io/gravitee-api-management/blob/master/docker/quick-setup/postgresql/README.md).
3. Run the application services using Docker Compose.
   ```
   docker compose up -d
   ```
4. Visit the application UI at http://localhost:8085.
5. Log in with username `admin` and password `admin` and interact with the UI to verify installation.
6. Perform offline migration.
7. Stop application services.
   ```
   docker compose down
   ```
8. Edit `docker-compose.yaml` in the `/docker/quick-setup/postgresql` directory.
   - Remove references to PostgreSQL
   - Change host and port for database connections to `host.docker.internal:5433`
   - Change credentials to username `yugabyte` and password `yugabyte`
9. Restart services in Docker Compose.

   ```
   docker compose up -d
   ```

10. Revisit application UI at http://localhost:8085 and verify migration was successful.
