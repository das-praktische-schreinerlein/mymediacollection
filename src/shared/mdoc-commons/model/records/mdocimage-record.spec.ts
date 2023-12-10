import {MediaDocImageRecord} from './mdocimage-record';

describe('MediaDocImageRecord', () => {
    it('should create an instance', () => {
        expect(new MediaDocImageRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const mdoc = new MediaDocImageRecord({
            name: 'hello',
            fileName: 'img1.jpg'
        });
        expect(mdoc.name).toEqual('hello');
        expect(mdoc.fileName).toEqual('img1.jpg');
    });
});
