---
layout: post
title: AWS Elastic Cloud Compute
date: 2021-07-06 19:57:00 +0200
description: Principes fondamentaux et concepts clés d'AWS EC2 que vous devez connaître. Tutoriel, mode d'emploi.
img: aws-ec2-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@joseadd?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">JOSE LARRAZOLO</a> sur <a href="https://unsplash.com/s/photos/lego?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, EC2, Documentation]
lang: fr
permalink: /aws-ec2-documentation/
status: finished
---

Amazon Elastic Compute Cloud (Amazon EC2) est un service Web qui fournit une capacité de calcul redimensionnable (littéralement, des serveurs dans les centres de données d'Amazon) que vous utilisez pour créer et héberger vos systèmes logiciels.

<hr class="hr-text" data-content="Content">

* TOC
{:toc}

<hr class="hr-text" data-content="Types">

## Types d'instance

Les instances EC2 sont livrées avec différentes configurations dédiées à différents cas d'utilisation. Vous pouvez consulter la liste des différentes configurations sur : <https://aws.amazon.com/fr/ec2/instance-types/> :
- General Purpose
- Compute Optimized
- Memory Optimized
- Accelarated Computing
- Storage Optimized

### Convention de nommage

Les noms des instances suivent une convention de nommage avec comme modèle :

{% highlight Code %}
<type><hardware-generation>.<instance-size>
{% endhighlight %}

Par exemple, le type d'instance `t4g.medium` représente:
- Le type `t` qui est une instance à usage général,
- Hardware generation `4g` qui est basé sir le processeur AWS Graviton 2 ARM pour ce type d'instance,
- Instance size `medium` qui signifie des ressources CPU et Mémoire moyennes, dans ce cas, 2vCPU / 4Gio.

## Amazon Machine Image

Une AMI est un modèle qui contient la configuration logicielle (système d'exploitation, serveur d'applications et application) requise pour lancer votre instance. Vous pouvez sélectionner une AMI fournie par AWS, la communauté d'utilisateurs, AWS Marketplace ou l'une de vos propres AMI prédéfinies.

## User data

Script qui sera lancé au premier démarrage de l'instance et ne sera exécuté qu'une seule fois.


## Security Group

Ce sont les fondamentaux de la sécurité du réseau AWS :
- Il contrôle la façon dont le trafic est autorisé dans et hors des instances EC2.
- Il ne contient que des règles **ALLOW**.

Il agit donc comme un pare-feu devant l'instance EC2. Il filtre l'accès par :
- Numéro de port,
- Plage d'adresses IPv4 et IPv6,
- Trafic réseau entrant (dans l'instance),
- Trafic réseau sortant (de l'instance).

Cela signifie que lorsque le trafic est bloqué, l'instance EC2 ne le verra pas :
- Si vous vous retrouvez avec un problème de **time-out** lors de l'accès à votre application, il s'agit probablement d'un problème de Security Group.
- Si vous rencontrez une **erreur de connexion**, alors le trafic est bien passé par le Security Group et c'est un problème d'erreur applicative (l'application ne s'est pas lancée, par exemple).

Un Security Group peut référencer des règles, mais aussi d'autres Security Groups :

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-ec2-security-groups.png --alt La liaison d'un autre Security Group (SG-DB) autorise le trafic entrant sans connaître l'IP spécifique ni le numéro de port %}
  <figcaption>La liaison d'un autre Security Group (SG-DB) autorise le trafic entrant sans connaître l'IP spécifique ni le numéro de port</figcaption>
</figure>

Le groupe de sécurité "SG-DB" attaché à la base de données autorise le trafic entrant vers notre instance EC2 car nous avons également attaché le groupe de sécurité "SG-DB" à notre instance EC2.

## Options d'achat d'instances

AWS propose différents types d'achat en matière d'instances et certains d'entre eux peuvent réduire les coûts :
- **On-Demand** instances:<br>
  Pour une charge de travail courte, avec un prix prévisible, vous payez ce que vous utilisez (aucune économie de coûts)

- **Reserved** et avec un minimum de 1 ou 3 ans (jusqu'à 75% de remise) :

  * **Reserved** instances:<br>
    Pour des charges de travail longues (une base de données par exemple)

  * **Convertible Reserved** instances:<br>
    Charges de travail longues, mais vous pouvez changer le type d'instance (de t2-2xlarge à c5-small par exemple) (jusqu'à 54% de remise)

  * **Scheduled Reserved** instances:<br>
    Lorsque vous n'avez pas besoin en permanence d'une instance (par exemple vous avez besoin d'une instance tous les dimanches mais pendant un an au moins)

- **Spot** instances:<br>
Pour des charges de travail courtes avec résilience mais moins fiables car vous pouvez perdre votre instance si le prix que vous êtes prêt à payer est inférieur au prix actuel des Spots (fourni la remise la plus élevée dans AWS qui peut aller jusqu'à 90 %). Utile pour les batchs, des charges de travail distribuées, du traitement d'images, ...

- **Dedicated Host** (for a period of 3 years):<br>
Réserve un serveur physique entièrement dédié à votre utilisation dans le centre de données AWS. Lorsque vous avez des exigences de conformité ou utilisez un modèle Bring Your Own License (BYOL)

