/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {MediaDocSectionPageComponent} from './mdoc-section-page.component';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub} from '@dps/mycms-frontend-commons/dist/testing/router-stubs';
import {ToastrService} from 'ngx-toastr';
import {ToastrServiceStub} from '@dps/mycms-frontend-commons/dist/testing/toasts-stubs';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {MediaDocSearchFormConverter} from '../../../shared-mdoc/services/mdoc-searchform-converter.service';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {PDocDataServiceStub} from '@dps/mycms-frontend-commons/dist/testing/pdoc-dataservice-stubs';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {Angulartics2} from 'angulartics2';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {Angulartics2Stub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/angulartics2-stubs';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {SimpleAngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/simple-angular-html.service';
import {SimpleAngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/simple-angular-markdown.service';
import {StaticPagesDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/staticpages-data.service';

describe('SectionPageComponent', () => {
    let component: MediaDocSectionPageComponent;
    let fixture: ComponentFixture<MediaDocSectionPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MediaDocSectionPageComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useValue: new RouterStub() },
                { provide: StaticPagesDataService, useValue: new PDocDataServiceStub() },
                { provide: GenericAppService, useValue: new AppServiceStub() },
                CommonRoutingService,
                PlatformService,
                MediaDocSearchFormConverter,
                CommonDocRoutingService,
                SearchParameterUtils,
                { provide: ToastrService, useValue: new ToastrServiceStub() },
                TranslateService,
                { provide: AngularMarkdownService, useClass: SimpleAngularMarkdownService },
                { provide: AngularHtmlService, useClass: SimpleAngularHtmlService },
                ErrorResolver,
                PageUtils,
                GenericTrackingService,
                { provide: Angulartics2, useValue: new Angulartics2Stub() },
                LayoutService,
                SearchFormUtils
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MediaDocSectionPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
