---
layout: post
title: AWS Identity and Access Management
date: 2021-07-06 10:37:00 +0200
description: AWS IAM Service fundamentals and key concepts you should know. Tutorial, user guide.
img: aws-iam-documentation.jpg
fig-caption: Photo by <a href="https://unsplash.com/@mojamsanii?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Moja Msanii</a> on <a href="https://unsplash.com/s/photos/bank?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, IAM, IAM-User, IAM-Group, IAM-Role, MFA, AWS-Identity, AWS-Policy, IAM-Service-Role, AWS-Trust-Policy, AWS-Principale, Documentation]
lang: en
permalink: /aws-iam-documentation/
status: finished
---

AWS Identity and Access Management (IAM) is a web service for securely controlling access to AWS services. With IAM, you can centrally manage users, security credentials such as access keys, and permissions that control which AWS resources users and applications can access.

<hr class="hr-text" data-content="Content">

* TOC
{:toc}

<hr class="hr-text" data-content="Root Account">

## AWS account root user

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-iam-root-account.png --alt The role of the root account is to create AWS users %}
  <figcaption>The role of the root account is to create AWS users</figcaption>
</figure>

It is created by default when registering on AWS. It shouldn't be used except for creating AWS accounts setup. We can even imagine that it is used to create the first AWS account with administrator rights, and that's it.

<hr class="hr-text" data-content="User & Group">

## IAM User and Group

An **IAM User** is one physical person and only one :
- AWS user accounts must be protected by a strong **Password Policy** and **Multi-Factor Authentication** (MFA) to access AWS Management Console.
- For programmatic access via CLI (AWS Command Line Interface) from a console or SDK (AWS Software Development Kit) from an application, users can use **Access Keys** (an Access Key ID + an Access Key Secret) to access AWS Services.

A **IAM Policy** grants a specific set of permissions and can be linked to any IAM identity: User, Group or Role.

User permissions (**IAM Policies**) are attached either at the user level directly or even better, at the **Groups** level to which users belong.

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-iam-user-group.png --alt Multiple Groups can be attached to Users %}
  <figcaption>Multiple Groups can be attached to Users</figcaption>
</figure>


> warning ""
> You should never EVER share your AWS User account or your Access Key!!

### How to use Access Key?

Let's take the connection example to an EC2 instance.


1. Set the file permissions
To secure the PEM file containing your Access Key ID and its Secret Key, AWS verifies that your PEM file permissions are secure. That means you should always set these permissions before using it:

{% highlight Bash %}
chmod 0400 <ACCESS-KEY-FILE>.pem
{% endhighlight %}

2. Connect to your instance
On Linux instances, username is `ec2-user`. Let's ssh into it:

{% highlight Bash %}
ssh -i <ACCESS-KEY-FILE>.pem ec2-user@<PUBLIC-IP-SERVER>
{% endhighlight %}

<hr class="hr-text" data-content="IAM Role">

## IAM Role

All security in AWS is based on **IAM Roles** and this is probably the most difficult part to understand.

Let's see the concepts of IAM Roles IAM through a progressive approach.

#### The summury version (but not entirely accurate!)

  > info ""
  > A **IAM Role** authorizes an AWS Service to access information from another AWS Service.

  In the example below, an EC2 Instance uses an IAM Role to access a S3 Bucket in Read-Only:

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-iam-role.png --alt An IAM Role grants access to an EC2 instance to access an S3 bucket %}
  <figcaption>An IAM Role grants access to an EC2 instance to access an S3 bucket</figcaption>
</figure>

#### The long version (but more complex!)

In order to fully understand the concepts behind IAM Roles, we need to define some terms specific to AWS.

#### IAM Identity
* ***IAM User*** and ***IAM Role*** are both IAM Identities
* It has **Permissions Policies** that determine what identity can and cannot do in AWS

So, User and Role are the same concept in AWS. 

> note "What differentiates them:"
> - A **User** is associated with an individual ***in a unique way*** and has ***Long Life Identifiers***, such as a password or access keys
> - A **Role** is for ***anyone*** who needs it (so it may be a User) and has ***temporary identifiers***, for the duration of the Role session

#### AWS Service Role

This is a **Role for a Service**, which is a set of permissions that allow this Service to access, ***in your account*** and ***on your behalf***, the AWS Services it needs

> note ""
> It is therefore a Role intended for a Service

#### Trust Policy

- A **Trust Policy** defines the ***Principales*** you trust to endorse a Role. 
- A **Principale** can be User, Role, AWS account or Service.

> note ""
> Therefore one can exactly define to whom a Role is intended to

### What it does

Some examples of using Roles (not exhaustive and in no particular order!):

1. Allow a *Developer* to temporarily access, in read-only, a *Production* environment
1. Allow a *Load Balancer* to (1) read CloudWatch metrics and (2) create new EC2 instances as required
1. Allow a certain application to have read/write access to a specific directory of a S3 Bucket


> info "What to remember"
> It is always best to use a Role to manage access to AWS resources