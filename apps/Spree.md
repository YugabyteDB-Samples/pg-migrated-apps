# Spree

Online Commerce for Ruby on Rails

[GitHub](https://github.com/spree/spree)

## Steps for Migration (verified on M1 Mac)

Run [Spree Quickstart](https://docs.spreecommerce.org/developer/getting-started/quickstart#setting-up-your-development-environment).

1. After cloning the your Spree starter template, edit the `docker-compose.yaml` file to use the `postgres:15` Docker image.
2. Follow steps for building and running the application.
3. Seed the database with data.
4. 3. Run YugabyteDB in Docker:

```
docker run -d --name yugabyte -p7000:7000 -p9000:9000 -p15433:15433 -p5433:5433 -p9042:9042 --network db_migration_network \
 yugabytedb/yugabyte:2024.1.1.0-b137 bin/yugabyted start \
 --background=false \
 --enable_pg_parity_tech_preview
```

5.  Execute offline migration.
6.  Verify schema and data parity between PostgreSQL and YugabyteDB.
7.  Edit `database.yml` file in your Spree project to connect to YugabyteDB.

```
...
  username: yugabyte
  password: yugabyte
  host: localhost
  port: 5433
```

8. Re-run the application.
