# Satellity

Yet another open source forum written in Golang, React and PostgreSQL.

[GitHub](https://github.com/satellity/satellity)

1. [Clone the application](https://github.com/satellity/satellity).
2. Follow build and run instructions for server and ui components.
3. Execute offline migration.
4. Change `config.yaml` to point to YugabyteDB.

   ```
   ...
   database:
       user: yugabyte
       password: "yugabyte"
       host: localhost
       port: 5433
   ```

5. Restart application services.
