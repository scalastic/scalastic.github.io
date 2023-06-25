---
layout: post
title: "SDKMAN: Install Multiple JDK Versions and Much More!"
date: 2021-03-16 11:44:00 +2
description: Learn to install and use several versions of Java with SDKMAN. Walkthrough for macOS, Windows and Linux.
img: sdkman-post.jpg
fig-caption: Photo by <a href="https://unsplash.com/@vikramstudio46?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">vikram sundaramoorthy</a> on <a href="https://unsplash.com/s/photos/superman?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [SDKMAN, Java, JDK, GraalVM, macOS, Tool]
lang: en
permalink: /installer-java-sdkman/
---

When a new stable version of macOS becomes available, there are times when I decide to perform a clean reinstall of my 
computer. After this process, it becomes necessary to reinstall all the essential tools for my work, which can be quite 
tedious.

In this context, SDKMAN comes into play as a highly practical utility that goes beyond simply managing multiple versions
of JDKs on your computer.

<hr class="hr-text" data-content="Summary">

* TOC
{:toc}

<hr class="hr-text" data-content="SDKMAN!">

## An Essential Tool: SDKMAN

SDKMAN, short for "Software Development Kit Manager," is an invaluable tool for Java developers who wish to effectively 
manage JDK (Java Development Kit) versions. It greatly simplifies the management of different JDK versions, providing 
straightforward control over your Java development environment.

The advantages of SDKMAN for JDK version management include:

1. **Easy Installation**: SDKMAN streamlines the JDK installation process by automating it. No more searching for 
downloads or dealing with tedious manual configurations and installations. With just a few simple commands, SDKMAN takes
care of everything.

2. **Version Management**: With SDKMAN, you can install multiple JDK versions simultaneously on your system. This allows
you to easily switch between different versions based on your project requirements.

3. **Flexibility and Adaptability**: SDKMAN offers a wide range of JDK versions, including both stable releases and the 
latest development versions. You can choose the version that best suits your project, considering specific features or 
compatibility requirements.

4. **Simplified Updates**: SDKMAN makes updating your JDK a breeze. The tool notifies you about new available versions 
and enables quick and hassle-free installations.

5. **Cross-Platform Compatibility**: Whether you're working on macOS, Windows, or Linux, SDKMAN adapts to your 
environment. It ensures a consistent and seamless experience, regardless of the operating system you're using.

In summary, SDKMAN is a powerful and essential tool for Java developers. It simplifies JDK version management, keeping 
you up-to-date with the latest features and preventing compatibility issues. Whether you're a seasoned developer or just
starting out, SDKMAN gives you full control over your Java development environment, allowing you to work efficiently and
without hassle.

<hr class="hr-text" data-content="Installation">

## SDKMAN Installation

To take advantage of the benefits offered by SDKMAN, it is essential to install it correctly on your system. Here are 
the detailed instructions for installing SDKMAN on macOS, Windows, and Linux:

### Installation on macOS and Linux:

1. Open your terminal.

2. Execute the following command to download the SDKMAN installation script:
   {% highlight shell %}curl -s "https://get.sdkman.io" | bash{% endhighlight %}

3. Wait for the script to be downloaded and installed.

4. After installation, execute the following command to load SDKMAN into your current session:
   {% highlight shell %}source "$HOME/.sdkman/bin/sdkman-init.sh"{% endhighlight %}

5. To verify if SDKMAN has been successfully installed, type the following command:
   {% highlight shell %}sdk version{% endhighlight %}

### Installation on Windows:

