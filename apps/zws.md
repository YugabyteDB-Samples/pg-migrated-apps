# zws

Shorten URLs using invisible spaces

[GitHub](https://github.com/zws-im/zws)

# Steps for Migration (verified on M1 Mac1)

1. Run postgres and redis using docker command

```
docker run -it --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=postgres  -p 5432:5432 postgres:12
docker run -it --name redis -e REDIS_PASSWORD=redis -p 6379:6379 redis:7
```

2. Clone the repo

```
git clone https://github.com/zws-im/zws.git
```

3. Edit .env file

```
DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/postgres"
NODE_ENV = "development"
WEBSITE_URL = "http://localhost:3000"
GOOGLE_API_KEY = ""
REDIS_URL = "redis://localhost:6379"
SENTRY_DSN = "https://74944494449444944494449444944494@o4505467242360832.ingest.us.sentry.io/4505467242360832"
SHORT_LENGTH = 7
SHORT_CHARS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
```

4. Run drizzle migrate command to create tables in postgres

```
bun install
bun drizzle-kit migrate
```

5. Run the api server

```
cd apps/api
bun install
bun run dev
```

6. Run the frontend

```
cd apps/web
bun install
bun run dev
```

7. Generate some short links and test
![image](https://github.com/user-attachments/assets/69a8151d-bd99-4f4e-b5eb-0cf6101348f1)


8. Run a yugabyte db instance using docker

```
docker run -d --name yugabyte -p 5433:5433 \
--hostname yugabyte -e YSQL_DB=yugabyte -e YSQL_USER=yugabyte -e YSQL_PASSWORD=yugabyte \
yugabytedb/yugabyte:2024.1.2.0-b77 \
bash -c 'rm -rf /tmp/.yb.* ; yugabyted start --enable_pg_parity_tech_preview --background=false --tserver_flags=ysql_colocate_database_by_default=true'
```

9. Use voyager for offline migration

```
docker run -it --name ybv --link postgres:pg --link yugabyte:yb \
 yugabytedb/yb-voyager:1.8.3 \
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

10. Change DATABASE_URL in .env to point to yugabyte

```
DATABASE_URL = "postgresql://yugabyte:yugabyte@localhost:5433/yugabyte"
```

11. Run the api server again

```
cd apps/api
bun run dev
```

12. Test the short links again

13. App migrated successfully
