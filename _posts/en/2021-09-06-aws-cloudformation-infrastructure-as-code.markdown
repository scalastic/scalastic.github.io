---
layout: post
title: AWS CloudFormation - Infrastructure as Code
date: 2021-09-06 10:18:00 +0200
description: Basic principles and key concepts of AWS CloudFormation to know. Tutorial, instructions.
img: aws-cloudformation-infrastructure-as-code-documentation.jpg
fig-caption: Photo by <a href="https://unsplash.com/@matt_milton?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Matt Milton</a> on <a href="https://unsplash.com/collections/3509219/tilt-shift?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, CloudFormation, Infrastructure-as-Code, Stack, StackSet, Resource, Parameter, Mapping, Output, Condition, Rollback, Drift, Documentation]
lang: en
permalink: /aws-cloudformation-infrastructure-as-code/
status: finished
---

**CloudFormation** is an *Infrastructure-as-Code* tool that allows you to describe your infrastructure as a code and create it automatically, in the right order and according to your configuration.

<hr class="hr-text" data-content="Content">

* TOC
{:toc}

<hr class="hr-text" data-content="Benefits">

## Benefits of CloudFormation

The advantages of CloudFormation are:
- The ***Infrastructure-as-Code***:
    - Code can be managed under Git: any changes are traced and can be validated during a code review
    - If no resources are changed manually, you can recreate your environment at any time
- The ***costs***:
    - You can estimate the cost of your infrastructure from the CloudFormation code
    - You can easily delete your infrastructure when not in use (at night) and recreate it (every morning)
- The ***productivity***:
    - The code is declarative: CloudFormation is in charge of orchestrating and creating all the resources of your infra in the right order
    - You always have a clear picture of your infrastructure
    - You can structure your code using *Separation of Concerns* as *stacks* to isolate and reuse your infrastructure code

<hr class="hr-text" data-content="How it works">

## How it works

- CloudFormation uses ***templates*** that can be updated: CloudFormation analyzes differences and automatically updates your infrastructure
- The stacking arrangement makes it possible, when deleting them, to be sure that all the resources defined in the stack are deleted

Templates are in JSON or YAML format: they can be edited in the *CloudFormation Designer* interface or by hand.

> info ""
> Elastic Beanstalk and CodeStar make use of CloudFormation in the background

<hr class="hr-text" data-content="Syntax">

## Template syntax

The template files contain several parts. You will find at the following address: [AWS Template Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-reference.html){:target="_blank" rel="noopener noreferrer nofollow"} all references concerning the syntax of templates.

Let us look at each of its parts in detail.

### Resources

- The ***Resources*** object contains a list of resource objects. A resource statement contains the attributes of the resource, which are themselves declared as child objects.
- A resource must have an attribute ***Type***, which defines the type of AWS resource you want to create.
- The ***Type*** attribute has a special format: `AWS::ProductIdentifier::ResourceType` 

> info "Syntax"
> Depending on the *Resource* involved, there are different syntax forms. Details for each type of *Resource* can be found at: [AWS resource and property types reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html){:target="_blank" rel="noopener noreferrer nofollow"}

Here is an extract of a template for creating 2 ***Resources***: an EC2 instance and its Security Group:

{% highlight Yaml %}
Resources:
  EC2Instance:
    Type: 'AWS::EC2::Instance'
    Properties:
      InstanceType: !Ref InstanceType
      SecurityGroups:
        - !Ref InstanceSecurityGroup
      KeyName: !Ref KeyName
      ImageId: !FindInMap 
        - AWSRegionArch2AMI
        - !Ref 'AWS::Region'
        - !FindInMap 
          - AWSInstanceType2Arch
          - !Ref InstanceType
          - Arch
  InstanceSecurityGroup:
    Type: 'AWS::EC2::SecurityGroup'
    Properties:
      GroupDescription: Enable SSH access via port 22
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: '22'
          ToPort: '22'
          CidrIp: !Ref SSHLocation
{% endhighlight %}

### Parameters

Let’s take a look at the parameter declarations and how you can restrict and validate the user entry.

- The declaration of the de facto parameters in **Parameters**.
- A parameter contains a list of attributes that define its value and the constraints in relation to its value.
- The only required attribute is **Type**, which can be String, Number or an AWS specific type.
- You can also add a **Description** attribute that tells the user what type of value they should specify.

Example definition of 2 ****Parameters**, KeyName and SSHLocation:

