---
layout: single
title: "My Experience Installing OpenShift 4.9 in a Home Lab"
subtitle: ""
date: 2022-01-15 20:00:00 +0100
background: '/image/01.jpg'
tags: ['openshift']
---

{% raw %}

In this post, I will share my experience with installing OpenShift 4.9 in my home lab. Red Hat offers a 60-day free trial of OpenShift without support, which I took advantage of for this setup.

## Preparing the Environment
To start, I set up the following:
* DNS and DHCP
* A proxy
* RHCOS (Red Hat CoreOS) downloaded [from Red Hat Console](https://console.redhat.com/openshift/install/metal/user-provisioned)
* A bare metal environment using the Proxmox virtualization platform
* An HTTP server
* HAProxy for load balancing

## Preparing for Installation
Essentials for the OpenShift installation included:

* DNS and DHCP services
* An HTTP server (I used Apache HTTP Server)
* A load balancer (I opted for HAProxy)

All these services ran on a Linux machine (CentOS 8 in my case), which I named ``ocp-services``.

I used Ansible for the installation and configuration of the services, with roles available at [my Ansible Activity repository](https://github.com/votamrima/ansible_activity).

In my home lab, the OpenShift nodes ran on the Proxmox virtualization platform, consisting of 1 bootstrap node, 3 master nodes, and 2 worker nodes.

### Obtaining Openshift installer and token
After registering at the Red Hat portal, I downloaded the installer, token, and Red Hat CoreOS from the [Red Hat Console](https://console.redhat.com/openshift/install/metal/user-provisioned).

I unpacked the downloaded zip into ``/usr/local/bin/``.

Next, I created a directory for the ignition files (``/opt/try/install_dir/``) and prepared ``install-config.yaml`` in it. I followed the sample provided in the [OpenShift Documentation](https://docs.openshift.com/container-platform/4.9/installing/installing_bare_metal/installing-restricted-networks-bare-metal.html#installation-bare-metal-config-yaml_installing-restricted-networks-bare-metal), adding the token copied from the Red Hat portal.

Commands for creating manifests and ignition files:

````bash
openshift-install create manifests --dir /opt/try/install_dir/
````

I modified the ``cluster-scheduler-02-config.yml`` file to make control plane nodes unschedulable:

````bash
sed -i 's/mastersSchedulable: true/mastersSchedulable: false/' /opt/try/install_dir/manifests/cluster-scheduler-02-config.yml
````

Then, I created ignition files:

````bash
openshift-install create ignition-configs --dir /opt/try/install_dir/
````

I copied the ignition files to the Apache HTTPD folder (``/var/www/html/okd/``):

````bash
sudo cp -Rf install_dir/* /var/www/html/okd/
````

### Install CoreOS and Openshift
I created six virtual machines in Proxmox for the OpenShift nodes, each with 4 CPU cores, 16GB of memory, a 100GB hard drive, and one physical network interface.

For each node, I loaded the RHCOS ISO image and installed the corresponding ignition file. The structure of the command is:

````bash
coreos-installer install --ignition-url=http://192.168.11.61:8080/okd/bootstrap.ign /dev/sda --insecure-ignition
````

Commands for installing the bootstrap, master, and worker nodes were similar, differing only in the ignition file URL.

After installing the ignition files, I restarted all nodes and waited for OpenShift to be installed, which took over 1.5 hours.

### Monitoring the Bootstrap Process

Though Red Hat recommends to use ``$ ./openshift-install --dir <installation_directory> wait-for bootstrap-complete --log-level=info`` for monitoring, I prefer to run ``journalctl`` on the each host (using ssh and with core user). 

To monitor the bootstrap process, I used journalctl on each node. For example, on the bootstrap node:

````bash
[root@ocp-services ~]# ssh core@192.168.11.66
[core@ocp-bootstrap ~]# sudo -i
[root@ocp-bootstrap ~]# journalctl -b -f -u release-image.service -u bootkube.service
````

Additionally, regularly observing the running containers brings more information:

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

During the bootstrap node installation, I restarted the master and worker nodes, which seemed to speed up their installation.

To monitor these nodes, I used journalctl and regularly checked the status of containers:

````bash
journalctl -b -f
crictl ps -a
````

After the master nodes were deployed, I checked the HAProxy stats page to ensure all nodes were green.


### Worker nodes deployment

Before deploying the worker nodes, I shut down the bootstrap node and deactivated it in the load balancer.

Once the master nodes were successfully installed, I proceeded to sign the pending CSRs:

````bash
#check for pending certificates:
[admin@ocp-services ~]$ oc get csr 


#check and sing all pending certificates:
[admin@ocp-services ~]$ oc get csr -ojson | jq -r '.items[] | select(.status == {} ) | .metadata.name' | xargs oc adm certificate approve
````

I regularly checked for new pending CSRs and signed them as they appeared.



Additionally, ensure that the ``KUBECONFIG`` variable is set correctly:

````bash
export KUBECONFIG=/opt/try/install_dir/auth/kubeconfig
````


### Final result
Finally, to access the OpenShift console, I retrieved its URL:

````bash
#check for openshift console url
oc whoami --show-console
````

I logged into OpenShift using the default kubeadmin user. The password was generated during the creation of manifests and ignition files and can be found in ``/opt/try/install_dir/auth/kubeadmin-password``.




## Reference:
[Installing a user-provisioned bare metal cluster on a restricted network. Redhat documentation](https://docs.openshift.com/container-platform/4.9/installing/installing_bare_metal/installing-restricted-networks-bare-metal.html)

{% endraw %}
