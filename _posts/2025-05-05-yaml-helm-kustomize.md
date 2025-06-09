---
layout: single
title: "Managing Kubernetes Applications: YAML, Helm & Kustomize"
subtitle: ""
date: 2025-05-25 08:15:00 +0100
background: '/image/01.jpg'
tags: ['kubernetes']
categories:
  - Kubernetes
---
{% raw %}


In this short article, I'll go through the three Kubernetes-native approaches to deploy and manage applications.

Basically, an engineer should invest a lot of time to regularly deploy an application in Kubernetes manually. To manage it efficiently, several tools are used that simplify deployment, customization, and versioning. The three major approaches to this are **raw YAML files**, **Helm**, and **Kustomize**.

### Using YAML Files

The traditional way of managing applications is by using YAML files. In YAML files, engineers can define all related resources (Deployments, Services, and ConfigMaps) and easily bring up the application. Although using the raw YAML approach is not rarely effective in real life, it is not portable and lacks flexibility.

### Helm – The Package Manager for Kubernetes

Helm is the Kubernetes package manager and consists of the **helm** tool and **charts**. **Charts** are bundles of templates and values that define what will be installed and run.

Key Helm features:

- Helm is free and open source.
- You can download the binaries from GitHub: [https://github.com/helm/helm/releases](https://github.com/helm/helm/releases).
- To install the package, you should download it, extract the bundle file, and copy (or move) the `helm` binary file from `linux-amd64` to `/usr/local/bin`.
    

````bash
tar xvf helm-*.tar.gz
sudo mv linux-amd64/helm /usr/local/bin
helm version
````

- By default, you can use Helm to download public charts.
- An example of downloading and using a chart is shown below:
    
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Search for chart
helm search repo nginx

# Install a chart from the Bitnami repository
helm install myapp bitnami/nginx
```

- You can observe the content of the chart:

```bash
helm show chart bitnami/nginx
helm show all bitnami/nginx
```

### Creating Templates from Helm Charts

- Helm allows you to create a template from a chart without deploying the application. Using the `helm template` command exports the configuration from a chart to a YAML file.
    
- Once the YAML is generated, it can be used to deploy an application using the `kubectl apply ...` command.
    
- By extracting the chart, an engineer is able to manually review and/or modify the output.
    
- An example workflow is given below:
    

```bash
# Adding chart repository of Argo and updating the cache
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update

# Searching for the Argo CD chart
helm search repo argo/argo-cd | less

# Generate YAML manifests from the chart
helm template my-argo-cd argo/argo-cd --version <get-the-version-from-previous-command> > argo-cd-template.yaml
```

### Helm Values

- When deploying an application, Helm uses a lot of values, which can be checked using the `helm show values <chart>` command.
    
- A description of all values can be found here: [artifacthub.io](https://artifacthub.io/)
    
- Using the `values` approach, you can customize the deployment process.
    
- The default `values.yaml` file, which is a part of the Helm chart, contains default values defined as key-value pairs.
    

Workflow:

The following example shows how to run 2 instances of nginx.

- Check the default used label and default replicas:

````bash
helm show values bitnami/nginx
helm show values bitnami/nginx | grep commonLabels
helm show values bitnami/nginx | grep replicaCount
````

- Override both values:
    

```bash
vim values.yaml
commonLabel: "type: myhelmapp"
replicaCount: 4
```

- Apply the created file with customized values:
    

```bash
helm install bitnami/nginx --generate-name --values values.yaml
```

### 🧩 Kustomize – Declarative Configuration Management

- **Kustomize** is a Kubernetes-native configuration tool that modifies Kubernetes manifests using a `kustomization.yaml` file.
    
- It is useful when working with third-party YAML files or managing multiple versions/environments.
    
- Kustomize allows you to layer configurations using overlays (e.g., dev, staging, prod).
    
- Kustomize has two main components: **Base** and **Overlay**:
    
    - **Base**: Common resources.
        
    - **Overlay**: Environment-specific customizations using `kustomization.yaml`.
        

Below is a basic structure of **Kustomize**, which supports overlays for dev, staging, and prod environments:

```text
- base/
  - deployment.yaml
  - service.yaml
  - kustomization.yaml
- overlays/
  - dev/
    - kustomization.yaml
  - staging/
    - kustomization.yaml
  - prod/
    - kustomization.yaml
```

Apply configurations with:

```bash
kubectl apply -k overlays/dev/
```

This approach enables GitOps-style deployments and easier maintenance of multi-environment setups without modifying the base YAML files.

---

### Conclusion

|Tool|Best For|
|---|---|
|YAML|Simple deployments, learning basics|
|Helm|Packaging, templating, reusable deployments|
|Kustomize|Declarative multi-environment setups|

{% endraw %}
