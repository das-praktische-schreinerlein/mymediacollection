/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {MediaDocDataServiceStub} from '../../../../testing/mdoc-dataservice-stubs';
import {MediaDocMultiActionHeaderComponent} from './mdoc-multiactionheader.component';
import {MediaDocDataService} from '../../../../shared/mdoc-commons/services/mdoc-data.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {MediaDocContentUtils} from '../../services/mdoc-contentutils.service';
import {MediaDocActionTagService} from '../../services/mdoc-actiontag.service';
import {MediaDocRoutingService} from '../../../../shared/mdoc-commons/services/mdoc-routing.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {Router} from '@angular/router';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';

describe('MediaDocMultiActionHeaderComponent', () => {
    let component: MediaDocMultiActionHeaderComponent;
    let fixture: ComponentFixture<MediaDocMultiActionHeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MediaDocMultiActionHeaderComponent],
            imports: [
            ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: MediaDocDataService, useValue: new MediaDocDataServiceStub() },
                { provide: GenericAppService, useValue: new AppServiceStub() },
                MediaDocRoutingService,
                MediaDocActionTagService,
                MediaDocContentUtils,
                CommonDocRoutingService,
                CommonRoutingService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MediaDocMultiActionHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
