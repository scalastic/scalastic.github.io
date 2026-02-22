---
layout: post
title: "HexaGlue ou Pourquoi l’Architecture Hexagonale a besoin d’un Compilateur"
date: 2026-01-04 10:52:00 +0200
description: "HexaGlue compile l’infrastructure d’une architecture hexagonale à partir des ports et du modèle métier : moins de glue code, plus de focus sur le business."
img: hexaglue-hexagonal-architecture-compilator.jpg
fig-caption: Photo de <a href="https://unsplash.com/fr/@makitrenko?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Mykyta Kravčenko</a> sur <a href="https://unsplash.com/fr/photos/un-panneau-daffichage-sur-le-bord-de-la-route-r2Pmvr_7Dec?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
      
tags: [HexaGlue, Hexagonal-Architecture, DDD, Clean-Architecture, Java, Maven, Code-Generation, AST, Ports-Adapters, Infrastructure]
lang: fr
permalink: /hexaglue-hexagonal-architecture-compilator/
status: finished
---


L’architecture hexagonale est aujourd’hui largement adoptée dans l’écosystème logiciel.
Ports et adaptateurs, dépendances inversées, domaine isolé : ses principes sont bien connus, documentés et éprouvés par des années de pratique.

Sur le papier, tout semble clair.
Sur le terrain pourtant, lorsqu’on l’applique à des projets réels, un malaise persiste.
Quelque chose, dans la mise en œuvre quotidienne, ne tient pas totalement ses promesses.

Ce décalage n’est pas toujours explicite, mais il se manifeste rapidement dans le code, dans les délais, et dans la fatigue des équipes.
Et c’est précisément ce paradoxe que cet article explore.

Cet article présente **HexaGlue**, un outil open source qui s'attaque à ce problème. Le code source et la documentation sont disponibles dès maintenant :

<div class="project-links">
{% github_card hexaglue/hexaglue %}
<div class='website-card'>
  <div class='panel-body'>
    <div class='name'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM5.78 8.75a9.64 9.64 0 0 0 1.363 4.177c.255.426.542.832.857 1.215.245-.296.551-.705.857-1.215A9.64 9.64 0 0 0 10.22 8.75Zm4.44-1.5a9.64 9.64 0 0 0-1.363-4.177c-.307-.51-.612-.919-.857-1.215a9.927 9.927 0 0 0-.857 1.215A9.64 9.64 0 0 0 5.78 7.25Zm-5.944 1.5H1.543a6.507 6.507 0 0 0 4.666 5.5c-.123-.181-.24-.365-.352-.552-.715-1.192-1.437-2.874-1.581-4.948Zm-2.733-1.5h2.733c.144-2.074.866-3.756 1.58-4.948.12-.197.237-.381.353-.552a6.507 6.507 0 0 0-4.666 5.5Zm10.181 1.5c-.144 2.074-.866 3.756-1.58 4.948-.12.197-.237.381-.353.552a6.507 6.507 0 0 0 4.666-5.5Zm2.733-1.5a6.507 6.507 0 0 0-4.666-5.5c.123.181.24.365.353.552.714 1.192 1.436 2.874 1.58 4.948Z"></path></svg> <a href='https://hexaglue.io' target='_blank' rel='noopener noreferrer nofollow'>hexaglue.io</a>&nbsp;<span class='label'>Site officiel</span></div>
    <div class='description'>Le site officiel du projet HexaGlue. Découvrez le concept, le fonctionnement et les cas d'usage de l'outil.</div>
    <img class='og-image' src='https://hexaglue.io/og/hexaglue.jpg' alt='HexaGlue - site officiel'>
  </div>
</div>
</div>

<hr class="hr-text" data-content="Sommaire">

* TOC
{:toc}


<hr class="hr-text" data-content="Promesse vs Réalité">

## Le Paradoxe de l’Architecture Hexagonale

Sur le plan théorique, l’architecture hexagonale promet beaucoup.
Elle vise un **domaine métier strictement isolé**, des **frontières explicites**, une **indépendance forte vis-à-vis des frameworks** et, en conséquence directe, des **tests plus simples et plus robustes**.

Ces promesses sont réelles.
Elles sont même largement atteintes… du point de vue architectural.

Mais dans le code du quotidien, la réalité est souvent plus nuancée.

À mesure que l’application grandit, on observe :

* une **prolifération de classes d’adaptation**,
* du mapping **répétitif et mécanique**,
* des repositories, contrôleurs, DTO et mappers écrits **à la main**,
* une infrastructure de plus en plus **verbeuse**, fragile et **coûteuse à maintenir**.

Le paradoxe apparaît alors clairement :

