---
layout: post
title: "Le CI/CD selon AWS : CodeCommit, CodeBuild, CodeDeploy et CodePipeline"
date: 2021-09-02 11:35:00 +0200
description: "Découvrez les outils clés d'AWS pour le développement et le déploiement d'applications : CodeCommit, CodeBuild, CodeDeploy et CodePipeline. Améliorez votre flux de CI/CD sur AWS."
img: aws-codecommit-codebuild-codedeploy-codepipeline-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@heysupersimi?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Simone Hutsch</a> sur <a href="https://unsplash.com/s/photos/battersea?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, CodeCommit, CodeBuild, CodeDeploy, CodePipeline, CI/CD, CodeStar, STS, SNS, EC2, ASG, Lambda, CloudWatch, SSM, Documentation]
lang: fr
permalink: /aws-codecommit-codebuild-codedeploy-codepipeline/
status: finished
---

Lorsqu'il s'agit de développement d'applications dans le cloud, Amazon Web Services (AWS) propose une gamme complète 
d'outils qui facilitent l'intégration continue et le déploiement continu (CI/CD). Ces processus essentiels permettent 
aux équipes de développement de livrer rapidement et régulièrement des applications de haute qualité.

Dans cet article, nous explorerons les principes fondamentaux et les concepts clés des outils de développement AWS 
suivants : **CodeCommit**, **CodeBuild**, **CodeDeploy** et **CodePipeline**. Chacun de ces services joue un rôle spécifique dans le 
cycle de vie d'une application et offre des fonctionnalités puissantes pour automatiser les différentes étapes du 
développement et du déploiement.

En comprenant ces services, vous serez en mesure d'utiliser efficacement les outils d'intégration continue et de 
déploiement continu d'AWS, ce qui vous permettra d'accélérer le développement, d'améliorer la qualité de votre code et 
de déployer vos applications de manière fiable et cohérente.

<hr class="hr-text" data-content="Plan">

* TOC
{:toc}

<hr class="hr-text" data-content="CodeCommit">

