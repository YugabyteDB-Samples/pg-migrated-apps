# coolify

An open-source & self-hostable Heroku / Netlify / Vercel alternative.

[GitHub](https://github.com/coollabsio/coolify)

1. [Clone the repository](https://github.com/coollabsio/coolify).
2. Copy `.env.development.example` to `.env`.
   ```
   cp .env.development.example .env
   ```
3. Verify environment variables in `.env`.
4. Change Minio port.

   The port set in `docker-compose.dev.yml` conflicts with YugabyteDB's admin UI for tablet servers.

   Change

   ```
   ports:
       - "${FORWARD_MINIO_PORT:-9000}:9000"
   ```

   to

   ```
   ports:
       - "${FORWARD_MINIO_PORT:-9050}:9000"
   ```

5. Start application services using Docker Compose.
   ```
   docker compose --env-file .env -f docker-compose.yml -f docker-compose.dev.yml up -d
   ```
6. Verify UI at http://localhost:8000. Log-in and create entities.
7. Execute offline migration.
8. Change database connection details in `.env` to point to YugabyteDB.

   ```
   # PostgreSQL Database Configuration
   DB_DATABASE=coolify
   DB_USERNAME=yugabyte
   DB_PASSWORD=yugabyte
   DB_HOST=host.docker.internal
   DB_PORT=5433
   ```

9. Restart application services using Docker Compose.
   ```
   docker compose --env-file .env -f docker-compose.yml -f docker-compose.dev.yml up -d
   ```
10. Verify data has migrated by revisting http://localhost:8000.
