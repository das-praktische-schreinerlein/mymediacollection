/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {MediaDocDataServiceStub} from '../../../../testing/mdoc-dataservice-stubs';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {CommonDocContentUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {Router} from '@angular/router';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {MediaDocContentUtils} from '../../../shared-mdoc/services/mdoc-contentutils.service';
import {MediaDocAssignFormComponent} from './mdoc-assignform.component';
import {FormBuilder} from '@angular/forms';
import {MediaDocDataStore, MediaDocTeamFilterConfig} from '../../../../shared/mdoc-commons/services/mdoc-data.store';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {MediaDocDataService} from '../../../../shared/mdoc-commons/services/mdoc-data.service';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {ToastrService} from 'ngx-toastr';
import {ToastrServiceStub} from '@dps/mycms-frontend-commons/dist/testing/toasts-stubs';

describe('MediaDocAssignFormComponent', () => {
    let component: MediaDocAssignFormComponent;
    let fixture: ComponentFixture<MediaDocAssignFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MediaDocAssignFormComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                TranslateModule.forRoot()],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: MediaDocDataStore, useValue: new MediaDocDataStore(new SearchParameterUtils(), new MediaDocTeamFilterConfig()) },
                { provide: MediaDocDataService, useValue: new MediaDocDataServiceStub() },
                { provide: SearchParameterUtils, useValue: new SearchParameterUtils() },
                { provide: GenericAppService, useValue: new AppServiceStub() },
                FormBuilder,
                NgbModal,
                NgbActiveModal,
                CommonRoutingService,
                CommonDocRoutingService,
                CommonDocContentUtils,
                MediaDocContentUtils,
                SearchFormUtils,
                { provide: ToastrService, useValue: new ToastrServiceStub() }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MediaDocAssignFormComponent);
        component = fixture.componentInstance;
        component.records = [MediaDocDataServiceStub.defaultRecord()];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
