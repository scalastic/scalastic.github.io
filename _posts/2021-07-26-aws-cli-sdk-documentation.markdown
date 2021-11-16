---
layout: post
title: Utilisation de AWS CLI (et AWS SDK)
date: 2021-07-26 13:33:00 +0200
description: Utilisation et concepts clés d'AWS CLI (et AWS SDK) à connaître. Tutoriel, mode d'emploi.
img: aws-cli-sdk-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@mattartz?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Matt Artz</a> sur <a href="https://unsplash.com/s/photos/tools?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [AWS, CLI, Profile, STS, MFA, SigV4, Instance-Metadata, SDK, Exponential-Backoff, Documentation]
lang: fr
permalink: /aws-cli-sdk/
status: finished
---

- Le AWS CLI est un outil open source construit à l’aide du SDK AWS pour Python (Boto3) qui fournit des commandes pour interagir avec les services AWS. Avec une configuration minimale, vous pouvez utiliser toutes les fonctionnalités fournies par la console de gestion AWS à partir de votre terminal favori.

- Les SDKs AWS fournissent une API pour différents langages de programmation (Python, Java, JavaScript, C++, .NET, GO, PHP, Ruby,...) afin de construire programmatiquement et utiliser les services AWS.

Dans cet article, nous allons voir quelques astuces afin d'utiliser au mieux ces 2 outils.

<hr class="hr-text" data-content="Plan">

* TOC
{:toc}

<hr class="hr-text" data-content="Installation">

## Installation du AWS CLI

AWS CLI est disponible en 2 versions :
- **Version 2** : la plus récente et qui supporte les dernières fonctionnalités
- **Version 1** : la version originelle, elle ne devrait plus être utilisée

Afin d'installer AWS CLI Version 2 sur Docker, Linux, macOS ou Windows, reportez-vous à la documentation AWS [https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html){:target="_blank" rel="noopener noreferrer nofollow"}


Après une installation réussie, vous devriez pouvoir lancer les commandes suivantes :

{% highlight zsh %}
% which aws
/usr/local/bin/aws

% aws --version
aws-cli/2.2.16 Python/3.8.8 Darwin/20.6.0 exe/x86_64 prompt/off
{% endhighlight %}


<hr class="hr-text" data-content="Profils">

## AWS CLI Profiles

Il est possible d'enregistrer plusieurs comptes utilisateur dans AWS CLI. C'est ce qu'on appelle des Profiles.

Pour cela, une fois votre compte par défaut configuré, vous pouvez en ajouter un nouveau en exécutant la commande :

{% highlight zsh %}
% aws configure --profile <name-of-other-profile>
{% endhighlight %}

A présent, il est possible de lancer une commande AWS CLI sous ce nouveau Profile en ajoutant le paramètre :

{% highlight zsh %}
% aws iam get-user --profile <name-of-other-profile>
{% endhighlight %}

<hr class="hr-text" data-content="MFA">

## Session temporaire

Lorsqu'un compte AWS est protégé par un code MFA, il est possible de créer une session temporaire à l'aide de AWS Security Token Service (AWS STS) pour demander des identifiants temporaires aux privilèges limités.

Pour cela, lancez la commande suivante :

{% highlight zsh %}
% aws sts get-session-token --serial-number <arn-of-your-mfa-device> --token-code <token-code-from-your-mfa-device> --duration-seconds <session-duration-in-seconds>

{
    "Credentials": {
        "AccessKeyId": "ASIH9FS4N0N76VVTDFDG5C",
        "SecretAccessKey": "4h0f4j88H9L/HT4I0xjvE9-jrf72jkISjklbjEvRHfn",
        "SessionToken": "EJu6g3JpZ2luX2VjEDoaCWV.../...wvA5a5mfFWUOrH62fDFYbmUW5j31k1r/igIgP14W374njGO+mbO5+MeYKGoaLvHAC0SFdXh9sjopz2wq7gEIQxABGgw3OTc1MTc4.../...k+4b6sGGym82jlaPI=",
        "Expiration": "2021-07-26T10:10:59+00:00"
    }
}
{% endhighlight %}

Vous obtenez de nouveaux Credentials, valides, le temps de la session.


<hr class="hr-text" data-content="Priorités">

## Priorités des Credentials

Il est possible de définir des Credentials à plusieurs endroits. Il existe donc un ordre de priorité qu'il faut connaitre pour bien comprendre les effets indésirables que cela peut engendrer.

### Pour AWS CLI

