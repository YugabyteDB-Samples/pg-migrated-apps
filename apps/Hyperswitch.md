# Hyperswitch

An open source payments switch written in Rust to make payments fast, reliable and affordable

[GitHub](https://github.com/juspay/hyperswitch)

# Run Hyperswitch app on PG

- start docker daemon

- create base directory and cd into it
```sh
mkdir base
cd base 
```

- clone the github repository for the latest code(available )
```sh
git clone --depth 1 --branch latest https://github.com/juspay/hyperswitch
cd hyperswitch
```

- run the application using docker-compose
```sh
docker-compose up -d
```

- health check
```sh
curl --head --request GET 'http://localhost:8080/health'
```


Congratulations! your app is now running at http://localhost:9000/dashboard/login 

- create couple of user logins.


# Migrating Hyperswitch app to Yugabyte

- add following content to the docker-compose.yml file
```yml
  yugabyte:
    image: yugabytedb/yugabyte:2024.1.3.0-b105
    restart: unless-stopped
    container_name: yugabyte
    volumes:
      - yb_data:/home/yugabyte/yb_data
    ports:
      - "7000:7000"
      # - "9000:9000"
      - "15433:15433"
      - "5433:5433"
      - "9042:9042"
    command: ["bin/yugabyted", "start", "--base_dir=/home/yugabyte/yb_data", "--background=false"]
    networks:
      - router_net
```

- start yugabyte docker service
```sh
docker-compose up -d yugabyte
```

- create database, user to be used in app configuration
```sh
docker exec -it yugabyte bash
./bin/ysqlsh --host $(hostname)

# run following on ysql shell
CREATE DATABASE hyperswitch_db WITH COLOCATION=true;
CREATE USER db_user WITH PASSWORD 'db_pass' SUPERUSER CREATEDB CREATEROLE INHERIT LOGIN;
```


## Run migration from PG to YB using Yugabyte Voyager

- install yb-voyager using docker
```sh
docker pull yugabytedb/yb-voyager:latest
wget -O ./yb-voyager https://raw.githubusercontent.com/yugabyte/yb-voyager/main/docker/yb-voyager-docker && chmod +x ./yb-voyager && sudo mv yb-voyager /usr/local/bin/yb-voyager

yb-voyager version
```

- create assessment directory
```sh
mkdir assess-dir
```

- Optional: export following to see migration status on YugabyteD UI
```sh
export CONTROL_PLANE_TYPE=yugabyted
export YUGABYTED_DB_CONN_STRING=postgresql://yugabyte:yugabyte@127.0.0.1:5433
```

- run assess migration
```sh
yb-voyager assess-migration --source-db-host localhost \
--source-db-port 5432 --source-db-type postgresql \
--source-db-user db_user --source-db-name hyperswitch_db \
--source-db-password db_pass --source-db-schema "public" \
--send-diagnostics false --export-dir assess-dir
```

- export schema
```sh
yb-voyager export schema --export-dir assess-dir --source-db-host localhost \
--source-db-port 5432 --source-db-type postgresql --source-db-user db_user \
--source-db-name hyperswitch_db --source-db-password db_pass \
--source-db-schema "public" --send-diagnostics false
```

- analyze-schema
```sh
yb-voyager analyze-schema --export-dir assess-dir --send-diagnostics false
```

- export data
```sh
yb-voyager export data --export-dir assess-dir --source-db-host localhost \
--source-db-port 5432 --source-db-type postgresql --source-db-user db_user \
--source-db-name hyperswitch_db --source-db-password db_pass \
--source-db-schema "public" --send-diagnostics false
```

- export data status
```sh
yb-voyager export data status --export-dir assess-dir
```

- import schema
```sh
yb-voyager import schema --export-dir assess-dir --target-db-host localhost \
--target-db-user db_user --target-db-password db_pass \
--target-db-name hyperswitch_db 
```

- import data
```sh
yb-voyager import data --export-dir assess-dir --target-db-host localhost \
--target-db-user db_user --target-db-password db_pass \
--target-db-name hyperswitch_db 
```

- import data status check
```sh
yb-voyager import data status --export-dir assess-dir
```

- stop the application services
```sh
docker-compose down hyperswitch-control-center
docker-compose down hyperswitch-web
docker-compose down hyperswitch-server
docker-compose down redis-standalone
```

- take down the postgres service and remove the configuration from ```docker-compose.yml```
```sh
docker-compose down pg
```

- change the config file ```config/docker_compose.toml``` to point to yugabyte service instead. Change port from 5432 to 5433 and host from pg/localhost to yugabyte


- restart the application services
```sh
docker-compose up -d redis-standalone
docker-compose up -d hyperswitch-server
docker-compose up -d hyperswitch-web
docker-compose up -d hyperswitch-control-center
```



- Optional: check yugabyteD UI -> databases to see if the yugabytedb has the tables migrated

- check application health using health check
```sh
curl --head --request GET 'http://localhost:8080/health'
```

- check the UI by logging into the application

- create new users to see if the application is working as expected.

- also create ysqlsh connection to the yugabyte db and check if the new data is indeed going to the new database

- end migration
```sh
mkdir backup-dir

yb-voyager end migration --export-dir assess-dir --backup-log-files true \
--backup-data-files true --backup-schema-files true \
--save-migration-reports true --backup-dir backup-dir/
```

## Congratulations! You have successfully migrated Hyperswitch app from PG to YB


### Fresh install of the app on YugabyteDB
Faced issue with the application's setup migration scripts. Relevant bug JIRA: https://yugabyte.atlassian.net/browse/DB-7005

Issue can be reproduced with this sample sql script.

```sql
CREATE TABLE foo (bar int);
insert into foo values(1);

BEGIN;
	ALTER TABLE foo ADD COLUMN country VARCHAR(255);

	UPDATE foo set country = 'US';

	ALTER TABLE foo ALTER COLUMN country SET NOT NULL; -- fails here with `ERROR:  column "country" contains null values`
COMMIT;
```

### Tools and versions
- YugabyteDB docker image ```yugabytedb/yugabyte:2024.1.3.0-b105```
- Yugabyte Voyager docker image ```yugabytedb/yb-voyager:1.8.3```
- postgres docker image ```postgres:15```
- docker desktop ```Docker version 27.0.3, build 7d4bcd8```
- docker-compose ```Docker Compose version v2.28.1-desktop.1```
- MacOS Sonoma 14.7


