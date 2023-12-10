/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {MediaDocRatePersonalComponent} from './mdoc-ratepers.component';
import {TranslateModule} from '@ngx-translate/core';
import {MediaDocDataServiceStub} from '../../../../testing/mdoc-dataservice-stubs';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {CommonDocContentUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {Router} from '@angular/router';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {MediaDocContentUtils} from '../../services/mdoc-contentutils.service';

describe('MediaDocRatePersonalComponent', () => {
    let component: MediaDocRatePersonalComponent;
    let fixture: ComponentFixture<MediaDocRatePersonalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MediaDocRatePersonalComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                TranslateModule.forRoot()],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                CommonDocRoutingService,
                CommonDocContentUtils,
                MediaDocContentUtils,
                { provide: GenericAppService, useValue: new AppServiceStub() }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MediaDocRatePersonalComponent);
        component = fixture.componentInstance;
        component.record = MediaDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