1. Passés dans la ligne de commande (--region, --output, --profile)
1. Passés dans des VARIABLES d'environnement (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN)
1. Enregistrés dans le fichier `~/.aws/credentials` généré par la commande `aws configure`
1. Enregistrés dans le fichier `~/.aws/config` généré par la commande `aws configure`
1. Enregistrés dans les Credentials du Container (pour les ECS Tasks)
1. Enregistrés dans le Profiles d'Instances EC2

### Pour AWS SDK

1. Passés dans le System Properties du langage
1. Passés dans des VARIABLES d'environnement (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN)
1. Enregistrés dans le fichier par défaut `~/.aws/credentials` présents dans de nombreux SDKs
1. Enregistrés dans les Credentials du Container (pour les ECS Tasks)
1. Enregistrés dans le Profiles d'Instances EC2

### Bonnes Pratiques

Pour éviter tout écueil avec les Credentials, voici quelques règles à respecter :

1. **NE JAMAIS** enregistrer des Credentials dans le code !!
1. Mais plutôt définir les Credentials au meilleur endroit dans la chaîne de priorité :
  * Si vos appels interviennent dans AWS, utilisez les **Roles IAM** (EC2 Instance Roles, ECS Roles, Lambda Roles)
  * Si vous êtes en dehors du réseau AWS, utilisez les **variables d'environnement** ou bien les **Profiles**


<hr class="hr-text" data-content="Signature Version 4">

## Signing HTTP Request

Lorsqu'on utilise AWS CLI ou AWS SDK, les appels HTTP vers AWS sont signés automatiquement.
Le protocole utilisé s'appelle **Signature Version 4** (**SigV4**)  et provient de AWS.

Il se présente sous deux formes possibles :
- Des entêtes HTTP (Authorization header)
- Des paramètres d'URL (Query string)


<hr class="hr-text" data-content="Debugging">

## Debugging

Voici quelques outils qui, en cas de problèmes, permettront de déboguer et comprendre ce qui se passe :

### Policy Simulator

Il peut être intéressant de vérifier les droits d'accès à une ressource AWS en fonction d'un User, Group ou Role.
Il existe un outil dans AWS qui permet d'exécuter ces tests, le Policy Simulator : [https://policysim.aws.amazon.com/](https://policysim.aws.amazon.com/){:target="_blank" rel="noopener noreferrer nofollow"}

### Dry Run

Il peut être aussi utile de tester une commande AWS CLI en simulant son exécution. Les commandes AWS CLI ont une option pour cela : `--dry-run`

- Exemple de création simulée d'une instance EC2 :

{% highlight zsh %}
% aws ec2 run-instances --dry-run --region eu-west-3 --image-id ami-062fdd189639d3e93 --instance-type t2.micro

An error occurred (DryRunOperation) when calling the RunInstances operation: Request would have succeeded, but DryRun flag is set.
{% endhighlight %}

Parce que la commande est lancée en mode **dry-run**, en cas de succès, elle renvoie **DryRunOperation**. En cas d'échec, elle renverrait **UnauthorizedOperation**.

### Message

Certaines commandes du AWS CLI renvoient un **encoded authorization message** décrivant le problème rencontré. Ce message doit être décodé pour être compréhensible.

Pour cela, vous pouvez utiliser la commande :

{% highlight zsh %}
% aws decode-authorization-message --encoded-message <encoded-message>
{% endhighlight %}

<hr class="hr-text" data-content="Metadata">

## AWS EC2 Instance Metadata

Les Instances Metadata sont des données portant sur une instance EC2 : elles sont accessibles depuis l'instance et permettent de ne pas avoir à utiliser de Role IAM puisque ces données ont déjà été chargées dans l'instance pour sa configuration ou son fonctionnement.

Elles sont accessibles à l'adresse : `http://169.254.169.254/latest/meta-data/`

Notez que ceci est une adresse locale et donc accessible uniquement depuis l'instance EC2.

### Exemples d'utilisation

#### Types de données

{% highlight zsh %}
ec2-user ~ % curl http://169.254.169.254/latest/
dynamic
meta-data
user-data
{% endhighlight %}

Il existe 3 types de données accessibles à partir d'une instance EC2 comme nous pouvons le voir dans le retour de cette commande.

#### Services

Vous pouvez accéder aux métadonnées d'instance à partir d'une instance en cours d'exécution en utilisant l'une des méthodes suivantes :

- Instance Metadata Service Version 1 (IMDSv1) – méthode de demande/réponse
- Instance Metadata Service Version 2 (IMDSv2) – méthode orientée session

Lorsque vous utilisez des demandes orientées session (IMDSv2), vous créez un jeton de session qui définit la durée de la session, qui doit être d'une seconde au minimum et de six heures au maximum. Durant la période spécifiée, vous pouvez utiliser le même jeton de session pour les demandes suivantes.

