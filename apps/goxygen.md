# Goxygen

GH Link: [https://github.com/aquametalabs/aquameta](https://github.com/Shpota/goxygen)

### Installation Steps

[Install link](https://github.com/Shpota/goxygen/blob/main/docs/README.md)

### Create the app

Create an app using goxygen -

```
go run github.com/shpota/goxygen@latest init --frontend react --db postgres my-app
```

### Run the app

#### Postgres

```
version: "3.8"
services:
  app:
    build: .
    container_name: app
    ports:
      - 8080:8080
    depends_on:
      - db
    environment:
      profile: prod
      db_pass: pass
  db:
    image: postgres:15.4-alpine3.18
    environment:
      POSTGRES_PASSWORD: pass
      POSTGRES_USER: goxygen
      POSTGRES_DB: goxygen
    volumes:
      - ./init-db.sql:/docker-entrypoint-initdb.d/init.sql
```

#### YugabyteDB

```
version: "3.8"
services:
  app:
    build: .
    container_name: app
    ports:
      - 8080:8080
    depends_on:
      - yb
    environment:
      profile: prod
  yb:
    image: yugabytedb/yugabyte:latest
    command: >
      bash -c 'rm -rf /tmp/.yb.* ;
      yugabyted start --background=false --tserver_flags=ysql_colocate_database_by_default=true &
      until postgres/bin/pg_isready -U yugabyte -h yb -p 5433; do echo "Waiting for YugabyteDB to be ready..."; sleep 2; done;
      /usr/local/bin/ysqlsh -U yugabyte -d "$YSQL_DB" -h yb -f /init-db.sql;
      wait'
    ports:
      - "7000:7000"
    environment:
      - YSQL_DB=goxygen
      - YSQL_USER=goxygen
      - YSQL_PASSWORD=${PG_PASSWORD}
    healthcheck:
      interval: 15s
      timeout: 5s
      test: postgres/bin/pg_isready -h yb -p 5433
    volumes:
      - ./init-db.sql:/init-db.sql
```
