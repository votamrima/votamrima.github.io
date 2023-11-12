---
layout: single
title: "Setting Up a Fedora Cloud Virtual Machine in Proxmox Using the Terminal"
subtitle: ""
date: 2022-08-29 18:00:00 +0100
background: '/image/01.jpg'
tags: ['proxmox']
---

{% raw %}

## Setting Up a Fedora Cloud Virtual Machine in Proxmox Using the Terminal

In this article I am sharing my experience with creating a virtual machine (VM) for Fedora Cloud in Proxmox. It is a straightforward process when done via the terminal.

## Step 1: Download Fedora Cloud Image
Start by downloading the Fedora Cloud image. The latest version of Fedora Cloud is able to download from Fedora website in raw image format.

## Step 2: Creating a New VM in Proxmox
Once you have the image, you can create a new VM in Proxmox. For instance, creating a machine with ID 403, 4 GB of memory, two cores, and two network interfaces, can be done with the following command:

````bash
qm create 403 --memory 4096 --cores 2 --name fedora-cloud --net0 virtio,bridge=vmbr0 --net1 virtio,bridge=vmbr1
````

## Step 3: Importing the Downloaded Image
Next, import the downloaded raw image into your VM as a hard drive. The image will be transferred to the 'ocp1' storage on your Proxmox server:

````bash
qm importdisk 403 /var/tmp/Fedora-Cloud-Base-36-1.5.x86_64.raw ocp1
````

This step labels the image as 'unused' because it has not been attached to the VM yet. The name of the image will be changed to ``vm-403-disk-0.raw``.

## Step 4: Attaching the Image to the VM
Now, attach the imported image to your VM. This example uses the default SCSI controller:

````bash
qm set 403 --scsihw virtio-scsi-pci --scsi0 ocp1:403/vm-403-disk-0.raw
````

## Step 5: Adding a Cloud-Init Drive
Cloud-Init drives are crucial for cloud VM configurations. Add one as follows:

````bash
qm set 403 --ide1 ocp1:cloudinit
````

## Step 6: Making the Cloud-Init Drive Bootable
To ensure your VM boots from the Cloud-Init drive:

````bash
qm set 403 --boot c --bootdisk scsi0
````

## Step 7: Setting Serial for Web VNC Access
This step is optional, but it's useful for enabling web VNC access:

````bash
qm set 403 --serial0 socket --vga serial0
````

## Step 8: Creating a Template from the VM
Once your VM is configured, create a template from it:

````bash
qm template 403
````

Templates are handy for deploying multiple instances with similar configurations.

## Step 9: Cloning a VM from the Template
Finally, clone a VM from the template whenever you need a new instance:

````bash
qm clone 403 103 --name test-vm --full
````

This command creates a complete clone of the original VM, including the Cloud-Init drive and hard disk.

## Conclusion
This guide based on my experience and provides a detailed walkthrough of setting up a Fedora Cloud VM in Proxmox using the terminal. Each step, from downloading the image to cloning the VM, is designed to ensure a smooth setup process. 

## Reference
- [Proxmox Cloud-Init Support](https://pve.proxmox.com/wiki/Cloud-Init_Support)
- [Creating cloud init cloud image](https://docs.technotim.live/posts/cloud-init-cloud-image/)

{% endraw %}