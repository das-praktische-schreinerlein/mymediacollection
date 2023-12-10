/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MediaDocEditformComponent} from './mdoc-editform.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {ToastrServiceStub} from '@dps/mycms-frontend-commons/dist/testing/toasts-stubs';
import {MediaDocDataServiceStub} from '../../../../testing/mdoc-dataservice-stubs';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {MediaDocSearchFormUtils} from '../../../shared-mdoc/services/mdoc-searchform-utils.service';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {MediaDocDataService} from '../../../../shared/mdoc-commons/services/mdoc-data.service';
import {CommonDocContentUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {Router} from '@angular/router';
import {MediaDocContentUtils} from '../../../shared-mdoc/services/mdoc-contentutils.service';

describe('MediaDocEditformComponent', () => {
    let component: MediaDocEditformComponent;
    let fixture: ComponentFixture<MediaDocEditformComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MediaDocEditformComponent],
            imports: [
                ReactiveFormsModule,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: ToastrService, useValue: new ToastrServiceStub() },
                TranslateService,
                { provide: MediaDocDataService, useValue: new MediaDocDataServiceStub() },
                MediaDocSearchFormUtils,
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                CommonDocRoutingService,
                SearchFormUtils,
                SearchParameterUtils,
                CommonDocContentUtils,
                MediaDocContentUtils,
                { provide: GenericAppService, useValue: new AppServiceStub() }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MediaDocEditformComponent);
        component = fixture.componentInstance;
        component.record = MediaDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
