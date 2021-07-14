---
layout: post
title: Amazon Aurora - La Base de Données Relationnelle optimisée pour le Cloud
date: 2021-07-13 12:35:00 +0200
description: Principes fondamentaux et concepts clés d'Amazon Aurora à connaître. Tutoriel, mode d'emploi.
img: aws-aurora-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@lorenzolietti?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Lorenzo Lietti</a> sur <a href="https://unsplash.com/s/photos/sunrise--sunset?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, Aurora, RDS, Documentation]
lang: fr
permalink: /aws-aurora-documentation/
status: finished
---

Amazon Aurora est une base de données relationnelle, compatible avec MySQL et PostgreSQL et créée par Amazon pour le Cloud. Amazon Aurora est jusqu'à 5x plus rapide qu'une base de données MySQL standard et 3x plus rapide qu'une base de données PostgreSQL standard.

Elle s'appuie sur Amazon RDS et étend ses fonctionnalités.

<hr class="hr-text" data-content="Plan">

* TOC
{:toc}

<hr class="hr-text" data-content="Aurora">

## Caractéristiques de Amazon Aurora

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-aurora-architecture.png --alt Architecture générale de Amazon Aurora %}
  <figcaption>Architecture générale de Amazon Aurora</figcaption>
</figure>

### Hautes performances et évolutivité

- Hautes Performances :
  * Elle est otimisée pour le Cloud 
  * Elle supporte la Lecture à faible latence avec jusqu'à 15 Read Replicas possibles en multi-AZ
  * Selon l'option choisie, on peut avoir 1 Master en Ecriture ou bien plusieurs connectés au même volume de stockage
- Scaling :
  * Augmentation automatique du volume de Stockage (Storage Auto Scaling) par tranche de 10 Go et pouvant aller jusqu'à 128 To
  * Le nombre de Read Replicas peuvent être géré par un Auto Scaling Group
  * Une option Serverless permet de gérer des charges de travail intermittentes et imprévisibles

### Disponibilité

- Haute Disponibilité :
  * Réplication des données 6x dans un volume de stockage partagé sur 3 AZs
  * Sauvegarde en continue dans Amazon S3
  * 1 Endpoint pour l'Ecriture et 1 pour la Lecture
  * Failover automatique en cas d'indisponibilité d'une AZ en moins de 30s


- Support le cross-Region (option Database Location: Global)
  * Les données sont répliquées sur plusieurs Regions
  * Les opérations d'écriture sur la Region Primaire sont répliquées dans les Regions Secondaires avec une latence < 1s
  * Failover automatique en cas d'indisponibilité d'une Region

- Restauration possible des données à un instant t quelque soit le moment de la dernière sauvegarde (option Backtrack)

### Sécurité

- Maintenance transparente des instances Aurora 
- Isolation de réseau avec Amazon VPC
- Chiffrement des données au repos et en transit avec AWS KMS de même que les volumes de stockage, les Backups, les Snapshots et les Replicas

