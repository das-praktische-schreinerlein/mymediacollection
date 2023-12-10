import {MediaDocSearchResult} from './mdoc-searchresult';

describe('MediaDocSearchResult', () => {
    it('should create an instance', () => {
        expect(new MediaDocSearchResult(undefined, undefined, undefined, undefined)).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const mdocSearchResult = new MediaDocSearchResult(undefined, 1, undefined, undefined);
        expect(mdocSearchResult.recordCount).toEqual(1);
    });
});
