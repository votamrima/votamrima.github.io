---
layout: single
title: "First steps in helm"
subtitle: ""
date: 2022-06-19 18:00:00 +0100
background: '/image/01.jpg'
tags: ['helm']
---

{% raw %}

Here I would like to describe my first steps in learning helm.  

## Installation

I installed Helm using following instruction:

1. Downloaded the latest version from the website: [https://github.com/helm/helm/releases](https://github.com/helm/helm/releases)
2. Unpacked the archive: ``tar fzx helm-v3.9.0-linux-amd64.tar.gz``
3. Set following string into ~/.bashrc

````bash
HELM_PATH="/opt/helm/linux-amd64"
PATH=$PATH:$HELM_PATH
````

## Using Helm

Adding a new repo:

````bash
[admin@podman helm]$ helm repo add bitnami https://charts.bitnami.com/bitnami
"bitnami" has been added to your repositories
````

Listing all existing repos on the machine: 

````bash
[admin@podman helm]$ helm repo add bitnami https://charts.bitnami.com/bitnami
"bitnami" has been added to your repositories
````


## Create helm chart

First of all I run helm create command:

````bash
[admin@workstation first-chart]$ helm create first-chart
Creating first-chart
````

Secondly, customized some values in values.yml file. This is my first chart therefore I did edit some few lines. 

So, was set ``nameOverride`` and ``fullnameOverride`` values:

````yaml
nameOverride: "first-chart"
fullnameOverride: "first-chart"
````

Then, was updated name value in serviceAccount:

````yaml
serviceAccount:
  create: true
  annotations: {}
  name: "firstapp"
````

And finally, I changed service type from default ``ClusterIP`` to ``NodePort``:

````yaml
service:
  type: NodePort
  port: 80
````

To install this helm chart I run the following command:

````bash
[admin@workstation first-chart]$ helm install first-chart first-chart/ --values first-chart/values.yaml 
NAME: first-chart
LAST DEPLOYED: Sun Jun 19 17:23:24 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
1. Get the application URL by running these commands:
  export NODE_PORT=$(kubectl get --namespace default -o jsonpath="{.spec.ports[0].nodePort}" services first-chart)
  export NODE_IP=$(kubectl get nodes --namespace default -o jsonpath="{.items[0].status.addresses[0].address}")
  echo http://$NODE_IP:$NODE_PORT
[admin@workstation first-chart]$ kubectl get pods
NAME                           READY   STATUS              RESTARTS   AGE
first-chart-6cd58dc9ff-bh9lw   0/1     ContainerCreating   0          11s
myhello-5586c5c9bf-zmktx       1/1     Running             3          3d
[admin@workstation first-chart]$ kubectl get pods
NAME                           READY   STATUS              RESTARTS   AGE
first-chart-6cd58dc9ff-bh9lw   0/1     ContainerCreating   0          15s
myhello-5586c5c9bf-zmktx       1/1     Running             3          3d
[admin@workstation first-chart]$ watch kubectl get pods
````

And check the status of the kubernetes pod:

````bash
[admin@workstation first-chart]$ kubectl get pods
NAME                           READY   STATUS    RESTARTS   AGE
first-chart-6cd58dc9ff-bh9lw   1/1     Running   0          17s
[admin@workstation first-chart]$ 

````


## References
- [Helm documentation](https://helm.sh/docs)
- [How To Create A Helm Chart](https://phoenixnap.com/kb/create-helm-chart)

{% endraw %}
