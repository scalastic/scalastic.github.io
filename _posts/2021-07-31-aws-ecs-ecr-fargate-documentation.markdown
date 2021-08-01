---
layout: post
title: Amazon Containers - ECS, ECR et Fargate
date: 2021-07-31 12:38:00 +0200
description: Principes fondamentaux et concepts clés d'Amazon ECS, ECR et Fargate à connaître. Tutoriel, mode d'emploi.
img: aws-ecs-ecr-fargate-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@slgoetz?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Simon Goetz</a> sur <a href="https://unsplash.com/collections/514990/architecture?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, ECS, ECS-Task, Cluster, Docker, ECS-Service, ECR, IAM-Role, Instance-Profile, Fargate, AMI, Auto-Scaling, ASG, ELB, Documentation]
lang: fr
permalink: /aws-ecs-ecr-fargate/
status: finished
---

AWS offre plusieurs Services de gestion de conteneurs. On peut citer:
- **Amazon ECS** pour Elastic Container Service
- **Amazon Fargate** qui permet d'exécuter Amazon ECS en Serverless
- **Amazon EKS** pour Amazon Elastic Kubernetes Service et qui permet de gérer un Cluster Kubernetes

Dans cet article, nous parlerons des 2 premiers Services, Amazon EKS méritant un chapitre à lui tout seul.

<hr class="hr-text" data-content="Plan">

* TOC
{:toc}

<hr class="hr-text" data-content="ECS">

## Amazon ECS

- **Amazon Elastic Container Service** (**Amazon ECS**) est un service de gestion de conteneurs hautement scalable et rapide
- C'est un Cluster d'instances EC2 qui exécutent, chacune, un **Agent ECS** (le conteneur Docker)
- L'agent ECS sert, de plus, à enregister l'instance dans le **Cluster ECS**
- Les instances EC2 reposent sur une AMI (Amazon Machine Image) qui contient l'agent ECS

### Composition d'un Cluster ECS

Un Cluster ECS contient :

- Une ou plusieurs instances EC2 :
    * Instances de type AMI *amazon-ami-ecs-optimized* qui repose sur l'image Docker *amazon/amazon-ecs-agent:latest*
    * Avec un stockage EBS ou EFS
    * Et une Key Pair pour y accéder
- Il s'intègre dans un VPC sur un ou plusieurs **Subnets** pour être hautement disponible (multi-AZ):
    * Un **ASG** est créé automatiquement et contient une Launch Configuration qui configure le nom du Cluster ECS dans chaque fichier **/etc/ecs/ecs.config** de chaque instance EC2
- Chaque instance EC2 est protégée par un **Security Group**
- A chaque instance EC2 est ajouté le **Role ecsInstanceRole** qui repose sur la Policy **AmazonEC2ContainerServiceforEC2Role**, managé par AWS, et qui permet à l'Agent ECS de faire des appels à l'API ECS

<hr class="hr-text" data-content="ECS Task">

### ECS Task

- C'est le formalisme d'AWS (en JSON) pour définir ce que contient le fichier Dockerfile et qui va servir à définir un conteneur Docker
- Il contient le nom de l'image à exécuter, le mapping des ports entre l'hôte et le conteneur, la quantité de mémoire et de CPU que le conteneur aura à disposition, les variables d'environnement à passer au conteneur,...

> warning "Security Group"
> Dans le Security Group des instances EC2, pensez à autoriser le port de l'application définit pour l'hôte afin de pouvoir accéder à l'application dans le conteneur

#### Placement des Tasks dans le Cluster ECS

> info ""
> Le placement des Tasks s'effectue en mode "best-effort". Amazon ECS tente toujours de placer des tâches même lorsque l’option de placement la plus optimale est indisponible. Cependant, les contraintes de placement des Tasks sont contraignantes, et **elles peuvent empêcher le placement des Tasks**.

Lorsque Amazon ECS place des Tasks, il utilise le processus suivant pour sélectionner une instance de conteneur:

1. Il identifie les instances qui satisfont les exigences du processeur, de la mémoire et du port dans la définition de la tâche
1. Il identifie les instances qui satisfont aux contraintes de placement des Tasks
1. Il détermine les instances qui satisfont aux stratégies de placement des Tasks
1. Il sélectionne les instances de placement des Tasks

#### Stratégie de placement

Il existe différentes stratégies de placement :
- **binpack** : 
    * Les Tasks sont placées sur des instances de conteneurs de manière à laisser le moins de CPU ou de mémoire inutilisée
    * Cette stratégie minimise le nombre d’instances dans le Cluster ECS et donc les coûts associés
- **random** :
    * Les Tasks sont placées au hasard sur les instances disponibles
