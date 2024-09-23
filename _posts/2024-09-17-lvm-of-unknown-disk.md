---
layout: single
title: "Mounting an LVM of second disk"
subtitle: ""
date: 2024-09-15 08:15:00 +0100
background: '/image/01.jpg'
tags: ['linux','lvm']
---

{% raw %}

Here are some commands that helped me mount an LVM volume from the virtual disk of a non-existent VM to recover some important files:

1. **Verify disk connection**: Ensure the second disk is available, typically under `/dev/sdb`.

````bash
root@fedora40:~# lsblk
NAME            MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
sda               8:0    0  100G  0 disk
├─sda1            8:1    0    1M  0 part
├─sda2            8:2    0    2G  0 part /boot
└─sda3            8:3    0   97G  0 part
  └─fedora-root 253:0    0   97G  0 lvm  /
sdb               8:16   0  100G  0 disk
├─sdb1            8:17   0    2G  0 part
└─sdb2            8:18   0   98G  0 part
sr0              11:0    1 1024M  0 rom
zram0           252:0    0  7.7G  0 disk [SWAP]
````

2. **Identify filesystem type**: It seems that the filesystem is `LVM2_member`, we need to recover the logical volume before mounting it.

````bash
root@fedora40:~# mount /dev/sdb2 /mnt/2disk
mount: /mnt/2disk: unknown filesystem type 'LVM2_member'.
       dmesg(1) may have more information after failed mount system call.
root@fedora40:~#
````


3. **Analyze disk with `pvs`, `lvs`, and `vgs` commands**: These commands show the volume group (`vgs`) and logical volumes (`LVs`) on `/dev/sdb2`.

````bash
root@fedora40:~# pvs --devices /dev/sdb2
  PV         VG                    Fmt  Attr PSize   PFree
  /dev/sdb2  fedora_localhost-live lvm2 a--  <98.00g    0
root@fedora40:~#

root@fedora40:~# vgs --devices /dev/sdb2
  VG                    #PV #LV #SN Attr   VSize   VFree
  fedora_localhost-live   1   2   0 wz--n- <98.00g    0

root@fedora40:~# lvs --devices /dev/sdb2
  LV   VG                    Attr       LSize   Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  root fedora_localhost-live -wi------- <94.00g
  swap fedora_localhost-live -wi-------   4.00g
````

4. **Activate and mount the volume**: Use `vgchange` to activate the root LV and then mount it.

````bash
root@fedora40:~# vgchange -ay --devices /dev/sdb2
  2 logical volume(s) in volume group "fedora_localhost-live" now active
root@fedora40:~#
````

And now if we check in lsblk we can see following output:

````bash
root@fedora40:~# lsblk
NAME                            MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
sda                               8:0    0  100G  0 disk
├─sda1                            8:1    0    1M  0 part
├─sda2                            8:2    0    2G  0 part /boot
└─sda3                            8:3    0   97G  0 part
  └─fedora-root                 253:0    0   97G  0 lvm  /
sdb                               8:16   0  100G  0 disk
├─sdb1                            8:17   0    2G  0 part
└─sdb2                            8:18   0   98G  0 part
  ├─fedora_localhost--live-swap 253:1    0    4G  0 lvm
  └─fedora_localhost--live-root 253:2    0   94G  0 lvm
sr0                              11:0    1 1024M  0 rom
zram0                           252:0    0  7.7G  0 disk [SWAP]
root@fedora40:~#
````

And mount the volume:

````bash
root@fedora40:~# mount /dev/mapper/fedora_localhost--live-root /mnt/2disk/
````

That's it.


{% endraw %}