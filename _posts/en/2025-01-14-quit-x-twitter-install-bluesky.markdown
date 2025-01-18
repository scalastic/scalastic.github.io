---
layout: post
title: "Enough is Enough? Quit X, Switch to BlueSky"
date: 2025-01-18 23:28:00 +0100
description: "Tired of toxicity on X? Discover BlueSky, an ethical and decentralized alternative. Host your own social network with BlueSky PDS!"
img: quit-x-twitter-install-bluesky.jpg
fig-caption: "Leave X for a healthier and ethical social network: discover BlueSky PDS."
tags: ["HelloQuitX", "Bluesky", "X", "Twitter", "Tutorial", "Personal Data Server", "We'reNotSheep", "EnoughIsEnough"]
lang: en
permalink: /quit-x-twitter-install-bluesky/
status: finished
seo_title: "Enough is Enough? Quit X for BlueSky: Host Your Own Social Network"
seo_description: "Fed up with X? Discover BlueSky, an ethical and decentralized alternative. Learn how to install BlueSky PDS to create your own social network."
---


Since the acquisition of **_Twitter_** by Elon Musk in October 2022, renamed **_X_**, the platform has undergone profound structural and strategic changes. Among these are drastic staff reductions, particularly impacting teams responsible for content moderation and security. This lack of oversight has led to a significant rise in problematic content, seemingly amplified by new algorithms. These include hate speech, misinformation, and conspiracy theories. The situation worsened during Donald Trump’s presidential campaign in November 2024. Musk, who publicly supported Trump by investing $118 million in his campaign, became a prominent figure promoting far-right ideologies and misinformation. As a result, many public figures, media outlets, and institutions decided to leave the platform, condemning its amplification of harmful content and an environment increasingly at odds with their values.

> info "Meta (Facebook, Instagram, WhatsApp, and Threads)"
> The CEO of **_Meta_**, Mark Zuckerberg, also announced the end of the fact-checking program in the United States, replacing it with a **_community notes_** system similar to X’s. Additionally, Zuckerberg expressed a desire to reintroduce more "masculine energy" in the workplace, criticizing what he perceived as excessive diversity and inclusion policies. These initiatives seem to align Meta with the policies of the Trump administration, signaling closer ties with the government.

### Alternatives: Bluesky and Mastodon

- **Bluesky**: Initiated in 2019 by Jack Dorsey, co-founder of Twitter, Bluesky became an independent company in 2021. It is built on the AT Protocol, designed to create a decentralized social network while offering a unified user experience. Unlike Mastodon, Bluesky offers a more centralized interface with plans for future federation. This approach has attracted many users: the platform gained over 5 million sign-ups within five days of Trump’s election, reaching 27.6 million users by January 2025.
- **Mastodon**: Launched in 2016 by Eugen Rochko, Mastodon is a decentralized microblogging platform. It operates on the ActivityPub protocol, allowing users to join or create independent "instances" (servers) with their own rules and moderation. This structure fosters specific communities and greater user autonomy.

### A Growing Collective Trend

The hashtag `#HelloQuitX`, along with variants like `#HelloQuitteX` in France, became a collective rallying cry to leave X following Trump’s election. Supported by academics, associations, and public figures, this movement has driven awareness campaigns encouraging users to migrate to more ethical social networks.

A clear trend is emerging: many users leaving X are transitioning to Bluesky, a platform reminiscent of Twitter’s user experience before its recent changes. Bluesky also benefits from its strategic positioning as a decentralized alternative, thanks to its adoption of the AT Protocol. While temporarily maintaining a centralized structure to simplify the onboarding process, this compromise appeals to users deterred by the perceived complexity of Mastodon or Meta’s new policies. Additionally, Bluesky attracts users with its stricter moderation and a growing community that values respectful and inclusive interactions.


<hr class="hr-text" data-content="Table of Contents">

* TOC
{:toc}

<hr class="hr-text" data-content="Bluesky PDS">

## Bluesky PDS: A Technical Solution for Experts  

Bluesky stands out for its innovative approach to decentralization, built on its **AT Protocol (Authenticated Transfer)**. At the core of this architecture lies the **Bluesky PDS** (Personal Data Server), offering advanced users the ability to directly control their data and online presence.  

