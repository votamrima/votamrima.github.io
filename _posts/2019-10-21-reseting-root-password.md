---
layout: single
title: "root password reseting in centos"
subtitle: ""
date: 2019-10-21 13:05:13 +0100
background: '/img/posts/01.jpg'
tags: ['linux']
---

{% raw %}

* In the grub menu select actual kernel and type "-e"
![IMAGE](../images/reseting-root-password/pic-1.png)

* Go to the line with "``linux 16``" and change ``ro`` to ``rw init=/sysroot/bin/sh``". 

before:
![IMAGE](../images/reseting-root-password/pic-2.png)

after: 
![IMAGE](../images/reseting-root-password/pic-3.png)


* Press ``ctrl+X`` for starting a single mode session

* When single mode is started access to the system...:
````
chroot /sysroot
````

* And using passwd command change the root's password:
````
passwd root
````

* Finally, it is necessary to update SELinux information by createing an empty **.autorelabel** in ``/``
````
touch /.autorelabel
````

* Exit from single mode session
   
* Try to login using a new password

{% endraw %}