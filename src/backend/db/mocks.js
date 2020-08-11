'use strict';

const roles = [
  {role: `Автор`},
  {role: `Читатель`},
  {role: `Гость`},
];

const users = [
  {
    firstName: `Иванов`,
    lastName: `Иван`,
    email: `ivanov@mail.ru`,
    password: `1234`,
    roleId: 1
  },
  {
    firstName: `Сидоров`,
    lastName: `Виктор`,
    email: `sidorov@mail.ru`,
    password: `1234`,
    roleId: 2
  },
  {
    firstName: `Фролов`,
    lastName: `Егор`,
    email: `frolov@mail.ru`,
    password: `1234`,
    roleId: 3
  }
];

const categories = [
  {category: `Железо`},
  {category: `Дорога`},
  {category: `Публицистика`},
  {category: `Кино`},
  {category: `Деревья`},
]

const articles = [
  {
    title: `some title1`,
    announce: `some announce1`,
    description: `some description1`,
    userId: 1,
  },
  {
    title: `some title2`,
    announce: `some announce2`,
    description: `some description2`,
    userId: 2,
  },
  {
    title: `some title3`,
    announce: `some announce3`,
    description: `some description3`,
    userId: 3,
  },
];

const articlesToCategories = [
  {articleId: 1, categoryId: 1},
  {articleId: 2, categoryId: 2},
  {articleId: 2, categoryId: 3},
  {articleId: 3, categoryId: 4},
];

const images = [
  {articleId: 1, image: `image1`},
  {articleId: 2, image: `image2`},
  {articleId: 3, image: `image3`},
];

const comments = [
  {articleId: 1, userId: 1, comment: `some comment1`},
  {articleId: 2, userId: 2, comment: `some comment2`},
  {articleId: 3, userId: 3, comment: `some comment3`},
];

module.exports = {
  users,
  roles,
  categories,
  articles,
  articlesToCategories,
  images,
  comments,
};
