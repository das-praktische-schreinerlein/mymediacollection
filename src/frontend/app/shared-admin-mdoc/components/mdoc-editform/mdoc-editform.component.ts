import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {MediaDocRecord, MediaDocRecordValidator} from '../../../../shared/mdoc-commons/model/records/mdoc-record';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import {MediaDocSearchFormUtils} from '../../../shared-mdoc/services/mdoc-searchform-utils.service';
import {MediaDocDataService} from '../../../../shared/mdoc-commons/services/mdoc-data.service';
import {MediaDocSearchForm} from '../../../../shared/mdoc-commons/model/forms/mdoc-searchform';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {MediaDocSearchResult} from '../../../../shared/mdoc-commons/model/container/mdoc-searchresult';
import {isArray} from 'util';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {MediaDocContentUtils} from '../../../shared-mdoc/services/mdoc-contentutils.service';
import {
    CommonDocEditformComponent,
    CommonDocEditformComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-editform/cdoc-editform.component';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {SchemaValidationError} from 'js-data';
import {MediaDocRecordSchema} from '../../../../shared/mdoc-commons/model/schemas/mdoc-record-schema';
import {MediaDocLinkedArtistRecord} from '../../../../shared/mdoc-commons/model/records/mdoclinkedartist-record';
import {DateUtils} from '@dps/mycms-commons/dist/commons/utils/date.utils';
import {Router} from '@angular/router';

@Component({
    selector: 'app-mdoc-editform',
    templateUrl: './mdoc-editform.component.html',
    styleUrls: ['./mdoc-editform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDocEditformComponent
    extends CommonDocEditformComponent<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult, MediaDocDataService> {
    joinIndexes: {[key: string]: any[]} = {};
    public optionsSelect: {
        'mdocratepers.gesamt': IMultiSelectOption[];
        'playlists': IMultiSelectOption[];
        'albumId': IMultiSelectOption[];
        'genreId': IMultiSelectOption[];
        'artistId': IMultiSelectOption[];
        'audioId': IMultiSelectOption[];
        'subType': IMultiSelectOption[];
    };
    public settingsSelectGenre: IMultiSelectSettings = this.defaultSelectSetting;
    public settingsSelectArtist: IMultiSelectSettings = this.defaultSelectSetting;
    public settingsSelectAlbum: IMultiSelectSettings = this.defaultSelectSetting;
    public settingsSelectPersRate = this.defaultSelectSetting;

    public textsSelectGenre: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Genre ausgewählt',
        checkedPlural: 'Genre ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '--',
        allSelected: 'Alle'};
    public textsSelectArtist: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Artist ausgewählt',
        checkedPlural: 'Artist ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '--',
        allSelected: 'Alle'};
    public textsSelectAlbum: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Album ausgewählt',
        checkedPlural: 'Album ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '--',
        allSelected: 'Alle'};
    public textsSelectPersRate: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Bewertung ausgewählt',
        checkedPlural: 'Bewertung ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '--',
        allSelected: 'Alle'};

    constructor(public fb: FormBuilder, protected toastr: ToastrService, protected cd: ChangeDetectorRef,
                protected appService: GenericAppService, protected mdocSearchFormUtils: MediaDocSearchFormUtils,
                protected searchFormUtils: SearchFormUtils, protected mdocDataService: MediaDocDataService,
                protected contentUtils: MediaDocContentUtils, protected router: Router) {
        super(fb, toastr, cd, appService, mdocSearchFormUtils, searchFormUtils, mdocDataService, contentUtils, router);
    }

    // TODO move to commons
    joinElementChanged(formElement: any, joinName: string, idx: number, add: boolean) {
        const indexes = this.joinIndexes[joinName];
        if (add && indexes) {
            if (idx === indexes[indexes.length - 1]) {
                const newIdx = idx + 1;
                this.editFormGroup.registerControl(joinName + 'Id' + newIdx, this.fb.control(undefined, undefined));
                this.editFormGroup.registerControl(joinName + 'LinkedDetails' + newIdx, this.fb.control(undefined, undefined));
                indexes.push(newIdx);
            }
        }

        return false;
    }

    protected validateSchema(record: MediaDocRecord): SchemaValidationError[] {
        return MediaDocRecordSchema.validate(record);
    }

    protected validateValues(record: MediaDocRecord): string[] {
        return MediaDocRecordValidator.instance.validateValues(record);
    }

    protected getComponentConfig(config: {}): CommonDocEditformComponentConfig {
        let prefix = '';
        let suggestionConfig = [];
        if (BeanUtils.getValue(config, 'components.mdoc-keywords.keywordSuggestions')) {
            suggestionConfig = BeanUtils.getValue(config, 'components.mdoc-keywords.keywordSuggestions');
            prefix = BeanUtils.getValue(config, 'components.mdoc-keywords.editPrefix');
        }

        return {
            suggestionConfigs: suggestionConfig,
            editPrefix: prefix,
            numBeanFieldConfig: {
                'mdocratepers.gesamt': { labelPrefix: 'label.mdocratepers.gesamt.', values: [-1, 0, 2, 5, 8, 11, 14]},
                'mdocratepers.gesamt_audio': { labelPrefix: 'label.audio.mdocratepers.gesamt.', values: [-1, 0, 2, 5, 6, 8, 9, 10, 11, 14]},
                'mdocmediameta.dur': {},
                'mdocmediameta.fileSize': {},
                'albumId': {},
                'artistId': {},
                'genreId': {},
                'audioId': {}
            },
            stringBeanFieldConfig: {
                'mdocmediameta.metadata': {},
                'subtype': {}
            },
            stringArrayBeanFieldConfig: {
                'playlists': {},
            },
            inputSuggestionValueConfig: {
            },
            optionsSelect: {
                'mdocratepers.gesamt': [],
                'playlists': [],
                'albumId': [],
                'artistId': [],
                'genreId': [],
                'audioId': [],
                'subType': []
            },
            modalEditOutletName: 'mdocmodaledit',
            modalShowOutletName: 'mdocmodalshow'
        };
    }

    recommendName(): void {
        let name = '';

        let actiontype = this.editFormGroup.getRawValue()['subtype'];
        if (this.editFormGroup.getRawValue()['subtype'] !== undefined) {
            if (!isArray(actiontype)) {
                actiontype = [actiontype];
            }
            const selectedActionTypes = this.searchFormUtils.extractSelected(this.optionsSelect.subType, actiontype);
            if (selectedActionTypes.length > 0) {
                name += selectedActionTypes[0].name;
            }
        }

        this.setValue('name', name);
    }

    protected updateOptionValues(mdocSearchResult: MediaDocSearchResult): boolean {
        super.updateOptionValues(mdocSearchResult);

        const me = this;

        if (mdocSearchResult !== undefined) {
            const rawValues = this.editFormGroup.getRawValue();
            // console.log('update searchResult', mdocSearchResult);

            const genreValues = me.searchFormUtils.prepareExtendedSelectValues(me.mdocSearchFormUtils.getGenreValues(mdocSearchResult));
            me.optionsSelect['genreId'] = me.searchFormUtils.moveSelectedToTop(
                me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(genreValues, true, [],
                    false), rawValues['genreId']);
            const artistValues = me.searchFormUtils.prepareExtendedSelectValues(me.mdocSearchFormUtils.getArtistValues(mdocSearchResult));
            me.optionsSelect['artistId'] = me.searchFormUtils.moveSelectedToTop(
                me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(artistValues, true, [],
                    false), rawValues['artistId']);
            const albumValues = me.searchFormUtils.prepareExtendedSelectValues(me.mdocSearchFormUtils.getAlbumValues(mdocSearchResult));
            me.optionsSelect['albumId'] = me.searchFormUtils.moveSelectedToTop(
                me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(albumValues, true, [],
                    false), rawValues['albumId']);
        } else {
            // console.log('empty searchResult', mdocSearchResult);
            me.optionsSelect['genreId'] = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList([], true, [], true);
            me.optionsSelect['albumId'] = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList([], true, [], true);
            me.optionsSelect['artistId'] = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList([], true, [], true);
            me.optionsSelect['audioId'] = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList([], true, [], true);
            me.optionsSelect['playlists'] = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList([], true, [], true);
            me.optionsSelect['type'] = me.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList([], true, [], false);
        }

        return true;
    }

    protected prepareSubmitValues(values: {}): void {
        super.prepareSubmitValues(values);

        this.prepareLinkedArtistsSubmitValues(values);

        // TODO introduce dateBeanFieldConfig, objectBeanFieldConfig in commons
        values['mdocmediameta.fileCreated'] = Array.isArray(values['mdocmediameta_fileCreated'])
            ? values['mdocmediameta_fileCreated'][0]
            : values['mdocmediameta_fileCreated'];
    }

    protected prepareLinkedArtistsSubmitValues(values: {}): void {
        const joins: {}[] = [];
        const joinName = 'linkedArtists';

        const artistJoinIndexes = this.joinIndexes[joinName];
        for (let idx = 1; idx <= artistJoinIndexes.length; idx ++) {
            const refId = this.getStringFormValue(values, joinName + 'Id' + idx);
            if (refId !== undefined && refId !== 'undefined') {
                joins.push({
                    mdoc_id: this.record.id,
                    name: 'dummy',
                    refId: refId,
                    type: 'addArtist'
                })
            }
        }
        values['mdoclinkedartists'] = joins;
    }

    protected createDefaultFormValueConfig(record: MediaDocRecord): {} {
        const valueConfig = {
            dateshow: [DateUtils.dateToLocalISOString(record.dateshow)]
        };

        if (record.get('mdocmediameta') && record.get('mdocmediameta')['fileCreated']) {
            valueConfig['mdocmediameta_fileCreated'] = [DateUtils.dateToLocalISOString(record.get('mdocmediameta')['fileCreated'])];
        }

        this.appendLinkedArtistsToDefaultFormValueConfig(record, valueConfig);

        return valueConfig;
    }

    protected appendLinkedArtistsToDefaultFormValueConfig(record: MediaDocRecord, valueConfig: {}) {
        const joinRecords: MediaDocLinkedArtistRecord[] = this.record.get('mdoclinkedartists') || [];
        const joinName = 'linkedArtists';

        const indexes = [];
        let idx = 1;
        for (; idx <= joinRecords.length; idx ++) {
            indexes.push(idx);
            valueConfig[joinName + 'Id' + idx] = [joinRecords[idx - 1].refId];
        }

        indexes.push(idx);
        valueConfig[joinName + 'Id' + idx] = [];
        this.joinIndexes[joinName] = indexes;
    }

    // TODO move to commons
    protected getNumberFormValue(values: {}, formKey: string): number {
        if (!values[formKey]) {
            return undefined;
        }

        if (Array.isArray(values[formKey])) {
            return Number(values[formKey][0]);
        } else {
            return Number(values[formKey]);
        }
    }

    // TODO move to commons
    protected getStringFormValue(values: {}, formKey: string): string {
        if (!values[formKey]) {
            return undefined;
        }

        if (Array.isArray(values[formKey])) {
            return values[formKey][0] + '';
        } else {
            return values[formKey] + '';
        }
    }

    // TODO move to commons
    protected getStringArrayFormValue(values: {}, formKey: string): string[] {
        if (!values[formKey]) {
            return undefined;
        }
        if (Array.isArray(values[formKey])) {
            return values[formKey];
        } else {
            return [values[formKey]];
        }
    }
}

