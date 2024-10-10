# Jitsu

Jitsu is an open-source Segment alternative. Fully-scriptable data ingestion engine for modern data teams. Set-up a real-time data pipeline in minutes, not days

[GitHub](https://github.com/jitsucom/jitsu)

# Steps for Migration (verified on M1 Mac1)

1. Clone the repo and run the docker-compose file

```
git clone https://github.com/jitsucom/jitsu.git
cd jitsu
docker-compose up -d
```

2. App will be running on http://localhost:3000 . Here create some sites and destinations.

![image](https://github.com/user-attachments/assets/02f1a39b-7a2c-4155-a2b8-8c0eb936ba06)


3. Here open a site and get the token for start sending data. Here I am attaching a site to my react app.

![image](https://github.com/user-attachments/assets/4f60e8fb-7cd9-4e73-b335-fce3328166bd)


4. Here I am sending data to Jitsu using the react app.

![image](https://github.com/user-attachments/assets/2554b3e3-127c-4733-9554-573745add581)


5. Add yugabyte to docker-compose.yml

```yml
yugabyte:
  image: yugabytedb/yugabyte:2024.1.2.0-b77
  restart: unless-stopped
  container_name: yugabyte
  ports:
    - "7001:7000"
    - "9000:9000"
    - "15433:15433"
    - "5433:5433"
    - "9042:9042"
  command:
    [
      "bin/yugabyted",
      "start",
      "--base_dir=/home/yugabyte/yb_data",
      "--background=false",
    ]
```

6. Start Yugabyte Container

```
docker-compose up -d yugabyte

```

7. Start the offline migration

```bash
docker run -it --name ybv --network my_network \
yugabytedb/yb-voyager:1.8.2 \
bash -c '
yb-voyager assess-migration --export-dir /var/tmp --start-clean=true --source-db-host docker-postgres-1 --source-db-user postgres --source-db-password postgres --source-db-name postgres --source-db-schema public,newjitsu --source-db-type postgresql --iops-capture-interval 0
cat /var/tmp/assessment/reports/assessmentReport.json
yb-voyager export schema    --export-dir /var/tmp --start-clean=true --source-db-host docker-postgres-1 --source-db-user postgres --source-db-password postgres --source-db-name postgres --source-db-schema public,newjitsu --source-db-type postgresql
yb-voyager analyze-schema   --export-dir /var/tmp
cat /var/tmp/reports/schema_analysis_report.txt
yb-voyager import schema    --export-dir /var/tmp                    --target-db-host yugabyte --target-db-user yugabyte --target-db-password yugabyte --target-db-name yugabyte --target-db-schema public,newjitsu
yb-voyager export data      --export-dir /var/tmp --start-clean=true --source-db-host docker-postgres-1 --source-db-user postgres --source-db-password postgres --source-db-name postgres --source-db-schema public,newjitsu --source-db-type postgresql
yb-voyager import data      --export-dir /var/tmp                    --target-db-host yugabyte --target-db-user yugabyte --target-db-password yugabyte --target-db-name yugabyte
'
```

8. Change the console service in docker-compose.yml to use yugabyte

```yml
console:
  tty: true
  image: jitsucom/console:${DOCKER_TAG:-latest}
  restart: "unless-stopped"
  platform: linux/amd64
  environment:
    ROTOR_URL: "http://rotor:3401"
    ROTOR_AUTH_KEY: ${BULKER_TOKEN:-default}
    BULKER_URL: "http://bulker:3042"
    CONSOLE_RAW_AUTH_TOKENS: ${CONSOLE_TOKEN:-default}
    BULKER_AUTH_KEY: ${BULKER_TOKEN:-default}
    MIT_COMPLIANT: ${MIT_COMPLIANT:-false}
    DATABASE_URL: "postgresql://yugabyte:yugabyte@yugabyte:5433/yugabyte?schema=newjitsu"
    SEED_USER_EMAIL: ${SEED_USER_EMAIL:-}
    SEED_USER_PASSWORD: ${SEED_USER_PASSWORD:-}
    ENABLE_CREDETIALS_LOGIN: ${ENABLE_CREDETIALS_LOGIN:-true}
    GITHUB_CLIENT_ID: ${GITHUB_CLIENT_ID}
    GITHUB_CLIENT_SECRET: ${GITHUB_CLIENT_SECRET}
    SYNCS_ENABLED: ${SYNCS_ENABLED:-false}
    SYNCCTL_URL: "http://syncctl:${EXTERNAL_SYNCS_PORT:-3043}"
    SYNCCTL_AUTH_KEY: ${SYNCCTL_TOKEN:-default}
    GOOGLE_SCHEDULER_KEY: ${GOOGLE_SCHEDULER_KEY}
    JITSU_INGEST_PUBLIC_URL: "${JITSU_INGEST_PUBLIC_URL:-http://localhost:${JITSU_INGEST_PORT:-8080}/}"
    JITSU_PUBLIC_URL: "${JITSU_PUBLIC_URL:-${NEXTAUTH_URL:-http://localhost:${JITSU_UI_PORT:-3000}/}}"
    NEXTAUTH_URL: "${JITSU_PUBLIC_URL:-${NEXTAUTH_URL:-http://localhost:${JITSU_UI_PORT:-3000}/}}"
    CLICKHOUSE_HOST: "clickhouse:8123"
    CLICKHOUSE_PASSWORD: "${CLICKHOUSE_PASSWORD:-default}"
    CLICKHOUSE_DATABASE: "newjitsu_metrics"
    UPDATE_DB: "true"
    FORCE_UPDATE_DB: "false"
  healthcheck:
    test: ["CMD", "curl", "-f", "http://console:3000/api/healthcheck"]
    interval: 2s
    timeout: 10s
    retries: 30
  extra_hosts:
    - "syncctl:host-gateway"
  depends_on:
    clickhouse:
      condition: service_started
    postgres:
      condition: service_healthy
  ports:
    - "${JITSU_UI_PORT:-3000}:3000"
  networks:
    - my_network
```

9. Restart the docker-compose

```
docker-compose down
docker-compose up -d
```

10. App migrated and running successfuly with existing data
