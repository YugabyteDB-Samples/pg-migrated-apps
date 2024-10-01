# bolt

a simple CMS written in PHP

[GitHub](https://github.com/bolt/bolt?tab=readme-ov-file)

1. Install application and dependencies using [these instructions](https://docs.boltcms.io/5.2/installation/installation).
2. In `doctrine.yaml`, change encoding to `utf8`.

```
...
doctrine:
  dbal:
    charset: utf8
    url: "%env(resolve:DATABASE_URL)%"
```

3. Run PostgreSQL in Docker.
4. Update `.env` file with database connection details.
5. Run application.
6. Perform offline migration.
7. Change `.env` file to point to YugabyteDB.
8. Re-run application and verify migration.