> warning ""
> **Le domaine est protégé mais le temps de développement est absorbé par une infrastructure sans valeur métier.**

L’architecture remplit son rôle de garde-fou… au prix d’un effort croissant là où la valeur est la plus faible.


<hr class="hr-text" data-content="Glue Code">

## Le Véritable Problème n’est pas le Domaine

On entend souvent dire que « les frameworks polluent le domaine ».
Dans certains cas, c’est vrai. Mais ce constat, bien que partiellement juste, passe à côté de l’essentiel.

Le cœur du problème n’est pas le domaine.
Il est ailleurs.

**L’infrastructure est, par nature, du *glue code*.**

Un code qui est :

* répétitif,
* largement standardisé,
* fortement dépendant d’outils et de technologies (REST, JPA, messaging, etc.),
* et, par conception, **dépourvu de décisions métier**.

Pourtant, ce code non métier doit malgré tout être :

* maintenu dans le temps,
* testé,
* migré lors des changements de stack,
* refactoré,
* parfois entièrement réécrit à chaque évolution technologique.

La question devient alors difficile à éviter :

> warning ""
> **Pourquoi des développeurs expérimentés passent-ils encore autant de temps à écrire ce type de code ?**


<hr class="hr-text" data-content="Changement de Perspective">

## Et si l’Infrastructure était… Compilée ?

Prenons un peu de distance.

Dans une application hexagonale bien structurée :

* le **domaine** constitue un modèle explicite,
* les **ports** définissent des contrats clairs,
* l’infrastructure n’est qu’une **projection technique** de ces contrats.

Autrement dit :

* le ***quoi*** est déjà connu,
* le ***comment*** obéit à des règles bien établies,
* et le reste est essentiellement ***mécanique***.

À partir de ce constat, une idée s’impose presque naturellement :

> info ""
> **Et si l’infrastructure n’était pas écrite manuellement mais produite automatiquement ?**

- Pas à l’exécution.
- Pas via un framework intrusif.
- Mais **au moment de la compilation**, comme le ferait un véritable compilateur.

<hr class="hr-text" data-content="Automatisation Structurelle">

## HexaGlue : un Compilateur d’Infrastructure

HexaGlue est né de cette idée simple, presque évidente a posteriori :

> note ""
> **Le métier est écrit par des développeurs.**<br>
> **L’infrastructure peut être produite par un compilateur.**

HexaGlue n’est donc pas un simple générateur de code basé sur des templates statiques.<br>
Il repose sur une compréhension **structurelle et globale** de l’application.

### Principe de fonctionnement

HexaGlue adopte une approche directement inspirée des **compilateurs de langages**.

À l’image d’un compilateur moderne qui ne se contente pas de traduire du code source ligne par ligne, HexaGlue ne se limite pas à une génération mécanique de fichiers.
Il **analyse**, **interprète** et **transforme** l’application à partir d’une ***Représentation Intermédiaire***.

Son fonctionnement s’articule autour de trois phases bien distinctes :

{% highlight Text %}
Modélisation → Classification → Génération
{% endhighlight %}


#### 1. Modélisation

À la manière des phases d’analyse syntaxique et sémantique d’un compilateur, HexaGlue commence par analyser l’application dans son ensemble.
Il construit un graphe AST (Abstract Syntax Tree) complet représentant les types, les méthodes, les relations et les dépendances.

Cette étape produit une représentation fidèle du code source, indépendante de toute technologie cible.
À ce stade, HexaGlue ne raisonne pas encore en REST, JPA ou Kafka : il observe et comprend simplement la structure du programme.

#### 2. Classification (modèle intermédiaire)

Le graphe AST est ensuite parcouru et interprété afin de produire un **modèle intermédiaire architectural**.
Ce modèle, comparable à l’*Intermediate Representation* d’un compilateur, ne reflète plus la structure brute du code, mais sa **signification architecturale**.

HexaGlue y identifie explicitement :

* les agrégats, entités et value objects,
* les ports entrants et sortants,
* les relations et dépendances entre concepts métier.

Ce modèle intermédiaire constitue le **cœur du système** : une représentation stable, explicite et exploitable de l’architecture réelle de l’application.

#### 3. Génération

À partir de ce modèle, des plugins spécialisés prennent en charge **une technologie ou un type d’adaptateur donné**.
Chaque plugin sait comment traduire les ports et les contrats du domaine vers une implémentation technique précise : annotations, conventions, signatures, gestion des erreurs, intégration au framework cible.

Le code d’infrastructure est ainsi généré de manière déterministe et reproductible, **sans jamais modifier le domaine**.

> info ""
> **Le domaine et les ports forment le langage source.**<br>
> **Le modèle intermédiaire en est la sémantique.**<br>
> **L’infrastructure est le code compilé.**

