# NewBlur

NewsBlur is a personal news reader that brings people together to talk about the world. A new sound of an old instrument.

[GitHub](https://github.com/samuelclay/NewsBlur)


# Steps for Migration (verified on M1 Mac1
1. Clone the repo and run the docker-compose file

```
git clone git@github.com:samuelclay/NewsBlur.git
cd NewsBlur
```
2. Update docker-compose.yml.
   1. Add yugabyte database as a service.
   2. Install npm install @postlight/mercury-parser explicitly in node. 
```commandline
version: '2'
services:

  yugabyte:
    image: yugabytedb/yugabyte:2.23.0.0-b710
    environment:
      YSQL_DB: newsblur
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
  newsblur_web:
    hostname: nb.com
    container_name: newsblur_web
    image: newsblur/newsblur_${NEWSBLUR_BASE:-python3}:latest
    # build:
    #   context: /srv/newsblur
    #   dockerfile: docker/newsblur_base_image.Dockerfile
    user: "${CURRENT_UID}:${CURRENT_GID}"
    environment:
      - DOCKERBUILD=True
      - RUNWITHMAKEBUILD=${RUNWITHMAKEBUILD?Use the `make` command instead of docker CLI}
    stdin_open: true
    tty: true
    restart: unless-stopped
    depends_on:
      - db_mongo
      - db_postgres
      - db_redis
      - db_elasticsearch
    ulimits:
      nproc: 10000
      nofile:
        soft: 10000
        hard: 10000
    ports:
      - 8000:8000
    # only use gunicorn if the TEST env variable is not "True"
    entrypoint: /bin/sh -c newsblur_web/entrypoint.sh
    volumes:
      - ${PWD}:/srv/newsblur

  newsblur_node:
    container_name: node
    image: newsblur/newsblur_node:latest
    user: "${CURRENT_UID}:${CURRENT_GID}"
    environment:
      - NODE_ENV=docker
      - MONGODB_PORT=29019
      - RUNWITHMAKEBUILD=${RUNWITHMAKEBUILD}
      - NPM_CONFIG_CACHE=/tmp/.npm  # Set a different cache directory
    command: sh -c "npm install @postlight/mercury-parser && node newsblur.js"node newsblur.js
    restart: unless-stopped
    stop_signal: HUP
    depends_on:
      - db_mongo
      - db_postgres
      - db_redis
    ports:
      - 8008:8008
    volumes:
      - ${PWD}/node:/srv
      - ${PWD}/node/originals:/srv/originals
      - /tmp/.npm:/tmp/.npm  # Mount the temp directory

  imageproxy:
    container_name: imageproxy
    # image: ghcr.io/willnorris/imageproxy:latest # Enable if you don't need arm64 and want the original imageproxy
    image: yusukeito/imageproxy:v0.11.2 # Enable if you want arm64
    user: "${CURRENT_UID}:${CURRENT_GID}"
    entrypoint: /app/imageproxy -addr 0.0.0.0:8088 -cache /tmp/imageproxy -verbose
    restart: unless-stopped
    ports:
      - 8088:8088
    volumes:
      - /tmp:/tmp/imageproxy

  nginx:
    container_name: nginx
    image: nginx:1.19.6
    restart: unless-stopped
    ports:
      - 81:81
    depends_on:
      - newsblur_web
      - newsblur_node
      - db_postgres
      - db_redis
      - db_mongo
      - db_elasticsearch
    environment:
      - DOCKERBUILD=True
    volumes:
      - ./docker/nginx/nginx.local.conf:/etc/nginx/conf.d/nginx.conf
      - ${PWD}:/srv/newsblur

  db_postgres:
    container_name: db_postgres
    image: postgres:13.1
    restart: unless-stopped
    environment:
      - POSTGRES_USER=newsblur
      - POSTGRES_PASSWORD=newsblur
    # healthcheck:
    #   test: ["CMD-SHELL", "pg_isready -U newsblur"]
    #   interval: 10s
    #   timeout: 5s
    #   retries: 5
    ports:
      - 5434:5432
    volumes:
      - ./docker/volumes/postgres:/var/lib/postgresql/data

  db_redis:
    container_name: db_redis
    image: redis:latest
    ports:
      - 6579:6579
    restart: unless-stopped
    volumes:
      - ./docker/redis/redis.conf:/etc/redis/redis.conf
      - ./docker/redis/redis_server.conf:/usr/local/etc/redis/redis_replica.conf
      - ./docker/volumes/redis:/data
    command: redis-server /etc/redis/redis.conf --port 6579

  db_elasticsearch:
    container_name: db_elasticsearch
    image: docker.elastic.co/elasticsearch/elasticsearch:7.16.3
    mem_limit: 512mb
    restart: unless-stopped
    environment:
      - discovery.type=single-node
    ports:
      - 9200:9200
      - 9300:9300
    volumes:
      - ./docker/volumes/elasticsearch:/usr/share/elasticsearch/data
      - ./config/elasticsearch/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml

  dejavu:
    container_name: dejavu
    image: appbaseio/dejavu:3.6.0
    restart: unless-stopped
    ports:
      - 1358:1358


  db_mongo:
    container_name: db_mongo
    image: mongo:4.0
    user: mongodb
    restart: unless-stopped
    ports:
      - 29019:29019
    command: mongod --port 29019
    volumes:
      - ./docker/volumes/db_mongo:/data/db

  task_celery:
    container_name: task_celery
    image: newsblur/newsblur_python3
    user: "${CURRENT_UID}:${CURRENT_GID}"
    command: "celery worker -A newsblur_web -B --loglevel=INFO"
    restart: unless-stopped
    volumes:
      - ${PWD}:/srv/newsblur
    environment:
      - DOCKERBUILD=True

  haproxy:
    container_name: haproxy
    image: haproxy:latest
    restart: unless-stopped
    depends_on:
      - nginx
      - newsblur_web
      - newsblur_node
      - imageproxy
      - db_redis
      - db_postgres
      - db_elasticsearch
      - db_mongo
    ports:
      - 80:80
      - 443:443
      - 1936:1936
    volumes:
      - ./docker/haproxy/haproxy.docker-compose.cfg:/usr/local/etc/haproxy/haproxy.cfg
      - ${PWD}:/srv/newsblur

```
3. Change the settings.py of django NewsBlur app acc to database.  
- If you want to run on postgres then use this json in docker_local_settings.py
```commandline
    DATABASES = {
    "default": {
        "NAME": "newsblur",
        "ENGINE": "django_prometheus.db.backends.postgresql",
        #'ENGINE': 'django.db.backends.mysql',
        "USER": "newsblur",
        "PASSWORD": "newsblur",
        "HOST": "db_postgres",
        "PORT": 5432,
    },
   }
```
- If you want to run on yugabyte then use this json in docker_local_settings.py
```commandline
DATABASES = {
    "default": {
        "NAME": "newsblur",
        "ENGINE": "django_prometheus.db.backends.postgresql",
        #'ENGINE': 'django.db.backends.mysql',
        "USER": "yugabyte",
        "PASSWORD": "yugabyte",
        "HOST": "yugabyte",
        "PORT": 5433,
    },
}
```


4. Above docker-compose file contains both DB_URL (postgres and yugabyte). You can connect to any database acc to your wish. 
5. Create directory for migration and for data.
```commandline
rm -rf data
mkdir -p data/yb_data
mkdir assess-dir
```
6. Attaching screenshots after running the application on localhost. 
<img width="1726" alt="Screenshot 2024-10-16 at 3 17 09 PM" src="https://github.com/user-attachments/assets/febb5795-0f50-491e-b3a0-b975038c5695">
<img width="1725" alt="Screenshot 2024-10-16 at 3 18 06 PM" src="https://github.com/user-attachments/assets/80daaa97-edca-43a8-a2aa-ea305638b44e">
<img width="1716" alt="Screenshot 2024-10-16 at 3 26 40 PM" src="https://github.com/user-attachments/assets/7076ab20-8f16-4fba-8df8-f14385965df2">

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
yb-voyager assess-migration --source-db-host localhost --source-db-port 5434 --source-db-type postgresql --source-db-user newsblur --source-db-name newsblur --source-db-password newsblur --source-db-schema "public" --send-diagnostics false --export-dir assess-dir --start-clean=true
```
2. export schema
```commandline
yb-voyager export schema --export-dir assess-dir --source-db-host localhost --source-db-port 5434 --source-db-type postgresql --source-db-user newsblur --source-db-name newsblur --source-db-password newsblur --source-db-schema "public" --send-diagnostics false
```
3.  analyze-schema
```commandline
yb-voyager analyze-schema --export-dir assess-dir --send-diagnostics false
```
4. export data
```commandline
yb-voyager export data --export-dir assess-dir --source-db-host localhost --source-db-port 5434 --source-db-type postgresql --source-db-user newsblur --source-db-name newsblur --source-db-password newsblur --source-db-schema "public" --send-diagnostics false
```
5. export data status
```commandline
yb-voyager export data status --export-dir assess-dir
```
6. import schema
```commandline
yb-voyager import schema --export-dir assess-dir --target-db-host localhost --target-db-user yugabyte --target-db-password yugabyte --target-db-name newsblur
```
7. import data
```commandline
yb-voyager import data --export-dir assess-dir --target-db-host localhost --target-db-user yugabyte --target-db-password yugabyte --target-db-name newsblur
```

8. import data status
```commandline
yb-voyager import data status --export-dir assess-dir
```
9. end migration
```commandline
yb-voyager end migration --export-dir assess-dir --backup-log-files true --backup-data-files true --backup-schema-files true --save-migration-reports true --backup-dir backup-dir/

```
### Congratulations! You have successfully migrated NewsBlur from PG to YB
