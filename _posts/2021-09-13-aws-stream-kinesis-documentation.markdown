---
layout: post
title: AWS Streaming - Amazon Kinesis
date: 2021-09-13 11:35:00 +0200
description: Principes fondamentaux et concepts clés d'Amazon Kinesis à connaître. Tutoriel, mode d'emploi.
img: aws-streaming-kinesis-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@goncas?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Gonçalo Martins</a> sur <a href="https://unsplash.com/collections/9391511/motion?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, Kinesis, Streams, Firehose, Analytics, Documentation]
lang: fr
permalink: /aws-streaming-kinesis/
status: finished
---

Amazon Kinesis facilite la collecte, le traitement et l'analyse de données, en streaming et en temps réel afin de pouvoir réagir rapidement. Il est capable d'intégrer des données en temps réel, comme de la vidéo, de l'audio, des journaux d'applications, des flux de clics de site web ou encore des données de télémétrie IoT.

Amazon Kinesis permet de traiter et d'analyser des données à mesure de leur réception et de réagir instantanément au lieu d'attendre que toutes les données soient collectées pour démarrer leur traitement.

Il existe différents services Kinesis en fonction de votre besoin :
- **Amazon Kinesis Data Streams (KDS)** : capture en continu des gigactets de données par seconde et les met à disposition sur Amazon S3 ou auprès d'AWS Lambda Functions
- **Amazon Kinesis Data Firehose** : charge de manière fiable les données de streaming dans des lacs de données, des magasins de données et des services d'analytique
- **Amazon Kinesis Data Analytics** :  transforme et analyse les données de streaming en temps réel avec SQL et Apache Flink
- **Amazon Kinesis Video Streams** :  diffuse de manière sécurisée, de la vidéo en streaming vers AWS

Voyons en détail ces services.

<hr class="hr-text" data-content="Plan">

* TOC
{:toc}


<hr class="hr-text" data-content="Data Streams">

## Amazon Kinesis Data Streams

### Architecture générale

- Il est composé de **Shards** dont le nombre doit être initié à la création
- Le **nombre de Shards** définit la débit en entrée et en sortie des Streams
- La durée de rétention des Messages peut aller de **1 à 365 Jours**
- Les messages sont **immuables**, ils ne peuvent pas être effacés ce qui autorise de rejouer les données si besoin

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-streaming-kinesis-general.jpg --alt Principaux composants de Amazon Kinesis Data Streams %}
  <figcaption>Principaux composants de Amazon Kinesis Data Streams</figcaption>
</figure>

1. Un ou plusieurs **Producers** envoient des *Records* au *Kinesis Data Streams*
1. Le **Kinesis Data Streams** est un ensemble de Shards, un **Shard** étant une séquence unique de données dans un flux
1. En **écriture**, chaque *Shard* supporte jusqu'à **1,000 records/sec** et jusqu'à **1 Mo de données/sec**
1. En **Lecture**, cela dépend du **mode du Consumers** :
  * **Shared** : débit partagé par **TOUS** les *Consumers* de **2 Mo/sec par Shard**
  * **Enhanced** : débit pour **CHAQUE** *Consumer* de **2 Mo/sec par Shard**

### *Fan-Out* des Records

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-streaming-kinesis-stream.jpg --alt Affectation des Records dans les Shards %}
  <figcaption>Affectation des Records dans les Shards</figcaption>
</figure>

1. Un **Producer** génère un *Record* avec une **Partition Key** et un contenu de **1 Mo au maximum** 
1. En fonction du Hash MD5 de la **Partition Key** du *Record*, il est dirigé vers un des **Shards**
1. Le *Record* reçoit un champ supplémentaire, le **Sequence Number**, indiquant son ordre de passage dans le *Shard*
1. Le **Consumer** reçoit le *Record* suivant le mode de livraison **Shared** ou **Enhanced Fan-Out**

> warning "Hot Partition"
> Afin d'éviter qu'un *Shard* reçoive tous les *Records*, il faut veiller à ce que les valeurs de la **Partition Key** soient distribuées !

