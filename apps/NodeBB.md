# NodeBB

Node.js based forum software built for the modern web

[GitHub](https://github.com/NodeBB/NodeBB)

## Steps for Migration (verified on M1 Mac)

App is only PostgreSQL-compatible in legacy mode, with limited functionality.

1. Clone the [repository](https://github.com/NodeBB/NodeBB).
2. Update `docker-compose-pgsql.yml`.

This sets the data volume for postgres to the `/var/data/` directory and exposes the database on port 5432.

```
...
postgres:
...
  volumes:
    - postgres-data:/var/data
  ports:
    - "5432:5432"
```

2. Run the application and database using `docker-compose`.

```
docker-compose -f docker-compose-pgsql.yml up
```

3. Run YugabyteDB in Docker.

```
docker run -d --name yugabyte -p7000:7000 -p9000:9000 -p15433:15433 -p5433:5433 -p9042:9042 --network db_migration_network \
 yugabytedb/yugabyte:2024.1.1.0-b137 bin/yugabyted start \
 --background=false \
 --enable_pg_parity_tech_preview
```

4. Execute offline migration.
   _Note: This application runs on PostgreSQL v16.x by default. Migration was done using yb-voyager v1.7.2 on Mac._

   Schema analysis shows that 2 features are not currently supported by Yugabyte:

   _ALTER TABLE CLUSTER not supported yet._
   _ALTER TABLE ALTER column SET STORAGE not supported yet._

   These statements will need to be changed or removed before importing schema.

5. Verify schema and data parity between PostgreSQL and YugabyteDB.
6. Stop `nodebb` container in Docker.
7. Change connection details in `connection.js`.

```
const connOptions = {
   host: "host.docker.internal",
   port: 5433,
   user: "yugabyte",
   password: "yugabyte",
   database: "nodebb",
   ...
}
```

8. Build and recreate the `nodebb` container.

```
docker-compose up --build --force-recreate -d nodebb
```

9. Visit UI at http://localhost:4567.
