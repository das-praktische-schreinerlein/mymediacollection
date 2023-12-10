import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MediaDocRecordResolver} from '../shared-mdoc/resolver/mdoc-details.resolver';
import {MediaDocShowpageComponent} from './components/mdoc-showpage/mdoc-showpage.component';
import {MediaDocSearchFormResolver} from '../shared-mdoc/resolver/mdoc-searchform.resolver';
import {MediaDocSearchpageComponent} from './components/mdoc-searchpage/mdoc-searchpage.component';
import {MediaDocAlbumpageComponent} from './components/mdoc-albumpage/mdoc-albumpage.component';
import {MediaDocAlbumResolver} from '../shared-mdoc/resolver/mdoc-album.resolver';
import {MediaDocModalShowpageComponent} from './components/mdoc-showpage/mdoc-modal-showpage.component';

const mdocRoutes: Routes = [
    {
        path: 'mdoc',
        children: [
            {
                path: 'search',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        component: MediaDocSearchpageComponent,
                        data: {
                            id: 'mdocs_default',
                            baseSearchUrl: { data: 'mdoc/' }
                        }
                    },
                    {
                        path: ':what/:genre/:artist/:album/:fulltext/:moreFilter/:sort/:type/:perPage/:pageNum',
                        component: MediaDocSearchpageComponent,
                        data: {
                            flgDoSearch: true,
                            id: 'mdocs_search',
                            searchFormDefaults: {},
                            baseSearchUrl: { data: 'mdoc/' }
                        },
                        resolve: {
                            searchForm: MediaDocSearchFormResolver
                        }
                    },
                    {
                        path: '**',
                        component: MediaDocSearchpageComponent,
                        data: {
                            id: 'mdocs_fallback',
                            baseSearchUrl: { data: 'mdoc/' }
                        }
                    }
                ]
            },
            {
                path: 'show/:name/:id',
                component: MediaDocShowpageComponent,
                data: {
                    baseSearchUrl: { data: 'mdoc/' }
                },
                resolve: {
                    record: MediaDocRecordResolver
                }
            },
            {
                path: 'album',
                children: [
                    {
                        path: 'edit/:album/:sort/:perPage/:pageNum',
                        component: MediaDocAlbumpageComponent,
                        data: {
                            id: 'mdocs_album_list',
                            flgDoEdit: true,
                            searchFormDefaults: {},
                            baseSearchUrl: { data: 'mdoc/album/show/' }
                        },
                        resolve: {
                            searchForm: MediaDocAlbumResolver
                        }
                    },
                    {
                        path: 'show/:album/:sort/:perPage/:pageNum',
                        component: MediaDocAlbumpageComponent,
                        data: {
                            id: 'mdocs_album_show',
                            searchFormDefaults: {},
                            baseSearchUrl: { data: 'mdoc/' }
                        },
                        resolve: {
                            searchForm: MediaDocAlbumResolver
                        }
                    }
                ]
            },
            {
                path: '**',
                redirectTo: 'mdoc/search',
                data: {
                    id: 'mdoc_fallback'
                }
            }
        ]
    },
    {
        path: 'mdocmodalshow',
        children: [
            {
                path: 'show/:name/:id',
                component: MediaDocModalShowpageComponent,
                data: {
                    baseSearchUrl: { data: 'mdoc/' }
                },
                resolve: {
                    record: MediaDocRecordResolver
                }
            }
        ],
        outlet: 'mdocmodalshow',
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(mdocRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class MediaDocRoutingModule {}
