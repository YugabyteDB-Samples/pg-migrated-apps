# SQLchat

Chat-based SQL Client and Editor for the next decade

[GitHub](https://github.com/sqlchat/sqlchat)

1. [Clone project](https://github.com/sqlchat/sqlchat).
2. Follow instructions for running Prisma migration scripts against your own PostgreSQL instance.
3. Run the application, pointing to PostgreSQL.

   **Note: By default, the application assumes that users supplying a database URL are running in a hosted environment. This assumption in the NextJS application to fail without removing NextAuth from several files. Building and running a local Docker image might be required.**

4. Interact with the application, asking questions and querying a local database.
5. Perform offline migration.
6. Run the application, pointing to YugabyteDB.
7. Verify the application works as intended.
