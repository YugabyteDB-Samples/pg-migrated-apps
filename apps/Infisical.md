# Infisical

Infisical is the open-source secret management platform: Sync secrets across your team/infrastructure, prevent secret leaks, and manage internal PKI

[GitHub](https://github.com/Infisical/infisical)

1. [Clone the repository](https://github.com/Infisical/infisical).
2. Update the 'frontend/Dockerfile.dev` file to use Node v20
   ```
   FROM node:20-alpine
   ...
   ```
3. Run the application using the `docker-compose.dev.yml` file.
   ```
   docker compose -f docker-compose.dev.yml up
   ```
4. Visit http://localhost:8080/admin/signup and create an admin user.
5. visit http://localhost:8080 and create projects and associated entities.
6. Execute offline migration.

   **NOTE: Fix the issues noted in the schema analysis report.**

   - Install the pgcrypto extension.
   - Remove constraints with DEFERRABLE INITIALLY DEFERRED.
   - Fix the function syntax.

   ```
   CREATE OR REPLACE FUNCTION public.on_update_timestamp()
   RETURNS TRIGGER
   LANGUAGE plpgsql
   AS $$
   BEGIN
    -- Update the updatedAt column to the current timestamp
    NEW."updatedAt" := NOW();
    RETURN NEW;
   END;
   $$;
   ```

7. Point the application services to YugabyteDB and the data has migrated successfully by verifying functionality in the UI.
