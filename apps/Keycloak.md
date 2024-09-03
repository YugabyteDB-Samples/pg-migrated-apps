# Keycloak

Open Source Identity and Access Management - Keycloak provides user federation, strong authentication, user management, fine-grained authorization, and more.

[GitHub](https://github.com/keycloak/keycloak)

## Steps for Migration (verified on M1 Mac)

1. Run Keycloak with PostgreSQL database in Docker:

```
export POSTGRES_DB=keycloak_db POSTGRES_USER=keycloak_db_user POSTGRES_PASSWORD=keycloak_db_user_password KEYCLOAK_ADMIN=admin KEYCLOAK_ADMIN_PASSWORD=password

docker network create keycloak_network

docker run -d \
  --name postgres \
  --network keycloak_network \
  -e POSTGRES_DB=${POSTGRES_DB} \
  -e POSTGRES_USER=${POSTGRES_USER} \
  -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
  -v postgres_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:12

! while ! docker exec -it postgres pg_isready -U ${POSTGRES_USER}; do sleep 1; done

docker run -d \
  --name keycloak \
  --network keycloak_network \
  -e KC_HOSTNAME=localhost \
  -e KC_HOSTNAME_PORT=8080 \
  -e KC_HOSTNAME_STRICT_BACKCHANNEL=false \
  -e KC_HTTP_ENABLED=true \
  -e KC_HTTP_RELATIVE_PATH="/auth" \
  -e KC_HOSTNAME_STRICT_HTTPS=false \
  -e KC_HEALTH_ENABLED=true \
  -e KEYCLOAK_ADMIN=${KEYCLOAK_ADMIN} \
  -e KEYCLOAK_ADMIN_PASSWORD=${KEYCLOAK_ADMIN_PASSWORD} \
  -e KC_DB=postgres \
  -e KC_DB_URL=jdbc:postgresql://postgres/${POSTGRES_DB} \
  -e KC_DB_USERNAME=${POSTGRES_USER} \
  -e KC_DB_PASSWORD=${POSTGRES_PASSWORD} \
  -p 8080:8080 \
  --restart always \
  quay.io/keycloak/keycloak:latest start
```

Access the UI http://localhost:8080 and Login using `admin/password`.

2. Generate data for Keycloak - Create realm, clients and users.

```
pip install requests~=2.32.3 faker~=27.4.0
python https://raw.githubusercontent.com/tusharraut-yb/keycloak-yb/main/kc_data_generator.py
```
Access the UI http://localhost:8080 and Login using `admin/password`. Once logged in, verify that the `test-realm` has been successfully created, along with the associated clients and users within that realm.

3. Run YugabyteDB in Docker:

```
docker network create db_migration_network

docker run -d --name yugabyte -p7000:7000 -p9000:9000 -p15433:15433 -p5433:5433 -p9042:9042 --network db_migration_network \
 yugabytedb/yugabyte:2024.1.1.0-b137 bin/yugabyted start \
 --background=false \
 --enable_pg_parity_tech_preview
```

4. Execute offline migration.
    - [Offline migration](https://docs.yugabyte.com/preview/yugabyte-voyager/migrate/migrate-steps/)
    - [Install YB-Voyager](https://docs.yugabyte.com/preview/yugabyte-voyager/install-yb-voyager/#install-yb-voyager)

5. Verify schema and data parity between PostgreSQL and YugabyteDB.

6. Run Keycloak with YugaByte database in Docker:

```
export POSTGRES_DB=keycloak_db POSTGRES_USER=yugabyte POSTGRES_PASSWORD=yugabyte KEYCLOAK_ADMIN=admin KEYCLOAK_ADMIN_PASSWORD=password

docker run -d \
  --name keycloak-yb \
  --network db_migration_network \
  -e KC_HOSTNAME=localhost \
  -e KC_HOSTNAME_PORT=8080 \
  -e KC_DB_SCHEMA=public \
  -e KC_HOSTNAME_STRICT_BACKCHANNEL=false \
  -e KC_HTTP_ENABLED=true \
  -e KC_HTTP_RELATIVE_PATH="/auth" \
  -e KC_HOSTNAME_STRICT_HTTPS=false \
  -e KC_HEALTH_ENABLED=true \
  -e KEYCLOAK_ADMIN=${KEYCLOAK_ADMIN} \
  -e KEYCLOAK_ADMIN_PASSWORD=${KEYCLOAK_ADMIN_PASSWORD} \
  -e KC_DB=postgres \
  -e KC_DB_URL=jdbc:postgresql://yugabyte:5433/${POSTGRES_DB} \
  -e KC_DB_USERNAME=${POSTGRES_USER} \
  -e KC_DB_PASSWORD=${POSTGRES_PASSWORD} \
  -p 8080:8080 \
  --restart always \
  quay.io/keycloak/keycloak:latest start
```
Access the UI http://localhost:8080 and Login using `admin/password`. Verify realm, client and users data is present.
