import { TravelTogetherPage } from './app.po';

describe('travel-together App', () => {
  let page: TravelTogetherPage;

  beforeEach(() => {
    page = new TravelTogetherPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
