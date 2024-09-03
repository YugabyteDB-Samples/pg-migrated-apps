# Wordpress

WordPress is among the most popular content management systems – it was used by 43.1% of the top 10 million websites as of December 2023

main repo is in subversion

pg4wp is a module used to make it run in PG

https://github.com/PostgreSQL-For-Wordpress

[GitHub](https://github.com/WordPress)

# Migration

We are using PG4WP (PostgreSQL For Wordpress) local developement docker compose

## Start the application with PostgreSQL:

```

git clone --recurse-submodules https://github.com/PostgreSQL-For-Wordpress/PG4WP-Local-Development.git
cd PG4WP-Local-Development

# Start the background services
docker-compose up -d nginx php-fpm db
# First time install
docker-compose exec php-fpm wp --allow-root core install --url=http://wordpress.localhost --title="Wordpress Local Dev" --admin_user=root --admin_email="root@example.com" --admin_password=secret

```
## Test the application:

Use the application on http://localhost:80/wp-admin ( user `root` password `secret` )

![image](https://github.com/user-attachments/assets/a3a0e0e0-20fc-4916-b20a-4ed0ae53fe5b)

## Stop the application
```

docker compose stop php-fpm

```

## Start YugabyteDB

Add YugabyteDB service to `docker-compose.yml`:
```

  yb:
    environment:
      YSQL_DB: wordpress
      YSQL_PASSWORD: supersecretpassword
      YSQL_USER: wordpress
    networks:
      - wordpress
    image: yugabytedb/yugabyte:2024.1.1.0-b137
    command: bash -c 'rm -rf /tmp/.yb.* ; yugabyted start --ysql_port=5432 --enable_pg_parity_tech_preview --background=false --tserver_flags=ysql_colocate_database_by_default=true'
    ports:
      - 15433:15433

```

Start YugabyteDB and stop the application
```

docker compose up -d yb 
docker compose stop php-fpm

```

## Migrate with YugabyteDB Voyager
Start a container with the YugabyteDB voyager image and run the migration steps

```

docker run -it --rm --name ybv --network pg4wp-local-development_wordpress --link pg4wp-local-development-db-1:pg --link yb:yb \
 yugabytedb/yb-voyager:1.7.2 \
 bash -xc '
yb-voyager assess-migration --export-dir /var/tmp --start-clean=true --source-db-host pg --source-db-user wordpress --source-db-password supersecretpassword --source-db-name wordpress --source-db-schema public --source-db-type postgresql --iops-capture-interval 0
cat /var/tmp/assessment/reports/assessmentReport.json
yb-voyager export schema    --export-dir /var/tmp --start-clean=true --source-db-host pg --source-db-user wordpress --source-db-password supersecretpassword --source-db-name wordpress --source-db-schema public --source-db-type postgresql
yb-voyager analyze-schema   --export-dir /var/tmp
cat /var/tmp/reports/schema_analysis_report.txt
sed -e "s/CREATE INDEX /CREATE INDEX NONCONCURRENTLY /" -i /var/tmp/schema/tables/INDEXES_table.sql
yb-voyager import schema    --export-dir /var/tmp                    --target-db-host yb --target-db-user wordpress --target-db-password supersecretpassword --target-db-name wordpress --target-db-schema public --target-db-port=5432
yb-voyager export data      --export-dir /var/tmp --start-clean=true --source-db-host pg --source-db-user wordpress --source-db-password supersecretpassword --source-db-name wordpress --source-db-schema public --source-db-type postgresql
yb-voyager import data      --export-dir /var/tmp                    --target-db-host yb --target-db-user wordpress --target-db-password supersecretpassword --target-db-name wordpress --target-db-port=5432
PGPASSWORD=supersecretpassword psql -h yb -p 5432 -U wordpress -c 'analyze' wordpress
'

```

## Stop PostgreSQL

```

docker compose stop db


```

## Start the application with new database endpoint

Change the host and start the application

```

sed -e "/DB_HOST/s/db/yb/" -i wordpress/wp-config.php

docker compose up -d  nginx php-fpm yb

```

Wordpress is now running on YugabyteDB

