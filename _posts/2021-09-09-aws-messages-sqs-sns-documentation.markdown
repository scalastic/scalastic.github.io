---
layout: post
title: AWS Messages - Amazon SQS et SNS
date: 2021-09-09 15:38:00 +0200
description: Principes fondamentaux et concepts clés d'Amazon SQS et SNS à connaître. Tutoriel, mode d'emploi.
img: aws-messages-sqs-sns-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@zvessels55?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Zach Vessels</a> sur <a href="https://unsplash.com/s/photos/traffic-jam?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, SQS, SNS, Queue, Topic, Message, Notification, FIFO, Documentation]
lang: fr
permalink: /aws-messages-sqs-sns/
status: finished
---

- Une architecture particulièrement bien adaptée au Cloud est l'**architecture distribuée** : chaque composant applicatif peut être dimmensionné en fonction des besoins. Les *microservices* sont une des variations de ce type d'architecture.
- Cela pose alors le problème de communication entre ces composants : des interactions couplées (deux à deux) sont difficiles à maintenir et problématiques en cas de dimmensionnements différents. 

Il est vite apparue une brique logicielle intermédiaire (**Middleware**) pour assurer un **découplage** et une communication **asynchrone** entre ces composants. 

Nous allons voir ici 2 types de Message-Oriented Middleware (MOM) :
- **Amazon SQS** qui est une file d'attente de Messages (Message Queue)
- **Amazon SNS** qui suit un modèle Publish/Subscribe de Messages

<hr class="hr-text" data-content="Plan">

* TOC
{:toc}


<hr class="hr-text" data-content="SQS">

## Amazon Simple Queue Service

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-messages-sqs-sns-sqs-queue.jpg --alt Exemple d'utilisation d'une SQS Queue %}
  <figcaption>Exemple d'utilisation d'une SQS Queue</figcaption>
</figure>

### Caractéristiques

Amazon Simple Queue Service ou SQS est un service de file d'attente de messages, entièrement géré par AWS :
- Nombre illimité de files d'attente et de messages
- Taille du message pouvant atteindre 256 Ko
    * Si vous avez besoin de plus grands messages, utilisez *Amazon SQS Extended Client Library for Java* qui stocke le contenu du message dans Amazon S3 et renvoie juste sa référence
- Conservation des messages de 4 jours par défaut (peut aller jusqu'à 14 jours)

### Standard vs FIFO

Il prends en charge 2 types de Queues aux caractéristiques différentes :

| Standard Queue 	| FIFO Queue 	|
| :---: | :---: |
| **Débit illimité** : prend en charge un nombre pratiquement illimité de transactions par seconde (TPS) 	| **Haut débit** :  par défaut, prend en charge jusqu'à 300 messages par secondes (300 opérations d'envoi, de réception ou de suppression par seconde). Si vous traitez par lots de 10 messages par opération (au maximum), les files d'attente FIFO peuvent prendre en charge jusqu'à 3 000 messages par seconde. 	|
| **Remis au moins une fois**  : un message est remis au moins une fois, mais il peut arriver qu'il soit remis en plusieurs exemplaires. 	| **Traitement en une seule fois**  : un message est remis une fois et reste disponible jusqu'à son traitement et sa suppression par un destinataire. Pas de doublon. 	|
| **Ordonné dans la mesure du possible**  : il peut arriver que les messages soient remis dans un ordre différent de celui de leur envoi. 	| **Premier entré, premier sorti** :  l'ordre dans lequel les messages sont envoyés et reçus est rigoureusement conservé (First In, First Out). 	|

### Fonctionnement

1. Production d'un message en appelant l'API **SendMessage** à l'aide du SDK
1. Consommation du message en appelant **ReceiveMessage** (possibilité de recevoir 1 à 10 messages par appel)
1. Le message devient *invisible* pendant le temps défini dans **Message visibility timeout** (30s par défaut)
    - Au bout du *Message visibility timeout*, le message redevient visible dans la Queue et peut être consommé à nouveau par un autre consommateur s'il n'a pas été supprimé entre temps ou si ce temps n'a pas été modifié par le consommateur avec l'API **ChangeMessageVisibility** 
1. Suppression du message en appelant **DeleteMessage**

### Sécurité

- Chiffrement en transit (HTTPS) et au repos (AWS KMS)
- Contrôle d'accès à l'API SQS par une Policy IAM
- SQS Access Policy pour :
    - Des accès à une Queue cross-account
    - Donner accès à la Queue, en écriture, à d'autres services AWS

