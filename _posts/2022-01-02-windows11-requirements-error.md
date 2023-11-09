---
layout: single
title: "Fixing \"Cannot Install Windows 11\" error during installation"  
subtitle: ""
date: 2022-01-02 18:40:00 +0100
background: '/image/01.jpg'
tags: ['windows']
---

{% raw %}

## Problem
Today I tried to install Windows 11 on my virtual platform and during installation faced with the following problem:

![Image](images/../../images/windows11-requirements-error/pic1.png)

## Solution

In this screen type ``Shift + F10`` at the same time to open a command promt. Then in command line type ``regedit``:

![Image](images/../../images/windows11-requirements-error/pic2.png)

In the opened Registry Editor window, go to HKEY_LOCAL_MACHINE -> SYSTEM -> Setup.

![Image](images/../../images/windows11-requirements-error/pic3.png)

Right click on Setup and then create a New -> Key. Give some name to created key. I named it "MyConfig". **!!!! Give "LabConfig" name. !!!**

![Image](images/../../images/windows11-requirements-error/pic4.png)

Click right button on the blank space of the window and choose: New -> DWORD (32-bit) Value.

![Image](images/../../images/windows11-requirements-error/pic5.png)

Rename created value to BypassTPMCheck. Thenk double-click on the on the created object and change Value date to 1.

![Image](images/../../images/windows11-requirements-error/pic6.png)

Create more DWORDS values and give them following names: BypassCPUCheck, BypassRAMCheck and BypassSecureBootCheck. The value data of all created objects should be 1.

![Image](images/../../images/windows11-requirements-error/pic7.png)

Close all opened windows. 

![Image](images/../../images/windows11-requirements-error/pic8.png)


And click on "Install now" button.

![Image](images/../../images/windows11-requirements-error/pic9.png)

That's it.

{% endraw %}


## Reference:
[How to Fix Cannot Install Windows 11 on VMware Workstation](https://www.youtube.com/watch?v=sCLJYNI77Bk)