{% highlight Yaml %}
Parameters:
  KeyName:
    Description: Name of an existing EC2 KeyPair to enable SSH access to the instance
    Type: 'AWS::EC2::KeyPair::KeyName'
    ConstraintDescription: must be the name of an existing EC2 KeyPair.
  SSHLocation:
    Description: The IP address range that can be used to SSH to the EC2 instances
    Type: String
    MinLength: '9'
    MaxLength: '18'
    Default: 0.0.0.0/0
    AllowedPattern: '(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/(\d{1,2})'
    ConstraintDescription: must be a valid IP CIDR range of the form x.x.x.x/x.
{% endhighlight %}

### Mappings

Settings are a great way to allow users to specify unique or sensitive values to use in Templates properties. However, there may be parameters that depend on the region or are somewhat complex for users to understand due to other conditions or dependencies.

In these cases, you will want to put some logic into the model itself so that users can specify simpler (or no) values to get the results they want. These are **Mappings**.

Example definition of a ***Mappings***, AWSInstanceType2Arch:

{% highlight Yaml %}
Mappings:
  AWSInstanceType2Arch:
    t1.micro:
      Arch: HVM64
    t2.nano:
      Arch: HVM64
    t2.micro:
      Arch: HVM64
{% endhighlight %}

### Outputs

The **Outputs** object in the template contains statements for the values you want to see available after creating a **Stack**. An Output is a convenient way to capture important information about your input resources or settings.

Example definition of ***Outputs***, InstanceId, AZ, PublicDNS and PublicIP:

{% highlight Yaml %}
Outputs:
  InstanceId:
    Description: InstanceId of the newly created EC2 instance
    Value: !Ref EC2Instance
  AZ:
    Description: Availability Zone of the newly created EC2 instance
    Value: !GetAtt 
      - EC2Instance
      - AvailabilityZone
  PublicDNS:
    Description: Public DNSName of the newly created EC2 instance
    Value: !GetAtt 
      - EC2Instance
      - PublicDnsName
  PublicIP:
    Description: Public IP address of the newly created EC2 instance
    Value: !GetAtt 
      - EC2Instance
      - PublicIp
{% endhighlight %}

### Conditions

You can use **Conditions** to conditionally create Stack resources.

These conditions are evaluated and you can associate them with resources or resource properties in the **Resources** and **Outputs** sections of a template.

There are:
- Fn::And
- Fn::Equals
- Fn::If
- Fn::Not
- Fn::Or

### Intrinsic functions

AWS CloudFormation provides several built-in features that help you manage your stacks. Use **Intrinsic Functions** in your templates to assign values to properties that are not available before execution.

#### Fn::Ref

The **Ref** intrinsic function returns the value of the specified parameter or resource:
- When you specify the logical name of a ***Parameter***, it returns the value of the parameter.
- When you specify the logical name of a ***Resource***, it returns a value that you can generally use to refer to that resource, such as a physical ID.

When you declare a resource in a model and you must specify another resource by its name, you can use the reference to refer to that other resource. In general, Ref returns the name of the resource. For example, a reference to AWS::AutoScaling::AutoScalingGroup returns the name of this Auto Scaling group resource.

For some resources, an identifier is returned that has another significant meaning in the context of the resource. An AWS::EC2::EIP resource, for example, returns the IP address, and an AWS::EC2:::Instance returns the instance ID.

#### Fn::GetAtt

The intrinsic function **Fn::GetAtt** returns the value of an attribute from a Resource in the template. 

Its syntax is of one of two forms:
- `Fn::GetAtt: [ logicalNameOfResource, attributeName ]`
- `!GetAtt logicalNameOfResource.attributeName`

For more information on GetAtt return values for a particular resource, refer to the documentation for that resource in the [Resource and Properties Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html){:target="_blank" rel="noopener noreferrer nofollow"} 

#### Fn::FindInMap

The intrinsic function **Fn::FindInMap** returns the key value in a two-level *map* that is declared in the ***Mappings*** section.

Its syntax is `Fn::FindInMap: [ MapName, TopLevelKey, SecondLevelKey ]`

#### Fn::Join

The intrinsic function **Fn::Join** concatenates a list of values into a single value, separated by the specified delimiter. If the delimiter is an empty string, the set of values is concatenated without delimiter.

Its syntax is `Fn::Join: [ delimiter, [ comma-delimited list of values or variables containing... ] ]`

#### Other intrinsic functions

There are other intrinsic functions that are very useful. You can find the list at [Intrinsic Functions Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html){:target="_blank" rel="noopener noreferrer nofollow"} 

<hr class="hr-text" data-content="Rollback">

## Rollback

