import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MediaDocSearchForm} from '../../../../shared/mdoc-commons/model/forms/mdoc-searchform';
import {MediaDocSearchResult} from '../../../../shared/mdoc-commons/model/container/mdoc-searchresult';
import {Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import {MediaDocSearchFormUtils} from '../../services/mdoc-searchform-utils.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ToastrService} from 'ngx-toastr';
import {MediaDocDataCacheService} from '../../services/mdoc-datacache.service';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {MediaDocSearchFormConverter} from '../../services/mdoc-searchform-converter.service';
import {CommonDocSearchformComponent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-searchform/cdoc-searchform.component';
import {MediaDocRecord} from '../../../../shared/mdoc-commons/model/records/mdoc-record';
import {MediaDocDataService} from '../../../../shared/mdoc-commons/services/mdoc-data.service';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';

@Component({
    selector: 'app-mdoc-searchform',
    templateUrl: './mdoc-searchform.component.html',
    styleUrls: ['./../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-searchform/cdoc-searchform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDocSearchformComponent extends CommonDocSearchformComponent<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult, MediaDocDataService> {
    public optionsSelectArtists: IMultiSelectOption[] = [];
    public optionsSelectGenres: IMultiSelectOption[] = [];
    public optionsSelectDashboardFilter: IMultiSelectOption[] = [];
    public optionsSelectPersonalRateOverall: IMultiSelectOption[] = [];

    public settingsSelectArtists: IMultiSelectSettings = this.defaultSeLectSettings;
    public settingsSelectGenres: IMultiSelectSettings = this.defaultSeLectSettings;
    public settingsSelectDashboardFilter = {dynamicTitleMaxItems: 1,
        buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm multiselect-highlight-value',
        containerClasses: 'dropdown-inline fullwidth',
        enableSearch: true,
        showUncheckAll: true,
        autoUnselect: true,
        selectionLimit: 1};
    public settingsSelectPersonalRateOverall = this.defaultSeLectSettings;

    public textsSelectArtists: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Artist ausgewählt',
        checkedPlural: 'Artist ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Alle'};
    public textsSelectGenres: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Genre ausgewählt',
        checkedPlural: 'Genre ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Alle'};
    public textsSelectDashboardFilter: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Dashboard ausgewählt',
        checkedPlural: 'Dashboard ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Alle'};
    public textsSelectPersonalRateOverall: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Bewertung ausgewählt',
        checkedPlural: 'Bewertung ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Alle'};

    public showDashboardFilterAvailable = true;

    @Input()
    public showDashboardFilter? = this.showForm;

    // initialize a private variable _searchForm, it's a BehaviorSubject
    constructor(sanitizer: DomSanitizer, fb: FormBuilder, searchFormUtils: SearchFormUtils,
                private mdocSearchFormUtils: MediaDocSearchFormUtils, searchFormConverter: MediaDocSearchFormConverter,
                mdocDataCacheService: MediaDocDataCacheService, toastr: ToastrService, cd: ChangeDetectorRef) {
        super(sanitizer, fb, searchFormUtils, mdocSearchFormUtils, searchFormConverter, mdocDataCacheService, toastr, cd);
        this.defaultSeLectSettings.dynamicTitleMaxItems = 2;
    }

    protected createDefaultSearchResult(): MediaDocSearchResult {
        return new MediaDocSearchResult(new MediaDocSearchForm({}), 0, undefined, new Facets());
    }

    protected createDefaultFormGroup(): any {
        return this.fb.group({
            dashboardFilter: [],
            album: [],
            artist: [],
            genre: [],
            what: [],
            moreFilter: '',
            fulltext: '',
            keywords: [],
            personalRateOverall: [],
            playlists: [],
            type: [],
            sort: '',
            perPage: 10,
            pageNum: 1
        });
    }


    protected updateFormGroup(mdocSearchSearchResult: MediaDocSearchResult): void {
        const values: MediaDocSearchForm = mdocSearchSearchResult.searchForm;
        this.searchFormGroup = this.fb.group({
            dashboardFilter: [(values.dashboardFilter ? values.dashboardFilter.split(/;/) : [])],
            album: [(values.album ? values.album.split(/,/) : [])],
            artist: [(values.artist ? values.artist.split(/,/) : [])],
            genre: [(values.genre ? values.genre.split(/,/) : [])],
            what: [(values.what ? values.what.split(/,/) : [])],
            fulltext: values.fulltext,
            moreFilter: values.moreFilter,
            personalRateOverall: [(values.personalRateOverall ? values.personalRateOverall.split(/,/) : [])],
            playlists: [(values.playlists ? values.playlists.split(/,/) : [])],
            type: [(values.type ? values.type.split(/,/) : [])]
        });
    }

    protected updateSelectComponents(mdocSearchSearchResult: MediaDocSearchResult) {
        super.updateSelectComponents(mdocSearchSearchResult);

        const rawValues = this.searchFormGroup.getRawValue();
        this.optionsSelectGenres = this.searchFormUtils.moveSelectedToTop(
            this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                this.mdocSearchFormUtils.getGenreValues(mdocSearchSearchResult),
                true, [], true),
            rawValues['genre']);
        this.optionsSelectArtists = this.searchFormUtils.moveSelectedToTop(
            this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                this.mdocSearchFormUtils.getArtistValues(mdocSearchSearchResult),
                true, [], true),
            rawValues['artist']);
        this.optionsSelectWhat = this.searchFormUtils.moveSelectedToTop(
            this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                this.mdocSearchFormUtils.getWhatValues(mdocSearchSearchResult), true, [/^kw_/gi], true),
            rawValues['what']);
        this.optionsSelectPersonalRateOverall = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.mdocSearchFormUtils.getPersonalRateOverallValues(mdocSearchSearchResult), true, [], true);
        this.optionsSelectDashboardFilter = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.mdocSearchFormUtils.getDashboardFilterValues(mdocSearchSearchResult), true, [], true);
    }

    protected updateAvailabilityFlags(mdocSearchSearchResult: MediaDocSearchResult) {
        super.updateAvailabilityFlags(mdocSearchSearchResult);
        this.showMetaAvailable = (this.optionsSelectPlaylists.length > 0 || this.optionsSelectPersonalRateOverall.length > 0);
        this.showDetailsAvailable = (this.optionsSelectWhat.length > 0 || this.optionsSelectArtists.length > 0
            || this.optionsSelectGenres.length > 0);
        this.showDashboardFilterAvailable = (this.optionsSelectDashboardFilter.length > 0);
    }

    updateFormState(state?: boolean): void {
        if (state !== undefined) {
            this.showForm = this.showDetails = this.showFulltext = this.showMeta = this.showSpecialFilter = this.showWhat =
                this.showDashboardFilter = state;
        } else {
            this.showForm = this.showDetails || this.showFulltext || this.showMeta || this.showSpecialFilter || this.showWhat
                || this.showDashboardFilter;
        }

        this.changedShowForm.emit(this.showForm);
    }

    protected beforeDoSearchPrepareValues(values: any) {
    }
}
