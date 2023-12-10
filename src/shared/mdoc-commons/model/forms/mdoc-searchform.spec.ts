import {MediaDocSearchForm} from './mdoc-searchform';

describe('MediaDocSearchForm', () => {
    it('should create an instance', () => {
        expect(new MediaDocSearchForm({})).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const mdoc = new MediaDocSearchForm({
            fulltext: 'hello'
        });
        expect(mdoc.fulltext).toEqual('hello');
    });
});
