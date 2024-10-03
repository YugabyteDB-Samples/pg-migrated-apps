# baserow

an open source no-code database tool and Airtable alternative

[GitHub](https://github.com/bram2w/baserow)

### Installation 

```

Ubuntu install: https://github.com/bram2w/baserow/blob/master/docs/installation/install-on-ubuntu.md.

```

### Starting app against Postgresql

#### Docker self hosted postgres

```
Docker Ubuntu cmd:

​​docker run -e BASEROW_PUBLIC_URL=http://localhost --name baserow -d --restart unless-stopped -v baserow_data:/baserow/data -p 15434:80 -p 443:443 baserow/baserow:1.27.2git
```

#### Docker with external postgres

```
docker run \
  -d \
  --name baserow \
  -e BASEROW_PUBLIC_URL=http://localhost \
  --add-host host.docker.internal:host-gateway \
  -e DATABASE_HOST=host.docker.internal  \
  -e DATABASE_PORT=5432 \
  -e DATABASE_USER=postgres \
  -e DATABASE_PASSWORD=password  \
  --restart unless-stopped \
  -v baserow_data:/baserow/data \
  -v /baserow/media:/baserow/data/media \
  -p 15434:80 \
  -p 443:443 \
  baserow/baserow:1.27.2
```

#### Starting app against YBDB

```
docker run \
  -d \
  --name baserow \
  -e BASEROW_PUBLIC_URL=http://localhost \
  --add-host docker:10.151.0.160 \
  -e DATABASE_HOST=10.151.0.160 \
  -e DATABASE_PORT=5433 \
  -e DATABASE_USER=yugabyte \
  --restart unless-stopped \
  -v baserow_data:/baserow/data \
  -v /baserow/media:/baserow/data/media \
  -p 15434:80 \
  -p 443:443 \
  baserow/baserow:1.27.2
```
