---
layout: single
title: "Check for opened ports without telnet"
subtitle: ""
date: 2019-08-26 19:46:00 +0100
#background: '/img/posts/01.jpg'
tags: ['linux']
---
##################THIS
{% raw %} 

If there is no telnet tools is installed on the host, try the following command to check if a port opened or not. 

````
-bash-4.2$ timeout 1 bash -c '(echo > /dev/tcp/ip_adderess/port) >/dev/null 2>&1' && echo Port is open || echo Port is closed

````

**Example**

````
-bash-4.2$ timeout 1 bash -c '(echo > /dev/tcp/192.168.0.100/443) >/dev/null 2>&1' && echo Port is open || echo Port is closed
Port is open
````

If a port is closed, try to check network configuration or firewall access.

{% endraw %}