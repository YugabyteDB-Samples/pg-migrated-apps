# Discourse

A platform for community discussion. Free, open, simple.

[GitHub](https://github.com/discourse/discourse)

## Steps for Migration

1. Clone the [repository](https://github.com/discourse/discourse.git).
2. Install project [dependencies](https://meta.discourse.org/t/install-discourse-on-macos-for-development/15772#p-53437-install-discourse-dependencies-1).

   Instructions are provided for each platform. Migration was done using those for [macOS](https://meta.discourse.org/t/install-discourse-on-macos-for-development/15772).

3. Update `database.yml` to include database connection details in each block. _Note: The mac instructions include a local PostgreSQL installation, but one can choose to deploy PostgreSQL in Docker if desired_

   ```
   default: &default
   port: 5432
   host: localhost
   user: postgres
   password: password
   development:
   <<: *default
   ...
   test:
   <<: *default
   ...
   profile:
   <<: *default
   ...
   ```

4. [Bootstrap](https://meta.discourse.org/t/install-discourse-on-macos-for-development/15772#p-53437-bootstrap-discourse-4) the application.
5. Create an [admin account](https://meta.discourse.org/t/install-discourse-on-macos-for-development/15772#p-53437-create-new-admin-5).
6. With application running, log in via UI as admin user and verify functionality by adding topics, replies to existing topics, etc.
7. Execute offline migration.

   _**NOTE:** migrate multiple schemas from the discourse_development database - public and discourse_functions_

8. Edit files in export directory per recommendations in `Migration Assessment` and `Schema Analysis Report`.
   - remove indexes on INET data type (ip_address column)
   - remove GIST indexes
9. Change connection details in `database.yml` to point to YugabyteDB.

```
default: &default
port: 5433
host: localhost
user: yugabyte
password: yugabyte
development:
<<: *default
...
test:
<<: *default
...
profile:
<<: *default
...
```

10. Restart the server.
11. Verify the application backed by YugabyteDB.

## Tips:

- Error Running App

  ```
  Starting CSS change watcher
  objc[61181]: +[__NSCFConstantString initialize] may have been in progress in another thread when fork() was called.
  objc[61181]: +[__NSCFConstantString initialize] may have been in progress in another thread when fork() was called. We cannot safely call it or ignore it in the fork() child process. Crashing instead. Set a breakpoint on objc_initializeAfterForkError to debug.
  ```

  Fixed by setting `OBJC_DISABLE_INITIALIZE_FORK_SAFETY` environment variable:

  ```
  export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES
  ```

- Error with ADVISORY_LOCKS when connecting directly to YugabyteDB.

  Start YugabyteDB with `yb_silence_advisory_locks_not_supported_error=true` tserver_flag.

  i.e.:

  ```
  docker run -d --name yugabyte-no-locks -p7000:7000 -p9000:9000 -p15433:15433 -p5433:5433 -p9042:9042  \
  yugabytedb/yugabyte:2024.1.1.0-b137 bin/yugabyted start --tserver_flags="ysql_pg_conf_csv={log_statement=all,yb_silence_advisory_locks_not_supported_error=true}" --background=false \
  --enable_pg_parity_tech_preview
  ```
