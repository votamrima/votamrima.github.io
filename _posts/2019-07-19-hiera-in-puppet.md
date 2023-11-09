---
layout: single
title: "Using hiera in puppet. Example: creating a folder"
subtitle: ""
date: 2019-07-19 16:20:00 +0100
#background: '/img/posts/01.jpg'
tags: ['puppet']
---

{% raw %}

In this post I am trying to show how to configure hiera files on puppet master. For demonstration purpose I use a simple task that will create a folder. The main idea of this post is to get basic understand of hiera concept.

Look up where is stored the main hiera file:

````bash
puppet config print hiera_config 

````

Edit it a found file vim $(puppet config print hiera_config):

````puppet
---
# Hiera 5 Global configuration file
:backends:
  - yaml

:hierarchy:
  - common

:yaml:
  :datadir: "/etc/puppetlabs/code/environments/%{environment}/hieradata"
````

Hiera values for our test will be stored inside ``/etc/puppetlabs/code/environments/production/hieradata/common.yaml`` with the following content:

````puppet
---
fldr_name: '/opt/from_hiera'
````

A manifest that creates a folder using variable that stored in common.yaml. By default I am using sample ``init.pp`` file in ``/etc/puppetlabs/code/environments/production/manifests/init.pp``

````puppet
---
class start_me (
  $fldr_name,
) {
  file {'Create test folder':
    ensure => 'directory',
    path  => "${fldr_name}",
    force => true,
  }
}

class { 'start_me':
  fldr_name => hiera('fldr_name')
}

````

{% endraw %}