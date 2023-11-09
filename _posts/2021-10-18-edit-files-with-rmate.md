---
layout: single
title: "Editing files in Linux VM using remote Visual Studio Code"
subtitle: ""
date: 2021-10-18 18:30:00 +0100
tags: ['ide']
---

{% raw %}

Sometimes we need to edit a file directly on Linux VM using Visual Studio Code.

1. Launch Visual Studio Code. Additionally, you have to able to connect to the bash of remote machine from VS Code. 

2. Go to the ‘Extensions’ page and search for ‘Remote VSCode’

3. Install the extension and re-launch Visual Studio Code ( client side of rmate)

4. In your Linux Virtual Machine, execute the following command in your terminal to install rmate server

````
mkdir /opt/rmate
$ sudo wget -O /opt/rmate/rmate https://raw.github.com/aurora/rmate/master/rmate
$ sudo chmod a+x /opt/rmate/rmate
ln -s /opt/rmate/rmate /usr/local/bin/rmate 
````

5. Go back to your Visual Studio Code and open up the command palette (CTRL+P for Windows and CMD+P for Mac) then execute the following command:
````
Remote: Start Server 
````

6. Once the server is ready, open up a new terminal and connect to your Linux Virtual Machine using the following command:
````
 $ ssh -R 52698:localhost:52698 VIRTUAL_MACHINE_IP_ADDRESS 
````

7. In vs code terminal, execute the rmate command with the file that you want to open up in your Visual Studio Code in your local machine
````
 $ rmate demo.py 
````

{% endraw %}