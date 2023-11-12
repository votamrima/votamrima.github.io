---
layout: singlee # to remove the article 
title: "Kubernetes installation. (Not finished)"
subtitle: ""
date: 2022-05-10 08:00:00 +0100
background: '/image/01.jpg'
tags: ['kubernetes']
---

{% raw %}

In this post I describe the installation process of a simple Kubernetes cluster. This post has not been finished yet.

Cluster concists from 3 nodes: 1 master node, 2 worker nodes, based on Fedora 35 and all VMs are running at Proxmox.

## Node configuration

Following steps should be proceeded on the all hosts of the futere cluster:

Disable swap:

````bash
swapoff -a
````

Additionally, in order to avoid some issues during settin up I disabled Selinux. 

````bash
swapoff -a

vim /etc/selinux/config   # Set SELINUX=disabled
````

Created kubernetes.conf and kubernetes.conf files:


````bash
cat /etc/modules-load.d/kubernetes.conf
# networking
bridge
br_netfilter
# kata
vhost
vhost_net
vhost_vsock

````


Create kubernetes repo file. But, do not activate it. 

````bash
vim /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-$basearch
enabled=0
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
````

## Installation

I am going to use cri-o as a container engine for kubernetes. Following steps should be perform for all hosts.

Check available versions of cri-o

````bash
dnf module list cri-o
````

And enable the last available version. In my case it is 1.22:

````bash
dnf module enable cri-o:1.22
````

Install necessary packages:

````bash
dnf install podman skopeo buildah runc cri-o cri-tools containernetworking-plugins bridge-utils telnet jq
````

Install kubectl,kubeadm,kubelet from the kubernetes repository.

````bash
dnf install --enablerepo=kubernetes {kubectl,kubeadm,kubelet}
````

Create ``/etc/sysconfig/kubelet`` with the following content:

````bash
KUBELET_EXTRA_ARGS=--cgroup-driver=systemd --fail-swap-on=false
````

Start and enable crio and kubelet services:

````bash
$ sudo systemctl daemon-reload
$ sudo systemctl enable --now crio
$ sudo systemctl enable --now kubelet
````

I stopped and disabled firewalld service in order to quite the local firewall.

````bash
$ sudo systemctl disable --now firewalld
````

Nevertheless, disabling the local firewall is not an option in many cases. Therefore, following ports should be opened on the firewall if you do not want to quite the local firewall.

on master node:

````bash
$ firewall-cmd --add-port={6443,2379-2380,10250,10251,10252,5473,179,5473}/tcp --permanent
$ firewall-cmd --add-port={4789,8285,8472}/udp --permanent
$ firewall-cmd --reload
````

on worker nodes:

````bash
$ firewall-cmd --add-port={10250,30000-32767,5473,179,5473}/tcp --permanent
$ firewall-cmd --add-port={4789,8285,8472}/udp --permanent
$ firewall-cmd --reload
````

## Initialize master (control) node:

Initialize an application subnet for the cluster

````bash
sudo kubeadm init --pod-network-cidr=10.85.0.0/16 
.........
.........
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.168.11.71:6443 --token 44ph3l.4g2dyf2w1zlhsfea --discovery-token-ca-cert-hash sha256:44cbeb23b7d600e02c42690c6de03d5aa3cbad3dfec356fbb9afcb7c89e30574
`````

Run suggested steps:

````bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
````

Check results on the master node:

````bash
[admin@kube-master1 ~]$ kubectl get nodes
NAME                        STATUS   ROLES                  AGE    VERSION
kube-master1.ocp.home.lab   Ready    control-plane,master   14m    v1.23.5
````

````bash
[admin@kube-master1 ~]$ kubectl describe node kube-master1.ocp.home.lab | grep NoSchedule
Taints:             node-role.kubernetes.io/master:NoSchedule
````

````bash
[admin@kube-master1 ~]$ kubectl taint nodes --all node-role.kubernetes.io/master-
node/kube-master1.ocp.home.lab untainted
````

````bash
[admin@kube-master1 ~]$ kubectl describe node kube-master1.ocp.home.lab | grep NoSchedule
````

## Initialize worker nodes

Run suggested steps from control plane initialization from the previous step.


````bash
sudo kubeadm join 192.168.11.71:6443 --token 44ph3l.4g2dyf2w1zlhsfea --discovery-token-ca-cert-hash sha256:44cbeb23b7d600e02c42690c6de03d5aa3cbad3dfec356fbb9afcb7c89e30574
````

And check result on the control node:

````bash
[admin@kube-master1 files]$ kubectl get nodes
NAME                        STATUS   ROLES                  AGE     VERSION
kube-master1.ocp.home.lab   Ready    control-plane,master   3m32s   v1.23.5
kube-worker2.ocp.home.lab   Ready    <none>                 13s     v1.23.5

````

## Initialize cluster network. 

I order to manage communication between clusters we need to install network operator. For these purpose I applied ``kube-flannel``.

Download [kube-flannel.yml](https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml) and edit it. Change *network* and *type* fields:

````bash
.....
  net-conf.json: |
    {
      "Network": "10.85.0.0/16",
      "Backend": {
        "Type": "host-gw"
      }
    }
.....
````

And apply the file. This will install flannel. 

````bash
kubectl apply -f kube-flannel.yaml
````

And check, if pod has been started:

````bash
[admin@kube-master1 files]$ kubectl get pods -n kube-system
....
kube-flannel-ds-slmth                               1/1     Running   0             56s
......
````

Network i configured.

Let's check node info:

````bash
[admin@kube-master1 ~]$ kubectl get node kube-master1.ocp.home.lab -o json | jq -r .status.nodeInfo
{
  "architecture": "amd64",
  "bootID": "f2e99e5f-fb80-4a43-874c-c453a7718acc",
  "containerRuntimeVersion": "cri-o://1.22.3",
  "kernelVersion": "5.16.18-200.fc35.x86_64",
  "kubeProxyVersion": "v1.23.5",
  "kubeletVersion": "v1.23.5",
  "machineID": "e155c9da8fb44c0d9d39f78b8091257f",
  "operatingSystem": "linux",
  "osImage": "Fedora Linux 35 (Server Edition)",
  "systemUUID": "95f225e2-3e81-4282-9a95-f3eee6ee12ac"
}
````

**This post is not finished.**


## References


{% endraw %}
