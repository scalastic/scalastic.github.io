---
layout: post
title: Amazon Aurora - The Relational Database optimized for the Cloud
date: 2021-07-13 12:35:00 +0200
description: Amazon Aurora Fundamentals and Key Concepts to Know. Tutorial, how-to.
img: aws-aurora-documentation.jpg
fig-caption: Photo by <a href="https://unsplash.com/@lorenzolietti?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Lorenzo Lietti</a> on <a href="https://unsplash.com/s/photos/sunrise--sunset?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, Aurora, RDS, Documentation]
lang: en
permalink: /aws-aurora-documentation/
status: finished
---

Amazon Aurora is a relational database, compatible with MySQL and PostgreSQL and created by Amazon for the Cloud. Amazon Aurora is up to 5x faster than a standard MySQL database and 3x faster than a standard PostgreSQL database.

It relies on Amazon RDS and extends its features.

<hr class="hr-text" data-content="Content">

* TOC
{:toc}

<hr class="hr-text" data-content="Aurora">

## Features of Amazon Aurora

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-aurora-architecture.png --alt General architecture of Amazon Aurora %}
  <figcaption>General architecture of Amazon Aurora</figcaption>
</figure>

### High performance and scalability

- High Performance:
  * It is connected to the Cloud 
  * It supports Low Latency reading with up to 15 Read Replicas in Multi-AZ
  * Depending on the option chosen, one can have 1 Master in Writing or several connected to the same storage volume
- Scaling:
  * Automatic Storage Auto Scaling increase in 10 GB increments up to 128 TB
  * The number of Read Replicas can be managed by an Auto Scaling Group
  * A Serverless option allows you to manage intermittent and unpredictable workloads

### Availability

- High Availability:
  * 6x data replication in a shared storage volume on 3 AZs
  * Continuous backup in Amazon S3
  * 1 Endpoint for Writing and 1 for Reading
  * Automatic failover in case of unavailability of an AZ in less than 30s


- Support the cross-Region (Database Location: Global option);
  * Data are replicated across multiple Regions
  * Write operations on the Primary Region are replicated in the Secondary Regions with latency < 1s
  * Automatic failover in case of unavailability of a Region

- Data can be restored at any point of time whatever the time of the last backup (Backtrack option)

### Security

- Seamless maintenance of Aurora instances 
- Network isolation with Amazon VPC
- Data encryption at rest and in transit with AWS KMS as well as storage volumes, backups, snapshots and replicas

