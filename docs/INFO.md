# What is MySimpleHomePage

MySimpleHomePage is a portal with a bunch of different page types and features:

- starting with sectionpage for different content-sections as Startpage .... ![startpage](images/startpage-x400.png)
- sectionlists to order the sections and give an overview
- simple configuration of pages in pdocs-de.json if you use the static PDocDataService.
```
{
 "pdocs": [
  {
   "id": "menu",
   "descMd": "Hauptmenü",
   "flgShowTopTen": false,
   "flgShowSearch": false,
   "heading": "Hauptmenü",
   "name": "Hauptmenü",
   "subSectionIds": "start,vita,roadmap",
   "teaser": "Hauptmenü",
   "type": "SectionOverviewPage"
  },
  {
   "id": "start",
   "descMd": "# Ieiunia non dempto\n\n## Quem in...",
   "flgShowTopTen": false,
   "flgShowNews": false,
   "flgShowSearch": false,
   "heading": "Thats MySimpleHomePage",
   "name": "Willkommen",
   "subSectionIds": "skills,me",
   "teaser": "Willkommen bei MySimpleHomePage",
   "type": "SectionOverviewPage"
  },
```
