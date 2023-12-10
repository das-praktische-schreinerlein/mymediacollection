/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {MediaDocListComponent} from './mdoc-list.component';
import {MediaDocSearchFormConverter} from '../../services/mdoc-searchform-converter.service';
import {TranslateModule} from '@ngx-translate/core';
import {MediaDocDataServiceStub} from '../../../../testing/mdoc-dataservice-stubs';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {CommonDocContentUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {Lightbox, LightboxConfig, LightboxEvent} from 'ngx-lightbox';
import {MediaDocLightBoxService} from '../../services/mdoc-lightbox.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {Router} from '@angular/router';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';

describe('MediaDocListComponent', () => {
    let component: MediaDocListComponent;
    let fixture: ComponentFixture<MediaDocListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MediaDocListComponent],
            imports: [
                TranslateModule.forRoot()
            ],
            providers: [
                MediaDocSearchFormConverter,
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                CommonDocRoutingService,
                CommonDocContentUtils,
                LightboxEvent,
                LightboxConfig,
                Lightbox,
                MediaDocLightBoxService,
                SearchFormUtils,
                { provide: GenericAppService, useValue: new AppServiceStub() },
                { provide: SearchParameterUtils, useValue: new SearchParameterUtils() }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MediaDocListComponent);
        component = fixture.componentInstance;
        component.searchResult = MediaDocDataServiceStub.defaultSearchResult();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
