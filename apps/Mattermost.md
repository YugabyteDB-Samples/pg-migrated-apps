# Mattermost

Open source platform that provides secure collaboration for technical and operational teams that work in environments with complex nation-state level security and trust requirements.

[GitHub](https://github.com/mattermost/mattermost)

# Migration

## Start PostgreSQL:
```

docker run -d --name pg \
 --hostname pg -e POSTGRES_DB=db -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password \
 --health-cmd="PGPASSWORD=password pg_isready -h pg -p 5432 -U user -d db" --health-interval=3s --health-timeout=3s \
 postgres:12

```


## Start the application:
Get the configuration from the `mattermost-preview` image and change the `DataSource` to the PostgreSQL database `postgres://user:password@pg:5432'
```

curl https://raw.githubusercontent.com/FranckPachot/mattermost-docker-yugabytedb-preview/master/config_docker.json |
 sed -e '/"DataSource"/s#://.*?#://user:password@pg:5432/db?#' > mm_config.json
grep DataSource mm_config.json

```
Start the application with `--link` to PostgreSQL and `/mm/mattermost-data` as an external volume because users are stored there and not in the DB. 

```

docker run --name app -d --publish 8080:8065 --link pg:pg -v mm_data:/mm/mattermost-data -v ./mm_config.json:/mm_config.json --entrypoint "/mm/mattermost/bin/mattermost" mattermost/mattermost-preview --config=/mm_config.json

```

## Test the application:

Go to localhost:8080, add a user, skip the tools, and finish setup.

Import some sample data:

```

docker exec -it app bash -xc '
mmctl auth login http://localhost:8065 --name franck --username Franck --password 'password'
mmctl sampledata --help
mmctl sampledata -u 10
'

```

Refresh and joint the new teams created, or go to localhost:8080//admin_console/reporting/system_analytics and check the number of posts.

## Stop the application
remove the container to start it with different `--link` - persitent files are in external volume
```

docker stop app
docker rm   app

```

## Start YugabyteDB

```

docker run -d --name yb  \
 --hostname yb -e YSQL_DB=db -e YSQL_USER=user -e YSQL_PASSWORD=password \
 --health-cmd="PGPASSWORD=password postgres/bin/pg_isready -h yb -p 5433 -U user -d db" --health-interval=3s --health-timeout=3s \
 yugabytedb/yugabyte:2024.1.2.0-b77 \
 bash -c 'rm -rf /tmp/.yb.* ; yugabyted start --enable_pg_parity_tech_preview --background=false'

```

## Migrate with YugabyteDB Voyager
Start a container with the YugabyteDB voyager image and run the migration steps

```

docker run -it --rm --name ybv --link pg:pg --link yb:yb \
 yugabytedb/yb-voyager:1.8.1 \
 bash -xc '
yb-voyager assess-migration --export-dir /var/tmp --start-clean=true --source-db-host pg --source-db-user user --source-db-password password --source-db-name db --source-db-schema public --source-db-type postgresql --iops-capture-interval 0
cat /var/tmp/assessment/reports/migration_assessment_report.json
yb-voyager export schema    --export-dir /var/tmp --start-clean=true --source-db-host pg --source-db-user user --source-db-password password --source-db-name db --source-db-schema public --source-db-type postgresql
yb-voyager analyze-schema   --export-dir /var/tmp
cat /var/tmp/reports/schema_analysis_report.txt
sed -e "s/CREATE INDEX /CREATE INDEX NONCONCURRENTLY /" -i /var/tmp/schema/tables/INDEXES_table.sql
yb-voyager import schema    --export-dir /var/tmp                    --target-db-host yb --target-db-user user --target-db-password password --target-db-name db --target-db-schema public <<<Y 
yb-voyager export data      --export-dir /var/tmp --start-clean=true --source-db-host pg --source-db-user user --source-db-password password --source-db-name db --source-db-schema public --source-db-type postgresql
yb-voyager import data      --export-dir /var/tmp                    --target-db-host yb --target-db-user user --target-db-password password --target-db-name db
yb-voyager import schema    --export-dir /var/tmp                    --target-db-host yb --target-db-user user --target-db-password password --target-db-name db --post-snapshot-import=true --refresh-mviews=true <<<Y
PGPASSWORD=password psql -h yb -p 5433 -U user -c 'analyze' db
'

```

## Stop PostgreSQL

Set the PostgreSQL database as read-only as YugabyteDB will now be used

```

docker exec -it -e PGPASSWORD=password pg psql -U user -d postgres -c '
alter system set default_transaction_read_only to on;
'
docker stop pg

```

## Start the application with new database endpoint

Change the config to connect to YugabyteDB and start the app with same external volume but `--link` to YugabyteDB


```

sed -e '/"DataSource"/s#://.*?#://user:password@yb:5433/db?#' -i mm_config.json 
grep DataSource mm_config.json
docker start app

docker run --name app -d --publish 8080:8065 --link yb:yb -v mm_data:/mm/mattermost-data -v ./mm_config.json:/mm_config.json --entrypoint "/mm/mattermost/bin/mattermost" mattermost/mattermost-preview --config=/mm_config.json

```

## Validate the application

Check on http://localhost:8080/admin_console/reporting/system_analytics that the same posts are there

```

docker exec -e PGPASSWORD=password yb ysqlsh -h yb -U user -d db -c '
select pg_stat_statements_reset();
'

docker exec -it app bash -xc '
mmctl auth login http://localhost:8065 --name franck --username Franck --password 'password'
mmctl sampledata --help
mmctl sampledata -u 10
'

docker exec -e PGPASSWORD=password yb ysqlsh -h yb -U user -d db -c '
select max_time,mean_time,min_time,calls,substr(query,1,80) from pg_stat_statements order by 1;
'



## remove PostgreSQL container
```

docker rm -f pg

```

Remains two containers: `app` with the application, and `yb` with yugabyted