Voici comment récupérer un jeton de session :

{% highlight zsh %}
ec2-user ~ % TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"`
{% endhighlight %}

Vous pouvez ensuite l'utiliser dans les commandes suivantes, le temps de la session :

{% highlight zsh %}
ec2-user ~ % curl -H "X-aws-ec2-metadata-token: $TOKEN" -v http://169.254.169.254/latest/meta-data/ami-id
{% endhighlight %}

#### Quelques metadonnées d'instance

Voici la description de quelques métadonnées d'instances qui peuvent être utiles :
<table >
    <thead>
       <tr>
          <th>Path de la Metadata</th>
          <th>Description</th>
       </tr>
    </thead>
    <tbody>
      <tr>
       <td><code class="code">ami-id</code>
       </td>
       <td>L'ID d'AMI utilisé pour lancer l'instance.</td>
    </tr>
              
    <tr>
       <td><code class="code">ami-launch-index</code>
       </td>
       <td>Si vous avez démarré plus d'une instance en même temps, cette valeur indique l'ordre
          dans lequel l'instance a été lancée. La valeur 0 indique la première instance lancée.
       </td>
    </tr>
              
    <tr>
       <td><code class="code">block-device-mapping/ami</code>
       </td>
       <td>Le périphérique virtuel qui contient le système de fichiers racine/démarrage.</td>
    </tr>
              
    <tr>
       <td><code class="code">block-device-mapping/ebs</code><em>N</em> 
       </td>
       <td>Les périphériques virtuels associés à tout volume Amazon EBS. Les volumes Amazon EBS
          ne sont disponibles dans les métadonnées que s'ils étaient présents au moment du lancement
          ou lorsque l'instance a été démarrée pour la dernière fois. Le <em>N</em> indique l'index du volume Amazon EBS (tel que <code class="code">ebs1</code> ou <code class="code">ebs2</code>).
       </td>
    </tr>
              
    <tr>
                  
       <td><code class="code">events/recommendations/rebalance</code></td>
                  
       <td>Heure approximative, UTC, à laquelle la notification de recommandation de rééquilibrage
          d'instance&nbsp;EC2 est émise pour l'instance. Voici un exemple de métadonnées pour cette
          catégorie&nbsp;: <code class="code"><span>{</span>"noticeTime":
                            "2020-11-05T08:22:00Z"}</code>. Cette catégorie n'est disponible qu'après l'émission de la notification.
       </td>
    </tr>
              
    <tr>
       <td><code class="code">hostname</code></td>
       <td>Le nom d'hôte DNS IPv4 privé de l'instance. Dans le cas où plusieurs interfaces réseau
          sont présentes, cela fait référence au périphérique eth0 (le périphérique dont le
          numéro de périphérique est 0).
       </td>
    </tr>
              
    <tr>
       <td>
                        <code class="code">iam/info</code>
       </td>
       <td>Si un rôle IAM est associé à l'instance, il contient des informations concernant la
          dernière mise à jour du profil d'instance, parmi lesquelles la date de dernière mise
          à jour (LastUpdated), l'InstanceProfileArn et l'InstanceProfileId de l'instance. Sinon,
          absent.
       </td>
    </tr>
              
    <tr>
       <td>
                        <code class="code">iam/security-credentials/<code class="replaceable">role-name</code></code>
       </td>
       <td>Si un rôle IAM est associé à l'instance, <code class="replaceable">nom-rôle</code> est le nom du rôle et <code class="replaceable">nom-rôle</code> contient les informations d'identification de sécurité temporaires associées au rôle. Sinon, absent.
       </td>
    </tr>
              
    <tr>
       <td><code class="code">instance-id</code></td>
       <td>L'ID de cette instance.</td>
    </tr>
              
    <tr>
       <td><code class="code">instance-type</code>
       </td>
       <td>Le type d'instance.
       </td>
    </tr>
              
    <tr>
       <td>
                        <code class="code">kernel-id</code>
       </td>
       <td>L'ID du noyau lancé avec l'instance, le cas échéant.</td>
    </tr>
              
    <tr>
       <td>
                        <code class="code">local-hostname</code>
       </td>
       <td>Le nom d'hôte DNS IPv4 privé de l'instance. Dans le cas où plusieurs interfaces réseau
          sont présentes, cela fait référence au périphérique eth0 (le périphérique dont le
          numéro de périphérique est 0).
       </td>
    </tr>
              
    <tr>
       <td>
          <code class="code">local-ipv4</code>
       </td>
       <td>L'adresse IPv4 privée de l'instance. Dans le cas où plusieurs interfaces réseau sont
          présentes, cela fait référence au périphérique eth0 (le périphérique dont le numéro
          de périphérique est 0).
       </td>
    </tr>
              
    <tr>
       <td>
                        <code class="code">network/interfaces/macs/<code class="replaceable">mac</code>/ipv4-associations/<code class="replaceable">public-ip</code></code>
       </td>
       <td>Les adresses IPv4 privées qui sont associées à chaque adresse IP publique et assignées
          à cette interface.
       </td>
    </tr>
              
    <tr>
       <td>
                        <code class="code">network/interfaces/macs/<code class="replaceable">mac</code>/local-hostname</code>
       </td>
       <td>Le nom d'hôte local de l'interface.</td>
    </tr>
              
    <tr>
       <td>
                        <code class="code">network/interfaces/macs/<code class="replaceable">mac</code>/local-ipv4s</code>
       </td>
       <td>Les adresses IPv4 privées associées à l'interface.</td>
    </tr>
              

              
    <tr>
       <td>
                        <code class="code">network/interfaces/macs/<code class="replaceable">mac</code>/public-hostname</code>
       </td>
       <td>Le DNS public de l'interface (IPv4). Cette catégorie n'est retournée que si l'attribut
          <code class="code">enableDnsHostnames</code> est défini comme <code class="code">true</code>.
       </td>
    </tr>
              
    <tr>
       <td>
                        <code class="code">placement/availability-zone</code>
       </td>
       <td>La zone de disponibilité dans laquelle l'instance a été lancée.</td>
    </tr>
              
    <tr>
       <td>
                        <code class="code">placement/region</code>
       </td>
       <td>Région AWS dans laquelle l'instance est lancée.</td>
    </tr>
              
    <tr>
       <td>
                        <code class="code">public-hostname</code>
       </td>
       <td>Le DNS public de l'instance. Cette catégorie n'est retournée que si l'attribut <code class="code">enableDnsHostnames</code> est défini comme <code class="code">true</code>.
       </td>
    </tr>
              
    <tr>
       <td>
                        <code class="code">public-ipv4</code>
       </td>
       <td>L'adresse IPv4 publique. Si une adresse IP Elastic est associée à l'instance, la valeur
          retournée est l'adresse IP Elastic.
       </td>
    </tr>
              
    <tr>
       <td>
                        <code class="code">security-groups</code>
       </td>
       <td>
          <p>Les noms des groupes de sécurité appliqués à l'instance.</p>
          <p>Après le lancement, vous pouvez modifier les groupes de sécurité des instances. De
             tels changements apparaissent ici et dans réseau/interfaces/macs/<em><code class="replaceable">mac</code></em>/groupes-sécurité.
          </p>
       </td>
    </tr>
            
  </tbody>
