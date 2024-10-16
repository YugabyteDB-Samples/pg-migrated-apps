# nextjs-postgres-email-client

An email client built with the Next.js App Router and Postgres as the database.

[GitHub](https://github.com/leerob/nextjs-postgres-email-client)

1. [Clone the repository](https://github.com/leerob/next-email-client).
2. Follow steps in the README for building dependencies and running locally with `pnpm`.
3. After seeding the PostgreSQL database, run the application and visit the UI. Send an email to verify the functionality and add a record to the database.
4. Execute offline migration.
5. Stop the server and edit the `.env` file to point to your YugabyteDB instance

   In my case:

   ```
   POSTGRES_URL=postgres://yugabyte:yugabyte@localhost:5433/postgres
   ```

6. Re-run the application and verify the functionality by visiting the UI once more. Create another email and verify is is stored in the `emails` table of your YugabyteDB instance.
