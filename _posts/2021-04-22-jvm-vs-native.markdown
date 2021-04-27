---
layout: post
title: JVM vs Native - Une comparaison efficace des performances
date: 2021-04-22 21:00:00 +0200
description: Comment comparer efficacement l'exécution d'une application sous JVM et en native - Un guide complet construit à partir de Java Spring Boot, Spring Native, WebFlux, Docker, Kubernetes, Prometheus et Grafana
img: jvm-vs-native.jpg
fig-caption: Photo de <a href="https://unsplash.com/@jtylernix?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Tyler Nix</a> sur <a href="https://unsplash.com/s/photos/surf?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [Spring-Boot, Spring-Native, Spring-WebFlux, GraalVM, Docker, Kubernetes, Prometheus, Grafana, Micoservices]
lang: fr
permalink: /jvm-vs-native/
---


Quand il s’agit de comparer les exécutions natives de JVM-HotSpot et GraalVM, 
il est souvent difficile de décider de l’architecture et de la technologie de l’application à tester et même de ce qu’il faut mesurer.

Récemment, je suis tombé sur un cours de formation intéressant sur [containers and orchestration](https://github.com/jpetazzo/container.training){:target="_blank" rel="noopener noreferrer nofollow"} 
écrit par Jérôme Petazzoni. Il utilise un tas d’applications Python et Ruby en interaction encapsulées dans des conteneurs Docker. Ils agissent comme 
un maillage de microservices et la mesure du nombre de cycles terminés par seconde fournit une bonne estimation de la 
efficacité du système. Le fait de pouvoir jouer avec le nombre de conteneurs 
se produit réellement.

En suivant activement les développements `Spring Native`, j’ai donc décidé de porter son application de démonstration en Java en utilisant
les dernières versions de développement de `Spring Boot` et de la programmation réactive `WebFlux`.

> info "Code source"
> Toutes les sources sont conservées sur <https://github.com/scalastic/hotspot-vs-native>{:target="_blank" rel="noopener noreferrer nofollow"}

<hr class="hr-text" data-content="Table">

* TOC
{:toc}

<hr class="hr-text" data-content="Demonstration">

## La démo

### Objectif

L’objectif principal de cette démonstration est de modifier la configuration des ressources des microservices et de voir comment elle affecte le
exécution de l’application.

Quels sont nos leviers d’action?
- Tout d’abord, nous pourrions facilement jouer avec le **nombre de conteneurs** exécutant chaque
microservice.
- Deuxièmement, les microservices basés sur Java sont construits sur deux types qui peuvent être facilement commutés : **Basé sur la JVM** et **Natif**.

Alors on y va.

### Exigences

Pour mettre en œuvre cette solution, nous aurons besoin :
- Un groupe **Kubernetes**
- **Prometheus**, **Grafana**
- **Métriques** provenant de nos microservices
- **Bytecode** et **native** pour les applications Java

Eh bien, ce n’est pas grand-chose et cela existe déjà:

- ***Spring Boot*** et **Micrometer*** permettent l’exposition aux métriques des applications Java (regardez le [HasherHandler.java](https://github.com/scalastic/hotspot-vs-native/blob/main/hasher-java/src/main/java/io/scalastic/jvmvsnative/hasher/HasherHandler.java){:target="_blank" rel="noopener noreferrer nofollow"} code comme exemple)
- Le code Python instrumenté avec la bibliothèque **prometheus_client*** peut exposer les métriques à Prometheus (voir [worker.py](https://github.com/scalastic/hotspot-vs-native/blob/main/worker/worker.py){:target="_blank" rel="noopener noreferrer nofollow"} exemple)
- J’ai expliqué et scénarisé une installation complète de pile Kubernetes dans un article précédent : [Installer localement Kubernetes, Prometheus et Grafana]({{site.baseurl}}/install-kubernetes-prometheus-grafana/)
- ***Spring Boot Native*** peut construire en natif ou en Bytecode toute application Java

> info "Versions de Spring" 
> 
> Nous utiliserons les dernières versions de développement de Spring Experimental stack car il corrige continuellement les bogues et 
> améliorer les performances. Cependant, vous devez garder à l’esprit qu’il s’agit toujours d’une version Beta et ne représente pas une dernière étape :
> - Ressort 2.5.0-RC1
> - Spring Native `0.10.0-SNAPSHOT’

<hr class="hr-text" data-content="Architecture de l'application">

## Architecture d’application

![Application Architecture]({{site.baseurl}}/assets/img/application-architecture.jpg)

L’application est composée de 4 microservices :
- « worker » l’orchestrateur d’algorithmes [***Python***] qui obtient « 1 » un nombre aléatoire, « 2 » le hacher et « 3 » incrémenter un compteur dans la base de données redis.
- « rng » le générateur de nombres aléatoires [***Spring Boot***]
- « hasher » le processeur de hachage [***Spring Boot***]
- « redis » la base de données enregistrant chaque cycle d’exécution complet

<hr class="hr-text" data-content="Build">

## Build de l'appli

Le but de ces compilations est de produire une image Docker pour chaque microservice. Pour les compilations basées sur Java, il y aura deux images : 
une image ***JVM** et l’autre **native****.

> note "Facultatif"
> 
> J’ai mis ces informations dans un registre public sur Docker Hub pour que vous n’ayez même pas à vous soucier de ces constructions.

### Exigences

Toutefois, si vous souhaitez **créer** l’application, vous devrez installer :
- [GraalVM 21.1.0 basé sur Java 11](https://www.graalvm.org/docs/getting-started/#install-graalvm){:target="_blank" rel="noopener noreferrer nofollow"}
- [GraalVM Native Images](https://www.graalvm.org/docs/getting-started/#native-images){:target="_blank" rel="noopener noreferrer nofollow"}
- [Docker](https://www.docker.com/products/docker-desktop){:target="_blank" rel="noopener noreferrer nofollow"}

### La façon facile

> warning "Note"
> - Il devrait fonctionner sur les systèmes basés sur **Linux** et **macOS** - *et sur **Windows** avec quelques petites modifications*
> - Cela prendra du temps....... 10-20 min en fonction de votre connexion internet et de votre processeur ! C’est le prix à payer pour compiler du code natif.

Pour ce faire, exécutez ce script dans la racine du projet :
{% highlight Bash %}
./build_docker_images.sh
{% endhighlight %}


### L'autre façon

> info "Info"
> 
> Ce sont les commandes contenues dans le script - juste pour synthétiser.


- Pour une application **non-java**, exécuter :

{% highlight Bash %}
docker build -t app_docker_tag> . /app_dir>
{% endhighlight %}

- Pour une image **basée sur la JVM** :

{% highlight Bash %}
cd app_dir>
mvn clean package
docker build -t app_docker_tag> .
{% endhighlight %}

- Pour une image **native Java** :

{% highlight Bash %}
cd app_dir>
mvn spring-boot:build-image
{% endhighlight %}

### Sans construction du tout

Vous pouvez extraire des images pré-compilées de Docker Hub en saisissant :

{% highlight Bash %}
docker pull jeanjerome/rng-jvm:1.0.0
docker pull jeanjerome/hasher-jvm:1.0.0
docker pull jeanjerome/worker-python:1.0.0
docker pull jeanjerome/rng-native:1.0.0
docker pull jeanjerome/hasher-native:1.0.0
{% endhighlight %}

### Répertorier vos images locales

Une fois les étapes ci-dessus appliquées,lister vos images locales :

{% highlight Bash %}
images docker
{% endhighlight %}

Vous devriez voir ces images dans votre registre local:
{% highlight Bash %}
REPOSITORY                TAG        IMAGE ID       CREATED             SIZE
rng-jvm                   1.0.0      f4bfdacdd2a1   4 minutes ago       242MB
hasher-jvm                1.0.0      ab3600420eab   11 minutes ago      242MB
worker-python             1.0.0      e2e76d5f8ad4   38 hours ago        55MB
hasher-native             1.0.0      629bf3cb8760   41 years ago        82.2MB
rng-native                1.0.0      68e484d391f3   41 years ago        82.2MB
{% endhighlight %}

> info "Note"
> 
> La date de création des images natives semblent erronées. Ce n’est pas le cas, l’explication est ici : 
> [Time Travel with Pack] (https://medium.com/buildpacks/time-travel-with-pack-e0efd8bf05db){:target="_blank" rel="noopener noreferrer nofollow"}

<hr class="hr-text" data-content="Configuration Kubernetes">

## Configurer Kubernetes

Tout d’abord, nous devons définir la configuration Kubernetes de notre application et configurer Grafana pour surveiller précisement les métriques.

### Architecture de la stack Kubernetes

Voyons comment installer ces microservices dans notre cluster kubernetes.

Pour rappel :
- L’architecture de l’application est déployée dans un espace de nom dédié, « demo »
- Les outils de suivi se trouvent dans l’espace de nom « monitoring ».

![Kubernetes Architecture]({{site.baseurl}}/assets/img/kubernetes-architecture.jpg)

1. Nous voulons gérer le nombre de ~~conteneurs~~ - pods dans ce cas - par microservice. Nous pourrions vouloir 
augmenter automatiquement ce nombre en fonction des métriques. Nous aimerions également changer l’image du pod, en passant d’une image pour JVM à une image native sans avoir besoin de tout redéployer... Une telle ressource Kubernetes 
existe déjà : [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/){:target="_blank" rel="noopener noreferrer nofollow"}

2. Nous voulons que nos microservices communiquent entre eux dans le cluster Kubernetes. C’est le travail de 
[Service](https://kubernetes.io/docs/concepts/services-networking/){:target="_blank" rel="noopener noreferrer nofollow"} ressource.

3. La base de données Redis n’a pas besoin d’être accessible de l’extérieur, mais seulement de l’intérieur : c’est déjà fait par le [ClusterIP](https://kubernetes.io/docs/concepts/services-networking/service/){:target="_blank" rel="noopener noreferrer nofollow"} qui est le type de service par défaut dans Kubernetes.

4. Nous voulons également surveiller les métriques de l’application sur Grafana via Prometheus : [un bon descriptif détaillé](https://developer.ibm.com/technologies/containers/tutorials/monitoring-kubernetes-prometheus/){:target="_blank" rel="noopener noreferrer nofollow"}

Jetez un coup d’œil à l’extrait _kube/k8s-app-jvm.yml qui montre la configuration des ressources du microservice Java de Hasher :

<details>
<summary>Extrait de _kube/k8s-app-jvm.yml</summary>

{% highlight yaml %}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hasher
  namespace: demo
  labels:
    app: hasher
spec:
  replicas: 1
  selector:
    matchLabels:
      app: hasher
  template:
    metadata:
      name: hasher
      labels:
        app: hasher
    spec:
      containers:
        - image: hasher-jvm:1.0.0
          imagePullPolicy: IfNotPresent
          name: hasher
          ports:
            - containerPort: 8080
              name: http-hasher
              protocol: TCP
          readinessProbe:
            failureThreshold: 3
            httpGet:
              path: /actuator/health
              port: 8080
              scheme: HTTP
            initialDelaySeconds: 10
            periodSeconds: 30
            successThreshold: 1
            timeoutSeconds: 2
---
apiVersion: v1
kind: Service
metadata:
  name: hasher
  namespace: demo
  labels:
    app: hasher
  annotations:
    prometheus.io/scrape: 'true'
    prometheus.io/scheme: http
    prometheus.io/path: /actuator/prometheus
    prometheus.io/port: '8080'
spec:
  ports:
    - port: 8080
      protocol: TCP
      targetPort: http-hasher
  selector:
    app: hasher
{% endhighlight %}

</details>

<hr class="hr-text" data-content="Grafana">

## Configurer le dashboard Grafana

- Connectez-vous à votre interface Grafana 
> info ""
> Si vous avez suivi mon article précédent [Installer localement Kubernetes, Prometheus et Grafana]({{site.baseurl}}/install-kubernetes-prometheus-grafana/), vous pouvez vous connecter à Grafana à l'adresse [http://localhost:3000/](http://localhost:3000/)
- Importer le tableau de bord à partir de la définition JSON `_grafana/demo-dashboard.json’ à partir de ce repo
- Afficher le tableau de bord

Vous devriez voir un tableau de bord vide comme suit :

![Tableau de bord Demo Grafana vide]({{site.baseurl}}/assets/img/grafana-demo-empty.png)


### Description du tableau de bord de démonstration

![Description du tableau de bord Demo Grafana]({{site.baseurl}}/assets/img/grafana-demo-description.png)

Le tableau de bord de démonstration **** de Grafana est composé de trois lignes (étiquetées de « A » à « C »), une pour chaque microservice. 
(Worker, Random Number Generator -RNG- and Hasher) ainsi que des métriques (numérotées de « 1 » à « 4 »).

- La colonne 1 représente le nombre de pods en cours d’exécution et la « vitesse de traitement » (fonctionnellement parlant) sont représentés.
- La colonne 2 indique, tout d'abord, sur la ligne A, « l'historique de la vitesse de traitement » et dans les cases B et C, la « latence des requêtes » des microservices « RNG » et « Hasher » sous-jacents.
- Les cellules 3 affichent la consommation de CPU des « pods ».
- Les cellules 4 surveillent la consommation de RAM des « pods ».

<hr class="hr-text" data-content="Démarrage">

## Démarrer l’application

Dans cette première étape, toutes les Replicas de microservices sont configurées avec 1 pod, et les microservices basés sur Java s’exécutent dans une JVM.
Tout cela sera également créé dans un espace de noms « demo ».

- Pour démarrer les microservices de l’application, appliquer cette configuration au cluster :
{% highlight Bash %}
kubectl apply -f _kube/k8s-app-jvm.yml
{% endhighlight %}

Vous devriez voir :
{% highlight Bash %}
namespace/demo created
deployment.apps/hasher created
service/hasher created
deployment.apps/rng created
service/rng created
deployment.apps/redis created
service/redis created
deployment.apps/worker created
service/worker created
{% endhighlight %}

- Visualisez le démarrage des pods dans Grafana:

  ![Grafana dashboard starting app]({{site.baseurl}}/assets/img/grafana-demo-starting-app.png)

> note "Résultat"
> 
> - La métrique de vitesse, située dans la première cellule de la première ligne, nous donne une mesure de base de l’efficacité de notre application : 
> '3,20' cycles/s.
> 
> - Suivant les ressources de votre cluster Kubernetes, vous pouvez obtenir un autre résultat.

<hr class="hr-text" data-content="Playing">

## Jouer avec la configuration de Kubernetes

### Aperçu

- Voyons déroulement du déploiement en saisissant :
{% highlight Bash %}
kubectl get deployment -n demo
{% endhighlight %}

{% highlight Bash %}
NAME     READY   UP-TO-DATE   AVAILABLE   AGE
hasher   1/1     1            1           13m
redis    1/1     1            1           13m
rng      1/1     1            1           13m
worker   1/1     1            1           13m
{% endhighlight %}

### Augmenter le nombre de cosses

- Faire passer le module « worker » à « 2 » : 

{% highlight Bash %}
kubectl scale deployment worker --replicas=2 -n demo
{% endhighlight %}

Ce qui revient :
{% highlight Bash %}
déploiement.apps/worker à l’échelle
{% endhighlight %}

### Incidence sur la demande

- Jetons un coup d’œil au tableau de bord de Grafana :

![Grafana dashboard 2 workers]({{site.baseurl}}/assets/img/grafana-demo-2-workers.png)

> note "Résultats"
> 
> Vous remarquerez que le processus de demande augmente de « 2 ».


### Augmentez encore le nombre de cosses

- Essayons de passer à 10 travailleurs :

{% highlight Bash %}
kubectl scale deployment worker --replicas=10 -n demo
{% endhighlight %}

![Grafana dashboard 10 workers]({{site.baseurl}}/assets/img/grafana-demo-10-workers.png)

> note "Résultats"
> 
> La vitesse du processus augmente, mais n’atteint pas exactement 10 fois plus : la latence des 2 microservices, rng et hasher, a légèrement augmenté.

- Augmentons le nombre de « hachoirs » et de « gousses » : 

{% highlight Bash %}
kubectl scale deployment hasher rng --replicas=4 -n demo
{% endhighlight %}
![Tableau de bord Grafana 4 RNGs & Hashers]({{site.baseurl}}/assets/img/grafana-demo-4-rng-hasher.png)

Ou plus encore :
{% highlight Bash %}
kubectl scale deployment hasher rng --replicas=5 -n demo
{% endhighlight %}

> note "Résultats"
> 
> Pour ces 2 microservices, l’augmentation du nombre de pods réduit leur latence, mais reste un peu au-dessus de leurs valeurs initiales :
> un autre facteur influe sur l’application (?)

### Passer à l’application native

- Remplacer les images basées sur jvm par des images natives en mettant à jour les déploiements avec le déploiement :
{% highlight Bash %}
kubectl set image deployment/hasher hasher=hasher-native:1.0.0 -n demo
kubectl set image deployment/rng rng=rng-native:1.0.0 -n demo
{% endhighlight %}

- Surveiller le déploiement :
{% highlight Bash %}
Déploiement du déploiement kubectl/hasher -n demo
{% endhighlight %}
- Et le tableau de bord Grafana :

![Grafana dashboard native RNGs & Hashers]({{site.baseurl}}/assets/img/grafana_demo_native_rng_hasher.png)

> note "Résultats"
>
> **À propos de la latence**
> - Aucun changement pour la réactivité des microservices : bien sûr, le code est trop simple pour bénéficier d’une construction native.
> 
> **À propos de l’utilisation de l’UC**
> - L’utilisation du CPU basé sur la JVM a tendance à diminuer avec le temps. Ceci est dû au compilateur HotSpot 'C2' qui produit très
> le code natif optimisé à long terme.
> - En revanche, l’utilisation du processeur natif est faible dès le départ.
> 
> **À propos de l’utilisation de la RAM**
> - Étonnamment les applications natives utilisent plus de mémoire que celles basées sur JVM : Je ne peux pas expliquer que réduire l’empreinte de
> les applications Java natives est l’un des avantages revendiqués par la communauté.
> - Est-ce à cause du Spring Native encore en version Beta, ou d’une fuite de mémoire dans l’implémentation ?

<hr class="hr-text" data-content="Nettoyage">

## Nettoyer tout

Pour supprimer simplement l’application et tous ses microservices, saisissez :
{% highlight Bash %}
kubectl delete -f _kube/k8s-app-jvm.yml 
{% endhighlight %}
qui supprimera toutes les configurations Kubernetes créées précédemment :
{% highlight Bash %}
namespace "demo" deleted
deployment.apps "hasher" deleted
service "hasher" deleted
deployment.apps "rng" deleted
service "rng" deleted
deployment.apps "redis" deleted
service "redis" deleted
deployment.apps "worker" deleted
service "worker" deleted
{% endhighlight %}

<hr class="hr-text" data-content="Conclusion">

## Conclusion

Nous avons appris comment mesurer une station locale afin de recueillir des mesures et de mesurer les impacts de la configuration de Kubernetes.

Cependant, nous n’obtenons pas les résultats escomptés dans le contexte des applications natives. Une explication pourrait être un manque de la version Spring Beta : Spring Native vient de passer à la version 0.10.0-SNAPSHOT et c’est précisément la version où des améliorations de performance sont prévues. Je vais contacter l’équipe de Spring Boot pour leur demander leur avis.

<hr class="hr-text" data-content="Que faire ensuite ?">

## Quelle est la prochaine étape?

### Qu’est-ce qui manque pour une évaluation plus réaliste?

- La configuration de Kubernetes doit toujours inclure une limite de ressources (et aussi une requête) qui n’a pas été effectuée dans cette démo.
- J’aurais pu utiliser [Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/){:target="_blank" rel="noopener noreferrer nofollow"}
  (HPA) et encore mieux HPA sur les métriques personnalisées (voir [ce post](https://itnext.io/horizontal-pod-autoscale-with-custom-metrics-8cb13e9d475){:target="_blank" rel="noopener noreferrer nofollow"} 
  pour plus de détails). Je souhaite que j’ai trouvé quelques Scaler automatique qui règlementent toutes les gousses dans une application pour maximiser un 
  métrique mais rien à propos d’une telle chose... Avez-vous déjà entendu quelque chose comme ça?
  

### Liens utiles

Voici quelques liens pour une lecture plus approfondie :

- Formation de Jérôme Patazzoni sur les conteneurs : <https://github.com/jpetazzo/container.training>{:target="_blank" rel="noopener noreferrer nofollow"}
- Kubernetes Concepts : <https://kubernetes.io/docs/concepts/>{:target="_blank" rel="noopener noreferrer nofollow"}
- Surveillance de vos applications dans Kubernetes avec Prometheus et Spring Boot : <https://developer.ibm.com/technologies/containers/tutorials/monitoring-kubernetes-prometheus/>{:target="_blank" rel="noopener noreferrer nofollow"}
- Client Prometheus Python : <https://github.com/prometheus/client_python>{:target="_blank" rel="noopener noreferrer nofollow"}
- Mesures Prometheus personnalisées pour les applications exécutées dans Kubernetes : <https://zhimin-wen.medium.com/custom-prometheus-metrics-for-apps-running-in-kubernetes-498d69ada7aa>{:target="_blank" rel="noopener noreferrer nofollow"}


Eh bien, c’est votre tour de jouer avec des applications natives maintenant!

Cheers...

> info "Et maintenant"
> * Cet article vous a plu? N’hésitez pas à le dire à Disqus pour que le site progresse en visibilité
> * Vous avez une question? Posez-la et je vous répondrai dès que possible
> 
> Merci!
>
>