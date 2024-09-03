# Confluence

A collaborative platform used for creating, sharing, and organizing content within teams and organizations. Built by Atlassian, the same company who built JIRA.

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
        -v ~/postgresql_data/:/var/lib/postgresql/data -d postgres:latest
    ```

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

* Create and provide an evalution key, or use your existing license
    Picture TBD

* Start a non-clustered instance of the server. It can take several minutes to complete the setup.
    Picture TBD

* Load an example site by clicking the "Example Site" button
    Picture TBD

* Finally, create an admin account.
    Picture TBD

Once Confluence is fully configured, create a sample page like the one below and get ready for the migration to YugabyteDB:

Picture TBD
