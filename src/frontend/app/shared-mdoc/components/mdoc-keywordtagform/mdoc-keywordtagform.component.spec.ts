/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {MediaDocDataServiceStub} from '../../../../testing/mdoc-dataservice-stubs';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {Router} from '@angular/router';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {ToastrServiceStub} from '@dps/mycms-frontend-commons/dist/testing/toasts-stubs';
import {MediaDocKeywordTagFormComponent} from './mdoc-keywordtagform.component';

describe('MediaDocKeywordTagFormComponent', () => {
    let component: MediaDocKeywordTagFormComponent;
    let fixture: ComponentFixture<MediaDocKeywordTagFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MediaDocKeywordTagFormComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                TranslateModule.forRoot()],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: GenericAppService, useValue: new AppServiceStub() },
                FormBuilder,
                NgbModal,
                NgbActiveModal,
                CommonRoutingService,
                CommonDocRoutingService,
                { provide: ToastrService, useValue: new ToastrServiceStub() }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MediaDocKeywordTagFormComponent);
        component = fixture.componentInstance;
        component.records = [MediaDocDataServiceStub.defaultRecord()];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
