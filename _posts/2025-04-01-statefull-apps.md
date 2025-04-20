---
layout: single
title: "Running Stateful Applications on Kubernetes with Local Storage"
subtitle: ""
date: 2025-04-20 08:15:00 +0100
background: '/image/01.jpg'
tags: ['kubernetes']
categories:
  - Kubernetes
---

{% raw %}


In this article, I will walk through how to deploy a stateful application on a Kubernetes cluster using local storage. We'll use Nginx as our example application.

## Overview

When deploying stateful applications, data persistence is crucial. This article outlines the process of configuring local storage on multiple nodes within a Kubernetes cluster and deploying a StatefulSet to use this storage.

## Prerequisites

- Kubernetes cluster with two worker nodes.
- No default storage class pre-installed.

## Step 1: Creating a Storage Class

Since local volumes in Kubernetes (version 1.32 and earlier) do not support dynamic provisioning, you must manually create a StorageClass. This class delays volume binding until a pod is scheduled to a node.

Here's the YAML definition for the StorageClass which I used:

````yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
````

Apply this configuration:

````yaml
[admin@workstation practice]$ kubectl apply -f storage-class.yml 
storageclass.storage.k8s.io/local-storage created
[admin@workstation practice]$ kubectl get sc
NAME            PROVISIONER                    RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
local-storage   kubernetes.io/no-provisioner   Delete          WaitForFirstConsumer   false                  7s
[admin@workstation practice]$ 
````

## Step 2: Creating Persistent Volumes (PV)

My cluster consists of two worker nodes, and I intended to run two Nginx pods per node. Therefore, I created two PersistentVolumes (PVs) on each node, totaling four PVs.​

Here's an example YAML for one of the PVs:​

````yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: local-pv-2-worker2
spec:
  capacity:
    storage: 1Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: local-storage
  local:
    path: /opt/volume
  nodeAffinity:
    required:
      nodeSelectorTerms:
        - matchExpressions:
            - key: kubernetes.io/hostname
              operator: In
              values:
                - kube-worker2.home.lab
````

I applied each PV configuration and verified their status using:

````yaml
kubectl apply -f persistentvolumeXX.yaml

[admin@workstation practice]$ kubectl get pv
NAME                 CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                 STORAGECLASS    VOLUMEATTRIBUTESCLASS   REASON   AGE
local-pv-1-worker1   1Gi        RWO            Retain           Bound    default/www-nginx-0   local-storage   <unset>                          10m
local-pv-1-worker2   1Gi        RWO            Retain           Bound    default/www-nginx-2   local-storage   <unset>                          2m
local-pv-2-worker1   1Gi        RWO            Retain           Bound    default/www-nginx-1   local-storage   <unset>                          7m12s
local-pv-2-worker2   1Gi        RWO            Retain           Bound    default/www-nginx-3   local-storage   <unset>                          106s
````

Note: One PV supports one pod. If a node has two PVs, it supports two pods.

## Step 3: Deploying the Stateful Application

With the StorageClass and PVs in place, I proceeded to deploy the Nginx application as a StatefulSet. This configuration ensures that each pod has a stable identity and persistent storage.​

Here's a YAML which I used to run Nginx application and service:

````bash
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: nginx
spec:
  serviceName: "nginx"
  replicas: 4
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:latest
          ports:
            - containerPort: 80
          volumeMounts:
            - name: www
              mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
    - metadata:
        name: www
      spec:
        accessModes: [ "ReadWriteOnce" ]
        storageClassName: "local-storage"
        resources:
          requests:
            storage: 1Gi

---
apiVersion: v1
kind: Service
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  ports:
  - port: 80
    name: web
  clusterIP: None
  selector:
    app: nginx
````

I used the following command to apply the StatefulSet and associated service:​

````bash
[admin@workstation practice]$ kubectl apply -f stateful2.yaml 
statefulset.apps/nginx created
service/nginx created
[admin@workstation practice]$ 
admin@workstation practice]$ kubectl get pods -o wide
NAME      READY   STATUS    RESTARTS   AGE     IP                NODE                    NOMINATED NODE   READINESS GATES
nginx-0   1/1     Running   0          4m49s   192.168.240.41    kube-worker1.home.lab   <none>           <none>
nginx-1   1/1     Running   0          4m47s   192.168.240.40    kube-worker1.home.lab   <none>           <none>
nginx-2   1/1     Running   0          4m45s   192.168.195.165   kube-worker2.home.lab   <none>           <none>
nginx-3   1/1     Running   0          3m42s   192.168.195.166   kube-worker2.home.lab   <none>           <none>
[admin@workstation practice]$ 
````

## Understanding PersistentVolumeClaims (PVCs) and Their Association with PersistentVolumes (PVs)

In Kubernetes, a PersistentVolumeClaim (PVC) is a request for storage by a user. It specifies the desired storage capacity, access modes, and other parameters. When I create a PVC, Kubernetes automatically searches for a suitable PersistentVolume (PV) that matches the PVC's requirements. Once a matching PV is found, Kubernetes binds the PVC to that PV, allowing the pod to use the storage.​

This binding process is crucial because it decouples the storage provisioning from the pod lifecycle, ensuring that data persists even if the pod is deleted or rescheduled. By using PVCs, I can manage storage resources more flexibly and ensure that my stateful applications have the persistent storage they need.​

"The storage backend for PVCs can be a lot of different technologies (NFS, Cloud-Disk, Rook, etc.) but the Interface the Pod uses is always the same (PV). This allows for more flexibility when working with persistent storage."[Direct Link to the source](https://www.reddit.com/r/kubernetes/comments/17kspnx/comment/k79osiw/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button)

By following these steps and understanding the role of PVCs, I successfully deployed a stateful Nginx application on my Kubernetes cluster using local persistent volumes.

## Reference:

- [Kubernetes Persistent Volume. Official Documentation](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
- [configure-persistent-volume-storage](https://kubernetes.io/docs/tasks/configure-pod-container/configure-persistent-volume-storage/)
- [Kubernetes Persistent Volume Claims: Tutorial & Top Tips](https://www.groundcover.com/blog/kubernetes-pvc)


{% endraw %}

