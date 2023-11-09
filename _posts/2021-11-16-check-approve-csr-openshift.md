---
layout: single
title: "Check and approve pendings csrs in Openshift cluster"
subtitle: ""
date: 2021-11-16 18:30:00 +0100
#background: '/img/posts/01.jpg'
tags: ['openshift']
---

{% raw %}

After installing Openshift cluster you should log in and check for csr. Moreover, I regularly controls if some csr have to be approved or not.

````
[admin@ocp4 try]$ oc get csr
NAME        AGE     SIGNERNAME                                    REQUESTOR                                        CONDITION
csr-6m4m7   4m29s   kubernetes.io/kube-apiserver-client-kubelet   system:node:etcd-2.okd4.home.lab                 Approved,Issued
csr-7qww9   4m13s   kubernetes.io/kube-apiserver-client-kubelet   system:node:okd4-compute-1.okd4.home.lab         Approved,Issued
csr-glzgb   4m29s   kubernetes.io/kube-apiserver-client-kubelet   system:node:okd4-control-plane-1.okd4.home.lab   Pending
csr-lsdcc   4m19s   kubernetes.io/kube-apiserver-client-kubelet   system:node:etcd-3.okd4.home.lab                 Pending
csr-nwjpv   35s     kubernetes.io/kube-apiserver-client-kubelet   system:node:okd4-control-plane-1.okd4.home.lab   Approved,Issued
````

As you can see, there is some certificates in Pending status. In order to approve each of them manually, run the following command:
````
oc adm certificate approve <csr_name>
````

And use `jq` tool to verify all csr at once:
````
[admin@ocp4 try]$ oc get csr -ojson | jq -r '.items[] | select(.status == {} ) | .metadata.name' | xargs oc adm certificate approve
certificatesigningrequest.certificates.k8s.io/csr-glzgb approved
certificatesigningrequest.certificates.k8s.io/csr-lsdcc approved
[admin@ocp4 try]$ oc get csr
NAME        AGE     SIGNERNAME                                    REQUESTOR                                        CONDITION
csr-6m4m7   5m5s    kubernetes.io/kube-apiserver-client-kubelet   system:node:etcd-2.okd4.home.lab                 Approved,Issued
csr-7qww9   4m49s   kubernetes.io/kube-apiserver-client-kubelet   system:node:okd4-compute-1.okd4.home.lab         Approved,Issued
csr-glzgb   5m5s    kubernetes.io/kube-apiserver-client-kubelet   system:node:okd4-control-plane-1.okd4.home.lab   Approved,Issued
csr-lsdcc   4m55s   kubernetes.io/kube-apiserver-client-kubelet   system:node:etcd-3.okd4.home.lab                 Approved,Issued
csr-nwjpv   71s     kubernetes.io/kube-apiserver-client-kubelet   system:node:okd4-control-plane-1.okd4.home.lab   Approved,Issued
[admin@ocp4 try]$ 
````


{% endraw %}