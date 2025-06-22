---
layout: single
title: "Resource Limits and Quota"
subtitle: ""
date: 2025-06-10 08:15:00 +0100
background: '/image/01.jpg'
tags: ['kubernetes']
categories:
  - Kubernetes
---
{% raw %}


In this short article, I'll go through the resource limits and quota in Kubernetes.



## LimitRange

**LimitRange** is an API object that limits resource usage per container or Pod in a Namespace:

A ``LimitRange`` is a Kubernetes object used to:

- Automatically apply default CPU/memory limits and requests to pods/containers in a namespace

- Prevent pods from over-consuming resources

- Avoid the need to define limits in every pod manually

- works only within a single namespace.


Key Fields in ``LimitRange``:

1. **type**: Defines the scope of the limit:

	- ``Container``: applies to individual containers

	- ``Pod``: applies to the entire pod

	- ``PersistentVolumeClaim``: applies to storage requests

2. **defaultRequest**: 

	- If a container does not specify a request, this value is used automatically.

	- Request = the amount of resource guaranteed for the container.

3. **default**:

	- If a container does not specify a limit, this value is used automatically.

	- Limit = the maximum amount the container is allowed to use.


Example:

````yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: mem-cpu-limitrange
  namespace: dev
spec:
  limits:
  - type: Container
    default:
      cpu: "500m"
      memory: "512Mi"
    defaultRequest:
      cpu: "250m"
      memory: "256Mi"

````

What this does:

- If a container has no resource settings, it will:

	- Request: 250m CPU, 256Mi memory. It reservse 250m CPU & 256Mi memory for the container
	
	- Max Limit: 500m CPU, 512Mi memory. It restricts it to max 500m CPU & 512Mi memory

## Quota

A ``ResourceQuota`` is a Kubernetes API object that:

- Limits the total amount of resources (CPU, memory, storage, objects) that can be used in a namespace.

- Helps control resource usage at the **namespace level**, preventing a single team or app from using everything.


Some difference from LimitRange:

| **LimitRange**                                            | **ResourceQuota**                                                           |
| --------------------------------------------------------- | --------------------------------------------------------------------------- |
| Applies per **container/pod**                             | Applies to the entire **namespace**                                         |
| Sets **default values** or **max values** per pod         | Sets **overall cap** for the namespace                                      |
| Does **not require** the pod to specify resource requests | **Requires** pods to specify ``resources.requests`` and/or ``resources.limits`` |


Example **ResourceQuota** declarion:

````yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-resources
  namespace: dev
spec:
  hard:
    requests.cpu: "2"
    requests.memory: "2Gi"
    limits.cpu: "4"
    limits.memory: "4Gi"
````


We can create **ResourceQuota** using cli. 

````bash
kubectl create quota my-quota --hard cpu=100m,memory=500Mi,pods=3 -n limited
````

>you can get a create command using ``kubectl create quota --help``

To describe the created quota:

````bash
kubectl describe quota -n limited
````


Once the deployment created I noticed that there were no pods were started. After quick analyze I found out that the reason was that I didn't set any resource restriction. 

````bash
kubectl -n limited describe replicasets.apps nginx-5869d7778c 
````

To solve the issue, I needed to apply resource to the deployment:

````bash
kubectl -n limited set resources deploy nginx --requests cpu=100m,memory=5Mi --limits cpu=200m,memory=20Mi
````

> you can get a create command using ``kubectl set resources --help``


To change the current quota we should edit it using:

````bash
kubectl -n limited edit quota my-quota
````

Restart deployment:

````bash
kubectl -n limited rollout restart deployment nginx
````

{% endraw %}
