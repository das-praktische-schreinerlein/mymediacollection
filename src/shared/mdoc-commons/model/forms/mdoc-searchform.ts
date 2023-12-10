import {GenericSearchFormFieldConfig} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-searchform';
import {
    CommonDocSearchForm,
    CommonDocSearchFormFactory,
    CommonDocSearchFormValidator
} from '@dps/mycms-commons/dist/search-commons/model/forms/cdoc-searchform';
import {
    GenericValidatorDatatypes,
    NameValidationRule,
    TextValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

export class MediaDocSearchForm extends CommonDocSearchForm {
    static mdocFields = {
        artist: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        album: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        genre: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        personalRateOverall: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new TextValidationRule(false)),
        dashboardFilter: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.WHAT_KEY_CSV, new TextValidationRule(false))
    };

    album: string;
    artist: string;
    genre: string;
    personalRateOverall: string;
    dashboardFilter: string;

    constructor(values: {}) {
        super(values);
        this.album = values['album'] || '';
        this.artist = values['artist'] || '';
        this.genre = values['genre'] || '';
        this.personalRateOverall = values['personalRateOverall'] || '';
        this.dashboardFilter = values['dashboardFilter'] || '';
    }

    toString() {
        return 'MediaDocSearchForm {\n' +
            '  what: ' + this.what + '\n' +
            '  fulltext: ' + this.fulltext + '\n' +
            '  type: ' + this.type + '\n' +
            '  sort: ' + this.sort + '\n' +
            '  perPage: ' + this.perPage + '\n' +
            '  pageNum: ' + this.pageNum + '' +
            '}';
    }
}

export class MediaDocSearchFormFactory {
    static getSanitizedValues(values: {}): any  {
        const sanitizedValues = CommonDocSearchFormFactory.getSanitizedValues(values);

        sanitizedValues.album = MediaDocSearchForm.mdocFields.album.validator.sanitize(values['album']) || '';
        sanitizedValues.artist = MediaDocSearchForm.mdocFields.artist.validator.sanitize(values['artist']) || '';
        sanitizedValues.genre = MediaDocSearchForm.mdocFields.genre.validator.sanitize(values['genre']) || '';
        sanitizedValues.personalRateOverall = MediaDocSearchForm.mdocFields.personalRateOverall.validator.sanitize(
            values['personalRateOverall']) || '';
        sanitizedValues.dashboardFilter = MediaDocSearchForm.mdocFields.dashboardFilter.validator.sanitize(values['dashboardFilter']) || '';

        return sanitizedValues;
    }

    static getSanitizedValuesFromForm(searchForm: MediaDocSearchForm): any {
        const sanitizedValues = CommonDocSearchFormFactory.getSanitizedValuesFromForm(searchForm);

        sanitizedValues.album = MediaDocSearchForm.mdocFields.album.validator.sanitize(searchForm.album) || '';
        sanitizedValues.artist = MediaDocSearchForm.mdocFields.artist.validator.sanitize(searchForm.artist) || '';
        sanitizedValues.genre = MediaDocSearchForm.mdocFields.genre.validator.sanitize(searchForm.genre) || '';
        sanitizedValues.personalRateOverall = MediaDocSearchForm.mdocFields.personalRateOverall.validator.sanitize(
            searchForm.personalRateOverall) || '';
        sanitizedValues.dashboardFilter = MediaDocSearchForm.mdocFields.dashboardFilter.validator.sanitize(searchForm.dashboardFilter) || '';

        return sanitizedValues;
    }

    static createSanitized(values: {}): MediaDocSearchForm {
        const sanitizedValues = MediaDocSearchFormFactory.getSanitizedValues(values);

        return new MediaDocSearchForm(sanitizedValues);
    }

    static cloneSanitized(searchForm: MediaDocSearchForm): MediaDocSearchForm {
        const sanitizedValues = MediaDocSearchFormFactory.getSanitizedValuesFromForm(searchForm);

        return new MediaDocSearchForm(sanitizedValues);
    }
}

export class MediaDocSearchFormValidator {
    static isValidValues(values: {}): boolean {
        let state = CommonDocSearchFormValidator.isValidValues(values);

        state = state && MediaDocSearchForm.mdocFields.album.validator.isValid(values['album']);
        state = state && MediaDocSearchForm.mdocFields.artist.validator.isValid(values['artist']);
        state = state && MediaDocSearchForm.mdocFields.genre.validator.isValid(values['genre']);
        state = state && MediaDocSearchForm.mdocFields.personalRateOverall.validator.isValid(values['personalRateOverall']);
        state = state && MediaDocSearchForm.mdocFields.dashboardFilter.validator.isValid(values['dashboardFilter']);

        return state;
    }

    static isValid(searchForm: MediaDocSearchForm): boolean {
        let state = CommonDocSearchFormValidator.isValid(searchForm);

        state = state && MediaDocSearchForm.mdocFields.album.validator.isValid(searchForm.album);
        state = state && MediaDocSearchForm.mdocFields.artist.validator.isValid(searchForm.artist);
        state = state && MediaDocSearchForm.mdocFields.genre.validator.isValid(searchForm.genre);

        return state;
    }
}
