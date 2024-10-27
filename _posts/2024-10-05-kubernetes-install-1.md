---
layout: single
title: "Installing Kubernetes Cluster at the Homelab: Preparation"
subtitle: ""
date: 2024-10-05 08:15:00 +0100
background: '/image/01.jpg'
tags: ['kubernetes']
---

{% raw %}


I decided to reinstall a Kubernetes cluster at my homelab, and in this article, I am documenting the preparation steps I took.

## Node setup

The cluster consists of six nodes: three master nodes and three worker nodes. The operating system is AlmaLinux 9, with each node having a 4-core CPU and 8 GB of RAM.

## Preparation Steps

### SELinux configuration

Set SELinux to permissive mode and update the configuration to make it persistent:

```bash
setenforce 0
sed -i 's/^SELINUX=enforcing/SELINUX=permissive/' /etc/selinux/config
```

The first command changes SELinux to permissive mode until the next reboot. To make this change permanent, update the `/etc/selinux/config` file.

### Stop/Disable firewall

Stop and disable the firewall to prevent it from starting at boot:

```bash
systemctl stop firewalld
systemctl disable firewalld
```

**Note**: Disabling the firewall is not recommended for a production environment, as it leaves your system vulnerable to external threats. Instead, configure firewall rules to allow necessary traffic.

### Disable Swap

Kubernetes requires swap to be disabled. Use the following commands to stop the swap partition and remove it from the `/etc/fstab` file:

```bash
swapoff -a
sed -i '//dev/mapper/almalinux_alma9--template-swap.*swap/d' /etc/fstab
```

### Configure proxy settings

Since all my servers are behind a proxy and do not have direct Internet access, I configured proxy settings. I added the settings to both the `bashrc` file and the `yum` (`dnf`) configuration file:

```bash
echo "proxy=http://192.168.11.51:3128" >> /etc/dnf/dnf.conf
echo "proxy=https://192.168.11.51:3128" >> /etc/dnf/dnf.conf
```

```bash
echo 'export NO_PROXY="127.0.0.1,localhost,192.168.11.0/8"' >> /etc/bashrc
echo 'export http_proxy="http://192.168.11.51:3128"' >> /etc/bashrc
echo 'export https_proxy="http://192.168.11.51:3128"' >> /etc/bashrc
```

### Activating Packet Forwarding

The `net.ipv4.ip_forward` setting controls whether the Linux kernel forwards IPv4 packets between network interfaces. By default, this value is set to 0, which disables packet forwarding. Setting this value to 1 enables packet forwarding, which is essential for Kubernetes networking.

```bash
if ! grep -q '^net.ipv4.ip_forward' /etc/sysctl.conf; then
  echo 'net.ipv4.ip_forward = 1' >> /etc/sysctl.conf
else
  sed -i 's/^net.ipv4.ip_forward.*/net.ipv4.ip_forward = 1/' /etc/sysctl.conf
fi

# Apply the changes
sysctl -p
```


### Update the host and restart

Install additional packages and update the host:

```bash
dnf install -y yum-utils device-mapper-persistent-data lvm2 wget
dnf update -y
```

Restart the host to apply all changes and ensure the new settings take effect:

```bash
shutdown -r now
```

## Final thoughts

With these preparation steps complete, the first Kubernetes master node is ready for deployment. Properly configuring SELinux, disabling swap, and setting up proxy settings ensure that the environment is optimized for Kubernetes. The next steps will involve installing the container runtime, Kubernetes components, and setting up the first master node. 


{% endraw %}

