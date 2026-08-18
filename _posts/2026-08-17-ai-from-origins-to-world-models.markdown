---
layout: post
title: "Ce que les LLM ne Feront Jamais : l'Histoire de l'IA des Perceptrons aux Modèles du Monde"
date: 2026-08-18 12:06:00 +0200
description: "Pourquoi les modèles de langage ne mènent pas à l'intelligence, et ce que Yann Le Cun propose à la place : modèles du monde, JEPA, apprentissage auto-supervisé."
img: ai-from-origins-to-world-models.jpg
fig-caption: Illustration générée par IA
tags: ["AI", "LLM", "Neural Networks", "Deep Learning", "JEPA", "World Models", "Yann Le Cun", "Self-Supervised Learning"]
lede: "70 ans de réseaux de neurones et deux crises majeures plus tard, entraîner les modèles sur toujours plus de texte ne suffira pas à faire émerger l'intelligence."
lang: fr
permalink: /ai-from-origins-to-world-models/
status: finished
---

Voici un calcul qui devrait déranger tous ceux qui pensent que l'intelligence artificielle est en train d'atteindre le niveau humain.

Un grand modèle de langage (Large Language Model), comme le moteur de ChatGPT, Claude ou Gemini, est aujourd'hui entraîné sur environ 20 000 milliards de mots, soit à peu près 30 000 milliards de **tokens** (les unités élémentaires manipulées par le modèle, correspondant généralement à un mot ou à une partie de mot). À raison d'environ trois octets par token, **cela représente de l'ordre de 10<sup>14</sup> octets**, soit à peu près l'équivalent de tout le texte publiquement accessible sur Internet. Un humain qui lirait douze heures par jour mettrait 400 000 ans à en venir à bout.

Prenons maintenant un enfant de quatre ans. Il a passé environ 16 000 heures éveillé. Ses deux nerfs optiques regroupent quelque deux millions de fibres nerveuses et transmettent à son cerveau environ deux mégaoctets d'information par seconde. Le calcul est simple : 16 000 heures × 3 600 secondes × 2 Mo. **On obtient là encore un ordre de grandeur de 10<sup>14</sup> octets.**

<div class="key-figures">
  <div class="figure">
    <span class="figure-label">Un grand modèle de langage</span>
    <span class="figure-value">10<sup>14</sup></span>
    <span class="figure-note">octets de texte, soit la quasi-totalité de ce qui est publiquement lisible sur Internet.</span>
  </div>
  <div class="figure">
    <span class="figure-label">Un enfant de quatre ans</span>
    <span class="figure-value">10<sup>14</sup></span>
    <span class="figure-note">octets reçus par la vision, en 16 000 heures d'éveil.</span>
  </div>
</div>

Le même volume. Un enfant de quatre ans a reçu par la vision autant d'information que le plus gros modèle de langage jamais entraîné sur tout le texte du monde. Et cet enfant sait des choses qu'aucun modèle de langage ne sait : que les objets tombent, qu'un verre poussé par le haut peut basculer, qu'une porte fermée reste fermée. À dix ans, il accomplira sans y penser des tâches que le meilleur robot du monde échoue à exécuter. À dix-sept ans, il apprendra à conduire en une quinzaine d'heures, là où les entreprises de voiture autonome disposent de millions d'heures d'enregistrement.

C'est la thèse que défend **Yann Le Cun**, l'un des trois chercheurs qui ont fait renaître les réseaux de neurones dans les années 2010 : on n'atteindra pas l'intelligence humaine en empilant du texte. Il faudra autre chose.

Cet article raconte comment on en est arrivé là, l'histoire des réseaux de neurones, le fonctionnement des modèles actuels, leurs limites et ce que pourrait être cette autre chose.

<hr class="hr-text" data-content="Sommaire">

* TOC
{:toc}

<hr class="hr-text" data-content="Histoire">

## 1. Une Histoire Faite de Hauts et de Bas

### Les années 50 : la reconnaissance de formes

L'idée fondatrice est simple et vieille. Dans les années 1950, on cherche à faire reconnaître des formes à une machine : une lettre, un chiffre. Le dispositif, appelé **perceptron**, calcule une somme pondérée des pixels de l'image : chaque pixel est multiplié par un coefficient, on additionne tout, et si le résultat dépasse un seuil, la machine annonce « c'est un C ».

Toute la question est de trouver les bons coefficients. On les appelle des **poids**, et le principe de l'apprentissage machine tient là-dedans : ne pas programmer les règles, mais laisser la machine ajuster ses poids à partir d'exemples.

Ces travaux naissent au croisement de trois communautés qui s'ignorent à moitié : les statisticiens, les ingénieurs du traitement du signal adaptatif, et les tenants de la **cybernétique**, le courant de pensée qui, après-guerre, tente de décrire ensemble les machines et les organismes vivants par la boucle information / contrôle / rétroaction. Le domaine finira par s'appeler *reconnaissance des formes statistiques*.

### 1969 : le premier coup d'arrêt

En 1969, **Seymour Papert**, professeur au MIT, co-signe un ouvrage qui démontre les limites mathématiques du perceptron. Un perceptron seul ne sait résoudre que des problèmes simples. L'effet est dévastateur : le financement se tarit, le domaine des réseaux de neurones s'effondre pour une décennie.

Pourtant, dix ans plus tard, Papert défend une position qui semble presque à l'opposé de celle qu'on lui associe depuis 1969. En France, lors d'un débat célèbre entre **Jean Piaget**, le psychologue suisse du développement de l'enfant, et **Noam Chomsky**, le linguiste américain, la question est celle de l'origine du langage : est-il en grande partie inné, ou se construit-il par l'apprentissage ? Papert se range alors du côté de Piaget et de l'apprentissage. Celui qui avait contribué à discréditer les premiers réseaux de neurones souligne désormais qu'à partir de mécanismes très simples, une machine peut apprendre des comportements étonnamment complexes. **Il ne renie pas sa critique des perceptrons ; il défend en revanche une idée qui deviendra centrale quelques décennies plus tard : la complexité peut émerger de l'apprentissage.**

Le jeune Yann Le Cun lira la transcription de ce débat. Il en gardera une phrase, attribuée à Piaget qui ne l'a jamais prononcée mais qui résume sa pensée. Retenez-la. Cette phrase contient en germe toute la critique des LLM :

> citation "Attribué à tort à Jean Piaget"
> L'intelligence, ce n'est pas ce que l'on sait, c'est ce que l'on fait quand on ne sait pas.

### Les années 80 : la rétropropagation et l'âge d'or

Le déblocage vient d'une idée d'une simplicité désarmante : au lieu d'un seul étage de calcul, on en empile plusieurs, séparés par des fonctions non linéaires. C'est le principe de ce qu'on appellera plus tard l'**apprentissage profond** (*deep learning*) : « profond » ne veut rien dire d'autre que « à plusieurs étages ».

