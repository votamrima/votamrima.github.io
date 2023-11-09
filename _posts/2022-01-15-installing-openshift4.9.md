---
layout: single
title: "My experience of Openshift 4.9 installation on Proxmox with a restricted network"
subtitle: ""
date: 2022-01-15 20:00:00 +0100
background: '/image/01.jpg'
tags: ['openshift']
---

{% raw %}

In this post I tried to describe my experience that I had during Openshift 4.9 installation at my home lab. Redhat allows to use Openshift during 60 days for free without support.

## Preparing environment

- Set up DNS and DHCP
- Set up proxy
- Download RHCOS (https://console.redhat.com/openshift/install/metal/user-provisioned)
- Create bare metal environment. In my case I use Proxmox virtualization platform
- Install http server
- Install haproxy
- 

## Preparing for installation 
For Openshift installation it is necessary to have following:
- DNS and DHCP services
- HTTP server. In my case I installed httpd server
- Loadbalacer. I use Haproxy

All these services are running on Linux machine (in my case it is last version of CentOS 8). I named it ocp-services.

For installation and configuration of mentioned services I used ansible. Roles are available here: https://github.com/votamrima/ansible_activity 

At my home lab Openshift nodes are being run on Proxmox virtualisation platform. There are 6 nodes: 1 - bootstrap node, 3 master nodes, 2 worker nodes.

### Obtaining Openshift installer and token
Register at Red Hat portal. 

Installer, token and Redhat CoreOS are able to download from https://console.redhat.com/openshift/install/metal/user-provisioned.

Unpack downloanded zip into ``/usr/local/bin/``.

Create a folder where will be generated igns. In my case it is ``/opt/try/install_dir/``.

Create ``install-config.yaml`` in ``/opt/try/install_dir/``. Sample for install-config.yaml is able to find here: https://docs.openshift.com/container-platform/4.9/installing/installing_bare_metal/installing-restricted-networks-bare-metal.html#installation-bare-metal-config-yaml_installing-restricted-networks-bare-metal. 

Edit created file. Add copied from Redhat portal token into the file.

Create manifests:

````bash
openshift-install create manifests --dir /opt/try/install_dir/
````

Modify the created cluster-scheduler-02-config.yml manifest file to make the control plane nodes schedulable by updating *mastersSchedulable* value to true. This option will deactivate scheduling control plane nodes by default:

````bash
sed -i 's/mastersSchedulable: true/mastersSchedulable: false/' /opt/try/install_dir/manifests/cluster-scheduler-02-config.yml
````

Create ignition files:

````bash
openshift-install create ignition-configs --dir /opt/try/install_dir/
````

Copy created ignition files to apache httpd folder. In my case it is ``/var/www/html/okd/``

````bash
sudo cp -Rf install_dir/* /var/www/html/okd/
````

### Install CoreOS and Openshift

Create virtual machines on your virtual platform. Each node will run on seperated VM. In my case, as I mentioned above I used Proxmox and I have created 6 virtual machines - 1 bootstrap node, 3 for master nodes, 2 for worker nodes. All machines have following parameters: CPU - 4 core, memory - 16GB, hard drive - 100 GB, one phisycal network interface. 

Start each machine and load up the downloaded RHCOS iso image. 

When RHCOS is loaded you should install ign file that you have created before. Type following commands for the following machines accordingly. The structure of the command is `` sudo coreos-installer install --ignition-url=<url with ignition file> <partition for installation> --insecure-ignition``


In my case I used following commands for installing a bootstrap node:

````bash
coreos-installer install --ignition-url=http://192.168.11.61:8080/okd/bootstrap.ign /dev/sda --insecure-ignition
````

For installing master node:

````bash
coreos-installer install --ignition-url=http://192.168.11.61:8080/okd/master.ign /dev/sda --insecure-ignition
````

For installing worker node:

````bash
coreos-installer install --ignition-url=http://192.168.11.61:8080/okd/worker.ign /dev/sda --insecure-ignition
````

Wait until all ignitions will be installed.

Restart all nodes. 

And wait until Openshift will be installed. On my home lab installation continued more than 1,5 hour. 

### Bootstrap installation

To monitor the bootstrap process Red Hat recommends to use ``$ ./openshift-install --dir <installation_directory> wait-for bootstrap-complete --log-level=info`` command. Unfortunatelly, in my case it does not work. Every time this commands ended with error. Although, configuration was correct and installation process continued. Moreover, I wanted to observe bootstap process in detail. Therefore, I run ``journalctl`` on the host (using ssh and with core user). For bootstrap node I typed following:

````bash
[root@ocp-services ~]# ssh core@192.168.11.66
[core@ocp-bootstrap ~]# sudo -i
[root@ocp-bootstrap ~]# journalctl -b -f -u release-image.service -u bootkube.service
````

Additionally, I regularly observed running containers as well:

````bash
[root@ocp-bootstrap ~]# crictl ps -a
CONTAINER           IMAGE                                                                                                                    CREATED              STATE               NAME                        ATTEMPT             POD ID
e6466af3587aa       quay.io/openshift-release-dev/ocp-release@sha256:bb1987fb718f81fb30bec4e0e1cd5772945269b77006576b02546cf84c77498e        About a minute ago   Running             cluster-version-operator    0                   811748d44e1d8
c24e9d6dbf475       d5d10803f3ebd3ef51495518565dedc1c8c3b722a016026c613fc22dba95ea90                                                         About a minute ago   Running             cloud-credential-operator   0                   b01a7b4cfc1ef
41c1b7d1ab749       28ea52b98c63aa5dd899d67bf267a3b7dd623f5a694b97a56793bb12597e2de9                                                         2 minutes ago        Running             machine-config-server       0                   40b5c46667d10
66e72fc96cd44       28ea52b98c63aa5dd899d67bf267a3b7dd623f5a694b97a56793bb12597e2de9                                                         2 minutes ago        Exited              machine-config-controller   0                   40b5c46667d10
58a422a9e4320       quay.io/openshift-release-dev/ocp-v4.0-art-dev@sha256:fd41b7237cac235fead9bda6dc9bf5c6cbde163ebf9d9249f33065d5ceadded0   4 minutes ago        Running             etcd                        0                   90ed4068c2c5d
[root@ocp-bootstrap ~]# 
````

Wait for the end of bootstrap process.

````bash
journalctl -b -f -u release-image.service -u bootkube.service
........
bootkube.service: Succeeded.
````

### Master node installation

During bootstrap node installation, I did restart master and worker nodes. This speeds up installation of master and worker nodes (I do not reason).

To monitor master and working nodes I used journalctl too. Additionally, was checked the status of containers regulary:

````bash
journalctl -b -f
crictl ps -a
````

Wait for master nodes installation to be deployed

For checking if openshift is run and up, see the stats page of loadbalancer (in my case it is haproxy). There are all nodes should be green. 

### Worker nodes

Before starting deploying worker node, shutdown bootstap node and deactivate it from loadbalancer.

When master nodes are successfuly installed and in stats page all master nodes are green, the next step is signing csrs. 

````bash
#check for pending certificates:
[admin@ocp-services ~]$ oc get csr 


#check and sing all pending certificates:
[admin@ocp-services ~]$ oc get csr -ojson | jq -r '.items[] | select(.status == {} ) | .metadata.name' | xargs oc adm certificate approve
````

Before running ``oc`` command do not forget to export KUBECONFIG variable in ocp-services machine.

````bash
export KUBECONFIG=/opt/try/install_dir/auth/kubeconfig
````

During deployment of worker nodes, regularly check for new pending csr's and sign new generated ones.

### Final result
Finally, when all nodes are being deployed, check for url of openshift console:

````bash
#check for openshift console url
oc whoami --show-console
````

Log in to Openshift using default kubeadmin user. Password is being generated during creation of manifests and ignition files. ``/opt/try/install_dir/auth/kubeadmin-password``


## Reference:
[Installing a user-provisioned bare metal cluster on a restricted network. Redhat documentation](https://docs.openshift.com/container-platform/4.9/installing/installing_bare_metal/installing-restricted-networks-bare-metal.html)

{% endraw %}
