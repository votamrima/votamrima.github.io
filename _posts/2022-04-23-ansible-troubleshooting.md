---
layout: single
title: "Troubleshooting in Ansible"
subtitle: ""
date: 2022-04-23 08:00:00 +0100
background: '/image/01.jpg'
tags: ['ansible']
---

{% raw %}

In this post, I am discussing troubleshooting of Ansible playbooks. Ansible provides several methods for managing playbooks. These include log configuration, specifying options like ``--step``, ``-v``, and controlling playbook execution using modules like ``fail`` or ``assert``.

## Log File Configuration

Unfortunately, logging is not configured in Ansible by default. However, we can configure it. There are two ways to activate logging:

There are two ways to activate logging:

* Set ``log_path`` parameter in ``default`` section of ``ansible.cfg`` file

````ini
cat ansible.cfg
[default]
log_path = /var/log/ansible-logs/ansible.log
````
* set environment variable ``$ANSIBLE_LOG_PATH``

**NOTE:** It is strongly recommended to use ``logrotate`` to manage the logs if they will be written in /var/log directory.

## Managing problems

``--syntax-check`` - checks the syntax in the playbook

````bash
ansible-playbook myplay.yml --syntax-check
````

``--step`` - using this option we can step to a specific task in a playbook

````bash
ansible-playbook myplay.yml --step
````

``--start-at-task`` - with this option we can start execution of a playbook from a specific task

````bash
ansible-playbook myplay.yml --start-at-task
````

Verbosity can be increased for debugging using -v parameter, with four levels of verbosity: ``-v, --vv, --vvv, --vvvv``.

``--check (or -C)`` executes a playbook without making changes to the managed host. You can control this option individually:

* Always run in check mode:

````yaml
- name: always run in check mode
  shell: hostname
  check_mode: yes
````

* Do not run in check mode, even if ``--check`` is specified:

````yaml
- name: always run in check mode
  shell: hostname
  check_mode: no
````

``--diff`` shows changes made to template files:

````bash
ansible-playbook myplay.yml --check --diff

````

## Expample Troubleshooting using modules

``script`` module executes a script against managed hosts. This script have to locate on the control node. Executing fails if script ends with the non-zero code.

````yaml

  tasks:
    - name: Run my script 
      script: run_my_script

````

``uri`` module helps to check some http services

````yaml

  tasks:
    - name: check my API
      uri:
        url: http://myapi.home.lab
        return_content: yes
      register: answer

    - fail:
        msg: 'Service is not up'
      when: "'UP' not in answer.content"

````

``stat`` - collects information about files and folders

````yaml

  tasks:
    - name: Check if /opt/app/hello.py file exists
      stat:
        path: /opt/app/hello.py
      register: answer

    - name: hello.py file does not exist
      fail:
      when: answer.stat.exists

````

The ``assert`` module can be used as an alternative to the fail module:

````yaml

  tasks:
    - name: Check if /opt/app/hello.py file exists
      stat:
        path: /opt/app/hello.py
      register: answer

    - name: hello.py file does not exist
      assert:
        that:
          - not answer.stat.exists

````

This note provides insight into some methods and modules for troubleshooting Ansible playbooks based on personal experiences. 

## Reference:
- [https://docs.ansible.com/ansible/2.9/reference_appendices/test_strategies.html](https://docs.ansible.com/ansible/2.9/reference_appendices/test_strategies.html)
- [https://docs.ansible.com/ansible/2.9/user_guide/playbooks_checkmode.html](https://docs.ansible.com/ansible/2.9/user_guide/playbooks_checkmode.html)
- [Google](https://google.com)

{% endraw %}
