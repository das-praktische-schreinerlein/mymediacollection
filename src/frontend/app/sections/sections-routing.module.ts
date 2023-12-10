import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MediaDocSearchpageComponent} from '../mdoc/components/mdoc-searchpage/mdoc-searchpage.component';
import {MediaDocShowpageComponent} from '../mdoc/components/mdoc-showpage/mdoc-showpage.component';
import {SectionsSearchFormResolver} from './resolver/sections-searchform.resolver';
import {SectionsPDocRecordResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/sections-pdoc-details.resolver';
import {SectionsMediaDocRecordResolver} from './resolver/sections-mdoc-details.resolver';
import {SectionsBaseUrlResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/sections-baseurl.resolver';
import {SectionBarComponent} from '@dps/mycms-frontend-commons/dist/frontend-section-commons/components/sectionbar/sectionbar.component';
import {SectionComponent} from '@dps/mycms-frontend-commons/dist/frontend-section-commons/components/section/section.component';
import {MediaDocSectionPageComponent} from './components/sectionpage/mdoc-section-page.component';

const sectionRoutes: Routes = [
    {
        path: 'sections',
        children: [
            {
                path: ':section',
                component: SectionComponent,
                children: [
                    {
                        path: '',
                        outlet: 'sectionbar',
                        component: SectionBarComponent,
                        resolve: {
                            pdoc: SectionsPDocRecordResolver
                        }
                    },
                    {
                        path: '',
                        pathMatch: 'full',
                        component: MediaDocSectionPageComponent,
                        data: {
                            id: 'sections_section',
                        },
                        resolve: {
                            pdoc: SectionsPDocRecordResolver,
                            baseSearchUrl: SectionsBaseUrlResolver
                        },
                    },
                    {
                        path: 'show/:name/:id',
                        component: MediaDocShowpageComponent,
                        pathMatch: 'full',
                        data: {
                            id: 'sections_show'
                        },
                        resolve: {
                            pdoc: SectionsPDocRecordResolver,
                            baseSearchUrl: SectionsBaseUrlResolver,
                            record: SectionsMediaDocRecordResolver
                        }
                    },
                    {
                        path: 'search',
                        component: MediaDocSearchpageComponent,
                        data: {
                            flgDoSearch: true,
                            id: 'sections_search_default',
                            searchFormDefaults: {},
                        },
                        resolve: {
                            pdoc: SectionsPDocRecordResolver,
                            baseSearchUrl: SectionsBaseUrlResolver,
                            searchForm: SectionsSearchFormResolver
                        }
                    },
                    {
                        path: 'search/:type',
                        component: MediaDocSearchpageComponent,
                        data: {
                            flgDoSearch: true,
                            id: 'sections_search_types',
                            searchFormDefaults: {},
                        },
                        resolve: {
                            pdoc: SectionsPDocRecordResolver,
                            baseSearchUrl: SectionsBaseUrlResolver,
                            searchForm: SectionsSearchFormResolver
                        }
                    },
                    {
                        path: 'search/:what/:genre/:artist/:album/:fulltext/:moreFilter/:sort/:type/:perPage/:pageNum',
                        component: MediaDocSearchpageComponent,
                        data: {
                            flgDoSearch: true,
                            id: 'sections_search',
                            searchFormDefaults: {},
                        },
                        resolve: {
                            pdoc: SectionsPDocRecordResolver,
                            baseSearchUrl: SectionsBaseUrlResolver,
                            searchForm: SectionsSearchFormResolver
                        }
                    }
                ]
            }
        ]
    },
    {
        path: 'pages',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'pages/start'
            },
            {
                path: ':section',
                component: SectionComponent,
                children: [
                    {
                        path: '',
                        outlet: 'sectionbar',
                        component: SectionBarComponent,
                        resolve: {
                            pdoc: SectionsPDocRecordResolver
                        }
                    },
                    {
                        path: '',
                        pathMatch: 'full',
                        component: MediaDocSectionPageComponent,
                        data: {
                            id: 'sections_section',
                        },
                        resolve: {
                            pdoc: SectionsPDocRecordResolver,
                            baseSearchUrl: SectionsBaseUrlResolver
                        },
                    }
                ]
            },
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(sectionRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class SectionsRoutingModule {}
