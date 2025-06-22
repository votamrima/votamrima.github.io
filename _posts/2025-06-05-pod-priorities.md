---
layout: single
title: "Configuring Pod Priorities"
subtitle: ""
date: 2025-06-18 08:15:00 +0100
background: '/image/01.jpg'
tags: ['kubernetes']
categories:
  - Kubernetes
---
{% raw %}


In this short article, I'll go through the prioritizing pods in Kubernetes.


- By default, the kube-scheduler doesn't have any priorities.

- Scheduling priority is managed using ``PriorityClass`` resource.

- The higher value of the ``PriorityClass`` gives higher priority

- When resources are scarce, **lower-priority pods** are evicted to make room for higher-priority ones.

- By using ``preemptionPolicy`` with the **never** value will prevent eviction for pods, even for high-priority ones.

- Using a certain priority ``PriorityClass`` is managed through ``priorityClassName``. 

- The defined ``PriorityClass`` can be set as ``globalDefault``, which means that all pods without specified class will be scheduled with this class.


## Example commands

- Creating **priorityClass** named **high-priority**, with priority value **1000** and preemtion-policy **Never**

````bash
[admin@workstation ~]$ kubectl create priorityclass high-priority --value=1000 --description="High priority class" --preemption-policy="Never"
priorityclass.scheduling.k8s.io/high-priority created
[admin@workstation ~]$
[admin@workstation ~]$ kubectl get priorityclasses.scheduling.k8s.io
NAME                      VALUE        GLOBAL-DEFAULT   AGE   PREEMPTIONPOLICY
high-priority             1000         false            10s   Never
system-cluster-critical   2000000000   false            13d   PreemptLowerPriority
system-node-critical      2000001000   false            13d   PreemptLowerPriority
[admin@workstation ~]$
````

- Creating another **priorityClass** named **mid-priority**, with priority value **125**. This class is predefined as default global class

````bash
[admin@workstation ~]$ kubectl create priorityclass mid-priority --value=125 --description="mid priority" --global-default=true
priorityclass.scheduling.k8s.io/mid-priority created
[admin@workstation ~]$
[admin@workstation ~]$ kubectl get priorityclasses.scheduling.k8s.io
NAME                      VALUE        GLOBAL-DEFAULT   AGE   PREEMPTIONPOLICY
high-priority             1000         false            13m   Never
mid-priority              125          true             6s    PreemptLowerPriority
system-cluster-critical   2000000000   false            13d   PreemptLowerPriority
system-node-critical      2000001000   false            13d   PreemptLowerPriority
[admin@workstation ~]$
````

- Running testpod 

````bash
[admin@workstation ~]$ kubectl run testpod --image=nginx
pod/testpod created
[admin@workstation ~]$
````

- Check which priorityclass is applied by default

````bash
[admin@workstation ~]$ kubectl get pod testpod -o yaml | grep -B 2 -i priorityclass
  preemptionPolicy: PreemptLowerPriority
  priority: 125
  priorityClassName: mid-priority
[admin@workstation ~]$
````

- Deploying new image

````bash
[admin@workstation ~]$ kubectl create deploy testpod-highprio --image nginx
deployment.apps/testpod-highprio created
[admin@workstation ~]$
````

- By default the pod of this deployment has the default priorityClass:

````bash
[admin@workstation ~]$ kubectl get pod testpod-highprio-598fcf4467-zj49m -o yaml | grep -B 2 -i priorityClass
  preemptionPolicy: PreemptLowerPriority
  priority: 125
  priorityClassName: mid-priority
[admin@workstation ~]$
````

- Changing ``priorityClass`` in deployment in ``spec.template.spec.priorityClassName``. 

````bash

[admin@workstation ~]$ kubectl edit deployments.apps testpod-highprio
````

````bash
spec:
  template:
    spec:
      priorityClassName: high-priority
````

- Add check the ``priorityClass`` of the pod

````bash
[admin@workstation ~]$ kubectl get pod testpod-highprio-c8cb74968-wjh86 -o yaml | grep -B 2 -i priorityClass
  preemptionPolicy: Never
  priority: 1000
  priorityClassName: high-priority
[admin@workstation ~]$
````

{% endraw %}
