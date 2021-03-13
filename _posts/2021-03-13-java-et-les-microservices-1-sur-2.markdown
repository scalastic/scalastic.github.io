---
layout: post
title: Java et les microservices ?
date: 2021-03-13 15:21:20 +0200
description: Avec l'arrivée des architectures microservices, les développeurs Java sont en droit d'avoir peur pour leurs applications. Temps de démarrage, consommation mémoire de la JVM, a priori, rien de bon pour implémenter une application à base de microservices...
img: java-like-rusty-container.jpg # Add image post (optional)
fig-caption: Photo de a-herzog trouvée sur Flickr (Licence Attribution 2.0 Générique - CC BY 2.0) # Add figcaption (optional)
tags: [Java, Microservices]
---

Cet article est le premier d'une série abordant les concepts derrière GraalVM. Il permet de bien se rendre compte des lacunes de Java et de sa JVM HotSpot dans le monde des containers et notamment des microservices.

---

1. Qu'est-ce qu'un microservice ?

1. Qu'est-ce que Java ?
	1. Le fonctionnement de la JVM
		1. L'interprétation
		1. Le compilateur Just-In-Time (JIT)
		1. L'empreinte mémoire
	1. Le fonctionnement des Frameworks Java

1. On fait comment à présent ?

---

## Qu'est-ce qu'un microservice ?

Le prolongement (l'aboutissement ?) du concept de `SOA` (Architecture Orientée Service) avec l'avênement du cloud.

Il ajoute les notions de :

* service conçu pour remplir **1 seule fonction** (par exemple, la gestion des utilisateurs)
* **élastique** (facilement scalable) donc nécessite un déploiement rapide, un service léger, dans le cloud,...
* **automatisation** du processus de build et de déploiement, équipe dédiée et réduite, tests automatisés pour déployer rapidement une nouvelle version,...

> `FaaS` va encore plus loin en ajoutant &laquo; *serverless* &raquo; (sans se soucier du déploiement) et &laquo; *sans état* &raquo; ( programmation fonctionnelle, x -> f(x) )


## Qu'est-ce que Java ?

### Le fonctionnement de la JVM

#### L'interprétation

![Exécution de la JVM]({{site.baseurl}}/assets/img/jvm-execution.png)

1. La JVM est un exécutable qui lit du bytecode puis l'interprète.
2. Le bytecode est dans des packages .jar sous forme de fichiers .class
3. La JVM **recherche** le fichier .class dans les packages .jar, **vérifie** le fichier .class puis le charge
4. Une fois que le bytecode est chargé, la JVM peut l'exécuter (**le semi-interpréter**)

> Exécuter du bytecode a donc un coût :
> 
> * Le bytecode est recherché, vérifié puis interprété par la JVM qui elle-même s'exécute sur le processeur.


#### Le compilateur Just-In-Time (JIT)

![Le compilateur JIT]({{site.baseurl}}/assets/img/jvm-jit.png)

1. Lors de l'exécution d'une méthode Java, le compilateur `C1` de JIT (just-in-time, à la volée) va la compiler en code natif et le `Profiler` va commencer à recueillir des informations sur son utilisation.

	> C1 est un compilateur léger et rapide mais il ne produit pas du code natif optimisé.

1. Losrque le profiler détecte une méthode très utilisée, &laquo; ***Hot*** &raquo;, le compilateur `C2` va se servir des informations du Profiler pour produire un code natif, **agressif**,  optimisé et très bien adapté au contexte d'utilisation.

	> C2 est un compilateur lourd et lent mais il produit un code natif très bien optimisé et très rapide.
	
	> Il y a en réalité un cycle entre la compilation C1 et C2. Le compilateur C2 va souvent recompiler des morceaux de bytecode avec de nouvelles informations provenant du profiler pour produire un binaire toujours plus optimal.

1. Au bout d'un certain temps, lorsque de nombreux morceaux de bytecode auront été compilés par le compilateur C2, l'application Java fonctionnera très rapidement.

> * Il faut donc un temps de chauffe, &laquo; ***warm-up*** &raquo;, à une application Java pour être pleinement fonctionnelle.
> * C'est un réel problème pour un microservice qui doit pouvoir être déployé et fonctionnel très rapidement.


#### L'empreinte mémoire

##### Architecture générale de la JVM 
![Architecture mémoire d'une JVM]({{site.baseurl}}/assets/img/jvm-architecture.png)

##### Détail de 2 espaces mémoires
![Focus sur des espaces mémoires de la JVM]({{site.baseurl}}/assets/img/jvm-memory.png)

La JVM alloue de la mémoire pour l'application mais aussi pour ses propres métadonnées et son fonctionnement :

1. Le &laquo; ***Java Heap*** &raquo; stocke les instances des objets Java.
Il est divisé en 2 parties : le &laquo; ***Young Generation*** &raquo; qui contient les objets récemment créés et le &laquo; ***Tenured Generation*** &raquo; qui contient lui des objets qui ont résisté au ramasse-miettes (&laquo; ***Garbage Collector*** &raquo;).

1. Le &laquo; ***Metaspace*** &raquo; (anciennement &laquo;*PermGen*&raquo;) contient les métadonnées des classes (le bytecode des méthodes, les symboles, les &laquo;constant pools&raquo;, les annotations...).

> * Pour une application de 10Mo, la JVM occupe souvent une taille de 100Mo.
> * Là encore, c'est un problème pour un microservice qui doit avoir une empreinte mémoire la plus petite possible.


### Le fonctionnement des Frameworks Java

Prenons le cas de Spring et Hibernate comme exemple puisque ce sont, là, 2 frameworks les plus couramment utilisés dans les applications Java.

Lorsqu'une application Java, contenant ces frameworks, démarre, voici ce qui se passe :

* Lecture et parsing des fichiers de configuration,
* Scanne complet des classes pour récupérer les métadonnées (annotations, accesseurs,...),
*  Création d'un métamodèle,
*  Préparation de la réflexion,
*  Création des proxies (beaucoup de proxies !),...

Ce sont pourtant des frameworks très utilisés par les développeurs et, en réalité, très bien adaptés aux applications monolithiques.

> * Les frameworks Java amplifient les problèmes de temps de démarrage et de consommation mémoire de la JVM.

---

## On fait quoi à présent ?

On oublie Java ? On se met tous au C++ ??

Rien de tout cela bien sûr. La réponse dans un prochain article présentant GraalVM. Et vous allez voir que ça déménage !

Cheers...


