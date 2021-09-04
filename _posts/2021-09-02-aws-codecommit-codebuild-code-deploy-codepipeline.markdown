---
layout: post
title: Outils de Dev dans AWS - CodeCommit, CodeBuild, CodeDeploy, CodePipeline
date: 2021-09-02 11:35:00 +0200
description: Principes fondamentaux et concepts clés d'AWS CodeCommit, CodeBuild, CodeDeploy et CodePipeline à connaître. Tutoriel, mode d'emploi.
img: aws-codecommit-codebuild-codedeploy-codepipeline-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@heysupersimi?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Simone Hutsch</a> sur <a href="https://unsplash.com/s/photos/battersea?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, CodeCommit, CodeBuild, CodeDeploy, CodePipeline, CICD, CodeStar, STS, SNS, EC2, ASG, Lambda, Cloudwatch, SSM, Documentation]
lang: fr
permalink: /aws-codecommit-codebuild-codedeploy-codepipeline/
status: finished
---

AWS dispose d'outils de dévelopement qui permettent d'exécuter toutes les étapes d'un CI/CD et ainsi faciliter le développement d'applications :
- **AWS CodeCommit** est un service de *gestion de version* basé sur Git et hébergé par AWS que vous pouvez utiliser pour stocker et gérer le code source, des fichiers binaires ou des documents dans le cloud
- **AWS CodeBuild** est un service de *Continuous Integration* qui compile votre code source, exécute des tests unitaires et produit des artefacts prêts à être déployés
- **AWS CodeDeploy** est un service de déploiement qui automatise les déploiements d’applications vers les instances Amazon EC2, les instances sur site, les fonctions Lambda ou les services ECS d’Amazon
- **AWS CodePipeline** est un service de *Continuous Delivery* qui permet de modéliser, visualiser et automatiser les étapes nécessaires au déploiement de votre application

<hr class="hr-text" data-content="Plan">

* TOC
{:toc}

<hr class="hr-text" data-content="CodeCommit">

## AWS CodeCommit

- Dépôt Git privé accessible au moyen d'un client Git classique
- Entièrement géré, dimensionnement et sauvegardes automatiques : haute disponibilité, pas de limite de taille
- Contenu sécurisé par chiffrement et accès protégé (nécessite un compte AWS IAM)

### Authentification
- Par clés SSH, configurable dans le compte IAM de chaque utilisateur
- Par HTTPS, en générant des Credentials ou en utilisant le AWS CLI
- Possibilité d'ajouter une authentification Forte par clé MFA (Multi Factor Authentication)

### Autorisation
- Gérée avec les IAM Policies sur les comptes IAM et Roles

### Chiffrement
- Lors des transferts par HTTPS ou SSH
- Dans le dépôt par AWS KMS

> info "Donner accès à son dépôt"
> Utiliser un Role IAM et donner accès à son Role grâce à AWS Security Token Service (AWS STS)

### Notification

CodeCommit peut déclencher des actions en fonction de certains événements notamment vers Amazon Simple Notification Service (Amazon SNS), AWS Lambda, AWS CloudWatch Events et bien d'autres services AWS

<hr class="hr-text" data-content="CodeBuild">

## AWS CodeBuild

Il permet de builder et tester du code applicatif :
- Il peut lire le code source de CodeCommit mais aussi CodePipeline, GitHub ou d'un bucket S3
- Les instructions de build doivent être stockées dans un fichier ***buildspec.yml*** à la racine du code source
- Un bucket S3 peut servir de cache pour, par exemple, stocker les dépendances précédemment téléchargées et accélérer les builds
- Le résultat du build s'appelle un **artefact** et est stocké dans un bucket S3
- Il peut :
    * Logguer le déroulement des builds dans S3 ou AWS CloudWatch
    * Produire des métriques
    * Utiliser CloudWatch Alarms pour détecter des echecs de builds et lancer des notifications
    * Utiliser AWS SNS pour lancer des notifications


### Avantages

- Il est entièrement géré : pas de serveur à provisionner, auto scalable, pas de file d'attente de builds !
- Le coût est fonction de l'utilisation (uniquement du temps de build)
- Il s'appuie sur CloudWatch Events et AWS Lambda
- Il est basé sur des images Docker que l'on peut personnaliser au besoin, par exemple, pour des langages autres que ceux déjà supportés : Java, Python, Ruby, Go, Node.js, PHP, .NET
- Il s'intégre avec différents services de sécurité comme **KMS** pour chiffrer les artifacts en sortie, **IAM Roles** pour gérer les permissions de build, **VPC Network Security** pour exécuter des tests dans son VPC, **CloudTrail** pour loguer les appels d'APIs
- Il est possible de lancer un build CodeBuild en local (avec Docker) pour explorer une erreur de build par exemple

