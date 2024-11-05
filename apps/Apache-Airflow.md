# Apache Airflow

An open-source workflow management platform for orchestrating complex computational workflows.

[GitHub](https://github.com/apache/airflow)

# Fresh install Apache Airflow on Postgres 

- start docker daemon
- create docker-compose.yml file with following content
```yml
version: '3.8'

services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_USER: airflow
      POSTGRES_PASSWORD: airflow
      POSTGRES_DB: airflow
    ports:
      - "5432:5432"
    volumes:
      - postgres-db-volume:/var/lib/postgresql/data
  
  airflow-webserver:
    image: apache/airflow:2.7.1
    environment:
      AIRFLOW__CORE__EXECUTOR: LocalExecutor
      AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://airflow:airflow@postgres/airflow
      AIRFLOW__CORE__FERNET_KEY: 'a long random key'
      AIRFLOW__WEBSERVER__WORKERS: 4
      _AIRFLOW_DB_UPGRADE: 'true'
      _AIRFLOW_WWW_USER_CREATE: 'true'
      _AIRFLOW_WWW_USER_USERNAME: 'admin'
      _AIRFLOW_WWW_USER_PASSWORD: 'admin'
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    volumes:
      - ./dags:/opt/airflow/dags
      - ./logs:/opt/airflow/logs
      - ./plugins:/opt/airflow/plugins
    command: ["webserver"]


  airflow-scheduler:
    image: apache/airflow:2.7.1
    depends_on:
      - postgres
    environment:
      AIRFLOW__CORE__EXECUTOR: LocalExecutor
      AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://airflow:airflow@postgres/airflow
    volumes:
      - ./dags:/opt/airflow/dags
      - ./logs:/opt/airflow/logs
      - ./plugins:/opt/airflow/plugins
    command: ["scheduler"]

volumes:
  postgres-db-volume:

```

- start the docker-compose services
```sh
docker-compose up -d
```

- Congratulations your app is now deployed. Access it as http://localhost:8080/login/ with admin/admin



# Migrating Hyperswitch app to from PG to Yugabyte succeeded, however the app start has an issues(erros in app logs). Steps as follows. 

- replace contents of docker-compose.yml file with following(adds yugabyte service)
```yml
version: '3.8'

services:
  yugabyte:
    image: yugabytedb/yugabyte:2024.1.3.0-b105
    restart: unless-stopped
    container_name: yugabyte
    volumes:
      - "yugabyte-db-volume:/home/yugabyte/yb_data"
    ports:
      - "7000:7000"
      - "9000:9000"
      - "15433:15433"
      - "5433:5433"
      - "9042:9042"
    command: ["bin/yugabyted", "start", "--base_dir=/home/yugabyte/yb_data", "--background=false"]
  
  postgres:
    image: postgres:13
    environment:
      POSTGRES_USER: airflow
      POSTGRES_PASSWORD: airflow
      POSTGRES_DB: airflow
    ports:
      - "5432:5432"
    volumes:
      - postgres-db-volume:/var/lib/postgresql/data
  
  airflow-webserver:
    image: apache/airflow:2.7.1
    environment:
      AIRFLOW__CORE__EXECUTOR: LocalExecutor
      # AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://airflow:airflow@postgres/airflow
      AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://airflow:airflow@yugabyte:5433/airflow
      AIRFLOW__CORE__FERNET_KEY: 'a long random key'
      AIRFLOW__WEBSERVER__WORKERS: 4
      _AIRFLOW_DB_UPGRADE: 'true'
      _AIRFLOW_WWW_USER_CREATE: 'true'
      _AIRFLOW_WWW_USER_USERNAME: 'admin'
      _AIRFLOW_WWW_USER_PASSWORD: 'admin'
    ports:
      - "8080:8080"
    depends_on:
      # - postgres
      - yugabyte
    volumes:
      - ./dags:/opt/airflow/dags
      - ./logs:/opt/airflow/logs
      - ./plugins:/opt/airflow/plugins
    command: ["webserver"]


  airflow-scheduler:
    image: apache/airflow:2.7.1
    depends_on:
      # - postgres
      - yugabyte
    environment:
      AIRFLOW__CORE__EXECUTOR: LocalExecutor
      # AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://airflow:airflow@postgres/airflow
      AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://airflow:airflow@yugabyte:5433/airflow
    volumes:
      - ./dags:/opt/airflow/dags
      - ./logs:/opt/airflow/logs
      - ./plugins:/opt/airflow/plugins
    command: ["scheduler"]

volumes:
  postgres-db-volume:
  yugabyte-db-volume:

```

- Given that app is already running on postgres and other services are running from pg run. Start yugabyte docker service
```sh
docker-compose up -d yugabyte
```

- create database, user to be used in app configuration
```sh
docker exec -it yugabyte bash
./bin/ysqlsh --host $(hostname)

# run following on ysql shell
CREATE DATABASE airflow WITH COLOCATION=true;
CREATE USER airflow WITH PASSWORD 'airflow' SUPERUSER CREATEDB CREATEROLE;
```


## Run migration from PG to YB using Yugabyte Voyager

- install yb-voyager using docker
```sh
docker pull yugabytedb/yb-voyager:latest
wget -O ./yb-voyager https://raw.githubusercontent.com/yugabyte/yb-voyager/main/docker/yb-voyager-docker && chmod +x ./yb-voyager && sudo mv yb-voyager /usr/local/bin/yb-voyager

yb-voyager version
```

- create assessment directory
```sh
mkdir assess-dir
```

- Optional: export following to see migration status on YugabyteD UI
```sh
export CONTROL_PLANE_TYPE=yugabyted
export YUGABYTED_DB_CONN_STRING=postgresql://yugabyte:yugabyte@127.0.0.1:5433
```

- run assess migration
```sh
yb-voyager assess-migration --source-db-host localhost \
--source-db-port 5432 --source-db-type postgresql \
--source-db-user airflow --source-db-name airflow \
--source-db-password airflow --source-db-schema "public" \
--send-diagnostics false --export-dir assess-dir
```

- export schema
```sh
yb-voyager export schema --export-dir assess-dir --source-db-host localhost \
--source-db-port 5432 --source-db-type postgresql --source-db-user airflow \
--source-db-name airflow --source-db-password airflow \
--source-db-schema "public" --send-diagnostics false
```

- analyze-schema
```sh
yb-voyager analyze-schema --export-dir assess-dir --send-diagnostics false
```

- export data
```sh
yb-voyager export data --export-dir assess-dir --source-db-host localhost \
--source-db-port 5432 --source-db-type postgresql --source-db-user airflow \
--source-db-name airflow --source-db-password airflow \
--source-db-schema "public" --send-diagnostics false
```

- export data status
```sh
yb-voyager export data status --export-dir assess-dir
```

- import schema
```sh
yb-voyager import schema --export-dir assess-dir --target-db-host localhost \
--target-db-user airflow --target-db-password airflow \
--target-db-name airflow 
```

- import data
```sh
yb-voyager import data --export-dir assess-dir --target-db-host localhost \
--target-db-user airflow --target-db-password airflow \
--target-db-name airflow 
```

- import data status check
```sh
yb-voyager import data status --export-dir assess-dir
```

- stop services. Remove postgres service from docker-compose.yml file. Restart the app services
```sh
docker-compose down

# remove postgres services
docker-compose up -d
```

- check the UI by logging into the application. App does not function properly on YugabyteDB. Upon checking the app console logs, I found the issues reported. 
```
[SQL: UPDATE session SET expiry=%(expiry)s WHERE session.id = %(session_id_1)s]
[parameters: {'expiry': datetime.datetime(2024, 11, 16, 9, 4, 37, 848866, tzinfo=datetime.timezone.utc), 'session_id_1': 105}]
(Background on this error at: https://sqlalche.me/e/14/e3q8)

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/home/airflow/.local/lib/python3.8/site-packages/flask/app.py", line 1847, in finalize_request
    response = self.process_response(response)
  File "/home/airflow/.local/lib/python3.8/site-packages/flask/app.py", line 2344, in process_response
    self.session_interface.save_session(self, ctx.session, response)
  File "/home/airflow/.local/lib/python3.8/site-packages/airflow/www/session.py", line 33, in save_session
    return super().save_session(*args, **kwargs)
  File "/home/airflow/.local/lib/python3.8/site-packages/flask_session/sessions.py", line 543, in save_session
    saved_session = self.sql_session_model.query.filter_by(
  File "/home/airflow/.local/lib/python3.8/site-packages/sqlalchemy/orm/query.py", line 2824, in first
    return self.limit(1)._iter().first()
  File "/home/airflow/.local/lib/python3.8/site-packages/sqlalchemy/orm/query.py", line 2916, in _iter
    result = self.session.execute(
  File "/home/airflow/.local/lib/python3.8/site-packages/sqlalchemy/orm/session.py", line 1716, in execute
    conn = self._connection_for_bind(bind)
  File "/home/airflow/.local/lib/python3.8/site-packages/sqlalchemy/orm/session.py", line 1555, in _connection_for_bind
    return self._transaction._connection_for_bind(
  File "/home/airflow/.local/lib/python3.8/site-packages/sqlalchemy/orm/session.py", line 724, in _connection_for_bind
    self._assert_active()
  File "/home/airflow/.local/lib/python3.8/site-packages/sqlalchemy/orm/session.py", line 604, in _assert_active
    raise sa_exc.PendingRollbackError(
sqlalchemy.exc.PendingRollbackError: This Session's transaction has been rolled back due to a previous exception during flush. To begin a new transaction with this Session, first issue Session.rollback(). Original exception was: (psycopg2.errors.SerializationFailure) could not serialize access due to concurrent update (query layer retry isn't possible because data was already sent, if this is the read committed isolation (or) the first statement in repeatable read/ serializable isolation transaction, consider increasing the tserver gflag ysql_output_buffer_size)
DETAIL:  Conflict with concurrently committed data. Value write after transaction start: doc ht ({ physical: 1729155877849754 }) >= read time ({ physical: 1729155877837037 }): kConflict

```

- end migration
```sh
mkdir backup-dir

yb-voyager end migration --export-dir assess-dir --backup-log-files true \
--backup-data-files true --backup-schema-files true \
--save-migration-reports true --backup-dir backup-dir/
```




# Fresh install of Apache Airflow on YugabyteDB failed as well. Steps as follows
- start docker daemon

- create ```docker-compose.yml``` file with following contents
```yml
version: '3.8'

services:
  yugabyte:
    image: yugabytedb/yugabyte:2024.1.3.0-b105
    restart: unless-stopped
    container_name: yugabyte
    volumes:
      - "yugabyte-db-volume:/home/yugabyte/yb_data"
    ports:
      - "7000:7000"
      - "9000:9000"
      - "15433:15433"
      - "5433:5433"
      - "9042:9042"
    command: ["bin/yugabyted", "start", "--base_dir=/home/yugabyte/yb_data", "--background=false"]
  
  airflow-webserver:
    image: apache/airflow:2.7.1
    environment:
      AIRFLOW__CORE__EXECUTOR: LocalExecutor
      AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://airflow:airflow@yugabyte:5433/airflow
      AIRFLOW__CORE__FERNET_KEY: 'a long random key'
      AIRFLOW__WEBSERVER__WORKERS: 4
      _AIRFLOW_DB_UPGRADE: 'true'
      _AIRFLOW_WWW_USER_CREATE: 'true'
      _AIRFLOW_WWW_USER_USERNAME: 'admin'
      _AIRFLOW_WWW_USER_PASSWORD: 'admin'
    ports:
      - "8080:8080"
    depends_on:
      - yugabyte
    volumes:
      - ./dags:/opt/airflow/dags
      - ./logs:/opt/airflow/logs
      - ./plugins:/opt/airflow/plugins
    command: ["webserver"]


  airflow-scheduler:
    image: apache/airflow:2.7.1
    depends_on:
      - yugabyte
    environment:
      AIRFLOW__CORE__EXECUTOR: LocalExecutor
      AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://airflow:airflow@yugabyte:5433/airflow
    volumes:
      - ./dags:/opt/airflow/dags
      - ./logs:/opt/airflow/logs
      - ./plugins:/opt/airflow/plugins
    command: ["scheduler"]

volumes:
  yugabyte-db-volume:
```

- start yugabyte service
```sh
docker-compose up -d yugabyte
```

- create the database and user
```sh
docker exec -it yugabyte bash
./bin/ysqlsh --host $(hostname)

# run following on ysql shell
CREATE DATABASE airflow WITH COLOCATION=true;
CREATE USER airflow WITH PASSWORD 'airflow' SUPERUSER CREATEDB CREATEROLE;
```

- start all other services
```sh
docker-compose up -d
```

- The app start fails to start with logs showing errors related to advisory logs. Related issue: https://github.com/yugabyte/yugabyte-db/issues/3642  
```
[2024-10-17T06:46:33.298+0000] {migration.py:216} INFO - Will assume transactional DDL.
Traceback (most recent call last):
  File "/home/airflow/.local/lib/python3.8/site-packages/sqlalchemy/engine/base.py", line 1910, in _execute_context
    self.dialect.do_execute(
  File "/home/airflow/.local/lib/python3.8/site-packages/sqlalchemy/engine/default.py", line 736, in do_execute
    cursor.execute(statement, parameters)
psycopg2.errors.FeatureNotSupported: advisory locks are not yet implemented
HINT:  See https://github.com/yugabyte/yugabyte-db/issues/3642. React with thumbs up to raise its priority


The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "/home/airflow/.local/lib/python3.8/site-packages/airflow/utils/db.py", line 1789, in create_global_lock
    conn.execute(text("SELECT pg_advisory_lock(:id)"), {"id": lock.value})
  File "/home/airflow/.local/lib/python3.8/site-packages/sqlalchemy/future/engine.py", line 280, in execute
    return self._execute_20(
  File "/home/airflow/.local/lib/python3.8/site-packages/sqlalchemy/engine/base.py", line 1710, in _execute_20
    return meth(self, args_10style, kwargs_10style, execution_options)
  File "/home/airflow/.local/lib/python3.8/site-packages/sqlalchemy/sql/elements.py", line 334, in _execute_on_connection
    return connection._execute_clauseelement(
  File "/home/airflow/.local/lib/python3.8/site-packages/sqlalchemy/engine/base.py", line 1577, in _execute_clauseelement
    ret = self._execute_context(
  File "/home/airflow/.local/lib/python3.8/site-packages/sqlalchemy/engine/base.py", line 1953, in _execute_context
    self._handle_dbapi_exception(
  File "/home/airflow/.local/lib/python3.8/site-packages/sqlalchemy/engine/base.py", line 2134, in _handle_dbapi_exception
    util.raise_(
  File "/home/airflow/.local/lib/python3.8/site-packages/sqlalchemy/util/compat.py", line 211, in raise_
    raise exception
  File "/home/airflow/.local/lib/python3.8/site-packages/sqlalchemy/engine/base.py", line 1910, in _execute_context
    self.dialect.do_execute(
  File "/home/airflow/.local/lib/python3.8/site-packages/sqlalchemy/engine/default.py", line 736, in do_execute
    cursor.execute(statement, parameters)
sqlalchemy.exc.NotSupportedError: (psycopg2.errors.FeatureNotSupported) advisory locks are not yet implemented
HINT:  See https://github.com/yugabyte/yugabyte-db/issues/3642. React with thumbs up to raise its priority

```


### Tools and versions
- YugabyteDB docker image ```yugabytedb/yugabyte:2024.1.3.0-b105```
- Yugabyte Voyager docker image ```yugabytedb/yb-voyager:1.8.3```
- postgres docker image ```postgres:13```
- docker desktop ```Docker version 27.0.3, build 7d4bcd8```
- docker-compose ```Docker Compose version v2.28.1-desktop.1```
- MacOS Sonoma 14.7

