---
layout: post
title: "AWS CloudFormation: Infrastructure-as-Code by Amazon"
date: 2023-07-14 12:49:00 +0200
description: Explore AWS CloudFormation, the Infrastructure-as-Code tool that enables automated and efficient creation and management of your AWS infrastructure.
img: aws-cloudformation-infrastructure-as-code-documentation.jpg
fig-caption: Photo by <a href="https://unsplash.com/@matt_milton?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Matt Milton</a> on <a href="https://unsplash.com/collections/3509219/tilt-shift?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, CloudFormation, Infrastructure-as-Code, Stack, StackSet, Resource, Parameter, Mapping, Output, Condition, Rollback, Drift, Template, Automation, Cost]
lang: en
permalink: /aws-cloudformation-infrastructure-as-code/
status: finished
---

CloudFormation is a powerful Infrastructure-as-Code (IaC) tool provided by AWS. It allows you to describe and manage your AWS infrastructure as code, offering an automated and reproducible approach to creating and managing your cloud resources.

In this article, our goal is to introduce you to the fundamental principles and key concepts of AWS CloudFormation. You will learn how to use CloudFormation to deploy and manage your AWS resources effectively and consistently.

<hr class="hr-text" data-content="Table of Contents">

* TOC
{:toc}

<hr class="hr-text" data-content="Benefits">

## Benefits of CloudFormation

The Infrastructure-as-Code (IaC) approach offered by CloudFormation provides several significant benefits. Here are the key advantages you can gain from using CloudFormation to deploy and manage your AWS infrastructure:

### 1. Simplified Management with Infrastructure-as-Code

By adopting the IaC approach with CloudFormation, you can describe your infrastructure using a programming language, typically in JSON or YAML format. This allows you to manage your infrastructure consistently, reproducibly, and version-controlled. You can store your configuration files in a version control system like Git, track changes to your infrastructure, and validate them during code reviews. Infrastructure-as-Code helps you maintain control over your infrastructure and follow configuration management best practices.

### 2. Cost Control

CloudFormation offers built-in features that allow you to estimate the costs of your infrastructure before even deploying it. By using CloudFormation configuration files, you can evaluate the costs of the required AWS resources for your infrastructure. This feature helps you plan and optimize your expenses by ensuring you have the necessary resources while avoiding unnecessary costs.

Furthermore, CloudFormation facilitates cost management by allowing you to delete and recreate your infrastructure as needed. For example, you can schedule the deletion of your environment during periods of inactivity to save costs and automatically recreate it when needed.

### 3. Increased Productivity

CloudFormation's declarative approach allows you to describe your infrastructure without worrying about the details of resource orchestration. CloudFormation takes care of ordering and creating all the resources in the correct order in your infrastructure. This saves you time and enhances productivity by avoiding tedious manual tasks.

Additionally, CloudFormation provides a clear overview of the current state of your infrastructure at any given time. You can easily visualize and understand your entire infrastructure using CloudFormation configuration files. This simplifies collaboration between development teams, operations, and compliance officers.

### 4. Efficient Code Management

With CloudFormation, you can structure your infrastructure code using the principle of Separation of Concerns by using stacks. Stacks allow you to isolate and reuse specific parts of your infrastructure code. This facilitates code management, resource reuse, and adoption of software development best practices such as modularity and maintainability.

<hr class="hr-text" data-content="Operation">

## CloudFormation Operation

CloudFormation operates using **templates** that describe your AWS infrastructure. A template is a file in either JSON or YAML format that contains all the necessary resources, parameters, mappings, conditions, and outputs to create and manage your infrastructure.

### 1. Using Templates

CloudFormation templates serve as a blueprint for your infrastructure. They describe the resources you want to create, such as EC2 instances, databases, queues, IAM roles, and more. You can specify the properties of each resource, such as the instance type, security policies, permissions, and more.

