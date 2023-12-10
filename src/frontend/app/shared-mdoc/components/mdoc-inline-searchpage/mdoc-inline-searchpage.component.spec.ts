/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MediaDocInlineSearchpageComponent} from './mdoc-inline-searchpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {MediaDocDataService} from '../../../../shared/mdoc-commons/services/mdoc-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MediaDocDataStore, MediaDocTeamFilterConfig} from '../../../../shared/mdoc-commons/services/mdoc-data.store';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {MediaDocSearchFormConverter} from '../../services/mdoc-searchform-converter.service';
import {ToastrService} from 'ngx-toastr';
import {ToastrServiceStub} from '@dps/mycms-frontend-commons/dist/testing/toasts-stubs';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {TranslateModule} from '@ngx-translate/core';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {ActivatedRouteStub} from '@dps/mycms-frontend-commons/dist/testing/router-stubs';
import {MediaDocDataServiceStub} from '../../../../testing/mdoc-dataservice-stubs';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {MediaDocRoutingService} from '../../../../shared/mdoc-commons/services/mdoc-routing.service';
import {MediaDocActionTagService} from '../../services/mdoc-actiontag.service';
import {MediaDocAlbumService} from '../../services/mdoc-album.service';
import {MediaDocSearchFormUtils} from '../../services/mdoc-searchform-utils.service';
import {MediaDocPlaylistService} from '../../services/mdoc-playlist.service';
import {CommonDocContentUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';

describe('MediaDocInlineSearchpageComponent', () => {
    let component: MediaDocInlineSearchpageComponent;
    let fixture: ComponentFixture<MediaDocInlineSearchpageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MediaDocInlineSearchpageComponent],
            imports: [TranslateModule.forRoot()
            ],
            providers: [
                { provide: MediaDocDataStore, useValue: new MediaDocDataStore(new SearchParameterUtils(), new MediaDocTeamFilterConfig()) },
                { provide: GenericAppService, useValue: new AppServiceStub() },
                { provide: MediaDocDataService, useValue: new MediaDocDataServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                SearchFormUtils,
                MediaDocSearchFormConverter,
                { provide: SearchParameterUtils, useValue: new SearchParameterUtils() },
                CommonDocRoutingService,
                MediaDocRoutingService,
                { provide: ToastrService, useValue: new ToastrServiceStub() },
                PageUtils,
                MediaDocActionTagService,
                MediaDocAlbumService,
                MediaDocSearchFormUtils,
                MediaDocPlaylistService,
                CommonDocContentUtils
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MediaDocInlineSearchpageComponent);
        component = fixture.componentInstance;
        component.params = {};
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