### What is Bluesky PDS?  
The Bluesky PDS is a solution designed to independently host and manage your data while interacting with the Bluesky network. Unlike relying on a centralized instance, as is common with most social networks, Bluesky PDS allows technical users and organizations to:  

- **Control their personal data**: By hosting a PDS server, users retain full ownership of their content and metadata, reducing reliance on a single platform.  
- **Customize their experience**: PDS administrators can tailor moderation settings, dissemination algorithms, and interaction policies to meet their specific needs.  
- **Federate with other instances**: By integrating the AT Protocol, each PDS can seamlessly interact with other servers, creating a decentralized yet interoperable ecosystem.  

### Who is Bluesky PDS for?  
Bluesky PDS is primarily aimed at **technical experts**, such as developers, system administrators, and organizations seeking full control over their data and online interactions. Setting up a PDS requires technical expertise in deployment, hosting, and maintenance.  

> info "A Simpler Alternative for Casual Users"  
> For users who prefer not to manage the technical aspects of a PDS, the easiest solution is to create an account directly on the official Bluesky platform via [https://bsky.app/](https://bsky.app/){:target="_blank" rel="noopener noreferrer nofollow"}. This option provides an intuitive, ready-to-use experience, ideal for exploring the network with minimal effort.  

For advanced users or technical professionals interested in deepening their use of Bluesky and actively contributing to the decentralized ecosystem, this article will explore the steps necessary to install and configure a Bluesky PDS on your own infrastructure.  


<hr class="hr-text" data-content="Installation">

## Step-by-Step Installation Guide for Bluesky PDS  

Here is a step-by-step guide to installing Bluesky PDS on your server, based on the official Bluesky PDS repository:

{% github_card bluesky-social/pds %}

### Prerequisites  

To install and configure Bluesky PDS, you will need the following:  

- A server with a **public IPv4 address** or a **public DNS name** accessible from the Internet.  
- Server administration access with **root** or **sudo** privileges.  
- A valid domain name under your control, configured to point to your server.  
- Basic knowledge of **system administration** and **command-line tools**.  

> info "Recommended Hardware Resources"  
> | -------------------------- | ------------ |  
> | **Operating System**       | Ubuntu 20.04/22.04 or Debian 11/12. |  
> | **Memory (RAM)**           | 1 GB         |  
> | **CPU Cores**              | 1            |  
> | **Storage**                | 20 GB SSD    |  
> | **Architectures**          | amd64, arm64 |  
> | **Number of Users**        | 1-20         |  

This minimal configuration is sufficient to host a small Bluesky PDS instance for personal or small community use.

<hr class="hr-text" data-content="">

### Step 1: DNS Configuration  

- Point your domain name to your server’s IP address by setting up the appropriate DNS records with your domain registrar.  
- Example:
   - Suppose I have a domain `example.com` hosting multiple applications. I will create a subdomain `pds.example.com` to host my Bluesky PDS.  
   - For this, I will create the following DNS records pointing to my Bluesky PDS server’s IP address, e.g., `12.34.56.78`:  

| Name                | Type | Value         | TTL |
| ------------------- | ---- | ------------- | --- |
| `pds.example.com`   | `A`  | `12.34.56.78` | 600 |
| `*.pds.example.com` | `A`  | `12.34.56.78` | 600 |

<hr class="hr-text" data-content="">

### Step 2: Preparing the Server  

   - Connect to your server via SSH:  

{% highlight bash %}
ssh <user>@<server_ip_address>
{% endhighlight %}

   - Update existing packages:  

{% highlight bash %}
sudo apt update && sudo apt upgrade -y
{% endhighlight %}

<hr class="hr-text" data-content="">

### Step 3: Download the Installation Script  

To download the Bluesky PDS installation script, run the following commands on your server via SSH.  
You can use either `wget` or `curl` to retrieve the installation script from the official Bluesky repository.  

   * Using `wget`:  
{% highlight bash %}
wget https://raw.githubusercontent.com/bluesky-social/pds/main/installer.sh
{% endhighlight %}

   * Or using `curl`:  
{% highlight bash %}
curl https://raw.githubusercontent.com/bluesky-social/pds/main/installer.sh >installer.sh
{% endhighlight %}

<hr class="hr-text" data-content="">

### Step 4: Run the Installation Script  

Once the script is downloaded, run it as an administrator using the following command:  

{% highlight bash %}
sudo bash installer.sh
{% endhighlight %}

> info ""  
> This script will automatically install all necessary dependencies and configure the required services to run your Bluesky PDS instance:  
> - Installation of **Docker** and Docker Compose.  
> - Downloading the **Docker images** for Bluesky PDS (3 images).  
> - Starting the **Docker containers**.  
> - Setting up **systemd** services to enable auto-start on server reboot.  
> - Configuring a **Let's Encrypt TLS certificate** with automatic renewal via the [Caddy](https://github.com/caddyserver/caddy){:target="_blank" rel="noopener noreferrer nofollow"} web server.  

During execution, the script will prompt you for certain inputs:  
1. `Enter your public DNS address:`  
   - Following our example, you should enter `pds.example.com`. Adapt this to your specific domain name.  
2. `Enter an admin email address:`  
   - Provide a valid email address. This will be used by Let's Encrypt to manage your TLS certificate (it can be from any domain, e.g., gmail.com, proton.me, etc.).  
3. `Create a PDS user account? (y/N):`  
   - Answer `N`. We will perform this action later.  

You should see the following output in the logs:  

{% highlight output %}
/pds.service.
* Downloading pdsadmin
===============================================================================
PDS installation successful!
-------------------------------------------------------------------------------

Check service status        : sudo systemctl status pds 
Watch service logs          : sudo docker logs -f pds
Backup service data         : /pds
PDS admin command           : pdsadmin
{% endhighlight %}

<hr class="hr-text" data-content="">

### Step 5: Verifying the Installation  

After completing the installation of Bluesky PDS, it is important to ensure your server is online and functioning correctly. Follow these steps to confirm your setup is operational:  

#### 5.1. Check Docker Images  

View the Docker images that were downloaded by running the following command:  

{% highlight bash %}
sudo docker ps
{% endhighlight %}

This should return output similar to:  

{% highlight plaintext %}
CONTAINER ID   IMAGE                            COMMAND                  CREATED        STATUS                  PORTS     NAMES
36924479e72e   caddy:2                          "caddy run --config …"   23 hours ago   Up 23 hours                       caddy
a13a320572eb   ghcr.io/bluesky-social/pds:0.4   "dumb-init -- node -…"   23 hours ago   Up 23 hours                       pds
67b03b48e7ea   containrrr/watchtower:latest     "/watchtower"            23 hours ago   Up 23 hours (healthy)             watchtower
{% endhighlight %}

#### 5.2. Check Server Logs  

To diagnose potential issues or confirm proper functionality, you can view the Docker logs for your PDS server with the following command:  

{% highlight bash %}
sudo docker logs -f pds
{% endhighlight %}

The output should display logs similar to the following:  

{% highlight plaintext %}
{"level":30,"time":1737107986429,"pid":7,"hostname":"PDS","name":"pds","req":{"id":372,"method":"GET","url":"/xrpc/chat.bsky.convo.getLog","query":{},"params":{},"headers":{"user-agent":"Mozilla/5.0","accept":"*/*","accept-encoding":"gzip, deflate","accept-language":"fr-FR","dnt":"1","origin":"https://bsky.app"}},"res":{"statusCode":200,"headers":{"cache-control":"private","content-length":"36","content-type":"application/json; charset=utf-8"}},"responseTime":2771,"msg":"request completed"}
{"level":30,"time":1737110436039,"pid":7,"hostname":"PDS","name":"pds","req":{"id":381,"method":"GET","url":"/","query":{},"params":{},"headers":{"user-agent":"Mozilla/5.0","accept":"*/*","accept-encoding":"gzip"}},"res":{"statusCode":200,"headers":{"cache-control":"private","content-length":"126","content-type":"text/plain; charset=utf-8"}},"responseTime":2,"msg":"request completed"}
{% endhighlight %}

#### 5.3. Verifying the PDS Service Startup  

Check the status of the Bluesky PDS service to confirm it is running:  

{% highlight bash %}
sudo systemctl status pds
{% endhighlight %}

This should return:  

{% highlight plaintext %}
● pds.service - Bluesky PDS Service
     Loaded: loaded (/etc/systemd/system/pds.service; enabled; preset: enabled)
     Active: active (exited) since Thu 2025-01-16 11:58:41 UTC; 24h ago
       Docs: https://github.com/bluesky-social/pds
    Process: 138062 ExecStart=/usr/bin/docker compose --file /pds/compose.yaml up --detach (code=exited, status=0/SUCCESS)
   Main PID: 138062 (code=exited, status=0/SUCCESS)
        CPU: 173ms

Jan 16 11:58:34 PDS docker[138074]:  Container caddy  Creating
Jan 16 11:58:34 PDS docker[138074]:  Container watchtower  Created
Jan 16 11:58:36 PDS docker[138074]:  Container caddy  Created
Jan 16 11:58:36 PDS docker[138074]:  Container pds  Starting
Jan 16 11:58:36 PDS docker[138074]:  Container watchtower  Starting
Jan 16 11:58:38 PDS docker[138074]:  Container watchtower  Started
Jan 16 11:58:39 PDS docker[138074]:  Container pds  Started
Jan 16 11:58:39 PDS docker[138074]:  Container caddy  Starting
Jan 16 11:58:41 PDS docker[138074]:  Container caddy  Started
Jan 16 11:58:41 PDS systemd[1]: Finished pds.service - Bluesky PDS Service.
{% endhighlight %}

<hr class="hr-text" data-content="">

### Step 6: Verifying the Connection  

#### 6.1. Opening HTTP and HTTPS Ports  

If not already configured, ensure that ports `80/tcp` (HTTP) and `443/tcp` (HTTPS) are open to allow access from the Internet.  
You can adjust these settings via your firewall or cloud provider.

#### 6.2. Checking the Server Health  

Test the availability and health of your server by accessing the **health check endpoint**.

- Open a web browser and visit the following URL (adjust to your domain name):  

{% highlight bash %}
https://<pds.example.com>/xrpc/_health
{% endhighlight %}

- If everything is functioning correctly, you should see a JSON response with the server version, for example:  

{% highlight json %}
  {"version":"0.4.74"}
{% endhighlight %}

#### 6.3. Verifying WebSockets (Optional)  

To ensure the Bluesky network can synchronize and retrieve content from your PDS, WebSockets must be functional. Here’s how to test them:  

- Install a WebSocket testing tool, such as [wsdump](https://github.com/nrxr/wsdump){:target="_blank" rel="noopener noreferrer nofollow"}.  
- Test WebSocket connectivity by running the following command:  
{% highlight bash %}
   wsdump "wss://<pds.example.com>/xrpc/com.atproto.sync.subscribeRepos?cursor=0"
{% endhighlight %}

- If WebSockets are correctly configured but no content has been created in your PDS yet, the command will keep running without displaying output. This indicates that the system is ready but currently has no content to transmit.

<hr class="hr-text" data-content="">

### Step 7: Creating a User Account  

To set up a user account on your PDS server, follow these steps via SSH:  

- **Run the following command:**  
{% highlight bash %}
sudo pdsadmin account create
{% endhighlight %}  

- **Enter the requested information at the prompt:**  

   - `Enter an email address (e.g. alice@pds.example.com):` Enter a valid email address to be used for password recovery. This can belong to any domain (e.g., `gmail.com`, `proton.me`).  
   - `Enter a handle (e.g. alice.pds.example.com):` Enter a fully qualified username that will be linked to a subdomain of your PDS. The handle must end with your PDS server's domain, such as `.pds.example.com`.  

- **Confirmation of creation:**  
   If everything is properly configured, you will see output similar to the following:  
{% highlight plaintext %}
Enter an email address (e.g. alice@pds.example.com): jeanjerome@my-email.com
Enter a handle (e.g. alice.pds.example.com): jeanjerome.pds.example.com

Account created successfully!
-----------------------------
Handle   : jeanjerome.pds.example.com
DID      : did:plc:livr8wtor8vyxsa4w064e4fs
Password : xuNPXGl8d86Lmky750r2EozC
-----------------------------
Save this password, it will not be displayed again.
{% endhighlight %}  

> warning "Important"  
> **Immediately save your password**, as it will not be displayed again after account creation.  

> info "In case of an error"  
> If you encounter an error like `ERROR: Reserved handle`, this indicates the chosen handle contains a reserved keyword blocked to prevent conflicts or abuse. You can find the full list of reserved keywords in the **AT Protocol** source file: [reserved.ts](https://github.com/bluesky-social/atproto/blob/main/packages/pds/src/handle/reserved.ts){:target="_blank" rel="noopener noreferrer nofollow"}.

<hr class="hr-text" data-content="">

### Step 8: Configuring Email Sending  

To enable your PDS to send emails (e.g., for verifying user email addresses or sending other notifications), you must configure an SMTP server.

#### 8.1. Choose an Email Sending Service  

You can use a reliable email sending service, such as [Resend](https://resend.com/) or [SendGrid](https://sendgrid.com/). These services offer straightforward configuration and a ready-to-use API.  

1. **Create an account** with one of these services.  
2. **Generate an API key**, which will be used to authenticate email sending from your PDS.  

#### 8.2. Configure Your PDS to Use SMTP  

Edit the configuration file located at `/pds/pds.env` to include the following information (example using Resend):  

{% highlight plaintext %}
PDS_EMAIL_SMTP_URL=smtps://resend:<your API key>@smtp.resend.com:465/
PDS_EMAIL_FROM_ADDRESS=jeanjerome@my-email.com
{% endhighlight %}

- **PDS_EMAIL_SMTP_URL**: The SMTP URL of the email sending service, including your API key.  
- **PDS_EMAIL_FROM_ADDRESS**: The email address used as the sender for emails sent by your PDS.  

#### 8.3. Ensure Network Access  

Verify that your server allows outbound connections on the ports required by the SMTP service (typically **port 465** for a secure connection).  

#### 8.4. Restart Your PDS  

After updating the configuration, restart your PDS to apply the changes:  

{% highlight bash %}
sudo systemctl restart pds
{% endhighlight %}

<hr class="hr-text" data-content="Call of Duty">

## Responsibilities as an Administrator  

As the administrator of a PDS server, you are responsible for keeping your system up-to-date, monitoring its performance, and ensuring the security of your infrastructure. Below are the key tasks you should perform regularly.

### 1. Keep Your PDS Updated  

Bluesky regularly provides updates to fix bugs, enhance performance, and improve security. These updates are crucial for ensuring the smooth operation of your server.  

- **Update your PDS using the `pdsadmin` tool:**  
{% highlight bash %}
sudo pdsadmin update
{% endhighlight %}

### 2. Keep the Operating System Updated  

It is important to keep your server's operating system up-to-date to benefit from the latest improvements and prevent security vulnerabilities.  

- **Apply system updates with the following command:**  
{% highlight bash %}
sudo apt update && sudo apt upgrade -y
{% endhighlight %}

### 3. Monitor and Manage Performance  

To detect potential issues, regularly monitor your server's logs and status.  

- **View the PDS service logs with systemd:**  
{% highlight bash %}
sudo journalctl -u pds
{% endhighlight %}

- **View the PDS application logs:**  
{% highlight bash %}
sudo docker logs -f pds
{% endhighlight %}

### 4. Ensure Server Security  

- **Perform regular backups** of critical data and configuration files located in `/pds/`.  
- **Restrict access to the server** by configuring a firewall and using secure connections (SSH):  
  - Install tools such as `ufw` and `fail2ban` for additional protection.  
- **Monitor SSL/TLS certificate renewals** to secure communications between users and your PDS.  

### 5. Legal Responsibilities  

As a host, you are responsible for the content published through your server. Ensure compliance with local and international laws, particularly those related to data protection and combating illegal or harmful content.  

<hr class="hr-text" data-content="Conclusion">

## Conclusion  

Social networks have become central to our digital interactions, shaping communication, opinions, and the collective perception of information.  
The rise of alternatives like BlueSky, emphasizing ethics and decentralization, provides tangible solutions to issues such as toxicity and the concentration of digital power.  

However, these initiatives raise new questions:  
- How can responsible use of these networks be ensured, especially when they are decentralized?  
- Where does freedom of expression end, and how can it be reconciled with combating misinformation and hate speech?  
- What regulations should be implemented to govern these new networks while respecting fundamental rights?  
- How should responsibilities be distributed between users, administrators, and platform creators?  
- What economic models can sustain these platforms while adhering to their ethical values?  
- How can privacy and user control over data be guaranteed?  

Exploring these issues compels us to rethink our use of social networks and envision a more balanced digital ecosystem—one that respects users and defends democratic values currently under threat from autocratic regimes and opportunistic entrepreneurs.  
