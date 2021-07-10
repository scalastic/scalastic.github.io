---
layout: post
title: Stockage pour les instances AWS EC2
date: 2021-07-08 12:10:00 +0200
description: Principes fondamentaux et concepts clés du Stockage dans AWS EC2 que vous devez connaître. Tutoriel, mode d'emploi.
img: aws-ec2-storage-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@ryanquintal?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ryan Quintal</a> sur <a href="https://unsplash.com/s/photos/bricks-legos?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, EC2, EBS, EFS, Documentation]
lang: fr
permalink: /aws-ec2-storage-documentation/
status: finished
---

Nous allons voir ici les différents services de stockage utilisables avec une instance EC2 ainsi que leurs catactéristiques et leurs cas d'utilisation.

<hr class="hr-text" data-content="Table">

* TOC
{:toc}

<hr class="hr-text" data-content="EBS">

## Le volume EBS

Amazon Elastic Block Store (Amazon EBS) est un service Web qui fournit des volumes de stockage de niveau bloc, à utiliser avec les instances EC2. Amazon Elastic Block Store (Amazon EBS) est un service Web qui fournit des volumes de stockage de niveau bloc à utiliser avec les instances EC2 comme disque dur.

- C'est un lecteur réseau :
   * Il utilise le réseau pour communiquer avec l'instance
   * Il peut y avoir un peu de latence
   * Peut être détaché et attaché rapidement pendant l'exécution de l'instance
   * Ne peut être monté que sur une instance à la fois (sauf pour les multi-attaches - voir ci-dessous)

- Il est lié à une Availibility Zone spécifique :
   * Vous ne pouvez pas le monter sur une instance située dans une autre A.Z.
   * Mais vous pouvez créer un Snapshot et le copier dans une autre A.Z. pour le monter dans cette zone

- Il peut être supprimé ou non après résiliation de l'instance :
   * Les données peuvent donc être persistantes ou non

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-ec2-storage-ebs.png --alt Liens vers un EBS dans la même AZ avec et sans multi-attach %}
  <figcaption>Liens vers un EBS dans la même AZ avec et sans multi-attach</figcaption>
</figure>

<hr class="hr-text" data-content="Types d'EBS">

### Types d'EBS

#### gp2 ou gp3 (SSD) :

  * Volume SSD à usage général avec un prix et des performances équilibrés
  * 1 Gib à 16 Tio
  * **gp2** :
    - IOPS est lié à la taille du volume
    - Max IOPS est de 16 000 à 5 333 Gio
    - La petite taille du volume peut éclater à 3 000
  * **gp3** :
    - IOPS commence à 3 000
    - Les IOPS et le débit peuvent augmenter indépendamment jusqu'à 16 000 et 1 000 Mio/s
  * **Cas d'utilisation** : volume de démarrage, environnement non-Prod


#### io1 ou io2 (SSD) ou SSD IOPS provisionné (PIOPS)

  * Le SSD le plus performant pour les charges de travail à faible latence et à haut débit
  * Prend en charge EBS Multi-attache
  * **io1 / io2** :
    - 4 Gio à 16 Tio
    - Max IOPS 64 000 avec Nitro EC2 sinon 32 000 avec d'autres types d'instances
    - PIOPS peut augmenter indépendamment de la taille du stockage
  * **io2 Block Express** :
    - 4 Gio à 64 Tio
    - Latence inférieure à la milliseconde
    - Max PIOS 256 000 avec un rapport IOPS:Gio de 1000:1 (cela signifie que le maximum de PIOPS est atteint à partir de 256 Gio)
  * **Cas d'utilisation** : Bases de données

#### st1 (HDD) ou débit optimisé :

  * Volume de disque dur à faible coût conçu pour les charges de travail fréquemment utilisées et à débit élevé
  * Ne peut PAS être un volume de démarrage
  * 125 Mio à 16 Tio
  * Le nombre maximal d'IOPS est de 500 et le débit de 500 Mio/s
  * **Cas d'utilisation** : Big Data, Data Warehouse, Log Processing

#### sc1 (disque dur) ou disque dur froid :

  * Le volume de disque dur le moins cher conçu pour les charges de travail moins fréquemment consultées
  * Ne peut PAS être un volume de démarrage
  * 125 Mio à 16 Tio
  * Le nombre maximal d'IOPS est de 250 et le débit de 250 Mio/s
  * **Cas d'utilisation** : données rarement consultées pour lesquelles un coût inférieur est important

<hr class="hr-text" data-content="EBS Multi-attach">

### EBS Multi-attach

* Uniquement pour la famille io1 et io2
* Vous pouvez attacher le même volume EBS à plusieurs instances EC2 dans le même A.Z.
* Chaque instance a des autorisations complètes de lecture/écriture sur le volume
* Mais doit utiliser un système de fichiers en cluster pour préserver la cohérence des données


<hr class="hr-text" data-content="EFS">

## EFS

Amazon Elastic File System (Amazon EFS) fournit un stockage de fichiers pour vos instances Amazon EC2. Il s'agit d'un NFS (Network File System) géré qui peut être monté sur plusieurs instances EC2 :

* Il augmente en taille automatiquement, vous n'avez donc rien à provisionner et vous payez à l'utilisation (pay-per-use)
* Il est multi-AZ
* Vous devez utiliser un Security Group pour y accéder
* Il utilise le protocole NFSv4.1 et n'est compatible qu'avec le système d'exploitation POSIX (y compris Linux, macOS mais pas Windows)
* Cas d'utilisation : Gestion de contenu, serveur web, partage de données.

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-ec2-storage-efs.png --alt Liens d'un EFS à partir de multi-AZ avec un groupe de sécurité qui accepte le trafic entrant sur le port NFS %}
  <figcaption>Liens d'un EFS à partir de multi-AZ avec un groupe de sécurité qui accepte le trafic entrant sur le port NFS</figcaption>
</figure>

### Modes et classes

* Mise à l'échelle:
  - Des centaines de clients NFS simultanés avec un débit de plus de 10 Gio/s
  - Peut atteindre le Petabyte

* Mode Performance:
  - General Purpose : applications sensibles à la latence comme serveur Web, CMS, ...
  - Max I/O : latence plus élevée, débit mais fortement parallèle : Big Data, Media Processing, ...

* Mode Throughput :
  - Bursting : dépend de la taille du stockage (par exemple 1 To = 50 MiB/s avec burst jusqu'à 100 MiB/s)
  - Provisionned : vous définissez le débit souhaité (par exemple, 1 To avec 1 Gio/s)

* Niveaux de stockage :
  - Standard : pour les fichiers fréquemment consultés
  - Infrequent Access : déplacez le fichier après n jours vers EFS-IA qui coûte moins cher mais coûte pour récupérer les fichiers

<hr class="hr-text" data-content="Instance Store">

## Instance Store

- Disque hardware à hautes performances avec E/S élevées
- Mais éphémère :
   * Les données sont perdues lorsque l'instance est arrêtée
   * Vous devez gérer vous-même la sauvegarde et la restauration si vous ne souhaitez pas perdre les données
- Utile pour du cache, un tampon ou des données temporaires


