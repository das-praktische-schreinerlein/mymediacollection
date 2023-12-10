# Data-Management

## initialize environment (once)

### create and initialize database
- create mediadb the master-database (mysql)
```
mysql
source installer/db/mysql/musikdb/step1_create-db.sql
source installer/db/mysql/musikdb/step3_import-data.sql
source installer/db/mysql/musikdb/step2_create-user.sql
```

### configure local environments

### develop 
- configure a ```backend.json``` with another port and SqlMediadb
- configure ```src/frontend/environments/environment.ts``` to use this as backend-url 

### beta
- configure a second ```backend.beta.json``` with another port and Solr with ```http://localhost:8983/solr/mymmdev``` as backend
- configure ```src/frontend/environments/environment.beta.ts``` to use this as backend-url 

## do mp3-import (several times) 
- copy mp3s to you configured media-path
- configure media-pathes in config/backend.dev.json and config/adminServer.dev.json

### do mp3-import via GUI
- start applications and run job "importMedia" in gui "Admin-Jobs"

### OR do mp3-import manually into musikdb
- generate json-import-file
```cmd
d:
cd d:\Projekte\mymediacollection 
node dist\backend\serverAdmin.js --adminclibackend config/adminCli.dev.json --backend config/backend.dev.json  --command mediaManager --action generateMediaDocsFromMediaDir --importDir "D:\Musik" --debug true --outputFile D:\Musik\mymmbase\test\musikdb-import-musicfiles-test.json 
```
- manually fix json-import-file (genrenames...)
- load data
```
d:
cd d:\Projekte\mymediacollection 
node dist\backend\serverAdmin.js --debug --command loadMediaDoc --command loadMediaDoc --action loadDocs --adminclibackend config\adminCli.dev.json --backend config\backend.dev.json --file D:\Musik\mymmbase\test\musikdb-import-musicfiles-test.json 
```

### do data-management....
- [manage genre](http://localhost:4001/mymmdev/de/mdoc/search/jederzeit/ueberall/alles/egal/ungefiltert/relevance/location/10/1)
