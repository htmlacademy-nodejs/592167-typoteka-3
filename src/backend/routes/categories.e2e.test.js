'use strict';

const request = require(`supertest`);
const app = require(`../app`);

const articleRepository = require(`../repositories/article`);
const {OK} = require(`../../constants`).HttpCode;
const MOCK_ARTICLE = {
  categories: [
    `Наука`,
    `Музыка`,
    `Фантастика`,
  ],
};

const addMockArticle = () => articleRepository.save(Object.assign({}, MOCK_ARTICLE));
const deleteMockArticle = (id) => articleRepository.remove(id);

describe(`get categories`, () => {
  test(`for non-existing mock.json categories list should be empty`, async () => {
    const res = await request(app).get(`/api/categories`);

    expect(res.statusCode).toBe(OK);
    expect(res.body.length === 0).toBeTruthy();
  });

  test(`categories should be 'MOCK_ARTICLE.categories'`, async () => {
    const id = addMockArticle();
    const res = await request(app).get(`/api/categories`);

    expect(res.body).toEqual(MOCK_ARTICLE.categories);

    deleteMockArticle(id);
  });
});
