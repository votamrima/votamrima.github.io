---
layout: single
title: "Some openssl commands"
subtitle: ""
date: 2023-11-03 08:15:00 +0100
background: '/image/01.jpg'
tags: ['openssl']
---

{% raw %}

Read the pem file:

````bash
openssl x509 -in /etc/haproxy/cert.pem -text -noout
````

### Creating new certificates
Creating new key and certificate request (CSR)

````bash
openssl req -new -newkey rsa:4096 -out newcertificate.csr -config openssl_req.cnf -nodes -keyout newcertificate.key
````

Example ``openssl_req.cnf`` file:

````cnf
[req]
distinguished_name = req_distinguished_name
req_extensions = req_ext
prompt = no

[req_distinguished_name]
C   = 
ST  = 
L   = 
O   = 
CN  = hostname, fqdn, url

[req_ext]
subjectAltName = @alt_names

[alt_names]
IP.1 = ip address of the host
DNS.1 = alternative DNS 1
DNS.2 =  alternative DNS 2
DNS.3 =  alternative DNS 3
````


### Converting

Convert *.cer to *.pem:

````bash
openssl x509 -inform der -in certificate.cer -out certificate.pem
````

Converting p7b chain to pem chain:

````bash
openssl pkcs7 -print_certs -inform DER -in your_certificate.p7b -out your_certificate.pem
````

{% endraw %}

