import {MyMediaCollectionPage} from './app.po';

describe('image-import-editor-app App', function() {
  let page: MyMediaCollectionPage;

  beforeEach(() => {
    page = new MyMediaCollectionPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    // expect(page.getParagraphText()).toEqual('app works!');
  });
});