### Sécurité

- Contrôle des accès et autorisations par des **IAM Policies**
- Chiffrement en transit par **HTTPS** et au repos par **KMS**
- Kinesis Data Streams peut être accèdé au travers d'un **VPC Endpoint**, assurant une communication privée, sans passer par l'Internet
- Les appels à l'API Kinesis sont loggués dans **CloudTrail**

### Kinesis Procucers

- Les **Producers** envoient des données dans Kinesis Data Streams sous la forme de **Records**
- Ils peuvent être :
    * Une **application**
    * Un **Client Mobile** ou **Desktop**
    * Une application tirant partie du **AWS SDK** (API Bas Niveau) ou du **KPL** (Kinesis Producer Library, API de Haut Niveau avec batch, compression, retries)
    * Un **Kinesis Agent** installé sur un serveur et qui envoient, par exemple, des logs

> info ""
> L'utilisation de Batch avec l'API *PutRecords* permet de réduire les coûts et d'augmenter le débit

#### Erreur *ProvisionedThroughputExceed*

Lorsqu'un *Shard* reçoit plus de données qu'il ne peut en traiter, une erreur **ProvisionedThroughputExceed** est renvoyée au *Producer*.

Afin de s'en prémunir, il faut :
- Veiller à utiliser une valeur de ***Partition Key* distribuée**
- Implémenter un **mécanisme de *Retry*** avec un **exponential backoff**
- Augmenter le **nombre de *Shards***

### Records

Il est fait de 3 éléments :
- La **Partition Key** : définie par le **Producer**, elle détermine dans quel *Shard* passera le record (en fonction de son Hash)
- Le **Data Blob** : le contenu du message de **1 Mo au plus**
- La **Sequence Number** : définie dans **Kinesis Data Streams**, il indique l'*ordre de passage* dans le Shard

### Kinesis Consumers

- Les **Consumers** reçoivent des données de Kenesis Data Streams sous la forme de **Records**
- Ils peuvent être :
    * Une **application** utilisant le **AWS SDK** ou l'API **KCL** (pour Kinesis Client Library)
    * Une **Lambda Function**
    * **Kinesis Data Firehose**
    * **Kinesis Data Analytics**

> note "SDK vs KCL"
> - L'***AWS SDK*** est une API bas-niveau nécessitant plus d'implémentation que l'***API KCL*** de haut niveau qui implémente des mécanismes de *Retry*, de vérification des *Records* traités, de réaction au *Resharding*,...
> - Ces 2 APIs prennent en compte les modes ***Shared*** et ***Enhanced***, à noter toutefois que pour **KCL**, seule la version **V2** les prend en charge

#### Shared vs Enhanced

Le tableau ci-dessous résume les différences essentielles entre les modes **Shared** et **Enhanced** d'un *Consumer* :

| Caractéristique                   | Shared fan-out                                                                  | Enhanced fan-out                                                                                    |
|:---------------------------------:|:-------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------:|
| **Débit de lecture d'un Shard**       | Un total de 2 Mo/s au maximum, réparti sur tous les *Consumers*                   | Un total de 2 Mo/s au maximum, pour chaque *Consumer*                                                 |
| **Modèle de livraison**               | Pull sur HTTP, utilise ***GetRecords***                                     | *Kinesis Data Streams* vous envoie les enregistrements via HTTP/2, utilise ***SubscribeToShard*** |
| **Délai de propagation des messages** | Environ 200 ms en moyenne par *Consumer* donc seulement 5 appels/sec pour l'*API GetRecords*  | Environ 70 ms en moyenne qu'il y ait 1 ou 5 *Consumers* (limité à 5 Consumers mais peut être étendu)                                             |
| **Coût**                              | N/A                                                                             | Coût supplémentaire pour la récupération des données et l'utilisation des *Shards*                    |

#### Kinesis Client Library (KCL)

