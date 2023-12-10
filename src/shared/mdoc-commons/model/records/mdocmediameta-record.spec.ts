import {MediaDocMediaMetaRecord} from './mdocmediameta-record';

describe('MediaDocMediaMetaRecord', () => {
    it('should create an instance', () => {
        expect(new MediaDocMediaMetaRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const mdoc = new MediaDocMediaMetaRecord({
            dur: 5.0
        });
        expect(mdoc.dur).toEqual(5.0);
    });
});
