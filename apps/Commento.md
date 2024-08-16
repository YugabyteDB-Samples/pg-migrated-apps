# Commento

A fast, bloat-free comments platform

[GitHub](https://github.com/adtac/commento)

## Steps for Migration (verified on M1 Mac)

1. Run PostgreSQL database in Docker:

```
docker run -it --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=postgres -e POSTGRES_DB=commento  -p 5432:5432 postgres:12
```

2. Run Application:
   This will automatically run DDL statements on app startup.

```
docker run -it                                                           \
    -p 80:8080                                                             \
    -e COMMENTO_ORIGIN=http://commento.example.com                         \
    -e COMMENTO_POSTGRES="postgres://postgres:password@host.docker.internal:5432/commento?sslmode=disable" \
    registry.gitlab.com/commento/commento
```

3. Run YugabyteDB in Docker:

```
docker run -d --name yugabyte -p7000:7000 -p9000:9000 -p15433:15433 -p5433:5433 -p9042:9042 --network db_migration_network \
 yugabytedb/yugabyte:2024.1.1.0-b137 bin/yugabyted start \
 --background=false \
 --enable_pg_parity_tech_preview
```

4. Execute offline migration.
5. Verify schema and data parity between PostgreSQL and YugabyteDB.
