---
layout: single
title: "Creating persistance storage for openshift using NFS Shares"
subtitle: ""
date: 2021-11-17 16:30:00 +0100
background: '/image/01.jpg'
tags: ['openshift']
---

{% raw %}

In this note, I will briefly describe the process of mounting NFS shares to an OpenShift cluster to create persistent storage volumes. This can be crucial for applications that require consistent storage across pod rescheduling or deployment.


## Creaing a persistent volume resource 

The first step involves creating a YAML file for the persistent volume. I named this file ``setup_pv.yaml``. Here's an example of what the file contains:

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

This YAML file defines a persistent volume named ``test-pv`` with a capacity of 10Gi (gigabytes). It specifies the NFS share located at ``/opt/okdn_share/test`` on the server with an IP address of 192.168.11.61. The access mode ReadWriteMany allows the volume to be mounted by multiple nodes simultaneously.

> Tip: Use the ``showmount -e 192.168.11.61`` command to print a list of available shares on the host.

## Appling resource and checking results
After creating the setup_pv.yaml file, the next step is to apply it using the OpenShift CLI (oc). This can be done with the following command:

````bash
oc create -f setup_pv.yml
````

This command instructs OpenShift to create a persistent volume based on the specifications in the YAML file.

Finally, to verify that the persistent volume has been successfully created, use the following command. In the output should show the ``test-pv`` with its capacity, access modes, and its current status.

````bash
[admin@dns try]$ oc get pv
NAME      CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   REASON   AGE
test-pv   10Gi       RWX            Retain           Available                                   22h
[admin@dns try]$ 
````

{% endraw %}