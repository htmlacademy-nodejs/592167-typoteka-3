'use strict';

const request = require(`supertest`);
const app = require(`../app`);

const {
  OK,
  CREATED,
  NO_CONTENT,
  BAD_REQUEST,
  NOT_FOUND,
  GONE,
} = require(`../../constants`).HttpCode;
const MOCK_ARTICLE = {
  title: `Учим HTML и CSS`,
  createDate: `2/21/2020, 11:16:23 AM`,
  announce: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Это один из лучших рок-музыкантов.`,
  fullText: `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Золотое сечение — соотношение двух величин, гармоническая пропорция. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Задача организации, в особенности же новая модель организационной деятельности напрямую зависит от нас. `,
  categories: [
    `Наука`
  ],
  comments: [
    {
      id: `8Azrsc`,
      text: `Плюсую, но слишком много буквы!  Мне кажется или я уже читал это где-то? Совсем немного... Планируете записать видосик на эту тему? Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Согласен с автором!`
    },
    {
      id: `3Q7jiH`,
      text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы!  Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
    },
    {
      id: `KNwa1y`,
      text: `Хочу такую же футболку :-) Мне кажется или я уже читал это где-то? Это где ж такие красоты?`
    }
  ]
};
const newArticle = Object.assign({}, MOCK_ARTICLE);
const newComment = {text: `some text`};
const expectedComments = MOCK_ARTICLE.comments;
const articleRepository = require(`../repositories/article`);
const MOCK_ID = 123456;

let tempId;

beforeEach(() => {
  tempId = addMockArticle();
});

afterEach(() => {
  deleteMockArticle(tempId);
});

const addMockArticle = () => articleRepository.save(Object.assign({}, MOCK_ARTICLE));
const deleteMockArticle = (id) => articleRepository.remove(id);


describe(`get all articles`, () => {
  test(`when get all article status code should be 0K`, async () => {
    const res = await request(app).get(`/api/articles`);

    expect(res.statusCode).toBe(OK);
    expect(res.body[0]).toHaveProperty(`id`);
    expect(res.body[0]).toHaveProperty(`title`);
    expect(res.body[0]).toHaveProperty(`createDate`);
    expect(res.body[0]).toHaveProperty(`announce`);
    expect(res.body[0]).toHaveProperty(`fullText`);
    expect(res.body[0]).toHaveProperty(`categories`);
    expect(res.body[0]).toHaveProperty(`comments`);
  });

  test(`when request non-existing page status code should be NOT_FOUND`, async () => {
    const res = await request(app).get(`/api/no-articles`);

    expect(res.statusCode).toBe(NOT_FOUND);
  });
});

describe(`get article by id`, () => {
  test(`when get article by id status code should be OK and response body should be expected body`, async () => {
    const res = await request(app).get(`/api/articles/${tempId}`);
    expect(res.statusCode).toBe(OK);

    const expectedBody = Object.assign({}, MOCK_ARTICLE);
    expectedBody.id = tempId;
    expect(res.body).toEqual(expectedBody);
  });

  test(`when request non-existing article status code should be GONE`, async () => {
    const res = await request(app).get(`/api/articles/${MOCK_ID}`);
    expect(res.statusCode).toBe(GONE);
  });
});

describe(`post article`, () => {
  test(`when adding new article should return new id`, async () => {
    const tempArticle = await request(app).post(`/api/articles/`).send(newArticle);
    const expectedArticle = Object.assign({}, newArticle);
    expectedArticle.id = tempArticle.body.id;

    const res = await request(app).get(`/api/articles/${expectedArticle.id}`);

    expect(res.body).toEqual(expectedArticle);

    deleteMockArticle(expectedArticle.id);
  });

  test(`when sending not all params status code should be BAD_REQUEST`, async () => {
    const res = await request(app).post(`/api/articles`)
      .send({title: `some title`});
    expect(res.statusCode).toBe(BAD_REQUEST);

    const expectedResponse = {code: 1, message: `Not all fields for a new article have been submitted`};
    expect(res.body).toEqual(expectedResponse);
  });
});

describe(`put article`, () => {
  test(`if article updated successfully status code should be CREATED`, async () => {
    const resAfterPut = await request(app).put(`/api/articles/${tempId}`).send(newArticle);
    expect(resAfterPut.statusCode).toBe(CREATED);

    const resAfterGet = await request(app).get(`/api/articles/${tempId}`);
    const expectedArticle = Object.assign({}, MOCK_ARTICLE);
    expectedArticle.id = tempId;
    expect(resAfterGet.body).toEqual(expectedArticle);
  });

  test(`when sending not all params status code should be BAD_REQUEST`, async () => {
    const res = await request(app).put(`/api/articles/${tempId}`).send({title: `some title`});
    expect(res.statusCode).toBe(BAD_REQUEST);

    const expectedResponse = {code: 1, message: `Not all fields for a new article have been submitted`};
    expect(res.body).toEqual(expectedResponse);
  });

  test(`when change non-existing article status code should be GONE`, async () => {
    const res = await request(app).put(`/api/articles/${MOCK_ID}`).send(newArticle);
    expect(res.statusCode).toBe(GONE);

    const expectedResponse = {code: GONE, message: `Article with id ${MOCK_ID} isn't found`};
    expect(res.body).toEqual(expectedResponse);
  });
});

