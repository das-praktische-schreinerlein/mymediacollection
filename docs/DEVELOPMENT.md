# Develop MyMediaCollection

## prepare

### prepare build-scripts
- build-dev.bash, build-beta.bash, build-prod.bash, build-viewer.bash
```bash
#!/usr/bin/env bash

WORKSPACE="/cygdrive/f/Projekte/"
MYCMSPROJECT="mymediacollection"
```

## Development server
Run initially to copy overrides into project
```bash
bash
npm prune && npm install && ./build-dev.bash
```

Run scripts to initially reset database-passwords... 
```bash
npm run backend-prepare-appenv-beforebuild
```

Run to build and start the backend. Navigate to [api](http://localhost:4100/api/v1/de/pdoc/) to get the pdocs.
```bash
npm run backend-build-and-serve-dev
```

Run for a dev server. Navigate to [startpage](http://localhost:4200/).
```bash
npm start
```

## Running unit tests
Run to execute the unit tests via [Karma](https://karma-runner.github.io).
```bash
npm test
```

## Running end-to-end tests
Run to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `npm start`.
```bash
npm e2e
```

## add database-migrations
- create new migration-files for mediadb driver: sqlite
```bash
db-migrate create extend-model --sql-file --migrations-dir migrations\mediadb --config config\db-migrate-database.json --env mediadb_sqlite3
```
- compare with migrations/mediadb/20190804164718-extend-model.js and add driver to path
- move sql-files to specific folder: mysql|sqlite3
- copy sql-files to the other folder: mysql|sqlite3
- add sql to sql-files
- do migration
```bash
db-migrate up --migrations-dir migrations\mediadb --config config\db-migrate-database.json --env mediadb_sqlite3
db-migrate down --migrations-dir migrations\mediadb --config config\db-migrate-database.json --env mediadb_sqlite3
```
- insert migrations manually if scripts dont pass but model is ready 
```sql
INSERT INTO migrations (id, name, run_on) VALUES (4, '/20200807444444-extend-model', '2020-08-07 22:38:39');
```
