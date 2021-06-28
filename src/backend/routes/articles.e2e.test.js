'use strict';

const request = require(`supertest`);
const app = require(`../app`);
const {StatusCodes} = require(`http-status-codes`);
const {sequelize} = require(`../db/db-connect`);
const {generateDate} = require(`../../utils`);

const MOCK_ARTICLE = {
  'date': `2021-06-22`,
  'title': `заголовок фыдваодлф ыошщцугк шщфылвдао шцугкшщ глыдфвоа длцушщкголдфвыао`,
  'photo': ``,
  'checkbox-category': `2`,
  'announcement': `анонс публикации даофывлдоа гкшщцугк фывдлаофывгцушщг фыводадошщцугк лдфывоалдшщцугкфыволдалдывфо`,
  'full-text': `полный текст публикации фывдлао лдфгуцшщкг фывола лоцушщкгцйу олдфывоашщцугкшщ фывлдоацугщшкг`,
  'image': ``,
};
const ARTICLE_FROM_BASE = {
  title: `заголовок фыдваодлф ыошщцугк шщфылвдао шцугкшщ глыдфвоа длцушщкголдфвыао`,
  image: ``,
  announce: `анонс публикации даофывлдоа гкшщцугк фывдлаофывгцушщг фыводадошщцугк лдфывоалдшщцугкфыволдалдывфо`,
  description: `полный текст публикации фывдлао лдфгуцшщкг фывола лоцушщкгцйу олдфывоашщцугкшщ фывлдоацугщшкг`,
  authorization: true,
  userInfoForArticleById: {}
};
const MOCK_CHANGE_ARTICLE = {
  'date': `2021-06-25`,
  'title': `заголовок фыдваодлф ыошщцугк шщфылвдао шцугкшщ глыдфвоа длцушщкголдфвыао`,
  'photo': ``,
  'checkbox-category': `2`,
  'announcement': `анонс публикации даофывлдоа гкшщцугк фывдлаофывгцушщг фыводадошщцугк изменили окончание предложения.`,
  'full-text': `полный текст публикации фывдлао лдфгуцшщкг фывола лоцушщкгцйу олдфывоашщцугкшщ фывлдоацугщшкг`,
};
const CHANGED_ARTICLE_FROM_BASE = {
  title: `заголовок фыдваодлф ыошщцугк шщфылвдао шцугкшщ глыдфвоа длцушщкголдфвыао`,
  image: ``,
  announce: `анонс публикации даофывлдоа гкшщцугк фывдлаофывгцушщг фыводадошщцугк изменили окончание предложения.`,
  description: `полный текст публикации фывдлао лдфгуцшщкг фывола лоцушщкгцйу олдфывоашщцугкшщ фывлдоацугщшкг`,
  authorization: true,
  userInfoForArticleById: {}

};

const newComment = {
  comment: `А это другой мой комментарий, но не менее важный.`,
  csrf: `3576ae60fee91ab01f04c003543c8fa2`,
  username: `admin@mail.ru`
};
const articleRepository = require(`../repositories/article`);
const articleService = require(`../services/article`);
const MOCK_ID = 123456;

let tempId;

beforeEach(async () => {
  const res = await addMockArticle();
  tempId = res.dataValues.id;
});

afterEach(async () => {
  await deleteMockArticle(tempId);
});

afterAll(() => {
  sequelize.close();
});

const addMockArticle = async () => await articleService.create(Object.assign({}, MOCK_ARTICLE));
const deleteMockArticle = async (id) => await articleRepository.remove(id);


describe(`get all articles`, () => {
  test(`when get all article status code should be 0K`, async () => {
    const res = await request(app).get(`/api/articles`);

    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty(`categories`);
    expect(res.body).toHaveProperty(`mostDiscussed`);
    expect(res.body).toHaveProperty(`previews`);
    expect(res.body).toHaveProperty(`lastComments`);
    expect(res.body).toHaveProperty(`pagination`);
  });

  test(`when request non-existing page status code should be NOT_FOUND`, async () => {
    const res = await request(app).get(`/api/no-articles`);

    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });
});

describe(`get article by id`, () => {
  test(`when get article by id status code should be OK and response body should be expected body`, async () => {
    const res = await request(app).get(`/api/articles/${tempId}`);
    expect(res.statusCode).toBe(StatusCodes.OK);

    const expectedBody = Object.assign({}, ARTICLE_FROM_BASE);
    expectedBody.articleId = tempId;
    expectedBody.createdAt = generateDate();
    expect(res.body).toEqual(expectedBody);
  });

  test(`when request non-existing article status code should be GONE`, async () => {
    const res = await request(app).get(`/api/articles/${MOCK_ID}`);
    expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});

describe(`post article`, () => {
  test(`when sending not all params status code should be BAD_REQUEST`, async () => {
    const res = await request(app).post(`/api/articles/add`)
      .send({title: `some title`});
    expect(res.statusCode).toBe(StatusCodes.MOVED_TEMPORARILY);
  });
});

describe(`edit article`, () => {
  test(`if article updated successfully status code should be CREATED`, async () => {
    const resAfterPut = await request(app).post(`/api/articles/edit/${tempId}`).send(MOCK_CHANGE_ARTICLE);
    expect(resAfterPut.statusCode).toBe(StatusCodes.MOVED_TEMPORARILY);

    const resAfterGet = await request(app).get(`/api/articles/${tempId}`);
    const expectedArticle = Object.assign({}, CHANGED_ARTICLE_FROM_BASE);
    expectedArticle.articleId = tempId;
    expectedArticle.createdAt = generateDate();
    expect(resAfterGet.body).toEqual(expectedArticle);
  });
});

describe(`delete article`, () => {
  test(`when deleted article status code should be NO_CONTENT`, async () => {
    const resId = await addMockArticle();
    const res = await request(app).get(`/api/articles/delete/${resId.dataValues.id}`);

    expect(res.statusCode).toBe(StatusCodes.OK);
  });
});

describe(`add comment`, () => {
  test(`when existing article adding new comment should return new id`, async () => {
    const res = await request(app).post(`/api/articles/${tempId}/comments`).send(newComment);

    expect(res.statusCode).toBe(StatusCodes.OK);
  });
});
