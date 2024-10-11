# Jira

An agile project management tool used by teams to plan, track, release and support software

## Instructions for running on M1 Mac

This [installation reference](https://community.atlassian.com/t5/Jira-articles/Atlassian-Jira-Docker-for-Apple-M1-processors/ba-p/2120698) was used. If running on another processor, building an ARM64 image will not be necessary.

1. Create a directory on your machine named `jira`.
2. Create `Dockerfile`.

   ```
   FROM ubuntu:latest
   WORKDIR /home
   RUN apt update
   RUN apt --assume-yes install openjdk-11-jdk curl
   RUN mkdir -p downloads
   RUN cd downloads
   RUN mkdir -p jirahome
   RUN curl https://product-downloads.atlassian.com/software/jira/downloads/atlassian-jira-software-9.2.0.tar.gz --output atlassian-jira-software-9.2.0.tar.gz
   RUN tar -xvf atlassian-jira-software-9.2.0.tar.gz
   ENV JIRA_HOME=/home/downloads/jirahome
   CMD ["atlassian-jira-software-9.2.0-standalone/bin/start-jira.sh", "-fg"]
   ```

3. Build the image.
   ```
   docker build -t jira-software-arm64:9.2.0 .
   ```
4. Create a `docker-compose.yml` file.

   ```
   version: "3"

   services:
   jira:
       depends_on:
       - postgresql
       image: jira-software-arm64:9.2.0
       networks:
       - jiranet
       volumes:
       - jiradata:/var/atlassian/jira
       ports:
       - "8080:8080"
       logging:
       # limit logs retained on host to 25MB
       driver: "json-file"
       options:
           max-size: "500k"
           max-file: "50"

   postgresql:
       image: postgres:13
       ports:
       - "5432:5432"
       networks:
       - jiranet
       volumes:
       - postgresqldata-v13:/var/lib/postgresql/data
       environment:
       - "POSTGRES_USER=jira"
       # CHANGE THE PASSWORD!
       - "POSTGRES_PASSWORD=Postgres_password"
       - "POSTGRES_DB=jiradb"
       - "POSTGRES_ENCODING=UNICODE"
       - "POSTGRES_COLLATE=C"
       - "POSTGRES_COLLATE_TYPE=C"
       logging:
       # limit logs retained on host to 25MB
       driver: "json-file"
       options:
           max-size: "500k"
           max-file: "50"

   volumes:
   jiradata:
       external: false
   postgresqldata-v13:
       external: false

   networks:
   jiranet:
       driver: bridge
   ```

5. Run the application services.
   ```
   docker-compose up
   ```
6. Monitor the application startup logs. When startup has completed, visit the UI at http://localhost:8080.
7. Complete the manual installation instructions.
   - Pay careful attention to connect to the PostgreSQL instance provisioned in Docker.
   - You will need to generate a license key as part of the installation process. A free trial license can be obtained through Atlassian.
8. Create a sample project in JIRA through the UI.
9. Perform an offline migration to YugabyteDB.
10. Create a `dbconfig.xml` file with connection details to YugabyteDB.

    ```
    <?xml version="1.0" encoding="UTF-8"?>

    <jira-database-config>
    <name>defaultDS</name>
    <delegator-name>default</delegator-name>
    <database-type>postgres72</database-type>
    <schema-name>public</schema-name>
    <jdbc-datasource>
        <url>jdbc:postgresql://host.docker.internal:5433/jiradb</url>
        <driver-class>org.postgresql.Driver</driver-class>
        <username>yugabyte</username>
        <password>yugabyte</password>
        <pool-min-size>40</pool-min-size>
        <pool-max-size>40</pool-max-size>
        <pool-max-wait>30000</pool-max-wait>
        <validation-query>select 1</validation-query>
        <min-evictable-idle-time-millis>60000</min-evictable-idle-time-millis>
        <time-between-eviction-runs-millis>300000</time-between-eviction-runs-millis>
        <pool-max-idle>40</pool-max-idle>
        <pool-remove-abandoned>true</pool-remove-abandoned>
        <pool-remove-abandoned-timeout>300</pool-remove-abandoned-timeout>
        <pool-test-on-borrow>false</pool-test-on-borrow>
        <pool-test-while-idle>true</pool-test-while-idle>
        <connection-properties>tcpKeepAlive=true;socketTimeout=240</connection-properties>
    </jdbc-datasource>
    </jira-database-config>
    ```

11. Copy this updated version of the `dbconfig.xml` to the JIRA container running in Docker.
    ```
    docker cp dbconfig.xml jira-jira-1:/home/downloads/jirahome/dbconfig.xml
    ```
12. Restart the container.
    ```
    docker-compose restart jira
    ```
13. Monitor the logs and refresh the UI when startup has completed.
14. Verify that the application is running on YugabyteDB.
