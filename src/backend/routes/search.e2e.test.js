'use strict';

const request = require(`supertest`);
const app = require(`../app`);

const articleRepository = require(`../repositories/article`);
const MOCK_ARTICLE = {
  title: `Мой заголовок`,
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

const addMockArticle = () => articleRepository.save(Object.assign({}, MOCK_ARTICLE));
const deleteMockArticle = (id) => articleRepository.remove(id);

describe(`search`, () => {
  test(`if title contains substring search should return announcements list`, async () => {
    const id = addMockArticle();

    const expectedArticles = [];
    const article = Object.assign({}, MOCK_ARTICLE);
    article.id = id;
    expectedArticles.push(article);

    const res = await request(app).get(encodeURI(`/api/search?query=Мой заголовок`));
    expect(res.body).toEqual(expectedArticles);

    deleteMockArticle(id);
  });

  test(`if title not contains substring search should return empty list`, async () => {
    const res = await request(app).get(`/api/search?query=111111`);

    expect(res.body.length === 0).toBeTruthy();
  });
});