1. Go to the official SDKMAN website at the following address: [https://sdkman.io/install](https://sdkman.io/install){:target="_blank" rel="noopener noreferrer nofollow"}.

2. On Windows, a Bash terminal is required. Depending on your case, copy the installation command provided on the website.

3. Open your command prompt.

4. Paste the command into your command prompt and press Enter to execute it.

5. Wait for the installation to complete.

6. Once the installation is finished, close and reopen your command prompt.

7. To verify if SDKMAN has been successfully installed, type the

following command:
    {% highlight bat %}sdk version{% endhighlight %}

Congratulations! You have now installed SDKMAN on your system. You are ready to enjoy its powerful features for JDK version management.

> info "Note"
> All SDK installations will now be done in the `~/.sdkman` directory.

<hr class="hr-text" data-content="JDK">

## JDK Installation

Once you have successfully installed SDKMAN, you can proceed with the installation of a specific JDK using this tool.

Take a moment to think about it, and let's explore some SDKMAN commands.

### Candidate vs Version

As the name suggests, SDKMAN allows you to install SDKs, and Java is just one of the potential `candidate`'s.

So, first, you need to choose the SDK (candidate) to install.

#### Candidate

To see the list of available SDK/candidates, use the following command:
{% highlight zsh %}% sdk list {% endhighlight %}

> info "Note"
> Type `q` to exit the list.

You can see that there are many things you can install. Just to name a few:
- Gradle
- Groovy
- Java
- Maven
- Micronaut
- SBT
- Scala
- Spring Boot
- Tomcat
- VisualVM

#### Version

Now, let's focus on the candidate we're interested in: `Java`. Let's see the versions that SDKMAN offers us.

To do that, let's query SDKMAN:
{% highlight zsh %}% sdk list java{% endhighlight %}

Here is the list I obtained:

{% highlight output %}
================================================================================
Available Java Versions
================================================================================
 Vendor        | Use | Version      | Dist    | Status     | Identifier
--------------------------------------------------------------------------------
 AdoptOpenJDK  |     | 15.0.2.j9    | adpt    |            | 15.0.2.j9-adpt      
               |     | 15.0.2.hs    | adpt    |            | 15.0.2.hs-adpt      
               |     | 11.0.10.j9   | adpt    |            | 11.0.10.j9-adpt     
               |     | 11.0.10.hs   | adpt    |            | 11.0.10.hs-adpt     
               |     | 8.0.282.j9   | adpt    |            | 8.0.282.j9-adpt     
               |     | 8.0.282.hs   | adpt    |            | 8.0.282.hs-adpt     
 Amazon        |     | 15.0.2.7.1   | amzn    |            | 15.0.2.7.1-amzn     
               |     | 11.0.10.9.1  | amzn    |            | 11.0.10.9.1-amzn    
               |     | 8.282.08.1   | amzn    |            | 8.282.08.1-amzn     
 Azul Zulu     |     | 15.0.2       | zulu    |            | 15.0.2-zulu         
               |     | 15.0.2.fx    | zulu    |            | 15.0.2.fx-zulu      
               |     | 11.0.10      | zulu    |            | 11.0.10-zulu        
               |     | 11.0.10.fx   | zulu    |            | 11.0.10.fx-zulu     
               |     | 8.0.282      | zulu    |            | 8.0.282-zulu        
               |     | 8.0.282.fx   | zulu    |            | 8.0.282.fx-zulu     
 BellSoft      |     | 15.0.2.fx    | librca  |            | 15.0.2.fx-librca    
               |     | 15.0.2       | librca  |            | 15.0.2-librca       
               |     | 11.0.10.fx   | librca  |            | 11.0.10.fx-librca   
               |     | 11.0.10      | librca  |            | 11.0.10-librca      
               |     | 8.0.282.fx   | librca  |            | 8.0.282.fx-librca   
               |     | 8.0.282      | librca  |            | 8.0.282-librca      
 GraalVM       |     | 21.0.0.2.r11 | grl     |            | 21.0.0.2.r11-grl    
               |     | 21.0.0.2.r8  | grl     |            | 21.0.0.2.r8-grl     
               |     | 20.3.1.2.r11 | grl     |            | 20.3.1.2.r11-grl    
               |     | 20.3.1.2.r8  | grl     |            | 20.3.1.2.r8-grl     
               |     | 19.3.5.r11   | grl     |            | 19.3.5.r11-grl      
               |     | 19.3.5.r8    | grl     |            | 19.3.5.r8-grl       
 Java.net      |     | 17.ea.13     | open    |            | 17.ea.13-open       
               |     | 17.ea.4.lm   | open    |            | 17.ea.4.lm-open     
               |     | 17.ea.2.pma  | open    |            | 17.ea.2.pma-open    
               |     | 17.ea.2.lm   | open    |            | 17.ea.2.lm-open     
               |     | 16.ea.36     | open    |            | 16.ea.36-open       
               |     | 15.0.2       | open    |            | 15.0.2-open         
               |     | 11.0.2       | open    |            | 11.0.2-open         
 SAP           |     | 15.0.2       | sapmchn |            | 15.0.2-sapmchn      
               |     | 11.0.10      | sapmchn |            | 11.0.10-sapmchn     
 TravaOpenJDK  |     | 11.0.9       | trava   |            | 11.0.9-trava        
               |     | 8.0.232      | trava   |            | 8.0.232-trava       
================================================================================
{% endhighlight %}

### Actual installation of the JDK

Place your bets ... me, it's done! As I am working on the build of Java code in native code at the moment, I choose `GraalVM` in version `11` and I select its identifier `21.0.0.2.r11-grl`. It's your turn.

To install it, I run the command:

{% highlight zsh %} % sdk install java 21.0.0.2.r11-grl{% endhighlight %}

Which gives me the output, the installation process

{% highlight output %}
Downloading: java 21.0.0.2.r11-grl

In progress...

################################################################ 100,0%
################################################################ 100,0%

Repackaging Java 21.0.0.2.r11-grl...

Done repackaging...
Cleaning up residual files...

Installing: java 21.0.0.2.r11-grl
Done installing!

Setting java 21.0.0.2.r11-grl as default.
{% endhighlight %}

Done! No, not yet ... I need more JDKs for comparison. Moreover, this is why we installed this tool.

For my part, I install two others:

{% highlight zsh %}
% sdk install java 11.0.10.j9-adpt
% sdk install java 11.0.2-open
{% endhighlight %}

<hr class="hr-text" data-content="JDK Selection">

## JDK Selection

Let's now see how to select a specific version of Java.


### Displaying the Current Version

Let's see what the `sdk` command tells us:

{% highlight zsh %}
% sdk current java
Using java version 21.0.0.2.r11-grl
{% endhighlight %}

And let's see what `java` tells us:

{% highlight zsh %}
% java --version               
openjdk 11.0.10 2021-01-19
OpenJDK Runtime Environment GraalVM CE 21.0.0.2 (build 11.0.10+8-jvmci-21.0-b06)
OpenJDK 64-Bit Server VM GraalVM CE 21.0.0.2 (build 11.0.10+8-jvmci-21.0-b06, mixed mode, sharing)
{% endhighlight %}


### Displaying Installed Versions

{% highlight output %}
% sdk list java
================================================================================
Available Java Versions
================================================================================
 Vendor        | Use | Version      | Dist    | Status     | Identifier
--------------------------------------------------------------------------------
 AdoptOpenJDK  |     | 15.0.2.j9    | adpt    |            | 15.0.2.j9-adpt      
               |     | 15.0.2.hs    | adpt    |            | 15.0.2.hs-adpt      
               |     | 11.0.10.j9   | adpt    | installed  | 11.0.10.j9-adpt     
               |     | 11.0.10.hs   | adpt    |            | 11.0.10.hs-adpt     
               |     | 8.0.282.j9   | adpt    |            | 8.0.282.j9-adpt     
               |     | 8.0.282.hs   | adpt    |            | 8.0.282.hs-adpt     
 Amazon        |     | 15.0.2.7.1   | amzn    |            | 15.0.2.7.1-amzn     
               |     | 11.0.10.9.1  | amzn    |            | 11.0.10.9.1-amzn    
               |     | 8.282.08.1   | amzn    |            | 8.282.08.1-amzn     
 Azul Zulu     |     | 15.0.2       | zulu    |            | 15.0.2-zulu         
               |     | 15.0.2.fx    | zulu    |            | 15.0.2.fx-zulu      
               |     | 11.0.10      | zulu    |            | 11.0.10-zulu        
               |     | 11.0.10.fx   | zulu    |            | 11.0.10.fx-zulu     
               |     | 8.0.282      | zulu    |            | 8.0.282-zulu        
               |     | 8.0.282.fx   | zulu    |            | 8.0.282.fx-zulu     
 BellSoft      |     | 15.0.2.fx    | librca  |            | 15.0.2.fx-librca    
               |     | 15.0.2       | librca  |            | 15.0.2-librca       
               |     | 11.0.10.fx   | librca  |            | 11.0.10.fx-librca   
               |     | 11.0.10      | librca  |            | 11.0.10-librca      
               |     | 8.0.282.fx   | librca  |            | 8.0.282.fx-librca   
               |     | 8.0.282      | librca  |            | 8.0.282-librca      
 GraalVM       | >>> | 21.0.0.2.r11 | grl     | installed  | 21.0.0.2.r11-grl    
               |     | 21.0.0.2.r8  | grl     |            | 21.0.0.2.r8-grl     
               |     | 20.3.1.2.r11 | grl     |            | 20.3.1.2.r11-grl    
               |     | 20.3.1.2.r8  | grl     |            | 20.3.1.2.r8-grl     
               |     | 19.3.5.r11   | grl     |            | 19.3.5.r11-grl      
               |     | 19.3.5.r8    | grl     |            | 19.3.5.r8-grl       
 Java.net      |     | 17.ea.13     | open    |            | 17.ea.13-open       
               |     | 17.ea.4.lm   | open    |            | 17.ea.4.lm-open     
               |     | 17.ea.2.pma  | open    |            | 17.ea.2.pma-open    
               |     | 17.ea.2.lm   | open    |            | 17.ea.2.lm-open     
               |     | 16.ea.36     | open    |            | 16.ea.36-open       
               |     | 15.0.2       | open    |            | 15.0.2-open         
               |     | 11.0.2       | open    | installed  | 11.0.2-open         
 SAP           |     | 15.0.2       | sapmchn |            | 15.0.2-sapmchn      
               |     | 11.0.10      | sapmchn |            | 11.0.10-sapmchn     
 TravaOpenJDK  |     | 11.0.9       | trava   |            | 11.0.9-trava        
               |     | 8.0.232      | trava   |            | 8.0.232-trava       
================================================================================
Use the Identifier for installation:

    $ sdk install java 11.0.3.hs-adpt
================================================================================
{% endhighlight %}

### Switching Versions

{% highlight zsh %}
% sdk use java 11.0.10.j9-adpt
Using java version 11.0.10.j9-adpt in this shell.
{% endhighlight %}

Let's verify with Java:

{% highlight zsh %}
% java --version
openjdk 11.0.10 2021-01-19
OpenJDK Runtime Environment AdoptOpenJDK (build 11.0.10+9)
Eclipse OpenJ9 VM AdoptOpenJDK (build openj9-0.24.0, JRE 11 Mac OS X amd64-64-Bit Compressed References 20210120_897 (JIT enabled, AOT enabled)
OpenJ9   - 345e1b09e
OMR      - 741e94ea8
JCL      - 0a86953833 based on jdk-11.0.10+9)
{% endhighlight %}

And there you have it...

<hr class="hr-text" data-content="Conclusion">

## Taking It Further

You can find additional useful commands at this address: [https://sdkman.io/usage](https://sdkman.io/usage){:target="_blank" rel="noopener noreferrer nofollow"}, 
including the `env` command: [https://sdkman.io/usage#env](https://sdkman.io/usage#env){:target="_blank" rel="noopener noreferrer nofollow"}.

Now it's your turn to explore further.

Cheers...
