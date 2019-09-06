# Status App REST API

### Pre-requisites

1. PostgreSQL (10.x)
1. Node.js (8.x)
1. Typescript (3.x)
1. Yarn

---

### Pre-requisites Installation

1. PostgreSQL

   ```
   # Instructions for particular operating system can be found in this URL

   https://www.postgresql.org/download/
   ```

1. Node.js

   ```
   # Installers for particular operating system are listed in this URL

   https://nodejs.org/download/release/v8.16.1/
   ```

1. Typescript

   ```
   # If node.js is installed, npm should be available

   http://www.typescriptlang.org/#download-links
   ```

1. Yarn

   ```
   # Installation based on your OS

   https://yarnpkg.com/en/docs/install
   ```

---

### Bootstrapping Project

1. Cloning the repository
   ```
   $ git clone https://github.com/shreyasp/status-node-api.git
   ```
1. Installing TypeORM
   ```
   $ npm install typeorm -g
   ```
1. Install necessary packages
   ```
   $ yarn install
   ```
1. Setup ORM configuration

   ```
   # ormconfig.json

   {
       "type": "postgres",
       "username": "<db-username>",
       "password": "<db-password>",
       "database": "<db-name>",
       "host": "127.0.0.1",
       "port": 5432,
       "synchronize": false,
       "logging": "all",
       "entities": ["src/**/**.entity{.ts, .js}"],
       "migrations": ["dist/migrations/*.js"],
       "cli": {
           "migrationsDir": "src/migrations"
       }
   }
   ```

1. Setting up `development.env`

   ```
   # development.env

   accessKeyId=AWS-ACCESS-KEY-ID
   secretAccessKey=AWS-SECRET-ACCESS-KEY-ID
   accountId=AWS-ACCOUNT-ID
   bucketName=AWS-S3-BUCKET
   assumedRole=AWS-STS-ROLENAME
   awsRegion=AWS-REGION
   cloudFrontBaseUrl=https://<aws-cloufront-ur>.cloudfront.net
   s3BaseUrl=https://<aws-bucket-name>.amazonaws.com
   ```

1. Setting up `nodemon`

   ```
   # nodemon.json

   {
       "watch": ["src"],
       "ext": "ts",
       "ignore": ["src/**/*.spec.ts"],
       "exec": "ts-node -r tsconfig-paths/register src/main.ts",
       "env": {
           "NODE_ENV": "development"
       },
       "signal": "SIGHUP"
   }
   ```

---

### Starting the development

1. Create the DB tables

   ```
   $ typeorm migration:run
   ```

1. Bootstrap tables with Data

   ```
   $ psql -h localhost -U user -W -d database_name -f src/bootstrap/file.sql
   ```

1. Starting the server

   ```
   $ yarn start:dev
   ```

1. Building the source for deployment
   ```
   $ yarn build
   ```
