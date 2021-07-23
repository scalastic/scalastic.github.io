---
layout: post
title: Amazon RDS - Les Bases de Données Relationnelles dans AWS
date: 2021-07-11 12:20:00 +0200
description: Principes fondamentaux et concepts clés Amazon RDS à connaître. Tutoriel, mode d'emploi.
img: aws-rds-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@vingtcent?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Vincent Guth</a> sur <a href="https://unsplash.com/collections/996284/data?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, RDS, Documentation]
lang: fr
permalink: /aws-rds-documentation/
status: finished
---

Il existe 2 grandes offres de Bases de Données Relationnelles dans AWS : RDS et Aurora. Nous allons voir dans cet article les caractéristiques du premier type de BDD, Amazon RDS.

<hr class="hr-text" data-content="Plan">

* TOC
{:toc}

<hr class="hr-text" data-content="RDS">

## Amazon RDS

Amazon Relational Database Service (Amazon RDS) est un service Web qui facilite la configuration, l’exploitation et la mise à l’échelle de bases de données relationnelles SQL dans le Cloud AWS (BDD managée).

Il prend en charge différents moteurs de base de données :
- MySQL
- MariaDB
- PostgreSQL
- Oracle
- Microsoft SQL Server

Que l'on peut exécuter sur différents types d'instances appelées DB Instance :
  * Classes d'instances disponibles : Standard, Memory Optimized or Burstable
  * Types de Storage RDS : General Purpose SSD, Provisioned IOPS, Magnetic

## Opérations managées

Les opérations à la charge de AWS et proposées dans Amazon RDS sont :
- La maintenance de l'instance (OS + Moteur de BDD) sur des plages programmables,
- Des sauvegardes automatiques à intervalle de temps et une restauration possible de ces sauvegardes
- Un tableau de bord de monitoring
- La création de Read Replicas pour accéler l'accès aux données (5 au maximum)
- La configuration en Multi-AZ pour la gestion du failover
- La mise à l'échelle verticale et horizontale des DB Instances et du volume de stockage (Storage Auto Scaling)

En contre-partie, il n'est pas possible d'accèder à ces instances en SSH.

<hr class="hr-text" data-content="Sauvegardes">

## Sauvegardes

- Automatiques :
  * Full Backup quotidien pendant la période de maintenance (que l'on a définie)
  * Backup des Log de transaction toutes les 5 minutes (restauration assurée du m-5)
  * Rétention possible de 0 (pas de rétention !) à 35 jours

- A la demande :
  * Sous forme de DB Snapshots
  * Rétention aussi longtemps que souhaité

<hr class="hr-text" data-content="Replica">

## Replica

### Read Replica

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-rds-read-replicas.png --alt Exemple de Réplicas en Lecture %}
  <figcaption>Exemple de Réplicas en Lecture</figcaption>
</figure>


- La réplication est ASYNCHRONE, les données ne sont pas consistentes : les répicas sont accessibles uniquement en lecture
- Il est possible de créer jusqu'à 5 réplicas au maximum
- Ils peuvent être dans la même AZ, dans différentes AZ ou bien entre différentes Regions (sauf pour Microsoft SQL Server)

Remarques:

- Una application doit mettre à jour sa chaine de connexion pour profiter des Reads Replicas.
- Un Replica peut être promu, à nouveau, en une Base de Données ce qui permet par exemple de procéder à des traitements d'analyse inenvisageables sur une BDD en Production.
- Le transfert de données entre AZ ou Regions est payant sur AWS. En ce qui concerne les RDS Reads Replicas, seuls les transferts entre Regions sont payants, ceux entre AZs sont compris dans le coût du service.

### Replicas multi-AZ et Disaster Recovery

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-rds-disaster-recovery.png --alt Exemple d'architecture d'un Disaster Recovery avec des RDS Replicas multi-AZ %}
  <figcaption>Exemple d'architecture d'un Disaster Recovery avec des RDS Replicas multi-AZ</figcaption>
</figure>

- La création de Replicas entre AZ (multi-AZ) ou entre Regions (cross-Region) permet de mettre en place un plan de reprise après sinistre (Disaster Recovery) dans le cas d'une défaillance réseau, d'une instance RDS, d'une AZ ou même d'une Region.
- L'architecture applicative est alors différente du Read Replica : la réplication est SYNCHRONE et les Replicas ne sont pas accessibles en lecture.
- On peut passer d'une simple-AZ à une multi-AZ par un Snapshot et sans indisponibilité de la base de données.

<hr class="hr-text" data-content="Sécurité">

## Sécurité

### Chiffrement des données au repos

- Il est possible de chiffrer les données d'une instance Amazon RDS : cela inclut le volume de stockage des DB Instances, les Backups, les Replicas et les Snapshots
- Ce chiffrement se configure à la création de la BDD :
  * Une instance chiffrée produit un Repica chiffré
  * Une instance non-chiffrée produit un Replica non-chiffré
  * Mais un Snapshot est toujours non chiffré
- Le chiffrement utilise une clé de chiffrement AES-256 standard gérée par AWS Key Management Service (AWS KMS).
- Oracle et Microsoft SQL Server peuvent aussi utiliser un chiffrement TDE (Transparent Data Encryption).

### Chiffrement des données en transit

- Il s'effectue à l'aide de certificats SSL/TLS ayant pour certificat racine celui de votre Region AWS
- Chaque moteur de BDD a sa propre configuration pour prendre en charge le chiffrement à la volée et peut aussi dépendre de la version utilisée (se référer à la documentation <https://docs.aws.amazon.com/fr_fr/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html>)
  * Par exemple pour MySQL 5.7 et ultérieure : `ALTER USER 'encrypted_user'@'%' REQUIRE SSL;`

### Réseau

- Un Amazon RDS est toujours déployé dans un sous-réseau privé
- L'accès à une instance RDS se fait donc à l'aide d'un Security Group

### IAM

- La connexion à la BDD d'une instance RDS se fait habituellement avec un login/password.
- Les Policies IAM permettent de donner, à un User IAM, des droits d'accès à une instance RDS.
- Dans le cas de MySQL et PostgreSQL, un User IAM peut aussi se connecter à une BDD RDS.

Il y a toutefois des limitations (token valide 15min, pas plus de 256 connexions par seconde)

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-rds-iam-authentication.png --alt Identification dans Amazon RDS à l'aide de IAM Authentication %}
  <figcaption>Identification dans Amazon RDS à l'aide de IAM Authentication</figcaption>
</figure>