Reste à savoir comment ajuster les poids de tous les étages à la fois. La réponse s'appelle la **rétropropagation du gradient** : on part de l'erreur mesurée en sortie et on la fait remonter couche par couche, en sens inverse, pour savoir de combien corriger chaque poids. Mathématiquement, ce n'est rien d'autre que la règle de dérivation des fonctions composées, connue depuis Newton et Leibniz. Il aura fallu attendre les années 80 pour que quelqu'un pense à l'appliquer à l'apprentissage machine.

Yann Le Cun soutient sa thèse sur ce sujet en 1987 à Paris. Il part faire un post-doctorat d'un an à l'université de Toronto auprès de **Geoffrey Hinton** (l'un des principaux artisans du retour des réseaux de neurones, futur prix Nobel de physique), puis rejoint fin 1988 les **Bell Labs**, le célèbre laboratoire de recherche de l'opérateur téléphonique américain AT&T, dans le New Jersey. Il y restera douze ans.

Les Bell Labs de cette époque sont un mythe, et la culture y est explicite. Le directeur du groupe, le physicien **Larry Jackel**, avait monté en 1985 une équipe consacrée aux réseaux de neurones sur les conseils de **John Hopfield**, physicien de Princeton dont les travaux (les **réseaux de Hopfield**, des réseaux à mémoire associative inspirés de la physique des matériaux magnétiques) vaudront le prix Nobel de physique 2024, partagé avec Hinton pour ses **machines de Boltzmann** (un autre modèle de réseau où l'apprentissage est décrit en termes de température et d'énergie, emprunt direct à la physique statistique).

Le principe des Bell Labs est simple : on recrute des gens brillants, on leur donne les moyens de travailler et on les laisse tranquilles. Quand Le Cun, encore à Toronto, demande timidement un ordinateur pour son arrivée, on commande, rien que pour lui, une machine du type de celles qui servaient jusque-là de serveur central à tout un département. Devant son étonnement, Jackel répond : *« You don't get famous by saving money. »*

C'est là que naissent les **réseaux de neurones convolutifs**. L'idée lui vient du cortex visuel : au lieu de connecter chaque neurone à tous les pixels de l'image, on ne le connecte qu'à un petit voisinage, et on réutilise les mêmes poids partout. Conséquence remarquable, dite d'**équivariance par translation**, lorsque l'objet se déplace dans l'image, la réponse du réseau reste la même. Le réseau détecte donc les objets où qu'ils soient.

Les applications arrivent vite : lecture automatique des montants sur les chèques bancaires, exploitée commercialement du milieu des années 90 au début des années 2000. Aujourd'hui, les réseaux convolutifs sont partout où il faut de la vision en temps réel : du freinage automatique d'urgence et de l'analyse d'imagerie médicale jusqu'à la reconnaissance faciale aux frontières, la surveillance de populations ou la reconnaissance de cibles par les drones militaires.

### Le milieu des années 90 : le second hiver, la limite technologique

À partir de 1996, le domaine retombe. Les raisons sont moins théoriques que matérielles, et l'explication mérite d'être connue de quiconque s'intéresse à l'open source.

Il n'y avait pas d'outils. Pas de Python, pas de bibliothèques partagées, pas de plateforme d'échange de code : **SourceForge**, le premier grand hébergeur de projets open source, n'apparaîtra qu'en 1999, et Internet n'était pas encore là. Chaque équipe travaillait sur un système propriétaire différent : stations Sun, Silicon Graphics, systèmes AIX, IRIX, HP-UX. Quiconque voulait entraîner un réseau de neurones devait d'abord investir six mois à un an dans l'écriture de sa propre plateforme logicielle.

Le Cun et **Léon Bottou**, un jeune polytechnicien rencontré en 1987, avaient contourné le problème en construisant leurs propres outils : un simulateur de réseaux de neurones piloté par un interpréteur **Lisp** (un langage où le programme est lui-même une donnée manipulable, ce qui en fait un outil de choix pour construire d'autres langages). Ils l'écrivent sur des ordinateurs personnels Amiga. Le système, baptisé SN puis Lush une fois publié en open source en 2002, leur servira jusqu'en 2011. C'est ce qui leur donnait, selon Le Cun, des « super-pouvoirs » : ils pouvaient essayer des idées que les autres ne pouvaient pas implémenter.

> note "Ce qu'il faut en retenir"
> Un domaine scientifique n'avance pas seulement au rythme de ses idées, mais au rythme auquel ses idées peuvent circuler et être reproduites.

### 2010 : le réveil, puis la consécration

Trois chercheurs persistent pendant cette traversée du désert. Yann Le Cun, Geoffrey Hinton et **Yoshua Bengio**, professeur à Montréal. Au milieu des années 2000, ils décident de rebaptiser le domaine (c'est ainsi que l'expression *deep learning* entre dans le vocabulaire) et proposent de nouvelles méthodes. À partir de 2010, ça marche. Trois domaines basculent coup sur coup : la reconnaissance de la parole, la reconnaissance d'images, puis le traitement automatique de la langue.

En 2013, Le Cun rejoint Facebook et fonde le **FAIR** (*Fundamental AI Research*), le laboratoire de recherche fondamentale de l'entreprise. L'antenne parisienne, créée en 2015, comptera plus de 140 personnes dont une quarantaine de doctorants en résidence, avec une douzaine de thèses soutenues par an. Son effet sur l'écosystème français est considérable : une bonne partie des chercheurs et fondateurs de start-up françaises en IA y sont passés, deux des créateurs de Mistral notamment. C'est aussi à Paris, par une équipe d'une douzaine de personnes presque toutes françaises, qu'a été produit fin 2022 le premier modèle **Llama**, la famille de modèles de langage ouverts de Meta. Le Cun tient à préciser qu'il n'y a apporté aucune contribution technique : sa seule action aura été de pousser pour son ouverture en open source.

Enfin, en 2018, Le Cun, Bengio et Hinton reçoivent le **prix Turing**, l'équivalent du prix Nobel pour l'informatique.

<hr class="hr-text" data-content="Mécanismes">

## 2. Comment Ça Marche Vraiment

Cette section est la seule un peu technique. Elle tient en trois idées et elle vaut l'effort car tout le reste en découle.

### Idée 1 : on n'écrit pas le programme, on l'entraîne

Pour beaucoup de tâches, personne ne sait écrire le programme. Écrire à la main un programme qui décide si une image contient un piéton est hors de portée : la variabilité est trop grande.

Ce qu'on sait faire, en revanche, c'est écrire un programme très court (une demi-page) qui fait des additions, des multiplications et des comparaisons, avec des coefficients laissés en blanc. Ensuite on ajuste ces coefficients à partir d'exemples.

### Idée 2 : apprendre en corrigeant ses erreurs

On dispose d'une collection d'exemples : par exemple, des images accompagnées d'étiquettes (labels) indiquant ce qu'elles représentent. On définit alors une fonction de coût (en anglais **loss function**) qui mesure l'écart entre la prédiction de la machine et la réponse attendue, par exemple en calculant la moyenne des carrés des erreurs. Cette fonction dépend des poids du réseau : plus son résultat est faible, meilleure est la prédiction. Entraîner le réseau consiste donc à ajuster progressivement ses poids pour réduire cette erreur.

Comment la minimiser ? Par **descente de gradient**. Le gradient, c'est la pente : il indique dans quelle direction l'erreur augmente le plus vite. On avance donc à petits pas dans la direction opposée. Le pas s'appelle le **taux d'apprentissage**. On recommence des millions de fois.

C'est tout. La régression linéaire, apprise en cours de statistiques élémentaires, c'est déjà ce principe-là.

### Idée 3 : empiler les couches, et faire remonter l'erreur

Une simple somme pondérée ne suffit pas à reconnaître une image. On empile donc plusieurs étages : une matrice de poids, une fonction non linéaire, une autre matrice, une autre non-linéarité, etc. C'est le deep learning, la multiplication des couches.

Pour ajuster les poids d'un étage intermédiaire, il faut savoir de combien il contribue à l'erreur finale. C'est ce que fait la **rétropropagation** : on remonte de proche en proche, en multipliant à chaque étage par la **matrice jacobienne** du bloc (le tableau de toutes les dérivées partielles de ses sorties par rapport à ses entrées, qui répond à la question « si je perturbe légèrement cette entrée, de combien bouge cette sortie ? »). Pour un bloc linéaire, cette matrice est simplement la transposée de la matrice des poids.

En pratique, personne n'écrit ça à la main. Les bibliothèques modernes (**PyTorch**, développée par Meta et devenue le standard de fait) construisent automatiquement la fonction de rétropropagation à partir de la fonction de calcul. Cette technique s'appelle la **différenciation automatique**, et sa puissance dépasse largement l'apprentissage machine.

### Deux grandes architectures

Un réseau de neurones, ce n'est donc que des couches, des poids et un gradient. Ce qui distingue les modèles, c'est la manière dont on structure ces couches : leur **architecture**. Deux familles dominent.

Les **réseaux convolutifs**, déjà décrits, équivariants par translation : ils dominent la vision en temps réel.

Les **transformers**, apparus en 2017, dominent aujourd'hui le traitement du langage. Leur nom, contrairement à celui des réseaux convolutifs, ne décrit pas vraiment l'opération qu'ils effectuent. Leur mécanisme central est l'**attention** : chaque élément de la séquence peut être mis en relation avec tous les autres, quelle que soit leur distance. Sans information supplémentaire, ce mécanisme est **équivariant par permutation** : si l'on réordonne les vecteurs d'entrée, les vecteurs de sortie sont réordonnés de la même manière. Le réseau sait donc traiter les relations entre les éléments, mais pas leur ordre. Pour le langage, on lui ajoute alors explicitement une **information de position**, afin qu'il puisse distinguer non seulement quels mots sont présents et comment ils se rapportent les uns aux autres, mais aussi dans quel ordre ils apparaissent.

<hr class="hr-text" data-content="Les LLM">

## 3. Les LLM : Ce qu'ils Savent Faire et Ce qui leur Échappe

### Comment on entraîne un modèle de langage

L'architecture qui a fait basculer le monde s'appelle **GPT**, pour *Generative Pre-trained Transformer* (transformer génératif pré-entraîné).

Le mot important est *pre-trained*. On n'entraîne pas le modèle pour une tâche précise (traduire, résumer ou répondre à des questions) mais sur une tâche beaucoup plus générale : **prédire le token suivant** dans une séquence. C'est ce qu'on appelle l'**apprentissage auto-supervisé** : aucun humain n'a besoin d'indiquer la bonne réponse, puisqu'elle se trouve déjà dans le texte. Dans la phrase « Le chat dort sur le canapé », par exemple, « chat » est la réponse attendue après « Le », « dort » après « Le chat », et ainsi de suite.

Le tour de force architectural tient en une contrainte très simple : le réseau est **causal**. Lorsqu'il doit prédire le token suivant, il ne peut utiliser que les tokens qui le précèdent. Un mécanisme de masquage dans l'attention lui interdit de regarder la suite du texte. Il ne peut donc pas connaître la réponse à l'avance : il doit apprendre, à partir de tout ce qu'il a vu auparavant, quel token a le plus de chances de venir ensuite.

Les premières générations procédaient autrement, avec un **encodeur-décodeur** (un modèle en deux blocs, l'un qui comprime le texte d'entrée, l'autre qui reconstruit le texte masqué) ; c'était le principe de BERT. On s'est aperçu que pour passer à l'échelle, il valait mieux supprimer l'encodeur et ne garder que le décodeur causal.

Un LLM moderne est constitué de milliers de milliards de paramètres. Il en résulte une forme de compression de la quasi-totalité du savoir déclaratif humain accessible en ligne.

### Les quatre limites

Ces systèmes, dit Le Cun, ne comprennent pas le monde physique, n'ont pas de mémoire persistante, n'ont pas vraiment de capacité de raisonnement, et pas de capacité de planification. Reprenons les deux dernières, qui sont les plus intéressantes.

**Le raisonnement.** Un LLM possède bien un **espace latent** : à l'intérieur du réseau, les mots sont transformés en vecteurs continus de grande dimension, qui représentent leurs propriétés, leur contexte et leurs relations. C'est dans cet espace que s'effectuent les calculs du modèle.

La difficulté apparaît entre deux étapes de génération. Un LLM fonctionne de manière **autorégressive** : il effectue ses calculs internes, produit un token, ajoute ce token au contexte, puis recommence pour produire le suivant. Autrement dit, ses riches représentations internes ne sont pas directement prolongées d'une étape à l'autre comme un raisonnement continu : elles aboutissent à un symbole discret, à partir duquel commence l'étape suivante.

C'est l'un des points que critique Le Cun. Un système capable de raisonner devrait, selon lui, pouvoir effectuer plusieurs étapes de calcul **directement dans son espace latent**, en manipulant des représentations abstraites sans devoir les convertir à chaque fois en mots.

Aujourd'hui, une façon courante d'améliorer le raisonnement d'un LLM consiste justement à lui faire produire davantage d'étapes intermédiaires : le fameux *raisonnement pas à pas* (**chain of thought**). Cela lui donne davantage de calcul, mais sous la forme d'une séquence plus longue de tokens. **Le Cun défend une autre approche : laisser le raisonnement se poursuivre dans l'espace latent avant, éventuellement, de le traduire en langage.**

**La planification.** Le Cun critique la mode des systèmes dits *agentiques* :

> citation "Yann Le Cun"
> Je ne comprends pas comment les gens s'imaginent construire des systèmes agentiques qui marchent sans que ces systèmes aient la capacité de prédire les conséquences de leurs actions.

Son image : on peut prendre quelqu'un qui ne connaît rien à la cuisine et lui faire appliquer la recette d'un grand chef. Ça marchera. Mais quand ça ratera, il ne saura pas pourquoi. Les systèmes agentiques actuels sont entraînés à suivre des recettes ; ils accumulent des recettes ; ils n'ont pas de modèle d'interaction des ingrédients entre eux.

### Le paradoxe de Moravec

Ce que les LLM font bien (les mathématiques, le code, le texte juridique) n'est pas un hasard. Ce sont les domaines où la manipulation de symboles est réellement le substrat du raisonnement. Quand on fait des maths, on écrit des dérivations ; quand on écrit du code, la formulation elle-même éclaire les abstractions à utiliser.

C'est une reformulation du **paradoxe de Moravec**, énoncé dans les années 80 : ce qui est difficile pour l'humain (jouer aux échecs, calculer une intégrale symbolique, démontrer un théorème) s'est révélé facile pour la machine, et ce qui est facile pour un enfant de dix ans (débarrasser une table, monter un escalier, verser de l'eau) reste hors de portée. Le monde réel est bruité, continu, en haute dimension. Le langage, par comparaison, est simple.

### Le système 1 et le système 2

Le psychologue **Daniel Kahneman**, prix Nobel d'économie, a popularisé une distinction devenue courante : le **système 1**, rapide, automatique, réactif, celui qui agit sans réfléchir parce qu'on a fait la même chose mille fois ; et le **système 2**, lent, délibéré, celui qui mobilise notre modèle du monde pour planifier une séquence d'actions.

Un LLM est un système 1 pur. On lui donne une entrée, elle se propage dans le réseau, il en sort une sortie. Toujours le même trajet, toujours le même coût.

Ce qu'il manque, c'est un système 2 : un mode d'inférence où la sortie n'est pas calculée mais cherchée. On imagine une action, on prédit son résultat, on évalue si le résultat satisfait l'objectif, et on optimise. Le Cun formule cela dans le cadre des *modèles à base d'énergie* (**energy-based models**) qu'il défend depuis vingt ans : au lieu d'apprendre une fonction qui associe une réponse unique à chaque entrée, on apprend un « paysage » (une **fonction d'énergie**) qui mesure la compatibilité entre une entrée et une réponse candidate. Les bonnes réponses sont dans les vallées, les mauvaises sur les hauteurs. Répondre, c'est chercher les optimums dans les vallées. Ce qui autorise plusieurs réponses valides, ce qu'une fonction ne permet pas.

Chercher une réponse par optimisation est intrinsèquement plus puissant que la propager à travers un nombre fixe de couches.

### Ce que veut dire « intelligence »

D'où l'objection de fond, et le retour de Piaget. L'intelligence n'est pas une accumulation de connaissances déclaratives (c'est précisément ce qu'un LLM accumule). Ce n'est pas non plus une collection de compétences : avec assez de moyens, on peut fabriquer une machine pour à peu près n'importe quelle tâche.

L'intelligence, c'est la capacité de s'adapter vite à une situation neuve. D'apprendre à conduire en vingt heures. De faire une chose qu'on n'a jamais faite, dès la première fois.

Ce qui conduit Le Cun à considérer l'expression **IAG** (intelligence artificielle générale, **AGI** en anglais) comme un contresens. Elle présuppose que l'intelligence humaine est générale, or elle est extrêmement spécialisée. La preuve : un jouet à vingt euros vous bat aux échecs, un site web calcule une intégrale symbolique mieux que vous. Nous ne sommes généraux dans aucun domaine, nous sommes adaptatifs.

> note "L'argument par le dénombrement"
> Un million de bits arrivent au cortex visuel. Combien de fonctions existe-t-il qui prennent un million de bits et rendent un bit ? Une telle fonction se définit en choisissant la réponse, 0 ou 1, pour chacune des 2<sup>1 000 000</sup> entrées possibles. Il en existe donc 2<sup>2<sup>1 000 000</sup></sup>.
>
> Le cerveau, lui, compte environ 10<sup>14</sup> synapses, soit de l'ordre de 10<sup>14</sup> octets de capacité ajustable, c'est-à-dire 8 × 10<sup>14</sup> bits. Il ne peut donc prendre que 2<sup>8 × 10<sup>14</sup></sup> configurations, et réaliser au plus autant de fonctions différentes.
>
> Les deux quantités sont des puissances de deux : il suffit de comparer leurs exposants :
> - Celui du cerveau, 8 × 10<sup>14</sup>, s'écrit avec **quinze** chiffres.
> - Celui du nombre de fonctions possibles, 2<sup>1 000 000</sup>, en prend plus de **trois cent mille**.
>
> Prétendre que nous avons une intelligence générale n'a mathématiquement aucun sens.

Pourtant, pour Yann Le Cun, il ne fait aucun doute que nous aurons des machines plus intelligentes que les humains dans tous les domaines où les humains sont intelligents. La question est quand : cinq ans pour les plus optimistes, vingt pour les plus prudents. Mais ce ne sera pas par la voie actuelle.

<hr class="hr-text" data-content="Modèles du monde">

## 4. Les Modèles du Monde

### La définition

Un *modèle du monde* (**world model**) tient en une phrase :

> note ""
> Étant donné l'état du monde à l'instant *t*, et étant donné une action que j'envisage de prendre, puis-je prédire l'état du monde à l'instant *t+1* après avoir exécuté cette action ?

C'est tout. Ce n'est pas nécessairement de la physique, ni de la 3D, ni un moteur de jeu. C'est abstrait. Nous en avons un dans la tête ; un chat en a un ; une fourmi en a un.

C'est aussi devenu un mot-valise. Le Cun le dit sans détour : tout le monde en parle, beaucoup d'entreprises affirment en faire, très peu en font réellement. En 2016 déjà, il concluait une conférence à NeurIPS (la grande conférence mondiale de l'apprentissage machine) sur ce message : le futur de l'IA, ce sont les modèles du monde. Ses recherches n'aboutissaient pas encore.

### Ce qu'un modèle du monde n'est pas

Une confusion fréquente consiste à assimiler **capacité de génération** et **compréhension du monde**. Produire une image ou une vidéo plausible ne signifie pas nécessairement avoir appris les règles qui gouvernent le réel.

Le problème tient en une propriété fondamentale du monde : **tout n'y est pas prévisible**. À partir d'un état donné, plusieurs futurs restent possibles. Certaines informations peuvent être déduites de ce qui a déjà été observé ; d'autres dépendent d'événements contingents ou de données qui ne sont tout simplement pas disponibles.

Un modèle entraîné à prédire directement ce qui va être observé doit pourtant produire une réponse complète. Il doit donc prédire non seulement les aspects déterminés par le passé, mais aussi ceux qui ne le sont pas. Lorsque plusieurs futurs sont possibles, il ne peut qu'en choisir un, répartir sa probabilité entre plusieurs possibilités ou produire une forme de compromis.

C'est particulièrement problématique avec les images et les vidéos. Leur contenu est continu, extrêmement riche et rempli de détails dont l'évolution est difficile, voire impossible, à prévoir précisément. Les premières tentatives de prédiction vidéo au niveau des pixels ont ainsi souvent produit des images floues : lorsqu'un modèle minimise une erreur de reconstruction face à plusieurs futurs possibles, il tend à prédire une moyenne de ces futurs.

Un **modèle du monde** ne peut donc pas avoir pour objectif de reproduire fidèlement tout ce qui sera observable. Sa fonction est différente : il doit apprendre **ce qui, dans l'état présent, permet réellement d'anticiper l'état futur**.

C'est ce qui distingue un modèle du monde d'un simple modèle génératif. Le premier cherche les régularités qui permettent de prévoir l'évolution d'un système ; le second cherche avant tout à produire une observation plausible.

Reste alors une question essentielle : **si tout ne mérite pas d'être prédit, que faut-il conserver du réel et que peut-on abandonner ?** C'est précisément le rôle de l'abstraction.

### L'abstraction, ou pourquoi il faut oublier des détails

Voici l'idée centrale : **un bon modèle du monde ne cherche pas à tout représenter**.

Le réel peut être décrit à différents niveaux. Les lois les plus fondamentales décrivent les constituants élémentaires de la matière ; à partir d'elles émergent des niveaux d'organisation de plus en plus complexes : atomes, molécules, cellules, organismes, individus, sociétés. À chaque niveau, une immense quantité d'information est abandonnée. On ne conserve que les variables pertinentes pour comprendre et prédire les phénomènes qui nous intéressent.

Cette perte d'information n'est pas un défaut. **Elle est la condition même de la prédiction.** Un modèle qui tenterait de conserver tous les détails microscopiques du monde deviendrait rapidement aussi complexe que le monde lui-même. Il serait impossible à construire, à calculer et, surtout, inutile pour anticiper son évolution.

Une abstraction consiste donc à remplacer une description extrêmement détaillée par un ensemble beaucoup plus réduit de variables. Certaines propriétés sont conservées parce qu'elles ont une influence sur l'avenir ; les autres sont ignorées. Plus on cherche à prévoir loin dans le temps ou à raisonner à grande échelle, plus il devient nécessaire d'abandonner les détails qui n'ont qu'un effet local ou transitoire.

C'est ce principe qui explique l'existence de plusieurs niveaux de description dans les sciences. Chaque discipline construit ses propres objets, ses propres variables et ses propres lois parce que les phénomènes pertinents ne sont pas les mêmes selon l'échelle considérée. Une description plus fondamentale n'est donc pas nécessairement une meilleure description : elle peut contenir davantage d'information tout en étant moins utile pour la tâche considérée.

Un **modèle du monde** appris doit fonctionner de la même manière. Il ne doit pas chercher à reconstruire fidèlement chaque détail de ce qu'il observe, mais à en extraire une représentation compacte contenant ce qui est **stable, prédictif et pertinent pour l'action**. Il doit apprendre quelles transformations du monde comptent et lesquelles peuvent être ignorées.

C'est précisément le rôle d'un **espace latent** : représenter le monde non pas dans toute sa complexité perceptive, mais à travers un ensemble de variables abstraites qui permettent d'en prévoir l'évolution. Apprendre un modèle du monde revient alors moins à apprendre à reproduire le réel qu'à découvrir **le bon niveau d'abstraction pour raisonner sur lui**.

Un modèle du monde ne doit donc pas être un simulateur exhaustif, encore moins une copie numérique du réel. **Il doit oublier énormément de choses, mais oublier les bonnes.**

<hr class="hr-text" data-content="JEPA">

## 5. JEPA

### Le principe

**JEPA** signifie *Joint Embedding Predictive Architecture* (architecture prédictive à enchâssement joint). Un *embedding* est la **représentation vectorielle d'une donnée dans un espace latent** : une image, un son, un texte ou, plus généralement, un état du monde y est traduit en un ensemble de nombres. L'**espace latent** est l'espace dans lequel vivent et s'organisent toutes ces représentations.

L'idée de JEPA est de **ne pas prédire directement les données observées**, mais leur représentation interne.

<div class="compare">
  <div>
    <p class="compare-label">Architecture générative</p>
    <p class="compare-lede">Prédire ce que l'on va observer.</p>
    <p>À partir d'un état <em>x</em>, éventuellement accompagné d'une action <em>a</em>, le modèle prédit directement l'état futur <em>y</em> : ses pixels, ses échantillons sonores, ses tokens ou toute autre donnée observable.</p>
  </div>
  <div>
    <p class="compare-label">Architecture JEPA</p>
    <p class="compare-lede">Prédire ce que l'état futur signifie.</p>
    <p>On transforme <em>x</em> en une représentation abstraite, puis le modèle prédit la représentation de l'état futur <em>y</em>. Pendant l'entraînement, <em>y</em> est lui aussi encodé afin de fournir la cible à atteindre. Le modèle n'a donc jamais besoin de reconstruire <em>y</em> dans ses moindres détails.</p>
  </div>
</div>

La différence est essentielle. Une architecture générative doit produire une observation complète, y compris des détails difficiles ou impossibles à prévoir. JEPA peut au contraire apprendre une représentation de *y* qui ne conserve que les propriétés utiles à la prédiction. **On ne cherche plus à deviner exactement à quoi ressemblera le monde, mais dans quel état pertinent il se trouvera.**

Le modèle apprend ainsi à prédire directement dans un **espace latent**, c'est-à-dire dans l'espace de ses représentations internes. Il peut y manipuler des informations abstraites sans devoir les convertir à chaque étape en pixels, en sons ou en symboles.

C'est aussi une réponse au problème du raisonnement évoqué plus haut : le calcul peut se poursuivre dans l'espace latent, sans devoir être reconverti à chaque étape en symboles discrets. Certaines approches intermédiaires explorent déjà cette direction : les *state-space models* maintiennent un état interne continu, tandis que des travaux comme **Coconut** cherchent à effectuer plusieurs étapes de raisonnement directement dans cet espace latent avant de revenir aux tokens. Mais ces approches restent encore rattachées, dans leur fonctionnement global, au paradigme des modèles de langage.

### Le problème de l'effondrement

JEPA se heurte à un piège classique.

Si l'on se contente de minimiser l'erreur de prédiction, le système peut trouver une solution triviale : ne plus tenir compte de l'entrée et produire toujours la même représentation. La prédiction devient alors parfaite, puisque les deux côtés produisent la même chose, mais le réseau n'a rien appris. C'est ce qu'on appelle le **collapse**, ou effondrement.

Éviter cet effondrement est l'un des problèmes centraux de l'apprentissage auto-supervisé fondé sur des représentations conjointes. Trois grandes familles de méthodes ont été développées.

### Famille 1 : les méthodes contrastives

Pour Le Cun, l'idée remonte à 1993, avec un problème très concret posé par un client d'AT&T : comment enregistrer une signature manuscrite sur la piste magnétique d'une carte de crédit, qui ne disposait que de 80 octets ?

La solution consiste à utiliser un réseau convolutif qui transforme le tracé de la signature en un vecteur de 80 dimensions. L'apprentissage impose alors deux contraintes : deux signatures de la même personne doivent produire des représentations proches ; celles de personnes différentes, ou les imitations, doivent au contraire produire des représentations éloignées.

C'est le principe de l'**apprentissage contrastif**. La fonction de coût combine deux forces : l'une **attractive**, qui rapproche les représentations similaires, l'autre **répulsive**, qui éloigne les représentations différentes. Sans cette seconde contrainte, toutes les représentations pourraient finir par se confondre.

Cette approche s'est depuis largement répandue. Elle a été utilisée pour la reconnaissance faciale, puis par des méthodes comme **SimCLR** pour les images. **CLIP**, proposé par OpenAI, repose lui aussi sur ce principe : la représentation d'une image doit se rapprocher de celle de sa description et s'éloigner de descriptions sans rapport avec elle. Le C de CLIP signifie justement *contrastive*.

Cette méthode a toutefois un coût : elle demande de nombreux exemples à comparer et tend à produire des représentations dont les dimensions ne sont pas toutes exploitées de manière optimale.

### Famille 2 : les méthodes par distillation

Cette fois, on utilise deux encodeurs de même architecture. L'un reçoit une version partielle, masquée ou transformée de l'entrée ; l'autre reçoit une version plus complète. Le premier doit apprendre à retrouver la représentation produite par le second.

Pour éviter l'effondrement, les deux encodeurs ne sont pas entraînés de la même manière. Le gradient ne traverse que l'un d'eux. Les paramètres du second sont mis à jour progressivement à partir de ceux du premier, au moyen d'une **moyenne mobile exponentielle**. Il évolue donc plus lentement et sert de cible relativement stable.

Le mécanisme fonctionne remarquablement bien, même si son efficacité n'est pas encore entièrement expliquée sur le plan théorique. Plusieurs travaux cherchent à comprendre pourquoi cette dynamique d'apprentissage évite les solutions triviales, sans qu'une théorie générale fasse aujourd'hui consensus.

Cette famille comprend notamment **BYOL** (*Bootstrap Your Own Latent*), développé chez DeepMind, **DINO**, issu de FAIR Paris, ainsi que **I-JEPA** pour les images et **V-JEPA** pour la vidéo.

Ces méthodes ont pu être entraînées à grande échelle avec de très bons résultats. I-JEPA, par exemple, obtient de meilleures représentations que certaines approches fondées sur les **auto-encodeurs masqués** (*Masked Autoencoders*), tout en demandant moins de calcul à l'entraînement.

### Famille 3 : la maximisation d'information

C'est l'approche aujourd'hui privilégiée par Le Cun. L'idée consiste à attaquer directement la cause de l'effondrement : si toutes les entrées produisent la même représentation, celle-ci ne contient pratiquement plus aucune information. Il faut donc contraindre l'encodeur à produire des représentations suffisamment riches et variées.

La difficulté est que la quantité d'information contenue dans une représentation est très difficile à mesurer directement. Les définitions théoriques reposent sur la distribution de probabilité des données, qu'on ne connaît généralement pas. Or estimer correctement une telle distribution dans un espace de grande dimension à partir d'un nombre limité d'exemples est extrêmement difficile.

On utilise donc des critères plus simples qui cherchent à garantir que les représentations exploitent effectivement l'espace disponible.

Concrètement, on fait passer un lot d'exemples dans l'encodeur et on obtient une matrice. Chaque ligne correspond à un exemple ; chaque colonne à une dimension de sa représentation. On peut alors éviter l'effondrement de deux manières complémentaires :

- **différencier les lignes** : deux exemples différents doivent produire des représentations différentes ; c'est l'idée des méthodes contrastives ;
- **différencier les colonnes** : les différentes dimensions de la représentation ne doivent pas toutes transporter la même information.

Dans les deux cas, le but est le même : empêcher l'encodeur de réduire toutes les entrées à une représentation unique et l'obliger à conserver une information suffisamment riche sur ce qu'il observe.

C'est cette seconde voie qu'explore cette famille de méthodes. Elle a donné lieu à trois approches successives :

- **Barlow Twins** (les jumeaux de Barlow) doit son nom à **Horace Barlow**, neuroscientifique britannique dont les travaux ont largement porté sur l'efficacité du codage neuronal et la maximisation de l'information. L'idée, proposée par **Stéphane Deny**, alors post-doctorant chez Meta, consiste à éviter que les différentes dimensions de la représentation transportent la même information. Pour cela, on cherche à décorréler les variables en rapprochant leur matrice de covariance d'une matrice diagonale.

- **VICReg** (*Variance-Invariance-Covariance Regularization*) reprend cette idée sous une forme plus simple. Développée notamment avec **Adrien Bardes**, alors doctorant au FAIR et co-encadré par Jean Ponce, la méthode combine trois contraintes : conserver une représentation stable d'une même donnée, maintenir suffisamment de variance entre les exemples et réduire les corrélations entre les différentes dimensions.

- **SIGReg** (*Sketched Isotropic Gaussian Regularization*) va plus loin. La méthode, développée notamment par **Randall Balestriero**, cherche non plus seulement à décorréler les variables, mais à rendre leur distribution aussi proche que possible d'une **gaussienne isotrope**.

  La distinction est importante : deux variables peuvent être décorrélées sans être statistiquement indépendantes. Or c'est bien cette indépendance que l'on voudrait obtenir. Le problème est qu'elle est extrêmement difficile à mesurer directement dans un espace de grande dimension.

  SIGReg contourne cette difficulté en imposant une forme particulière à l'ensemble des représentations. Une gaussienne isotrope est une distribution en cloche qui présente la même dispersion dans toutes les directions. Ses différentes composantes sont alors indépendantes les unes des autres.

  Reste à vérifier qu'un nuage de points de grande dimension possède bien cette forme. Là encore, la méthode évite de traiter directement le problème dans toutes ses dimensions. Elle projette les représentations sur des directions choisies, ce qui ramène chaque fois le problème à une seule dimension. On peut alors comparer la distribution obtenue à celle d'une gaussienne idéale et déterminer comment déplacer les points pour s'en rapprocher.

  L'opération est répétée sur de nombreuses directions choisies aléatoirement. Le terme *sketched* renvoie précisément à cette idée : au lieu d'examiner exhaustivement l'espace de grande dimension, on en prend suffisamment de projections pour en obtenir une approximation. Les écarts mesurés fournissent un gradient qui peut ensuite être rétropropagé dans le réseau.

  L'intérêt de SIGReg est de parvenir à imposer une structure riche aux représentations avec relativement peu de paramètres à régler. Des résultats théoriques suggèrent même que, sous certaines hypothèses sur les variables cachées à l'origine des données, ce type de régularisation peut permettre au réseau de retrouver ces variables sous-jacentes, à une transformation près.

Il reste cependant une limite importante : **la dimension de l'espace latent doit être fixée à l'avance**. Rien ne garantit pourtant que les données nécessitent réellement autant de dimensions. Idéalement, le système devrait découvrir lui-même leur **dimension intrinsèque**, c'est-à-dire le nombre minimal de variables nécessaires pour les décrire, ainsi que leur **topologie**, autrement dit la manière dont ces variables s'organisent et se raccordent entre elles.

Une donnée peut en effet être représentée dans un espace immense tout en obéissant à une structure beaucoup plus simple. Des images comportant des millions de pixels vivent formellement dans un espace de millions de dimensions, alors que les variations qui les relient peuvent dépendre de seulement quelques facteurs : orientation, position, éclairage ou forme. Le véritable enjeu est donc de découvrir automatiquement cette structure cachée plutôt que d'imposer à l'avance la forme de l'espace dans lequel les représentations devront s'organiser.

### Ce que V-JEPA a appris

Et voici le résultat le plus frappant. V-JEPA est entraîné à prédire ce qui va se passer dans une vidéo, en représentation. On peut donc mesurer son erreur de prédiction interne, image par image, en faisant glisser une fenêtre de seize images sur une vidéo.

Montrez-lui une scène ordinaire : l'erreur reste basse. Montrez-lui une scène **physiquement impossible** (un objet qui disparaît, une balle qui traverse un mur, une voiture qui reste en l'air après avoir quitté une plateforme), et l'erreur de prédiction explose.

C'est exactement le protocole que les psychologues du développement utilisent pour tester ce qu'un bébé a compris du monde : la **violation d'attente**. Un bébé de six mois, à qui l'on montre un objet qui flotte, ne réagit pas : il n'a pas encore appris la gravité. Un bébé de dix mois s'étonne visiblement. Cette compréhension prend environ neuf mois chez l'humain ; c'est aussi ce que fait l'enfant de huit mois dans sa chaise haute qui jette systématiquement tous ses jouets par terre et regarde le résultat : il fait l'expérience.

Selon Le Cun, c'est la première fois qu'un système entièrement auto-supervisé acquiert un niveau de sens commun physique : la capacité de dire ce qui est possible et ce qui ne l'est pas.

Deuxième résultat du même ordre. Un bébé apprend très tôt que le monde est en trois dimensions, et pour une raison précise : la distance de chaque point est la meilleure explication de la façon dont sa vue change quand il bouge la tête ; c'est la **parallaxe**. Les chercheurs ont pris les représentations apprises par V-JEPA 2.1 et entraîné par-dessus une petite tête de réseau à prédire la profondeur à partir d'une seule image. Les résultats dépassent ceux de DINO v3. Autrement dit : un système entraîné uniquement à combler des trous dans des vidéos, au niveau des représentations, a découvert que le monde est tridimensionnel et a construit une notion d'objet.

### Planifier

Avec un modèle du monde, on peut enfin faire ce que les LLM ne savent pas faire.

Le schéma : on perçoit l'environnement, un module de perception produit une représentation de l'état courant, qu'on combine éventuellement avec le contenu d'une mémoire. On propose une séquence d'actions. Le modèle du monde en prédit le résultat. Une fonction **objectif** mesure dans quelle mesure la tâche est accomplie : elle vaut zéro si oui, un nombre positif sinon. Puis, par optimisation, on cherche la séquence d'actions qui minimise cet objectif.

Les automaticiens reconnaîtront la **commande prédictive** (*Model Predictive Control*), une technique classique du contrôle optimal qui remonte aux années 1960.

Ce cadre offre une propriété que les LLM n'auront jamais : on peut ajouter des objectifs supplémentaires, des **garde-fous**, appliqués à chaque étape de la séquence, qui interdisent au système de faire passer le monde par certains états. Un LLM ne peut être rendu inoffensif que par affinage a posteriori, et il existe toujours un moyen de contourner ce conditionnement : c'est le *jailbreak*. Dans un système fondé sur la commande prédictive, au contraire, les garde-fous font partie du problème d'optimisation lui-même : ils sont pris en compte à chaque étape de la planification.

Reste un problème largement ouvert : celui de la **planification hiérarchique**. Pour organiser une action complexe, il est impossible de prévoir dès le départ chacun des gestes élémentaires qui permettront de l'accomplir. Il faut raisonner par niveaux successifs : définir d'abord quelques grandes étapes, puis transformer chacune d'elles en sous-objectifs de plus en plus précis, jusqu'à atteindre des actions suffisamment simples et familières pour être exécutées directement.

C'est ainsi que nous planifions naturellement. Un objectif lointain est d'abord décomposé en grandes étapes ; chacune est ensuite détaillée lorsque cela devient nécessaire, en fonction de la situation et des informations disponibles. Il serait à la fois inutile et impossible de tout prévoir à l'avance, jusqu'aux mouvements musculaires nécessaires à l'exécution.

Reproduire cette capacité dans une machine reste un problème de recherche largement ouvert. Il faudrait qu'un système sache **choisir lui-même le bon niveau d'abstraction**, décomposer un objectif en sous-objectifs, puis recommencer récursivement jusqu'à obtenir des actions réalisables.

D'autres approches explorent déjà une partie de cette direction. Les modèles **PlaNet** et **Dreamer**, développés par **Danijar Hafner**, ainsi que **MuZero**, apprennent eux aussi à prédire l'évolution d'un système dans un espace de représentation plutôt que directement à partir des observations brutes. La différence tient notamment à la manière dont cet espace est appris. Dans PlaNet et Dreamer, il repose sur un modèle génératif latent entraîné à reconstruire les observations. Un JEPA cherche au contraire à apprendre directement les représentations utiles à la prédiction, sans avoir à reconstruire les données d'origine.

<hr class="hr-text" data-content="Conséquences">

## 6. Ce que Ça Change

### Un programme de recherche à contre-courant

Les conclusions que Le Cun tire pour la communauté de recherche sont volontairement brutales :

- Abandonner les modèles génératifs au profit des architectures à enchâssement joint.
- Abandonner les modèles probabilistes au profit des modèles à base d'énergie.
- Préférer les méthodes régularisées aux méthodes contrastives.
- Réduire l'usage de l'**apprentissage par renforcement** (la méthode où un agent apprend par essais et récompenses) parce qu'elle est terriblement inefficace en nombre d'échantillons. « C'est ce qu'on fait quand on est désespéré et qu'il n'y a rien d'autre. » L'essentiel de l'apprentissage doit venir de l'observation.
- Et, à l'intention des universitaires : ne travaillez pas sur les LLM. Vous n'avez rien à apporter face à des équipes qui disposent de dizaines de milliers de GPU.

Ce discours ne l'a pas rendu populaire dans la Silicon Valley. Il a quitté Meta fin 2025 pour fonder **AMI Labs**, une entreprise consacrée à l'IA du monde réel, la robotique comme cas d'usage, mais aussi le contrôle de procédés industriels : tout ce qui est continu, en haute dimension et bruité, c'est-à-dire tout ce face à quoi les LLM sont impuissants. Le siège est à Paris, avec des sites à New York, Montréal et Singapour, et un actionnariat délibérément réparti entre l'Europe (environ 40 %), les États-Unis et l'Asie. La raison affichée est autant géopolitique que technique : il existe une demande d'industriels et de gouvernements pour un fournisseur d'IA de pointe qui ne soit ni américain ni chinois.

### Le vrai risque

Interrogé sur les dangers de l'IA, Le Cun écarte le chômage de masse et les scénarios de science-fiction pour en désigner un autre, plus immédiat : bientôt, la quasi-totalité de l'information que nous recevrons transitera par des assistants d'IA. Si ces assistants proviennent de trois entreprises de la côte ouest des États-Unis et de trois ou quatre entreprises chinoises, c'est un problème pour la démocratie et pour la diversité culturelle.

Tout système est biaisé : la question n'est pas de supprimer les biais, mais de savoir si le monde entier doit être biaisé comme la Californie. Aucun acteur actuel n'entraînera jamais son modèle sur les 300 langues de l'Inde ou les 300 dialectes de l'Indonésie, ni ne l'ajustera aux systèmes de valeurs de toutes les régions du monde.

D'où **Project Tapestry**, initiative dont Le Cun est directeur scientifique et dont un atelier de lancement s'est tenu à Paris, avec des participants européens, suisses, émiratis, indiens, japonais, et des entreprises américaines dont IBM, NVIDIA et AMD. Le principe relève de l'**apprentissage fédéré** : chaque région conserve ses données et son centre de calcul, et n'échange avec les autres que des vecteurs de paramètres. Périodiquement, chaque participant reçoit le paramètre moyen et se voit régularisé pour s'en rapprocher, « comme des élastiques » qui relient chaque modèle local au consensus. Si le système converge, on obtient un modèle ouvert équivalent à ce qu'aurait donné un entraînement sur toutes les données réunies, sans qu'aucune donnée n'ait circulé.

L'argument de fond, Le Cun le tire de l'histoire de l'imprimerie. Elle a d'abord diffusé la Bible, permis à chacun de la lire sans l'intermédiaire du clergé, engendré la Réforme, et deux cents ans de guerres de religion en Europe. Personne aujourd'hui ne soutiendrait pour autant que l'imprimerie fut mauvaise pour l'humanité. À l'inverse, le monde arabo-musulman, qui dominait la science au Moyen Âge (c'est pour cela que les étoiles portent des noms arabes), a interdit l'imprimerie pour sa langue, et s'est refermé. Diffuser le savoir est bénéfique au total, à condition de prévenir les effets délétères. Refuser de le diffuser ne l'est jamais.

### Et maintenant ?

Le Cun donne trois à cinq ans avant que n'émergent les bonnes idées, peut-être fondées sur JEPA. Puis, comme toujours dans l'histoire de l'IA, on rencontrera des obstacles imprévus et cela prendra plus longtemps que prévu.

En attendant, son conseil aux étudiants tient en une phrase, et elle vaut au-delà de l'IA : quand la technologie évolue vite, il faut apprendre à apprendre, donc se doter de bases dont la date de péremption tombe après la fin de votre carrière. Entre un cours sur la dernière technologie à la mode et un cours de mécanique quantique, prenez la mécanique quantique ; les mathématiques développées par les physiciens du XX<sup>e</sup> siècle, physique statistique et intégrales de chemin de Feynman comprises, se retrouvent aujourd'hui au cœur des modèles de diffusion et de l'inférence probabiliste.

<hr class="hr-text" data-content="Glossaire">

## Glossaire des Termes Techniques

| Terme | Définition |
| --- | --- |
| Apprentissage auto-supervisé | Entraînement sans étiquetage humain : on masque une partie des données et on entraîne le système à la retrouver. |
| Apprentissage contrastif | Méthode qui rapproche les représentations de ce qui est sémantiquement identique et éloigne celles de ce qui diffère. |
| Apprentissage par renforcement | Apprentissage par essais et récompenses. Très coûteux en nombre d'essais. |
| Auto-encodeur | Réseau entraîné à reproduire son entrée sur sa sortie, généralement en passant par une représentation intermédiaire compressée. |
| Collapse<span>effondrement</span> | Échec où un système apprend à ignorer son entrée et à produire une sortie constante, réduisant artificiellement son erreur à zéro. |
| Descente de gradient | Méthode d'optimisation qui ajuste les paramètres à petits pas dans la direction où l'erreur décroît le plus vite. |
| Espace latent | L'espace des représentations internes d'un réseau : continu, à haute dimension, non symbolique. |
| Fonction de coût<span>loss function</span> | Mesure de l'écart entre ce que le système prédit et ce qu'on attend. C'est elle qu'on minimise. |
| JEPA<span>Joint Embedding Predictive Architecture</span> | Architecture où la prédiction se fait dans l'espace des représentations plutôt que sur les données brutes. |
| Modèle du monde<span>world model</span> | Système capable de prédire l'état du monde à *t+1* étant donné son état à *t* et une action envisagée. |
| Modèle génératif | Modèle entraîné à reconstruire ou produire ses données d'entrée dans le détail. |
| Modèle à base d'énergie<span>energy-based model</span> | Cadre où l'on apprend un paysage de compatibilité entre entrées et réponses, plutôt qu'une fonction associant une réponse unique à chaque entrée. |
| Prédiction autorégressive | Production d'une sortie symbole par symbole, chacun étant réinjecté en entrée pour produire le suivant. Le mode de fonctionnement des LLM. |
| Réseau convolutif | Architecture inspirée du cortex visuel, équivariante par translation, qui domine la vision par ordinateur. |
| Rétropropagation du gradient | Algorithme qui fait remonter l'erreur couche par couche pour calculer comment ajuster chaque poids. |
| Token | Unité élémentaire manipulée par un modèle de langage : un mot ou un morceau de mot. |
| Transformer | Architecture équivariante par permutation, qui privilégie les relations entre éléments plutôt que leurs positions. Base des LLM. |
{: .glossary}

<hr class="hr-text" data-content="Sources">

## Sources

Cet article s'appuie sur différentes interventions de Yann Le Cun, notamment les suivantes :

- [*Les World Models : l'IA post-LLM expliquée par Yann Le Cun*](https://www.youtube.com/watch?v=m7ywFu3Yqh8){:target="_blank" rel="noopener noreferrer nofollow"}, entretien pour le podcast À la French.
- [*Leçon inaugurale : apprentissage profond et au-delà, les nouveaux défis de l'IA*](https://www.youtube.com/watch?v=Z208NMP7_-0){:target="_blank" rel="noopener noreferrer nofollow"}.
- [*World Models: Enabling the Next AI Revolution*](https://www.youtube.com/watch?v=72Xj8k5WQX4){:target="_blank" rel="noopener noreferrer nofollow"}, conférence en anglais.

> note ""
> Cet article a été rédigé avec l'aide de LLM, à partir de transcriptions produites par un modèle de reconnaissance vocale qui prend parfois « Le Cun » pour un nom commun. Les noms propres et les termes techniques ont donc été rétablis à la main : pour un texte consacré aux limites de ces modèles, la démonstration était incluse.
