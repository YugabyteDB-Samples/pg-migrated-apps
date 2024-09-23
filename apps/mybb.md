# mybb

a free and open source forum software.

[GitHub](https://github.com/mybb/mybb)

## Steps for Migration

1. Clone the [repository](https://github.com/mybb/docker) for Docker installation.
2. Add `docker-compose.yml` file.

   ```
   version: "3.8"
   services:
   mybb:
       image: mybb/mybb:latest
       volumes:
       - ${PWD}/mybb:/var/www/html:rw

   nginx:
       image: nginx:mainline-alpine
       ports:
       - published: 8080
           target: 80
       volumes:
       - ${PWD}/nginx:/etc/nginx/conf.d:ro
       - ${PWD}/mybb:/var/www/html:ro

   postgresql:
       environment:
       POSTGRES_DB: mybb
       POSTGRES_USER: mybb
       POSTGRES_PASSWORD: password
       image: postgres:14-alpine
       ports:
       - "5432:5432"
       volumes:
       - ${PWD}/postgres/data:/var/lib/postgresql/data:rw
   ```

3. Run the application.

```
docker compose -f docker-compose.yml up
```

4. Visit the application UI at http://localhost:8080 and complete the steps to initialize the database.
5. After completing setup, verify the functionality by posting in the forum.
6. Run YugabyteDB in Docker.

   i.e.

   ```
     docker run -d --name yugabyte-no-locks -p7000:7000 -p9000:9000 -p15433:15433 -p5433:5433 -p9042:9042  \
   yugabytedb/yugabyte:2024.1.1.0-b137 bin/yugabyted start --tserver_flags="ysql_pg_conf_csv={log_statement=all,yb_silence_advisory_locks_not_supported_error=true}" --background=false \
   --enable_pg_parity_tech_preview

   ```

7. Execute offline migration with YB Voyager.
8. Edit `config.php` to point to YugabyteDB.

   **Note: This file is only accessible to the project after running docker-compose, as the data volume for the mybb service points to the current working directory.**

   ```
   $config['database']['type'] = 'pgsql';
   $config['database']['database'] = 'mybb';
   $config['database']['table_prefix'] = 'mybb_';

   $config['database']['hostname'] = 'host.docker.internal:5433';
   $config['database']['username'] = 'yugabyte';
   $config['database']['password'] = 'yugabyte';
   ```

9. Create `docker-compose-yb.yml`.

   **Note: This will build the project locally with the updated configuration.**

```
 version: "3.8"
 services:
 mybb:
     build:
     context: .
     dockerfile: Dockerfile
     args:
         BUILD_AUTHORS: "Kane 'kawaii' Valentine <kawaii@mybb.com>"
         BUILD_DATE: "${BUILD_DATE:-$(date -u +'%Y-%m-%dT%H:%M:%SZ')}"
         BUILD_SHA512SUM: "be3bdec9617050abbabbfcfa40e9cd145db3a57ae70e740bc62d807b04c08a5fa42ac690a5502c344f0f7452276aa0f3802501e6d62fa76edc64ac36da25b3cd"
         BUILD_VERSION: "1830"
     environment:
     - MYBB_VERSION=value
     volumes:
     - ${PWD}/mybb:/var/www/html:rw

 nginx:
     image: nginx:mainline-alpine
     ports:
     - published: 8080
         target: 80
     volumes:
     - ${PWD}/nginx:/etc/nginx/conf.d:ro
     - ${PWD}/mybb:/var/www/html:ro
```

10. Re-run the application with this new docker-compose file.

```
docker compose -f docker-compose-yb.yml up
```

11. Verify the application and its data.
