---
layout: post
title: AWS Elastic Cloud Compute
date: 2021-07-06 19:57:00 +0200
description: AWS EC2 fundamental and key concepts you should know. Tutorial, user guide.
img: aws-ec2-documentation.jpg
fig-caption: Photo by <a href="https://unsplash.com/@joseadd?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">JOSE LARRAZOLO</a> on <a href="https://unsplash.com/s/photos/lego?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, EC2, Documentation]
lang: en
permalink: /aws-ec2-documentation/
status: finished
---

Amazon Elastic Compute Cloud (Amazon EC2) is a web service that provides resizable computing capacity—literally, servers in Amazon's data centers—that you use to build and host your software systems.

<hr class="hr-text" data-content="Content">

* TOC
{:toc}

<hr class="hr-text" data-content="Types">

## Instance Types

EC2 instances come with different configurations dedicated to different use cases. You can check out the list of the different configurations on: <https://aws.amazon.com/fr/ec2/instance-types/>:
- General Purpose
- Compute Optimized
- Memory Optimized
- Accelarated Computing
- Storage Optimized

### Naming convention

Instances' names follow a naming convention with pattern like:

{% highlight Bash %}
<type><hardware-generation>.<instance-size>
{% endhighlight %}

For example, the instance type `t4g.medium` represents:
- Type 't' which is a general pupose instance,
- Hardware generation `4g` which is based on AWS Graviton 2 ARM processor for this specific type,
- Instance size `medium` which stands for medium memory and CPU ressources, 2vCPU / 4Gio here.

## Amazon Machine Image

An AMI is a template that contains the software configuration (Operating System, Application Server and application) required to launch your instance. You can select an AMI provided by AWS, the user community, the AWS Marketplace, or one of your own pre-built AMI.

## User data

Script that will be launch at the first boot of the instance and will be run only once.


## Security Group

It is fundamental in network security in AWS:
- It controls how traffic is allowed into and out the EC2 instances.
- It only contains **ALLOW** rules.

So it acts as a firewall in front of the EC2 instance. It filters access to:
- Port number,
- IPv4 and IPv6 range,
- Inbound network traffic (into the instance),
- Outbound network traffic (out of the instance).

That means when trafic is blocked, the EC2 instance won't even see it:
- If you end up with a ***time out*** issue when accessing your application, it's probably a Security Group issue.
- If you encounter a ***connection error***, then the traffic went throught the Security Group and that's an application error issue (the application did not launch for example).

A Security Group can references rules but also others Security Groups:

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-ec2-security-groups.png --alt Linking another Security Group (SG-DB) allow inbound traffic without knowing specific IP rule nor Port number %}
  <figcaption>Linking another Security Group (SG-DB) allow inbound traffic without knowing specific IP rule nor Port number</figcaption>
</figure>

The Security Group `SG-DB` attached to the Database allow traffic inbound to our EC2 instance because we also have attached the `SG-DB` Security Group to our EC2 instance.

## Instance Purchasing options

AWS offers different kind of purchasing when it comes to instances and some of them can reduce cost:
- **On-Demand** instances:<br>
  For short workload, with a predictable price, you pay what you use (no cost saving)

- **Reserved** and with a minimum of 1 or 3 years(up to 75% discount):

  * **Reserved** instances:<br>
    For long workloads (a database for example)

  * **Convertible Reserved** instances:<br>
    Long workloads but you can change the instance type (from t2-2xlarge to c5-small for example)(up to 54% of discount)

  * **Scheduled Reserved** instances:<br>
    When you don't need continously an instance (for example you need an instance every sunday per week but during one year at least)

- **Spot** instances:<br>
For short workloads with resilience but less reliable as you can loose your instance if the price you willing to pay for them is less than the current Spot price (provide the highest discount in AWS that can be up to 90%). Usefull for batch jobs, distributed workloads, image processing,...

- **Dedicated Host** (for a period of 3 years):<br>
Reserves an entire physical server fully dedicated to your use in AWS datacenter. When you have compliance requirements or use a Bring Your Own Licence model (BYOL)



