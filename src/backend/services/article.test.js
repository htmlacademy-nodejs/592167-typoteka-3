'use strict';

const articleRepository = require(`../repositories/article`);
const categoryRepository = require(`../repositories/categories`);
const commentServices = require(`../services/comment`);
jest.mock(`../repositories/article`);
jest.mock(`../repositories/categories`);
jest.mock(`../services/comment`);

const underTest = require(`./article`);

const newArticle = {
  id: 1,
  title: `Тут название публикации. Самой первой публикации и самой лучшей.`,
  announce: `Анонс публикации. Ну и что там обычно идет далее. ыловалыдов гуцшкщг лоывладо цгугкщцулдываодл оцшщугкцщулдывао`,
  createdAt: `2021-06-16T05:41:31.939Z`,
  categories: [{
    id: 2,
    category: `Категория 2`,
  }],
  images: [{
    image: `8d6e9a8479eb330e39cc3ab436cdd516.jpg`
  }],
};
const articles = {
  id: 1,
  title: `Тут название публикации. Самой первой публикации и самой лучшей.`,
  announce: `Анонс публикации. Ну и что там обычно идет далее. ыловалыдов гуцшкщг лоывладо цгугкщцулдываодл оцшщугкцщулдывао`,
  createdAt: `2021-06-16T05:41:31.939Z`,
  image: `8d6e9a8479eb330e39cc3ab436cdd516.jpg`,
  categories: [{id: 2, category: `Категория 2`}],
  countComment: 0
};
const MOCK_ID = 1;

describe(`findAll`, () => {
  test(`actual article list should equal expected`, async () => {
    const expectedArticle = [articles];
    const expectedGetPreviewsForMainPage = [newArticle];
    const expectedGetCommentsForArticle = [];
    articleRepository.getPreviewsForMainPage.mockReturnValue(expectedGetPreviewsForMainPage);
    articleRepository.getCommentsForArticle.mockReturnValue(expectedGetCommentsForArticle);

    const actual = await underTest.getPreviewsForMainPage();

    expect(actual).toStrictEqual(expectedArticle);
  });
});

describe(`findById`, () => {
  test(`for existing article should return it`, async () => {
    const expectedGetArticleById = [{
      id: 1,
      title: `Тут название публикации. Самой первой публикации и самой лучшей.`,
      announce: `Анонс публикации. Ну и что там обычно идет далее. ыловалыдов гуцшкщг лоывладо цгугкщцулдываодл оцшщугкцщулдывао`,
      description: null,
      createdAt: `2021-06-16T05:41:31.939Z`,
      categories: [{id: 2, category: `Категория 2`}],
      images: [{
        image: `8d6e9a8479eb330e39cc3ab436cdd516.jpg`
      }]
    }];
    const expectedArticle = {
      articleId: 1,
      title: `Тут название публикации. Самой первой публикации и самой лучшей.`,
      image: `8d6e9a8479eb330e39cc3ab436cdd516.jpg`,
      createdAt: `16.06.2021`,
      announce: `Анонс публикации. Ну и что там обычно идет далее. ыловалыдов гуцшкщг лоывладо цгугкщцулдываодл оцшщугкцщулдывао`,
      description: null,
      authorization: true,
      comments: [],
      categories: [{id: 2, category: `Категория 2`}],
      userInfoForArticleById: {}
    };
    articleRepository.getArticleById.mockReturnValue(expectedGetArticleById);
    categoryRepository.getCategoryById.mockReturnValue([{id: 2, category: `Категория 2`}]);
    commentServices.getCommentsForAtricle.mockReturnValue([]);

    const actual = await underTest.getArticleById(MOCK_ID, {extension: `post-info`});

    expect(actual).toEqual(expectedArticle);
  });
});

describe(`create`, () => {
  test(`when adding new article should return new id`, async () => {
    const article = {
      'date': `2021-06-22`,
      'title': `заголовок фыдваодлф ыошщцугк шщфылвдао шцугкшщ глыдфвоа длцушщкголдфвыао`,
      'photo': `5b15bedeeaa9b.jpg`,
      'checkbox-category': `2`,
      'announcement': `анонс публикации даофывлдоа гкшщцугк фывдлаофывгцушщг фыводадошщцугк лдфывоалдшщцугкфыволдалдывфо`,
      'full-text': `полный текст публикации фывдлао лдфгуцшщкг фывола лоцушщкгцйу олдфывоашщцугкшщ фывлдоацугщшкг`,
      'image': `d9713be1660ce8699963b715202d69d6.jpg`,
    };
    const expectedArticle = {
      'id': 1
    };

    articleRepository.save.mockReturnValue(expectedArticle);

    const actual = await underTest.create(article);

    expect(actual).toEqual(expectedArticle);
  });
});

describe(`update`, () => {
  test(`for existing article should apply changes and return its id`, async () => {
    const article = {
      'date': `2021-06-22`,
      'title': `измененный заголовок фыдваодлф ыошщцугк шщфылвдао шцугкшщ глыдфвоа длцушщкголдфвыао`,
      'photo': `5b15bedeeaa9b.jpg`,
      'checkbox-category': `2`,
      'announcement': `анонс публикации с правками даофывлдоа гкшщцугк фывдлаофывгцушщг фыводадошщцугк лдфывоалдшщцугкфыволдалдывфо`,
      'full-text': `полный текст публикации, редактированный фывдлао лдфгуцшщкг фывола лоцушщкгцйу олдфывоашщцугкшщ фывлдоацугщшкг`,
      'image': `d9713be1660ce8699963b715202d69d6.jpg`,
    };
    const expectedArticle = {
      'id': 1
    };

    articleRepository.edit.mockReturnValue(expectedArticle);

    const actual = await underTest.edit(article);

    expect(actual).toEqual(expectedArticle);
  });
});

describe(`remove`, () => {
  test(`should return 'true' if existing article was successfully deleted`, async () => {
    articleRepository.remove.mockReturnValue(true);

    const actual = await underTest.remove(MOCK_ID);

    expect(actual).toBe(true);
  });
});

describe(`search`, () => {
  test(`if found substring should return article`, async () => {
    // const expectedArticle = {id: MOCK_ID, title: `some title`};
    const mocArticle = [
      {
        id: 1,
        title: `Тут название публикации. Самой первой публикации и самой лучшей.`,
        createdAt: `2021-06-16T05:41:31.939Z`
      }
    ];
    const expectedArticle = {
      "articlesList": [{
        "createdAt": `16.06.2021`,
        "id": 1,
        "title": `Тут название публикации. Самой первой публикации и самой лучшей.`
      }],
      "userInfoForSearch": {}
    };
    articleRepository.findByTitle.mockReturnValue(mocArticle);

    const actual = await underTest.search(`название`);

    expect(actual).toEqual(expectedArticle);
  });
});
