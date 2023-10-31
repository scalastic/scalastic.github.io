---
layout: post
title: "SDKMAN: Install Multiple JDK Versions and Much More!"
date: 2023-10-10 20:57:00 +2
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

It is in this context that SDKMAN comes into play as an extremely practical utility that goes far beyond the mere 
management of JDKs on your computer.

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

4. After installation:
   - Load a new terminal session
   - Or execute the following command to load SDKMAN into your current session:
     {% highlight shell %}source "$HOME/.sdkman/bin/sdkman-init.sh"{% endhighlight %}

5. To verify if SDKMAN has been successfully installed, type the following command:
   {% highlight shell %}sdk version{% endhighlight %}

6. You should see:

{% highlight shell %}
SDKMAN!
script: 5.18.2
native: 0.4.2
{% endhighlight %}

### Installation on Windows:

1. On Windows, it's necessary to have a Bash terminal. The easiest way is to install Windows Subsystem for Linux 2 (WSL2).

2. To do this, follow the instructions provided on the Microsoft website [https://learn.microsoft.com/en-us/windows/wsl/install](https://learn.microsoft.com/en-us/windows/wsl/install){:target="_blank" rel="noopener noreferrer nofollow"}.

3. Once installed, proceed as if you were on macOS or Linux.

Congratulations! You have now installed SDKMAN on your system. You are ready to enjoy its powerful features for JDK version management.

> info "Note"
> All SDK installations will now be done under your HOME directory that is in the `~/.sdkman` on linux-friendly OS.

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
Vendor        | Use | Version      | Dist    | Status     | Identifier
--------------------------------------------------------------------------------
Corretto      |     | 21           | amzn    |            | 21-amzn             
              |     | 20.0.2       | amzn    |            | 20.0.2-amzn         
              |     | 20.0.1       | amzn    |            | 20.0.1-amzn         
              |     | 17.0.8       | amzn    |            | 17.0.8-amzn         
              |     | 17.0.7       | amzn    |            | 17.0.7-amzn         
              |     | 11.0.20      | amzn    |            | 11.0.20-amzn        
              |     | 11.0.19      | amzn    |            | 11.0.19-amzn        
              |     | 8.0.382      | amzn    |            | 8.0.382-amzn        
              |     | 8.0.372      | amzn    |            | 8.0.372-amzn        
Gluon         |     | 22.1.0.1.r17 | gln     |            | 22.1.0.1.r17-gln    
              |     | 22.1.0.1.r11 | gln     |            | 22.1.0.1.r11-gln    
GraalVM CE    |     | 21           | graalce |            | 21-graalce          
              |     | 20.0.2       | graalce |            | 20.0.2-graalce      
              |     | 20.0.1       | graalce |            | 20.0.1-graalce      
              |     | 17.0.8       | graalce |            | 17.0.8-graalce      
              |     | 17.0.7       | graalce |            | 17.0.7-graalce      
GraalVM Oracle|     | 21           | graal   |            | 21-graal            
              |     | 20.0.2       | graal   |            | 20.0.2-graal        
              |     | 20.0.1       | graal   |            | 20.0.1-graal        
              |     | 17.0.8       | graal   |            | 17.0.8-graal        
              |     | 17.0.7       | graal   |            | 17.0.7-graal        
Java.net      |     | 22.ea.18     | open    |            | 22.ea.18-open       
              |     | 22.ea.17     | open    |            | 22.ea.17-open       
              |     | 22.ea.16     | open    |            | 22.ea.16-open       
              |     | 22.ea.15     | open    |            | 22.ea.15-open       
              |     | 21           | open    |            | 21-open             
              |     | 21.ea.35     | open    |            | 21.ea.35-open       
              |     | 20.0.2       | open    |            | 20.0.2-open         
JetBrains     |     | 17.0.8       | jbr     |            | 17.0.8-jbr          
              |     | 17.0.8.1     | jbr     |            | 17.0.8.1-jbr        
              |     | 17.0.7       | jbr     |            | 17.0.7-jbr          
              |     | 11.0.14.1    | jbr     |            | 11.0.14.1-jbr       
Liberica      |     | 21.fx        | librca  |            | 21.fx-librca        
              |     | 21           | librca  |            | 21-librca           
              |     | 20.0.2.fx    | librca  |            | 20.0.2.fx-librca    
              |     | 20.0.2       | librca  |            | 20.0.2-librca       
              |     | 20.0.1.fx    | librca  |            | 20.0.1.fx-librca    
              |     | 20.0.1       | librca  |            | 20.0.1-librca       
              |     | 17.0.8.fx    | librca  |            | 17.0.8.fx-librca    
              |     | 17.0.8.1.fx  | librca  |            | 17.0.8.1.fx-librca  
              |     | 17.0.8.1     | librca  |            | 17.0.8.1-librca     
              |     | 17.0.8       | librca  |            | 17.0.8-librca       
              |     | 17.0.7.fx    | librca  |            | 17.0.7.fx-librca    
              |     | 17.0.7       | librca  |            | 17.0.7-librca       
              |     | 11.0.20.fx   | librca  |            | 11.0.20.fx-librca   
              |     | 11.0.20.1.fx | librca  |            | 11.0.20.1.fx-librca
              |     | 11.0.20.1    | librca  |            | 11.0.20.1-librca    
              |     | 11.0.20      | librca  |            | 11.0.20-librca      
              |     | 11.0.19.fx   | librca  |            | 11.0.19.fx-librca
              |     | 11.0.19      | librca  |            | 11.0.19-librca      
              |     | 8.0.382.fx   | librca  |            | 8.0.382.fx-librca   
              |     | 8.0.382      | librca  |            | 8.0.382-librca      
              |     | 8.0.372.fx   | librca  |            | 8.0.372.fx-librca   
              |     | 8.0.372      | librca  |            | 8.0.372-librca      
Liberica NIK  |     | 23.r20       | nik     |            | 23.r20-nik          
              |     | 23.r17       | nik     |            | 23.r17-nik          
              |     | 23.1.r21     | nik     |            | 23.1.r21-nik        
              |     | 23.0.1.r20   | nik     |            | 23.0.1.r20-nik      
              |     | 23.0.1.r17   | nik     |            | 23.0.1.r17-nik      
              |     | 22.3.3.r17   | nik     |            | 22.3.3.r17-nik      
              |     | 22.3.3.r11   | nik     |            | 22.3.3.r11-nik      
              |     | 22.3.2.r17   | nik     |            | 22.3.2.r17-nik      
              |     | 22.3.2.r11   | nik     |            | 22.3.2.r11-nik      
Microsoft     |     | 21           | ms      |            | 21-ms               
              |     | 17.0.8.1     | ms      |            | 17.0.8.1-ms         
              |     | 17.0.8       | ms      |            | 17.0.8-ms           
              |     | 17.0.7       | ms      |            | 17.0.7-ms           
              |     | 11.0.20.1    | ms      |            | 11.0.20.1-ms        
              |     | 11.0.20      | ms      |            | 11.0.20-ms          
              |     | 11.0.19      | ms      |            | 11.0.19-ms          
Oracle        |     | 21           | oracle  |            | 21-oracle           
              |     | 20.0.2       | oracle  |            | 20.0.2-oracle       
              |     | 20.0.1       | oracle  |            | 20.0.1-oracle       
              |     | 17.0.8       | oracle  |            | 17.0.8-oracle       
              |     | 17.0.7       | oracle  |            | 17.0.7-oracle       
SapMachine    |     | 21           | sapmchn |            | 21-sapmchn          
              |     | 20.0.2       | sapmchn |            | 20.0.2-sapmchn      
              |     | 20.0.1       | sapmchn |            | 20.0.1-sapmchn      
              |     | 17.0.8       | sapmchn |            | 17.0.8-sapmchn      
              |     | 17.0.8.1     | sapmchn |            | 17.0.8.1-sapmchn    
              |     | 17.0.7       | sapmchn |            | 17.0.7-sapmchn      
              |     | 11.0.20      | sapmchn |            | 11.0.20-sapmchn     
              |     | 11.0.20.1    | sapmchn |            | 11.0.20.1-sapmchn   
              |     | 11.0.19      | sapmchn |            | 11.0.19-sapmchn     
Semeru        |     | 20.0.2       | sem     |            | 20.0.2-sem          
              |     | 20.0.1       | sem     |            | 20.0.1-sem          
              |     | 17.0.8       | sem     |            | 17.0.8-sem          
              |     | 17.0.8.1     | sem     |            | 17.0.8.1-sem        
              |     | 17.0.7       | sem     |            | 17.0.7-sem          
              |     | 11.0.20      | sem     |            | 11.0.20-sem         
              |     | 11.0.20.1    | sem     |            | 11.0.20.1-sem       
              |     | 11.0.19      | sem     |            | 11.0.19-sem         
Temurin       |     | 20.0.2       | tem     |            | 20.0.2-tem          
              |     | 20.0.1       | tem     |            | 20.0.1-tem          
              |     | 17.0.8       | tem     |            | 17.0.8-tem          
              |     | 17.0.8.1     | tem     |            | 17.0.8.1-tem        
              |     | 17.0.7       | tem     |            | 17.0.7-tem          
              |     | 11.0.20      | tem     |            | 11.0.20-tem 
              |     | 11.0.20.1    | tem     |            | 11.0.20.1-tem       
              |     | 11.0.19      | tem     |            | 11.0.19-tem         
Tencent       |     | 17.0.8       | kona    |            | 17.0.8-kona         
              |     | 17.0.7       | kona    |            | 17.0.7-kona         
              |     | 11.0.20      | kona    |            | 11.0.20-kona        
              |     | 11.0.19      | kona    |            | 11.0.19-kona        
              |     | 8.0.382      | kona    |            | 8.0.382-kona        
              |     | 8.0.372      | kona    |            | 8.0.372-kona        
Zulu          |     | 21           | zulu    |            | 21-zulu             
              |     | 21.fx        | zulu    |            | 21.fx-zulu          
              |     | 20.0.2       | zulu    |            | 20.0.2-zulu         
              |     | 20.0.2.fx    | zulu    |            | 20.0.2.fx-zulu      
              |     | 20.0.1       | zulu    |            | 20.0.1-zulu         
              |     | 20.0.1.fx    | zulu    |            | 20.0.1.fx-zulu      
              |     | 17.0.8       | zulu    |            | 17.0.8-zulu         
              |     | 17.0.8.fx    | zulu    |            | 17.0.8.fx-zulu      
              |     | 17.0.8.1     | zulu    |            | 17.0.8.1-zulu       
              |     | 17.0.8.1.fx  | zulu    |            | 17.0.8.1.fx-zulu    
              |     | 17.0.7       | zulu    |            | 17.0.7-zulu         
              |     | 17.0.7.fx    | zulu    |            | 17.0.7.fx-zulu      
              |     | 11.0.20      | zulu    |            | 11.0.20-zulu        
              |     | 11.0.20.fx   | zulu    |            | 11.0.20.fx-zulu     
              |     | 11.0.20.1    | zulu    |            | 11.0.20.1-zulu      
              |     | 11.0.20.1.fx | zulu    |            | 11.0.20.1.fx-zulu   
              |     | 11.0.19      | zulu    |            | 11.0.19-zulu        
              |     | 11.0.19.fx   | zulu    |            | 11.0.19.fx-zulu     
              |     | 8.0.382      | zulu    |            | 8.0.382-zulu        
              |     | 8.0.382.fx   | zulu    |            | 8.0.382.fx-zulu     
              |     | 8.0.372      | zulu    |            | 8.0.372-zulu        
              |     | 8.0.372.fx   | zulu    |            | 8.0.372.fx-zulu     
================================================================================
Omit Identifier to install default version 17.0.8.1-tem:
$ sdk install java
Use TAB completion to discover available versions
$ sdk install java [TAB]
Or install a specific version by Identifier:
$ sdk install java 17.0.8.1-tem
Hit Q to exit this list view
================================================================================
{% endhighlight %}

### Actual installation of the JDK

Place your bets ... me, it's done! As I am working on the build of Java code in native code at the moment, I choose 
`GraalVM CE` in version `20.0.2` and I select its identifier `20.0.2-graalce`.

It's your turn. To install it, I run the command:

{% highlight zsh %} % sdk install java 20.0.2-graalce{% endhighlight %}

Which gives me the output, the installation process

{% highlight output %}
Downloading: java 20.0.2-graalce

In progress...

################################## 100.0%

Repackaging Java 20.0.2-graalce...

Done repackaging...
Cleaning up residual files...

Installing: java 20.0.2-graalce
Done installing!

Setting java 20.0.2-graalce as default.
{% endhighlight %}

Done! No, not yet ... I need more JDKs for comparison. Moreover, this is why we installed this tool.

For my part, I install two others:

{% highlight zsh %}
% sdk install java 21.fx-librca
% sdk install java 23.r20-nik
{% endhighlight %}

<hr class="hr-text" data-content="JDK Selection">

## JDK Selection

Let's now see how to select a specific version of Java.


### Displaying the Current Version

Let's see what the `sdk` command tells us:

{% highlight zsh %}
% sdk current java
Using java version 20.0.2-graalce
{% endhighlight %}

And let's see what `java` tells us:

{% highlight zsh %}
% java --version               
openjdk 20.0.2 2023-07-18
OpenJDK Runtime Environment GraalVM CE 20.0.2+9.1 (build 20.0.2+9-jvmci-23.0-b15)
OpenJDK 64-Bit Server VM GraalVM CE 20.0.2+9.1 (build 20.0.2+9-jvmci-23.0-b15, mixed mode, sharing)
{% endhighlight %}


### Displaying Installed Versions

{% highlight output %}
% sdk list java
{% endhighlight %}

### Switching Versions

{% highlight zsh %}
% sdk use java 21.fx-librca

Using java version 21.fx-librca in this shell.
{% endhighlight %}

Let's verify with Java:

{% highlight zsh %}
% java --version

openjdk 21 2023-09-19 LTS
OpenJDK Runtime Environment (build 21+37-LTS)
OpenJDK 64-Bit Server VM (build 21+37-LTS, mixed mode, sharing)
{% endhighlight %}

And there you have it...

<hr class="hr-text" data-content="Conclusion">

## Taking It Further

You can find additional useful commands at this address: [https://sdkman.io/usage](https://sdkman.io/usage){:target="_blank" rel="noopener noreferrer nofollow"}, 
including the `env` command: [https://sdkman.io/usage#env](https://sdkman.io/usage#env){:target="_blank" rel="noopener noreferrer nofollow"}.

Now it's your turn to explore further.

Cheers...
