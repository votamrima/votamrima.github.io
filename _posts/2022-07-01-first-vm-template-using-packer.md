---
layout: single
title: "Creating a cloud-init VM Template on Proxmox using packer"
subtitle: ""
date: 2022-07-01 18:00:00 +0100
background: '/image/01.jpg'
tags: ['packer']
---

{% raw %}
Recently I built up a virtual machine template on Proxmox using Packer. Here below I am going to show which steps were followed in order to achive the aim. I am going to set up VM with CentOS 8 Stream on board.

## Installing Packer

[Here](https://learn.hashicorp.com/tutorials/packer/get-started-install-cli) is shown how to install Packer. Generally, I used the following steps for installing a required packages on my Fedora Workstation:

Installing official HarshiCorp repository:

````bash
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo
````

If ``yum-config-manager`` is not available on the host, install ``yum-utils`` package: ``sudo yum install -y yum-utils``

And install packer:

````
sudo yum -y install packer
````

And that's it. Packer is installed. Check it:

````bash
[admin@workstation packer]$ packer 
Usage: packer [--version] [--help] <command> [<args>]

Available commands are:
    build           build image(s) from template
    console         creates a console for testing variable interpolation
    fix             fixes templates from old versions of packer
    fmt             Rewrites HCL2 config files to canonical format
    hcl2_upgrade    transform a JSON template into an HCL2 configuration
    init            Install missing plugins or upgrade plugins
    inspect         see components of a template
    plugins         Interact with Packer plugins and catalog
    validate        check that a template is valid
    version         Prints the Packer version

[admin@workstation packer]$ packer --version
1.8.0
[admin@workstation packer]$ 
````

## Create a hcl file 

In order to set up a vm we need to declare a file with instructions for packer. There are two type of files: JSON files and HCL file. 

I used to apply following hcl file for my task. The file is starting by defining required plugins. This plugin will be installed using ``packer init hcls/``. In the following part are being declared variables. I declared ``proxmox_api_url``, ``proxmox_api_token_id`` and ``proxmox_api_token_secret``. These variables are able to define in the external file, by passing as a command parameter and by defining in the the same hcl file. In my task I set the 2 variables in a external file and secret I gave in command line as a parameter.

Second part of the file is consisting of ``source`` part. Here are defined main parameters of the VM, iso file, disk, network and etc. 

Third part is the building part what actually runs building process and after provisioning tasks.

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

By running packer creates a temporary http server using a randomly generated port. Such approach allows to download a kicstart file during installation and set up a machine. Kickstart file is located in ``http`` folder (``http_directory = "http" ``). The kickstart file that I used for this task is shared on github. [Link](https://github.com/votamrima/terraforming/blob/master/packer/http/ks.conf)

## Running Packer

First of all we need to install required plugin for packer.

````bash
[admin@workstation packer]$ packer init hcls/
Installed plugin github.com/hashicorp/proxmox v1.0.8 in "/home/admin/.config/packer/plugins/github.com/hashicorp/proxmox/packer-plugin-proxmox_v1.0.8_x5.0_linux_amd64"
````

And check installed plugin:

````bash
[admin@workstation packer]$ packer plugins installed
/home/admin/.config/packer/plugins/github.com/hashicorp/proxmox/packer-plugin-proxmox_v1.0.8_x5.0_linux_amd64
````

Next step is setting up a machine.

````bash
[admin@workstation packer]$ packer build -var-file='creds.pkr.hcl' -var proxmox_api_token_secret="<my-secret>" hcls/proxmox-centos.pkr.hcl
proxmox.centos8-packer: output will be in this color.

==> proxmox.centos8-packer: Creating VM
==> proxmox.centos8-packer: Starting VM
==> proxmox.centos8-packer: Starting HTTP server on port 8665
==> proxmox.centos8-packer: Waiting 5s for boot
==> proxmox.centos8-packer: Typing the boot command
==> proxmox.centos8-packer: Waiting for SSH to become available...
==> proxmox.centos8-packer: Connected to SSH!
==> proxmox.centos8-packer: Stopping VM
==> proxmox.centos8-packer: Converting VM to template
==> proxmox.centos8-packer: Adding a cloud-init cdrom in storage pool ocp1
Build 'proxmox.centos8-packer' finished after 8 minutes 35 seconds.

==> Wait completed after 8 minutes 35 seconds

==> Builds finished. The artifacts of successful builds are:
--> proxmox.centos8-packer: A template was created: 108

[admin@workstation packer]$ 

````
## Reference


{% endraw %}
