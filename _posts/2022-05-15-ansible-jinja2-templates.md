---
layout: single
title: "Ansible Jinj2 templates"
subtitle: ""
date: 2022-05-05 19:00:00 +0100
background: '/image/01.jpg'
tags: ['ansible']
---

{% raw %}

Jinja templating helps to standartize and to template files such as config and system roles. Here is basic syntax.

Using template module:

````yaml

- name: Deploy hello.html
  template:
    src: templates/hello.html.j2
    dest: /var/www/html/hello.html
````

````bash

$ cat vars/all/all.yml
print_msg = "This file is managed by Ansible"

$ cat templates/hello.html.j2
{{ print_msg }}
The system kernel is: {{ ansible_hostname }}
````


- `` \'{% EXPR %}' `` - for expressions or logic. 
- `` \'{{ EXPR }}' `` - outputs results of expressions or variables
- `` \'{# COMMENT #}' `` - comments

We can manage a jinja file using loops and conditions.

## Using Loops

````jinja
{# Check list with the models of auto #}
{% for model in models if not model == "BMW" %}
Line {{ loop.index }} - {{ model }}
{% endfor %}
````

Or let's print all defined hostnames

````jinja
{% for server_name in groups['servers'] %}
{{ server_name }}
{% endfor %}
````

Or classic task, define /etc/hosts file:

````jinja
{% for host in groups['all'] %}
{{ hostvars[host]['ansible_facts']['default_ipv4']['address'] }} {{ hostvars[host]['ansible_facts']['fqdn'] }} {{ hostvars[host]['ansible_facts']['hostname'] }}
{% endfor %}
````

## Using condition:

````jinja
{% if finished %}
{{ print_me }}
{% endif %}
````

Additionally, in jinja template we can apply some filters to express the output to yaml or json or to get expression from yaml and json. These filters are: ``to_json``, ``to_yaml``, ``to_nice_yaml ``, ``to_nice_json``, ``from_json``, ``from_yaml``.


## Reference
- [Ansible Playbook Filters](https://docs.ansible.com/ansible/2.9/user_guide/playbooks_filters.html)
- [Ansible Templates](https://docs.ansible.com/ansible/2.9/modules/template_module.html)


{% endraw %}
