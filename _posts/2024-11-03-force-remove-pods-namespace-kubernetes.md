---
layout: single
title: "Force deleting stuck resources in Kubernetes"
subtitle: ""
date: 2024-11-03 08:15:00 +0100
background: '/image/01.jpg'
tags: ['kubernetes','helm']
---

{% raw %}


Sometimes, deleting resources in Kubernetes can be problematic, especially when they are stuck in a `Terminating` state. This note describes a solution I used to forcibly remove resources from the `cert-manager` namespace when the standard delete commands failed.

### What went wrong

I was installing cert-manager resources, but something went wrong, and the pods failed to start up. Unfortunately, using gentle deletion commands like `kubectl delete pods -n cert-manager`, `kubectl delete all --all -n cert-manager`, and `kubectl delete namespace cert-manager --force` did not succeed.

### Deleting the namespace

To delete all resources in the `cert-manager` namespace, I decided to delete the namespace directly using these steps:

**Export the namespace json**:

```bash
kubectl get namespace cert-manager -o json > /tmp/cert-manager-namespace.json
```

**In the exported JSON, remove the finalizers field so it looks like this**:

```yaml
   "spec": {
       "finalizers": []
   },   
```

**Replace the namespace definition**:

```bash
kubectl replace --raw "/api/v1/namespaces/cert-manager/finalize" -f /tmp/cert-manager-namespace.json
```

After these steps, the namespace was deleted, but the pods were still stuck in a `Terminating` status.

### Removing orphaned pods

To delete the orphaned pods, I proceeded with the following steps:

**Run ``kubectl proxy`` This allows communication directly with the Kubernetes API.**

```bash
kubectl proxy &
```

**Identify terminating pods:**

```bash
kubectl get pods --field-selector=status.phase!=Terminating -n cert-manager
```

**Force delete all terminating pods:**

```bash
kubectl get pods --field-selector=status.phase!=Terminating -n cert-manager -o json | jq -r '.items[] | "kubectl delete pod \(.metadata.name) -n \(.metadata.namespace) --grace-period=0 --force"' | sh
```

These commands allowed me to successfully delete the stuck resources and clean up the environment.



{% endraw %}

