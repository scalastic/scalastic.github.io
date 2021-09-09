---
layout: post
title: Monitoring et Audit dans AWS - CloudWatch, X-Ray et CloudTrail
date: 2021-09-07 10:25:00 +0200
description: Principes fondamentaux et concepts clés d'AWS CloudWatch, X-Ray et CloudTrail à connaître. Tutoriel, mode d'emploi.
img: aws-monitoring-auditing-cloudwatch-xray-cloudtrail-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@gontranid?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Gontran Isnard</a> sur <a href="https://unsplash.com/s/photos/telescope?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, CloudWatch, X-Ray, CloudTrail, Monitoring, Documentation]
lang: fr
permalink: /aws-monitoring-auditing-cloudwatch-xray-cloudtrail/
status: finished
---

Un des aspects importants lorsqu'on déploie une application dans le Cloud, est le monitoring et la supervision afin d'une part, de s'assurer que tous les services applicatifs fonctionnent bien et d'autre part, de pouvoir réagir en cas de défaillance.

AWS propose plusieurs outils afin d'accomplir ces deux tâches :
- **AWS CloudWatch**
    * Metrics : collecte les métriques intégrés aux services AWS et ceux de votre application
    * Logs : collecte et stocke les fichiers journaux (logs)
    * Events : envoie de notification en réaction à certains événements
    * Alarms : définit des seuils d'activation (alarms) qui déclenche une action
- **AWS X-Ray**
    - Aide à l'analyse et au débogage d'applications mêmes celles distribuées
    - Produit sous forme graphique le parcours d'une requête et des composants qu'elle traverse avec les erreurs associées
- **AWS CloudTrail**
    * Monitoring des appels aux APIs
    * Analyse de conformité
    * Audit opérationnel

<hr class="hr-text" data-content="Plan">

* TOC
{:toc}

<hr class="hr-text" data-content="Metrics">

## AWS CloudWatch Metrics

Les métriques sont des données sur l'activité de vos systèmes. Par défaut, de nombreux services AWS fournissent des métriques.

- Les métriques gratuits ont une **périodicité de 5 min**, il est possible de la reduire en activant l'option **Detailed Monitoring** mais pour un coût supplémentaire
- Les métriques sont horodatés
- Les métriques sont regroupées d’abord par **namespace**, puis par les différentes combinaisons de **dimensions** (attributs de la ressource) au sein de chaque namespace. Par exemple, vous pouvez afficher toutes les mesures EC2, les mesures EC2 regroupées par instance ou les mesures EC2 regroupées par groupe de mise à l’échelle automatique.
- Seuls les services AWS que vous utilisez envoient des métriques à Amazon CloudWatch.
- Pour obtenir une liste des services AWS qui envoient des mesures à CloudWatch, voir [Services AWS qui publient des mesures CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html){:target="_blank" rel="noopener noreferrer nofollow"}. À partir de cette page, vous pouvez également voir les mesures et les dimensions publiées par chacun de ces services.

### Custom Metrics

Vous pouvez publier vos propres mesures (**Custom Metrics**) dans CloudWatch à l’aide de la commande ***put-metric-data*** du CLI AWS ou ***PutMetricData*** de l'API :
- Leur périodicité peut être **Standard** (1 min ou plus) ou **High resolution** (1, 5, 10 ou 30s)
- Il est possible de définir jusqu'à 10 dimensions

<hr class="hr-text" data-content="Logs">

## AWS CloudWatch Logs

### Généralités

- CloudWatch peut récolter les logs de la plupart des services AWS et des applications qui utilisent le SDK
- Il existe un **Log Group** qui représente l'application et un **Log Stream** qui représente chaque service
- Il existe une politique d'expiration (30, 90 jours, jamais,...)
- Ces logs peuvent être exportés vers S3 (pour être sauvegardés) ou bien vers un Cluster Elastic Search pour analyse
- Il faut des permissions IAM particulières pour autoriser CloudWatch à récupérer les logs et il est possible de les chiffrer à l'aide de AWS KMS (au niveau du Log Group)

### CloudWatch Log Agent

