window.importStaticConfigJsonP = `
{
    "skipMediaCheck": true,
    "staticPDocsFile": "assets/staticdata/static.mymmpdocs.js",
    "staticMDocsFiles": [
        "assets/staticdata/static.mymmmdocs_searchresult.js",
        "assets/staticdata/samples-static.mymmmdocs_audios_export_chunk0.js"
    ],
    "audioBaseUrl": "assets/staticdata/",
    "picsBaseUrl": "assets/staticdata/",
    "videoBaseUrl": "assets/staticdata/",
    "components": {
        "cdoc-assignplaylistform": {
        },
        "cdoc-linked-playlists": {
            "appendAvailable": false,
            "editAvailable": false,
            "showAvailable": true
        },
        "mdoc-keywords": {
            "editPrefix": "KW_",
            "possiblePrefixes": ["KW_", "", "kw_", "Genre_", "Artist_"],
            "structuredKeywords": [
                {"name": "ToDos", "keywords": ["KW_TODOGENRE", "KW_TODOARTIST", "KW_TODOALBUM", "KW_TODOTITLE", "KW_TODOKEYWORDS"]},
                {"name": "Tempo", "keywords": ["Langsam", "MidTemp", "Schnell"]},
                {"name": "Stimmung", "keywords": ["Aggressiv", "Fröhlich", "Lustig", "Traurig"]},
                {"name": "Länge", "keywords": ["kurz", "normal", "lang"]}
            ],
            "blacklist": ["OFFEN", "KW_TODOGENRE", "KW_TODOARTIST", "KW_TODOALBUM", "KW_TODOTITLE", "KW_TODOKEYWORDS"]
        },
        "cdoc-listheader": {
            "allowAutoplay": true
        },
        "mdoc-actions": {
            "actionTags": [
                {
                    "key": "local_album_current",
                    "type": "albumtag",
                    "name": "local Album",
                    "shortName": "&#x2764",
                    "payload": {
                        "albumkey": "Current"
                    },
                    "showFilter": [
                        {
                            "property": "localalbum",
                            "command": "CSVIN",
                            "expectedValues": ["Current"]
                        }
                    ],
                    "profileAvailability": [
                    ],
                    "recordAvailability": [
                        {
                            "property": "type",
                            "command": "CSVIN",
                            "expectedValues": ["GENRE", "genre", "ARTIST", "artist", "ALBUM", "album", "AUDIO", "audio"]
                        }
                    ],
                    "configAvailability": [
                        {
                            "property": "mdocMaxItemsPerAlbum",
                            "command": "GE",
                            "expectedValues": [10]
                        }
                    ]
                },
                {
                    "key": "link_download_video_static",
                    "type": "link",
                    "name": "Download Video Static",
                    "shortName": "\uD83D\uDCE5",
                    "payload": {
                        "url": "./videos/video_x600/{{id}}",
                        "target": "download",
                        "replacements": {
                            "id": "record.mdocvideos[0].fileName"
                        }
                    },
                    "showFilter": [
                    ],
                    "recordAvailability": [
                        {
                            "property": "type",
                            "command": "CSVIN",
                            "expectedValues": ["VIDEO", "video"]
                        }
                    ],
                    "configAvailability": [
                    ]
                },
                {
                    "key": "link_download_audio_static",
                    "type": "link",
                    "name": "Download Audio Static",
                    "shortName": "\uD83D\uDCE5",
                    "payload": {
                        "url": "./audios/mp3/{{id}}",
                        "target": "download",
                        "replacements": {
                            "id": "record.mdocaudios[0].fileName"
                        }
                    },
                    "showFilter": [
                    ],
                    "recordAvailability": [
                        {
                            "property": "type",
                            "command": "CSVIN",
                            "expectedValues": ["AUDIO", "audio"]
                        }
                    ],
                    "configAvailability": [
                    ]
                }
            ]
        },
        "mdoc-multiactionheader": {
            "actionTags": [
                {
                    "key": "local_album_current",
                    "type": "albumtag",
                    "name": "set local Album",
                    "shortName": "&#x2764",
                    "payload": {
                        "albumkey": "Current",
                        "set": true
                    },
                    "showFilter": [
                    ],
                    "profileAvailability": [
                        {
                            "property": "type",
                            "command": "NEQ",
                            "expectedValues": ["albumpage"]
                        }
                    ],
                    "recordAvailability": [
                        {
                            "property": "type",
                            "command": "CSVIN",
                            "expectedValues": ["GENRE", "genre", "ARTIST", "artist", "ALBUM", "album", "AUDIO", "audio"]
                        }
                    ],
                    "configAvailability": [
                        {
                            "property": "mdocMaxItemsPerAlbum",
                            "command": "GE",
                            "expectedValues": [10]
                        }
                    ]
                },
                {
                    "key": "unset_local_album_current",
                    "type": "albumtag",
                    "name": "unset local Album",
                    "shortName": "&#x2764",
                    "payload": {
                        "albumkey": "Current",
                        "set": false
                    },
                    "showFilter": [
                    ],
                    "profileAvailability": [
                    ],
                    "recordAvailability": [
                        {
                            "property": "type",
                            "command": "CSVIN",
                            "expectedValues": ["GENRE", "genre", "ARTIST", "artist", "ALBUM", "album", "AUDIO", "audio"]
                        }
                    ],
                    "configAvailability": [
                        {
                            "property": "mdocMaxItemsPerAlbum",
                            "command": "GE",
                            "expectedValues": [10]
                        }
                    ]
                }
            ]
        },
        "mdoc-showpage": {
            "showBigImages": false,
            "allowedQueryParams": [],
            "availableTabs": {
                "ALBUM": true,
                "ARTIST": true,
                "AUDIO": true,
                "AUDIO_FAVORITES": true,
                "GENRE": true,
                "PLAYLIST": true
            }
        },
        "mdoc-albumpage": {
            "allowAutoplay": true
        },
        "pdoc-sectionpage": {
            "availableTabs": {
                "ALBUM": true,
                "ARTIST": true,
                "AUDIO": true,
                "GENRE": true,
                "PLAYLIST": true
            }
        },
        "cdoc-extended-object-properties":  {
            "allowedExtendedObjectProperties": {
                "list-item-flat-big": ["AUDIO_COUNT", "AUDIO_TOP_COUNT", "AUDIO_FAV_COUNT", "ARTIST_COUNT", "ALBUM_COUNT"],
                "show-big": ["AUDIO_COUNT", "AUDIO_TOP_COUNT", "AUDIO_FAV_COUNT", "ARTIST_COUNT", "ALBUM_COUNT"]
            },
            "modes": {
                "list-item-flat-big": "short",
                "show-big": "long"
            }
        }
    },
    "services": {
        "seo": {
            "mdocIndexableTypes": [""]
        },
        "adminJobArea": {
            "jobsAllowed": false
        }
    }
}
`;

var script = document.createElement('script');
script.type='application/json';
script.id = 'assets/staticdata/static.mymmconfig.js';
var text = document.createTextNode(importStaticConfigJsonP);
script.appendChild(text);
document.head.appendChild(script);
