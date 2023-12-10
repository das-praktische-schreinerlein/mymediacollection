import {MediaDocAudioRecord} from './mdocaudio-record';

describe('MediaDocAudioRecord', () => {
    it('should create an instance', () => {
        expect(new MediaDocAudioRecord()).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const mdoc = new MediaDocAudioRecord({
            name: 'hello',
            fileName: 'img1.jpg'
        });
        expect(mdoc.name).toEqual('hello');
        expect(mdoc.fileName).toEqual('img1.jpg');
    });
});
