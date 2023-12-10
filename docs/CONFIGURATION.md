# Configure MyMediaCollection

## Backend

### API-Server Config: config/backend.PROFILE.json
The configuration-file to configure the backend-api-server.

- server-port for backend-api
```json
{
    "port": 4100
}
```
- writable or readonly
```json
{
    "mdocWritable": false
}
```
- datastore and specific connection-attributes 
```json
{
    "mdocDataStoreAdapter": "MediaDocSqlMediadbAdapter",
    "MediaDocSqlMediadbAdapter": {
        "client": "mysql",
        "connection": {
            "host": "localhost",
            "user": "mymmuser",
            "password": "blablum",
            "database": "testmediadb",
            "port": "3306",
            "filename": "D:/Bilder/mymmbase/test/mediadb.sqlite"
        }
    }
}
```
- pathes to images and tracks
```json
{
    "apiRouteAudioStaticDir": "D:/webs/www.michas-ausflugstipps.de/dataDB/tracks/",
}
```
- specific filters for allowed keywords
```json
{
    "mapperConfig": {
        "allowedKeywordPatterns": ["KW_.*", "Harry", "Booga", "Buddy", "Micha"],
        "replaceKeywordPatterns": []
    }
}
```
- if you use a rediscache
```json
{
    "cacheConfig": {
        "cacheRedisUrl": "redis://localhost:6379/",
        "cacheRedisPass": "blablub",
        "cacheRedisDB": "2"
    }
}    
```

### Frontendserver: config/frontend.PROFILE.json
The configuration for the frontendserver.

- configure port and cachefolder
```json
{
    "port": 4002,
    "cacheFolder": "cache/"
} 
```

### Backend-Firewall: config/firewall.PROFILE.json
The configuration-file to configure the firewall for backend-api-server and frontend-server.

- if you habe a dns-blacklist-account
```json
{
    "dnsBLConfig": {
        "apiKey": "",
        "maxThreatScore": 20,
        "dnsttl": 3600000,
        "errttl": 60000,
        "timeout": 3000,
        "whitelistIps": ["::1", "127.0.0.1"],
        "cacheRedisUrl": "redis://localhost:6379/",
        "cacheRedisPass": "blablub",
        "cacheRedisDB": "1"
    }
}
```
- static blacklist to block spanner/spider...
```json
{
    "blackListIps": [
    ]
}
```

### API-Server Content: config/pdocs-de.json
Configure the content of the static section-pages.

- page-content
```json
{
 "pdocs": [
  {
   "id": "start",
   "descMd": "Willkommen bei MyMM.",
   "flgShowTopTen": true,
   "flgShowNews": true,
   "flgShowSearch": true,
   "heading": "Thats MyMM",
   "name": "Start",
   "subSectionIds": "schwerpunkt",
   "teaser": "Willkommen bei MyMM",
   "type": "SectionOverviewPage"
  }
  ]
}
```

### API-Server themefilter: config/themeFilterConfig.json
Configure the mapping of the section-page-ids to specifiv filters a "berge -> KW_Berge".

- mapping
```json
{ 
   "berge": { "keywords_txt": { "in": ["kw_berge"] } },
   "museum": { "keywords_txt": { "in": ["kw_museum", "kw_museumsbesuch"] } },
   "klettern": { "keywords_txt": { "in": ["kw_klettern", "kw_sachsenklettern", "kw_sportklettern", "kw_alpinklettern"] } }
}
```

### Admin-API-Server Config: config/adminServer.PROFILE.json
- port
```
    "port": 4900,
```
- the flag that admin is available and the available predefined admin-commands to execute via web
```
    "commandConfig": {
        "adminWritable": true,
        "preparedCommands": {
....
            "exportMediaFavorites": {
                "description": "export media-favorites from export-media-directory",
                "commands": [
                    {
                        "parameters": {
                            "command": "mediaManager",
                            "action": "exportAudioFiles",
                            "backend": "config/backend.dev.json",
                            "exportName": "favorites-top",
                            "exportDir": "F:/playground/mymm-test/mymmmediabase/export/favorites",
                            "directoryProfile": "default",
                            "fileNameProfile": "default",
                            "playlists": "Favorites",
                            "rateMinFilter": "",
                            "showNonBlockedOnly": "showall"
                        }
                    }
                ]
            }
        },
        "constantParameters": {
            "overrides": "override this parameters from request",
            "outputDir": "notexists",
            "outputFile": "notexists",
            "backend": "config/backend.dev.json",
            "sitemap": "config/sitemap-de.json"
        }
    }
```

### CLI Config: config/adminCli.PROFILE.json
- the flag that admin is available and the available predefined admin-commands to execute via cli
```
    "adminWritable": true,
    "availableCommands": {
        "*": "*"
    },
    "preparedCommands": {
        "prepareAppEnv": {
            "description": "prepare app-environment (do database-migrations...)",
            "commands": [
                {
                    "parameters": {
                        "command": "dbMigrate",
                        "action": "migrateDB",
                        "migrationDbConfigFile": "config/db-migrate-database.json",
                        "migrationsDir": "migrations/mediadb",
                        "migrationEnv": "mediadb_sqlite3"
                    }

                }
            ]
        }
    },
    "constantParameters": {
        "noOverrides": "use all parameters as put to commandline"
    }
```
- **IMPORTANT if you DON'T want to reset passwords -> remove such actions from config/adminCli.PROFILE.json !!!!!**
```
    {
        "parameters": {
            "command": "initConfig",
            "action": "resetSolrPasswords",
            "solrconfigbasepath": "dist/contrib/solr/server/solr"
        }
    }
```

