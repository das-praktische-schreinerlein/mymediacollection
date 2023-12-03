/* tslint:disable:no-unused-variable */
import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {ToastrServiceStub} from '@dps/mycms-frontend-commons/dist/testing/toasts-stubs';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {Router} from '@angular/router';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('AppComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                NoopAnimationsModule,
                TranslateModule.forRoot(),
                HttpClientTestingModule
            ],
            declarations: [
                AppComponent
            ],
            providers: [
                TranslateService,
                { provide: GenericAppService, useValue: new AppServiceStub() },
                CommonRoutingService,
                { provide: Router, useValue: new RouterStub() },
                { provide: ToastrService, useValue: new ToastrServiceStub() },
                PlatformService,
                PageUtils,
                LayoutService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
        TestBed.compileComponents();
    });

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

    it(`should have as title 'MySimpleHomePage'`, async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('MySimpleHomePage');
    }));
});
