---
layout: post
title: GraalVM, the future of microservices applications in Java
date: 2021-03-14 12:53:00 +0200
description: JVM boot time and memory consumption do not make Java the ideal candidate for developing microservices. But GraalVM could be a game-changer ... Let's see how.
img: graalvm-brand-new-containers.jpg
fig-caption: Photo by <a href="https://unsplash.com/@ant0ine?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Antoine Petitteville</a> on <a href="https://unsplash.com/s/photos/containers?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [Java, GraalVM, Microservices]
lang: en
permalink: /graalvm-microservices-java/
---

This article is the second in a series discussing the concepts introduced in GraalVM and how they are game-changing for using Java as a programming language in microservice architectures.

<hr class = "hr-text" data-content = "Content">

* TOC
{:toc}

<hr class="hr-text" data-content="A new VM">

## GraalVM, a new generation of virtual machine

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/graalvm-ecosystem.png --alt The GraalVM ecosystem %}
  <figcaption>The GraalVM ecosystem</figcaption>
</figure>

### What is that ?

* **GraalVM** is a Virtual Machine (VM), Open Source, resulting from a research project at Oracle Labs.
* It is maintained by a community of major Internet players (Oracle, Amazon, Twitter, RedHat in particular with Quarkus, VMWare for the integration of its Spring framework, ...).

* It is a **new generation** of VM, **polyglot**, that is to say that it supports many languages, even those which do not generate bytecode. Eventually, it could replace the current VM HotSpot.

* More details at [https://www.graalvm.org/](https://www.graalvm.org/){:target="_blank" rel="noopener noreferrer nofollow"}

> info "In a few words"
> The **GraalVM** VM is coupled to a new compiler, `Graal`, written entirely in Java (which allows cyclic compilation):
> * It aims to replace the `C2` compiler used for the **JIT** of the **HotSpot** VM and which has reached the end of its life because it is too complex to upgrade (mix of assembler, C, Java )
> * The Grail compiler can also do `AOT` compilation (Ahead-Of-Time, in advance) also called advance compilation.

<hr class="hr-text" data-content="Architecture">

### The architecture of GraalVM

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/graalvm-components.jpg --alt The components of GraalVM %}
  <figcaption>The components of GraalVM</figcaption>
</figure>


#### 1. The Grail compiler

* It compiles in Bytecode languages for JVM.
* Integrated into the JVM, it is able to do JIT compilation.
* It can also do AOT compilation.

#### 2. The Truffle framework

* It allows to describe, in the form of an Abstract Syntax Tree (**AST** or Syntax Tree), the grammar of languages unknown to the JVM.
* The Graal compiler, using the Truffle modules of each language, is able to interact with them.
* The **Polyglot** API, written in Java, allows messages to be passed from Java to other languages and to interact with them.

> note "Example of Truffle modules"
> * `Graal.js` defines the AST of JavaScript.
> * `Sulong` implements the AST of the LLVM bitcode (C, C++, Rust, Objective-C, Fortran, Mono, ...)
> * Other modules being implemented:
>   * `WebAssembly` (for web applications),
>   * `CUDA` (for NVidia graphics cards), ...

#### 3. The Virtual Machine

Two JVMs can be integrated into GraalVM as a Virtual Machine:
* By default, it is the **JVM HotSpot** which executes the bytecode of Java programs. But it is the **Graal** compiler which intervenes in the **JIT** compilation.
* You can also install the **SubstrateVM** virtual machine, included in the **nativeimage** module. It is this minimalist VM that offers the **AOT** compilation.

#### 4. Runtimes

* They allow you to run languages other than those supported by the JVMs (the HotSpot JVM like the SubstrateVM).
* The `node.js` (ECMAScript compliant) and `llvm` runtimes are part of the standard installation.
* The other runtimes must be explicitly installed: the Python 3.7 interpreter, that of Ruby 2.6.5 or even of GNU R 3.6.1.

<hr class="hr-text" data-content="Summary">

> info "The components of GraalVM:"
>
> 1. ***Core*** components:
>
> * the JVM GraalVM,
> * the Grail compiler,
> * an LLVM runtime,
> * a JavaScript runtime that supports Node.js
>
> 1. Optional ***runtimes***:
>
> * Native Image which integrates the ahead-of-time (AOT) compiler
> * LLVM toolchain
> * Python interpreter
> * Ruby interpreter
> * R interpreter
> * WebAssembly interpreter (Wasm)

<hr class="hr-text" data-content="Conclusion">

## So what ?

We are now entitled to wonder, how this is a game-changer for Java and microservices.

Of course, we had to go through this theoretical presentation but already, we can understand the full potential of such an overhaul:
* A new, more efficient compiler,
* The ability to compile your application directly in native code,
* The ability to integrate multiple languages into its Java application, ...

It remains to be seen in practice the result. This is what we will do in the next article.

{{ "/java-microservices/|Java and microservices|/spring-natif-graalvm/|Compile a Spring application natively with GraalVM" | pagination: site.data.i18n.article-previous, site.data.i18n.article-next }}

Cheers ...
