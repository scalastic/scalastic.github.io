---
layout: post
title: Amazon RDS - Relational Databases in AWS
date: 2021-07-11 12:20:00 +0200
description: Amazon RDS Fundamentals and Key Concepts to Know. Tutorial, how-to.
img: aws-rds-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@vingtcent?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Vincent Guth</a> sur <a href="https://unsplash.com/collections/996284/data?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, RDS, Documentation]
lang: en
permalink: /aws-rds-documentation/
status: finished
---

There are 2 major Relational Databases offerings in AWS: RDS and Aurora. We will see in this article the characteristics of the first type of BDD, Amazon RDS.

<hr class="hr-text" data-content="Content">

* TOC
{:toc}

<hr class="hr-text" data-content="RDS">

## Amazon RDS

Amazon Relational Database Service (Amazon RDS) is a web-based service that facilitates the configuration, operation and scaling of SQL relational databases in the AWS Cloud (managed BDD).

It supports different database engines:
- MySQL
- MariaDB
- PostgreSQL
- Oracle
- Microsoft SQL Server

Which can be run on different types of instances called DB Instances:
  * Available Instance classes: Standard, Memory Optimized or Burstable
  * Types of Storage RDS: General Purpose SSD, Provisioned IOPS, Magnetic

## Managed operations

The operations supported by AWS and proposed in Amazon RDS are:
- Maintenance of the instance (OS + BDD Engine) on programmable ranges,
- Automatic backups at time intervals and possible restoration of these backups
- A monitoring dashboard
- Creation of Read Replicas to speed up access to data (maximum 5)
- Multi-AZ configuration for failover management
- Vertical and horizontal scaling of DB Instances and storage volume (Storage Auto Scaling)

On the other hand, it is not possible to access these instances in SSH.

<hr class="hr-text" data-content="Backups">

## Backups

- Automatic:
  * Daily Full Backup during the service period (as defined)
  * Backup of transaction log every 5 minutes (restoration ensured of m-5)
  * Retention possible from 0 (no retention!) to 35 days

- On request:
  * As DB Snapshots
  * Retention as long as desired

<hr class="hr-text" data-content="Replica">

## Replica

### Read Replica

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-rds-read-replicas.png --alt Example of Read Replicas %}
  <figcaption>Example of Read Replicas</figcaption>
</figure>

- The replication is ASYNCHRONOUS, the data is not consistent: the replicates are accessible only in reading
- Up to 5 replicas can be created
- They can be in the same AZ, in different AZ or between different Regions (except for Microsoft SQL Server)

Remarks:

- An application needs to update its connection string to take advantage of the Reads Replicas.
- A Replica can be promoted, again, into a Database, which makes it possible, for example, to carry out analysis treatments that cannot be envisaged on a BDD in Production.
- Data transfer between AZ or Regions is paid for on AWS. With regard to RDS Reads Replicas, only transfers between Regions are chargeable, those between AZs are included in the cost of the service.

### Multi-ZA Replicas and Disaster Recovery

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-rds-disaster-recovery.png --alt Example of Disaster Recovery Architecture with Multi-AZ RDS Replicas %}
  <figcaption>Example of Disaster Recovery Architecture with Multi-AZ RDS Replicas</figcaption>
</figure>

- The creation of Replicas between AZ (multi-AZ) or between Regions (cross-Region) makes it possible to set up a disaster recovery plan (disaster recovery) in the event of a network failure, an RDS instance, an AZ or even a Region.
- The application architecture is then different from the Read Replica: the replication is SYNCHRONOUS and the Replicas are not accessible for reading.
- One can go from a single-AZ to a multi-AZ by a Snapshot and without unavailability of the database.

<hr class="hr-text" data-content="Security">

## Security

### Data Encryption at rest

- Amazon RDS instance data can be encrypted including DB Instances storage volume, backups, replicas and snapshots
- This encryption is configured when the BDD is created:
  * An encrypted instance produces an encrypted Repica
  * An unsolicited instance produces an unsolicited Replica
  * But a snapshot is still unencrypted
- Encryption uses a standard AES-256 encryption key managed by AWS Key Management Service (AWS KMS).
- Oracle and Microsoft SQL Server can also use Transparent Data Encryption (TDE).

### Data encryption in transit

- It is done using SSL/TLS certificates with the root certificate of your AWS Region
- Each BDD engine has its own configuration to support on-the-fly encryption and may also depend on the version used (refer to the documentation <https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html>)
  * For example for MySQL 5.7 and later: `ALTER USER 'encrypted_user'@'%' REQUIRE SSL;`

### Network

- An Amazon RDS is always deployed in a private subnet
- Access to an RDS instance is therefore made through a Security Group

### IAM

- The connection to the BDD of an RDS instance is usually done with a login/password.
- IAM policies allow access rights to an RDS instance to be granted to a User IAM.
- In the case of MySQL and PostgreSQL, a User IAM can also connect to an RDS BDD.

However, there are limitations (token valid 15min, no more than 256 connections per second)

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-rds-iam-authentication.png --alt Identification in Amazon RDS using IAM Authentication %}
  <figcaption>Identification in Amazon RDS using IAM Authentication</figcaption>
</figure>








