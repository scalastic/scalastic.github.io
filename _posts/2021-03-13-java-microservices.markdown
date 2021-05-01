---
layout: post
title: Java et les microservices
date: 2021-03-13 15:21:20 +0200
description: "Java et les microservices : temps de démarrage, temps de chauffe, consommation mémoire de la JVM... Faisons un état des lieux."
img: java-like-rusty-container.jpg # Add image post (optional)
fig-caption: Photo de <a href="https://unsplash.com/@darkcut?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Robert MODOUX</a> sur <a href="https://unsplash.com/s/photos/container-rusty?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [Java, Microservices]
lang: fr
permalink: /java-microservices/
---

Cet article est le premier d'une série abordant les concepts de la nouvelle machine virtuelle GraalVM. 

Nous allons aborder ici des notions de bases sur les microservices, sur Java et sa JVM HotSpot. Cela nous donnera une première idée sur l'adéquation de Java au monde des conteneurs et notammement des microservices.

<!--more-->

<hr class="hr-text" data-content="Plan">

* TOC
{:toc}

<hr class="hr-text" data-content="Microservices">

## Qu'est-ce qu'un microservice ?

On peut, pour les plus vieux d'entre nous, considérer les microservices comme le prolongement du concept de `SOA` (Architecture Orientée Service) avec l'avènement du cloud.

Un `microservice` peut se caractériser comme étant :

* Un service conçu pour **gérer une seule fonctionnalité** (par exemple, la gestion des utilisateurs)
* **Elastique**, c'est à dire facilement scalable. Ceci implique un déploiement rapide, un service léger, tout cela, dans un conteneur, voire dans le Cloud.
* **Automatisé**, du processus de build jusqu'au déploiement. Généralement, il est maintenu par une équipe dédiée et réduite, avec des tests automatisés pour déployer rapidement une nouvelle version.

