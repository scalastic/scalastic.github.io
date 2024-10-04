---
layout: post
title: "Tout Savoir sur l'Architecture Hexagonale : Kernel, Ports, Adapters"
date: 2023-11-06 00:28:00 +0200
description: "Explorez l'architecture hexagonale, une approche isolant la logique métier pour des applications évolutives et robustes."
img: hexagonal-architecture.jpg
fig-caption: Photo de <a href="https://unsplash.com/fr/@drmakete?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">drmakete lab</a> sur <a href="https://unsplash.com/fr/photos/le-reflet-du-ciel-dans-le-verre-dun-batiment-hsg538WrP0Y?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
tags: [Hexagonal-Architecture, Clean-Architecture, DDD, SOLID, Craftsmanship]
lang: fr
permalink: /hexagonal-architecture/
status: finished
---

Dans le vaste monde du développement logiciel, l'architecture est la pierre angulaire sur laquelle repose la
construction de tout système informatique. Le choix de l'architecture est une décision cruciale qui influence la manière
dont une application est conçue, évolue, et est maintenue.

Un aspect crucial à prendre en compte est que, une fois qu'un choix technique est fait pour une application, il devient 
difficile de changer de direction à mesure que le projet avance. Les risques de régressions augmentent, et le point 
de non-retour est vite atteint.

C'est ici que l'architecture hexagonale entre en jeu pour répondre à ces défis.

<hr class="hr-text" data-content="Plan">

* TOC
{:toc}

<hr class="hr-text" data-content="Historique">

## 1. Définition et Historique

L'architecture hexagonale, également connue sous le nom d'architecture à base de ports et d'adaptateurs, a été formulée 
par Alistair Cockburn en 2005. Elle repose sur l'idée fondamentale que les applications devraient être pilotées aussi 
bien par des utilisateurs que par des programmes, des scripts batchs ou des tests automatisés. De plus, elle préconise 
que ces applications puissent être développées et testées en isolation, sans dépendre des bases de données et des 
systèmes d'exécution.

Au cœur de l'architecture hexagonale se trouve un principe essentiel : l'isolation de la logique métier de l'application.

Cette notion rappelle fortement le Domain-Driven Design (DDD), qui met l'accent sur l'importance du domaine métier par 
rapport à la technologie. Il est important de noter que l'architecture hexagonale et le DDD sont des concepts distincts,
bien qu'ils puissent se renforcer mutuellement.

<hr class="hr-text" data-content="Principes">

## 2. Principes de l'Architecture Hexagonale

<figure class="article">
  <img src="{{site.baseurl}}/assets/img/hexagonal-architecture-port-adapter.svg" alt="Notions de Noyau, Port et Adapter" />
  <figcaption>Notions de Noyau, Port et Adapter</figcaption>
</figure>

Les principes fondamentaux de l'architecture hexagonale peuvent être résumés en trois points clés :

