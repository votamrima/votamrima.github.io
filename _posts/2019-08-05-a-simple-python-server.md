---
layout: single
title: "Simple HTTPS Server using python"
subtitle: ""
date: 2019-08-05 23:38:00 +0100
#background: '/img/posts/01.jpg'
tags: ['python', 'webserver']
---

{% raw %}

Here below I am going to shortly describe the process of setting up a simple https server on python

1. Generating key and cert files with Openssl:

````
[root@test crazytests]# openssl req -x509 -newkey rsa:4096 -keyout testkey.pem -out testcert.pem
Generating a 4096 bit RSA private key
.......++
..............................................................................................................................................................................................................................++
writing new private key to 'testkey.pem'
Enter PEM pass phrase:
Verifying - Enter PEM pass phrase:
-----
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [XX]:DE
State or Province Name (full name) []:
Locality Name (eg, city) [Default City]:
Organization Name (eg, company) [Default Company Ltd]:
Organizational Unit Name (eg, section) []:
Common Name (eg, your name or your server's hostname) []: new.test.my
Email Address []:
[root@test crazytests]#
````

2. Write the following python code. I tested it on python 2.x. I think on python 3.x will run  too.

````
[root@test crazytests]# cat simple_https.py
import BaseHTTPServer, SimpleHTTPServer
import ssl


httpd = BaseHTTPServer.HTTPServer(('new.test.my', 4443), SimpleHTTPServer.SimpleHTTPRequestHandler)

httpd_soccet = ssl.wrap_socket(httpd.socket, keyfile="testkey.pem", certfile='testcert.pem', server_side=True)

httpd.serve_forever()
[root@test crazytests]#
````

{% endraw %}