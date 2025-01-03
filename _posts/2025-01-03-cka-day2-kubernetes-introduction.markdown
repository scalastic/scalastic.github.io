---
layout: post
title: "Jour 2 : Découvrir Kubernetes et Monter son Premier Cluster pour la Certification CKA"
date: 2025-01-03 15:09:00 +0100
description: "Découvrez l'architecture de Kubernetes, ses composants essentiels, et apprenez à configurer un cluster Multi-node avec Kind pour vous préparer à la certification CKA."
img: cka-day2-kubernetes-architecture.jpg
fig-caption: "Architecture Kubernetes et premières étapes vers la maîtrise du CKA."
tags: ["Kubernetes", "CKA", "Cluster", "DevOps", "Certification", "Kind", "Kubectl", "Tutorial"]
lang: fr
permalink: /cka-certification-day-2-kubernetes/
status: finished
seo_title: "Certification CKA : Jour 2 - Découvrir Kubernetes et Monter son Premier Cluster"
seo_description: "Un guide pratique pour comprendre l'architecture Kubernetes, ses composants, et configurer un cluster Multi-node avec Kind. Préparez-vous efficacement à la certification CKA."
series: "Certification CKA - Formation Complète"
progression: "Jour 2"
---

Kubernetes est l'outil le plus utilisé pour orchestrer les conteneurs dans les environnements Cloud Native et DevOps. Il permet de gérer le déploiement des applications tout en assurant leur scalabitié, leur résilience et une gestion optimisée. Pour préparer le CKA sur de bonnes bases, il est donc important de comprendre l'architecture de Kubernetes et de savoir configurer son propre cluster afin de maîtriser ses composants, pratiquer et expérimenter, et répondre aux exigences de l'examen.

Dans cet article, nous couvrirons les bases de Kubernetes et son utilisation. Vous apprendrez à configurer un cluster Multi-node avec Kind, à installer et utiliser le client Kubernetes, kubectl, et à exécuter vos premières commandes pour interagir avec un cluster. Ces compétences constituent une première étape importante dans votre préparation à la certification.


<hr class="hr-text" data-content="{{page.series}}">

> info "{{ page.progression }}"
> Bienvenue dans la deuxième étape de votre parcours vers la certification Certified Kubernetes Administrator (CKA). Dans cet article, nous explorerons :
> - L'architecture de Kubernetes et le rôle de ses composants principaux.
> - Les spécificités de l'examen CKA, incluant les ressources disponibles et la version de Kubernetes utilisée.
> - La configuration d'un cluster Multi-node avec Kind et l'utilisation de l'outil kubectl.
> - Les premières commandes pratiques pour interagir avec votre cluster Kubernetes.
> 
> Comme pour le premier jour, ce tutoriel est conçu pour combiner théorie et pratique afin de renforcer vos compétences techniques et votre confiance avant l'examen.

<hr class="hr-text" data-content="Sommaire">

* TOC
{:toc}

<hr class="hr-text" data-content="Architecture Kubernetes">

## 1. Introduction à l'Architecture Kubernetes

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/cka-kubernetes-architecture.png --alt Architecture d'un cluster Kubernetes %}
  <figcaption>Architecture d'un cluster Kubernetes</figcaption>
</figure>

L'architecture de Kubernetes est structurée pour orchestrer des conteneurs en répartissant les responsabilités entre deux types de nœuds principaux : les nœuds maîtres (Master Nodes) et les nœuds de travail (Worker Nodes). Les Master Nodes sont responsables de la gestion et du contrôle de l'ensemble du cluster, tandis que les Worker Nodes exécutent les charges de travail conteneurisées. Cette séparation des rôles garantit la disponibilité, la résilience et l'évolutivité du système dans son ensemble.

### 1.1. Les Composants Principaux du Master Node

Le Master Node (aussi appelé Control Plane) est le cerveau du cluster Kubernetes. Il contrôle l'ensemble des opérations du cluster et gère les états désirés des applications déployées. Voici ses composants principaux :

- **API Server** : 
  - Point d’entrée pour toutes les interactions avec le cluster.
  - Reçoit les requêtes via l’interface REST et les transmet aux autres composants pour traitement.
  - Également utilisé par le client `kubectl` pour interagir avec Kubernetes.

- **etcd** : 
  - Base de données clé-valeur distribuée qui stocke l'état du cluster, y compris les configurations, les métadonnées et les informations sur les objets Kubernetes.
  - Essentiel pour garantir la cohérence et la récupération de l'état en cas de panne.

- **Controller Manager** : 
  - Regroupe plusieurs contrôleurs responsables de la gestion automatique des objets Kubernetes (par exemple, assurer qu’un nombre minimal de replicas d’un pod est en cours d’exécution).
  - Surveille l'état actuel du cluster et agit pour maintenir l'état désiré.

- **Scheduler** : 
  - Assigne les pods nouvellement créés aux nœuds disponibles en fonction des ressources et des contraintes définies (par exemple, la CPU, la RAM ou les labels des nœuds).
  - Optimise l'utilisation des ressources du cluster.

### 1.2. Les Composants des Worker Nodes

