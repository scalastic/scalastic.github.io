---
layout: post
title: "Black Basta : Les Tactiques et Techniques de Hackers Redoutables"
date: 2025-02-25 11:30:00 +0100
description: "Découvrez les tactiques de Black Basta, l’un des ransomwares les plus redoutés. Méthodes, attaques et conseils pour s’en protéger efficacement !"
img: black-basta-ransomware-tactics.jpg
fig-caption: Photo générée avec Le Chat de Mistral AI
tags: ["Black Basta", "Ransomware", "Cyberattack", "Cybersecurity", "Hacking Techniques"]
lang: fr
permalink: /black-basta-ransomware-tactics/
status: finished
---

Les cyberattaques par ransomware représentent aujourd’hui une menace persistante pour les entreprises et les institutions. Parmi les groupes les plus actifs, **Black Basta** s’est distingué par sa capacité à compromettre de très nombreuses infrastructures dans le monde entier, en exploitant des techniques avancées d’intrusion et de déploiement de logiciels malveillants. Comprendre leurs méthodes d'action permet de renforcer la cybersécurité et d’anticiper les stratégies futures des cybercriminels.

Dans cette optique, l’outil [BlackBastaGPT](http://www.hudsonrock.com/blackbastagpt){:target="_blank" rel="noopener noreferrer nofollow"} a été développé pour analyser les communications internes entre les membres de Black Basta qui ont été dévoilées lors d'une fuite de 200.000 messages, allant de Septembre 2023 à Septembre 2024. En exploitant ces **milliers de messages**, cet outil permet d’identifier avec précision les **tactiques, techniques et procédures (TTPs)** employées. L’objectif est d’apporter une meilleure compréhension de leur fonctionnement, de mettre en évidence les modes opératoires privilégiés et de proposer des mesures de protection adaptées aux menaces émergentes.  

Cet article explore en détail les différentes approches utilisées par Black Basta, depuis l’infiltration initiale des réseaux jusqu’au déploiement du ransomware, en passant par les stratégies de persistance et d’évasion des défenses. En s’appuyant sur les données issues de BlackBastaGPT, il devient possible de décrypter les tendances des hackers et de vérifier si votre entreprise est une cible potentielle, en identifiant les vulnérabilités exploitées et les stratégies privilégiées par les cybercriminels.


<hr class="hr-text" data-content="Sommaire">

* TOC
{:toc}


<hr class="hr-text" data-content="Pénétration">

## 1. *Initial Access* : Comment Black Basta pénètre les systèmes ?

L’infiltration initiale constitue une étape clé pour Black Basta, qui cherche à établir un premier point d’accès dans le réseau cible. Pour ce faire, le groupe s’appuie sur plusieurs méthodes visant à contourner les mécanismes de sécurité et à obtenir des accès privilégiés. L’analyse des échanges internes de leurs membres met en évidence trois principales approches :  

### Exploitation des accès RDP et VPN compromis
L’un des vecteurs d’attaque les plus courants repose sur l’utilisation d’identifiants volés pour accéder à des systèmes via des services exposés, notamment **Remote Desktop Protocol (RDP)** et les **réseaux privés virtuels (VPN)**. Ces identifiants peuvent être récupérés de différentes manières :  
- Achat sur des places de marché clandestines où sont vendues des bases de données contenant des informations d’authentification compromises.  
- Utilisation de **credential stuffing**, une technique qui consiste à tester des combinaisons d’identifiants issus de précédentes fuites de données sur différents services.  
- Exploitation de mots de passe faibles ou non modifiés, facilitant l’accès aux comptes administrateurs ou utilisateurs.  

Une fois un accès valide obtenu, Black Basta procède généralement à une reconnaissance initiale du réseau afin d’identifier les machines critiques et d’évaluer le périmètre d’attaque.  

### Ingénierie sociale et attaques vocales (vishing)
Le groupe recourt également à des techniques d’ingénierie sociale pour obtenir des accès légitimes. Parmi celles-ci, l’**attaque par vishing** (phishing vocal) est fréquemment mentionnée dans leurs communications. Elle consiste à contacter les employés d’une entreprise ciblée en se faisant passer pour un service informatique ou un fournisseur de support technique. L’objectif est d’obtenir des identifiants d’accès ou d’inciter la victime à exécuter une action spécifique, comme l’installation d’un logiciel malveillant ou la modification de ses paramètres de connexion.  

Cette approche s’appuie sur des informations préalablement collectées via des sources publiques ou des bases de données compromises, permettant aux attaquants d’adopter un discours crédible et personnalisé.  

### Ciblage des infrastructures critiques vulnérables  

Les infrastructures virtualisées et les services d'accès distant représentent une cible privilégiée pour **Black Basta**, notamment les serveurs **VMware ESXi**. L’exploitation de vulnérabilités sur ces hôtes permet aux attaquants d’accéder rapidement à plusieurs machines virtuelles sans nécessiter d’intrusion individuelle sur chaque système.  

En plus d’ESXi, **Black Basta** cible activement d’autres logiciels et infrastructures critiques :  

- **Jenkins** : Des adresses IP associées à **Jenkins** sont collectées, suggérant une volonté d’exploiter des vulnérabilités ou d’accéder à des pipelines d’intégration continue.  
- **Citrix** : Des mentions de bots liés à **Citrix** et des accès à des portails **VPN Citrix** indiquent une exploitation potentielle de ces infrastructures.  
- **Windows RDP et Remote Desktop Services (RDS)** : L’accès à distance via **RDP** est également une cible, avec des identifiants et des accès partagés sur des portails d’administration.  
- **SSH et systèmes basés sur Linux** : L’utilisation de **commandes SSH** et la présence d’identifiants liés à des environnements Linux laissent penser à une compromission de serveurs en ligne.  
- **Serveurs web et infrastructures diverses** : Plusieurs discussions font référence à des **IP et ports associés à des services web**, suggérant des tentatives d’exploitation ou de prise de contrôle de ces systèmes.  

Certaines discussions internes révèlent que **Black Basta** surveille activement la publication de correctifs de sécurité et cible les infrastructures qui n’ont pas appliqué les mises à jour critiques. Cette approche leur permet de tirer parti de failles connues avant que les administrateurs système ne les corrigent, maximisant ainsi leurs chances de compromission. 

> info "Mesures défensives recommandées" 
>
> - **Renforcer l’authentification des accès sensibles** :
>   - Activer l’authentification multi-facteurs (MFA) sur les connexions RDP, VPN Citrix et SSH afin de limiter les risques d’utilisation d’identifiants volés.
>   - Restreindre l’accès RDP et SSH aux seules adresses IP autorisées, et privilégier des solutions alternatives comme un bastion sécurisé.
>   - Restreindre l’accès aux interfaces de gestion Jenkins et ESXi en limitant les IP autorisées et en exigeant une authentification forte.
>
> - **Améliorer la surveillance des activités suspectes** :
>   - Mettre en place des **journaux d’audit** pour détecter toute tentative d’accès non autorisée ou toute activité inhabituelle.  
>   - Configurer des **alertes de connexion** pour signaler les connexions en provenance de localisations inhabituelles.  
>
> - **Sécuriser les environnements virtualisés et cloud** :
>   - Appliquer systématiquement les correctifs de sécurité sur les hôtes ESXi, Jenkins et Citrix, et surveiller l’apparition de nouvelles vulnérabilités.
>   - Restreindre les accès aux consoles d’administration des hyperviseurs (ESXi), services Jenkins et VPN Citrix en utilisant des mécanismes d’authentification renforcés et des contrôles d’accès stricts.
>   - Vérifier régulièrement la configuration des accès SSH et s’assurer qu’aucune clé d’accès non autorisée n’est active. 

En combinant ces mesures, il est possible de limiter considérablement les opportunités d’intrusion et de détecter plus rapidement toute tentative d’accès malveillant.


<hr class="hr-text" data-content="Execution">

## 2. *Execution* : Le déploiement des logiciels malveillants

Une fois un accès établi au sein du réseau cible, Black Basta procède au déploiement de logiciels malveillants afin de prendre le contrôle des systèmes et préparer l’activation du ransomware. Cette phase repose sur des mécanismes discrets permettant d’exécuter du code malveillant tout en limitant la détection par les solutions de sécurité.  

### Utilisation de scripts et DLLs malveillants
L’un des moyens privilégiés par le groupe pour exécuter du code est l’emploi de **bibliothèques de liens dynamiques (DLLs) malveillantes**, souvent chargées par des processus légitimes du système. Des commandes telles que :

{% highlight powershell %}
rundll32.exe dll.dll,Enter
{% endhighlight %}

ont été observées dans les communications internes du groupe. L’outil **rundll32.exe**, un exécutable légitime de Windows, permet d’exécuter des fonctions contenues dans des fichiers DLL, rendant cette méthode efficace pour contourner certaines solutions de sécurité.  

En complément, Black Basta exploite d’autres outils natifs de Windows, comme **regsvr32.exe**, qui permet également d’exécuter des DLLs sans que l’exécution ne soit immédiatement perçue comme suspecte par les solutions de défense.  

### Scripts en VBS pour automatiser l’exécution
L’automatisation joue un rôle clé dans le déploiement des logiciels malveillants. Black Basta utilise **des scripts en Visual Basic Script (VBS)** pour exécuter des commandes de manière discrète et éviter les détections basées sur le comportement. Ces scripts permettent notamment de :  
- Télécharger et exécuter des charges utiles complémentaires.  
- Établir des connexions vers des serveurs de commande et contrôle (C2).  
- Modifier les paramètres système pour faciliter la persistance de l’attaque.  

Les scripts VBS sont souvent exécutés en combinaison avec d’autres langages de script natifs comme PowerShell ou Batch, offrant ainsi une flexibilité accrue dans l’orchestration des actions malveillantes.  

> info "Mesures défensives recommandées"
> 
> - **Restreindre l’exécution de scripts non signés** :  
>   - Configurer les stratégies de groupe (GPO) pour empêcher l’exécution de **scripts VBS et PowerShell non signés**.  
>   - Activer **Windows Script Host Restrictions** pour limiter l’usage abusif de VBS.  
>
> - **Blocage des outils d’administration utilisés à distance** :  
>   - Restreindre ou surveiller l’utilisation de **rundll32.exe** et **regsvr32.exe** pour empêcher le chargement de DLLs malveillantes.  
>   - Désactiver l’utilisation de **PowerShell, Windows Management Instrumentation (WMI)** et autres outils d’administration à distance lorsque leur usage n’est pas nécessaire.  
>
> - **Surveillance des comportements suspects** :  
>   - Mettre en place des alertes pour détecter l’exécution inhabituelle de scripts ou de processus liés à des outils administratifs détournés.  
>   - Activer l’enregistrement des événements Windows (Event ID 4688) pour suivre l’exécution de processus suspects.  

En appliquant ces mesures, il est possible de réduire considérablement les opportunités d’exécution des scripts malveillants et de renforcer les dispositifs de sécurité face aux attaques de Black Basta.


<hr class="hr-text" data-content="Persistence">

## 3. *Persistence* : Maintenir l’accès sur le long terme

Après avoir pénétré un réseau, Black Basta cherche à garantir un accès durable à l’infrastructure ciblée. Cette phase de persistance est essentielle pour maximiser l’impact de l’attaque, permettre un contrôle à distance et éviter toute perte d’accès en cas de redémarrage des systèmes ou de mesures défensives prises par l’organisation ciblée. Pour ce faire, le groupe met en place plusieurs mécanismes permettant de maintenir sa présence dans l’environnement compromis.  

### Déploiement de bots et serveurs de contrôle
Une fois les premièrs logiciels malveillants exécutés, Black Basta met en place des **bots** capables de communiquer avec des **serveurs de commande et contrôle (C2)**. Ces serveurs permettent aux attaquants de :  
- Recevoir des mises à jour sur l’état du réseau compromis.  
- Envoyer des instructions aux machines infectées, comme l’exécution de nouveaux logiciels malveillants ou la collecte d’informations sensibles.  
- Déployer des modules supplémentaires en fonction de l’environnement ciblé et des mesures de sécurité détectées.  

Les communications entre les bots et les serveurs C2 sont souvent chiffrées et utilisent des protocoles légitimes pour masquer le trafic malveillant. Dans certains cas, les attaquants adoptent des infrastructures de communication basées sur **Tor** ou des services cloud légitimes afin de compliquer la détection et le blocage des connexions.  

### Accès via des proxys SOCKS pour contourner les restrictions 
Black Basta utilise également des proxys **SOCKS5** pour assurer une connectivité persistante avec les machines compromises. Ces proxys permettent aux attaquants de rediriger leur trafic via des hôtes infectés, rendant plus difficile l’identification de leur véritable origine. Cette méthode leur offre plusieurs avantages :  
- Éviter d’être bloqués par les pare-feux et solutions de détection qui surveillent les connexions sortantes suspectes.  
- Masquer l’activité malveillante en intégrant le trafic aux flux légitimes de l’entreprise.  
- Faciliter l’accès à distance sans recourir à des VPN ou autres méthodes plus facilement détectables.  

L’utilisation de proxys SOCKS est souvent couplée à des outils tels que **ngrok** ou **reverse shells**, permettant aux attaquants d’établir des tunnels sécurisés pour contrôler les machines compromises sans éveiller les soupçons.  

> info "Mesures défensives recommandées"
>
> - **Surveillance et audit des connexions réseau** :  
>   - Identifier et bloquer les connexions sortantes vers des **adresses IP suspectes** ou des domaines connus pour être utilisés par des infrastructures C2.  
>   - Mettre en place une détection des tunnels chiffrés inhabituels, notamment via l’analyse des flux réseau et des modèles de communication anormaux.  
>
> - **Gestion rigoureuse des comptes et des privilèges** :  
>   - Désactiver ou supprimer **les comptes utilisateurs inactifs**, qui pourraient être exploités pour établir un accès persistant.  
>   - Appliquer le principe du **moindre privilège**, en limitant les droits des comptes administrateurs et en surveillant toute élévation de privilèges inhabituelle.  
>
> - **Restriction des outils utilisés pour la persistance** :  
>   - Désactiver ou restreindre l’utilisation de **protocoles et outils d’administration à distance** s’ils ne sont pas nécessaires.  
>   - Mettre en place une journalisation avancée des accès à distance et surveiller toute activité inhabituelle, en particulier sur les connexions RDP et SSH.  

En combinant ces mesures, il est possible de réduire la capacité de Black Basta à maintenir un accès persistant et d’augmenter les chances de détection précoce d’une compromission.


<hr class="hr-text" data-content="Credential Access">

## 4. *Credential Access* : Vol de mots de passe et d’identifiants

L’accès aux identifiants des utilisateurs et des administrateurs est une étape clé pour Black Basta. En compromettant des comptes légitimes, les attaquants peuvent se déplacer plus librement dans le réseau, contourner les mesures de sécurité et exécuter des actions malveillantes avec des privilèges élevés. Plusieurs techniques sont utilisées pour extraire et exploiter ces informations.  

### Dumping de mots de passe et exploitation de services de cracking
Black Basta utilise des outils spécialisés pour extraire les mots de passe stockés en mémoire ou dans les bases de données système. Parmi les techniques couramment observées :
- **Extraction des hachages de mots de passe** via des outils tels que **Mimikatz** ou **LSASS dumping**, qui permettent de récupérer les informations d’authentification en mémoire.
- **Accès aux bases SAM et NTDS** sur les contrôleurs de domaine, contenant les identifiants des utilisateurs d’un réseau Windows.
- **Utilisation de services de cracking** pour forcer les hachages obtenus et retrouver les mots de passe en clair, notamment en s’appuyant sur des bases de données de mots de passe compromis.  

Une fois ces identifiants récupérés, les attaquants cherchent à **réutiliser des mots de passe** sur plusieurs systèmes, profitant souvent d’un manque de rotation ou d’une politique de mots de passe insuffisamment stricte.  

### Récupération de credentials stockés dans des fichiers et navigateurs
Les attaquants exploitent également les informations d’authentification stockées localement par les utilisateurs. Plusieurs vecteurs sont privilégiés :  
- **Extraction des mots de passe enregistrés dans les navigateurs web**, notamment via des outils permettant d’accéder aux bases de stockage de Chrome, Firefox ou Edge.  
- **Recherche de fichiers contenant des identifiants** (fichiers texte, fichiers de configuration, scripts d’automatisation) laissés sans protection sur des postes de travail ou des partages réseau.  
- **Vol des clés SSH et certificats** stockés sur les machines compromises, facilitant l’accès aux systèmes distants et à des ressources critiques.  

Cette approche permet aux attaquants d’accéder à des services internes et externes avec des identifiants légitimes, limitant ainsi les alertes de sécurité qui pourraient être déclenchées par des connexions suspectes.  

> info "Mesures défensives recommandées"
>
> - **Renforcement de la gestion des mots de passe** :  
>   - Encourager l’utilisation de **gestionnaires de mots de passe sécurisés**, qui permettent de stocker les identifiants de manière chiffrée et d’éviter l’enregistrement des mots de passe dans les navigateurs.  
>   - Appliquer une **politique de renouvellement des mots de passe** pour limiter la réutilisation d’identifiants compromis.  
>
> - **Surveillance et restriction des accès** :  
>   - Mettre en place une **détection des tentatives de connexion suspectes**, notamment les essais répétés d’authentification ou les connexions à des heures inhabituelles.  
>   - Restreindre l’accès aux fichiers contenant des informations sensibles et surveiller leur consultation par des utilisateurs non autorisés.  
>
> - **Protection des identifiants en mémoire et sur les systèmes** :  
>   - Activer **Credential Guard** sur les systèmes Windows pour empêcher l’extraction des identifiants en mémoire.  
>   - Restreindre les permissions sur les bases SAM et NTDS pour limiter l’accès aux hachages de mots de passe.  

En combinant ces mesures, il est possible de limiter l’exploitation des identifiants par Black Basta et de renforcer la sécurité des comptes contre les attaques de compromission.


<hr class="hr-text" data-content="Lateral Movement">

## 5. *Lateral Movement* : Se propager à travers le réseau

Une fois un premier point d’accès établi, Black Basta cherche à étendre sa présence dans l’environnement cible en se déplaçant latéralement vers d’autres systèmes. Cette phase est essentielle pour maximiser l’impact de l’attaque, obtenir des accès à des ressources critiques et préparer le déploiement final du ransomware. Les attaquants utilisent plusieurs techniques pour se propager tout en limitant leur détection.  

### Utilisation des accès RDP internes et des comptes volés
L’un des moyens privilégiés pour se déplacer au sein du réseau consiste à exploiter les **connexions Remote Desktop Protocol (RDP)** en interne. En s’appuyant sur des identifiants volés lors des phases précédentes, Black Basta peut :  
- Se connecter à d’autres machines de l’environnement en utilisant des **comptes administrateurs ou techniques**.  
- Rechercher des systèmes disposant de **privilèges élevés** pour faciliter l’accès aux données et services critiques.  
- Installer des outils malveillants ou configurer des backdoors pour garantir un accès prolongé.  

Cette technique est particulièrement efficace lorsque les comptes administrateurs sont utilisés sur plusieurs machines sans segmentation adéquate. Une fois en possession de ces accès, les attaquants peuvent facilement se déplacer d’un hôte à l’autre sans déclencher d’alertes évidentes.  

### Pivotement via des proxys SOCKS pour masquer les connexions
Black Basta met en place des proxys **SOCKS5** pour masquer ses mouvements et faciliter la communication entre différentes machines compromises. Cette approche permet de :  
- **Dissimuler l’origine des connexions** en redirigeant le trafic via des hôtes infectés, ce qui complique la détection des activités malveillantes.  
- **Contourner les restrictions réseau** en exploitant des tunnels chiffrés qui permettent d’outrepasser les contrôles de pare-feu internes.  
- **Accéder à des segments de réseau isolés** en passant par des machines déjà compromises ayant des accès privilégiés.  

L’utilisation de ces proxys est souvent combinée avec des outils d’administration à distance détournés, comme **PsExec, WMI ou SSH**, permettant de lancer des commandes sur d’autres hôtes sans interaction directe visible.  

> info "Mesures défensives recommandées"
>
> - **Segmentation stricte du réseau** :  
>   - Isoler les différents environnements (utilisateurs, serveurs, systèmes critiques) pour empêcher la libre circulation du trafic interne.  
>   - Restreindre les accès RDP et SSH en limitant leur utilisation aux seuls besoins opérationnels.  
>
> - **Limitation des accès administrateurs** :  
>   - Appliquer le **principe du moindre privilège**, en évitant que les comptes administrateurs soient utilisés sur plusieurs machines.  
>   - Désactiver l’utilisation de comptes partagés et mettre en place une **authentification forte** pour les accès sensibles.  
> 
> - **Surveillance des connexions suspectes** :  
>   - Mettre en place des alertes sur les connexions RDP inhabituelles et les tentatives de connexion à distance répétées.  
>   - Identifier et bloquer les proxys SOCKS non autorisés en analysant le trafic réseau et en surveillant les comportements anormaux des machines.  

En appliquant ces mesures, il devient possible de limiter la capacité de déplacement de Black Basta au sein du réseau et de détecter plus rapidement toute tentative de propagation.


<hr class="hr-text" data-content="Data Exfiltration">

## 6. *Data Exfiltration* : Vol et transfert des données sensibles

Les attaques de ransomwares modernes, dont celles menées par **Black Basta**, ne se limitent pas au chiffrement des fichiers. Les attaquants adoptent une approche dite de **double extorsion**, qui consiste à **exfiltrer des données sensibles avant leur chiffrement**. Cette technique leur permet d’exercer une pression supplémentaire sur les victimes en menaçant de divulguer les informations volées si la rançon n’est pas payée.  

### Utilisation de serveurs de fichiers dédiés
Pour centraliser les données volées avant leur transfert hors du réseau cible, Black Basta met en place des **serveurs temporaires** au sein de l’infrastructure compromise. Ces serveurs, souvent installés sur des machines déjà compromises, servent à :  
- **Rassembler les fichiers sensibles** depuis différents systèmes.  
- **Organiser les données en fonction de leur valeur** (informations financières, données personnelles, documents internes).  
- **Préparer leur exfiltration** de manière discrète en utilisant des protocoles couramment autorisés sur le réseau (HTTP, FTP, WebDAV, SMB).  

L’objectif est d’éviter de déclencher des alertes immédiates en transférant directement les données vers l’extérieur. Les attaquants attendent généralement la phase finale de l’attaque pour envoyer l’ensemble des fichiers volés vers leurs propres serveurs distants.  

### Compression et transfert en `.zip` ou `.7z` avant exfiltration
Une fois les données sélectionnées, Black Basta utilise des outils de **compression** pour regrouper les fichiers et masquer leur contenu. L’**utilisation de formats comme `.zip` ou `.7z`** est fréquente, car ils permettent :  
- **De réduire la taille des fichiers** et d’accélérer le transfert.  
- **D’intégrer un chiffrement par mot de passe**, compliquant l’analyse par les solutions de sécurité.  
- **D’éviter la détection basée sur des signatures**, car les fichiers compressés ne sont pas immédiatement lisibles par certains outils de surveillance.  

Les attaquants utilisent ensuite des protocoles variés pour exfiltrer les fichiers :  
- **FTP ou SFTP**, lorsque des serveurs de transfert sont disponibles.  
- **Services cloud publics** (comme Mega, Google Drive ou Dropbox) pour masquer l’exfiltration parmi les flux de trafic légitimes.  
- **Tunnels chiffrés** via des proxys SOCKS ou Tor pour éviter d’être détectés par des pare-feux et des solutions de détection des menaces.  

> info "Mesures défensives recommandées"
>  
> - **Surveillance des transferts volumineux de fichiers** :  
>   - Mettre en place une détection des **mouvements inhabituels de données** entre machines internes et vers l’extérieur.  
>   - Configurer des alertes sur l’**utilisation excessive de la bande passante** ou des connexions à des services de stockage en ligne inhabituels.  
> 
> - **Chiffrement et protection des données sensibles** :  
>   - Appliquer un **chiffrement interne des fichiers critiques**, afin de limiter l’exploitation des données même en cas d’exfiltration.  
>   - Mettre en place des **contrôles d’accès stricts** sur les fichiers sensibles et restreindre les permissions aux utilisateurs légitimes.  
> 
> - **Contrôle des outils de compression et de transfert** :  
>   - Restreindre l’exécution d’outils comme **7-Zip, WinRAR ou PowerShell Compress-Archive** sur les machines où leur usage n’est pas justifié.  
>   - Bloquer ou surveiller les **connexions vers des services de stockage cloud non approuvés**.  

En mettant en œuvre ces mesures, il devient possible d’identifier plus rapidement les tentatives d’exfiltration de données et de réduire l’impact d’une compromission.


<hr class="hr-text" data-content="Impact">

## 7. *Impact* : Chiffrement et perturbation des activités

L’attaque de Black Basta atteint son point culminant avec l’activation du **ransomware**, une étape visant à rendre les données et les systèmes inaccessibles aux victimes. Cette phase marque la concrétisation de l’attaque, rendant toute restauration des services difficile sans une intervention rapide et adaptée.  

### Déploiement de fichiers de chiffrement massifs
Le ransomware de Black Basta est conçu pour chiffrer rapidement les fichiers de l’environnement compromis. Il fonctionne en :  
- **Chiffrant les fichiers sur les postes de travail et les serveurs**, en ciblant en priorité les extensions associées aux documents sensibles, bases de données et fichiers opérationnels.  
- **Employant des algorithmes de chiffrement robustes** (comme AES et RSA) rendant la récupération des fichiers quasiment impossible sans la clé de déchiffrement détenue par les attaquants.  
- **Effaçant les copies de sauvegarde locales**, notamment les **Shadow Copies** sous Windows, afin d’empêcher toute restauration rapide des fichiers affectés.  

Le processus de chiffrement est souvent exécuté à l’aide de scripts automatisés, garantissant une propagation rapide sur l’ensemble du réseau avant que les équipes de sécurité ne puissent réagir efficacement.  

### Blocage des accès aux systèmes critiques
Outre le chiffrement des données, Black Basta cherche également à **désorganiser les opérations de l’organisation cible** en bloquant l’accès aux infrastructures essentielles. Pour cela, les attaquants peuvent :  
- **Désactiver ou modifier les comptes administrateurs** pour empêcher les responsables IT de prendre des mesures correctives immédiates.  
- **Arrêter des services critiques** tels que les bases de données, les applications métiers et les environnements virtualisés afin de perturber le fonctionnement des activités.  
- **Modifier les configurations réseau**, par exemple en **désactivant les pare-feux ou en bloquant les connexions à distance**, rendant difficile toute intervention des équipes techniques.  

Cette approche vise à maximiser la pression sur la victime et à forcer le paiement de la rançon en échange d’une restauration supposée des systèmes.  

> info "Mesures défensives recommandées"
> 
> - **Mise en place d’une stratégie de sauvegarde efficace** :  
>   - Appliquer la **règle 3-2-1** : trois copies des données sur deux supports différents, avec une sauvegarde hors ligne ou immuable.  
>   - Tester régulièrement les procédures de restauration pour garantir une reprise rapide des opérations en cas d’incident.  
> 
> - **Déploiement de solutions de détection et de réponse avancées** :  
>   - Mettre en place un **Endpoint Detection and Response (EDR)** pour surveiller et bloquer les activités suspectes liées au chiffrement de fichiers.  
>   - Utiliser un **Security Information and Event Management (SIEM)** pour analyser les journaux d’événements et détecter les signaux précoces d’une attaque en cours.  
> 
> - **Prévention des modifications non autorisées** :  
>   - Restreindre les permissions d’administration aux seuls comptes strictement nécessaires.  
>   - Activer la protection des **Shadow Copies** et surveiller toute tentative de suppression ou de modification de ces copies.  

En intégrant ces mesures, il est possible de limiter l’impact d’une attaque par ransomware et d’augmenter les chances de récupération des systèmes sans dépendre des attaquants.


<hr class="hr-text" data-content="Stealth">

## 8. *Stealth* : Comment Black Basta contourne la détection ?

Pour maximiser l’efficacité de ses attaques, Black Basta met en place des techniques de furtivité avancées afin de contourner les solutions de sécurité et retarder la détection de ses activités malveillantes. Ces stratégies leur permettent de rester opérationnels plus longtemps dans un environnement compromis et de minimiser les chances d’être stoppés avant d’atteindre leurs objectifs.  

### Tests sur des services anti-virus pour ajuster leurs payloads
Avant de déployer leurs charges malveillantes, les attaquants s’assurent qu’elles ne seront pas immédiatement détectées par les solutions de cybersécurité. Pour cela, Black Basta :  
- **Teste ses fichiers et exécutables** sur des plateformes en ligne d’analyse antivirus afin d’évaluer leur taux de détection.  
- **Ajuste ses payloads** en modifiant régulièrement le code, en appliquant des techniques d’obfuscation ou en utilisant des packers pour masquer la véritable nature du fichier.  
- **Exploite des signatures dynamiques**, en générant des versions uniques de leur malware à chaque déploiement, rendant inefficaces les détections basées uniquement sur des signatures statiques.  

Cette approche leur permet de contourner les protections traditionnelles et d’augmenter les chances de réussite de leur attaque.  

### Changement fréquent de domaines et infrastructures
Pour éviter que leurs serveurs de commande et contrôle (C2) ne soient bloqués, Black Basta met en place un mécanisme de **rotation rapide de leurs infrastructures**. Ce procédé repose sur plusieurs actions :  
- **Enregistrement de nouveaux domaines à intervalles réguliers**, souvent avec des noms générés automatiquement pour éviter la reconnaissance par les équipes de cybersécurité.  
- **Utilisation de services de proxy et de réseaux anonymisés**, tels que **Tor** ou des services de redirection, afin de masquer l’emplacement réel des serveurs.  
- **Déploiement de serveurs temporaires**, qui ne restent actifs que pendant une courte période avant d’être abandonnés et remplacés par d’autres.  

En renouvelant continuellement ses infrastructures, Black Basta rend plus difficile le blocage de ses communications malveillantes et empêche une neutralisation efficace de son réseau d’attaque.  

> info "Mesures défensives recommandées" 
>
> - **Déploiement de Threat Intelligence** :  
>   - Intégrer des **flux de renseignement sur les menaces (Threat Intelligence Feeds)** pour surveiller les indicateurs de compromission (IoCs) en temps réel.  
>   - Analyser les comportements des nouvelles menaces afin d’adapter rapidement les règles de détection.  
> 
> - **Blocage proactif des domaines malveillants** :  
>   - Mettre en place une solution de **filtrage DNS** pour bloquer automatiquement les domaines associés aux infrastructures d’attaque connues.  
>   - Surveiller les connexions sortantes suspectes et bloquer celles qui tentent d’accéder à des destinations non répertoriées comme légitimes.  
> 
> - **Renforcement des stratégies de détection comportementale** :  
>   - Compléter la détection basée sur les signatures par des solutions **EDR/XDR** capables d’identifier des comportements suspects, même si les fichiers malveillants sont obfusqués.  
>   - Surveiller les variations anormales de trafic réseau pouvant indiquer des communications avec des serveurs C2.  

En combinant ces mesures, il est possible de réduire l’efficacité des stratégies d’évasion de Black Basta et d’améliorer la capacité de détection des attaques en amont.

<hr class="hr-text" data-content="Conclusion">

## 9. Conclusion

### Une menace persistante, mais des défenses possibles

L’analyse des tactiques et techniques de **Black Basta** met en évidence la sophistication croissante des groupes de cybercriminels et leur capacité à s’adapter aux mesures de défense mises en place par les entreprises et les institutions. Grâce à l’étude de leurs communications internes, il est possible de **mieux comprendre leur mode opératoire** et d’anticiper leurs attaques.  

Cependant, la lutte contre ces menaces repose sur un équilibre fragile. **L’automatisation de la cybercriminalité, l’émergence de services "Ransomware-as-a-Service" (RaaS) et l’amélioration continue des méthodes d’intrusion** exigent des réponses toujours plus réactives et adaptées. **La veille constante, l’adoption de solutions de détection avancées et une approche proactive en cybersécurité** sont aujourd’hui des éléments essentiels pour limiter l’impact des attaques.  

L’outil **BlackBastaGPT**, en analysant les échanges entre cybercriminels, offre aux chercheurs et aux analystes un moyen supplémentaire d’identifier les tendances émergentes et de renforcer les stratégies de défense. Mais la question demeure : ces efforts suffisent-ils à inverser la dynamique face à des attaquants qui bénéficient d’un écosystème bien structuré et difficile à perturber ?  

### Un combat perdu d’avance ?

L’exemple du **casse de cryptomonnaies chez Bybit**, avec **1,4 milliard de dollars en Ethereum dérobés**, illustre la complexité du défi. Malgré des investissements massifs en sécurité et l’utilisation des technologies les plus avancées, la plateforme a été ciblée et compromise. Ce cas soulève des questions plus larges sur l’efficacité des stratégies actuelles de protection et sur la capacité des organisations à résister à des attaques de plus en plus sophistiquées.  

### Perspectives et Défis de la Cybersécurité

L’évolution des menaces comme **Black Basta** révèle une asymétrie croissante entre attaquants et défenseurs. Alors que les cybercriminels exploitent l’**automatisation**, les **Ransomware-as-a-Service (RaaS)** et des **économies parallèles structurées**, les entreprises peinent à bloquer chaque tentative d’intrusion. Face à cette réalité, **faut-il privilégier la prévention ou investir davantage dans la résilience et la réponse rapide aux incidents ?**  

Le cybercrime prospère grâce à des **paiements anonymes en cryptomonnaies** et un **manque de coopération internationale**, rendant les sanctions inefficaces. L'idée d'un **"OTAN du cyber"** pourrait renforcer la coordination mondiale, mais soulève des enjeux de gouvernance et de cybersurveillance. De même, **l’interdiction du paiement des rançons** pourrait dissuader les attaques, mais mettrait en péril les entreprises incapables de récupérer leurs données.  

La cybersécurité doit évoluer au-delà de la simple protection : **peut-on réellement inverser la dynamique actuelle, ou devons-nous nous adapter à un monde où les cyberattaques sont devenues une menace permanente ?**


<hr class="hr-text" data-content="Bonus"> 

## 🎭 Les anecdotes insolites de Black Basta

### 🏴‍☠️ Le serveur ESXi qui accepte tous les mots de passe 
Dans une discussion, un membre mentionne avoir trouvé un serveur **ESXi** tellement mal sécurisé qu'il acceptait **n'importe quel mot de passe**. Ils en ont plaisanté en testant des mots comme **"hahaha"** et **"mommy1"** avant de confirmer qu'ils pouvaient y accéder sans aucune contrainte.  

### 💻 Le pirate en galère avec Jenkins
À un moment, un attaquant exprime son **exaspération** face à **Jenkins**, suggérant qu'il est trop complexe à exploiter et qu’il faudrait “trouver un autre moyen”. Comme quoi, même les cybercriminels ont des **journées difficiles** !  

### 📞 Des faux appels IT pour tromper les entreprises
Une discussion aborde l'idée de **passer des appels en se faisant passer pour le support IT** afin de récupérer des accès. Ils envisagent même de mettre en place un **call center dédié** aux escroqueries téléphoniques.  

### 🔄 La galère du téléchargement de fichiers
À plusieurs reprises, des membres de Black Basta se plaignent des **problèmes de téléchargement de fichiers volés** en raison de restrictions ou de limitations de leur propre infrastructure. Ironiquement, même les hackers doivent faire face à des soucis de réseau.  

### 🤯 Quand un membre de Black Basta pète les plombs
Un message montre qu’un des membres, visiblement **frustré**, finit par lâcher un **"все нах"**, qui peut se traduire par un **"j'en ai marre, tout ça c’est n’importe quoi"**. Un bel exemple de **burnout chez les cybercriminels**.

### 💸 Quand un pirate galère avec les rançons
Un des membres se plaint qu’il n’arrive pas à récupérer une rançon, son interface d’administration affichant une **"User claim error"**. Difficile de rançonner quand le logiciel refuse de fonctionner !  

### 📁 Le fichier qui ne veut pas se décrypter
Un pirate essaie de décrypter un fichier mais il rencontre une erreur étrange : **"il n'y a pas de magic à la fin du fichier"**. L’un de ses collègues suggère qu’il s’est peut-être **trompé de format**… ou qu’il a raté quelque chose d’essentiel.  

### 🏴‍☠️ L'attaque qui se retourne contre son auteur
Lors d’une discussion sur un **serveur Citrix piraté**, un hacker se rend compte qu’il a lui-même été **victime d’un vol de compte** à cause d’une erreur de sécurité. Il en rigole à moitié, mais cela montre que même les cybercriminels ne sont pas à l’abri.  

### 🤦 La rage du hacker face à Windows
Un membre se plaint que **son exploit ne fonctionne pas sur Windows** et qu'il reçoit une "pluie d’erreurs". Un autre répond ironiquement : **"C’est normal, c’est Windows, ça ne marche jamais comme prévu"**.

Ces petites anecdotes montrent que, malgré leur dangerosité, les membres de **Black Basta** ne sont pas **à l’abri des frustrations techniques et des imprévus**.


<hr class="hr-text" data-content="Ressources">

## Ressources & Références

- **BlackBastaGPT** de Hudson Rock : [BlackBastaGPT](http://www.hudsonrock.com/blackbastagpt){:target="_blank" rel="noopener noreferrer nofollow"}

- **MITRE ATT&CK Framework**, le répertoire des tactiques et techniques des attaquants : [https://attack.mitre.org/](https://attack.mitre.org/){:target="_blank" rel="noopener noreferrer nofollow"}

- Rapports sur Black Basta et Études de cas récents : 
  - **#StopRansomware: Black Basta**, du CISA, _Conseils de cybersécurité sur le ransomware Black Basta_ : [https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-131a](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-131a){:target="_blank" rel="noopener noreferrer nofollow"}

  - **Threat Assessment: Black Basta Ransomware**, de Unit 42, _Analyse détaillée des opérations de Black Basta_ : [https://unit42.paloaltonetworks.com/threat-assessment-black-basta-ransomware/](https://unit42.paloaltonetworks.com/threat-assessment-black-basta-ransomware/){:target="_blank" rel="noopener noreferrer nofollow"}

  - **Examining the Black Basta Ransomware's Infection Routine**, de Trend Micro, _Étude approfondie de la routine d'infection de Black Basta_ : [https://www.trendmicro.com/en_us/research/22/e/examining-the-black-basta-ransomwares-infection-routine.html](https://www.trendmicro.com/en_us/research/22/e/examining-the-black-basta-ransomwares-infection-routine.html){:target="_blank" rel="noopener noreferrer nofollow"}

- Solutions EDR/XDR – Outils de protection avancée :
  - **EDR vs. XDR: What Is the Difference?**, de Microsoft Security, _Comparaison des solutions EDR et XDR_ : [https://www.microsoft.com/en-gb/security/business/security-101/edr-vs-xdr](https://www.microsoft.com/en-gb/security/business/security-101/edr-vs-xdr){:target="_blank" rel="noopener noreferrer nofollow"}

  - **What is EDR vs. XDR?**, de Palo Alto Networks, _Explication des différences entre EDR et XDR_ : [https://www.paloaltonetworks.com/cyberpedia/what-is-edr-vs-xdr](https://www.paloaltonetworks.com/cyberpedia/what-is-edr-vs-xdr){:target="_blank" rel="noopener noreferrer nofollow"}

  - **EDR vs. XDR: What is the Difference and Will XDR Replace EDR?** de BlueVoyant, _Analyse des distinctions entre EDR et XDR et perspectives d'évolution_ : [https://www.bluevoyant.com/knowledge-center/edr-vs-xdr](https://www.bluevoyant.com/knowledge-center/edr-vs-xdr){:target="_blank" rel="noopener noreferrer nofollow"}

Ces ressources offrent des informations détaillées pour approfondir votre compréhension des menaces actuelles et des solutions de sécurité avancées.
