---
layout: post
title: "Transformez Votre Serveur Nginx en Forteresse avec Fail2ban et UFW"
date: 2023-12-23 18:34:00 +0100
description: "Guide ultime pour sécuriser votre serveur Nginx sur Ubuntu avec Fail2ban et UFW. Astuces pratiques pour une défense infaillible."
img: ufw-fail2ban-nginx.jpg
fig-caption: Illustration de <a href="#">DALL•E</a> en rapport avec <a href="https://www.fortnite.com/">Fortnite</a>
tags: [UFW, Fail2ban, Nginx, Security, DevSecOps]
lang: fr
permalink: /ufw-fail2ban-nginx/
status: finished
---

Dans l'univers numérique d'aujourd'hui, la sécurité des serveurs web n'est pas seulement une option, mais une nécessité 
absolue. À l'ère où les cyberattaques se multiplient et évoluent constamment, protéger efficacement son infrastructure 
en ligne est devenu primordial. Cet article se concentre sur la sécurisation d'un serveur web Nginx, une 
plateforme largement utilisée pour sa fiabilité et sa performance.

Nous aborderons deux outils essentiels dans l'arsenal de la sécurité informatique : Fail2ban et UFW (Uncomplicated 
Firewall). Fail2ban est un logiciel de prévention d'intrusion qui protège votre serveur contre les tentatives d'accès 
non autorisées, souvent marquées par de multiples tentatives de connexion échouées. D'autre part, UFW offre une gestion 
simplifiée du pare-feu, permettant de contrôler facilement le trafic entrant et sortant.

Dans cet article, nous allons détailler comment ces outils peuvent être utilisés conjointement pour renforcer la 
sécurité de votre serveur Nginx. Nous explorerons les étapes d'installation et de configuration, vous guidant à travers 
le processus de mise en place de règles de sécurité efficaces.

<hr class="hr-text" data-content="Sommaire">

* TOC
{:toc}

<hr class="hr-text" data-content="Les Outils de Défense">

## Présentation de Fail2ban et UFW

### Fail2ban: Le Garde du Corps Numérique
Fail2ban est un outil indispensable pour la sécurité des serveurs. Son rôle principal est de surveiller les journaux de 
votre serveur à la recherche de signes d'activités malveillantes, particulièrement les tentatives de connexion 
infructueuses répétées. En détectant ces tentatives, souvent des indices d'une attaque par force brute, Fail2ban 
intervient en bannissant temporairement l'adresse IP de l'attaquant, la mettant ainsi en quarantaine pour prévenir de 
futures intrusions.

Ce logiciel fonctionne grâce à des "filtres" définis par l'utilisateur, qui spécifient les conditions sous lesquelles 
une adresse IP doit être bannie. Ces filtres sont associés à des "actions", telles que la modification des règles du 
pare-feu pour bloquer le trafic provenant de l'adresse bannie. L'utilisation de Fail2ban est donc une méthode proactive 
pour protéger votre serveur contre les attaques les plus communes, tout en restant suffisamment flexible pour s'adapter 
à divers scénarios de menaces.

### UFW : Une Approche Simplifiée du Pare-feu
UFW, pour Uncomplicated Firewall, est un pare-feu facile à utiliser pour les systèmes d'exploitation basés sur Linux. 
Comme son nom l'indique, UFW vise à simplifier la gestion du pare-feu, tout en offrant une protection robuste. Il s'agit
d'une interface utilisateur pour iptables, qui est le pare-feu par défaut sous Linux.

Avec UFW, vous pouvez facilement configurer des règles qui déterminent quel trafic est autorisé à entrer ou à sortir de 
votre serveur. Ces règles peuvent être définies en fonction des ports, des protocoles et des adresses IP. UFW permet 
aussi de configurer des règles plus complexes si nécessaire, tout en gardant une interface simple pour les utilisateurs 
moins expérimentés.

### Une Complémentarité Essentielle
La combinaison de Fail2ban et UFW offre une couche de sécurité solide pour votre serveur Nginx. Tandis que Fail2ban se 
focalise sur la prévention des attaques par force brute en bannissant les IP suspectes, UFW gère le trafic global 
entrant et sortant, offrant ainsi une barrière contre un large éventail de menaces. En utilisant ces deux outils 
ensemble, vous créez un environnement serveur non seulement résistant aux attaques les plus courantes mais aussi 
adaptable à des menaces émergentes.

<hr class="hr-text" data-content="Installation">

## Installation et Configuration de Base

Bien que les instructions suivantes soient spécifique à une distribution Linux Ubuntu, les principes et les 
commandes sont largement transposables à d'autres systèmes Linux. Avec de légères adaptations, ces étapes peuvent être 
appliquées à diverses distributions, rendant ainsi ce guide utile pour un large éventail d'utilisateurs Linux.


### Étape 1 : Installation de UFW

- **1. Installer UFW** : Pour installer UFW, lancez :

{% highlight bash %}
sudo apt-get update
sudo apt-get install ufw
{% endhighlight %}

### Étape 2 : Installation de Fail2ban

- **1. Installer Fail2ban** : Exécutez les commandes suivantes pour installer Fail2ban sur votre serveur Ubuntu :

{% highlight bash %}
sudo apt-get update
sudo apt-get install fail2ban
{% endhighlight %}

- **2. Activer le service Fail2ban** : Pour lancer les service et l'activer automatiquement au démarrage du système, 
exécutez les commandes suivantes :

{% highlight bash %}
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
{% endhighlight %}

- **3. Verifier l'installation** : Pour s'assurer que le service est bien démarré et fonctionne correctement, lancez :

{% highlight bash %}
sudo systemctl status fail2ban
{% endhighlight %}

  Vous devriez voir :

{% highlight bash %}
● fail2ban.service - Fail2Ban Service
Loaded: loaded (/lib/systemd/system/fail2ban.service; enabled; vendor preset: enabled)
Active: active (running) since Fri 2023-12-22 00:16:31 CET; 1 day 9h ago
Docs: man:fail2ban(1)
Main PID: 601234 (fail2ban-server)
Tasks: 19 (limit: 11829)
Memory: 39.8M
CPU: 2h 43min 80ms
CGroup: /system.slice/fail2ban.service
└─601234 /usr/bin/python3 /usr/bin/fail2ban-server -xf start

Dec 22 00:16:31 myserver systemd[1]: Started Fail2Ban Service.
Dec 22 00:16:32 myserver fail2ban-server[601234]: Server ready
{% endhighlight %}

### Étape 3 : Comprendre le Fonctionnement de Fail2ban

Avant d'aborder la configuration, il est crucial de comprendre le fonctionnement de Fail2ban. Ce logiciel s'appuie sur
trois composants principaux situés dans différents répertoires : les jails, les filtres et les actions.

- **1. Les Jails** : Ce sont des ensembles de règles définissant quand et comment une adresse IP doit être bannie. Un
  jail se définit par des fichiers de log à surveiller, grâce à des **filtres** (sous la forme de regex), et 
  déclenche des **actions** lorsque des échecs sont détectés (les filtres renvoient un résultat).

  Fail2ban comporte des configurations de jails prédéfinies dans `/etc/fail2ban/jail.conf`.


- **2. Filtres** : Ils servent à analyser les logs des services via des regex pour détecter les comportements suspects, tels que les
  tentatives d'intrusion.
  
  On les trouve dans `/etc/fail2ban/filter.d/`.

- **3. Actions** : Elles peuvent inclure le bannissement d'une adresse IP, l'envoi de notifications, ou
  l'exécution de scripts personnalisés.
   
  Les **actions**, définissant les commandes pour bannir ou débannir une adresse IP, se situent dans
  `/etc/fail2ban/action.d/`.

### Étape 4 : Configuration des Règles de Base de Fail2ban

> info "Attention"
> Il ne faut pas pas modifier directement les fichiers `/etc/fail2ban/fail2ban.conf` et `/etc/fail2ban/jail.conf` : ces 
> fichiers qui contiennent les configurations par défaut de fail2bain, peuvent être réinitialisés lors des mises à jour 
> du système.

- **1. Créer un fichier de configuration dédiée** : Pour cela, ouvrez votre éditeur favori, ici nano, en exécutant la 
commande :

{% highlight bash %}
sudo nano /etc/fail2ban/jail.d/custom.conf
{% endhighlight %}

