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
  });

  test(`when request non-existing page status code should be NOT_FOUND`, async () => {
    const res = await request(app).get(`/api/article`);

    expect(res.statusCode).toBe(NOT_FOUND);
  });
});

describe(`get article by id`, () => {
  test(`when get article by id status code should be OK`, async () => {
    const id = addMockArticle();
    const res = await request(app).get(`/api/articles/${id}`);

    expect(res.statusCode).toBe(OK);
    expect(res.body).toHaveProperty(`id`);
    expect(res.body).toHaveProperty(`title`);
    expect(res.body).toHaveProperty(`createDate`);
    expect(res.body).toHaveProperty(`announce`);
    expect(res.body).toHaveProperty(`fullText`);
    expect(res.body).toHaveProperty(`categories`);
    expect(res.body).toHaveProperty(`comments`);

    deleteMockArticle(id);
  });

  test(`when request non-existing article status code should be GONE`, async () => {
    const res = await request(app).get(`/api/articles/${MOCK_ID}`);

    expect(res.statusCode).toBe(GONE);
  });
});

describe(`post article`, () => {
  test(`when adding new article should return new id`, async () => {
    const tempArticle = await request(app).post(`/api/articles/`)
      .send(newArticle);

    const newArticleId = tempArticle.body.id;

    const res = await request(app).get(`/api/articles/${newArticleId}`);

    expect(res.body.title).toBe(newArticle.title);

    deleteMockArticle(newArticleId);
  });

  test(`when sending not all params status code should be BAD_REQUEST`, async () => {
    const res = await request(app).post(`/api/articles`)
      .send({title: `some title`});

    expect(res.statusCode).toBe(BAD_REQUEST);
  });
});

describe(`put article`, () => {
  test(`if article updated successfully status code should be CREATED`, async () => {
    const id = addMockArticle();
    const res = await request(app).put(`/api/articles/${id}`)
      .send(newArticle);

    expect(res.statusCode).toBe(CREATED);

    deleteMockArticle(id);
  });

  test(`when sending not all params status code should be BAD_REQUEST`, async () => {
    const id = addMockArticle();
    const res = await request(app).put(`/api/articles/${id}`)
      .send({title: `some title`});

    expect(res.statusCode).toBe(BAD_REQUEST);

    deleteMockArticle(id);
  });

  test(`when change non-existing article status code should be GONE`, async () => {
    const res = await request(app).put(`/api/articles/${MOCK_ID}`)
      .send(newArticle);

    expect(res.statusCode).toBe(GONE);
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
  });
});

describe(`get all comments`, () => {
  test(`for existing article status code should be OK and return all comments`, async () => {
    const id = addMockArticle();
    const res = await request(app).get(`/api/articles/${id}/comments`);

    expect(res.statusCode).toBe(OK);
    expect(res.body[0]).toHaveProperty(`id`);
    expect(res.body[0]).toHaveProperty(`text`);

    deleteMockArticle(id);
  });

  test(`for non-existing article status code should be GONE`, async () => {
    const res = await request(app).get(`/api/articles/${MOCK_ID}/comments`);

    expect(res.statusCode).toBe(GONE);
  });
});

describe(`delete comment`, () => {
  test(`for exists article and comment when deleting
  comment successfully status code should be NO_CONTENT`, async () => {
    const id = addMockArticle();
    const res = await request(app)
      .delete(`/api/articles/${id}/comments/${expectedComments[0].id}`);

    expect(res.statusCode).toBe(NO_CONTENT);

    deleteMockArticle(id);
  });

  test(`for exists article and non-exists comment status code should be GONE`, async () => {
    const id = addMockArticle();
    const res = await request(app)
      .delete(`/api/articles/${id}/comments/${MOCK_ID}`);

    expect(res.statusCode).toBe(GONE);

    deleteMockArticle(id);
  });

  test(`for non-exists article and exists comment status code should be GONE`, async () => {
    const res = await request(app)
      .delete(`/api/articles/${MOCK_ID}/comments/${MOCK_ID}`);

    expect(res.statusCode).toBe(GONE);
  });
});

describe(`add comment`, () => {
  test(`when existing article adding new comment should return new id`, async () => {
    const id = addMockArticle();
    const res = await request(app).post(`/api/articles/${id}/comments`)
      .send(newComment);

    expect(res.statusCode).toBe(CREATED);
    expect(res.body).toHaveProperty(`id`);

    deleteMockArticle(id);
  });

  test(`if send not all params status code should be BAD_REQUEST`, async () => {
    const id = addMockArticle();
    const res = await request(app).post(`/api/articles/${id}/comments`)
      .send({title: `some title`, another: `another title`});

    expect(res.statusCode).toBe(BAD_REQUEST);

    deleteMockArticle(id);
  });
});
