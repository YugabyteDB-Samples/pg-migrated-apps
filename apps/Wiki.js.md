# Wiki.js

A modern and powerful wiki app built on Node.js

[GitHub](https://github.com/requarks/wiki)

Start PostgreSQL:
```

docker run -d --name pg \
 --hostname pg -e POSTGRES_DB=db -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password \
 --health-cmd="PGPASSWORD=password pg_isready -h pg -p 5432 -U user -d db" --health-interval=3s --health-timeout=3s \
 postgres:12


```

Start the application:
```

docker run -d --name app --link pg:pg \
 -p 3000:3000 \
 -e DB_TYPE=postgres -e DB_HOST=pg -e DB_PORT=5432 -e DB_USER=user -e DB_PASS=password -e DB_NAME=db \
 requarks/wiki:latest

```

Test the application: http://localhost:3000

Stop the application (remove the container - if there were some persitent files, put them in external volume):
```

docker rm app


```


Start YugabyteDB

```

docker run -d --name yb  \
 --hostname db -e YSQL_DB=db -e YSQL_USER=user -e YSQL_PASSWORD=password \
 --health-cmd="PGPASSWORD=password postgres/bin/pg_isready -h db -p 5433 -U user -d db" --health-interval=3s --health-timeout=3s \
 yugabytedb/yugabyte:2024.1.1.0-b137 \
 bash -c 'rm -rf /tmp/.yb.* ; yugabyted start --enable_pg_parity_tech_preview --background=false --tserver_flags=ysql_colocate_database_by_default=true'

```

Start a container with the YugabyteDB voyager image

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

Stop PostgreSQL

```

docker stop pg


```

Start the application with new database endpoint ( host:`yb`, port: `5433` )

```

docker rm app

docker run -d --name app --link yb:yb \
 -p 3000:3000 \
 -e DB_TYPE=postgres -e DB_HOST=yb -e DB_PORT=5433 -e DB_USER=user -e DB_PASS=password -e DB_NAME=db \
 requarks/wiki:latest

```

Validate the application