1. **Isolation de la Logique Métier** : La logique métier de l'application est séparée de sa mise en œuvre technique. 
Cette séparation s'effectue en décomposant l'application en trois parties distinctes : la partie Métier (ou Noyau), la partie 
Interface (ou Drivers, Primary Actors, ceux qui appellent l'application) et la partie Infrastructure (ou Driven, Secondary Actors, ceux qui sont 
appelés par l'application). La partie Métier est isolée dans une structure fictive souvent représentée par un hexagone, 
d'où le nom.

2. **Indépendance de la Partie Métier** : Conformément à l'architecture hexagonale, la partie Métier ne dépend de rien 
d'autre. Ce sont les parties Interface et Infrastructure qui dépendent de la partie Métier. En d'autres termes, les dépendances 
s'établissent de l'extérieur vers l'intérieur de l'hexagone.

3. **Ports et Adaptateurs** : Pour permettre la communication entre la partie Métier et le monde extérieur (Drivers et 
Driven), l'architecture hexagonale repose sur le concept de ports et d'adaptateurs. Les adaptateurs servent de 
traducteurs entre le domaine métier et la partie technique externe. Les ports définissent les interfaces avec lesquelles
les adaptateurs interagissent avec le Noyau. Tous deux sont essentiels pour gérer les changements dans le monde 
extérieur sans affecter la logique métier.

Cette organisation garantit que tout changement technique n'a pas d'incidence sur la logique métier, ce qui réduit les 
risques de régressions et simplifie les tests de la partie métier.


## 3. Comparaison avec d'autres Approches Architecturales

L'architecture hexagonale est une approche architecturale puissante, mais il est essentiel de la comparer à d'autres 
approches pour comprendre ses avantages et ses spécificités.

### Comparaison avec l'architecture MVC traditionnelle

L'architecture hexagonale se distingue de l'architecture Modèle-Vue-Contrôleur (MVC) traditionnelle, qui a longtemps été
utilisée pour développer des applications.

L'architecture MVC repose sur la séparation des composants en trois couches distinctes : le modèle (qui gère les données
et la logique métier), la vue (qui gère l'interface utilisateur) et le contrôleur (qui agit comme un intermédiaire entre
le modèle et la vue). Le modèle MVC est largement utilisé dans les applications web et de bureau.

L'architecture hexagonale, en revanche, se concentre sur la séparation de la logique métier du reste de l'application. 
L'hexagone, au cœur de cette architecture, représente le modèle métier, tandis que les ports et adaptateurs facilitent 
la communication avec l'extérieur. Cette approche permet de mettre davantage l'accent sur la logique métier et de la 
protéger des dépendances techniques. Contrairement à MVC, qui peut parfois conduire à un code où la logique métier est 
entremêlée avec la logique de présentation, l'architecture hexagonale favorise une isolation plus nette.

### Lien avec le Domain-Driven Design (DDD)

L'architecture hexagonale et le Domain-Driven Design (DDD) partagent une philosophie commune : l'importance de la 
logique métier dans le développement logiciel. Cependant, il est crucial de noter que ce sont des concepts distincts.

Le DDD est une approche de conception logicielle qui met en avant la compréhension approfondie du domaine métier et la 
modélisation de ce domaine dans le code. Il encourage la collaboration entre les experts métier et les développeurs pour
créer une représentation du domaine qui reflète au mieux la réalité.

L'architecture hexagonale est une structure architecturale qui met en œuvre la séparation de la logique métier, de 
l'infrastructure et de la présentation. Elle s'inspire du DDD en mettant le domaine métier au centre de l'attention, 
mais elle se concentre davantage sur la façon dont les composants communiquent, en utilisant des ports et des adaptateurs.

En résumé, l'architecture hexagonale peut être mise en œuvre dans un contexte DDD pour garantir que la logique métier 
est isolée des détails techniques, facilitant ainsi une meilleure application des principes DDD.

### Mise en perspective de l'architecture hexagonale par rapport à la Clean Architecture

L'architecture hexagonale et la Clean Architecture partagent des similitudes dans leur philosophie de développement 
logiciel, mais elles diffèrent dans leur mise en œuvre.

La Clean Architecture, popularisée par Uncle Bob (Robert C. Martin), met en avant la séparation des préoccupations et la
dépendance inversée. Elle est basée sur des cercles concentriques, chaque cercle représentant une couche logicielle avec
le domaine métier au centre. Les cercles extérieurs contiennent l'interface utilisateur, les détails techniques et les 
bases de données.

L'architecture hexagonale, quant à elle, met l'accent sur la logique métier en utilisant l'analogie de l'hexagone. Elle 
propose une isolation plus stricte de la logique métier, en plaçant cette dernière au cœur de l'application et en la 
protégeant des dépendances extérieures. Les ports et les adaptateurs sont là pour interagir avec l'extérieur.

En comparaison, la Clean Architecture offre une approche plus structurée avec des couches bien définies, tandis que 
l'architecture hexagonale est plus souple dans la manière dont elle permet l'interaction avec le domaine métier.

