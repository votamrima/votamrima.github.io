---
layout: single
title: "My First Experience with Helm"
subtitle: ""
date: 2022-06-19 18:00:00 +0100
background: '/image/01.jpg'
tags: ['helm']
---

{% raw %}

In this article, I'd like to share my initial activity using Helm, a powerful tool for managing Kubernetes applications. Helm simplifies deploying and managing complex Kubernetes applications with its package management features. Here’s how I got started with it.


## Installation

I began by installing Helm, following these steps:

1. Download: I downloaded the latest version of Helm from [official repository](https://github.com/helm/helm/releases)
2. Unpack the Archive: I used the command ``tar fzx helm-v3.9.0-linux-amd64.tar.gz`` to unpack the downloaded file.
3. Update ``~/.bashrc``: To ensure Helm was available in my command line, I added it to my ``PATH`` in the ``~/.bashrc`` file:

````bash
HELM_PATH="/opt/helm/linux-amd64"
PATH=$PATH:$HELM_PATH
````

## Using Helm

### Adding a New Repository

To add a new repository, I used the following command:

````bash
[admin@podman helm]$ helm repo add bitnami https://charts.bitnami.com/bitnami
"bitnami" has been added to your repositories
````

### Listing Existing Repositories
I checked the existing repositories on my machine using the same command as above. It confirmed that the Bitnami repo was successfully added.


## Creating a Helm Chart
I took these steps to create my first Helm chart:

1. Initialize the Chart:

````bash
[admin@workstation first-chart]$ helm create first-chart
Creating first-chart
````

2. Customize ``values.yml``: As a beginner, I made simple edits to the ``values.yml`` file:

* Set ``nameOverride`` and ``fullnameOverride``:

````yaml
nameOverride: "first-chart"
fullnameOverride: "first-chart"
````

* Updated the ``serviceAccount`` name:

````yaml
serviceAccount:
  create: true
  annotations: {}
  name: "firstapp"
````

* Changed the service type from ``ClusterIP`` to ``NodePort``:

````yaml
service:
  type: NodePort
  port: 80
````

## Deploying the Chart

To deploy the chart, I ran:

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
[admin@workstation first-chart]$ 
````

### Checking Kubernetes Pod Status
Finally, I checked the status of the Kubernetes pod:

````bash
[admin@workstation first-chart]$ kubectl get pods
NAME                           READY   STATUS    RESTARTS   AGE
first-chart-6cd58dc9ff-bh9lw   1/1     Running   0          17s
[admin@workstation first-chart]$ 

````

To continuously monitor the pods it would be usefull to use the ``watch`` command.

This was my introduction to Helm. 

## References
- [Helm documentation](https://helm.sh/docs)
- [How To Create A Helm Chart](https://phoenixnap.com/kb/create-helm-chart)

{% endraw %}
