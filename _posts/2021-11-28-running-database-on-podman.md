---
layout: single
title: "Deploy MySQL and PostgreSQL database systems on Podman with regular (non-root) user" 
subtitle: ""
date: 2021-11-28 16:30:00 +0100
background: '/image/01.jpg'
tags: ['podman', 'database']
---

{% raw %}

## MySQL
Install mysql client:

````
sudo yum install mysql
````

Create a folder on the local host for storing databases and configure SELinux option:

````
mkdir /opt/homelab_projects/mysql_db_dir_noroot

[admin@workstation homelab_projects]$ sudo semanage fcontext -a -t container_file_t '/opt/homelab_projects/mysql_db_dir_noroot(/*)'
[admin@workstation homelab_projects]$ restorecon -v 'mysql_db_dir_noroot'
[admin@workstation homelab_projects]$ ll -Z 
total 56
.........
drwxrwxr-x.  2 admin admin unconfined_u:object_r:container_file_t:s0  4096 Nov 28 17:30 mysql_db_dir_noroot
...........
[admin@workstation homelab_projects]$ 

````

Run mysql container. Here I set additionally environment variables, port mapping and folders for sharing database :

````
[admin@workstation homelab_projects]$ podman run -d --name mysql-db -e MYSQL_USER=admin -e MYSQL_PASSWORD=mysql -e MYSQL_DATABASE=words -e MYSQL_ROOT_PASSWORD=mysql -p 33306:3306 -v /opt/homelab_projects/mysql_db_dir_noroot:/var/lib/mysql/data rhscl/mysql-57-rhel7
0fb7b0ad8de7f00acccf7ddd3ccd296836da24ef575727e99bc63a2c0cdbe11e
[admin@workstation homelab_projects]$ 
[admin@workstation homelab_projects]$ 
[admin@workstation homelab_projects]$ podman ps -a
CONTAINER ID  IMAGE                                                                                                      COMMAND         CREATED        STATUS            PORTS                    NAMES
0fb7b0ad8de7  registry.access.redhat.com/rhscl/mysql-57-rhel7:latest                                                     run-mysqld      5 seconds ago  Up 4 seconds ago  0.0.0.0:33306->3306/tcp  mysql-db
.........
[admin@workstation homelab_projects]$ 

````

Let's check if the database has been created:

````
[admin@workstation homelab_projects]$ mysql -h 127.0.0.1 -uadmin -pmysql -P 33306
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 5.7.24 MySQL Community Server (GPL)

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MySQL [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| words              |
+--------------------+
2 rows in set (0.001 sec)

MySQL [(none)]> 
````

Deploy dump of the db:

````
[admin@workstation homelab_projects]$ mysql -h 127.0.0.1 -uadmin -pmysql -P 33306 words < db.sql 
````

## PostgreSQL
Installation of rootless PosgreSQL on Podman is quite similar with MySQL. Here below I going to describe it in nutshell with most important commands.

1. Firstly I have created a local folder which will be mounted to container as volume. Here will be stored the database and all system files of the postgresql. Additionally, it is necessary to set required selinux file-context for the folder:

````bash
[admin@workstation opt]$ mkdir -pv /opt/podman/postgresql13
mkdir: created directory '/opt/podman'
mkdir: created directory '/opt/podman/postgresql13'

[admin@workstation opt]$ sudo semanage fcontext -a -t container_file_t "/opt/podman/postgresql13(/.*)?"
[sudo] password for admin: 
[admin@workstation opt]$ 
[admin@workstation opt]$ sudo restorecon -R -v podman/postgresql13
Relabeled /opt/podman/postgresql13 from unconfined_u:object_r:usr_t:s0 to unconfined_u:object_r:container_file_t:s0
[admin@workstation opt]$ 
````

2. Plan which local port will be used. You can left a default postgres port ``5432``, but I decided to use another port - ``54321``. Therefore, we need to define the new port in Selinux. 

Check what is the name of SELinux port type and if the port already defined:
````bash
[seymur@workstation ~]$ sudo semanage port -l | grep postgres
postgresql_port_t              tcp      5432, 9898
[seymur@workstation ~]$ 
````

Define custom port in Selinux:
````bash
semanage port -a -t postgresql_port_t -p tcp 54321
````

3. Next, deploy Posgresql with the required parameters: 
````bash
[seymur@workstation ~]$ podman run -d --name postgresql_database -e POSTGRESQL_USER=user -e POSTGRESQL_PASSWORD=pass -e POSTGRESQL_DATABASE=db -p 54321:5432 -v /opt/podman/postgresql13:/var/lib/pgsql/data registry.fedoraproject.org/f33/postgresql
732837a2fbe88033a26760c25c06cfc80d823578a57e227083820604c6a4b186
[seymur@workstation ~]$ 
````

Here ``POSTGRESQL_USER=user`` - is a database user, ``POSTGRESQL_PASSWORD=pass`` - password for user, ``POSTGRESQL_DATABASE=db`` - name of database. Parameter ``-v /opt/podman/postgresql13:/var/lib/pgsql/data`` mounts local folder ``/opt/podman/postgresql13`` to the ``/var/lib/pgsql/data``. 

4. Check application runs:
````bash
[seymur@workstation ~]$ podman ps -a
CONTAINER ID    IMAGE                                          COMMAND               CREATED       STATUS                   PORTS                    NAMES
732837a2fbe8    registry.fedoraproject.org/f33/postgresql      run-postgresql        2 hours ago   Up 2 hours ago           0.0.0.0:54321->5432/tcp  postgresql_database
...
````

{% endraw %}

