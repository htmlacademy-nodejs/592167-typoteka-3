'use strict';

const request = require(`supertest`);
const app = require(`../app`);

const {OK} = require(`../../constants`).HttpCode;

describe(`get categories`, () => {
  test(`when get all categories status code should be OK`, async () => {
    const res = await request(app).get(`/api/categories`);

    expect(res.statusCode).toBe(OK);
  });
});
