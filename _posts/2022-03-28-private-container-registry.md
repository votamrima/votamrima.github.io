---
layout: single
title: "Private Container Registry on Podman"
subtitle: ""
date: 2022-03-28 20:00:00 +0100
background: '/image/01.jpg'
tags: ['podman', 'container']
---

{% raw %}


Setting up a simple container registry on Podman is quite straightforward. In this note, I'll share how I set up a local container registry for personal use.

## Preparation

Before beginning, ensure that ``podman`` and ``htpasswd`` packages are installed on your host. If not, you can install them as follows:

````bash
[admin@podman auth]$ sudo dnf provides htpasswd
[admin@podman auth]$ sudo yum install httpd-tools podman
````

Next, create a file with credentials:

````bash
[admin@podman auth]$ htpasswd -bc auth admin admin
Adding password for user admin
[admin@podman auth]$ 
[admin@podman auth]$ cat auth 
admin:$apr1$OQzj4eaY$ipt3p40Vipneb2PTn1W7e0
[admin@podman auth]$ 
````
The output should show the created credentials.


Define local folders for data (``/opt/registry/volume``) and credentials (``/opt/registry/auth``).

### Create TLS certificate:

Generate a TLS certificate using the following command:

````bash
[admin@podman tls]$ openssl req -newkey rsa:4096 -nodes -sha256 -keyout /opt/registry/tls/domain.key -x509 -days 365 -subj "/CN=registry.ocp.home.lab" -addext "subjectAltName = DNS:registry.ocp.home.lab" -out /opt/registry/tls/domain.crt
````

Trust the initialized certificate by copying it to ``/etc/pki/ca-trust/source/anchors/`` and updating the CA trust:

````bash
[admin@podman tls]$ sudo cp domain.crt /etc/pki/ca-trust/source/anchors/
[admin@podman tls]$ sudo update-ca-trust
[admin@podman tls]$ trust list | grep registry
    label: registry.ocp.home.lab
[admin@podman tls]$ 
````

## Run container

Start the registry container with the following command:

````bash
[admin@podman tls]$ podman run --name registry -p 5000:5000 -v /opt/registry/volume:/var/lib/registry -v /opt/registry/auth:/opt/auth -e "REGISTRY_AUTH=htpasswd" -e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" -e REGISTRY_AUTH_HTPASSWD_PATH=/opt/auth/auth -v /opt/registry/tls:/certs -e "REGISTRY_HTTP_TLS_CERTIFICATE=/certs/domain.crt" -e "REGISTRY_HTTP_TLS_KEY=/certs/domain.key" -e REGISTRY_COMPATIBILITY_SCHEMA1_ENABLED=true   -d docker.io/library/registry:latest
[admin@podman tls]$ 
````

* Set the correct SELinux context for the mounted volumes or disable SELinux.
* Open port 5000 in the firewall or disable the local firewall.

## Log In/Out to Registry

Log in to the registry using:

````bash
[admin@podman tls]$ podman logout --all
Removed login credentials for all registries
````

And log out with:

````bash
[admin@podman tls]$ podman logout registry.ocp.home.lab:5000
Removed login credentials for registry.ocp.home.lab:5000
````

Podman stores the credentials file in ``/run/user/1000/containers/auth.json``. You can copy this file for future logins:

````bash
[admin@podman auth]$ cp /run/user/1000/containers/auth.json .
[admin@podman auth]$ podman login registry.ocp.home.lab:5000 --authfile auth.json 
Authenticating with existing credentials for registry.ocp.home.lab:5000
Existing credentials are valid. Already logged in to registry.ocp.home.lab:5000
[admin@podman auth]$ 
````

## Pull and push container

Pull an image to the registry:

````bash
[admin@podman auth]$ podman images
````

Tag the ``newsbase`` image from localhost for the registry:

````bash
[admin@podman auth]$ podman tag newsbase registry.ocp.home.lab:5000/newsbase:1.0
````

Push it to the registry:

````bash
[admin@podman auth]$ podman push registry.ocp.home.lab:5000/newsbase:1.0
````

This note reflects my personal experience in setting up a private container registry using Podman.



## References
- [How to implement a simple personal/private Linux container image registry for internal use](https://www.redhat.com/sysadmin/simple-container-registry)


{% endraw %}
