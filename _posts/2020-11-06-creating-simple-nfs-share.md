---
layout: single
title: "Creating a simple NFS share on centos"
subtitle: ""
date: 2020-11-06 23:38:00 +0100
#background: '/img/posts/01.jpg'
tags: ['linux']
---
 
{% raw %}
In this post, I will outline the process of creating a simple NFS share server on a CentOS 8 machine.

## Installing NFS
First, on the server side, we need to install the nfs-utils package:

````bash
[root@nfs-server ~]# yum install nfs-utils
````

Then, start and enable the ``nfs-server`` service:

````bash
[root@nfs-server ~]# systemctl start nfs-server
[root@nfs-server ~]# ^start^enable
systemctl enable nfs-server
Created symlink /etc/systemd/system/multi-user.target.wants/nfs-server.service → /usr/lib/systemd/system/nfs-server.service.
[root@nfs-server ~]# 
````

## Preparing the Share Directory
Create the directory that will be shared via NFS, and set ``nobody`` as the owner. Also, enable the SELinux ``boolean nfs_export_all_rw``:

````bash
mkdir /opt/myshare
[root@nfs-server opt]# chown nobody /opt/myshare
[root@nfs-server opt]# setsebool -P nfs_export_all_rw 1
````

## Exporting the Directory

Define the directory and allowed subnets in ``/etc/exports``. Here, we also specify some options for exporting:

````bash
[root@nfs-server ~]# vim /etc/exports
````

Add the following line:

````bash
/opt/myshare   192.168.11.0/24(rw,sync)
````

More options can be found in man exports. Some common options include:
* ``rw``: Read/Write permission
* ``sync``: Synchronize changes
* ``all_squash``: Map all UIDs and GIDs from clients to anonymous user
* ``no_all_squash``: Map all UIDs and GIDs from client requests to identical UIDs and GIDs on the NFS server
* ``root_squash``: Map requests from uid/gid 0 to anonymous uid/gid

## Applying the Export Configuration
Export the directories defined in /etc/exports:

````bash
[root@nfs-server ~]# exportfs -arv
exporting 192.168.11.0/24:/opt/myshare
````
Here, ``-a`` exports all directories, ``-r`` re-exports directories, and ``-v`` enables verbose mode.

## Verifying the Export
To check the exported list, use the ``-s`` flag:

````bash
[root@nfs-server ~]# exportfs -s
/opt/myshare  192.168.11.0/24(sync,wdelay,hide,no_subtree_check,sec=sys,rw,secure,root_squash,no_all_squash)
[root@nfs-server ~]# 
````

## Configuring the Firewall
Enable necessary NFS services in ``firewalld``:

````bash
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

## Mounting the Share on the Client

On the client machine, create a directory for the NFS mount and add the mount details in ``/etc/fstab``:

````bash
[root@workstation ~]# mkdir /opt/nfs-share
[root@workstation ~]# vim /etc/fstab
````

Add this line to:
````bash
......
192.168.11.61:/opt/myshare /opt/nfs-share nfs defaults 0 0
````

Then, mount the share:

````bash
mount -a
````

## Verifying the Mount
Check if the share is successfully mounted:

````bash
[root@workstation ~]# df -h
.......
192.168.11.61:/opt/myshare                45G  3.4G   42G   8% /opt/nfs-share
````

## 9. Manual Mounting
Alternatively, you can manually mount the share without adding an entry in ``/etc/fstab``:

````bash
mount -t nfs  192.168.11.61:/opt/myshare /opt/nfs-share
````

## Checking Available Shares
To see available shares on the remote server, use ``showmount``:

````
[root@workstation ~]# showmount -e 192.168.11.61 ##This is a remote nfs server
Export list for 192.168.11.61:
/opt/myshare 192.168.11.0/24
[root@workstation ~]# 
````

Setting up an NFS share on CentOS is a straightforward process. This setup allows for flexible sharing of files and directories across different systems in a network.

{% endraw %}