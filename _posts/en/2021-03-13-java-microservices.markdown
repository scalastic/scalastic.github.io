---
layout: post
title: Java and microservices
date: 2021-03-13 15:21:20 +0200
description: "Java and microservices: start-up time, heat-up time, JVM memory consumption ... Let's take stock."
img: java-like-rusty-container.jpg
fig-caption: Photo by <a href="https://unsplash.com/@darkcut?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Robert MODOUX</a> on <a href="https://unsplash.com/s/photos/container-rusty?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [Java, Microservices]
lang: en
permalink: /java-microservices/
---

This article is the first in a series discussing the concepts of the new GraalVM virtual machine.

We will discuss here basic notions on microservices, on Java and its JVM HotSpot. This will give us a first idea on the suitability of Java to the world of containers and especially microservices.

<hr class="hr-text" data-content="Content">

* TOC
{:toc}

<hr class="hr-text" data-content="Microservices">

## What is a microservice?

We can, for the oldest among us, consider microservices as an extension of the concept of `SOA` (Service Oriented Architecture) with the advent of the cloud.

A `microservice` can be characterized as:

* A service designed to **manage a single feature** (e.g. user management)
* **Elastic**, ie easily scalable. This involves rapid deployment, a lightweight service, all of this in a container, or even in the cloud.
* **Automated**, from the build process to deployment. Generally, it is maintained by a dedicated and small team, with automated tests to quickly deploy a new version.

> note "Microservice vs FaaS"
> `FaaS`, for Functions-as-a-Service, goes a little further in this concept, adding the notions of *serverless* (the infrastructure necessary for the service is the responsibility of the supplier) and *stateless* (dear to functional programming, x -> f (x), always!)

<hr class="hr-text" data-content="Java">

## What is Java?

Everyone knows Java! A language interpreted by a JVM and portable on different systems. However, let's review a few notions about its internal functioning to fully understand its scope.

### How the JVM works

<hr class="hr-text" data-content="Interpreter">

#### The interpretation

{% figure caption:"The stages of the interpretation of Bytecode by the JVM" class:"article" %}
![The stages of the interpretation of Bytecode by the JVM]({{site.baseurl}}/assets/img/jvm-execution.png)
{% endfigure %}

1. The JVM is an executable which reads bytecode and then interprets it.
2. The bytecode is in .jar packages as .class files
3. The JVM **searches** the .class file in the .jar packages, **checks** the .class file then loads it
4. Once the bytecode is loaded, the JVM can execute it (**semi-interpret it**)

> warning ""
> Executing bytecode therefore has a cost:
>
> * The bytecode is sought, verified then interpreted by the JVM which itself runs on the processor.

<hr class="hr-text" data-content="JIT compiler">

#### The Just-In-Time (JIT) compiler

{% figure caption:"The stages of the JIT optimization of Bytecode by the JVM" class:"article" %}
![The stages of the JIT optimization of Bytecode by the JVM]({{site.baseurl}}/assets/img/jvm-jit.png)
{% endfigure %}

1. &nbsp; &nbsp; When executing a Java method, JIT's `C1` compiler (just-in-time, on the fly) will compile it to native code and the `Profiler` will start to collect information on its use.

> info ""
> C1 is a light and fast compiler but it does not produce optimized native code.

2. &nbsp; &nbsp; When the profiler detects a widely used method, ***Hot***, the `C2` compiler will use information from the Profiler to produce native code, **aggressive**, optimized and very well suited to the context of use.

> info ""
> C2 is a heavy and slow compiler but it produces very well optimized and very fast native code.

> note ""
> There is actually a cycle between compilation C1 and C2. The C2 compiler will often recompile chunks of bytecode with new information from the profiler to produce an ever more optimal binary.

3. After a while, when many pieces of bytecode have been compiled by the C2 compiler, the Java application will run very quickly.

> warning ""
> * So it takes a heating time, ***warm-up***, to a Java application to be fully responsive.
> * This is a real problem for a microservice which must be able to be deployed and operational very quickly.

<hr class="hr-text" data-content="Memory">

#### L'empreinte mémoire

##### Architecture générale de la JVM 

{% figure caption:"The different layers involved in a JVM" class:"article" %}
![The different layers involved in a JVM]({{site.baseurl}}/assets/img/jvm-architecture.png)
{% endfigure %}


When we look at the general architecture of a JVM, we can only see that there are a lot of components. We also see that its memory space is compartmentalized.

Let's focus on 2 of them.

##### Detail of 2 memory spaces

{% figure caption:"Details of 2 memory spaces of the JVM" class:"article" %}
![Details of 2 memory spaces of the JVM]({{site.baseurl}}/assets/img/jvm-memory.jpg)
{% endfigure %}

The JVM allocates memory for the application but also for its own metadata and its operation:

1. The ***Java Heap*** stores instances of Java objects.
   It is divided into 2 parts: the ***Young Generation*** which contains the newly created objects and the ***Tenured Generation*** which contains items that have withstood the garbage collector (***Garbage Collector***).

1. The ***Metaspace*** (formerly *PermGen*) contains class metadata (bytecode of methods, symbols, *constant pools*, annotations ...).

> warning ""
> * For a 10MB application, the JVM often occupies a size of 100MB.
> * Again, this is a problem for a microservice which must have the smallest possible memory footprint.

<hr class="hr-text" data-content="Frameworks">

### How Java Frameworks work

It is now customary to embed several frameworks in a Java application in order to simplify certain technical aspects or to organize its application layers.

Let us take the case of 2 frameworks, undoubtedly, the most used in the Java world: **Spring** and **Hibernate**.

Here is what a Java application that uses these frameworks, will perform when it starts:
1. Reading and parsing of configuration files,
1. Complete class scan to retrieve metadata (annotations, accessors, ...),
1. Creation of a metamodel,
1. Preparation of the reflection,
1. Creation of proxies (lots of proxies!), ...

However, these are frameworks widely used by developers and, in reality, very well suited to monolithic applications.

> warning ""
> * Java frameworks amplify the problems of startup time and memory consumption of the JVM.

<hr class="hr-text" data-content="Conclusion">

## How do we do now?

> info "To summarize"
> We have seen the problems of Java:
> * High memory consumption
> * Need for a warm-up time at start-up
> * Native code optimization on the fly

A priori, all that is not necessary for a microservice.

So what do we do now? We forget about Java and we all get into C++ ??

None of that of course. The answer in the following article presenting GraalVM. And you will see that it moves!

{{ "||/graalvm-microservices-java/|GraalVM, the future of microservices applications in Java" | pagination: site.data.i18n.article-previous, site.data.i18n.article-next }}

Cheers...

> info "And now"
> * Did you like this article? Say it below so that the blog gains visibility.
> * Do you have a question? Leave it in comment, I will do my best to answer it as soon as possible.
>
> Thanks to you!
>
