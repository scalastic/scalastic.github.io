---
layout: post
title: "Pourquoi Moshi STT pourrait remplacer Whisper (et comment l'installer sur macOS !)"
date: 2025-06-25 20:15:00 +0200
description: "Découvrez Moshi STT de Kyutai, une solution open source de transcription vocale en temps réel, optimisée pour Mac (Apple Silicon) et CUDA, rapide, précise et facile à installer. Guide, retours d’expérience et liens utiles inclus."
img: moshi-stt-vs-whisper.jpg
fig-caption: Photo générée par IA
tags: ["Moshi", "Whisper", "STT", "AI", "macOS"]
lang: fr
permalink: /moshi-stt-vs-whisper/
status: finished
---

Kyutai est un laboratoire de recherche en intelligence artificielle à but non lucratif, fondé en novembre 2023 à Paris grâce au soutien de mécènes tels que Xavier Niel (Iliad), Rodolphe Saadé (CMA CGM) et Eric Schmidt (ex‑PDG de Google). L'équipe initiale, composée de six chercheurs talentueux issus de grandes entreprises américaines comme Meta et Google DeepMind, s’est rapidement étoffée pour compter aujourd’hui une douzaine de membres, incluant des doctorants et des ingénieurs hautement qualifiés. Grâce à un budget de départ estimé à 300 millions d'euros, Kyutai vise à développer et publier des modèles de fondation innovants, tout en favorisant une approche open‑science combinant rigueur académique et moyens industriels.

L'intérêt pour les technologies de Speech‑To‑Text (STT) n’a jamais été aussi fort. Ces systèmes sont désormais essentiels pour transcrire en direct des réunions, sous-titrer des vidéos, améliorer l'accessibilité, piloter des assistants vocaux ou encore automatiser des services clients. En réponse à ces besoins, Kyutai a misé sur un modèle unifié capable de traiter simultanément la reconnaissance, la compréhension et la génération vocale, brisant les silos habituels et réduisant drastiquement la latence .

Cet article se focalise sur la fonction STT de **Moshi**, le modèle de base unifié pour la parole et le texte, développé par Kyutai. Nous allons explorer en détail ce modèle, optimisé pour une exécution performante, tout en conservant une conception accessible et open‑source. Vous découvrirez pourquoi Moshi pourrait représenter une véritable alternative à Whisper d’OpenAI, avant de vous guider pas à pas dans son installation et sa mise en œuvre sur macOS.


<hr class="hr-text" data-content="Sommaire">

* TOC
{:toc}


<hr class="hr-text" data-content="Moshi">

## 1. Découverte de Moshi

### Qu’est-ce que Moshi ?

**Moshi** est un serveur de reconnaissance vocale et de traitement du langage naturel développé par Kyutai. Il repose sur des modèles de nouvelle génération capables de convertir la parole en texte (Speech-To-Text, ou STT), d’analyser le contenu vocal en temps réel, et d’alimenter des systèmes de dialogue interactifs.

#### Historique rapide du projet

Le projet Moshi a vu le jour en 2024, dans la continuité du lancement de Kyutai. La volonté des équipes de Kyutai était de proposer une alternative open-source crédible aux solutions propriétaires, en particulier à Whisper d’OpenAI, qui s’est imposé comme référence mondiale du STT. Dès le début, Moshi a été conçu pour répondre aux défis de la latence, de la précision et de l’accessibilité, tout en s’intégrant facilement dans l’écosystème des applications modernes.

#### Objectifs principaux du serveur Moshi

Le serveur Moshi vise trois objectifs majeurs :

1. **Performance et accessibilité** : Offrir un outil de transcription vocale rapide, précis et utilisable aussi bien en recherche qu’en production, sans barrières d’accès ni coûts cachés.
2. **Ouverture et compatibilité** : Fournir une solution totalement open-source, compatible avec de multiples architectures matérielles, et simple à intégrer dans différents environnements (cloud, edge, local).
3. **Expérience utilisateur avancée** : Permettre le traitement en temps réel de la voix humaine, y compris dans des scénarios interactifs, grâce à un dialogue vocal fluide, bidirectionnel et sans interruption.

