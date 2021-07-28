---
layout: post
title: Amazon CloudFront
date: 2021-07-28 10:46:00 +0200
description: Principes fondamentaux et concepts clés d'Amazon CloudFront à connaître. Tutoriel, mode d'emploi.
img: aws-cloudfront-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@tommorbey?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Tom Morbey</a> sur <a href="https://unsplash.com/s/photos/venice-beach?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, CloudFront, Origin, Geo Restriction, S3, ALB, EC2, Protocol-Policy, Signed-URL, Signed-Cookie, Trusted-Key-Group, Cache, TTL, Documentation]
lang: fr
permalink: /aws-amazon-cloudfront/
status: finished
---

Amazon CloudFront accélère la distribution des contenus web statiques et dynamiques tels que les pages html, css, php, images et fichiers multimédias. Lorsque les utilisateurs demandent du contenu, CloudFront le diffuse à travers un réseau mondial de Edge Locations qui offrent une latence faible et des performances élevées.

Voyons son fonctionnement en détail.

<hr class="hr-text" data-content="Plan">

* TOC
{:toc}

<hr class="hr-text" data-content="Présentation">

## Présentation

Amazon CloudFront est un réseau rapide de diffusion de contenu (Content Delivery Network) qui repose sur un système de Caches répartis sur les 230 points de présence (PoPs) de AWS et qui sont interconnectés via la dorsale AWS.

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-cloudfront-edge-locations.png --alt Emplacements des Edge Locations au niveau mondial %}
  <figcaption>Emplacements des Edge Locations au niveau mondial</figcaption>
</figure>

- CloudFront offre des fonctions de sécurité comme :
    * Protection des attaques réseaux et **anti-DDoS**
    * Protocole **HTTPS**
    * **Chiffrement** au niveau des champs
- Il s'intègre à **AWS Shield**, **AWS Web Application Firewall** et **Amazon Route 53**
- Il fonctionne avec n'importe quelle origine :
    * Toutes les origines **AWS Amazon S3** Bucket ou WebSite, **Amazon EC2**, **Elastic Load Balancing**
    * N'importe quelle terminaison HTTP **on-premise**

### Mécanismes avancés

- CloudFront permet de configurer différentes Origins (**Multiple Origins**) en fonction du type de contenu ou du chemin (pattern) du contenu.

- De même, un **Origin Group** constitué d'une Origine Primaire et Secondaire permet de mettre en place un **mécanisme de failover** dans le cas où l'Origine Primaire renverrait une erreur.

- Enfin, il existe un mécanisme de chiffrement asymétrique de champ (**Field Level encryption**) qui permet à partir de l'Edge Location de chiffrer un champ de formulaire qui ne pourra être déchiffré que par le Serveur Web.

## Architectures

En fonction de l'origine, CloudFront s'intègre dans 2 types d'architecture.

### Bucket S3

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-cloudfront-s3-bucket-architecture.png --alt Architecture CloudFront avec S3 Bucket comme Origin et une Origin Access Identity %}
  <figcaption>Architecture CloudFront avec S3 Bucket comme Origin et une Origin Access Identity</figcaption>
</figure>

### HTTP End-Point (ALB, EC2)

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-cloudfront-http-architecture.png --alt Architecture CloudFront avec un ALB (HTTP) comme Origin %}
  <figcaption>Architecture CloudFront avec un ALB (HTTP) comme Origin</figcaption>
</figure>

## Securité

### Geo Restriction

CloudFront permet de **filtrer les utilisateurs par Pays**. Une base de données reliant adresses IP et pays d'appartenance permet de n'autoriser que certains pays (whitelist) à accéder à une ressource ou bien, au contraire, de bloquer l'accès à certains pays (blacklist)

### HTTPS

CloudFront permet de contrôler le protocole de transport utilisé entre les différents points avec des Protocol Policy :

- **Viewer Protocol Policy** :
    * Du client à l'Edge Location
    * Permet de forcer le protocol HTTPS ou de rediriger les appels HTTP vers HTTPS

- **Origin Protocol Policy** :
    * De l'Edge Location vers l'Origine (Bucket S3 ou Server HTTP)
    * Permet de choisir entre HTTP et HTTPS

### Signed URL / Signed Cookie

Cette fonctionalité de CloudFront permet de mettre à disposition du contenu pendant un certain lapse de temps :
- Signed URL : met à disposition un fichier à tout utilisateur possédant cette URL
- Signed Cookie : met à disposition plusieurs fichiers à tout utilisateur qui possède ce cookie

Le temps de valididité dépend du contenu que l'on souhaite partager :
- Contenu payant, location pendant 24h,...
- Espace de stockage réservé pendant 1 an,...

> warning ""
> Ne pas confondre les Signed URLs de CloudFront avec les Pre-Signed URLs de S3

#### Génération à partir des Trusted Key Groups

A présent, AWS recommande d'utiliser les **Trusted Key Groups** afin de générer des Signed URL / Cookie. En effet :
- La gestion (création, rotation,...) des Trusted Key Groups se fait entièrement au moyen des APIs AWS
- L'utilisation de ces APIs est protégée par un Role IAM

Un Trusted Key Groups consiste en :
1. Une clé privé servant à signé une URL ou un Cookie
1. Une clé publique servant vérifier que la signature est valide

## CloudFront Caching

Le contenu peut être mis en Cache en fonction de 3 critères différents :
- Header
- Session Cookie
- Paramètre d'URL

Le **Time To Live** (**TTL**) peut aller de 0s à 1 an et dépend du type de contenu :
- Pour un contenu statique : le TTL peut être grand car c'est un contenu qui ne change pas beaucoup et c'est une bonne façon de  de réduire la latence. Les critères de Headers et Cookie ne devraient pas rentrer en compte mais uniquement l'URL.
- Pour un contenu dynamique : le TTL devrait être faible et se baser sur les Headers et les Cookies afin de maximiser le cache sans risquer de délivrer du contenu obsolète.

Il est possible aussi d'invalider un contenu spécifique des caches (en fonction de patterns) afin que tous les Edge Locations mettent à jour leur cache avec une nouvelle version du contenu. 

## Price Classes

Parce qu'il existe plus de 230 Edge Locations, le coût de CloudFront peut vite augmenter. Il est possible de réduire ce coût en sélectionnant les Edge Locations en fonction de leur prix par Region.

Pour cela, il existe 3 classes de prix que l'on peut sélectionner :
- **Price Class All** : toutes les Regions, coût élevé mais meilleures performances
- **Price Class 200** : la plupart des Regions mais supprime celles qui ont le coût le plus élevé
- **Price Class 100** : les Regions les moins chères

