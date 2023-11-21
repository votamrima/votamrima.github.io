---
layout: single
title: "Basic user management in Openshift"
subtitle: ""
date: 2021-11-19 18:30:00 +0100
background: '/image/01.jpg'
tags: ['openshift']
---

{% raw %}

In this post I describe how to create users for Openshift using HTPasswd provider. More about authentication providers are able to find in [official documentation](https://docs.openshift.com/container-platform/4.9/authentication/understanding-authentication.html)


## kubeadmin user

During installation Openshift creates default *kubeadmin* with a automatically generated password. You can find the password in installation folder: ``<installation_folder>/auth/kubeadmin-password``

````
[admin@ocp4 try]$ cat install_dir/auth/kubeadmin-password 
bVM5i-CxeZI-NDvoS-d9wtV
````

The ``kubeconfig`` is located in ``<installation_folder>/auth/``.

````
[admin@ocp4 try]$ oc --kubeconfig install_dir/auth/kubeconfig get node
NAME                                 STATUS     ROLES    AGE   VERSION
etcd-2.okd4.home.lab                 Ready      master   35d   v1.20.0+558d959-1089
etcd-3.okd4.home.lab                 Ready      master   28d   v1.20.0+558d959-1089
okd4-compute-1.okd4.home.lab         Ready      worker   35d   v1.20.0+558d959-1089
okd4-control-plane-1.okd4.home.lab   Ready      master   35d   v1.20.0+558d959-1089
````

You can set kubeconfig to the KUBECONFIG environment variable:

````
export KUBECONFIG=/opt/install_dir/auth/kubeconfig
````

## OAuth and identity providers

Authentication in Openshift is supported by Authentication Operator which runs on OAuth server. Users attempt to authenticate to the Opeshift API using using OAuth access tokens. 

OAuth server must be enabled and configured. Using the kubeadmin user, I specified ``HTPasswd`` as the identity provider. Generally, OpenShift allows configuring various identity providers including HTPasswd, Keystone, LDAP, and others as detailed in the [Openhift Documentation](https://docs.openshift.com/container-platform/4.7/authentication/understanding-identity-provider.html)


## Configuring HTPasswd identity provider

### Creating htpasswd file

The basic format for creating an HTPasswd authentication file is ``htpasswd -c -b -B <filename> <username> <password>``. Here, ``-c`` creates the file, ``-b`` uses a password given on the command line, and ``-B`` forces bcrypt encryption of the password.

````
[admin@ocp4 try]$ htpasswd -c -b -B my_ocp_users admin admin
Adding password for user admin
[admin@ocp4 try]$ 
````

Check content of the created file:

````
[admin@ocp4 try]$ cat my_ocp_users 
admin:$2y$05$XteSEzWTBX8HlzqHQv2ryecUY5On/7DBfTSnCjWfyCFlDhaDdufcq
[admin@ocp4 try]$ 
````

To create another user, omit the ``-c`` parameter:

````
[admin@ocp4 try]$ htpasswd -b -B my_ocp_users developer developer
Adding password for user developer
[admin@ocp4 try]$ cat my_ocp_users 
admin:$2y$05$XteSEzWTBX8HlzqHQv2ryecUY5On/7DBfTSnCjWfyCFlDhaDdufcq
developer:$2y$05$Ab1TxMQV0T7te6NmKXaALOX/6XsFHsV06LYcaZHwIdIDpkJiObN2m
[admin@ocp4 try]$ 
````


### Applying the htpasswd File
Create a secret in the ``openshift-config`` namespace:

````
[admin@ocp4 try]$ oc create secret generic myusers --from-file htpasswd=my_ocp_users -n openshift-config
secret/localusers created
[admin@ocp4 try]$ 
````

Check the created secret:

````
[admin@ocp4 try]$ oc get secrets -n openshift-config
NAME                      TYPE                     DATA   AGE
......
myusers                   Opaque                   1      27s
.......
[admin@ocp4 try]$ 
````

Modify the OAuth custom resource:

````
[admin@ocp4 try]$ oc get oauth cluster -o yaml > oauth_modify.yml
````

Edit the exported file:

````
[admin@ocp4 try]$ vim oauth_modify.yml 
apiVersion: config.openshift.io/v1
kind: OAuth
.........
spec:
  identityProviders:
  - htpasswd:
      fileData:
        name: myusers
    mappingMethod: claim
    name: myusers
    type: HTPasswd
````

Apply the new OAuth file:

````
[admin@ocp4 try]$ oc replace -f oauth_modify.yml 
oauth.config.openshift.io/cluster replaced
[admin@ocp4 try]$ 
````

Check if the ``openshift-authentication`` pods are being recreated:

````
[admin@ocp4 try]$ oc get pods -n openshift-authentication
NAME                               READY   STATUS        RESTARTS   AGE
oauth-openshift-647d98d4db-pmtx6   0/1     Terminating   0          26d
oauth-openshift-777bfcd76c-v2xzl   1/1     Running       0          49s
oauth-openshift-777bfcd76c-wpqsq   1/1     Running       0          41s
````

If the pods are not being recreated, remove them. In this case, Openshift will re-deploy new pods with the updated configuration. 

````bash
[admin@ocp4 htpasswd]$ oc delete pods -n openshift-authentication --all --force
warning: Immediate deletion does not wait for confirmation that the running resource has been terminated. The resource may continue to run on the cluster indefinitely.
pod "oauth-openshift-7f55497fcd-s56qd" force deleted
pod "oauth-openshift-7f55497fcd-z7d9c" force deleted
[admin@ocp4 htpasswd]$ oc get pods -n openshift-authentication
NAME                               READY   STATUS              RESTARTS   AGE
oauth-openshift-7f55497fcd-9v4zl   0/1     ContainerCreating   0          3s
oauth-openshift-7f55497fcd-h7x8m   0/1     ContainerCreating   0          3s
[admin@ocp4 htpasswd]$ oc get pods -n openshift-authentication
NAME                               READY   STATUS    RESTARTS   AGE
oauth-openshift-5c6444d496-hj52l   1/1     Running   0          9m35s
oauth-openshift-5c6444d496-hvf2m   1/1     Running   0          9m31s
[admin@ocp4 htpasswd]$ 
````

## Assigning privileges 

To use created admin user as an admin of the cluster assign the user to the ``cluster-admin`` role

````bash
[admin@ocp4 try]$ oc adm policy add-cluster-role-to-user cluster-admin admin
Warning: User 'admin' not found
clusterrole.rbac.authorization.k8s.io/cluster-admin added: "admin"
[admin@ocp4 try]$ 
[admin@ocp4 ~]$ oc login -u admin -p admin oauth-openshift.okd4.home.lab:6443
Login successful.

You have access to 63 projects, the list has been suppressed. You can list all projects with 'oc projects'

Using project "default".
[admin@ocp4 ~]$ 
[admin@ocp4 ~]$ oc whoami 
admin
````

## Removing project creation privileges

By default, all users can create projects. To change this remove the ``self-provisioner`` role from the ``system:authenticated:oauth`` group

Search the ``self-provisioners`` role binding object:

````bash
[admin@ocp4 ~]$ oc get clusterrolebinding | grep self-prov
self-provisioners                        ClusterRole/self-provisioner             36d
[admin@ocp4 ~]$ 
````

Describe an object to get more information. Here you can find that ``self-provisioners`` object is binding ``self-provisioner`` role to ``system:authenticated:oauth``. 

````bash
[admin@ocp4 ~]$ oc describe clusterrolebinding self-provisioners
Name:         self-provisioners
Labels:       <none>
Annotations:  rbac.authorization.kubernetes.io/autoupdate: true
Role:
  Kind:  ClusterRole
  Name:  self-provisioner
Subjects:
  Kind   Name                        Namespace
  ----   ----                        ---------
  Group  system:authenticated:oauth  
[admin@ocp4 ~]$ 
````

And remove the ``self-provisioner`` role from the ``system:authenticated:oauth`` group:

````bash
[admin@ocp4 ~]$ oc adm policy remove-cluster-role-from-group self-provisioner system:authenticated:oauth
Warning: Your changes may get lost whenever a master is restarted, unless you prevent reconciliation of this rolebinding using the following command: 
oc annotate clusterrolebinding.rbac self-provisioners 'rbac.authorization.kubernetes.io/autoupdate=false' --overwrite
clusterrole.rbac.authorization.k8s.io/self-provisioner removed: "system:authenticated:oauth"
[admin@ocp4 ~]$ 
````

By doing that, is being destroed ``self-provisioners`` rolebinding and will be disabled priviledge to create projects for all users. 

````bash
[admin@ocp4 ~]$ oc get clusterrolebinding | grep self-prov
[admin@ocp4 ~]$ 
````

Now we can grant the ``self-provisioner`` role to any user. Here I do it for the developer user:

````bash
[admin@ocp4 ~]$ oc adm groups new developers
group.user.openshift.io/developers created
[admin@ocp4 ~]$ 
[admin@ocp4 ~]$ oc adm groups add-users developers developer
group.user.openshift.io/developers added: "developer"
[admin@ocp4 ~]$ 
````

Assigned self-provisioner role to developers group:

````bash
[admin@ocp4 ~]$ oc adm policy add-cluster-role-to-user --rolebinding-name self-provisioning-admin self-provisioner admin
clusterrole.rbac.authorization.k8s.io/self-provisioner added: "admin"
[admin@ocp4 ~]$ 
````

Verify result:

````bash
[admin@ocp4 ~]$ oc login -u developer -p developer
Login successful.

You have one project on this server: "default"

Using project "default".
[admin@ocp4 ~]$ oc new-project test
Now using project "test" on server "https://localhost:6443".

You can add applications to this project with the 'new-app' command. For example, try:

    oc new-app rails-postgresql-example

to build a new example application in Ruby. Or use kubectl to deploy a simple Kubernetes application:

    kubectl create deployment hello-node --image=k8s.gcr.io/serve_hostname

[admin@ocp4 ~]$
````

{% endraw %}