---
layout: post
title: "AWS CloudFormation : L'Infrastructure-as-Code selon Amazon"
date: 2023-07-14 12:49:00 +0200
description: Découvrez AWS CloudFormation, l'outil d'Infrastructure-as-Code qui vous permet de créer et gérer votre infrastructure AWS de manière automatisée et efficace.
img: aws-cloudformation-infrastructure-as-code-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@matt_milton?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Matt Milton</a> sur <a href="https://unsplash.com/collections/3509219/tilt-shift?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, CloudFormation, Infrastructure-as-Code, Stack, StackSet, Resource, Parameter, Mapping, Output, Condition, Rollback, Drift, Template, Automation, Cost]
lang: fr
permalink: /aws-cloudformation-infrastructure-as-code/
status: finished
---

CloudFormation est un outil puissant d'Infrastructure-as-Code (IaC) fourni par AWS. Il permet de décrire et de gérer 
votre infrastructure AWS sous forme de code, offrant ainsi une approche automatisée et reproductible pour créer et gérer
vos ressources cloud.

Dans cet article, notre objectif est de vous présenter les principes fondamentaux et les concepts clés d'AWS 
CloudFormation. Vous découvrirez comment utiliser CloudFormation pour déployer et gérer vos ressources AWS de manière 
efficace et cohérente.

<hr class="hr-text" data-content="Plan">

* TOC
{:toc}

<hr class="hr-text" data-content="Avantages">

## Avantages de CloudFormation

L'approche Infrastructure-as-Code (IaC) offerte par CloudFormation présente de nombreux avantages significatifs. Voici 
les principaux bénéfices que vous pouvez tirer de l'utilisation de CloudFormation pour déployer et gérer votre 
infrastructure AWS :

### 1. Gestion Simplifiée grâce à l'Infrastructure-as-Code

En adoptant l'approche IaC avec CloudFormation, vous pouvez décrire votre infrastructure en utilisant un langage de 
programmation, généralement au format JSON ou YAML. Cela vous permet de gérer votre infrastructure de manière cohérente,
reproductible et versionnée. Vous pouvez stocker vos fichiers de configuration dans un système de contrôle de version 
comme Git, suivre les modifications apportées à votre infrastructure et les valider lors des revues de code. 
L'Infrastructure-as-Code vous aide à maintenir votre infrastructure sous contrôle et à suivre les meilleures pratiques 
de gestion des configurations.

### 2. Maîtrise des Coûts

CloudFormation offre des fonctionnalités intégrées qui vous permettent d'estimer les coûts de votre infrastructure avant
même de la déployer. En utilisant les fichiers de configuration CloudFormation, vous pouvez évaluer les coûts des 
ressources AWS requises pour votre infrastructure. Cette fonctionnalité vous permet de planifier et d'optimiser vos 
dépenses en vous assurant de disposer des ressources nécessaires tout en évitant les surcoûts inutiles.

De plus, CloudFormation facilite la gestion des coûts grâce à la possibilité de supprimer et recréer votre 
infrastructure selon vos besoins. Par exemple, vous pouvez programmer la suppression de votre environnement pendant les 
périodes d'inactivité pour économiser des coûts et le recréer automatiquement lorsque vous en avez besoin.

### 3. Productivité Accrue

L'approche déclarative de CloudFormation permet de décrire votre infrastructure sans vous soucier des détails de 
l'orchestration des ressources. CloudFormation s'occupe de l'ordonnancement et de la création dans le bon ordre de 
toutes les ressources de votre infrastructure. Cela vous permet de gagner du temps et de la productivité en évitant les 
tâches manuelles fastidieuses.

De plus, CloudFormation fournit une vision claire de l'état actuel de votre infrastructure à tout moment. Vous pouvez 
facilement visualiser et comprendre l'ensemble de votre infrastructure à l'aide des fichiers de configuration 
CloudFormation. Cela simplifie la collaboration entre les équipes de développement, les opérations et les responsables 
de la conformité.

### 4. Gestion Efficace du Code

