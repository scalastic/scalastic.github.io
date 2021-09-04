---
layout: post
title: AWS Development Tools- CodeCommit, CodeBuild, CodeDeploy, CodePipeline
date: 2021-09-02 11:35:00 +0200
description: Basic principles and key concepts of AWS CodeCommit, CodeBuild, CodeDeploy and CodePipeline to know. Tutorial, user manual.
img: aws-codecommit-codebuild-codedeploy-codepipeline-documentation.jpg
fig-caption: Photo by <a href="https://unsplash.com/@heysupersimi?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Simone Hutsch</a> on <a href="https://unsplash.com/s/photos/battersea?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, CodeCommit, CodeBuild, CodeDeploy, CodePipeline, CICD, CodeStar, STS, SNS, EC2, ASG, Lambda, Cloudwatch, SSM, Documentation]
lang: en
permalink: /aws-codecommit-codebuild-codedeploy-codepipeline/
status: finished
---

AWS has development tools that allow you to perform all the steps of a CI/CD and thus facilitate the development of applications:
- **AWS CodeCommit** is a Git-based, AWS-hosted *version management* service that you can use to store and manage source code, binary files or documents in the cloud
- **AWS CodeBuild** is a *Continuous Integration* service that compiles your source code, runs unit tests and produces ready-to-deploy artifacts
- **AWS CodeDeploy** is a deployment service that automates application deployments to Amazon EC2 instances, on-premise instances, Lambda functions or Amazon ECS services
- **AWS CodePipeline** is a *Continuous Delivery* service that allows you to model, view and automate the steps required to deploy your application

<hr class="hr-text" data-content="Content">

* TOC
{:toc}

<hr class="hr-text" data-content="CodeCommit">

## AWS CodeCommit

- Private Git repository accessible via a traditional Git client
- Fully managed, dimensioning and automatic backups: high availability, no size limit
- Secure content with encryption and secure access (requires AWS IAM account)

### Authentication
- By SSH keys, configurable in the IAM account of each user
- By HTTPS, generating credentials or using the AWS CLI
- Possibility to add Strong authentication with MFA key (Multi Factor Authentication)

### Authorization
- Managed with IAM Policies on IAM accounts and Roles

### Encryption
- When transferring via HTTPS or SSH
- In the repository by AWS KMS

> info "Give access to your repository"
> Use an IAM Role and provide access to its Role through AWS Security Token Service (AWS STS)

### Notification

CodeCommit can trigger actions based on certain events including Amazon Simple Notification Service (Amazon SNS), AWS Lambda, AWS CloudWatch Events and many other AWS services

<hr class="hr-text" data-content="CodeBuild">

## AWS CodeBuild

It allows to build and test application code:
- It can read the source code of CodeCommit but also CodePipeline, GitHub or S3 bucket
- Build instructions should be stored in a ***buildspec.yml*** file at the source code root
- A S3 bucket can be used as a cache to store previously downloaded dependencies and speed up builds for example
- The result of the build is called an **artifact** and is stored in a bucket S3
- It may:
    * Log the build process in S3 or AWS CloudWatch
    * Produce metrics
    * Use CloudWatch Alarms to detect build failures and initiate notifications
    * Use AWS SNS to initiate notifications


### Benefits

- It is fully managed: no server to provision, auto scalable, no build queue!
- Cost is based on usage (build time only)
- Relies on CloudWatch Events and AWS Lambda
- It is based on Docker images that can be customized as needed, for example, for languages other than those already supported: Java, Python, Ruby, Go, Node.js, PHP, . NET
- It integrates with different security services like **KMS** to encrypt output artifacts, **IAM Roles** to manage build permissions, **VPC Network Security** to run tests in yours VPC, **CloudTrail** to log APIs calls
- It is possible to launch a local CodeBuild build (with Docker) to explore errors for example

> warning "CodeBuild or CodePipeline"
> Build statements can be defined in CodeBuild and CodePipeline. Defining them in the 2 tools can lead to unwanted behaviours that are difficult to interpret

### Build Definition

- Located in a **buildspec.yml** file, directly at the project root
- Defines environment variables either in plain language or using **SSM Parameters** in case of Secrets
- Is structured in steps:
    * **Install**: commands to install the build environment
    * **Pre build**
    * **Build**: commands to build the application
    * **Post build** 
- Artifact: defines the deliverable to be stored on S3 (encrypted with KMS)
- Cache: the files to be placed in the S3 cache

### Working in VPC

- CodeBuild is run by default outside of your VPC
- To be able to access resources such as Load Balancer, BDD or EC2 instance,... a VPC configuration must be configured with:
    * a VPC ID
    * a Subnet IDs
    * a Security Group ID to be used

<hr class="hr-text" data-content="CodeDeploy">

## AWS CodeDeploy

- Automatically deploys an application on multiple EC2 instances (except for AWS Elastic Beanstalk) or on-premise instances 
- It is a fully managed service
- Requires the installation of a CodeDeploy Agent on each target machine

### How it works

- Defined in a **appspec.yml** file
- EC2 instances are grouped by environment (dev, test, prod)
- AWS Lambda are also supported
- But CodeDeploy does not provide AWS servers, they must already be provisionned
- Great flexibility to define any type of deployment: Blue/Green deployment only works with EC2 instances

### Terminology

Among the information needed to define a deployment, here are the most important:
- **Application**: the name of the application
- **Compute Platform**: EC2 instances (and those of an ASG), On-Premise or Lambda
- **Deployment Configuration**:
    * EC2 and On-Premise: Minimum percentage of healthy instances when deployed
    * Lambda: Routing Traffic to New Deployed Functions
- **Deployment Type**: In-Place or Blue/Green
- **IAM Instance Profile**: IAM permissions for EC2 instances to read from S3 or GitHub
- **Application Revision**: Source code and file revision **appspec.yml**  
- **Service Role**: Role required for CodeDeploy to execute deployment
- **Target Revision**: Application version when deployed

### Definition of a deployment

- **File Section**: Instructions to copy artifact from S3 to filesystem
- **Hooks**: Instructions for deploying the new version of the application
    * Can set a time-out
    * Are divided into different ordered steps:
        - ***ApplicationStop***: Stop the current application
        - ***DownloadBundle***: Download the new application version
        - ***BeforeInstall***
        - ***Install***
        - ***AfterInstall***
        - ***ApplicationStart***
        - ***ValidateService***: Verification of the correct operation of the new application version (Health Check)

<hr class="hr-text" data-content="CodeStar">

## AWS CodeStar

CodeStar is an integrated solution that includes all CICD services and also, for some Regions, the Cloud9 web IDE and the JIRA ticketing tool or GitHub Issues. It is accessible from a single entry point in the form of a dashboard.

It allows you to easily and quickly have a development and CICD environment adapted to the language of yours application: Java, Go, Python, Node.js, HTML5,...

<hr class="hr-text" data-content="CodePipeline">

## AWS CodePipeline

CodePipeline is the orchestrator of all CICD services and enables a fully automated Continuous Delivery chain to be set up.

It can integrate third-party tools like GitHub, Jenkins, Load Testing tools and AWS services like Elastic Beanstalk, CloudFormation, ECS,...

Its possibilities are huge and can define complex steps as can be seen in this example of the implementation of a CICD pipeline:

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-codecommit-codebuild-codedeploy-codepipeline-pipeline-example.jpg --alt Example of a CICD pipeline with CodePipeline (Credit @PaulClarkeJNCIP on Twitter) %}
  <figcaption>Example of a CICD pipeline with CodePipeline (Credit @PaulClarkeJNCIP on Twitter)</figcaption>
</figure>

