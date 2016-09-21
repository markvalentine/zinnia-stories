import { ZinniaStoriesPage } from './app.po';

describe('zinnia-stories App', function() {
  let page: ZinniaStoriesPage;

  beforeEach(() => {
    page = new ZinniaStoriesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