Grâce à CloudFormation, vous pouvez structurer votre code d'infrastructure en utilisant le principe de *Separation of 
Concerns* (Séparation des préoccupations) en utilisant des *stacks*. Les *stacks* vous permettent d'isoler et de 
réutiliser des parties spécifiques de votre code d'infrastructure. Cela facilite la gestion du code, la réutilisation 
des ressources et l'adoption de bonnes pratiques de développement logiciel telles que la modularité et la maintenabilité.


<hr class="hr-text" data-content="Fonctionnement">

## Fonctionnement de CloudFormation

CloudFormation fonctionne à l'aide de **templates** qui décrivent votre infrastructure AWS. Un template est un fichier 
au format JSON ou YAML qui contient toutes les ressources, paramètres, mappings, conditions et sorties nécessaires pour 
créer et gérer votre infrastructure.

### 1. Utilisation de Templates

Les templates CloudFormation servent de plan pour votre infrastructure. Ils décrivent les ressources que vous souhaitez 
créer, telles que des instances EC2, des bases de données, des files d'attente, des rôles IAM, etc. Vous pouvez 
spécifier les propriétés de chaque ressource, telles que le type d'instance, les stratégies de sécurité, les 
autorisations, etc.

Les templates vous permettent de définir l'ordre dans lequel les ressources doivent être créées, ce qui garantit que les
dépendances entre les ressources sont gérées correctement. Vous pouvez également utiliser des fonctions intrinsèques 
pour effectuer des opérations avancées, telles que la récupération de valeurs à partir d'autres ressources ou de 
paramètres.

### 2. Gestion des Mises à Jour et des Suppressions

CloudFormation facilite la gestion des mises à jour et des suppressions de ressources. Lorsque vous apportez des 
modifications à votre template, CloudFormation analyse les différences entre la configuration actuelle et la 
configuration souhaitée. Il effectue ensuite les modifications nécessaires pour mettre à jour votre infrastructure en 
conséquence. Cela vous permet de garder votre infrastructure à jour tout en minimisant les interruptions de service.

De plus, CloudFormation assure également la gestion des suppressions de ressources. Lorsque vous supprimez une ressource
ou une pile, CloudFormation s'assure que toutes les ressources associées sont aussi supprimées. Cela garantit une 
gestion propre et complète de votre infrastructure.

### 3. CloudFormation Designer

CloudFormation Designer est une interface graphique qui vous permet de concevoir et de visualiser vos templates 
CloudFormation. Avec CloudFormation Designer, vous pouvez créer et éditer visuellement vos templates en utilisant une 
représentation graphique des ressources. Cela facilite la conception de votre infrastructure et la compréhension de sa 
structure.

CloudFormation Designer propose des fonctionnalités de glisser-déposer pour ajouter des ressources, des connexions 
visuelles pour représenter les dépendances, ainsi que des fonctionnalités de validation pour vérifier la validité de 
votre template. Vous pouvez ensuite exporter votre template pour l'utiliser avec CloudFormation.

> note ""
> **_Elastic Beanstalk_** et **_CodeStar_** font usage de **_CloudFormation_** en arrière-plan.

<hr class="hr-text" data-content="Templating">

## Syntaxe du Template

Un template CloudFormation est composé de différentes sections qui définissent les ressources, les paramètres, les 
mappings, les sorties et les conditions de votre infrastructure. Chaque section a un rôle spécifique dans la création et
la configuration de votre environnement AWS.

> info "Référence"
> Les fichiers de template regroupent plusieurs parties. Vous trouverez à l’adresse suivante 
> [AWS Template Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-reference.html){:target="_blank" rel="noopener noreferrer nofollow"} 
> toutes les références concernant la syntaxe des templates.

Voici un aperçu des principales sections d'un template CloudFormation :

### Resources (Ressources)

La section **Resources** contient la liste des ressources que vous souhaitez créer dans votre infrastructure. Chaque 
ressource est définie en tant qu'objet avec ses propriétés spécifiques. Chaque ressource doit avoir un attribut `Type`
qui spécifie le type de ressource AWS à créer. Par exemple, vous pouvez définir des instances EC2, des groupes de 
sécurité, des bases de données, etc.

Voici un exemple de syntaxe pour la création d'une instance EC2 et de son groupe de sécurité :

