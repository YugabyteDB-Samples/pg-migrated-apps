# Saasfly

Your Next SaaS Template or Boilerplate ! A magic trip start with `bun create saasfly` . The more stars, the more surprises

[GitHub](https://github.com/saasfly/saasfly)

# Steps for Migration

1. Starting postgres

```
docker run -it --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=postgres  -p 5432:5432 postgres:12
```

2. Clone the repo

```
git clone https://github.com/saasfly/saasfly.git
cd saasfly
bun install
```

3. Copy env file

```
cp .env.example .env.local
```

4. Add database url to the env file and other env variables

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
```

5. Create pgcrypto extension in the database

6. Setup the database

```
bun db:push
```

7. Run the app

```
bun run dev:web
```

8. Create a new yugabyte cluster

```
docker run -d --name yugabyte -p 5433:5433 \
 --hostname yugabyte -e YSQL_DB=yugabyte -e YSQL_USER=yugabyte -e YSQL_PASSWORD=yugabyte \
 yugabytedb/yugabyte:2024.1.2.0-b77 \
 bash -c 'rm -rf /tmp/.yb.* ; yugabyted start --enable_pg_parity_tech_preview --background=false --tserver_flags=ysql_colocate_database_by_default=true'
```

9.  Run offline migration

```
docker run -it --name ybv --link postgres:pg --link yugabyte:yb \
yugabytedb/yb-voyager:1.8.2 \
bash -c '
yb-voyager assess-migration --export-dir /var/tmp --start-clean=true --source-db-host pg --source-db-user postgres --source-db-password postgres --source-db-name postgres --source-db-schema public --source-db-type postgresql --iops-capture-interval 0
cat /var/tmp/assessment/reports/assessmentReport.json
yb-voyager export schema    --export-dir /var/tmp --start-clean=true --source-db-host pg --source-db-user postgres --source-db-password postgres --source-db-name postgres --source-db-schema public --source-db-type postgresql
yb-voyager analyze-schema   --export-dir /var/tmp
cat /var/tmp/reports/schema_analysis_report.txt
yb-voyager import schema    --export-dir /var/tmp                    --target-db-host yb --target-db-user yugabyte --target-db-password yugabyte --target-db-name yugabyte --target-db-schema public
yb-voyager export data      --export-dir /var/tmp --start-clean=true --source-db-host pg --source-db-user postgres --source-db-password postgres --source-db-name postgres --source-db-schema public --source-db-type postgresql
yb-voyager import data      --export-dir /var/tmp                    --target-db-host yb --target-db-user yugabyte --target-db-password yugabyte --target-db-name yugabyte
'
```

10. Change database url in the env file

```
DATABASE_URL="postgresql://yugabyte:yugabyte@localhost:5433/yugabyte"
```

11. Run the app again

```
bun run dev:web
```

12. App migrated successfully
