---
layout: post
title: Amazon Virtual Private Cloud
date: 2021-07-17 11:06:00 +0200
description: Principes fondamentaux et concepts clés d'Amazon Virtual Private Cloud à connaître. Tutoriel, mode d'emploi.
img: aws-vpc-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@matthewhenry?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Matthew Henry</a> sur <a href="https://unsplash.com/collections/8707292/privacy-i-security-i-surveillance?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, VPC, Subnet, Route, Gateway, NAT, Security-Group, NACL, ENI, Peering, Endpoint, PrivateLink, VPN, Documentation]
lang: fr
permalink: /aws-vpc-documentation/
status: finished
---

Amazon Virtual Private Cloud (Amazon VPC) permet de lancer des ressources AWS dans un réseau virtuel que vous définissez. Ce réseau virtuel ressemble beaucoup à un réseau traditionnel mais avec les avantages d’utiliser l’infrastructure d’AWS.

<hr class="hr-text" data-content="Plan">

* TOC
{:toc}

<hr class="hr-text" data-content="Concepts">

## Les composants de Amazon VPC

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-vpc-concepts.png --alt Composants de Amazon VPC %}
  <figcaption>Composants de Amazon VPC</figcaption>
</figure>

Les concepts clés des VPC sont les suivants :
- **Virtual Private Cloud (VPC)** : Un réseau privé virtuel au niveau d'une Region
- **Subnet** : Un sous-réseau (une plage d'adresses IP ou CIDR pour Classless Inter-Domain Routing) au niveau d'une AZ :
  * **Public** : accessible depuis Internet
  * **Privé** : non accessible de l'Internet
- **Route table** : Un ensemble de règles, appelées Routes, qui sont utilisées pour déterminer où le trafic réseau est dirigé (depuis l'Internet et entre Subnets)

## Les passerelles

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-vpc-gateway.png --alt Architecture des Gateways dans Amazon VPC %}
  <figcaption>Architecture des Gateways dans Amazon VPC</figcaption>
</figure>

- **Internet Gateway** :
  * Passerelle réseau qui permet aux instances d'un VPC d'avoir accès à Internet et d'être accessibles de l'Internet
  * Les Subnets publics le sont car ils ont une Route vers un Internet Gateway
- **NAT Gateway** :
  * Une passerelle NAT est un service de Network Address Translation (NAT)
  * Elle permet aux instances d’un Subnet privé de se connecter à des services en dehors du VPC (mais les services externes ne peuvent pas initier une connexion vers ces instances)
  * C'est un service entièrement managé par AWS
- **NAT Instance** :
  * AMI (Amazon Machine Image) utilisée comme NAT
  * Elle est entièrement sous la responsabilté de l'utilisateur

## Sécurité

La sécurité est une responsabilité partagée entre AWS et l'utilisateur.

C'est ce qu'Amazon appelle le *Modèle de responsabilité partagée*. Il comporte :
- **Sécurité du cloud** : AWS est responsable de la protection de l’infrastructure qui exécute les services AWS dans le cloud AWS


- **Sécurité dans le cloud** : La responsabilité de l'utilisateur est déterminée par le service AWS qu'il utilise


Voici 2 services AWS importants qui permettent d'appliquer le modèle de responsabilité partagée lorsqu'on utilise Amazon VPC :

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-vpc-shared-responsability.png --alt Mise en place d'un modèle de responsabilité partagée %}
  <figcaption>Mise en place d'un modèle de responsabilité partagée</figcaption>
</figure>

- **Security Group** (Instance Level):
  * Un Security Group agit comme un pare-feu virtuel d'une instance ou un ENI afin de contrôler le trafic entrant et sortant
  * Il est possible d'affecter jusqu’à cinq Security Groups à une instance
  * Les Security Groups agissent uniquement au niveau de l’instance, pas au niveau du sous-réseau (Subnet)
  * Les Rules peuvent inclure des adresses IP ou d'autres Security Groups et ne contiennent que des ALLOWs (tout ce qui n'est pas ALLOW est bloqué)

