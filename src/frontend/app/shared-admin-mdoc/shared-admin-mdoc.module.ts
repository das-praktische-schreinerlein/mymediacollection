import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {MediaDocEditformComponent} from './components/mdoc-editform/mdoc-editform.component';
import {AngularCommonsModule} from '@dps/mycms-frontend-commons/dist/angular-commons/angular-commons.module';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';
import {ToastrModule} from 'ngx-toastr';
import {LightboxModule} from 'ngx-lightbox';
import {FileDropModule} from 'ngx-file-drop';
import {FrontendCommonDocCommonsModule} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/frontend-cdoc-commons.module';
import {MediaDocReplaceFormComponent} from './components/mdoc-replaceform/mdoc-replaceform.component';
import {MediaDocAssignFormComponent} from './components/mdoc-assignform/mdoc-assignform.component';
import {RouterModule} from '@angular/router';
import {MediaDocAssignPlaylistFormComponent} from './components/mdoc-assignplaylistform/mdoc-assignplaylistform.component';
import {MediaDocAssignJoinFormComponent} from './components/mdoc-assignjoinform/mdoc-assignjoinform.component';
import {SharedMediaDocModule} from '../shared-mdoc/shared-mdoc.module';

@NgModule({
    declarations: [
        MediaDocEditformComponent,
        MediaDocReplaceFormComponent,
        MediaDocAssignFormComponent,
        MediaDocAssignJoinFormComponent,
        MediaDocAssignPlaylistFormComponent
    ],
    imports: [
        SharedMediaDocModule,
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
        RouterModule,
        FileDropModule
    ],
    exports: [
        MediaDocEditformComponent,
        MediaDocReplaceFormComponent,
        MediaDocAssignFormComponent,
        MediaDocAssignJoinFormComponent,
        MediaDocAssignPlaylistFormComponent
    ]
})
export class SharedAdminMediaDocModule {}
