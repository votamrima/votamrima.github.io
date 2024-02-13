---
layout: single
title: "Setting the DNS name as a hostname using ansible"
subtitle: ""
date: 2023-11-07 22:50:00 +0100
background: '/image/01.jpg'
tags: ['ansible','linux']
---

{% raw %}

## Introduction
When configuring a new Rocky VM in my home lab, I decided to experiment with setting the hostname dynamically based on the DNS resolution.

Here's an overview of my process:

## Initial Attempts with the dig Command

My first step involved preparing the environment for DNS queries. I installed the dnspython package to facilitate DNS lookups:

````bash
[admin@workstation ansible_activity]$ pip install dnspython

````

Following that, I updated the community.general collection to ensure all Ansible modules were up-to-date:


````bash
[admin@workstation ansible_activity]$ ansible-galaxy collection install community.general
Process install dependency map
Starting collection install process
Installing 'community.general:8.0.1' to '/home/admin/.ansible/collections/ansible_collections/community/general'
````

These installations were necessary prerequisites for utilizing the dig command within Ansible. However, the dig command did not return the expected DNS name, prompting me to switch to nslookup.


## Setting the Hostname

### Extracting Output from nslookup

To accurately retrieve the DNS name of the host, I utilized a regular expression within Ansible. Here’s the regex I applied:

````bash
regex_search('name\\s+=\\s+(.*)', '\\1')
````

Breaking down the regex components:

* `regex_search` is an Ansible filter that conducts a regex pattern search within a string.
* `name` signals the literal string we're searching for in the input.
* `\\s+` identifies one or more whitespace characters.
* `=` is the literal equal sign.
* `\\s+` (repeated) indicates additional whitespace characters following the equal sign.
* `(.*)` captures all subsequent characters, denoting the target DNS name.


The entire pattern ``name\\s+=\\s+(.*)`` is designed to locate the line that begins with "name", followed by whitespace, an equal sign, more whitespace, and finally the DNS name.

* ``\\1`` is a backreference to the content captured by the regex.
* ``|`` first ensures that if multiple matches are found, only the first (and most relevant) result is used.


### Ansible Playbook Incorporating Regex

The following playbook snippet implements the aforementioned regex pattern to retrieve and set the DNS name:

````bash
- name: Get the DNS name for the host using nslookup
  command: "nslookup {{ inventory_hostname }}"
  register: nslookup_output

- name: Get the DNS name for the host
  set_fact:
    dns_hostname: "{{ nslookup_output.stdout | regex_search('name\\s+=\\s+(.*)', '\\1') }}" 

- name: Set the hostname using shell
  shell: "hostnamectl set-hostname {{ dns_hostname }}"
````

This playbook performs a DNS lookup, extracts the DNS name using the defined regex, and then uses that name to set the system's hostname.

{% endraw %}