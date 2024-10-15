# logto

The better identity infrastructure for developers and the open-source alternative to Auth0.

[GitHub](https://github.com/logto-io/logto)

# Steps for Migration (verified on M1 Mac1
1. Clone the repo and run the docker-compose file

```
git clone git@github.com:logto-io/logto.git
cd logto
docker-compose up -d
```
2. 2. App will be running on http://localhost:3002 . You can do entries related to your project like users and organizations entry. 
3. Add yugabyte service to docker-compose.yml. 
```commandline
# This compose file is for demonstration only, do not use in prod.
version: "3.9"
services:
  app:
    depends_on:
    - postgres
    image: svhd/logto:${TAG-latest}
    entrypoint: ["sh", "-c", "npm run cli db seed -- --swe && npm start"]
    ports:
      - 3001:3001
      - 3002:3002
    environment:
      - TRUST_PROXY_HEADER=1
      - DB_URL=postgres://postgres:p0stgr3s@postgres:5432/logto
#      - DB_URL=postgres://yugabyte:yugabyte@logto_yugabyte:5433/logto
      # Mandatory for GitPod to map host env to the container, thus GitPod can dynamically configure the public URL of Logto;
      # Or, you can leverage it for local testing.
      - ENDPOINT
      - ADMIN_ENDPOINT
  postgres:
    image: postgres:14-alpine
    user: postgres
    volumes:
      - ./postgres/data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: p0stgr3s
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 10s
      timeout: 5s
      retries: 5
    ports:
      - "5432:5432"
  logto_yugabyte:
    image: yugabytedb/yugabyte:2.23.0.0-b710
    environment:
      YSQL_DB: logto
      YSQL_USER: yugabyte
      YSQL_PASSWORD: yugabyte
    restart: unless-stopped
    volumes:
      - "./data/yb_data:/home/yugabyte/yb_data"
    ports:
      - "7001:7000"
      - "9000:9000"
      - "15433:15433"
      - "5433:5433"
      - "9042:9042"
    command: [ "bin/yugabyted", "start", "--base_dir=/home/yugabyte/yb_data", "--background=false" ]

```
4. Above docker-compose file contains both DB_URL (postgres and yugabyte). You can connect to any database acc to your wish. 
5. Create directory for migration and for data.
```commandline
rm -rf data
rm -rf postgres
mkdir -p data/yb_data
mkdir -p ppstgres/data
mkdir assess-dir
```
## Offline Migration using voyager 

### Migrating to Yugabyte
1. install yb-voyager using docker
```commandline
docker pull yugabytedb/yb-voyager:1.8.2-rc2
wget -O ./yb-voyager https://raw.githubusercontent.com/yugabyte/yb-voyager/main/docker/yb-voyager-docker && chmod +x ./yb-voyager && sudo mv yb-voyager /usr/local/bin/yb-voyager

yb-voyager version
```
### Migration Steps
1. create assessment directory and run assessment 
```commandline
mkdir assess-dir
yb-voyager assess-migration --source-db-host localhost --source-db-port 5432 --source-db-type postgresql --source-db-user postgres --source-db-name logto --source-db-password p0stgr3s --source-db-schema "public" --send-diagnostics false --export-dir assess-dir --start-clean=true
```
2. export schema
```commandline
yb-voyager export schema --export-dir assess-dir --source-db-host localhost --source-db-port 5432 --source-db-type postgresql --source-db-user postgres --source-db-name logto --source-db-password p0stgr3s --source-db-schema "public" --send-diagnostics false
```
3.  analyze-schema
```commandline
yb-voyager analyze-schema --export-dir assess-dir --send-diagnostics false
```
4. export data
```commandline
yb-voyager export data --export-dir assess-dir --source-db-host localhost --source-db-port 5432 --source-db-type postgresql --source-db-user postgres --source-db-name logto --source-db-password p0stgr3s --source-db-schema "public" --send-diagnostics false
```
5. export data status
```commandline
yb-voyager export data status --export-dir assess-dir
```
6. import schema
```commandline
yb-voyager import schema --export-dir assess-dir --target-db-host localhost --target-db-user yugabyte --target-db-password yugabyte --target-db-name logto

```
7. import data
```commandline
yb-voyager import data --export-dir assess-dir --target-db-host localhost --target-db-user yugabyte --target-db-password yugabyte --target-db-name logto
```

8. import data status
```commandline
yb-voyager import data status --export-dir assess-dir
```
9. end migration
```commandline
yb-voyager end migration --export-dir assess-dir --backup-log-files true --backup-data-files true --backup-schema-files true --save-migration-reports true --backup-dir backup-dir/

```
### Congratulations! You have successfully migrated Logto from PG to YB