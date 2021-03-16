---
layout: post
title: SDKMAN! ou comment gérer simplement différentes versions d'un SDK
date: 2021-03-16 11:44:00 +0200
description: Faire cohabiter plusieurs versions de JDK peut vite devenir à un calvaire si l'on s'y prend sans un outil adapté. C'est donc le moment d'installer SDKMAN!.
img: sdkman-post.jpg
fig-caption: Photo de <a href="https://unsplash.com/@vikramstudio46?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">vikram sundaramoorthy</a> sur <a href="https://unsplash.com/s/photos/superman?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [sdkman, installation, Java, GraalVM, MacOS]
excerpt_separator: <!--more-->
---

Possesseur d'un Mac, il m'arrive, à l'occasion de la sortie d'une nouvelle version de MacOS (lorsqu'elle est stable), de tout effacer sur mon ordi, de repartir de zéro et faire un fameux `clean install`.

Reste ensuite la fastidieuse tâche de réinstaller tous les outils nécesaires à mon travail. C'est l'occasion de vous présenter SDKMAN!, un utilitaire qui va vous permettre de faire cohabiter plusieurs versions de JDKs sur votre ordi... et pas seulement !

<!--more-->

<hr class="hr-text" data-content="Plan">

1. [SDKMAN, l'outil qu'il te faut !](#sdkman-loutil-quil-te-faut-)
1. [Installation de SDKMAN](#installation-de-sdkman)
1. [Installation d'un JDK](#installation-dun-jdk)
1. [Sélection d'un JDK](#sélection-dun-jdk)

<hr class="hr-text" data-content="SDKMAN!">

## SDKMAN, l'outil qu'il te faut !

Parmi les avantages indéniables de l'outil, je citerais :

- Une installation simple de vos JDKs
- La facilité pour changer de version de JDK
- La possibilité de définir un SDK par défaut dans un répertoire / projet

<hr class="hr-text" data-content="Installation">

## Installation de SDKMAN

Vous pouvez retrouver sur la [page officielle de SDKMAN!](https://sdkman.io/install), la procédure à suivre.
Dans mon cas, j'ai suivi la procédure par défaut :

1. Ouvrez un terminal et lancez la commande suivante :
	```bash
	% curl -s "https://get.sdkman.io" | bash
	```


1. Ouvrez un nouveau terminal et exécutez :
	```bash
	source "~/.sdkman/bin/sdkman-init.sh"
	```

That's it! 

L'outil s'installe sous `$HOME/.sdkman` et ajoute les lignes de config. dans les fichiers `.bashrc`, `.bash_profile` et `.zshrc` si vous avez aussi ZSH.
 ```
 #THIS MUST BE AT THE END OF THE FILE FOR SDKMAN TO WORK!!!
export SDKMAN_DIR="/Users/jeanjerome/.sdkman"
[[ -s "/Users/jeanjerome/.sdkman/bin/sdkman-init.sh" ]] && source "/Users/jeanjerome/.sdkman/bin/sdkman-init.sh"
```

Toutes les installations de vos SDKs se feront désormais sous le répertoire de SDKMAN `~/.sdkman`.

<hr class="hr-text" data-content="JDK">

## Installation d'un JDK

C'est le moment d'installer votre premier JDK. Le choix est important ! Non pas pour votre ordi car, avec cet outil, il n'y verra que du feu. Non, le choix est important pour vous et vous vous demandez sûrement par quel JDK commencer...

Prenez le temps de réfléchir et voyons déjà quelques commandes de SDKMAN.

### Candidate vs Version

Comme son nom l'indique, SDKMAN permet d'installer des SDKs... et Java n'est qu'un des `candidate`s potentiels.

Il faut donc déjà choisir le SDK (candidate) à installer.

#### Candidate

Pour voir la liste des SDK/candidate, lancez la commande suivante :
```bash
% sdk list
```

> note "Note"
> Tapez `q` pour sortir de la liste

Vous voyez qu'il est possible d'installer pas mal de chose. Pour en citer quelques uns :
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

Bon, le candidat qui nous interresse, c'est `Java`. Voyons à présent ses versions disponibles.

Interrogeons SDKMAN :
```bash
% sdk list java
```

Voici la liste que j'obtiens :

```
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
```

### Installation réelle du JDK

Faites vos jeux... moi, c'est fait ! Comme je travaille sur le build de code Java en code natif en ce moment, je choisis `GraalVM` en version `11` et je sélectionne son identifier `21.0.0.2.r11-grl`. A vous de jouer.

Pour l'installer, je lance la commande :

```bash
% sdk install java 21.0.0.2.r11-grl
```

Ce qui me donne en sortie, le processus d'installation

```bash

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
%
```

Done! Non, pas encore... J'ai besoin d'autres JDKs pour effectuer des comparaisons. D'ailleurs, c'est bien pour cela que nous avons installé cet outil.

Pour ma part, j'en installe deux autres :

```bash
% sdk install java 11.0.10.j9-adpt
% sdk install java 11.0.2-open
```
<hr class="hr-text" data-content="Choix du JDK">

## Sélection d'un JDK

Voyons à présent comment sélectionner une version de Java.


1. Affichons la version en cours

	1. Avec SDKMAN

		```bash
		% sdk current java
		Using java version 21.0.0.2.r11-grl
		```

	1. Avec Java

		```bash
		% java --version               
		openjdk 11.0.10 2021-01-19
		OpenJDK Runtime Environment GraalVM CE 21.0.0.2 (build 11.0.10+8-jvmci-21.0-b06)
		OpenJDK 64-Bit Server VM GraalVM CE 21.0.0.2 (build 11.0.10+8-jvmci-21.0-b06, mixed mode, sharing)
		```

2. Affichons les versions installées

	```bash
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
	```

3. Changeons de version

	```bash
	% sdk use java 11.0.10.j9-adpt
	Using java version 11.0.10.j9-adpt in this shell.
	```

	Puis vérifions avec Java

	```bash
	% java --version 
	openjdk 11.0.10 2021-01-19
	OpenJDK Runtime Environment AdoptOpenJDK (build 11.0.10+9)
	Eclipse OpenJ9 VM AdoptOpenJDK (build openj9-0.24.0, JRE 11 Mac OS X amd64-64-Bit Compressed References 20210120_897 (JIT enabled, AOT enabled)
	OpenJ9   - 345e1b09e
	OMR      - 741e94ea8
	JCL      - 0a86953833 based on jdk-11.0.10+9)
	```

Et voilà...


<hr class="hr-text" data-content="Conclusion">

## Pour aller plus loin

Vous trouverez à cette adresse [https://sdkman.io/usage](https://sdkman.io/usage), d'autres commandes qui pourraient vous être utiles notamment la commande `env` [https://sdkman.io/usage#env](https://sdkman.io/usage#env).

A vous de jouer à présent.

Cheers...

> info "Et maintenant"
> * Vous avez aimé cet article ? Dites-le ci-dessous afin que le blog gagne en visibilité.
> * Vous avez une question ? Posez-la en commentaire, je m'efforcerai d'y répondre dans les plus brefs délais !!
> 
> Merci à vous !
>








