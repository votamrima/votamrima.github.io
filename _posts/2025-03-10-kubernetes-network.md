---
layout: single
title: "Kubernetes Network"
subtitle: ""
date: 2025-03-10 08:15:00 +0100
background: '/image/kubernetes-network.png'
tags: ['kubernetes','network']
categories:
  - Kubernetes
---

{% raw %}

This is the some note about the Kubernetes network.

### Network Types
Generally there are following types of network communication are used in Kubernetes:
- Node communication is handled by the physical network of the host through the network adapters.
- External2Service - is managed by Kubernetes Service
- Pod2Service - is managed by Kubernetes Service
- Pod2Pod - is managed by the network plugin
- Container2Container - is managed inside the Pod



### Network Add-ons  
Kubernetes does not include a default network add-on. Instead, it provides the **Container Network Interface (CNI)**, which is a standard interface allowing different networking plugins to be used.  

Using network add-ons enables features such as **NetworkPolicy**, **IPv6**, and **RBAC (Role-Based Access Control)** at the network level. These add-ons allow us to define a software-based pod network.  

Different vendors provide networking solutions for Kubernetes. Depending on the network provider you choose, you can integrate their solution into your Kubernetes cluster. If you do not have a preference for a specific vendor, you can select a general-purpose network add-on. Below are some widely used network add-ons:  

- **Calico** – The most widely used network add-on. It comes with built-in support for all essential networking features.  
- **Flannel** – Slightly outdated and does not support network policies.  
- **Multus** – The default plugin in OpenShift, capable of working with multiple network plugins.  
- **Weave** – Another commonly used network plugin that supports all essential networking features.  




{% endraw %}

