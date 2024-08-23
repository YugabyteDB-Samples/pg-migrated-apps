# HedgeDoc

Was CodiMD: create real-time collaborative markdown notes


[GitHub](https://github.com/hedgedoc/hedgedoc)

# Migration

## Start PostgreSQL:
```

docker run -d --name pg \
 --hostname pg -e POSTGRES_DB=db -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password \
 --health-cmd="PGPASSWORD=password pg_isready -h pg -p 5432 -U user -d db" --health-interval=3s --health-timeout=3s \
 postgres:12

```

## Start the application:
```

docker run -d --name app --link pg:pg \
 -p 3000:3000 \
 -e CMD_DB_URL=postgres://user:password@pg:5432/db \
 -e CMD_ALLOW_FREEURL=true -e CMD_ALLOW_EMAIL_REGISTER=true -e CMD_DEFAULT_PERMISSION=editable \
 -e CMD_URL_ADDPORT=false -e CMD_PROTOCOL_USESSL=true -e CMD_SESSION_SECRET=Postgres2YugabyteDB   \
 linuxserver/hedgedoc

```

## Test the application:

Create some docs using the API
```

time for f in $( find /usr -name README )
do
curl -X POST "http://localhost:3000/new" -H "Content-Type: text/markdown" -d "@$f"
done

curl -X POST "http://localhost:3000/new/MyNote" -H "Content-Type: text/markdown" -d "My node written at $(date)"
curl -X GET "http://localhost:3000/MyNote/info"

```

## Stop the application
(remove the container - if there were some persitent files, put them in external volume):
```

docker stop app
docker rm   app

```

## Start YugabyteDB

```

docker run -d --name yb  \
 --hostname yb -e YSQL_DB=db -e YSQL_USER=user -e YSQL_PASSWORD=password \
 --health-cmd="PGPASSWORD=password postgres/bin/pg_isready -h yb -p 5433 -U user -d db" --health-interval=3s --health-timeout=3s \
 yugabytedb/yugabyte:2024.1.1.0-b137 \
 bash -c 'rm -rf /tmp/.yb.* ; yugabyted start --enable_pg_parity_tech_preview --background=false --tserver_flags=ysql_colocate_database_by_default=true'

```

## Migrate with YugabyteDB Voyager
Start a container with the YugabyteDB voyager image and run the migration steps

```

docker run -it --rm --name ybv --link pg:pg --link yb:yb \
 yugabytedb/yb-voyager:1.7.2 \
 bash -c '
yb-voyager assess-migration --export-dir /var/tmp --start-clean=true --source-db-host pg --source-db-user user --source-db-password password --source-db-name db --source-db-schema public --source-db-type postgresql --iops-capture-interval 0
cat /var/tmp/assessment/reports/assessmentReport.json
yb-voyager export schema    --export-dir /var/tmp --start-clean=true --source-db-host pg --source-db-user user --source-db-password password --source-db-name db --source-db-schema public --source-db-type postgresql
yb-voyager analyze-schema   --export-dir /var/tmp
cat /var/tmp/reports/schema_analysis_report.txt
yb-voyager import schema    --export-dir /var/tmp                    --target-db-host yb --target-db-user user --target-db-password password --target-db-name db --target-db-schema public
yb-voyager export data      --export-dir /var/tmp --start-clean=true --source-db-host pg --source-db-user user --source-db-password password --source-db-name db --source-db-schema public --source-db-type postgresql
yb-voyager import data      --export-dir /var/tmp                    --target-db-host yb --target-db-user user --target-db-password password --target-db-name db
PGPASSWORD=password psql -h yb -p 5433 -U user -c 'analyze' db
'
 
```

## Stop PostgreSQL

```

docker stop pg


```

## Start the application with new database endpoint
Same command as before, but with host: `yb` and port: `5433`

```

docker run -d --name app --link yb:yb \
 -p 3000:3000 \
 -e CMD_DB_URL=postgres://user:password@yb:5433/db \
 -e CMD_ALLOW_FREEURL=true -e CMD_ALLOW_EMAIL_REGISTER=true -e CMD_DEFAULT_PERMISSION=editable \
 -e CMD_URL_ADDPORT=false -e CMD_PROTOCOL_USESSL=true -e CMD_SESSION_SECRET=Postgres2YugabyteDB   \
 linuxserver/hedgedoc

```

## Validate the application:

Verify your note is still there
```

curl -X GET "http://localhost:3000/MyNote/info"

```

## remove PostgreSQL container
```

docker rm pg

```

Remains two containers: `app` with the application, and `yb` with yugabyted