Les Worker Nodes sont les machines où les conteneurs sont exécutés. Chaque nœud de travail contient plusieurs composants qui assurent la gestion des ressources locales et l'exécution des charges de travail :

- **Kubelet** :
  - Agent qui exécute et surveille les pods de son nœud.
  - Communique avec l'API Server pour recevoir des instructions et rapporter l'état des pods.

- **Kube Proxy** :
  - Composant réseau qui assure la communication entre les services et les pods.
  - Gère les règles de routage et d'équilibrage de charge pour les services exposés.

- **Container Runtime** :
  - Logiciel responsable de l'exécution des conteneurs sur le nœud. Kubernetes supporte plusieurs runtimes, notamment Docker, containerd, et CRI-O (tout moteur compatible avec la Container Runtime Interface ou CRI).
  - Garantit l'isolation et l'exécution des conteneurs de manière efficace.

- **Pods** :
  - Les pods sont les unités de base de déploiement dans Kubernetes et regroupent **un ou plusieurs conteneurs** qui partagent le même réseau et les mêmes volumes.
  - **Rôle du Kubelet** : Kubelet s'assure que les pods planifiés sur le nœud fonctionnent correctement, interagit avec le runtime pour démarrer/arrêter les conteneurs et remonte l'état des pods à l'API Server.  
  - **Rôle de Kube-Proxy** : Kube-Proxy gère la connectivité réseau entre les pods et assure le routage des requêtes vers les bons pods, en équilibrant la charge si nécessaire.  

> info "Sur quoi s'exécute un Node ?"
> Les nœuds Kubernetes peuvent être déployés sur une variété de plateformes, notamment des machines physiques, des machines virtuelles ou des environnements conteneurisés. Kubernetes est conçu pour être agnostique vis-à-vis de l'infrastructure, permettant aux utilisateurs de déployer leur cluster sur un environnement hétérogène.

> info "Comment est assurée la haute disponibilité d’un cluster Kubernetes ?" 
> La haute disponibilité (HA) dans Kubernetes repose sur plusieurs stratégies :  
> - **Réplication des Master Nodes** : En configurant plusieurs Master Nodes (au minimum 3), on réduit le risque de point unique de défaillance. Ces Master Nodes partagent les responsabilités en utilisant etcd comme base de données distribuée.  
> - **Gestion des Worker Nodes** : Kubernetes détecte automatiquement les pannes des Worker Nodes et rééquilibre les pods affectés sur d'autres nœuds fonctionnels.  
> - **Load Balancing et Heartbeats** : Des mécanismes tels que les équilibrages de charge (load balancers) et les sondes de "vitalité" (liveness probes) garantissent que le trafic est dirigé vers des composants opérationnels.

<hr class="hr-text" data-content="Examen CKA">

## 2. Aperçu de l'examen Certified Kubernetes Administrator (CKA)

L’examen Certified Kubernetes Administrator (CKA) évalue les compétences pratiques des candidats pour administrer et gérer des clusters Kubernetes. Il est conçu pour valider une expertise opérationnelle dans un environnement réel.

### 2.1. Structure et objectifs de l’examen

L’examen est d’une durée de **2 heures** et se concentre sur des scénarios pratiques. Les candidats doivent résoudre des problèmes concrets et effectuer des tâches liées à la gestion des clusters Kubernetes. Les principaux objectifs couverts incluent :
- La gestion et la configuration des clusters.
- Le réseau et la connectivité.
- La sécurité, incluant les contrôles RBAC (Role-Based Access Control).
- La gestion des ressources et la maintenance des applications.

Une préparation adéquate et une pratique régulière des commandes sont donc importantes pour réussir dans ce format axé sur la pratique.

> info "Informations Complètes"
> Vous trouverez toutes les informations sur la page dédiée de la Linux Foundation : [https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka-2/](https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka-2/){:target="_blank" rel="noopener noreferrer nofollow"}.

### 2.2. Version de Kubernetes utilisée

L’examen Certified Kubernetes Administrator (CKA) repose sur une version spécifique de Kubernetes. Il est fortement conseillé de vérifier cette version sur le site officiel avant de débuter votre préparation. Cela garantit que vos connaissances et vos exercices pratiques sont alignés avec les fonctionnalités et comportements propres à la version utilisée lors de l'examen. Kubernetes évoluant rapidement, certaines commandes ou fonctionnalités peuvent varier d’une version à l’autre, rendant cette vérification nécessaire.

> info "Version de Kubernetes pour la CKA 2025"
> En ce début d'année 2025, et au moins jusqu'au 10 février, la version utilisée pour l'examen CKA est la **v1.31**.
> Pour découvrir les modifications spécifiques à l'examen CKA 2025, consultez la page dédiée : [Program Changes - CKA 2025](https://training.linuxfoundation.org/certified-kubernetes-administrator-cka-program-changes/){:target="_blank" rel="noopener noreferrer nofollow"}.

### 2.3. Documentation accessible pendant l’examen

