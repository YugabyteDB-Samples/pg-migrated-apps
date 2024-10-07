# pg-boss

Queueing jobs in Node.js using PostgreSQL like a boss

[GitHub](https://github.com/timgit/pg-boss)

### Install

```
# npm
npm install pg-boss
```

### Run an app using pg-boss connecting to YugabyteDB

- create a file `testapp.js` copy the below content

```js
async function readme() {
  const PgBoss = require('pg-boss');
  const boss = new PgBoss('postgres://yugabyte:*****@ip:5433/yugabyte');
  const sleep = ms => new Promise(res => setTimeout(res, ms));
  
  boss.on('error', console.error)

  await boss.start()

  const queue = 'readme-queue'

  await boss.createQueue(queue)

  const id = await boss.send(queue, { arg1: 'read me' })

  console.log(`created job ${id} in queue ${queue}`)

  await sleep(3000)

  await boss.work(queue, async ([ job ]) => {
    console.log(`received job ${job.id} with data ${JSON.stringify(job.data)}`)
  })
}

readme()
  .catch(err => {
    console.log(err)
    process.exit(1)
  })
```

- Execute the nodejs app

```sh
node testapp2.js
```

### For Postgresql

```js
const pgBoss = require('pg-boss');

const config = {
  database: 'postgres',
  user: 'nikhil',
  password: '****',
  host: 'ip',
  port: 5432 // Default PostgreSQL port
};

async function start() {
  const boss = new pgBoss(config);

  await boss.start();

  // Register a job
  await boss.subscribe('send-email', async (job) => {
    console.log(`Sending email to ${job.data.email}`);
    // Implement your email sending logic here
  });

  // Create a job
  await boss.publish('send-email', { email: 'user@example.com' });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await boss.stop();
    process.exit();
  });
}

start();