Il est important de noter que ces deux approches peuvent être complémentaires. La Clean Architecture peut être utilisée 
pour structurer une application dans son ensemble, tandis que l'architecture hexagonale peut être utilisée pour isoler 
spécifiquement la logique métier. Le choix entre les deux dépendra des besoins et des priorités du projet.

En conclusion, l'architecture hexagonale, bien qu'elle partage des principes fondamentaux avec d'autres approches, se 
démarque par son focus sur la logique métier et son approche de la séparation des préoccupations. Elle peut être une 
solution précieuse pour les projets qui cherchent à isoler et à protéger la logique métier tout en permettant une 
évolutivité et une adaptabilité accrues.

## 4. Avantages de l'Architecture Hexagonale

L'architecture hexagonale offre plusieurs avantages significatifs qui en font une approche populaire dans le 
développement logiciel.

### Réduction des risques de régressions fonctionnelles lors des changements techniques
L'un des principaux avantages de l'architecture hexagonale réside dans sa capacité à réduire les risques de 
régressions fonctionnelles lors de changements techniques. Contrairement à certaines autres architectures où la logique 
métier peut être intimement liée aux détails techniques, l'architecture hexagonale isole la logique métier au sein de 
l'hexagone. Cela signifie que lorsqu'il est nécessaire de modifier des éléments tels que la base de données, le système 
de stockage ou d'autres composants techniques, la logique métier reste largement inchangée. Cette isolation permet de 
minimiser les régressions fonctionnelles potentielles, garantissant ainsi la stabilité de l'application même lors de 
modifications techniques.

### Facilité d'ajout de nouvelles fonctionnalités et de modification des existantes
L'architecture hexagonale se prête bien à l'ajout de nouvelles fonctionnalités et à la modification de celles qui 
existent déjà. En isolant la logique métier, il est plus simple d'introduire de nouvelles fonctionnalités sans perturber
l'existant. Cette approche favorise également la flexibilité, car les connaissances métier sont protégées de manière 
robuste. Ainsi, les développeurs peuvent se concentrer sur l'expansion de l'application sans craindre de provoquer des 
effets indésirables sur d'autres parties du système.

### Simplicité des tests de la partie métier
L'architecture hexagonale simplifie considérablement les tests de la partie métier de l'application. Étant donné que 
la logique métier est clairement isolée et n'a pas de dépendances techniques, les tests peuvent se concentrer sur cette 
partie cruciale de l'application sans avoir à gérer des dépendances complexes. Les tests automatisés deviennent plus 
simples à écrire et à exécuter, ce qui favorise des pratiques telles que le Test-Driven Development (TDD) et le 
Behavior-Driven Development (BDD). Cette simplicité des tests contribue à améliorer la qualité du code et à garantir que
la logique métier fonctionne comme prévu.

### Promotion des approches BDD et DDD
L'architecture hexagonale favorise activement les approches du Behaviour-Driven Development (BDD) et du Domain-Driven 
Design (DDD). Le BDD met l'accent sur le comportement attendu d'une application, tandis que le DDD insiste sur la 
modélisation d'un domaine métier complexe. En isolant la logique métier et en utilisant des tests automatisés, 
l'architecture hexagonale facilite la mise en œuvre de ces approches. Elle permet une meilleure compréhension des 
comportements attendus et une modélisation plus précise du domaine métier, ce qui améliore la qualité globale de 
l'application.

En conclusion, l'architecture hexagonale présente des avantages majeurs qui en font un choix attrayant pour les projets 
logiciels où la logique métier doit être au cœur de l'application tout en permettant une testabilité, une évolutivité et
une adaptabilité maximales.

## 5. Limitations et Inconvénients

Malgré ses nombreux avantages, l'architecture hexagonale n'est pas sans limitations et inconvénients. Il est essentiel 
de prendre en compte ces aspects pour déterminer si cette approche convient à un projet particulier.

