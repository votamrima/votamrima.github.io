---
layout: single
title: "Basics of storage management using Ansible"
subtitle: ""
date: 2022-05-15 13:00:00 +0100
background: '/image/01.jpg'
tags: ['ansible']
---


{% raw %}

Generally, there are available 5 modules that allow to manage storage: ``parted``, ``lvg``, ``lvol``, ``filesystem``, ``mount``. 

- ``parted`` module creates partition.
- ``lvg``, ``lvol`` - module are supporting to create logical volume groups.
- ``filesystem`` - module creates a filesystem
- ``mount`` module mounts a created partition and insert mounting config to ``/etc/fstab``. 

## Code

Here below I share a basic playbook for managing storage:


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


File with variables in this example is locating in ``host_vars/machinea/vars.yml``

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

### Reference:
- ``ansible-doc`` command

{% endraw %}