-- Добавляет типы объявлений
insert into user_roles values (default, 'Автор'),
                         (default, 'Читатель'),
                         (default, 'Гость');

-- Добавляет пользователей
insert into users values (default, 'Иванов', 'Иван', 'my@mail.ru', '123455', 1),
                         (default, 'Петров', 'Петр', 'petrov@gmail.com', '34523', 2),
                         (default, 'Сидоров', 'Илья', 'sidorov.iliya@yahoo.com', 'I8e#8d', 3);

-- Добавляет категории
insert into categories values (default, 'Железо'),
                              (default, 'Дорога'),
                              (default, 'Публицистика'),
                              (default, 'Кино'),
                              (default, 'Деревья');

-- Добавляет объявления
insert into articles values (
      default,
      '4/24/2020, 1:28:54 PM',
      'Как начать программировать',
      'Первая большая ёлка была установлена только в 1938 году.',
      1);
insert into articles values (
      default,
      '5/16/2020, 1:28:54 PM',
      'Рок — это протест',
      'Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.',
      2);
insert into articles values (
      default,
      '6/6/2020, 1:28:54 PM',
      '5 самых сексуальных ароматов, которые видно из окна машины',
      'Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.',
      1);
insert into articles values (
      default,
      '3/24/2020, 1:28:54 PM',
      'Что такое золотое сечение',
      'Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.',
      3);
insert into articles values (
      default,
      '4/24/2020, 1:28:54 PM',
      'Как достигнуть успеха не вставая с кресла',
      'Вы можете достичь всего. Стоит только немного постараться и запастись книгами.',
      2);

-- Добавляет связи между объявлениями и категориями
insert into articles_to_categories values (1, 1),
(2, 1),
(3, 1),
(3, 2),
(3, 3),
(4, 1),
(4, 2),
(5, 1),
(5, 2),
(5, 3),
(5, 4);

-- Добавляет картинки
insert into images values (default, 1, 'image1'),
(default, 2, 'image2'),
(default, 3, 'image3'),
(default, 4, 'image4'),
(default, 5, 'image5');

-- Добавляет комментарии
insert into comments values (default, 1, 2, 'comment text1'),
(default, 2, 2, 'comment text2'),
(default, 3, 2, 'comment text3'),
(default, 4, 2, 'comment text4'),
(default, 5, 2, 'comment text5');
