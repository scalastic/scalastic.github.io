---
layout: post
title: AWS Elastic Beanstalk
date: 2021-08-02 11:19:00 +0200
description: Basic principles and key concepts of AWS Elastic Beanstalk to know. Tutorial, instructions.
img: aws-elastic-beanstalk-documentation.jpg
fig-caption: Photo by <a href="https://unsplash.com/@jeremybishop?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jeremy Bishop</a> on <a href="https://unsplash.com/s/photos/tree?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, Beanstalk, EB, DevOps, Automatisation, Amazon-SQS, Deployment, Docker, ECS, Documentation]
lang: en
permalink: /aws-elastic-beanstalk/
status: finished
---

AWS Elastic Beanstalk is an AWS orchestration service used to deploy applications. He knows how to manage different AWS services such as EC2, S3, Simple Notification Service (SNS), CloudWatch, AutoScaling and Elastic Load Balancers.

<hr class="hr-text" data-content="Content">

* TOC
{:toc}

<hr class="hr-text" data-content="Principles">

## Principles

AWS Beanstalk is based on the definition of 3 objects:
- an **application** in a given **version**,
- a **configuration** which contains the definition of the AWS Services forming the infrastructure architecture,
- an **environment** that combines application version and configuration (dev, test, int, prod,...)

Therefore, it simplifies the deployment of an application:
- The developer handles the application code and versions
- Beanstalk automates the unfolding and configuration of LB, AutoScaling, Security Groups, EC2 instances, Cloudwatch monitoring, Subnets,...

> info ""
> Elastic Beanstalk is part of the **DevOps** toolkit available in AWS

It supports a multitude of application languages (Java, .NET, Python, Node.js, Ruby, Docker Containers,...)

It manages 2 types of application architecture:

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-elastic-beanstalk-tiers.png --alt Server Web or Worker application architectures %}
  <figcaption>Server Web or Worker application architectures</figcaption>
</figure>

- **Web Server Tier**: for application that serves HTTP requests
- **Worker Tier**: for *Backend* application that extracts its tasks from an Amazon Simple Queue Service (Amazon SQS) message

<hr class="hr-text" data-content="Deployment">

## Deployment strategies

Every company has the same deployment strategies. They vary depending on the purpose.

Let’s look at what Beanstalk is proposing and how to implement the current strategies.

### Integrated into Beanstalk

Beanstalk proposes different deployment strategies:

#### All at once

<figure class="article">
    {% picture {{site.baseurl}}/assets/img/aws-elastic-beanstalk-all-at-once.png --alt Deployment on All at once mode %}
    <figcaption>Deployment on All at once mode</figcaption>
</figure>

* Fast deployment but application has downtime
* No additional cost
* Ideal for non-productive environments

#### Rolling

<figure class="article">
    {% picture {{site.baseurl}}/assets/img/aws-elastic-beanstalk-rolling.png --alt Deployment on Rolling mode %}
    <figcaption>Deployment on Rolling mode</figcaption>
</figure>

* Longer deployment (the ***Bucket Size*** must be adapted to the number of instances) but the application has no interruption
* 2 versions of the cohesive application
* No additional cost

#### Rolling with additional batch

<figure class="article">
    {% picture {{site.baseurl}}/assets/img/aws-elastic-beanstalk-rolling-with-additional-batch.png --alt Deployment on Rolling with additional batch mode %}
    <figcaption>Deployment on Rolling with additional batch mode</figcaption>
</figure>

* Longer deployment (the ***Bucket Size*** must be adapted to the number of instances) but the application is uninterrupted and runs at full capacity during the deployment process
* 2 versions of the cohesive application
* Small extra cost (extra bucket size)

#### Immutable

<figure class="article">
    {% picture {{site.baseurl}}/assets/img/aws-elastic-beanstalk-immutable.png --alt Deployment on Immutable mode %}
    <figcaption>Deployment on Immutable mode</figcaption>
</figure>

* Longer deployment but application is uninterrupted and runs at full capacity during deployment process
* New release deployment runs in a temporary ASG
* 2 versions of the cohesive application
* High cost (number of instances doubles)

#### Traffic Splitting

* Equivalent of **Canary Testing**: an increasing number of users are automatically redirected to the new application at regular time intervals
* Application health is monitored and a very fast rollback is performed in case of failure
* Longer deployment but application is uninterrupted and runs at full capacity during deployment process
* New release deployment runs in a temporary ASG
* 2 versions of the cohesive application

<hr class="hr-text" data-content="Blue/Green">

### Déploiement Blue / Green

<figure class="article">
    {% picture {{site.baseurl}}/assets/img/aws-elastic-beanstalk-blue-green.png --alt Blue/Green Deployment %}
    <figcaption>Blue/Green Deployment</figcaption>
</figure>

It is not really supported by Beanstalk but it is possible to do it using manual actions:

- N Version's application is deployed on environment **Blue**
- The N+1 application is deployed on the **Green** environment with exactly the same configuration
- Opening of the Green environment at **Route 53** for Testing teams  
- Tests on the Green environment:
    * **Tests OK**: Switch all traffic on the Green with Route 53 and remove the Blue version by setting the ASG to min. capacity = 0
    * **Tests KO**: Green version removed and stay on Blue

### Other consideration

> info "Dev vs Prod"
> - In a **Development** environment, it is often necessary to have only one application instance: the DNS name of the application is mapped to an **Elastic IP** of the EC2 instance
> - In a **Production** environment, you want **High Availability**: The DNS name of the app is mapped to the IP address of a **Load Balancer** that will redirect requests to a **Auto Scaling Group** that will spread EC2 instances over different **Availability Zones**

<hr class="hr-text" data-content="Automation">

## Automation

You can automate deployments with Beanstalk by adding configuration files to the application sources:
- They must be located at the root of the application in a directory **.ebextensions/** (based on AWS CloudFormation templates)
- Each configuration file must have the **.config** extension and be in **JSON format** or **YAML**
- They make it possible to specify :
    * **additional resources** such as a RDS BDD, a S3 bucket,... (any AWS services)
    * A SSL certificate for the LB to be configured either in the **securelistener-alb.config** file or via the AWS Certificate Manager (ACM) service
    * Instance or ALB level HTTP to HTTPS redirects
    * Optional variables with **option_settings**

### Docker container

Beanstalk knows how to handle Docker containers. To do this, it is possible to provide a file:
- **Dockerfile**: it will be used to build and launch the Docker image
- **Dockerrun.aws.json** version v1: 
    * Single Docker Mode (1 image only)
    * It refers to an already built Docker image and configuration items
    * Beanstalk does not create an ECS instance but simply an EC2 instance with Docker
- **Dockerrun.aws.json** version v2: 
    * Multi Docker Mode (multiple images)
    * Contains the definition of an ECS Task
    * Beanstalk creates an ECS Cluster containing ECS instances, an LB in HA mode and the ECS Task
    * Docker images must already be built and present in AWS ECR or DockerHub

### Custom Platform

In case the language of your application is not supported by Beanstalk, it is possible to build a custom Beanstalk platform.

This requires:
- Building an AMI with a **Platform.yaml** file
- Building the **Platform** with software **Packer**
