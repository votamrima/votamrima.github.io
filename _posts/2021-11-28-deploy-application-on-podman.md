---
layout: single
title: "Deploying a Python Application with a Podmanized Database Container" 
subtitle: ""
date: 2021-11-28 19:30:00 +0100
background: '/image/01.jpg'
tags: ['podman', 'python']
---

{% raw %}

Deploying applications in containers offers numerous benefits, such as isolation, scalability, and consistency across various environments. This article details how to deploy a Python application using Podman, specifically focusing on connecting a rootless application container to a rootless database container using port mapping.

## Prerequisites

Before proceeding, ensure that the libvirt package is installed to enable the virtualization network interface:

````bash
[admin@podman ~]$ sudo yum install libvirt
````

## Deploying the Database Container

The first step is to deploy the database container. In this example, I used MySQL, mapping its default port ``3306`` to port ``33306`` on the host machine:

````bash
podman run -d --name mysql-db -e MYSQL_USER=admin -e MYSQL_PASSWORD=mysql -e MYSQL_DATABASE=words -e MYSQL_ROOT_PASSWORD=mysql -p 33306:3306 -v /opt/homelab_projects/mysql_db_dir_noroot:/var/lib/mysql/data rhscl/mysql-57-rhel7
````

## Deploying the Application Container
Now, deploy the application container. In this setup, I specified environment variables for the application to connect to the database container. It's crucial to set the gateway IP address of the Podman network (192.168.122.1 in my case) as the database host. This configuration ensures that all traffic between the application and database containers is routed through the main host. Also, remember to map the MySQL container port and set it as an environment variable in the application container:

````bash
[admin@workstation homelab_projects]$ podman run -d --name testapp -p 8090:8090 -e MYSQL_HOST=192.168.122.1 -e MYSQL_USER=admin -e MYSQL_PASSWORD=mysql -e MYSQL_PORT=33306 -e MYSQL_DB=words testapp
4bb1627cfa1c1c0690cebfd011e340162ead9f50143bde5269e90f24bbe10f83
````

And check the running containers if they are properly running:

````bash
[admin@workstation homelab_projects]$ podman ps -a
CONTAINER ID  IMAGE                                                                                                      COMMAND               CREATED        STATUS            PORTS                    NAMES
4bb1627cfa1c  localhost/testapp:latest                                                                                   nohup python /opt...  3 seconds ago  Up 3 seconds ago  0.0.0.0:8090->8090/tcp   testapp
0fb7b0ad8de7  registry.access.redhat.com/rhscl/mysql-57-rhel7:latest                                                     run-mysqld            2 hours ago    Up 2 hours ago    0.0.0.0:33306->3306/tcp  mysql-db
[admin@workstation homelab_projects]$ 

````

## Accessing the container
For direct interaction with your application container, use the following command:

````bash
podman exec -it testapp bash
````

{% endraw %}