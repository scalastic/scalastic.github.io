---
layout: post
title: Amazon Virtual Private Cloud
date: 2021-07-17 11:06:00 +0200
description: Amazon Virtual Private Cloud Fundamentals and Key Concepts to Know. Tutorial, how-to.
img: aws-vpc-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@matthewhenry?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Matthew Henry</a> sur <a href="https://unsplash.com/collections/8707292/privacy-i-security-i-surveillance?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, VPC, Subnet, Route, Gateway, NAT, Security-Group, NACL, ENI, Peering, Endpoint, PrivateLink, VPN, Documentation]
lang: en
permalink: /aws-vpc-documentation/
status: finished
---

Amazon Virtual Private Cloud (Amazon VPC) allows you to launch AWS resources into a virtual network that you define. This virtual network looks a lot like a traditional network but with the benefits of using the AWS infrastructure.

<hr class="hr-text" data-content="Content">

* TOC
{:toc}

<hr class="hr-text" data-content="Concepts">

## Amazon VPC components

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-vpc-concepts.png --alt Amazon VPC components %}
  <figcaption>Amazon VPC components</figcaption>
</figure>

The key concepts of VPC are:
- **Virtual Private Cloud (VPC)**: A virtual private network at a Region level
- **Subnet**: A subnet (a range of IP or CIDR addresses for Classless Inter-Domain Routing) at the AZ level:
  * **Public**: accessible from the Internet
  * **Private**: not accessible from the Internet
- **Route table**: A set of rules, called Routes, that are used to determine where network traffic is directed (from the Internet and between Subnets)

## The gateways

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-vpc-gateway.png --alt Gateways architecture in Amazon VPC %}
  <figcaption>Gateways architecture in Amazon VPC</figcaption>
</figure>

- **Internet Gateway**:
  * Network gateway that allows VPC instances to access the Internet and be accessible from the Internet
  * Public Subnets are because they have a Route to an Internet Gateway
- **NAT Gateway**:
  * A NAT gateway is a Network Address Translation (NAT) service
  * It allows instances of a private Subnet to connect to services outside the VPC (but external services cannot initiate a connection to those instances)
  * It is a service fully managed by AWS
- **NAT Instance**:
  * AMI (Amazon Machine Image) used as NAT
  * It is entirely under the responsibility of the user

## Security

Security is a shared responsibility between AWS and the user.

This is what Amazon calls the *Shared Responsibility Model*. It includes:
- **Cloud Security**: AWS is responsible for protecting the infrastructure that runs AWS services in the AWS Cloud


- **Cloud Security**: User responsibility is determined by the AWS service they are using


Here are 2 important AWS services that apply the shared responsibility model when using Amazon VPC:

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-vpc-shared-responsability.png --alt Implementation of a shared responsibility model %}
  <figcaption>Implementation of a shared responsibility model</figcaption>
</figure>

- **Security Group** (Instance Level):
  * A Security Group acts as a virtual firewall of an instance or ENI to control incoming and outgoing traffic
  * Up to five Security Groups can be assigned to one instance
  * Security Groups only act at instance level, not subnet level
  * Rules may include IP addresses or other Security Groups and contain only ALLOWs (all that is not ALLOW is blocked)

- **Network ACL** (Subnet Level): 
  * A Network Access Control List (ACL) is an optional security layer for a VPC that acts as a firewall to control incoming and outgoing traffic from one or more subnets
  * Network ACLs can be configured with rules similar to those of Security Groups to add an additional security layer to a VPC
  * Rules can only include IP addresses and contain ALLOWs / DENYs

## Logs and Monitoring

You can use the following automated monitoring tools to monitor your VPC components and report any issues:

- **Flow Logs**:
  * Flow Logs capture IP traffic entering and exiting your VPC’s network interfaces
  * You can create a flow log for a VPC, Subnet or Elastic Network Interface
  * It also works for the network flows of services managed by AWS: ELB, ElastiCache, RDS, Aurora,...
  * Stream log data is published in CloudWatch Logs or Amazon S3 to diagnose ACL security rules that are too restrictive or permissive

- **NAT Gateways monitoring**:
  * Monitoring a NAT Gateway is done using CloudWatch, which collects information from your NAT gateway and creates near real-time measurements

## Other VPC-specific concepts

### Elastic Network Interfaces

- A ENI (also called the network interface in AWS) is a logical network component in a VPC that represents a virtual network card
- Each instance of a VPC has a default network interface (the primary network interface) that is assigned to a private IPv4 address from the VPC IPv4 address range
- You cannot detach a primary network interface from an instance. But you can create and attach an additional ENI to any instance of your VPC

### VPC Peering

- A VPC Peering connection is a network connection between two VPCs that allows traffic to flow between them and privately
- Instances in either VPC can communicate with each other as if they were in the same VPC
- You can create a peering VPC connection between your own VPCs, with a VPC in another AWS account, or with a VPC in another AWS region
- The CIDR (IP address range) of each VPC must not overlap

AWS uses the existing infrastructure of a VPC to create a VPC Peering connection; it is neither a gateway nor a VPN connection from site to site AWS, and does not depend on separate physical hardware

There is no single point of failure for communication or a bandwidth bottleneck.

#### VPC Endpoint and AWS PrivateLink

- An Endpoint allows you to connect to an AWS service from a private address without going through the public network
- This connection is called an AWS PrivateLink 
- Provides even more security and improves latency to access an AWS service

There are 2 types of Endpoints VPCs:
- **VPC Endpoint Gateway**: S3 and DynamoDB
- **VPC Endpoint Interface**: other services

### VPN Connections

- **AWS Site-to-Site VPN**:
  * It is an IPsec VPN connection between an Amazon VPC and an enterprise network (on-premise)
  * On the AWS side, 2 VPN terminals (tunnels) allow an automatic failover switch
  * Encrypted traffic goes through the Internet

- **AWS Direct Connect (DX)**: 
  * AWS Direct Connect connects an enterprise network to an AWS Direct Connect location via a standard Ethernet fiber optic cable
  * Traffic doesn't go to the Internet and is private
  * It takes at least 1 month to set up because there is a network infrastructure to set up (fiber optic, ...)