{% highlight yaml %}
Resources:
  MyEC2Instance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-12345678
      InstanceType: t2.micro
      SecurityGroupIds:
        - sg-abcdefgh
{% endhighlight %}

> info "Syntaxe par type de `Resources`"
> En fonction de la ressource concernée, il existe différentes formes de syntaxe. Vous trouverez à l'adresse 
> [AWS resource and property types reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html){:target="_blank" rel="noopener noreferrer nofollow"}
> le détail pour chaque type de `Resources`.


### Parameters (Paramètres)

La section `Parameters` permet de définir les paramètres personnalisables pour votre template. Les paramètres vous 
permettent de fournir des valeurs lors du déploiement de votre infrastructure, ce qui vous permet de personnaliser les 
configurations en fonction de vos besoins. Vous pouvez spécifier le type de données attendu pour chaque paramètre, ainsi
que des contraintes facultatives.

Voici un exemple de syntaxe pour la définition de deux paramètres, `InstanceType` et `KeyName` :

{% highlight yaml %}
Parameters:
  InstanceType:
    Type: String
    Default: t2.micro
    Description: Type d'instance EC2
  KeyName:
    Type: AWS::EC2::KeyPair::KeyName
    Description: Nom de la paire de clés EC2
    ConstraintDescription: Doit être le nom d'une paire de clés EC2 existante.
{% endhighlight %}

### Mappings (Correspondances)

La section `Mappings` vous permet de définir des correspondances entre des clés et des valeurs. Les correspondances 
peuvent être utilisées pour simplifier la configuration de votre template et permettre une personnalisation en fonction 
de différents critères, tels que la région ou l'environnement. Vous pouvez utiliser la fonction intrinsèque 
`Fn::FindInMap` pour récupérer les valeurs correspondantes.

Voici un exemple de syntaxe pour la définition d'une correspondance entre les types d'instances EC2 et leurs 
architectures :

{% highlight yaml %}
Mappings:
  InstanceTypeToArch:
    t2.micro:
      Arch: HVM64
    t2.small:
      Arch: HVM64
{% endhighlight %}

### Outputs (Sorties)

La section `Outputs` vous permet de définir les valeurs que vous souhaitez rendre disponibles après la création de 
votre infrastructure. Vous pouvez spécifier des sorties pour capturer des informations importantes, telles que les 
identifiants des ressources créées, les adresses IP, etc. Ces sorties peuvent être utilisées par d'autres ressources ou 
peuvent être affichées à la fin du déploiement.

Voici un exemple de syntaxe pour la définition de deux sorties, `InstanceId` et `PublicIP` :

{% highlight yaml %}
Outputs:
  InstanceId:
    Description: ID de l'instance EC2 créée
    Value: !Ref MyEC2Instance
  PublicIP:
    Description: Adresse IP publique de l'instance EC2 créée
    Value: !GetAtt MyEC2Instance.PublicIp
{% endhighlight %}

### Conditions (Conditions)

La section `Conditions` vous permet de définir des conditions logiques pour contrôler la création de certaines 
ressources ou la configuration de leurs propriétés. Vous pouvez utiliser des fonctions intrinsèques, telles que 
`Fn::And`, `Fn::Equals`, `Fn::If`, `Fn::Not`, `Fn::Or` pour évaluer les conditions et prendre des décisions en fonction 
de leur résultat.

Voici un exemple de syntaxe pour la définition d'une condition basée sur le type d'instance EC2 :

{% highlight yaml %}
Conditions:
  IsMicroInstance: !Equals [!Ref InstanceType, t2.micro]
{% endhighlight %}

Ces sections constituent les éléments de base pour créer des templates CloudFormation. Vous pouvez les combiner et les 
personnaliser en fonction de vos besoins spécifiques. En utilisant ces sections, vous pouvez décrire et organiser votre 
infrastructure AWS de manière déclarative et reproductible.

> info ""
> Notez que les exemples fournis utilisent la syntaxe **_YAML_**, mais vous pouvez également utiliser **_JSON_** pour 
> définir vos templates **_CloudFormation_**.

<hr class="hr-text" data-content="Fonctions">

## Utilisation des Fonctions Intrinsèques

