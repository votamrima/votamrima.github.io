---
layout: single
title: "Basics of Storage Management Using Ansible"
subtitle: ""
date: 2022-05-15 13:00:00 +0100
background: '/image/01.jpg'
tags: ['ansible']
---


{% raw %}

Ansible is a powerful automation tool that simplifies complex configuration tasks. Among its many capabilities, storage management is particularly useful. This article covers the basics of storage management using Ansible, highlighting five key modules: `parted`, `lvg`, `lvol`, `filesystem`, and `mount`.

## Ansible Modules for Storage Management

Each of these modules plays a specific role in managing storage:

- ``parted`` module creates partition.
- ``lvg``, ``lvol`` - module are supporting to create logical volume groups.
- ``filesystem`` - module creates a filesystem
- ``mount`` module mounts a created partition and insert mounting config to ``/etc/fstab``. 

## Example Playbook for Storage Management

Below is a basic Ansible playbook demonstrating how to manage storage using these modules.



````yaml
- name: Create new partition
  hosts: machinea
  gather_facts: true
  tasks:
  - name: block managing storage
    block:
    - name: Create partition
      parted:
        device: "{{ item.device }}"
        number: "{{ item.number }}"
        state: "{{ item.state }}"
        part_start: "{{ item.start }}"
        part_end: "{{ item.end }}"
      loop: "{{ partitions }}"

    - name: Create volume group
      lvg:
        vg: "{{ item.vg_name }}"
        pvs: "{{ item.vg_device }}"
        state: "{{ item.vg_state }}"
      loop: "{{ partitions }}"

    - name: Create a logical volume
      lvol:
        vg: "{{ item.vg_group }}"
        lv: "{{ item.lvol_name }}"
        size: "{{ item.size }}"
        state: "{{ item.state }}"
        resizefs: "{{ item.resizefs }}"
        force: "{{ item.force }}"
      loop: "{{ logical_volumes }}"
      
    - name: Defining filesystem
      filesystem:
        fstype: "{{ item.fstype }}"
        dev: "/dev/{{ item.vg_group }}/{{ item.lvol_name }}"
      loop: "{{ logical_volumes }}"

    - name: Mount the volume
      mount:
        path: "{{ item.mount_path }}"
        src: "/dev/{{ item.vg_group }}/{{ item.lvol_name }}"
        opts: "{{ item.mount_opts }}"
        state: "{{ item.mount_state }}"
        fstype: "{{ item.fstype }}"
      loop: "{{ logical_volumes }}"
    become: true
````

## Variables File
The playbook refers to a variables file located at ``host_vars/machinea/vars.yml``, which defines the parameters for the partitions and logical volumes.

````yaml
partitions:
  - device: /dev/sdb
    number: 1
    state: present
    start: 1MiB
    end: 1GiB
    vg_name: vg-a
    vg_device: /dev/sdb1
    vg_state: present

logical_volumes:
  - lvol_name: vol1
    size: 250
    state: present
    vg_group: vg-a
    mount_path: /opt/testmount
    state: present
    resizefs: true
    fstype: xfs
    mount_state: mounted
    mount_opts: noatime
    force: true
````

This example demonstrates how Ansible can streamline the process of managing storage, from partition creation to volume mounting, with the flexibility to define and adjust parameters as needed.

**Note:** The above playbook and variable configurations are based on personal experience and may need adjustments based on specific system environments and requirements.


### Reference:
- ``ansible-doc`` command

{% endraw %}