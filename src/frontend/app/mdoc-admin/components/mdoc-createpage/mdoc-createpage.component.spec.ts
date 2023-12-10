/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MediaDocCreatepageComponent} from './mdoc-createpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ToastrServiceStub} from '@dps/mycms-frontend-commons/dist/testing/toasts-stubs';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ActivatedRouteStub} from '@dps/mycms-frontend-commons/dist/testing/router-stubs';
import {CommonDocContentUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {Angulartics2} from 'angulartics2';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {Angulartics2Stub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/angulartics2-stubs';
import {DatePipe} from '@angular/common';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {MediaDocDataService} from '../../../../shared/mdoc-commons/services/mdoc-data.service';
import {MediaDocDataServiceStub} from '../../../../testing/mdoc-dataservice-stubs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MediaDocRoutingService} from '../../../../shared/mdoc-commons/services/mdoc-routing.service';
import {MediaDocContentUtils} from '../../../shared-mdoc/services/mdoc-contentutils.service';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {SimpleAngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/simple-angular-markdown.service';
import {SimpleAngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/simple-angular-html.service';

describe('MediaDocCreatepageComponent', () => {
    let component: MediaDocCreatepageComponent;
    let fixture: ComponentFixture<MediaDocCreatepageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MediaDocCreatepageComponent],
            imports: [
                TranslateModule.forRoot(),
                NoopAnimationsModule
            ],
            providers: [
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useValue: new RouterStub() },
                DatePipe,
                CommonRoutingService,
                PlatformService,
                CommonDocContentUtils,
                MediaDocContentUtils,
                { provide: GenericAppService, useValue: new AppServiceStub() },
                CommonDocRoutingService,
                MediaDocRoutingService,
                { provide: ToastrService, useValue: new ToastrServiceStub() },
                TranslateService,
                { provide: AngularMarkdownService, useClass: SimpleAngularMarkdownService },
                { provide: AngularHtmlService, useClass: SimpleAngularHtmlService },
                ErrorResolver,
                PageUtils,
                GenericTrackingService,
                { provide: Angulartics2, useValue: new Angulartics2Stub() },
                { provide: MediaDocDataService, useValue: new MediaDocDataServiceStub() },
                LayoutService
        ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MediaDocCreatepageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
