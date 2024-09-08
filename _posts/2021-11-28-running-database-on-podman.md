---
layout: single
title: "Deploy MySQL and PostgreSQL Database Systems on Podman as a Regular User" 
subtitle: ""
date: 2021-11-28 16:30:00 +0100
background: '/image/01.jpg'
tags: ['podman', 'database']
---

{% raw %}

In this post, I'll describe how I deployed MySQL and PostgreSQL databases on Podman without root privileges.

## Deploying MySQL on Podman

To deploy MySQL using Podman, I first installed the MySQL client:

```bash
sudo yum install mysql
```

I created a directory for the MySQL database and set SELinux permissions:

```bash
mkdir /opt/homelab_projects/mysql_db_dir_noroot
sudo semanage fcontext -a -t container_file_t '/opt/homelab_projects/mysql_db_dir_noroot(/*)'
restorecon -v 'mysql_db_dir_noroot'
```

I ran the MySQL container with environment variables and volume mapping:

```bash
podman run -d --name mysql-db -e MYSQL_USER=admin -e MYSQL_PASSWORD=mysql -e MYSQL_DATABASE=words -e MYSQL_ROOT_PASSWORD=mysql -p 33306:3306 -v /opt/homelab_projects/mysql_db_dir_noroot:/var/lib/mysql/data rhscl/mysql-57-rhel7
```

Finally, I connected to the MySQL database and imported a dump file:

```bash
mysql -h 127.0.0.1 -uadmin -pmysql -P 33306
mysql -h 127.0.0.1 -uadmin -pmysql -P 33306 words < db.sql
```

## Deploying PostgreSQL on Podman

To deploy PostgreSQL using Podman, I created a directory for the PostgreSQL database and configured SELinux permissions:

```bash
mkdir -pv /opt/podman/postgresql13
sudo semanage fcontext -a -t container_file_t "/opt/podman/postgresql13(/.*)?"
sudo restorecon -R -v podman/postgresql13
```

Next, I verified the SELinux port type for PostgreSQL and deployed the container with the required parameters:

```bash
podman run -d --name postgresql_database -e POSTGRESQL_USER=user -e POSTGRESQL_PASSWORD=pass -e POSTGRESQL_DATABASE=db -p 54321:5432 -v /opt/podman/postgresql13:/var/lib/pgsql/data registry.fedoraproject.org/f33/postgresql
```

Finally, I confirmed the container was running:

```bash
podman ps -a
```

{% endraw %}