> note "Microservice vs FaaS"
> `FaaS`, pour Functions-as-a-Service, va un peu plus loin dans ce concept, en ajoutant les notions de &laquo; *serverless* &raquo; (l'infrastructure nécessaire au service est de la responsabilité du fournisseur) et &laquo; *sans état* &raquo; (cher à la programmation fonctionnelle, x -> f(x), toujours !)

<hr class="hr-text" data-content="Java">

## Qu'est-ce que Java ?

Tout le monde connait Java ! Un langage interprété par une JVM et portable sur différents systèmes. Révisons tout de même quelques notions sur son fonctionnement interne pour bien en saisir la portée.

### Le fonctionnement de la JVM
<hr class="hr-text" data-content="Interpréteur">

#### L'interprétation

{% figure caption:"Les étapes de l'interprétation du Bytecode par la JVM" class:"article" %}
![Les étapes de l'interprétation du Bytecode par la JVM]({{site.baseurl}}/assets/img/jvm-execution.png)
{% endfigure %}

1. La JVM est un exécutable qui lit du bytecode puis l'interprète.
2. Le bytecode est dans des packages .jar sous forme de fichiers .class
3. La JVM **recherche** le fichier .class dans les packages .jar, **vérifie** le fichier .class puis le charge
4. Une fois que le bytecode est chargé, la JVM peut l'exécuter (**le semi-interpréter**)

> warning ""
> Exécuter du bytecode a donc un coût :
> 
> * Le bytecode est recherché, vérifié puis interprété par la JVM qui elle-même s'exécute sur le processeur.

<hr class="hr-text" data-content="Compilateur JIT">

#### Le compilateur Just-In-Time (JIT)

{% figure caption:"Les étapes de l'optimisation JIT du Bytecode par la JVM" class:"article" %}
![Les étapes de l'optimisation JIT du Bytecode par la JVM]({{site.baseurl}}/assets/img/jvm-jit.png)
{% endfigure %}

1.&nbsp;&nbsp;Lors de l'exécution d'une méthode Java, le compilateur `C1` de JIT (just-in-time, à la volée) va la compiler en code natif et le `Profiler` va commencer à recueillir des informations sur son utilisation.

> info ""
> C1 est un compilateur léger et rapide mais il ne produit pas du code natif optimisé.

2.&nbsp;&nbsp;Losrque le profiler détecte une méthode très utilisée, &laquo; ***Hot*** &raquo;, le compilateur `C2` va se servir des informations du Profiler pour produire un code natif, **agressif**,  optimisé et très bien adapté au contexte d'utilisation.

> info ""
> C2 est un compilateur lourd et lent mais il produit un code natif très bien optimisé et très rapide.

> note "" 
> Il y a en réalité un cycle entre la compilation C1 et C2. Le compilateur C2 va souvent recompiler des morceaux de bytecode avec de nouvelles informations provenant du profiler pour produire un binaire toujours plus optimal.

3.&nbsp;&nbsp;Au bout d'un certain temps, lorsque de nombreux morceaux de bytecode auront été compilés par le compilateur C2, l'application Java fonctionnera très rapidement.

> warning ""
> * Il faut donc un temps de chauffe, &laquo; ***warm-up*** &raquo;, à une application Java pour être pleinement réactive.
> * C'est un réel problème pour un microservice qui doit pouvoir être déployé et opérationnel très rapidement.

<hr class="hr-text" data-content="Mémoire">

#### L'empreinte mémoire

##### Architecture générale de la JVM 

{% figure caption:"Les différentes couches mises en jeu dans une JVM" class:"article" %}
![Les différentes couches mises en jeu dans une JVM]({{site.baseurl}}/assets/img/jvm-architecture.png)
{% endfigure %}


Lorsque l'on regarde l'architecture générale d'une JVM, on ne peut que constater qu'il y a beaucoup de composants. On voit aussi que son espace mémoire est compartimenté.

Concentrons-nous sur 2 d'entre eux.

##### Détail de 2 espaces mémoires

{% figure caption:"Détails de 2 espaces mémoires de la JVM" class:"article" %}
![Détails de 2 espaces mémoires de la JVM]({{site.baseurl}}/assets/img/jvm-memory.jpg)
{% endfigure %}

La JVM alloue de la mémoire pour l'application mais aussi pour ses propres métadonnées et son fonctionnement :

1. Le &laquo; ***Java Heap*** &raquo; stocke les instances des objets Java.
Il est divisé en 2 parties : le &laquo; ***Young Generation*** &raquo; qui contient les objets récemment créés et le &laquo; ***Tenured Generation*** &raquo; qui contient lui des objets qui ont résisté au ramasse-miettes (&laquo; ***Garbage Collector*** &raquo;).

1. Le &laquo; ***Metaspace*** &raquo; (anciennement &laquo;*PermGen*&raquo;) contient les métadonnées des classes (le bytecode des méthodes, les symboles, les &laquo;constant pools&raquo;, les annotations...).

>  warning ""
> * Pour une application de 10Mo, la JVM occupe souvent une taille de 100Mo.
> * Là encore, c'est un problème pour un microservice qui doit avoir une empreinte mémoire la plus petite possible.

<hr class="hr-text" data-content="Frameworks">

### Le fonctionnement des Frameworks Java

Il est, à present, usuel d'embarquer plusieurs frameworks dans une application Java afin de simplifier certains aspects techniques ou bien d'organiser ses couches applicatives.

Prenons le cas de 2 frameworks, sans doute, les plus utilisés dans le monde Java : **Spring** et **Hibernate**.

Voici ce qu'une application Java qui utilise ces frameworks, va exécuter à son démarrage :
1. Lecture et parsing des fichiers de configuration,
1. Scanne complet des classes pour récupérer les métadonnées (annotations, accesseurs,...),
1. Création d'un métamodèle,
1. Préparation de la réflexion,
1. Création des proxies (beaucoup de proxies !),...

Ce sont pourtant des frameworks très utilisés par les développeurs et, en réalité, très bien adaptés aux applications monolithiques.

> warning ""
> * Les frameworks Java amplifient les problèmes de temps de démarrage et de consommation mémoire de la JVM.

<hr class="hr-text" data-content="Conclusion">

## On fait comment à présent ?

> info "Pour résumer"
> Nous avons vu les problèmes de Java :
> * Consommation importante de la mémoire
> * Nécessité d'un temps de chauffe au démarrage
> * Optimisation du code natif au fil de l'eau

A priori, tout ce qu'il ne faut pas pour un microservice.

Alors, que fait-on à présent ? On oublie Java et on se met tous au C++ ??

Rien de tout cela bien sûr. La réponse dans l'article suivant présentant GraalVM. Et vous allez voir que ça déménage !

{{ "||/graalvm-microservices-java/|GraalVM, le futur des applications microservices en Java" | pagination: site.data.i18n.article-previous, site.data.i18n.article-next }}

Cheers...

> info "Et maintenant"
> * Vous avez aimé cet article ? Dites-le ci-dessous afin que le blog gagne en visibilité.
> * Vous avez une question ? Posez-la en commentaire, je m'efforcerai d'y répondre dans les plus brefs délais !!
> 
> Merci à vous !
>