- **2. Surcharger les configurations de base** : Tous les paramètres et configurations par défaut se trouvent dans le fichier
`/etc/fail2ban/jail.conf`. Voici une liste des paramètres importants à surcharger et à adapter en 
fonction du comportement que vous souhaitez :
    - **bantime**: Définit la durée de bannissement d'une IP (par défaut 10 minutes, recommandé plusieurs heures ou jours).
    - **findtime**: Période jusqu'à laquelle les anomalies sont recherchées dans les logs.
    - **ignoreip**: Liste des IP à ignorer, y compris la vôtre pour éviter un auto-bannissement.
    - **maxretry**: Nombre de tentatives échouées autorisées avant bannissement.

  On définira aussi l'utilisation de UFW pour prendre la main sur les bannissements (`banaction` et `banaction_allports`).

  Voici un exemple de configuration drastique, banissant 1 journée toute première tentative d'intrusion.  On définit aussi
  l'utilisation de UFW, (notez bien les adresses IPs locales que vous devrez peut-être adapter suivant la 
  configuration de votre réseau local) :

{% highlight bash %}
[DEFAULT]
bantime = 1d
findtime = 1d
ignoreip = 127.0.0.1/8 192.168.0.0/16
maxretry = 1

banaction = ufw
banaction_allports = ufw
{% endhighlight %}

- **3. Redémarrer le service Fail2ban** : Pour prendre en compte vos modifications, redémarrez le service Fail2ban en laçant la commande :

{% highlight bash %}
sudo systemctl restart fail2ban
{% endhighlight %}

- **4. Vérifier le status du service** :

{% highlight bash %}
sudo fail2ban-client status
{% endhighlight %}

  Ce qui devrait vous donner :

{% highlight bash %}
$ sudo fail2ban-client status
Status
|- Number of jail:	1
`- Jail list:	sshd
{% endhighlight %}


<hr class="hr-text" data-content="Configuration de UFW">

## Configuration avancée de UFW

Nous allons appliquer le principe du moindre privilège en blocant par défaut toutes les connexions entrantes et 
sortantes, et en n'autorisant que les flux nécessaires pour les services spécifiques. En suivant ce principe, on 
minimise les risques liés à l'accès non autorisé ou à l'exploitation de vulnérabilités, en assurant que seuls les ports 
et les services essentiels soient accessibles.

Voyons comment procéder pour configurer les règles de pare-feu avec UFW :

### Étape 5 : Tout Bloquer et n'ouvrir que le Nécessaire

- **Configuration des règles par défaut** : Bloquez toutes les connexions entrantes et sortantes par défaut :

{% highlight bash %}
sudo ufw default deny incoming
sudo ufw default deny outgoing
{% endhighlight %}

- **Autorisation des connexions nécessaires** : Ouvrez les ports HTTP et HTTPS dans les deux sens, SSH, DNS sortant :

  - Autorisez les connexions entrantes pour le web (HTTP et HTTPS) :

{% highlight bash %}
sudo ufw allow in 80/tcp
sudo ufw allow in 443/tcp
{% endhighlight %}

  - Autorisez les connexions sortantes pour le web :

{% highlight bash %}
sudo ufw allow out 80/tcp
sudo ufw allow out 443/tcp
{% endhighlight %}

  - Autorisez les connexions SSH (pour la gestion à distance) :

{% highlight bash %}
sudo ufw allow in 22/tcp
{% endhighlight %}

  - Autorisez les connexions sortantes DNS (pour la résolution de noms de domaine) :

{% highlight bash %}
sudo ufw allow out 53/udp
{% endhighlight %}

### Étape 6: Activation des Règles

- **Activation du pare-feu UFW** : Activez UFW avec : 

{% highlight bash %}
sudo ufw enable
{% endhighlight %}

- **Vérification des règles configurées** : Revérifiez l'état et les règles du pare-feu avec : 

{% highlight bash %}
sudo ufw status verbose
{% endhighlight %}

### Étape 7: Ajoutez des règles supplémentaires en fonction de vos services

- **Mail** : Autorisez les connexions sortantes SMTP pour l'envoi d'e-mails :

{% highlight bash %}
sudo ufw allow out 25/tcp
{% endhighlight %}

- **Sécurisation supplémentaire (optionnel)** :

  - Limitez les tentatives de connexion SSH pour renforcer la sécurité :

{% highlight bash %}
sudo ufw limit 22/tcp comment 'Autorise 6 connexions sur 30 secondes'
{% endhighlight %}

  - Restreignez l'accès SSH à certaines adresses IP :

{% highlight bash %}
sudo ufw delete allow in 22/tcp
sudo ufw allow from 192.168.0.0 to any port 22
{% endhighlight %}

<hr class="hr-text" data-content="Configuration de Fail2ban">

## Configuration avancée de Fail2ban


### Étape 8 : Lister les filtres préconfigurés sur votre serveur

- **Filtres Nginx** : Listez les filtres existants (peut être différent sur votre serveur) :

{% highlight bash %}
sudo ls -alt /etc/fail2ban/filter.d/nginx*

-rw-r--r-- 1 root root  327 Nov 23  2020 /etc/fail2ban/filter.d/nginx-sslerror.conf
-rw-r--r-- 1 root root  232 Nov 23  2020 /etc/fail2ban/filter.d/nginx-4xx.conf
-rw-r--r-- 1 root root  564 Nov 23  2020 /etc/fail2ban/filter.d/nginx-forbidden.conf
-rw-r--r-- 1 root root  681 Nov 23  2020 /etc/fail2ban/filter.d/nginx-botsearch.conf
-rw-r--r-- 1 root root  485 Nov 23  2020 /etc/fail2ban/filter.d/nginx-http-auth.conf
-rw-r--r-- 1 root root 1454 Nov 23  2020 /etc/fail2ban/filter.d/nginx-limit-req.conf
{% endhighlight %}

- **Créer les filtres** : Créez les filtres qui n'existeraient pas sur votre serveur. Pour cela, entrez les commandes :

  - Pour le filtre `nginx-sslerror.conf` : Ce filtre protège contre les attaques de type SSL handshake failure, où un 
  attaquant tente de négocier une connexion SSL/TLS avec des paramètres incorrects ou malveillants.

{% highlight bash %}
sudo bash -c 'cat > /etc/fail2ban/filter.d/nginx-sslerror.conf <<EOF
[Definition]
failregex = SSL_do_handshake\(\) failed .+ while SSL handshaking, client: <HOST>, server: .+

ignoreregex =

datepattern = {^LN-BEG}%%ExY(?P<_sep>[-/.])%%m(?P=_sep)%%d[T ]%%H:%%M:%%S(?:[.,]%%f)?(?:\s*%%z)?
^[^\[]*\[({DATE})
{^LN-BEG}
EOF'
{% endhighlight %}


  - Pour le filtre `nginx-4xx.conf` : Ce filtre détecte les requêtes générant des erreurs HTTP 4xx (comme 404, 403, 
  400), souvent le résultat de tentatives d'accès à des ressources non autorisées ou inexistantes, indiquant une 
  exploration malveillante.

{% highlight bash %}
sudo bash -c 'cat > /etc/fail2ban/filter.d/nginx-4xx.conf <<EOF
[Definition]
failregex = ^<HOST>.*"(GET|POST).*" (404|444|403|400) .*$

ignoreregex = .*(robots.txt|favicon.ico|jpg|png)
EOF'
{% endhighlight %}


  - Pour le filtre `nginx-forbidden.conf` : Ce filtre cible les tentatives d'accès à des répertoires interdits. Il est 
  utile pour bloquer les scans de répertoires qui tentent de découvrir des fichiers ou des dossiers cachés sur le serveur.

{% highlight bash %}
sudo bash -c 'cat > /etc/fail2ban/filter.d/nginx-forbidden.conf <<EOF
[Definition]
failregex = directory index of .+ is forbidden, client: <HOST>, server: .+
ignoreregex =

EOF'
{% endhighlight %}


  - Pour le filtre `nginx-botsearch.conf` : Ce filtre se concentre sur les requêtes pour des URLs qui n'existent pas 
  (erreurs 404), souvent signe d'un bot ou d'un scanner essayant de trouver des vulnérabilités ou des pages cachées.

{% highlight bash %}
sudo bash -c 'cat > /etc/fail2ban/filter.d/nginx-botsearch.conf <<EOF
# Fail2Ban filter to match web requests for selected URLs that don't exist
#

[INCLUDES]

# Load regexes for filtering
before = botsearch-common.conf

[Definition]

failregex = ^<HOST> \- \S+ \[\] \"(GET|POST|HEAD) \/<block> \S+\" 404 .+$
^ \[error\] \d+#\d+: \*\d+ (\S+ )?\"\S+\" (failed|is not found) \(2\: No such file or directory\), client\: <HOST>\, server\: \S*\, request: \"(GET|POST|HEAD) \/<block> \S+\"\, .*?$

ignoreregex =

datepattern = {^LN-BEG}%%ExY(?P<_sep>[-/.])%%m(?P=_sep)%%d[T ]%%H:%%M:%%S(?:[.,]%%f)?(?:\s*%%z)?
^[^\[]*\[({DATE})
{^LN-BEG}

# DEV Notes:
# Based on apache-botsearch filter
# 
# Author: Frantisek Sumsal
EOF'
{% endhighlight %}


  - Pour le filtre `nginx-http-auth.conf` : Ce filtre est utilisé pour détecter et bloquer les tentatives répétées 
  d'authentification échouée, indiquant une possible attaque par force brute sur les zones protégées par un mot de passe.

{% highlight bash %}
sudo bash -c 'cat > /etc/fail2ban/filter.d/nginx-http-auth.conf <<EOF
# fail2ban filter configuration for nginx


[Definition]


failregex = ^ \[error\] \d+#\d+: \*\d+ user "(?:[^"]+|.*?)":? (?:password mismatch|was not found in "[^\"]*"), client: <HOST>, server: \S*, request: "\S+ \S+ HTTP/\d+\.\d+", host: "\S+"(?:, referrer: "\S+")?\s*$

ignoreregex =

datepattern = {^LN-BEG}

# DEV NOTES:
# Based on samples in https://github.com/fail2ban/fail2ban/pull/43/files
# Extensive search of all nginx auth failures not done yet.
# 
# Author: Daniel Black
EOF'
{% endhighlight %}


  - Pour le filtre `nginx-limit-req.conf` : Ce filtre vise à bloquer les adresses IP qui dépassent les limites de 
  requêtes définies dans Nginx (limit_req), typique d'une attaque par déni de service distribué (DDoS) ou d'un 
  comportement de bot agressif.

{% highlight bash %}
sudo bash -c 'cat > /etc/fail2ban/filter.d/nginx-limit-req.conf <<EOF
# Fail2ban filter configuration for nginx :: limit_req
# used to ban hosts, that were failed through nginx by limit request processing rate
#
# Author: Serg G. Brester (sebres)
#
# To use 'nginx-limit-req' filter you should have `ngx_http_limit_req_module`
# and define `limit_req` and `limit_req_zone` as described in nginx documentation
# http://nginx.org/en/docs/http/ngx_http_limit_req_module.html
#
# Example:
#
#   http {
#     ...
#     limit_req_zone $binary_remote_addr zone=lr_zone:10m rate=1r/s;
#     ...
#     # http, server, or location:
#     location ... {
#       limit_req zone=lr_zone burst=1 nodelay;
#       ...
#     }
#     ...
#   }
#   ...
#

[Definition]

# Specify following expression to define exact zones, if you want to ban IPs limited
# from specified zones only.
# Example:
#
#   ngx_limit_req_zones = lr_zone|lr_zone2
#
ngx_limit_req_zones = [^"]+

# Use following full expression if you should range limit request to specified
# servers, requests, referrers etc. only :
#
# failregex = ^\s*\[[a-z]+\] \d+#\d+: \*\d+ limiting requests, excess: [\d\.]+ by zone "(?:%(ngx_limit_req_zones)s)", client: <HOST>, server: \S*, request: "\S+ \S+ HTTP/\d+\.\d+", host: "\S+"(, referrer: "\S+")?\s*$

# Shortly, much faster and stable version of regexp:
failregex = ^\s*\[[a-z]+\] \d+#\d+: \*\d+ limiting requests, excess: [\d\.]+ by zone "(?:%(ngx_limit_req_zones)s)", client: <HOST>,

ignoreregex =

datepattern = {^LN-BEG}
EOF'
{% endhighlight %}


### Étape 9 : Ajouter les jails à votre configuration

Pour ajouter ces jails à la configuration de Fail2Ban dans le fichier `custom.conf`, suivez ces étapes :

- **Ouvrir le fichier de configuration** : Utilisez la commande  pour ouvrir le fichier dans un éditeur de texte :

{% highlight bash %}
sudo nano /etc/fail2ban/jail.d/custom.conf
{% endhighlight %}

- **Ajouter les configurations des jails** : Copiez et collez les configurations suivantes à la suite du fichier :

{% highlight bash %}
[sshd]
enabled = true

[nginx-4xx]
enabled = true
port     = http,https
filter   = nginx-4xx
logpath  = %(nginx_error_log)s

[nginx-http-auth]
enabled = true
port     = http,https
filter   = nginx-http-auth
logpath  = %(nginx_error_log)s

[nginx-botsearch]
enabled = true
port     = http,https
filter   = nginx-botsearch
logpath  = %(nginx_access_log)s

[nginx-forbidden]
enabled = true
port    = http,https
filter  = nginx-forbidden
logpath = %(nginx_error_log)s

[nginx-sslerror]
enabled = true
port    = http,https
filter  = nginx-sslerror
logpath = %(nginx_error_log)s

[ufw]
enabled = true
filter  = ufw
logpath = /var/log/ufw.log
{% endhighlight %}

- **Enregistrer et fermer le fichier** : Après avoir ajouté les configurations, enregistrez le fichier et fermez l'éditeur de texte.

- **Redémarrer Fail2Ban** : Pour appliquer les modifications, redémarrez Fail2Ban avec :

{% highlight bash %}
sudo systemctl restart fail2ban
{% endhighlight %}

Cette configuration va ajouter et activer les jails spécifiées pour SSH, diverses configurations Nginx, et UFW.


### Étape 10 : Vérification et Test

Après la configuration, il est essentiel de tester et de vérifier que tout fonctionne correctement.
- **Vérification de Fail2ban** : Utilisez cette commande  pour lister les jails actifs et vérifier que Fail2ban fonctionne correctement.

{% highlight bash %}
sudo fail2ban-client status
{% endhighlight %}

 Ce qui me renvoie :

{% highlight bash %}
$ sudo fail2ban-client status

Status
|- Number of jail:	7
`- Jail list:	nginx-4xx, nginx-botsearch, nginx-forbidden, nginx-http-auth, nginx-sslerror, sshd, ufw
{% endhighlight %}

