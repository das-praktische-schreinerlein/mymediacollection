import {NgModule} from '@angular/core';
import {AppComponent} from './components/app/app.component';
import {AppRoutingModule} from './app.router';
import {AppCommonModule} from './app.common.module';
import {registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import {PDocAdminModule} from '@dps/mycms-frontend-commons/dist/frontend-pdoc-module/pdoc-admin/pdoc-admin.module';
import {SharedAdminPDocModule} from '@dps/mycms-frontend-commons/dist/frontend-pdoc-module/shared-admin-pdoc/shared-admin-pdoc.module';
import {
    PDocAssignFormComponent
} from '@dps/mycms-frontend-commons/dist/frontend-pdoc-module/shared-admin-pdoc/components/pdoc-assignform/pdoc-assignform.component';
import {
    PDocReplaceFormComponent
} from '@dps/mycms-frontend-commons/dist/frontend-pdoc-module/shared-admin-pdoc/components/pdoc-replaceform/pdoc-replaceform.component';
import {
    PDocNameSuggesterService
} from '@dps/mycms-frontend-commons/dist/frontend-pdoc-module/shared-admin-pdoc/services/pdoc-name-suggester.service';
import {
    PDocDescSuggesterService
} from '@dps/mycms-frontend-commons/dist/frontend-pdoc-module/shared-admin-pdoc/services/pdoc-desc-suggester.service';
import {
    PDocPageDescSuggesterService
} from '@dps/mycms-frontend-commons/dist/frontend-pdoc-module/shared-admin-pdoc/services/pdoc-page-desc-suggester.service';
import {PDocActionTagService} from '@dps/mycms-frontend-commons/dist/frontend-pdoc-module/shared-pdoc/services/pdoc-actiontag.service';
import {
    PDocAdminActionTagService
} from '@dps/mycms-frontend-commons/dist/frontend-pdoc-module/shared-admin-pdoc/services/pdoc-admin-actiontag.service';
import {PDocDataCacheService} from '@dps/mycms-frontend-commons/dist/frontend-pdoc-module/shared-pdoc/services/pdoc-datacache.service';
import {
    PDocActionTagsComponent
} from '@dps/mycms-frontend-commons/dist/frontend-pdoc-module/shared-pdoc/components/pdoc-actiontags/pdoc-actiontags.component';
import {
    PDocDynamicComponentService
} from '@dps/mycms-frontend-commons/dist/frontend-pdoc-module/shared-pdoc/services/pdoc-dynamic-components.service';
import {PDocAlbumService} from '@dps/mycms-frontend-commons/dist/frontend-pdoc-module/shared-pdoc/services/pdoc-album.service';
import {environment, EnvironmentPdfGenerator} from '../environments/environment';
import {COMMON_APP_ENVIRONMENT} from '@dps/mycms-frontend-commons/dist/frontend-section-commons/common-environment';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {SpecificAngularMarkdownService} from './services/specific-angular-markdown.service';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {SpecificAngularHtmlService} from './services/specific-angular-html.service';
import {HtmlLocalLinkRenderer} from '@dps/mycms-frontend-commons/dist/angular-commons/htmlrenderer/html-locallink.renderer';
import {
    HtmlTogglerRenderer,
    SimpleHtmlTogglerRenderer
} from '@dps/mycms-frontend-commons/dist/angular-commons/htmlrenderer/html-toggler.renderer';
import {MediaDocReplaceFormComponent} from './shared-admin-mdoc/components/mdoc-replaceform/mdoc-replaceform.component';
import {
    MediaDocAssignPlaylistFormComponent
} from './shared-admin-mdoc/components/mdoc-assignplaylistform/mdoc-assignplaylistform.component';
import {MediaDocAdminModule} from './mdoc-admin/mdoc-admin.module';
import {MediaDocAssignJoinFormComponent} from './shared-admin-mdoc/components/mdoc-assignjoinform/mdoc-assignjoinform.component';
import {MediaDocAssignFormComponent} from './shared-admin-mdoc/components/mdoc-assignform/mdoc-assignform.component';
import {MediaDocActionTagService} from './shared-mdoc/services/mdoc-actiontag.service';
import {SharedAdminMediaDocModule} from './shared-admin-mdoc/shared-admin-mdoc.module';
import {MediaDocAdminActionTagService} from './shared-admin-mdoc/services/mdoc-admin-actiontag.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {AppService} from './services/app.service';
import {PdfGenerator} from '@dps/mycms-frontend-commons/dist/angular-commons/services/pdf-print.service';

registerLocaleData(localeDe);

@NgModule({
    entryComponents: [
        PDocActionTagsComponent,
        PDocReplaceFormComponent,
        PDocAssignFormComponent,
        MediaDocReplaceFormComponent,
        MediaDocAssignFormComponent,
        MediaDocAssignJoinFormComponent,
        MediaDocAssignPlaylistFormComponent
    ],
    imports: [
        AppCommonModule,
        SharedAdminPDocModule,
        PDocAdminModule,
        SharedAdminMediaDocModule,
        MediaDocAdminModule,
        AppRoutingModule
    ],
    providers: [
        { provide: COMMON_APP_ENVIRONMENT, useValue: environment},
        PDocDynamicComponentService,
        PDocAlbumService,
        {provide: PDocActionTagService, useClass: PDocAdminActionTagService},
        PDocDataCacheService,
        PDocNameSuggesterService,
        PDocDescSuggesterService,
        PDocPageDescSuggesterService,
        // TODO if you want pdf replace PrintDialogPdfGenerator by JsPdfGenerator and move jspdf in package.json from optional to dep
        {provide: PdfGenerator, useClass: EnvironmentPdfGenerator},
        {provide: MediaDocActionTagService, useClass: MediaDocAdminActionTagService},
        {provide: AngularMarkdownService, useClass: SpecificAngularMarkdownService},
        {provide: AngularHtmlService, useClass: SpecificAngularHtmlService},
        HtmlLocalLinkRenderer,
        {provide: HtmlTogglerRenderer, useClass: SimpleHtmlTogglerRenderer}
    ],
    // Since the bootstrapped component is not inherited from your
    // imported AppModule, it needs to be repeated here.
    bootstrap: [AppComponent]
})
export class AppModule {}
