---
layout: post
title: "HexaGlue or Why Hexagonal Architecture Needs a Compiler"
date: 2026-01-04 10:52:00 +0200
description: "HexaGlue compiles the infrastructure of a hexagonal architecture from ports and the domain model: less glue code, more focus on business logic."
img: hexaglue-hexagonal-architecture-compilator.jpg
fig-caption: Photo by <a href="https://unsplash.com/fr/@makitrenko?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Mykyta Kravčenko</a> on <a href="https://unsplash.com/fr/photos/un-panneau-daffichage-sur-le-bord-de-la-route-r2Pmvr_7Dec?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [HexaGlue, Hexagonal-Architecture, DDD, Clean-Architecture, Java, Maven, Code-Generation, AST, Ports-Adapters, Infrastructure]
lang: en
permalink: /hexaglue-hexagonal-architecture-compilator/
status: finished
---


Hexagonal architecture is now widely adopted in the software ecosystem. Ports and adapters, inverted dependencies, isolated domain: its principles are well-known, documented, and proven through years of practice.

On paper, everything seems clear. In the field, however, when applied to real projects, a discomfort remains. Something in the daily implementation doesn’t quite live up to its promises.

This gap is not always explicit, but it quickly shows in the code, in timelines, and in team fatigue. And it is precisely this paradox that this article explores.

<hr class="hr-text" data-content="ToC">


* TOC
{:toc}


<hr class="hr-text" data-content="Promise vs Reality">

## The Hexagonal Architecture Paradox

In theory, hexagonal architecture promises a lot. It aims for a **strictly isolated domain**, **explicit boundaries**, **strong independence from frameworks**, and, as a direct consequence, **simpler and more robust tests**.

These promises are real. They are even largely fulfilled… from an architectural standpoint.

But in everyday code, the reality is often more nuanced.

As the application grows, we observe:

* a **proliferation of adapter classes**,
* **repetitive and mechanical** mapping,
* repositories, controllers, DTOs, and mappers written **by hand**,
* increasingly **verbose** infrastructure, fragile and **costly to maintain**.

The paradox then becomes clear:

> warning ""
> **The domain is protected, but development time is absorbed by an infrastructure with no business value.**

The architecture plays its role as a safeguard… at the cost of growing effort in the area with the least value.


<hr class="hr-text" data-content="Glue Code">

## The Real Problem Isn’t the Domain

It’s often said that “frameworks pollute the domain.” In some cases, that’s true. But this observation, while partially accurate, misses the essential point.

The core problem is not the domain. It lies elsewhere.

**Infrastructure is, by nature, *glue code*.**

Code that is:

* repetitive,
* largely standardized,
* heavily dependent on tools and technologies (REST, JPA, messaging, etc.),
* and, by design, **devoid of business decisions**.

Yet this non-business code must still be:

* maintained over time,
* tested,
* migrated when the stack changes,
* refactored,
* sometimes entirely rewritten with each technological shift.

The question then becomes hard to ignore:

> warning ""
> **Why are experienced developers still spending so much time writing this kind of code?**


<hr class="hr-text" data-content="Shift in Perspective">

## What If Infrastructure Were... Compiled?

Let’s take a step back.

In a well-structured hexagonal application:

* the **domain** forms an explicit model,
* the **ports** define clear contracts,
* infrastructure is merely a **technical projection** of these contracts.

In other words:

* the ***what*** is already known,
* the ***how*** follows well-established rules,
* and the rest is essentially ***mechanical***.

From this observation, one idea almost naturally emerges:

> info ""
> **What if infrastructure were not written manually, but generated automatically?**

- Not at runtime.  
- Not via an intrusive framework.  
- But **at compile time**, like a true compiler would.


<hr class="hr-text" data-content="Structural Automation">

## HexaGlue: An Infrastructure Compiler

HexaGlue was born from this simple, almost self-evident idea in hindsight:

> note ""
> **The business logic is written by developers.**<br>
> **The infrastructure can be produced by a compiler.**

HexaGlue is not just a basic code generator based on static templates.<br>
It is based on a **structural and holistic** understanding of the application.

### How It Works

HexaGlue adopts an approach directly inspired by **language compilers**.

Just like a modern compiler does not simply translate source code line by line, HexaGlue goes beyond mechanical file generation.  
It **analyzes**, **interprets**, and **transforms** the application from an ***Intermediate Representation***.

Its process is structured into three distinct phases:

{% highlight Text %}
Modeling → Classification → Generation
{% endhighlight %}

#### 1. Modeling

Much like the syntactic and semantic analysis phases of a compiler, HexaGlue begins by analyzing the application as a whole. It builds a complete AST (Abstract Syntax Tree) graph representing types, methods, relationships, and dependencies.

This step produces a faithful representation of the source code, independent of any target technology.  
At this stage, HexaGlue does not yet reason in terms of REST, JPA, or Kafka: it simply observes and understands the structure of the program.

