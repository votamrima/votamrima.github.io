---
layout: single
title: "Cheatsheet for Vagrant"
subtitle: ""
date: 2019-06-03 16:38:00 +0100
#background: '/img/posts/01.jpg'
tags: ['vagrant']
---

{% raw %}

### Creating a VM
* ``vagrant init`` -- Initialize Vagrant with a Vagrantfile and ./.vagrant directory, using no specified base image. Beforeyou can do vagrant up, you'll need to specify a base image in the Vagrantfile.
* ``vagrant init`` -- Initialize Vagrant with a specific box. To find a box, go to the public Vagrant box catalog. When you find one you like, just replace it's name with boxpath. For example, vagrant init ubuntu/trusty64.


### Starting a VM
* ``vagrant up`` -- starts vagrant environment (also provisions only on the FIRST vagrant up)
* ``vagrant resume`` -- resume a suspended machine (vagrant up works just fine for this as well)
* ``vagrant provision`` -- forces reprovisioning of the vagrant machine
* ``vagrant reload`` -- restarts vagrant machine, loads new Vagrantfile configuration
* ``vagrant reload --provision`` -- restart the virtual machine and force provisioning


### Getting into a VM
* ``vagrant ssh`` -- connects to machine via SSH
* ``vagrant ssh`` -- If you give your box a name in your Vagrantfile, you can ssh into it with boxname. Works from any directory.


### Stopping a VM
* ``vagrant halt`` -- stops the vagrant machine
* ``vagrant suspend`` -- suspends a virtual machine (remembers state)


### Cleaning Up a VM
* ``vagrant destroy`` -- stops and deletes all traces of the vagrant machine
* ``vagrant destroy -f`` -- same as above, without confirmation


### Boxes
* ``vagrant box list`` -- see a list of all installed boxes on your computer
* ``vagrant box add`` -- download a box image to your computer
* ``vagrant box outdated`` -- check for updates vagrant box update
* ``vagrant boxes remove`` -- deletes a box from the machine
* ``vagrant package`` -- packages a running virtualbox env in a reusable box


### Saving Progress

``-vagrant snapshot save [options] [vm-name]`` -- vm-name is often default. Allows us to save so that we can rollback at a later time



### Tips
* ``vagrant -v`` -- get the vagrant version
* ``vagrant status`` -- outputs status of the vagrant machine
* ``vagrant global-status`` -- outputs status of all vagrant machines
* ``vagrant global-status`` --prune -- same as above, but prunes invalid entries
* ``vagrant provision --debug`` -- use the debug flag to increase the verbosity of the output
* ``vagrant push`` -- yes, vagrant can be configured to deploy code!
* ``vagrant up --provision | tee provision.log`` -- Runs vagrant up, forces provisioning and logs all output to a file


### Plugins
[vagrant-hostsupdater](https://github.com/cogitatio/vagrant-hostsupdater): ``$ vagrant plugin install vagrant-hostsupdater`` to update your /etc/hosts file automatically each time you start/stop your vagrant box.

### Source 
Regularly check this [source](https://gist.github.com/wpscholar/a49594e2e2b918f4d0c4)

{% endraw %}
