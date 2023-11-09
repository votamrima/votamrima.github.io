---
layout: single
title: "Create persistance storage for openshift"
subtitle: ""
date: 2021-11-17 16:30:00 +0100
background: '/image/01.jpg'
tags: ['openshift']
---

{% raw %}

Here I am going to shortly describe a process of mounting a NFS shares to Openshift cluster.

## Create persistent volume resource 

Firstly, I created a ``setup_pv.yaml`` file with following content:

````yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: test-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  nfs:
    path: /opt/okdn_share/test
    server: 192.168.11.61
````

According to the yaml file I used share from the host 192.168.11.61, path ``/opt/okdn_share/test``. Name of the storage will be test-pv. 

> ``showmount -e 192.168.11.61`` command prints list of available shares that available on the host. 

## Apply resource and check results

When yaml file is created, create apply it using oc command:

````bash
oc create -f setup_pv.yml
````

And finally, check if a persistence volume is created:

````bash
[admin@dns try]$ oc get pv
NAME      CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   REASON   AGE
test-pv   10Gi       RWX            Retain           Available                                   22h
[admin@dns try]$ 
````

{% endraw %}