Pour les instances EC2 et les serveurs on-premise, il est nécessaire d'installer un **Agent**.

Il en existe deux versions :
- **CloudWatch Log Agent** : Une ancienne version, ne peut gérer que les logs
- **CloudWatch Unified Agent** : La dernière version, peut gérer les logs mais aussi la remontée de métriques détaillés telles que CPU, RAM, Disk, NetStat, Process, Swap,... du serveur et les **SSM Parameter Store**

<hr class="hr-text" data-content="Filters & Alarms">

## CloudWatch Metric Filters et CloudWatch Alarms

- **CloudWatch Metric Filters** peut filtrer les logs avec des expressions (IP, RegExp,...) afin de déclencher des **Alarms**
- **CloudWatch Alarm** peut déclencher des notifications vers un ASG, un AWS SNS, une EC2 Action en fonction d'un métrique

<hr class="hr-text" data-content="Events">

## CloudWatch Events et Amazon EventBridge

- **CloudWatch Events** :
    * Réagit à partir de règles à ce qu'un service fait (Arrêt d'une instance,...)
    * Crée un événement sous la forme d'un message JSON contenant ce qui l'a fait réagir
    * Peut s'interfacer à un AWS SQS, SNS ou bien Kinesis

- **Amazon EventBridge** :
    * Il prend en compte 3 **Event Bus** :
        - **Default Event Bus** pour les Services AWS
        - **Partner Event Bus** pour les Services SaaS et les partenaires d'AWS
        - **Custom Event Bus** pour votre application
    * Il fonctionne aussi à partir de règles tout comme CloudWatch Event
    * EventBridge peut déduire la structure du message et le **Schema Registry** permet de générer le code applicatif nécessaire à votre application

> note "A noter"
> **CloudWatch Events** et **Amazon EventBridge** reposent sur les mêmes infrastructures AWS mais **Amazon EventBridge** est la version la plus récente et offre plus de fonctionnalités que **CloudWatch Events**.

<hr class="hr-text" data-content="X-Ray">

## AWS X-Ray

- AWS X-Ray est un service qui collecte les données des requêtes que servent vos applications. Il permet aussi de les afficher et les filtrer afin d'identifier des problèmes ou des possibilités d’optimisation.
- Pour toute requête tracée dans votre application, vous pouvez voir des informations détaillées non seulement sur la requête et la réponse, mais aussi sur les appels que votre application effectue vers les ressources AWS en aval, les microservices, les bases de données et les API Web HTTP.

### Fonctionnement

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/aws-monitoring-auditing-cloudwatch-xray-cloudtrail-xray-architecture.jpg --alt Architecture et composants du Service X-Ray %}
  <figcaption>Architecture et composants du Service X-Ray</figcaption>
</figure>

- Chaque composant intervenant dans la requête envoie une trace à l'API X-Ray :
    * Le code applicatif en y intégrant le **X-Ray SDK** propre à son langage (supporté Java, Node.js, .NET,...) et du **X-Ray Daemon** installé sur le serveur
    * Les scripts via l'**AWS SDK** ou l'**AWS CLI** au travers du **X-Ray Daemon**
    * Certains services AWS automatiquement si l'on active l'option ***sauf cas particulier pour les instances EC2 et On-Premise***
- Toutes les requêtes peuvent être envoyées ou uniquement un échantillon
- Nécessite une autorisation IAM et est chiffré par AWS KMS

### X-Ray SDK

L'intégration du *X-Ray SDK* nécessite d'apporter quelques modifications au code applicatif.

**Exemple d'une application Java**

- Gestion des dépendances

{% highlight pom.xml %}
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>com.amazonaws</groupId>
      <artifactId>aws-xray-recorder-sdk-bom</artifactId>
      <version>2.9.0</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
