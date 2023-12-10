window.importStaticDataMDocsJsonP = `{
    "recordCount": 0,
    "searchForm": {
    },
    "currentRecords": [
    ],
    "facets": {
        "facets": {
        },
        "selectLimits": {
            "type_ss": 1
        }
    }
}
`;

var script = document.createElement('script');
script.type='application/json';
script.id = 'assets/staticdata/static.mymmmdocs_searchresult.js';
var text = document.createTextNode(importStaticDataMDocsJsonP);
script.appendChild(text);
document.head.appendChild(script);
