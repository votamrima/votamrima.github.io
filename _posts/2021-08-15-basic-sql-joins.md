---
layout: single
title: "Basic SQL Joins" 
subtitle: ""
date: 2021-08-15 18:40:00 +0100
background: '/image/01.jpg'
tags: ['database']
---

{% raw %}

## Left Join and right
Let's say we have two tables - ``posts`` and ``users``. Struncture of the both tables is following:
1. ``post`` table has such columns as: id, title, content, user_id and date. Column user_id is a foreign key and related with the id column of ``users`` table
2. ``users`` table has following columns: id, username, password, date
   
Let's grab usernames from ``posts`` table:
````sql
select  users.username, posts.title, posts.content from posts left join users on posts.user_id = users.id
````

``left join`` does mean a direction of the table. Here, ``posts`` table is on the left of the statement and ``users`` table is on the right side accordingly. By left join, query selects data from the left table, compares values between two columns. And if the values are equal, the left join creates a new row that contains columns of the both tables. Left join can show when something exists on left table, but does not exists on the right table, too.

See how many posts have been created by each user:
````sql
select users.username, count(posts.id)  from posts left join users on posts.owner_id = users.id group by users.id
````

But logically, result of this query is not accurate. In output it does not show users that do not have any post. Therefore, for solving this issue we need to use ``right join``.
````sql
select users.username, count(posts.id)  from posts right join users on posts.owner_id = users.id group by users.id
````

By default, by ``left join`` and ``right join`` is being used ``outer join``.  If you need to run inner join, try either ``left inner join`` or ``right inner join``



## References:
- [Postgres Tutorial. Joins](https://www.postgresqltutorial.com/postgresql-joins/)

{% endraw %}