## AWS CodeCommit

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-codecommit-codebuild-codedeploy-codepipeline-codecommit.jpg --alt Illustration de Code Commit (Crédit Mystique sur https://github.com/miztiik/setup-aws-code-commit) %}
  <figcaption>Illustration de Code Commit (Crédit Mystique sur https://github.com/miztiik/setup-aws-code-commit)</figcaption>
</figure>

**AWS CodeCommit** est un service de gestion de version basé sur Git, hébergé par AWS. Il offre une plateforme sécurisée et 
évolutive pour stocker et gérer le code source, les fichiers binaires et les documents de vos projets dans le cloud.

Caractéristiques clés de CodeCommit :

- **Stockage et gestion du code** : CodeCommit vous permet de stocker et de gérer facilement le code source de vos 
applications, ainsi que d'autres types de fichiers tels que des fichiers binaires ou des documents. Vous pouvez 
organiser vos dépôts de code en fonction de vos projets et y accéder de manière centralisée.

- **Sécurité et accès protégé** : CodeCommit garantit la sécurité de vos ressources grâce à l'intégration avec **AWS 
Identity and Access Management** (**IAM**). Vous pouvez définir des politiques d'autorisation granulaires pour contrôler 
l'accès au code source et aux dépôts. Cela vous permet de gérer finement les autorisations des utilisateurs, des groupes
et des rôles au sein de votre organisation.

- **Haute disponibilité et dimensionnement automatique** : CodeCommit est un service entièrement géré par AWS, ce qui 
signifie qu'il offre une haute disponibilité, sans limite de taille de dépôt. Vous n'avez pas à vous soucier de la mise 
en place ou de la gestion de l'infrastructure sous-jacente. Le service s'adapte automatiquement à vos besoins en matière
de stockage et de performances.

- **Chiffrement et sécurité des données** : CodeCommit chiffre vos données lors des transferts via HTTPS ou SSH. De 
plus, vous pouvez choisir de chiffrer le contenu de vos dépôts à l'aide d'**AWS Key Management Service** (**KMS**). Cela 
garantit la confidentialité de votre code source et de vos fichiers.

- **Déclenchement d'actions basées sur des événements** : CodeCommit peut déclencher des actions en fonction 
d'événements spécifiques. Par exemple, vous pouvez configurer des notifications vers **Amazon Simple Notification Service** 
(**SNS**), exécuter des fonctions **AWS Lambda** ou déclencher des événements dans **AWS CloudWatch Events**. Cela vous permet 
d'automatiser des actions en réponse à des événements liés à vos dépôts de code.

En utilisant AWS CodeCommit, vous bénéficiez d'un service robuste et sécurisé pour la gestion de vos versions de code, 
offrant des fonctionnalités avancées d'authentification, d'autorisation, de chiffrement et de déclenchement d'actions 
basées sur des événements.

> info "Donner accès à son dépôt"
> Utiliser un **Role IAM** et donner accès à son Role grâce à **AWS Security Token Service** (**STS**)

<hr class="hr-text" data-content="CodeBuild">

## AWS CodeBuild

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-codecommit-codebuild-codedeploy-codepipeline-codebuild.jpg --alt Exemple de fonctionnement de CodeBuild (Crédit AWS sur https://docs.aws.amazon.com/fr_fr/codebuild/latest/userguide/concepts.html) %}
  <figcaption>Exemple de fonctionnement de CodeBuild (Crédit AWS sur https://docs.aws.amazon.com/fr_fr/codebuild/latest/userguide/concepts.html)</figcaption>
</figure>

**AWS CodeBuild** est un service qui facilite la compilation et les tests de code dans le processus de développement 
d'applications. Il offre une intégration transparente avec différentes sources de code, notamment **CodeCommit**, 
**CodePipeline**, **GitHub** et **S3**.

### Définition d'un Build

Pour définir un build dans CodeBuild, vous utilisez un fichier de configuration appelé `buildspec.yml`. Ce fichier 
permet de spécifier les instructions spécifiques à exécuter lors de la construction (build) de votre application.

Voici un exemple de structure d'un fichier `buildspec.yml` :

{% highlight yaml %}
version: 0.2

run-as: Linux-user-name

env:
  shell: shell-tag
  variables:
    key: "value"
        
phases:
  install:
    commands:
      - command
    finally:
      - command
  pre_build:
    commands:
      - command
  build:
    run-as: Linux-user-name
    on-failure: ABORT
    commands:
      - command
  post_build:
    commands:
      - command
reports:
  report-group-name-or-arn:
    files:
      - location
      - location
    base-directory: location
    discard-paths: no | yes
    file-format: report-format
artifacts:
  files:
    - location
  name: artifact-name
  s3-prefix: prefix
cache:
  paths:
    - path
{% endhighlight %}

- **env** : Pendant la définition du build, vous avez la flexibilité de définir des variables d'environnement pour configurer le
  comportement du build. Cela vous permet d'adapter le processus de construction en fonction de vos besoins spécifiques.

- **phases** : Un build dans CodeBuild est organisé en différentes phases qui définissent les étapes du processus de construction. 
Voici quelques-unes des phases couramment utilisées :
  - **install** : Cette phase est dédiée à l'installation des dépendances et des outils nécessaires à la construction de 
  votre application. Vous pouvez spécifier les commandes et les étapes requises pour configurer l'environnement de build.
  - **pre_build** : Dans cette phase, vous pouvez effectuer des actions préliminaires avant la compilation du code, telles
  que la configuration de variables d'environnement supplémentaires ou l'exécution de scripts de préparation.
  - **build** : C'est la phase principale où le code source est compilé et transformé en artefact exécutable. Vous pouvez 
  spécifier les commandes de compilation, les tests unitaires, les validations et autres tâches de construction nécessaires.
  - **post_build** : Après la construction réussie de l'application, cette phase vous permet d'effectuer des actions 
  supplémentaires, telles que l'emballage de l'application, la génération de rapports ou l'archivage des artefacts générés.

- **artefacts** : Les artefacts générés lors du build, tels que les fichiers binaires ou les packages, peuvent être stockés dans un bucket
S3. Cela facilite leur récupération ultérieure ou leur utilisation dans des étapes de déploiement ultérieures.

- **cache** : Pour accélérer les builds, CodeBuild prend en charge la mise en cache des dépendances. Cela signifie que si une 
dépendance a déjà été téléchargée lors d'un build précédent, elle peut être récupérée à partir du cache plutôt que 
d'être téléchargée à nouveau. Cela permet de gagner du temps et d'optimiser les performances de construction.

Enfin, CodeBuild offre la possibilité de lancer un build en local à l'aide de Docker. Cette fonctionnalité est utile 
pour le débogage et l'analyse des erreurs de build, car elle vous permet d'exécuter le processus de construction sur 
votre machine de développement.

### Avantages Clés de CodeBuild :

- **Service entièrement géré** : CodeBuild ne nécessite aucun provisionnement de serveur de build. Il s'agit d'un 
service entièrement géré par AWS, ce qui signifie que vous pouvez vous concentrer sur le développement de votre 
application sans vous soucier de la gestion de l'infrastructure.

- **Auto-scalabilité et sans limitation** : CodeBuild peut faire face à des charges de travail variables grâce à sa 
capacité d'auto-scalabilité. Il peut exécuter plusieurs builds simultanément pour accélérer le processus de 
développement. De plus, il n'y a pas de limite prédéfinie sur la taille du projet ou le nombre de builds.

- **Coût basé sur l'utilisation** : Vous êtes facturé uniquement pour le temps de build réellement utilisé. Cela permet 
une tarification flexible et adaptée à vos besoins.

- **Personnalisation des images Docker** : CodeBuild s’appuie sur **CloudWatch Events** et **AWS Lambda** et utilise des
images Docker pour exécuter les builds. Vous pouvez personnaliser ces images pour prendre en charge différents langages 
de programmation et les dépendances spécifiques à votre projet. Des images existent pour les langages Java, Python, Ruby,
Go, Node.js, PHP, .NET.

- **Intégration avec les services de sécurité** : CodeBuild s'intègre étroitement avec d'autres services de sécurité 
AWS tels que **AWS Key Management Service** (**KMS**) pour le chiffrement des artefacts de build, les **IAM Roles** pour la gestion 
des autorisations de build, la sécurité réseau **VPC Network Security** pour l'exécution de tests dans votre VPC, et **AWS 
CloudTrail** pour la journalisation des appels d'API.

- **Intégration dans l'écosystème AWS** : CodeBuild offre une intégration étroite avec l'écosystème AWS, ce qui permet 
d'améliorer la visibilité et la gestion des builds. Voici quelques fonctionnalités d'intégration clés :
  - Les logs des builds peuvent être stockés dans des emplacements tels que **S3** ou **AWS CloudWatch**, offrant ainsi une 
  traçabilité complète des activités de build.
  - CodeBuild génère des métriques qui permettent de suivre les performances des builds et d'obtenir des informations 
  sur les temps d'exécution, les erreurs éventuelles, etc.
  - Grâce à l'intégration avec **CloudWatch Alarms**, vous pouvez configurer des seuils de détection d'échecs de builds.
  Lorsque ces seuils sont atteints, des notifications sont déclenchées pour vous alerter des problèmes potentiels.
  - En utilisant **AWS Simple Notification Service** (**SNS**), CodeBuild peut envoyer des notifications personnalisées 
  pour informer les membres de l'équipe ou les parties prenantes des événements importants liés aux builds.

Avec AWS CodeBuild, vous disposez d'un service puissant et flexible pour automatiser la compilation et les tests de 
votre code, en bénéficiant d'une gestion simplifiée, d'une tarification basée sur l'utilisation et d'une intégration 
étroite avec les autres services AWS.

> warning "CodeBuild ou CodePipeline"
> Les instructions de builds peuvent être définies dans CodeBuild et dans CodePipeline. Il est important de bien comprendre 
> que la définition de ces instructions, dans les deux outils à la fois, peut entraîner des comportements non souhaités et 
> difficiles à interpréter.

> info "VPC"
> Par défaut, CodeBuild est exécuté en dehors de votre VPC. Pour qu'il puisse accéder à des ressources telles qu'un Load 
> Balancer, une BDD ou une instance EC2, il faut paramétrer une configuration de VPC (ID du VPC, IDs des sous-réseaux, 
> ID du Security Group)

<hr class="hr-text" data-content="CodeDeploy">

## AWS CodeDeploy

**AWS CodeDeploy** est un service de déploiement automatique d'applications qui simplifie et automatise le processus de 
déploiement d'applications sur un large éventail d'instances, y compris les instances **EC2** et les **fonctions Lambda**.

Lors de l'utilisation de CodeDeploy, il est nécessaire d'installer l'Agent CodeDeploy sur les instances cibles. Cet 
agent joue un rôle clé dans l'exécution des déploiements et facilite la coordination des actions de déploiement sur les 
instances concernées.

Le fonctionnement de CodeDeploy repose sur l'utilisation d'un fichier de configuration appelé `appspec.yml`. Ce fichier 
permet de spécifier les instructions détaillées pour chaque déploiement.

CodeDeploy organise les instances en groupes, généralement par environnement (par exemple, développement, test, 
production). Cette organisation permet de déployer des applications de manière cohérente sur les instances cibles 
spécifiques à chaque environnement.

Voici quelques termes importants à connaître dans le contexte de CodeDeploy :

- **Application** : Nom de l'application ou du composant applicatif que vous souhaitez déployer.

- **Compute Platform** :  Instances cibles EC2 ou celles appartenant à un Groupe Auto Scaling (ASG), les instances 
On-Premise et les fonctions Lambda.

- **Deployment Configuration** : 
  - Pour les instances EC2 et On-Premise, vous pouvez spécifier un pourcentage minimum d'instances en bon état requis pour le déploiement. 
  - Pour les fonctions Lambda, vous pouvez définir le routage du trafic vers les nouvelles versions déployées.

- **Type de Déploiement** : CodeDeploy prend en charge les déploiements In-Place (mise à jour de l'application sur les instances existantes) ainsi que les déploiements Blue/Green, qui impliquent de lancer de nouvelles instances EC2 et de les mettre en service avant de basculer le trafic vers elles.

- **IAM Instance Profile** : Permissions IAM pour que les instances EC2 puissent lire les artefacts depuis S3 ou GitHub lors du déploiement.

- **Application Revision** : Révision du code source et du fichier `appspec.yml`.

- **Service Role** : Rôle IAM qui permet à CodeDeploy d'effectuer les actions nécessaires au déploiement.

- **Target Revision** : Version de l'application une fois le processus de déploiement terminé.

La définition d'un déploiement dans CodeDeploy implique plusieurs éléments clés :

- **File Section** : Instructions pour copier l'artefact de S3 vers le système de fichiers de chaque instance cible.

- **Hooks** : Instructions pour déployer la nouvelle version de l'application sur les instances. Les hooks sont découpés en différentes phases ordonnées, notamment :
  - **ApplicationStop** : arrêt de l'application en cours sur les instances cibles.
  - **DownloadBundle** : téléchargement de la nouvelle version de l'application à partir de S3.
  - **BeforeInstall** : exécution d'actions spécifiques avant l'installation de la nouvelle version.
  - **Install** : installation de la nouvelle version de l'application.
  - **AfterInstall** : exécution d'actions supplémentaires après l'installation.
  - **ApplicationStart** : démarrage de la nouvelle version de l'application.
  - **ValidateService** : vérification du bon fonctionnement de la nouvelle version de l'application à l'aide d'un Health Check.

Dans le cas des déploiements Blue/Green avec des instances EC2, CodeDeploy permet de lancer de nouvelles instances EC2, 
de déployer la nouvelle version de l'application sur ces instances, de les mettre en service et de basculer le trafic 
vers elles tout en conservant la version précédente des instances actives pour un éventuel rollback.

AWS CodeDeploy offre une solution complète pour le déploiement automatisé d'applications sur diverses plateformes et 
configurations, en fournissant une flexibilité et une facilité d'utilisation pour le déploiement en continu.

<hr class="hr-text" data-content="CodeStar">

## AWS CodeStar

**AWS CodeStar** est une solution intégrée de CI/CD (Intégration Continue et Déploiement Continu) proposée par AWS. Elle 
regroupe un ensemble de services et d'outils qui facilitent le développement et le déploiement d'applications.

CodeStar offre une vue d'ensemble complète des services de CI/CD et permet de les gérer à partir d'un point d'entrée 
unique. Cela simplifie la configuration et la gestion de l'ensemble du processus de développement, du code source à la 
livraison de l'application.

Une des fonctionnalités clés de CodeStar est son regroupement des services de CI/CD avec d'autres outils populaires. 
Par exemple, certaines régions offrent une intégration avec l'**IDE Cloud9**, un environnement de développement basé sur le 
cloud, ainsi qu'avec **JIRA** ou **GitHub Issues**, des outils de gestion de tickets. Cette intégration permet aux développeurs 
d'accéder à ces outils depuis le même tableau de bord et de bénéficier d'une expérience de développement plus fluide.

CodeStar propose également un environnement de développement et de CI/CD adapté au langage de l'application. Que vous 
utilisiez Java, Go, Python, Node.js, HTML5 ou d'autres langages, CodeStar fournit des modèles et des configurations 
prédéfinies pour faciliter la création d'un environnement de développement approprié. Cela permet de gagner du temps et 
de simplifier la configuration initiale, en fournissant une structure de projet adaptée au langage choisi.

<hr class="hr-text" data-content="CodePipeline">

## AWS CodePipeline

**AWS CodePipeline** est un service d'orchestration de CI/CD (Intégration Continue et Déploiement Continu) proposé par AWS. 
Il permet de mettre en place et de gérer des pipelines de déploiement entièrement automatisés.

CodePipeline agit en tant qu'orchestrateur pour coordonner les différentes étapes du processus de déploiement, de la 
récupération du code source à la livraison de l'application. Il facilite l'intégration continue en automatisant la 
construction, les tests et les déploiements ultérieurs, ce qui permet de garantir une livraison rapide et fiable des 
applications.

CodePipeline offre une intégration transparente avec des outils tiers tels que GitHub, Jenkins et des services AWS tels 
que Elastic Beanstalk, CloudFormation et ECS. Cela permet aux développeurs d'utiliser les outils de leur choix et de 
les intégrer facilement dans leurs pipelines de déploiement.

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-codecommit-codebuild-codedeploy-codepipeline-codepipeline.jpg --alt Exemple de pipeline de CICD avec CodePipeline (Crédit AWS à https://aws.amazon.com/fr/blogs/devops/complete-ci-cd-with-aws-codecommit-aws-codebuild-aws-codedeploy-and-aws-codepipeline/) %}
  <figcaption>Exemple de pipeline de CICD avec CodePipeline (Crédit AWS à https://aws.amazon.com/fr/blogs/devops/complete-ci-cd-with-aws-codecommit-aws-codebuild-aws-codedeploy-and-aws-codepipeline/)</figcaption>
</figure>

Un exemple concret d'implémentation d'un pipeline de CI/CD avec CodePipeline pourrait ressembler à ceci :

1. Le développeur pousse du code dans **CodeCommit**.

2. Un évènement est déclenché vers **AWS CloudWatch Event** qui active **AWS CodePipeline** automatiquement. Ce dernier lance 
le processus de build à l'aide d'**AWS CodeBuild**. Le code source est récupéré, compilé, testé et des artefacts livrés 
dans un **Bucket S3**.

3. **AWS CodePipeline** déclenche ensuite un déploiement avec **AWS CodeDeploy**, qui lance le déploiement des applications 
sur des instances EC2 grâce à l'**Agent CouldDeploy** préalablement installé.

Ce scénario d'implémentation montre comment CodePipeline peut orchestrer l'ensemble du processus de CI/CD, de la gestion
du code source à la livraison de l'application, en automatisant les différentes étapes et en facilitant l'intégration 
avec divers outils et services. Il existe bien sûr des scénarios plus complexes mettant en scène d'autres Services AWS 
ou externes.

En résumé, AWS CodePipeline est un outil puissant pour l'orchestration des pipelines de CI/CD. Il offre une flexibilité 
et une facilité d'utilisation, en permettant aux développeurs de créer des workflows de déploiement automatisés et 
personnalisables, tout en intégrant des outils tiers et des services AWS pour répondre aux besoins spécifiques de leur 
processus de développement.

<hr class="hr-text" data-content="Conclusion">

## Conclusion

Nous vous encourageons à explorer davantage chaque service et à les utiliser dans des projets réels. Chacun de ces 
outils a ses propres fonctionnalités et avantages, et en les utilisant de manière appropriée, vous pouvez accélérer le 
développement, améliorer la qualité des applications et optimiser vos processus de déploiement sur AWS.

En somme, avec AWS CodeCommit, CodeBuild, CodeDeploy et CodePipeline, vous disposez d'un ensemble d'outils puissants 
pour le développement et le déploiement d'applications sur AWS. En les maîtrisant, vous pourrez créer des flux de 
travail efficaces et améliorer l'ensemble de votre processus de développement.