#### Principales caractéristiques techniques et avantages par rapport à d’autres solutions

* **Optimisation multiplateforme** : Moshi a été spécialement optimisé pour tirer parti des architectures modernes, notamment Apple Silicon (grâce à Metal), mais aussi les environnements Linux et Windows, offrant ainsi des performances élevées quel que soit le matériel.
* **Modèles vocaux avancés** : Basé sur les dernières avancées en modélisation de flux différés (« Delayed Streams Modeling »), Moshi propose une meilleure gestion de la latence, ce qui se traduit par une transcription plus rapide et plus naturelle qu’avec des modèles traditionnels.
* **Architecture flexible** : Le serveur Moshi expose une API simple, pensée pour l’intégration avec tout type d’application ou de service, facilitant le développement d’assistants vocaux, d’outils de transcription automatique ou d’applications d’accessibilité.
* **Open source et communauté** : Contrairement à des solutions fermées comme Whisper, Moshi met l’accent sur la transparence du code, la possibilité de contribuer et d’adapter le serveur à des besoins spécifiques.

En résumé, Moshi se présente comme une solution de nouvelle génération pour la reconnaissance vocale, combinant ouverture, performance et flexibilité, avec l’ambition de démocratiser l’accès aux technologies de transcription vocale avancées.


<hr class="hr-text" data-content="Delayed Streams Modeling">

## 2. Modèles STT de Kyutai : Delayed Streams Modeling

### Présentation de l’approche "Delayed Streams Modeling" : concept et avantages techniques

L’approche « Delayed Streams Modeling » (modélisation des flux différés) représente une innovation majeure dans le domaine de la transcription vocale. Traditionnellement, les systèmes Speech-To-Text (STT) traitent l’audio de façon séquentielle : ils convertissent chaque fragment de voix en texte, ce qui peut entraîner des coupures, de la latence ou des imprécisions dès que la parole est rapide, chevauchée ou interrompue.

Avec Delayed Streams Modeling, les modèles de Kyutai adoptent une gestion plus souple et plus intelligente des flux audio. Plutôt que de s’arrêter à la première version du texte généré, le modèle introduit un léger délai pour analyser le contexte global, recaler certains mots et mieux restituer les ambiguïtés de la langue orale. Cette approche permet :

* Une réduction significative des erreurs de transcription, notamment sur les mots à reconnaissance difficile ou dans des environnements bruyants.
* Un traitement des chevauchements de parole et des interruptions, pour une transcription fidèle même dans des dialogues animés.
* Un meilleur équilibre entre latence et précision, grâce à un ajustement dynamique du temps de traitement.

### Comparaison rapide avec Whisper d’OpenAI

Whisper d’OpenAI est aujourd’hui la référence grand public des systèmes STT open-source. Il propose une très bonne précision, surtout sur les enregistrements clairs et bien segmentés. Cependant, Whisper fonctionne essentiellement par blocs d’audio : il segmente la parole, puis attend la fin de chaque bloc pour produire une transcription. Cela peut générer :

* Une latence perceptible dans les usages temps réel (plusieurs secondes de délai).
* Une gestion plus difficile des interruptions, chevauchements et hésitations.
* Moins de flexibilité pour des applications de dialogue interactif ou multitâche.

À l’inverse, les modèles STT de Kyutai — et notamment Moshi avec Delayed Streams Modeling — sont pensés pour les usages conversationnels, interactifs et synchrones. La latence mesurée est de l’ordre de 160 à 200 ms, soit un niveau quasiment imperceptible à l’oreille humaine. Le système est ainsi capable de suivre une conversation rapide, d’accepter les interruptions et de basculer d’un locuteur à l’autre sans perte de texte ou de sens.

### Points forts et cas d’usages spécifiques des modèles STT Kyutai

Les modèles STT de Kyutai offrent plusieurs avantages distincts :

