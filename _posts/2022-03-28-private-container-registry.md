---
layout: single
title: "Private container registry on podman"
subtitle: ""
date: 2022-03-28 20:00:00 +0100
background: '/image/01.jpg'
tags: ['podman', 'container']
---

{% raw %}


It is very easy to set up a simple container registry on podman. Here below I show how to set up a local simple container registry for personal use. 

## Preparation

If podman and htpasswd packages are not installed on the host, install them:

````bash
[admin@podman auth]$ sudo dnf provides htpasswd
[sudo] password for admin: 
Last metadata expiration check: 1:10:40 ago on Mon 11 Apr 2022 06:12:44 PM CEST.
httpd-tools-2.4.37-30.module_el8.3.0+462+ba287492.0.1.x86_64 : Tools for use with the Apache HTTP Server
Repo        : appstream
Matched from:
Filename    : /usr/bin/htpasswd

httpd-tools-2.4.37-39.module_el8.4.0+778+c970deab.x86_64 : Tools for use with the Apache HTTP Server
Repo        : appstream
Matched from:
Filename    : /usr/bin/htpasswd

[admin@podman auth]$ sudo yum install httpd-tools podman
````

Create a file with credentials:

````bash
[admin@podman auth]$ htpasswd -bc auth admin admin
Adding password for user admin
[admin@podman auth]$ 
[admin@podman auth]$ cat auth 
admin:$apr1$OQzj4eaY$ipt3p40Vipneb2PTn1W7e0
[admin@podman auth]$ 
````

Define local folders that will be mounted to registry container. I am going to mount 2 folders: one for data, another one for credentials file. For data will be used ``/opt/registry/volume`` and for credentials - ``/opt/registry/auth``

Create TLS certificate:

````bash
[admin@podman tls]$ openssl req -newkey rsa:4096 -nodes -sha256 -keyout /opt/registry/tls/domain.key -x509 -days 365 -subj "/CN=registry.ocp.home.lab" -addext "subjectAltName = DNS:registry.ocp.home.lab" -out /opt/registry/tls/domain.crt
Generating a RSA private key
..............................++++
................................................................................................................................................................................................................................................................++++
writing new private key to '/opt/registry/tls/domain.key'
-----
````

The initialized certificate should be trusted. In Red Hat family system you need to copy the created certificate to ``/etc/pki/ca-trust/source/anchors/``:

````bash
[admin@podman tls]$ sudo cp domain.crt /etc/pki/ca-trust/source/anchors/
[admin@podman tls]$ sudo update-ca-trust
[admin@podman tls]$ trust list | grep registry
    label: registry.ocp.home.lab
[admin@podman tls]$ 
````

## Run container

````bash
[admin@podman tls]$ podman run --name registry -p 5000:5000 -v /opt/registry/volume:/var/lib/registry -v /opt/registry/auth:/opt/auth -e "REGISTRY_AUTH=htpasswd" -e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" -e REGISTRY_AUTH_HTPASSWD_PATH=/opt/auth/auth -v /opt/registry/tls:/certs -e "REGISTRY_HTTP_TLS_CERTIFICATE=/certs/domain.crt" -e "REGISTRY_HTTP_TLS_KEY=/certs/domain.key" -e REGISTRY_COMPATIBILITY_SCHEMA1_ENABLED=true   -d docker.io/library/registry:latest
773638fc8df066bcba844ad13189ebfbc09f14439391e68729aaf3f01e161ff2
[admin@podman tls]$ podman ps -a
CONTAINER ID  IMAGE                              COMMAND               CREATED        STATUS                   PORTS                   NAMES
773638fc8df0  docker.io/library/registry:latest  /etc/docker/regis...  3 seconds ago  Up 3 seconds ago         0.0.0.0:5000->5000/tcp  registry
[admin@podman tls]$ 
````

- Set correct SELinux context For the mounted volumes (/opt/registry/volume and /opt/registry/auth). Or disable SELinux.
- Open port 5000 in firewall. Or disable the local firewall.


## Log in/out to registry

And now let's try to log in to the registry:

````bash
[admin@podman tls]$ podman logout --all
Removed login credentials for all registries
````

And try log out:

````bash
[admin@podman tls]$ podman logout registry.ocp.home.lab:5000
Removed login credentials for registry.ocp.home.lab:5000
````

After successfull login, podman stores credentials file in ``/run/user/1000/containers/auth.json``. Here, I just copied that file and will use for future login:

````bash
[admin@podman auth]$ podman logout registry.ocp.home.lab:5000
Removed login credentials for registry.ocp.home.lab:5000
[admin@podman auth]$ 

[admin@podman auth]$ cp /run/user/1000/containers/auth.json .
[admin@podman auth]$ podman login registry.ocp.home.lab:5000 --authfile auth.json 
Authenticating with existing credentials for registry.ocp.home.lab:5000
Existing credentials are valid. Already logged in to registry.ocp.home.lab:5000
[admin@podman auth]$ 
````

## Pull and push container

Let's try to pull an image to the registry:

````bash
[admin@podman auth]$ podman images
REPOSITORY                                 TAG         IMAGE ID      CREATED      SIZE
localhost/newsbase                         latest      f8e04e34b36d  5 days ago   1.04 GB

````

I am going to push the image ``newsbase`` from localhost. First of all, use ``podman tag`` to tag the image for the registry.
````bash

[admin@podman auth]$ podman tag newsbase registry.ocp.home.lab:5000/newsbase:1.0
[admin@podman auth]$ 
[admin@podman auth]$ podman images
REPOSITORY                                 TAG         IMAGE ID      CREATED      SIZE
localhost/newsbase                         latest      f8e04e34b36d  5 days ago   1.04 GB
registry.ocp.home.lab:5000/newsbase        1.0         f8e04e34b36d  5 days ago   1.04 GB
````

And then push it to the registry:

````bash
[admin@podman auth]$ podman push registry.ocp.home.lab:5000/newsbase:1.0
Getting image source signatures
Copying blob 1edf512cf84d done  
......
Copying config f8e04e34b3 done
Writing manifest to image destination
Storing signatures
[admin@podman auth]$ 
````

Remove newsbase image from the local images list and pull that from the registry back:

````bash
[admin@podman auth]$ podman pull registry.ocp.home.lab:5000/newsbase:1.0
Trying to pull registry.ocp.home.lab:5000/newsbase:1.0...
Getting image source signatures
........
Copying blob 9a6655d6eaed done  
Copying config f8e04e34b3 done  
.........
Writing manifest to image destination
Storing signatures
f8e04e34b36dddd6de5d4e5cd02051385b10ff6a66e847a3ab989d3f5565ccda
[admin@podman auth]$ podman images
REPOSITORY                                 TAG         IMAGE ID      CREATED      SIZE
registry.ocp.home.lab:5000/newsbase        1.0         f8e04e34b36d  5 days ago   1.04 GB
````

## References
- [How to implement a simple personal/private Linux container image registry for internal use](https://www.redhat.com/sysadmin/simple-container-registry)


{% endraw %}
