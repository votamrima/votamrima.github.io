---
layout: single
title: "Graceful Stop and Start of an OpenShift 4 Cluster"
subtitle: ""
date: 2022-02-10 20:00:00 +0100
background: '/image/01.jpg'
tags: ['openshift']
---

{% raw %}


In this post, I'll briefly describe my personal experience with shutting down and starting up an OpenShift 4.9 cluster. This process is essential for system maintenance, updates, or other scenarios where a controlled restart is necessary.

## Preparation

Before proceeding with the shutdown, it's crucial to ensure that all nodes and pods are running correctly.

**Check Node Status**:

````bash
oc get nodes --show-labels
````

This command will display the status and labels of all nodes in the cluster.

**Check Pod Status:**

````bash
oc get pods --all-namespaces
````

This provides an overview of all pods across all namespaces, which is useful to verify their current state. It's a good practice to save this output to compare the state of the cluster post-restart.

**Backup Namespaces:**

Consider creating backups of your namespaces. Tools like [Velero](https://velero.io) can be used for this purpose.

## Shutdown cluster:

**Shutdown Worker Nodes:**

Each worker node should be shut down gracefully. Use the command:

````bash
shutdown -h now
````

Run this command on each worker node.

**Shutdown Infra Nodes:**

After the worker nodes, proceed with the infra nodes using the same command:

````bash
shutdown -h now
````

This ensures that infra services are safely turned off.

**Shutdown Master Nodes:**

Finally, shut down all the master nodes:

````bash
shutdown -h now
````

The master nodes should be the last to shut down to maintain control over the cluster for as long as possible.

## Start Cluster
Starting the cluster involves a reverse process of the shutdown.

1. **Start Master Nodes:**

Boot up all the master nodes first. This is crucial as they control the cluster.

2. **Start Infra Nodes:**

After the master nodes are online, start the infra nodes.

3. **Start Worker Nodes:**

Finally, bring up all the worker nodes.

**Verify Node Startup:**

Check if all nodes have started successfully:

````bash
oc get nodes
````

**Verify Pod Status:**

Ensure that all pods are running correctly:

````bash
oc get pods --all-namespaces
````

This verification step is important to confirm that the cluster is fully operational and that all services are running as expected.

## Conclusion

This guide is based on my personal experience with managing an OpenShift 4 cluster. It's always recommended to follow the official OpenShift documentation for specific operational procedures.

## Reference:
[How To: Stop and start a production OpenShift Cluster](https://www.redhat.com/en/blog/how-stop-and-start-production-openshift-cluster)

{% endraw %}
