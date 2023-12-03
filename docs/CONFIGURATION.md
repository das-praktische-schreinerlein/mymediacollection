# Configure MySimpleHomePage

## Backend

### API-Server Config: config/backend.PROFILE.json
The configuration-file to configure the backend-api-server.

- server-port for backend-api
```json
{
    "port": 4100
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
   "descMd": "Willkommen bei MySHP.",
   "flgShowTopTen": true,
   "flgShowNews": true,
   "flgShowSearch": true,
   "heading": "Thats MySHP",
   "name": "Start",
   "subSectionIds": "schwerpunkt",
   "teaser": "Willkommen bei MySHP",
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
    "commandConfig": {
        "adminWritable": true,
        "preparedCommands": {
            "generateSitemap": {
                "description": "generate sitemaps",
                "commands": [
                    {
                        "parameters": {
                            "command": "generateSitemap",
                            "action": "generateSitemap",
                            "backend": "config/backend.dev.json",
                            "sitemap": "config/sitemap-de.json"
                        }
                    },
                    {
                        "parameters": {
                            "command": "generateSitemap",
                            "action": "generateSitemap",
                            "backend": "config/backend.dev.json",
                            "sitemap": "config/sitemap-en.json"
                        }
                    }
                ]
            }
        }
    }
```

### CLI Config: config/adminCli.PROFILE.json
- the flag that admin is available and the available admin-commands to execute via cli
```
    "adminWritable": true,
    "availableCommands": {
        "*": "*"
    },
    "preparedCommands": {
        "prepareAppEnv": {
            "description": "prepare app-environment (no actions required)",
            "commands": [
            ]
        }
    },
    "constantParameters": {
        "noOverrides": "use all parameters as put to commandline"
    }
```

## Frontend

### Build-Environment: src/frontend/environments/environment.*.ts

- connection-urls of the backend-api
```typescript
export const environment = {
};
```
- production and writable-flags
```typescript
export const environment = {
    production: false,
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
    }
}
```

### Override some message-resources: src/frontend/assets/locales/locale-de-overrides.json 

- brandname and descriptions
```json
{
    "nav.brand.appName": "MySimpleHomePage",
    "meta.title.prefix.errorPage": "MySimpleHomePage - Oje ein Fehler",
    "meta.title.prefix.sectionPage": "MySimpleHomePage - {{title}}",
    "meta.title.prefix.cdocSearchPage": "MySimpleHomePage - Suche",
    "meta.title.prefix.cdocShowPage": "MySimpleHomePage - {{cdoc}}",
    "meta.title.prefix.cdocSectionSearchPage": "MySimpleHomePage - {{title}} - Suche",
    "meta.title.prefix.cdocSectionShowPage": "MySimpleHomePage - {{title}} - {{cdoc}}",
    "meta.desc.prefix.errorPage": "MySimpleHomePage - Oje ein Fehler ist aufgetreten",
    "meta.desc.prefix.sectionPage": "MySimpleHomePage - {{title}} - {{teaser}}",
    "meta.desc.prefix.cdocSearchPage": "MySimpleHomePage - Infos",
    "meta.desc.prefix.cdocShowPage": "MySimpleHomePage - Infos für {{cdoc}}",
    "meta.desc.prefix.cdocSectionSearchPage": "MySimpleHomePage - Infos zum Thema {{title}} - {{teaser}}",
    "meta.desc.prefix.cdocSectionShowPage": "MySimpleHomePage - {{title}} - Infos für {{cdoc}}",
```