### Auto Scaling

Une architecture classique est l'Auto Scaling des consommateurs par la Queue elle-même :

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-messages-sqs-sns-autoscaling.jpg --alt Exemple d'Auto Scaling d'une SQS Queue %}
  <figcaption>Exemple d'Auto Scaling d'une SQS Queue</figcaption>
</figure>

### Autres paramètres

#### Dead Letter Queue

Lorsqu'un message revient dans la Queue un **MaximumReceives** de fois, il est possible de le rediriger vers une autre Queue, la **Dead Letter Queue** pour analyse ultérieure

#### Delay Queue

Lorsqu'il arrive dans la Queue, un message peut être masqué aux consommateur pendant le **Delay Queue** d'un maximum de 15 min

#### Long Polling

Lorsqu'un consommateur demande un message à une *Queue* vide, il peut attendre **Long Polling** sec. qu'un message arrive. Sa valeur possible va de 1 à 20 sec

### Paramètres spécifiques aux FIFOs

#### Dédoublonnage

Il existe 2 méthodes de **calcul de doublon** dans les *FIFO Queue* :
- **Hash SHA-256** du contenu du message
- **Deduplication ID** indiqué explicitement dans le message produit

#### Groupement de messages

Dans une même FIFO, il est possible de grouper des messages en spécifiant un **MessageGroupID**.

Dans ce cas, chaque Groupe de message ne peut être consommé que par un seul consommateur et l'ordre des messages est propre à chaque groupe : cela permet une consommation en parallèle des messages d'une FIFO.


<hr class="hr-text" data-content="SNS">

## Amazon Simple Notification Service

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-messages-sqs-sns-sns-queue.jpg --alt Exemple d'utilisation d'une SNS Queue %}
  <figcaption>Exemple d'utilisation d'une SNS Queue</figcaption>
</figure>

Amazon Simple Notification Service (Amazon SNS) est un service géré automatiquement par AWS qui livre des messages de *Publishers* vers des *Subscribers* (modèle **Pub/Sub** également connu sous le nom de Producteurs/Consommateurs) :

- Une Queue SNS est composée de **Topics** et on parle de **Notification** plutôt que de Message
- Il peut y avoir **100.000 Topics** par Queue SNS
- Un **Subscriber** s'abonne à un Topic et reçoit toutes les Notifications (*Messages*) qui y sont publiés
    * Il peut aussi **filtrer** les Notifications d'un Topic pour n'en recevoir que certaines
- Il peut y avoir jusqu'à **10.000.000 de Subscribers** par Topic

- les Publishers qui peuvent émettre des notifications dans SNS sont :
    * De très nombreux Services AWS :
        - CloudWatch et ses alarmes
        - les Auto Scaling Groups
        - Les events de Amazon S3
        - Les events de CloudFormation

- Les Subscribers peuvent être de type :
    * **Application-To-Application** (A2A) pour des messages inter-applicatifs à destination de :
        - Amazon Kinesis Data Firehose
        - Lambda functions
        - Queues SQS
        - Endpoints HTTP/S
        - AWS Event Fork Pipelines
    * **Application-To-Person** (A2P) pour notifier des utilisateurs au moyen de :
        - Applications mobiles
        - Numéro de téléphone mobiles
        - Adresses email

> info ""
> On retrouve beaucoup des mêmes fonctionnalités que Amazon SQS notamment en termes de Sécurité et types de Queue Standard ou FIFO

## Pattern d'architecture Fan Out 

L'utilisation de Amazon SNS + Amazon SQS permet de concevoir des architectures parfaitement découplées, sans perte de données, parallèles et asynchrones, appelées **Fan Out** (pour ventiler un gros traitement en plusieurs plus petits par exemple)

### Fan Out

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/sns-archiving-use-case.png --alt Exemple d'architecture Fan Out SNS + SQS (extrait de la documentation AWS) %}
  <figcaption>Exemple d'architecture Fan Out SNS + SQS (extrait de la documentation AWS)</figcaption>
</figure>

### FIFO Fan Out

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/sns-fifo-usecase.png --alt Exemple d'architecture FIFO Fan Out SNS + SQS (extrait de la documentation AWS) %}
  <figcaption>Exemple d'architecture FIFO Fan Out SNS + SQS (extrait de la documentation AWS)</figcaption>
</figure>