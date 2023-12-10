import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {MediaDocListComponent} from './components/mdoc-list/mdoc-list.component';
import {MediaDocListItemComponent} from './components/mdoc-list-item/mdoc-list-item.component';
import {MediaDocSearchformComponent} from './components/mdoc-searchform/mdoc-searchform.component';
import {MediaDocInlineSearchpageComponent} from './components/mdoc-inline-searchpage/mdoc-inline-searchpage.component';
import {AngularCommonsModule} from '@dps/mycms-frontend-commons/dist/angular-commons/angular-commons.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';
import {NgbAccordionModule, NgbRatingModule, NgbTabsetModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastrModule} from 'ngx-toastr';
import {LightboxModule} from 'ngx-lightbox';
import {DatePipe} from '@angular/common';
import {FrontendCommonDocCommonsModule} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/frontend-cdoc-commons.module';
import {MediaDocActionTagsComponent} from './components/mdoc-actiontags/mdoc-actiontags.component';
import {MediaDocActionsComponent} from './components/mdoc-actions/mdoc-actions.component';
import {MediaDocMultiActionHeaderComponent} from './components/mdoc-multiactionheader/mdoc-multiactionheader.component';
import {MediaDocListItemFlatComponent} from './components/mdoc-list-item-flat/mdoc-list-item-flat.component';
import {MediaDocKeywordsComponent} from './components/mdoc-keywords/mdoc-keywords.component';
import {MediaDocKeywordTagFormComponent} from './components/mdoc-keywordtagform/mdoc-keywordtagform.component';
import {MediaDocKeywordsstateComponent} from './components/mdoc-keywordsstate/mdoc-keywordsstate.component';
import {MediaDocDashboardSearchColumnComponent} from './components/mdoc-dashboard-searchcolumn/mdoc-dashboard-searchcolumn.component';
import {MediaDocSimpleSearchNavigationComponent} from './components/mdoc-simple-search-navigation/mdoc-simple-search-navigation.component';
import {MediaDocRatePersonalComponent} from './components/mdoc-ratepers/mdoc-ratepers.component';
import {MediaDocLinkedPlaylistsComponent} from './components/mdoc-linked-playlists/mdoc-linked-playlists.component';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
    declarations: [
        MediaDocListComponent,
        MediaDocListItemComponent,
        MediaDocSearchformComponent,
        MediaDocInlineSearchpageComponent,
        MediaDocInlineSearchpageComponent,
        MediaDocActionsComponent,
        MediaDocActionTagsComponent,
        MediaDocMultiActionHeaderComponent,
        MediaDocListItemFlatComponent,
        MediaDocKeywordsComponent,
        MediaDocKeywordTagFormComponent,
        MediaDocKeywordsstateComponent,
        MediaDocDashboardSearchColumnComponent,
        MediaDocSimpleSearchNavigationComponent,
        MediaDocRatePersonalComponent,
        MediaDocLinkedPlaylistsComponent
    ],
    imports: [
        NgbAccordionModule, NgbRatingModule, NgbTabsetModule, NgbTooltipModule,
        ToastrModule,
        MultiselectDropdownModule,
        TranslateModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AngularCommonsModule,
        FrontendCommonDocCommonsModule,
        LightboxModule,
        RouterModule
    ],
    providers: [
        DatePipe
    ],
    exports: [
        MediaDocListComponent,
        MediaDocListItemComponent,
        MediaDocSearchformComponent,
        MediaDocInlineSearchpageComponent,
        MediaDocInlineSearchpageComponent,
        MediaDocActionsComponent,
        MediaDocActionTagsComponent,
        MediaDocMultiActionHeaderComponent,
        MediaDocListItemFlatComponent,
        MediaDocKeywordsComponent,
        MediaDocKeywordTagFormComponent,
        MediaDocKeywordsstateComponent,
        MediaDocDashboardSearchColumnComponent,
        MediaDocSimpleSearchNavigationComponent,
        MediaDocRatePersonalComponent,
        MediaDocLinkedPlaylistsComponent
    ]
})
export class SharedMediaDocModule {}
