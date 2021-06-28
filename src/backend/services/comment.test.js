'use strict';

const commentRepository = require(`../repositories/comment`);
const articleRepository = require(`../repositories/article`);
const userServices = require(`../services/users`);
jest.mock(`../repositories/comment`);
jest.mock(`../repositories/article`);
jest.mock(`../services/users`);

const underTest = require(`./comment`);

const MOCK_ID = 123456;

describe(`getByArticleId`, () => {
  test(`for existing article should return all comments`, () => {
    const expectedComments = [{}, {}];
    articleRepository.exists.mockReturnValue(true);
    commentRepository.findByArticleId.mockReturnValue(expectedComments);

    const actual = underTest.getByArticleId(MOCK_ID);

    expect(actual).toBe(expectedComments);
  });
});

describe(`add comment`, () => {
  test(`for existing article should add new comment and return its id`, async () => {
    const mockData = {
      articleId: MOCK_ID,
      comment: `some text some text some text some text some text some text some text`,
    };
    const mockUserInfo = {
      dataValues: {
        id: 1,
      }
    };
    commentRepository.save.mockReturnValue(MOCK_ID);
    userServices.getUserInfo.mockReturnValue(mockUserInfo);

    const actual = await underTest.add(mockData);

    expect(actual).toBe(MOCK_ID);
  });
});

describe(`remove comment`, () => {
  test(`should return 'true' if existing comment was successfully deleted`, async () => {
    commentRepository.remove.mockReturnValue(true);

    const actual = await underTest.remove(MOCK_ID);

    expect(actual).toBe(true);
  });
});
