# Replibyte

Replibyte is a blazingly fast tool to seed your databases with your production data while keeping sensitive data safe

[GitHub](https://github.com/Qovery/Replibyte)

# Migration

Replibyte is not an application but a utility for exporting and importing data, so there is no migration to be tested.

What can be tested is:
 - dump from YugabyteDB instead of PostgreSQL
 - restore to YugabyteDB instead of PostgreSQL

# Testing dump and restore

## YugabyteDB database

Start YugabyteDB

```

docker run -d --name yb  \
 --hostname yb -e YSQL_DB=db -e YSQL_USER=db -e YSQL_PASSWORD=password \
 --health-cmd="PGPASSWORD=password postgres/bin/pg_isready -h yb -p 5433 -U user -d db" --health-interval=3s --health-timeout=3s \
 yugabytedb/yugabyte:2024.1.1.0-b137 \
 bash -c 'rm -rf /tmp/.yb.* ; yugabyted start --enable_pg_parity_tech_preview --background=false '

until docker inspect -f {{.State.Health.Status}} yb | grep healthy ; do sleep 1 ; done

```

Create PgBench tables
```

docker run --link yb:yb -e PGPASSWORD=password -e PGUSER=db postgres \
 pgbench -iItpfG -h yb -p 5433

```

The following warnings can be ignored:

- `WARNING:  storage parameter fillfactor is unsupported, ignoring` because YugabyteDB doesn't store rows and doesn't need to reserve free space for HOT updates like PostgreSQL, as it stores rows in their primary key LSM tree, and write only the updated column values.
- `NOTICE:  table rewrite may lead to inconsistencies` because pg_bench does some offline ALTER TABLE. This is safe, as there are no concurrent writes.

## Replibyte configuration

Use this YugabyteDB database as source and destination
```

cat > replibyte.yaml <<'YAML'
source:
  connection_uri: postgres://db:password@yb:5433/db
datastore:
  local_disk:
    dir: /datastore
destination:
  connection_uri: postgres://db:password@yb:5433/db
YAML

```

Create a directory to store dumps
```

mkdir /var/data/replibyte

```
## Dump from YugabyteDB

The following parameters are set in PGOPTIONS:
- The best isolation level to export from YugabyteDB is SERIALIZABLE READ ONLY DEFERRABLE, as it provides a consistent snapshot without locking and without serializable errors (because it waits for the maximum clock skew — 500 milliseconds without atomic clocks). This is set with `default_transaction_isolation=serializable`, `default_transaction_deferrable=on`, and `default_transaction_read_only=on`
- Additionally, allowing follower reads can reduce the latency (`yb_read_from_followers=on`), taking a consistent snapshot that is a few seconds stale (default 30 seconds set by `yb_follower_read_staleness_ms=30000`). This also avoids issue [#12945](https://github.com/yugabyte/yugabyte-db/issues/12945) with pg_dump.
- As queries on the catalog might be slow (Issue [#7745](https://github.com/yugabyte/yugabyte-db/issues/7745)), it is a good idea to disable Nested Loop. YugabyteDB can use Batched Nested Loop instead or Hash Join for non-batchable join conditions.

```

docker run \
 --link yb:yb \
 -e PGOPTIONS='-c default_transaction_isolation=serializable -c default_transaction_deferrable=on -c default_transaction_read_only=on -c yb_read_from_followers=on -c enable_nestloop=off' \
 -v "$(pwd)/replibyte.yaml:/replibyte.yaml:ro" \
 -v /var/data/replibyte:/datastore ghcr.io/qovery/replibyte \
 --config replibyte.yaml dump create

```

## Restore to YugabyteDB

Drop the tables before testing the restore
```

docker run --link yb:yb -e PGPASSWORD=password -e PGUSER=db postgres \
 pgbench -iId -h yb -p 5433


```

Restore the latest dump.

The following parameters are set in PGOPTIONS:
- Disable transactional writes to accelerate the inserts (`yb_disable_transactional_writes=on`). This is safe for a restore where no concurrent users are querying the tables while loading (they will see the rows before the end of the import) and where we start the restore again if it was interrupted (no need to rollback)
```

docker run \
 --link yb:yb \
 -e PGOPTIONS='-c yb_disable_transactional_writes=on' \
 -v "$(pwd)/replibyte.yaml:/replibyte.yaml:ro" \
 -v /var/data/replibyte:/datastore ghcr.io/qovery/replibyte \
 --config replibyte.yaml dump restore remote -v latest

```
The import is slow because Replibyte uses single-row inserts (`pg_dump --inserts`) rather than multi-value inserts (with `--rows-per-insert`) or COPY ([#36](https://github.com/Qovery/Replibyte/issues/36))


Finally, test PgBench
```

docker run --link yb:yb -e PGPASSWORD=password -e PGUSER=db postgres \
 pgbench -h yb -p 5433