* **Temps réel et fluidité** : Conçus pour la transcription en direct, y compris dans les environnements complexes ou bruyants, avec une gestion avancée des interruptions et des tours de parole.
* **Précision contextuelle** : Grâce au léger délai intégré dans le modèle, la transcription tient compte du contexte global, corrige les erreurs potentielles à la volée, et améliore la fidélité des phrases.
* **Polyvalence** : Ces modèles s’adaptent aussi bien aux applications de sous-titrage, d’accessibilité, de transcription de réunions, qu’aux assistants vocaux ou à l’automatisation de services clients.
* **Ouverture et adaptabilité** : L’approche open-source et modulaire permet aux développeurs d’intégrer, d’adapter et de personnaliser les modèles selon leurs besoins, que ce soit en local, dans le cloud ou sur des architectures spécifiques comme Apple Silicon.

En résumé, l’approche Delayed Streams Modeling de Kyutai permet d’atteindre un niveau de performance et de souplesse inédit dans la transcription vocale, positionnant ces modèles comme des alternatives sérieuses — et parfois supérieures — à Whisper pour tous les usages nécessitant rapidité, précision et interaction en temps réel.


<hr class="hr-text" data-content="Architecture">

## 3. Architecture du serveur Moshi

### Architecture générale : présentation détaillée des composants principaux

Le serveur Moshi a été pensé comme une solution modulaire et robuste, capable de répondre à des exigences variées allant du dialogue interactif à la transcription rapide et précise. Son architecture se décompose en plusieurs couches complémentaires, chacune jouant un rôle clé dans la chaîne de traitement.

**1. Frontend**
Le frontend représente tout système ou application capable d’envoyer des flux audio à Moshi et de recevoir des résultats (texte ou audio). Cela peut être :

* Une application web,
* Un client desktop ou mobile,
* Un microservice d’intégration pour une plateforme plus large (ex : outil de réunion, système de sous-titrage, assistant vocal, etc.).

Le frontend est donc le point d’entrée de la donnée audio. Il interagit avec le serveur Moshi via des protocoles modernes, typiquement en WebSocket pour garantir la faible latence et le streaming.

**2. Backend (serveur Moshi)**
Le backend est le cœur du système : il assure la gestion des connexions, la coordination des flux audio, le contrôle des sessions utilisateurs et l’orchestration entre les différents modules. Le backend Moshi est développé principalement en **Rust**, un langage réputé pour ses performances et la fiabilité de sa gestion mémoire. Selon la plateforme d’exécution, le backend peut déléguer certaines tâches lourdes à des modules en Python (pour l’IA) ou en MLX (pour l’optimisation sur Mac).

**3. Modèles et composants de traitement**
L’innovation de Moshi se situe en grande partie dans ses modèles et la manière dont ils gèrent le flux audio :

* **Mimi** : Il s’agit d’un codec neuronal de streaming, qui convertit le flux audio continu en séquences compactes de tokens sémantiques et acoustiques. Avec une latence de 80 ms correspondant à la taille d’une trame et une compression audio de 1,1 kbps, Mimi réduit considérablement la quantité de données à traiter sans sacrifier la qualité ou les subtilités du signal vocal.
* **Helium** : C’est le modèle de langage fondation (LLM) de Moshi, basé sur une architecture transformer dotée de 7 milliards de paramètres. Il prend en charge le raisonnement textuel, la gestion du contexte conversationnel et la planification de la réponse.
* **Transformers hiérarchiques** :
  * *Depth Transformer* : Gère les dépendances locales entre tokens audio sur de courtes fenêtres temporelles, pour une compréhension fine de chaque séquence.
  * *Temporal Transformer* : S’occupe de l’organisation globale des séquences sur la durée, permettant un traitement fluide en streaming, indispensable pour le dialogue en temps réel.
* **Inner Monologue** : Un mécanisme original où Moshi génère d’abord une représentation textuelle interne (« monologue intérieur ») avant de produire la réponse audio finale. Cela permet d’améliorer la cohérence et la pertinence de la réponse générée.

**4. API d’accès et de restitution**
L’API de Moshi est un point fort du projet. Exposée en WebSocket, elle permet :

