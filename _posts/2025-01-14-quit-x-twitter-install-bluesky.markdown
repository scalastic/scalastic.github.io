---
layout: post
title: "Trop, c’est Trop ? Quittez X, Passez à BlueSky"
date: 2025-01-18 23:28:00 +0100
description: "Marre de la toxicité sur X ? Découvrez BlueSky, une alternative éthique et décentralisée. Hébergez votre propre réseau social avec BlueSky PDS !"
img: quit-x-twitter-install-bluesky.jpg
fig-caption: "Quittez X pour un réseau social sain et éthique : découvrez BlueSky PDS."
tags: ["HelloQuitteX", "Bluesky", "X", "Twitter", "Tutorial", "Personal Data Server", "We'reNotSheep", "EnoughIsEnough"]
lang: fr
permalink: /quit-x-twitter-install-bluesky/
status: finished
seo_title: "Trop, c’est Trop ? Quittez X pour BlueSky : Hébergez Votre Propre Réseau Social"
seo_description: "Marre de X ? Découvrez BlueSky, une alternative éthique et décentralisée. Apprenez à installer BlueSky PDS pour créer votre propre réseau social."
---


Depuis l’acquisition de **_Twitter_** par Elon Musk en octobre 2022, rebaptisé **_X_**, la plateforme a connu des changements structurels et stratégiques profonds. Parmi eux, une réduction drastique des effectifs, touchant notamment les équipes responsables de la modération des contenus et de la sécurité. Ce désengagement en matière de supervision a favorisé une augmentation notable de contenus problématiques, sans doute mis en avant par de nouveaux algorithmes, incluant des discours haineux, de la désinformation et des théories complotistes. La situation s’est exacerbée lors de la campagne de Donald Trump à la présidence des États-Unis en novembre 2024. Musk, qui a publiquement soutenu Trump en investissant 118 millions de dollars dans sa campagne, est devenu la figure de proue des thèses d’extrême droite et de la désinformation. En conséquence, de nombreuses personnalités, médias et institutions ont décidé de quitter la plateforme, dénonçant une amplification de contenus et un environnement devenus incompatibles avec leurs valeurs.

> info "Meta (Facebook, Instagram, WhatsApp et Threads)"
> Le PDG de **_Meta_**, Mark Zuckerberg, a lui aussi annoncé la fin du programme de vérification des faits aux États-Unis, _fact-checking_, le remplaçant par un système de **_notes communautaires_** similaire à celui de X. Parallèlement, Zuckerberg a exprimé son souhait de réintroduire davantage « d’_énergie masculine_ » dans le milieu professionnel, critiquant les politiques de diversité et d’inclusion qu’il juge excessives. Ces initiatives semblent aligner Meta sur les positions de l'administration de Donald Trump, favorisant un rapprochement avec le gouvernement en place.

### Les alternatives: Bluesky et Mastodon

- **Bluesky** : Initiée en 2019 par Jack Dorsey, cofondateur de Twitter, Bluesky est devenue une entreprise indépendante en 2021. Elle repose sur le protocole AT Protocol, visant à créer un réseau social décentralisé tout en offrant une expérience utilisateur unifiée. Contrairement à Mastodon, Bluesky propose une interface plus centralisée avec des plans pour une fédération future. Cette approche a séduit un grand nombre d’utilisateurs : la plateforme a gagné plus de 5 millions d’inscriptions en seulement cinq jours après l’élection de Trump, atteignant 27,6 millions d’utilisateurs en janvier 2025.
- **Mastodon** : Lancé en 2016 par Eugen Rochko, Mastodon est une plateforme de microblogging décentralisée. Elle fonctionne sur le protocole ActivityPub, permettant à chaque utilisateur de rejoindre ou de créer des "instances" (serveurs) indépendantes avec leurs propres règles et modérations. Cette structure favorise des communautés spécifiques et une autonomie accrue des utilisateurs.

### Une tendance collective amplifiée

Le hashtag `#HelloQuitX`, et ses variants comme `#HelloQuitteX` en France, après l’élection de Trump, symbolise un appel collectif à abandonner X. Ce mouvement, soutenu par des universitaires, des associations et des figures publiques, a donné lieu à des campagnes de sensibilisation, encourageant les utilisateurs à migrer vers des réseaux sociaux plus éthiques.

