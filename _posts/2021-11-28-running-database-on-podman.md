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
First, I installed the MySQL client on my machine:

````
sudo yum install mysql
````

I then prepared a directory for MySQL databases and configured SELinux permissions:

````
mkdir /opt/homelab_projects/mysql_db_dir_noroot

[admin@workstation homelab_projects]$ sudo semanage fcontext -a -t container_file_t '/opt/homelab_projects/mysql_db_dir_noroot(/*)'
[admin@workstation homelab_projects]$ restorecon -v 'mysql_db_dir_noroot'
[admin@workstation homelab_projects]$ ll -Z 
total 56
.........
drwxrwxr-x.  2 admin admin unconfined_u:object_r:container_file_t:s0  4096 Nov 28 17:30 mysql_db_dir_noroot
...........
````

To run the MySQL container, I set environment variables, port mappings, and shared folders for the database:

````
[admin@workstation homelab_projects]$ podman run -d --name mysql-db -e MYSQL_USER=admin -e MYSQL_PASSWORD=mysql -e MYSQL_DATABASE=words -e MYSQL_ROOT_PASSWORD=mysql -p 33306:3306 -v /opt/homelab_projects/mysql_db_dir_noroot:/var/lib/mysql/data rhscl/mysql-57-rhel7
0fb7b0ad8de7f00acccf7ddd3ccd296836da24ef575727e99bc63a2c0cdbe11e
````

After running the container, I verified the database creation:

````
[admin@workstation homelab_projects]$ mysql -h 127.0.0.1 -uadmin -pmysql -P 33306
````

Then, I deployed the database dump:

````
[admin@workstation homelab_projects]$ mysql -h 127.0.0.1 -uadmin -pmysql -P 33306 words < db.sql 
````

## Deploying PostgreSQL on Podman
The process for PostgreSQL was similar to MySQL. I started by creating a local folder for the PostgreSQL database and setting the necessary SELinux context:

````bash
[admin@workstation opt]$ mkdir -pv /opt/podman/postgresql13

[admin@workstation opt]$ sudo semanage fcontext -a -t container_file_t "/opt/podman/postgresql13(/.*)?"

[admin@workstation opt]$ sudo restorecon -R -v podman/postgresql13
Relabeled /opt/podman/postgresql13 from unconfined_u:object_r:usr_t:s0 to unconfined_u:object_r:container_file_t:s0
````

Next, I planned the local port mapping. I chose to use port ``54321`` instead of the default ``5432``:

Check what is the name of SELinux port type and if the port already defined:
````bash
[seymur@workstation ~]$ sudo semanage port -l | grep postgres
postgresql_port_t              tcp      5432, 9898
[seymur@workstation ~]$ 
````

Next, was deployed Posgresql with the required parameters: 
````bash
[seymur@workstation ~]$ podman run -d --name postgresql_database -e POSTGRESQL_USER=user -e POSTGRESQL_PASSWORD=pass -e POSTGRESQL_DATABASE=db -p 54321:5432 -v /opt/podman/postgresql13:/var/lib/pgsql/data registry.fedoraproject.org/f33/postgresql
732837a2fbe88033a26760c25c06cfc80d823578a57e227083820604c6a4b186
[seymur@workstation ~]$ 
````

Here ``POSTGRESQL_USER=user`` - is a database user, ``POSTGRESQL_PASSWORD=pass`` - password for user, ``POSTGRESQL_DATABASE=db`` - name of database. Parameter ``-v /opt/podman/postgresql13:/var/lib/pgsql/data`` mounts local folder ``/opt/podman/postgresql13`` to the ``/var/lib/pgsql/data``. 

Finally, I checked that the application was running:

````bash
[seymur@workstation ~]$ podman ps -a
CONTAINER ID    IMAGE                                          COMMAND               CREATED       STATUS                   PORTS                    NAMES
732837a2fbe8    registry.fedoraproject.org/f33/postgresql      run-postgresql        2 hours ago   Up 2 hours ago           0.0.0.0:54321->5432/tcp  postgresql_database
````

{% endraw %}

