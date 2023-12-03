# Changelog of MySimpleHomePage
 
# Versions

## 4.4.0 (2023-03-18)
- bumped up to commons 5.7.0

### new features
- none

### improvements
- deps: bumped up to mycms-commons 5.7.0

### bug fixes
- none

### breaking changes
- none


## 4.3.0 (2023-01-19)
- bumped up to commons 5.6.0
- added viewer as separate environment to view static data without backend
- split components and build for smaller optimized readonly-version
- frontend: made section-page-elements configurable
- build: added goals for modules-statistics
- frontend: hide copyright-footer if configured
- backend: improved logging-config

### new features
- viewer: added viewer as separate environment to view static data without backend
- build: added goals for modules-statistics

### improvements
- deps: bumped up to mycms-commons 5.6.0
- frontend: split components and build for smaller optimized readonly-version
- frontend: hide copyright-footer if configured
- backend: improved logging-config

### bug fixes
- none

### breaking changes
- none


## 4.2.0 (2021-11-25)
- bumped up to commons 5.4.0

### new features
- none

### improvements
- bumped up to mycms-commons 5.4.0

### bug fixes
- none

### breaking changes
- none


## 4.1.0 (2021-05-13)
- improved security with tools to reset service-passwords

### new features
- config: run ConfigInitializerCommand to reset service-passwords

### improvements
- none

### bug fixes
- none

### breaking changes
- none


## 4.0.0 (2021-02-06)
- improved security
- added admin-server and parameter-validation on serverAdmin
- use commons-5.2.0

### new features
- backend: added admin-server
- frontend: added admin-area

### improvements
- security: bind on localhost only by default
- backend: added parameter-validation on serverAdmin
- backend: added scripts to prepare app-environment on startup
- install: for derived apps - optional use local solr 
- build: use commons-5.2.0

### bug fixes
- none
 
### breaking changes
- backend: removed short-parameters for configfiles -c -> --backend, -f -> --firewall or --file, -s -> --sitemap 
- backend: serverAdmin requires action-parameters


## 3.0.0 (2020-12-21)
- improved build-process
- use typed configuration and extended firewall-options

### new features
- scripts: added start-scripts
 
### improvements
- build: improved build-process
- backend: use typed configuration and extended firewall-options
- use current deps in package-lock.version
- build: improved backend-build 

### bug fixes
- build: fixed angular-universal and site-caching
 
### breaking changes
- configuration: removed default-config and renamed default-environment to dev


## 2.0.0 (2020-09-05)
- upgraded to angular7 + commons5
- bumped up deps to the newest running versions

### new features
- none
 
### improvements
- bumped up deps to the newest running versions

### bug fixes
- frontend: IE now functional
 
### breaking changes
- upgraded to angular7 + commons5


## 1.1.0 (2020-03-01)
- improved build-process - activated tests+coverage
- bumped up deps

### new features
- none
 
### improvements
- bumped up deps
- development: improved build-process - activated tests+coverage

### bug fixes
- fixed build-process
 
### breaking changes
- none


## 1.0.0 (2019-09-07)
- initial version based on mytourbook-2.0.0

### new features
- none
 
### improvements
- initial version: everything is a improvement
 
### bug fixes
- initial version: none
 
### breaking changes
- initial version: none
