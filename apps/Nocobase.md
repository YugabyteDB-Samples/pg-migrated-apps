# Nocobase

A scalability-first, open-source no-code/low-code platform to build internal tools.

[GitHub](https://github.com/nocobase/nocobase)

1. Clone the [repository](https://github.com/nocobase/nocobase)

2. Update the `docker-compose.yaml` file. The Docker installation instructions can be found [here](https://docs.nocobase.com/welcome/getting-started/installation/docker-compose).
   ** Note: This compose file uses PostgreSQL v15 as opposed to 'latest' or v16 **

```
version: '3'

networks:
  nocobase:
    driver: bridge

services:
  app:
    image: nocobase/nocobase:latest
    networks:
      - nocobase
    depends_on:
      - postgres
    environment:
      # The application's secret key, used to generate user tokens, etc.
      # If APP_KEY is changed, old tokens will also become invalid.
      # It can be any random string, and make sure it is not exposed.
      - APP_KEY=your-secret-key
      # Database type, supports postgres, mysql, mariadb
      - DB_DIALECT=postgres
      # Database host, can be replaced with the IP of an existing database server
      - DB_HOST=postgres
      # Database name
      - DB_DATABASE=nocobase
      # Database user
      - DB_USER=nocobase
      # Database password
      - DB_PASSWORD=nocobase
    volumes:
      - ./storage:/app/nocobase/storage
    ports:
      - '13000:80'
    # init: true

  # If using an existing database server, postgres service can be omitted
  postgres:
    image: postgres:15
    restart: always
    command: postgres -c wal_level=logical
    environment:
      POSTGRES_USER: nocobase
      POSTGRES_DB: nocobase
      POSTGRES_PASSWORD: nocobase
    volumes:
      - ./storage/db/postgres:/var/lib/postgresql/data
    ports:
      - '5432:5432'
    networks:
      - nocobase
```

3. Pull the Docker images.

```
docker-compose pull
```

4. Run the app and PostgreSQL database.

```
docker-compose up -d
```

5.  Run YugabyteDB in Docker.
6.  Execute offline migration.
7.  Verify schema and data parity between PostgreSQL and YugabyteDB.
8.  Change the `docker-compose.yaml` file to point to YugabyteDB.

```
version: '3'

networks:
  nocobase:
    driver: bridge

services:
  app:
    image: nocobase/nocobase:latest
    networks:
      - nocobase
    environment:
      # The application's secret key, used to generate user tokens, etc.
      # If APP_KEY is changed, old tokens will also become invalid.
      # It can be any random string, and make sure it is not exposed.
      - APP_KEY=your-secret-key
      # Database type, supports postgres, mysql, mariadb
      - DB_DIALECT=postgres
      # Database host, can be replaced with the IP of an existing database server
      - DB_HOST=host.docker.internal
      # Database name
      - DB_DATABASE=nocobase
      # Database user
      - DB_USER=yugabyte
      # Database password
      - DB_PASSWORD=yugabyte
      - DB_PORT=5433
    volumes:
      - ./storage:/app/nocobase/storage
    ports:
      - '13000:80'
    # init: true
```

9. Re-run docker-compose.

```
docker-compose up
```

10. Verify the application.
