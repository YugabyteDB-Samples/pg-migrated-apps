# Orthanc

free and open-source, lightweight DICOM server for medical imaging from Belgium.

[GitHub](https://www.orthanc-server.com/download.php)

# Migration

## Start the application:

get Docker Compose from Orthanc Team
```

git clone https://github.com/orthanc-server/orthanc-setup-samples.git
cd orthanc-setup-samples/docker/postgresql

```
Modify the following in the Docker Compose file:
- Use PostgreSQL 12 to avoid pg_dump compatibility errors
- Add `yb` to the host list to connect to the YugabyteDB database when we stop the PostgreSQL one 
and start PostgreSQL (orthanc-index) and Orthanc (orthanc)

```


sed -e '/image/s/postgres:15/postgres:12/' -i docker-compose.yml
sed -e '/depends_on/s/^/#/'                -i docker-compose.yml
sed -e '/Host/s/orthanc-index/&,yb/'       -i docker-compose.yml
docker compose up -d orthanc-index
docker compose up -d orthanc

```

## Test the application:

Run the application (Orthanc Explorer 2) on http://localhost:8042/ui/app/index.html#/

Upload some DICOM files. 
You can get some 💀 from in https://medimodel.com/wp-content/uploads/2021/03/2_skull_ct.zip 
(upload the DICOM directory)

## Stop the application
```

docker compose stop orthanc 

```

## Start YugabyteDB

Add YugabyteDB service to docker compose:
```

  yb:
    image: yugabytedb/yugabyte:2024.1.1.0-b137
    command: bash -c 'rm -rf /tmp/.yb.* ; yugabyted start --ysql_port=5432 --enable_pg_parity_tech_preview --background=false --tserver_flags=yb_enable_read_committed_isolation=false,ysql_colocate_database_by_default=true'
    ports:
      - 15433:15433


```

I disable Read Commited to avoid `PostgreSQL error: ERROR:  SET TRANSACTION ISOLATION LEVEL must not be called in a subtransaction` [#12494](https://github.com/yugabyte/yugabyte-db/issues/12494)

Another option may be adding ` "TransactionMode": "ReadCommitted" ` in the PostgreSQL plugin settings ([doc](https://orthanc.uclouvain.be/book/plugins/postgresql.html#id13))

## Start YugabyteDB

Use the same database name, user and password, and also the same port 5432 so that there's no confict to change except the host name
```

docker compose up -d yb 

```

## Migrate with YugabyteDB Voyager

Start a container with the YugabyteDB voyager image and run the migration steps (the database is installed in the default database `postgres`)

```

docker run -it --rm --name ybv --network postgresql_default --link postgresql-orthanc-index-1:pg --link postgresql-yb-1:yb \
 yugabytedb/yb-voyager:1.7.2 \
 bash -xc '
yb-voyager assess-migration --export-dir /var/tmp --start-clean=true --source-db-host pg --source-db-user postgres --source-db-password postgres --source-db-name postgres --source-db-schema public --source-db-type postgresql --iops-capture-interval 0
cat /var/tmp/assessment/reports/assessmentReport.json
yb-voyager export schema    --export-dir /var/tmp --start-clean=true --source-db-host pg --source-db-user postgres --source-db-password postgres --source-db-name postgres --source-db-schema public --source-db-type postgresql
yb-voyager analyze-schema   --export-dir /var/tmp
cat /var/tmp/reports/schema_analysis_report.txt
yb-voyager import schema    --export-dir /var/tmp                    --target-db-host yb --target-db-user postgres --target-db-password postgres --target-db-name postgres --target-db-port=5432 --target-db-schema public <<<Y 
yb-voyager export data      --export-dir /var/tmp --start-clean=true --source-db-host pg --source-db-user postgres --source-db-password postgres --source-db-name postgres --source-db-schema public --source-db-type postgresql
yb-voyager import data      --export-dir /var/tmp                    --target-db-host yb --target-db-user postgres --target-db-password postgres --target-db-name postgres --target-db-port=5432
PGPASSWORD=password psql -h yb -p 5432 -U postgres -c 'analyze' postgres      
'

```

## Stop PostgreSQL and start the application with YugabyteDB

```

# Stop PostgreSQL
docker compose stop orthanc-index 

# Start Orthanc
docker compose start orthanc

docker compose logs orthanc

It fails with:
```
```
postgresql-orthanc-1  | W0830 20:27:45.380556             MAIN PluginsManager.cpp:158] An SQL transaction failed and
will likely be retried: ERROR:  advisory locks are not yet implemented
postgresql-orthanc-1  | HINT:  See https://github.com/yugabyte/yugabyte-db/issues/3642. React with thumbs up to raise its priority
```

Note the config file (`/tmp/orthanc.json`) already has `"Lock": false` ([doc](https://orthanc.uclouvain.be/book/plugins/postgresql.html#locking))