Une tendance claire semble émerger : de nombreux utilisateurs quittant X se dirigent vers Bluesky, une plateforme qui rappele l'expérience utilisateur de Twitter avant ses récentes transformations. Bluesky bénéficie également de son positionnement stratégique en tant qu'alternative décentralisée, grâce à son adoption du protocole AT, tout en conservant une structure centralisée temporaire pour simplifier l'expérience des nouveaux arrivants. Ce compromis attire particulièrement les utilisateurs réfractaires à la complexité perçue de Mastodon et à la nouvelle politique de Meta. De plus, Bluesky parvient à séduire grâce à une modération plus rigoureuse et une communauté en plein essor, qui valorise les échanges respectueux et inclusifs.


<hr class="hr-text" data-content="Sommaire">

* TOC
{:toc}

<hr class="hr-text" data-content="Bluesky PDS">

## Bluesky PDS : Une solution technique pour les experts  

Bluesky se distingue par son approche novatrice de la décentralisation, reposant sur son **protocole AT (Authenticated Transfer)**. Au cœur de cette architecture se trouve le **Bluesky PDS** (Personal Data Server), qui offre aux utilisateurs avancés la possibilité de contrôler directement leurs données et leur présence en ligne.  

### Qu’est-ce que Bluesky PDS ?  
Le Bluesky PDS est une solution conçue pour héberger et gérer vos données de manière indépendante tout en interagissant avec le réseau Bluesky. Plutôt que de s’appuyer sur une instance centralisée, comme c’est le cas pour la plupart des réseaux sociaux, Bluesky PDS permet aux utilisateurs techniques et aux organisations de :  

- **Contrôler leurs données personnelles** : En hébergeant un serveur PDS, les utilisateurs restent maîtres de leurs contenus et métadonnées, réduisant leur dépendance à une plateforme unique.  
- **Personnaliser leur expérience** : Les administrateurs de PDS peuvent adapter les paramètres de modération, les algorithmes de diffusion et les politiques d’interaction en fonction de leurs besoins spécifiques.  
- **Fédérer avec d’autres instances** : En intégrant le protocole AT, chaque PDS peut interagir librement avec d'autres serveurs, créant un écosystème décentralisé mais interopérable.  

### Pour qui est destiné Bluesky PDS ?  
Bluesky PDS s’adresse principalement aux **experts techniques**, tels que les développeurs, les administrateurs système et les organisations souhaitant conserver un contrôle total sur leurs données et interactions en ligne. La configuration d’un PDS nécessite des compétences techniques pour le déploiement, l’hébergement et la maintenance.  

> info "Une alternative plus simple pour les utilisateurs classiques" 
> Pour les utilisateurs qui ne souhaitent pas s'engager dans la gestion technique d’un PDS, la solution la plus simple consiste à créer un compte directement sur la plateforme officielle de Bluesky via [https://bsky.app/](https://bsky.app/){:target="_blank" rel="noopener noreferrer nofollow"}. Cette option offre une expérience utilisateur intuitive et clé en main, idéale pour explorer le réseau sans effort supplémentaire.  

Pour les utilisateurs avancés ou les professionnels techniques qui souhaitent approfondir l’utilisation de Bluesky et contribuer activement à l’écosystème décentralisé, nous allons explorer, dans cet article, les étapes nécessaires pour installer et configurer un PDS Bluesky sur votre propre infrastructure.

<hr class="hr-text" data-content="Installation">

## Guide d'Installation Pas-à-Pas de Bluesky PDS

Voici un guide étape par étape pour installer Bluesky PDS sur votre serveur. Il se base sur le dépôt officiel de Bluesky PDS :

{% github_card bluesky-social/pds %}


### Prérequis

Pour installer et configurer Bluesky PDS, vous aurez besoin des éléments suivants :  

- Un serveur disposant d'une **adresse IPv4 publique** ou d'un **nom DNS public**, accessible depuis Internet.  
- L'accès à l'administration du serveur avec des privilèges **root** ou **sudo**.  
- Un nom de domaine valide que vous contrôlez, configuré pour pointer vers votre serveur.  
- Des compétences de base en **administration système** et en utilisation de la **ligne de commande**.  

> info "Ressources matérielles recommandées"
> | -------------------------- | ------------ |  
> | **Système d'exploitation** | Ubuntu 20.04/22.04 ou Debian 11/12. |  
> | **Mémoire (RAM)**          | 1 Go         |  
> | **Cœurs CPU**              | 1            |  
> | **Stockage**               | 20 Go SSD    |  
> | **Architectures**          | amd64, arm64 |  
> | **Nombre d'utilisateurs**  | 1-20         |  

