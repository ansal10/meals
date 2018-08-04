
### Installation and setup

Dependencies
  - Postgres 9.6
  - Node 9.8

Database setup
  - create database ```aptrental_dev```
  - create database ```aptrental_test```
  - create user with username ```aptrental_dev```
  - assign password to user ```aptrental_dev```
  - start postgres on default port ```5432```


Setup Database

```$xslt
$ create database aptrental_dev;
$ create database aptrental_test;
$ create user aptrental_dev;
$ ALTER USER rental WITH PASSWORD 'aptrental_dev';
$ grant all privileges on database aptrental_dev to aptrental_dev;
$ grant all privileges on database aptrental_test to aptrental_dev;

```
Install the Node
```sh
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
$ source ~/.bashrc
$ nvm install 9.8.0
$ npm i pm2 -g
```

Install and run the API module
```
$ cd project
$ npm i
$ npm run migrate
$ npm run seed-all
$ npm run server
$ npm run prod
$ npm run built-dev
$ npm run test
```


API Documentation:
```
localhost:3000/api-docs/
```


