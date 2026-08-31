---
layout: post
title: "Vibe coding : comment garder la maîtrise du code produit par l'IA"
date: 2026-08-31 14:16:00 +0200
description: "Spec-driven development, architecture exécutable, property-based testing, mutation testing, harness engineering : construire le système qui vérifie ce que les agents de coding produisent."
img: vibe-coding-ai-software-quality.jpg
fig-caption: Illustration générée par IA
tags: ["Vibe Coding", "AI", "Coding Agents", "Harness Engineering", "Spec-Driven Development", "Architecture", "Tests", "Craftsmanship"]
lede: "Produire du code n'a jamais été aussi facile. Garantir qu'il reste de qualité demande de concevoir l'usine logicielle autant que l'application."
lang: fr
permalink: /vibe-coding-ai-software-quality/
status: finished
---

Les assistants d'IA ont profondément changé notre manière de développer. Ils ne se contentent plus de compléter quelques lignes de code : les agents de code peuvent désormais explorer un dépôt, implémenter une fonctionnalité, modifier plusieurs composants, écrire des tests, exécuter un build et corriger certaines de leurs propres erreurs.

Le **vibe coding** pousse cette logique à l'extrême : on décrit ce que l'on veut obtenir en langage naturel et on laisse l'IA prendre en charge une grande partie de l'implémentation. Ce qui relevait encore récemment du prototypage rapide commence ainsi à trouver sa place dans de véritables processus de **développement logiciel assisté par IA**.

Le gain de productivité peut être spectaculaire. Mais il déplace aussi le problème : ***La qualité ne se joue plus seulement dans le code produit, mais dans le système qui le produit.***

Car une application ne se résume pas à des fonctionnalités qui semblent fonctionner. Elle doit rester compréhensible, testable et maintenable. Son architecture doit conserver sa cohérence, ses invariants métier rester vrais, ses dépendances rester maîtrisées et chaque évolution éviter de dégrader progressivement la qualité de l'ensemble.

Or le code produit par une IA reste le résultat d'un **processus probabiliste**. Un agent peut mal interpréter une exigence, choisir une solution inutilement complexe, contourner une règle d'architecture, dupliquer une logique existante ou écrire des tests qui confortent sa propre interprétation. Et plus il est capable de produire des modifications rapidement, plus ces dérives peuvent elles aussi se propager rapidement.

La question centrale n'est donc plus seulement « ***Comment faire écrire du bon code à une IA ?*** », elle devient :

> « **Comment construire un environnement de développement dans lequel le logiciel produit avec une IA reste vérifiable, cohérent avec son architecture et maintenable dans la durée ?** »

C'est sous cet angle que des approches comme le *spec-driven development*, les *skills*, les agents spécialisés ou le *harness engineering* deviennent intéressantes. Prises isolément, elles ne résolvent qu'une partie du problème. Réunies dans une même logique, elles dessinent une autre manière d'envisager le développement assisté par IA : non plus chercher à rendre l'agent infaillible, mais construire autour de lui un système capable d'encadrer, vérifier et améliorer ce qu'il produit.


<hr class="hr-text" data-content="Sommaire">

* TOC
{:toc}

<hr class="hr-text" data-content="Oracle">

## 1. Quand l'IA devient son propre juge

Prenons un exemple simple.

Je demande à un assistant « *Implémente cette fonctionnalité et ajoute les tests nécessaires* ». L'agent modifie le code, écrit les tests, exécute la suite de validation puis me répond :

> « Fonctionnalité implémentée. Tous les tests passent. »

À première vue, tout va bien.

Pourtant, un scénario très différent peut se cacher derrière ce constat :

1. l'IA a mal compris le besoin ;
2. elle a implémenté cette mauvaise interprétation ;
3. elle a écrit des tests cohérents avec son interprétation ;
4. les tests sont passés ;
5. elle en a conclu que la fonctionnalité était correcte.

Nous obtenons alors du code testé, une CI verte, peut-être même 100 % de couverture. Et pourtant, le logiciel ne fait pas ce qui était attendu.

> warning "Le problème de l'oracle"
> En test logiciel, l'*oracle* est le mécanisme qui décide si le comportement observé
> est correct. La difficulté classique tient à son absence ou à son coût. Ici, elle
> prend une autre forme : l'oracle existe, mais **l'implémentation et sa validation
> dérivent de la même interprétation initiale**. Comment déterminer, indépendamment de
> celui qui produit la solution, que cette solution est réellement correcte ?

La difficulté dépasse d'ailleurs largement les tests. Un agent peut choisir une architecture puis considérer lui-même qu'elle est satisfaisante, introduire une abstraction puis juger qu'elle améliore la maintenabilité, ou contourner une règle tout en estimant avoir respecté l'intention générale.

Autrement dit, demander à l'IA de produire un résultat puis de juger elle-même qu'il est correct ne crée pas nécessairement une vérification indépendante.

Ajouter un second LLM améliore parfois la situation, mais ne suffit pas à en faire un oracle fiable. Deux modèles peuvent partager les mêmes présupposés, disposer du même contexte ou converger vers la même mauvaise interprétation.

La question devient alors beaucoup plus intéressante :

> « **Comment vérifier le travail d'un agent avec des critères qui ne dépendent pas uniquement de son propre raisonnement ?** »

Cette question n'a rien de nouveau. Elle ramène à une exigence ancienne de l'ingénierie logicielle : **transformer ce que l'on attend du logiciel en contraintes observables et vérifiables.**


<hr class="hr-text" data-content="Contrats">

## 2. Des intentions aux contraintes vérifiables

Dire à une IA de « *respecter l’architecture* », « *écrire du code maintenable* » ou « *bien tester la fonctionnalité* » ne suffit pas. Ces consignes indiquent une direction, mais elles ne permettent pas de savoir objectivement si le résultat la respecte :

- Que signifie exactement « *maintenable* » ?
- Quelle complexité est acceptable ?
- Quelles dépendances entre modules sont autorisées ?
- Quelles règles d'architecture ne doivent jamais être contournées ?
- À partir de quel niveau de duplication une modification doit-elle être refusée ?
- Et comment savoir si les tests vérifient réellement le comportement attendu ?

Pour contrôler le travail d'un agent, il faut donc progressivement transformer ces intentions en **contraintes observables et vérifiables indépendamment de l'implémentation**.

Autrement dit, il ne suffit plus d'expliquer à l'IA ce que l'on attend d'elle. Il faut aussi donner au système les moyens de constater si ces attentes sont réellement respectées.

Une application peut ainsi être considérée comme un ensemble de contrats complémentaires :

| Contrat | Ce qu'il définit | Exemples de vérification |
| --- | --- | --- |
| **Produit** | ce que l'application doit faire | tests d'acceptation, scénarios |
| **Domaine** | les invariants métier | property-based testing |
| **API** | les échanges autorisés | schémas, OpenAPI, types |
| **Architecture** | les dépendances et frontières autorisées | tests d'architecture |
| **Qualité** | complexité, duplication, conventions | analyse statique |
| **Tests** | la capacité des tests à détecter les erreurs | mutation testing |
| **Sécurité** | les comportements et dépendances interdits | SAST, politiques |
| **Performance** | latence, mémoire, débit | benchmarks |
| **Exploitation** | le comportement du logiciel en production | métriques, logs, traces, SLO |

