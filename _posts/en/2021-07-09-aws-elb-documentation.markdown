---
layout: post
title: AWS Elastic Load Balancing
date: 2021-07-09 16:21:00 +0200
description: AWS Elastic Load Balancing (ELB) fundamentals and key concepts you should know. Tutorial, user guide. Also talks about ASG, SSL-TLS, SNI, Sticky-Session, Target-Group.
img: aws-elb-documentation.jpg
fig-caption: Photo by <a href="https://unsplash.com/@derekowensheart?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Derek Owens</a> on <a href="https://unsplash.com/s/photos/swing?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, ELB, ASG, SSL-TLS, SNI, Sticky-Session, Target-Group, Documentation]
lang: en
permalink: /aws-elb-documentation/
status: finished
---

Elastic Load Balancing automatically distributes your incoming traffic across multiple targets, such as EC2 instances, containers, and IP addresses, in one or more Availability Zones. It monitors the health of its registered targets and routes traffic only to the healthy targets. You can select the type of load balancer that best suits your needs.

Let's see how it works.

<hr class="hr-text" data-content="Content">

* TOC
{:toc}

<hr class="hr-text" data-content="ELB">

## Elastic Load Balancer

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-elb.png --alt Example of using an ELB %}
  <figcaption>Example of using an ELB</figcaption>
</figure>

An ELB is a central element of an applicative architecture. It allows to:
- Distribute the load across multiple servers
- Expose a single entry point for the application
- Separate external traffic from the internal one
- Provide SSL/TLS termination
- Perform health checks of the underlying instances

The AWS ELB is fully managed, which means that AWS makes sure it is running smoothly, kept up to date, and is high availability.

<hr class="hr-text" data-content="ELB Types">

## ELB Types

At the moment, there are 4 that we will detail below.

### Classic Load Balancer
  * ELB v1 generation, you should not use it
  * Supports HTTP, HTTPS and TCP protocols
  * Single DNS name port of entry
  * Distributes load across multiple AZs (Multi-AZs)
  * Supports a single application

### Application Load Balancer
  * Latest ELB v2 generation
  * Supports HTTP, HTTPS (HTTP/2) and WebSocket (Layer 7) protocols
  * Single DNS name port of entry
  * Can support multiple applications:
    - Several applications (multi Target Groups/ Containers) using a routing table (depending on the Hostname, Path, Query String or Header)
    - HTTP redirect -> HTTPS
    - Port mapping
  * Visibility of the Client IP: 
    - ALB terminates connection, targets only see ALB IP
    - The Client IP is located in the X-Forwarded-For header (other Forwarded: X-Forwarded-Port, X-Forwarded-Proto)
    - The Security Group of targets must integrate the ALB Security Group

### Network Load Balancer
  * ELB Generation v2
  * It supports TCP, UDP and TLS (Layer 4) protocols
  * His interest in ALB is that it is much more efficient and can handle millions of req/s with ultra-low latencies
  * Point of entry, static IP via AZ or fixed IP (also via AZ) via Elastic IP
  * Like ALB, it can support multiple applications through Target Groups
  * Visibility of the Client IP: 
    - The NLB does not touch the connection, the targets receive the Client’s IP
    - The Security Group of targets must integrate the IPs of the Clients (0.0.0.0/0 for public access)

### Gateway Load Balancer
  * Generation v2 of ELB, this service was introduced this year.
  * As its name suggests, it is a network gateway that redirects application flows to a virtual appliance. This redirection is completely transparent for the network flow and the target server.
  * A virtual appliance is a VM image that replaces hardware equipment. It is generally used to do security analysis (WAF, NGFW, anti-DDoS) or to monitor or log application flows.

<hr class="hr-text" data-content="ASG">

## AWS Auto Scaling

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-elb-asg.png --alt Example of ASG Scale Out %}
  <figcaption>Example of ASG Scale Out</figcaption>
</figure>

AWS Auto Scaling allows you to automatically size the number of our instances (Horizontal Scale). It allows to automatically decrease (Scale In) or increase (Scale Out) this number according to predefined criteria.

To do this, you configure an Auto Scaling Group with a minimum, maximum and initial number of instances to be created as well as a Scaling policy.

Its great advantage is that it automatically records these instances in the ELB.

<hr class="hr-text" data-content="Related">

## Related concepts

Here are some notions to know and that are related to Load Balancers in general or specific to AWS.

### Target Group

Target Groups allow **multiple targets to be associated under a single reference**.
These targets may be:
- EC2 instances (which can be managed by an Auto Scaling Group)
- ECS tasks
- Lambda functions
- IP addresses (always private)

An ALB performs its **Health Check at the Target Group** level.

### Sticky Session

Sticky Sessions are a mechanism to route customer traffic to **a single target in a Target Group**.

This is necessary for Stateful applications in order not to lose customer information between requests. It is insured by a cookie and is available for all ELB.

### Cross-Zone Load Balancing

- When this option is enabled, ELB distribute traffic fairly to all registered targets regardless of their AZ.

- If this option is disabled, the traffic is distributed among the AZ only regardless of the number of targets in each AZ and not of the underlying instances number.

Depending on the type of ELB and how it was created (by API, CLI or Console Management), this option may or may not be enabled by default.

### SSL/TLS and SNI

An SSL certificate encrypts Internet traffic and verifies the identity of a server.

There are 2 protocols to ensure this encryption:

- SSL, **Secure Sockets Layer**, is the old encryption protocol and is no longer used at this time (even if its name remains)
- TLS, **Transport Layer Security**, is the new, more secure protocol.

SNI, **Server Name Indication**, is part of the TLS protocol. It allows you to tell a server the name of the Hostname you want to connect to:

- This allows Load Balancers that handle multiple Hostnames to know which certificate is returned and to perform the correct routing.
- **Only ALB and NLB, generation v2, know how to manage the SNI**.

