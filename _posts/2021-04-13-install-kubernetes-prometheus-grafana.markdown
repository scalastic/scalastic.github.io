---
layout: post
title: Installez Kubernetes, Prometheus et Grafana en local
date: 2021-04-13 17:51:20 +0200
description: Comment installer Kubernetes, Prometheus et Grafana sur macOS localement avec Docker Desktop
img: install-kubernetes.jpg 
fig-caption: Photo de <a href="https://unsplash.com/@safesolvent?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Martin Reisch</a> sur <a href="https://unsplash.com/s/photos/square-pattern?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [Kubernetes, Docker, Prometheus, Grafana, macOS]
lang: fr
permalink: /install-kubernetes-prometheus-grafana/
status: finished
---

Parfois, il peut être utile pour les développeurs d’avoir des outils de monitoring efficaces, installés sur son cluster local Kubernetes. Le choix évident serait d’aller vers Prometheus et Grafana, deux outils très reconnus.

Et c’est là que les ennuis commencent.

Dans cet article, je vais vous montrer comment installer avec succès une plate-forme Kubernetes complète, sur votre machine locale, en particulier sur macOS.

> info "Code source"
> Tous les scripts sont conservés dans [https://github.com/scalastic/local-k8s-installation](https://github.com/scalastic/local-k8s-installation){:target="_blank" rel="noopener noreferrer nofollow"}


<hr class="hr-text" data-content="Table">

* TOC
{:toc}

<hr class="hr-text" data-content="Notice">

## Notice

- Cette procédure est destinée à fonctionner sur **macOS** mais devrait aussi fonctionner sur n’importe quel autre hôte. Cependant, je n’ai pas été en mesure de le tester. 
- Les problématiques sont plus liées à la distribution Kubernetes (**Docker Desktop**) qu'à l’OS lui-même.

<hr class="hr-text" data-content="Kubernetes">

## Kubernetes

- Nous utiliserons **Docker Desktop** qui est livré avec un cluster Kubernetes prêt à l’emploi.

1. Téléchargez l’installateur à [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop){:target="_blank" rel="noopener noreferrer nofollow"} et suivez les instructions.

2. Une fois installé, activez kubernetes dans le volet ***Préférences*** / ***Kubernetes*** / ***Activer Kubernetes***.

3. Vous devriez maintenant voir tous les composants **Docker Desktop** dans le volet ***About*** inclus Kubernetes:
<figure class="article">
  {% picture {{site.baseurl}}/assets/img/docker-desktop.png --alt L'interface de Docker Desktop avec la version de ses composants %}
  <figcaption>L'interface de Docker Desktop avec la version de ses composants</figcaption>
</figure>

- Collectez les informations de base de votre cluster pour vérifier que tout fonctionne bien :
{% highlight Zsh %}
% kubectl cluster-info
{% endhighlight %}


{% highlight Zsh %}
% kubectl get nodes
{% endhighlight %}

- Ou même:
  
{% highlight Zsh %}
% kubectl get all -A
{% endhighlight %}

> info "Le paramètre -A"
> 
> Depuis Kube `1.14`, nous n’avons plus besoin d’utiliser les `--all-namespaces` ! Alors ne le faites plus...


<hr class="hr-text" data-content="Dashboard">

## Dashboard

**Dashboard** est une interface utilisateur web de l'API k8s et fournit un moyen facile de visualiser et déboguer les objets kube. Vous pouvez en savoir plus sur **Dashboard** à l'adresse [https://github.com/kubernetes/dashboard](https://github.com/kubernetes/dashboard){:target="_blank » rel="noopener noreferrer nofollow"}


Par défaut, **Dashboard** est protégé par un jeton, et chaque fois que vous y accéderez, il vous sera demandé d’en fournir un. Cela peut  
vraiment être ennuyeux à long terme. Heureusement, **Dashboard** vous permet de contourner la page de connexion en ajoutant `--enable-skip-login` à la 
configuration.

> info "Note"
> Le fichier de configuration fourni est patché avec cette instruction ([ligne 198](https://github.com/scalastic/local-k8s-installation/blob/7b0857d64475a1b4c0d1f3680f8d48f076211de8/k8s/dashboard-v2.2.0-recommended.yaml#L198){:target="_blank" rel="noopener noreferrer nofollow"})


Pour déployer **Dashboard** - sans authentification - exécutez la commande suivante :

{% highlight Zsh %}
% kubectl apply -f ./k8s/dashboard-v2.2.0-recommended.yaml
{% endhighlight %}

Accédez ensuite à votre tableau de bord depuis votre poste de travail local en créant un canal sécurisé vers votre cluster Kubernetes. Pour faire 
donc, exécuter la commande suivante:


{% highlight Zsh %}
% kubectl proxy
{% endhighlight %}

L'adresse est à présent:

<a href="http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/" rel="noopener noreferrer nofollow" target="_blank" data-proofer-ignore>http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/</a>


> info "Conseils"
> Je sais alors n’oubliez pas d'enregistrer l’URL!

Vous verrez d’abord cette page de connexion :

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/dashboard-first-access.jpg --alt Ecran de login du Dashboard %}
  <figcaption>Ecran de login du Dashboard</figcaption>
</figure>

Il suffit d’appuyer sur le bouton ***skip*** pour contourner l’authentification.

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/dashboard-index.jpg --alt Page principale de Dashboard %}
  <figcaption>Page principale de Dashboard</figcaption>
</figure>

<hr class="hr-text" data-content="Metrics-Server">

## Metrics Server

**Metrics-Server** est utilisé pour extraire les mesures des composants k8s et les expose à l’API k8s. Le repo officiel est [https://github.com/kubernetes-sigs/metrics-server](https://github.com/kubernetes-sigs/metrics-server){:target="_blank" rel="noopener noreferrer nofollow"}

**Metrics Server** sert à mesurer les informations de base : CPU et RAM. L’important est que ***Horizontal Pod Autoscaler*** utilise cette API pour collecter des mesures. Il s’agit d’un composant de niveau cluster qui 
récolte périodiquement les mesures de tous les nœuds Kubernetes suivis par Kubelet. Une fois installé, **Dashboard** affiche automatiquement ces mesures.

> info "Note"
> Pour permettre à **Metrics Server** de collecter ses données sur https, le script original a été modifié pour accepter les connexions TLS non sécurisées en ajoutant `- --kubelet-insecure-tls` at [line 133](https://github.com/scalastic/local-k8s-installation/blob/7b0857d64475a1b4c0d1f3680f8d48f076211de8/k8s/metrics-server-components-v0.4.2.yaml#L133){:target="_blank" rel="noopener noreferrer nofollow"}.


Appliquez la configuration en entrant :
{% highlight Zsh %}
% kubectl apply -f k8s/metrics-server-components-v0.4.2.yaml
{% endhighlight %}

Lors du rechargement du **Dashboard**, vous devriez maintenant voir les utilisations du processeur et de la mémoire (après un certain temps) 🌈

Vous pouvez essayer la section ***Pods***, c’est ma préférée! 

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/dashboard-with-metrics.jpg --alt Une page du tableau de bord avec les mesures. C'est magnifique ! %}
  <figcaption>Une page du tableau de bord avec les mesures. C'est magnifique !</figcaption>
</figure>

<hr class="hr-text" data-content="Kube State Metrics">

## Kube State Metrics

Contrairement à **Metrics Server**, **Kube State Metrics** se concentre sur la génération de nombreuses mesures à partir de l’état des objets Kubernetes 
(par exemple, les mesures basées sur des Deployments, des Replicas, des Pods, etc.). Pour cela, il gère, en mémoire, une photo des états de Kubernetes
et génère de nouvelles mesures basées sur celle-ci.

- L'installation de **Kube State Metrics** permet l’accès à ces mesures à partir de systèmes de surveillance tels que **Prometheus**, notre préoccupation ici.

- Pour installer **Kube State Metrics**, lancez la commande suivante :
{% highlight Zsh %}
% kubectl apply -f k8s/kube-state-metrics-v2.0.0-rc.1.yaml
{% endhighlight %}


<hr class="hr-text" data-content="Prometheus">

## Prometheus


**Prometheus** est un système de collecte, d’interrogation, de surveillance et d’alerte. Il est utile quand il s’agit de :
- Collecter des données identifiées par un nom de métrique
- Stocker les séries chronologiques en mémoire et sur disque pour plus d’efficacité
- Lancer des notifications et des alertes en fonction des requêtes de données

La documentation complète est accessible à partir de [https://prometheus.io](https://prometheus.io){:target="_blank" rel="noopener noreferrer nofollow"}.

Les développeurs de **Prometheus** fournissent des binaires et des images Docker des composants de **Prometheus**. 
Avec un peu d’huile de coude, il est possible de créer un fichier de configuration k8s avec tout ce dont nous avons besoin : accès aux ressources, rôle dédié, configuration, déploiement et exposition de service.

Pour installer la configuration **Prometheus**, exécutez la commande :
{% highlight Zsh %}
% kubectl apply -f k8s/prometheus.yaml
{% endhighlight %}

Vous pouvez accéder à l'interface de **Prometheus** à l'adresse <a href="http://localhost:30000/" rel="noopener noreferrer nofollow" target="_blank" data-proofer-ignore>http://localhost:30000/</a> ... mais attendez de voir la suite !


<hr class="hr-text" data-content="Grafana">

## Grafana

**Grafana** ([https://grafana.com/grafana/](https://grafana.com/grafana/){:target="_blank" rel="noopener noreferrer nofollow"}) vous permet d' « interroger, visualiser et alerter en fontion des mesures au moyen d'une interface utilisateur puissante* » comme le dit le site. 

> info "C'est ce que fait déjà Prometheus !?"
> Clarifions : dans la pratique, vous développerez votre requête dans **Prometheus** puis la lancerez dans **Grafana**.

Pour configurer la source de données **Prometheus** et installer **Grafana**, exécutez les commandes :
{% highlight Zsh %}
% kubectl apply -f k8s/grafana-datasource.yaml
% kubectl apply -f k8s/grafana.yaml
{% endhighlight %}

**Grafana** va écouter sur <a href="http://localhost:3000/" rel="noopener noreferrer nofollow" target="_blank" data-proofer-ignore>http://localhost:3000/</a>. Le logon par défaut est ***admin*** / ***admin***.

### Importation du dashboard Grafana

- Par défaut, **Grafana** n’a rien de spécifique et vous devrez configurer un tableau de bord. Heureusement, vous pouvez en importer un, déjà pré-configuré,  via l’interface de **Grafana**. La source principale de tableaux de bord se trouve à l'adresse [https://grafana.com/grafana/dashboards](https://grafana.com/grafana/dashboards){:target="_blank" rel="noopener noreferrer nofollow"}.

- J’en ai fait un spécifique à un cluster kubernetes local, vous le trouverez ici [Dashboard model](https://raw.githubusercontent.com/scalastic/local-k8s-installation/main/k8s/Docker%20Desktop%20Kubernetes%20All-in-one-1618321310777.json){:target="_blank" rel="noopener noreferrer nofollow"}.

Il ressemble à cela - comme vous pouvez le voir, l’interface graphique **Grafana** offre de nombreuses possibilités - contrairement à **Prometheus**:

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/grafana-ui.jpg --alt L'interface Grafana après une installation complète. Woah! %}
  <figcaption>L'interface Grafana après une installation complète. Woah!</figcaption>
</figure>

> info "👨🏻‍💻"
> 
> Configurer un tableau de bord dans Grafana peut être long et chronophage. La collecte de mesures dépend de votre hôte, de l'utilisation de VM ou solution de virtualisation et du système d’exploitation sur votre pod. Vous devrez mettre les mains dans le cambouis...

Eh bien, c’est à votre tour de jouer avec cette stack maintenant!

Cheers...
