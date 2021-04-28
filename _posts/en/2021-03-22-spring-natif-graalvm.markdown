---
layout: post
title: Compile a Spring application natively with GraalVM
date: 2021-03-22 01:10:00 +2
description: Tutorial to compile a ✨Spring✨ application in native code with ✨GraalVM✨ - Details with explanations at each step.
img: spring-native-graalvm-post.jpg
fig-caption: Photo by <a href="https://unsplash.com/@helloimnik?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Hello I'm Nik 🪴</a> on <a href="https://unsplash.com/s/photos/rocket?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [Spring-Native, GraalVM, Spring, Docker, Tutorial]
lang: en
permalink: /spring-natif-graalvm/
---

With the release this week of Spring Native Beta in version 0.9.0, it is interesting to take stock of the compilation of `Spring` applications into native executables using` GraalVM` and its `native mode. -image`.

The execution of an application in native code has, indeed, many advantages compared to that in Bytecode in a JVM:
- The start is instantaneous
- The performance is optimal from the start
- Memory consumption is greatly reduced

The version of Spring Native is, however, in Beta which means that not all Spring components are still functional in native mode. Let's see how it works in detail.

<hr class="hr-text" data-content="Plan">

* TOC
{:toc}

<hr class="hr-text" data-content="Installation">

## Basic system requirements

