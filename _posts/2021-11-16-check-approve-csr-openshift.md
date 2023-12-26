---
layout: single
title: "Checking and approving pending CSRs in an OpenShift Cluster"
subtitle: ""
date: 2021-11-16 18:30:00 +0100
#background: '/img/posts/01.jpg'
tags: ['openshift']
---

{% raw %}

After installing an OpenShift cluster, it's essential to log in and check for Certificate Signing Requests (CSRs). Regularly monitoring and approving these requests ensures that nodes and services in your cluster are correctly authenticated and authorized.

````bash
[admin@ocp4 try]$ oc get csr
NAME        AGE     SIGNERNAME                                    REQUESTOR                                        CONDITION
csr-6m4m7   4m29s   kubernetes.io/kube-apiserver-client-kubelet   system:node:etcd-2.okd4.home.lab                 Approved,Issued
csr-7qww9   4m13s   kubernetes.io/kube-apiserver-client-kubelet   system:node:okd4-compute-1.okd4.home.lab         Approved,Issued
csr-glzgb   4m29s   kubernetes.io/kube-apiserver-client-kubelet   system:node:okd4-control-plane-1.okd4.home.lab   Pending
csr-lsdcc   4m19s   kubernetes.io/kube-apiserver-client-kubelet   system:node:etcd-3.okd4.home.lab                 Pending
csr-nwjpv   35s     kubernetes.io/kube-apiserver-client-kubelet   system:node:okd4-control-plane-1.okd4.home.lab   Approved,Issued
````

As shown above, some certificates are in a 'Pending' status. To approve each of them manually, use the following command:

````bash
oc adm certificate approve <csr_name>
````

Alternatively, you can use the jq tool to approve all pending CSRs at once:

````bash
[admin@ocp4 try]$ oc get csr -ojson | jq -r '.items[] | select(.status == {} ) | .metadata.name' | xargs oc adm certificate approve
certificatesigningrequest.certificates.k8s.io/csr-glzgb approved
certificatesigningrequest.certificates.k8s.io/csr-lsdcc approved
````

After running the approval commands, verify that all CSRs have been approved:

````bash

[admin@ocp4 try]$ oc get csr
NAME        AGE     SIGNERNAME                                    REQUESTOR                                        CONDITION
csr-6m4m7   5m5s    kubernetes.io/kube-apiserver-client-kubelet   system:node:etcd-2.okd4.home.lab                 Approved,Issued
csr-7qww9   4m49s   kubernetes.io/kube-apiserver-client-kubelet   system:node:okd4-compute-1.okd4.home.lab         Approved,Issued
csr-glzgb   5m5s    kubernetes.io/kube-apiserver-client-kubelet   system:node:okd4-control-plane-1.okd4.home.lab   Approved,Issued
csr-lsdcc   4m55s   kubernetes.io/kube-apiserver-client-kubelet   system:node:etcd-3.okd4.home.lab                 Approved,Issued
csr-nwjpv   71s     kubernetes.io/kube-apiserver-client-kubelet   system:node:okd4-control-plane-1.okd4.home.lab   Approved,Issued
[admin@ocp4 try]$ 
````

Regularly checking and approving pending CSRs is a vital administrative task in managing an OpenShift cluster. This process helps maintain the security and proper functioning of the cluster.

{% endraw %}