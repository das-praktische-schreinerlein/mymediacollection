window.importStaticDataPDocsJsonP = `
{
 "pdocs": [
  {
   "id": "start",
   "descMd": "Willkommen bei MyMediaCollection dem Portal für MEINE Musik.",
   "flgShowTopTen": true,
   "flgShowNews": true,
   "flgShowSearch": true,
   "heading": "Thats MyMM",
   "name": "Start",
   "subSectionIds": "",
   "teaser": "Willkommen bei MyMM",
   "type": "PAGE",
   "flags": "flg_ShowSearch,flg_ShowNews,flg_ShowTopTen",
   "profiles": "profile_viewer",
   "langkeys": "lang_de,lang_en",
   "subtype": "SectionOverviewPage",
   "key": "start"
  },
  {
   "id": "impress",
   "descMd": "Letztens bekam ich den \\"dezenten\\" Hinweis, dass jede Webseite im geschäftsmäßigen Betrieb laut Telemediengesetz ein Impressum benötigt. Nun war ich eigentlich nicht der Meinung, dass MyMediaCollection ein \\"Geschäft\\" ist. Aber \\"geschäftsmäßig\\" heißt im rechtlichen Sinne wohl, dass der Öffentlichkeit ein Dienst angeboten wird (in meinem Falle Informationen). Das dieser \\"Dienst\\" bei mir nichts kostet ist dabei nebensächlich... Fakt ist, meine Seite ist damit keine private Homepage mehr, sondern ein \\"Teledienst\\" und damit quasi ein \\"Geschäft\\" (wenn auch in meinem Falle ein Minusgeschäft\\" ;-). Und damit bin ich verpflichtet ein Impressum einzubauen, da man mir sonst eine \\"Abmahnung\\" aufhalsen könnte, die mich schnell ein paar TAUSEND Euro kostet. Also sollen sie doch ihr BESCHISSENES Impressum bekommen (und dran ver....., Ähm zufrieden sein ;-): \\n\\n",
   "flgShowTopTen": false,
   "flgShowSearch": false,
   "heading": "Impressum/Datenschutz",
   "name": "Impressum/Datenschutz",
   "subSectionIds": "",
   "teaser": "Impressum/Datenschutz - der rechtliche Teil",
   "type": "PAGE",
   "flags": "",
   "profiles": "profile_viewer",
   "langkeys": "lang_de,lang_en",
   "subtype": "SimplePage",
   "key": "impress"
  },
  {
   "id": "menu",
   "descMd": "Hauptmenü",
   "flgShowTopTen": false,
   "flgShowSearch": false,
   "heading": "Hauptmenü",
   "name": "Hauptmenü",
   "subSectionIds": "",
   "teaser": "Hauptmenü",
   "type": "PAGE",
   "flags": "",
   "profiles": "profile_viewer",
   "langkeys": "lang_de,lang_en",
   "subtype": "SectionOverviewPage",
   "key": "menu"
  }
 ]
}`;
var script = document.createElement("script");
script.type='application/json';
script.id = 'assets/staticdata/static.mymmpdocs.js';
var text = document.createTextNode(importStaticDataPDocsJsonP);
script.appendChild(text);
document.head.appendChild(script);
