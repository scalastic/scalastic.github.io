---
layout: post
title: AWS Identity and Access Management
date: 2021-07-06 10:37:00 +0200
description: Principes fondamentaux et concepts clés d'AWS IAM que vous devez connaître. Tutoriel, mode d'emploi.
img: aws-iam-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@mojamsanii?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Moja Msanii</a> sur <a href="https://unsplash.com/s/photos/bank?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, IAM, IAM-User, IAM-Group, IAM-Role, MFA, AWS-Identity, AWS-Policy, IAM-Service-Role, AWS-Trust-Policy, AWS-Principale, Documentation]
lang: fr
permalink: /aws-iam-documentation/
status: finished
---

AWS Identity and Access Management (IAM) est un service Web permettant de contrôler en toute sécurité l'accès aux services AWS. Avec IAM, vous pouvez gérer de manière centralisée les utilisateurs, les informations d'identification de sécurité telles que les clés d'accès et les autorisations qui contrôlent les ressources AWS auxquelles les utilisateurs et les applications peuvent accéder.

<hr class="hr-text" data-content="Content">

* TOC
{:toc}

<hr class="hr-text" data-content="Root Account">

## AWS account root user

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-iam-root-account.png --alt Le rôle du Root Account est de créer des utilisateurs AWS %}
  <figcaption>Le rôle du Root Account est de créer des utilisateurs AWS</figcaption>
</figure>

Il est créé par défaut lors de l'inscription sur AWS. Il ne doit pas être utilisé, sauf pour créer la configuration des comptes AWS. On peut même imaginer qu'il sert à créer le premier compte AWS avec des droits d'administrateur, et c'est tout.

<hr class="hr-text" data-content="User & Group">

## IAM User et Group

Un **IAM User** est une personne physique et une seule :
- Les comptes d'utilisateurs AWS doivent être protégés par une **politique de mot de passe** et une **authentification multifacteur** (MFA) solides pour accéder à la AWS Management Console.
- Pour l'accès par programmation via CLI (AWS Command Line Interface) à partir d'une console ou via un SDK (AWS Software Development Kit) à partir d'une application, les utilisateurs peuvent utiliser des **Access Keys** (un ID de clé d'accès + un secret de clé d'accès) pour accéder aux services AWS.

Une **IAM Policy** accorde un ensemble précis de permissions et peut être rattachée à n’importe quelle identité IAM : User, Group ou Role.

Les permissions / autorisations des utilisateurs (**IAM Policies**) sont rattachées soit au niveau des utilisateurs directement, soit et c'est encore mieux, au niveau des **Groups** auxquels les utilisateurs appartiennent.

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-iam-user-group.png --alt Plusieurs Groups peuvent être rattachés aux Users %}
  <figcaption>Plusieurs Groups peuvent être rattachés aux Users</figcaption>
</figure>


> warning ""
> Vous ne devriez JAMAIS partager votre compte d'utilisateur AWS ou votre clé d'accès !!

### Comment utiliser la clé d'accès ?

Prenons l'exemple d'une connexion à une instance EC2.


1. Définir les autorisations du fichier
Pour sécuriser le fichier PEM contenant votre ID de clé d'accès et sa clé secrète, AWS vérifie que vos autorisations de fichier PEM sont sécurisées. Cela signifie que vous devez toujours définir ces autorisations avant de l'utiliser :

{% highlight Bash %}
chmod 0400 <ACCESS-KEY-FILE>.pem
{% endhighlight %}

2. Connectez-vous à votre instance
Sur les instances Linux, le nom d'utilisateur est « ec2-user ». Allons-y :

{% highlight Bash %}
ssh -i <ACCESS-KEY-FILE>.pem ec2-user@<PUBLIC-IP-SERVER>
{% endhighlight %}

<hr class="hr-text" data-content="IAM Role">

## IAM Role

Toute la sécurité dans AWS repose sur les **Roles IAM** et c'est sans doute la partie la plus délicate à bien appréhender.

Voyons, par une approche progressive, les concepts des Roles IAM.

### La version résumée (mais qui n'est pas entièrement juste !)

  > info ""
  > Un **IAM Role** donne des autorisations à un Service AWS pour accéder aux informations d'un autre Service AWS.

  Dans l'exemple ci-dessous, une Instance EC2 utilise un IAM Role pour accéder en Lecture à un Bucket S3 :

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-iam-role.png --alt Un IAM Role accorde l'accès à une EC2 instance pour accéder à un S3 bucket %}
  <figcaption>Un IAM Role accorde l'accès à une EC2 instance pour accéder à un S3 bucket</figcaption>
</figure>

### La version longue (mais qui est plus complexe !)

Pour bien comprendre les concepts derrière les Roles IAM, nous devons définir quelques termes propres à AWS.

#### IAM Identity
* ***IAM User*** et ***IAM Role*** sont tous deux des IAM Identities
* Il possède des **Permissions Policies** qui déterminent ce que l’identité peut et ne peut pas faire dans AWS

Donc, User et Role sont un même concept dans AWS. 

> note "Ce qui les différencie :"
> - Un **User** est associé de ***façon unique*** à une personne et possède des ***identifiants à longue durée de vie***, comme un mot de passe ou des clés d’accès
> - Un **Role** est destiné à ***quiconque*** en a besoin (donc ce peut être un User) et il possède des ***identifiants temporaires***, pour la durée de session du Role

#### AWS Service Role

C'est un **Role destiné à un Service**, c'est à dire un ensemble de permissions qui permettent à ce Service d'accéder, ***dans votre compte*** et ***en votre nom***, aux Services AWS dont il a besoin

> note ""
> C'est donc un Role destiné à un Service

#### Trust Policy

- Une **Trust Policy** définit les ***Principales*** en qui vous avez confiance pour endosser un Role. 
- Un **Principale** peut être un User, un Role, un compte AWS ou un Service.

> note ""
> On peut donc définir exactement à qui est destiné un Role

### Ce que cela permet de faire

Quelques exemples d'utilisation de Roles (non exhaustif et sans ordre particulier !) :

1. Permettre à un *Developer* d'accéder temporairement, en lecture seule, à un environnement de *Production*
1. Permettre à un *Load Balancer* de (1) lire les metrics de CloudWatch et (2) créer de nouvelles instances EC2 au besoin
1. Permettre à une certaine application d'avoir un accès en lecture/écriture dans un répertoire spécifique d'un Bucket S3


> info "Ce qu'il faut retenir"
> Il est toujours préférable d'utiliser un Role pour gérer les accès aux ressources AWS