# Picsur

An easy to use, selfhostable image sharing service like Imgur with built in converting

[GitHub](https://github.com/CaramelFur/Picsur)

1. [Clone the repository](https://github.com/CaramelFur/Picsur).
2. Navigate to `support/picsur.docker-compose.yml` and review its contents.
3. Run the application and associated PostgreSQL instance in Docker.
   ```
   docker-compose -f support/picsur.docker-compose.yml up
   ```
4. Log into the application at http://localhost:8080 and upload images.

   **NOTE: default credentials are admin / picsur**

5. Execute offline migration.
6. Stop and remove the application services.

   ```
   docker-compose -f support/picsur.docker-compose.yml down
   ```

7. Edit the environment in `support/picsur.docker-compose.yml` to point to YugabyteDB.

   ```
   ...
    PICSUR_DB_HOST: 'host.docker.internal'
    PICSUR_DB_PORT: 5433
    PICSUR_DB_USERNAME: yugabyte
    PICSUR_DB_PASSWORD: yugabyte
    PICSUR_DB_DATABASE: picsur
   ```

   **NOTE: you can also comment out the database service, as we'll be using YugabyteDB**

8. Restart the application.
   ```
   docker-compose -f support/picsur.docker-compose.yml up
   ```
9. Log into the application at http://localhost:8080 and upload new images to verify migration to YugabyteDB.