<hr class="hr-text" data-content="Approche">

## Une approche qui fait la différence

La majorité des générateurs de code fonctionnent par transformation locale :
un fichier en entrée, un fichier en sortie.

HexaGlue adopte une approche fondamentalement différente.
En disposant d’une vision globale de l’application, il est capable de raisonner sur le **contexte architectural** :

* identifier un agrégat à partir de son usage réel,
* reconnaître un identifiant métier par son rôle dans les ports,
* déterminer la direction d’un port à partir de sa position dans l’architecture.

La génération devient alors **contextuelle et architecturale**, et non plus simplement syntaxique.

<hr class="hr-text" data-content="Clarification">

## Ce que HexaGlue n’est pas

HexaGlue n’est :

* ni un framework applicatif,
* ni une dépendance runtime,
* ni un ORM,
* ni un remplaçant de Spring, JPA ou Hibernate.

## Ce qu'est HexaGlue

HexaGlue est avant tout une **librairie d’analyse et de génération**, conçue pour intervenir **au moment du build**, et non à l’exécution.

À ce titre, elle peut être intégrée :

* dans un **IDE**, pour assister l’analyse ou la génération,
* dans des outils de **CI/CD** ou d’analyse statique,
* ou sous forme de **plugin de build**.

Aujourd’hui, HexaGlue est intégré sous la forme d’un **plugin Maven** : lors de la compilation, il analyse l’application et génère le code d’infrastructure dans `target/generated-sources/`, sans jamais impacter le code métier.

<hr class="hr-text" data-content="Extensibilité">

## Une approche orientée plugins, pas framework

La génération de code produite par HexaGlue ne dépend d’aucun framework applicatif en particulier.

Les technologies telles que Spring, REST, Kafka, MongoDB ou GraphQL sont prises en charge par des **plugins dédiés**, responsables de traduire le modèle architectural vers une implémentation technique donnée.

Chaque plugin :

* s’appuie sur le modèle architectural de l'application,
* applique des règles spécifiques à sa technologie,
* génère le code d’infrastructure correspondant,
* sans jamais modifier ni contaminer le domaine.

Cette séparation permet :

* un domaine **stable et préservé**,
* des ports **durables**,
* une infrastructure **remplaçable et évolutive**.

> info ""
> Changer de stack technique revient à régénérer l’infrastructure à partir d'un autre plugin, en **quelques secondes** plutôt qu’en plusieurs jours.

<hr class="hr-text" data-content="Heuristiques">

## Convention over configuration, sans dogmatisme

HexaGlue n’impose pas :

* de DSL spécifique,
* d’annotations obligatoires,
* de conventions opaques.

Les concepts sont découverts par des **heuristiques** :

* structure des packages,
* conventions de nommage,
* relations entre types,
* signatures des ports.

Les annotations existantes (DDD, architecture) peuvent enrichir l’analyse, mais ne sont jamais obligatoires.

<hr class="hr-text" data-content="Maturité">

## Pourquoi maintenant ?

Parce que le contexte a changé :

* les architectures hexagonales sont maîtrisées,
* les patterns sont stabilisés,
* les stacks techniques se multiplient,
* et le coût réel de l’infrastructure devient visible.

> warning ""
> Écrire manuellement des contrôleurs REST, des adaptateurs JPA ou des mappers mécaniques n’est plus un choix technique :
> c’est un **manque d’automatisation**.

<hr class="hr-text" data-content="État du Projet">

## HexaGlue aujourd’hui

HexaGlue est en développement actif et assumé comme tel.

Il est déjà :

* fonctionnel,
* extensible,
* documenté,
* conçu autour d’une SPI relativement stable,
* pensé pour accueillir des plugins internes ou tiers.

HexaGlue n’est pas un framework de plus.
C’est une **librairie de génération d’infrastructure**, conçue pour s’adapter aux standards, aux conventions et aux contraintes des entreprises et des équipes.


<hr class="hr-text" data-content="Vision">

## Et maintenant ?

HexaGlue n’est pas une solution miracle.
C’est une **direction**.

Une tentative de répondre à une question simple, mais rarement posée :

> note ""
> ***Pourquoi acceptons-nous encore d’écrire à la main***<br>
> ***ce que le compilateur pourrait produire pour nous ?***

Si, pour vous, cette question fait sens :

* explorez le projet,
* testez-le,
* critiquez-le,
* proposez des plugins,
* challengez la vision.

L’infrastructure ne disparaîtra pas.<br>
Mais elle peut devenir **beaucoup moins envahissante**.

HexaGlue explore ce futur.

### TL;DR

> info ""
> **Focus on business code,**<br>
> **not infrastructure glue.**
