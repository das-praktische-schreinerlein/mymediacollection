import {MediaDocVideoRecord} from './mdocvideo-record';

describe('MediaDocVideoRecord', () => {
    it('should create an instance', () => {
        expect(new MediaDocVideoRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const mdoc = new MediaDocVideoRecord({
            name: 'hello',
            fileName: 'video.mp4'
        });
        expect(mdoc.name).toEqual('hello');
        expect(mdoc.fileName).toEqual('video.mp4');
    });
});
