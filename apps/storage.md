# storage

S3 compatible object storage service that stores metadata in Postgres

[GitHub](https://github.com/supabase/storage)

1. [Clone the repository](https://github.com/supabase/storage).
2. Follow instructions to set up your environment, install applications dependencies, run migration scripts, etc.

   **NOTE: Run YugabyteDB on port 5434, as the storage applicaton runs a service on port 5433**

3. Perform offline migration.

   **NOTE: Make the following changes in the export directory.**

   Create function in export directory `functions/function.sql`. This function and the associated trigger below will serve as a workaround to avoid the GENERATE ALWAYS AS ... STORED error.

   ```
   CREATE OR REPLACE FUNCTION storage.compute_path_tokens () RETURNS TRIGGER LANGUAGE plpgsql AS $$
   BEGIN
       -- Set path_tokens based on the name column
       NEW.path_tokens := string_to_array(NEW.name, '/'::text);
       RETURN NEW;
   END;
   $$;
   ```

   Create trigger in export directory `triggers/trigger.sql`.

   ```
   CREATE TRIGGER trigger_compute_path_tokens BEFORE INSERT
   OR
   UPDATE ON storage.objects FOR EACH ROW
   EXECUTE FUNCTION storage.compute_path_tokens ();
   ```

   Create extension in export directory `extensions/extension.sql`. This will allow YugabyteDB to use the `gen_random_uuid` function.

   ```
   CREATE EXTENSION IF NOT EXISTS pgcrypto;
   ```

4. After completing migration, point application to run on YugabyteDB.