CloudFormation propose une variété de **fonctions intrinsèques** qui vous permettent de réaliser des opérations avancées
dans vos templates. Ces fonctions vous aident à attribuer des valeurs dynamiques aux propriétés des ressources, à 
référencer d'autres ressources ou à effectuer des manipulations de chaînes de caractères.

Voici quelques-unes des fonctions intrinsèques couramment utilisées :

### `Fn::Ref`

La fonction intrinsèque `Fn::Ref` vous permet de référencer des paramètres ou des ressources dans votre template. 
Lorsque vous utilisez `Fn::Ref` avec un paramètre, il renvoie la valeur spécifiée lors du déploiement. Lorsque vous 
l'utilisez avec une ressource, il renvoie généralement une valeur que vous pouvez utiliser pour faire référence à cette 
ressource.

Voici un exemple d'utilisation de `Fn::Ref` pour récupérer la valeur d'un paramètre nommé `InstanceType` :

{% highlight yaml %}
InstanceType: !Ref InstanceType
{% endhighlight %}

### `Fn::GetAtt`

La fonction intrinsèque `Fn::GetAtt` vous permet de récupérer la valeur d'un attribut d'une ressource spécifique. Vous 
pouvez utiliser `Fn::GetAtt` pour obtenir des informations sur une ressource créée, telles que son ID, son adresse IP, 
etc.

Voici un exemple d'utilisation de `Fn::GetAtt` pour obtenir l'adresse IP publique d'une instance EC2 nommée 
`MyEC2Instance` :

{% highlight yaml %}
PublicIP: !GetAtt MyEC2Instance.PublicIp
{% endhighlight %}

### `Fn::FindInMap`

La fonction intrinsèque `Fn::FindInMap` vous permet de récupérer une valeur correspondant à des clés dans une structure 
de correspondance (mapping). Vous pouvez utiliser cette fonction pour simplifier la récupération de valeurs basées sur 
des critères spécifiques, tels que la région ou le type d'instance.

Voici un exemple d'utilisation de `Fn::FindInMap` pour obtenir l'architecture correspondant à un type d'instance EC2 :

{% highlight yaml %}
Arch: !FindInMap [InstanceTypeToArch, !Ref InstanceType, Arch]
{% endhighlight %}

### `Fn::Join`

La fonction intrinsèque `Fn::Join` vous permet de concaténer une liste de valeurs en une seule valeur, séparée par un 
délimiteur spécifié. Cela est utile lorsque vous souhaitez combiner plusieurs valeurs en une seule chaîne de caractères.

Voici un exemple d'utilisation de `Fn::Join` pour concaténer deux valeurs en les séparant par une virgule :

{% highlight yaml %}
CombinedValue: !Join [",", [Value1, Value2]]
{% endhighlight %}

Ces fonctions intrinsèques sont quelques exemples parmi de nombreuses autres fonctions disponibles dans CloudFormation. 
Elles vous permettent de réaliser des opérations avancées et d'ajouter de la flexibilité à vos templates.

Il est important de consulter la 
[Référence des fonctions intrinsèques](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html){:target="_blank" rel="noopener noreferrer nofollow"} 
pour obtenir une liste complète des fonctions intrinsèques et comprendre leurs fonctionnalités spécifiques.

<hr class="hr-text" data-content="Rollback">

## Gestion du Rollback

Lorsque vous effectuez des mises à jour de templates CloudFormation, un mécanisme de **Rollback** est disponible pour 
garantir l'intégrité de votre infrastructure en cas d'erreur pendant le processus de mise à jour.

L'idée principale du Rollback est de restaurer l'état précédent de votre infrastructure en annulant les modifications 
effectuées lors de la mise à jour erronée. Cela permet de minimiser les impacts des erreurs et de maintenir votre 
environnement fonctionnel.

Lorsque vous lancez une mise à jour de template, CloudFormation effectue les étapes suivantes :

1. **Analyse des changements :** CloudFormation analyse les différences entre votre état actuel et le nouveau template 
et détermine les actions à effectuer pour atteindre l'état souhaité.

2. **Exécution des modifications :** CloudFormation applique les modifications nécessaires pour mettre à jour votre 
infrastructure en fonction du nouveau template. Cela peut impliquer la création, la modification ou la suppression de 
ressources.

