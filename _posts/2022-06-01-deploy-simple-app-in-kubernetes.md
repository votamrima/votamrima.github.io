---
layout: single
title: "How I Deployed My First App in Kubernetes"
subtitle: ""
date: 2022-06-01 08:00:00 +0100
background: '/image/01.jpg'
tags: ['kubernetes']
---

{% raw %}

In this post, I am going to describe how I deployed my Python service on Kubernetes and how I realized a connection to an external database.

About the Application
The test application is based on the FastAPI module. The main purpose of the service is handling incoming requests and saving them into the database. For the database system, I used Postgres.

Connection values and other variables were defined in a ``.env`` file located in the application's running folder.


## Deploy the Application

First of all, I created a namespace:

````bash
kubectl create namespace newsbase
````

Then, I deployed a secret file for pulling an image from the images registry. I found the ``auth.json`` file in ``/run/user/1000/containers/auth.json`` of the machine where the image registry is running:

````bash
kubectl create secret generic regcred --from-file=.dockerconfigjson=../auth.json --type=kubernetes.io/dockerconfigjson -n newsbase
````

Next, I prepared a ``deployment.yml`` file and applied it afterward:

Content of ``deployment.yml`` file:

````yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: newsbase
  namespace: newsbase
spec:
  selector:
    matchLabels:
      app: newsbase
      tier: newsbase
      track: stable
  replicas: 3
  template:
    metadata:
      labels:
        app: newsbase
        track: stable
    spec:
      containers:
        - name: newsbase
          image: "registry.ocp.home.lab:5000/newsbase:1.0"
          ports:
            - name: newsbase
              containerPort: 9080
              protocol: TCP
      imagePullSecrets:
        - name: regcred
````

This ``deployment.yml`` file describes the following:
* Application and namespace name is ``newsbase``.
* It will be running 3 pods: ``replicas: 3``.
* The image will be deployed from the ``registry.ocp.home.lab:5000/newsbase:1.0``.
* Port ``9080`` will be exposed.
* Secret named ``regcred`` will be used to access the image registry.

Apply ``deployment.yml`` file:

````bash
[admin@workstation newsbase]$ kubectl apply -f deployment.yml 
deployment.apps/newsbase created
````

Check if pods are running:

````bash
[admin@workstation newsbase]$ kubectl get pods -n newsbase
NAME                        READY   STATUS    RESTARTS   AGE
newsbase-7c4bb87566-ghmv8   1/1     Running   1          5m
newsbase-7c4bb87566-jqnnr   1/1     Running   1          5m
newsbase-7c4bb87566-pqw68   1/1     Running   1          5m
[admin@workstation newsbase]$ 
````

## Activate service for application

In order to access the application, I created a service resource.

Content of the ``service.yml`` is as follows:

````yaml
apiVersion: v1
kind: Service
metadata:
  name: newsbase
  namespace: newsbase
spec:
  ports:
    - port: 9080
      nodePort: 30080
  selector:
    app: newsbase
  type: NodePort

````

To apply a service run the similar command with ``apply`` argument:

````bash
kubectl apply -f service.yml
````

## Apply endpoint resource

I needed to configure an endpoint to connect to an external database. Here is the YAML file of the resource:

````yaml
---
kind: Service
apiVersion: v1
metadata:
  name: connection-to-db
  namespace: newsbase
spec:
  clusterIP: None
  ports:
  - port: 5432

---
kind: Endpoints
apiVersion: v1
metadata:
  name: connection-to-db
  namespace: newsbase
subsets:
  - addresses:
        - ip: 192.168.11.62
    ports:
      - port: 5432
        name: connection-to-db
````

## Conclusion
This was my personal experience with deploying my first app in Kubernetes, where I focused on setting up a Python service and integrating it with an external Postgres database.


## References
- [access-external-database-from-kubernetes](https://stackoverflow.com/questions/63344920/access-external-database-from-kubernetes)
- 

{% endraw %}