Templates allow you to define the order in which resources should be created, ensuring that dependencies between resources are properly managed. You can also use intrinsic functions to perform advanced operations, such as retrieving values from other resources or parameters.

### 2. Managing Updates and Deletions

CloudFormation simplifies the management of updates and deletions of resources. When you make changes to your template, CloudFormation analyzes the differences between the current configuration and the desired configuration. It then makes the necessary modifications to update your infrastructure accordingly. This allows you to keep your infrastructure up to date while minimizing service interruptions.

Furthermore, CloudFormation also handles the management of resource deletions. When you delete a resource or a stack, CloudFormation ensures that all associated resources are also deleted. This ensures clean and complete management of your infrastructure.

### 3. CloudFormation Designer

CloudFormation Designer is a graphical interface that allows you to design and visualize your CloudFormation templates. With CloudFormation Designer, you can visually create and edit your templates using a graphical representation of resources. This makes it easier to design your infrastructure and understand its structure.

CloudFormation Designer provides drag-and-drop functionality to add resources, visual connections to represent dependencies, as well as validation features to check the validity of your template. You can then export your template for use with CloudFormation.

> note ""
> **_Elastic Beanstalk_** and **_CodeStar_** make use of **_CloudFormation_** in the background.

<hr class="hr-text" data-content="Template Syntax">

## Template Syntax

A CloudFormation template consists of different sections that define the resources, parameters, mappings, outputs, and conditions of your infrastructure. Each section has a specific role in creating and configuring your AWS environment.

> info "Reference"
> Template files comprise multiple parts. You can find the complete syntax references at the following link:
> [AWS Template Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-reference.html){:target="_blank" rel="noopener noreferrer nofollow"}.

Here's an overview of the main sections of a CloudFormation template:

### Resources

The **Resources** section contains the list of resources you want to create in your infrastructure. Each resource is defined as an object with its specific properties. Each resource must have a `Type` attribute that specifies the type of AWS resource to create. For example, you can define EC2 instances, security groups, databases, and more.

Here's an example syntax for creating an EC2 instance and its security group:

{% highlight yaml %}
Resources:
  MyEC2Instance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-12345678
      InstanceType: t2.micro
      SecurityGroupIds:
        - sg-abcdefgh
{% endhighlight %}

> info "Syntax by `Resources` Type"
> Depending on the specific resource, there are different syntax forms. You can find detailed information for each `Resources` type at the following link:
> [AWS resource and property types reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html){:target="_blank" rel="noopener noreferrer nofollow"}.

### Parameters

The `Parameters` section allows you to define customizable parameters for your template. Parameters enable you to provide values when deploying your infrastructure, allowing you to customize configurations based on your needs. You can specify the expected data type for each parameter, as well as optional constraints.

Here's an example syntax for defining two parameters, `InstanceType` and `KeyName`:

{% highlight yaml %}
Parameters:
  InstanceType:
    Type: String
    Default: t2.micro
    Description: EC2 instance type
  KeyName:
    Type: AWS::EC2::KeyPair::KeyName
    Description: EC2 key pair name
    ConstraintDescription: Must be the name of an existing EC2 key pair.
{% endhighlight %}

### Mappings

The `Mappings` section allows you to define mappings between keys and values. Mappings can be used to simplify the configuration of your template and enable customization based on different criteria, such as region or environment. You can use the `Fn::FindInMap` intrinsic function to retrieve the corresponding values.

Here's an example syntax for defining a mapping between EC2 instance types and their architectures:

{% highlight yaml %}
Mappings:
  InstanceTypeToArch:
    t2.micro:
      Arch: HVM64
    t2.small:
      Arch: HVM64
{% endhighlight %}

### Outputs

The `Outputs` section allows you to define values that you want to make available after the creation of your infrastructure. You can specify outputs to capture important information, such as resource identifiers, IP addresses, and more. These outputs can be used by other resources or displayed at the end of the deployment.

Here's an example syntax for defining two outputs, `InstanceId` and `PublicIP`:

{% highlight yaml %}
Outputs:
  InstanceId:
    Description: ID of the created EC2 instance
    Value: !Ref MyEC2Instance
  PublicIP:
    Description: Public IP address of the created EC2 instance
    Value: !GetAtt MyEC2Instance.PublicIp
{% endhighlight %}

### Conditions

The `Conditions` section allows you to define logical conditions to control the creation of certain resources or the configuration of their properties. You can use intrinsic functions such as `Fn::And`, `Fn::Equals`, `Fn::If`, `Fn::Not`, `Fn::Or` to evaluate conditions and make decisions based on their results.

Here's an example syntax for defining a condition based on the EC2 instance type:

{% highlight yaml %}
Conditions:
  IsMicroInstance: !Equals [!Ref InstanceType, t2.micro]
{% endhighlight %}

These sections form the building blocks for creating CloudFormation templates. You can combine and customize them based on your specific needs. By using these sections, you can describe and organize your AWS infrastructure in a declarative and reproducible manner.

> info ""
> Note that the provided examples use **_YAML_** syntax, but you can also use **_JSON_** to define your **_CloudFormation_** templates.

<hr class="hr-text" data-content="Intrinsic Functions">

## Using Intrinsic Functions

CloudFormation offers a variety of **intrinsic functions** that allow you to perform advanced operations in your templates. These functions help you assign dynamic values to resource properties, reference other resources, or perform string manipulations.

Here are some commonly used intrinsic functions:

### `Fn::Ref`

The `Fn::Ref` intrinsic function allows you to reference parameters or resources in your template. When you use `Fn::Ref` with a parameter, it returns the value specified during deployment. When used with a resource, it typically returns a value that you can use to refer to that resource.

Here's an example of using `Fn::Ref` to retrieve the value of a parameter named `InstanceType`:

{% highlight yaml %}
InstanceType: !Ref InstanceType
{% endhighlight %}

### `Fn::GetAtt`

The `Fn::GetAtt` intrinsic function allows you to retrieve the value of a specific attribute of a resource. You can use `Fn::GetAtt` to obtain information about a created resource, such as its ID, IP address, and more.

Here's an example of using `Fn::GetAtt` to get the public IP address of an EC2 instance named `MyEC2Instance`:

{% highlight yaml %}
PublicIP: !GetAtt MyEC2Instance.PublicIp
{% endhighlight %}

### `Fn::FindInMap`

The `Fn::FindInMap` intrinsic function allows you to retrieve a value corresponding to keys in a mapping structure. You can use this function to simplify the retrieval of values based on specific criteria, such as region or instance type.

Here's an example of using `Fn::FindInMap` to get the architecture corresponding to an EC2 instance type:

{% highlight yaml %}
Arch: !FindInMap [InstanceTypeToArch, !Ref InstanceType, Arch]
{% endhighlight %}

### `Fn::Join`

The `Fn::Join` intrinsic function allows you to concatenate a list of values into a single value, separated by a specified delimiter. This is useful when you want to combine multiple values into a single string.

Here's an example of using `Fn::Join` to concatenate two values, separated by a comma:

{% highlight yaml %}
CombinedValue: !Join [",", [Value1, Value2]]
{% endhighlight %}

These intrinsic functions are just a few examples among many others available in CloudFormation. They allow you to perform advanced operations and add flexibility to your templates.

It's important to consult the
[Intrinsic Function Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html){:target="_blank" rel="noopener noreferrer nofollow"}
for a complete list of intrinsic functions and to understand their specific functionalities.

<hr class="hr-text" data-content="Rollback">

## Rollback Management

When performing updates to CloudFormation templates, a **Rollback** mechanism is available to ensure the integrity of your infrastructure in case of errors during the update process.

The main idea behind Rollback is to restore the previous state of your infrastructure by undoing the changes made during the erroneous update. This minimizes the impact of errors and maintains the functionality of your environment.

When you initiate a template update, CloudFormation goes through the following steps:

