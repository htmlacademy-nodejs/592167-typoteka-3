'use strict';

const request = require(`supertest`);
const app = require(`../app`);
const {sequelize} = require(`../db/db-connect`);

const articleRepository = require(`../repositories/article`);
const articleService = require(`../services/article`);
const MOCK_ARTICLE = {
  'date': `2021-06-22`,
  'title': `заголовок фыдваодлф ыошщцугк шщфылвдао шцугкшщ глыдфвоа длцушщкголдфвыао`,
  'photo': `5b15bedeeaa9b.jpg`,
  'checkbox-category': `2`,
  'announcement': `анонс публикации даофывлдоа гкшщцугк фывдлаофывгцушщг фыводадошщцугк лдфывоалдшщцугкфыволдалдывфо`,
  'full-text': `полный текст публикации фывдлао лдфгуцшщкг фывола лоцушщкгцйу олдфывоашщцугкшщ фывлдоацугщшкг`,
  'image': ``,
};


const addMockArticle = async () => await articleService.create(Object.assign({}, MOCK_ARTICLE));
const deleteMockArticle = async (id) => await articleRepository.remove(id);

afterAll(() => {
  sequelize.close();
});

describe(`search`, () => {
  test(`if title contains substring search should return announcements list`, async () => {
    const mockArticle = await addMockArticle();
    const id = mockArticle.dataValues.id;

    const res = await request(app).get(encodeURI(`/api/search?query=заголовок`));
    const expectArray = res.body.articlesList.map((el) => el.title);
    expect(expectArray).toContain(MOCK_ARTICLE.title);

    await deleteMockArticle(id);
  });

  test(`if title not contains substring search should return empty list`, async () => {
    const res = await request(app).get(`/api/search?query=111111`);
    console.log(res.body);

    expect(res.body.articlesList.length === 0).toBeTruthy();
  });
});