describe(`delete article`, () => {
  test(`when deleted article status code should be NO_CONTENT`, async () => {
    const id = addMockArticle();
    const res = await request(app).delete(`/api/articles/${id}`);

    expect(res.statusCode).toBe(NO_CONTENT);
  });

  test(`when delete non-existing article status code should be GONE`, async () => {
    const res = await request(app).delete(`/api/articles/${MOCK_ID}`);
    expect(res.statusCode).toBe(GONE);

    const expectedResponse = {code: GONE, message: `Article with id ${MOCK_ID} isn't found`};
    expect(res.body).toEqual(expectedResponse);
  });
});

describe(`get all comments`, () => {
  test(`for existing article status code should be OK and return all comments`, async () => {
    const res = await request(app).get(`/api/articles/${tempId}/comments`);

    expect(res.body).toEqual(expectedComments);
  });

  test(`for non-existing article status code should be GONE`, async () => {
    const res = await request(app).get(`/api/articles/${MOCK_ID}/comments`);
    expect(res.statusCode).toBe(GONE);

    const expectedResponse = {code: GONE, message: `Article with id ${MOCK_ID} isn't found`};
    expect(res.body).toEqual(expectedResponse);
  });
});

describe(`delete comment`, () => {
  test(`for exists article and comment when deleting
  comment successfully status code should be NO_CONTENT`, async () => {
    const res = await request(app).delete(`/api/articles/${tempId}/comments/${expectedComments[0].id}`);

    expect(res.statusCode).toBe(NO_CONTENT);
  });

  test(`for exists article and non-exists comment status code should be GONE`, async () => {
    const res = await request(app).delete(`/api/articles/${tempId}/comments/${MOCK_ID}`);
    expect(res.statusCode).toBe(GONE);

    const expectedResponse = {code: GONE, message: `Comment with id ${MOCK_ID} isn't found for article with id ${tempId}`};
    expect(res.body).toEqual(expectedResponse);
  });

  test(`for non-exists article and exists comment status code should be GONE`, async () => {
    const res = await request(app).delete(`/api/articles/${MOCK_ID}/comments/${MOCK_ID}`);
    expect(res.statusCode).toBe(GONE);

    const expectedResponse = {code: GONE, message: `Comment with id ${MOCK_ID} isn't found for article with id ${MOCK_ID}`};
    expect(res.body).toEqual(expectedResponse);
  });
});

describe(`add comment`, () => {
  test(`when existing article adding new comment should return new id`, async () => {
    const res = await request(app).post(`/api/articles/${tempId}/comments`).send(newComment);

    expect(res.statusCode).toBe(CREATED);
    expect(res.body).toHaveProperty(`id`);
  });

  test(`if send not all params status code should be BAD_REQUEST`, async () => {
    const res = await request(app).post(`/api/articles/${tempId}/comments`)
      .send({title: `some title`, another: `another title`});
    expect(res.statusCode).toBe(BAD_REQUEST);

    const expectedResponse = {code: 2, message: `Not all fields for a new comment have been submitted`};
    expect(res.body).toEqual(expectedResponse);
  });
});
