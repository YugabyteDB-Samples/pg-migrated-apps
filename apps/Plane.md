# Plane

Open Source JIRA, Linear and Asana Alternative.

[GitHub](https://github.com/makeplane/plane)

# Migration

### Start Application
1. After cloning the repository, run `docker compose -f docker-compose-local.yml up -d`
2. see that the application is running at [http:localhost:8080](http://localhost:8080.). create an account and create a project
### Start YugabyteDB
4. start the yugabyteDB container by running the following command. remember to run in the same docker network as the application
```
   docker run -d --network plane_dev_env --name plane-yb  --hostname yb -e YSQL_DB=db -e YSQL_USER=user -e YSQL_PASSWORD=password --health-cmd="PGPASSWORD=password postgres/bin/pg_isready -h yb -p 5433 -U user -d db" --health-interval=3s --health-timeout=3s yugabytedb/yugabyte:latest bash -c 'rm -rf /tmp/.yb.* ; yugabyted start --enable_pg_parity_tech_preview --background=false'
   ```
### Performing Offline Migration
5. Export source db (Postgres) schema
```
docker run --rm --network plane_dev_env -v $(pwd):/workdir yugabytedb/yb-voyager:latest yb-voyager export schema --export-dir /workdir/schema-export --ignore-exist true --target-db-host plane-yb --target-db-user user --target-db-password password --target-db-name db

 ```
6. Export source db (postgres) data
```
docker run --rm --network plane_dev_env -v $(pwd):/workdir yugabytedb/yb-voyager:latest yb-voyager export data --export-dir /workdir/schema-export --ignore-exist true --target-db-host plane-yb --target-db-user user --target-db-password password --target-db-name db

```
7. Import Schema to target db(YugabyteDB). This might take a long time to complete, it took about 5 hours for me. if the importation to target db was interrupted at any point in time run the same command with `--ignore-exist` flag
```
docker run --rm --network plane_dev_env -v $(pwd):/workdir yugabytedb/yb-voyager:latest yb-voyager import schema --export-dir /workdir/schema-export --target-db-host plane-yb --target-db-user user --target-db-password password --target-db-name db 

```
8. Refresh materialise views
   
```
   docker run --rm --network plane_dev_env -v $(pwd):/workdir yugabytedb/yb-voyager:latest yb-voyager import schema --export-dir /workdir/schema-export --ignore-exist true --target-db-host plane-yugab --target-db-user user --target-db-password password --target-db-name db --post-snapshot-import true --refresh-mviews true
```
8.Import Data to target db(yugabyteDB).
```
docker run --rm --network plane_dev_env -v $(pwd):/workdir yugabytedb/yb-voyager:latest yb-voyager import data --export-dir /workdir/schema-export --target-db-host plane-yugab --target-db-user user --target-db-password password --target-db-name db 

```
### Restarting the Application
- change environment variables to point to yugabyteDB
- Comment out the database services in the docker-compose.yml file, including any dependencies on these services
- run `docker compose -f docker-compose-local.yml up -d` again, verify the application.