- **Network ACL** (Subnet Level): 
  * Un Network Access Control List (ACL) est une couche de sécurité optionnelle pour un VPC qui agit comme un pare-feu pour contrôler le trafic entrant et sortant d’un ou de plusieurs sous-réseaux
  * Il est possible de configurer des ACLs réseau avec des règles similaires à celles des Security Groups afin d’ajouter une couche de sécurité supplémentaire à un VPC
  * Les Rules ne peuvent inclure que des adresses IP et contiennent des ALLOWs / DENYs

## Logs et Monitoring

Vous pouvez utiliser les outils de surveillance automatisés suivants pour surveiller les composants de votre VPC et signaler tout problème :

- **Flow Logs** :
  * Flow Logs capturent le trafic IP entrant et sortant des interfaces réseau de votre VPC
  * Vous pouvez créer un journal de flux pour un VPC, un Subnet ou un Elastic Network Interface
  * Il fonctionne aussi pour les flux réseau des services managés par AWS : ELB, ElastiCache, RDS, Aurora,...
  * Les données du journal de flux sont publiées dans CloudWatch Logs ou Amazon S3 : ils permettent de diagnostiquer des règles de sécurité ACL trop restrictives ou trop permissives

- **Monitoring des NAT Gateways** :
  * Le monitoring d'une NAT Gateway s'effectue à l’aide de CloudWatch, qui recueille des informations à partir de votre passerelle NAT et crée des mesures en temps quasi réel

## Autres notions propre aux VPCs

### Elastic Network Interfaces

- Un ENI (appelée aussi interface réseau dans AWS) est un composant de réseau logique dans un VPC qui représente une carte réseau virtuelle
- Chaque instance d'un VPC a une interface réseau par défaut (l’interface réseau primaire) qui est assignée à une adresse IPv4 privée à partir de la plage d’adresses IPv4 du VPC
- Vous ne pouvez pas détacher une interface réseau primaire d’une instance. Mais vous pouvez créer et joindre une ENI supplémentaire à n’importe quelle instance de votre VPC

### VPC Peering

- Une connexion VPC Peering est une connexion réseau entre deux VPCs qui permet d’acheminer le trafic entre eux et en privé
- Les instances dans l’un ou l’autre VPC peuvent communiquer entre elles comme si elles se trouvaient dans le même VPC
- Vous pouvez créer une connexion VPC peering entre vos propres VCP, avec un VPC dans un autre compte AWS, ou avec un VPC dans une autre région AWS
- Les CIDR (la plage d'adresses IP) de chacun des VPCs ne doivent pas se chevaucher

AWS utilise l’infrastructure existante d’un VPC pour créer une connexion VPC Peering ; il ne s’agit ni d’une passerelle ni d’une connexion VPN de site à site AWS, et ne dépend pas d’un matériel physique distinct

Il n’y a pas de point de défaillance unique pour la communication ou un goulot d’étranglement de la bande passante.

### VPC Endpoint et AWS PrivateLink

- Un Endpoint permet de se connecter à un service AWS à partir d'une adresse privée sans passer par le réseau public
- Cette connexion s'appelle un AWS PrivateLink 
- Cela apporte encore plus de sécurité et améliore la latence pour accéder à un service AWS

Il existe 2 types de VPC Endpoints :
- **VPC Endpoint Gateway** : S3 et DynamoDB
- **VPC Endpoint Interface** : les autres services

### Connexions VPN

- **AWS Site-to-Site VPN** :
  * C'est une connexion VPN IPsec entre un Amazon VPC et un réseau d'entreprise (on-premise)
  * Côté AWS, 2 terminaux VPN (tunnels) permettent une bascule automatique en cas de failover
  * Le trafic encrypté passe par l'Internet

- **AWS Direct Connect (DX)** : 
  * AWS Direct Connect relie un réseau d'entreprise à un emplacement AWS Direct Connect via un câble à fibre optique Ethernet standard
  * Le trafic ne passe pas par l'Internet et est privé
  * Sa mise en place prend au moins 1 mois car il y a une infrastructure réseau à mettre en place (fibre optique, ...)
