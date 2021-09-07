---
layout: post
title: AWS CloudFormation - Infrastructure as Code
date: 2021-09-06 10:18:00 +0200
description: Principes fondamentaux et concepts clés d'AWS CloudFormation à connaître. Tutoriel, mode d'emploi.
img: aws-cloudformation-infrastructure-as-code-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@matt_milton?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Matt Milton</a> sur <a href="https://unsplash.com/collections/3509219/tilt-shift?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, CloudFormation, Infrastructure-as-Code, Stack, StackSet, Resource, Parameter, Mapping, Output, Condition, Rollback, Drift, Documentation]
lang: fr
permalink: /aws-cloudformation-infrastructure-as-code/
status: finished
---

**CloudFormation** est un outil d'*Infrastructure-as-Code* qui permet de décrire votre infrastructure sous forme de code et de la créer automatiquement, dans le bon ordre et en fonction de votre configuration.

<hr class="hr-text" data-content="Plan">

* TOC
{:toc}

<hr class="hr-text" data-content="Avantages">

## Avantages de CloudFormation

Les avantages de CloudFormation sont :
- L'***Infrastructure-as-Code*** :
    - Le code peut être géré sous Git : toute modification est tracée et peut être validée lors d'une revue de code
    - Si aucune ressource n'est modifiée manuellement, vous pouvez recréer votre environnement à n'importe quel moment
- Les ***coûts*** :
    - Vous pouvez estimer le coût de votre infrastructure à partir du code de CloudFormation
    - Vous pouvez facilement supprimer votre infrastructure lorsque vous ne l'utilisez pas (la nuit) et la recréer (chaque matin)
- La ***productivité*** :
    - Le code est déclaratif : CloudFormation s'occupe d'orchestrer et de créer dans le bon ordre toutes les ressources de votre infra
    - Vous avez, à tout instant, un état des lieux clair de votre infrastructure
    - Vous pouvez structurer votre code selon le principe de *Separation of Concerns* en *stacks* permettant d'isoler et de réutiliser votre code d'infrastructure

<hr class="hr-text" data-content="Fonctionnement">

## Fonctionnement

- CloudFormation utilise des ***templates*** que l'on peut mettre à jour : CloudFormation analyse les différences et met à jour votre infrastructure en fonction, automatiquement.
- L'organisation en stacks permet, lors de leur suppression, d'être sûr que toutes les ressources définies dans la stack sont bien supprimées.

Les templates sont au format JSON ou YAML : ils peuvent être édités dans l'interface *CloudFormation Designer* ou bien à la main.

> info ""
> Elastic Beanstalk et CodeStar font usage de CloudFormation en arrière-plan

<hr class="hr-text" data-content="Syntaxe">

## Syntaxe du template

Les fichiers de template regroupent plusieurs parties. Vous trouverez à l'adresse suivante [AWS Template Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-reference.html){:target="_blank" rel="noopener noreferrer nofollow"}  toutes les références concernant la syntaxe des templates.

Voyons en détails chacune de ses parties.

### Resources

- L’objet ***Resources*** contient une liste d’objets ressources. Une déclaration de ressource contient les attributs de la ressource, qui sont eux-mêmes déclarés comme des objets enfants.
- Une ressource doit avoir un attribut ***Type***, qui définit le type de ressource AWS que vous voulez créer.
- L’attribut ***Type*** a un format spécial : `AWS::ProductIdentifier::ResourceType` 

> info "Syntaxe"
> En fonction de la *Resource* concernée, il existe différentes formes de syntaxe. Vous trouverez à l'adresse suivante le détail pour chaque type de *Resource* : [AWS resource and property types reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html){:target="_blank" rel="noopener noreferrer nofollow"}

Voici l'extrait d'un template pour la création de 2 ***Ressources*** : une instance EC2 et son Security Group :

{% highlight Yaml %}
Resources:
  EC2Instance:
    Type: 'AWS::EC2::Instance'
    Properties:
      InstanceType: !Ref InstanceType
      SecurityGroups:
        - !Ref InstanceSecurityGroup
      KeyName: !Ref KeyName
      ImageId: !FindInMap 
        - AWSRegionArch2AMI
        - !Ref 'AWS::Region'
        - !FindInMap 
          - AWSInstanceType2Arch
          - !Ref InstanceType
          - Arch
  InstanceSecurityGroup:
    Type: 'AWS::EC2::SecurityGroup'
    Properties:
      GroupDescription: Enable SSH access via port 22
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: '22'
          ToPort: '22'
          CidrIp: !Ref SSHLocation
{% endhighlight %}

