'use strict';

const categoriesRepository = require(`../repositories/categories`);
jest.mock(`../repositories/categories`);

const underTest = require(`./categories`);

describe(`categories`, () => {
  test(`should return categories list`, () => {
    const expectedCategories = [``, ``, ``];
    categoriesRepository.findAll.mockReturnValue(expectedCategories);

    const actual = underTest.getCategories();

    expect(actual).toBe(expectedCategories);
  });
});
