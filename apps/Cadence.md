# Cadence

An open-source workflow orchestration engine developed by Uber for building scalable and reliable applications. It supports PostgreSQL as one of its persistence backends.

[GitHub](https://github.com/uber/cadence)

1. [Clone the repository](https://github.com/uber/cadence).
2. Run the application services locally using Docker Compose.
   ```
   docker compose -f docker/docker-compose-postgres.yml up
   ```
3. Visit application UI at http://localhost:8088.
4. Run [application samples](https://github.com/uber-common/cadence-samples) (optional).
5. Execute offline migration.
6. Update the environment variables in `docker-compose-postgres.yml` file to point to YugabyteDB. This assumes YugabyteDB is running in Docker.

   ```
   version: "3"
   services:
   # postgres:
   #   image: postgres:12.4
   #   environment:
   #     POSTGRES_USER: cadence
   #     POSTGRES_PASSWORD: cadence
   #   ports:
   #     - "5432:5432"
   prometheus:
       image: prom/prometheus:latest
       volumes:
       - ./prometheus:/etc/prometheus
       command:
       - "--config.file=/etc/prometheus/prometheus.yml"
       ports:
       - "9090:9090"
   cadence:
       image: ubercadence/server:master-auto-setup
       ports:
       - "8000:8000"
       - "8001:8001"
       - "8002:8002"
       - "8003:8003"
       - "7933:7933"
       - "7934:7934"
       - "7935:7935"
       - "7939:7939"
       - "7833:7833"
       environment:
       - "DB=postgres"
       - "DB_PORT=5433"
       - "POSTGRES_USER=yugabyte"
       - "POSTGRES_PWD=yugabyte"
       - "POSTGRES_SEEDS=host.docker.internal"
       - "PROMETHEUS_ENDPOINT_0=0.0.0.0:8000"
       - "PROMETHEUS_ENDPOINT_1=0.0.0.0:8001"
       - "PROMETHEUS_ENDPOINT_2=0.0.0.0:8002"
       - "PROMETHEUS_ENDPOINT_3=0.0.0.0:8003"
       - "DYNAMIC_CONFIG_FILE_PATH=config/dynamicconfig/development.yaml"
       depends_on:
       - prometheus
   cadence-web:
       image: ubercadence/web:latest
       environment:
       - "CADENCE_TCHANNEL_PEERS=cadence:7933"
       ports:
       - "8088:8088"
       depends_on:
       - cadence
   grafana:
       image: grafana/grafana
       volumes:
       - ./grafana:/etc/grafana
       user: "1000"
       depends_on:
       - prometheus
       ports:
       - "3000:3000"
   ```

   **Note: Cadence connects to YugabyteDB at `host.docker.internal:5433` with username `yugabyte` and password `yugabyte`. Cadence no longer depends on PostgreSQL.**

7. Restart application services pointing to YugabyteDB.
   ```
   docker compose -f docker/docker-compose-postgres.yml up
   ```
8. Visit the UI at http://localhost:8088 and connect to the database using `ysqlsh` to verify the migration.
