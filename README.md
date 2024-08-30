# pg-migrated-apps

A collection of applications migrated from PostgreSQL to YugabyteDB.

## Prerequisites

1. Join the [YugabyteDB Slack Community](https://communityinviter.com/apps/yugabyte-db/register), head to the [pg-app-century-challenge channel](https://yugabyte-db.slack.com/archives/C07HF8K2KN3), and raise your hand!
2. Fork this repository.
3. Install [PostgreSQL](https://www.postgresql.org/download) or [run in Docker](https://hub.docker.com/_/postgres).
4. Install [YugabyteDB](https://docs.yugabyte.com/preview/quick-start/).
   **NOTE: Be sure to run YugabyteDB with the `--enable_pg_parity_tech_preview` flag**
5. Install [YugabyteDB Voyager](https://docs.yugabyte.com/preview/yugabyte-voyager/install-yb-voyager/).

## Migration Steps

Instructions for migrating and running each application are available and linked in the `Instructions` column of the table below. Unless otherwise stated, follow these steps:

### Run on PostgreSQL

1. Start the application on PostgreSQL.
2. Load sample data.
3. Confirm the application is running properly.

### Perform Offline Migration

Use the `yb-voyager` CLI to [perform an offline migration](https://docs.yugabyte.com/preview/yugabyte-voyager/migrate/migrate-steps/).

1. Generate and view migration assessment report.
2. Export the schema and data from PostgreSQL.
3. Perform schema analysis and review report.
4. Import the schema and data to YugabyteDB.
5. Verify the migration was successful by running queries to check row counts.
6. Run the application on YugabyteDB.

### After Migration

1. Fill out application instructions in `/apps/APP_NAME.md`
2. Issue a pull request to contribute to this project.
3. Report your status to the [pg-app-century-challenge channel](https://yugabyte-db.slack.com/archives/C07HF8K2KN3).

## List of Applications

<!-- TABLE_START -->
|     | Name                     | Description                                                                                            | Instructions                                           | Status       | Contributor     |
| --- | ------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ | ------------ | --------------- |
| 1   | [FireFly III](https://github.com/firefly-iii/firefly-iii) | A personal finances manager                                            | [Run on YugabyteDB](apps/FireFly-III.md)           | Done            | [@ymahajan](https://github.com/ymahajan) |
| 2   | [Documenso](https://github.com/documenso/documenso) | The Open Source DocuSign Alternative.                                  | [Run on YugabyteDB](apps/Documenso.md)             | Done            | [@ymahajan](https://github.com/ymahajan) |
| 3   | [Twenty](https://github.com/twentyhq/twenty) | a modern alternative to Salesforce, powered by the community.          | [Run on YugabyteDB](apps/Twenty.md)                | Blocked         | [@ymahajan](https://github.com/ymahajan) |
| 4   | [Umami](https://github.com/umami-software/umami) | A simple, fast, privacy-focused alternative to Google Analytics.       | [Run on YugabyteDB](apps/Umami.md)                 | Done            | [@ymahajan](https://github.com/ymahajan) |
| 5   | [Mattermost](https://github.com/mattermost/mattermost) | Open source platform that provides secure collaboration for technical and operational teams that work in environments with complex nation-state level security and trust requirements. | [Run on YugabyteDB](apps/Mattermost.md)            | In progress     |                 |
| 6   | [Bytebase](https://github.com/bytebase/bytebase) | The GitHub/GitLab for database DevOps                                  | [Run on YugabyteDB](apps/Bytebase.md)              | In progress     | [@vaibhav-yb](https://github.com/vaibhav-yb) |
| 7   | [Keycloak](https://github.com/keycloak/keycloak) | Open Source Identity and Access Management For Modern Applications and Services | [Run on YugabyteDB](apps/Keycloak.md)              | Done            | [@tusharraut-yb](https://github.com/tusharraut-yb) |
| 8   | [HedgeDoc](https://github.com/hedgedoc/hedgedoc) | Was CodiMD: create real-time collaborative markdown notes              | [Run on YugabyteDB](apps/HedgeDoc.md)              | Done            | [@franckpachot](https://github.com/franckpachot) |
| 9   | [NocoDB](https://github.com/nocodb/nocodb) | An Open Source Alternative to Airtable                                 | [Run on YugabyteDB](apps/NocoDB.md)                | Done            | [@franckpachot](https://github.com/franckpachot) |
| 10  | [Wiki.js](https://github.com/requarks/wiki) | A modern and powerful wiki app built on Node.js                        | [Run on YugabyteDB](apps/Wiki.js.md)               | Done            | [@franckpachot](https://github.com/franckpachot) |
| 11  | [Replibyte](https://github.com/Qovery/Replibyte) | Replibyte is a blazingly fast tool to seed your databases with your production data while keeping sensitive data safe     | [Run on YugabyteDB](apps/Replibyte.md)             | Done            | [@franckpachot](https://github.com/franckpachot) |
| 12  | [Commento](https://github.com/adtac/commento) | A fast, bloat-free comments platform                                   | [Run on YugabyteDB](apps/Commento.md)              | Done            | [@BrettHoyer](https://github.com/BrettHoyer) |
| 13  | [Spree](https://github.com/spree/spree) | Online Commerce for Ruby on Rails                                      | [Run on YugabyteDB](apps/Spree.md)                 | Done            | [@BrettHoyer](https://github.com/BrettHoyer) |
| 14  | [Nocobase](https://github.com/nocobase/nocobase) | A scalability-first, open-source no-code/low-code platform to build internal tools. | [Run on YugabyteDB](apps/Nocobase.md)              | Done            | [@BrettHoyer](https://github.com/BrettHoyer) |
| 15  | [Invidious](https://github.com/iv-org/invidious) | An alternative front-end to YouTube                                    | [Run on YugabyteDB](apps/Invidious.md)             | Done            | [@BrettHoyer](https://github.com/BrettHoyer) |
| 16  | [cal.com](https://github.com/calcom/cal.com) | The open source Calendly alternative, formerly Calendso                | [Run on YugabyteDB](apps/cal.com.md)               | In progress     |                 |
| 17  | [Discourse](https://github.com/discourse/discourse) | A platform for community discussion. Free, open, simple.               | [Run on YugabyteDB](apps/Discourse.md)             | In progress     |                 |
| 18  | [mathesar](https://github.com/mathesar-foundation/mathesar) | Web application providing an intuitive user experience to databases.   | [Run on YugabyteDB](apps/mathesar.md)              | Blocked         |                 |
| 19  | [bank](https://github.com/pietrzakadrian/bank) | Full Stack Web Application similar to financial software that is used in banking institutions   React.js and Node.js | [Run on YugabyteDB](apps/bank.md)                  | Done            | [@BrettHoyer](https://github.com/BrettHoyer) |
| 20  | [NodeBB](https://github.com/NodeBB/NodeBB) | Node.js based forum software built for the modern web                  | [Run on YugabyteDB](apps/NodeBB.md)                | Done            | [@BrettHoyer](https://github.com/BrettHoyer) |
| 21  | [Evershop](https://github.com/evershopcommerce/evershop) | NodeJS E-commerce Platform                                             | [Run on YugabyteDB](apps/Evershop.md)              | Done            | [@BrettHoyer](https://github.com/BrettHoyer) |
| 22  | [pgTyped](https://github.com/adelsz/pgtyped) |  Typesafe SQL in TypeScript                                            | [Run on YugabyteDB](apps/pgTyped.md)               | In progress     |                 |
| 23  | [Quivr](https://github.com/QuivrHQ/quivr) | Open-source RAG Framework                                              | [Run on YugabyteDB](apps/Quivr.md)                 | In progress     |                 |
| 24  | [Temporal](https://github.com/temporalio/temporal) | Open source durable execution system. Write code that’s fault tolerant, durable, and simple. | [Run on YugabyteDB](apps/Temporal.md)                     | Fail (PG12) | [@franckpachot](https://github.com/franckpachot) |
| 25  | [Redmine](https://github.com/redmine/redmine) | A flexible project management web application written using Ruby on Rails framework. | [Run on YugabyteDB](apps/Redmine.md)               |                 |                 |
| 26  | [Plume](https://github.com/Plume-org/Plume) | A a federated blogging engine, based on ActivityPub.                   | [Run on YugabyteDB](apps/Plume.md)                 |                 |                 |
| 27  | [Kine](https://github.com/k3s-io/kine) | Alternative to Etcd.   It already works on YugabyteDB - blog and video. | [Run on YugabyteDB](apps/Kine.md)                  |                 |                 |
| 28  | [AWS data.all](https://github.com/data-dot-all/dataall) | A modern data marketplace that makes collaboration among diverse users (like business, analysts and engineers) easier, increasing efficiency and agility in data projects on AWS. | [Run on YugabyteDB](apps/AWS-data.all.md)          |                 |                 |
| 29  | [Cachet](https://github.com/cachethq/cachet) | Open-source status page system                                         | [Run on YugabyteDB](apps/Cachet.md)                |                 |                 |
| 30  | [Plane](https://github.com/makeplane/plane) | Open Source JIRA, Linear and Asana Alternative.                        | [Run on YugabyteDB](apps/Plane.md)                 |                 |                 |
| 31  | [Dogehouse](https://github.com/benawad/dogehouse) | Taking voice conversations to the moon                                 | [Run on YugabyteDB](apps/Dogehouse.md)             |                 |                 |
| 32  | [logto](https://github.com/logto-io/logto) | The better identity infrastructure for developers and the open-source alternative to Auth0. | [Run on YugabyteDB](apps/logto.md)                 |                 |                 |
| 33  | [teable](https://github.com/teableio/teable) | The Next Gen Airtable Alternative: No-Code Postgres                    | [Run on YugabyteDB](apps/teable.md)                |                 |                 |
| 34  | [bolt](https://github.com/bolt/bolt?tab=readme-ov-file) | a simple CMS written in PHP                                            | [Run on YugabyteDB](apps/bolt.md)                  |                 |                 |
| 35  | [waline](https://github.com/walinejs/waline) | A Simple, Safe Comment System                                          | [Run on YugabyteDB](apps/waline.md)                |                 |                 |
| 36  | [baserow](https://github.com/bram2w/baserow) | an open source no-code database tool and Airtable alternative          | [Run on YugabyteDB](apps/baserow.md)               |                 |                 |
| 37  | [webapp.rs](https://github.com/saschagrunert/webapp.rs) | A web application completely written in Rust.                          | [Run on YugabyteDB](apps/webapp.rs.md)             |                 |                 |
| 38  | [metafresh](https://github.com/metasfresh/metasfresh) | Open Source ERP                                                        | [Run on YugabyteDB](apps/metafresh.md)             |                 |                 |
| 39  | [WrenAI](https://github.com/Canner/WrenAI) | Open-source Text-to-SQL solution, Wren AI makes your database RAG-ready | [Run on YugabyteDB](apps/WrenAI.md)                |                 |                 |
| 40  | [mybb](https://github.com/mybb/mybb) | a free and open source forum software.                                 | [Run on YugabyteDB](apps/mybb.md)                  |                 |                 |
| 41  | [aquameta](https://github.com/aquametalabs/aquameta) | Web development platform built entirely in PostgreSQL                  | [Run on YugabyteDB](apps/aquameta.md)              |                 |                 |
| 42  | [cocalc](https://github.com/sagemathinc/cocalc) | Collaborative Calculation in the Cloud                                 | [Run on YugabyteDB](apps/cocalc.md)                |                 |                 |
| 43  | [zenedo](https://github.com/zenodo/zenodo) | a CERN service, is an open dependable home for the long-tail of science, enabling researchers to share and preserve any research outputs in any size, any format and from any science. | [Run on YugabyteDB](apps/zenedo.md)                |                 |                 |
| 44  | [chatWeb](https://github.com/SkywalkerDarren/chatWeb) | ChatWeb can crawl web pages, read PDF, DOCX, TXT, and extract the main content, then answer your questions based on the content, or summarize the key points. | [Run on YugabyteDB](apps/chatWeb.md)               | Blocked         |                 |
| 45  | [Plausible Analytics](https://github.com/plausible/analytics) | Simple, open source, lightweight (< 1 KB) and privacy-friendly web analytics alternative to Google Analytics. | [Run on YugabyteDB](apps/Plausible-Analytics.md)   |                 |                 |
| 46  | [LedgerSMB]()             | Double-entry accounting & ERP for the web                              | [Run on YugabyteDB](apps/LedgerSMB.md)             |                 |                 |
| 47  | [Jira]()                  | An agile project management tool used by teams to plan, track, release and support software | [Run on YugabyteDB](apps/Jira.md)                  |                 |                 |
| 48  | [Confluence]()            | A collaborative platform used for creating, sharing, and organizing content within teams and organizations | [Run on YugabyteDB](apps/Confluence.md)            |                 |                 |
| 49  | [Puppet]()                |                                                                        | [Run on YugabyteDB](apps/Puppet.md)                |                 |                 |
| 50  | [GitLab]()                |                                                                        | [Run on YugabyteDB](apps/GitLab.md)                |                 |                 |
| 51  | [Stansoft]()              |                                                                        | [Run on YugabyteDB](apps/Stansoft.md)              |                 |                 |
| 52  | [Orthanc](https://www.orthanc-server.com/download.php) | free and open-source, lightweight DICOM server for medical imaging from Belgium. | [Run on YugabyteDB](apps/Orthanc.md)              |                 |                 |
| 53  | [Servicebot](https://github.com/service-bot/servicebot) | Open-source subscription management & billing automation system        | [Run on YugabyteDB](apps/Servicebot.md)            |                 |                 |
| 54  | [Miaou](https://github.com/Canop/miaou) | A chat server with OAuth2 authentication, persistent and searchable history, video and audio, markdown formatting, private and public rooms, stars, votes, embedded games, and many other features | [Run on YugabyteDB](apps/Miaou.md)                 |                 |                 |
| 55  | [Tasking Manager](https://github.com/hotosm/tasking-manager) | The app to team up for mapping in OpenStreetMap                        | [Run on YugabyteDB](apps/Tasking-Manager.md)       |                 |                 |
| 56  | [FeedHQ](https://github.com/feedhq/feedhq) | FeedHQ is a web-based feed reader                                      | [Run on YugabyteDB](apps/FeedHQ.md)                |                 |                 |
| 57  | [Open EduCat](https://github.com/openeducat/openeducat_erp) | Comprehensive Open Source ERP for Educational Institutes               | [Run on YugabyteDB](apps/Open-EduCat.md)           |                 |                 |
| 58  | [SQL Translator](https://github.com/whoiskatrin/sql-translator) | SQL Translator is a tool for converting natural language queries into SQL code using artificial intelligence. This project is 100% free and open source. | [Run on YugabyteDB](apps/SQL-Translator.md)        |                 |                 |
| 59  | [Papermark](https://github.com/mfts/papermark) | Papermark is the open-source DocSend alternative with built-in analytics and custom domains. | [Run on YugabyteDB](apps/Papermark.md)             |                 |                 |
| 60  | [Saasfly](https://github.com/saasfly/saasfly) | Your Next SaaS Template or Boilerplate ! A magic trip start with `bun create saasfly` . The more stars, the more surprises | [Run on YugabyteDB](apps/Saasfly.md)               |                 |                 |
| 61  | [Worklenz](https://github.com/Worklenz/worklenz) | All in one project management tool for efficient teams                 | [Run on YugabyteDB](apps/Worklenz.md)              |                 |                 |
| 62  | [Picsur](https://github.com/CaramelFur/Picsur) | An easy to use, selfhostable image sharing service like Imgur with built in converting | [Run on YugabyteDB](apps/Picsur.md)                |                 |                 |
| 63  | [Miniflux/v2](https://github.com/miniflux/v2) | Minimalist and opinionated feed reader                                 | [Run on YugabyteDB](apps/Miniflux-v2.md)           |                 |                 |
| 64  | [Goxygen](https://github.com/Shpota/goxygen) | Generate a modern Web project with Go and Angular, React, or Vue in seconds | [Run on YugabyteDB](apps/Goxygen.md)               |                 |                 |
| 65  | [short](https://github.com/short-d/short) | URL shortening service written in Go and React                         | [Run on YugabyteDB](apps/short.md)                 |                 |                 |
| 66  | [maybe](https://github.com/maybe-finance/maybe) | The OS for your personal finances                                      | [Run on YugabyteDB](apps/maybe.md)                 |                 |                 |
| 67  | [windmill](https://github.com/windmill-labs/windmill) | Open-source developer platform to turn scripts into workflows and UIs. Fastest workflow engine (5x vs Airflow). Open-source alternative to Airplane and Retool.    | [Run on YugabyteDB](apps/windmill.md)              |                 |                 |
| 68  | [Zitadel](https://github.com/zitadel/zitadel) | Identity infrastructure, simplified for you.                           | [Run on YugabyteDB](apps/Zitadel.md)               |                 |                 |
| 69  | [zws](https://github.com/zws-im/zws) | Shorten URLs using invisible spaces                                    | [Run on YugabyteDB](apps/zws.md)                   |                 |                 |
| 70  | [DrawDB](https://github.com/drawdb-io/drawdb) | Free, simple, and intuitive online database design tool and SQL generator.    | [Run on YugabyteDB](apps/DrawDB.md)                |                 |                 |
| 71  | [Hyperswitch](https://github.com/juspay/hyperswitch) | An open source payments switch written in Rust to make payments fast, reliable and affordable | [Run on YugabyteDB](apps/Hyperswitch.md)           |                 |                 |
| 72  | [coolify](https://github.com/coollabsio/coolify) | An open-source & self-hostable Heroku / Netlify / Vercel alternative.  | [Run on YugabyteDB](apps/coolify.md)               |                 |                 |
| 73  | [Dolibarr](https://github.com/Dolibarr/dolibarr) | Dolibarr ERP CRM is a modern software package to manage your company or foundation's activity (contacts, suppliers, invoices, orders, stocks, agenda, accounting, ...). it's an open source Web application (written in PHP) designed for businesses of any sizes, foundations and freelancers.    | [Run on YugabyteDB](apps/Dolibarr.md)              |                 |                 |
| 74  | [Chat2DB](https://github.com/chat2db/Chat2DB) | AI-driven database tool                                                | [Run on YugabyteDB](apps/Chat2DB.md)               |                 |                 |
| 75  | [usql](https://github.com/xo/usql) | Universal command-line interface for SQL databases                     | [Run on YugabyteDB](apps/usql.md)                  |                 |                 |
| 76  | [xpipe](https://github.com/xpipe-io/xpipe) | Your entire server infrastructure at your fingertips                   | [Run on YugabyteDB](apps/xpipe.md)                 |                 |                 |
| 77  | [records](https://github.com/kennethreitz/records) | SQL for Humans™                                                        | [Run on YugabyteDB](apps/records.md)               |                 |                 |
| 78  | [Kuwala](https://github.com/kuwala-io/kuwala) | Kuwala is the no-code data platform for BI analysts and engineers enabling you to build powerful analytics workflows. | [Run on YugabyteDB](apps/Kuwala.md)                |                 |                 |
| 79  | [storage](https://github.com/supabase/storage) | S3 compatible object storage service that stores metadata in Postgres  | [Run on YugabyteDB](apps/storage.md)               |                 |                 |
| 80  | [postgres-new](https://github.com/supabase-community/postgres-new) | In-browser Postgres sandbox with AI assistance                         | [Run on YugabyteDB](apps/postgres-new.md)          |                 |                 |
| 81  | [worker](https://github.com/graphile/worker) | High performance Node.js/PostgreSQL job queue (also suitable for getting jobs generated by PostgreSQL triggers/functions out into a different work queue) | [Run on YugabyteDB](apps/worker.md)                |                 |                 |
| 82  | [SQLchat](https://github.com/sqlchat/sqlchat) | Chat-based SQL Client and Editor for the next decade                   | [Run on YugabyteDB](apps/SQLchat.md)               |                 |                 |
| 83  | [Openblocks](https://github.com/openblocks-dev/openblocks) | The Open Source Retool Alternative                                     | [Run on YugabyteDB](apps/Openblocks.md)            |                 |                 |
| 84  | [nhost]()                 | The Open Source Firebase Alternative with GraphQL.                     | [Run on YugabyteDB](apps/nhost.md)                 |                 |                 |
| 85  | [PgQueuer](https://github.com/janbjorge/PgQueuer) | PgQueuer is a Python library leveraging PostgreSQL for efficient job queuing.    | [Run on YugabyteDB](apps/PgQueuer.md)              |                 |                 |
| 86  | [Payload](https://github.com/payloadcms/payload) | Payload is the open-source, fullstack Next.js framework, giving you instant backend superpowers. Get a full TypeScript backend and admin panel instantly. Use Payload as a headless CMS or for building powerful applications. | [Run on YugabyteDB](apps/Payload.md)               |                 |                 |
| 87  | [Infisical](https://github.com/Infisical/infisical) | Infisical is the open-source secret management platform: Sync secrets across your team/infrastructure, prevent secret leaks, and manage internal PKI | [Run on YugabyteDB](apps/Infisical.md)             |                 |                 |
| 88  | [Crystal](https://github.com/graphile/crystal) | Graphile's Crystal Monorepo; home to Grafast, PostGraphile, pg-introspection, pg-sql2 and much more! | [Run on YugabyteDB](apps/Crystal.md)               |                 |                 |
| 89  | [Jitsu](https://github.com/jitsucom/jitsu) | Jitsu is an open-source Segment alternative. Fully-scriptable data ingestion engine for modern data teams. Set-up a real-time data pipeline in minutes, not days | [Run on YugabyteDB](apps/Jitsu.md)                 |                 |                 |
| 90  | [DBLab]()                 | DBLab enables 🖖 database branching and ⚡️ thin cloning for any Postgres database and empowers DB testing in CI/CD. This optimizes database-related costs while improving time-to-market and software quality. Follow to stay updated. | [Run on YugabyteDB](apps/DBLab.md)                 |                 |                 |
| 91  | [nextjs-openai-doc-serach](https://github.com/supabase-community/nextjs-openai-doc-search) | Template for building your own custom ChatGPT style doc search powered by Next.js, OpenAI, and Supabase. | [Run on YugabyteDB](apps/nextjs-openai-doc-serach.md) |                 |                 |
| 92  | [Retrospected](https://github.com/antoinejaussoin/retro-board) | a free AI-powered Real-time Agile Retrospective Board for engineering teams. | [Run on YugabyteDB](apps/Retrospected.md)          |                 |                 |
| 93  | [nextjs-postgres-email-client](https://github.com/leerob/nextjs-postgres-email-client) | An email client built with the Next.js App Router and Postgres as the database. | [Run on YugabyteDB](apps/nextjs-postgres-email-client.md) |                 |                 |
| 94  | [LimeSurvey](https://github.com/LimeSurvey/LimeSurvey) | The most popular FOSS online survey tool on the web.                   | [Run on YugabyteDB](apps/LimeSurvey.md)            |                 |                 |
| 95  | [pg-boss](https://github.com/timgit/pg-boss) | Queueing jobs in Node.js using PostgreSQL like a boss                  | [Run on YugabyteDB](apps/pg-boss.md)               |                 |                 |
| 96  | [sqorn](https://github.com/sqorn/sqorn) | A Javascript library for building SQL queries                          | [Run on YugabyteDB](apps/sqorn.md)                 |                 |                 |
| 97  | [Thin Backend](https://github.com/digitallyinduced/thin-backend) | Thin Backend is a Blazing Fast, Universal Web App Backend for Making Realtime Single Page Apps | [Run on YugabyteDB](apps/Thin-Backend.md)          |                 |                 |
| 98  | [frappe](https://github.com/frappe/frappe) | Low code web framework for real world applications, in Python and Javascript | [Run on YugabyteDB](apps/frappe.md)                |                 |                 |
| 99  | [Alerta](https://github.com/alerta/alerta) | Alerta monitoring system                                               | [Run on YugabyteDB](apps/Alerta.md)                |                 |                 |
| 100 | [Barman](https://github.com/EnterpriseDB/barman) |  Backup and Recovery Manager for PostgreSQL                            | [Run on YugabyteDB](apps/Barman.md)                |                 |                 |
| 101 | [Mouthful](https://github.com/vkuznecovas/mouthful) | Mouthful is a self-hosted alternative to Disqus                        | [Run on YugabyteDB](apps/Mouthful.md)              |                 |                 |
| 102 | [Satellity](https://github.com/satellity/satellity) | Yet another open source forum written in Golang, React and PostgreSQL. | [Run on YugabyteDB](apps/Satellity.md)             |                 |                 |
| 103 | [Postgres WASM](https://github.com/snaplet/postgres-wasm) | A PostgreSQL server instance running in a virtual machine running in the browser | [Run on YugabyteDB](apps/Postgres-WASM.md)         |                 |                 |
| 104 | [NewBlur](https://github.com/samuelclay/NewsBlur) | NewsBlur is a personal news reader that brings people together to talk about the world. A new sound of an old instrument. | [Run on YugabyteDB](apps/NewBlur.md)               |                 |                 |
| 105 | [directus](https://github.com/directus/directus) | CMS / DB Tool. Directus is a real-time API and App dashboard for managing SQL database content. | [Run on YugabyteDB](apps/directus.md)              |                 |                 |
| 106 | [dbgate](https://github.com/dbgate/dbgate) | DbGate is cross-platform database manager. It's designed to be simple to use and effective, when working with more databases simultaneously.  | [Run on YugabyteDB](apps/dbgate.md)                |                 |                 |
| 107 | [Keycloak](https://github.com/keycloak/keycloak) | Open Source Identity and Access Management - Keycloak provides user federation, strong authentication, user management, fine-grained authorization, and more. | [Run on YugabyteDB](apps/Keycloak.md)              |                 |                 |
| 108 | [Wordpress](https://github.com/WordPress) | WordPress is among the most popular content management systems – it was used by 43.1% of the top 10 million websites as of December 2023  main repo is in subversion  pg4wp is a module used to make it run in PG  https://github.com/PostgreSQL-For-Wordpress | [Run on YugabyteDB](apps/Wordpress.md)             |                 |                 |
| 109 | [marten](https://github.com/JasperFx/marten) | .NET Transactional Document DB and Event Store on PostgreSQL           | [Run on YugabyteDB](apps/marten.md)                |                 |                 |
| 110 | [Pongo](https://github.com/event-driven-io/Pongo) | Pongo - Mongo but on Postgres and with strong consistency benefits     | [Run on YugabyteDB](apps/Pongo.md)                 |                 |                 |
<!-- TABLE_END -->
