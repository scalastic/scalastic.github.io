---
layout: post
title: "SDKMAN : Installez plusieurs versions de JDK et bien plus encore !"
date: 2021-03-16 11:44:00 +2
description: Apprendre à installer et utiliser plusieurs versions de Java avec SDKMAN. Procédure pas à pas pour macOS, Windows et Linux.
img: sdkman-post.jpg
fig-caption: Photo de <a href="https://unsplash.com/@vikramstudio46?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">vikram sundaramoorthy</a> sur <a href="https://unsplash.com/s/photos/superman?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [SDKMAN, Java, JDK, GraalVM, macOS, Tool]
lang: fr
permalink: /installer-java-sdkman/
---

Lorsqu'une nouvelle version stable de macOS est disponible, il peut arriver que je décide de procéder à une 
réinstallation complète de mon ordinateur, communément appelée "clean install". Après cette opération, il devient 
nécessaire de réinstaller tous les outils indispensables à mon travail, ce qui peut s'avérer fastidieux.

C'est dans ce contexte que SDKMAN, un utilitaire très pratique et qui va bien au-delà de la simple gestion de plusieurs 
versions de JDKs sur votre ordinateur.

<hr class="hr-text" data-content="Plan">

* TOC
{:toc}

<hr class="hr-text" data-content="SDKMAN!">

## Un outil essentiel : SDKMAN

SDKMAN, acronyme de "Software Development Kit Manager", est un outil intéressant pour les développeurs Java qui souhaitent
gérer efficacement les versions du JDK (Java Development Kit). Il simplifie grandement la gestion des différentes
versions du JDK, offrant ainsi un contrôle simple de l'environnement de développement Java.

Les avantages de SDKMAN, pour la gestion des versions de JDK, sont :

1. **Une installation aisée** : SDKMAN facilite l'installation du JDK en automatisant le processus. Plus besoin de
   rechercher les téléchargements, les configurations ou les installations manuelles fastidieuses. SDKMAN se charge de
   tout, en quelques commandes simples.

2. **Une gestion des versions** : Avec SDKMAN, il est possible d'installer plusieurs versions de JDK simultanément sur votre
   système. Vous pouvez ainsi basculer facilement entre les différentes versions selon les besoins de votre projet.

3. **Une souplesse et flexibilité** : SDKMAN propose une vaste gamme de versions de JDK, incluant à la fois les versions
   stables et les versions de développement les plus récentes. Vous pouvez choisir la version qui convient le mieux à votre
   projet, en fonction des fonctionnalités spécifiques requises ou des exigences de compatibilité.

4. **Des mises à jour simplifiées** : Grâce à SDKMAN, la mise à jour de votre JDK devient un jeu d'enfant. L'outil vous
   informe des nouvelles versions disponibles et vous permet de les installer rapidement, sans tracas.

5. **Plateformes multiples** : Que vous travailliez sur macOS, Windows ou Linux, SDKMAN s'adapte à votre environnement.
   Il garantit une expérience homogène et cohérente, indépendamment du système d'exploitation utilisé.

En résumé, SDKMAN est un outil puissant et essentiel pour les développeurs Java. Il simplifie la gestion des versions de
JDK, vous permettant ainsi de rester à jour avec les dernières fonctionnalités et d'éviter les problèmes
d'incompatibilité. Que vous soyez un développeur chevronné ou débutant, SDKMAN vous offre un contrôle total sur votre
environnement de développement Java, vous permettant de travailler de manière efficace et sans tracas.

<hr class="hr-text" data-content="Installation">

## Installation de SDKMAN

Pour profiter des avantages offerts par SDKMAN, il est essentiel de l'installer 
correctement sur votre système. Voici les instructions détaillées pour installer SDKMAN sur macOS, Windows et Linux :

### Installation sur macOS et Linux:

1. Ouvrez votre terminal.

2. Exécutez la commande suivante pour télécharger le script d'installation de SDKMAN :
   {% highlight shell %}curl -s "https://get.sdkman.io" | bash{% endhighlight %}

3. Attendez que le téléchargement et l'installation du script soient terminés.

4. Après l'installation, exécutez la commande suivante pour charger SDKMAN dans votre session en cours :
   {% highlight shell %}source "$HOME/.sdkman/bin/sdkman-init.sh"{% endhighlight %}

5. Pour vérifier si SDKMAN a été installé avec succès, tapez la commande suivante :
   {% highlight shell %}sdk version{% endhighlight %}

### Installation sur Windows :

1. Accédez au site officiel de SDKMAN à l'adresse suivante : [https://sdkman.io/install](https://sdkman.io/install){:target="_blank" rel="noopener noreferrer nofollow"}.

2. Sous Windows, il est nécessaire d'avoir un terminal Bash. En fonction de votre cas, copiez la commande d'installation
indiquée sur le site.

