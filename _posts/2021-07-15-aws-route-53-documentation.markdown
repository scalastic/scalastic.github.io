---
layout: post
title: Amazon Route 53
date: 2021-07-15 17:37:00 +0200
description: Principes fondamentaux et concepts clés d'Amazon Route 53 à connaître. Tutoriel, mode d'emploi.
img: aws-route-53-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@frankbusch?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Frank Busch</a> sur <a href="https://unsplash.com/s/photos/direction-sign?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, Route-53, Documentation]
lang: fr
permalink: /aws-route-53-documentation/
status: finished
---

Amazon Route 53 est un service Web hautement disponible et évolutif de noms de domaine (DNS).

Avec Route 53, vous pouvez enregistrer des domaines, acheminer le trafic vers les ressources où vos domaines sont hébergés et vérifier l’état de vos ressources. Vous pouvez également acheminer le trafic en fonction de la santé de vos ressources. Ce guide explique comment enregistrer des domaines, configurer un DNS et configurer les contrôles de santé (Health Check) à l’aide de la console Route 53.

<hr class="hr-text" data-content="Plan">

* TOC
{:toc}

<hr class="hr-text" data-content="Types">

## Types d'enregistrement

Dans AWS, il est possible d'enregistrer 4 types de Records :
- **A** : Correspondance d'un hostname avec une IPv4
  * Un enregistrement A peur faire correspondre un hostname avec plusieurs IPv4
- **AAAA** : Correspondance d'un hostname avec une IPv6
  * Un enregistrement A peur faire correspondre un hostname avec plusieurs IPv6
- **CNAME** : Correspondance d'un hostname avec un autre hostname
  * Fonctionne uniquement pour des noms de domaine non racine (ex. www.example.com -> myserver.12345.mymachine.com)
- **Alias** : Correspondance d'un hostname avec une ressource AWS
  * Fonctionne pour des noms de domaine racine (apex) ou pas (ex. example.com -> server-12345.eu-west-3.alb.amazonaws.com)
  * Il est gratuit (contrairement au CNAME)
  * Il intègre un Health Check natif

Les hostnames peuvent être **public**, accessible d'un navigateur client, par exemple, ou bien **privé**, accesible par une instances AWS au sein d'un réseau privé, par exemple.

<hr class="hr-text" data-content="TTL">

## Time To Live

Un enregistrement DNS est associé à un TTL qui indique au client le temps de validité de l'enregistrement DNS.

Il peut être :
- élevé : par exemple de 24h, risque d'enregistrement obsolète
- bas : par exemple de 60s, permet de rapidement mettre à jour un enregistrement

<hr class="hr-text" data-content="Fonctionnalités">

## Fonctionnalités AWS

Route 53 apporte des fonctionnalités supplémentaires par rapport à un DNS classique :

### Health Check

  * Une ressource est marquée ***healthy*** une fois qu'elle a passée x Heath Checks (par défaut 3)
  * Une ressource est marquée ***unhealthy*** une fois qu'elle a echoué à x Heath Checks (par défaut 3)


Route 53 ne renvoie que les endpoints **healthy**


  * Une 15zaine de Health Checkers sont exécutés pour tester le bon fonctionnement d'un endpoint
  * Ils effectuent chacun un test toutes les 30s par défaut (peut être abaissé à 10s)


Cela signifie qu'ils exécutent, dans leur ensemble, une requête toutes les 2s

  * Les sondes peuvent être configurées en TCP, HTTP ou bien HTTPS (mais ne verifie pas la validité du certificat dans ce dernier cas)
  * On peut associer le Health Check avec CloudWatch

### Politiques de routage
  * **Simple** :
    * Redirection vers une seule ressource (mais qui peut se trouver à plusieurs endpoints/IPs)
    * Pas de Health Check !
    * Le Client reçoit toutes les IPs et en choisit une au hasard pour accéder à la ressource
  * **Multi value** :
    * Comme Simple mais avec un Healt Check : seuls les endpoints Healthy seront renvoyés (contrairement au Simple)
  * **Failover** :
    * Dans le cadre d'un Disaster Recovery avec une architecture serveurs Primaire/Secondaire
    * Renvoie l'IP du serveur Primaire tant qu'il est Healthy, celui du Secondaire autrement
    * Par contre, il n'y a pas de Health Check sur le serveur Secondaire
  * **Weighted** :
    * Associe un poids à chaque endpoint de la ressource
    * Permet de tester 10% du traffic sur une nouvelle version d'une application
    * Utile pour rediriger les traffic entre 2 Regions
    * Supporte le Health Check
    * Le Client ne reçoit qu'une seule IP (et n'a pas connaissance des autres endpoints)
  * **Latency** :
    * Dirige vers la Region AWS qui a la latence la plus faible du point de vue du Client
    * Ce n'est pas forcément la Region la plus proche (même si cela devrait être le cas pour la majeur partie)
    * Le Client ne reçoit qu'une seule IP (et n'a pas connaissance des autres endpoints)
  * **Geolocation** :
    * Dirige le traffic vers la Region la plus proche du Client
  * **Geoproximity** :
    * Dirige le traffic vers la Region la plus proche du Client mais avec un biais qui permet de modifier les Regions cibles
    * Configurable dans Route 53 Traffic Flow
    * Un biais positif (de 1 à 99) va augmenter artificiellement la taille d'une Region
    * Un biais négatif (de -99 à -1) va diminiuer la taille d'une Region
    * Les ressources peuvent être soient :
      * Une ressource AWS (liée à une Region AWS)
      * Une ressource non-AWS (il faudra alors préciser les latitude/longitude de cette ressource)

