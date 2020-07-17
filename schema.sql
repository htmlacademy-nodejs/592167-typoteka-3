-- Создание схемы базы

-- Удаляет базу Typoteka, если она существует
drop database if exists typoteka;

-- Если нет пользователя user_typoteka, то добавляет его
DO
$do$
begin
   if not exists (
      select from pg_catalog.pg_roles  -- select list can be empty for this
      where  rolname = 'user_typoteka') then

      create role user_typoteka login password '@User123';
   end if;
end
$do$;

-- Создает базу typoteka
create database typoteka with owner user_typoteka;

\c typoteka user_typoteka;

-- Создает функцию trigger_set_timestamp()
create or replace function trigger_set_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Создает таблицу user_roles
create table user_roles (
    id bigserial primary key not null,
    role varchar(50) not null
);
alter table user_roles owner to user_typoteka;

-- Создает таблицу users
create table users (
    id bigserial primary key not null,
    first_name varchar(50) not null,
    last_name varchar(50) not null,
    email varchar(100) not null,
    password varchar(50) not null,
    role_id integer not null
);
alter table users owner to user_typoteka;
create unique index email_idx on users (email);

-- Создает таблицу articles
create table articles (
    id bigserial primary key not null,
    regdate timestamptz not null default now(),
    title varchar(100) not null,
    description varchar(1000) not null,
    user_id integer not null references users
);
alter table articles owner to user_typoteka;

-- Создает триггер set_timestamp
create trigger set_timestamp
before update on articles
for each row
execute procedure trigger_set_timestamp();

 --Создает таблицу images
 create table images (
     id bigserial primary key not null,
     article_id integer not null references articles,
     image text not null
 );
 alter table images owner to user_typoteka;

  --Создает таблицу comments
  create table comments (
     id bigserial primary key not null,
     article_id integer not null references articles,
     user_id integer not null references users,
     comment text not null
  );
 alter table comments owner to user_typoteka;

--Создает таблицу categories
create table categories (
    id bigserial primary key not null,
    category varchar(50) not null
);
alter table categories owner to user_typoteka;

 --Создает таблицу articles_to_categories
 create table articles_to_categories (
     article_id integer not null references articles,
     category_id integer not null references categories,
     primary key (article_id, category_id)
 );
 ALTER table articles_to_categories owner to user_typoteka;
