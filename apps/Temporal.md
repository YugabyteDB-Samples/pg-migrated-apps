# Temporal

Open source durable execution system. Write code that’s fault tolerant, durable, and simple.

[GitHub](https://github.com/temporalio/temporal)

# Migration

## Start the application with PostgreSQL:

An older version must be used to be compatible with PG11
Newer versions use `GENERATED ALWAYS ... STORED' (see [ddl](https://github.com/temporalio/temporal/blob/release/v1.21.x/schema/postgresql/v12/visibility/schema.sql#L32))

```

wget -O docker-compose.yml https://raw.githubusercontent.com/temporalio/docker-compose/main/docker-compose-postgres.yml

cat > .env <<'ENV'
TEMPORAL_ADMINTOOLS_VERSION=1.21.6
TEMPORAL_UI_VERSION=2.26.2
POSTGRESQL_VERSION=11
TEMPORAL_VERSION=1.21.6
ENV
docker compose up -d

```
## Test the application:

Use the application on http://localhost:8080/

## Stop the application
```
docker compose stop temporal

```

## Start YugabyteDB

Add YugabyteDB service to docker compose:
```
  yb:
    container_name: temporal-yugabytedb
    environment:
      YSQL_DB: temporal
      YSQL_PASSWORD: temporal
      YSQL_USER: temporal
    image: yugabytedb/yugabyte:2024.1.1.0-b137
    command: bash -c 'rm -rf /tmp/.yb.* ; yugabyted start --enable_pg_parity_tech_preview --background=false --tserver_flags=ysql_colocate_database_by_default=true'
    networks:
      - temporal-network
    ports:
      - 5433:5433
      - 15433:15433

```
Start YugabyteDB
```

docker compose up -d yb 

```

## Migrate with YugabyteDB Voyager
Start a container with the YugabyteDB voyager image and run the migration steps

```

docker run -it --rm --name ybv --network temporal-network --link temporal-postgresql:pg --link yb:yb \
 yugabytedb/yb-voyager:1.7.2 \
 bash -c '
yb-voyager assess-migration --export-dir /var/tmp --start-clean=true --source-db-host pg --source-db-user temporal --source-db-password temporal --source-db-name temporal --source-db-schema public --source-db-type postgresql --iops-capture-interval 0
cat /var/tmp/assessment/reports/assessmentReport.json
yb-voyager export schema    --export-dir /var/tmp --start-clean=true --source-db-host pg --source-db-user temporal --source-db-password temporal --source-db-name temporal --source-db-schema public --source-db-type postgresql
yb-voyager analyze-schema   --export-dir /var/tmp
cat /var/tmp/reports/schema_analysis_report.txt
yb-voyager import schema    --export-dir /var/tmp                    --target-db-host yb --target-db-user temporal --target-db-password temporal --target-db-name temporal --target-db-schema public
yb-voyager export data      --export-dir /var/tmp --start-clean=true --source-db-host pg --source-db-user temporal --source-db-password temporal --source-db-name temporal --source-db-schema public --source-db-type postgresql
yb-voyager import data      --export-dir /var/tmp                    --target-db-host yb --target-db-user temporal --target-db-password temporal --target-db-name temporal
PGPASSWORD=temporal psql -h yb -p 5433 -U temporal -c 'analyze' temporal
'

```

YugabyteDB Voyager shows wrong errors about `ALTER TABLE CLUSTER not supported yet.`

The schema migration schema is in `temporal_visibility`:

```
docker compose exec yb bash -c 'PGPASSWORD=temporal PGUSER=temporal ysqlsh -h yb -c "create database temporal_visibility"'

docker run -it --rm --name ybv --network temporal-network --link temporal-postgresql:pg --link yb:yb \
 yugabytedb/yb-voyager:1.7.2 \
 bash -c '
yb-voyager assess-migration --export-dir /var/tmp --start-clean=true --source-db-host pg --source-db-user temporal --source-db-password temporal --source-db-name temporal_visibility --source-db-schema public --source-db-type postgresql --iops-capture-interval 0
cat /var/tmp/assessment/reports/assessmentReport.json
yb-voyager export schema    --export-dir /var/tmp --start-clean=true --source-db-host pg --source-db-user temporal --source-db-password temporal --source-db-name temporal_visibility --source-db-schema public --source-db-type postgresql
yb-voyager analyze-schema   --export-dir /var/tmp
cat /var/tmp/reports/schema_analysis_report.txt
yb-voyager import schema    --export-dir /var/tmp                    --target-db-host yb --target-db-user temporal --target-db-password temporal --target-db-name temporal_visibility --target-db-schema public
yb-voyager export data      --export-dir /var/tmp --start-clean=true --source-db-host pg --source-db-user temporal --source-db-password temporal --source-db-name temporal_visibility --source-db-schema public --source-db-type postgresql
yb-voyager import data      --export-dir /var/tmp                    --target-db-host yb --target-db-user temporal --target-db-password temporal --target-db-name temporal_visibility
PGPASSWORD=temporal psql -h yb -p 5433 -U temporal -c 'analyze' temporal_visibility
'
 
```
In latest versions of Temporal (tested 1.24) YugabyteDB Voyager shows following errors:
- Reason          : Stored generated columns are not supported
- Reason          : Schema contains gin index on multi column which is not supported


## Stop PostgreSQL

```

docker compose stop postgresql


```

## Start the application with new database endpoint

Change the service ( depends_on, DB_PORT, POSTGRES_SEEDS, and the DB=postgres to not upgrade to PG12 schema )

```
  temporal:
    container_name: temporal
    depends_on:
      - yb
    environment:
      - DB=postgres
      - DB_PORT=5433
      - POSTGRES_USER=temporal
      - POSTGRES_PWD=temporal
      - POSTGRES_SEEDS=yb
      - DYNAMIC_CONFIG_FILE_PATH=config/dynamicconfig/development-sql.yaml

```

```

docker compose up -d temporal

Some screens show: 
```
400
Uh oh. There's an error.
invalid query: unable to convert filter expression: unable to convert left side of "TemporalNamespaceDivision = 'TemporalBatcher'": filter by 'TemporalNamespaceDivision' not supported for standard visibility
```
because this version with PG11 schema uses standard visibility which is deprecated.

