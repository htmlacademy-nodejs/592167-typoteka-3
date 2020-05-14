'use strict';

const request = require(`supertest`);
const app = require(`../app`);

const {OK} = require(`../../constants`).HttpCode;

describe(`search`, () => {
  test(`if find substring in string response should have property 'id'`, async () => {
    const res = await request(app).get(encodeURI(`/api/search?query=соб`));

    expect(res.statusCode).toBe(OK);
    expect(res.body[0]).toHaveProperty(`id`);
    expect(res.body[0]).toHaveProperty(`title`);
    expect(res.body[0]).toHaveProperty(`createDate`);
    expect(res.body[0]).toHaveProperty(`announce`);
    expect(res.body[0]).toHaveProperty(`fullText`);
    expect(res.body[0]).toHaveProperty(`categories`);
    expect(res.body[0]).toHaveProperty(`comments`);
  });
});