#### 2. Classification (Intermediate Model)

The AST graph is then traversed and interpreted to produce an **architectural intermediate model**.  
This model, comparable to a compiler’s *Intermediate Representation*, no longer reflects the raw structure of the code, but its **architectural meaning**.

In this model, HexaGlue explicitly identifies:

* aggregates, entities, and value objects,
* incoming and outgoing ports,
* relationships and dependencies between business concepts.

This intermediate model forms the **core of the system**: a stable, explicit, and actionable representation of the application’s real architecture.

#### 3. Generation

From this model, specialized plugins handle **a specific technology or type of adapter**.  
Each plugin knows how to translate domain ports and contracts into a precise technical implementation: annotations, conventions, method signatures, error handling, and integration with the target framework.

Infrastructure code is thus generated in a deterministic and reproducible way, **without ever modifying the domain**.

> info ""
> **The domain and ports form the source language.**<br>
> **The intermediate model is its semantics.**<br>
> **Infrastructure is the compiled code.**

<hr class="hr-text" data-content="Approach">

## An Approach That Makes a Difference

Most code generators work through local transformation: one input file, one output file.

HexaGlue takes a fundamentally different approach. By having a global view of the application, it can reason about the **architectural context**:

* identify an aggregate based on its actual usage,
* recognize a business identifier by its role in the ports,
* determine the direction of a port based on its position within the architecture.

Generation thus becomes **contextual and architectural**, rather than merely syntactic.


<hr class="hr-text" data-content="Clarification">

## What HexaGlue Is Not

HexaGlue is:

* neither an application framework,  
* nor a runtime dependency,  
* nor an ORM,  
* nor a replacement for Spring, JPA, or Hibernate.

## What HexaGlue Is

HexaGlue is, above all, an **analysis and generation library**, designed to operate **at build time**, not at runtime.

As such, it can be integrated:

* into an **IDE**, to assist with analysis or generation,  
* into **CI/CD** tools or static analysis pipelines,  
* or as a **build plugin**.

Today, HexaGlue is integrated as a **Maven plugin**: during compilation, it analyzes the application and generates infrastructure code in `target/generated-sources/`, without ever affecting the business code.


<hr class="hr-text" data-content="Extensibility">

## A Plugin-Oriented Approach, Not a Framework

The code generation produced by HexaGlue does not depend on any specific application framework.

Technologies like Spring, REST, Kafka, MongoDB, or GraphQL are supported through **dedicated plugins**, responsible for translating the architectural model into a given technical implementation.

Each plugin:

* relies on the application’s architectural model,  
* applies rules specific to its technology,  
* generates the corresponding infrastructure code,  
* without ever modifying or contaminating the domain.

This separation allows for:

* a **stable and preserved** domain,  
* **durable** ports,  
* **replaceable and evolvable** infrastructure.

> info ""
> Switching technology stacks comes down to regenerating the infrastructure from another plugin—in **seconds**, rather than over several days.


<hr class="hr-text" data-content="Heuristics">

## Convention Over Configuration, Without Dogmatism

HexaGlue does not impose:

* any specific DSL,  
* mandatory annotations,  
* or opaque conventions.

Concepts are discovered through **heuristics**:

* package structure,  
* naming conventions,  
* relationships between types,  
* port signatures.

Existing annotations (DDD, architecture) can enrich the analysis, but are never required.


<hr class="hr-text" data-content="Maturity">

## Why Now?

Because the context has changed:

* hexagonal architectures are well understood,  
* patterns have stabilized,  
* technical stacks are multiplying,  
* and the real cost of infrastructure is becoming visible.

> warning ""
> Manually writing REST controllers, JPA adapters, or mechanical mappers is no longer a technical choice: it’s a **lack of automation**.


<hr class="hr-text" data-content="Project Status">

## HexaGlue Today

HexaGlue is under active development—and openly so.

It is already:

* functional,  
* extensible,  
* documented,  
* built around a relatively stable SPI,  
* designed to support internal or third-party plugins.

HexaGlue is not just another framework. It is a **library for generating infrastructure**, designed to adapt to the standards, conventions, and constraints of companies and teams.


<hr class="hr-text" data-content="Vision">

## What Now?

HexaGlue is not a silver bullet. It’s a **direction**.

An attempt to answer a simple, yet rarely asked question:

> note ""
> ***Why do we still accept writing by hand***<br>
> ***what the compiler could generate for us?***

If this question resonates with you:

* explore the project,
* test it,
* critique it,
* propose plugins,
* challenge the vision.

Infrastructure won’t disappear.  
But it can become **far less invasive**.

HexaGlue is exploring that future:

{% github_card hexaglue/hexaglue %}

### TL;DR

> info ""
> **Focus on business code,**<br>
> **not infrastructure glue.**
