# NocoDB

An Open Source Alternative to Airtable

[GitHub](https://github.com/nocodb/nocodb)

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
 -p 8080:8080 \
 -e NC_DB="pg://pg:5432?u=user&p=password&d=db" \
 -e NC_PUBLIC_URL=https://nocodb.localhost -e NC_DISABLE_TELE=true -e NC_INVITE_ONLY_SIGNUP=true \
 -e NC_SMTP_FROM=noreply@example.com -e NC_SMTP_HOST=smtp.example.com -e NC_SMTP_PORT=587 -e NC_SMTP_USERNAME=noreply@example.com -e NC_SMTP_PASSWORD=myp@ssw0rd -e NC_SMTP_SECURE=true \
 --health-cmd="wget -q --spider --proxy=off localhost:8080 || exit 1" \
 nocodb/nocodb

```

## Test the application:

Use the application to create some tables

![image](https://github.com/user-attachments/assets/77a81dbc-6c4e-4377-887c-3925455a4f2f)

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

The creation of the indexes is long because it runs in CONCURRENTLY mode, which waits for the heartbeat to confirm all caches are synchronized.

## Stop PostgreSQL

```

docker stop pg


```

## Start the application with new database endpoint
Same command as before, but with host: `yb` and port: `5433`

```

docker run -d --name app --link yb:yb \
 -p 8080:8080 \
 -e NC_DB="pg://yb:5433?u=user&p=password&d=db" \
 -e NC_PUBLIC_URL=https://nocodb.localhost -e NC_DISABLE_TELE=true -e NC_INVITE_ONLY_SIGNUP=true \
 -e NC_SMTP_FROM=noreply@example.com -e NC_SMTP_HOST=smtp.example.com -e NC_SMTP_PORT=587 -e NC_SMTP_USERNAME=noreply@example.com -e NC_SMTP_PASSWORD=myp@ssw0rd -e NC_SMTP_SECURE=true \
 --health-cmd="wget -q --spider --proxy=off localhost:8080 || exit 1" \
 nocodb/nocodb

```

## Validate the application:

Verify your table is still there

![image](https://github.com/user-attachments/assets/c428f7db-a3fb-4480-ad06-131180c2d0c9)


## remove PostgreSQL container
```

docker rm pg

```

Remains two containers: `app` with the application, and `yb` with yugabyted


