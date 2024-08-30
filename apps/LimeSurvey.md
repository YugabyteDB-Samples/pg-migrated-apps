# LimeSurvey

The most popular FOSS online survey tool on the web.

[GitHub](https://github.com/LimeSurvey/LimeSurvey)
and
[docker-limesurvey Github](https://github.com/martialblog/docker-limesurvey)

1. Clone the [docker-limesurvey](https://github.com/martialblog/docker-limesurvey) repository.
2. Edit `docker-compose.pgsql.yml`.

   ```
   version: "3.0"
   services:
     limesurvey:
       build:
       # Hint: Change it to 3.0/apache/ if you want to use LimeSurvey 3.*
         context: 6.0/apache/
         dockerfile: Dockerfile
       volumes:
       # Hint: This is just an example, change /tmp to something persistent
         - /tmp/upload/surveys:/var/www/html/upload/surveys
       links:
         - lime-db
       depends_on:
         - lime-db
       ports:
       # Hint: Change it to 80:8080 if you are using LimeSurvey 3.*
         - "8080:8080"
       environment:
         - "DB_TYPE=pgsql"
         - "DB_PORT=5432"
         - "DB_HOST=lime-db"
         - "DB_PASSWORD=password"
         - "ADMIN_PASSWORD=password"
     lime-db:
       image: docker.io/postgres:10
       volumes:
         - db-data:/var/lib/postgresql/data
       ports:
         - "5432:5432"
       environment:
         - "POSTGRES_USER=limesurvey"
         - "POSTGRES_DB=limesurvey"
         - "POSTGRES_PASSWORD=password"
   volumes:
     db-data:
   ```

3. Run `docker-compose`.

   ```
   docker-compose -f docker-compose.pgsql up
   ```

4. Visit the application UI at http://localhost:8080/admin and log-in with credentials `admin`/`password`.
5. Create a survey to test in migration.
6. Run YugabyteDB in Docker and create database `limesurvey`.
7. Migrate the application schema and data using `yb-voyager`.
8. Verify schema and data parity between PostgreSQL and YugabyteDB.
9. Change the `docker-compose.yaml` file to point to YugabyteDB.

```
version: "3.0"
services:
  limesurvey:
    build:
     # Hint: Change it to 3.0/apache/ if you want to use LimeSurvey 3.*
     context: 6.0/apache/
     dockerfile: Dockerfile
     volumes:
     # Hint: This is just an example, change /tmp to something persistent
       - /tmp/upload/surveys:/var/www/html/upload/surveys
     ports:
       # Hint: Change it to 80:8080 if you are using LimeSurvey 3.*
       - "8080:8080"
     environment:
       - "DB_TYPE=pgsql"
       - "DB_PORT=5433"
       - "DB_HOST=host.docker.internal"
       - "DB_USERNAME=yugabyte"
       - "DB_PASSWORD=yugabyte"
       - "ADMIN_PASSWORD=password"
volumes:
  db-data:
```

11. Edit the `/6.0/apache/entrypoint.sh` file to prevent DB provisioning.
12. Re-run docker-compose.

    ```
    docker-compose -f docker-compose.pgsql up --build limesurvey
    ```

13. Verify the application.
