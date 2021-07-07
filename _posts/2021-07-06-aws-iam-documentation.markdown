---
layout: post
title: AWS Identity and Access Management
date: 2021-07-06 10:37:00 +0200
description: Principes fondamentaux et concepts clés d'AWS IAM que vous devez connaître. Tutoriel, mode d'emploi.
img: aws-iam-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@mojamsanii?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Moja Msanii</a> sur <a href="https://unsplash.com/s/photos/bank?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, IAM, Documentation]
lang: fr
permalink: /aws-iam-documentation/
status: finished
---

AWS Identity and Access Management (IAM) est un service Web permettant de contrôler en toute sécurité l'accès aux services AWS. Avec IAM, vous pouvez gérer de manière centralisée les utilisateurs, les informations d'identification de sécurité telles que les clés d'accès et les autorisations qui contrôlent les ressources AWS auxquelles les utilisateurs et les applications peuvent accéder.

<hr class="hr-text" data-content="Content">

* TOC
{:toc}

<hr class="hr-text" data-content="Root Account">

## Root Account

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-iam-root-account.png --alt Le rôle du Root Account est de créer des utilisateurs AWS %}
  <figcaption>Le rôle du Root Account est de créer des utilisateurs AWS</figcaption>
</figure>

Il est créé par défaut lors de l'inscription sur AWS. Il ne doit pas être utilisé, sauf pour créer la configuration des comptes AWS. On peut même imaginer qu'il sert à créer le premier compte AWS avec des droits d'administrateur, et c'est tout.

<hr class="hr-text" data-content="AWS User">

## AWS User (ou IAM User)

Un **utilisateur AWS** est une personne physique et une seule :
   - Les comptes d'utilisateurs AWS doivent être protégés par une **politique de mot de passe** et une **authentification multifacteur** (MFA) solides pour accéder à la AWS Management Console.
   - Pour l'accès par programmation via CLI (AWS Command Line Interface) à partir d'une console ou via un SDK (AWS Software Development Kit) à partir d'une application, les utilisateurs peuvent utiliser des **clés d'accès** (un ID de clé d'accès + un secret de clé d'accès) pour accéder aux services AWS.
   - Les autorisations des utilisateurs sont gérées via des **IAM Policies** soit au niveau des utilisateurs directement, soit et c'est encore mieux, au niveau des **Groups** auxquels les utilisateurs appartiennent.

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

**IAM Role** donne des autorisations à un service AWS pour accéder aux informations AWS.

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-iam-role.png --alt Un IAM Role accorde l'accès à une EC2 instance pour accéder à un S3 bucket %}
  <figcaption>Un IAM Role accorde l'accès à une EC2 instance pour accéder à un S3 bucket</figcaption>
</figure>

