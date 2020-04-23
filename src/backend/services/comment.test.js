'use strict';

const commentRepository = require(`../repositories/comment`);
const articleRepository = require(`../repositories/article`);
jest.mock(`../repositories/comment`);
jest.mock(`../repositories/article`);

const underTest = require(`./comment`);
const {CommentNotFoundError, ArticleNotFoundError} = require(`../errors/errors`);

const MOCK_ID = 123456;

describe(`getByArticleId`, () => {
  test(`for existing article should return all comments`, () => {
    const expectedComments = [{}, {}];
    articleRepository.exists.mockReturnValue(true);
    commentRepository.findByArticleId.mockReturnValue(expectedComments);

    const actual = underTest.getByArticleId(MOCK_ID);

    expect(actual).toBe(expectedComments);
  });

  test(`for non-existing article should throw error`, () => {
    articleRepository.exists.mockReturnValue(false);

    expect(() => underTest.getByArticleId(MOCK_ID))
      .toThrowError(new ArticleNotFoundError(MOCK_ID));
  });
});

describe(`add comment`, () => {
  test(`for existing article should add new comment and return its id`, () => {
    articleRepository.exists.mockReturnValue(true);
    commentRepository.save.mockReturnValue(MOCK_ID);

    const actual = underTest.add({text: `some text`});

    expect(actual).toBe(MOCK_ID);
  });

  test(`for non-existing article should throw error`, () => {
    articleRepository.exists.mockReturnValue(false);

    expect(() => underTest.getByArticleId(MOCK_ID))
      .toThrowError(new ArticleNotFoundError(MOCK_ID));
  });
});

describe(`remove comment`, () => {
  test(`should return 'true' if existing comment was successfully deleted`, () => {
    commentRepository.exists.mockReturnValue(true);
    commentRepository.remove.mockReturnValue(true);

    const actual = underTest.remove(MOCK_ID, MOCK_ID);

    expect(actual).toBe(true);
  });

  test(`for non-existing comment should throw error`, () => {
    commentRepository.exists.mockReturnValue(false);

    expect(() => underTest.remove(MOCK_ID, MOCK_ID))
      .toThrowError(new CommentNotFoundError(MOCK_ID, MOCK_ID));
  });
});
