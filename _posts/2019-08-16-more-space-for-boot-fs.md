---
layout: single
title: "Expanding /boot partition"
subtitle: ""
date: 2019-08-16 20:17:00 +0100
#background: '/img/posts/01.jpg'
tags: ['linux']
---

{% raw %}

Recently I tried to update my centos 7 test machine. Unfortunatelly, ``yum update`` command returned the following error "At least 54MB more space needed on the /boot filesystem.".

``df -h`` command showed following:

````
[root@server ~]# df -h
Filesystem                    Size  Used Avail Use% Mounted on
/dev/mapper/cl_centos03-root   32G   13G   19G  41% /
devtmpfs                      1.9G     0  1.9G   0% /dev
tmpfs                         1.9G     0  1.9G   0% /dev/shm
tmpfs                         1.9G  9.7M  1.9G   1% /run
tmpfs                         1.9G     0  1.9G   0% /sys/fs/cgroup
/dev/sdb1                      79G  7.6G   68G  11% /opt
/dev/sda1                     497M  486M   11M  98% /boot
tmpfs                         379M   40K  379M   1% /run/user/1000
..........
````

During installation I did mount ``/dev/sda1`` partition for the ``/boot`` with 500M. This storage is almost full (just 11M is free). Therefore, now I should clean up a given partition and enlarge a free space by deleting old and unused packages of the kernel.

**!!!! DO NOT DO IT MANUALLY USING rm command!!!!**

For erasing unused packages we need ``package-cleanup`` utility. It is being installed along with  ``yum-utils`` package (``yum install yum-utils -y``).

### Running 

````
[root@server ~]# package-cleanup --oldkernels --count=1
Loaded plugins: fastestmirror, langpacks
--> Running transaction check
---> Package kernel.x86_64 0:3.10.0-862.3.3.el7 will be erased
---> Package kernel-debug.x86_64 0:3.10.0-862.3.3.el7 will be erased
---> Package kernel-devel.x86_64 0:3.10.0-862.3.3.el7 will be erased
--> Finished Dependency Resolution

Dependencies Resolved

=============================================================================================================================================
 Package                           Arch                        Version                                   Repository                     Size
=============================================================================================================================================
Removing:
 kernel                            x86_64                      3.10.0-862.3.3.el7                        @updates                       62 M
 kernel-debug                      x86_64                      3.10.0-862.3.3.el7                        @updates                       64 M
 kernel-devel                      x86_64                      3.10.0-862.3.3.el7                        @updates                       37 M

Transaction Summary
=============================================================================================================================================
Remove  3 Packages

Installed size: 162 M
Is this ok [y/N]: y
Downloading packages:
Running transaction check
Running transaction test
Transaction test succeeded
Running transaction
  Erasing    : kernel-3.10.0-862.3.3.el7.x86_64                                                                                          1/3

......................

Removed:
  kernel.x86_64 0:3.10.0-862.3.3.el7        kernel-debug.x86_64 0:3.10.0-862.3.3.el7        kernel-devel.x86_64 0:3.10.0-862.3.3.el7

Complete!
````

Parameters that I used with a command are following:
````
--oldkernels - to ensure that kernel's and kernel-devel's old packages will be removed
--count=1 - Number of duplicate/kernel packages to keep on the system (default 2)
````

And the output of df -h command:

````
[root@server ~]# df -h
Filesystem                    Size  Used Avail Use% Mounted on
/dev/mapper/cl_centos03-root   32G   14G   19G  43% /
devtmpfs                      1.9G     0  1.9G   0% /dev
tmpfs                         1.9G     0  1.9G   0% /dev/shm
tmpfs                         1.9G  9.7M  1.9G   1% /run
tmpfs                         1.9G     0  1.9G   0% /sys/fs/cgroup
/dev/sdb1                      79G  7.6G   68G  11% /opt
/dev/sda1                     497M  211M  287M  43% /boot
tmpfs                         379M   40K  379M   1% /run/user/1000
..................
[root@server ~]#
````

In this output we can see that unused files were removed and it was cleaned up 275 MB. 

{% endraw %}