Pendant l’examen, vous avez accès à certaines ressources en ligne pour vous aider :
- [Kubernetes Documentation](https://kubernetes.io/docs){:target="_blank" rel="noopener noreferrer nofollow"} : La documentation officielle, essentielle pour rechercher des informations sur les concepts, commandes, et objets Kubernetes.
- [Kubernetes Blog](https://kubernetes.io/blog/){:target="_blank" rel="noopener noreferrer nofollow"} : Utile pour les actualités ou les articles pertinents sur Kubernetes, bien que rarement nécessaire pendant l’examen.
- [Kubectl Reference](https://kubernetes.io/docs/reference/kubectl/quick-reference/){:target="_blank" rel="noopener noreferrer nofollow"} : Une ressource indispensable pour retrouver rapidement les options et syntaxes des commandes `kubectl`.

Ces ressources vous permettront de confirmer ou de compléter vos connaissances pendant l'examen, mais elles doivent être utilisées efficacement, car le temps est limité.
Il faut aussi noter que vous accèderez à cette documentation, comme au contenu de l'examen, au travers d'un espace virtualisé. Il faut donc bien vous y préparer.

<hr class="hr-text" data-content="Création du Cluster">

## 3. Configuration d’un cluster Kubernetes Multi-node avec Kind

Kind (Kubernetes IN Docker) est un outil léger permettant de déployer des clusters Kubernetes pour le développement et les tests en local. Comme son nom l'indique, Kind fonctionne en exécutant les nœuds Kubernetes (Master Nodes et Worker Nodes) en tant que conteneurs Docker sur votre machine. Cela élimine la nécessité de machines physiques ou virtuelles séparées, rendant la configuration rapide, portable et idéale pour les environnements de test. Cette section vous guide étape par étape pour créer un cluster Multi-node à l'aide de Kind.

### 3.1. Pré-requis

Avant de commencer, assurez-vous que Docker est installé et et que le daemon Docker est bien démarré sur votre machine.

### 3.2. Installation de Kind

Il existe de nombreuses façons d'installer Kind sur une machine mais toutes sont très simples :
- A partir de **binaires** : [https://kind.sigs.k8s.io/docs/user/quick-start/#installing-from-release-binaries](https://kind.sigs.k8s.io/docs/user/quick-start/#installing-from-release-binaries){:target="_blank" rel="noopener noreferrer nofollow"}.
- A partir d'un **gestionnaire de paquet** : [https://kind.sigs.k8s.io/docs/user/quick-start/#installing-with-a-package-manager](https://kind.sigs.k8s.io/docs/user/quick-start/#installing-with-a-package-manager){:target="_blank" rel="noopener noreferrer nofollow"}.


Voici des exemples d'installation selon votre système d’exploitation :

#### 3.2.1. Sous Linux

{% highlight bash %}
# For AMD64 / x86_64
[ $(uname -m) = x86_64 ] && curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.26.0/kind-linux-amd64
# For ARM64
[ $(uname -m) = aarch64 ] && curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.26.0/kind-linux-arm64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
{% endhighlight %}

#### 3.2.2. Sous macOS

{% highlight bash %}
brew install kind
{% endhighlight %}

{% highlight plaintext %}
==> Downloading https://ghcr.io/v2/homebrew/core/kind/manifests/0.26.0
############################################################################################################################################ 100.0%
==> Fetching kind
==> Downloading https://ghcr.io/v2/homebrew/core/kind/blobs/sha256:472a0a175ae63c92c8975fc202905dad51e248b4f398eed975df307f0bd14c5e
############################################################################################################################################ 100.0%
==> Pouring kind--0.26.0.arm64_sequoia.bottle.tar.gz
==> Caveats
zsh completions have been installed to:
  /opt/homebrew/share/zsh/site-functions
==> Summary
🍺  /opt/homebrew/Cellar/kind/0.26.0: 9 files, 9MB
==> Running `brew cleanup kind`...
Disable this behaviour by setting HOMEBREW_NO_INSTALL_CLEANUP.
Hide these hints with HOMEBREW_NO_ENV_HINTS (see `man brew`).
{% endhighlight %}

#### 3.2.3. Sous Windows

{% highlight powershell %}
curl.exe -Lo kind-windows-amd64.exe https://kind.sigs.k8s.io/dl/v0.26.0/kind-windows-amd64
Move-Item .\kind-windows-amd64.exe c:\some-dir-in-your-PATH\kind.exe
{% endhighlight %}

#### 3.2.4. Test de l'installation

{% highlight bash %}
kind --version
{% endhighlight %}

Vous devriez voir la version qui s'affiche :

{% highlight plaintext %}
kind version 0.26.0
{% endhighlight %}

### 3.3. Création du Cluster Multi-Node

Une fois Kind installé, suivez ces étapes pour configurer un cluster Kubernetes avec plusieurs nœuds.

#### **Étape 1** : Créer un fichier de configuration pour le cluster

Un fichier de configuration au format YAML est nécessaire pour définir la topologie de votre cluster. Voici un exemple de configuration pour un cluster comportant 1 Master Node et 2 Worker Nodes :

- Créez un fichier nommé `kind-cluster-config.yaml` :
{% highlight yaml %}
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
  - role: worker
  - role: worker
{% endhighlight %}

#### **Étape 2** : Déterminer l'image Kubernetes à utiliser

Par défaut, Kind utilise la dernière version de Kubernetes packagée pour cet outil. Cependant, dans le cadre de notre préparation à l'examen CKA, il est essentiel d'utiliser la même version que celle prévue pour l’examen.

- Consultez la page des [versions packagées de Kind](https://github.com/kubernetes-sigs/kind/releases){:target="_blank" rel="noopener noreferrer nofollow"} pour identifier la version à utiliser. Recherchez la section listant les images disponibles pour la version actuelle.

   Exemple :
{% highlight markdown %}
Images pre-built for this release:
- v1.32.0: kindest/node:v1.32.0@sha256:c48c62eac5da28cdadcf560d1d8616cfa6783b58f0d94cf63ad1bf49600cb027
- v1.31.4: kindest/node:v1.31.4@sha256:2cb39f7295fe7eafee0842b1052a599a4fb0f8bcf3f83d96c7f4864c357c6c30
- v1.30.8: kindest/node:v1.30.8@sha256:17cd608b3971338d9180b00776cb766c50d0a0b6b904ab4ff52fd3fc5c6369bf
{% endhighlight %}

- Pour cet article, la version utilisée lors de l'examen CKA début 2025 est **v1.31**. Nous retiendrons l’image suivante :
{% highlight plaintext %}
   kindest/node:v1.31.4@sha256:2cb39f7295fe7eafee0842b1052a599a4fb0f8bcf3f83d96c7f4864c357c6c30
{% endhighlight %}

#### **Étape 3** : Créer le cluster à partir du fichier de configuration

Utilisez la commande suivante pour créer le cluster en spécifiant le fichier de configuration et l'image correspondant à la version choisie :
{% highlight bash %}
kind create cluster \
  --config kind-cluster-config.yaml \
  --image kindest/node:v1.31.4@sha256:2cb39f7295fe7eafee0842b1052a599a4fb0f8bcf3f83d96c7f4864c357c6c30 \
  --name multi-node-cluster
{% endhighlight %}

- **Explications des options** :
  - `--config kind-cluster-config.yaml` : Définit la topologie du cluster en se basant sur le fichier de configuration.
  - `--image` : Spécifie l'image Docker contenant la version exacte de Kubernetes à utiliser.
  - `--name multi-node-cluster` : Attribue un nom au cluster pour en simplifier la gestion.

Vous devriez voir les logs ci-dessous s'afficher :
{% highlight plaintext %}
Creating cluster "multi-node-cluster" ...
 ✓ Ensuring node image (kindest/node:v1.31.4) 🖼
 ✓ Preparing nodes 📦 📦 📦  
 ✓ Writing configuration 📜 
 ✓ Starting control-plane 🕹️ 
 ✓ Installing CNI 🔌 
 ✓ Installing StorageClass 💾 
 ✓ Joining worker nodes 🚜 
Set kubectl context to "kind-multi-node-cluster"
You can now use your cluster with:

kubectl cluster-info --context kind-multi-node-cluster

Thanks for using kind! 😊
{% endhighlight %}

Votre cluster Kubernetes Multi-node est maintenant configuré avec la version exacte utilisée dans l’examen CKA, pour ma part la `v1.31.4`.

Voyons, à présent, comment interagir avec le cluster pour valider son fonctionnement.

#### **Étape 4** : Vérifier la création du cluster

A l'heure actuelle, nous n'avons que deux commandes à notre dispositio pour effectuer des vérifications : `kind` ainsi que le client `docker`, car Kind repose sur des conteneurs Docker pour exécuter les nœuds Kubernetes. Voyons comment valider rapidement que le cluster est opérationnel.

##### 1. Lister les clusters Kind actifs

Utilisez la commande suivante pour afficher les clusters créés avec Kind :
{% highlight bash %}
kind get clusters
{% endhighlight %}

Vous devriez voir une sortie comme :
{% highlight plaintext %}
multi-node-cluster
{% endhighlight %}

Cela confirme que votre cluster "multi-node-cluster" est actif.

##### 2. Afficher les détails des nœuds

Pour vérifier les nœuds créés et leurs rôles, exécutez :
{% highlight bash %}
docker ps --filter "name=multi-node-cluster"
{% endhighlight %}

Cette commande affiche tous les conteneurs Docker correspondant aux nœuds du cluster, avec leurs rôles (control-plane ou worker) et leurs statuts.

Exemple de sortie :
{% highlight plaintext %}
CONTAINER ID   IMAGE                  COMMAND                  CREATED             STATUS             PORTS                       NAMES
e035ef879a00   kindest/node:v1.31.4   "/usr/local/bin/entr…"   About an hour ago   Up About an hour   127.0.0.1:51483->6443/tcp   multi-node-cluster-control-plane
6abe3d65c3a4   kindest/node:v1.31.4   "/usr/local/bin/entr…"   About an hour ago   Up About an hour                               multi-node-cluster-worker
e7e120b8205a   kindest/node:v1.31.4   "/usr/local/bin/entr…"   About an hour ago   Up About an hour                               multi-node-cluster-worker2
{% endhighlight %}

Chaque conteneur représente un nœud de votre cluster Kubernetes. Dans cet exemple, un nœud de contrôle (`control-plane`) et deux nœuds de travail (`worker`, `worker2`) ont été créés.

##### 3. Vérifier les logs du cluster

Vous pouvez également consulter les journaux de Kind pour diagnostiquer d'éventuels problèmes au démarrage du cluster :
{% highlight bash %}
kind export logs --name multi-node-cluster
{% endhighlight %}

Exemple de sortie :
{% highlight plaintext %}
Exporting logs for cluster "multi-node-cluster" to:
/private/var/folders/j9/bnfyqnns4tzccm9jnvrxzx100000gn/T/436485870
{% endhighlight %}

Cette commande exporte les journaux du cluster dans un répertoire local pour une analyse approfondie :

{% highlight bash %}
% ls -al /private/var/folders/j9/bnfyqnns4tzccm9jnvrxzx100000gn/T/436485870
total 16
drwx------@   7 jeanjerome  staff   224  3 jan 11:47 .
drwx------@ 161 jeanjerome  staff  5152  3 jan 11:47 ..
-rw-r--r--@   1 jeanjerome  staff  1286  3 jan 11:47 docker-info.txt
-rw-r--r--@   1 jeanjerome  staff    34  3 jan 11:47 kind-version.txt
drwxr-xr-x@  12 jeanjerome  staff   384  3 jan 11:47 multi-node-cluster-control-plane
drwxr-xr-x@  12 jeanjerome  staff   384  3 jan 11:47 multi-node-cluster-worker
drwxr-xr-x@  12 jeanjerome  staff   384  3 jan 11:47 multi-node-cluster-worker2
{% endhighlight %}

Avec ces vérifications, vous êtes assuré que votre cluster a été correctement configuré. Pour obtenir des informations plus détaillées et interagir pleinement avec le cluster, il est, à présent, nécessaire d’installer et de configurer le client `kubectl`.

<hr class="hr-text" data-content="Client Kube">

## 4. Premiers Pas avec kubectl

`kubectl` est le client en ligne de commande officiel de Kubernetes. Il permet d’interagir avec le cluster, de gérer ses ressources, et d'obtenir des informations détaillées sur son état. Cette section vous guide dans l'installation de `kubectl` et vous présente les commandes de base pour explorer et gérer votre cluster.

### 4.1. Téléchargement et installation

Les étapes ci-dessous illustrent des exemples valides pour installer `kubectl` sur différents systèmes d'exploitation et le configurer afin d'interagir avec un cluster Kind.

> warning ""
> Plusieurs méthodes sont disponibles pour installer `kubectl`, en fonction de votre système d’exploitation et des gestionnaires de packages disponibles. 
>
> Ces exemples reflètent des pratiques actuelles et peuvent évoluer avec le temps. Pour obtenir des informations toujours à jour, référez-vous à la documentation officielle : [https://kubernetes.io/docs/tasks/tools/install-kubectl/](https://kubernetes.io/docs/tasks/tools/install-kubectl/){:target="_blank" rel="noopener noreferrer nofollow"}.

Voici quelques exemples adaptés aux principaux systèmes d’exploitation :

#### 4.1.1. Installation sur Linux
- Téléchargez le binaire de `kubectl` :
   
{% highlight bash %}
curl -LO https://dl.k8s.io/release/$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl
{% endhighlight %}

- Rendez-le exécutable :
{% highlight bash %}
chmod +x ./kubectl
{% endhighlight %}

- Déplacez-le dans un répertoire inclus dans votre PATH :
{% highlight bash %}
sudo mv ./kubectl /usr/local/bin/kubectl
{% endhighlight %}

#### 4.1.2. Installation sur macOS

- Exécutez la commande d'installation :
{% highlight bash %}
brew install kubectl 
{% endhighlight %}

#### 4.1.3. Installation sur Windows

- Vérifiez la dernière version stable du binaire `kubectl` depuis [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt){:target="_blank" rel="noopener noreferrer nofollow"}.

- Téléchargez-le, par exemple :
{% highlight powershell %}
curl -LO https://dl.k8s.io/release/v1.32.0/bin/windows/amd64/kubectl.exe
{% endhighlight %}

- Ajoutez le binaire dans votre PATH.

#### 4.1.4. Vérifier et Configurer kubectl pour le cluster Kind

- Vérifiez l'installation dans votre shell:
{% highlight shell %}
kubectl version --client
{% endhighlight %}

- Vous devriez voir (aux versions près) :

{% highlight plaintext %}
Client Version: v1.32.0
Kustomize Version: v5.5.0
{% endhighlight %}

---

- Kind configure automatiquement le fichier kubeconfig pour permettre à `kubectl` d’interagir avec le cluster. Pour vérifier que kubectl est bien configuré :
{% highlight shell %}
kubectl cluster-info
{% endhighlight %}

- Si la configuration est correcte, vous verrez les informations sur l'API Server et le Control Plane du cluster :
{% highlight plaintext %}
Kubernetes control plane is running at https://127.0.0.1:51483
CoreDNS is running at https://127.0.0.1:51483/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
{% endhighlight %}

### 4.2. Commandes de base

Une fois `kubectl` installé et configuré, vous pouvez utiliser les commandes suivantes pour explorer et interagir avec votre cluster. 

#### 4.2.1. Travailler avec les contextes

> warning "Pour le CKA"
> Dans Kubernetes, un contexte correspond à une combinaison de **cluster, d’utilisateur et de namespace**.
> Il est donc très important de travailler avec le bon contexte, surtout lors de l’examen CKA, où des erreurs de contexte peuvent entraîner une perte de temps ou des erreurs de configuration. 

Familiarisez-vous dès maintenant avec la gestion des contextes pour éviter ces problèmes. Voici quelques commandes utiles pour travailler avec les contextes.

##### 4.2.1.1. Afficher la configuration actuelle

{% highlight shell %}
kubectl config view
{% endhighlight %}

  Cette commande affiche la configuration complète actuelle, y compris les clusters, les utilisateurs, et les contextes définis dans le fichier kubeconfig.

- Exemple de sortie :
{% highlight plaintext %}
% kubectl config view
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: DATA+OMITTED
    server: https://127.0.0.1:51483
  name: kind-multi-node-cluster
contexts:
- context:
    cluster: kind-multi-node-cluster
    user: kind-multi-node-cluster
  name: kind-multi-node-cluster
current-context: kind-multi-node-cluster
kind: Config
preferences: {}
users:
- name: kind-multi-node-cluster
  user:
    client-certificate-data: DATA+OMITTED
    client-key-data: DATA+OMITTED
{% endhighlight %}

##### 4.2.1.2. Ajouter un nouveau contexte

  Pour ajouter un nouveau contexte, utilisez la commande suivante :
{% highlight shell %}
kubectl config set-context <context-name> \
  --cluster=<cluster-name> \
  --user=<user-name> \
  --namespace=<namespace>
{% endhighlight %}

  Par exemple :
{% highlight shell %}
kubectl config set-context dev-cluster \
  --cluster=cluster-dev \
  --user=developer \
  --namespace=development
{% endhighlight %}

##### 4.2.1.3. Supprimer un contexte existant

  Supprimez un contexte spécifique avec la commande suivante :
{% highlight shell %}
kubectl config delete-context <context-name>
{% endhighlight %}

  Par exemple :

{% highlight shell %}
kubectl config delete-context dev-cluster
{% endhighlight %}

##### 4.2.1.4. Liste des contextes disponibles

{% highlight shell %}
kubectl config get-contexts
{% endhighlight %}

- Exemple de sortie :
{% highlight plaintext %}
% kubectl config get-contexts
CURRENT   NAME                      CLUSTER                   AUTHINFO                  NAMESPACE
*         kind-multi-node-cluster   kind-multi-node-cluster   kind-multi-node-cluster
          production-cluster        prod-cluster              prod-user                 default
          dev-environment           dev-cluster               dev-user                  development
{% endhighlight %}

##### 4.2.1.5. Afficher le contexte actif

{% highlight shell %}
kubectl config current-context
{% endhighlight %}

- Exemple de sortie :
{% highlight plaintext %}
% kubectl config current-context
kind-multi-node-cluster  
{% endhighlight %}

##### 4.2.1.6. Définir un contexte par défaut

{% highlight shell %}
kubectl config use-context kind-multi-node-cluster
{% endhighlight %}

- Exemple de sortie :
{% highlight plaintext %}
% kubectl config use-context kind-multi-node-cluster
Switched to context "kind-multi-node-cluster".
{% endhighlight %}

En configurant correctement le contexte, vous vous assurez que toutes les commandes `kubectl` exécutées pointent bien vers le bon cluster.

#### 4.2.2. Vérification de l'état d'un cluster

- Affichez les informations générales sur un cluster donné :
{% highlight shell %}
kubectl cluster-info --context kind-multi-node-cluster
{% endhighlight %}

- Exemple de sortie :
{% highlight plaintext %}
% kubectl cluster-info --context kind-multi-node-cluster
Kubernetes control plane is running at https://127.0.0.1:51483
CoreDNS is running at https://127.0.0.1:51483/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
{% endhighlight %}

#### 4.2.3. Liste des nœuds

- Affichez les nœuds du cluster et leurs statuts :
{% highlight shell %}
kubectl get nodes
{% endhighlight %}

- Exemple de sortie :
{% highlight plaintext %}
% kubectl get nodes
NAME                               STATUS   ROLES           AGE    VERSION
multi-node-cluster-control-plane   Ready    control-plane   139m   v1.31.4
multi-node-cluster-worker          Ready    <none>          139m   v1.31.4
multi-node-cluster-worker2         Ready    <none>          139m   v1.31.4
{% endhighlight %}

#### 4.2.4. Affichage des namespaces disponibles

- Listez tous les namespaces du cluster :
{% highlight shell %}
kubectl get namespaces
{% endhighlight %}

- Exemple de sortie :
{% highlight plaintext %}
% kubectl get namespaces
NAME                 STATUS   AGE
default              Active   140m
kube-node-lease      Active   140m
kube-public          Active   140m
kube-system          Active   140m
local-path-storage   Active   140m
{% endhighlight %}

#### 4.2.5. Liste des pods dans un namespace

- Vérifiez s'il existe des pods déployés dans le namespace par défaut :
{% highlight shell %}
kubectl get pods
{% endhighlight %}

- Exemple de sortie :
{% highlight plaintext %}
% kubectl get pods
No resources found in default namespace.
{% endhighlight %}

---

- Vérifiez s'il existe des pods déployés dans le namespace `kube-system` :
{% highlight shell %}
kubectl get pods -n kube-system
{% endhighlight %}

- Exemple de sortie :
{% highlight plaintext %}
% kubectl get pods -n kube-system    
NAME                                                       READY   STATUS    RESTARTS   AGE
coredns-7c65d6cfc9-76brc                                   1/1     Running   0          143m
coredns-7c65d6cfc9-dwrlq                                   1/1     Running   0          143m
etcd-multi-node-cluster-control-plane                      1/1     Running   0          143m
kindnet-g4x7d                                              1/1     Running   0          143m
kindnet-mzgc6                                              1/1     Running   0          143m
kindnet-vjp2j                                              1/1     Running   0          143m
kube-apiserver-multi-node-cluster-control-plane            1/1     Running   0          143m
kube-controller-manager-multi-node-cluster-control-plane   1/1     Running   0          143m
kube-proxy-cpbqm                                           1/1     Running   0          143m
kube-proxy-kdnl2                                           1/1     Running   0          143m
kube-proxy-lb2z2                                           1/1     Running   0          143m
kube-scheduler-multi-node-cluster-control-plane            1/1     Running   0          143m
{% endhighlight %}

#### 4.2.6. Obtenir des détails sur une ressource spécifique

- Obtenez des informations détaillées sur un nœud :
{% highlight shell %}
kubectl describe node <node-name>
{% endhighlight %}

- Exemple de sortie :

{% highlight plaintext %}
% kubectl describe node worker-node-1
Name:               worker-node-1
Roles:              <none>
Labels:             beta.kubernetes.io/arch=amd64
                    beta.kubernetes.io/os=linux
                    kubernetes.io/arch=amd64
                    kubernetes.io/hostname=worker-node-1
                    kubernetes.io/os=linux
Annotations:        kubeadm.alpha.kubernetes.io/cri-socket: unix:///run/containerd/containerd.sock
                    node.alpha.kubernetes.io/ttl: 0
                    volumes.kubernetes.io/controller-managed-attach-detach: true
CreationTimestamp:  Fri, 01 Jan 2025 10:00:00 +0100
Taints:             <none>
Unschedulable:      false
Lease:
  HolderIdentity:  worker-node-1
  AcquireTime:     <unset>
  RenewTime:       Fri, 01 Jan 2025 14:00:00 +0100
Conditions:
  Type             Status  LastHeartbeatTime                 LastTransitionTime                Reason                       Message
  ----             ------  -----------------                 ------------------                ------                       -------
  MemoryPressure   False   Fri, 01 Jan 2025 14:00:00 +0100   Fri, 01 Jan 2025 10:00:00 +0100   KubeletHasSufficientMemory   kubelet has sufficient memory available
  DiskPressure     False   Fri, 01 Jan 2025 14:00:00 +0100   Fri, 01 Jan 2025 10:00:00 +0100   KubeletHasNoDiskPressure     kubelet has no disk pressure
  PIDPressure      False   Fri, 01 Jan 2025 14:00:00 +0100   Fri, 01 Jan 2025 10:00:00 +0100   KubeletHasSufficientPID      kubelet has sufficient PID available
  Ready            True    Fri, 01 Jan 2025 14:00:00 +0100   Fri, 01 Jan 2025 10:00:37 +0100   KubeletReady                 kubelet is posting ready status
Addresses:
  InternalIP:  192.168.1.10
  Hostname:    worker-node-1
Capacity:
  cpu:                4
  ephemeral-storage:  500Gi
  hugepages-1Gi:      0
  hugepages-2Mi:      0
  hugepages-32Mi:     0
  hugepages-64Ki:     0
  memory:             8192Mi
  pods:               200
Allocatable:
  cpu:                4
  ephemeral-storage:  500Gi
  hugepages-1Gi:      0
  hugepages-2Mi:      0
  hugepages-32Mi:     0
  hugepages-64Ki:     0
  memory:             8192Mi
  pods:               200
System Info:
  Machine ID:                 a1b2c3d4e5f67890abcdef1234567890
  System UUID:                12345678-90ab-cdef-1234-567890abcdef
  Boot ID:                    87654321-fedc-ba98-7654-3210fedcba98
  Kernel Version:             6.1.0-20-generic
  OS Image:                   Ubuntu 22.04 LTS
  Operating System:           linux
  Architecture:               amd64
  Container Runtime Version:  containerd://1.6.12
  Kubelet Version:            v1.31.4
  Kube-Proxy Version:         v1.31.4
PodCIDR:                      10.100.0.0/24
PodCIDRs:                     10.100.0.0/24
ProviderID:                   kind://docker/cluster/worker-node-1
Non-terminated Pods:          (2 in total)
  Namespace                   Name                CPU Requests  CPU Limits  Memory Requests  Memory Limits  Age
  ---------                   ----                ------------  ----------  ---------------  -------------  ---
  kube-system                 kindnet-abcdef      100m (5%)     100m (5%)   50Mi (2%)        50Mi (2%)      3h32m
  kube-system                 kube-proxy-xyz123   0 (0%)        0 (0%)      0 (0%)           0 (0%)         3h32m
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  Resource           Requests   Limits
  --------           --------   ------
  cpu                100m (5%)  100m (5%)
  memory             50Mi (2%)  50Mi (2%)
  ephemeral-storage  0 (0%)     0 (0%)
  hugepages-1Gi      0 (0%)     0 (0%)
  hugepages-2Mi      0 (0%)     0 (0%)
  hugepages-32Mi     0 (0%)     0 (0%)
  hugepages-64Ki     0 (0%)     0 (0%)
Events:              <none>

{% endhighlight %}

---

- Obtenez des détails sur un pod :
{% highlight shell %}
kubectl describe pod <pod-name>
{% endhighlight %}

- Exemple de sortie :

{% highlight plaintext %}
% kubectl describe pod kube-proxy-abcde -n kube-system
Name:                 kube-proxy-abcde
Namespace:            kube-system
Priority:             2000001000
Priority Class Name:  system-node-critical
Service Account:      kube-proxy
Node:                 worker-node-1/192.168.1.5
Start Time:           Fri, 01 Jan 2025 09:00:00 +0100
Labels:               controller-revision-hash=abcdef12
                      k8s-app=kube-proxy
                      pod-template-generation=1
Annotations:          <none>
Status:               Running
IP:                   192.168.1.5
IPs:
  IP:           192.168.1.5
Controlled By:  DaemonSet/kube-proxy
Containers:
  kube-proxy:
    Container ID:  containerd://a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890
    Image:         registry.k8s.io/kube-proxy:v1.31.4
    Image ID:      docker.io/library/import-2024-12-16@sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
    Port:          <none>
    Host Port:     <none>
    Command:
      /usr/local/bin/kube-proxy
      --config=/var/lib/kube-proxy/config.conf
      --hostname-override=$(NODE_NAME)
    State:          Running
      Started:      Fri, 01 Jan 2025 09:00:01 +0100
    Ready:          True
    Restart Count:  0
    Environment:
      NODE_NAME:   (v1:spec.nodeName)
    Mounts:
      /lib/modules from lib-modules (ro)
      /run/xtables.lock from xtables-lock (rw)
      /var/lib/kube-proxy from kube-proxy (rw)
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-xyz12 (ro)
Conditions:
  Type                        Status
  PodReadyToStartContainers   True 
  Initialized                 True 
  Ready                       True 
  ContainersReady             True 
  PodScheduled                True 
Volumes:
  kube-proxy:
    Type:      ConfigMap (a volume populated by a ConfigMap)
    Name:      kube-proxy
    Optional:  false
  xtables-lock:
    Type:          HostPath (bare host directory volume)
    Path:          /run/xtables.lock
    HostPathType:  FileOrCreate
  lib-modules:
    Type:          HostPath (bare host directory volume)
    Path:          /lib/modules
    HostPathType:  
  kube-api-access-xyz12:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  3607
    ConfigMapName:           kube-root-ca.crt
    ConfigMapOptional:       <nil>
    DownwardAPI:             true
QoS Class:                   BestEffort
Node-Selectors:              kubernetes.io/os=linux
Tolerations:                 op=Exists
                             node.kubernetes.io/disk-pressure:NoSchedule op=Exists
                             node.kubernetes.io/memory-pressure:NoSchedule op=Exists
                             node.kubernetes.io/network-unavailable:NoSchedule op=Exists
                             node.kubernetes.io/not-ready:NoExecute op=Exists
                             node.kubernetes.io/pid-pressure:NoSchedule op=Exists
                             node.kubernetes.io/unreachable:NoExecute op=Exists
                             node.kubernetes.io/unschedulable:NoSchedule op=Exists
Events:                      <none>
{% endhighlight %}

Ces commandes constituent une première base pour explorer et gérer votre cluster Kubernetes. Une maîtrise approfondie de ces outils vous aidera à progresser rapidement dans votre apprentissage et à éviter des erreurs majeures lors de l’examen.

<hr class="hr-text" data-content="Conclusion">

## 5. Conclusion

Dans cet article, nous avons exploré des notions de base pour configurer et interagir avec un cluster Kubernetes. Nous avons couvert des concepts clés tels que l'architecture de Kubernetes, l'installation d'un cluster et du client `kubectl`, et son utilisation via des commandes de base. Ces compétences constituent une base pour approfondir votre compréhension de Kubernetes et réussir l'examen CKA.

### Prochaine Étape

> info ""
> Le prochain article de cette série se concentrera sur **les pods dans Kubernetes**, la plus petite unité déployable du système. Vous apprendrez ce qu'est un Pod, comment le créer, le gérer et interagir avec lui, tout en découvrant ses relations avec d'autres ressources du cluster.<br><br>
> Pour progresser dans votre apprentissage, il est essentiel de mettre en pratique régulièrement. N'hésitez pas à reproduire les commandes et configurations vues dans cet article sur un environnement de test. Une pratique continue renforcera votre maîtrise des concepts et développera votre confiance pour l'examen.<br><br>
> Bonne préparation et à bientôt pour le prochain chapitre de cette série !
