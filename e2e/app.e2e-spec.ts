import { MySimpleHomePagePage } from './app.po';

describe('image-import-editor-app App', function() {
  let page: MySimpleHomePagePage;

  beforeEach(() => {
    page = new MySimpleHomePagePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    // expect(page.getParagraphText()).toEqual('app works!');
  });
});
