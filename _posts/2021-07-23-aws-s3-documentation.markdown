---
layout: post
title: Amazon S3
date: 2021-07-27 18:21:00 +0200
description: Principes fondamentaux et concepts clés d'Amazon S3 (Simple Storage Service) à connaître. Tutoriel, mode d'emploi.
img: aws-s3-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@lceusebio?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Luís Eusébio</a> sur <a href="https://unsplash.com/s/photos/simple?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, S3, Standard, Infrequent-Access, One-Zone, One-Intelligent-Tiering, Glacier, Glacier-Deep-Archive, Versioning, Replication, Encryption, Policy, ACL, Athena, webSite, Documentation]
lang: fr
permalink: /aws-amazon-s3/
status: finished
---

Amazon Simple Storage Service (Amazon S3) est le stockage pour Internet. Vous pouvez utiliser Amazon S3 pour stocker et récupérer n’importe quelle quantité de données à tout moment, n’importe où sur le web.

Sa mise à l'échelle est quasi-infinie, un nombre considérable de sites web utilisent Amazon S3 ainsi que de nombreux services de AWS. Par conséquent, c'est un composant essentiel de AWS.

<hr class="hr-text" data-content="Plan">

* TOC
{:toc}

<hr class="hr-text" data-content="Buckets-Objets">

## Buckets et Objets

Dans Amazon S3, le stockage des objets (fichiers) se fait dans des Buckets (répertoires)

### Bucket

- Un Bucket doit avoir un nom unique au niveau global du réseau AWS même s'il est défini au niveau d'une Region
- Il suit une convention de nommage :
  * Pas de majuscule
  * Pas d'underscore
  * Pas d'IP
  * Et commence par une lettre minuscule ou bien un chiffre

### Objet

- Sous forme de fichier
- Il a une taille maximale de 5 To (sous forme de multi-parts de 5 Go)
- On peut lui attaché des meta-data, tags et un ID de version
  
