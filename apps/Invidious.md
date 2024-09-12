# Invidious

An alternative front-end to YouTube

[GitHub](https://github.com/iv-org/invidious)

1. Clone the [repository](https://github.com/iv-org/invidious).
2. Edit the `docker-compose.yml` file per the [installation instructions](https://docs.invidious.io/installation/#docker).
3. From the root directory, execute `docker-compose up` to start the application and PostgreSQL database.
4. Generate data for the application.
5. Run YugabyteDB in Docker:

```
docker run -d --name yugabyte -p7000:7000 -p9000:9000 -p15433:15433 -p5433:5433 -p9042:9042 --network db_migration_network \
 yugabytedb/yugabyte:2024.1.1.0-b137 bin/yugabyted start \
 --background=false \
 --enable_pg_parity_tech_preview
```

6. Execute offline migration.
   _Note: Remove UNLOGGED from table definition_
7. Create `docker-compose-yb.yml` file and point to YugabyteDB instance.
   ```
   ...
   db:
    dbname: invidious
    user: yugabyte
    password: yugabyte
    host: host.docker.internal
    port: 5433
   ```
8. Edit insert function in `channels.cr`.

_NOTE: In its original form, this function dynamically queries the database and returns a boolean value based on the `xmax` column of the database. This column is part of the PostgreSQL storage layer and is not supported by YugabyteDB. This function can easily be rewritten to work with YugabyteDB._

```
def insert(video : ChannelVideo, with_premiere_timestamp : Bool = false) : Bool
  if with_premiere_timestamp
    last_items = "premiere_timestamp = $9, views = $10"
  else
    last_items = "views = $10"
  end

  request = <<-SQL
    INSERT INTO channel_videos
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    ON CONFLICT (id) DO UPDATE
    SET title = $2, published = $3, updated = $4, ucid = $5,
        author = $6, length_seconds = $7, live_now = $8, #{last_items}
    RETURNING id
  SQL

  # If a row is returned, the operation was successful
  result = PG_DB.query_one?(request, *video.to_tuple, as: String?)

  return result.not_nil?
end
```

1. Build Docker image from root directory.

```
docker build -t invidious-local-image -f ./docker/Dockerfile .
```

10. Update `docker-compose-yb.yml` to use this newly-build Docker image.

```
...
image: invidious-local-image:latest
```

11. Run application services.

```
docker-compose up
```
