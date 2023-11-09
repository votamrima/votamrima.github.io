---
layout: single
title: "Using logrotate"
subtitle: ""
date: 2019-02-14 20:45:00 +0100
background: '/image/01.jpg'
tags: ['logrotate', 'linux']
---

{% raw %}

1. create configuration file:
````
bash-3.2# cat /etc/logrotate.d/myconf-logrotate.conf
PATH_TO_FILE/LOG.FILE {
daily
missingok
rotate 10
compress
delaycompress
compresscmd /usr/bin/gzip
notifempty
copytruncate
}
````

2. Testing configuration
````
logrotate  /etc/logrotate.conf --force -d 
````

3. Add a crontab job. A job will be run every hour. 
````
export EDITOR=vi
crontab -e
>> 0 * * * * /usr/sbin/logrotate /etc/logrotate.conf --force > /dev/null 2>&1
````

Sources:

1. man logrotate.conf and man logrotate
2. [Crontab Generator](https://crontab-generator.org/)
3. [How to Use logrotate to Manage Log Files](https://www.linode.com/docs/uptime/logs/use-logrotate-to-manage-log-files/)

{% endraw %}
