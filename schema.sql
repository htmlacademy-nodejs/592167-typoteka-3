-- Создание схемы базы

-- Удаляет базу Typoteka, если она существует
DROP DATABASE IF EXISTS Typoteka;

-- Если нет пользователя user_buy_and_sell, то добавляет его
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles  -- SELECT list can be empty for this
      WHERE  rolname = 'user_typoteka') THEN

      CREATE ROLE user_typoteka LOGIN PASSWORD '@User123';
   END IF;
END
$do$;

-- Создает базу Typoteka
CREATE DATABASE Typoteka WITH OWNER user_typoteka;

\c typoteka;

-- --Создает таблицу types
-- CREATE TABLE types (
--     id bigserial PRIMARY KEY NOT NULL,
--     type_name VARCHAR(50) NOT NULL
-- );
-- ALTER TABLE types OWNER TO user_buy_and_sell;

--Создает таблицу categories
CREATE TABLE categories (
    id bigserial PRIMARY KEY NOT NULL,
    category_name VARCHAR(50) NOT NULL
);
ALTER TABLE categories OWNER TO user_typoteka;

-- Создает таблицу users
CREATE TABLE users (
    id bigserial PRIMARY KEY NOT NULL,
    sname VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL,
    user_role INTEGER NOT NULL
);
ALTER TABLE users OWNER TO user_typoteka;

-- Создает таблицу user_roles
CREATE TABLE user_roles (
    id bigserial PRIMARY KEY NOT NULL,
    role_name VARCHAR(50) NOT NULL
);
ALTER TABLE user_roles OWNER TO user_typoteka;

-- Создает таблицу articles
CREATE TABLE articles (
    id bigserial PRIMARY KEY NOT NULL,
    regdate Date NOT NULL,
    title varchar(100) NOT NULL,
    description varchar(1000) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users
);
ALTER TABLE articles OWNER TO user_typoteka;

-- --Создает таблицу images
-- CREATE TABLE images (
--     id bigserial PRIMARY KEY NOT NULL,
--     announcement_id INTEGER NOT NULL REFERENCES announcements,
--     image_type VARCHAR(50) NOT NULL,
--     data text NOT NULL
-- );
-- ALTER TABLE images OWNER TO user_buy_and_sell;

--  --Создает таблицу comments
--  CREATE TABLE comments (
--     id bigserial PRIMARY KEY NOT NULL,
--     announcement_id INTEGER NOT NULL REFERENCES announcements,
--     user_id INTEGER NOT NULL REFERENCES users,
--     comment VARCHAR(255) NOT NULL
--  );
-- ALTER TABLE comments OWNER TO user_buy_and_sell;

-- --Создает таблицу announcement-categories
-- CREATE TABLE announcement_categories (
--     announcement_id INTEGER NOT NULL REFERENCES announcements,
--     category_id INTEGER NOT NULL REFERENCES categories,
--     PRIMARY KEY (announcement_id, category_id)
-- );
-- ALTER TABLE announcement_categories OWNER TO user_buy_and_sell;


-- -- Заполнение базы

-- -- Вставка типов заявления
-- INSERT INTO types VALUES(default, 'Покупка'), (default, 'Продажа');

-- -- Вставка категорий
-- INSERT INTO categories VALUES(default, 'Мебель'), (default, 'Животные'), (default, 'Посуда'), (default, 'Моделирование'), (default, 'Искусство');

-- -- Вставка пользователей
-- INSERT INTO users VALUES(default, 'Иванов', 'Иван', 'ivanov@mail.com', '123123'), (default, 'Фролов', 'Егор', 'frolov@gmail.com', '123456'), (default, 'Петров', 'Михаил', 'user@mail.de', '564321');

-- -- Вставка объявлений
-- INSERT INTO announcements VALUES(
--     default,
--     '40 книг на английском, которые есть у всех',
--     'Повседневная практика показывает, что консультация с профессионалами из IT играет важную роль в формировании позиций. Значимость этих проблем настолько очевидна, что консультация с профессионалами из IT представляет собой интересный эксперимент.',
--     46060,
--     1,
--     1
-- );
-- INSERT INTO announcements VALUES(
--     default,
--     'Десять лучших продуктов для завтрака, о которых не стоит вспоминать',
--     'Не следует, однако, забывать о том, что дальнейшее развитие различных форм деятельности представляет собой интересный парадокс. Продаю с болью в сердце.',
--     35809,
--     2,
--     2
-- );

-- -- Вставка связки объявление-категория
-- INSERT INTO announcement_categories VALUES(1, 2), (2, 4), (1, 3), (1, 1);

-- -- Вставка комментариев
-- INSERT INTO comments VALUES(default, 1, 3, 'some comment'), (default, 1, 1, 'another comment'), (default, 2, 1, 'comment'), (default, 2, 3, 'just comment');

-- -- Вставка изображений
-- INSERT INTO images VALUES(default, 2, 'data:image/jpeg;base64', 'base64'), (default, 1, 'data:image/jpeg;base64', 'base64');
