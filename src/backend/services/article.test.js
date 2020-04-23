'use strict';

const articleRepository = require(`../repositories/article`);
jest.mock(`../repositories/article`);

const underTest = require(`./article`);
const {ArticleNotFoundError} = require(`../errors/errors`);

const newArticle = {
  title: `Десять доказательств, которые заставляют нас думать`,
  createDate: `2/24/2020, 6:17:25 PM`,
  announce: `Программировать не настолько сложно, как об этом говорят.`,
  fullText: `Вы можете достичь всего.`,
  category: [
    `Путешесвия`,
  ],
  comments: []
};
const updateArticle = {
  title: `Десять доказательств, которые заставляют нас думать`,
  createDate: `2/24/2020, 6:17:25 PM`,
  announce: `Программировать не настолько сложно, как об этом говорят.`,
  fullText: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  category: [
    `Путешесвия`,
  ],
  comments: [],
};
const MOCK_ID = 123456;

describe(`findAll`, () => {
  test(`actual article list should equal expected`, () => {
    const expectedArticle = [{}, {}, {}];
    articleRepository.findAll.mockReturnValue(expectedArticle);

    const actual = underTest.findAll();

    expect(actual).toBe(expectedArticle);
  });
});

describe(`findById`, () => {
  test(`for existing article should return it`, () => {
    articleRepository.exists.mockReturnValue(true);
    const expectedArticle = {id: MOCK_ID, title: `some title`};
    articleRepository.findById.mockReturnValue(expectedArticle);

    const actual = underTest.findById(MOCK_ID);

    expect(actual).toBe(expectedArticle);
  });

  test(`for non-existing article should throw error`, () => {
    articleRepository.exists.mockReturnValue(false);

    expect(() => underTest.findById(MOCK_ID))
      .toThrowError(new ArticleNotFoundError(MOCK_ID));
  });
});

describe(`create`, () => {
  test(`when adding new article should return new id`, () => {
    const expectedArticle = Object.assign({}, newArticle);
    expectedArticle.id = MOCK_ID;
    articleRepository.save.mockReturnValue(expectedArticle);

    const actual = underTest.create(newArticle);

    expect(actual).toBe(expectedArticle);
  });
});

describe(`update`, () => {
  test(`for existing article should apply changes and return its id`, () => {
    articleRepository.exists.mockReturnValue(true);
    const expectedArticle = Object.assign({}, newArticle);
    expectedArticle.id = MOCK_ID;
    articleRepository.save.mockReturnValue(expectedArticle);

    const actual = underTest.update(updateArticle);

    expect(actual).toBe(expectedArticle);
  });

  test(`for non-existing article should throw error`, () => {
    articleRepository.exists.mockReturnValue(false);

    expect(() => underTest.update(updateArticle, MOCK_ID))
      .toThrowError(new ArticleNotFoundError(MOCK_ID));
  });
});

describe(`remove`, () => {
  test(`should return 'true' if existing article was successfully deleted`, () => {
    articleRepository.exists.mockReturnValue(true);
    articleRepository.remove.mockReturnValue(true);

    const actual = underTest.remove(MOCK_ID);

    expect(actual).toBe(true);
  });

  test(`for non-existing article should throw error`, () => {
    articleRepository.exists.mockReturnValue(false);

    expect(() => underTest.remove(MOCK_ID))
      .toThrowError(new ArticleNotFoundError(MOCK_ID));
  });
});

describe(`search`, () => {
  test(`if found substring should return article`, () => {
    const expectedArticle = {id: MOCK_ID, title: `some title`};
    articleRepository.findByTitle.mockReturnValue(expectedArticle);

    const actual = underTest.search(`title`);

    expect(actual).toBe(expectedArticle);
    expect(articleRepository.findByTitle).toHaveBeenCalledWith(`title`);
  });
});
