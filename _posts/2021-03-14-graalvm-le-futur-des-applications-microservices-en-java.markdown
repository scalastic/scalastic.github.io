---
layout: post
title: GraalVM, le futur des applications microservices en Java
date: 2021-03-14 12:53:00 +0200
description: Temps de démarrage et consommation mémoire de la JVM ne font pas de Java le candidat idéal pour développer des microservices. Mais GraalVM pourrait bien changer la donne...
img: graalvm-brand-new-containers.jpg # Add image post (optional)
fig-caption: Photo de <a href="https://unsplash.com/@ant0ine?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Antoine Petitteville</a> sur <a href="https://unsplash.com/s/photos/containers?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a> # Add figcaption (optional)
tags: [Java, GraalVM, Microservices]
excerpt_separator: <!--more-->
---

Cet article est le deuxième d'une série abordant les concepts introduits dans GraalVM et en quoi ils changent la donne pour utilser Java en tant que langage de programmation dans les architectures microservices.

<!--more-->

<hr class="hr-text" data-content="Plan">

Article précédent : [Java et les microservices]({{site.baseurl}}/java-et-les-microservices/)

2ème article de la série

* TOC
{:toc}

<hr class="hr-text" data-content="Nouvelle VM">

## GraalVM, une nouvelle génération de machine virtuelle

{% figure caption:"L'écosystème de GraalVM" class:"article" %}
![Ecosystème de GraalVM]({{site.baseurl}}/assets/img/graalvm-ecosystem.png)
{% endfigure %}

### Qu'est-ce que c'est ?

* **GraalVM** est une Machine Virtuelle (VM), Open Source, issue d'un projet de recherche chez Oracle Labs.
* Elle est maintenue par une communauté d'acteurs majeurs du net (Oracle, Amazon, Twitter, RedHat notamment avec Quarkus, VMWare pour l'intégration de son framework Spring, ...).

* C'est une **nouvelle génération** de VM, **polyglotte**, c'est à dire qu'elle supporte de nombreux langages, même ceux qui ne génèrent pas de bytecode. A terme, elle pourrait remplacer l'actuelle VM HotSpot.

* Plus de détails sur [https://www.graalvm.org/](https://www.graalvm.org/){:target="_blank" rel="noopener noreferrer nofollow"}

> info "En quelques mots"
> La VM **GraalVM** est couplée à un nouveau compilateur, `Graal`, écrit entièrement en Java (ce qui permet une compilation cyclique) :
> * Il vise à remplacer le compilateur `C2` utilisé pour le **JIT** de la VM **HotSpot** et qui est arrivé en fin de vie car trop complexe à faire évoluer (mélange d'assembleur, C, Java)
> * Le compilateur Graal peut aussi faire de la compilation `AOT` (Ahead-Of-Time, à l'avance) aussi appelée compilation anticipée.

<hr class="hr-text" data-content=Architecture>

### L'architecture de GraalVM

{% figure caption:"Les composants de GraalVM" class:"article" %}
![Les composants de GraalVM]({{site.baseurl}}/assets/img/graalvm-components.png)
{% endfigure %}


#### 1. Le compilateur Graal

* Il compile en Bytecode les langages pour JVM.
* Intégré à la JVM, il est capable de faire de la compilation JIT.
* Il peut aussi faire de la compilation AOT.

#### 2. Le framework Truffle

* Il permet de décrire, sous la forme d'un Abstract Syntax Tree (**AST** ou Arbre Syntaxique), la grammaire de langages inconnus de la JVM.
* Le compilateur Graal, à l'aide des modules Truffle de chaque langage, est capable d'interagir avec eux.
* L'**API Polyglot**, écrite en Java, permet de faire passer des messages de Java vers les autres langages et d'interagir avec eux.

	> note "Exemple de modules Truffle"	
	> * `Graal.js` définie l'AST de JavaScript.
	> * `Sulong` implémente l'AST du bitcode LLVM (C, C++, Rust, Objective-C, Fortran, Mono,...)
	> * Autres modules en cours d'implémentation : 
	>   * `WebAssembly` (pour les applications web), 
	>   * `CUDA` (pour les cartes graphiques NVidia),...

#### 3. La Machine Virtuelle

Deux JVMs peuvent être intégrées à GraalVM en tant que Machine Virtuelle :
* Par défaut, c'est la **JVM HotSpot** qui exécute le bytecode des programmes Java. Mais c'est le compilateur **Graal** qui intervient dans la compilation **JIT**.
* On peut aussi installer la machine virtuelle **SubstrateVM**, incluse dans le module **nativeimage**. C'est cette VM minimaliste qui offre la compilation **AOT**.

#### 4. Les Runtimes

* Ils permettent d'exécuter les langages autres que ceux pris en charge par les JVMs (la JVM HotSpot comme la SubstrateVM).
* Les runtimes `node.js` (ECMAScript compliant) et `llvm` font partie de l'installation standard.
* Les autres runtimes doivent être installés explicitement : l'interpréteur Python 3.7, celui de Ruby 2.6.5 ou encore de GNU R 3.6.1.

<hr class="hr-text" data-content="Résumé">

> info "Les composants de GraalVM :"
> 
> 1. Composants ***Core*** :
> 
> 	* la JVM GraalVM,
> 	* le compilateur Graal,
> 	* un runtime LLVM,
> 	* un runtime JavaScript qui prend en charge Node.js
> 
> 1. Des runtimes ***optionnels*** :
> 
> 	* Native Image qui intègre le compilateur ahead-of-time (AOT)
> 	* LLVM toolchain
> 	* Python interpreter
> 	* Ruby interpreter
> 	* R interpreter
> 	* WebAssembly interpreter (Wasm)

<hr class="hr-text" data-content="Conclusion">

## Et alors ?

On est en droit de se demander à présent, en quoi cela change la donne pour Java et les microservices. 

Certes, il nous fallait passer par cette présentation théorique mais déjà, on peut appréhender tout le potentiel d'une telle refonte :
* Un nouveau compilateur, plus efficace,
* La possibilité de compiler son application directement en code natif,
* La capacité d'intégrer de multiples langages à son application Java,...

Reste à voir en pratique le résultat. C'est ce que nous ferons dans un prochain article.

Cheers...

> info "Et maintenant"
> * Vous avez aimé cet article ? Dites-le ci-dessous afin que le blog gagne en visibilité.
> * Vous avez une question ? Posez-la en commentaire, je m'efforcerai d'y répondre dans les plus brefs délais !!
> 
> Merci à vous !
>