Cette configuration minimale est suffisante pour héberger une petite instance de Bluesky PDS destinée à un usage personnel ou à une petite communauté.

<hr class="hr-text" data-content="">

### Étape 1 : Configuration du DNS

- Pointez votre nom de domaine vers l'adresse IP de votre serveur en configurant les enregistrements DNS appropriés chez votre fournisseur de domaine.
- Exemple
   - Imaginons que j'ai un domaine `example.com` qui gère plusieurs applications. Je vais créer un sous-domaine `pds.example.com` pour gérer mon PDS Bluesky.
   - Pour cela, je vais créer les enregistrements DNS suivants qui pointent sur l'IP de mon serveur PDS Bluesky, autre exemple, `12.34.56.78` :

| Name                | Type | Value         | TTL |
| ------------------- | ---- | ------------- | --- |
| `pds.example.com`   | `A`  | `12.34.56.78` | 600 |
| `*.pds.example.com` | `A`  | `12.34.56.78` | 600 |

<hr class="hr-text" data-content="">

### Étape 2 : Préparation du serveur

   - Connectez-vous à votre serveur via SSH :

{% highlight bash %}
ssh <utilisateur>@<adresse_ip_du_serveur>
{% endhighlight %}

   - Mettez à jour les paquets existants :

{% highlight bash %}
sudo apt update && sudo apt upgrade -y
{% endhighlight %}

<hr class="hr-text" data-content="">

### Étape 3 : Téléchargez le script d'installation

Pour téléchager le script d'installation de Bluesky PDS, entrez ces commandes sur votre serveur via SSH.  
Vous pouvez utiliser soit `wget`, soit `curl` pour récupérer le script d'installation depuis le dépôt officiel de Bluesky.  

   * Avec `wget` :  
{% highlight bash %}
wget https://raw.githubusercontent.com/bluesky-social/pds/main/installer.sh
{% endhighlight %}

   * Ou avec `curl` :  
{% highlight bash %}
curl https://raw.githubusercontent.com/bluesky-social/pds/main/installer.sh >installer.sh
{% endhighlight %}

<hr class="hr-text" data-content="">

### Étape 4 : Exécutez le script d'installation

Une fois le script téléchargé, exécutez-le en tant qu'administrateur avec la commande suivante : 

{% highlight bash %}
sudo bash installer.sh
{% endhighlight %}

> info ""
> Ce script se chargera d’installer toutes les dépendances nécessaires et de configurer automatiquement les services requis pour faire fonctionner votre instance de Bluesky PDS:
> - Installation de **Docker** et Docker Compose.
> - Téléchargement des **images** Docker de Bluesky PDS (3 images).
> - Démarrage des **conteneurs** Docker.
> - Configuration de services **systemd** pour un démarrage à chaque reboot du serveur.
> - Configuration d'un **certificat TLS** _Let's Encrypt_ et de son renouvellement automatique par le serveur web [Caddy](https://github.com/caddyserver/caddy){:target="_blank" rel="noopener noreferrer nofollow"}.

Pour cela, il va nous demander certaines informations lors de son exécution :
1. `Enter your public DNS address:`
   - En suivant notre exemple, il faudra entrer `pds.example.com`. Bien sûr, il faudra l'adapter à votre propre nom de domaine.
2. `Enter an admin email adress:`
   - Indiquez une adresse email valide car elle sera utilisée par Let's Encrypt pour gérer votre certificat TLS (il peut provenir de n'importe quel domaine : gmail.com, proton.me,...).
3. `Create a PDS user account? (y/N):`
   - Répondez `N`: nous effectuerons cette action plus tard. 

Vous devriez voir s'afficher dans les logs :

{% highlight output %}
/pds.service.
* Downloading pdsadmin
===============================================================================
PDS installation successful!
-------------------------------------------------------------------------------

Check service status        : sudo systemctl status pds 
Watch service logs          : sudo docker logs -f pds
Backup service data         : /pds
PDS admin command           : pdsadmin
{% endhighlight %}

<hr class="hr-text" data-content="">

### Étape 5 : Vérification de l'installation

Une fois l'installation de Bluesky PDS terminée, il est important de vérifier que votre serveur est en ligne et fonctionne correctement. Voici les étapes pour confirmer que votre installation est opérationnelle :

#### 5.1. Vérification des images Docker

Visualisez les images Docker qui ont été téléchargées en exécutant la commande :

{% highlight bash %}
sudo docker ps
{% endhighlight %}

