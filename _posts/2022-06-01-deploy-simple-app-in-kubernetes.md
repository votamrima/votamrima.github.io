---
layout: single
title: "How I deployed my first app in kubernetes"
subtitle: ""
date: 2022-06-01 08:00:00 +0100
background: '/image/01.jpg'
tags: ['kubernetes']
---

{% raw %}
In this post I am going to describe how I deployed my python service on kubernetes and how I realized connection to external database. 

## About application

The test application is based on FastAPI module. Main purpose of the service is handling incomming requests and save them into the databse. For database system I used Postgres. 

Connection values and other variables were defined in ``.env`` file located in application running folder.

## Deploy application

First of all it was created a namespace:

````bash
kubectl create namespace newsbase
````

Then, deployed a secret file for pulling an image for the images registry. ``auth.json`` file I found in /run/user/1000/containers/auth.json of the machine where the image registry is runnning:

````bash
kubectl create secret generic regcred --from-file=.dockerconfigjson=../auth.json --type=kubernetes.io/dockerconfigjson -n newsbase
````

Next, prepare deployment.yml file and apply it afterwards:

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

This deployment.yml file describes following:
- application and namespace name is newsbase;
- it will be running 3 pods: ``replicas: 3``
- image will be deployed from the ``registry.ocp.home.lab:5000/newsbase:1.0``
- port ``9080`` will be exposed
- secret named ``regcred`` will be to access to the image registry;

And apply ``deployment.yml`` file:

````bash
[admin@workstation newsbase]$ kubectl apply -f deployment.yml 
deployment.apps/newsbase created
````

Check if pods have been running:

````bash
[admin@workstation newsbase]$ kubectl get pods -n newsbase
NAME                        READY   STATUS    RESTARTS   AGE
newsbase-7c4bb87566-ghmv8   1/1     Running   1          5m
newsbase-7c4bb87566-jqnnr   1/1     Running   1          5m
newsbase-7c4bb87566-pqw68   1/1     Running   1          5m
[admin@workstation newsbase]$ 

````

## Activate service for application

In order to access to the application I created service resource. 

Content of the service.yml is following:

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

Endpoint I need configure connection to external database. Here is the yaml file of the resource

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

## References
- [access-external-database-from-kubernetes](https://stackoverflow.com/questions/63344920/access-external-database-from-kubernetes)
- 

{% endraw %}