3. **Vérification de la stabilité :** Une fois les modifications appliquées, CloudFormation vérifie la stabilité de 
votre environnement en exécutant des tests. Si des erreurs sont détectées pendant cette phase, le mécanisme de Rollback 
est activé.

En cas d'erreur détectée, le Rollback est déclenché et CloudFormation effectue les actions suivantes :

1. **Suppression des ressources nouvellement créées :** Toutes les ressources créées pendant la mise à jour erronée sont 
supprimées pour revenir à l'état précédent.

2.**Restauration des ressources modifiées :** Les ressources modifiées pendant la mise à jour erronée sont restaurées à 
leur état précédent.

3. **Annulation des suppressions :** Si des ressources ont été supprimées lors de la mise à jour, le Rollback annule ces
suppressions pour les rétablir.

Le mécanisme de Rollback offre une sécurité supplémentaire lors de la gestion de vos templates CloudFormation. En cas de
problème, vous pouvez être assuré que votre infrastructure sera restaurée à un état fonctionnel précédent.

> note ""
> Il est important de noter que le **Rollback** n'est pas activé par défaut, vous devez spécifier cette option lors du 
> lancement de la mise à jour de votre template si vous souhaitez bénéficier de cette fonctionnalité.

<hr class="hr-text" data-content="Stacks">

## Utilisation des Stacks

Dans AWS CloudFormation, les `Stacks` jouent un rôle essentiel dans la gestion de vos ressources AWS. Une Stack est une 
collection de ressources AWS qui peuvent être gérées comme une seule unité. Elle vous permet de créer, mettre à jour ou 
supprimer un ensemble de ressources de manière cohérente et reproductible.

Voici quelques points clés sur l'utilisation des Stacks :

### Définition de Stacks

Une **Stack** est créée à partir d'un template CloudFormation, qui décrit l'ensemble des ressources et de leur 
configuration.

L'utilisation de Stacks présente plusieurs avantages :

- **Gestion simplifiée des ressources** : En regroupant les ressources associées dans une Stack, vous pouvez les gérer 
et les traiter comme une unité logique. Cela facilite la création, la mise à jour et la suppression de vos ressources en
un seul processus.

- **Reproductibilité et cohérence** : Le template CloudFormation garantit que votre infrastructure est créée de manière 
cohérente à chaque déploiement de la Stack. Cela évite les erreurs manuelles et assure la reproductibilité de votre 
environnement.

- **Suivi et gestion simplifiés** : Grâce à CloudFormation, vous disposez d'une vue claire et complète de l'état de 
votre infrastructure. Vous pouvez facilement visualiser les ressources, leurs dépendances et les modifications apportées
au fil du temps.

### ChangeSets

Lorsque vous apportez des modifications à une Stack existante, il est important de comprendre l'impact de ces 
modifications avant de les appliquer. Les **ChangeSets** sont un mécanisme fourni par AWS CloudFormation pour 
prévisualiser les modifications proposées avant de les mettre en œuvre.

Un **ChangeSet** est une représentation des modifications qui seront appliquées à la Stack. Il vous permet de vérifier 
les actions prévues, d'identifier les ajouts, les mises à jour ou les suppressions de ressources, et de valider les 
modifications avant de les appliquer.

Les **ChangeSets** offrent une sécurité supplémentaire et vous permettent de prendre des décisions éclairées sur la 
gestion de vos ressources.

### Nested Stacks

Les **Nested Stacks** sont des Stacks créées dans le contexte d'une autre Stack principale. Elles permettent de 
réutiliser des composants communs ou de décomposer votre infrastructure en modules logiques plus petits et autonomes.

En utilisant des Nested Stacks, vous pouvez simplifier la gestion de vos templates en les organisant de manière 
hiérarchique. Chaque Nested Stack peut avoir son propre template et gérer ses ressources spécifiques, tout en étant 
intégrée dans la Stack principale.

Cela facilite la gestion et la maintenance de vos ressources en les divisant en composants plus petits et réutilisables.
Vous pouvez ainsi créer des modèles dédiés pour chaque composant et les référencer dans votre Stack principale.

