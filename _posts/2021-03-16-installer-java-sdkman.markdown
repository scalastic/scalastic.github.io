---
layout: post
title: "SDKMAN : Installez plusieurs versions de JDK et bien plus encore !"
date: 2023-10-10 20:57:00 +2
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

4. Après l'installation :
   - Lancez un nouveau terminal
   - Ou exécutez la commande suivante pour charger SDKMAN dans votre session en cours :
     {% highlight shell %}source "$HOME/.sdkman/bin/sdkman-init.sh"{% endhighlight %}

5. Pour vérifier si SDKMAN a été installé avec succès, tapez la commande suivante :
   {% highlight shell %}sdk version{% endhighlight %}

6. Vous devriez voir :
   {% highlight shell %} 
   SDKMAN!
   script: 5.18.2
   native: 0.4.2
   {% endhighlight %}

### Installation sur Windows :

1. Sous Windows, il est nécessaire d'avoir un terminal Bash. Le plus simple est d'installer Windows Subsystem for Linux 2 (WSL2).

2. Pour cela, suivez les indications fournies sur le site de Microsoft [https://learn.microsoft.com/fr-fr/windows/wsl/install](https://learn.microsoft.com/fr-fr/windows/wsl/install){:target="_blank" rel="noopener noreferrer nofollow"}

3. Une fois installé, procédez comme si vous étiez sur macOS ou Linux.

Félicitations ! Vous avez maintenant installé SDKMAN sur votre système. Vous êtes prêt à profiter des fonctionnalités 
puissantes qu'il offre pour la gestion des versions de JDK.

> info "Note"
> Toutes les installations de SDK seront désormais effectuées sous votre répertoire HOME, qui se trouve dans `~/.sdkman`
> sur les systèmes d'exploitation compatibles avec Linux.


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

### Installation actuelle de JDK

Faites vos jeux... J'ai fait mon choix ! Étant donné que je travaille actuellement sur Spring Boot 3 et la compilation 
de code Java natif, je choisis `GraalVM CE` version `20.0.2` et je sélectionne son identifiant `20.0.2-graalce`. 

Maintenant, c'est à votre tour. Pour l'installer, j'exécute la commande suivante :

{% highlight zsh %} % sdk install java 20.0.2-graalce{% endhighlight %}

Cela lancera le processus d'installation, et la sortie sera :

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

Done! Non, pas encore... J'ai besoin d'autres JDKs pour effectuer des comparaisons. D'ailleurs, c'est bien pour cela que
nous avons installé cet outil, pour pouvoir installer plusieurs JDKs.

Pour ma part, j'en installe deux autres :

{% highlight zsh %}
% sdk install java 21.fx-librca
% sdk install java 23.r20-nik
{% endhighlight %}

<hr class="hr-text" data-content="Choix du JDK">

## Sélection d'un JDK

Voyons à présent comment sélectionner une version spécifique de Java.


### Affichons la version en cours

Voyons ce que nous dit la commande `sdk` :

{% highlight zsh %}
% sdk current java
Using java version 20.0.2-graalce
{% endhighlight %}

Et voyons ce que nous dit `java` :

{% highlight zsh %}
% java --version               
openjdk 20.0.2 2023-07-18
OpenJDK Runtime Environment GraalVM CE 20.0.2+9.1 (build 20.0.2+9-jvmci-23.0-b15)
OpenJDK 64-Bit Server VM GraalVM CE 20.0.2+9.1 (build 20.0.2+9-jvmci-23.0-b15, mixed mode, sharing)
{% endhighlight %}


### Affichons les versions installées

{% highlight output %}
% sdk list java
{% endhighlight %}

### Changeons de version

{% highlight zsh %}
% sdk use java 21.fx-librca

Using java version 21.fx-librca in this shell.
{% endhighlight %}

Puis vérifions avec Java

{% highlight zsh %}
% java --version

openjdk 21 2023-09-19 LTS
OpenJDK Runtime Environment (build 21+37-LTS)
OpenJDK 64-Bit Server VM (build 21+37-LTS, mixed mode, sharing)
{% endhighlight %}

Et voilà...


<hr class="hr-text" data-content="Conclusion">

## Pour aller plus loin

Vous trouverez à cette adresse [https://sdkman.io/usage](https://sdkman.io/usage){:target="_blank" rel="noopener noreferrer nofollow"}, 
d'autres commandes qui pourraient vous être utiles notamment la commande `env` 
[https://sdkman.io/usage#env](https://sdkman.io/usage#env){:target="_blank" rel="noopener noreferrer nofollow"}.

A vous de jouer à présent.

Cheers...