1. **Change Analysis**: CloudFormation analyzes the differences between your current state and the new template and determines the actions needed to reach the desired state.

2. **Change Execution**: CloudFormation applies the necessary changes to update your infrastructure based on the new template. This may involve creating, modifying, or deleting resources.

3. **Stability Verification**: After the changes are applied, CloudFormation verifies the stability of your environment by running tests. If errors are detected during this phase, the Rollback mechanism is triggered.

If an error is detected, Rollback is triggered, and CloudFormation performs the following actions:

1. **Deletion of Newly Created Resources**: Any resources created during the erroneous update are deleted to revert to the previous state.

2. **Restoration of Modified Resources**: Resources modified during the erroneous update are restored to their previous state.

3. **Reversal of Deletions**: If any resources were deleted during the update, Rollback reverses those deletions to restore them.

The Rollback mechanism provides an additional layer of safety when managing your CloudFormation templates. In case of issues, you can be assured that your infrastructure will be restored to a previous functional state.

> note ""
> It is important to note that Rollback is not enabled by default; you need to specify this option when initiating the update of your template if you want to benefit from this functionality.

<hr class="hr-text" data-content="Stacks">

## Using Stacks

In AWS CloudFormation, **Stacks** play a crucial role in managing your AWS resources. A Stack is a collection of AWS resources that can be managed as a single unit. It allows you to create, update, or delete a set of resources in a consistent and reproducible manner.

Here are some key points about using Stacks:

### Stack Definition

A **Stack** is created from a CloudFormation template, which describes the set of resources and their configuration.

Using Stacks provides several advantages:

- **Simplified Resource Management**: By grouping related resources into a Stack, you can manage and process them as a logical unit. This makes it easier to create, update, and delete your resources in a single process.

- **Reproducibility and Consistency**: The CloudFormation template ensures that your infrastructure is created consistently with each Stack deployment. This avoids manual errors and ensures reproducibility of your environment.

- **Simplified Tracking and Management**: With CloudFormation, you have a clear and comprehensive view of the state of your infrastructure. You can easily visualize the resources, their dependencies, and the changes made over time.

### ChangeSets

When making changes to an existing Stack, it is important to understand the impact of those changes before applying them. **ChangeSets** are a mechanism provided by AWS CloudFormation to preview the proposed modifications before implementing them.

A **ChangeSet** represents the changes that will be applied to the Stack. It allows you to review the planned actions, identify resource additions, updates, or deletions, and validate the changes before applying them.

ChangeSets provide an additional layer of safety and enable you to make informed decisions about managing your resources.

### Nested Stacks

**Nested Stacks** are Stacks created within the context of another parent Stack. They allow you to reuse common components or break down your infrastructure into smaller, self-contained logical modules.

By using Nested Stacks, you can simplify the management of your templates by organizing them in a hierarchical manner. Each Nested Stack can have its own template and manage its specific resources while being integrated into the parent Stack.

This facilitates the management and maintenance of your resources by dividing them into smaller, reusable components. You can create dedicated templates for each component and reference them in your parent Stack.

Nested Stacks also promote modularity, flexibility, and reusability of your infrastructures across different contexts.

<hr class="hr-text" data-content="StackSets">

## Using StackSets

In AWS CloudFormation, **StackSets** provide a powerful solution for deploying Stacks across multiple AWS accounts and regions. A StackSet allows you to create, update, and delete Stacks in a set of target accounts using a single CloudFormation template.

Here are the key points to know about using StackSets:

### Introduction to StackSets

A StackSet allows you to centrally manage the deployment of a set of Stacks across different AWS accounts and regions. You specify a CloudFormation template along with the parameters and capabilities required by that template.

When creating a StackSet, you have the flexibility to deploy Stacks to one or multiple target AWS accounts and choose the regions where you want to deploy them. This offers you the flexibility to deploy and manage your infrastructure consistently across different contexts.

