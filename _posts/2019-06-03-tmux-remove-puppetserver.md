---
layout: single
title: "Removing tmux from the puppet learning machine"
subtitle: ""
date: 2019-06-03 16:38:00 +0100
#background: '/img/posts/01.jpg'
tags: ['puppet']
---

{% raw %}

1. cleanly and gracefully killing all tmux opened sessions and server too:
```
tmux kill-server

```
2. or killing all tmux processes:
````
pkill -f tmux

````

3. removing tmux application
````
yum erase -y tmux 
````

{% endraw %}