Les Nested Stacks permettent également de promouvoir la modularité, la flexibilité et la réutilisation de vos 
infrastructures dans différents contextes.

<hr class="hr-text" data-content="StackSets">

## Utilisation des StackSets

Dans AWS CloudFormation, les **StackSets** offrent une solution puissante pour le déploiement de Stacks dans plusieurs 
comptes AWS et régions. Un StackSet vous permet de créer, mettre à jour et supprimer des Stacks dans un ensemble de 
comptes cibles en utilisant un seul modèle de CloudFormation.

Voici les principaux points à retenir concernant l'utilisation des StackSets :

### Présentation des StackSets

Un StackSet vous permet de gérer de manière centralisée le déploiement d'un ensemble de Stacks dans différents comptes 
AWS et régions. Vous spécifiez un modèle de CloudFormation, ainsi que les paramètres et les capacités requis par ce modèle.

Lorsque vous créez un StackSet, vous avez la possibilité de déployer les Stacks dans un ou plusieurs comptes AWS cibles,
ainsi que dans les régions de votre choix. Cela vous offre une flexibilité pour déployer et gérer votre infrastructure 
de manière cohérente dans différents contextes.

Les StackSets sont particulièrement utiles dans les environnements multi-comptes, où vous pouvez déployer une 
architecture standardisée dans chaque compte de manière automatique et contrôlée.

### Création, Mise à Jour et Suppression de StackSets

La création d'un StackSet implique la spécification du modèle CloudFormation que vous souhaitez utiliser pour créer les 
Stacks, ainsi que des comptes cibles dans lesquels vous souhaitez déployer ces Stacks. Vous pouvez également préciser 
les régions AWS dans lesquelles vous souhaitez les déployer.

Une fois que vous avez créé un StackSet, vous pouvez le mettre à jour de différentes manières :

- **Modification des paramètres** : Vous pouvez modifier les paramètres existants dans le modèle ou ajouter de nouvelles
ressources pour effectuer des modifications spécifiques à votre infrastructure.

- **Remplacement du modèle** : Vous avez la possibilité de remplacer le modèle existant par un autre modèle pour 
apporter des modifications plus substantielles à votre StackSet.

- **Ajout de comptes et de régions** : Vous pouvez étendre votre StackSet en ajoutant des comptes cibles supplémentaires
ou en déployant les Stacks dans de nouvelles régions AWS.

La suppression d'un StackSet entraîne la suppression des Stacks associés dans les comptes cibles spécifiés. Vous pouvez 
choisir de supprimer uniquement certains Stacks ou de supprimer tous les Stacks du StackSet.

> note ""
> Il est important de noter que vous ne pouvez supprimer un StackSet que lorsque toutes les instances de Stack ont été 
> supprimées.

### Avantages des StackSets

Les StackSets offrent de nombreux avantages dans le déploiement et la gestion d'infrastructures à grande échelle :

- **Déploiement cohérent** : Les StackSets assurent un déploiement cohérent des mêmes ressources de Stacks dans chaque 
compte cible et région spécifiés. Cela garantit la cohérence et la conformité de votre infrastructure.

- **Gestion centralisée** : En utilisant un StackSet, vous pouvez gérer de manière centralisée les Stacks dans plusieurs
comptes et régions, ce qui facilite la gestion et la coordination de votre infrastructure à grande échelle.

- **Facilité de mise à jour** : Les StackSets permettent de mettre à jour facilement les Stacks dans l'ensemble de votre
environnement en appliquant des modifications au modèle de CloudFormation. Vous pouvez ainsi maintenir votre 
infrastructure à jour de manière efficace et sécurisée.

Les StackSets offrent une approche flexible et évolutive pour le déploiement et la gestion de vos Stacks dans des 
environnements distribués. Ils vous permettent de maintenir la cohérence et le contrôle tout en simplifiant la gestion 
et les mises à jour de votre infrastructure.

<hr class="hr-text" data-content="Drift">

## Gestion de la Dérive (Drift) avec CloudFormation

La **détection de dérive** (drift) est une fonctionnalité essentielle d'AWS CloudFormation qui vous permet de vérifier 
si une Stack a divergé de sa configuration initiale définie dans le modèle de CloudFormation. La dérive se produit 
lorsque des modifications non autorisées sont apportées aux ressources de la Stack en dehors de CloudFormation, ce qui 
peut entraîner des écarts par rapport à l'état prévu.

