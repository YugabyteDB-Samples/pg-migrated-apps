# FeedHQ

FeedHQ is a web-based feed reader

[GitHub](https://github.com/feedhq/feedhq)

# feedhq-pg-app-century
Migrating Feedhq app from PG to YB with Voyager
Refer to repo for local setup in mac m1. As we have to change some requirements for python to run on local M1. 
https://github.com/yugabyte/feedhq-pg-app-century

## Tech & versions used
- Docker
- Postgres docker image ```postgres:13```
- YugabyteDB docker image ```yugabytedb/yugabyte:2.23.0.0-b710```
- Yugabyte Voyager docker image ```yugabytedb/yb-voyager:1.8.2-rc2```
- ElasticSearch docker image ```elasticsearch:7.10.0```
- Redis
- Django Setup- docker file is present [Dockerfile](Dockerfile)


## 1. Run FeedHq on PG

1. Getting the code:
```commandline
git clone git@github.com:yugabyte/feedhq-pg-app-century.git
cd feedhq-pg-app-century
mkdir backup-dir
mkdir assess-dir
mkdir -p data/yb_data
mkdir -p postgres/data
```
2. Build the docker image for django app:
```commandline
docker build -t django_app:0.1 .
```
3. Start services using docker-compose
```commandline
docker-compose up -d
```
4. Check all services are up and running fine
```commandline
docker ps -a
feedhq dashboard: http://localhost:8001/login/
```
5. Make sure databases setting in  [settings.py](feedhq/settings.py) will look like this:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': "feedhq",
        'USER': "feedhq",
        'PASSWORD': "feedhq",
        'HOST': "feedhq_postgres", # write postgres container name here
        'PORT': "5432",
        'OPTIONS': {
            'options': '-c timezone=UTC',
        },
    }
}
```
6. Go to feedhq_postgres service and check feedhq database is created or not
```commandline
docker exec -it feedhq-feedhq_postgres-1 bash
psql -U feedhq -d feedhq
#(if not created then create database feedhq)
```
6. Migrate the db in django app
```commandline
docker exec -it django_app bash
python -V 
# This should come as python3.6
python manage.py migrate
```
7. Check ElasticSearch is running fine. Go to Go to UI http://localhost:9200/. Response will look like this:
```json
    {
        "name": "1038ae0e61e5",
        "cluster_name": "docker-cluster",
        "cluster_uuid": "ekDZCVf8SUm0bL_XC6wLIQ",
        "version": {
        "number": "7.10.0",
        "build_flavor": "default",
        "build_type": "docker",
        "build_hash": "51e9d6f22758d0374a0f3f5c6e8f3a7997850f96",
        "build_date": "2020-11-10T02:06:27.342163Z",
        "build_snapshot": false,
        "lucene_version": "8.7.0",
        "minimum_wire_compatibility_version": "6.8.0",
        "minimum_index_compatibility_version": "6.0.0-beta1"
        },
        "tagline": "You Know, for Search"
}
```
8. Create Index for ElasticSearch
```commandline
curl -X PUT "http://localhost:9200/feedhq" -H 'Content-Type: application/json' -d '{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 1
  }
}'
```
9. Add mapping in above feedhq index: 
```commandline
curl -X PUT "http://localhost:9200/feedhq/_mapping" -H 'Content-Type: application/json' -d '{
  "properties": {
    "timestamp": {
      "type": "date"
    },
    "id": {
      "type": "integer"
    },
    "title": {
      "type": "text"
    },
    "raw_title": {
      "type": "text"
    },
    "author": {
      "type": "text"
    },
    "content": {
      "type": "text"
    },
    "link": {
      "type": "keyword"
    },
    "guid": {
      "type": "keyword"
    },
    "read": {
      "type": "boolean"
    },
    "read_later_url": {
      "type": "keyword"
    },
    "starred": {
      "type": "boolean"
    },
    "broadcast": {
      "type": "boolean"
    },
    "tags": {
      "type": "keyword"
    },
    "user": {
      "type": "integer"
    },
    "feed": {
      "type": "integer"
    },
    "category": {
      "type": "integer"
    }
  }
}'


```
10. Create Superuser for Django Application
```commandline
docker exec -it django_app bash
python manage.py createsuperuser
```
11. Add permission to above createdsuperuser
```commandline
docker exec -it feedhq-feedhq_postgres-1 bash
psql -U feedhq -d feedhq
update auth_user set is_active=true where id=1;
```
12. Go to admin page and do some entries in feedhq db. 
```commandline
http://localhost:8001/admin/
# Add entries in all the tables
```


## 2. Run FeedHq on YB

1. Go to yugabyte container and check feedhq database is created or not
```commandline
docker exec -it feedhq-feedhq_yugabyte-1 bash
```
```commandline
ysqlsh --host $(hostname) 
#password= yugabyte
# Change database to feedhq. If it is not created then create db feedhq.
\c feedhq;
```

2. Change [settings.py](feedhq/settings.py) database block to point to YB database.
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': "feedhq",
        'USER': "feedhq",
        'PASSWORD': "feedhq",
        'HOST': "feedhq_yugabyte", #yugabyte container host name
        'PORT': "5433",
        'OPTIONS': {
            'options': '-c timezone=UTC',
        },
    }
}
```
3. Migrate the data from django app
```commandline
docker exec -it django_app bash
python -V 
# This should come as python3.6
python manage.py migrate
# now all tables created in yb db also
```
4. Follow the same step to add entries now in yb db also.
```commandline
# Create super user
docker exec -it django_app bash
python manage.py createsuperuser
docker exec -it feedhq-feedhq_yugabyte-1 bash
ysqlsh --host $(hostname) 
update auth_user set is_active=true where id=1;
# Add entries from admin page now- http://localhost:8001/admin/
```
## 3. Migrate feedhq app from PG to YB using yb-voyager

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
4. export data 
```commandline
yb-voyager export data --export-dir assess-dir --source-db-host localhost --source-db-port 5432 --source-db-type postgresql --source-db-user feedhq --source-db-name feedhq --source-db-password feedhq --source-db-schema "public" --send-diagnostics false
```
5. export data status
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


## Author
- [@chahatagrawal117](https://github.com/chahatagrawal117)
