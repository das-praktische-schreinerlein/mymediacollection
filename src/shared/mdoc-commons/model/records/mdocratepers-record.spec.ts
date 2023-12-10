import {MediaDocRatePersonalRecord} from './mdocratepers-record';

describe('MediaDocRatePersonalRecord', () => {
    it('should create an instance', () => {
        expect(new MediaDocRatePersonalRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const mdoc = new MediaDocRatePersonalRecord({
            gesamt: 5
        });
        expect(mdoc.gesamt).toEqual(5);
    });
});
