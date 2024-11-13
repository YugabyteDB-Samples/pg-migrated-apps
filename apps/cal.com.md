# cal.com

The open source Calendly alternative, formerly Calendso

[GitHub](https://github.com/calcom/cal.com)

1. Clone the [repository](https://github.com/calcom/cal.com).
2. Follow instructions to build and run application on project README.
3. Perform offline migration.
   NOTE: You'll need to install `pgcrypto` in YugabyteDB to use UUIDs.
4. Update `.env` file to point to YugabyteDB.
5. Re-run Application.

Notes for running directly on YugabyteDB without migration.

1. Add DDL to install pgcrypto extension.

   In `packages/prisma/migrations/20240321143215_move_avatars_cols_to_avatar_table`:

   ```
   CREATE EXTENSION IF NOT EXISTS pgcrypto;
   ```

2. Add `shadowDatabaseUrl` to `schema.prisma`.

   ```

   datasource db {
       provider  = "postgresql"
       url       = env("DATABASE_URL")
       directUrl = env("DATABASE_DIRECT_URL")
       shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
   }

   ```

3. Add `SHADOW_DATABASE_URL` to `.env` if not already present.

   ```

   SHADOW_DATABASE_URL="postgresql://yugabyte:yugabyte@localhost:5433/calendso_shadow"

   ```
