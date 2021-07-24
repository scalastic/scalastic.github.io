---
layout: post
title: Amazon S3
date: 2021-07-23 15:33:00 +0200
description: Principes fondamentaux et concepts clés d'Amazon S3 (Simple Storage Service) à connaître. Tutoriel, mode d'emploi.
img: aws-s3-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@lceusebio?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Luís Eusébio</a> sur <a href="https://unsplash.com/s/photos/simple?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, S3, Documentation]
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

<hr class="hr-text" data-content="Versionning">

## Versionning

Pour mettre en oeuvre la gestion des version des objets, il faut tout d'abord activer le versionning au niveau du Bucket.

- Le numéro de version est généré par Amazon S3
- La suppression d'un objet est alors logicielle et l'objet sera marqué avec un **delete marker**. Il ne sera plus afficher dans la liste des objets mais il existera toujours avec ses différentes versions.

<hr class="hr-text" data-content="Chiffrement">

## Chiffrement

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


**Encryption In Transit** n'assure que le chiffrement d'un objet en SSL/TLS lors de son transfert vers/de AWS. Il ne chiffre pas l'objet dans son Bucket.

<hr class="hr-text" data-content="Sécurité">

## Sécurité

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

### En vrac

- **Networking** :
  * Supporte les VPC Endpoints (instances EC2 sans accès à Internet)
- **Logging et Audit** :
  * Les logs d'accès à S3 peuvent être stockés dans un autre Buket S3
  * Les appels aux APIs S3 peuvent être logués dans AWS CloudTrail
- **Sécurité Utilisateur** :
  * **MFA pour la suppression** : Un token MFA peut être exigé pour pouvoir supprimer un objet dans un Bucket versionné
  * **Pre-signed URL** : URL, valide pendant un temps limité, qui permet d'accéder à un objet dans S3

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