When updating a template in CloudFormation, it is possible to specify whether or not to perform a **Rollback** in the event of an error during the update.

When this option is enabled, if an error occurred, CloudFormation automatically removes all changes made during the incorrect update. In the case of a first deployment, it will delete in the same way all the objects it created.

<hr class="hr-text" data-content="Stacks">

## Stacks

A **Stack** is a collection of AWS resources that you can manage as a single unit. In other words, you can create, update or delete a collection of resources by creating, updating or deleting Stacks. All resources in a Stack are defined by the AWS CloudFormation template of the Stack.

A Stack, for example, may include all the resources needed to run a Web application, such as a Web server, database, and network rules. If you no longer need this web application, you can simply delete the Stack, and all its related resources are deleted.

### ChangeSets

When you need to update a *Stack*, understanding how your changes will affect running resources before you implement them can help you confidently update the *Stacks*.

The **ChangeSets** allow you to preview the changes proposed by CloudFormation when updating a *Stack*. *AWS CloudFormation* makes changes to your Stack only when you decide to run the *ChangeSets*, allowing you to decide whether to make changes or explore other changes by creating another *ChangeSets*.

### Nested Stacks

The **Nested Stacks** are Stacks created for use in other Stacks. You create a *Nested Stacks* in another Stack using the `AWS::CloudFormation::Stack`.

As your infrastructure grows, common models may appear in which you declare the same components in multiple models. You can separate these common components and create dedicated templates for them. Then use the resource in your model to reference other models, creating *Nested Stacks*.

### StackSets

A **StackSet** allows you to create *Stacks* for AWS accounts in different *Regions* using a single CloudFormation template. All resources included in each Stack are defined by the CloudFormation template of the *StackSet*. 

When you create a StackSet, you specify the template to use, in addition to the parameters and capabilities the template requires.

#### Creating a StackSet

Creating a new *StackSet* includes specifying a CloudFormation template that you want to use to create stacks, the specification of the target accounts in which you want to create the Stacks and the identification of the AWS regions in which you want to deploy the Stacks in your target accounts. 

A *StackSet* ensures consistent deployment of the same Stacks resources, with the same settings, for all target accounts specified in the regions you choose.

#### Updating a StackSet

When you update a *StackSet*, you push the changes on the Stacks into your *StackSet*. You can update a *StackSet* in one of the following ways. 

- Change existing settings in the template or add new resources, such as updating settings for a specific service or adding new Amazon EC2 instances.
- Replace the template with another template.
- Add batteries to existing or additional target accounts, existing or additional regions.

#### Deleting a StackSet

When you delete Stacks, you delete a Stack and all its resources associated with the target accounts you specify, in the Regions you specify.

You can **remove Stacks** as follows:

- Remove Stacks from some target accounts, while leaving other Stacks in other target accounts running
- Remove Stacks from some Regions, while leaving Stacks from other Regions running
- Remove Stacks from your StackSet, but save them so they continue to work independently of your StackSet by choosing **Keep Stacks**. Stored stacks are managed in AWS CloudFormation, outside your StackSet
- Remove all Stacks from your StackSet, in preparation for deleting your entire StackSet

**Delete StackSet**:

- You can delete your StackSet only when there are no Stack instances

<hr class="hr-text" data-content="Drift">

## CloudFormation Drift

Running a drift detection operation on a Stack determines whether the Stack has derived from its expected template configuration, and returns detailed information on the drift status of each resource in the Stack that supports drift detection.

To detect drift on an entire stack using the AWS management console:

1. Open the AWS CloudFormation Console at [https://console.aws.amazon.com/cloudformation](https://console.aws.amazon.com/cloudformation){:target="_blank" rel="noopener noreferrer nofollow"}.
2. In the Stacks list, select the Stack on which you want to perform the drift detection. In the Stack Details panel, choose **Stack Actions**, then choose **Detect Drift**.

## Cost Estimate

There is no extra charge when using AWS CloudFormation. You pay for AWS resources (for example, Amazon EC2 instances, Elastic Load Balancing load balancers, etc.) created using CloudFormation as if you had created them by hand.

It is also possible to estimate the costs of a Stack CloudFormation. To do so:

1. On the **Review** page of the **Create stack** wizard, in the **Template** section, click on the **Estimate cost** link
1. This link opens the ***AWS price calculator*** in a new browser tab

> info ""
> - Since you started the calculator from the CloudFormation console, it is pre-populated with your *template* configuration and parameter values
> - There are many additional configurable values that can give you a better estimate if you have an idea of how much data you expect to transfer to your Amazon EC2 instance

