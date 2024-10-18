# sqorn

A Javascript library for building SQL queries

[GitHub](https://github.com/sqorn/sqorn)




# Steps for Migration (verified on M1 Mac)
1. Clone the repo and add all the dependencies.

```
git clone git@github.com:sqorn/sqorn.git
cd sqorn
npm i
```

2. Create .env file in root directory and add credentials to that file for connection of postgres.
```commandline
PGHOST=127.0.0.1
PGUSER=squorn
PGPASSWORD=squorn
PGPORT=5432
PGDATABASE=squorn
```
3. Update docker-compose.yml.
   1. Add yugabyte database as a service.
```commandline
version: '3'

services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: squorn
      POSTGRES_USER: squorn
      POSTGRES_PASSWORD: squorn
    volumes:
      - ./postgres/data:/var/lib/postgresql/data
    ports:
      - "5432:5432"  # Exposes PostgreSQL to host if needed
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U feedhq"]
      interval: 10s
      timeout: 5s
      retries: 5
  yugabyte:
    image: yugabytedb/yugabyte:2.23.0.0-b710
    environment:
      YSQL_DB: yugabyte
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
3. Change the .env according to the connection of database.
4. Start the tests of sqorn library by running. 
```commandline
npm test
```

5. If above step is successful then you can try sqorn library by adding some of the entries in that database. It is working fine for me.
6. Attaching screenshots after running the tests.

7. Create directory for migration and for data.
```commandline
rm -rf data
mkdir -p data/yb_data
mkdir assess-dir
```
<img width="1724" alt="Screenshot 2024-10-18 at 12 39 40 PM" src="https://github.com/user-attachments/assets/3445cb70-71b2-4515-bcc0-68b3b6fd0342">



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
yb-voyager assess-migration --source-db-host localhost --source-db-port 5432 --source-db-type postgresql --source-db-user squorn --source-db-name squorn --source-db-password squorn --source-db-schema "public" --send-diagnostics false --export-dir assess-dir --start-clean=true
```
2. export schema
```commandline
yb-voyager export schema --export-dir assess-dir --source-db-host localhost --source-db-port 5432 --source-db-type postgresql --source-db-user squorn --source-db-name squorn --source-db-password squorn --source-db-schema "public" --send-diagnostics false
```
3.  analyze-schema
```commandline
yb-voyager analyze-schema --export-dir assess-dir --send-diagnostics false
```
4. export data
```commandline
yb-voyager export data --export-dir assess-dir --source-db-host localhost --source-db-port 5432 --source-db-type postgresql --source-db-user squorn --source-db-name squorn --source-db-password squorn --source-db-schema "public" --send-diagnostics false
```
5. export data status
```commandline
yb-voyager export data status --export-dir assess-dir
```
6. import schema
```commandline
yb-voyager import schema --export-dir assess-dir --target-db-host localhost --target-db-user yugabyte --target-db-password yugabyte --target-db-name yugabyte
```
7. import data
```commandline
yb-voyager import data --export-dir assess-dir --target-db-host localhost --target-db-user yugabyte --target-db-password yugabyte --target-db-name yugabyte
```

8. import data status
```commandline
yb-voyager import data status --export-dir assess-dir
```
9. end migration
```commandline
yb-voyager end migration --export-dir assess-dir --backup-log-files true --backup-data-files true --backup-schema-files true --save-migration-reports true --backup-dir backup-dir/

```
### Congratulations! You have successfully migrated sqorn from PG to YB
