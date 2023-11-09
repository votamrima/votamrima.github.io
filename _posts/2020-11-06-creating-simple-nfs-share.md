---
layout: single
title: "Creating a simple NFS share on centos"
subtitle: ""
date: 2020-11-06 23:38:00 +0100
#background: '/img/posts/01.jpg'
tags: ['linux']
---
 
 {% raw %}
<p>In this post is noted a way of creating a simple NFS share server on centos 8 machine.</p>

**1. Installing NFS**

On the server side we should install ``nfs-utils`` packet:
````
[root@nfs-server ~]# yum install nfs-utils
````

and start/enable ``nfs-server`` service
````
[root@nfs-server ~]# systemctl start nfs-server
[root@nfs-server ~]# ^start^enable
systemctl enable nfs-server
Created symlink /etc/systemd/system/multi-user.target.wants/nfs-server.service → /usr/lib/systemd/system/nfs-server.service.
[root@nfs-server ~]# 
````

3. Create a necessary directory and set ``nobody`` as an owner. Additionally, enable SELinux boolean ``nfs_export_all_rw`` 

````
mkdir /opt/myshare
[root@nfs-server opt]# chown nobody /opt/myshare
[root@nfs-server opt]# setsebool -P nfs_export_all_rw 1
````

4. Exporting the defined directory. Define prepared directory and subnets in /etc/exportfs file. Additionally, some options for exporting should be defined along with subnets too.
````
[root@nfs-server ~]# vim /etc/exports
/opt/myshare   192.168.11.0/24(rw,sync)
````

More options you can find in ``man exports``. Some options are following:
* rw
* sync 
* all_squash - Map all uids and gids from clients to the anonymous user.
* no_all_squash - used to map all UIDs and GIDs from client requests to identical UIDs and GIDs on the NFS server.
* root_squash – Map requests from uid/gid 0 to the anonymous uid/gid

5. Export the defined in /etc/exports directories:
````
[root@nfs-server ~]# exportfs -arv
exporting 192.168.11.0/24:/opt/myshare
````

Here ``-a`` means export all defined directories
``-r`` means reexport exported directories
``-v`` enable verbouse mode


6. To check an exported list use `` -s `` flag:
````
[root@nfs-server ~]# exportfs -s
/opt/myshare  192.168.11.0/24(sync,wdelay,hide,no_subtree_check,sec=sys,rw,secure,root_squash,no_all_squash)
[root@nfs-server ~]# 
````

7. Enable NFS services in firewalld:
````
[root@nfs-server ~]# firewall-cmd --permanent --add-service=nfs
success
[root@nfs-server ~]# 
[root@nfs-server ~]# 
[root@nfs-server ~]# firewall-cmd --permanent --add-service=mountd
success
[root@nfs-server ~]# firewall-cmd --permanent --add-service=rpc-bind
success
[root@nfs-server ~]# 
[root@nfs-server ~]# 
[root@nfs-server ~]# firewall-cmd --reload
success
[root@nfs-server ~]# 
````

8. Mount a share on the client. Create a folder on the client machine for mounting nfs folder and add a mouting details in the /etc/fstab:
````
[root@workstation ~]# mkdir /opt/nfs-share
[root@workstation ~]# vim /etc/fstab
......
192.168.11.61:/opt/myshare /opt/nfs-share nfs defaults 0 0
````

9. And mount a share:
````
mount -a
````

10. Check if it is mounted successfully:
````
[root@workstation ~]# df -h
.......
192.168.11.61:/opt/myshare                45G  3.4G   42G   8% /opt/nfs-share
````

11. Moreover, you can mount a folder manually, without adding an entry in the /etc/fstab:
````
mount -t nfs  192.168.11.61:/opt/myshare /opt/nfs-share
````

12. In order to check available shares on the remote server you can use a ``showmount `` command:
````
[root@workstation ~]# showmount -e 192.168.11.61 ##This is a remote nfs server
Export list for 192.168.11.61:
/opt/myshare 192.168.11.0/24
[root@workstation ~]# 
````

{% endraw %}