* L’injection de flux audio (input),
* La récupération des résultats textuels au fil de l’eau (streaming STT),
* L’obtention d’une réponse vocale générée (streaming TTS) dans le même dialogue,
* L’accès à des fonctions avancées telles que la gestion multi-utilisateur, le contrôle des sessions ou l’intégration dans des pipelines plus larges.

### Explications des composants techniques clés

**Gestion avancée des flux audio**
Moshi gère plusieurs flux audio en simultané : un flux pour l’utilisateur et un flux pour la machine (l’agent Moshi). Cette conception multi-flux permet d’assurer une expérience de dialogue en duplex intégral, où l’on peut parler et écouter en même temps, même si les interlocuteurs se coupent ou se chevauchent. La segmentation de l’audio en trames de 80 ms assure une transmission fluide, tandis que le codec Mimi optimise la compression pour limiter la charge réseau et machine.

**Traitement temps réel et robustesse**
Grâce à l’efficacité de son backend Rust et à la conception hiérarchique de ses modèles, Moshi affiche des performances proches de la conversation humaine, avec une latence totale de l’ordre de 160 à 200 ms en conditions réelles. Cette rapidité permet des usages interactifs exigeants, comme la retranscription en direct de réunions, le sous-titrage de vidéos ou le dialogue avec des assistants vocaux. Le système supporte les interruptions, les changements de locuteur et gère même les cas complexes de prise de parole simultanée.

**API de restitution des résultats STT**
Les résultats peuvent être obtenus en temps réel (texte ou audio généré), sous forme de segments ou de flux continu. Cela rend l’intégration très flexible pour des usages aussi variés que la sous-titrage, l’accessibilité, la veille conversationnelle ou l’automatisation de tâches.

### Optimisation Rust : Metal et CUDA pour des performances maximales

Un des atouts majeurs de Moshi réside dans son souci de l’optimisation matérielle :

* **Sur Mac (Apple Silicon)** :
  Grâce à l’intégration avec Metal (API graphique et de calcul d’Apple), Moshi exploite toute la puissance des puces série M et de leur GPU. Les calculs gourmands (inférence, traitement du flux audio) sont effectués sur le GPU Apple, permettant une exécution locale très rapide, à faible latence, sans dépendre d’un cloud externe. Cette approche favorise la souveraineté des données et l’efficacité énergétique.
* **Sur PC et serveurs (Nvidia CUDA)** :
  Moshi est aussi compatible avec CUDA, la plateforme de calcul haute performance de Nvidia. Cela signifie qu’en environnement Linux ou Windows, le serveur peut s’appuyer sur les cartes graphiques Nvidia pour traiter de gros volumes audio en parallèle, ce qui est crucial pour les usages professionnels, la transcription de masse ou l’intégration dans des data centers.

L’écriture du backend en Rust, couplée à ces optimisations matérielles (Metal pour Apple, CUDA pour Nvidia), fait de Moshi un serveur polyvalent, évolutif et capable d’offrir le meilleur des deux mondes : performance locale sur Mac, scalabilité sur GPU Nvidia.

En somme, l’architecture de Moshi illustre une vision moderne de la reconnaissance et du dialogue vocal : modularité, efficacité, support multi-plateforme, et ouverture à l’intégration dans tout type d’environnement, du poste de travail individuel aux infrastructures professionnelles.


<hr class="hr-text" data-content="Guide Pratique">

## 4. Guide pratique : Compiler et utiliser Moshi STT sur macOS (Metal)

Dans cette partie, nous vous guidons pas à pas pour installer et lancer Moshi STT sur un Mac Apple Silicon, en utilisant un script dédié qui automatise toute la procédure. L’objectif est de rendre l’installation accessible même à des non‑spécialistes.

### Prérequis techniques

Avant de commencer, vérifiez que votre environnement est prêt :

* Un Mac avec puce Apple Silicon, sous macOS.
* Les **outils de développement Xcode** installés (disponibles sur le Mac App Store ou via la commande :
  `xcode-select --install`)
