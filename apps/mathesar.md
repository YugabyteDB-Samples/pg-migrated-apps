# mathesar

Web application providing an intuitive user experience to databases.

[GitHub](https://github.com/mathesar-foundation/mathesar)

1. Clone the [repository](https://github.com/mathesar-foundation/mathesar).
2. Run the application using 'docker compose'.

The complete installation instructions can be found [here](https://docs.mathesar.org/latest/installation/docker-compose/).

```
docker compose up -d
```

3. Visit the UI at http://localhost.
4. Complete the form in the UI to create an admin user and interact with the appliction.
5. Perform offline migration.
6. Update environment variables in `docker-compose.yml` to point to YugabyteDB.
7. Re-run the application, pointint to YugabyteDB.

```
docker compose up -d
```
