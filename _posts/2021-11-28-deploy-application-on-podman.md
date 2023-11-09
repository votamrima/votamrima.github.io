---
layout: single
title: "Deploy a python application using podman. Deploy rootless container and connect podmanized database container" 
subtitle: ""
date: 2021-11-28 19:30:00 +0100
background: '/image/01.jpg'
tags: ['podman', 'python']
---

{% raw %}

In order to connect a rootless application container to the rootles database container I used port mapping technique. The following steps were used for successfully applying application with connection to database.

First of all I installed libvirt package in order to enable virtualization network interface:

````bash
[admin@podman ~]$ sudo yum install libvirt
````

Deploy database container. I mapped the database port 3306 from the container to the port 33306 at host machine. 

````
podman run -d --name mysql-db -e MYSQL_USER=admin -e MYSQL_PASSWORD=mysql -e MYSQL_DATABASE=words -e MYSQL_ROOT_PASSWORD=mysql -p 33306:3306 -v /opt/homelab_projects/mysql_db_dir_noroot:/var/lib/mysql/data rhscl/mysql-57-rhel7
````

Check out ip address of the podman interface at the host.

````
[admin@workstation homelab_projects]$ ip addr
...........
5: virbr0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default qlen 1000
    link/ether 52:54:00:dc:2d:dc brd ff:ff:ff:ff:ff:ff
    inet 192.168.122.1/24 brd 192.168.122.255 scope global virbr0
       valid_lft forever preferred_lft forever
............
````

And finally, deploy application using parameters for mapping port and setting environment variables. In order to access to database container, I need to set a gateway ip address of podman network as database host. In this way all all traffic between application and database containers will run through main host. Of course, in this case, do not forget to map the port of mysql container and set it as env value for application container. 

````
[admin@workstation homelab_projects]$ podman run -d --name testapp -p 8090:8090 -e MYSQL_HOST=192.168.122.1 -e MYSQL_USER=admin -e MYSQL_PASSWORD=mysql -e MYSQL_PORT=33306 -e MYSQL_DB=words testapp
4bb1627cfa1c1c0690cebfd011e340162ead9f50143bde5269e90f24bbe10f83
[admin@workstation homelab_projects]$ podman ps -a
CONTAINER ID  IMAGE                                                                                                      COMMAND               CREATED        STATUS            PORTS                    NAMES
4bb1627cfa1c  localhost/testapp:latest                                                                                   nohup python /opt...  3 seconds ago  Up 3 seconds ago  0.0.0.0:8090->8090/tcp   testapp
0fb7b0ad8de7  registry.access.redhat.com/rhscl/mysql-57-rhel7:latest                                                     run-mysqld            2 hours ago    Up 2 hours ago    0.0.0.0:33306->3306/tcp  mysql-db
[admin@workstation homelab_projects]$ 

````

Additionally, I would give a short command for entering to the container:

````bash
podman exec -it testapp bash
````

{% endraw %}