---
layout: post
title: AWS Streaming - Amazon Kinesis
date: 2021-09-13 11:35:00 +0200
description: Amazon Kinesis Fundamentals and Key Concepts to Know. Tutorial, how-to.
img: aws-streaming-kinesis-documentation.jpg
fig-caption: Photo by <a href="https://unsplash.com/@goncas?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Gonçalo Martins</a> on <a href="https://unsplash.com/collections/9391511/motion?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, Kinesis, Streams, Firehose, Analytics, Documentation]
lang: en
permalink: /aws-streaming-kinesis/
status: finished
---

Amazon Kinesis makes it easy to collect, process and analyze data, streaming and real-time, so you can react quickly. It is capable of integrating real-time data, such as video, audio, application logs, website click streams, or IoT telemetry data.

Amazon Kinesis allows you to process and analyze data as it is received and react instantly instead of waiting for all data to be collected to start processing.

There are different Kinesis services depending on your need:
- **Amazon Kinesis Data Streams (KDS)**: continuously captures gigabytes of data per second and makes them available on Amazon S3 or AWS Lambda Functions
- **Amazon Kinesis Data Firehose**: Reliably loads streaming data into data lakes, data stores and analytics services
- **Amazon Kinesis Data Analytics**:  transforms and analyzes live streaming data with SQL and Apache Flink
- **Amazon Kinesis Video Streams**:  securely streams video to AWS

Let's look at these services in detail.

<hr class="hr-text" data-content="Content">

* TOC
{:toc}


<hr class="hr-text" data-content="Data Streams">

## Amazon Kinesis Data Streams

### General Architecture

- It is composed of **Shards** whose number must be initiated at creation
- The **number of Shards** defines the input and output flow of the Streams
- Message retention can range from **1 to 365 Days**
- The messages are **immutable**, they cannot be erased which allows to replay the data if needed

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-streaming-kinesis-general.jpg --alt Main components of Amazon Kinesis Data Streams %}
  <figcaption>Main components of Amazon Kinesis Data Streams</figcaption>
</figure>

1. One or more **Producers** send *Records* to *Kinesis Data Streams*
1. The **Kinesis Data Streams** is a set of Shards, a **Shard** being a single sequence of data in a stream
1. In **Write**, each *Shard* supports up to **1,000 records/sec** and up to **1 MB of data/sec**
1. In **Reading**, this depends on the **Consumer Mode**:
  * **Shared**: flow shared by **ALL** *Consumers* of **2 MB/sec by Shard**
  * **Enhanced**: flow rate for **EACH** *Consumer* of **2 MB/sec by Shard**

### Records *Fan-Out* 

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-streaming-kinesis-stream.jpg --alt Allocation of Records in the Shards %}
  <figcaption>Allocation of Records in the Shards</figcaption>
</figure>

1. A **Producer** generates a *Record* with a **Partition Key** and content of **1MB max** 
1. Based on the *Record** MD5 Hash, it is directed to one of the **Shards**
1. The *Record* receives an additional field, the **Sequence Number**, indicating its order of passage in the *Shard*
1. The **Consumer** receives the *Record* according to the delivery method **Shared** or **Enhanced Fan-Out**

> warning "Hot Partition"
> To avoid *Shard* receiving all *Records*, you must ensure that the **Partition Key** values are distributed!

### Security

- Access control and permissions by **IAM Policies**
- Encryption in transit by **HTTPS** and rest by **KMS**
- Kinesis Data Streams can be accessed through a **VPC Endpoint**, ensuring private communication, without going through the Internet
- Kinesis API calls are logged in **CloudTrail**

### Kinesis Procucers

- **Producers** send data to Kinesis Data Streams as **Records**
- They may be:
    * An **application**
    * A **Client Mobile** or **Desktop**
    * An application using **AWS SDK** (Low Level API) or **KPL** (Kinesis Producer Library, High Level API with batch, compression, retries)
    * A **Kinesis Agent** installed on a server that sends, for example, logs

> info ""
> Using Batch with the *PutRecords* API reduces costs and increases throughput

#### *ProvisionedThroughputExceed* error

When a *Shard* receives more data than it can process, an error **ProvisionedThroughputExceed** is returned to the *Producer*.

In order to guard against this, it is necessary to:
- Make sure to use a **distributed** value of **Partition Key**
- Implement a **Retry** mechanism with an **exponential backoff**
- Increase **number of *Shards***

### Records

It is made of 3 elements:
- The **Partition Key**: defined by the **Producer**, it determines in which *Shard* will pass the record (according to its Hash)
- The **Data Blob**: the content of **1 MB message at most**
- The **Sequence Number**: defined in **Kinesis Data Streams**, it indicates the *pass order* in the Shard

### Kinesis Consumers

