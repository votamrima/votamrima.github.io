---
layout: single
title: "Installing Kubernetes Cluster at the Homelab: Installation"
subtitle: ""
date: 2024-10-20 08:15:00 +0100
background: '/image/01.jpg'
tags: ['kubernetes']
---

{% raw %}


This is the second part of the note. Previous one you are able to find [here](2024-10-05-kubernetes-install-1)

In this note I'm describing which packages and how they had been installed and configured. 

## Setting up Docker CE and configuring containerd 

### Step 1
First, add the Docker CE repository by installing the necessary plugins:

```bash
dnf install -y dnf-plugins-core
yum config-manager --add-repo=https://download.docker.com/linux/rhel/docker-ce.repo
```

### Step 2
Next, install `containerd.io`. Containerd is a runtime used for managing containers. 

```bash
dnf install -y containerd.io
```

### Step 3: 
Enable and start the containerd service:

```bash
systemctl enable --now containerd
```

### Step 4: 
My environment is running behind the proxy, I added proxy environment variables to the containerd service configuration:

```bash
SERVICE_FILE="/etc/systemd/system/multi-user.target.wants/containerd.service"
PROXY_SETTINGS=$(cat <<EOF
# {mark} ANSIBLE MANAGED BLOCK
Environment="NO_PROXY=127.0.0.1,localhost,192.168.11.0/8,10.96.0.1/16,192.168.0.0/16
Environment="HTTP_PROXY=http://192.168.11.51:3128"
Environment="HTTPS_PROXY=http://192.168.11.51:3128"
EOF
)

if grep -q "^\[Service\]" $SERVICE_FILE; then
  sed -i "/^\[Service\]/a $PROXY_SETTINGS" $SERVICE_FILE
else
  echo "[Service]" >> $SERVICE_FILE
  echo "$PROXY_SETTINGS" >> $SERVICE_FILE
fi
```

Reload the systemd daemon and restart containerd to apply the proxy settings:

```bash
systemctl daemon-reload
systemctl restart containerd
```

### Step 5
Copy the custom `config.toml` file to the containerd configuration directory:

```bash
cp files/config.toml /etc/containerd/config.toml
```

The content of the configuration file which I use is given below.

````vim
version = 2

[grpc]
  address = "/run/containerd/containerd.sock"
  gid = 0
  uid = 0
  max_recv_message_size = 16777216
  max_send_message_size = 16777216
  tcp_address = ""
  tcp_tls_ca = ""
  tcp_tls_cert = ""
  tcp_tls_key = ""
  


[plugins]
  [plugins."io.containerd.grpc.v1.cri"]
   sandbox_image = "registry.k8s.io/pause:3.10"
   [plugins."io.containerd.grpc.v1.cri".containerd]
      [plugins."io.containerd.grpc.v1.cri".containerd.runtimes]
        [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
          runtime_type = "io.containerd.runc.v2"
          [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
            SystemdCgroup = true
````

``version = 2``: Specifies the version of the containerd configuration format being used.
``[grpc]``: Starts the configuration section for gRPC, which is the protocol containerd uses for communication.
``address`` = "/run/containerd/containerd.sock": Defines the Unix socket that containerd will use for gRPC communication.
``gid = 0``: Sets the group ID that will have access to the containerd socket (0 usually represents the root group).
``uid = 0``: Sets the user ID that will own the containerd socket (0 typically represents the root user).
``max_recv_message_size = 16777216``: Sets the maximum size, in bytes, for incoming gRPC messages (16 MB in this case).
``max_send_message_size = 16777216``: Sets the maximum size for outgoing gRPC messages.
``tcp_address = ""``: Indicates that there is no TCP address configured for containerd to listen on, implying it will use the Unix socket only.
``tcp_tls_ca, tcp_tls_cert, tcp_tls_key``: These lines set the TLS parameters for gRPC over TCP. In this case, they are empty, meaning no TLS is configured for TCP connections.

``[plugins]``: Begins the configuration section for containerd plugins.

``[plugins."io.containerd.grpc.v1.cri"]``: This section is for configuring the CRI (Container Runtime Interface) plugin, which allows containerd to work with Kubernetes.
``sandbox_image = "registry.k8s.io/pause:3.10"``: Specifies the container image to use for Kubernetes pods' "pause" container, which manages the pod's network namespace.
``[plugins."io.containerd.grpc.v1.cri".containerd]``: Configures containerd-specific settings within the CRI plugin.
``[plugins."io.containerd.grpc.v1.cri".containerd.runtimes]``: Begins the configuration for different container runtimes managed by containerd.
``[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]``: Configures the "runc" runtime, which is the default runtime for containerd.
``runtime_type = "io.containerd.runc.v2"``: Specifies the runtime type for runc. Version 2 (runc.v2) provides enhanced support for container lifecycle management.
``[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]``: Begins the options section for the "runc" runtime.
``SystemdCgroup = true``: Configures containerd to use systemd for cgroup management, which is preferred in Kubernetes environments as it provides better resource management and compatibility.


## Setting Up Kubernetes

### Step 1: 

To install Kubernetes components, first create the repository file and set correct permissions 

```bash
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v1.31/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v1.31/rpm/repodata/repomd.xml.key
exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
EOF
chmod 0644 /etc/yum.repos.d/kubernetes.repo
chown root:root /etc/yum.repos.d/kubernetes.repo
```

### Step 2: 

Install the Kubernetes tools (`kubelet`, `kubeadm`, `kubectl`) along with `socat`:

```bash
yum install -y kubelet kubeadm kubectl socat --disableexcludes=kubernetes
```

- ``kubelet``: Manages containerized applications on a local node.
- ``kubeadm``: Bootstraps and manages the Kubernetes cluster.
- ``kubectl``: Provides command-line tools to interact with the Kubernetes cluster.
- ``socat``: A utility for data relay, often used for debugging and network communication.
- ``--disableexcludes=kubernetes``: Temporarily disables any excludes set by the Kubernetes repository, ensuring the required packages can be installed.

### Step 3:

Enable the `kubelet` service to ensure it starts automatically on system boot:

```bash
systemctl enable kubelet
```

The `kubelet` service is enabled but not started immediately. 

I chose not to start Kubelet immediately because it didn't start correctly on initial attempts. However, the `kubeadm init` command starts Kubelet automatically when initializing the Kubernetes cluster.

In many Kubernetes setups, it is better to delay starting `kubelet` until the system is fully configured:

1. **Manual Control**: You may need to control when `kubelet` starts, especially if additional configuration steps are pending.
2. **Dependencies**: The `kubelet` service requires other components, such as the control plane, to be ready, and starting it too early may cause issues.
3. **Avoid Errors**: Starting `kubelet` before the environment is fully prepared can lead to failures or unexpected behavior.





{% endraw %}