### Parameters

Jetons un coup d’œil aux déclarations de paramètres et à la façon dont vous pouvez restreindre et valider l’entrée utilisateur.

- La déclaration des paramètres de fait dans **Parameters**.
- Un paramètre contient une liste d’attributs qui définissent sa valeur et les contraintes par rapport à sa valeur.
- Le seul attribut requis est **Type**, qui peut être String, Number ou un type spécifique à l’AWS.
- Vous pouvez également ajouter un attribut **Description** qui indique à l’utilisateur quel type de valeur il doit spécifier.

Exemple de définition de 2 ***Parameters***, KeyName et SSHLocation :

{% highlight Yaml %}
Parameters:
  KeyName:
    Description: Name of an existing EC2 KeyPair to enable SSH access to the instance
    Type: 'AWS::EC2::KeyPair::KeyName'
    ConstraintDescription: must be the name of an existing EC2 KeyPair.
  SSHLocation:
    Description: The IP address range that can be used to SSH to the EC2 instances
    Type: String
    MinLength: '9'
    MaxLength: '18'
    Default: 0.0.0.0/0
    AllowedPattern: '(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/(\d{1,2})'
    ConstraintDescription: must be a valid IP CIDR range of the form x.x.x.x/x.
{% endhighlight %}

### Mappings

Les paramètres sont un excellent moyen de permettre aux utilisateurs de spécifier des valeurs uniques ou sensibles à utiliser dans les propriétés des Templates. Cependant, il peut y avoir des paramètres qui dépendent de la région ou qui sont quelque peu complexes à comprendre pour les utilisateurs en raison d’autres conditions ou dépendances.

Dans ces cas, vous voudrez mettre une certaine logique dans le modèle lui-même afin que les utilisateurs puissent spécifier des valeurs plus simples (ou aucune) pour obtenir les résultats qu’ils veulent. Il s'agit des **Mappings**.

Exemple de définition d'un ***Mappings***, AWSInstanceType2Arch :

{% highlight Yaml %}
Mappings:
  AWSInstanceType2Arch:
    t1.micro:
      Arch: HVM64
    t2.nano:
      Arch: HVM64
    t2.micro:
      Arch: HVM64
{% endhighlight %}

### Outputs

L’objet **Outputs** dans le template contient les déclarations pour les valeurs que vous voulez voir disponibles après la création d'une **Stack**. Un Output est un moyen pratique de capturer des informations importantes sur vos ressources ou paramètres d’entrée.

Exemple de définition des ***Outputs***, InstanceId, AZ, PublicDNS et PublicIP :

{% highlight Yaml %}
Outputs:
  InstanceId:
    Description: InstanceId of the newly created EC2 instance
    Value: !Ref EC2Instance
  AZ:
    Description: Availability Zone of the newly created EC2 instance
    Value: !GetAtt 
      - EC2Instance
      - AvailabilityZone
  PublicDNS:
    Description: Public DNSName of the newly created EC2 instance
    Value: !GetAtt 
      - EC2Instance
      - PublicDnsName
  PublicIP:
    Description: Public IP address of the newly created EC2 instance
    Value: !GetAtt 
      - EC2Instance
      - PublicIp
{% endhighlight %}

### Conditions

Vous pouvez utiliser des **Conditions** pour créer conditionnellement des ressources de Stack.

Ces conditions sont évaluées et vous pouvez les associer à des ressources ou des propriétés de ressources dans les sections **Resources** et **Outputs** d’un template.

Il existe :
- Fn::And
- Fn::Equals
- Fn::If
- Fn::Not
- Fn::Or

### Fonctions Intrinsèques

AWS CloudFormation fournit plusieurs fonctions intégrées qui vous aident à gérer vos Stacks. Utilisez des **Fonctions Intrinsèques** dans vos templates pour attribuer des valeurs aux propriétés qui ne sont pas disponibles avant l’exécution.

#### Fn::Ref

La fonction intrinsèque **Ref** retourne la valeur du paramètre ou de la ressource spécifié :
- Lorsque vous spécifiez le nom logique d’un ***Parameter***, il retourne la valeur du paramètre.
- Lorsque vous spécifiez le nom logique d’une ***Resource***, il renvoie une valeur que vous pouvez généralement utiliser pour faire référence à cette ressource, comme un ID physique.