Ce qui devrait vous renvoyer quelque chose similaire à :

{% highlight plaintext %}
CONTAINER ID   IMAGE                            COMMAND                  CREATED        STATUS                  PORTS     NAMES
36924479e72e   caddy:2                          "caddy run --config …"   23 hours ago   Up 23 hours                       caddy
a13a320572eb   ghcr.io/bluesky-social/pds:0.4   "dumb-init -- node -…"   23 hours ago   Up 23 hours                       pds
67b03b48e7ea   containrrr/watchtower:latest     "/watchtower"            23 hours ago   Up 23 hours (healthy)             watchtower
{% endhighlight %}

#### 5.2. Vérification des logs du serveur

Pour diagnostiquer d'éventuels problèmes ou confirmer le bon fonctionnement, vous pouvez visualiser les logs Docker de votre serveur PDS avec :

{% highlight bash %}
sudo docker logs -f pds
{% endhighlight %}

Avec en sortie, des logs semblables à :

{% highlight plaintext %}
{"level":30,"time":1737107986429,"pid":7,"hostname":"PDS","name":"pds","req":{"id":372,"method":"GET","url":"/xrpc/chat.bsky.convo.getLog","query":{},"params":{},"headers":{"user-agent":"Mozilla/5.0","accept":"*/*","accept-encoding":"gzip, deflate","accept-language":"fr-FR","dnt":"1","origin":"https://bsky.app"}},"res":{"statusCode":200,"headers":{"cache-control":"private","content-length":"36","content-type":"application/json; charset=utf-8"}},"responseTime":2771,"msg":"request completed"}
{"level":30,"time":1737110436039,"pid":7,"hostname":"PDS","name":"pds","req":{"id":381,"method":"GET","url":"/","query":{},"params":{},"headers":{"user-agent":"Mozilla/5.0","accept":"*/*","accept-encoding":"gzip"}},"res":{"statusCode":200,"headers":{"cache-control":"private","content-length":"126","content-type":"text/plain; charset=utf-8"}},"responseTime":2,"msg":"request completed"}
{% endhighlight %}

#### 5.3. Vérification du démarrage du service PDS

{% highlight bash %}
sudo systemctl status pds
{% endhighlight %}

Ce qui revoit :

{% highlight plaintext %}
● pds.service - Bluesky PDS Service
     Loaded: loaded (/etc/systemd/system/pds.service; enabled; preset: enabled)
     Active: active (exited) since Thu 2025-01-16 11:58:41 UTC; 24h ago
       Docs: https://github.com/bluesky-social/pds
    Process: 138062 ExecStart=/usr/bin/docker compose --file /pds/compose.yaml up --detach (code=exited, status=0/SUCCESS)
   Main PID: 138062 (code=exited, status=0/SUCCESS)
        CPU: 173ms

Jan 16 11:58:34 PDS docker[138074]:  Container caddy  Creating
Jan 16 11:58:34 PDS docker[138074]:  Container watchtower  Created
Jan 16 11:58:36 PDS docker[138074]:  Container caddy  Created
Jan 16 11:58:36 PDS docker[138074]:  Container pds  Starting
Jan 16 11:58:36 PDS docker[138074]:  Container watchtower  Starting
Jan 16 11:58:38 PDS docker[138074]:  Container watchtower  Started
Jan 16 11:58:39 PDS docker[138074]:  Container pds  Started
Jan 16 11:58:39 PDS docker[138074]:  Container caddy  Starting
Jan 16 11:58:41 PDS docker[138074]:  Container caddy  Started
Jan 16 11:58:41 PDS systemd[1]: Finished pds.service - Bluesky PDS Service.
{% endhighlight %}

<hr class="hr-text" data-content="">

### Étape 6 : Vérification de la Connexion

#### 6.1. Ouverture des ports HTTP et HTTPS

Si vous ne l'avez déjà fait, assurez-vous que les ports `80/tcp` (HTTP) et `443/tcp` (HTTPS) sont ouverts pour permettre l'accès depuis Internet.
Vous pouvez configurer ces autorisations via votre pare-feu ou votre fournisseur de cloud.

#### 6.2. Vérification de la sonde du serveur

Vous pouvez tester la disponibilité et la santé de votre serveur en accédant au **point de contrôle de santé** (healthcheck endpoint). 

- Ouvrez un navigateur web et visitez l'URL suivante (en l'adaptant à votre nom de domaine) :
{% highlight bash %}
https://<pds.example.com>/xrpc/_health
{% endhighlight %}

