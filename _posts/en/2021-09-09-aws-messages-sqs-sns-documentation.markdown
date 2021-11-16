---
layout: post
title: AWS Messages - Amazon SQS and SNS
date: 2021-09-09 15:38:00 +0200
description: Amazon SQS and SNS Fundamentals and Key Concepts to Know. Tutorial, how-to.
img: aws-messages-sqs-sns-documentation.jpg
fig-caption: Photo by <a href="https://unsplash.com/@zvessels55?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Zach Vessels</a> on <a href="https://unsplash.com/s/photos/traffic-jam?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, SQS, SNS, Queue, Topic, Message, Notification, FIFO, Documentation]
lang: en
permalink: /aws-messages-sqs-sns/
status: finished
---

- A particularly well-suited architecture for the Cloud is the **distributed architecture**: each application component can be scaled according to needs. One variation of this type of architecture is *microservices*.
- This raises the problem of communication between these components: coupled interactions are difficult to maintain and problematic in the case of different scaling sizes. 

An intermediate software brick (**Middleware**) quickly appeared to ensure **decoupling** and **asynchronous** communication between these components. 

We will see here 2 types of Message-Oriented Middleware (MOM):
- **Amazon SQS** which is a Message Queue
- **Amazon SNS** following a Publish/Subscribe template of Messages

<hr class="hr-text" data-content="Content">

* TOC
{:toc}


<hr class="hr-text" data-content="SQS">

## Amazon Simple Queue Service

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-messages-sqs-sns-sqs-queue.jpg --alt Example of using a SQS Queue %}
  <figcaption>Example of using a SQS Queue</figcaption>
</figure>

### Characteristics

Amazon Simple Queue Service or SQS is a message queue service, entirely managed by AWS:
- Unlimited queues and messages
- Message size up to 256 KB
    * If you need larger messages, use *Amazon SQS Extended Client Library for Java* which stores the content of the message in Amazon S3 and just returns its reference
- Default 4-day message retention (up to 14 days)

### Standard vs FIFO

It supports 2 types of Queues with different characteristics:

| Standard Queue  |  FIFO Queue  |
| :---: | :---: |
| **Unlimited Throughput**: supports virtually unlimited number of transactions per second (TPS)  |  **High Throughput**:  By default, supports up to 300 messages per second (300 sending, receiving or deleting operations per second). If you batch 10 messages per operation (maximum), FIFO queues can support up to 3000 messages per second.  |
| **At-Least-Once Delivery**  A message is given at least once, but may be given in several copies.  | **Exactly-Once Processing**  : a message is delivered once and remains available until it is processed and deleted by a recipient. No duplicate.  |
| **Best-Effort Ordering**  Messages may be handed out in a different order than they were sent.  | **First-In-First-Out Delivery**:  the order in which messages are sent and received is rigorously maintained (First In, First Out).  |

### How it works

1. Generating a message by calling the **SendMessage** API using the SDK
1. Message consumption by calling **ReceiveMessage** (possibility to receive 1 to 10 messages per call)
1. The message becomes *invisible* for the time defined in **Message visibility timeout** (default 30s)
    - At the end of *Message visibility timeout*, the message becomes visible again in the Queue and can be consumed again by another consumer if it has not been deleted in the meantime or if this time has not been modified by the consumer with the API **ChangeMessageVisibility** 
1. Delete message by calling **DeleteMessage**

### Security

- Encryption in transit (HTTPS) and at rest (AWS KMS)
- Access control of the SQS API by an IAM Policy
- SQS Access Policy for:
    - Cross-account Queue access
    - Give access to the Queue, in writing, to other AWS services

### Auto Scaling

A classic architecture is the Auto Scaling of consumers by the Queue itself:

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-messages-sqs-sns-autoscaling.jpg --alt Example of Auto Scaling of a SQS Queue %}
  <figcaption>Example of Auto Scaling of a SQS Queue</figcaption>
</figure>

### Other Parameters

#### Dead Letter Queue

When a message returns to the Queue one **MaximumReceives** time, it is possible to redirect it to another Queue, the **Dead Letter Queue** for further analysis

#### Delay Queue

When it arrives in the Queue, a message can be hidden from consumers during the **Delay Queue** of a maximum of 15 min

#### Long Polling

When a consumer requests a message from an empty *Queue*, they can wait **Long Polling** sec. for a message to arrive. Its possible value ranges from 1 to 20 sec

### FIFOs' Specific Parameters

#### Duplication

There are 2 methods of **duplicate calculation** in the *FIFO Queue*:
- **Hash SHA-256** message content
- **Deduplication ID** indicated in the generated message explicitly

#### Message Grouping

In the same FIFO, it is possible to group messages by specifying a **MessageGroupID**.

In this case, each Message Group can only be consumed by one consumer and the order of the messages is specific to each group: this allows a parallel consumption of the messages of a FIFO.


<hr class="hr-text" data-content="SNS">

## Amazon Simple Notification Service

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-messages-sqs-sns-sns-queue.jpg --alt Example of using a SNS Queue %}
  <figcaption>Example of using a SNS Queue</figcaption>
</figure>

Amazon Simple Notification Service (Amazon SNS) is an automatically managed AWS service that delivers messages from *Publishers* to *Subscribers* (model **Pub/Sub** also known as Producers/Consumers):

- A SNS Queue is made up of **Topics** and it is called **Notification** rather than Message
- There may be **100.000 Topics** per SNS Queue
- A **Subscriber** subscribes to a Topic and receives all Notifications (*Messages*) posted on it
    * It can also **filter** Topic Notifications to receive only certain
- There may be up to **10,000,000 Subscribers** per Topic

- Publishers that can issue notifications in SNS are:
    * Many AWS Services:
        - CloudWatch and its alarms
        - Auto Scaling Groups
        - Amazon S3 events
        - The CloudFormation events

- Subscribers may be of the following type:
    * **Application-To-Application** (A2A) for inter-application messages to:
        - Amazon Kinesis Data Firehose
        - Lambda functions
        - SQS tails
        - HTTP/S endpoints
        - AWS Event Fork Pipelines
    * **Application-To-Person** (A2P) to notify users using:
        - Mobile applications
        - Mobile phone number
        - Email addresses

> info ""
> We find many of the same features as Amazon SQS especially in terms of Security and types of Standard Queue or FIFO

## Fan Out architecture pattern 

The use of Amazon SNS + Amazon SQS makes it possible to design perfectly decoupled architectures, without loss of data, parallel and asynchronous, called **Fan Out** (to break down a large processing into several smaller ones for example)

### Fan Out

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/sns-archiving-use-case.png --alt Example of Fan Out SNS + SQS architecture (extract from AWS documentation) %}
  <figcaption>Example of Fan Out SNS + SQS architecture (extract from AWS documentation)</figcaption>
</figure>

### FIFO Fan Out

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/sns-fifo-usecase.png --alt Example of FIFO Fan Out SNS + SQS architecture (extract from AWS documentation) %}
  <figcaption>Example of FIFO Fan Out SNS + SQS architecture (extract from AWS documentation)</figcaption>
</figure>