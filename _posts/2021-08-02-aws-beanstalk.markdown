---
layout: post
title: AWS Elastic Beanstalk
date: 2021-08-02 11:19:00 +0200
description: Principes fondamentaux et concepts clés d'AWS Elastic Beanstalk à connaître. Tutoriel, mode d'emploi.
img: aws-elastic-beanstalk-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@jeremybishop?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jeremy Bishop</a> sur <a href="https://unsplash.com/s/photos/tree?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, Beanstalk, EB, DevOps, Automatisation, Amazon-SQS, Deployment, Docker, ECS, Documentation]
lang: fr
permalink: /aws-elastic-beanstalk/
status: finished
---

AWS Elastic Beanstalk est une service d'orchestration d'AWS qui sert à déployer des applications. Il sait gérer différents services de AWS tels que EC2, S3, Simple Notification Service (SNS), CloudWatch , AutoScaling et Elastic Load Balancers.

<hr class="hr-text" data-content="Plan">

* TOC
{:toc}

<hr class="hr-text" data-content="Principes">

## Principes

AWS Beanstalk repose sur la définition de 3 objets :
- une **application** dans une **version** donnée,
- une **configuration** qui contient la définition des Services AWS formant l'architecture de l'infrastructure,
- un **environnement** qui combine version applicative et configuration (dev, test, int, prod,...)

Par conséquent, il simplifie le déploiement d'une application :
- Le développeur s'occupe du code applicatif et des versions
- Beanstalk automatise le déploiment et la configuration des LB, de l'AutoScaling, des Sécurity Groups, des instances EC2, du monitoring Cloudwatch, des Subnets,...

> info ""
> Elastic Beanstalk fait partie de la panoplie d'outils **DevOps** disponible dans AWS

Il prend en charge une multitude de langages applicatifs (Java, .NET, Python, Node.js, Ruby, Conteneurs Docker,...)

Il gére 2 types d'architecture applicative :

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-elastic-beanstalk-tiers.png --alt Architectures applicatives Server Web ou Worker %}
  <figcaption>Architectures applicatives Server Web ou Worker</figcaption>
</figure>

- **Web Server Tier** : pour des applications qui servent des reqêtes HTTP
- **Worker Tier** : pour une application *Backend* qui extrait ses tâches d’une file d’attente Amazon Simple Queue Service (Amazon SQS)

<hr class="hr-text" data-content="Déploiement">

## Stratégies de déploiement

On retrouve dans toute entreprise les mêmes stratégies de déploiement. Elles varient en fonction du but recherché.

Voyons ce que propose Beanstalk et comment mettre en oeuvre les stratégies courantes.

### Intégrés à Beanstalk

Beanstalk propose différentes stratégies de déploiement : 

#### All at once

