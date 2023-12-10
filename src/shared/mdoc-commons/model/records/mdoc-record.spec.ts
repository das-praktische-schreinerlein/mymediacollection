import {MediaDocRecord} from './mdoc-record';

describe('MediaDocRecord', () => {
    it('should create an instance', () => {
        expect(new MediaDocRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const mdoc = new MediaDocRecord({
            name: 'hello',
            type: 'AUDIO'
        });
        expect(mdoc.name).toEqual('hello');
        expect(mdoc.type).toEqual('AUDIO');
    });
});
