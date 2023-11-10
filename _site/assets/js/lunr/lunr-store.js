var store = [{
        "title": "Using logrotate",
        "excerpt":"create configuration file: bash-3.2# cat /etc/logrotate.d/myconf-logrotate.conf PATH_TO_FILE/LOG.FILE { daily missingok rotate 10 compress delaycompress compresscmd /usr/bin/gzip notifempty copytruncate } Testing configuration logrotate /etc/logrotate.conf --force -d Add a crontab job. A job will be run every hour. export EDITOR=vi crontab -e &gt;&gt; 0 * * * * /usr/sbin/logrotate /etc/logrotate.conf --force &gt;...","categories": [],
        "tags": ["logrotate","linux"],
        "url": "/using-logrotate/",
        "teaser": null
      },{
        "title": "Cheatsheet for Vagrant",
        "excerpt":"Creating a VM vagrant init – Initialize Vagrant with a Vagrantfile and ./.vagrant directory, using no specified base image. Beforeyou can do vagrant up, you’ll need to specify a base image in the Vagrantfile. vagrant init – Initialize Vagrant with a specific box. To find a box, go to the...","categories": [],
        "tags": ["vagrant"],
        "url": "/vagrant-cheetsheet/",
        "teaser": null
      },{
        "title": "Removing tmux from the puppet learning machine",
        "excerpt":"    cleanly and gracefully killing all tmux opened sessions and server too: ``` tmux kill-server   2. or killing all tmux processes:  pkill -f tmux    3. removing tmux application  yum erase -y tmux ````   ","categories": [],
        "tags": ["puppet"],
        "url": "/tmux-remove-puppetserver/",
        "teaser": null
      },{
        "title": "Using hiera in puppet. Example: creating a folder",
        "excerpt":"In this post I am trying to show how to configure hiera files on puppet master. For demonstration purpose I use a simple task that will create a folder. The main idea of this post is to get basic understand of hiera concept. Look up where is stored the main...","categories": [],
        "tags": ["puppet"],
        "url": "/hiera-in-puppet/",
        "teaser": null
      },{
        "title": "Simple HTTPS Server using python",
        "excerpt":"Here below I am going to shortly describe the process of setting up a simple https server on python Generating key and cert files with Openssl: [root@test crazytests]# openssl req -x509 -newkey rsa:4096 -keyout testkey.pem -out testcert.pem Generating a 4096 bit RSA private key .......++ ..............................................................................................................................................................................................................................++ writing new private key...","categories": [],
        "tags": ["python","webserver"],
        "url": "/a-simple-python-server/",
        "teaser": null
      },{
        "title": "Expanding /boot partition",
        "excerpt":"Recently I tried to update my centos 7 test machine. Unfortunatelly, yum update command returned the following error “At least 54MB more space needed on the /boot filesystem.”. df -h command showed following: [root@server ~]# df -h Filesystem Size Used Avail Use% Mounted on /dev/mapper/cl_centos03-root 32G 13G 19G 41% /...","categories": [],
        "tags": ["linux"],
        "url": "/more-space-for-boot-fs/",
        "teaser": null
      },{
        "title": "Check for opened ports without telnet",
        "excerpt":"If there is no telnet tools is installed on the host, try the following command to check if a port opened or not. -bash-4.2$ timeout 1 bash -c '(echo &gt; /dev/tcp/ip_adderess/port) &gt;/dev/null 2&gt;&amp;1' &amp;&amp; echo Port is open || echo Port is closed Example -bash-4.2$ timeout 1 bash -c '(echo...","categories": [],
        "tags": ["linux"],
        "url": "/port-checking/",
        "teaser": null
      },{
        "title": "root password reseting in centos",
        "excerpt":"In the grub menu select actual kernel and type “-e” Go to the line with “linux 16” and change ro to rw init=/sysroot/bin/sh”. before: after: Press ctrl+X for starting a single mode session When single mode is started access to the system…: chroot /sysroot And using passwd command change the...","categories": [],
        "tags": ["linux"],
        "url": "/reseting-root-password/",
        "teaser": null
      },{
        "title": "Creating a simple NFS share on centos",
        "excerpt":"In this post is noted a way of creating a simple NFS share server on centos 8 machine. 1. Installing NFS On the server side we should install nfs-utils packet: [root@nfs-server ~]# yum install nfs-utils and start/enable nfs-server service [root@nfs-server ~]# systemctl start nfs-server [root@nfs-server ~]# ^start^enable systemctl enable nfs-server...","categories": [],
        "tags": ["linux"],
        "url": "/creating-simple-nfs-share/",
        "teaser": null
      },{
        "title": "Basic SQL Joins",
        "excerpt":"Left Join and right Let’s say we have two tables - posts and users. Struncture of the both tables is following: post table has such columns as: id, title, content, user_id and date. Column user_id is a foreign key and related with the id column of users table users table...","categories": [],
        "tags": ["database"],
        "url": "/basic-sql-joins/",
        "teaser": null
      },{
        "title": "Editing files in Linux VM using remote Visual Studio Code",
        "excerpt":"Sometimes we need to edit a file directly on Linux VM using Visual Studio Code. Launch Visual Studio Code. Additionally, you have to able to connect to the bash of remote machine from VS Code. Go to the ‘Extensions’ page and search for ‘Remote VSCode’ Install the extension and re-launch...","categories": [],
        "tags": ["ide"],
        "url": "/edit-files-with-rmate/",
        "teaser": null
      },{
        "title": "Check and approve pendings csrs in Openshift cluster",
        "excerpt":"After installing Openshift cluster you should log in and check for csr. Moreover, I regularly controls if some csr have to be approved or not. [admin@ocp4 try]$ oc get csr NAME AGE SIGNERNAME REQUESTOR CONDITION csr-6m4m7 4m29s kubernetes.io/kube-apiserver-client-kubelet system:node:etcd-2.okd4.home.lab Approved,Issued csr-7qww9 4m13s kubernetes.io/kube-apiserver-client-kubelet system:node:okd4-compute-1.okd4.home.lab Approved,Issued csr-glzgb 4m29s kubernetes.io/kube-apiserver-client-kubelet system:node:okd4-control-plane-1.okd4.home.lab Pending...","categories": [],
        "tags": ["openshift"],
        "url": "/check-approve-csr-openshift/",
        "teaser": null
      },{
        "title": "Create persistance storage for openshift",
        "excerpt":"Here I am going to shortly describe a process of mounting a NFS shares to Openshift cluster. Create persistent volume resource Firstly, I created a setup_pv.yaml file with following content: apiVersion: v1 kind: PersistentVolume metadata: name: test-pv spec: capacity: storage: 10Gi accessModes: - ReadWriteMany persistentVolumeReclaimPolicy: Retain nfs: path: /opt/okdn_share/test server:...","categories": [],
        "tags": ["openshift"],
        "url": "/create-persistence-storage-for-openshift/",
        "teaser": null
      },{
        "title": "Basic user management in Openshift",
        "excerpt":"In this post I shortly describe how to create users for Openshift using HTPasswd provider. More about authentication providers are able to find in official documentation kubeadmin user During installation Openshift creates default kubeadmin with a automatically generated password. Password you can find in installation folder: &lt;installation_folder&gt;/auth/kubeadmin-password [admin@ocp4 try]$ cat...","categories": [],
        "tags": ["openshift"],
        "url": "/create-openshift-oauth-users/",
        "teaser": null
      },{
        "title": "Deploy MySQL and PostgreSQL database systems on Podman with regular (non-root) user",
        "excerpt":"MySQL Install mysql client: sudo yum install mysql Create a folder on the local host for storing databases and configure SELinux option: mkdir /opt/homelab_projects/mysql_db_dir_noroot [admin@workstation homelab_projects]$ sudo semanage fcontext -a -t container_file_t '/opt/homelab_projects/mysql_db_dir_noroot(/*)' [admin@workstation homelab_projects]$ restorecon -v 'mysql_db_dir_noroot' [admin@workstation homelab_projects]$ ll -Z total 56 ......... drwxrwxr-x. 2 admin admin unconfined_u:object_r:container_file_t:s0...","categories": [],
        "tags": ["podman","database"],
        "url": "/running-database-on-podman/",
        "teaser": null
      },{
        "title": "Deploy a python application using podman. Deploy rootless container and connect podmanized database container",
        "excerpt":"In order to connect a rootless application container to the rootles database container I used port mapping technique. The following steps were used for successfully applying application with connection to database. First of all I installed libvirt package in order to enable virtualization network interface: [admin@podman ~]$ sudo yum install...","categories": [],
        "tags": ["podman","python"],
        "url": "/deploy-application-on-podman/",
        "teaser": null
      },{
        "title": "A short help for regular expressions",
        "excerpt":"Mostly used regex paterns Token Explanation [abcd] a single character of a/b/c or d [^abcd] any character except a/b/c or d [a-z] matches any characters between a to z [a-zA-Z] matches any characters between a to z and A to Z [^a-p] matches any characters that are not in range...","categories": [],
        "tags": ["regex"],
        "url": "/regex-help/",
        "teaser": null
      },{
        "title": "Creating systemd tasks for applications and podman rootless containers",
        "excerpt":"Here I describe a procees of creating a simple service startup job at linux. Sample systemd file Here below is shown a sample service file for systemctl [Unit] Description=Description for application After=network.target [Service] User=&lt;user&gt; Group=&lt;group&gt; WorkingDirectory=&lt;path where running file is located&gt; Environment=&lt;path with environment variable PATH \"PATH=/location\"&gt; EnvironmentFile=&lt;path to environment...","categories": [],
        "tags": ["linux","podman","container"],
        "url": "/create-systemctl-service/",
        "teaser": null
      },{
        "title": "Fixing \"Cannot Install Windows 11\" error during installation",
        "excerpt":"Problem Today I tried to install Windows 11 on my virtual platform and during installation faced with the following problem: Solution In this screen type Shift + F10 at the same time to open a command promt. Then in command line type regedit: In the opened Registry Editor window, go...","categories": [],
        "tags": ["windows"],
        "url": "/windows11-requirements-error/",
        "teaser": null
      },{
        "title": "My experience of Openshift 4.9 installation on Proxmox with a restricted network",
        "excerpt":"In this post I tried to describe my experience that I had during Openshift 4.9 installation at my home lab. Redhat allows to use Openshift during 60 days for free without support. Preparing environment Set up DNS and DHCP Set up proxy Download RHCOS (https://console.redhat.com/openshift/install/metal/user-provisioned) Create bare metal environment. In...","categories": [],
        "tags": ["openshift"],
        "url": "/installing-openshift4.9/",
        "teaser": null
      },{
        "title": "Stop and start Openshift 4 cluster",
        "excerpt":"In this post I describe shortly how to shutdown and start up Openshift cluster. Preparation Check if all nodes are properly running: oc get nodes --show-labels Check if all pods in all projects are working properly. Save the current state: oc get pods --all-namespaces Additionally, you can create backup of...","categories": [],
        "tags": ["openshift"],
        "url": "/openshift49-gracefull-restart/",
        "teaser": null
      },{
        "title": "Working with cat EOF in bash",
        "excerpt":"This post has been fully copied from the stackoverflow page https://stackoverflow.com/questions/2500436/how-does-cat-eof-work-in-bash The cat &lt;&lt;EOF syntax is very useful when working with multi-line text in Bash, eg. when assigning multi-line string to a shell variable, file or a pipe. Examples of “cat «EOF syntax usage in Bash”: Assign multi-line string to...","categories": [],
        "tags": ["linux"],
        "url": "/cat-eof/",
        "teaser": null
      },{
        "title": "Private container registry on podman",
        "excerpt":"It is very easy to set up a simple container registry on podman. Here below I show how to set up a local simple container registry for personal use. Preparation If podman and htpasswd packages are not installed on the host, install them: [admin@podman auth]$ sudo dnf provides htpasswd [sudo]...","categories": [],
        "tags": ["podman","container"],
        "url": "/private-container-registry/",
        "teaser": null
      },{
        "title": "Troubleshooting in Ansible",
        "excerpt":"In this post I am about troubleshooting of ansible playbooks. Ansible provides several ways of managing playbook. Some of them are: log configuration, defining some options such as --step, -v and defining running management in playbook using such modules as fail or assert Log file configuration Unfortunatelly, logging is not...","categories": [],
        "tags": ["ansible"],
        "url": "/ansible-troubleshooting/",
        "teaser": null
      },{
        "title": "Ansible Jinj2 templates",
        "excerpt":"Jinja templating helps to standartize and to template files such as config and system roles. Here is basic syntax. Using template module: - name: Deploy hello.html template: src: templates/hello.html.j2 dest: /var/www/html/hello.html $ cat vars/all/all.yml print_msg = \"This file is managed by Ansible\" $ cat templates/hello.html.j2 {{ print_msg }} The system...","categories": [],
        "tags": ["ansible"],
        "url": "/ansible-jinja2-templates/",
        "teaser": null
      },{
        "title": "Kubernetes installation. (Not finished)",
        "excerpt":"In this post I describe the installation process of a simple Kubernetes cluster. This post has not been finished yet. Cluster concists from 3 nodes: 1 master node, 2 worker nodes, based on Fedora 35 and all VMs are running at Proxmox. Node configuration Following steps should be proceeded on...","categories": [],
        "tags": ["kubernetes"],
        "url": "/kubernets-install/",
        "teaser": null
      },{
        "title": "Basics of storage management using Ansible",
        "excerpt":"Generally, there are available 5 modules that allow to manage storage: parted, lvg, lvol, filesystem, mount. parted module creates partition. lvg, lvol - module are supporting to create logical volume groups. filesystem - module creates a filesystem mount module mounts a created partition and insert mounting config to /etc/fstab. Code...","categories": [],
        "tags": ["ansible"],
        "url": "/ansible-basic-storage-management/",
        "teaser": null
      },{
        "title": "Basics of Ansible collections",
        "excerpt":"Ansible collection provides set of roles, modules, some plugins that are able to download on ansible control host and use them in playbooks. For example, community.crypto collection provides modules for managing TLS/SSL certificates. Collections are supported by Ansible starting with version 2.9. Main benefit of collections: - Ansible content collection...","categories": [],
        "tags": ["ansible"],
        "url": "/ansible-collections/",
        "teaser": null
      },{
        "title": "How I deployed my first app in kubernetes",
        "excerpt":"In this post I am going to describe how I deployed my python service on kubernetes and how I realized connection to external database. About application The test application is based on FastAPI module. Main purpose of the service is handling incomming requests and save them into the databse. For...","categories": [],
        "tags": ["kubernetes"],
        "url": "/deploy-simple-app-in-kubernetes/",
        "teaser": null
      },{
        "title": "First steps in helm",
        "excerpt":"Here I would like to describe my first steps in learning helm. Installation I installed Helm using following instruction: Downloaded the latest version from the website: https://github.com/helm/helm/releases Unpacked the archive: tar fzx helm-v3.9.0-linux-amd64.tar.gz Set following string into ~/.bashrc HELM_PATH=\"/opt/helm/linux-amd64\" PATH=$PATH:$HELM_PATH Using Helm Adding a new repo: [admin@podman helm]$ helm repo...","categories": [],
        "tags": ["helm"],
        "url": "/first-touch-with-helm/",
        "teaser": null
      },{
        "title": "Creating a cloud-init VM Template on Proxmox using packer",
        "excerpt":"Recently I built up a virtual machine template on Proxmox using Packer. Here below I am going to show which steps were followed in order to achive the aim. I am going to set up VM with CentOS 8 Stream on board. Installing Packer Here is shown how to install...","categories": [],
        "tags": ["packer"],
        "url": "/first-vm-template-using-packer/",
        "teaser": null
      },{
        "title": "Creating fedora linux cloud init template for proxmox manually",
        "excerpt":"Download fedora cloud image from https://alt.fedoraproject.org/cloud/. I used to download the last version in raw image Creating VM in terminal A VM creating process I ran in proxmox terminal using the following commands: Create a new VM. Here I defined a machine with internal Proxmox ID 403, with memory 4...","categories": [],
        "tags": ["proxmox"],
        "url": "/fedora-template-proxmox-manually/",
        "teaser": null
      },{
        "title": "excel automation: enabling and using macros for date-time  stamps",
        "excerpt":"To enable and work with macro-enabled files in Excel and ensure the macros run correctly, you must follow some steps. This article provides a guide on how to enable macro-enabled file types and how to apply a specific VBA macro. Enabling Macro-Enabled File Types Save as Macro-Enabled Workbook: After creating...","categories": [],
        "tags": ["excel"],
        "url": "/excel-automation-set-timedate-automatically/",
        "teaser": null
      },{
        "title": "How I set DNS name as a hostname",
        "excerpt":"Introduction When configuring a new Rocky VM in my home lab, I decided to experiment with setting the hostname dynamically based on the DNS resolution. Here’s an overview of my process: Initial Attempts with the dig Command My first step involved preparing the environment for DNS queries. I installed the...","categories": [],
        "tags": ["ansible","linux"],
        "url": "/applied-dnsname-as-hostname/",
        "teaser": null
      },{
        "title": "Creating a Local YUM Repository on Rocky Linux",
        "excerpt":"Creating a Local YUM Repository on Rocky Linux Local YUM repositories are crucial for systems where internet access is limited, or package deployment needs tight control. This short article guides you through setting up a local repository on Rocky Linux. Unpacking RPM File First, unpack the desired RPM files into...","categories": [],
        "tags": ["linux"],
        "url": "/creating-local-yum-repo/",
        "teaser": null
      }]