StackSets are particularly useful in multi-account environments

, where you can deploy a standardized architecture in each account automatically and under control.

### Creating, Updating, and Deleting StackSets

Creating a StackSet involves specifying the CloudFormation template you want to use to create the Stacks, along with the target accounts where you want to deploy those Stacks. You can also specify the AWS regions where you want to deploy them.

Once you have created a StackSet, you can update it in various ways:

- **Modifying Parameters**: You can modify existing parameters in the template or add new resources to perform specific changes to your infrastructure.

- **Replacing the Template**: You have the option to replace the existing template with a different template to make more substantial changes to your StackSet.

- **Adding Accounts and Regions**: You can expand your StackSet by adding additional target accounts or deploying Stacks to new AWS regions.

Deleting a StackSet will result in the deletion of the associated Stacks in the specified target accounts. You can choose to delete only specific Stacks or delete all the Stacks within the StackSet.

> note ""
> It is important to note that you can only delete a StackSet once all Stack instances have been deleted.

### Advantages of StackSets

StackSets offer numerous benefits in deploying and managing infrastructure at scale:

- **Consistent Deployment**: StackSets ensure consistent deployment of the same Stack resources in each specified target account and region. This ensures the consistency and compliance of your infrastructure.

- **Centralized Management**: By using a StackSet, you can centrally manage Stacks across multiple accounts and regions, making it easier to manage and coordinate your large-scale infrastructure.

- **Ease of Updating**: StackSets make it easy to update Stacks across your entire environment by applying changes to the CloudFormation template. This allows you to keep your infrastructure up to date efficiently and securely.

StackSets provide a flexible and scalable approach for deploying and managing your Stacks in distributed environments. They allow you to maintain consistency and control while simplifying the management and updates of your infrastructure.

<hr class="hr-text" data-content="Drift">

## Drift Management with CloudFormation

**Drift detection** is a critical feature of AWS CloudFormation that allows you to check if a Stack has deviated from its initial configuration defined in the CloudFormation template. Drift occurs when unauthorized changes are made to the Stack's resources outside of CloudFormation, leading to variances from the intended state.

Here are the key points to understand about drift management with CloudFormation:

### Drift Detection and its Benefits

Drift detection helps you maintain the integrity and compliance of your infrastructure by identifying discrepancies between the actual state of resources and the expected state defined in the CloudFormation template. It helps you detect unauthorized modifications, incorrect configurations, or deleted resources.

Drift detection is useful in the following scenarios:

- **Compliance Maintenance**: You can verify if the resources in your Stack comply with security rules, best practices, or internal policies of your organization. Drift detection helps you identify discrepancies and take appropriate actions to correct them.

- **Tracking Unauthorized Changes**: You can detect changes made to resources outside of CloudFormation, which helps prevent human errors or unauthorized actions that could result in undesirable configurations.

### Drift Detection Process for a Stack

To detect drift in a Stack within AWS CloudFormation, you can follow these steps:

1. Go to the AWS CloudFormation console at [https://console.aws.amazon.com/cloudformation](https://console.aws.amazon.com/cloudformation){:target="_blank" rel="noopener noreferrer nofollow"} .

2. In the list of Stacks, select the Stack for which you want to perform drift detection.

3. In the Stack detail panel, choose **Stack Actions** and then select **Detect drift**.

AWS CloudFormation will then compare the current state of the Stack's resources with the state defined in the CloudFormation template. You will receive a detailed report indicating the resources that have drifted, i.e., the resources that have been modified, deleted, or whose configuration differs from what is specified in the template.

By analyzing the drift report, you can take appropriate actions to restore the desired state of your infrastructure. This may involve updating the CloudFormation template, recreating certain resources, or other corrective actions.

Drift detection with CloudFormation is a valuable way to maintain the integrity of your infrastructure and ensure compliance with the expected configurations. By regularly following the drift detection process, you can ensure that your infrastructure remains aligned with your requirements and prevent undesirable configurations.

<hr class="hr-text" data-content="Cost">

## Cost Estimation

When using AWS CloudFormation, it is important to understand the associated pricing model and estimate the costs related to your Stacks. Here are the key points to consider regarding cost estimation in CloudFormation:

### CloudFormation Pricing Model

AWS CloudFormation does not charge any additional fees for using its service. You are only billed for the AWS resources you deploy using CloudFormation. This means that the costs associated with using CloudFormation are the same as if you had created and managed those resources manually.

The fees for resources deployed by CloudFormation are calculated based on the standard AWS rates for each specific service. For example, if you deploy Amazon EC2 instances, you will be charged according to the usual EC2 rates.

### Using the AWS Pricing Calculator

To estimate the costs associated with your CloudFormation Stacks, AWS provides a convenient tool called the **AWS Pricing Calculator**. This tool allows you to obtain a detailed cost estimation based on your specific configuration.

Here's how to estimate the costs of a CloudFormation Stack using the AWS Pricing Calculator:

1. On the Stack creation wizard review page, in the **Template** section, click the **Estimate costs** link.

2. The link will redirect you to the AWS Pricing Calculator in a new browser tab.

3. In the Pricing Calculator, you can review and adjust the settings for each resource deployed by your Stack, as well as data transfer settings, AWS regions, etc., to obtain an accurate estimate.

4. Once you have configured all the necessary parameters, the AWS Pricing Calculator will provide you with a detailed monthly cost estimation associated with your CloudFormation Stack.

It is important to note that the AWS Pricing Calculator allows you to account for different factors and options specific to your infrastructure. This helps you evaluate the potential costs before deploying your CloudFormation Stacks and plan accordingly.

By using the AWS Pricing Calculator, you can gain a clear understanding of the costs associated with your CloudFormation Stacks and make informed decisions regarding budgeting and cost optimization.

<hr class="hr-text" data-content="Conclusion">

## Conclusion

In this article, we explored the fundamental principles and key concepts of AWS CloudFormation as an Infrastructure-as-Code tool. Here is a summary of the key points we covered:

- CloudFormation allows you to describe your infrastructure as code and automatically create it based on your configuration.
- The benefits of CloudFormation stem from the Infrastructure-as-Code approach, which provides efficient infrastructure management.
- You can estimate the cost of your infrastructure from CloudFormation code, facilitating budget planning.
- CloudFormation's declarative code and resource management within Stacks enable improved productivity and maintaining a clear state of your infrastructure.
- CloudFormation's templates are in JSON or YAML format and include multiple sections such as Resources, Parameters, Mappings, Outputs, and Conditions.
- You can use intrinsic functions like Ref, GetAtt, FindInMap, Join, etc., to manipulate values and attributes in the templates.
- CloudFormation supports the Rollback mechanism during template updates, allowing you to revert to a previous state in case of errors.
- Stacks are units for managing resources in CloudFormation, enabling the creation, updating, and deletion of resource sets consistently.
- ChangeSets allow you to preview proposed changes before applying them to your existing Stacks.
- Nested Stacks allow you to reuse common components by declaring them in dedicated templates.
- StackSets enable you to deploy Stacks across multiple AWS accounts and regions from a single CloudFormation template.
- Drift detection helps you identify discrepancies between the current state of resources and the expected state defined in the CloudFormation template.
- You can estimate the costs associated with your CloudFormation Stacks using the AWS Pricing Calculator.

We highly encourage the use of AWS CloudFormation for efficient infrastructure management. By embracing the Infrastructure-as-Code approach and leveraging the powerful capabilities of CloudFormation, you can automate the creation, updating, and deletion of your infrastructure, improving efficiency, consistency, and compliance in your environments.

Remember to consult the official AWS CloudFormation documentation to deepen your knowledge and make the most of this powerful tool. With CloudFormation, you can build and manage your infrastructures more effectively, allowing you to focus on innovation and achieving your business objectives.
