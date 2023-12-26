---
layout: single
title: "Editing Files in Linux VM Using Remote Visual Studio Code"
subtitle: ""
date: 2021-10-18 18:30:00 +0100
tags: ['ide']
---

{% raw %}

Editing files directly on a Linux VM using Visual Studio Code can be a convenient way to manage code or configuration files. This guide will walk you through the process using the Remote - SSH extension in VS Code.

1. Launch Visual Studio Code: Make sure you can connect to the bash of the remote machine from VS Code.

2. Install Remote Extension:
    - Go to the ‘Extensions’ tab in VS Code.
    - Search for ‘Remote - SSH’.
    - Install the extension. You might not need to restart VS Code after installation.

3. Prepare the Linux VM:
    - On your Linux VM, install the rmate script, which enables remote file editing.
    - Execute these commands in your VM's terminal:

````
mkdir /opt/rmate
$ sudo wget -O /opt/rmate/rmate https://raw.github.com/aurora/rmate/master/rmate
$ sudo chmod a+x /opt/rmate/rmate
ln -s /opt/rmate/rmate /usr/local/bin/rmate 
````

4. Start the Remote Server in VS Code:
    - Open the command palette in VS Code (``Ctrl+Shift+P`` on Windows/Linux, ``Cmd+Shift+P`` on Mac).
    - Type ``Remote: Start Server`` and execute the command.

5. SSH Connection to Your Linux VM:
    - Open a new terminal in VS Code.
    - Connect to your Linux VM with SSH, ensuring you set up a reverse tunnel for the ``rmate`` port:

````
 $ ssh -R 52698:localhost:52698 VIRTUAL_MACHINE_IP_ADDRESS 
````

Replace user with your username and ``VIRTUAL_MACHINE_IP_ADDRESS`` with your VM's IP address.

6. Edit Files Remotely:
    - In your VM's terminal (via the SSH session in VS Code), use the rmate command followed by the path to the file you want to edit:

````
 $ rmate demo.py 
````

This will open the file directly in your local VS Code instance for editing.

This approach allows you to conveniently edit files on a remote Linux VM as if they were local, leveraging the powerful features of Visual Studio Code.

{% endraw %}