# Plume

A a federated blogging engine, based on ActivityPub.

[GitHub](https://github.com/Plume-org/Plume)


## Running app on postgres

- start docker daemon

- create docker-compose.yml file with content
```yml
services:
  postgres:
    image: postgres:10.5
    platform: linux/amd64 
    env_file: .env
    restart: unless-stopped
    volumes:
      - "./data/postgres:/var/lib/postgresql/data"
    ports:
      - "5432:5432"
  plume:
    image: plumeorg/plume:latest
    platform: linux/amd64 
    env_file: .env
    restart: unless-stopped
    volumes:
      - "./data/plume/static/media:/app/static/media"
      - "./.env:/app/.env"
      - "./search_index:/app/search_index"
      - "./wait/wait-for-it.sh:/wait/wait-for-it.sh"
    ports:
      - "7878:7878"
    depends_on:
      - postgres
```

- generate random secret key
```sh 
openssl rand -base64 32
```

- create .env file with required content
```sh
# DATABASE SETUP
POSTGRES_PASSWORD=passw0rd
POSTGRES_USER=plume
POSTGRES_DB=plume

DATABASE_URL=postgres://plume:passw0rd@postgres:5432/plume
MIGRATION_DIRECTORY=migrations/postgres
USE_HTTPS=0
ROCKET_ADDRESS=0.0.0.0
ROCKET_PORT=7878
RUST_LOG=info
RUST_BACKTRACE=1

# The secret key for private cookies and CSRF protection
# You can generate one with `openssl rand -base64 32`
ROCKET_SECRET_KEY=<secret>
```

- run cleanup script to create clean dir structure
```sh 
./clean-start.sh
```

- start the yugabyte docker container only
```sh 
docker-compose up -d postgres
```

- run migration in throaway plum instance
```sh 
docker-compose run --rm plume plm migration run
```

- run search init 
```sh 
docker-compose run --rm plume plm search init
```

- create new local instance
```sh 
docker-compose run --rm plume plm instance new \
-d 'localhost:7878' -n 'sshaikh-blog'
```

- create the admin users
```sh 
docker-compose run --rm plume plm users new -n 'sshaikh' \
-N 'shahrukh' -b 'bio' -e 'sshaikh@localhost.com' \
-p 'pass123' --admin
```

- start Plume docker service
```sh 
docker-compose up -d plume
```

- Plume is accessible at http://localhost:7878/

- Login to plume and create some blogs for data.
<img width="1727" alt="Screenshot 2024-10-07 at 11 50 07 AM" src="https://github.com/user-attachments/assets/f0f43fed-c325-4034-8ded-bddf230946d7">
<img width="1725" alt="Screenshot 2024-10-07 at 11 50 31 AM" src="https://github.com/user-attachments/assets/4a3ae737-42f5-4c16-a2e2-abab0ebb7b02">



## Migrating to yugabyte

- install yb-voyager using docker 
```sh
docker pull yugabytedb/yb-voyager:1.8.2-rc1

wget -O ./yb-voyager \
https://raw.githubusercontent.com/yugabyte/yb-voyager/main/docker/yb-voyager-docker && \
chmod +x ./yb-voyager && sudo mv yb-voyager /usr/local/bin/yb-voyager

yb-voyager version
```

- add following configuration to the docker-compose.yml file
```yml
  yugabyte:
    image: yugabytedb/yugabyte:2.23.0.0-b710
    restart: unless-stopped
    volumes:
      - "./data/yb_data:/home/yugabyte/yb_data"
    ports:
      - "7000:7000"
      - "9000:9000"
      - "15433:15433"
      - "5433:5433"
      - "9042:9042"
    command: ["bin/yugabyted", "start", "--base_dir=/home/yugabyte/yb_data", "--background=false"]
```

- start yugabytedb service
```sh
docker-compose up -d yugabyte
```

- create plume db, ybvoyager user with appropriate permissions in yugabytedb database(target)
```sh
docker exec -it migrate-yugabyte-1 ./bin/ysqlsh 
```

```sql
create database plume with colocation=true;
CREATE USER ybvoyager SUPERUSER PASSWORD 'password';

GRANT yb_superuser TO ybvoyager;

```

## Migrations steps

- Optional: export following to see migration status on YugabyteD UI
```sh
export CONTROL_PLANE_TYPE=yugabyted
export YUGABYTED_DB_CONN_STRING=postgresql://yugabyte:yugabyte@127.0.0.1:5433
```

- create assessment directory and run assessment
```sh
mkdir assess-dir

yb-voyager assess-migration --source-db-host localhost --source-db-port 5432 \
--source-db-type postgresql --source-db-user plume --source-db-name plume \
--source-db-password passw0rd --source-db-schema "public" --send-diagnostics \
false --export-dir assess-dir
```

- export schema
```sh
yb-voyager export schema --export-dir assess-dir --source-db-host localhost \
--source-db-port 5432 --source-db-type postgresql --source-db-user plume \
--source-db-name plume --source-db-password passw0rd \
--source-db-schema "public" --send-diagnostics false
```

- analyze-schema
```sh
yb-voyager analyze-schema --export-dir assess-dir --send-diagnostics false
```

- export data
```sh
yb-voyager export data --export-dir assess-dir --source-db-host localhost \
--source-db-port 5432 --source-db-type postgresql --source-db-user plume \
--source-db-name plume --source-db-password passw0rd \
--source-db-schema "public" --send-diagnostics false
```

- export data status
```sh
yb-voyager export data status --export-dir assess-dir
```

- import schema
```sh
yb-voyager import schema --export-dir assess-dir --target-db-host localhost \
--target-db-user ybvoyager --target-db-password password \
--target-db-name plume 
```

- import data
```sh
yb-voyager import data --export-dir assess-dir --target-db-host localhost \
--target-db-user ybvoyager --target-db-password password \
--target-db-name plume 
```

- import data status
```sh
yb-voyager import data status --export-dir assess-dir
```


## Change the app config to point to Yugabyte databse 

- remove following contents from the .env file
```sh
# DATABASE SETUP
POSTGRES_PASSWORD=passw0rd
POSTGRES_USER=plume
POSTGRES_DB=plume

# you can safely leave those defaults
DATABASE_URL=postgres://plume:passw0rd@postgres:5432/plume
MIGRATION_DIRECTORY=migrations/postgres
```

- add following content to the .env file

```sh
DATABASE_URL=postgres://ybvoyager:password@yugabyte:5433/plume
MIGRATION_DIRECTORY=migrations/yugabyte
```

- change docker-compose.yml, plume service depends on yugabyte
```yml
    depends_on:
      - yugabyte
```

- restart plume app

```sh
docker-compose down plume
docker-compose up -d plume --no-deps
```

- validate the migration by logging into the app(check previously created blogs)

- create new blog "Migrated to Yugabyte using yb-voyager"
<img width="1717" alt="Screenshot 2024-10-07 at 12 29 30 PM" src="https://github.com/user-attachments/assets/8a373674-a19e-43b7-895c-34ab59501325">


- end migration
```sh
yb-voyager end migration --export-dir assess-dir --backup-log-files true \
--backup-data-files true --backup-schema-files true \
--save-migration-reports true --backup-dir backup-dir/
```

- remove postgres service and remove respective service block from docker-compose.yml
```sh
docker-compose down postgres
```

### Congratulations! You have successfully migrated Plume from PG to YB
