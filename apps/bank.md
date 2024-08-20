# bank

Full Stack Web Application similar to financial software that is used in banking institutions | React.js and Node.js

[GitHub](https://github.com/pietrzakadrian/bank)

## Steps for Migration (verified on M1 Mac)

1. Run PostgreSQL database in Docker:

```
docker run -it --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=postgres -e POSTGRES_DB=bank  -p 5432:5432 postgres:14
```

2. Clone the [repository](https://github.com/pietrzakadrian/bank) and install dependencies.
3. Install Node v16.
4. Run `client` and `server` by following instructions in corresponding diretories.
5. Run YugabyteDB in Docker:

```
docker run -d --name yugabyte -p7000:7000 -p9000:9000 -p15433:15433 -p5433:5433 -p9042:9042 --network db_migration_network \
 yugabytedb/yugabyte:2024.1.1.0-b137 bin/yugabyted start \
 --background=false \
 --enable_pg_parity_tech_preview
```

6. Execute offline migration.
7. Verify schema and data parity between PostgreSQL and YugabyteDB.
8. Update `.env` file to point to YugabyteDB deployment.

   ```
   ...
    DB_HOST=localhost
    DB_PORT=5433
    DB_USERNAME=yugabyte
    DB_PASSWORD=yugabyte
    DB_DATABASE=bank

   ```

9. Restart `server` and verify application runs as expected.
