---
layout: post
title: AWS Identity and Access Management
date: 2021-07-06 10:37:00 +0200
description: AWS IAM Service fundamentals and key concepts you should know. Tutorial, user guide.
img: aws-iam-documentation.jpg
fig-caption: Photo by <a href="https://unsplash.com/@mojamsanii?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Moja Msanii</a> on <a href="https://unsplash.com/s/photos/bank?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, IAM, Documentation]
lang: en
permalink: /aws-iam-documentation/
status: finished
---

AWS Identity and Access Management (IAM) is a web service for securely controlling access to AWS services. With IAM, you can centrally manage users, security credentials such as access keys, and permissions that control which AWS resources users and applications can access.

<hr class="hr-text" data-content="Content">

* TOC
{:toc}

<hr class="hr-text" data-content="Root Account">

## Root Account

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-iam-root-account.png --alt The role of the root account is to create AWS users %}
  <figcaption>The role of the root account is to create AWS users</figcaption>
</figure>

It is created by default when registering on AWS. It shouldn't be used except for creating AWS accounts setup. We can even imagine that it is used to create the first AWS account with administrator rights, and that's it.

<hr class="hr-text" data-content="AWS User">

## AWS User (or IAM User)

An **AWS user** is one physical person and only one :
  - AWS user accounts must be protected by a strong **Password Policy** and **Multi-Factor Authentication** (MFA) to access AWS Management Console.
  - For programmatic access via CLI (AWS Command Line Interface) from a console or SDK (AWS Software Development Kit) from an application, users can use **Access Keys** (an Access Key ID + an Access Key Secret) to access AWS Services.
  - Users permissions are managed through **IAM Policies** either on users directly or even better on **Groups** to which users belong.

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

**IAM Role** gives permissions to an AWS Service to access AWS information.

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-iam-role.png --alt An IAM Role grants access to an EC2 instance to access an S3 bucket %}
  <figcaption>An IAM Role grants access to an EC2 instance to access an S3 bucket</figcaption>
</figure>

