import { mount, config } from '@vue/test-utils';
import App from '@/App';
import flushPromises from 'flush-promises';
import ZERO_ARTICLES from '../data/articles/zero-articles.json';
import ONE_ARTICLE from '../data/articles/one-article.json';

const FEED_POST_SELECTOR = '[data-testid=feed-post]';

describe('Global Feed', () => {

  it('shows 0 posts', async () => {
    mockAxios.onGet('/articles').reply(200, ZERO_ARTICLES);

    const app = mount(App);
    await flushPromises();

    expect(app.findAll(FEED_POST_SELECTOR).length).toEqual(0);
  });

  it('shows 1 post', async () => {
    mockAxios.onGet('/articles').reply(200, ONE_ARTICLE);

    const app = mount(App);
    await flushPromises();

    expect(app.findAll(FEED_POST_SELECTOR).length).toEqual(1);
    expect(app.findAll(FEED_POST_SELECTOR).at(0).find('[data-testid=author-image]').attributes('src')).toBe('image1');
    expect(app.findAll(FEED_POST_SELECTOR).at(0).find('[data-testid=author-username]').text()).toBe('author1');
  });

  describe('Shown dates are locale based', () => {
    it('shows dates in english', async () => {
      mockAxios.onGet('/articles').reply(200, ONE_ARTICLE);
      config.mocks.$i18n.locale = 'en';

      const app = mount(App);
      await flushPromises();

      expect(app.findAll(FEED_POST_SELECTOR).at(0).find('[data-testid=post-date]').text()).toBe('June 20th, 2021');
    });

    it('shows dates in Spanish', async () => {
      mockAxios.onGet('/articles').reply(200, ONE_ARTICLE);
      config.mocks.$i18n.locale = 'es';

      const app = mount(App);
      await flushPromises();

      expect(app.findAll(FEED_POST_SELECTOR).at(0).find('[data-testid=post-date]').text()).toBe('junio 20º, 2021');
    });

  });

});
