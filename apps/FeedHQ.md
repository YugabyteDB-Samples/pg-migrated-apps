# FeedHQ

FeedHQ is a web-based feed reader

[GitHub](https://github.com/feedhq/feedhq)

### Run app on PG. 
Refer to this README.md file for starting this app locally on pg. 
https://github.com/yugabyte/feedhq-pg-app-century/blob/main/README.md

### Steps for Migration from PG to YB

1. install yb-voyager using docker
```commandline
docker pull yugabytedb/yb-voyager:1.8.2-rc2

wget -O ./yb-voyager https://raw.githubusercontent.com/yugabyte/yb-voyager/main/docker/yb-voyager-docker && chmod +x ./yb-voyager && sudo mv yb-voyager /usr/local/bin/yb-voyager

yb-voyager version
```

2. Clean the yb db (if there is any table in feedhq db or data)
```commandline
cd feedhq-pg-app-century
rm -rf data
mkdir backup-dir
mkdir assess-dir
mkdir -p data/yb_data
# go to yb db service and clear all table and sequence if exists.
# Database feedhq should be clean and does not contain anything
# it should have user as feedhq, password as feedhq
docker exec -it feedhq-feedhq_yugabyte-1 bash
ysqlsh --host $(hostname) -d feedhq -U feedhq
# Enter password: feedhq 
# Check \dt, \d should be "no relations found"
```

### Migration Steps
1. run assessment
```commandline
yb-voyager assess-migration --source-db-host localhost --source-db-port 5432 --source-db-type postgresql --source-db-user feedhq --source-db-name feedhq --source-db-password feedhq --source-db-schema "public" --send-diagnostics false --export-dir assess-dir --start-clean=true
```
2. export schema
```commandline
yb-voyager export schema --export-dir assess-dir --source-db-host localhost --source-db-port 5432 --source-db-type postgresql --source-db-user feedhq --source-db-name feedhq --source-db-password feedhq --source-db-schema "public" --send-diagnostics false
```
3. analyze-schema
```commandline
yb-voyager analyze-schema --export-dir assess-dir --send-diagnostics false
```
4. export data status
```commandline
yb-voyager export data status --export-dir assess-dir
```
4. import schema. ( Make sure you dont ahve any relations in feedhq db. Otherwise it will fail)
```commandline
yb-voyager import schema --export-dir assess-dir --target-db-host localhost --target-db-user feedhq --target-db-password feedhq --target-db-name feedhq
```
5. import data
```commandline
yb-voyager import data --export-dir assess-dir --target-db-host localhost --target-db-user feedhq --target-db-password feedhq --target-db-name feedhq
```
6. import data status 
```commandline
yb-voyager import data status --export-dir assess-dir
```
7. end migration
```commandline
yb-voyager end migration --export-dir assess-dir --backup-log-files true --backup-data-files true --backup-schema-files true --save-migration-reports true --backup-dir backup-dir/
```
### Important Info- Appendix

Container name can be change when you deploy the services, so change the name of container according to your container.
Log in to container name: 
```commandline
docker exec -it <container_name> bash
```