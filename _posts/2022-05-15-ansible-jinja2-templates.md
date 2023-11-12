---
layout: single
title: "Ansible Jinja2 Templates: A Basic Understanding to Standardizing Configurations"
subtitle: ""
date: 2022-05-05 19:00:00 +0100
background: '/image/01.jpg'
tags: ['ansible']
---

{% raw %}

Jinja2 templates in Ansible offer a powerful way to standardize and template files, such as configuration files and system roles. This article explores the basic syntax and practical applications of Jinja2 templating in Ansible, drawing on my personal experience.


## Using the template module:

Ansible's template module is instrumental in deploying templated files. Here's an example of its usage:

````yaml

- name: Deploy hello.html
  template:
    src: templates/hello.html.j2
    dest: /var/www/html/hello.html
````
Along with the template module, consider the following structure in your variables and template files:

````bash

$ cat vars/all/all.yml
print_msg = "This file is managed by Ansible"

$ cat templates/hello.html.j2
{{ print_msg }}
The system kernel is: {{ ansible_hostname }}
````

In Jinja2, the basic syntax elements are:

- `` \'{% EXPR %}' `` - for expressions or logic. 
- `` \'{{ EXPR }}' `` - to output the results of expressions or variables.
- `` \'{# COMMENT #}' `` - for comments

## Managing Jinja Files with Loops and Conditions

Jinja templates can be dynamically managed using loops and conditions. Below are some practical examples:

### Using Loops

1. Filtering specific items in a list:

````jinja
{# Check list with the models of auto #}
{% for model in models if not model == "BMW" %}
Line {{ loop.index }} - {{ model }}
{% endfor %}
````

2. Iterating through defined hostnames:

````jinja
{% for server_name in groups['servers'] %}
{{ server_name }}
{% endfor %}
````

3. Defining ``/etc/hosts`` File:

````jinja
{% for host in groups['all'] %}
{{ hostvars[host]['ansible_facts']['default_ipv4']['address'] }} {{ hostvars[host]['ansible_facts']['fqdn'] }} {{ hostvars[host]['ansible_facts']['hostname'] }}
{% endfor %}
````

### Using condition:

````jinja
{% if finished %}
{{ print_me }}
{% endif %}
````

## Applying Filters for Enhanced Output

In Jinja2, you can apply various filters to modify the output format or parse content from different formats. Some of these filters include:

* ``to_json``
* ``to_yaml``
* ``to_nice_yaml ``
* ``to_nice_json``
* ``from_json`` 
* ``from_yaml``

These filters are incredibly useful for transforming template data into specific formats like JSON or YAML, or for parsing data from these formats into your templates.

## Conclusion

Jinja2 templating in Ansible is a powerful tool for automating and standardizing the deployment of configuration files and system roles. By utilizing loops, conditions, and filters, you can create dynamic and versatile templates that cater to a wide range of scenarios. This personal exploration of Jinja2 should serve as a practical guide for anyone looking to harness the full potential of Ansible's templating capabilities.

## Reference
- [Ansible Playbook Filters](https://docs.ansible.com/ansible/2.9/user_guide/playbooks_filters.html)
- [Ansible Templates](https://docs.ansible.com/ansible/2.9/modules/template_module.html)


{% endraw %}
