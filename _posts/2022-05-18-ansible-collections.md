---
layout: single
title: "Understanding Ansible Collections"
subtitle: ""
date: 2022-05-28 08:00:00 +0100
background: '/image/01.jpg'
tags: ['ansible']
---

{% raw %}

Ansible collections have revolutionized how Ansible content such as roles, modules, and plugins are managed, shared, and used. This article delves into the basics of Ansible collections based on personal experiences and insights.

## What are Ansible Collections?
Ansible collections are a set of resources including roles, modules, and plugins that can be downloaded to an Ansible control host and used in playbooks. For instance, the ``community.crypto`` collection includes modules for managing TLS/SSL certificates. Collections have been a part of Ansible since version 2.9.

## Main Benefits of Collections
* Flexibility: Collections allow for a more flexible approach in managing Ansible content.
* Modularity: Users can install only the required modules, avoiding unnecessary bloat.
* Version Control: Specific versions of collections can be selected, offering better control over the tools and functionalities used.


### Collection Sources
* Ansible Automation Hub: This is the official platform with collections that are reviewed, updated, and maintained by Red Hat. It's available at [Ansible Automation Hub](https://cloud.redhat.com/ansible/automation-hub/).

* Ansible Galaxy: This platform acts as a marketplace where both organizations and individual developers can share their collections.

By default, Ansible downloads collections from Galaxy, but this can be configured in the ansible.cfg file:

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

Alternatively, login credentials or environment variables can be used for authentication:


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

## Installing collections

To install a collection:

````bash
ansible-galaxy collection install community.crypto
````

Collections can also be installed from a local or remote tar archive:

````bash
ansible-galaxy collection install /<some-path>/<collection-name>.tar
ansible-galaxy collection install http://<webserver>/<collection-name>.tar
````

Using a requirements file:

````yaml

cat requirements.yml

  - my_namespace.my_collection

  - name: my_namespace.my_collection

  - name: my_namespace.my_collection
    version: 1.2.0

  - name: /tmp/collection-name.tar.gz

  - name: http://some-webserver/my_collection.tar.gz

````

## Using Collections in Playbooks

In playbooks, collections simplify the task of specifying roles and modules:

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

To reduce verbosity, you can specify the collection at the beginning:

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

## Real-World Example

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

## Conclusion
Ansible collections offer a modular, flexible, and efficient way of managing various Ansible resources. They streamline the process of using specific roles and modules, ensuring that only necessary components are installed and maintained. With these insights and experiences, adopting collections in your Ansible playbooks can greatly enhance your automation tasks.

## References
- [Ansible user guide](https://docs.ansible.com/ansible/2.9/user_guide/collections_using.html)
- Other sources


{% endraw %}