- Aide à consommer et traiter les *Kinesis Data Streams* en prenant en charge de nombreuses tâches complexes associées à l'architecture distribuée du Cloud
- C'est une **librairie Java** mais elle peut s'interfacer avec d'autres langages
- Chaque *Shard* ne peut être lu par une instance *KCL* au plus 
- Seule la **version KCL 2.x** gère le mode *Enhanced*
- Nécessite une table dans **Amazon DynamoDB** pour tracer les Shards traités par chaque instance KCL et gérer les reprises
- Une instance KCL peut être de type EC2, On Premise ou Elastic Beanstalk (du moment que les accès IAM sont bien configurés)

### Dimensionnement des Shards

#### Shard Splitting

- Augmente la ***capacité de Streaming*** (débit) en augmentant le nombre de *Shards* (et le coût !)
- Divise un ***Hot Shard***

L'opération consiste en :
- La création de 2 nouveaux *Shards*
- La fermeture de l'ancien *Shard* et sa suppression une fois ses données expirées

C'est une **opération manuelle** uniquement (pas d'Auto Scaling possible) et 1 seul split par opération

#### Shard Merging

- Diminue la capacité de Streaming (débit) et diminue les coûts
- Fusionne 2 ***Cold Shards*** dont le trafic est faible

L'opération consiste en :
- La création d'1 nouveau *Shard*
- La fermeture des anciens *Shards* et leur suppression une fois leurs données expirées

C'est une **opération manuelle** uniquement (pas d'Auto Scaling possible) et 1 seul merge par opération


<hr class="hr-text" data-content="Data Firehose">

## Kinesis Data Firehose

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-streaming-kinesis-firehose.jpg --alt Architecture générale de pipelines avec Kinesis Data Firehose %}
  <figcaption>Architecture générale de pipelines avec Kinesis Data Firehose</figcaption>
</figure>

**Kinesis Data Firehose** permet de charger des flux de données dans des data lakes, des data stores et des services d'analytique en y apportant des transformations au besoin :
- C'est un Service AWS **entièrement managé**, serverless et avec un dimensionnement automatique
- Le coût est fonction des données qui passent dans *Kinesis Data Firehose*
- Chargement ***quasi**-temps réel* :
  * Dans les **60 secondes** suivant leur envoi au service
  * Dès le remplissage du **Buffer** (dont la taille dépend du service de destination et de sa configuration)
- Supporte de nombreux formats de données, leur conversion, transformation, compression
- Supporte les transformations personnalisées (sur AWS Lambda Functions)
- Peut envoyer les données en erreur ou pour une sauvegarde dans un Bucket S3

### Résumé

| Kinesis Data Streams 	| Kinesis Data Firehose 	|
|:---:|:---:|
| Service de Streaming à grande échelle 	| Service de Chargement de données streamées 	|
| Nécessite d'implémenter les Producer/Consumer 	| Entièrement managé 	|
| Temps réel (~200ms) 	| *"Quasi"* temps réel (min de 60s) 	|
| Scaling manuel 	| Scaling automatique 	|
| Rétention des données de 1 à 365 jours<br>Rejeu possible 	| Pas de rétention des données<br>Pas de rejeu possible 	|


<hr class="hr-text" data-content="Data Analytics">

## Kinesis Data Analytics

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-streaming-kinesis-analytics.jpg --alt Architecture générale de pipelines avec Kinesis Data Analytics %}
  <figcaption>Architecture générale de pipelines avec Kinesis Data Analytics</figcaption>
</figure>

**Amazon Kinesis Data Analytics** permet de requêter et d'analyser des flux de données en temps réel. Il est utile pour l'analyse en temps réel de *time series*, *metrics* ou la génération de *dashboards* :

- Basé sur ***Apache Flink***, il prend en charge les applications en SQL, Java, Scala et Python
- C'est un Service AWS **entièrement managé**, serverless et avec un dimensionnement automatique
- Le coût est fonction des données qui passent dans *Kinesis Data Analytics*