Ces étapes constituent la base de la sécurisation de votre serveur Nginx sous Linux avec Fail2ban et UFW. N'oubliez pas
que la configuration peut être personnalisée en fonction des besoins spécifiques de votre serveur et de votre réseau.

Vous trouverez sur internet de multiples filtres pour Fail2ban adaptés aux services qui sont lancés sur votre serveur.

<hr class="hr-text" data-content="Statistiques">

## Visualisation et Analyse des Bannissements

### Extraction des Données

Pour comprendre et analyser efficacement les actions de sécurité de Fail2Ban, il est utile d'avoir un aperçu des 
adresses IP bannies.

Le script suivant fournit cette visibilité, classée par jail :

{% highlight bash %}
for jail in $(sudo fail2ban-client status | grep 'Jail list:' | sed 's/.*://;s/,//g'); do
echo "Jail: $jail";
sudo fail2ban-client status $jail | grep 'Banned IP';
done
{% endhighlight %}

Voici un exemple de toutes les IPs qui ont été bloquées sur mon serveur : 

{% highlight bash %}
Jail: nginx-4xx
`- Banned IP list:
Jail: nginx-botsearch
`- Banned IP list:	199.229.240.163
Jail: nginx-forbidden
`- Banned IP list:	104.199.31.214 146.190.242.134 152.32.211.69 159.203.88.161...
Jail: nginx-http-auth
`- Banned IP list:
Jail: nginx-sslerror
`- Banned IP list:	107.170.208.31 167.248.133.182 212.102.40.218
Jail: sshd
`- Banned IP list:	101.34.23.155 101.43.39.167 103.144.3.14 103.39.209.130 103...
Jail: ufw
`- Banned IP list:	192.241.233.7 1.12.249.176 1.12.73.13 1.21.202.235 1.34.233...
{% endhighlight %}

J'ai tronqué les IP, il y en avait plus de 2600 pour 24 heures de rétention ! Cet exemple montre qu'un très grand nombre 
d'adresses IP ont été bloquées sur mon serveur, qui ne contient pourtant pas de données hautement sensibles.

L'important volume d'IPs bannies souligne également l'ampleur et la 
constance des attaques automatisées envers les serveurs en ligne. Même des systèmes qui semblent peu intéressants sont 
fréquemment visés par des bots et des cyberattaquants en quête de vulnérabilités, à des fins malveillantes
telles que le spam ou la création de réseaux de bots. Il existe aussi de nombreuses sociétés légitimes qui scannent 
l'internet à la recherche de serveurs corrompus.

### Calcul de Quelques Statistiques

L'analyse des données IP peut révéler des informations significatives sur la distribution géographique, l'appartenance 
organisationnelle et la localisation de ces ~~attaques~~ scans.

Le script Bash ci-dessous permet de calculer des statistiques précises à partir des adresses IP récoltées. Ces 
statistiques comprennent le comptage du nombre d'adresses IP par pays, organisation, et ville. Ce processus aide
à comprendre les tendances des attaques et leur répartition géographique.

{% highlight bash %}
#!/bin/bash

# Remplacez ceci par votre clé API personnelle au service gratuit https://ipinfo.io
API_KEY="votre_clé_api_ici"

# Nom du fichier contenant les adresses IP (une par ligne)
FILE="ip_list.txt"

# Fichiers pour stocker les comptages
COUNTRY_FILE="country_count.txt"
ORG_FILE="org_count.txt"
CITY_FILE="city_count.txt"

# Initialiser les fichiers de comptage s'ils n'existent pas
> "$COUNTRY_FILE"
> "$ORG_FILE"
> "$CITY_FILE"

# Fonction pour obtenir les informations de géolocalisation d'une adresse IP
get_ip_info() {
  local ip=$1
  curl -s "https://ipinfo.io/$ip?token=$API_KEY"
}

# Vérifier si le fichier existe
if [ ! -f "$FILE" ]; then
  echo "Fichier $FILE introuvable."
  exit 1
fi

# Itération sur chaque ligne du fichier
while IFS= read -r ip
do
  echo "Processing ${ip}..."
  ip_info=$(get_ip_info "$ip")
  country=$(echo "$ip_info" | jq -r '.country')
  org=$(echo "$ip_info" | jq -r '.org')
  city=$(echo "$ip_info" | jq -r '.city')

  # Mettre à jour les fichiers de comptage
  echo "$country" >> "$COUNTRY_FILE"
  echo "$org" >> "$ORG_FILE"
  echo "$city" >> "$CITY_FILE"
done < "$FILE"

# Fonction pour compter les occurrences
count_occurrences() {
  sort -bfg | uniq -c
}

# Fonction pour trier les occurrences
sort_occurrences() {
  sort -rn -k1,1
}

# Afficher les statistiques
echo "Statistiques par code pays :"
cat "$COUNTRY_FILE" | count_occurrences | sort_occurrences

echo "Statistiques par organisation :"
cat "$ORG_FILE" | count_occurrences | sort_occurrences

echo "Statistiques par ville :"
cat "$CITY_FILE" | count_occurrences | sort_occurrences
{% endhighlight %}

### Scans par Pays

#### Résultats 

{% highlight bash %}
1055 US
361 CN
252 GB
135 NL
98 DE
71 BR
69 TW
57 KR
53 IN
45 BE
44 RU
43 FR
40 JP
25 VN
24 HK
21 SG
20 IT
19 CA
16 BG
13 TR
13 TH
13 SE
13 ID
13 AU
11 AR
9 PL
7 UA
7 PH
7 LT
7 IR
5 IL
4 MX
4 CL
3 VE
3 RO
3 NG
3 IQ
3 CZ
2 GR
2 ES
2 CO
2 CH
2 BD
2 AT
2 AE
1 ZA
1 SK
1 SA
1 PK
1 PE
1 PA
1 NO
1 MY
1 MG
1 MA
1 LU
1 KZ
1 GU
1 DK
1 CV
1 CR
1 BZ
1 BY
1 BO
1 AZ
{% endhighlight %}

#### Interprétation de Scans Bloqués par Pays

<figure class="article">
  <img src="{{site.baseurl}}/assets/img/ufw-fail2ban-nginx-top-scans-by-country.jpg" alt="Top 20 des pays effectuant le plus grand nombre de scans" />
  <figcaption>Top 20 des pays effectuant le plus grand nombre de scans</figcaption>
</figure>

- **1. Activité de Scanning Elevée aux États-Unis (US)**
  - **Nombre d'occurrences** : 1055
  - **Implication** : Cette forte activité suggère une présence significative de scans, possiblement automatisés, provenant des États-Unis. Cela peut indiquer soit une grande quantité de serveurs et systèmes informatiques actifs, soit la présence de réseaux compromis.

- **2. Présence Notable de la Chine (CN) et du Royaume-Uni (GB)**
  - **Chine** : 361 occurrences
  - **Royaume-Uni** : 252 occurrences
  - **Implication** : Fréquence élevée de scans provenant de ces régions, possiblement indiquant des activités malveillantes ou une forte défense informatique.

- **3. Scans Provenant de l'Europe**
  - **Pays concernés** : Pays-Bas, Allemagne, Belgique, France, Russie
  - **Implication** : Activités de scanning actives ou réseaux souvent ciblés par des attaques, nécessitant une défense proactive.

- **4. Diversité des Sources Asiatiques**
  - **Pays concernés** : Taïwan, Corée du Sud, Inde, Japon, Vietnam
  - **Implication** : Régions actives dans le scanning ou ciblées par des attaques, reflétant les tendances en matière de sécurité informatique en Asie.

- **5. Activité en Amérique Latine et en Afrique**
  - **Amérique Latine** : Brésil, Argentine, Mexique, Colombie
  - **Afrique** : Présence moindre mais notable
  - **Implication** : Tendance à l'automatisation des attaques ou à la présence de systèmes compromis dans ces régions.

- **6. Pays avec Peu d'Occurrences**
  - **Exemples** : Pays africains, pays européens et asiatiques avec un seul ou très peu de comptages
  - **Implication** : Tentatives de scanning sporadiques ou acteurs isolés.

Ces statistiques offrent un aperçu des tendances en matière de sécurité informatique et d'activités malveillantes sur 
Internet. Elles révèlent l'efficacité des mesures de sécurité comme Fail2Ban et UFW dans la protection d'un serveur 
contre les tentatives d'accès non autorisées ou malveillantes.

### Scans par Organisation

#### Résultats

{% highlight bash %}
590 AS396982 Google LLC
384 AS14061 DigitalOcean, LLC
165 AS6939 Hurricane Electric LLC
108 AS4134 CHINANET-BACKBONE
98 AS398324 Censys, Inc.
71 AS37963 Hangzhou Alibaba Advertising Co.,Ltd.
59 AS45090 Shenzhen Tencent Computer Systems Company Limited
54 AS4837 CHINA UNICOM China169 Backbone
47 AS398705 Censys, Inc.
46 AS135377 UCLOUD INFORMATION TECHNOLOGY (HK) LIMITED
36 AS4766 Korea Telecom
35 AS132203 Tencent Building, Kejizhongyi Avenue
34 AS9829 National Internet Backbone
34 AS63949 Akamai Connected Cloud
27 AS16276 OVH SAS
24 AS51396 Pfcloud UG
24 AS211298 INTERNET MEASUREMENT
24 AS202425 IP Volume inc
24 AS198465 BtHoster LTD
21 AS394711 Limenet
17 AS20052 Arbor Networks, Inc.
17 AS10439 CariNet, Inc.
16 AS4713 NTT Communications Corporation
15 AS9009 M247 Europe SRL
15 AS211680 NSEC - Sistemas Informaticos, S.A.
13 AS58466 CHINANET Guangdong province network
12 AS51167 Contabo GmbH
12 AS3462 Data Communication Business Group
12 AS12876 SCALEWAY S.A.S.
10 AS9808 China Mobile Communications Group Co., Ltd.
10 AS36352 ColoCrossing
10 AS13213 UK-2 Limited
9 AS45102 Alibaba (US) Technology Co., Ltd.
8 AS7552 Viettel Group
8 AS50360 Tamatiya EOOD
8 AS36007 Kamatera, Inc.
8 AS34534 Harmony Hosting SARL
7 AS57523 Chang Way Technologies Co. Limited
7 AS21859 Zenlayer Inc
7 AS209605 UAB Host Baltic
7 AS198953 Proton66 OOO
6 AS174 Cogent Communications
6 AS140292 CHINATELECOM Jiangsu province Suzhou 5G network
5 AS49870 Alsycon B.V.
5 AS49581 Ferdinand Zink trading as Tube-Hosting
5 AS4808 China Unicom Beijing Province Network
5 AS3269 Telecom Italia S.p.A.
5 AS210644 AEZA INTERNATIONAL LTD
5 AS204428 SS-Net
5 AS149621 SB Secure Data centers India Private Limited
5 AS10617 SION S.A
4 AS9121 Turk Telekomunikasyon Anonim Sirketi
4 AS8151 UNINET
4 AS7018 AT&T Services, Inc.
4 AS701 Verizon Business
4 AS53667 FranTech Solutions
4 AS23969 TOT Public Company Limited
4 AS208843 Alpha Strike Labs GmbH
4 AS207812 DM AUTO EOOD
4 AS201814 MEVSPACE sp. z o.o.
4 AS20001 Charter Communications Inc
4 AS19318 Interserver, Inc
4 AS140803 HQDATA
3 AS9318 SK Broadband Co Ltd
3 AS8075 Microsoft Corporation
3 AS7303 Telecom Argentina S.A.
3 AS714 Apple Inc.
3 AS58461 CT-HangZhou-IDC
3 AS5607 Sky UK Limited
3 AS4812 China Telecom (Group)
3 AS45899 VNPT Corp
3 AS398101 GoDaddy.com, LLC
3 AS38365 Beijing Baidu Netcom Science and Technology Co., Ltd.
3 AS33491 Comcast Cable Communications, LLC
3 AS3215 Orange S.A.
3 AS2527 Sony Network Communications Inc.
3 AS22552 eSited Solutions
3 AS211607 Securitytrails, LLC
3 AS12389 PJSC Rostelecom
2 AS9506 Singtel Fibre Broadband
2 AS9319 HCN CHUNGBUK CABLE TV SYSTEMS
2 AS8551 Bezeq International Ltd.
2 AS8048 CANTV Servicios, Venezuela
2 AS7545 TPG Telecom Limited
2 AS7418 TELEFÓNICA CHILE S.A.
2 AS62904 Eonix Corporation
2 AS62160 WEB3 Leaders INC
2 AS58212 dataforest GmbH
2 AS4811 China Telecom (Group)
2 AS47154 HUSAM A. H. HIJAZI
2 AS44592 SkyLink Data Center BV
2 AS42237 w1n ltd
2 AS41436 Kamatera Inc
2 AS398791 GoDaddy.com, LLC
2 AS39501 NGSAS NedaGostarSaba
2 AS38283 CHINANET SiChuan Telecom Internet Data Center
2 AS35916 MULTACOM CORPORATION
2 AS33363 Charter Communications, Inc
2 AS33182 HostDime.com, Inc.
2 AS31898 Oracle Corporation
2 AS26599 TELEFÔNICA BRASIL S.A
2 AS2635 Automattic, Inc
2 AS25369 Hydra Communications Ltd
2 AS2514 NTT PC Communications, Inc.
2 AS22773 Cox Communications Inc.
2 AS22501 Cooperativa Telefonica Carlos Tejedor Ltda.
2 AS212815 Dyjix SAS
2 AS209828 Genc BT Bilisim Teknolojileri Limited Sirketi
2 AS209559 XHOST INTERNET SOLUTIONS LP
2 AS208091 XHOST INTERNET SOLUTIONS LP
2 AS20214 Comcast Cable Communications, LLC
2 AS18779 EGIHosting
2 AS17676 SoftBank Corp.
2 AS17511 OPTAGE Inc.
2 AS17421 Mobile Business Group
2 AS16509 Amazon.com, Inc.
2 AS16232 Telecom Italia S.p.A.
2 AS15895 "Kyivstar" PJSC
2 AS150706 Hong Kong Zhengxing Technology Co., Ltd.
2 AS14618 Amazon.com, Inc.
2 AS142002 Scloud Pte Ltd
2 AS135944 VinhNam Commercial informatics service corporation
2 AS135905 VIETNAM POSTS AND TELECOMMUNICATIONS GROUP
2 AS134238 CHINANET Jiangx province IDC network
2 AS12683 PJSC Rostelecom
2 AS1267 WIND TRE S.P.A.
2 AS1257 Tele2 Sverige AB
2 AS12400 Partner Communications Ltd.
2 AS11492 CABLE ONE, INC.
1 AS9976 Namincheon Brodcasting Co., Ltd.
1 AS9845 LG HelloVision Corp.
1 AS9824 JCOM Co., Ltd.
1 AS9697 LG HelloVision Corp.
1 AS9689 SK Broadband Co Ltd
1 AS9595 NTT-ME Corporation
1 AS9316 DACOM-PUBNETPLUS
1 AS9304 HGC Global Communications Limited
1 AS9299 Philippine Long Distance Telephone Company
1 AS9198 JSC Kazakhtelecom
1 AS9050 ORANGE ROMANIA COMMUNICATION S.A
1 AS8612 Tiscali Italia S.P.A.
1 AS8595 OOO WestCall Ltd.
1 AS852 TELUS Communications Inc.
1 AS8473 Bahnhof AB
1 AS8447 A1 Telekom Austria AG
1 AS8374 Polkomtel Sp. z o.o.
1 AS8369 Intersvyaz-2 JSC
1 AS812 Rogers Communications Canada Inc.
1 AS786 Jisc Services Limited
1 AS7713 PT Telekomunikasi Indonesia
1 AS7470 TRUE INTERNET Co.,Ltd.
1 AS7377 University of California, San Diego
1 AS6871 Plusnet
1 AS680 Verein zur Foerderung eines Deutschen Forschungsnetzes e.V.
1 AS6799 Ote SA (Hellenic Telecommunications Organisation)
1 AS64227 CONSOLIDATED TELEPHONE COMPANY
1 AS63961 Bangladesh Research and Education Network (BdREN)
1 AS6327 Shaw Communications Inc.
1 AS61857 SPEEDFAST TELECOM
1 AS6167 Verizon Business
1 AS6147 Telefonica del Peru S.A.A.
1 AS6130 American Internet Services, LLC.
1 AS6128 Cablevision Systems Corp.
1 AS60068 Datacamp Limited
1 AS59477 LIFEPC, s.r.o.
1 AS58541 Qingdao,266000
1 AS58519 Cloud Computing Corporation
1 AS58321 Oxylion S. A.
1 AS58224 Iran Telecommunication Company PJS
1 AS57678 Cat Technologies Co. Limited
1 AS57588 Hayat for Internet & communication LLC
1 AS57044 JSC "ER-Telecom Holding"
1 AS5650 Frontier Communications of America, Inc.
1 AS56478 Hyperoptic Ltd
1 AS56048 China Mobile Communicaitons Corporation
1 AS56047 China Mobile communications corporation
1 AS56046 China Mobile communications corporation
1 AS56042 China Mobile communications corporation
1 AS55720 Gigabit Hosting Sdn Bhd
1 AS55492 Dhaka Fiber Net Limited
1 AS5384 EMIRATES TELECOMMUNICATIONS GROUP COMPANY (ETISALAT GROUP) PJSC
1 AS53153 CINTE Telecom Comercio e Servicos Ltda.
1 AS53006 ALGAR TELECOM S/A
1 AS52936 ISOTELCO LTDA
1 AS52606 BRASILNETS COM. ATAC. DE EQ. INFORMATICA LTDA ME
1 AS52207 JSC "ER-Telecom Holding"
1 AS51852 Private Layer INC
1 AS51570 JSC "ER-Telecom Holding"
1 AS51115 HLL LLC
1 AS5089 Virgin Media Limited
1 AS49893 Bitrace telecom Ltd.
1 AS49202 Kisara LLC
1 AS49100 Pishgaman Toseeh Ertebatat Company (Private Joint Stock)
1 AS48854 team.blue Denmark A/S
1 AS48737 DoraTelekom
1 AS48715 Sefroyek Pardaz Engineering PJSC
1 AS4847 China Networks Inter-Exchange
1 AS48347 JSC Mediasoft ekspert
1 AS4816 China Telecom (Group)
1 AS48090 PPTECHNOLOGY LIMITED
1 AS47890 UNMANAGED LTD
1 AS4788 TM TECHNOLOGY SERVICES SDN. BHD.
1 AS47764 LLC VK
1 AS47583 Hostinger International Limited
1 AS46606 Unified Layer
1 AS4657 StarHub Ltd
1 AS45629 JasTel Network International Gateway
1 AS45458 SBN-ISP/AWN-ISP and SBN-NIX/AWN-NIX
1 AS44724 Octopusnet LTD
1 AS44634 LLC SibSvayzStroy
1 AS43260 DGN TEKNOLOJI A.S.
1 AS42668 Nevalink, LLC
1 AS400328 Intelligence Hosting LLC
1 AS398989 DeepIntent, Inc.
1 AS398722 Censys, Inc.
1 AS3920 ESTOXY OU
1 AS38478 SunnyVision Limited
1 AS38372 RJNET
1 AS38264 National WiMAX/IMS environment
1 AS38096 SK Broadband Co Ltd
1 AS3786 LG DACOM Corporation
1 AS37608 iRENALA
1 AS37517 CV  Multimedia SA
1 AS36925 MEDITELECOM
1 AS36493 FIBERNETICS CORPORATION
1 AS36459 GitHub, Inc.
1 AS3605 Guam Cablevision, LLC.
1 AS35562 Kedr Ltd.
1 AS35125 PJSC Rostelecom
1 AS34984 Superonline Iletisim Hizmetleri A.S.
1 AS34622 Bredband i Kristianstad AB
1 AS33915 Vodafone Libertel B.V.
1 AS33668 Comcast Cable Communications, LLC
1 AS33659 Comcast Cable Communications, LLC
1 AS33588 Charter Communications
1 AS3329 VODAFONE-PANAFON HELLENIC TELECOMMUNICATIONS COMPANY SA
1 AS3303 Swisscom (Schweiz) AG
1 AS3301 Telia Company AB
1 AS328608 Africa on Cloud
1 AS3209 Vodafone GmbH
1 AS31213 PJSC MegaFon
1 AS31133 PJSC MegaFon
1 AS31034 Aruba S.p.A.
1 AS30722 Vodafone Italia S.p.A.
1 AS30036 Mediacom Communications Corp
1 AS29484 Ruhr-Universitaet Bochum
1 AS28573 Claro NXT Telecomunicacoes Ltda
1 AS2856 British Telecommunications PLC
1 AS28294 B S Costa Telecom
1 AS28283 Adylnet Telecom
1 AS28209 Under Servicos de Internet Ltda
1 AS27951 Media Commerce Partners S.A
1 AS27882 Telefónica Celular de Bolivia S.A.
1 AS270719 START NET TELECOM LTDA
1 AS269832 MDS TELECOM C.A.
1 AS269608 VELOSO NET SERV DE COMUNICACAO MULTIDIA EIRELI
1 AS267784 Flyservers S.A.
1 AS266608 Ola Fibra Telecomunicacoes LTDA
1 AS266181 GOLDEN LINK
1 AS263056 INDNET TELECOMUNICACOES LTDA
1 AS26277 ServerPoint.com
1 AS262663 METROFLEX TELECOMUNICACOES LTDA
1 AS262378 Compuservice Empreendimentos Ltda
1 AS262318 Horizons Telecomunicações e Tecnologia S.A.
1 AS2519 ARTERIA Networks Corporation
1 AS2518 BIGLOBE Inc.
1 AS2516 KDDI CORPORATION
1 AS25106 Mobile TeleSystems JLLC
1 AS25019 Saudi Telecom Company JSC
1 AS24961 myLoc managed IT AG
1 AS24700 WEB3 Leaders INC
1 AS24560 Bharti Airtel Ltd., Telemedia Services
1 AS24547 Hebei Mobile Communication Company Limited
1 AS24444 Shandong Mobile Communication Company Limited
1 AS24164 UNION BROADBAND NETWORK
1 AS23724 IDC, China Telecommunications Corporation
1 AS22408 West Ky Networks
1 AS216240 MortalSoft Ltd.
1 AS216167 Skoali SAS
1 AS215862 Taliene De Araujo Souza
1 AS213402 Rahat Telecom LLC
1 AS213149 Telelink Telecommunications Co for Internet services and Information Technology Ltd.
1 AS212913 FOP Hornostay Mykhaylo Ivanovych
1 AS211715 Partlix, Ltd.
1 AS2116 GLOBALCONNECT AS
1 AS211557 TAYNET TEKNOLOJI TICARET LIMITED SIRKETI
1 AS211235 AL-SAHIN AL-SHABALY Co. for Internet Services Ltd
1 AS211056 Amir Hosein Maaref
1 AS210218 Open Fiber S.P.A.
1 AS209711 MUV Bilisim ve Telekomunikasyon Hizmetleri Ltd. Sti.
1 AS209 CenturyLink Communications, LLC
1 AS208258 Access2.IT Group B.V.
1 AS207147 NETCOM GROUP SAS
1 AS206264 Amarutu Technology Ltd
1 AS206216 Advin Services LLC
1 AS206119 Veganet Teknolojileri ve Hizmetleri LTD STI
1 AS20473 The Constant Company, LLC
1 AS202520 SkyPass Solutions Sp. z.o.o.
1 AS202468 Noyan Abr Arvan Co. ( Private Joint Stock)
1 AS201776 Miranda-Media Ltd
1 AS20115 Charter Communications
1 AS19871 Network Solutions, LLC
1 AS197183 Occentus Network SL
1 AS197078 Yarnet Ltd
1 AS19037 AMX Argentina S.A.
1 AS18822 Manquehuenet
1 AS18809 Cable Onda
1 AS18403 FPT Telecom Company
1 AS18144 Energia Communications,Inc.
1 AS18081 Kintetsu Cable Network Co., Ltd.
1 AS18049 Taiwan Infrastructure Network Technologie
1 AS17858 LG POWERCOMM
1 AS17809 VEE TIME CORP.
1 AS17747 SITI NETWORKS LIMITED
1 AS17698 COMMUNITY NETWORK CENTER INCORPORATED.
1 AS17665 ONEOTT INTERTAINMENT LIMITED
1 AS17639 Converge ICT Solutions Inc.
1 AS17488 Hathway IP Over Cable Internet
1 AS17451 BIZNET NETWORKS
1 AS16863 Home Telephone Company, Inc.
1 AS16629 CTC. CORP S.A. (TELEFONICA EMPRESAS)
1 AS16116 Pelephone Communications Ltd.
1 AS15704 XTRA TELECOM S.A.
1 AS15493 "Russian company" LLC
1 AS15169 Google LLC
1 AS151487 Awesomecloud Limited
1 AS149570 Speech Tell Communication Private Limited
1 AS147176 NZ Network Enterprise Co., Ltd.
1 AS142111 Zhejiang Aiyun Network Technology Co Ltd
1 AS141679 China Telecom Beijing Tianjin Hebei Big Data Industry Park Branch
1 AS141480 Haash Media
1 AS141152 BATAAN SPACE CABLE NETWORK INC
1 AS140726 UNICOM AnHui province network
1 AS1403 EBOX
1 AS139752 Multinetwork Cable Television, Inc
1 AS139281 Equinix Korea LLC
1 AS138968 rainbow network limited
1 AS138152 YISU CLOUD LTD
1 AS138025 RBC Cable Master System
1 AS137941 Mabuhay Cable TV Inc
1 AS137718 Beijing Volcano Engine Technology Co., Ltd.
1 AS137443 Anchnet Asia Limited
1 AS136052 PT Cloud Hosting Indonesia
1 AS135161 GMO-Z com NetDesign Holdings Co., Ltd.
1 AS13490 Buckeye Cablevision, Inc.
1 AS13489 EPM Telecomunicaciones S.A. E.S.P.
1 AS134810 China Mobile Group JiLin communications corporation
1 AS134765 CHINANET Yunnan province IDC1 network
1 AS134762 CHINANET Liaoning province Dalian MAN network
1 AS134756 CHINANET Nanjing Jishan IDC network
1 AS134420 Chongqing Telecom
1 AS134143 Professional Data Kinetics Pty Ltd
1 AS133676 Precious netcom pvt ltd
1 AS133159 Mammoth Media Pty Ltd
1 AS132335 LeapSwitch Networks Pvt Ltd
1 AS13188 CONTENT DELIVERY NETWORK LTD
1 AS131414 Long Van Soft Solution JSC
1 AS131353 NhanHoa Software company
1 AS131090 CAT TELECOM Public Company Ltd,CAT
1 AS12897 ENTEGA Medianet GmbH
1 AS12874 Fastweb SpA
1 AS12849 Hot-Net internet services Ltd.
1 AS12735 TurkNet Iletisim Hizmetleri A.S.
1 AS12730 PJSC Rostelecom
1 AS12494 OOO "Post ltd"
1 AS12322 Free SAS
1 AS1221 Telstra Corporation Ltd
1 AS11830 Instituto Costarricense de Electricidad y Telecom.
1 AS11351 Charter Communications Inc
1 AS10796 Charter Communications Inc
1 AS10269 Belize Telemedia Limited
{% endhighlight %}

#### Interprétation des Scans bloqués par Organisation

<figure class="article">
  <img src="{{site.baseurl}}/assets/img/ufw-fail2ban-nginx-top-scans-by-organization.jpg" alt="Top 20 des organisations effectuant le plus grand nombre de scans" />
  <figcaption>Top 20 des organisations effectuant le plus grand nombre de scans</figcaption>
</figure>

- **1. Google LLC (AS396982)**
  - **Nombre d'occurrences** : 590
  - **Implication** : Activité significative provenant des adresses IP associées à Google, indiquant une utilisation potentielle de services Google pour scanner des réseaux ou une utilisation abusive de leur plateforme PaaS GCP.

- **2. DigitalOcean, LLC (AS14061)**
  - **Nombre d'occurrences** : 384
  - **Implication** : Forte activité de scans provenant de cette organisation de cloud, suggérant soit des services légitimes, soit des instances de cloud potentiellement compromises.

- **3. Hurricane Electric LLC (AS6939)**
  - **Nombre d'occurrences** : 165
  - **Implication** : Présence notable de scans issus de ce fournisseur d'accès à Internet, pouvant indiquer des abus de ses services pour des activités de scanning.

- **4. Organisations Chinoises**
  - **Nombre d'occurrences** :
    - CHINANET-BACKBONE (AS4134) : 108
    - Hangzhou Alibaba (AS37963) : 71
    - Tencent (AS45090) : 59
    - CHINA UNICOM (AS4837) : 54
    - D'autres organisations chinoises cumulant des occurrences significatives
  - **Implication** : Activités de scanning émanant de grandes entreprises chinoises, reflétant soit des opérations légitimes, soit des abus de leurs réseaux.

- **5. Censys, Inc. (AS398324, AS398705)**
  - **Nombre d'occurrences** : Total de 145
  - **Implication** : Censys, une société spécialisée dans la sécurité des données, semble engagée dans une activité de scanning, probablement dans un cadre de recherche en sécurité.

- **6. OVH SAS (AS16276) et Autres Hébergeurs**
  - **Implication** : Des scans provenant d'OVH et d'autres hébergeurs peuvent indiquer soit des services légitimes, soit des abus des ressources d'hébergement.

- **7. Diversité des Sources Globales**
  - **Implication** : La présence d'organisations de nombreux pays (par exemple, KR, IN, RU, JP, VN) montre une diversité dans l'origine géographique des scans, ce qui peut refléter un éventail large d'intentions et de pratiques.

- **8. Activités de Scans par des FAI et des Entreprises de Télécommunications**
  - **Exemples** : Korea Telecom (AS4766), NTT Communications (AS4713)
  - **Implication** : Ces FAI et entreprises de télécommunications peuvent être impliqués dans des scans pour des raisons de maintenance, de sécurité, ou d'autres activités légitimes.

Ces statistiques soulignent l'importance d'une surveillance et d'une protection continues contre les activités de scanning 
potentiellement malveillantes. La diversité des sources, allant des fournisseurs de services cloud aux grandes 
entreprises de télécommunications, montre la complexité de l'écosystème de la sécurité en ligne.



### Scans par Ville

#### Résultats

{% highlight bash %}
    314 San Francisco
    218 London
    210 North Charleston
    107 Chicago
    103 Amsterdam
     77 Pleasanton
     75 Frankfurt am Main
     62 Kingsburg
     57 Shenzhen
     55 São Paulo
     50 Shanghai
     48 Taichung
     45 Brussels
     42 Beijing
     38 Council Bluffs
     33 Nanjing
     32 Hangzhou
     25 Hopel
     24 Thetford
     22 Paris
     22 Hong Kong
     21 Singapore
     21 Santa Clara
     20 San Diego
     18 Morris Plains
     18 Los Angeles
     17 Moscow
     17 Ann Arbor
     16 Tokyo
     16 Sofia
     16 North Bergen
     15 Seoul
     14 Shenyang
     14 Palo Alto
     12 Chengdu
     11 Wuhan
     11 Taiyuan
     10 Taipei
     10 Sydney
     10 Stockholm
     10 San Mateo
     10 Ho Chi Minh City
     10 Clifton
     10 Bangkok
      9 Qingdao
      9 Milan
      9 Kunming
      9 Jakarta
      9 Fremont
      9 Chongqing
      8 Saint Petersburg
      8 Roubaix
      8 Changchun
      7 Phoenix
      7 New York City
      7 Lille
      7 Istanbul
      7 Beauharnois
      6 Zhengzhou
      6 Zhangjiakou
      6 Warsaw
      6 Toronto
      6 Dallas
      6 Buffalo
      6 Ashburn
      6 Aachen
      5 Vilnius
      5 Mumbai
      5 Mangalagiri
      5 Harbin
      5 Hanoi
      5 Haarlem
      5 Changsha
      5 Bengaluru
      4 Thiruvananthapuram
      4 Tehran
      4 Santiago
      4 Richardson
      4 Las Vegas
      4 Incheon
      4 Düsseldorf
      4 Berlin
      4 Atlanta
      3 Thoothukudi
      3 Shanxi
      3 Seattle
      3 San Jose
      3 Reston
      3 Prague
      3 Nürnberg
      3 Montréal
      3 Lagos Island
      3 Kollam
      3 Hefei
      3 Gwangju
      3 Guiyang
      3 Guangzhou
      3 General Alvear
      3 Chennai
      3 Caracas
      3 Busan
      3 Banqiao
      3 Baghdad
      2 Zürich
      2 Xining
      2 Vinh
      2 Vienna
      2 Utsunomiya
      2 Timişoara
      2 Tianjin
      2 The Dalles
      2 Suwon
      2 Shijiazhuang
      2 Seongnam-si
      2 Rio de Janeiro
      2 Pyatigorsk
      2 Portsmouth
      2 Philadelphia
      2 Palermo
      2 Olathe
      2 Nanchang
      2 Mito
      2 Miryang
      2 Mar del Plata
      2 Kolkata
      2 Kaunas
      2 Jalandhar
      2 Hunan
      2 Hoàn Kiếm
      2 Hazāribāgh
      2 Gruzino
      2 Göteborg
      2 Fuzhou
      2 Fengshan
      2 Dubai
      2 Doddaballapura
      2 Dhaka
      2 Contai
      2 Coimbatore
      2 Chinch'ŏn
      2 Cheongju-si
      2 Central
      2 Buenos Aires
      2 Ankara
      1 Đồng Hới
      1 Ōtsu
      1 Şişli
      1 Ōbu
      1 Zolotonosha
      1 Zhongxing New Village
      1 Zhenjiang
      1 Zhanjiang
      1 Zapolyarnyy
      1 Yongsan-dong
      1 Yogyakarta
      1 Yingkou
      1 Yilan
      1 Yigo Village
      1 Yesan
      1 Yelets
      1 Yekaterinburg
      1 Yecheon
      1 Yaroslavl
      1 Yangsan
      1 Yangquan
      1 Xi’an
      1 Wrocław
      1 Winter Park
      1 Whittier
      1 Waterloo
      1 Waterford
      1 Wakefield
      1 Waegwan
      1 Volgograd
      1 Vladivostok
      1 Vigia
      1 Veranópolis
      1 Vancouver
      1 Valencia
      1 Una
      1 Ulsan
      1 Uberlândia
      1 T’aebaek
      1 Tyumen
      1 Tula
      1 Tuguegarao
      1 Trelew
      1 Tilburg
      1 Thessaloníki
      1 The Acreage
      1 Thái Nguyên
      1 Tempe
      1 Tefé
      1 Tân An
      1 Takasaki
      1 Tainan
      1 Sylvania
      1 Surat Thani
      1 Stratford-upon-Avon
      1 Strasbourg
      1 Southend-on-Sea
      1 South Riding
      1 Smolensk
      1 Simferopol
      1 Shulin
      1 Shaoxing
      1 Sevastopol
      1 Serpong
      1 Sergiyev Posad
      1 Sejong
      1 Secaucus
      1 Satellite Beach
      1 Sardinal
      1 Sapporo
      1 Santa Monica
      1 Santa Fe
      1 San Pedro
      1 Samut Songkhram
      1 Sainte-Geneviève-des-Bois
      1 Saint-Quentin-en-Yvelines
      1 Ryazan’
      1 Rondonópolis
      1 Rome
      1 Riverside
      1 Rishon LeTsiyyon
      1 Raebareli
      1 Quận Bốn
      1 Puerto Madryn
      1 Provo
      1 Praia
      1 Poznań
      1 Pohang
      1 Petaling Jaya
      1 Pathanāmthitta
      1 Passos
      1 Pasig City
      1 Paripark
      1 Pardīs
      1 Panvel
      1 Panama City
      1 Palm Beach Gardens
      1 Padova
      1 Oslo
      1 Osaka
      1 Okayama
      1 Novosibirsk
      1 Nova Iguaçu
      1 Ningbo
      1 Niagara Falls
      1 New Delhi
      1 Neietsu
      1 Neapoli
      1 Naples
      1 Nanning
      1 Nagoya
      1 Murray
      1 Munich
      1 Motoyoyogichō
      1 Morro
      1 Monterrey
      1 Mokotów
      1 Minsk
      1 Minatitlán
      1 Michelstadt
      1 Miaoli
      1 Melbourne
      1 Massy
      1 Masan
      1 Masaguisi
      1 Marinilla
      1 Manila
      1 Magnitogorsk
      1 Mafra
      1 Mâcon
      1 Machida
      1 Macapá
      1 Luxembourg
      1 Lutsk
      1 Ludhiāna
      1 Liverpool
      1 Linfen
      1 Largo
      1 La Paz
      1 Kōriyama
      1 Kyiv
      1 Kurashiki
      1 Köln
      1 Koesan
      1 Kobe
      1 Kislovodsk
      1 Kimhae
      1 Kharkiv
      1 Kalispell
      1 Jinrongjie
      1 Jinan
      1 Jiaxing
      1 Jerusalem
      1 Jeju City
      1 Isparta
      1 Isfahan
      1 Indianapolis
      1 Imperatriz
      1 Iksan
      1 Ikoma
      1 Ichikawa-minami
      1 Hwawŏn
      1 Huzhou
      1 Huizhou
      1 Hrochoť
      1 Honolulu
      1 Hohhot
      1 Hitachi-Naka
      1 Hisar
      1 Hicksville
      1 Heyuan
      1 Hatsudai
      1 Harston
      1 Hammarslund
      1 Hamburg
      1 Halesowen
      1 Haikou
      1 Haifa
      1 Hadano
      1 Gumi
      1 Guanajuato
      1 Guadalajara
      1 Groningen
      1 Greenford
      1 Goose Creek
      1 Goochland
      1 Gold Coast
      1 Goiânia
      1 Gifu-shi
      1 Giddalūr
      1 Ghāziābād
      1 Genoa
      1 Gangseo-gu
      1 Fukuyama
      1 Fontana
      1 Florence
      1 Feltham
      1 Faisalabad
      1 Essen
      1 Englewood Cliffs
      1 El Pedregal
      1 Ekibastuz
      1 Eilat
      1 Ecoporanga
      1 Douliu
      1 Doral
      1 Derval
      1 Dammam
      1 Daejeon
      1 Da Nang
      1 Curitiba
      1 Cormano
      1 Çorlu
      1 Córdoba
      1 Corcuera
      1 Columbus
      1 Ciudad López Mateos
      1 Cirebon
      1 Cincinnati
      1 Cibinong
      1 Chư Ty
      1 Chiang Mai
      1 Chernihiv
      1 Changde
      1 Chandīgarh
      1 Chandler
      1 Ceres
      1 Castiglione delle Stiviere
      1 Casablanca
      1 Cambridge
      1 Cabanatuan City
      1 Bursa
      1 Burnaby
      1 Bucharest
      1 Bryansk
      1 Brampton
      1 Boydton
      1 Bologna
      1 Bogotá
      1 Bochum
      1 Boardman
      1 Bhopāl
      1 Belford Roxo
      1 Balanga
      1 Baku
      1 Atlantic City
      1 Ashdod
      1 Antananarivo
      1 Anseong
      1 Andong
      1 Anderson
      1 Amritsar
      1 Akashi
      1 Aitkin
      1 Ahvaz
      1 Ahmedabad
      1 Adelaide
      1 Aabenraa
{% endhighlight %}


#### Interprétation des Statistiques de Scans Bloqués par Ville

<figure class="article">
  <img src="{{site.baseurl}}/assets/img/ufw-fail2ban-nginx-top-scans-by-city.jpg" alt="Top 20 des villes effectuant le plus grand nombre de scans" />
  <figcaption>Top 20 des villes effectuant le plus grand nombre de scans</figcaption>
</figure>

- **1. San Francisco (314 Occurrences)**
  - **Implication** : Activité importante provenant de cette ville technologiquement avancée, reflétant probablement l'utilisation de services basés dans la Silicon Valley.

- **2. Londres (218 Occurrences)**
  - **Implication** : Forte activité depuis cette métropole globale, suggérant des opérations de scanning issues d'entreprises basées à Londres ou utilisant des services hébergés là-bas.

- **3. North Charleston (210 Occurrences)**
  - **Implication** : Un nombre surprenant de scans provenant de cette ville, pouvant indiquer la présence d'infrastructures de services en cloud ou d'autres entreprises technologiques.

- **4. Villes Chinoises (Shenzhen, Shanghai, Beijing, etc.)**
  - **Total d'occurrences** : Plus de 150
  - **Implication** : Des scans significatifs émanent de plusieurs grandes villes chinoises, illustrant l'étendue de la présence technologique et numérique en Chine.

- **5. Amsterdam (103 Occurrences)**
  - **Implication** : Avec son infrastructure de services en cloud et data centers, Amsterdam est une source notable de scans.

- **6. Frankfurt am Main (75 Occurrences)**
  - **Implication** : Activité élevée dans cette ville allemande, connue pour ses centres de données et son rôle clé dans les réseaux européens.

- **7. Diversité des Sources Mondiales**
  - **Implication** : La variété des villes (telles que Seoul, Tokyo, Paris, Moscou) indique une distribution mondiale des sources de scans, reflétant la nature globale de l'activité en ligne et des menaces potentielles.

- **8. Activités Spécifiques de Certaines Villes**
  - **Exemples** : São Paulo, Singapore, Santa Clara
  - **Implication** : Ces villes, connues pour leur concentration d'entreprises technologiques, montrent une activité de scans qui peut être attribuée à des recherches légitimes ou à des abus de réseau.

Ces statistiques mettent en évidence la diversité géographique des activités de scanning et soulignent l'importance des 
mesures de sécurité informatique. La présence de scans issus de grandes villes technologiques et financières montre que 
ces régions sont des points chauds pour les activités en ligne, nécessitant une vigilance accrue pour la protection des réseaux.

<hr class="hr-text" data-content="Conclusion">

## Conclusion

La sécurisation de votre serveur Nginx avec Fail2ban et UFW est une démarche cruciale pour protéger vos données et votre
infrastructure contre les cyberattaques toujours plus sophistiquées. Dans cet article, nous avons vu comment Fail2ban et
UFW peuvent être utilisés ensemble pour former une barrière robuste contre les attaques, en combinant la détection et le
bannissement des IP malveillantes avec la gestion rigoureuse du trafic réseau.

La mise en place de ces outils n'est que le début d'un processus continu de sécurisation. Il est essentiel de maintenir 
ces systèmes à jour, d'ajuster régulièrement les configurations en fonction des nouvelles menaces et de surveiller 
constamment les journaux pour détecter les tentatives d'intrusion. Les analyses de données démontrent clairement 
l'importance de ces outils dans la détection et le blocage d'une multitude de tentatives d'accès non autorisées, venant 
de partout dans le monde.

Enfin, gardez à l'esprit que la sécurité est une pratique évolutive. Les menaces changent constamment, et nos méthodes 
de défense doivent s'adapter en conséquence. N'hésitez pas à explorer de nouveaux outils, à partager vos connaissances 
avec la communauté et à rester informé des dernières tendances en matière de cybersécurité.

Restez en sécurité, restez secure !


