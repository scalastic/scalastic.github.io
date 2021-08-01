---
layout: post
title: Amazon Containers - ECS, ECR et Fargate
date: 2021-07-31 12:38:00 +0200
description: Basic principles and key concepts of Amazon ECS, ECR and Fargate to know. Tutorial, instructions.
img: aws-ecs-ecr-fargate-documentation.jpg
fig-caption: Photo by <a href="https://unsplash.com/@slgoetz?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Simon Goetz</a> on <a href="https://unsplash.com/collections/514990/architecture?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, ECS, ECS-Task, Cluster, Docker, ECS-Service, ECR, IAM-Role, Instance-Profile, Fargate, AMI, Auto-Scaling, ASG, ELB, Documentation]
lang: en
permalink: /aws-ecs-ecr-fargate/
status: finished
---

AWS offers several Container Management Services. These include:
- **Amazon ECS** for Elastic Container Service
- **Amazon Fargate** to run Amazon ECS in Serverless
- **Amazon EKS** for Amazon Elastic Kubernetes Service to manage a Kubernetes Cluster

In this article, we will talk about the first 2 Services, Amazon EKS deserving a single chapter.

<hr class="hr-text" data-content="Content">

* TOC
{:toc}

<hr class="hr-text" data-content="ECS">

## Amazon ECS

- **Amazon Elastic Container Service** (**Amazon ECS**) is a highly scalable and fast container management service
- It's a cluster of EC2 instances that each run an **ECS Agent** (the Docker container)
- The ECS agent is also used to record the instance in the **Cluster ECS**
- EC2 instances are based on an AMI (Amazon Machine Image) that contains the ECS agent

### Composition of ECS Cluster

An ECS Cluster contains:

- One or more EC2 instances:
    * Instances of type AMI *amazon-ami-ecs-optimized* based on the Docker image *amazon/amazon-ecs-agent:latest*
    * With EBS or EFS storage 
    * And a Key Pair to access it
- It integrates into a VPC on one or more **Subnets** to be highly available (multi-AZ):
    * An **ASG** is automatically created and contains a Launch Configuration that configures the ECS Cluster name in each **/etc/ecs/ecs.config** file of each EC2 instance
- Each EC2 instance is protected by a **Security Group**
- On each EC2 instance is added the **Role ecsInstanceRole** which is based on the Policy **AmazonEC2ContainerServiceforEC2Role**, managed by AWS, and which allows the ECS Agent to make calls to the ECS API

<hr class="hr-text" data-content="ECS Task">

### ECS Task

- This is the AWS formalism (in JSON) to define what the Dockerfile file contains and which will be used to define a Docker container
- It contains the name of the image to run, the ports mapping between the host and the container, the amount of memory and CPU that the container will have available, the environment variables to pass to the container,...

> warning "Security Group"
> In the Security Group of EC2 instances, remember to allow the port of the application defined for the host in order to be able to access the application in the container

#### Placement of Tasks in the ECS Cluster

> info ""
> Tasks are placed in "best-effort" mode. Amazon ECS always tries to place tasks even when the most optimal placement option is unavailable. However, the placement constraints of the Tasks are restrictive, and **they may prevent the placement of the Tasks**.

When Amazon ECS places Tasks, it uses the following process to select a container instance:

1. Identifies instances that meet processor, memory and port requirements in the task definition
1. It identifies instances that meet the placement constraints of the Tasks
1. Identifies instances that meet the Tasks placement strategies

#### Placement Strategy

There are different placement strategies:
- **binpack**: 
    * Tasks are placed on container instances in a way that leaves the least amount of CPU or memory unused
    * This strategy minimizes the number of instances in the ECS Cluster and therefore the associated costs
- **random**:
    * Tasks are randomly placed on the available instances
- **spread**:
    * Tasks are distributed according to a specified value. The accepted values are ***instanceId*** or any custom attribute that can be applied to an ECS instance, such as the attribute: ***ecs.availability-zone***
    * In the case of an attribute ***ecs.availability-zone****, the Tasks will be distributed across all AZ of the ECS Cluster

