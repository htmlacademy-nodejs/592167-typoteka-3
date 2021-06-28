'use strict';

const request = require(`supertest`);
const app = require(`../app`);
const {StatusCodes} = require(`http-status-codes`);
const {sequelize} = require(`../db/db-connect`);

const categoryRepository = require(`../repositories/categories`);
const MOCK_CATEGORY = {category: `Наука`};


afterAll(() => {
  sequelize.close();
});

describe(`get categories`, () => {
  test(`for non-existing mock.json categories list should be empty`, async () => {
    const res = await request(app).get(`/api/categories?categoriesList=only`);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body[0]).toHaveProperty(`id`);
  });

  test(`categories should be 'MOCK_ARTICLE.categories'`, async () => {
    await request(app).post(`/api/categories/add`).send(MOCK_CATEGORY);
    const res = await request(app).get(`/api/categories?categoriesList=only`);
    const categoryId = res.body.find((el) => el.category === MOCK_CATEGORY.category).id;
    const categoryNameList = res.body.map((el) => el.category);

    expect(categoryNameList).toContain(MOCK_CATEGORY.category);

    await categoryRepository.remove(categoryId);
  });
});