> warning "CodeBuild ou CodePipeline"
> Les instructions de builds peuvent être définies dans CodeBuild et dans CodePipeline. Le fait de les définir dans les 2 outils peut entrainer des comportements non souhaités et difficiles à interpréter

### Définition d'un build

- Se situe dans un fichier **buildspec.yml**, directement à la racine du projet
- Définit des variables d'environnement soit en clair, soit en utilisant des **SSM Parameters** dans le cas de Secrets
- Est structuré en phases :
    * **Install** : listes les commandes à exécuter pour installer l'environnement de build
    * **Pre build**
    * **Build** : commande pour builder l'application
    * **Post build** 
- Artifact : définit quel est le livrable à stocker sur S3 (chiffré avec KMS)
- Cache : les fichiers à mettre dans le cache S3

### Travailler dans un VPC

- CodeBuild est exécuté par défaut en dehors de votre VPC
- Pour pouvoir accéder à des ressources telles qu'un Load Balancer, une BDD, une instance EC2,... il faut paramétrer une configuration de VPC :
    * ID du VPC
    * IDs des sous-réseaux
    * ID du Security Group à utiliser

<hr class="hr-text" data-content="CodeDeploy">

## AWS CodeDeploy

- Permet de déployer automatiquement une application sur de nombreuses instances EC2 (hors instances gérées par AWS Elastic Beanstalk) ou on-premise 
- C'est un service entièrement managé
- Nécessite l'installation d'un Agent CodeDeploy sur chaque machine cible

### Fonctionnement

- Se définit dans un fichier **appspec.yml**
- Les instances EC2 sont regroupées par environnement (dev, test, prod)
- Les AWS Lambda sont supportées
- Mais CodeDeploy ne provisionne pas les serveurs AWS, ils doivent l'être déjà
- Beaucoup de flexibilité pour définir tout type de déploiement : le déploiement Blue/Green ne fonctionne qu'avec des instances EC2

### Terminologie

Parmi les informations nécessaires à la définition d'un déploiement, voici les plus importantes :
- **Application**: le nom de l'application
- **Compute Platform** : instances EC2 (et celles d'un ASG), On-Premise ou Lambda
- **Deployment Configuration** :
    * EC2 et On-Premise : Pourcentage minimum d'instances saines lors du déploiement
    * Lambda : Routage du trafic vers les nouvelles fonctions déployées
- **Type de Déploiement** : In-Place ou Blue/Green
- **IAM Instance Profile** : Permissions IAM pour que les instances EC2 puissent lire à partir de S3 ou GitHub
- **Application Revision** : Révision du code source et du fichier **appspec.yml**  
- **Service Role** : Role nécessaire à CodeDeploy pour exécuter le déploiement
- **Target Revision** : Version de l'application une fois déployée

### Définition d'un déploiement

- **File Section** : Instructions pour copier l'artefact de S3 vers le filesystem
- **Hooks** : Instructions pour déployer la nouvelle version de l'application
    * Peuvent définir un time-out
    * Sont découpés en différentes phases ordonnées :
        - ***ApplicationStop*** : arrêt de l'application courrante
        - ***DownloadBundle*** : Téléchargement de la nouvelle version applicative
        - ***BeforeInstall***
        - ***Install***
        - ***AfterInstall***
        - ***ApplicationStart***
        - ***ValidateService*** : Verification du bon fonctionnement de la nouvelle version applicative (Health Check)


<hr class="hr-text" data-content="CodeStar">

## AWS CodeStar

CodeStar est une solution intégrée qui regroupe tous les services de CICD et aussi, pour certaines Regions, l'IDE web Cloud9 et l'outil de ticketing JIRA ou GitHub Issues. Il est accessible à partir d'un point d'entrée unique sous la forme d'un dashboard.

Il permet d'avoir simplement et rapidement un environnement de développement et de CICD adapté au langage de son application : Java, Go, Python, Node.js, HTML5,...

<hr class="hr-text" data-content="CodePipeline">

## AWS CodePipeline

CodePipeline est l'orchestrateur de tous les services de CICD et permet de mettre en place une chaîne de Continuous Delivery entièrement automatisée.

Il peut intégrer des outils tiers comme GitHub, Jenkins, des outils de Load Testing et des services AWS comme Elastic Beanstalk, CloudFormation, ECS,...

Ses possibilités sont immenses et peuvent définir des étapes complexes comme on peut le voir dans cet exemple d'implémentation d'un pipeline de CICD :

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-codecommit-codebuild-codedeploy-codepipeline-pipeline-example.jpg --alt Exemple de pipeline de CICD avec CodePipeline (Crédit @PaulClarkeJNCIP on Twitter) %}
  <figcaption>Exemple de pipeline de CICD avec CodePipeline (Crédit @PaulClarkeJNCIP on Twitter) </figcaption>
</figure>

