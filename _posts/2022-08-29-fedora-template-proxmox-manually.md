---
layout: single
title: "Creating fedora linux cloud init template for proxmox manually"
subtitle: ""
date: 2022-08-29 18:00:00 +0100
background: '/image/01.jpg'
tags: ['proxmox']
---

{% raw %}

1. Download fedora cloud image from https://alt.fedoraproject.org/cloud/. I used to download the last version in raw image

## Creating VM in terminal

A VM creating process I ran in proxmox terminal using the following commands:

2. Create a new VM. Here I defined a machine with internal Proxmox ID 403, with memory 4 GB, two cores and with two network interfaces. Name of the VM will fedora-cloud.
 
````bash
root@proxmox:~# qm create 403 --memory 4096 --cores 2 --name fedora-cloud --net0 virtio,bridge=vmbr0 --net1 virtio,bridge=vmbr1
````

3. Here will the downloaded raw image will be imported to the VM as a hard drive and the image will be transfered to ocp1 storage

````bash
root@proxmox:~# qm importdisk 403 /var/tmp/Fedora-Cloud-Base-36-1.5.x86_64.raw ocp1
importing disk '/var/tmp/Fedora-Cloud-Base-36-1.5.x86_64.raw' to VM 403 ...
Formatting '/mnt/pve/ocp1/images/403/vm-403-disk-0.raw', fmt=raw size=5368709120
transferred 0.0 B of 5.0 GiB (0.00%)
transferred 52.2 MiB of 5.0 GiB (1.02%)
transferred 103.9 MiB of 5.0 GiB (2.03%)
.....
.....
transferred 5.0 GiB of 5.0 GiB (100.00%)
transferred 5.0 GiB of 5.0 GiB (100.00%)
Successfully imported disk as 'unused0:ocp1:403/vm-403-disk-0.raw'
````

The uploaded image currently has a label unused, because it has not been attached to the the VM yet. And name of the image has been changed to ``vm-403-disk-0.raw``. Let's attach the image to the VM.

4. Attaching an image to the VM. I use a default SCSI controller. 

````bash
root@proxmox:~# qm set 403 --scsihw virtio-scsi-pci --scsi0 ocp1:403/vm-403-disk-0.raw
update VM 403: -scsi0 ocp1:403/vm-403-disk-0.raw -scsihw virtio-scsi-pci
````

5. Add cloud-init drive

````bash
root@proxmox:~# qm set 403 --ide1 ocp1:cloudinit
update VM 403: -ide1 ocp1:cloudinit
Formatting '/mnt/pve/ocp1/images/403/vm-403-cloudinit.qcow2', fmt=qcow2 cluster_size=65536 extended_l2=off preallocation=metadata compression_type=zlib size=4194304 lazy_refcounts=off refcount_bits=16
root@proxmox:~# 
````

6. Make the cloudinit drive bootable and define in BIOS the boot starts from disk:

````bash
root@proxmox:~# qm set 403 --boot c --bootdisk scsi0
update VM 403: -boot c -bootdisk scsi0
root@proxmox:~# 
````

7. And finally set serial to enable a web VNC. **Not relevant**

````bash
root@proxmox:~# qm set 403 --serial0 socket --vga serial0
update VM 403: -serial0 socket -vga serial0
root@proxmox:~# 
````

8. Create a template from the VM

````bash
root@proxmox:~# qm template 403
root@proxmox:~# 
````

Cloud-init configuration is able to define before creating a template or for any single VM that are being defined from the template.

9. Clone a VM from the template:

````bash
root@proxmox:~# qm clone 403 103 --name test-vm --full
create full clone of drive ide1 (ocp1:403/vm-403-cloudinit.qcow2)
Formatting '/mnt/pve/ocp1/images/103/vm-103-cloudinit.qcow2', fmt=qcow2 cluster_size=65536 extended_l2=off preallocation=metadata compression_type=zlib size=4194304 lazy_refcounts=off refcount_bits=16
create full clone of drive scsi0 (ocp1:403/base-403-disk-0.raw)
Formatting '/mnt/pve/ocp1/images/103/vm-103-disk-0.raw', fmt=raw size=5368709120
transferred 0.0 B of 5.0 GiB (0.00%)
transferred 51.7 MiB of 5.0 GiB (1.01%)
.....
transferred 5.0 GiB of 5.0 GiB (100.00%)
````

## Reference
- [Proxmox Cloud-Init Support](https://pve.proxmox.com/wiki/Cloud-Init_Support)
- [Creating cloud init cloud image](https://docs.technotim.live/posts/cloud-init-cloud-image/)

{% endraw %}