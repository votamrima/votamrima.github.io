---
layout: single
title: "A short help for regular expressions" 
subtitle: ""
date: 2021-12-08 16:30:00 +0100
background: '/image/01.jpg'
tags: ['regex']
---

{% raw %}

## Mostly used regex paterns

<table class="table table-bordered table-hover table-condensed">
 
</table>  

| Token | Explanation |
| --- | --- |
| [abcd] | a single character of a/b/c or d |
| [^abcd] | any character except a/b/c or d |
| [a-z] | matches any characters between a to z |
| [a-zA-Z] | matches any characters between a to z and A to Z |
| [^a-p] | matches any characters that are not in range between a to p |
| . | any single character |
| a\|b | sing of alternate. either *a* or *b* |
| \s | any whitespace character |
| \S | any non-whitespace character |
| \d | any digit |
| \D | any non-digit |
| \w | any word charater |
| \W | any non-word charater |
| (?:...) | Match everything enclosed |
| (...) | Capture everything enclosed |
| a? | a or zero |
| a* | more of a or a zero |
| a+ | one or more of a |
| a{3} | 3 of a |
| [0..9]{3} | any 3 digits in sequence |
| [0..9]{3,5} | from 3 to 5 digits in sequence  |
| a{3,} | 3 and more of a |
| a{3,6} | between 3 and 6 of a |
| [0..9]+ | from 1 to infinity |
| [0..9]{1,} | from 1 to infinity |
| [0..9]* | from 0 to infinity |
| [0..9]{0,} | from 0 to infinity |
| ^ | Start of string |
| $ | End of string |
| \n | New line |
| \r | Return sign |
| \t | Tab |
| \0 | Null character |
| () |  Grouping |
| --- | --- |


## Other patterns

<table class="table table-bordered table-hover table-condensed">
 
</table>  

| Token | Explanation |
| --- | --- |
| \v    | Vertical whitespace character |
| \#    | Match subpattern number # |
| \xYY  | Hex character |
| \ddd  | oktal character |
| [\b]  | backspace character |
| \A    | Start of string |
| \Z    | End of string |
| \b    | A word boundary. (Neither starts or ends with a specific letter.) |
| \B    | Non-word boundary |
| --- | --- |



## Examples:

This statement searches in text for the words more than 5 letters and following 2 digits:
````
\s\w{5,}\s+\d{2}\s
````

Here a regex command searches for the all last words in the sentences.

````
\W+\w{1,}(?:\.)
````

A regex that identifies all urls in the text:

````bash
(http|https://)(a-zA-z0-9.-_)\.(com|net)
````



## Source
1. [https://regex101.com/](https://regex101.com/)
2. [https://www.youtube.com/watch?v=8sv-6AN0_cg](https://www.youtube.com/watch?v=8sv-6AN0_cg)

{% endraw %}