## Frontend

### Build-Environment: src/frontend/environments/environment.*.ts

- connection-urls of the backend-api
```typescript
export const environment = {
    backendApiBaseUrl: 'http://localhost:4100/api/v1/',
    tracksBaseUrl: 'http://localhost:4100/api/assets/trackstore/',
    picsBaseUrl: 'http://localhost:4100/api/static/picturestore/'
};
```
- production and writable-flags
```typescript
export const environment = {
    production: false,
    mdocWritable: true,
    mdocActionTagWritable: true
};
```
- album-config
```typescript
export const environment = {
    allowAutoPlay: true,
    mdocMaxItemsPerAlbum: 20000
};
```
- tracking-provider
```typescript
export const environment = {
    trackingProviders: [Angulartics2Piwik]
};
```

### App-Config: src/frontend/assets/config.json

- keyword/person-structure
```json
{
    "components": {
        "mdoc-keywords": {
            "editPrefix": "KW_",
            "possiblePrefixes": ["KW_", "", "kw_"],
            "structuredKeywords": [
                {"name": "Aktivität", "keywords": ["Alpinklettern", "Baden", "Boofen", "Bootfahren", "Campen",
                    "Fliegen", "Gletscherbegehung", "Kanu", "Klettern", "Klettersteig",
                    "Radfahren", "Schneeschuhwandern", "Skaten", "Wandern", "Museumsbesuch", "Sachsenklettern",
                    "Sportklettern", "Stadtbesichtigung", "Besichtigung", "Gassi", "Hochtour", "Spaziergang",
                    "Wanderung"]},
                {"name": "Kultur", "keywords": ["Denkmal", "Geschichte", "Kunst", "Museum",
                    "Architektur", "Burg", "Dom", "Kirche", "Park", "Schloss", "Zoo"]},
            ],
            "keywordSuggestions": [
            ],
            "blacklist": ["OFFEN", "Mom", "Pa", "Micha"]
        },
        "mdoc-persontags": {
            "editPrefix": "",
            "possiblePrefixes": ["KW_", "", "kw_", "Pers_"],
            "structuredKeywords": [
                {"name": "mit Freunden", "keywords": ["Freund1", "Freund2"]},
                {"name": "mit Familie", "keywords": ["Micha", "Ich", "Frau", "Mann"]},
                {"name": "mit Hundis", "keywords": ["Harry", "Buddy"]}
            ],
            "keywordSuggestions": [
                {   "name": "Personen Klettern", "keywords": ["Freund1"],
                    "filters": [{ "property": "subtype", "command": "CSVIN", "expectedValues": ["128"]}]
                },
                {   "name": "Hunde Gassi", "keywords": ["Buddy"],
                    "filters": [{ "property": "subtype", "command": "CSVIN", "expectedValues": ["111"]}]
                }
            ],
            "blacklist": []
        }
    }
}
```
- configure available actions to show per item
```json
{
    "components": {
        "mdoc-actions": {
            "actionTags": [
                {
                    "key": "edit",
                    "type": "edit",
                    "name": "Edit",
                    "shortName": "&#x1f589",
                    "showFilter": [
                        {
                            "property": "dummy",
                            "command": "EQ",
                            "expectedValues": ["dummy"]
                        }
                    ],
                    "recordAvailability": [
                        {
                            "property": "type",
                            "command": "CSVIN",
                            "expectedValues": ["LOCATION", "location", "TRACK", "track", "ROUTE", "route", "TRIP", "trip", "NEWS", "news"]
                        }
                    ],
                    "configAvailability": [
                        {
                            "property": "permissions.mdocWritable",
                            "command": "EQ",
                            "expectedValues": [true]
                        }
                    ]
                }
            ]
        }
    }
}
```
- autoplay of album or resultlist allowed for presentations
```json
{
    "components": {
        "mdoc-albumpage": {
            "allowAutoplay": false
        },
        "cdoc-listheader": {
            "allowAutoplay": false
        }
    }
}
```
- configure seo
```json
{
    "services": {
        "seo": {
            "mdocIndexableTypes": ["ROUTE", "LOCATION", "NEWS"]
        }
    }
}
```

### Override some message-resources: src/frontend/assets/locales/locale-de-overrides.json 

- brandname and descriptions
```json
{
    "nav.brand.appName": "MyMediaCollection",
    "meta.title.prefix.errorPage": "MyMediaCollection - Oje ein Fehler",
    "meta.title.prefix.sectionPage": "MyMediaCollection - {{title}}",
    "meta.title.prefix.cdocSearchPage": "MyMediaCollection - Suche",
    "meta.title.prefix.cdocShowPage": "MyMediaCollection - {{cdoc}}",
    "meta.title.prefix.cdocSectionSearchPage": "MyMediaCollection - {{title}} - Suche",
    "meta.title.prefix.cdocSectionShowPage": "MyMediaCollection - {{title}} - {{cdoc}}",
    "meta.desc.prefix.errorPage": "MyMediaCollection - Oje ein Fehler ist aufgetreten",
    "meta.desc.prefix.sectionPage": "MyMediaCollection - {{title}} - {{teaser}}",
    "meta.desc.prefix.cdocSearchPage": "MyMediaCollection -Infos",
    "meta.desc.prefix.cdocShowPage": "MyMediaCollection - Infos für {{cdoc}}",
    "meta.desc.prefix.cdocSectionSearchPage": "MyMediaCollection -Bilder/Infos zum Thema {{title}} - {{teaser}}",
    "meta.desc.prefix.cdocSectionShowPage": "MyMediaCollection - {{title}} - Infos für {{cdoc}}",
```
