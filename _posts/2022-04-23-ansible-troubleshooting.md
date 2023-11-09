---
layout: single
title: "Troubleshooting in Ansible"
subtitle: ""
date: 2022-04-23 08:00:00 +0100
background: '/image/01.jpg'
tags: ['ansible']
---

{% raw %}


In this post I am about troubleshooting of ansible playbooks. Ansible provides several ways of managing playbook. Some of them are: log configuration, defining some options such as ``--step``, ``-v`` and defining running management in playbook using such modules as ``fail`` or ``assert``

## Log file configuration

Unfortunatelly, logging is not configured in Ansible by default. However, we can configure it. 

There are two ways to activate logging:

* Set ``log_path`` parameter in ``default`` section of ``ansible.cfg`` file

````ini
cat ansible.cfg
[default]
log_path = /var/log/ansible-logs/ansible.log
````

It is recommended to use ``logrotate`` to manage the logs if they will be written in /var/log directory.

* set environment variable ``$ANSIBLE_LOG_PATH``


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

We can debug execution of a playbook using ``-v`` parameter. There are 4 levels of verbosity: ``-v``, ``--vv``, ``--vvv``, ``--vvvv``


``--check`` - option executes a playbook without making changes to the managed host. This option we can define by typing ``-C`` too.

Moreover, we can control ``--check`` option individually. 

* This task will be alway run in checking mode:

````yaml
- name: always run in check mode
  shell: hostname
  check_mode: yes
````

* This task will not run in check mode even if ``--check`` option is defined in ansible-playbook command

````yaml
- name: always run in check mode
  shell: hostname
  check_mode: no
````

``--diff`` - option shows changes made to template files.

````bash
ansible-playbook myplay.yml --check --diff

````

## Troubleshooting using modules

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

``assert `` module we can use alternatively to the ``fail`` module. Here, in order to customize the message we can use either ``success_msg`` or ``fail_msg`` options.

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

## Reference:
- [https://docs.ansible.com/ansible/2.9/reference_appendices/test_strategies.html](https://docs.ansible.com/ansible/2.9/reference_appendices/test_strategies.html)
- [https://docs.ansible.com/ansible/2.9/user_guide/playbooks_checkmode.html](https://docs.ansible.com/ansible/2.9/user_guide/playbooks_checkmode.html)
- [Google](https://google.com)

{% endraw %}