</table>

<hr class="hr-text" data-content="SDK">

## AWS SDKs

Un AWS SDK (Software Development Kit) sert à interagir avec AWS au sein même d'une application. Il existe donc de nombreux AWS SDKs en fonction des différents langages de programmation (Python, Java, C++, JavaScript, Ruby, PHP,...):

- Le AWS CLI est lui même codé à partir du AWS SDK Python (appelé aussi Boto3).
- Certains services AWS ne sont accessibles que par un AWS SDK : DynamoDB, Lambda Function,...

A noter que si vous n'avez pas configurer de Region par défaut, les AWS SDKs interagissent avec la Region `us-east-1` par défaut.

<hr class="hr-text" data-content="Limits">

## AWS Limits and Backoff

### Limits / Quotas

Il existe des Limits ou Quotas dans AWS dont il faut avoir connaissance :

- **API Rate Limits** : suivant les APIs AWS, on ne peut faire plus d'un certain nombre d'appels par seconde à une API
- **Service Quotas** (ou **Service Limits**) : selon les Services AWS, on ne peut pas consommer plus d'un certain nombre de Services AWS (ex. 1152 vCPU par compte AWS)

### Exponential Backoff

Lorsque vous obtenez des erreurs du type **ThrottlingException** lors de vos appels à des Services AWS, vous devez utiliser l'**Exponential Backoff**.

C'est un mécanisme de relance avec une durée entre chaque tentative qui augmente exponentiellement. Il est décrit plus précisément dans cet article [https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/){:target="_blank" rel="noopener noreferrer nofollow"}


- Les AWS SDKs l'implémentent déjà, donc, il n'y a rien à faire
- Mais si vous faites des appels aux APIs AWS par un autre moyen, vous **DEVEZ** mettre en place un tel mécanisme :
  * En cas de ThrottlingException ou d'erreurs 5xx
  * Pas en cas d'erreurs 4xx


