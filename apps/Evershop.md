# Evershop

NodeJS E-commerce Platform

[GitHub](https://github.com/evershopcommerce/evershop)

1. Clone the [repository](https://github.com/evershopcommerce/evershop)

2. Run `docker-compose`.

```
docker-compose up
```

3. Visit the application UI at http://localhost:3000.
4. Migrate the application schema and data using `yb-voyager`.
5. Run the `analyze-schema` command in `yb-voyager`.
   Note the issues at the bottom of the report:

- [Schema contains gin index on multi column which is not supported.](https://github.com/yugabyte/yugabyte-db/issues/7850)
- [CONSTRAINT TRIGGER not supported yet.](https://github.com/YugaByte/yugabyte-db/issues/1709)

6. Fix the reported issues in the schema analysis report by editing the schema files in the `export-dir`.
   For migration's sake, I have commented out the unsupported triggers in `schema/triggers/trigger.sql`. The gin index did not pose any issues in the application.

_NOTE: This application runs using PG16, which is not supported by Yugabyte. This version of PostgreSQL comes with the gen_random_uuid utility function built-in. In order to use this function in our schema, we must install the `pgcrypto` extension._

7. Add the `extension.sql` file under `schema/extensions/extension.sql` with the following contents.
   ```
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
   ```
8. Run YugabyteDB in Docker.
9. Migrate schema and data.
10. Verify schema and data parity between PostgreSQL and YugabyteDB.
11. Change the `docker-compose.yaml` file to point to YugabyteDB.

```
version: '3.8'

services:
  app:
    image: evershop/evershop:latest
    restart: always
    environment:
      DB_HOST: host.docker.internal
      DB_PORT: 5433
      DB_PASSWORD: yugabyte
      DB_USER: yugabyte
      DB_NAME: evershop
    networks:
      - myevershop
    ports:
      - 3000:3000

networks:
  myevershop:
    name: MyEverShop
    driver: bridge

volumes:
  postgres-data:
```

9. Re-run docker-compose.

```
docker-compose up
```

10. Verify the application.
