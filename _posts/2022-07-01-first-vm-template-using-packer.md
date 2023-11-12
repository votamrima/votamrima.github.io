---
layout: single
title: "Building a Proxmox VM Template with Packer and CentOS 8 Stream"
subtitle: ""
date: 2022-07-01 18:00:00 +0100
background: '/image/01.jpg'
tags: ['packer']
---

{% raw %}

In this article, I share my experience of creating a virtual machine template on Proxmox using Packer, focusing on setting up a VM with CentOS 8 Stream.


## Installing Packer

To begin, Packer needs to be installed. You can find detailed instructions on installing Packer [Here](https://learn.hashicorp.com/tutorials/packer/get-started-install-cli). On my Fedora Workstation, I followed these steps:


### Installing official HarshiCorp repository:

Add the repository:

````bash
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo
````

If ``yum-config-manager`` is not available, install ``yum-utils`` package: 

````bash
sudo yum install -y yum-utils
````

## Installing Packer
Then, install Packer:

````
sudo yum -y install packer
````

Verify the installation:

````bash
[admin@workstation packer]$ packer --version
1.8.0
[admin@workstation packer]$ 
````

## Create a hcl file 

Packer requires a file with instructions for setting up the VM. I used an HCL file for my setup, starting with defining required plugins and then declaring variables like ``proxmox_api_url``, ``proxmox_api_token_id``, and ``proxmox_api_token_secret``.

### HCL File Structure
The file is structured into three main parts:

* Required Plugins: Defining the Proxmox plugin to be installed.
* Variables: Specifying API URLs and tokens.
* Source: Main parameters of the VM, including the ISO file, disk, and network configurations.
* Build: Running the build process and provisioning tasks.


````vim
packer {
  required_plugins {
    proxmox = {
      version = ">= 1.0.6"
      source  = "github.com/hashicorp/proxmox"
    }
  }
}

variable "proxmox_api_url" {
  type = string
}

variable "proxmox_api_token_id" {
  type = string
}

variable "proxmox_api_token_secret" {
  type      = string
  sensitive = true
}

source "proxmox" "centos8-packer" {
  proxmox_url = "${var.proxmox_api_url}"
  username    = "${var.proxmox_api_token_id}"
  token    = "${var.proxmox_api_token_secret}"

  insecure_skip_tls_verify = true

  node  = "proxmox"
  vm_id = "108"
  vm_name = "centos8-packer"
  template_description = "centos8-packer description"

  iso_file         = "ocp1:iso/CentOS-Stream-8-x86_64-latest-dvd1.iso"

  iso_storage_pool = "local"
  unmount_iso      = true

  qemu_agent = true

  scsi_controller = "virtio-scsi-pci"

  disks {
    disk_size         = "15G"
    format            = "vmdk"
    storage_pool      = "ocp1"
    storage_pool_type = "directory"
    type              = "virtio"
  }

  cores = "2"

  memory = "4096"

  network_adapters {
    model = "virtio"
    bridge = "vmbr0"
    firewall = "false"
   } 

  cloud_init              = true
  cloud_init_storage_pool = "ocp1"

  boot_command = [
    "<tab><bs><bs><bs><bs><bs>text inst.ks=http://{{ .HTTPIP }}:{{ .HTTPPort }}/ks.conf<enter><wait><enter>"
  ]
  boot      = "c"
  boot_wait = "5s"

  http_directory = "http" 

  ssh_username = "admin"
  ssh_private_key_file = "~/.ssh/id_rsa"
  ssh_password = "admin"
  ssh_port = 22
  ssh_timeout = "30m"

}

build {
    source "proxmox.centos8-packer" {
        name = "centos8-packer"
    }

    provisioner "shell" {
      inline = [
        "echo Installing Updates",
        "yum update -y",
        "yum install -y cloud-init qemu-guest-agent cloud-utils-growpart gdisk",
      ]

      only = ["proxmox"]
    }
}
````
This setup also involves a temporary HTTP server by Packer for downloading the Kickstart file during installation, which is located in the http folder.

## Running Packer

First, install the required plugin for Packer:

````bash
[admin@workstation packer]$ packer init hcls/
Installed plugin github.com/hashicorp/proxmox v1.0.8 in "/home/admin/.config/packer/plugins/github.com/hashicorp/proxmox/packer-plugin-proxmox_v1.0.8_x5.0_linux_amd64"
````

Verify the installed plugin:

````bash
[admin@workstation packer]$ packer plugins installed
/home/admin/.config/packer/plugins/github.com/hashicorp/proxmox/packer-plugin-proxmox_v1.0.8_x5.0_linux_amd64
````

And finaly, initiate setting up the machine:

````bash
[admin@workstation packer]$ packer build -var-file='creds.pkr.hcl' -var proxmox_api_token_secret="<my-secret>" hcls/proxmox-centos.pkr.hcl
.......
.......
.......
==> Builds finished. The artifacts of successful builds are:
--> proxmox.centos8-packer: A template was created: 108

[admin@workstation packer]$ 
````

## Conclusion
Using Packer with Proxmox to create a VM template with CentOS 8 Stream can be an efficient and streamlined process. By following the steps outlined above, I  created a reusable VM template for various applications.

{% endraw %}
