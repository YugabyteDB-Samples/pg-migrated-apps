# Confluence

A collaborative platform used for creating, sharing, and organizing content within teams and organizations. Built by Atlassian, the same company that built JIRA.

[Official Website](https://www.atlassian.com/software/confluence)

## Start Confluence on Postgres

Confluence supports the [Docker deployment mode](https://hub.docker.com/r/atlassian/confluence-server/). Use that mode to start an instance of a Confluence server on your own laptop.

* First, start an instance of Postgres in Docker:

    ```shell
    docker network create custom-network

    rm -R ~/postgresql_data/
    mkdir ~/postgresql_data/

    docker run --name postgresql --net custom-network \
        -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password \
        -p 5432:5432 \
        -v ~/postgresql_data/:/var/lib/postgresql/data -d postgres:14.13
    ```
    Note, at the time of writing, YugabyteDB supported Postgres 14 and earlier versions. Thus, we're using Postgres 14.13.

* Wait while Postgres is fully configured and ready to accept incoming connections:

    ```shell
    ! while ! docker exec -it postgresql pg_isready -U postgres; do sleep 1; done
    ```

* Next, deploy a Confluence container:

    ```shell
    rm -R ~/confluence_data/
    mkdir ~/confluence_data/

    docker run --name confluence --net custom-network \
    -p 8090:8090 -p 8091:8091 \
    -e ATL_DB_TYPE=postgresql \
    -e ATL_JDBC_URL="jdbc:postgresql://postgresql:5432/postgres" \
    -e ATL_JDBC_USER=postgres \
    -e ATL_JDBC_PASSWORD=password \
    -v ~/confluence_data:/var/atlassian/application-data/confluence \
    -d atlassian/confluence
    ```

Once the Confluence server has started, complete its setup:

* Go to [http://localhost:8090](http://localhost:8090)

* Create and provide an evaluation key, or use your existing license
<img width="802" alt="evaluation-key" src="https://github.com/user-attachments/assets/1b6c4a06-09d8-4849-96ef-99263751f2db">

* Start a non-clustered instance of the server. It can take several minutes to complete the setup.
<img width="801" alt="non-clustered" src="https://github.com/user-attachments/assets/cc0023f2-c22a-443d-bb1d-d0ac1fe6a1a4">

* Load an example site by clicking the "Example Site" button
<img width="809" alt="example-site" src="https://github.com/user-attachments/assets/c7853a64-1f77-4906-9fe7-0c73ce2c2002">

* Finally, create an admin account.
<img width="810" alt="admin-account" src="https://github.com/user-attachments/assets/f0664fa7-e322-437d-a6a5-c2656a5de960">

Once Confluence is fully configured, create a sample page like the one below and get ready for the migration to YugabyteDB:
<img width="1493" alt="sample-page" src="https://github.com/user-attachments/assets/07a8415a-ef74-49ab-930b-9afd0d5ac6a5">

## Start YugabyteDB

You can use any deployment option for YugabyteDB for the migration purposes. This guide uses an open source version of the database running in Docker.

Deploy the latest version of YugabyteDB in Docker:

```shell
rm -r ~/yb_data
mkdir ~/yb_data

docker run -d --name yugabytedb-node1 --net custom-network \
  -p 15433:15433 -p 7001:7000 -p 9000:9000 -p 5433:5433 \
  -v ~/yb_data/node1:/home/yugabyte/yb_data --restart unless-stopped \
  yugabytedb/yugabyte:latest \
  bin/yugabyted start \
  --base_dir=/home/yugabyte/yb_data --daemon=false
```

Wait while the database finishes initialization and is ready to accept connections:

```shell
while ! docker exec -it yugabytedb-node1 postgres/bin/pg_isready -U yugabyte -h yugabytedb-node1; do sleep 1; done
```

Then, you can either recreate the Confluence container from scratch by starting it on YugabyteDB or use YugabyteDB Voyager first to migrate the existing data from Postgres. We'll start with the migration first.

## Migrate Data With Voyager

In this section, we migrate existing schema and data from Postgres to YugabyteDB, and only then switch Confluence to YugabyteDB.

* Install YugabyteDB Voyager using a [prefferred option](https://docs.yugabyte.com/preview/yugabyte-voyager/install-yb-voyager/).

* Create an export directory.

    ```shell
    rm -r $HOME/export-dir
    mkdir $HOME/export-dir
    export EXPORT_DIR=$HOME/export-dir
    ```

* Migrate the Confluence schema from Postgres:

    ```shell
    yb-voyager export schema --export-dir $EXPORT_DIR \
            --source-db-type postgresql \
            --source-db-host 127.0.0.1 \
            --source-db-user postgres \
            --source-db-password password \
            --source-db-name postgres \
            --source-db-schema public
    ```

* Analyze the schema:

    ```shell
    yb-voyager analyze-schema --export-dir $EXPORT_DIR --output-format html
    ```

* Export data from Postgres to the Voyager's directory:

    ```shell
    yb-voyager export data --export-dir $EXPORT_DIR \
            --source-db-type postgresql \
            --source-db-host 127.0.0.1 \
            --source-db-user postgres \
            --source-db-password password \
            --source-db-name postgres \
            --source-db-schema public
    ```

The next step is to import the schema and data to YugabyteDB:

* Import schema:

    ```shell
    yb-voyager import schema --export-dir $EXPORT_DIR \
            --target-db-host 127.0.0.1 \
            --target-db-user yugabyte \
            --target-db-password yugabyte \
            --target-db-name yugabyte \
            --target-db-schema public
    ```

* Import data:

    ```shell
    yb-voyager import data --export-dir $EXPORT_DIR \
            --target-db-host 127.0.0.1 \
            --target-db-user yugabyte \
            --target-db-password yugabyte \
            --target-db-name yugabyte \
            --target-db-schema public
    ```

* Refresh materialized views and recreate indexes:

    ```shell
    yb-voyager import schema --export-dir $EXPORT_DIR \
            --target-db-host 127.0.0.1 \
            --target-db-user yugabyte \
            --target-db-password yugabyte \
            --target-db-name yugabyte \
            --target-db-schema public \
            --post-import-data true \
            --refresh-mviews true
    ```

* End migration:

    ```shell
    yb-voyager end migration --export-dir $EXPORT_DIR \
            --backup-log-files false \
            --backup-data-files false \
            --backup-schema-files false \
            --save-migration-reports false
    ```

## Switch Confluence to YugabyteDB

The last step is to recreate the Confluence container by switching it to YugabyteDB.

* First, stop the container:

    ```shell
    docker container stop confluence
    ```

* Go to the Confluence's data directory:

    ```shell
    cd ~/confluence_data
    ```

* Open the `confluence.cfg.xml` in a text editor.

* Locate and replace the database-specific settings with the following:

    ```xml
    <property name="hibernate.connection.url">jdbc:postgresql://yugabytedb-node1:5433/yugabyte</property>
    <property name="hibernate.connection.username">yugabyte</property>
    <property name="hibernate.connection.password">yugabyte</property>
    ```

* Next, start the container and it will begin using YugabyteDB as a database:

    ```shell
    docker container start confluence
    ```

Go to the page that you created on Postgres and confirm you can see and edit it!

**Hint**: you might want to use the [colocation feature](https://docs.yugabyte.com/preview/explore/colocation/) of YugabyteDB to match the performance of a single-server Postgres instance. That capability is instrumental for tables that don't require distribution.

**Note**: if the ever wish to start Confluence on a fresh instance of YugabyteDB, then just use this command:

```shell
rm -R ~/confluence_data/
mkdir ~/confluence_data/

docker run --name confluence --net custom-network \
-p 8090:8090 -p 8091:8091 \
-e ATL_DB_TYPE=postgresql \
-e ATL_JDBC_URL="jdbc:postgresql://yugabytedb-node1:5433/yugabyte" \
-e ATL_JDBC_USER=yugabyte \
-e ATL_JDBC_PASSWORD=yugabyte \
-v ~/confluence_data:/var/atlassian/application-data/confluence \
-d atlassian/confluence
```
