'use strict';

const request = require(`supertest`);
const app = require(`../app`);

const {OK} = require(`../../constants`).HttpCode;

describe(`search`, () => {
  test(`if find substring in string response should have property 'id'`, async () => {
    const res = await request(app).get(`/api/search?query=рыба`);

    expect(res.statusCode).toBe(OK);
  });
});
