# cocalc

Collaborative Calculation in the Cloud

[GitHub](https://github.com/sagemathinc/cocalc)

1. Create the `smc` database in PostgreSQL.

   ```
   CREATE DATABASE smc;
   CREATE ROLE smc;
   ```

2. Edit `/var/lib/postgresql/data/pg_hba.conf` to trust the smc role.

   ```
   host    all    smc    127.0.0.1/32    trust
   host    all    smc    0.0.0.0/0    trust
   ```

3. Run [Cocalc in Docker](https://cocalc.com/share/public_paths/embed/dbd113537ec374ed54e00e33f433156762bd3be4/README.md).

**NOTE: This Docker image starts a local PostgreSQL instance on the container if the PGHOST environment variable is omitted. Here I've supplied the PGHOST variable host.docker.internal, denoting that my PostgreSQL server is running on my local machine (in my case, in another Docker container).**
**NOTE: use the `sagemathinc/cocalc-docker` image if you aren't running on an ARM Mac**

```
docker run --name=cocalc -e PGHOST=host.docker.internal -d -v ~/cocalc:/projects -p 443:443 sagemathinc/cocalc-docker-arm64
```

This command will start the docker container, connecting to the `smc` database and running DDL statements.

4. [Visit the UI](https://localhost) and create an account.
5. Interact with the application to create projects, files, etc.
6. Execute offline migration.

   **NOTE: remove 'period' from primary key definition in table.sql as columns of type INTERVAL are not supported as primary keys in YugabyteDB**

   **NOTE: remove 'created_by' from indexes because YugabyteDB does not support indexes on INET.**

   **NOTE: remove 'lti_id' from indexes because YugabyteDB does not support indexes on TEXTARRAY.**

   **NOTE: remove 'site_license' from indexes because YugabyteDB does not support indexes on JSONB.**

7. Inside of Colcalc container, edit the `cocalc/src/packages/database/postgres-base.coffee` file to point to YugabyteDB running on `host.docker.internal:5433`.

8. Rebuild the server and restart the container.
9. Login to the application with the credentials used previously on PostgreSQL. Create entities to verify the deployment.
