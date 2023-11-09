---
layout: single
title: "Stop and start Openshift 4 cluster"
subtitle: ""
date: 2022-02-10 20:00:00 +0100
background: '/image/01.jpg'
tags: ['openshift']
---

{% raw %}


In this post I describe shortly how to shutdown and start up Openshift cluster. 

## Preparation

Check if all nodes are properly running:

````bash
oc get nodes --show-labels
````

Check if all pods in all projects are working properly. Save the current state:

````bash
oc get pods --all-namespaces
````

Additionally, you can create backup of namespaces. See [velero](https://velero.io).


## Shutdown cluster:

1. Gracefully shutdown all worker nodes: ``shutdown -h now``

2. Gracefully shutdown Infra nodes: ``shutdown -h now``

3. Gracefully shutdown all masters: ``shutdown -h now``


## Start cluster:

1. Start master nodes.

2. Start infra nodes.

3. Start worker node.

Check if nodes are started: ``oc get nodes``

Check if pods are working: ``oc get pods --all-namespaces``

## Reference:
[How To: Stop and start a production OpenShift Cluster](https://www.redhat.com/en/blog/how-stop-and-start-production-openshift-cluster)

{% endraw %}
