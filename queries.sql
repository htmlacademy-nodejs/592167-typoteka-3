-- Получить список всех категорий (идентификатор, наименование категории)
select * from categories;

-- Получить список категорий для которых создана минимум одна публикация
-- (идентификатор, наименование категории)
select distinct c.id, c.category
from articles a
    inner join articles_to_categories atc
        on a.id = atc.article_id
    inner join categories c
        on atc.category_id = c.id
order by c.id;

-- Получить список категорий с количеством публикаций
-- (идентификатор, наименование категории, количество публикаций в категории);
select c.id, c.category, count(a.id)
from articles a
    inner join articles_to_categories atc
        on a.id = atc.article_id
    inner join categories c
        on atc.category_id = c.id
group by c.id, c.category
order by c.id;

-- Получить список публикаций
-- (идентификатор публикации, заголовок публикации, анонс публикации,
-- дата публикации, имя и фамилия автора, контактный email,
-- количество комментариев, наименование категорий).
-- Сначала свежие публикации;
select a.id, a.title, a.description, a.regdate,
       concat(u.last_name, ' ', u.first_name) as user, u.email,
       (select count(*) from comments cm where cm.article_id=a.id),
       string_agg(c.category, ', ') as categories
from articles a
    inner join users u
        on a.user_id = u.id
    inner join articles_to_categories atc
        on a.id = atc.article_id
    inner join categories c
        on atc.category_id = c.id
group by a.id, a.title, a.description, a.regdate, u.last_name,
         u.first_name, u.email
order by a.regdate desc;

-- Получить полную информацию определённой публикации
-- (идентификатор публикации, заголовок публикации, анонс,
-- полный текст публикации, дата публикации, путь к изображению,
-- имя и фамилия автора, контактный email, количество комментариев,
-- наименование категорий);
select a.id, a.title, a.announce, a.description, a.regdate, i.image,
       concat(u.last_name, ' ', u.first_name) as user, u.email,
       (select count(*) from comments cm where cm.article_id=a.id),
       string_agg(c.category, ', ') as categories
from articles a
    inner join users u
        on a.user_id = u.id and a.id=7
    inner join articles_to_categories atc
        on a.id = atc.article_id
    inner join categories c
        on atc.category_id = c.id
    inner join images i
        on a.id = i.article_id
group by a.id, a.title, a.description, a.regdate, u.last_name,
         u.first_name, u.email, i.image;

-- Получить список из 5 свежих комментариев
-- (идентификатор комментария, идентификатор публикации,
-- имя и фамилия автора, текст комментария);
select c.id, c.article_id,
       concat(u.last_name, ' ', u.first_name),
       c.comment
from comments c
    inner join users u
        on c.user_id = u.id
order by c.regdate
limit 5;

-- Получить список комментариев для определённой публикации
-- (идентификатор комментария, идентификатор публикации,
-- имя и фамилия автора, текст комментария).
-- Сначала новые комментарии;
select c.id, c.article_id,
       concat(u.last_name, ' ', u.first_name),
       c.comment
from comments c
    inner join users u
        on c.user_id = u.id and c.article_id=4;

-- Обновить заголовок определённой публикации на «Как я встретил Новый год»;
update articles
set title='Как я встретил Новый год'
where id=2;
