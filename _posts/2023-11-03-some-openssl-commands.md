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

````bash
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

**Creating key for ca**
````bash
openssl genrsa -aes256 -out ca.key 4096
````

**Creating ca certificate**
````bash
openssl req -x509 -new -key ca.key -sha256 -days 36500 -out ca.crt
````

**Creating key for server certificate**
````bash
openssl genrsa -out server.key 4096
````

**Creating request for server certificate**
````bash
openssl req -new -key server.key -out server.csr
openssl req -new -key server.key -out server.csr -config openssl_req-server.cnf 
````

Signing created request 
````bash
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 3650 -sha256 -extfile openssl_req-server.cnf 
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