Ces contrats ne sont pas tous exprimables de la même manière ni vérifiables avec les mêmes outils. Mais ils ont un point commun : ils cherchent à déplacer une partie du jugement depuis une consigne interprétable vers un critère que le système peut réellement contrôler.

C'est beaucoup plus robuste qu'un fichier `CLAUDE.md` ou `AGENTS.md` contenant simplement :

{% highlight text %}
Please write clean, maintainable and well-tested code.
{% endhighlight %}

Ce type de consigne reste utile pour orienter l'agent, mais il ne constitue pas une garantie.

> note "La règle générale"
> Tout ce qui est suffisamment important pour ne pas être laissé au hasard devrait, autant que possible, **devenir vérifiable automatiquement**.

<hr class="hr-text" data-content="Architecture">

## 3. L'architecture doit devenir exécutable

Cette logique s'applique particulièrement bien à l'architecture.

Dans beaucoup de projets, les règles d'architecture restent essentiellement déclaratives. On dessine par exemple une organisation en couches :

{% mermaid couches caption="Une organisation en couches, telle qu'elle est dessinée dans la documentation" %}
flowchart TB
    D["DOMAIN<br/>Business rules"]
    A["APPLICATION<br/>Use cases"]
    I["INFRASTRUCTURE<br/>Database · APIs · I/O"]
    D ~~~ A ~~~ I
{% endmermaid %}

puis on précise dans un fichier `ARCHITECTURE.md` que le domaine ne doit jamais dépendre de l'infrastructure.

Pour un développeur, cette documentation sert de référence. Il doit connaître la règle, comprendre pourquoi elle existe et veiller à la respecter lorsqu'il modifie le code.

Un agent peut lui aussi lire cette règle. Mais s'il découvre qu'une dépendance interdite lui permet de résoudre plus facilement la tâche qui lui a été confiée, rien ne garantit qu'il ne l'introduira pas.

Le problème n'est d'ailleurs pas propre à l'IA : les développeurs humains contournent eux aussi parfois une architecture, volontairement ou non. La différence tient surtout à la vitesse et au volume de code qu'un agent peut produire.

Une règle d'architecture importante devrait donc avoir deux représentations complémentaires :

{% mermaid regle-deux-representations caption="Une règle d'architecture qui compte existe deux fois : elle s'explique et elle se contraint" %}
flowchart TB
    ARCH["ARCHITECTURE"]
    ARCH --> DOC["DOCUMENTATION<br/>Explique la règle"]
    ARCH --> CONT["CONTRAINTE EXÉCUTABLE<br/>Fait respecter la règle"]
{% endmermaid %}

Si :

{% mermaid dependance-interdite caption="La dépendance que la règle interdit" %}
flowchart LR
    D["DOMAIN"] --x|"Forbidden dependency"| I["INFRASTRUCTURE"]
{% endmermaid %}

est interdit, la documentation doit expliquer pourquoi. Mais surtout **le build doit échouer lorsque cette dépendance apparaît.**

L'architecture cesse alors d'être seulement une convention à connaître. Elle devient une propriété du logiciel que l'on peut vérifier automatiquement, au même titre qu'un test ou qu'une erreur de compilation.

