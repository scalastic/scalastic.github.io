---
layout: post
title: Amazon Route 53
date: 2021-07-15 17:37:00 +0200
description: Amazon Route 53 Fundamentals and Key Concepts to Know. Tutorial, how-to.
img: aws-route-53-documentation.jpg
fig-caption: Photo by <a href="https://unsplash.com/@frankbusch?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Frank Busch</a> on <a href="https://unsplash.com/s/photos/direction-sign?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, Route-53, Documentation]
lang: en
permalink: /aws-route-53-documentation/
status: finished
---

Amazon Route 53 is a highly available and scalable Domain Name System (DNS) web service.

With Route 53, you can register domains, route traffic to the resources where your domains are hosted, and check the health of your resources. You can also route traffic based on the health of your resources. This guide explains how to register domains, configure DNS, and configure health checks using the Route 53 console.

<hr class="hr-text" data-content="Content">

* TOC
{:toc}

<hr class="hr-text" data-content="Types">

## Record Types

In AWS, you can record 4 types of Records:
- **A**: Match a hostname to an IPv4
  * A record Can match a hostname with multiple IPv4
- **AAAA**: Match a hostname to an IPv6
  * A record Can match a hostname with multiple IPv6
- **CNAME**: Match a hostname to another hostname
  * Only works for root domain names (e.g. www.example.com -> myserver.12345.mymachine.com)
- **Alias**: Match a hostname to an AWS resource
  * Works for root domain names (apex) or not root (e.g. example.com -> server-12345.eu-west-3.alb.amazonaws.com)
  * It is free (unlike CNAME)
  * It integrates a native Health Check

Hostnames can be **public**, accessible from a client browser, for example, or **private**, accessed by an AWS instance within a private network.

<hr class="hr-text" data-content="TTL">

## Time To Live

A DNS record is associated with a TTL that tells the client the validity time of a DNS record.

It can be:
- high: for example 24 hours, risk of obsolete registration
- low: for example 60s, allows a record to be quickly updated

<hr class="hr-text" data-content="Features">

## AWS Features

Route 53 brings additional features compared to a classic DNS:

### Health Check

  * A resource is marked ***healthy*** once it has passed x Heath Checks (default 3)
  * A resource is marked ***unhealthy*** once it has failed x Heath Checks (default 3)


Route 53 returns only endpoints **healthy**


  * About 15 Health Checkers are run to test the health of an endpoint
  * They each perform a test every 30s by default (can be lowered to 10s)


This means that they run a query every 2s as a whole

  * Probes can be configured in TCP, HTTP or HTTPS (but do not check the validity of the certificate in the latter case)
  * Health Check can be combined with CloudWatch

### Routing policies

  * **Simple**:
    * Redirection to a single resource (but may be multiple endpoints/IPs)
    * No Health Check!
    * The Client receives all IPs and selects one at random to access the resource
  * **Multi value**:
    * Like Simple but with a Healt Check: only Healthy endpoints will be returned (unlike Simple)
  * **Failover**:
    * As part of a Disaster Recovery with a Primary/Secondary server architecture
    * Returns the IP of the Primary server as long as it is Healthy, the Secondary server otherwise
    * However, there is no Health Check on the Secondary server
  * **Weighted**:
    * Assigns a weight to each endpoint of the resource
    * Allows you to test 10% of traffic on a new version of an application
    * Useful to redirect traffic between 2 Regions
    * Supports Health Check
    * Customer receives only one IP (and is not aware of the other endpoints)
  * **Latency**:
    * Directs to the AWS Region that has the lowest latency from the Client’s perspective
    * This is not necessarily the nearest Region (although this should be the case for most of it)
    * Client receives only one IP (and is not aware of the other endpoints)
  * **Geolocation**:
    * Directs traffic to the Region closest to the Client
  * **Geoproximity**:
    * Directs traffic to the Region closest to the Client but with a bias that allows to modify the target Regions
    * Configurable in Route 53 Traffic Flow
    * A positive bias (from 1 to 99) will artificially increase the size of a Region
    * A negative bias (from -99 to -1) will reduce the size of a Region
    * Resources can be either:
      * An AWS resource (linked to an AWS Region)
      * A non-AWS resource (this will require to set the latitude/longitude of the resource)

