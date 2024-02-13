---
layout: single
title: "Changing in Satellite download policy for all repos using hammer"
subtitle: ""
date: 2024-02-13 18:15:00 +0100
background: '/image/01.jpg'
tags: ['linux','satellite','hammer']
---

{% raw %}


Here I am posting a short note about the changing download policy for repositories in RedHat Satellite. 

Basically, it is able to proceed such task manually, using the web interface. 

Another way, which is more effective and fast is using hammer. Here is the single command how I proceed it:

````bash
for i in $(hammer repository list | awk 'NR>1 && $1 ~ /^[0-9]+$/ {print $1}' | paste -sd " ") ; do hammer repository update --download-policy on_demand --id $i ; done ;
````

This command comprises two main parts: The first segment ``hammer repository list | awk 'NR>1 && $1 ~ /^[0-9]+$/ {print $1}' | paste -sd " "`` retrieves a list of all repository IDs. The second part, ``hammer repository update --download-policy on_demand --id $i``, updates each repository's download policy to "on_demand."

Going deeper to the first segment: 

``awk 'NR>1 && $1 ~ /^[0-9]+$/ {print $1}'``: This command processes each line of output, skipping the first line. It checks that the first field ``($1)`` consists only of numbers (``/^[0-9]+$/``) before printing it.

``paste -sd, " "`` is used to concatenate the numeric IDs into a single line separated by spaces.

{% endraw %}