C'est aussi l'un des enseignements tirés par OpenAI de son [utilisation de Codex](https://openai.com/index/harness-engineering/){:target="_blank" rel="noopener noreferrer nofollow"} sur des codebases largement manipulées par des agents : frontières entre composants, directions de dépendances, linters spécifiques et tests structurels deviennent des mécanismes essentiels pour contenir la dérive architecturale.

Des contraintes que l'on pouvait autrefois introduire progressivement au fur et à mesure qu'un projet grandissait gagnent ainsi à être présentes beaucoup plus tôt lorsque des agents participent fortement au développement.

La raison est simple : **un agent peut produire du code beaucoup plus vite qu'une architecture ne se dégrade habituellement sous l'effet des modifications humaines.**

Une entorse ponctuelle peut rapidement devenir un précédent, être reproduite ailleurs, puis finir par constituer la nouvelle structure de fait d'une application.

Rendre l'architecture exécutable permet précisément d'interrompre cette dérive avant qu'elle ne s'installe.

> info "Article dédié"
> [HexaGlue ou pourquoi l'architecture hexagonale a besoin d'un compilateur]({{site.baseurl}}/hexaglue-hexagonal-architecture-compilator/), où la règle de dépendance n'est plus une convention documentée mais une contrainte que le build vérifie.

<hr class="hr-text" data-content="Contrôles">

## 4. Guider l'IA ne suffit pas, il faut vérifier ce qu'elle produit

Une grande partie des pratiques actuelles consiste à mieux préparer le travail de l'agent. On lui fournit par exemple :

* une spécification ;
* la documentation du projet ;
* des exemples ;
* les décisions d'architecture ;
* le modèle du domaine ;
* les conventions de développement ;
* des *skills* ;
* la documentation des API qu'il peut utiliser.

Tout cela est utile, et souvent indispensable. Mais ces informations ont essentiellement un rôle : **augmenter la probabilité que l'agent prenne de bonnes décisions avant de modifier le code**.

Elles ne prouvent pas que le résultat sera correct.

Il faut donc compléter ce guidage par une seconde boucle : une fois le code produit, le confronter à des contrôles capables d'observer ce qui a réellement été fait.

{% mermaid guidage-et-verification caption="Deux boucles distinctes : guider avant l'action, observer ce qui a réellement été fait après" %}
flowchart TB
    AVANT["AVANT L'ACTION<br/>Guider et orienter<br/><br/>spécification · architecture · ADR<br/>modèle du domaine · skills<br/>exemples · documentation"]
    AGENT["AGENT"]
    CODE["CODE"]
    APRES["APRÈS L'ACTION<br/>Vérifier et challenger<br/><br/>compilation · types · lint<br/>analyse statique · tests d'architecture<br/>tests unitaires · property-based testing<br/>tests d'intégration · mutation testing<br/>sécurité · performance"]
    AVANT --> AGENT --> CODE --> APRES
{% endmermaid %}

C'est la distinction que l'on retrouve dans les travaux sur le [*harness engineering*](https://martinfowler.com/articles/harness-engineering.html){:target="_blank" rel="noopener noreferrer nofollow"} entre **feed-forward** et **feedback** :

- Le *feed-forward* cherche à orienter l'agent avant qu'il agisse.
- Le *feedback* observe le résultat et permet de décider s'il peut être accepté, corrigé ou rejeté.

La différence est fondamentale :

> note "Instructions et contrôles"
> - Les instructions indiquent à l'agent **ce qu'il devrait faire**.
> - Les contrôles vérifient **ce qu'il a réellement fait**.

Tous ces contrôles n'ont cependant pas la même nature.

### Les contrôles déterministes

Certains répondent à des règles que l'on sait vérifier mécaniquement :

{% mermaid controles-deterministes caption="Chacun de ces contrôles rend un verdict binaire, reproductible d'une exécution à l'autre" %}
flowchart TB
    COMP["COMPILATION<br/>✓"]
    TYPES["TYPES<br/>✓"]
    TESTS["TESTS<br/>✓"]
    LINT["LINT<br/>✓"]
    DEP["DÉPENDANCES<br/>✓"]
    STRUCT["STRUCTURE<br/>✓"]
    COMP ~~~ LINT
    TYPES ~~~ DEP
    TESTS ~~~ STRUCT
{% endmermaid %}

Le résultat ne dépend pas d'une interprétation.

- Une dépendance interdite est présente ou elle ne l'est pas.
- Un type est compatible ou il ne l'est pas.
- Un test passe ou échoue.

Ces contrôles sont particulièrement précieux parce qu'ils sont reproductibles, rapides et indépendants du raisonnement de l'agent.

### Les contrôles qui nécessitent un jugement

D'autres questions sont beaucoup plus difficiles à traduire en règles mécaniques :

{% mermaid controles-de-jugement caption="Aucune de ces questions n'admet de réponse calculable" %}
flowchart TB
    ABS["ABSTRACTION<br/><br/>Cette abstraction<br/>est-elle réellement utile ?"]
    CPX["COMPLEXITÉ<br/><br/>Cette implémentation<br/>est-elle trop complexe ?"]
    RESP["RESPONSABILITÉS<br/><br/>Cette classe porte-t-elle<br/>trop de responsabilités ?"]
    DUP["DUPLICATION SÉMANTIQUE<br/><br/>Ces deux portions de code<br/>expriment-elles la même logique ?"]
    ABS ~~~ RESP
    CPX ~~~ DUP
{% endmermaid %}

Un LLM peut être très utile pour ce type de revue. Mais il faut garder à l'esprit que son jugement reste, lui aussi, probabiliste.

La règle générale devient donc :

> note "Le déterminisme d'abord"
> Tout ce qui peut être vérifié de manière déterministe devrait l'être. **Le jugement d'un LLM intervient surtout là où nous ne savons pas encore exprimer la règle mécaniquement.**

L'objectif n'est pas d'opposer les deux approches. Elles sont complémentaires : les contrôles déterministes fixent les garde-fous les plus solides, tandis que l'IA peut examiner les zones plus difficiles à formaliser.


<hr class="hr-text" data-content="Tests">

## 5. Multiplier les moyens de prendre le code en défaut

Le TDD est le premier réflexe, il semble tout indiqué pour le développement assisté par IA.

{% mermaid cycle-tdd caption="Un test qui échoue, le code qui le fait passer, puis la refactorisation" %}
flowchart TB
    E["EXIGENCE"] --> T["ÉCRIRE UN TEST QUI ÉCHOUE"]
    T --> P["FAIRE PASSER LE TEST"]
    P --> R["REFACTORER"]
    R --> T
{% endmermaid %}

Mais le TDD a été conçu pour des développeurs humains. Il sert à ralentir la main, à éviter la sur-ingénierie, à forcer la formulation de l'attendu avant de se lancer, bref à encadrer une pratique. Un agent n'a aucun de ces besoins.

> note "Robert C. Martin, l'auteur du Clean Code, a assoupli ses propres règles"
> Il n'impose pas le TDD à ses agents et ne relit plus leur code. Il le juge sur des mesures : couverture, dépendances, complexité, mutation testing.  Il a même relevé son seuil de complexité cyclomatique de 4 à 6, hésite même avec 8, une IA lisant sans peine du code plus dense qu'un humain. [Entretien sur Youtube](https://www.youtube.com/watch?v=zcLPGC-tvgk){:target="_blank" rel="noopener noreferrer nofollow"}

Ce qui résiste à la transposition, c'est autre chose : l'exigence formulée en test avant l'écriture du code, et la boucle de retour immédiate qu'elle donne à l'agent.

Cela ne suffit pourtant pas à lever le problème rencontré plus tôt. Qui a écrit le test ? L'IA. Et surtout : **comment savons-nous que ce test est capable de détecter une mauvaise implémentation ?** Si l'agent interprète mal une exigence puis écrit un test conforme à cette mauvaise interprétation, le cycle peut parfaitement se terminer avec tous les tests au vert.

Il faut donc compléter les tests classiques par d'autres techniques capables d'attaquer l'implémentation sous des angles différents.

### Property-based testing : chercher les contre-exemples

Un test classique vérifie généralement quelques cas choisis à l'avance :

{% highlight text %}
remise(100) → 0%
remise(150) → 7.50%
remise(200) → 10%
{% endhighlight %}

Le *property-based testing* part d'une autre idée : plutôt que d'énumérer des exemples, on exprime une propriété qui doit rester vraie pour tout un ensemble de valeurs.

{% highlight text %}
∀ montant ≥ 0
0 ≤ remise(montant) ≤ montant
{% endhighlight %}

L'outil génère ensuite de nombreuses entrées et cherche automatiquement un contre-exemple.

On ne demande donc plus seulement « *Est-ce que ces quelques exemples fonctionnent ?* » mais :

> **« Existe-t-il une entrée pour laquelle notre propriété cesse d'être vraie ? »**

Cette approche est particulièrement intéressante avec des agents capables d'aider à identifier des invariants, puis d'exploiter les contre-exemples découverts pour corriger l'implémentation.

> info "Property-based testing et agents"
> [Finding bugs with Claude and property-based testing](https://www.anthropic.com/research/property-based-testing){:target="_blank" rel="noopener noreferrer nofollow"}, où Claude infère des propriétés avec Hypothesis et découvre des bugs dans plusieurs grandes bibliothèques Python.

### Fuzzing : confronter le logiciel à l'imprévu

Là où le property-based testing explore un domaine d'entrées que l'on a défini, le *fuzzing* va chercher celles que personne n'avait prévues. Il soumet le logiciel à un grand nombre d'entrées générées automatiquement, souvent invalides, inhabituelles ou situées aux limites de ce qui était prévu :

{% mermaid fuzzing caption="Le fuzzing cherche un comportement qui ne devrait jamais se produire" %}
flowchart TB
    E["ENTRÉES IMPRÉVUES<br/>invalides · extrêmes · bruit"]
    P["PROGRAMME"]
    S["SIGNAUX D'ÉCHEC<br/>crash · hang · exception<br/>surconsommation · interdit"]
    E --> P --> S
{% endmermaid %}

L'objectif n'est pas nécessairement de connaître à l'avance le résultat exact attendu pour chaque entrée. On cherche plutôt à provoquer un comportement qui **ne devrait jamais se produire**.

- Un parseur ne doit pas planter quelle que soit l'entrée reçue.
- Une API ne doit pas provoquer une consommation mémoire incontrôlée avec une requête malformée.
- Un décodeur ne doit pas entrer dans une boucle infinie lorsqu'il rencontre des données inattendues.

Le fuzzing est donc particulièrement adapté aux parsers, protocoles, API, formats de fichiers, entrées utilisateur et plus généralement aux frontières du système.

Là encore, l'intérêt avec un agent est évident : il peut exploiter automatiquement le cas qui provoque l'échec, le réduire, comprendre son origine et proposer une correction.

### Mutation testing : vérifier les tests eux-mêmes

Là où le property-based testing et le fuzzing éprouvent le programme par ses entrées, le *mutation testing* n'en génère aucune. Il modifie le programme lui-même pour y introduire de petites erreurs :

{% mermaid mutation-testing caption="Le mutant qui survit signale un comportement que la suite de tests ne surveille pas" %}
flowchart TB
    C["CODE TESTÉ"] --> M["MUTATION<br/>modification volontaire du comportement"]
    M --> Q{"LES TESTS<br/>ÉCHOUENT ?"}
    Q -->|"oui"| D["mutant détecté"]
    Q -->|"non"| S["mutant survivant"]
{% endmermaid %}

Un outil de mutation remplace par exemple `price > 100` par `price >= 100`. La modification est minuscule et parfaitement plausible, et c'est précisément ce qui la rend révélatrice : si aucun test ne s'intéresse au cas où `price` vaut exactement 100, la suite passera au vert avant comme après. Le mutant « survit », et sa survie signale que cette frontière n'était vérifiée par personne.

D'autres mutations inversent une condition, suppriment un appel ou modifient une valeur retournée. Le principe ne change pas : on abîme volontairement le programme pour voir si la suite de tests s'en aperçoit. Le rapport de l'outil se lit alors comme un score, la part des mutants que les tests ont su tuer.

Le *mutation testing* répond donc à une question très différente de la couverture :

> **Mes tests savent-ils réellement détecter du code incorrect ?**

Une ligne peut être exécutée par un test sans que son comportement soit réellement vérifié. Une couverture de 100 % ne garantit donc pas que la suite de tests constitue un bon filet de sécurité.

Deux limites méritent toutefois d'être connues. Certaines mutations ne modifient pas le comportement observable du programme : ces **mutants équivalents** ne peuvent être tués par aucun test et abaissent le score sans que la suite de tests soit en cause, ce qui interdit de viser un score parfait. Par ailleurs, l'outil rejoue la suite de tests pour chaque mutant, ce qui rend l'analyse lente et la réserve en pratique au code dont une dégradation silencieuse coûterait cher.

Avec une quantité croissante de code produite par des agents, mesurer la capacité des tests à détecter les erreurs devient au moins aussi intéressant que mesurer les lignes qu'ils exécutent.

### Des techniques complémentaires, pas interchangeables

Ces techniques ne sont pas interchangeables, elles cherchent des défauts différents :

| Technique | Question posée |
| --- | --- |
| **Tests classiques** | les cas que nous avons prévus fonctionnent-ils ? |
| **Property-based testing** | existe-t-il un contre-exemple à nos propriétés ? |
| **Fuzzing** | une entrée imprévue peut-elle provoquer un comportement anormal ? |
| **Mutation testing** | nos tests détectent-ils réellement une modification incorrecte du programme ? |

On peut encore compléter cet arsenal avec les tests de contrats, les tests différentiels ou les tests métamorphiques selon la nature du logiciel.

L'objectif n'est évidemment pas d'utiliser toutes ces techniques sur chaque ligne de code. Mais la confiance ne doit pas reposer sur un seul mécanisme de validation.

> note "L'indépendance des vérifications"
> Plus les moyens de prendre l'implémentation en défaut sont indépendants, **moins une même erreur de raisonnement a de chances de traverser tout le système de vérification**.

<hr class="hr-text" data-content="Spécifications">

## 6. Une exigence doit aussi définir comment elle sera vérifiée

Le **spec-driven development** part du bon constat : plutôt que de demander directement à un agent de coder, mieux vaut commencer par transformer le besoin en une spécification structurée.

[GitHub Spec Kit](https://github.github.com/spec-kit/){:target="_blank" rel="noopener noreferrer nofollow"} formalise par exemple un processus de ce type :

{% mermaid spec-kit caption="Le processus formalisé par GitHub Spec Kit" %}
flowchart LR
    S["SPECIFY"] --> P["PLAN"] --> T["TASKS"] --> I["IMPLEMENT"]
{% endmermaid %}

C'est déjà un progrès important par rapport à une consigne donnée directement en langage naturel. L'agent dispose d'un cadre plus précis, d'un plan et d'un ensemble de tâches explicites.

Mais une spécification, même très détaillée, ne suffit pas. Elle décrit ce que le logiciel doit faire. Elle ne dit pas nécessairement **comment nous saurons que ce comportement est réellement respecté**.

Il faut donc compléter le processus ainsi :

{% mermaid processus-specification caption="L'étape 2 est celle que l'on saute presque toujours : définir la vérification avant de produire" %}
flowchart TB
    E1["1. CADRER LE BESOIN<br/>Intention → Clarification → Spécification"]
    E2["2. DÉFINIR LES GARDE-FOUS<br/>Dériver les invariants → Définir l'architecture<br/>→ Définir la vérification"]
    E3["3. PRODUIRE<br/>Plan → Implémentation"]
    E4["4. VÉRIFIER ET CHALLENGER<br/>Vérification → Vérification adversariale → Revue"]
    E1 --> E2 --> E3 --> E4
{% endmermaid %}

L'étape essentielle est introduite avant même l'implémentation :

> note "L'étape que l'on saute presque toujours"
> Définir **comment une exigence sera vérifiée** avant de demander à l'agent de la coder.

### Prenons une règle simple

*Un utilisateur ne peut consulter que les documents appartenant à son organisation* : la spécification exprime clairement l'intention.

Mais elle devrait immédiatement conduire à une seconde question : **comment vérifierons-nous que cette propriété reste vraie dans toutes les situations importantes ?**

Plusieurs mécanismes peuvent alors être envisagés :

* des tests d'acceptation pour les scénarios attendus ;
* un invariant métier exprimant la règle indépendamment de l'interface ;
* du *property-based testing* pour rechercher des combinaisons auxquelles nous n'avions pas pensé ;
* un contrôle d'autorisation centralisé plutôt qu'une vérification dispersée dans le code ;
* un test d'architecture empêchant certaines couches de contourner ce contrôle ;
* éventuellement des tests de sécurité cherchant explicitement à accéder aux données d'une autre organisation.

La vérification n'arrive donc plus seulement après l'implémentation. Elle devient **une partie de la conception**.

Et cela change profondément la relation avec l'agent : on ne lui demande plus seulement de produire une solution correspondant à une description, on définit également les moyens indépendants qui permettront de mettre cette solution en défaut.

Le *spec-driven development* devient alors plus qu'une manière de mieux préparer le travail de l'IA. Il devient un moyen de transformer progressivement une intention humaine en **propriétés du logiciel que le système saura vérifier**.

<hr class="hr-text" data-content="Dépôt">

## 7. Le dépôt devient une base de connaissance pour les humains et les agents

Une autre tentation fréquente consiste à concentrer toutes les instructions destinées à l'IA dans un unique fichier `AGENTS.md` ou `CLAUDE.md`.

On y accumule progressivement les règles d'architecture, les conventions de nommage, les commandes utiles, les pratiques Git, le modèle métier, les exceptions, la documentation des API ou encore les procédures de test.

L'idée paraît logique : plus l'agent dispose d'informations, mieux il devrait travailler. Mais un contexte volumineux n'est pas nécessairement un bon contexte.

> warning "Le piège du fichier unique"
> Lorsque toutes les règles sont réunies dans un même document, certaines deviennent difficiles à retrouver, d'autres se contredisent, vieillissent ou continuent d'être chargées alors qu'elles ne sont pas pertinentes pour la tâche en cours.

Le problème n'est donc pas seulement de fournir **beaucoup de contexte** à l'agent, mais de lui permettre d'accéder **au bon contexte au bon moment**.

OpenAI explique avoir rencontré cette difficulté avec Codex. Plutôt qu'un `AGENTS.md` contenant toute la connaissance du projet, ils privilégient un fichier relativement court servant de point d'entrée vers des références de documentation structurée.

Par exemple :

{% mermaid carte-du-depot caption="Le fichier d'entrée ne cherche plus à tout expliquer : il indique où trouver quoi" %}
flowchart LR
    A["AGENTS.md / CLAUDE.md<br/>Project map / index"]
    A --> ARCH["ARCHITECTURE.md<br/>Architecture"]
    A --> DD["DESIGN DOCS<br/>Design"]
    A --> ADR["ADRs<br/>Decisions"]
    A --> DOM["DOMAIN<br/>Knowledge"]
    A --> QUA["QUALITY<br/>Rules"]
    A --> EP["EXECUTION PLANS<br/>Plans"]
    A --> GD["GENERATED DOCS<br/>Generated info"]
{% endmermaid %}

Le fichier d'entrée devient une **carte du projet** : où trouver les règles d'architecture, les décisions passées, la connaissance métier, les plans d'exécution ou les exigences de qualité.

Anthropic dit la même chose de `CLAUDE.md` : viser moins de 200 lignes et n'y garder que ce qui doit être vrai à chaque session. Sa documentation insiste sur un point contre-intuitif : découper le fichier en imports `@fichier` améliore l'organisation mais ne réduit pas le contexte, puisque les fichiers importés sont chargés au démarrage. Ce qui allège réellement la fenêtre, ce sont les mécanismes qui ne se déclenchent qu'au moment utile, un `CLAUDE.md` de sous-répertoire chargé quand l'agent lit ce répertoire, une règle restreinte à certains chemins, ou un *skill* dont seul le descriptif est connu tant qu'il n'est pas invoqué.

Ces imports ont en revanche un usage où ils excellent. Un dépôt qui possède déjà un `AGENTS.md` n'a pas à le dupliquer : un `CLAUDE.md` réduit à `@AGENTS.md`, suivi des seules consignes propres à Claude, suffit à ce que les deux outils lisent les mêmes instructions.

Le dépôt ne contient donc plus seulement **le code de l'application**, mais aussi **la connaissance nécessaire pour comprendre et faire évoluer ce code**. Cette connaissance devient elle-même un élément de l'architecture du projet. Elle doit être organisée, maintenue, versionnée et suffisamment explicite pour être exploitable aussi bien par les développeurs que par les agents.

C'est une forme de **context engineering à l'échelle du dépôt** : plutôt que de construire un prompt toujours plus volumineux, on construit un environnement documentaire dans lequel l'agent peut retrouver les informations dont il a besoin lorsqu'il en a besoin.

Cette approche présente aussi un avantage important : **les humains et les agents travaillent à partir de la même source de vérité**. L'architecture, les décisions techniques, les invariants métier ou les règles de qualité ne vivent plus dans la mémoire d'une équipe d'un côté et dans les instructions de l'IA de l'autre.

Ils font partie du projet lui-même.

<hr class="hr-text" data-content="Rôles">

## 8. Un agent ne devrait pas être juge de son propre travail

Le plus simple serait de tout confier au même agent :

{% highlight text %}
Implémente la fonctionnalité,
écris les tests,
vérifie l'architecture,
relis ton code
et dis-moi si tout est correct.
{% endhighlight %}

Mais on retrouve alors le problème rencontré plus tôt : **le même raisonnement sert à produire la solution puis à l'évaluer**.

Une organisation plus robuste consiste à découper le travail en rôles distincts :

{% mermaid roles-separes caption="Chaque étape examine le travail sous un angle différent, avec son propre contexte" %}
flowchart TB
    EX["EXIGENCES"] --> SP["SPÉCIFICATION"]
    SP --> ARCH["ARCHITECTURE"]
    SP --> CT["CONCEPTION DES TESTS"]
    ARCH --> IMP["IMPLÉMENTATION"]
    CT --> IMP
    IMP --> DET["CONTRÔLES DÉTERMINISTES"]
    DET --> RCONF["REVUE DE CONFORMITÉ<br/>À LA SPÉCIFICATION"]
    DET --> RCODE["REVUE DU CODE"]
    RCONF --> RARCH["REVUE D'ARCHITECTURE"]
    RCODE --> RARCH
    RARCH --> PR["PR"]
{% endmermaid %}

Chaque étape examine ainsi le travail sous un angle différent. La revue de conformité cherche à répondre à une question précise :

> **Le comportement produit correspond-il réellement à ce qui était demandé ?**

- La revue du code s'intéresse plutôt à sa lisibilité, sa complexité ou sa maintenabilité.
- La revue d'architecture vérifie, elle, que la solution reste cohérente avec les règles structurelles du projet.

Cette séparation ne rend évidemment pas les LLM indépendants par magie : deux agents peuvent encore commettre la même erreur. Mais il existe un autre levier important, **séparer aussi leurs contextes**.

L'agent qui vérifie la conformité d'une spécification n'a pas nécessairement besoin de connaître tout le raisonnement ayant conduit à l'implémentation. Lui fournir directement les justifications du premier agent risque même de l'inciter à suivre le même chemin de pensée plutôt qu'à examiner le résultat avec un regard neuf. On peut donc distinguer :

{% mermaid roles-et-contextes caption="Un rôle, un contexte adapté : chaque agent ne reçoit que les informations utiles à son jugement" %}
flowchart LR
    IMP["AGENT D'IMPLÉMENTATION<br/>Produire la modification"] --> IMPC["Spécification<br/>Architecture<br/>Code existant"]
    CONF["REVUE DE CONFORMITÉ<br/>Vérifier le besoin"] --> CONFC["Spécification<br/>Modification produite"]
    CODE["REVUE DE CODE<br/>Vérifier la qualité"] --> CODEC["Règles de qualité<br/>Modification produite"]
    ARCH["REVUE D'ARCHITECTURE<br/>Vérifier la structure"] --> ARCHC["Règles d'architecture<br/>Graphe des dépendances<br/>Modification produite"]
{% endmermaid %}

L'objectif n'est pas d'isoler artificiellement les agents, mais de leur donner **uniquement le contexte nécessaire au rôle qu'ils doivent jouer**. Cette séparation compte parfois davantage que le recours à des modèles différents. Un deuxième modèle exposé au même raisonnement, aux mêmes hypothèses et aux mêmes justifications peut simplement reproduire le premier jugement, là où un agent placé dans un rôle clairement défini, avec un contexte différent et des critères de vérification explicites, a davantage de chances de réellement challenger le travail produit.

> note "Séparer les rôles, et surtout les contextes"
> Séparer les agents est utile. Séparer **ce qu'on leur demande de juger** et **les informations à partir desquelles ils le jugent** l'est encore davantage.


<hr class="hr-text" data-content="Harness">

## 9. Le modèle ne travaille jamais seul

Lorsqu'on parle de développement assisté par IA, une grande partie de l'attention se porte encore sur le choix du modèle :

* Quel modèle raisonne le mieux ?
* Lequel comprend le mieux un grand dépôt ?
* Lequel produit le meilleur code ?

Ces questions comptent, mais elles ne suffisent plus.

Un agent de coding ne se résume pas au modèle qui génère du code. Il travaille à l'intérieur d'un environnement qui sélectionne son contexte, lui fournit des outils, organise son travail, exécute ses commandes, observe leurs résultats et décide de la suite.

Cet environnement comprend notamment :

{% mermaid harness caption="Le harness : ce qui entoure le modèle et détermine ce qu'il peut produire" %}
flowchart TB
    subgraph H["HARNESS"]
        C["COMPRENDRE<br/>Contexte<br/>Mémoire"]
        A["AGIR<br/>Outils · Skills<br/>Sandbox<br/>Planification"]
        V["CONTRÔLER<br/>Vérification<br/>Feedback"]
        M["MODÈLE"]
        C --- M
        A --- M
        V --- M
    end
{% endmermaid %}

C'est cet ensemble que l'on désigne généralement par le terme **harness**.

Le *harness engineering* consiste à considérer ce dispositif non plus comme un simple assemblage autour du modèle, mais comme un véritable objet d'ingénierie. La question n'est alors plus seulement « ***Quel modèle utiliser ?*** », elle devient :

> « **Dans quel système ce modèle doit-il travailler pour produire du code de manière fiable ?** »

Le changement de perspective est important.

Un très bon modèle auquel on fournit un dépôt, quelques instructions et un terminal peut produire rapidement une solution qui fonctionne tout en dégradant l'architecture, en dupliquant une logique existante ou en écrivant des tests insuffisants.

À l'inverse, un modèle moins performant, mais placé dans un environnement qui lui fournit le bon contexte, limite ses actions et confronte systématiquement son travail à des contrôles indépendants, peut produire des modifications beaucoup plus robustes.

Le choix du modèle devient alors une question économique autant que technique. Sur des tâches bien cadrées, un modèle plus petit rend souvent un résultat équivalent à celui d'un modèle bien plus gros, pour un coût par token plusieurs fois moindre et une réponse plus rapide. La bonne question n'est plus « quel est le modèle le plus puissant ? », mais « quel est le plus petit modèle que ce harness rend suffisant ? ».

> note "Le modèle ne fait pas tout"
> La qualité du résultat ne dépend pas seulement de l'intelligence du modèle, mais aussi de **la qualité du système qui organise et contrôle son travail**.

C'est précisément ce que cherche à construire le *harness engineering* : non pas un meilleur prompt ni même nécessairement un meilleur agent, mais un environnement capable de guider l'agent, d'observer ses actions, de détecter ses erreurs et de lui fournir les informations nécessaires pour les corriger.

<hr class="hr-text" data-content="Rétroaction">

## 10. Chaque erreur doit renforcer le système

Même avec de bonnes spécifications, des contrôles automatiques et plusieurs niveaux de revue, des erreurs passeront. La question importante devient alors « que fait-on de ces erreurs une fois qu'elles ont été découvertes ? ».

Imaginons qu'un agent introduise une dépendance interdite. La réaction la plus immédiate consiste à corriger le code puis à ajouter une consigne, « À l'avenir, n'utilise plus cette dépendance ».

Le problème est résolu pour cette fois. Mais rien ne garantit que le même agent, ou un autre, ne reproduira pas exactement la même erreur quelques jours plus tard. Une approche plus robuste consiste à poser une autre question :

> « **Pourquoi notre système a-t-il permis cette erreur ?** »

La correction ne porte alors plus uniquement sur le code. Elle porte aussi sur le dispositif qui produit et vérifie ce code.

{% mermaid axes-de-renforcement caption="Les quatre prises sur lesquelles une erreur peut être transformée en renforcement" %}
flowchart LR
    K["CONNAISSANCE"] --> K2["Documentation · Mémoire · Contexte"]
    R["RÈGLES"] --> R2["Architecture tests · Linters"]
    V["VÉRIFICATION"] --> V2["Regression · PBT · Mutation · Fuzzing"]
    E["EXÉCUTION"] --> E2["Skills · Workflows · Tools"]
{% endmermaid %}

Le principe est simple :

{% mermaid boucle-de-correction caption="La correction ne porte pas seulement sur le code, mais sur le dispositif qui l'a laissé passer" %}
flowchart TB
    ERR["ERREUR DÉTECTÉE"] --> CAUSE["CAUSE IDENTIFIÉE"]
    CAUSE --> CODE["CORRIGER LE CODE"]
    CAUSE --> SYS["AMÉLIORER LE SYSTÈME"]
    CODE --> DUR["MÊME CLASSE D'ERREURS<br/>PLUS DIFFICILE À REPRODUIRE"]
    SYS --> DUR
    DUR --> ERR
{% endmermaid %}

Une erreur devient ainsi autre chose qu'un incident ponctuel. Elle devient une occasion de **renforcer durablement le système de développement**.

C'est cette logique que Birgitta Böckeler décrit notamment à travers une [*steering loop*](https://martinfowler.com/articles/harness-engineering.html){:target="_blank" rel="noopener noreferrer nofollow"} : lorsqu'un défaut récurrent apparaît, on ne se contente pas de demander à l'agent de « faire plus attention ». On cherche à transformer ce défaut en nouvelle connaissance, nouvelle règle ou nouveau contrôle du harness.

L'idée n'est d'ailleurs pas nouvelle en ingénierie logicielle. Lorsqu'un bug important apparaît en production, une bonne pratique consiste déjà à ajouter un test de régression afin qu'il ne puisse plus passer inaperçu.

Le développement assisté par IA généralise cette logique.

> note "Le principe"
> Chaque défaut découvert devrait, lorsque c'est possible, **laisser derrière lui un système un peu plus difficile à tromper**.

La recherche commence même à pousser cette idée plus loin avec l'[**Agentic Harness Engineering**](https://arxiv.org/abs/2604.25850){:target="_blank" rel="noopener noreferrer nofollow"} : analyser les trajectoires suivies par les agents, identifier les causes de leurs échecs, modifier certains composants du harness puis mesurer si ces changements améliorent réellement leurs performances.

Cette automatisation reste expérimentale. Mais elle révèle une évolution importante : le harness ne sert plus seulement à contrôler la production du code. **Il peut lui-même évoluer à partir des défauts qu'il observe.**

On obtient alors une véritable boucle de rétroaction :

{% mermaid boucle-de-retroaction caption="Le harness ne contrôle plus seulement la production du code : il évolue à partir des défauts qu'il observe" %}
flowchart TB
    AGENT["AGENT"] --> CODE["CODE"]
    CODE --> CTRL["CONTRÔLES"]
    CTRL --> DEF["DÉFAUT DÉTECTÉ"]
    DEF --> CORR["CORRECTION"]
    CORR --> HARN["AMÉLIORATION DU HARNESS"]
    HARN --> AGENT
{% endmermaid %}

Et c'est précisément à ce stade que le développement assisté par IA commence à ressembler à un **système de contrôle en boucle fermée**.

<hr class="hr-text" data-content="Boucle fermée">

## 11. Software Engineering as a Control System

L'agent produit une modification. Des contrôles observent le résultat. Les écarts sont détectés. Le code est corrigé. Et lorsqu'un défaut révèle une faiblesse du processus lui-même, le harness évolue pour rendre cette classe d'erreurs plus difficile à reproduire.

Cette description en rappelle une autre. Dans un système de contrôle classique, on définit une cible, on observe l'état réel du système, on mesure l'écart, puis on agit pour le réduire. Pour un logiciel, cette cible rassemble tout ce que nous voulons préserver :

{% mermaid cible-du-logiciel caption="La cible : tout ce que les modifications successives doivent préserver" %}
flowchart TB
    SPEC["SPÉCIFICATIONS"] --> CIBLE["CIBLE<br/>DU LOGICIEL"]
    INV["INVARIANTS<br/>MÉTIER"] --> CIBLE
    ARCH["ARCHITECTURE"] --> CIBLE
    QUAL["QUALITÉ"] --> CIBLE
    SEC["SÉCURITÉ"] --> CIBLE
    PERF["PERFORMANCE"] --> CIBLE
{% endmermaid %}

L'agent agit ensuite sur le logiciel en produisant des modifications. Mais on ne se contente pas de lui faire confiance. On observe le résultat au moyen de plusieurs « capteurs » : ces contrôles mesurent différentes propriétés du logiciel et permettent de détecter un écart avec la cible.

Le harness peut alors décider de la suite :

{% mermaid observer-decider caption="Les capteurs mesurent l'écart avec la cible, le harness décide de la suite" %}
flowchart TB
    AGENT["AGENT<br/>produit une modification"]
    CB["CODEBASE<br/>système modifié"]
    OBS["OBSERVER<br/><br/>Compilation · Types · Tests · Linters<br/>Architecture · Property-based testing<br/>Fuzzing · Mutation testing · Security<br/>Performance · Observability"]
    DEC["DECIDE<br/><br/>Accept · Correct · Replan<br/>Retry implementation · Strengthen a check<br/>Evolve rules"]
    AGENT --> CB --> OBS --> DEC
{% endmermaid %}

La boucle complète ressemble alors à ceci :

{% mermaid boucle-fermee caption="Le développement assisté par IA vu comme un système de contrôle en boucle fermée" %}
flowchart TB
    INT["INTENTION<br/>HUMAINE"] --> CIBLE["CIBLE<br/><br/>Spécifications · Invariants<br/>Architecture · Qualité<br/>Sécurité · Performance"]

    CIBLE --> CMP{"MESURER<br/>L'ÉCART"}

    HARN["HARNESS<br/>CONTRÔLEUR"] --> AGENT["AGENT<br/>ACTIONNEUR"]
    AGENT --> CB["CODEBASE<br/>SYSTÈME RÉGULÉ"]
    CB --> ETAT["ÉTAT DU LOGICIEL<br/><br/>Comportement · Structure<br/>Qualité · Propriétés non fonctionnelles"]
    ETAT --> CAPT["CAPTEURS<br/><br/>Tests · Analyse statique · Architecture<br/>PBT · Fuzzing · Mutation<br/>Sécurité · Performance · Observabilité"]
    CAPT --> CMP

    CMP -->|"écart détecté"| HARN
    CMP -->|"cible respectée"| OK["ACCEPTER<br/>LA MODIFICATION"]

    CMP -.->|"contrôle insuffisant"| AMEL["AMÉLIORER<br/>LE HARNESS"]
    AMEL --> HARN
{% endmermaid %}

Chaque pièce du montage occupe alors une place précise dans la boucle :

| Rôle dans un système de contrôle | Équivalent dans le développement assisté par IA |
| --- | --- |
| **La cible** | les spécifications, les invariants et les contraintes |
| **Le système régulé** | le logiciel, que l'on cherche à maintenir dans cette cible |
| **Les capteurs** | les tests, analyseurs, métriques et fitness functions |
| **Le contrôleur** | le harness, qui organise le travail et exploite les retours obtenus |
| **L'actionneur** | l'agent, qui produit les modifications demandées |
| **La boucle de retour** | mesurer les écarts, corriger le code et, si nécessaire, renforcer le système de contrôle lui-même |

Il ne faut évidemment pas prendre cette analogie au pied de la lettre. Un logiciel n'est pas un procédé industriel et toutes ses qualités ne sont pas mesurables avec la précision d'un capteur physique.

Mais cette représentation oblige à poser les bonnes questions :

- Quelle est exactement la cible ?
- Quelles propriétés savons-nous observer ?
- Quels écarts pouvons-nous détecter automatiquement ?
- Que fait le système lorsqu'un contrôle échoue ?
- Et surtout : que changeons-nous lorsqu'une erreur révèle que nos contrôles étaient insuffisants ?

C'est un changement de perspective important.

Le problème n'est plus de trouver le prompt qui permettra à l'IA de produire directement la bonne solution. Il est de construire **un système dans lequel chaque modification est confrontée à une cible explicite, observée par des contrôles indépendants et réinjectée dans une boucle de correction**.

C'est ce qu'on pourrait appeler :

> note "Software Engineering as a Control System"
> Non plus seulement mieux programmer avec une IA, mais **concevoir le système qui permet de maîtriser ce qu'elle produit**.

<hr class="hr-text" data-content="Ingénieur">

## 12. Le développeur programme aussi le système qui produit le logiciel

Dans une représentation très simplifiée du développement traditionnel, le développeur transforme directement un besoin en code :

{% mermaid developpement-traditionnel caption="Une chaîne courte, où le développeur est le seul intermédiaire" %}
flowchart TB
    B["besoin"] --> D["développeur"] --> C["code"]
{% endmermaid %}

Avec des agents capables de prendre en charge une part croissante de l'implémentation, cette relation s'allonge. Le développeur ne travaille plus uniquement sur le code produit.

{% mermaid ingenieur-systeme caption="Concevoir, contrôler, outiller : trois activités qui précèdent l'agent" %}
flowchart TB
    BESOIN["BESOIN"] --> ING["INGÉNIEUR"]
    ING --> CONC["CONCEVOIR<br/><br/>Spécifications<br/>Architecture<br/>Invariants"]
    ING --> CTRL["CONTRÔLER<br/><br/>Fitness fn<br/>Qualité<br/>Contrôles<br/>Évaluation"]
    ING --> OUT["OUTILLER<br/><br/>Outils<br/>Harness<br/>Feedback"]
    CONC --> AGENT["AGENT"]
    CTRL --> AGENT
    OUT --> AGENT
    AGENT --> CODE["CODE"]
{% endmermaid %}

Cela ne signifie évidemment pas que l'ingénieur cesse de comprendre ou de modifier le code. Au contraire, il doit être capable de définir ce qu'il attend du logiciel avec suffisamment de précision pour que cette attente puisse être transmise à l'agent, puis vérifiée indépendamment de lui.

Plus la production de code devient rapide, plus d'autres compétences prennent de l'importance :

* formaliser une exigence ;
* identifier les invariants du domaine ;
* définir les frontières architecturales ;
* choisir les bons mécanismes de vérification ;
* distinguer ce qui peut être contrôlé automatiquement de ce qui nécessite encore un jugement ;
* analyser les défauts pour améliorer le système de développement lui-même.

La valeur se déplace donc en partie de **la production directe du code** vers **la conception du cadre dans lequel il est produit**. C'est une évolution importante du rôle de l'ingénieur logiciel : il ne programme plus seulement l'application.

> note "Le déplacement du rôle"
> L'ingénieur programme aussi **les conditions dans lesquelles cette application peut être correctement produite, vérifiée et maintenue**.

<hr class="hr-text" data-content="Conclusion">

## 13. Du vibe coding à l'ingénierie du système de production

On peut lire l'évolution récente du développement assisté par IA comme une succession de déplacements.

1. Avec le **prompt engineering**, la question était « *Comment mieux demander du code ?* »
2. Puis est venu le **context engineering** : « *Quelles informations donner au modèle pour qu'il travaille correctement ?* »
3. Avec l'**agent engineering**, le périmètre s'est encore élargi : « *Quels outils, quelles mémoires et quelles boucles lui fournir ?* »
4. Puis le **harness engineering** a déplacé la question vers l'environnement complet de l'agent : « *Comment organiser, contraindre et vérifier son travail ?* »

À chaque étape, on s'éloigne un peu plus de l'idée qu'un meilleur modèle ou un meilleur prompt suffiraient à résoudre le problème. La question devient plus générale :

> **Comment concevoir le système qui produit le logiciel ?**

C'est précisément ce que résume l'idée de **Software Engineering as a Control System**. Le code produit par l'IA n'est plus un résultat auquel il faudrait simplement faire confiance : il est confronté à des spécifications, des invariants, des règles d'architecture, des tests, des analyseurs et des critères de qualité qui permettent d'observer ses écarts et de déclencher une correction.

Et lorsqu'un défaut révèle une faiblesse du dispositif lui-même, cette faiblesse doit à son tour devenir une nouvelle règle, un nouveau test, une nouvelle documentation ou un nouveau contrôle.

L'objectif n'est donc pas de supprimer toute erreur. Ce serait irréaliste, et ce n'est d'ailleurs pas ainsi que l'ingénierie logicielle a progressé : les développeurs humains se trompent eux aussi, et c'est précisément pour cette raison que nous avons construit au fil du temps des compilateurs, des systèmes de types, des tests, des revues de code, de l'analyse statique, de la CI/CD ou encore de l'observabilité.

Les coding agents ne rendent pas ces pratiques obsolètes.

**Ils rendent leur systématisation encore plus nécessaire.**

Plus le code devient facile et rapide à produire, plus il devient important de savoir définir ce qu'est un logiciel acceptable, mesurer les écarts avec cette cible et empêcher les mêmes défauts de se répéter.

Le véritable enjeu n'est donc pas de construire une IA capable d'écrire parfaitement du logiciel.

Il est de construire une fabrique dans laquelle une erreur, qu'elle provienne d'un humain ou d'une IA, **a de moins en moins de chances de passer inaperçue et de plus en plus de chances d'améliorer le système qui l'a laissée passer.**

C'est là que le *vibe coding* devient une ingénierie.

> note "Et vous ?"
> Beaucoup d'organisations hésitent encore, et beaucoup de développeurs utilisent déjà ces outils sans le dire. Cette prudence n'a rien d'irrationnel : elle repose sur une intuition juste, qu'un code que personne ne sait vérifier est une dette, quel qu'en soit l'auteur.
>
> Mais l'usage clandestin est le pire des deux mondes : ce qui n'est pas déclaré n'est pas vérifié. La question n'est donc pas de savoir s'il faut autoriser l'IA, mais ce qu'il faut avoir construit pour que la question cesse de se poser. **Que manque-t-il, chez vous, pour que le travail d'un agent soit vérifiable au même titre que celui d'un humain ?**

<hr class="hr-text" data-content="Ressources">

## Ressources

* **Le harness et son ingénierie**

  * [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/){:target="_blank" rel="noopener noreferrer nofollow"} : le retour d'expérience d'OpenAI sur une codebase largement modifiée par des agents
  * [Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html){:target="_blank" rel="noopener noreferrer nofollow"} : l'article de Birgitta Böckeler, dont la *steering loop*
  * [Agentic Harness Engineering](https://arxiv.org/abs/2604.25850){:target="_blank" rel="noopener noreferrer nofollow"} : l'automatisation de l'analyse des trajectoires d'agents, encore expérimentale

* **Spécifier et vérifier**

  * [Spec Kit](https://github.github.com/spec-kit/){:target="_blank" rel="noopener noreferrer nofollow"} : le processus *specify / plan / tasks / implement* de GitHub
  * [Finding bugs with Claude and property-based testing](https://www.anthropic.com/research/property-based-testing){:target="_blank" rel="noopener noreferrer nofollow"} : Claude et Hypothesis lancés sur de grandes bibliothèques Python
  * [github.com/mattpocock/skills](https://github.com/mattpocock/skills){:target="_blank" rel="noopener noreferrer nofollow"} : un jeu de *skills* orientées pratiques d'ingénierie

* **Sur ce blog**

  * [HexaGlue ou pourquoi l'architecture hexagonale a besoin d'un compilateur]({{site.baseurl}}/hexaglue-hexagonal-architecture-compilator/) : rendre une règle de dépendance exécutable plutôt que documentée
  * [Le guide ultime pour maîtriser l'architecture hexagonale : focus sur le domaine]({{site.baseurl}}/hexagonal-architecture-domain/) : les invariants métier et les frontières qu'un test d'architecture protège

> note ""
> Cet article a été rédigé avec l'aide de LLM et relu par la seule personne qui en avait écrit le plan. C'est exactement la configuration décrite en première partie, où celui qui produit est aussi celui qui juge. Les erreurs restantes sont donc, en toute rigueur, les miennes. 😬