import {NgModule} from '@angular/core';
import {MediaDocSearchpageComponent} from './components/mdoc-searchpage/mdoc-searchpage.component';
import {MediaDocSearchFormConverter} from '../shared-mdoc/services/mdoc-searchform-converter.service';
import {MediaDocShowpageComponent} from './components/mdoc-showpage/mdoc-showpage.component';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {MediaDocSearchFormUtils} from '../shared-mdoc/services/mdoc-searchform-utils.service';
import {MediaDocSearchFormResolver} from '../shared-mdoc/resolver/mdoc-searchform.resolver';
import {MediaDocRecordResolver} from '../shared-mdoc/resolver/mdoc-details.resolver';
import {MediaDocRoutingModule} from './mdoc-routing.module';
import {ToastrModule} from 'ngx-toastr';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {CommonDocContentUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {SharedMediaDocModule} from '../shared-mdoc/shared-mdoc.module';
import {BrowserModule} from '@angular/platform-browser';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {AngularCommonsModule} from '@dps/mycms-frontend-commons/dist/angular-commons/angular-commons.module';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {MediaDocLightBoxService} from '../shared-mdoc/services/mdoc-lightbox.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {MediaDocDataService} from '../../shared/mdoc-commons/services/mdoc-data.service';
import {FileDropModule} from 'ngx-file-drop';
import {MediaDocContentUtils} from '../shared-mdoc/services/mdoc-contentutils.service';
import {CommonDocSearchFormUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-searchform-utils.service';
import {FrontendCommonDocCommonsModule} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/frontend-cdoc-commons.module';
import {MediaDocRoutingService} from '../../shared/mdoc-commons/services/mdoc-routing.service';
import {MediaDocAlbumpageComponent} from './components/mdoc-albumpage/mdoc-albumpage.component';
import {MediaDocAlbumResolver} from '../shared-mdoc/resolver/mdoc-album.resolver';
import {HttpClientModule} from '@angular/common/http';
import {MediaDocModalShowpageComponent} from './components/mdoc-showpage/mdoc-modal-showpage.component';

@NgModule({
    declarations: [
        MediaDocSearchpageComponent,
        MediaDocShowpageComponent,
        MediaDocAlbumpageComponent,
        MediaDocModalShowpageComponent
    ],
    imports: [
        NgbPaginationModule,
        TranslateModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule,
        HttpClientModule,
        AngularCommonsModule,
        SharedMediaDocModule,
        MediaDocRoutingModule,
        FileDropModule,
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
        ErrorResolver,
        PageUtils,
        MediaDocLightBoxService,
        MediaDocAlbumResolver,
        LayoutService
    ],
    exports: [
        MediaDocSearchpageComponent
    ]
})
export class MediaDocModule {}