<hr class="hr-text" data-content="ECS Service">

### ECS Service

ECS Service defines how to start an ECS Task: it is the equivalent of Docker’s SWARM file or Kubernetes  Service/Replica/Deployment... configuration files

It states:
* How many Tasks should be started (min, max, desired):
    - **ECS Service Auto Scaling** allows automatic scaling of Tasks
* How to distribute them between the EC2 instances of the Cluster 
* **ECS Cluster Auto Scaling** (**CAS**) allows you to automatically add or remove EC2 instances to the ECS Cluster
* Access to the application through a **Elastic Load Balancer** (ALB, NLB, CLB to choose):
    - The **dynamic port forwarding** of the LB does not specify a Port on the Host side and the LB will do the mapping automatically
    - This functionality requires modifying the Security Group of EC2 instances (authorization of all ports for the SG of the Load Balancer)

### ECS Auto Scaling 

> info "Auto Scaling"
>
> - As can be seen, the AWS documentation mentions the Auto Scaling in numerous terms: here *ECS Service Auto Scaling*, *ECS Cluster Auto Scaling*,...
> - In fact, **AWS Auto Scaling** (the generic service) is organized into 2 categories:
>   * **Amazon EC2 Auto Scaling**, when it concerns an EC2 instance
>   * **Application Auto Scaling**, for anything other than EC2

In ECS, there is a **Cluster Capacity Provider** that is combined with an **Auto Scaling Group** to manage the sizing of Cluster instances

<hr class="hr-text" data-content="ECR">

## Amazon ECR

- **Amazon Elastic Container Registry** (Amazon ECR) is an AWS-managed container image registry that is secure, scalable and robust.
- Amazon ECR relies on AWS IAM permissions to push and retrieve images from its registry.
- It offers different functions such as image security scan or Cross-Region and Cross-Account replication

### Command Line Usage

- Authentication of the Docker Client to the ECR registry with AWS CLI v1 or v2:

{% highlight CLI-v1 %}
$(aws ecr get-login-password --no-include-email --region <region>)
{% endhighlight %}

{% highlight CLI-v2 %}
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com
{% endhighlight %}

- Docker image tag with registry URL:

{% highlight zsh %}
docker tag <docker-image-name>:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/<docker-image-name>:latest
{% endhighlight %}

- Push the Docker image into the register:

{% highlight zsh %}
docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/<docker-image-name>:latest
{% endhighlight %}

<hr class="hr-text" data-content="Security">

### The Roles behind it all

It is important to keep in mind the use of Roles that is made by ECS and what remains to be configured by the user:
- The EC2 instances that are part of an ECS Cluster have implicitly Roles allowing them to interact with:
    * ***ECS Service***: used by the ECS Agent to make calls to the ECS Service API
    * ***CloudWatch Logs***: to send usage logs to the CloudWatch API
    * ***ECR Service***: to retrieve the Docker image from the ECR repository
- But the user must specify the necessary Roles for the ECS Tasks, for example:
    * ***AmazonS3ReadOnlyAccess*** for an application defined in a Task that will access a S3 Bucket
    * ***AmazonEC2FullAccess*** for an application that will access the EC2 API

> info "IAM Role and Instance Profile"
> The two terms are used to designate, as appropriate, the same thing:
> - The ***Instance Profile*** is the instantiation, in an EC2 instance, of permissions defined in a Role
> - The ***IAM Role*** being just a definition of this permissions

<hr class="hr-text" data-content="Fargate">

## Amazon Fargate

- **AWS Fargate** allows you to create an Amazon ECS Cluster without worrying about Amazon EC2 instances.
- This is the **Serverless** version of Amazon ECS
- The creation of the Tasks is similar to those in ECS but Fargate is responsible for providing them with an execution environment 

So it’s much simpler.