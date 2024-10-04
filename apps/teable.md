# teable

The Next Gen Airtable Alternative: No-Code Postgres

[GitHub](https://github.com/teableio/teable)

1. Clone the [Repository](https://github.com/teableio/teable) and follow instruction guide to run application
2. visit the application at 'localhost:3000'. see its working
3. run yugabyteDB in docker in the same docker network

   ### Start Offline Migration

4. create export-schema directory
   ```.mkdir -p ./schema-export```
   
6. export schema with vb-voyager, run in docker

```
docker run --rm --network teable-standalone-network -v $(pwd)/schema-export:/workdir/schema-export yugabytedb/yb-voyager:latest yb-voyager export schema --export-dir /workdir/schema-export --source-db-type postgresql --source-db-host  standalone-teable-db-1 --source-db-user example --source-db-password example2password --source-db-name example --source-db-schema public
```

6. analyze exported schema to fix issues. none was found.
  ```
 yb-voyager analyze-schema --export-dir schema-export --output-format txt    
 ```
7. Export Postgres data with yb-voyager
   
```
docker run --rm --network teable-standalone-network -v $(pwd):/workdir yugabytedb/yb-voyager:latest yb-voyager export data --export-dir /workdir/schema-export --source-db-type postgresql --source-db-host teable-db --source-db-user example --source-db-password example2password --source-db-name example --source-db-schema public
```
8. move schema to target DB(yugabyteDB)
```
docker run --rm --network teable-standalone-network -v $(pwd):/workdir yugabytedb/yb-voyager:latest yb-voyager import schema --export-dir /workdir/schema-export --target-db-host yb-db --target-db-user user --target-db-password password --target-db-name db
```
9. move exported data to yugabyteDB

```
 docker run --rm --network teable-standalone-network -v $(pwd):/workdir yugabytedb/yb-voyager:latest yb-voyager import data --export-dir /workdir/schema-export --target-db-host yb-db --target-db-user user --target-db-password password --target-db-name db
```
10. run docker-compose down, to stop the application, edit and replace environment variables to point to yugabyteDB
11. restart the application and verify that it's running.

   
