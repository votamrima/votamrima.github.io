---
layout: single
title: "Installing and configuring Rancher using Helm"
subtitle: ""
date: 2024-10-23 08:15:00 +0100
background: '/image/01.jpg'
tags: ['kubernetes','helm']
---

{% raw %}


This note is about installing and configuring Rancher on the Kubernetes cluster. The easies way of that using Helm which I am describing in this note. 


## Installing helm

As I use Fedora as my main Workstation, it is more preferable to me install helm using yum (or dnf) package manager. Helm is available on the official repository.

````bash
sudo yum install helm
````

## Rancher pre-installation 

### Creating namespace
For installing Rancher using helm, I created a new Kubernetes namespace where the resources will be installed. The default name of this namespace is called ``cattle-system``. It is important to name the namespace for rancher ``cattle-system``.

````bash
admin@fedora40:~$ kubectl create namespace cattle-system
namespace/cattle-system created
````

### Add helm chart repository 

I added two repositories of rancher:

````bash
admin@fedora40:~$ helm repo add rancher-latest https://releases.rancher.com/server-charts/latest
"rancher-latest" has been added to your repositories
admin@fedora40:~$ helm repo add rancher-stable https://releases.rancher.com/server-charts/stable
"rancher-stable" has been added to your repositories
admin@fedora40:~$ 
````

### Configure SSL configuration

The Rancher management server requires SSL/TLS configuration.

According to Rancher installation documentation, there are multiple options for the source of the certificate. Most recommended are 
- Rancher-generated TLS certificate
- Let's Encrypt
- Your own certificate

I used to apply the first option - Rancher-generated certificate. In this case is needed to install ``cert-manager`` into the cluster.



````bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.16.1/cert-manager.yaml
````

And check if all pods of cert-manager are running:

````bash
admin@fedora40:~$ kubectl get pods -n cert-manager
NAME                                       READY   STATUS    RESTARTS   AGE
cert-manager-5c887c889d-gxlsl              1/1     Running   0          5m4s
cert-manager-cainjector-58f6855565-slkn2   1/1     Running   0          5m4s
cert-manager-webhook-6647d6545d-psqqd      1/1     Running   0          5m4s
admin@fedora40:~$ 
````

## Rancher installation




## Reference:

- [https://helm.sh/docs/intro/install/](https://helm.sh/docs/intro/install/)
- [Install the Rancher Helm Chart](https://ranchermanager.docs.rancher.com/getting-started/installation-and-upgrade/install-upgrade-on-a-kubernetes-cluster#install-the-rancher-helm-chart)
- [cert-manager installation](https://cert-manager.io/docs/installation/)

{% endraw %}

