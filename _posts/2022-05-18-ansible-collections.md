---
layout: single
title: "Basics of Ansible collections"
subtitle: ""
date: 2022-05-18 08:00:00 +0100
background: '/image/01.jpg'
tags: ['ansible']
---

{% raw %}


Ansible collection provides set of roles, modules, some plugins that are able to download on ansible control host and use them in playbooks. For example, ``community.crypto`` collection provides modules for managing TLS/SSL certificates. 

Collections are supported by Ansible starting with version 2.9.

Main benefit of collections: 
    - Ansible content collection gives flexibility. 
    - we can install set of only required modules instead all available ones. 
    - We can select specific version of the collection.

### Collection sources

- Ansible automation hub - official platform with collections. Red Hat officially reviews, updates, maintains collections at automation hub. The resource is available at [https://cloud.redhat.com/ansible/automation-hub/](https://cloud.redhat.com/ansible/automation-hub/)
- Ansible Galaxy - is a somehow a market where organizations as well as developers can share their collections.

By default ansible downloads collections from the galaxy. But it is able to configure in ansible.cfg file too:

````ini

[galaxy]
server_list = automation_hub, galaxy

[galaxy_server.automation_hub]
url=https://cloud.redhat.com/api/automation-hub/
auth_url=https://sso.redhat.com/auth/realms/redhat-external/protocol/openid-connect/token
token=sometocken

[galaxy_server.galaxy]
url=https://galaxy.ansible.com/

````

Instead of token we can use login and password as well:

````ini
[galaxy_server.automation_hub]
url=https://cloud.redhat.com/api/automation-hub/
username=someuser
password=somepassword
````

Or using a token in environment variable:

````ini
[galaxy_server.automation_hub]
url=https://cloud.redhat.com/api/automation-hub/
auth_url=https://sso.redhat.com/auth/realms/redhat-external/protocol/openid-connect/token
````


````bash
ANSIBLE_GALAXY_SERVER_<server_id>_<key>=value
ANSIBLE_GALAXY_SERVER_AUTOMATION_HUB_TOKEN='tocken'
````


### Installing collections

````bash
ansible-galaxy collection install community.crypto
````

Moreover, collections are able to be installed from a local or remote (webserver) tar archive, as well as roles:

````bash
ansible-galaxy collection install /<some-path>/<collection-name>.tar
ansible-galaxy collection install http://<webserver>/<collection-name>.tar
````

Using requirements file is able to install collections too:

````yaml

cat requirements.yml

  - my_namespace.my_collection

  - name: my_namespace.my_collection

  - name: my_namespace.my_collection
    version: 1.2.0

  - name: /tmp/collection-name.tar.gz

  - name: http://some-webserver/my_collection.tar.gz

````

### Using collections

````yaml

- hosts: all
  tasks:
    - import_role:
        name: my_namespace.my_collection.role1

    - my_namespace.mycollection.mymodule:
        option1: value

    - debug:
        msg: '{{ lookup("my_namespace.my_collection.lookup1", 'param1')| my_namespace.my_collection.filter1 }}'

````

To avoid a lot of typing, you can use the collections:

````yaml

- hosts: all
  collections:
   - my_namespace.my_collection
  tasks:
    - import_role:
        name: role1

    - mymodule:
        option1: value

    - debug:
        msg: '{{ lookup("my_namespace.my_collection.lookup1", 'param1')| my_namespace.my_collection.filter1 }}'

````

Real example:

````yaml

  tasks:
    - name: Deploy httpd server
      ansible.builtin.yum:
        name: httpd
        state: present

    - name: Start up and activate httpd service
      ansible.builtin.service:
        name: httpd
        state: started
        enabled: true

````

## References
- [Ansible user guide](https://docs.ansible.com/ansible/2.9/user_guide/collections_using.html)
- Other sources


{% endraw %}
