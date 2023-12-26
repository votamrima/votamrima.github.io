---
layout: single
title: "Basic SQL Joins" 
subtitle: ""
date: 2021-08-15 18:40:00 +0100
background: '/image/01.jpg'
tags: ['database']
---

{% raw %}

I recently realized that it's been so long since I last used SQL that I had forgotten how to create SQL joins. To refresh my memory and help others, here's a quick and short introduction to SQL joins, focusing on the Left Join and Right Join.

## Left Join and Right Join
Assume we have two tables - ``posts`` and ``users`` and users. The structure of both tables is as follows:

1. The ``posts`` table includes columns: id, title, content, user_id, and date. The user_id column is a foreign key that relates to the id column of the users table.
2. The ``users`` table has columns: id, username, password, and date.

### Fetching Usernames from the Posts Table
To retrieve usernames from the posts table, you can use a Left Join:

````sql
select  users.username, posts.title, posts.content from posts left join users on posts.user_id = users.id
````

A ``LEFT JOIN`` implies the direction of the join. Here, the posts table is on the left of the statement, and the ``users`` table is on the right. The ``Left Join`` selects data from the left table, compares values between two columns, and if the values match, it creates a new row combining columns from both tables. A ``Left Join`` can also show records that exist in the left table but not in the right table.


### Counting User Posts
To see how many posts each user has created:

````sql
select users.username, count(posts.id)  from posts left join users on posts.owner_id = users.id group by users.id
````

However, this query might not be entirely accurate. It doesn't show users who haven't created any posts. To address this, we can use a ``RIGHT JOIN``:

````sql
select users.username, count(posts.id)  from posts right join users on posts.owner_id = users.id group by users.id
````

By default, both ``LEFT JOIN`` and ``RIGHT JOIN`` are types of ``OUTER JOIN``. If you need an inner join, you can specify LEFT INNER JOIN or RIGHT INNER JOIN.

Understanding SQL joins is crucial for database querying and data manipulation. The Left Join and Right Join are fundamental concepts that help in retrieving and analyzing data from multiple related tables.

## References:
- [Postgres Tutorial. Joins](https://www.postgresqltutorial.com/postgresql-joins/)

{% endraw %}