### Augmentation du nombre de packages et complexification de la structure du projet
L'un des inconvénients notables de l'architecture hexagonale est l'augmentation du nombre de packages et la 
complexification de la structure du projet. En comparaison avec certaines autres architectures, telles que 
l'architecture monolithique ou 3-tier, l'architecture hexagonale nécessite généralement une plus grande organisation des
fichiers. La séparation stricte de la logique métier, de l'interface et de l'infrastructure se traduit par une 
multiplication des packages. Pour certains développeurs, cela peut sembler excessif et entraîner une gestion plus 
complexe de la structure du projet. Cependant, cette complexité peut être atténuée avec une convention et une 
organisation appropriées du code.

### Inefficacité potentielle dans certains contextes
L'efficacité de l'architecture hexagonale dépend du contexte d'application. Cette approche brille particulièrement 
lorsque la logique métier est complexe et stable, et lorsque des modifications techniques fréquentes sont attendues. 
Cependant, dans des contextes plus simples ou lorsque la stabilité du métier n'est pas un problème, l'architecture 
hexagonale peut sembler excessive. Les projets de petite envergure ou ceux dont la logique métier n'est pas le point 
focal peuvent ne pas bénéficier pleinement de l'architecture hexagonale. Dans de tels cas, d'autres architectures plus 
légères peuvent être préférables.

Il est donc essentiel d'évaluer attentivement les besoins spécifiques du projet et de déterminer si l'architecture 
hexagonale est la meilleure solution. 

## 6. Implémentation de l'Architecture Hexagonale

Pour mettre en place l'architecture hexagonale dans un projet, il est essentiel de suivre un certain nombre d'étapes 
clés. De plus, un exemple concret d'implémentation, tel qu'une application bancaire, peut aider à illustrer comment 
cette architecture fonctionne dans la pratique.

### Étapes pour mettre en place l'architecture hexagonale

1. **Compréhension du domaine métier :** Avant de commencer, il est crucial de bien comprendre le domaine métier de 
l'application. Identifiez les acteurs, les cas d'utilisation et les règles métier qui seront au cœur de votre 
application. Cette étape est essentielle pour isoler correctement la logique métier.

2. **Création du modèle métier :** Concevez un modèle métier indépendant des technologies. Ce modèle doit représenter 
les concepts clés du domaine métier, tels que les entités, les valeurs et les règles. Assurez-vous que le modèle est 
stable et ne dépend pas des détails techniques.

3. **Définition des ports et adaptateurs :** Identifiez les points d'interaction entre le modèle métier et le reste de 
l'application. Créez des interfaces (ports) qui définissent les contrats pour ces interactions. Les adaptateurs sont 
responsables de l'implémentation de ces interfaces.

4. **Implémentation des interfaces API et SPI :** Divisez les interfaces en deux parties distinctes : les interfaces API
(Application Provider Interface) pour les composants qui ont besoin d'appeler le modèle métier (Drivers), et les 
interfaces SPI (Service Provider Interface) pour récupérer des données de l'infrastructure (Driven). Ces interfaces 
doivent avoir un sens métier clair.

5. **Développement de la logique métier :** Implémentez la logique métier dans le modèle métier. Cette partie du code 
doit être indépendante des détails techniques et des sources de données. L'utilisation de l'inversion de dépendance 
permet de garder le modèle isolé.

6. **Création des adaptateurs :** Développez des adaptateurs pour les parties Interface et Infrastructure. Ces 
adaptateurs sont responsables de l'interaction entre le modèle métier et le monde extérieur. Ils permettent de s'adapter
aux technologies spécifiques tout en préservant la stabilité de la logique métier.

7. **Tests de la partie métier :** Comme la logique métier est bien isolée, vous pouvez tester cette partie 
indépendamment de la source de données ou de la présentation. Les mocks peuvent être utilisés pour simuler les 
interactions avec les adaptateurs.