<figure class="article">
    {% picture {{site.baseurl}}/assets/img/aws-elastic-beanstalk-all-at-once.png --alt Déploiement d'une MAJ en All at once %}
    <figcaption>Déploiement d'une MAJ en All at once</figcaption>
</figure>

* Déploiement rapide mais l'application a un temps d'arrêt
* Pas de coût supplémentaire
* Idéal pour des environnements hors-prod

#### Rolling

<figure class="article">
    {% picture {{site.baseurl}}/assets/img/aws-elastic-beanstalk-rolling.png --alt Déploiement d'une MAJ en Rolling %}
    <figcaption>Déploiement d'une MAJ en Rolling</figcaption>
</figure>

* Déploiement plus long (il faut adapter le ***Bucket Size*** au nombre d'instances) mais l'application n'a pas d'interruption
* 2 versions de l'application cohéxistes
* Pas de coût supplémentaire

#### Rolling with additional batch

<figure class="article">
    {% picture {{site.baseurl}}/assets/img/aws-elastic-beanstalk-rolling-with-additional-batch.png --alt Déploiement d'une MAJ en Rolling with additional batch %}
    <figcaption>Déploiement d'une MAJ en Rolling with additional batch</figcaption>
</figure>

* Déploiement plus long (il faut adapter le ***Bucket Size*** au nombre d'instances) mais l'application n'a pas d'interruption et s'exécute à pleine capacité pendant le processus de déploiement
* 2 versions de l'application cohéxistes
* Léger coût supplémentaire (Bucket size en plus)

#### Immutable

<figure class="article">
    {% picture {{site.baseurl}}/assets/img/aws-elastic-beanstalk-immutable.png --alt Déploiement en mode Immutable %}
    <figcaption>Déploiement en mode Immutable</figcaption>
</figure>

* Déploiement plus long mais l'application n'a pas d'interruption et s'exécute à pleine capacité pendant le processus de déploiement
* Le déploiement de la nouvelle version s'exécute dans un ASG temporaire
* 2 versions de l'application cohéxistes
* Coût élevé (double d'instances)

#### Traffic Splitting

* Equivalent du **Canary Testing** : un poucentage croissant d'utilisateurs est automatiquement redirigé vers la nouvelle application à intervalles de temps réguliers
* La santé de l'application est surveillée et un Rollback très rapide est effectué en cas de défaillance
* Déploiement plus long mais l'application n'a pas d'interruption et s'exécute à pleine capacité pendant le processus de déploiement
* Le déploiement de la nouvelle version s'exécute dans un ASG temporaire
* 2 versions de l'application cohéxistes

<hr class="hr-text" data-content="Blue/Green">

### Déploiement Blue / Green

<figure class="article">
    {% picture {{site.baseurl}}/assets/img/aws-elastic-beanstalk-blue-green.png --alt Déploiement Blue / Green %}
    <figcaption>Déploiement Blue / Green</figcaption>
</figure>

Il n'est pas vraiment pris en charge par Beanstalk mais il est possible de le réaliser à l'aide d'actions manuelles :

- L'application en version N est déployée sur l'environnement **Blue**
- L'application en version N+1 est déployée sur l'environnement **Green** avec exactement la même configuration
- Ouverture de l'environnement Green au niveau de **Route 53** pour les équipes de Tests  
- Tests sur l'environnement Green :
    * **Tests OK** : Switch de tout le trafic sur le Green avec Route 53 et suppression de la version Blue en configurant l'ASG à min. capacity = 0
    * **Tests KO** : Suppression de la version Green et on reste sur le Blue

### Autre considération

> info "Dev vs Prod"
>   - Dans un environnement de **Développement**, il est souvent nécessaire de n'avoir qu'une seule instance applicative : le nom DNS de l'application est mappé à une **Elastic IP** de l'instance EC2
> - Dans un environnement de **Production**, on souhaite avoir de la **Haute Disponibilité** : le nom DNS de l'appli est mappé à l'adresse IP d'un **Load balancer** qui va rediriger les requêtes sur un **Auto Scaling Group** qui va répartir les instances EC2 sur différentes **Availability Zones**

<hr class="hr-text" data-content="Automatisation">

## Automatisation

Il est possible d'automatiser les déploiements avec Beanstalk grâce à des fichiers de configuration que l'on ajoute aux sources de l'application :
- Ils doivent se situer à la racine de l'application dans un répertoire **.ebextensions/** (basé sur des templates AWS CloudFormation)
- Chaque fichier de configuration doit avoir l'extension **.config** et être au **format JSON** ou **YAML**
- Ils permettent de spécifier 
    * Des **ressources additionnelles** telles que une BDD RDS, un Bucket S3,... (n'importe quels services AWS)
    * Un cerficat SSL pour le LB à configurer soit dans le fichier **securelistener-alb.config**, soit via le service AWS Certificate Manager (ACM)
    * Des redirections HTTP vers HTTPS au niveau des instance ou de l'ALB (uniquement)
    * Des variables optionnelles avec **option_settings**

### Conteneur Docker

Beanstalk sait gérer les conteneurs Docker. Pour cela, il est possible de fournir un fichier :
- **Dockerfile** : il sera utilisé pour construire et lancer l'image Docker
- **Dockerrun.aws.json** en version v1 : 
    * Mode Single Docker (1 seule image)
    * Il fait référence à une image Docker déjà contruite ainsi que les éléments de configuration
    * Beanstalk ne crée pas d'instance ECS mais simplement une instance EC2 avec Docker
- **Dockerrun.aws.json** en version v2 : 
    * Mode Multi Docker (plusieurs images)
    * Contient la définition d'une Task ECS
    * Beanstalk crée un Cluster ECS contenant des instances ECS, un LB en mode HA et la Task ECS
    * Les images Docker doivent être déjà construites et présentes dans AWS ECR ou DockerHub

### Custom Platform

Dans le cas où le langage de votre application n'est pas pris en charge par Beanstalk, il est possible de contruire une plateforme Beanstalk personnalisée.

Cela nécessite de :
- Construire une AMI avec un fichier **Platform.yaml**
- Construire la **Platform** avec le logiciel **Packer** 