- Les objets sont accessibles par leur Key
- Une Key est composée d'un prefix et du nom de l'objet :
  * Prefix : **company/department/**
  * Object Name : **users.json**
  * Key : **company/department/users.json**
- Pour un Bucket nommé **referential**, on accèdera alors à l'objet par l'URL :
  * **s3://referential/company/department/users.json**

Même s'il n'existe pas de notion de répertoire dans S3, on voit que le nommage des Prefix avec des `/` permet de simuler une structure arborescente.

<hr class="hr-text" data-content="Catégories">

## Catégories de Stockage

Il existe plusieurs catégories de stockage S3 (S3 Classes) qu'il convient d'utiliser en fonction de votre cas d'usage :

- **Amazon S3 Standard** :
  * Usage général
  * Données hautement durables (10.000 ans)
  * Disponibilité de 99,99% sur 1 an (***onze 9***)
  * Supporte 2 défaillances simultanées (résiste à une défaillance de AZ)

- **Amazon S3 Standard-Infrequent Access** (**SIA**) :
  * Pour des données moins fréquemment utilisées
    - Sauvegarde
    - Disaster Recovery
  * Données hautement durables (10.000 ans)
  * Disponibilité de 99,9% sur 1 an (***un 9***)
  * Résilient au désastre d'une AZ (supporte 2 défaillances simultanées)
  * Moins cher que S3 Standard

- **Amazon S3 One Zone-Infrequent Access** :
  * Pour des données moins fréquemment utilisées et que l'on peut perdre :
    - Sauvegarde secondaire
    - Données que l'on peut recréer
  * Données hautement durables (10.000 ans) MAIS sur une seule AZ (risque de perte de données)
  * Disponibilité de 99,5% sur 1 an
  * Moins cher que S3 SIA

- **Amazon S3 One Intelligent Tiering** :
  * Même latence faible et débit élevé que S3 Standard
  * Déplace les Objets entre 2 tiers (par ex. entre S3 standard et S3 IA)
  * Données hautement durables (10.000 ans)
  * Disponibilité de 99,9% sur 1 an
  * Résilient au désastre d'une AZ (supporte 2 défaillances simultanées)
  * Coût supplémentaire dû au monitoring nécessaire

- **Amazon Glacier** :
  * Pour des données à longue durée de rétention (minimum de 90 jours) pouvant aller jusqu'à 10 ans, qui ne nécessitent pas d'accès :
    - Archives ou sauvegardes 
  * Stockage à très faible coût **MAIS** avec un coût de récupération
  * Récupération :
    - Expedited : 1 à 5 min
    - Standard : 3 à 5 h
    - Bulk : 5 à 12 h
  * Données hautement durables (10.000 ans)
  * On parle d'***Archive*** dont la taille eput atteindre 40 To
  * Le stockage s'effectue dans des ***Vaults***

- **Amazon Glacier Deep Archive** :
  * Comme Amazon Glacier
  * Pour des données à longue durée de rétention (minimum de 180 jours) pouvant aller jusqu'à 10 ans, qui ne nécessitent pas d'accès
  * Récupération :
    - Standard : 12 h
    - Bulk : 48 h

### Transition et Cycle de vie

Il est possible de créer des règles afin que les données soient migrées automatiquement vers un stockage plus adapté ou bien qu'elles soient supprimées :
- Transition : déplace les objets vers un stockage moins couteux après un certain temps
- Expiration : supprime un objet après un certain temps

> note "Note"
> - Le [cycle de transitions supporté](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html){:target="_blank" rel="noopener noreferrer nofollow"} est contraint et il n'est pas possible de passer de Amazon Glacier à S3 Standard directement
> - Le but ultime est bien de diminuer les coûts de stockage

<hr class="hr-text" data-content="Versioning">

## Versioning

Pour mettre en oeuvre la gestion des version des objets, il faut tout d'abord activer le versioning au niveau du Bucket.

- Le numéro de version est généré par Amazon S3
- La suppression d'un objet est alors logicielle et l'objet sera marqué avec un **Delete Marker**. Il ne sera plus afficher dans la liste des objets mais il existera toujours avec ses différentes versions.

<hr class="hr-text" data-content="Réplication">

## Réplication

Il est possible de répliquer un S3 Bucket entre 2 Regions (**Cross Region Replication**) ou dans la même Region (**Same Region Replication**) :
- Le Versioning doit être activé sur les 2 Buckets
- Ils peuvent appartenir à 2 comptes différents
- Les permissions sont gérées par un Role IAM
- La réplication est asynchrone mais rapide

Les cas d'utilisation possibles sont :
- Pour une **CRR** : conformité réglementaire, réduction de latence, réplication inter-région AWS
- Pour une **SCR** : aggrégation de données, réplication en direct entre environnements

> note "Bon à savoir"
> - Une fois activée, la réplication ne s'effectue que sur les nouveaux objets ou ceux modifiés
> - Une option permet de répliquer les suppressions (uniquement les Delete Markers)
> - Il n'est pas possible de répliquer un Replication Bucket

<hr class="hr-text" data-content="Chiffrement">

## Chiffrement

### Méthodes

Il existe 4 méthodes de chiffrement des objets dans S3 :
- **SSE-S3** : 
  * Clé gérée par AWS
  * Server Side Encryption (SSE)
  * Algorithme **AES-256**
  * S'active en passant le Header **"x-amz-server-side-encryption":"AES256"** lors de l'upload de l'objet
  * Peut utiliser le HTTP ou HTTPS
- **SSE-KMS** :
  * Utilise le service KMS (Key Management Service) pour gérer la clé
  * Server Side Encryption (SSE)
  * S'active en passant le Header **"x-amz-server-side-encryption":"aws:kms"** lors de l'upload de l'objet
  * Utlise la clé **Customer Master Key** définie dans KMS pour le chiffrement
  * Peut utiliser le HTTP ou HTTPS
- **SSE-C** : 
  * Permet de fournir votre propre clé (mais c'est à vous de la stocker)
  * Server Side Encryption (SSE) mais la clé n'est pas stocker dans AWS !
  * S'active en passant la clé dans le Header lors de l'upload de l'objet mais aussi lors de sa lecture
  * Utilise uniquement le protocole HTTPS (pour protéger la clé)
- **Chiffrement coté Client** :
  * Le chiffrement des objets est à la charge du Client
  * Client Side Encryption (CSE)
  * Le chiffrement / déchiffrement se font du côté Client

### Forcer le chiffrement

Il existe 2 façons de forcer le chiffrement d'un Objet dans son Bucket :
- Forcer le chiffrement avec un **S3 Bucket Policy** qui n'accepte que les requêtes PUT avec un Header de chiffrement (et sinon refuse la requête)
- Activer l'option **Default Encryption** sur un Bucket :
  * Si l'objet est envoyé avec une méthode de chiffrement dans la requête, celle-ci sera appliquée
  * Si l'objet est envoyé sans méthode de chiffrement, celui-ci sera chiffré avec la méthode de chiffrement configurée par défaut

  > note "A noter" 
  > 1. L'option Default Encryption s'assure donc que les objets seront toujours chiffrés mais ne garantit pas la méthode de chiffrement
  > 2. Le Bucket Policy sera toujours évalué avant le Default Encryption

**Encryption In Transit** n'assure que le chiffrement d'un objet en SSL/TLS lors de son transfert vers/de AWS. Il ne chiffre pas l'objet dans son Bucket.

<hr class="hr-text" data-content="Sécurité">

## Sécurité

### Gestion des accès

La gestion de l'accès à S3 se fait à différents niveaux :

- Utilisateur :
  * **IAM Policy** : Définit les appels autorisés aux APIs de S3 pour chaque utilisateur IAM
- Ressource :
  * **Bucket Policy** :
    - **S3 Bucket Policy** :
      * Configuration au format JSON
      * Permet de configurer un accès public à un Bucket, de forcer le chiffrement des objets ou encore de donner l'accès à un autre compte (Cross-Account)
    - **Block Public Access** :
      * Bloque l'accès public à un Bucket
      * Prévient une fuite de données stockées dans un Bucket
  * **Object Access Control List** : ACL au niveau de chaque objet
  * **Bucket Access Control List** : ACL au niveau de chaque bucket

### Pre-signed URL

Une Pre-signed URL permet de générer une URL valide un lapse de temps (par défaut 1H) afin de permettre à un utilsateur de télécharger ou uploader un fichier dans un Bucket :
- Elle peut être générée avec le AWS CLI ou SDK
- L'utilisateur de la Pre-signed URL hérite des mêmes droits (GET / PUT) que celui qui l'a créée

> info "Cas d'utilisation"
> 1. Génération d'**URLs uniques** et temporaires pour des téléchargements
> 2. Génération d'**URLs temporaires** pour des uploads à des emplacements précis dans un Bucket

### Autres

- **Networking** :
  * Supporte les VPC Endpoints (instances EC2 sans accès à Internet)
- **MFA pour la suppression** :
  * Doit être activé sous le Root Account avec la commande AWS CLI suivante :
  `aws s3api put-bucket-versioning --bucket <bucket-name> --versioning-configuration Status=Enabled,MFADelete=Enabled --mfa "<mfa-device-arn> <mfa-code>"`
  * Réservé au propriétaire du Bucket, exige un token MFA (Multi Factor Authentication) pour supprimer un Objet versionné ou bien supprimer le versioning d'un Bucket

<hr class="hr-text" data-content="Logging-Audit">

## Logging et Audit

### Logging Bucket

Il est possible de loguer tous les accès à un Bucket S3 dans un autre Bucket S3 :
  - Ce Bucket s'appelle un **Logging Bucket**
  - Tous les accès, autorisés ou pas, y seront consignés avec de nombreuses informations sur le Client qui y a accédé ([format des Logs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/LogFormat.html){:target="_blank" rel="noopener noreferrer nofollow"})
  - Il sera possible ensuite d'analyser ces requêtes (voir Athena ci-dessous)
  - Les appels aux APIs S3 peuvent être logués dans AWS CloudTrail

> error "Attention"
> Il ne faut jamais configurer le Logging Bucket comme étant le même que le Bucket monitoré sous peine de provoquer les boucles infinies de logs et de voir sa facture AWS explosée !

### Audit avec Athena

Athena est un service qui permet d'effectuer des requêtes d'analyse directement sur les objets de S3 (sans passer par une BDD) :
- Il utilse le langage SQL
- Il fournit des drives JDBC ou ODBC ce qui permet d'interfacer d'autres logiciels de BI par exemple
- Il supporte de nombreux formats :
  * de fichiers : CSV, TSV, délimité, JSON
  * liés à Hadoop : ORC, Apache Avro, Parquet
  * de fichiers journaux : Logstash, AWS CloudTrail, Apache WebServer

<hr class="hr-text" data-content="Site Web">

## Site Web S3

- S3 peut héberger les contenus statics de sites web
- Le Bucket doit être activé de la sorte
- L'URL d'accès est de la forme :
  * `<bucket>.s3-website.<region>.amazonaws.com`
  * `<bucket>.s3-website-<region>.amazonaws.com`

### S3 CORS (Cross-Origin Resource Sharing )

- Un site web qui fait référence à des ressources sur un Bucket S3 peut avoir à configurer un **Header CORS**
- Il faut alors autosiser le nom DNS du Bucket dans le Header HTTP **Access-Control-Allow-Origin**
