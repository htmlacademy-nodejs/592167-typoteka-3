'use strict';

const categoriesRepository = require(`../repositories/categories`);
jest.mock(`../repositories/categories`);

const underTest = require(`./categories`);

describe(`categories`, () => {
  test(`should return categories list`, async () => {
    const expectedCategories = [``, ``, ``];
    categoriesRepository.findAll.mockReturnValue(expectedCategories);

    const actual = await underTest.getCategories();

    expect(actual).toBe(expectedCategories);
  });
});