8. **Évolution continue :** La connaissance du domaine métier peut évoluer avec le temps. Il est important de prendre en
compte que le modèle métier n'est pas statique et peut nécessiter des ajustements en cas de changements ou d'évolutions.

### Exemple d'implémentation dans un contexte concret (l'application bancaire)

Considérons une application de gestion bancaire qui permet de gérer les actions bancaires telles que les dépôts et les 
retraits. Pour implémenter l'architecture hexagonale dans ce contexte, voici comment cela pourrait se dérouler :

- **Modèle métier :** Créez un modèle métier qui représente des concepts tels que les comptes bancaires, les 
transactions et les règles métier associées.

- **Interfaces API :** Définissez des interfaces API pour les actions bancaires, telles que "Déposer de l'argent sur un 
compte bancaire" et "Retirer de l'argent d'un compte bancaire". Ces interfaces définissent les contrats pour ces actions.

- **Interfaces SPI :** Créez des interfaces SPI pour la récupération de comptes bancaires et l'enregistrement des 
transactions. Ces interfaces sont destinées à interagir avec l'infrastructure.

- **Logique métier :** Implémentez la logique métier pour gérer les actions bancaires conformément aux règles métier 
définies.

- **Adaptateurs :** Développez des adaptateurs pour la partie Présentation (par exemple, des contrôleurs Web) et la 
Persistance (par exemple, une couche d'accès aux données utilisant JPA). Ces adaptateurs traduisent les appels des 
interfaces API et SPI en actions concrètes.

Avec cette implémentation, la logique métier reste isolée, ce qui permet de la tester indépendamment des détails 
techniques tels que la base de données ou l'interface utilisateur. De plus, si des changements techniques surviennent, 
la logique métier reste stable, réduisant ainsi les risques de régressions fonctionnelles.

## 7. Meilleures Pratiques et Conseils

L'adoption de l'architecture hexagonale peut apporter de nombreux avantages, mais elle nécessite une planification et 
une mise en œuvre soignées. Voici quelques meilleures pratiques et conseils pour tirer le meilleur parti de cette 
approche architecturale.

### Questions préalables à se poser avant d'adopter l'architecture hexagonale

1. **La nature de votre application :** Avant d'opter pour l'architecture hexagonale, interrogez-vous sur la nature de 
votre application. Est-ce que votre application est complexe et comporte une logique métier significative ? Si oui, 
l'architecture hexagonale peut être une bonne option. Si votre application est simple, elle peut ne pas bénéficier 
pleinement de cette approche.

2. **Stabilité des règles métier :** Les règles métier de votre application sont-elles stables, ou changent-elles 
fréquemment ? L'architecture hexagonale est particulièrement adaptée aux règles métier stables, car elle permet de 
minimiser l'impact des changements techniques.

3. **Besoin d'isolation :** Avez-vous besoin d'isoler la logique métier de l'application des détails techniques et des 
sources de données ? Si la stabilité de la logique métier est cruciale, l'architecture hexagonale peut être une 
excellente option.

### Recommandations pour une implémentation réussie

1. **Compréhension approfondie du domaine métier :** Avant de commencer l'implémentation, assurez-vous d'avoir une 
compréhension approfondie du domaine métier. Identifiez les acteurs, les cas d'utilisation et les règles métier 
essentielles. Une mauvaise compréhension du domaine peut entraîner des erreurs coûteuses.

2. **Modèle métier clair :** Créez un modèle métier clair et indépendant des technologies. Assurez-vous que le modèle 
représente fidèlement les concepts du domaine métier. Évitez d'introduire des détails techniques dans le modèle.

3. **Tests de la logique métier :** Investissez du temps dans les tests de la logique métier. Comme elle est isolée, les
tests peuvent être effectués de manière indépendante, garantissant que la logique métier fonctionne correctement.

4. **Documentation adéquate :** Assurez-vous de bien documenter votre architecture hexagonale. Cela inclut la 
description des interfaces, des adaptateurs et de la logique métier. Une documentation claire facilite la compréhension 
et la maintenance.

### Gestion du changement et évolution du modèle métier

1. **Flexibilité du modèle métier :** Comprenez que le modèle métier peut évoluer avec le temps. Soyez prêt à apporter 
des modifications au modèle lorsque les besoins métier changent. L'architecture hexagonale facilite ces évolutions tout 
en préservant la stabilité.

2. **Gestion des versions :** Si votre application évolue et que de nouvelles versions sont déployées, assurez-vous de 
gérer correctement les versions des interfaces API et SPI. Cela garantit la compatibilité entre les différentes versions
de l'application.

3. **Suivi des meilleures pratiques :** Restez à l'affût des meilleures pratiques en matière de développement logiciel, 
telles que l'utilisation de principes SOLID, la gestion des tests automatisés et la mise en œuvre de pratiques de 
développement pilotées par le comportement (BDD) et de développement piloté par le domaine (DDD).

## 8. Ressources Additionnelles 

### Liens vers des articles et ressources complémentaires

Si vous souhaitez approfondir votre compréhension de l'architecture hexagonale, voici quelques ressources additionnelles
qui pourraient vous être utiles :

1. [Article original d'Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/){:target="_blank" rel="noopener noreferrer nofollow"} : Pour une lecture 
approfondie sur l'architecture hexagonale par son inventeur.

2. [Un article détaillé sur le même sujet](https://jmgarridopaz.github.io/content/hexagonalarchitecture.html){:target="_blank" rel="noopener noreferrer nofollow"} : Pour 
avoir un autre point de vue sous un angle différent.

3. [How to start with Domain-Driven-Design](https://medium.com/@m.merkulov/how-to-start-with-domain-driven-design-38561173f77a){:target="_blank" rel="noopener noreferrer nofollow"} :
Le DDD est souvent lié à l'architecture hexagonale, et ces livres fournissent une excellente ressource 
pour comprendre la conception orientée domaine.

4. [8 resources to learn about SOLID design principles](https://barryvanveen.nl/articles/51-8-resources-to-learn-about-solid-design-principles){:target="_blank" rel="noopener noreferrer nofollow"} : Les principes SOLID sont cruciaux 
pour la mise en œuvre de l'architecture hexagonale.

## 9. Conclusion

- **Avantages :**
: - Réduction des risques de régressions fonctionnelles lors des changements techniques.
: - Facilité d'ajout de nouvelles fonctionnalités et de modification des existantes.
: - Simplicité des tests de la partie métier.
: - Promotion des approches BDD et DDD.

- **Inconvénients :**
: - Augmentation du nombre de packages et complexification de la structure du projet.
: - Inefficacité potentielle dans certains contextes.

L'architecture hexagonale, également connue sous le nom d'architecture à base de ports et d'adaptateurs, est une 
approche architecturale qui isole la logique métier d'une application des détails techniques et des sources de données. 
Voici les principaux points à retenir :

- L'architecture hexagonale met l'accent sur la séparation de la logique métier (l'Hexagone) des parties techniques 
(les adaptateurs). Les dépendances vont de l'extérieur vers l'Hexagone.

- Elle facilite la réduction des risques de régressions fonctionnelles lors des changements techniques, permet l'ajout 
de nouvelles fonctionnalités et simplifie les tests de la logique métier.

- L'architecture hexagonale peut être associée au Domain-Driven Design (DDD), mais elle reste distincte. Elle favorise 
également les principes SOLID et les approches BDD et DDD.

- L'implémentation de l'architecture hexagonale implique la création d'un modèle métier indépendant des technologies, 
des interfaces claires et des adaptateurs pour communiquer avec les parties techniques.

- Les avantages de l'architecture hexagonale se manifestent principalement dans les contextes où la logique métier est 
stable et complexe.

En conclusion, l'architecture hexagonale offre une approche solide pour le développement d'applications avec une logique
métier complexe. Elle peut vous aider à créer des applications évolutives et faciles à maintenir.


