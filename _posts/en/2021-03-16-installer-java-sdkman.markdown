---
layout: post
title: Install Java with SDKMAN
date: 2021-03-16 11:44:00 +2
description: Learn to install and use several versions of Java with SDKMAN. Walkthrough for MacOS, Windows and Linux.
img: sdkman-post.jpg
fig-caption: Photo by <a href="https://unsplash.com/@vikramstudio46?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">vikram sundaramoorthy</a> on <a href="https://unsplash.com/s/photos/superman?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [Sdkman, Java, GraalVM, macOS, Tool]
lang: en
permalink: /installer-java-sdkman/
---

Owner of a Mac, it happens to me, on the occasion of the release of a new version of macOS (when it is stable), to erase everything on my computer, to start from scratch and to do a famous `clean install`. Then comes the tedious task of reinstalling all the tools necessary for my work.

This is the opportunity to present SDKMAN, a utility that will allow you to combine several versions of JDKs on your computer ... and not only!

<hr class="hr-text" data-content="Content">

* TOC
{:toc}

<hr class="hr-text" data-content="SDKMAN!">

## SDKMAN, the tool you need!

Among the undeniable advantages of the tool, I would cite:

- Simple installation of your JDKs
- The ease of changing JDK version
- The ability to define a default SDK in a directory/project

<hr class="hr-text" data-content="Installation">

## Installing SDKMAN

You can find on the [official SDKMAN page!](Https://sdkman.io/install){:target="_blank" rel="noopener noreferrer nofollow"}, the procedure to follow.
In my case, I followed the default procedure:

1. Open a terminal and run the following command:
	{% highlight zsh %}% curl -s "https://get.sdkman.io" | bash{% endhighlight %}


1. Open a new terminal and run:
   {% highlight zsh %}% source "~/.sdkman/bin/sdkman-init.sh"{% endhighlight %}

That's it!

The tool installs under `$ HOME / .sdkman` and adds the config lines. in the `.bashrc`, `.bash_profile` and `.zshrc` files if you also have ZSH.
{% highlight zsh %}
#THIS MUST BE AT THE END OF THE FILE FOR SDKMAN TO WORK!!!
export SDKMAN_DIR="/Users/jeanjerome/.sdkman"
[[ -s "/Users/jeanjerome/.sdkman/bin/sdkman-init.sh" ]] && source "/Users/jeanjerome/.sdkman/bin/sdkman-init.sh"
{% endhighlight %}

All the installations of your SDKs will now be done under the SDKMAN directory `~ / .sdkman`.

<hr class="hr-text" data-content="JDK">

## Installing a JDK

Now is the time to install your first JDK. The choice is important! Not for your computer because, with this tool, it will only see fire. No, the choice is important to you and you are probably wondering which JDK to start with ...

Take some time to think about it and let's see some SDKMAN commands already.

### Candidate vs Version

As the name suggests, SDKMAN allows you to install SDKs ... and Java is just one of the potential candidates.

You must therefore already choose the SDK (candidate) to install.

#### Candidate

To see the list of SDKs/candidate, run the following command:
{% highlight zsh %}% sdk list {% endhighlight %}

> note "Note"
> Type `q` to exit the list

You see that it is possible to install a lot of things. To name a few:
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

Well, the candidate we are interested in is `Java`. Now let's take a look at its available versions.

Let's ask SDKMAN:
{% highlight zsh %}% sdk list java{% endhighlight %}

Here is the list I get:

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

<hr class="hr-text" data-content="JDK choice">

## Select a JDK

Now let's see how to select a version of Java.


### Let's display the current version

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


### Let's display the installed versions

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

### Let's change version

{% highlight zsh %}
% sdk use java 11.0.10.j9-adpt
Using java version 11.0.10.j9-adpt in this shell.
{% endhighlight %}

Then let's check with Java

{% highlight zsh %}
% java --version
openjdk 11.0.10 2021-01-19
OpenJDK Runtime Environment AdoptOpenJDK (build 11.0.10+9)
Eclipse OpenJ9 VM AdoptOpenJDK (build openj9-0.24.0, JRE 11 Mac OS X amd64-64-Bit Compressed References 20210120_897 (JIT enabled, AOT enabled)
OpenJ9   - 345e1b09e
OMR      - 741e94ea8
JCL      - 0a86953833 based on jdk-11.0.10+9)
{% endhighlight %}

And There you go...


<hr class="hr-text" data-content="Conclusion">

## For further

You will find at this address [https://sdkman.io/usage](https://sdkman.io/usage){:target="_blank" rel="noopener noreferrer nofollow"}, other commands that you might be useful, in particular the `env` command [https://sdkman.io/usage#env](https://sdkman.io/usage#env){:target="_blank" rel="noopener noreferrer nofollow"}.

Now it's your turn.

Cheers ...
