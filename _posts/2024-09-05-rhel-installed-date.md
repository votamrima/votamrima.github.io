---
layout: single
title: "How to check the installation date of Linux"
subtitle: ""
date: 2024-09-05 11:15:00 +0100
background: '/image/01.jpg'
tags: ['linux']
---

{% raw %}

To find out when Linux was installed on your host, there isn't a default command, but here are some useful tricks:

**Using rpm to check installation time of `basesystem` (Preferred Method):**
```bash
rpm -q basesystem --qf '%{installtime:date}\n'
```

**Using `ls` and `awk` commands:**
   ```bash
   ls -alct / | tail -1 | awk '{print $6, $7, $8}'
   ```

**Using the `stat` command on root directory:**
In this method take attention to the last field 'birth'

```bash
stat --format=%w /
```

> Note: The "birth" field might display "-".

{% endraw %}