<dependencies>
  <dependency>
    <groupId>com.amazonaws</groupId>
    <artifactId>aws-xray-recorder-sdk-core</artifactId>
  </dependency>
  <dependency>
    <groupId>com.amazonaws</groupId>
    <artifactId>aws-xray-recorder-sdk-apache-http</artifactId>
  </dependency>
  <dependency>
    <groupId>com.amazonaws</groupId>
    <artifactId>aws-xray-recorder-sdk-aws-sdk</artifactId>
  </dependency>
  <dependency>
    <groupId>com.amazonaws</groupId>
    <artifactId>aws-xray-recorder-sdk-aws-sdk-instrumentor</artifactId>
  </dependency>
  <dependency>
    <groupId>com.amazonaws</groupId>
    <artifactId>aws-xray-recorder-sdk-sql-postgres</artifactId>
  </dependency>
  <dependency>
    <groupId>com.amazonaws</groupId>
    <artifactId>aws-xray-recorder-sdk-sql-mysql</artifactId>
  </dependency>
</dependencies>
{% endhighlight %}

- Client DynamoDB

{% highlight Java %}
import com.amazonaws.xray.AWSXRay;
import com.amazonaws.xray.handlers.TracingHandler;

public class SessionModel {
  private AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard()
        .withRegion(Constants.REGION)
        .withRequestHandlers(new TracingHandler(AWSXRay.getGlobalRecorder()))
        .build();
  private DynamoDBMapper mapper = new DynamoDBMapper(client);
{% endhighlight %}

### X-Ray Daemon

- Le **Daemon X-Ray** est une application qui écoute le trafic sur le **port UDP 2000**, recueille des données des **Segments** et les transmet à l’**API X-Ray**
- Il est déjà intégré à de nombreux services AWS mais doit être installé sur les instances **EC2** ou les serveurs **On-Premise**

> info "Instances EC2 d'un cluster ECS"
> Il existe 2 possibilités d'intégration du Daemon X-Ray :
> - Déployez un conteneur Daemon **amazon/aws-xray-daemon** sur chaque instance EC2
> - Créez conteneur **SideCar** contenant une image du Daemon X-Ray et une image du code applicatif

<hr class="hr-text" data-content="CloudTrail">

## AWS CloudTrail

**AWS CloudTrail** est un service AWS qui vous aide dans la gouvernance, la conformité et l’audit opérationnel et de sécurité de votre compte AWS :
- Chaque action prise par un utilisateur, un rôle ou un service AWS est enregistrée comme **événement** dans CloudTrail.
- Les *événements* comprennent les actions prises dans la **console de gestion** de l’AWS, le **CLI AWS** et les **SDK** et **API** de l’AWS.

> info ""
> CloudTrail est activé par défaut sur votre compte AWS

### CloudTrail Trail

- Seuls les **90 derniers jours** d’activité dans votre compte AWS sont enregistrés
- Créez un **Trail** dans CloudTrail pour archiver, analyser et réagir aux changements de vos ressources AWS :
    * Un Trail est une configuration qui permet d'envoyer l'activité enregistrée par CloudTrail sur un **Bucket S3**
    * Vous pouvez également livrer et analyser des événements dans **CloudWatch Logs** et **CloudWatch Events**
    * Un Trail est appliqué, par défaut, sur toutes les régions mais peut l'être sur une seule 

### CloudTrail Events

Un **Event** dans CloudTrail est l’enregistrement d’une activité. Il sont catégorisés en 3 types :
- **Management Events** :
    * Fournit des informations sur les opérations de gestion effectuées sur un compte AWS
    * Configuré par défaut
    * Exemples : Opérations IAM, enregistrement de devices tels qu'un VPC, création de Trail dans CloudTrail Logs,...
- **Data Events** :
    * Fournit des informations sur les opérations effectuées sur ou dans une ressource
    * Pas actif par défaut car cela produit une très grande quantité d'Events
    * Exemples : Amazon S3 Get/Put/Delete, activité d'une AWS Lambda function, Amazon DynamoDB Get/Put/Delete,...
- **Insights Events** :
    * Capture les activités inhabituelles d'un compte AWS
    * Désactivé par défaut
    * Exemples : toute utilisation qui diffère considérablement des habitudes d’utilisation typiques du compte

> info "Intégration à EnventBridge"
> L’intégration de **CloudTrail** à **EventBridge** permet de lancer des actions automatisées en réponse à des événements sur les appels d'API (pour le moment au niveau d'une Region)