First, you will need to install [GraalVM](https://www.graalvm.org/){:target="_blank" rel="noopener noreferrer nofollow"} and then its native code compiler `native-image` :

- For MacOS and Linux, it is recommended to install its JDKs with [SDKMAN](https://sdkman.io/){:target="_blank" rel="noopener noreferrer nofollow"}. Nothing complicated: refer to [doc. official](https://sdkman.io/install) {: target = "_blank" rel = "noopener noreferrer nofollow"} or find a previous article on this tool 👍 [SDKMAN! or how to simply manage different versions of an SDK](/sdkman-or-how-to-simply-manage-different-versions-of-SDK/)

- For our friends on Windows, refer directly to the [Installation on Windows Platforms](https://www.graalvm.org/docs/getting-started/windows/){:target="_blank" rel="noopener noreferrer nofollow"}

<hr class="hr-text" data-content="Skeleton">

## Generation of the application skeleton

The arrival of the Beta version implies that Spring Native is now supported by [Spring Initializr](https://start.spring.io){:target="_blank" rel="noopener noreferrer nofollow"}, a web interface that allows you to compose your Spring application and then generate its skeleton.

Let's use it to define our demo app:
- Fill in the project metadata
- Select the `Spring Native [Experimental]` dependency to benefit from native compilation
- Add the `Spring Web` dependency as part of this demo
- Download the generated code by clicking on the `Generate` button

{% figure caption:"Spring Initializr interface for demo application" class:"article" %}
![Ecran Spring Initializr pour la démo]({{site.baseurl}}/assets/img/spring-initializr-demo.jpg)
{% endfigure %}

### Spring Native Modules

You will find, in the POM, the list of Spring modules configured as Maven dependencies:

- The `Spring Native` dependency and its version:

{% highlight maven %}
<properties>
<java.version>11</java.version>
<spring-native.version>0.9.1-SNAPSHOT</spring-native.version>
</properties>
.../...
<dependency>
  <groupId>org.springframework.experimental</groupId>
  <artifactId>spring-native</artifactId>
  <version>${spring-native.version}</version>
</dependency>
{% endhighlight %}

- The `Spring Boot Maven` plugin and its configuration to run the build of a native image in a [Buildpacks](https://buildpacks.io){:target="_blank" rel="noopener noreferrer nofollow"} :

{% highlight maven %}
<plugin>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-maven-plugin</artifactId>
	<configuration>
	  <image>
	    <builder>paketobuildpacks/builder:tiny</builder>
	    <env>
	      <BP_NATIVE_IMAGE>true</BP_NATIVE_IMAGE>
	    </env>
	  </image>
	</configuration>
</plugin>
{% endhighlight %}

- The `AOT Maven` plugin which is used to configure Spring for its `Ahead-Of-Time` compilation as well as to generate code for the configuration and the classpath of the application:

{% highlight maven %}
<plugin>
  <groupId>org.springframework.experimental</groupId>
  <artifactId>spring-aot-maven-plugin</artifactId>
  <version>${spring-native.version}</version>
  <executions>
    <execution>
      <id>test-generate</id>
      <goals>
        <goal>test-generate</goal>
      </goals>
    </execution>
    <execution>
      <id>generate</id>
      <goals>
        <goal>generate</goal>
      </goals>
    </execution>
  </executions>
</plugin>
{% endhighlight %}

### Remarks

> warning "Dependencies not supported"
> In case you select a Spring dependency not yet supported in native mode, the `HELP.md` file will contain a warning:

{% figure caption:"Warning in HELP.md file" class:"article" %}
![Spring warning in HELP.md]({{site.baseurl}}/assets/img/spring-initializr-help.jpg)
{% endfigure %}


> info "Supported dependencies"
> - In the case of dependencies supported by Spring, the initializr will configure all the plugins necessary for the build and execution of the Spring application to work ***out-of-the-box***!

 In the example of `Spring Data JPA`, Maven will be configured so that the Hibernate classes are compiled when the application is built and not during its runtime as is the case for a JVM:

{% highlight maven %}
<plugin>
  <groupId>org.hibernate.orm.tooling</groupId>
  <artifactId>hibernate-enhance-maven-plugin</artifactId>
  <version>${hibernate.version}</version>
  <executions>
    <execution>
      <id>enhance</id>
      <goals>
        <goal>enhance</goal>
      </goals>
      <configuration>
        <failOnError>true</failOnError>
        <enableLazyInitialization>true</enableLazyInitialization>
        <enableDirtyTracking>true</enableDirtyTracking>
        <enableAssociationManagement>true</enableAssociationManagement>
        <enableExtendedEnhancement>false</enableExtendedEnhancement>
      </configuration>
    </execution>
  </executions>
</plugin>
{% endhighlight %}


All of this is very reassuring! I had previously tested version `0.7.1` of Spring Native (named spring-graalvm-native at the time) and there were a lot of manual changes to be made.

> note "Posted goal of the team in charge of Spring Native"
> - Provide **configuration automatically** so that there is no need to modify the Java code, whether the application is running in native mode or in a JVM.
> - Make the **unit tests** run in the same way in a native image or in a JVM.
> - Further reduce the size of the native image generated in the next version 0.10 of Spring Native.

<hr class="hr-text" data-content="Demo implementation">

## Adding a Web Controller

- Unzip the file generated by `Spring Initializr` and open the directory with your preferred IDE.

- Create a new Controller at the root of your project's package with the code below:

{% highlight java linedivs %}
package io.scalastic.demo.demo_spring_native;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DemoSpringNativeController {

    @GetMapping("/")
    public String hello() {
        return "Hello!";
    }

}
{% endhighlight %}

{% figure caption:"The project and its Controller in IntelliJ IDEA" class:"article" %}
![IntelliJ IDEA demo project]({{site.baseurl}}/assets/img/spring-initializr-demo-intellij.png)
{% endfigure %}

<hr class="hr-text" data-content="Compilation">

## Compilation in native code

There are two ways to compile a Spring application to native code:
- By using the [Buildpack Spring Boot](https://github.com/paketo-buildpacks/spring-boot){:target="_blank" rel="noopener noreferrer nofollow"} integrated in Spring and which will produce a container lightweight containing the native code of the application
- Using the Maven plugin [native-image-maven-plugin](https://www.graalvm.org/reference-manual/native-image/NativeImageMavenPlugin/){:target="_blank" rel="noopener noreferrer nofollow"} which will produce a native executable


> warning "Note"
> The Maven configuration generated by Spring Initializr chooses Buildpacks:
> - We will therefore only discuss this aspect in this article.
> - We will see the native build using the Maven **native-image** plugin which requires significant POM modifications, in a future article.

### Using the Spring Boot Buildpack

This procedure obtains a Docker container that contains the application compiled in native code. It is lightweight and can be deployed directly into a container orchestrator.

#### Prerequisites

[Docker](https://www.docker.com){:target="_blank" rel="noopener noreferrer nofollow"} must be installed in order to be able to launch the **Buildpack Spring Boot**. It's a container that contains everything you need to build a Spring application in native code.

- You can install **Docker** from [Docker Installation](https://docs.docker.com/installation/#installation){:target="_blank" rel="noopener noreferrer nofollow"}
- For MacOS, it is recommended to allocate at least **8GB** of memory to Docker
- For Windows, you must activate [Docker WSL 2 Backend](https://docs.docker.com/docker-for-windows/wsl/){:target="_blank" rel="noopener noreferrer nofollow"} to have better their performances


#### Compiling in native mode with Buildpacks

- The native application can be compiled by running the following command:

{% highlight zsh %}
% mvn spring-boot:build-image
[INFO] Scanning for projects...
[INFO] 
[INFO] ----------------< io.scalastic.demo:demo_spring_native >----------------
[INFO] Building demo_spring_native 0.0.1-SNAPSHOT
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] >>> spring-boot-maven-plugin:2.4.4:build-image (default-cli) > package @ demo_spring_native >>>
[INFO] 
[INFO] --- maven-resources-plugin:3.2.0:resources (default-resources) @ demo_spring_native ---

[.../...]

[INFO] Successfully built image 'docker.io/library/demo_spring_native:0.0.1-SNAPSHOT'
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  03:03 min
[INFO] Finished at: 2021-03-21T20:57:29+01:00
[INFO] ------------------------------------------------------------------------

Process finished with exit code 0
{% endhighlight %}

  This command will create, locally, a Linux container to compile the native application from the GraalVM `native-image` compiler.

- Let's look at the images present, in the local Docker registry and which have just been implemented in this build:

{% highlight zsh %}
% docker images
REPOSITORY                 TAG              IMAGE ID       CREATED        SIZE
paketobuildpacks/run       tiny-cnb         e85a0fe734d7   17 hours ago   17.3MB
paketobuildpacks/builder   tiny             1cbb20e3de7e   41 years ago   401MB
demo_spring_native         0.0.1-SNAPSHOT   a423116a12a8   41 years ago   81.9MB
{% endhighlight %}

We can see that this process produces 3 Docker images:
- **paketobuildpacks/run:tiny-cnb**: The `distroless` bionic + glibc + openssl + CA certs based `runner` to run an application in native code. It is the basic container used to encapsulate an application in native code.
- **paketobuildpacks/builder:tiny**: The `builder` based on an ubuntu `distroless` stack: bionic + openssl + CA certs + compilers + shell utilities. It is a Buildpack used to compile most applications in Go and Java applications in native code with GraalVM.
- **demo_spring_native:0.0.1-SNAPSHOT**: The native code application encapsulated in a basic `distroless` runner.

> note "To go further"
> - The images from the Buildpack date from 1980, January 1, 1980 exactly! This is quite intended and the explanation can be found here: [Time Travel with Pack](https://medium.com/buildpacks/time-travel-with-pack-e0efd8bf05db){:target="_blank" rel="noopener noreferrer nofollow"}
> - The [Distroless](https://github.com/GoogleContainerTools/distroless){:target="_blank" rel="noopener noreferrer nofollow"} stacks are minimalist images, developed by Google and which improve security and container size by reducing the area of ​​attacks and the number of components they integrate.
> - The notion of [Runner and Builder](https://paketo.io/docs/stacks/#what-is-a-stack){:target="_blank" rel="noopener noreferrer nofollow"} in the Buildpacks .

#### Running the application

- To start the application from the Buildpack, type the following command:

{% highlight zsh %}
% docker run -p 8080:8080 docker.io/library/demo_spring_native:0.0.1-SNAPSHOT
2021-03-21 19:32:54.188  INFO 1 --- [           main] o.s.nativex.NativeListener               : This application is bootstrapped with code generated with Spring AOT

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v2.4.4)

2021-03-21 19:32:54.190  INFO 1 --- [           main] i.s.d.d.DemoSpringNativeApplication      : Starting DemoSpringNativeApplication using Java 11.0.10 on 91a2f0962a8e with PID 1 (/workspace/io.scalastic.demo.demo_spring_native.DemoSpringNativeApplication started by cnb in /workspace)
2021-03-21 19:32:54.190  INFO 1 --- [           main] i.s.d.d.DemoSpringNativeApplication      : No active profile set, falling back to default profiles: default
2021-03-21 19:32:54.218  INFO 1 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)
Mar 21, 2021 7:32:54 PM org.apache.coyote.AbstractProtocol init
INFO: Initializing ProtocolHandler ["http-nio-8080"]
Mar 21, 2021 7:32:54 PM org.apache.catalina.core.StandardService startInternal
INFO: Starting service [Tomcat]
Mar 21, 2021 7:32:54 PM org.apache.catalina.core.StandardEngine startInternal
INFO: Starting Servlet engine: [Apache Tomcat/9.0.44]
Mar 21, 2021 7:32:54 PM org.apache.catalina.core.ApplicationContext log
INFO: Initializing Spring embedded WebApplicationContext
2021-03-21 19:32:54.220  INFO 1 --- [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 29 ms
2021-03-21 19:32:54.231  INFO 1 --- [           main] o.s.s.concurrent.ThreadPoolTaskExecutor  : Initializing ExecutorService 'applicationTaskExecutor'
Mar 21, 2021 7:32:54 PM org.apache.coyote.AbstractProtocol start
INFO: Starting ProtocolHandler ["http-nio-8080"]
2021-03-21 19:32:54.240  INFO 1 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
2021-03-21 19:32:54.241  INFO 1 --- [           main] i.s.d.d.DemoSpringNativeApplication      : Started DemoSpringNativeApplication in 0.057 seconds (JVM running for 0.06)
{% endhighlight %}

- Test its operation with:

{% highlight zsh %}
% curl http://127.0.0.1:8080
Hello!
{% endhighlight %}

It works! Magnificent!!

> info "Buildpacks characteristics"
> - The compilation lasts 3 min (with Docker images and Maven artifacts locally)
> - The application starts in 0.06 s
> - The Docker image containing the Spring application and the OS, is 82 MB in size

<hr class="hr-text" data-content="Conclusion">

## Conclusion

- The **Spring Native 0.9.0** version allowed us to easily compile a Spring application in native mode.
- As expected, the benefits of native mode are instant startup and greatly reduced container size.

Interesting points, this generates new uses:
- **High Availability** management can be done with a single instance, the start of a second being instantaneous.
- instant start also allows a web application to be serverless, without needing to be redeveloped.
- With Knative (a Kubernetes redesign that starts serverless containers), GraalVM Native is a very well suited solution.

Spring Native will eventually be integrated into **Spring Boot 3** and **Spring Framework 6**, the goal being to specify only in the Maven or Graddle build, the expected target (native or other). The remaining work consists of optimizing the size of the native code generated, taking into account more Spring APIs and improving the execution of the tests in the native image (JUnit 5, ...)

To be followed closely then!

{{ "/graalvm-microservices-java/|GraalVM, the future of microservices applications in Java||" | pagination: site.data.i18n.article-previous, site.data.i18n.article-next }}

Cheers ...

> info "And now"
> * Did you like this article? Say it below so that the blog gains visibility.
> * Do you have a question? Leave it in comment, I will do my best to answer it as soon as possible !!
>
> Thanks to you!
>
