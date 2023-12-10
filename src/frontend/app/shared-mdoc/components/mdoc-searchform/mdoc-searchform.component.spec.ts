/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MediaDocSearchformComponent} from './mdoc-searchform.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {MediaDocSearchFormUtils} from '../../services/mdoc-searchform-utils.service';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {MediaDocDataServiceStub} from '../../../../testing/mdoc-dataservice-stubs';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {MediaDocSearchFormConverter} from '../../services/mdoc-searchform-converter.service';
import {MediaDocDataStore, MediaDocTeamFilterConfig} from '../../../../shared/mdoc-commons/services/mdoc-data.store';
import {ToastrService} from 'ngx-toastr';
import {MediaDocDataCacheService} from '../../services/mdoc-datacache.service';
import {MediaDocDataService} from '../../../../shared/mdoc-commons/services/mdoc-data.service';
import {ToastrServiceStub} from '@dps/mycms-frontend-commons/dist/testing/toasts-stubs';

describe('MediaDocSearchformComponent', () => {
    let component: MediaDocSearchformComponent;
    let fixture: ComponentFixture<MediaDocSearchformComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MediaDocSearchformComponent],
            imports: [
                ReactiveFormsModule,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: MediaDocDataStore, useValue: new MediaDocDataStore(new SearchParameterUtils(), new MediaDocTeamFilterConfig()) },
                { provide: MediaDocDataService, useValue: new MediaDocDataServiceStub() },
                MediaDocDataCacheService,
                MediaDocSearchFormUtils,
                MediaDocSearchFormConverter,
                SearchFormUtils,
                { provide: SearchParameterUtils, useValue: new SearchParameterUtils() },
                { provide: ToastrService, useValue: new ToastrServiceStub() }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MediaDocSearchformComponent);
        component = fixture.componentInstance;
        component.searchResult = MediaDocDataServiceStub.defaultSearchResult();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
