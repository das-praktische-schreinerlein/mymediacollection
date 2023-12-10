import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {MediaDocSearchFormConverter} from '../shared-mdoc/services/mdoc-searchform-converter.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {MediaDocSearchFormUtils} from '../shared-mdoc/services/mdoc-searchform-utils.service';
import {MediaDocSearchFormResolver} from '../shared-mdoc/resolver/mdoc-searchform.resolver';
import {MediaDocRecordResolver} from '../shared-mdoc/resolver/mdoc-details.resolver';
import {ToastrModule} from 'ngx-toastr';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {CommonDocContentUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {SharedMediaDocModule} from '../shared-mdoc/shared-mdoc.module';
import {BrowserModule} from '@angular/platform-browser';
import {AngularCommonsModule} from '@dps/mycms-frontend-commons/dist/angular-commons/angular-commons.module';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {MediaDocLightBoxService} from '../shared-mdoc/services/mdoc-lightbox.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {MediaDocEditpageComponent} from './components/mdoc-editpage/mdoc-editpage.component';
import {MediaDocAdminRoutingModule} from './mdoc-admin-routing.module';
import {MediaDocCreatepageComponent} from './components/mdoc-createpage/mdoc-createpage.component';
import {MediaDocModalCreatepageComponent} from './components/mdoc-createpage/mdoc-modal-createpage.component';
import {MediaDocRecordCreateResolver} from '../shared-admin-mdoc/resolver/mdoc-create.resolver';
import {MediaDocContentUtils} from '../shared-mdoc/services/mdoc-contentutils.service';
import {CommonDocSearchFormUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-searchform-utils.service';
import {FrontendCommonDocCommonsModule} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/frontend-cdoc-commons.module';
import {MediaDocRoutingService} from '../../shared/mdoc-commons/services/mdoc-routing.service';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {SharedAdminMediaDocModule} from '../shared-admin-mdoc/shared-admin-mdoc.module';
import {MediaDocDataService} from '../../shared/mdoc-commons/services/mdoc-data.service';

@NgModule({
    declarations: [
        MediaDocEditpageComponent,
        MediaDocCreatepageComponent,
        MediaDocModalCreatepageComponent
    ],
    imports: [
        TranslateModule,
        BrowserModule,
        ToastrModule,
        HttpClientModule,
        AngularCommonsModule,
        SharedMediaDocModule,
        SharedAdminMediaDocModule,
        MediaDocAdminRoutingModule,
        FrontendCommonDocCommonsModule
    ],
    providers: [
        TranslateService,
        CommonRoutingService,
        MediaDocSearchFormConverter,
        MediaDocDataService,
        { provide: CommonDocRoutingService, useClass: MediaDocRoutingService },
        MediaDocRoutingService,
        { provide: CommonDocSearchFormUtils, useClass: MediaDocSearchFormUtils },
        MediaDocSearchFormUtils,
        SearchParameterUtils,
        { provide: CommonDocContentUtils, useClass: MediaDocContentUtils },
        MediaDocContentUtils,
        MediaDocSearchFormResolver,
        MediaDocRecordResolver,
        MediaDocRecordCreateResolver,
        ErrorResolver,
        PageUtils,
        MediaDocLightBoxService,
        LayoutService
    ],
    exports: [
        MediaDocEditpageComponent,
        MediaDocCreatepageComponent,
        MediaDocModalCreatepageComponent
    ]
})
export class MediaDocAdminModule {}