Lorsque vous déclarez une ressource dans un modèle et que vous devez en spécifier une autre par son nom, vous pouvez utiliser la référence pour vous référer à cette autre ressource. En général, Ref renvoie le nom de la ressource. Par exemple, une référence à AWS::AutoScaling::AutoScalingGroup renvoie le nom de cette ressource de groupe Auto Scaling.

Pour certaines ressources, un identifiant est retourné qui a une autre signification significative dans le contexte de la ressource. Une ressource AWS::EC2::EIP, par exemple, retourne l’adresse IP, et une AWS::EC2::Instance retourne l’ID de l’instance.

#### Fn::GetAtt

La fonction intrinsèque **Fn::GetAtt** retourne la valeur d’un attribut à partir d’une Resource dans le template. 

Sa syntaxe est d'une des deux formes :
- `Fn::GetAtt: [ logicalNameOfResource, attributeName ]`
- `!GetAtt logicalNameOfResource.attributeName`

Pour plus d’informations sur les valeurs de retour GetAtt pour une ressource particulière, reportez-vous à la documentation de cette ressource dans la [Référence des Ressources et propriétés](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html){:target="_blank" rel="noopener noreferrer nofollow"} 

#### Fn::FindInMap

La fonction intrinsèque **Fn::FindInMap** retourne la valeur correspondant aux clés dans une *map* à deux niveaux qui est déclarée dans la section ***Mappings***.

Sa syntaxe est `Fn::FindInMap: [ MapName, TopLevelKey, SecondLevelKey ]`

#### Fn::Join

La fonction intrinsèque **Fn::Join** concatène une liste de valeurs en une seule valeur, séparée par le délimiteur spécifié. Si le délimiteur est une chaîne vide, l’ensemble des valeurs est concaténé sans délimiteur.

Sa syntaxe est `Fn::Join: [ delimiter, [ comma-delimited list of values or variables containing... ] ]`

#### Autres fonctions intrinsèques

Il existe d'autres fonctions intrinsèques fort utiles. Vous en trouverez la liste à l'adresse [Référence des Fonctions Intrinsèques](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html){:target="_blank" rel="noopener noreferrer nofollow"} 

<hr class="hr-text" data-content="Rollback">

## Rollback

Lors d'une mise à jour d'un template dans CloudFormation, il est possible de spécifier si l'on souhaite effectuer ou non un **Rollback** en cas d'erreur lors de la mise à jour.

Lorsque cette option est activée, si une erreur survennait, CloudFormation supprime automatiquement toutes les modifications effectuées lors de la mise à jour erronée. Dans le cas d'un premier déploiement, il effacera de la même façon tous les objets qu'il a créé.


<hr class="hr-text" data-content="Stacks">

## Stacks

Une **Stack** est une collection de ressources AWS que vous pouvez gérer comme une seule unité. En d’autres termes, vous pouvez créer, mettre à jour ou supprimer une collection de ressources en créant, mettant à jour ou supprimant des Stacks. Toutes les ressources d’une Stack sont définies par le template AWS CloudFormation de la Stack.

Une Stack, par exemple, peut inclure toutes les ressources nécessaires pour exécuter une application Web, comme un serveur Web, une base de données et des règles réseau. Si vous n’avez plus besoin de cette application web, vous pouvez simplement supprimer la Stack, et toutes ses ressources connexes sont supprimées.

### ChangeSets

Lorsque vous devez mettre à jour une *Stack*, comprendre comment vos modifications affecteront les ressources en cours d’exécution avant de les mettre en œuvre peut vous aider à mettre à jour les *Stacks* en toute confiance.

Les **ChangeSets** vous permettent de prévisualiser les modifications proposées par CloudFormation lors de la mise à jour d'une *Stack*. *AWS CloudFormation* effectue les modifications à votre Stack uniquement lorsque vous décidez d’exécuter le *ChangeSets*, vous permettant de décider de procéder aux modifications proposées ou d’explorer d’autres modifications en créant un autre *ChangeSets*.

### Nested Stacks

Les **Nested Stacks** sont des Stacks créées pour être utilisées dans d’autres Stacks. Vous créez une *Nested Stacks* dans une autre Stack en utilisant la ressource `AWS::CloudFormation::Stack`.

Au fur et à mesure que votre infrastructure grandit, des modèles communs peuvent apparaître dans lesquels vous déclarez les mêmes composants dans plusieurs modèles. Vous pouvez séparer ces composants communs et créer des modèles dédiés pour eux. Ensuite, utilisez la ressource dans votre modèle pour référencer d’autres modèles, en créant des *Nested Stacks*.

### StackSets