Voici les principaux points à retenir concernant la gestion de la dérive avec CloudFormation :

### Détection de Dérive et son Utilité

La détection de dérive vous permet de maintenir l'intégrité et la conformité de votre infrastructure en identifiant les 
écarts entre l'état réel des ressources et l'état attendu défini dans le modèle CloudFormation. Cela vous aide à 
détecter les modifications non autorisées, les configurations incorrectes ou les ressources supprimées.

La détection de dérive est utile dans les situations suivantes :

- **Maintien de la conformité** : Vous pouvez vérifier si les ressources de votre Stack respectent les règles de 
sécurité, les bonnes pratiques ou les politiques internes de votre organisation. La détection de dérive vous aide à 
identifier les écarts et à prendre les mesures appropriées pour les corriger.

- **Suivi des modifications non autorisées** : Vous pouvez détecter les modifications apportées aux ressources en dehors
de CloudFormation, ce qui permet de prévenir les erreurs humaines ou les actions non autorisées qui pourraient entraîner
des configurations indésirables.

### Procédure de Détection de Dérive d'une Stack

Pour détecter la dérive d'une Stack dans AWS CloudFormation, vous pouvez suivre les étapes suivantes :

1. Accédez à la console AWS CloudFormation à l'adresse 
[https://console.aws.amazon.com/cloudformation](https://console.aws.amazon.com/cloudformation){:target="_blank" rel="noopener noreferrer nofollow"}.

2. Dans la liste des Stacks, sélectionnez la Stack pour laquelle vous souhaitez effectuer la détection de dérive.

3. Dans le panneau des détails de la Stack, choisissez **Actions de la Stack**, puis sélectionnez **Détecter la dérive**.

AWS CloudFormation compare alors l'état actuel des ressources de la Stack avec l'état défini dans le modèle de 
CloudFormation. Vous recevrez un rapport détaillé indiquant les ressources en dérive, c'est-à-dire les ressources qui 
ont été modifiées, supprimées ou dont la configuration diffère de celle spécifiée dans le modèle.

En analysant le rapport de dérive, vous pouvez prendre les mesures appropriées pour restaurer l'état souhaité de votre 
infrastructure. Cela peut impliquer la mise à jour du modèle de CloudFormation, la récréation de certaines ressources ou
d'autres actions correctives.

La détection de dérive avec CloudFormation est un moyen précieux de maintenir l'intégrité de votre infrastructure et 
d'assurer la conformité avec les configurations attendues. En suivant régulièrement la procédure de détection de dérive,
vous pouvez vous assurer que votre infrastructure reste alignée sur vos exigences et prévenir les configurations 
indésirables.

<hr class="hr-text" data-content="Coût">

## Estimation des Coûts

Lorsque vous utilisez AWS CloudFormation, il est important de comprendre le modèle de tarification associé et d'estimer 
les coûts liés à vos Stacks. Voici les points clés à retenir concernant l'estimation des coûts dans CloudFormation :

### Modèle de Tarification de CloudFormation

AWS CloudFormation ne facture pas de frais supplémentaires pour l'utilisation de son service. Vous êtes uniquement 
facturé pour les ressources AWS que vous déployez à l'aide de CloudFormation. Cela signifie que les coûts associés à 
l'utilisation de CloudFormation sont les mêmes que si vous aviez créé et géré ces ressources manuellement.

Les frais liés aux ressources déployées par CloudFormation sont calculés en fonction des tarifs standard d'AWS pour 
chaque service spécifique. Par exemple, si vous déployez des instances Amazon EC2, vous serez facturé selon les tarifs 
EC2 habituels.

### Utilisation du Calculateur de Prix AWS

Pour estimer les coûts associés à vos Stacks CloudFormation, AWS propose un outil pratique appelé 
**calculateur de prix AWS**. Cet outil vous permet d'obtenir une estimation détaillée des coûts en fonction de votre 
configuration spécifique.

Voici comment estimer les coûts d'une Stack CloudFormation à l'aide du calculateur de prix AWS :

1. Sur la page de révision de l'assistant de création de Stack, dans la section **Modèle**, cliquez sur le lien 
**Estimer les coûts**.

2. Le lien vous redirigera vers le calculateur de prix AWS dans un nouvel onglet de votre navigateur.

3. Dans le calculateur de prix, vous pouvez vérifier et ajuster les paramètres de chaque ressource déployée par votre 
Stack, ainsi que les paramètres de transfert de données, les régions AWS, etc. pour obtenir une estimation précise.

4. Une fois que vous avez configuré tous les paramètres nécessaires, le calculateur de prix AWS vous fournira une 
estimation détaillée des coûts mensuels associés à votre Stack CloudFormation.

Il est important de noter que le calculateur de prix AWS vous permet de prendre en compte différents facteurs et options
spécifiques à votre infrastructure. Cela vous aide à évaluer les coûts potentiels avant de déployer vos Stacks 
CloudFormation et à planifier en conséquence.

En utilisant le calculateur de prix AWS, vous pouvez avoir une idée claire des coûts associés à vos Stacks 
CloudFormation et prendre des décisions éclairées en matière de budgétisation et d'optimisation des coûts.


<hr class="hr-text" data-content="Conclusion">

## Conclusion

Dans cet article, nous avons exploré les principes fondamentaux et les concepts clés d'AWS CloudFormation en tant 
qu'outil d'Infrastructure-as-Code. Voici un récapitulatif des points clés que nous avons abordés :

- CloudFormation permet de décrire votre infrastructure sous forme de code et de la créer automatiquement, en fonction 
de votre configuration.
- Les avantages de CloudFormation reposent sur l'approche Infrastructure-as-Code, qui offre une gestion efficace de 
l'infrastructure.
- Vous pouvez estimer le coût de votre infrastructure à partir du code de CloudFormation, ce qui facilite la 
planification budgétaire.
- Le code déclaratif de CloudFormation et la gestion des ressources dans des Stacks vous permettent d'améliorer la 
productivité et de maintenir un état clair de votre infrastructure.
- Les templates de CloudFormation sont au format JSON ou YAML et regroupent plusieurs sections telles que Resources, 
Parameters, Mappings, Outputs et Conditions.
- Vous pouvez utiliser des fonctions intrinsèques telles que Ref, GetAtt, FindInMap, Join, etc., pour manipuler les 
valeurs et les attributs dans les templates.
- CloudFormation prend en charge le mécanisme de Rollback lors des mises à jour de templates, vous permettant de revenir
à l'état précédent en cas d'erreur.
- Les Stacks sont des unités de gestion de ressources dans CloudFormation, permettant de créer, mettre à jour et 
supprimer des ensembles de ressources de manière cohérente.
- Les ChangeSets vous permettent de prévisualiser les modifications proposées avant de les appliquer à vos Stacks 
existantes.
- Les Nested Stacks vous offrent la possibilité de réutiliser des composants communs en les déclarant dans des modèles 
dédiés.
- Les StackSets vous permettent de déployer des Stacks dans plusieurs comptes AWS et régions à partir d'un seul modèle 
CloudFormation.
- La détection de dérive (drift) vous aide à identifier les écarts entre l'état actuel des ressources et l'état attendu 
défini dans le modèle de CloudFormation.
- Vous pouvez estimer les coûts associés à vos Stacks CloudFormation en utilisant le calculateur de prix AWS.

Nous encourageons vivement l'utilisation d'AWS CloudFormation pour une gestion efficace de l'infrastructure. En adoptant
l'approche Infrastructure-as-Code et en exploitant les fonctionnalités puissantes de CloudFormation, vous pouvez 
automatiser la création, la mise à jour et la suppression de votre infrastructure, améliorant ainsi l'efficacité, la 
cohérence et la conformité de vos environnements.

N'oubliez pas de consulter la documentation officielle d'AWS CloudFormation pour approfondir vos connaissances et tirer 
le meilleur parti de cet outil puissant. Avec CloudFormation, vous pouvez construire et gérer vos infrastructures de 
manière plus efficace, vous permettant ainsi de vous concentrer sur l'innovation et la réalisation de vos objectifs métier.

