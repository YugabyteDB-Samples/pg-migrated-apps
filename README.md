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
| 1   | [Alerta](https://github.com/alerta/alerta) | Alerta monitoring system                                               | [Run on YugabyteDB](apps/Alerta.md)                | Failed          |                 |
| 2   | [aquameta](https://github.com/aquametalabs/aquameta) | Web development platform built entirely in PostgreSQL                  | [Run on YugabyteDB](apps/aquameta.md)              | Not started     |                 |
| 3   | [AWS data.all](https://github.com/data-dot-all/dataall) | A modern data marketplace that makes collaboration among diverse users (like business, analysts and engineers) easier, increasing efficiency and agility in data projects on AWS. | [Run on YugabyteDB](apps/AWS-data.all.md)          | Not started     |                 |
| 4   | [bank](https://github.com/pietrzakadrian/bank) | Full Stack Web Application similar to financial software that is used in banking institutions   React.js and Node.js | [Run on YugabyteDB](apps/bank.md)                  | Migrated        | [@BrettHoyer](https://github.com/BrettHoyer) |
| 5   | [Barman](https://github.com/EnterpriseDB/barman) |  Backup and Recovery Manager for PostgreSQL                            | [Run on YugabyteDB](apps/Barman.md)                | In progress     |                 |
| 6   | [baserow](https://github.com/bram2w/baserow) | an open source no-code database tool and Airtable alternative          | [Run on YugabyteDB](apps/baserow.md)               | Failed          |                 |
| 7   | [bolt](https://github.com/bolt/bolt?tab=readme-ov-file) | a simple CMS written in PHP                                            | [Run on YugabyteDB](apps/bolt.md)                  | Migrated        | [@BrettHoyer](https://github.com/BrettHoyer) |
| 8   | [Bytebase](https://github.com/bytebase/bytebase) | The GitHub/GitLab for database DevOps                                  | [Run on YugabyteDB](apps/Bytebase.md)              | Migrated        | [@ymahajan](https://github.com/ymahajan) |
| 9   | [Cachet](https://github.com/cachethq/cachet) | Open-source status page system                                         | [Run on YugabyteDB](apps/Cachet.md)                | Migrated        | [@ymahajan](https://github.com/ymahajan) |
| 10  | [cal.com](https://github.com/calcom/cal.com) | The open source Calendly alternative, formerly Calendso                | [Run on YugabyteDB](apps/cal.com.md)               | In progress     | [@BrettHoyer](https://github.com/BrettHoyer) |
| 11  | [Chat2DB](https://github.com/chat2db/Chat2DB) | AI-driven database tool                                                | [Run on YugabyteDB](apps/Chat2DB.md)               | Not started     |                 |
| 12  | [chatWeb](https://github.com/SkywalkerDarren/chatWeb) | ChatWeb can crawl web pages, read PDF, DOCX, TXT, and extract the main content, then answer your questions based on the content, or summarize the key points. | [Run on YugabyteDB](apps/chatWeb.md)               | Failed          |                 |
| 13  | [cocalc](https://github.com/sagemathinc/cocalc) | Collaborative Calculation in the Cloud                                 | [Run on YugabyteDB](apps/cocalc.md)                | Migrated        | [@BrettHoyer](https://github.com/BrettHoyer) |
| 14  | [Commento](https://github.com/adtac/commento) | A fast, bloat-free comments platform                                   | [Run on YugabyteDB](apps/Commento.md)              | Migrated        | [@BrettHoyer](https://github.com/BrettHoyer) |
| 15  | [Confluence]()            | A collaborative platform used for creating, sharing, and organizing content within teams and organizations | [Run on YugabyteDB](apps/Confluence.md)            | Migrated        | [@dmagda](https://github.com/dmagda) |
| 16  | [coolify](https://github.com/coollabsio/coolify) | An open-source & self-hostable Heroku / Netlify / Vercel alternative.  | [Run on YugabyteDB](apps/coolify.md)               | Not started     |                 |
| 17  | [Crystal](https://github.com/graphile/crystal) | Graphile's Crystal Monorepo; home to Grafast, PostGraphile, pg-introspection, pg-sql2 and much more! | [Run on YugabyteDB](apps/Crystal.md)               | Not started     |                 |
| 18  | [dbgate](https://github.com/dbgate/dbgate) | DbGate is cross-platform database manager. It's designed to be simple to use and effective, when working with more databases simultaneously.  | [Run on YugabyteDB](apps/dbgate.md)                | Not started     |                 |
| 19  | [DBLab]()                 | DBLab enables 🖖 database branching and ⚡️ thin cloning for any Postgres database and empowers DB testing in CI/CD. This optimizes database-related costs while improving time-to-market and software quality. Follow to stay updated. | [Run on YugabyteDB](apps/DBLab.md)                 | Not started     |                 |
| 20  | [directus](https://github.com/directus/directus) | CMS / DB Tool. Directus is a real-time API and App dashboard for managing SQL database content. | [Run on YugabyteDB](apps/directus.md)              | Failed          |                 |
| 21  | [Discourse](https://github.com/discourse/discourse) | A platform for community discussion. Free, open, simple.               | [Run on YugabyteDB](apps/Discourse.md)             | Migrated        | [@BrettHoyer](https://github.com/BrettHoyer) |
| 22  | [Documenso](https://github.com/documenso/documenso) | The Open Source DocuSign Alternative.                                  | [Run on YugabyteDB](apps/Documenso.md)             | Migrated        | [@ymahajan](https://github.com/ymahajan) |
| 23  | [Dogehouse](https://github.com/benawad/dogehouse) | Taking voice conversations to the moon                                 | [Run on YugabyteDB](apps/Dogehouse.md)             | Not started     |                 |
| 24  | [Dolibarr](https://github.com/Dolibarr/dolibarr) | Dolibarr ERP CRM is a modern software package to manage your company or foundation's activity (contacts, suppliers, invoices, orders, stocks, agenda, accounting, ...). it's an open source Web application (written in PHP) designed for businesses of any sizes, foundations and freelancers.    | [Run on YugabyteDB](apps/Dolibarr.md)              | Not started     |                 |
| 25  | [Dolibarr](https://github.com/Dolibarr/dolibarr) | Dolibarr ERP CRM is a modern software package to manage your company or foundation's activity (contacts, suppliers, invoices, orders, stocks, agenda, accounting, ...). it's an open source Web application (written in PHP) designed for businesses of any sizes, foundations and freelancers. | [Run on YugabyteDB](apps/Dolibarr.md)              | Migrated        | [@BrettHoyer](https://github.com/BrettHoyer) |
| 26  | [DrawDB](https://github.com/drawdb-io/drawdb) | Free, simple, and intuitive online database design tool and SQL generator.    | [Run on YugabyteDB](apps/DrawDB.md)                | Migrated        | [@ymahajan](https://github.com/ymahajan) |
| 27  | [Evershop](https://github.com/evershopcommerce/evershop) | NodeJS E-commerce Platform                                             | [Run on YugabyteDB](apps/Evershop.md)              | Migrated        | [@BrettHoyer](https://github.com/BrettHoyer) |
| 28  | [FeedHQ](https://github.com/feedhq/feedhq) | FeedHQ is a web-based feed reader                                      | [Run on YugabyteDB](apps/FeedHQ.md)                | Migrated        |                 |
| 29  | [FireFly III](https://github.com/firefly-iii/firefly-iii) | A personal finances manager                                            | [Run on YugabyteDB](apps/FireFly-III.md)           | Migrated        | [@ymahajan](https://github.com/ymahajan) |
| 30  | [frappe](https://github.com/frappe/frappe) | Low code web framework for real world applications, in Python and Javascript | [Run on YugabyteDB](apps/frappe.md)                | In progress     |                 |
| 31  | [GitLab]()                |                                                                        | [Run on YugabyteDB](apps/GitLab.md)                | Not started     |                 |
| 32  | [Goxygen](https://github.com/Shpota/goxygen) | Generate a modern Web project with Go and Angular, React, or Vue in seconds | [Run on YugabyteDB](apps/Goxygen.md)               | Migrated        |                 |
| 33  | [HedgeDoc](https://github.com/hedgedoc/hedgedoc) | Was CodiMD: create real-time collaborative markdown notes              | [Run on YugabyteDB](apps/HedgeDoc.md)              | Migrated        | [@franckpachot](https://github.com/franckpachot) |
| 34  | [Hyperswitch](https://github.com/juspay/hyperswitch) | An open source payments switch written in Rust to make payments fast, reliable and affordable | [Run on YugabyteDB](apps/Hyperswitch.md)           | Not started     |                 |
| 35  | [Infisical](https://github.com/Infisical/infisical) | Infisical is the open-source secret management platform: Sync secrets across your team/infrastructure, prevent secret leaks, and manage internal PKI | [Run on YugabyteDB](apps/Infisical.md)             | Migrated        | [@BrettHoyer](https://github.com/BrettHoyer) |
| 36  | [Invidious](https://github.com/iv-org/invidious) | An alternative front-end to YouTube                                    | [Run on YugabyteDB](apps/Invidious.md)             | Migrated        | [@BrettHoyer](https://github.com/BrettHoyer) |
| 37  | [Jira]()                  | An agile project management tool used by teams to plan, track, release and support software | [Run on YugabyteDB](apps/Jira.md)                  | Not started     |                 |
| 38  | [Jitsu](https://github.com/jitsucom/jitsu) | Jitsu is an open-source Segment alternative. Fully-scriptable data ingestion engine for modern data teams. Set-up a real-time data pipeline in minutes, not days | [Run on YugabyteDB](apps/Jitsu.md)                 | Not started     |                 |
| 39  | [Keycloak](https://github.com/keycloak/keycloak) | Open Source Identity and Access Management For Modern Applications and Services | [Run on YugabyteDB](apps/Keycloak.md)              | Migrated        | [@tusharraut-yb](https://github.com/tusharraut-yb) |
| 40  | [Kine](https://github.com/k3s-io/kine) | Alternative to Etcd.                                                   | [Run on YugabyteDB](apps/Kine.md)                  | In progress     | [@ymahajan](https://github.com/ymahajan) |
| 41  | [Kuwala](https://github.com/kuwala-io/kuwala) | Kuwala is the no-code data platform for BI analysts and engineers enabling you to build powerful analytics workflows. | [Run on YugabyteDB](apps/Kuwala.md)                | Not started     |                 |
| 42  | [LedgerSMB]()             | Double-entry accounting & ERP for the web                              | [Run on YugabyteDB](apps/LedgerSMB.md)             | In progress     |                 |
| 43  | [LimeSurvey](https://github.com/LimeSurvey/LimeSurvey) | The most popular FOSS online survey tool on the web.                   | [Run on YugabyteDB](apps/LimeSurvey.md)            | Migrated        | [@BrettHoyer](https://github.com/BrettHoyer) |
| 44  | [logto](https://github.com/logto-io/logto) | The better identity infrastructure for developers and the open-source alternative to Auth0. | [Run on YugabyteDB](apps/logto.md)                 | Not started     |                 |
| 45  | [marten](https://github.com/JasperFx/marten) | .NET Transactional Document DB and Event Store on PostgreSQL           | [Run on YugabyteDB](apps/marten.md)                | Not started     |                 |
| 46  | [MassTransit](https://github.com/MassTransit/MassTransit) | Distributed Application Framework for .NET                             | [Run on YugabyteDB](apps/MassTransit.md)           | Not started     |                 |
| 47  | [mathesar](https://github.com/mathesar-foundation/mathesar) | Web application providing an intuitive user experience to databases.   | [Run on YugabyteDB](apps/mathesar.md)              | Failed          | [@BrettHoyer](https://github.com/BrettHoyer) |
| 48  | [Mattermost](https://github.com/mattermost/mattermost) | Open source platform that provides secure collaboration for technical and operational teams that work in environments with complex nation-state level security and trust requirements. | [Run on YugabyteDB](apps/Mattermost.md)            | Migrated        | [@ymahajan](https://github.com/ymahajan) |
| 49  | [maybe](https://github.com/maybe-finance/maybe) | The OS for your personal finances                                      | [Run on YugabyteDB](apps/maybe.md)                 | In progress     | [@ymahajan](https://github.com/ymahajan) |
| 50  | [metabase](https://github.com/metabase/metabase) | The simplest, fastest way to get business intelligence and analytics to everyone in your company 😋 | [Run on YugabyteDB](apps/metabase.md)              | Migrated        | [@BrettHoyer](https://github.com/BrettHoyer) |
| 51  | [metafresh](https://github.com/metasfresh/metasfresh) | Open Source ERP                                                        | [Run on YugabyteDB](apps/metafresh.md)             | Not started     |                 |
| 52  | [Miaou](https://github.com/Canop/miaou) | A chat server with OAuth2 authentication, persistent and searchable history, video and audio, markdown formatting, private and public rooms, stars, votes, embedded games, and many other features | [Run on YugabyteDB](apps/Miaou.md)                 | Not started     |                 |
| 53  | [Miniflux/v2](https://github.com/miniflux/v2) | Minimalist and opinionated feed reader                                 | [Run on YugabyteDB](apps/Miniflux-v2.md)           | Migrated        | [@gargsans-yb](https://github.com/gargsans-yb) |
| 54  | [Mouthful](https://github.com/vkuznecovas/mouthful) | Mouthful is a self-hosted alternative to Disqus                        | [Run on YugabyteDB](apps/Mouthful.md)              | Not started     |                 |
| 55  | [mybb](https://github.com/mybb/mybb) | a free and open source forum software.                                 | [Run on YugabyteDB](apps/mybb.md)                  | Migrated        | [@BrettHoyer](https://github.com/BrettHoyer) |
| 56  | [NewBlur](https://github.com/samuelclay/NewsBlur) | NewsBlur is a personal news reader that brings people together to talk about the world. A new sound of an old instrument. | [Run on YugabyteDB](apps/NewBlur.md)               | Not started     |                 |
| 57  | [nextjs-openai-doc-serach](https://github.com/supabase-community/nextjs-openai-doc-search) | Template for building your own custom ChatGPT style doc search powered by Next.js, OpenAI, and Supabase. | [Run on YugabyteDB](apps/nextjs-openai-doc-serach.md) | Not started     |                 |
| 58  | [nextjs-postgres-email-client](https://github.com/leerob/nextjs-postgres-email-client) | An email client built with the Next.js App Router and Postgres as the database. | [Run on YugabyteDB](apps/nextjs-postgres-email-client.md) | Not started     |                 |
| 59  | [nhost]()                 | The Open Source Firebase Alternative with GraphQL.                     | [Run on YugabyteDB](apps/nhost.md)                 | Not started     |                 |
| 60  | [Nocobase](https://github.com/nocobase/nocobase) | A scalability-first, open-source no-code/low-code platform to build internal tools. | [Run on YugabyteDB](apps/Nocobase.md)              | Migrated        | [@BrettHoyer](https://github.com/BrettHoyer) |
| 61  | [NocoDB](https://github.com/nocodb/nocodb) | An Open Source Alternative to Airtable                                 | [Run on YugabyteDB](apps/NocoDB.md)                | Migrated        | [@franckpachot](https://github.com/franckpachot) |
| 62  | [NodeBB](https://github.com/NodeBB/NodeBB) | Node.js based forum software built for the modern web                  | [Run on YugabyteDB](apps/NodeBB.md)                | Migrated        | [@BrettHoyer](https://github.com/BrettHoyer) |
| 63  | [Odoo](https://github.com/odoo/odoo) | Odoo. Open Source Apps To Grow Your Business.                          | [Run on YugabyteDB](apps/Odoo.md)                  | In progress     | [@BrettHoyer](https://github.com/BrettHoyer) |
| 64  | [Open EduCat](https://github.com/openeducat/openeducat_erp) | Comprehensive Open Source ERP for Educational Institutes               | [Run on YugabyteDB](apps/Open-EduCat.md)           | Not started     |                 |
| 65  | [Openblocks](https://github.com/openblocks-dev/openblocks) | The Open Source Retool Alternative                                     | [Run on YugabyteDB](apps/Openblocks.md)            | Not started     |                 |
| 66  | [Orthanc](https://www.orthanc-server.com/download.php) | free and open-source, lightweight DICOM server for medical imaging from Belgium. | [Run on YugabyteDB](apps/Orthanc.md)               | Failed          | [@franckpachot](https://github.com/franckpachot) |
| 67  | [Papermark](https://github.com/mfts/papermark) | Papermark is the open-source DocSend alternative with built-in analytics and custom domains. | [Run on YugabyteDB](apps/Papermark.md)             | Migrated        | [@ymahajan](https://github.com/ymahajan) |
| 68  | [Payload](https://github.com/payloadcms/payload) | Payload is the open-source, fullstack Next.js framework, giving you instant backend superpowers. Get a full TypeScript backend and admin panel instantly. Use Payload as a headless CMS or for building powerful applications. | [Run on YugabyteDB](apps/Payload.md)               | Migrated        | [@ymahajan](https://github.com/ymahajan) |
| 69  | [pg-boss](https://github.com/timgit/pg-boss) | Queueing jobs in Node.js using PostgreSQL like a boss                  | [Run on YugabyteDB](apps/pg-boss.md)               | Not started     |                 |
| 70  | [PgQueuer](https://github.com/janbjorge/PgQueuer) | PgQueuer is a Python library leveraging PostgreSQL for efficient job queuing.    | [Run on YugabyteDB](apps/PgQueuer.md)              | Not started     |                 |
| 71  | [pgTyped](https://github.com/adelsz/pgtyped) |  Typesafe SQL in TypeScript                                            | [Run on YugabyteDB](apps/pgTyped.md)               | Not started     |                 |
| 72  | [Picsur](https://github.com/CaramelFur/Picsur) | An easy to use, selfhostable image sharing service like Imgur with built in converting | [Run on YugabyteDB](apps/Picsur.md)                | Migrated        | [@BrettHoyer](https://github.com/BrettHoyer) |
| 73  | [Plane](https://github.com/makeplane/plane) | Open Source JIRA, Linear and Asana Alternative.                        | [Run on YugabyteDB](apps/Plane.md)                 | Migrated        | [@audu97](https://github.com/audu97) |
| 74  | [plausible]()             | Simple, open source, lightweight (< 1 KB) and privacy-friendly web analytics alternative to Google Analytics. | [Run on YugabyteDB](apps/plausible.md)             | Failed          | [@BrettHoyer](https://github.com/BrettHoyer) |
| 75  | [Plausible Analytics](https://github.com/plausible/analytics) | Simple, open source, lightweight (< 1 KB) and privacy-friendly web analytics alternative to Google Analytics. | [Run on YugabyteDB](apps/Plausible-Analytics.md)   | Not started     |                 |
| 76  | [Plume](https://github.com/Plume-org/Plume) | A a federated blogging engine, based on ActivityPub.                   | [Run on YugabyteDB](apps/Plume.md)                 | Migrated        |                 |
| 77  | [Pongo](https://github.com/event-driven-io/Pongo) | Pongo - Mongo but on Postgres and with strong consistency benefits     | [Run on YugabyteDB](apps/Pongo.md)                 | Not started     |                 |
| 78  | [Postgres WASM](https://github.com/snaplet/postgres-wasm) | A PostgreSQL server instance running in a virtual machine running in the browser | [Run on YugabyteDB](apps/Postgres-WASM.md)         | Not started     |                 |
| 79  | [postgres-new](https://github.com/supabase-community/postgres-new) | In-browser Postgres sandbox with AI assistance                         | [Run on YugabyteDB](apps/postgres-new.md)          | Not started     |                 |
| 80  | [Puppet]()                |                                                                        | [Run on YugabyteDB](apps/Puppet.md)                | Not started     |                 |
| 81  | [Quivr](https://github.com/QuivrHQ/quivr) | Open-source RAG Framework                                              | [Run on YugabyteDB](apps/Quivr.md)                 | Not started     |                 |
| 82  | [records](https://github.com/kennethreitz/records) | SQL for Humans™                                                        | [Run on YugabyteDB](apps/records.md)               | Not started     |                 |
| 83  | [Redash](https://github.com/getredash/redash) | Make Your Company Data Driven. Connect to any data source, easily visualize, dashboard and share your data. | [Run on YugabyteDB](apps/Redash.md)                | In progress     | [@ymahajan](https://github.com/ymahajan) |
| 84  | [Redmine](https://github.com/redmine/redmine) | A flexible project management web application written using Ruby on Rails framework. | [Run on YugabyteDB](apps/Redmine.md)               | In progress     |                 |
| 85  | [Replibyte](https://github.com/Qovery/Replibyte) | Replibyte is a blazingly fast tool to seed your databases with your production data while keeping sensitive data safe     | [Run on YugabyteDB](apps/Replibyte.md)             | Migrated        | [@franckpachot](https://github.com/franckpachot) |
| 86  | [Retrospected](https://github.com/antoinejaussoin/retro-board) | a free AI-powered Real-time Agile Retrospective Board for engineering teams. | [Run on YugabyteDB](apps/Retrospected.md)          | In progress     | [@BrettHoyer](https://github.com/BrettHoyer) |
| 87  | [Saasfly](https://github.com/saasfly/saasfly) | Your Next SaaS Template or Boilerplate ! A magic trip start with `bun create saasfly` . The more stars, the more surprises | [Run on YugabyteDB](apps/Saasfly.md)               | Not started     |                 |
| 88  | [Satellity](https://github.com/satellity/satellity) | Yet another open source forum written in Golang, React and PostgreSQL. | [Run on YugabyteDB](apps/Satellity.md)             | Migrated        | [@BrettHoyer](https://github.com/BrettHoyer) |
| 89  | [short](https://github.com/short-d/short) | URL shortening service written in Go and React                         | [Run on YugabyteDB](apps/short.md)                 | Not started     |                 |
| 90  | [Spree](https://github.com/spree/spree) | Online Commerce for Ruby on Rails                                      | [Run on YugabyteDB](apps/Spree.md)                 | Migrated        | [@BrettHoyer](https://github.com/BrettHoyer) |
| 91  | [SQL Translator](https://github.com/whoiskatrin/sql-translator) | SQL Translator is a tool for converting natural language queries into SQL code using artificial intelligence. This project is 100% free and open source. | [Run on YugabyteDB](apps/SQL-Translator.md)        | Not started     |                 |
| 92  | [SQLchat](https://github.com/sqlchat/sqlchat) | Chat-based SQL Client and Editor for the next decade                   | [Run on YugabyteDB](apps/SQLchat.md)               | Migrated        | [@BrettHoyer](https://github.com/BrettHoyer) |
| 93  | [sqorn](https://github.com/sqorn/sqorn) | A Javascript library for building SQL queries                          | [Run on YugabyteDB](apps/sqorn.md)                 | Not started     |                 |
| 94  | [Stansoft]()              |                                                                        | [Run on YugabyteDB](apps/Stansoft.md)              | Not started     |                 |
| 95  | [storage](https://github.com/supabase/storage) | S3 compatible object storage service that stores metadata in Postgres  | [Run on YugabyteDB](apps/storage.md)               | Migrated        | [@BrettHoyer](https://github.com/BrettHoyer) |
| 96  | [Tasking Manager](https://github.com/hotosm/tasking-manager) | The app to team up for mapping in OpenStreetMap                        | [Run on YugabyteDB](apps/Tasking-Manager.md)       | Not started     |                 |
| 97  | [teable](https://github.com/teableio/teable) | The Next Gen Airtable Alternative: No-Code Postgres                    | [Run on YugabyteDB](apps/teable.md)                | In progress     | [@audu97](https://github.com/audu97) |
| 98  | [Temporal](https://github.com/temporalio/temporal) | Open source durable execution system. Write code that’s fault tolerant, durable, and simple. | [Run on YugabyteDB](apps/Temporal.md)              | Failed          | [@franckpachot](https://github.com/franckpachot) |
| 99  | [Thin Backend](https://github.com/digitallyinduced/thin-backend) | Thin Backend is a Blazing Fast, Universal Web App Backend for Making Realtime Single Page Apps | [Run on YugabyteDB](apps/Thin-Backend.md)          | Not started     |                 |
| 100 | [Twenty](https://github.com/twentyhq/twenty) | a modern alternative to Salesforce, powered by the community.          | [Run on YugabyteDB](apps/Twenty.md)                | Failed          | [@ymahajan](https://github.com/ymahajan) |
| 101 | [Umami](https://github.com/umami-software/umami) | A simple, fast, privacy-focused alternative to Google Analytics.       | [Run on YugabyteDB](apps/Umami.md)                 | Migrated        | [@ymahajan](https://github.com/ymahajan) |
| 102 | [usql](https://github.com/xo/usql) | Universal command-line interface for SQL databases                     | [Run on YugabyteDB](apps/usql.md)                  | Not started     | [@gargsans-yb](https://github.com/gargsans-yb) |
| 103 | [waline](https://github.com/walinejs/waline) | A Simple, Safe Comment System                                          | [Run on YugabyteDB](apps/waline.md)                | Migrated        | [@rakshitjain13](https://github.com/rakshitjain13) |
| 104 | [webapp.rs](https://github.com/saschagrunert/webapp.rs) | A web application completely written in Rust.                          | [Run on YugabyteDB](apps/webapp.rs.md)             | Not started     |                 |
| 105 | [Wiki.js](https://github.com/requarks/wiki) | A modern and powerful wiki app built on Node.js                        | [Run on YugabyteDB](apps/Wiki.js.md)               | Migrated        | [@franckpachot](https://github.com/franckpachot) |
| 106 | [windmill](https://github.com/windmill-labs/windmill) | Open-source developer platform to turn scripts into workflows and UIs. Fastest workflow engine (5x vs Airflow). Open-source alternative to Airplane and Retool.    | [Run on YugabyteDB](apps/windmill.md)              | In progress     | [@ymahajan](https://github.com/ymahajan) |
| 107 | [Wordpress](https://github.com/WordPress) | WordPress is among the most popular content management systems – it was used by 43.1% of the top 10 million websites as of December 2023  main repo is in subversion  pg4wp is a module used to make it run in PG  https://github.com/PostgreSQL-For-Wordpress | [Run on YugabyteDB](apps/Wordpress.md)             | Migrated        | [@franckpachot](https://github.com/franckpachot) |
| 108 | [worker](https://github.com/graphile/worker) | High performance Node.js/PostgreSQL job queue (also suitable for getting jobs generated by PostgreSQL triggers/functions out into a different work queue) | [Run on YugabyteDB](apps/worker.md)                | Not started     |                 |
| 109 | [Worklenz](https://github.com/Worklenz/worklenz) | All in one project management tool for efficient teams                 | [Run on YugabyteDB](apps/Worklenz.md)              | Migrated        | [@ymahajan](https://github.com/ymahajan) |
| 110 | [WrenAI](https://github.com/Canner/WrenAI) | Open-source Text-to-SQL solution, Wren AI makes your database RAG-ready | [Run on YugabyteDB](apps/WrenAI.md)                | Not started     |                 |
| 111 | [xpipe](https://github.com/xpipe-io/xpipe) | Your entire server infrastructure at your fingertips                   | [Run on YugabyteDB](apps/xpipe.md)                 | Not started     |                 |
| 112 | [Zammad](https://github.com/zammad/zammad) | Zammad is a web based open source helpdesk/customer support system     | [Run on YugabyteDB](apps/Zammad.md)                | Migrated        | [@BrettHoyer](https://github.com/BrettHoyer) |
| 113 | [zenodo](https://github.com/zenodo/zenodo) | a CERN service, is an open dependable home for the long-tail of science, enabling researchers to share and preserve any research outputs in any size, any format and from any science. | [Run on YugabyteDB](apps/zenodo.md)                | Not started     | [@gargsans-yb](https://github.com/gargsans-yb) |
| 114 | [Zitadel](https://github.com/zitadel/zitadel) | Identity infrastructure, simplified for you.                           | [Run on YugabyteDB](apps/Zitadel.md)               | Not started     | [@gargsans-yb](https://github.com/gargsans-yb) |
| 115 | [zws](https://github.com/zws-im/zws) | Shorten URLs using invisible spaces                                    | [Run on YugabyteDB](apps/zws.md)                   | Not started     |                 |
<!-- TABLE_END -->