- **Consumers** receive data from Kenesis Data Streams as **Records**
- They may be:
    * An **application** using the **AWS SDK** or the **KCL** API (for Kinesis Client Library)
    * A **Lambda Function**
    * **Kinesis Data Firehose**
    * **Kinesis Data Analytics**

> note "SDK vs KCL"
> - The ***AWS SDK*** is a low-level API that requires more implementation than the ***API KCL*** of high-level that implements mechanisms of *Retry*, checking of *Records* processed, reacting to *Resharding*, ...
> - These 2 APIs take into account the ***Shared*** and ***Enhanced*** modes, however note that, for **KCL**, only the **V2** version supports them

#### Shared vs Enhanced

The table below summarizes the key differences between the **Shared** and **Enhanced** modes of a *Consumer*:

| Feature   | Shared fan-out   | Enhanced fan-out   |
|:---------------------------------:|:-------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------:|
| **Read rate of a Shard**   | A maximum of 2 MB/s, spread over all *Consumers*   | A maximum of 2 MB/s, for each *Consumer*   |
| **Delivery model**   | Pull on HTTP, uses ***GetRecords***   | *Kinesis Data Streams* sends you records via HTTP/2, uses ***SubscribeToShard*** |
| **Message spread time** | About 200 ms on average per *Consumer* so only 5 calls/sec for the *GetRecords API*  | About 70 ms on average whether there are 1 or 5 *Consumers* (limited to 5 Consumers but can be extended)   |
| **Cost**   | N/A   | Additional cost for data recovery and use of *Shards*   |

#### Kinesis Client Library (KCL)

- Help to consume and process *Kinesis Data Streams* by supporting many complex tasks associated with distributed cloud architecture
- This is a **Java library** but can interface with other languages
- Each *Shard* can be read by a *KCL* instance at most 
- Only **version KCL 2.x** supports *Enhanced*
- Requires a table in **Amazon DynamoDB** to trace the Shards processed by each KCL instance and manage resumes
- KCL instance can be EC2, On Premise or Elastic Beanstalk (as long as IAM accesses are properly configured)

### Sizing of Shards

#### Shard Splitting

- Increases ***Streaming Capacity*** (Throughput) by increasing the number of *Shards* (and the cost!)
- Divides a ***Hot Shard***

The operation consists of:
- Creating 2 new *Shards*
- Closing the old *Shard* and deleting it once its data has expired

This is a **manual operation** only (no Auto Scaling possible) and only 1 split per operation

#### Shard Merging

- Decreases streaming capacity (throughput) and reduces costs
- Merges 2 ***Cold Shards*** with low traffic

The operation consists of:
- Creating a new *Shard*
- Closing the old *Shards* and deleting them once their data has expired

This is a **manual operation** only (no Auto Scaling possible) and only 1 merge per operation


<hr class="hr-text" data-content="Data Firehose">

## Kinesis Data Firehose

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-streaming-kinesis-firehose.jpg --alt General pipeline architecture with Kinesis Data Firehose %}
  <figcaption>General pipeline architecture with Kinesis Data Firehose</figcaption>
</figure>

**Kinesis Data Firehose** allows data flows to be loaded into data lakes, data stores, and analytics services with transformations as required:
- It is an AWS Service **fully managed**, serverless and with automatic sizing
- Cost is a function of data passing through *Kinesis Data Firehose*
- Loading ***quasi**-real-time*:
  * Within **60 seconds** of being sent to service
  * As soon as the **Buffer** is filled (the size depends on the destination service and its configuration)
- Supports many data formats, their conversion, transformation, compression
- Supports custom transformations (on AWS Lambda Functions)
- Can send data in error or for backup in a S3 Bucket

### Summary

| Kinesis Data Streams  |  Kinesis Data Firehose  |
|:---:|:--:|
| Large-scale Streaming Service  |  Streamed Data Loading Service  |
| Requires implementation of Producer/Consumer  |  Fully managed  |
| Real time (~200ms)  |  *"Near"* real time (min of 60s)  |
| Manual scaling  |  Automatic scaling  |
| Retention of data from 1 to 365 days<br>Possible replay  |  No retention of datas<br>No replay possible  |


<hr class="hr-text" data-content="Data Analytics">

## Kinesis Data Analytics

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-streaming-kinesis-analytics.jpg --alt General pipeline architecture with Kinesis Data Analytics %}
  <figcaption>General pipeline architecture with Kinesis Data Analytics</figcaption>
</figure>

**Amazon Kinesis Data Analytics** allows you to query and analyze data flows in real time. It is useful for real-time analysis of *time series*, *metrics* or generation of *dashboards*:

- Based on ***Apache Flink***, it supports SQL, Java, Scala and Python applications
- It is an AWS Service **fully managed**, serverless and with automatic sizing
- Cost is function of the data passing through *Kinesis Data Analytics*