- **spread** :
    * Les Tasks sont réparties en fonction d'une valeur spécifiée. Les valeurs acceptées sont ***instanceId*** ou n’importe quel attribut personnalisé qui peut s'appliquer à une instance ECS, comme l'attribut: ***ecs.availability-zone***
    * Dans le cas d'un attribut ***ecs.availability-zone***, les Tasks seront réparties sur toutes les AZ du Cluster ECS

<hr class="hr-text" data-content="ECS Service">

### ECS Service

ECS Service définit comment démarrer une ECS Task : c'est l'équivalent du fichier SWARM de Docker ou des fichiers de configuration Service/Replica/Deployment... de Kubernetes

Il indique :
* Combien de Tasks devraient être démarrées (min, max, souhaitées) :
    - **ECS Service Auto Scaling** permet une mise à l'échelle automatique des Tasks
* Comment les répartir entre les instances EC2 du Cluster 
* **ECS Cluster Auto Scaling** (**CAS**) permet d'ajouter ou de supprimer automatiquement des instances EC2 au Cluster ECS
* L'accès à l'application au travers d'un **Elastic Load Balancer** (au choix ALB, NLB, CLB) :
    - Le **dynamic port forwarding** du LB permet de ne pas spécifier de Port côté Hôte et c'est le LB qui fera le mapping automatiquement
    - Cette fonctionalité nécessite de modifier le Security Group des instances EC2 (autorisation de tous les ports pour le SG du Load Balancer)

### ECS Auto Scaling 

> info "Auto Scaling"
>
> - Comme on peut le constater, la documentation AWS fait mention en de très nombreux termes à l'Auto Scaling : ici *ECS Service Auto Scaling*, *ECS Cluster Auto Scaling*,...
> - En réalité, **AWS Auto Scaling** (le service générique) est organisé en 2 catégories :
>   * **Amazon EC2 Auto Scaling**, lorsque cela concerne une instance EC2
>   * **Application Auto Scaling**, pour tout ce qui n'est pas EC2

Dans ECS, il existe un **Cluster Capacity Provider** qui, associé à un **Auto Scaling Group**,  gére le dimensionnement des instances du Cluster

<hr class="hr-text" data-content="ECR">

## Amazon ECR

- **Amazon Elastic Container Registry** (Amazon ECR) est un registre d’images de conteneurs géré par AWS qui est sécurisé, scalable et robuste.
- Amazon ECR repose sur des autorisations AWS IAM pour pousser et récupérer les images de son registre.
- Il propose différentes fonctionalités comme le scan de sécurité des images ou la réplication Cross-Region et Cross-Account

### Utilisation en ligne de commande

- Authentification du Client Docker au registre ECR avec AWS CLI v1 ou v2 :

{% highlight CLI-v1 %}
$(aws ecr get-login-password --no-include-email --region <region>)
{% endhighlight %}

{% highlight CLI-v2 %}
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com
{% endhighlight %}

- Tag de l'image Docker avec l'URL du registre :

{% highlight zsh %}
docker tag <docker-image-name>:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/<docker-image-name>:latest
{% endhighlight %}

- Push de l'image Docker dans le registre :

{% highlight zsh %}
docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/<docker-image-name>:latest
{% endhighlight %}

<hr class="hr-text" data-content="Securité">

### Les Roles derrière tout ça

Il est important d'avoir à l'esprit l'utilisation des Roles qui est faite par ECS et ce qui reste à configurer par l'utilisateur :
- Les instance EC2 qui font partie d'un Cluster ECS possèdent implicitement des Roles leur permettant d'interagir avec :
    * ***ECS Service*** : utilisé par l'Agent ECS pour faire des appels à l'API ECS Service
    * ***CloudWatch Logs*** : pour envoyer les logs d'utilisation à l'API CloudWatch
    * ***ECR Service*** : pour récupérer l'image Docker du dépôt ECR
- Mais l'utilisateur doit spécifier les Roles nécessaires aux ECS Tasks, par exemple :
    * ***AmazonS3ReadOnlyAccess*** pour une application définie dans une Task qui accèdera à un Bucket S3
    * ***AmazonEC2FullAccess*** pour une application qui accèdera à l'API EC2

> info "IAM Role et Instance Profile"
> On trouvera les deux termes pour désigner, selon les cas, la même chose en fait :
> - L'***Instance Profile*** est l'instanciation, dans une instance EC2, des permissions définies dans un Role
> - Le ***IAM Role*** étant juste une définition de permissions 

<hr class="hr-text" data-content="Fargate">

## Amazon Fargate

- **AWS Fargate** permet de créer un Cluster Amazon ECS sans se soucier des instances Amazon EC2.
- C'est la version **Serverless** de Amazon ECS
- La création des Tasks est similaire à celle dans ECS mais Fargate s'occupe de leur fournir un environnement d'exécution 

C'est donc beaucoup plus simple.