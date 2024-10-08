# Mouthful

Mouthful is a self-hosted alternative to Disqus

[GitHub](https://github.com/vkuznecovas/mouthful)

# Run Mouthful app on PG

- start docker daemon

- create base directory and cd into it
```sh
mkdir base
cd base 
```

- clone the github repository for the latest code(available )
```sh
git clone https://github.com/vkuznecovas/mouthful.git
```

- replace mouuthful/Dockerfile with following(corrected dockerfile)
```sh
FROM golang:1.15.2-alpine
ENV CGO_ENABLED=${CGO_ENABLED:-1} \
    GOOS=${GOOS:-linux} \
    MOUTHFUL_VER=${MOUTHFUL_VER:-master}

RUN wget https://github.com/upx/upx/releases/download/v3.96/upx-3.96-amd64_linux.tar.xz \
    && tar -xf upx-3.96-amd64_linux.tar.xz \
    && mv upx-3.96-amd64_linux/upx /usr/local/bin/ \
    && rm -rf upx-3.96-amd64_linux* 
RUN apk add --no-cache python2
RUN set -ex; \
    apk add --no-cache bash build-base curl git && \
    echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories && \
    echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories && \
    apk add --no-cache nodejs nodejs-npm 
WORKDIR /go/src/github.com/vkuznecovas/mouthful
COPY . /go/src/github.com/vkuznecovas/mouthful
RUN ./build.sh && \
    cd dist/ && \
    upx --best mouthful

FROM alpine:3.7
COPY --from=0 /go/src/github.com/vkuznecovas/mouthful/dist/ /app/
# this is needed if we're using ssl
RUN apk add --no-cache ca-certificates
WORKDIR /app/
VOLUME [ "/app/data" ]
EXPOSE 8080
CMD ["/app/mouthful"]

```

- for ui client, create file html/index.html
```sh
mkdir html
touch html/index.html
```

- add following content in the index.html file
```html
<div id="mouthful-comments" data-url="http://localhost:8080"></div>
<script src="http://localhost:8080/client.js"></script>
```

- create directory structure required for storing app and db data
```sh
mkdir -p data/postgres # postgres data directory
mkdir -p  data/mouthful_data # app data directory
touch data/mouthful_data/config.json # config json required for the mouthful app
```

- add following content to the config.json file
```json
{
    "honeypot": false,
    "moderation": {
        "enabled": true,
        "adminPassword": "password",
        "disablePasswordLogin": false,
        "oauthCallbackOrigin": "https://api.dizzy.zone",
        "sessionDurationSeconds": 21600,
        "maxCommentLength": 10000,
        "maxAuthorLength": 35,
        "path": "/",
        "oauthProviders": [
            {
                "name": "github",
                "enabled": false,
                "secret": "secret",
                "key": "key",
                "adminUserIds": [
                    "id"
                ]
            }
        ]  
    },
    "database": {
        "dialect": "postgres",
        "database": "mouthful_db",
        "host": "postgres",
        "username": "muser",
        "password": "mpassword",
        "port": "5432",
        "sslEnabled": false
    },
    "api": {
        "bindAddress": "0.0.0.0",
        "port": 8080,
        "logging": true,
        "debug": false,
        "cache": {
            "enabled": true,
            "intervalInSeconds": 10,
            "expiryInSeconds": 300
        },
        "rateLimiting": {
            "enabled": true,
            "postsHour": 100
        },
        "cors": {
            "enabled": false,
            "allowedOrigins": ["https://dizzy.zone"]
        }
    },
    "client": {
        "useDefaultStyle": true,
        "pageSize": 5
    },
    "notification": {
        "webhook": {
            "enabled": false,
            "url": ""
        }
    }
}

```

- create docker-compose.yml for deployment
```yml
version: '3.8'

services:
  postgres:
    image: postgres:13
    container_name: mouthful_postgres
    environment:
      POSTGRES_USER: muser
      POSTGRES_PASSWORD: mpassword
      POSTGRES_DB: mouthful_db
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
    networks:
      - mouthful_network
    ports:
      - "5432:5432"

  mouthful:
    build:
      context: ./mouthful
      dockerfile: Dockerfile
    container_name: mouthful_app
    depends_on:
      - postgres
    environment:
      MOUTHFUL_DATABASE__TYPE: postgres
      MOUTHFUL_DATABASE__POSTGRES__HOST: postgres
      MOUTHFUL_DATABASE__POSTGRES__USER: muser
      MOUTHFUL_DATABASE__POSTGRES__PASSWORD: mpassword
      MOUTHFUL_DATABASE__POSTGRES__NAME: mouthful_db
    volumes:
      - "./data/mouthful_data:/app/data"
    ports:
      - "8080:8080"
    networks:
      - mouthful_network

  ui_client:
    image: nginx:alpine
    container_name: mouthful_ui_client
    volumes:
      - ./html:/usr/share/nginx/html
    ports:
      - "3000:80"  # Serve on port 3000
    depends_on:
      - mouthful
    networks:
      - mouthful_network
networks:
  mouthful_network:
```

- start postgres docker service
```sh
docker-compose up -d postgres
```

- start mouthful docker service
```sh
docker-compose up -d mouthful
```

- then start the client ui
```sh
docker-compose up -d ui_client
```

Congratulations! your app is now running at http://localhost:8080/ and the  ui_client is running at http://localhost:3000/

- add couple of comments from the client ui and verify them on the mouthful admin UI
MOUTHFUL_APP:
<img width="1727" alt="Screenshot 2024-10-08 at 2 02 44 PM" src="https://github.com/user-attachments/assets/8c9ac870-574d-4989-b98f-0e92006336f9">

UI_CLIENT:
<img width="1727" alt="Screenshot 2024-10-08 at 2 02 55 PM" src="https://github.com/user-attachments/assets/2ea5b623-9bc3-40f6-935a-01a77825ee2e">


<img width="1728" alt="Screenshot 2024-10-08 at 2 04 50 PM" src="https://github.com/user-attachments/assets/cf124bc5-b18f-4f0c-ae56-67acc72b3b75">

<img width="865" alt="Screenshot 2024-10-08 at 2 21 34 PM" src="https://github.com/user-attachments/assets/2857b5b2-fb35-42da-809f-ef27b9bd248d">


# Migrating Mouthful app to Yugabyte

- add following content to the docker-compose.yml file
```yml
  yugabyte:
    image: yugabytedb/yugabyte:2.23.0.0-b710
    restart: unless-stopped
    container_name: yugabyte
    volumes:
      - "./data/yb_data:/home/yugabyte/yb_data"
    ports:
      - "7000:7000"
      - "9000:9000"
      - "15433:15433"
      - "5433:5433"
      - "9042:9042"
    command: ["bin/yugabyted", "start", "--base_dir=/home/yugabyte/yb_data", "--background=false"]
    networks:
      - mouthful_network
```

- create yb_data directory
```sh
mkdir -p data/yb_data # yugabyte data directory
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
CREATE USER muser SUPERUSER PASSWORD 'mpassword';
CREATE DATABASE mouthful_db WITH COLOCATION=true;
```


## Run migration from PG to YB using Yugabyte Voyager

- install yb-voyager using docker
```sh
docker pull yugabytedb/yb-voyager:1.8.2
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
--source-db-user muser --source-db-name mouthful_db \
--source-db-password mpassword --source-db-schema "public" \
--send-diagnostics false --export-dir assess-dir
```

- export schema
```sh
yb-voyager export schema --export-dir assess-dir --source-db-host localhost \
--source-db-port 5432 --source-db-type postgresql --source-db-user muser \
--source-db-name mouthful_db --source-db-password mpassword \
--source-db-schema "public" --send-diagnostics false
```

- analyze-schema
```sh
yb-voyager analyze-schema --export-dir assess-dir --send-diagnostics false
```

- export data
```sh
yb-voyager export data --export-dir assess-dir --source-db-host localhost \
--source-db-port 5432 --source-db-type postgresql --source-db-user muser \
--source-db-name mouthful_db --source-db-password mpassword \
--source-db-schema "public" --send-diagnostics false
```

- export data status
```sh
yb-voyager export data status --export-dir assess-dir
```

- import schema
```sh
yb-voyager import schema --export-dir assess-dir --target-db-host localhost \
--target-db-user muser --target-db-password mpassword \
--target-db-name mouthful_db 
```

- import data
```sh
yb-voyager import data --export-dir assess-dir --target-db-host localhost \
--target-db-user muser --target-db-password mpassword \
--target-db-name mouthful_db 
```

- import data status check
```sh
yb-voyager import data status --export-dir assess-dir
```


- change the app config to point to Yugabyte database. change MOUTHFUL_DATABASE__POSTGRES__HOST in the docker-compose.yml to
```yml
MOUTHFUL_DATABASE__POSTGRES__HOST: yugabyte:5433
```

- also replace database section in file ```data/mouthful_data/config.json``` to point to the yugabyte database
```json
    "database": {
        "dialect": "postgres",
        "database": "mouthful_db",
        "host": "yugabyte",
        "username": "muser",
        "password": "mpassword",
        "port": "5433",
        "sslEnabled": false
    },
```
- also change mouthful service in docker-compose.yml be dependant on yugabyte instead of postgres
```yml
    container_name: mouthful_app
    depends_on:
      - yugabyte
```

- take down and re-create the ui_client and mouthful services
```sh
docker-compose down ui_client
docker-compose down mouthful


docker-compose up -d mouthful
docker-compose up -d ui_client
```

- Optional: check yugabyteD UI -> databases to see if the mouthful_db has the tables migrated
<img width="1726" alt="Screenshot 2024-10-08 at 2 21 07 PM" src="https://github.com/user-attachments/assets/f61032e4-4e2f-4272-9eb6-9cdb7623b0fd">
<img width="1728" alt="Screenshot 2024-10-08 at 2 21 18 PM" src="https://github.com/user-attachments/assets/11c9e3dd-2c3f-4bb5-9a5b-aa207502e4cf">


- create new comment to see the app is working as expected.
<img width="1727" alt="Screenshot 2024-10-08 at 2 22 30 PM" src="https://github.com/user-attachments/assets/69326812-00d6-4212-b1ec-f5d4265238b1">
<img width="1725" alt="Screenshot 2024-10-08 at 2 22 58 PM" src="https://github.com/user-attachments/assets/7fcee746-4df7-451b-8294-5d15eb7fc36c">

- also create ysqlsh connection to the yugabyte db and check if the new comment/data is indeed going to the new database

- end migration
```sh
mkdir backup-dir

yb-voyager end migration --export-dir assess-dir --backup-log-files true \
--backup-data-files true --backup-schema-files true \
--save-migration-reports true --backup-dir backup-dir/
```

- remove postgres service and remove respective service bock from docker-compose.yml file
```sh
docker-compose down postgres
```

## Congratulations! You have successfully migrated Mouthful app from PG to YB

### Tools and versions
- YugabyteDB docker image ```yugabytedb/yugabyte:2.23.0.0-b710```
- Yugabyte Voyager docker image ```yugabytedb/yb-voyager:1.8.2```
- postgres docker image ```postgres:13```
- docker desktop ```Docker version 27.0.3, build 7d4bcd8```
- docker-compose ```Docker Compose version v2.28.1-desktop.1```
- MacOS Sonoma 14.7
