---
layout: single
title: "Installing Kubernetes Cluster at the Homelab: Cluster setup"
subtitle: ""
date: 2024-10-23 08:15:00 +0100
background: '/image/01.jpg'
tags: ['kubernetes']
---

{% raw %}


This note is the third part in a series about installing Kubernetes. You can find the previous parts [here](./2024-10-05-kubernetes-install-1) and [here](./2024-10-20-kubernetes-install-2). In this part, we will cover how to initialize the Kubernetes cluster and set up networking using Calico.

### Step 1: Initialize the Cluster

Begin by initializing the Kubernetes cluster on the first master node:

```bash
kubeadm init --control-plane-endpoint="192.168.11.21:6443" --upload-certs --apiserver-advertise-address=192.168.11.71 --pod-network-cidr=192.168.0.0/16
```

- **`--control-plane-endpoint="192.168.11.21:6443"`**: Specifies the IP address of the HAProxy load balancer.
- **`--apiserver-advertise-address=192.168.11.71`**: The IP address of the node running the command.
- **`--pod-network-cidr=192.168.0.0/16`**: Defines the CIDR range for the pod network.

After executing this command, `kubeadm` will provide further instructions for setting up additional nodes and deploying the pod network.

### Step 2: Deploy Calico Network

Once the cluster is initialized, deploy Calico for the pod network:

```bash
kubectl --kubeconfig=/etc/kubernetes/admin.conf create -f https://docs.projectcalico.org/v3.15/manifests/calico.yaml
```

Calico is a popular choice for managing Kubernetes networking and ensures seamless communication between pods.

### Optional Steps: Regenerate Certificates

You can regenerate cluster certificates if needed, using the following command on the first master node:

```bash
kubeadm init phase upload-certs --upload-certs
[upload-certs] Storing the certificates in Secret "kubeadm-certs" in the "kube-system" Namespace
[upload-certs] Using certificate key:
f228f02ee8fc90e31758cea0455806997d01cdda977e2ad03ab2f729b0da69f8
```

This command will upload the certificates to a Secret named `kubeadm-certs` in the `kube-system` namespace.

### Step 3: Generate Join Commands

Use the generated certificate key to create join tokens for other master or worker nodes:

- **For Master Nodes**:
  ```bash
  [root@kube-master1 ~]# kubeadm token create --print-join-command --certificate-key f228f02ee8fc90e31758cea0455806997d01cdda977e2ad03ab2f729b0da69f8 
  ````
  Output:
  ````bash
  kubeadm join 192.168.11.21:6443 --token ivb497.vc9cugiqlr6dpeg5 --discovery-token-ca-cert-hash sha256:56c4a1c8dd067ca1f60ffbc4d5140cf5c17edb97e8bc6d804ecc5c343bc044a0 --control-plane --certificate-key f228f02ee8fc90e31758cea0455806997d01cdda977e2ad03ab2f729b0da69f8
  ```

- **For Worker Nodes**:
  ```bash
  [root@kube-master1 ~]# kubeadm token create --print-join-command
  ````
  Output:

  ````bash
  kubeadm join 192.168.11.21:6443 --token ap8kar.25w1p7ybhoqzj4pe --discovery-token-ca-cert-hash sha256:56c4a1c8dd067ca1f60ffbc4d5140cf5c17edb97e8bc6d804ecc5c343bc044a0
  ```

These commands will allow you to join new master or worker nodes to the cluster.

### Step 4: Configure Kubectl Access

To set up `kubectl` on your master node for managing the cluster:

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

### Step 5: Managing the Cluster from Another Host

To manage the cluster from a different machine (e.g., a Fedora workstation), install `kubectl` and set up configuration:

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo cp kubectl /usr/local/bin/
sudo chmod 755 /usr/local/bin/kubectl

scp k-master1:.kube/admin.conf .kube/
echo "export KUBECONFIG=/home/admin/.kube/admin.conf" >> ~/.bashrc
bash
kubectl get nodes
```

{% endraw %}

