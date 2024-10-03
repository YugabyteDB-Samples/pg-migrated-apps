# waline

A Simple, Safe Comment System

[GitHub](https://github.com/walinejs/waline)

# Steps for Migration (verified on M1 Mac1)
1. starting postgres
```
docker run -it --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=postgres  -p 5432:5432 postgres:12
```
2. Cloning the repo and updating the docker-compose file to use above postgres
```
git clone https://github.com/lizheming/waline.git
cd waline/packages/server
```
Updating docker-compose.yml
```yml
# docker-compose.yml
version: '3'
services:
 waline:
   container_name: waline
   image: lizheming/waline:latest
   restart: always
   ports:
     - 127.0.0.1:8360:8360
   volumes:
     - ${PWD}/data:/app/data
   environment:
     TZ: 'Asia/Shanghai'
     PG_DB: postgres
     PG_USER: postgres
     PG_PASSWORD: postgres
     PG_HOST: postgres
     PG_PORT: 5432

```
3. Before running docker-compose import ddl mentioned in file https://github.com/walinejs/waline/blob/main/assets/waline.pgsql
4. Run docker-compose file and app will be running on http://127.0.0.1:8360 .
![image](https://github.com/user-attachments/assets/f7fb15b1-f9ab-4a88-9e5b-b8948779ea6b)
![image](https://github.com/user-attachments/assets/8e46e49a-37ab-44b9-ac22-f84bf308dab3)

5 Start Yugabyte Container
```
docker run -d --name yugabyte -p 5433:5433 \
 --hostname yugabyte -e YSQL_DB=yugabyte -e YSQL_USER=yugabyte -e YSQL_PASSWORD=yugabyte \
 yugabytedb/yugabyte:2024.1.2.0-b77 \
 bash -c 'rm -rf /tmp/.yb.* ; yugabyted start --enable_pg_parity_tech_preview --background=false --tserver_flags=ysql_colocate_database_by_default=true'
```
6 Start offline migration
```
docker run -it --name ybv --link postgres:pg --link yugabyte:yb \
 yugabytedb/yb-voyager:1.8.2 \
 bash -c '
yb-voyager assess-migration --export-dir /var/tmp --start-clean=true --source-db-host pg --source-db-user postgres --source-db-password postgres --source-db-name postgres --source-db-schema public --source-db-type postgresql --iops-capture-interval 0
cat /var/tmp/assessment/reports/assessmentReport.json
yb-voyager export schema    --export-dir /var/tmp --start-clean=true --source-db-host pg --source-db-user postgres --source-db-password postgres --source-db-name postgres --source-db-schema public --source-db-type postgresql
yb-voyager analyze-schema   --export-dir /var/tmp
cat /var/tmp/reports/schema_analysis_report.txt
yb-voyager import schema    --export-dir /var/tmp                    --target-db-host yb --target-db-user yugabyte --target-db-password yugabyte --target-db-name yugabyte --target-db-schema public
yb-voyager export data      --export-dir /var/tmp --start-clean=true --source-db-host pg --source-db-user postgres --source-db-password postgres --source-db-name postgres --source-db-schema public --source-db-type postgresql
yb-voyager import data      --export-dir /var/tmp                    --target-db-host yb --target-db-user yugabyte --target-db-password yugabyte --target-db-name yugabyte
'
```
7. Change docker-compose file
```yml
# docker-compose.yml
version: '3'

services:
  waline:
    container_name: waline
    image: lizheming/waline:latest
    restart: always
    ports:
      - 127.0.0.1:8360:8360
    volumes:
      - ${PWD}/data:/app/data
    environment:
      TZ: 'Asia/Shanghai'
      PG_DB: yugabyte
      PG_USER: yugabyte
      PG_PASSWORD: yugabyte
      PG_HOST: host.docker.internal
      PG_PORT: 5433
```
8. Restart the waline docker container
9. App migrated and running successfuly 

   