Un **StackSet** vous permet de créer des *Stacks* pour les comptes AWS de différentes *Regions* en utilisant un seul modèle de CloudFormation. Toutes les ressources incluses dans chaque Stack sont définies par le modèle CloudFormation du *StackSet*. 

Lorsque vous créez un StackSet, vous spécifiez le template à utiliser, en plus des paramètres et des capacités que le template nécessite.

#### Création d'un StackSet

La création d’un nouveau *StackSet* comprend la spécification d’un template CloudFormation que vous voulez utiliser pour créer des Stacks, la spécification des comptes cibles dans lesquels vous voulez créer les Stacks et l’identification des régions AWS dans lesquelles vous voulez déployer ces Stacks dans vos comptes cibles. 

Un *StackSet* assure un déploiement cohérent des mêmes ressources de Stacks, avec les mêmes paramètres, pour tous les comptes cibles spécifiés dans les régions que vous choisissez.

#### Mise à Jour d'un StackSet

Lorsque vous mettez à jour un *StackSet*, vous poussez les changements sur les Stacks dans votre *StackSet*. Vous pouvez mettre à jour un *StackSet* de l’une des façons suivantes. 

- Modifiez les paramètres existants dans le modèle ou ajoutez de nouvelles ressources, telles que la mise à jour des paramètres d’un service spécifique ou l’ajout de nouvelles instances Amazon EC2.
- Remplacez le modèle par un autre modèle.
- Ajouter des piles dans des comptes cibles existants ou supplémentaires, dans des régions existantes ou supplémentaires.

#### Suppression d'un StackSet

Lorsque vous supprimez des Stacks, vous supprimez une Stack et toutes ses ressources associées aux comptes cibles que vous spécifiez, dans les Regions que vous spécifiez.

Vous pouvez **supprimer des Stacks** de la manière suivante :

- Supprimez les Stacks de certains comptes cibles, tout en laissant d’autres Stacks dans d’autres comptes cibles en cours d’exécution
- Supprimez les Stacks de certaines Regions, tout en laissant les Stacks d’autres Regions en cours d’exécution
- Supprimez les Stacks de votre StackSet, mais enregistrez-les pour qu’elles continuent à fonctionner indépendamment de votre StackSet en choisissant l’option **Conserver les Stacks**. Les Stacks conservées sont gérées dans AWS CloudFormation, en dehors de votre StackSet
- Supprimez toutes les Stacks de votre StackSet, en préparation de la suppression de votre StackSet entier

**Supprimer le StackSet** :

- Vous pouvez supprimer votre StackSet uniquement lorsqu’il n’y a pas d’instances de Stack

<hr class="hr-text" data-content="Drift">

## CloudFormation Drift

L’exécution d’une opération de détection de dérive (drift) sur une Stack détermine si la Stack a dérivé de sa configuration de template attendue, et renvoie des informations détaillées sur l’état de dérive de chaque ressource dans la Stack qui prend en charge la détection de dérive.

Pour détecter la dérive sur une Stack entière à l’aide de la console de gestion AWS :

1. Ouvrez la console AWS CloudFormation à [https://console.aws.amazon.com/cloudformation](https://console.aws.amazon.com/cloudformation){:target="_blank" rel="noopener noreferrer nofollow"}.
2. Dans la liste des Stacks, sélectionnez la Stack sur laquelle vous souhaitez effectuer la détection de dérive. Dans le panneau des détails de la Stack, choisissez **Actions de la Stack**, puis choisissez **Détecter la dérive**.

## Estimation du coût

Il n’y a pas de frais supplémentaires lors de l'utilisation de AWS CloudFormation. Vous payez les ressources AWS (par exemple, les instances Amazon EC2, les équilibreurs de charge Elastic Load Balancing,...) créées à l’aide de CloudFormation comme si vous les aviez créées à la main.

Il est de plus possible d'estimer les coûts d'une Stack CloudFormation. Pour cela :

1. Sur la page **Review** de l’assistant **Create stack**, dans la section **Template**, cliquez sur le lien **Estimate cost**
1. Ce lien ouvre le ***calculateur de prix AWS*** dans un nouvel onglet de navigateur

> info ""
> - Comme vous avez lancé la calculatrice à partir de la console CloudFormation, elle est préremplie avec la configuration de votre *template* et les valeurs de paramètre
> - Il existe de nombreuses valeurs configurables supplémentaires qui peuvent vous fournir une meilleure estimation si vous avez une idée de la quantité de transfert de données que vous attendez à votre instance Amazon EC2

