/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ComponentFactoryResolver, NO_ERRORS_SCHEMA} from '@angular/core';
import {MediaDocDataServiceStub} from '../../../../testing/mdoc-dataservice-stubs';
import {MediaDocActionsComponent} from './mdoc-actions.component';
import {MediaDocDynamicComponentService} from '../../services/mdoc-dynamic-components.service';
import {Router} from '@angular/router';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {MediaDocDataService} from '../../../../shared/mdoc-commons/services/mdoc-data.service';
import {ToastrService} from 'ngx-toastr';
import {ToastrServiceStub} from '@dps/mycms-frontend-commons/dist/testing/toasts-stubs';
import {MediaDocAlbumService} from '../../services/mdoc-album.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {DynamicComponentService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/dynamic-components.service';
import {MediaDocActionTagService} from '../../services/mdoc-actiontag.service';
import {MediaDocPlaylistService} from '../../services/mdoc-playlist.service';
import {CommonDocContentUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';

describe('MediaDocActionsComponent', () => {
    let component: MediaDocActionsComponent;
    let fixture: ComponentFixture<MediaDocActionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MediaDocActionsComponent],
            imports: [
            ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: MediaDocDataService, useValue: new MediaDocDataServiceStub() },
                { provide: GenericAppService, useValue: new AppServiceStub() },
                { provide: ToastrService, useValue: new ToastrServiceStub() },
                MediaDocDynamicComponentService,
                DynamicComponentService,
                MediaDocAlbumService,
                ComponentFactoryResolver,
                MediaDocActionTagService,
                MediaDocPlaylistService,
                CommonDocContentUtils,
                CommonDocRoutingService,
                CommonRoutingService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MediaDocActionsComponent);
        component = fixture.componentInstance;
        component.record = MediaDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