* **Rust** (installable via [rustup.rs](https://rustup.rs){:target="_blank" rel="noopener noreferrer nofollow"})
* **Git** (souvent déjà installé sur macOS)
* **Homebrew** (installateur universel de paquets, le script l’installera si nécessaire)
* Une connexion Internet active

Le script gère automatiquement l’installation et la mise à jour de toutes les dépendances nécessaires, y compris certains utilitaires audio et bibliothèques de build.

### Présentation du script d’installation optimisé

Le projet ci-dessous propose un script shell prêt à l’emploi, pensé pour macOS et l’architecture Metal : 

{% github_card jeanjerome/moshi-stt-apple-installer %}

Il automatise :

* L’installation de Homebrew et Rust s’ils ne sont pas présents
* L’installation des dépendances pour le build (cmake, python)
* La compilation du serveur Moshi avec les options spécifiques à Metal (accélération GPU Apple)
* L’ajout des chemins nécessaires à l’environnement

### Tout en un : compilation, installation et lancement

Ouvrez le Terminal et entrez :

{% highlight bash %}
git clone https://github.com/jeanjerome/moshi-stt-apple-installer.git
cd moshi-stt-apple-installer
./scripts/install.sh
{% endhighlight %}

   Le script :

   * Installe les dépendances système manquantes
   * Compile moshi-server avec le support Metal (binaire installé dans `~/.cargo/bin/moshi-server`)
   * Télécharge la configuration STT pour le modèle `kyutai/stt-1b-en_fr`, un modèle bilingue anglais/français doté d’environ 1 milliard de paramètres, offrant un délai de 0,5 seconde et une détection vocale sémantique (VAD), si elle n’est pas déjà présente.
   * Démarre le serveur sur le port `8080`

   Le serveur Moshi STT est alors accessible localement à l'adresse `ws://localhost:8080/api/asr-streaming`, prêt à recevoir des requêtes.

### Tests pratiques : transcription en temps réel ou sur fichiers audio

Le dépôt met à disposition un petit script Python (`test_transcribe.py`) pour tester rapidement la transcription locale :

{% highlight bash %}
uv run test_client.py
{% endhighlight %}

Le script enverra le fichier audio situé sous `data/bonjour.wav` au serveur Moshi et affichera la transcription en sortie.

### Démonstration de l’utilisation de l’API (exemple d’intégration avancée)

Pour des intégrations plus avancées (PyTorch, MLX, avec capture via le micro, etc.), il est conseillé de se référer à la documentation du dépôt officiel de [Delayed Streams Modeling](https://github.com/kyutai-labs/delayed-streams-modeling){:target="_blank" rel="noopener noreferrer nofollow"} et d’explorer les exemples fournis dans le dossier `scripts`.


Grâce à ce guide et au script d’installation dédié, vous pouvez en quelques minutes bénéficier de la reconnaissance vocale Moshi sur votre Mac Apple Silicon, avec un minimum de configuration manuelle, et profiter ainsi des toutes dernières avancées open source en STT temps réel.


<hr class="hr-text" data-content="RETEX">

## 5. Retours d'expérience et cas pratiques

### Premières impressions d’utilisation

L’installation et la prise en main de Moshi STT sur macOS, grâce au script dédié, se révèlent simples et rapides. Après quelques minutes de configuration, le serveur est opérationnel et prêt à recevoir des requêtes de transcription.

* **Performances en temps réel**
L’un des points les plus marquants lors des premiers essais est la rapidité de traitement. Moshi offre une latence très faible : le texte apparaît à l’écran presque instantanément après la parole. En conditions standards (micro intégré, environnement calme), le serveur restitue une transcription fluide, fidèle et quasi synchrone avec l’audio, ce qui est particulièrement impressionnant pour des échanges interactifs. On ne constate pas d’hallucinations dans les transcriptions, et la ponctuation est systématiquement présente. C’est un point important à souligner, car ce n’est pas toujours le cas avec Whisper.


* **Gestion des bruits ambiants**
Moshi montre également une robustesse appréciable face au bruit de fond. Les tests effectués dans des environnements modérément bruyants (pièce avec discussions en arrière-plan, bruits de clavier ou de ventilation) confirment que le modèle est capable d’isoler et de comprendre la voix principale. La détection vocale sémantique (VAD) intégrée au modèle `kyutai/stt-1b-en_fr` permet de limiter les erreurs de segmentation et de réduire l’apparition de textes parasites liés au bruit.


* **Limitations constatées sur les longues transcriptions**
Un point à signaler concerne la stabilité du service lors de transcriptions prolongées. J’ai observé à plusieurs reprises des déconnexions du WebSocket, ainsi que des interruptions du processus de transcription au-delà d’environ dix minutes d’audio continu. Cela semble cohérent avec la manière dont le modèle a été entraîné : d’après la documentation, les échantillons audio utilisés pour l’apprentissage ne dépassaient pas dix minutes, ce qui oriente clairement Moshi vers des usages de conversation ou de dialogue, plus que de la transcription de longues sessions sans interruption.

Je poursuis toutefois des tests plus exhaustifs pour déterminer si ces limites sont inhérentes au modèle ou s’il s’agit d’un point perfectible dans mon implémentation. Une analyse plus approfondie me permettra d’identifier si des adaptations côté client pourraient permettre de lever cette contrainte.


### Exemples pratiques d’applications potentielles

Moshi STT s’adresse à de nombreux cas d’usage concrets où la rapidité, la précision et la flexibilité sont essentielles. Voici quelques exemples :

* **Réunions et visioconférences**
  Moshi peut être intégré à une application de visioconférence ou de prise de notes pour fournir une transcription en temps réel des échanges. Cela facilite le suivi, la rédaction automatique de comptes-rendus et améliore l’accessibilité pour les participants malentendants.

* **Podcasts et contenus audio**
  Les créateurs de podcasts ou de contenus audio peuvent utiliser Moshi pour générer automatiquement la transcription de leurs épisodes, facilitant ainsi la création de sous-titres, de résumés ou de contenus dérivés pour le web.

* **Vidéos sous-titrées en direct**
  Grâce à sa faible latence, Moshi peut servir à la génération de sous-titres en temps réel pour des vidéos diffusées en direct ou enregistrées. Cela ouvre de nouvelles perspectives pour l’accessibilité, mais aussi pour l’indexation de contenus ou la traduction automatique en aval.

* **Applications mobiles et assistants vocaux**
  Moshi, grâce à son API simple, peut facilement être intégré dans des applications mobiles pour permettre la saisie vocale, la recherche par la voix ou le pilotage d’assistants personnels, sans dépendre d’un cloud externe.

* **Systèmes de transcription médicale, juridique ou technique**
  La précision contextuelle et la rapidité de Moshi rendent ce serveur pertinent pour des secteurs exigeants, où chaque mot compte et où la confidentialité peut nécessiter une solution locale.

> info "À noter"
> Le service [unmute.sh](https://unmute.sh/){:target="_blank" rel="noopener noreferrer nofollow"} s’appuie sur le même serveur Moshi et sur le modèle `kyutai/stt-1b-en_fr` pour sa brique de reconnaissance vocale.
> Sur cette plateforme, il est possible de tester l’ensemble des composants développés par Kyutai : 
> - la transcription vocale (STT),
> - le dialogue assisté par LLM,
> - la synthèse vocale (TTS).
> 
> Cette démonstration en ligne permet de se faire une idée concrète des performances et de la qualité de l’écosystème Moshi, sans aucune installation locale.

En résumé, Moshi STT combine simplicité d’intégration, performance et robustesse, ce qui en fait une solution particulièrement intéressante pour tout projet nécessitant de la reconnaissance vocale temps réel, que ce soit à des fins professionnelles, créatives ou d’accessibilité.


<hr class="hr-text" data-content="Conclusion">

## Conclusion

L’arrivée du Delayed Streams Modeling (Moshi STT) marque une nouvelle étape dans le domaine de la reconnaissance vocale open-source. Grâce à son architecture moderne, à son optimisation pour les environnements Apple Silicon (via Metal) et CUDA, ainsi qu’à ses modèles de transcription avancés, Moshi propose une solution performante, flexible et accessible à tous. Et enfin un challenger à Whisper d'Open AI.

**Parmi les points forts observés, on peut retenir :**

* Une latence très faible, permettant une transcription en temps réel adaptée aux usages interactifs.
* Une robustesse appréciable face aux bruits ambiants et une fiabilité des résultats, notamment en matière de ponctuation et d’absence d’hallucination dans la transcription.
* Une intégration facilitée grâce à une API claire et à un support multi-plateforme (Mac, Linux, Windows).
* L’ouverture du projet, qui favorise la transparence, la personnalisation et l’innovation au sein de la communauté open-source.

Pour les développeurs, Moshi STT représente un outil de choix pour intégrer la reconnaissance vocale dans des applications variées : sous-titrage, transcription de réunions, assistants vocaux, accessibilité ou automatisation de services. Les utilisateurs finaux bénéficient quant à eux d’une expérience plus fluide et plus fidèle, que ce soit pour le travail, la création de contenu ou la vie quotidienne.

**Nous encourageons chacun à explorer plus en détail le projet Moshi** : à consulter sa documentation, à tester ses capacités via le script d’installation dédié ou encore à essayer la démonstration en ligne sur [unmute.sh](https://unmute.sh/){:target="_blank" rel="noopener noreferrer nofollow"}. Les contributions, retours d’expérience et propositions d’amélioration sont précieux pour faire évoluer l’outil et pour enrichir la communauté qui se forme autour du projet.

**Les perspectives d’avenir sont prometteuses** : l’équipe Kyutai prévoit l’arrivée de nouveaux modèles multilingues, une meilleure gestion des longues sessions audio et des avancées dans la synthèse vocale et le dialogue temps réel. Avec Moshi, l’écosystème open-source dispose désormais d’une base solide pour répondre aux nouveaux défis de la voix, de l’intelligence artificielle et de l’accessibilité.

Alors n’hésitez pas à contribuer, partager vos retours et suivre l’évolution de Moshi, afin de participer activement à la construction des outils vocaux de demain.


<hr class="hr-text" data-content="Ressources">

## Ressources complémentaires

Pour approfondir l’utilisation de Moshi STT, contribuer au projet ou trouver de l’aide, voici une sélection de liens utiles et de ressources communautaires :

* **Serveur Moshi (GitHub officiel)**
  
  * [https://github.com/kyutai-labs/moshi](https://github.com/kyutai-labs/moshi){:target="_blank" rel="noopener noreferrer nofollow"}
  * Retrouvez le code source, la documentation technique, les exemples d’utilisation et les informations de mise à jour sur le dépôt principal du projet.

* **Modèles STT Kyutai (GitHub officiel)**
  
  * [https://github.com/kyutai-labs/delayed-streams-modeling](https://github.com/kyutai-labs/delayed-streams-modeling){:target="_blank" rel="noopener noreferrer nofollow"}
  * Découvrez la configuration des modèles Speech-To-Text, les jeux de données associés, les architectures employées et les avancées récentes sur la reconnaissance vocale.

* **Script d’installation optimisé pour Apple Metal**
  
  * [https://github.com/jeanjerome/moshi-stt-apple-installer](https://github.com/jeanjerome/moshi-stt-apple-installer){:target="_blank" rel="noopener noreferrer nofollow"}
  * Ce dépôt propose un script automatisé pour installer et configurer Moshi STT sur Mac Apple Silicon, avec toutes les dépendances et optimisations nécessaires.

* **Site officiel Kyutai**
  
   * [https://kyutai.org/](https://kyutai.org/){:target="_blank" rel="noopener noreferrer nofollow"}
   * Pour en savoir plus sur l’équipe, la vision, les autres projets et les publications de Kyutai.

* **Démonstration en ligne : Unmute.sh**
  
  * [https://unmute.sh/](https://unmute.sh/){:target="_blank" rel="noopener noreferrer nofollow"}
  * Testez les briques STT, LLM et TTS de Kyutai sans rien installer, pour une prise en main immédiate des technologies Moshi.