- Si tout fonctionne correctement, vous devriez voir une réponse JSON contenant la version du serveur, par exemple :
{% highlight json %}
  {"version":"0.4.74"}
{% endhighlight %}

#### 6.3. Vérification des WebSockets (optionnel)

Pour que le réseau Bluesky puisse synchroniser et récupérer les contenus de votre PDS, les WebSockets doivent également être fonctionnels. Voici comment les tester :

- Installez un outil de test WebSocket, comme [wsdump](https://github.com/nrxr/wsdump){:target="_blank" rel="noopener noreferrer nofollow"}. 
- Testez la connectivité WebSocket en exécutant la commande suivante :
{% highlight bash %}
   wsdump "wss://<pds.example.com>/xrpc/com.atproto.sync.subscribeRepos?cursor=0"
{% endhighlight %}

- Si les WebSockets sont configurés correctement mais qu'aucun contenu n'a encore été créé dans votre PDS, la commande continuera de s'exécuter sans afficher de sortie. Cela indique que le système est prêt mais n’a pas encore de contenu à transmettre.

<hr class="hr-text" data-content="">

### Étape 7 : Création d’un Compte Utilisateur

Pour configurer un compte utilisateur sur votre serveur PDS, suivez ces étapes via SSH :  

- **Lancez la commande suivante :**  
{% highlight bash %}
sudo pdsadmin account create
{% endhighlight %} 

- **Renseignez les informations demandées au prompt :**

   - `Enter an email address (e.g. alice@pds.example.com):`: Entrez une adresse e-mail valide qui servira pour la récupération de votre mot de passe. Vous pouvez utiliser n’importe quel domaine d’adresse (par exemple : `gmail.com`, `proton.me`).  
   - `Enter a handle (e.g. alice.pds.example.com):`: Saisissez un nom d’utilisateur complet qui sera lié à un sous-domaine de votre PDS. Ce handle doit se terminer par le domaine de votre serveur PDS, comme dans cet exemple : `.pds.example.com`.  

- **Confirmation de création :**  
   Si tout est correctement configuré, vous obtiendrez un retour similaire à ceci :  
{% highlight plaintext %}
Enter an email address (e.g. alice@pds.example.com): jeanjerome@my-email.com
Enter a handle (e.g. alice.pds.example.com): jeanjerome.pds.example.com

Account created successfully!
-----------------------------
Handle   : jeanjerome.pds.example.com
DID      : did:plc:livr8wtor8vyxsa4w064e4fs
Password : xuNPXGl8d86Lmky750r2EozC
-----------------------------
Save this password, it will not be displayed again.
{% endhighlight %}  

> warning "Important"  
> **Sauvegardez votre mot de passe immédiatement**, car il ne sera pas affiché à nouveau après la création du compte.  

> info "En cas d’erreur"
> Si une erreur de type `ERROR: Reserved handle` s’affiche, cela indique que le `handle` choisi contient un mot-clé réservé, bloqué pour éviter des conflits ou des abus. Vous pouvez consulter la liste complète des mots-clés réservés dans le fichier source du **AT Protocol** suivant : [reserved.ts](https://github.com/bluesky-social/atproto/blob/main/packages/pds/src/handle/reserved.ts){:target="_blank" rel="noopener noreferrer nofollow"}.

<hr class="hr-text" data-content="">

### Étape 8 : Configuration de l’Envoi de Mail

Pour permettre à votre PDS d’envoyer des e-mails (par exemple, pour vérifier les adresses e-mail des utilisateurs ou envoyer d’autres notifications), vous devez configurer un serveur SMTP.

#### 8.1. Choisissez un service d’envoi d’e-mails
Vous pouvez utiliser un service d’envoi d’e-mails fiable, tel que [Resend](https://resend.com/) ou [SendGrid](https://sendgrid.com/). Ces services permettent une configuration simple et offrent une API clé en main.

1. **Créez un compte** sur l’un de ces services.
2. **Générez une clé API**, qui sera utilisée pour authentifier les envois depuis votre PDS.

#### 8.2. Configurez votre PDS pour utiliser SMTP

Modifiez le fichier de configuration situé dans `/pds/pds.env` pour y ajouter les informations suivantes (exemple avec Resend) :

{% highlight plaintext %}
PDS_EMAIL_SMTP_URL=smtps://resend:<votre clé API>@smtp.resend.com:465/
PDS_EMAIL_FROM_ADDRESS=jeanjerome@my-email.com
{% endhighlight %}

- **PDS_EMAIL_SMTP_URL** : L’URL SMTP du service d’envoi d’e-mails, avec votre clé API incluse.
- **PDS_EMAIL_FROM_ADDRESS** : L’adresse e-mail utilisée comme expéditeur pour les e-mails envoyés par votre PDS.

#### 8.3. Assurez l’accès réseau
Vérifiez que votre serveur autorise les connexions sortantes sur les ports nécessaires au service SMTP (généralement le port **465** pour une connexion sécurisée).

#### 8.4. Redémarrez votre PDS
Après avoir mis à jour la configuration, vous devez redémarrer votre PDS pour que les modifications soient prises en compte :
 
{% highlight bash %}
sudo systemctl restart pds
{% endhighlight %}


<hr class="hr-text" data-content="Call of Duty">

## Responsabilités en Tant qu’Administrateur

En tant qu’administrateur d’un serveur PDS, il est de votre devoir de maintenir votre système à jour, de surveiller son bon fonctionnement et de garantir la sécurité de votre infrastructure. Voici les actions importantes à effectuer régulièrement.

### 1. Maintenir votre PDS à jour
Bluesky propose régulièrement des mises à jour pour corriger des bugs, améliorer les performances et renforcer la sécurité. Ces mises à jour sont indispensables pour assurer le bon fonctionnement de votre serveur.

- **Mettez à jour votre PDS avec l’outil `pdsadmin` :**
{% highlight bash %}
sudo pdsadmin update
{% endhighlight %}

### 2. Maintenir le système d’exploitation à jour
Il est important de tenir à jour le système d’exploitation de votre serveur pour bénéficier des dernières améliorations et éviter les failles de sécurité.

- **Appliquez les mises à jour système avec cette commande :**
{% highlight bash %}
sudo apt update && sudo apt upgrade -y
{% endhighlight %}

### 3. Surveiller et gérer les performances
Pour détecter d’éventuels problèmes, surveillez régulièrement les logs et l’état de votre serveur.

- **Affichez les logs du service PDS avec systemd :**
{% highlight bash %}
sudo journalctl -u pds
{% endhighlight %}

- **Affichez les logs de l'application PDS :**
{% highlight bash %}
sudo docker logs -f pds
{% endhighlight %}

### 4. Garantir la sécurité du serveur
- **Effectuez des sauvegardes régulières** des données importantes et des fichiers de configuration qui se trouvent sous `/pds/`.
- **Limitez les accès au serveur** en configurant un pare-feu et en utilisant des connexions sécurisées (SSH) :
  - Installez `ufw` et `fail2ban` 
- **Surveillez les renouvellements des certificats SSL/TLS** pour sécuriser les communications entre les utilisateurs et votre PDS.

### 5. Responsabilités légales
En tant qu’hébergeur, vous êtes responsable du contenu publié via votre serveur. Assurez-vous de respecter les lois locales et internationales, en particulier celles relatives à la protection des données et à la lutte contre les contenus illégaux ou nuisibles.  

<hr class="hr-text" data-content="Conclusion">

## Conclusion

Les réseaux sociaux sont devenus des acteurs centraux de nos interactions numériques, influençant la communication, les opinions et la perception collective de l'information. 
L'essor d'alternatives comme BlueSky, mettant en avant l'éthique et la décentralisation, offre des solutions concrètes aux problématiques de toxicité et de concentration 
des pouvoirs numériques.

Cependant, ces initiatives posent de nouvelles questions :
- Comment garantir un usage responsable de ces réseaux, notamment lorsqu'ils sont décentralisés ?
- Où s’arrête la liberté d’expression, et comment la concilier avec la lutte contre la désinformation et les discours haineux ?
- Quelles régulations doivent être mises en place pour encadrer ces nouveaux réseaux tout en respectant les droits fondamentaux ?
- Comment répartir les responsabilités entre utilisateurs, administrateurs et créateurs de ces plateformes ?
- Quels modèles économiques peuvent soutenir ces plateformes tout en respectant leurs valeurs éthiques ?
- Comment garantir le respect de la vie privée et le contrôle des données des utilisateurs ?

Explorer ces enjeux nous pousse à repenser notre usage des réseaux sociaux et à imaginer un écosystème numérique plus équilibré, respectueux des utilisateurs, capable de défendre 
les valeurs démocratiques aujourd’hui mises à mal par des régimes autocratiques et des entrepreneurs opportunistes.
