---
layout: post
title: AWS Elastic Load Balancing
date: 2021-07-09 16:21:00 +0200
description: Principes fondamentaux et concepts clés d'AWS Elastic Load Balancing (ELB) à connaître. Tutoriel, mode d'emploi. Aborde aussi les ASG, SSL-TLS, SNI, Sticky-Session, Target-Group.
img: aws-elb-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@derekowensheart?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Derek Owens</a> sur <a href="https://unsplash.com/s/photos/swing?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, ELB, Auto-Scaling, ASG, SSL-TLS, SNI, Sticky-Session, Target-Group, Documentation]
lang: fr
permalink: /aws-elb-documentation/
status: finished
---

Le service Elastic Load Balancing distribue automatiquement votre trafic entrant sur plusieurs cibles, telles que des instances EC2, des conteneurs et des adresses IP, dans une ou plusieurs Availability Zones. Il surveille la santé de ses cibles enregistrées et achemine le trafic uniquement vers les cibles saines. Vous pouvez sélectionner le type d'équilibreur de charge qui convient le mieux à vos besoins.

Voyons comment il fonctionne.

<hr class="hr-text" data-content="Content">

* TOC
{:toc}

<hr class="hr-text" data-content="ELB">

## Elastic Load Balancer

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-elb.png --alt Exemple d'utilisation d'un ELB %}
  <figcaption>Exemple d'utilisation d'un ELB</figcaption>
</figure>

Un ELB est un élément central d'une architecture applicative. Il permet de:
- Répartir la charge sur plusieurs serveurs
- Exposer un point d'entrée unique pour une application
- Séparer le trafic externe, de l'interne
- Fournir une terminaison SSL/TLS
- Effectuer des contrôles de santé des instances sous-jacentes
- Affinité de session (Sticky Session)

L'ELB de AWS est entièrement managé ce qui signifie que AWS s'assure pour vous de son bon fonctionnement, ses mises à jour et de sa haute disponibilité.


<hr class="hr-text" data-content="Types d'ELB">

## Types d'ELB

A l'heure actuelle, il en existe 4 que nous allons détailler ci-dessous.

### Classic Load Balancer
  * Génération v1 d'ELB, vous ne devriez pas l'utiliser
  * Supporte les protocoles HTTP, HTTPS et TCP
  * Point d'entrée au moyen d'un nom DNS unique
  * Répartit la charge sur plusieurs AZ (Multi-AZ)
  * Prend en charge une seule application

### Application Load Balancer
  * Génération v2 d'ELB la plus récente
  * Supporte les protocoles HTTP, HTTPS (en HTTP/2) et WebSocket (Layer 7)
  * Point d'entrée au moyen d'un nom DNS unique
  * Peut prendre en charge plusieurs applications:
    - Plusieurs applications (multi Target Groups/ Containers) au moyen d'une table de routage (en fonction du Hostname, Path, Query String ou du Header)
    - Redirect HTTP -> HTTPS
    - Port mapping
  * Visibilité de l'IP Client: 
    - L'ALB effectue une terminaison de connexion, les cibles ne voient que l'IP de l'ALB
    - L'IP du Client se trouve dans le header X-Forwarded-For (autres Forwarded: X-Forwarded-Port, X-Forwarded-Proto)
    - Le Security Group des cibles doit intégrer le Security Group de l'ALB

### Network Load Balancer
  * Génération v2 d'ELB
  * Il prend en charge les protocoles TCP, UDP et TLS (Layer 4)
  * Son intérêt face à l'ALB est qu'il est beaucoup plus performant et peut traiter des millions de req./s avec des latences ultra-faibles
  * Point d'entrée, une IP statique par AZ ou une IP fixe (par AZ aussi) au moyen d'une Elastic IP
  * Tout comme l'ALB, il peut prendre en charge plusieurs applications au moyen de Target Groups
  * Visibilité de l'IP Client: 
    - Le NLB ne touche pas à la connexion, les cibles recoivent l'IP du Client
    - Le Security Group des cibles doit intégrer les IPs des Clients (0.0.0.0/0 pour un accès public)

### Gateway Load Balancer
  * Génération v2 d'ELB, ce service est apparu cette année.
  * Comme son nom l'indique, il s'agit d'une passerelle réseau qui redirige les flux appicatifs vers un appliance virtuelle. Cette redirection est complétement transparente pour le flux réseau et le serveur cible.
  * Une appliance virtuelle est une image de VM qui remplace un équipement hardware. Elle sert en général à faire de l'analyse de sécurité (WAF, NGFW, anti-DDoS) ou bien à monitorer et logguer les flux applicatifs.

<hr class="hr-text" data-content="ASG">

## AWS Auto Scaling

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-elb-asg.png --alt Exemple d'un Scale Out par un ASG %}
  <figcaption>Exemple d'un Scale Out par un ASG</figcaption>
</figure>

AWS Auto Scaling permet de dimensionner automatiquement le nombre de nos instances (Horizontal Scale). Il permet de diminuer (Scale In) ou d'augmenter (Scale Out) automatiquement ce nombre en fonction de critères prédéfinis.

Pour cela, on configure un **Auto Scaling Group** (ASG) avec un nombre minimal, maximal et initial d'instances à créer ainsi qu'une politique de Scaling.

Son grand avantage est qu'il enregistre automatiquement ces instances dans les ELB.

<hr class="hr-text" data-content="Autres notions">

## Notions liées

Voici quelques notions à connaitre et qui sont en rapport avec les Load Balancers en général ou bien spécifiques à AWS.

### Target Group

Les Target Groups permettent d'associer **plusieurs cibles sous une seule référence**.
Ces cibles peuvent être:
- Des instances EC2 (qui peuvent être gérées par un Auto Scaling Group)
- Des tâches ECS
- Des fonctions Lambda
- Des adresses IP (toujours privées)

Un ALB effectue son **Health Check au niveau du Target Group**.

### Sticky Session

Les Sticky Sessions (affinité de sessions) sont un mécanisme permettant d'acheminer le trafic client vers **une même cible dans un Target Group**.

Cela est nécessaire pour les applications Stateful afin de ne pas perdre les informations client entre deux requêtes. Il est assuré par un cookie et est disponible pour tous les ELB.

### Cross-Zone Load Balancing

- Lorsque cette option est activée, les ELB distribuent le trafic équitablement vers toutes les cibles enregistrées quelques soient leur AZ.

- Si cette option est désactivée, le trafic est réparti entre les AZ uniquement sans tenir compte du nombre de cibles dans chaque AZ.

Selon le type d'ELB et la façon dont il a été créé (par API, CLI ou Console Management), cette option peut ou non être activée par défaut.

### SSL/TLS and SNI

Un certificat SSL permet de chiffrer le trafic Internet et vérifier l'identité d'un serveur.

Il existe 2 protocoles pour assurer ce chiffrement:

- SSL, **Secure Sockets Layer**, est l'ancien protocole de chiffrement et n'est plus utilisé à l'heure actuelle (même si son nom est resté)
- TLS, **Transport Layer Security**, est le nouveau protocole, plus sécurisé.

SNI, **Server Name Indication**, fait partie du protocole TLS. Il permet d'indiquer à un serveur le nom du Hostname auquel on souhaite se connecter:

- Cela permet aux Load Balancers qui gèrent plusieurs Hostnames de savoir quel certificat renvoyé et d'effectuer le bon routage.
- **Seuls ALB et NLB, de génération v2, savent gérer le SNI**.

