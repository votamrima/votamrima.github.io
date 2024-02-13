---
layout: single
title: "Simple HTTPS Server using python"
subtitle: ""
date: 2019-08-05 23:38:00 +0100
tags: ['python', 'webserver']
---

{% raw %}

## Setting Up a Simple HTTPS Server in Python

In this tutorial, I'll walk you through the process of setting up a simple HTTPS server using Python. This method is particularly useful for testing purposes or for local development environments.

### Step 1: Generating Key and Certificate Files with OpenSSL

First, we need to generate the necessary key and certificate files using OpenSSL. This process involves creating a private key (testkey.pem) and a public certificate (testcert.pem). Here's how you can do this:

````bash
[root@test crazytests]# openssl req -x509 -newkey rsa:4096 -keyout testkey.pem -out testcert.pem
````

During this process, you'll be prompted to enter various details for your certificate, such as country code, state, locality, organization name, etc. It's important to provide the Common Name (CN) accurately, as it identifies the server name protected by the SSL certificate.

Here's an example of how the process might look:


````bash
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

### Step 2: Writing the Python HTTPS Server Code
Next, we write a simple Python script to create an HTTPS server. I've tested this on Python 2.x, but it should also work on Python 3.x with minor adjustments if needed.

Here's the basic script:

````python
import BaseHTTPServer, SimpleHTTPServer
import ssl


httpd = BaseHTTPServer.HTTPServer(('new.test.my', 4443), SimpleHTTPServer.SimpleHTTPRequestHandler)

httpd_soccet = ssl.wrap_socket(httpd.socket, keyfile="testkey.pem", certfile='testcert.pem', server_side=True)

httpd.serve_forever()
[root@test crazytests]#
````

This script uses Python's BaseHTTPServer and SimpleHTTPServer modules to set up a basic HTTP server, which is then wrapped with SSL using ssl.wrap_socket to create an HTTPS server. The server listens on port 4443.

To start the server, simply run the Python script:

````bash
python simple_https.py
````

Once running, the server will serve content over HTTPS at https://test.homelab.lab:4443 (or whichever hostname and port you've configured).

This method provides a quick and easy way to set up a secure HTTP server, perfect for development and testing environments where you need HTTPS but don't require a full-fledged web server setup. Remember, this is a basic setup and may need additional security measures for a production environment.

{% endraw %}