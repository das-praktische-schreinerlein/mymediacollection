import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MediaDocRecordResolver} from '../shared-mdoc/resolver/mdoc-details.resolver';
import {MediaDocEditpageComponent} from './components/mdoc-editpage/mdoc-editpage.component';
import {MediaDocRecordCreateResolver} from '../shared-admin-mdoc/resolver/mdoc-create.resolver';
import {MediaDocCreatepageComponent} from './components/mdoc-createpage/mdoc-createpage.component';
import {MediaDocModalCreatepageComponent} from './components/mdoc-createpage/mdoc-modal-createpage.component';

const mdocAdminRoutes: Routes = [
    {
        path: 'mdocadmin',
        children: [
            {
                path: 'edit/:name/:id',
                component: MediaDocEditpageComponent,
                data: {
                    baseSearchUrl: { data: 'mdoc/' }
                },
                resolve: {
                    record: MediaDocRecordResolver
                }
            },
            {
                path: 'create/:createByType/:createBaseId',
                component: MediaDocCreatepageComponent,
                data: {
                    baseSearchUrl: { data: 'mdoc/' }
                },
                resolve: {
                    record: MediaDocRecordCreateResolver
                }
            },
            {
                path: 'create/:createByType',
                component: MediaDocCreatepageComponent,
                data: {
                    baseSearchUrl: { data: 'mdoc/' }
                },
                resolve: {
                    record: MediaDocRecordCreateResolver
                }
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
        path: 'tdocmodaledit',
        children: [
            {
                path: 'create/:createByType/:createBaseId',
                component: MediaDocModalCreatepageComponent,
                data: {
                    baseSearchUrl: { data: 'mdoc/' }
                },
                resolve: {
                    record: MediaDocRecordCreateResolver
                },
            }
        ],
        outlet: 'mdocmodaledit',
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(mdocAdminRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class MediaDocAdminRoutingModule {}