3. Ouvrez votre invite de commandes.

4. Collez la commande dans votre invite de commandes et appuyez sur Entrée pour l'exécuter.

5. Attendez que l'installation soit terminée.

6. Une fois l'installation terminée, fermez et rouvrez votre invite de commandes.

7. Pour vérifier si SDKMAN a été installé avec succès, tapez la commande suivante :
   {% highlight Bat %}sdk version{% endhighlight %}

Félicitations ! Vous avez maintenant installé SDKMAN sur votre système. Vous êtes prêt à profiter des fonctionnalités 
puissantes qu'il offre pour la gestion des versions de JDK.

> info "Note"
> Toutes les installations de SDKs se feront désormais dans le répertoire `~/.sdkman`.


<hr class="hr-text" data-content="JDK">

## Installation d'un JDK

Une fois que vous avez installé SDKMAN avec succès, vous pouvez procéder à l'installation d'un JDK spécifique en 
utilisant cet outil.

Prenez le temps de réfléchir et voyons déjà quelques commandes de SDKMAN.

### Candidate vs Version

Comme son nom l'indique, SDKMAN permet d'installer des SDKs... et Java n'est qu'un des `candidate`s potentiels.

Il faut donc déjà choisir le SDK (candidate) à installer.

#### Candidate

Pour voir la liste des SDK/candidate, lancez la commande suivante :
{% highlight zsh %}% sdk list {% endhighlight %}

> info "Note"
> Tapez `q` pour sortir de la liste

Vous voyez qu'il est possible d'installer pas mal de choses. Pour n'en citer que quelque uns :
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

Bon, le candidat qui nous intéresse, c'est `Java`. Voyons à présent les versions que nous propose SDKMAN.

Pour cela, interrogeons SDKMAN :
{% highlight zsh %}% sdk list java{% endhighlight %}

Voici la liste que j'obtiens :

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

### Actual JDK Installation

Place your bets... I've made mine! Since I'm currently working on native Java code compilation, I'm choosing `GraalVM` 
version `11` and selecting its identifier `21.0.0.2.r11-grl`. Now it's your turn.

To install it, I execute the following command:

{% highlight bash %}sdk install java 21.0.0.2.r11-grl{% endhighlight %}

This will initiate the installation process, and the output will be:

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

Done! Non, pas encore... J'ai besoin d'autres JDKs pour effectuer des comparaisons. D'ailleurs, c'est bien pour cela que
nous avons installé cet outil, pour pouvoir installer plusieurs JDKs.

Pour ma part, j'en installe deux autres :

{% highlight zsh %}
% sdk install java 11.0.10.j9-adpt
% sdk install java 11.0.2-open
{% endhighlight %}

<hr class="hr-text" data-content="Choix du JDK">

## Sélection d'un JDK

Voyons à présent comment sélectionner une version spécifique de Java.


### Affichons la version en cours

Voyons ce que nous dit la commande `sdk` :

{% highlight zsh %}
% sdk current java
Using java version 21.0.0.2.r11-grl
{% endhighlight %}

Et voyons ce que nous dit `java` :

{% highlight zsh %}
% java --version               
openjdk 11.0.10 2021-01-19
OpenJDK Runtime Environment GraalVM CE 21.0.0.2 (build 11.0.10+8-jvmci-21.0-b06)
OpenJDK 64-Bit Server VM GraalVM CE 21.0.0.2 (build 11.0.10+8-jvmci-21.0-b06, mixed mode, sharing)
{% endhighlight %}


### Affichons les versions installées

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

### Changeons de version

{% highlight zsh %}
% sdk use java 11.0.10.j9-adpt
Using java version 11.0.10.j9-adpt in this shell.
{% endhighlight %}

Puis vérifions avec Java

{% highlight zsh %}
% java --version
openjdk 11.0.10 2021-01-19
OpenJDK Runtime Environment AdoptOpenJDK (build 11.0.10+9)
Eclipse OpenJ9 VM AdoptOpenJDK (build openj9-0.24.0, JRE 11 Mac OS X amd64-64-Bit Compressed References 20210120_897 (JIT enabled, AOT enabled)
OpenJ9   - 345e1b09e
OMR      - 741e94ea8
JCL      - 0a86953833 based on jdk-11.0.10+9)
{% endhighlight %}

Et voilà...


<hr class="hr-text" data-content="Conclusion">

## Pour aller plus loin

Vous trouverez à cette adresse [https://sdkman.io/usage](https://sdkman.io/usage){:target="_blank" rel="noopener noreferrer nofollow"}, 
d'autres commandes qui pourraient vous être utiles notamment la commande `env` 
[https://sdkman.io/usage#env](https://sdkman.io/usage#env){:target="_blank" rel="noopener noreferrer nofollow"}.

A vous de jouer à présent.

Cheers...
