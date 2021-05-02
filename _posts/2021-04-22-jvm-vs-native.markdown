---
layout: post
title: JVM vs Native - Une réelle comparaison des performances
date: 2021-04-22 21:00:00 +0200
description: Comment réellement comparer l'exécution d'une application Java entre ses versions JVM et native - Un guide complet construit à partir de Java Spring Boot, Spring Native, WebFlux, Docker, Kubernetes, Prometheus et Grafana
img: jvm-vs-native.jpg
fig-caption: Photo de <a href="https://unsplash.com/@jtylernix?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Tyler Nix</a> sur <a href="https://unsplash.com/s/photos/surf?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [Spring-Boot, Spring-Native, Spring-WebFlux, GraalVM, Docker, Kubernetes, Prometheus, Grafana, Micoservices]
lang: fr
permalink: /jvm-vs-native/
status: finished
---


Pour comparer l'exécution d'une application Java entre ses versions Bytecode (JVM) et native (GraalVM), il faut, tout d'abord, décider de son architecture et des framewoks à utiliser. Dans un deuxième temps, il faut aussi se demander ce que l'on va mesurer.

Récemment, je suis tombé sur un cours très intéressant, [containers and orchestration](https://github.com/jpetazzo/container.training){:target="_blank" rel="noopener noreferrer nofollow"}, de Jérôme Petazzoni. Il utilise différentes applications Python et Ruby qui entrent en interaction au moyen de conteneurs Docker. Ils agissent comme un maillage de microservices. L'efficacité du système est mesuré en fonction du nombre de traitements exécutés par seconde. 

Cela m'a semblé un bon exemple pour servir de base à ce comparatif en :
- Transposant le code en langage Java sous les frameworks Spring Boot / WebFlux et en utilisant Spring Native pour le build en Bytecode ou en natif,
- Jouant sur le nombre de conteneurs afin de faire varier la charge du système.

Voyons cela en détails.

> info "Code source"
> Toutes les sources sont conservées sur <https://github.com/scalastic/hotspot-vs-native>{:target="_blank" rel="noopener noreferrer nofollow"}

<hr class="hr-text" data-content="Table">

* TOC
{:toc}

<hr class="hr-text" data-content="Demonstration">

## Exigences

Pour mettre en œuvre cette solution, nous aurons besoin de :
1. Un cluster **Kubernetes** pour exécuter nos conteneurs,
1. Différentes **mesures des traitements** provenant des microservices
1. **Prometheus** et **Grafana** pour récolter et afficher ces mesures,
1. Une application Java compilable en **Bytecode** et en **natif**

Et bien, ce n’est pas grand-chose et cela existe déjà :

* Dans un article précédent, j'explique comment installer une stack complète Kubernetes, Prometheus et Grafana - [Installez Kubernetes, Prometheus et Grafana en local]({{site.baseurl}}/install-kubernetes-prometheus-grafana/),
* En intégrant **Micrometer** à une application Java **Spring Boot**, il est possible d'exposer les mesures de ses services - [HasherHandler.java](https://github.com/scalastic/hotspot-vs-native/blob/main/hasher-java/src/main/java/io/scalastic/jvmvsnative/hasher/){:target="_blank" rel="noopener noreferrer nofollow"},
* Pour une application Python, la bibliothèque **prometheus_client** permet aussi d'exposer des mesures - [worker.py](https://github.com/scalastic/hotspot-vs-native/blob/main/worker/worker.py){:target="_blank" rel="noopener noreferrer nofollow"},
* En configurant le POM Maven avec la dépendance `org.springframework.experimental:spring-native`, il est possible de compiler l'application aussi bien en Bytecode ou qu'en natif.


> info "Version de Spring" 
> 
> Ce sont les dernières versions en date de **Spring Experimental** qui seront utilisées pour développer nos microservices Java. En effet, elles corrigent et améliorent continuellement les bogues et les performances du build natif. Mais il faut bien garder à l'esprit qu’il s’agit de versions en Bêta :
> - Spring `2.5.0-RC1`
> - Spring Native `0.10.0-SNAPSHOT`
>


<hr class="hr-text" data-content="Architecture de l'application">

## Architecture d’application

Voyons de quoi est faite l'application:

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/application-architecture.jpg --alt L'architecture de l'application démo %}
  <figcaption>L'architecture de l'application démo</figcaption>
</figure>

L’application est composée de 4 microservices :
1. `worker` : l’orchestrateur d’algorithmes [***Python***] qui obtient `1` un nombre aléatoire, `2` le hacher et `3` incrémenter un compteur dans la base de données redis,
2. `rng` : le générateur de nombres aléatoires [***Java***],
3. `hasher` : le processeur de hachage [***Java***],
4. `redis` : la base de données qui enregistre un compteur de cycles de traitements.

<hr class="hr-text" data-content="Build">

## Build de l'appli

Le but de la compilation est de produire une image Docker par microservice. Pour les microservices Java, il y aura deux images, la première en ***Bytecode***, la seconde en **natif***.

> note "Facultatif"
> 
> J’ai mis ces images dans un registre public sur [Docker Hub](https://hub.docker.com/orgs/scalastic), vous pouvez donc passer cet étape de build.

### Exigences pour le build

Toutefois, si vous souhaitez créer ces images Docker, vous devrez installer :
- [GraalVM 21.1.0 basé sur Java 11](https://www.graalvm.org/docs/getting-started/#install-graalvm){:target="_blank" rel="noopener noreferrer nofollow"}
- [GraalVM Native Images](https://www.graalvm.org/docs/getting-started/#native-images){:target="_blank" rel="noopener noreferrer nofollow"}
- [Docker](https://www.docker.com/products/docker-desktop){:target="_blank" rel="noopener noreferrer nofollow"}

### La façon facile

> warning "Note"
> - Il devrait fonctionner sur des systèmes basés sur **Linux** et **macOS** - *et sur **Windows** avec quelques petites modifications
> - Cela va prendre du temps....... 10-20 min en fonction de votre connexion internet et de votre processeur ! C’est le prix à payer pour compiler du code natif.

Pour ce faire, exécutez ce script, à la racine du projet :
{% highlight Bash %}
./build_docker_images.sh
{% endhighlight %}


### Résumé des commandes exécutées


- Pour une application **non-java** :

{% highlight Bash %}
docker build -t <app_docker_tag> ./<app_dir>
{% endhighlight %}

- Pour une image **basée sur la JVM** :

{% highlight Bash %}
cd <app_dir>
mvn clean package
docker build -t <app_docker_tag> .
{% endhighlight %}

- Pour une image **native Java** :

{% highlight Bash %}
cd <app_dir>
mvn spring-boot:build-image
{% endhighlight %}

### A partir de Docker Hub

Vous pouvez rapatrier les images à partir de Docker Hub en saisissant :

{% highlight Bash %}
docker pull jeanjerome/rng-jvm:1.0.0
docker pull jeanjerome/hasher-jvm:1.0.0
docker pull jeanjerome/worker-python:1.0.0
docker pull jeanjerome/rng-native:1.0.0
docker pull jeanjerome/hasher-native:1.0.0
{% endhighlight %}

### Vérification

Pour lister vos images locales, entrez :

{% highlight Bash %}
images docker
{% endhighlight %}

Vous devriez voir au moins ces images dans votre registre local:
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
> [Time Travel with Pack](https://medium.com/buildpacks/time-travel-with-pack-e0efd8bf05db){:target="_blank" rel="noopener noreferrer nofollow"}

<hr class="hr-text" data-content="Kubernetes">

## Configuration de Kubernetes

Tout d'abord, nous devons définir la configuration kubernetes de notre application et indiquer à Prometheus où trouver les métriques.

### Architecture de la stack Kubernetes

Voyons comment installer ces microservices dans notre cluster kubernetes :
- L’architecture de l’application est déployée dans un espace de nom dédié, `demo`,
- Les outils de suivi se trouvent dans un autre espace de nom appelé `monitoring`.

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/kubernetes-architecture.jpg --alt Architecture de notre cluster Kubernetes %}
  <figcaption>Architecture de notre cluster Kubernetes</figcaption>
</figure>

1. Nous voulons gérer le nombre de ~~conteneurs~~ - pods dans ce cas - pour chaque microservice,
1. Nous souhaitons également pouvoir changer l’image du pod (Bytecode ou natif) sans avoir besoin de tout redéployer.

    => Une telle ressource Kubernetes existe déjà, [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/){:target="_blank" rel="noopener noreferrer nofollow"}


1. Nous avons besoin que nos microservices communiquent entre eux dans le cluster Kubernetes.

    => C’est le travail de la ressource [Service](https://kubernetes.io/docs/concepts/services-networking/){:target="_blank" rel="noopener noreferrer nofollow"}.


1. La base de données Redis n'a pas besoin d’être accessible de l’extérieur mais seulement de l’intérieur du cluster.

    => C’est déjà le cas car, par défaut, les Services Kubernetes sont de type [ClusterIP](https://kubernetes.io/docs/concepts/services-networking/service/){:target="_blank" rel="noopener noreferrer nofollow"}.


1. Nous voulons que les métriques de l’application soient collectés par Prometheus.

    => Voici [comment le configurer](https://developer.ibm.com/technologies/containers/tutorials/monitorin]g-kubernetes-prometheus/){:target="_blank" rel="noopener noreferrer nofollow"}



Jetez un coup d’œil à la configuration du microservice Hasher ci-dessous:
<details>
<summary>Configuration Kubernetes du microservices Hasher</summary>

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

## Configuration de Grafana

Pour afficher les metriques récoltés par Prometheus, Grafana a besoin de :
1. Une source de données vers Prometheus,
1. Un tableau de bord décrivant les métriques à afficher et sous quelle forme.

> info ""
> Si vous avez suivi mon article précédent [Installer localement Kubernetes, Prometheus et Grafana]({{site.baseurl}}/install-kubernetes-prometheus-grafana/), la source de données est déjà configurée et vous pouvez passer l'étape suivante. L'interface de Grafana est alors accessible à [http://localhost:3000/](http://localhost:3000/){:target="_blank" rel="noopener noreferrer nofollow"}

### Configuration de la source de données

Grafana utilise des fichiers au format YAML pour configurer une source de données. On peut le définir grâce à la ressources Kubernetes ConfigMap:

{% highlight yaml %}
apiVersion: v1
kind: Namespace
metadata:
  name: monitoring
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-datasources
  namespace: monitoring
data:
  prometheus.yaml: |-
    {
        "apiVersion": 1,
        "datasources": [
            {
               "access":"proxy",
                "editable": true,
                "name": "prometheus",
                "orgId": 1,
                "type": "prometheus",
                "url": "http://prometheus-service.monitoring.svc:8080",
                "version": 1
            }
        ]
    }
{% endhighlight %}

Reste à passer cette ressource à Grafana dans la définition de son Deployment:

{% highlight yaml %}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana
  namespace: monitoring
spec:
  replicas: 1
  template:
    spec:
      containers:
        - image: grafana/grafana:latest
          name: grafana
.../...
          volumeMounts:
            - mountPath: /etc/grafana/provisioning/datasources
              name: grafana-datasources
              readOnly: false
      volumes:
        - name: grafana
          emptyDir: {}
        - name: grafana-datasources
          configMap:
            defaultMode: 420
            name: grafana-datasources
{% endhighlight %}

### Configuration du tableau de bord

1. Connectez-vous à l'interface web de Grafana,
1. Importer le tableau de bord pré-défini [demo-dashboard.json](https://raw.githubusercontent.com/scalastic/hotspot-vs-native/main/_grafana/demo-dashboard.json),
1. Afficher le tableau de bord.

Vous devriez alors voir un tableau de bord vide comme celui-ci :

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/grafana-demo-empty.jpg --alt Le tableau de bord démo dans Grafana %}
  <figcaption>Le tableau de bord démo dans Grafana</figcaption>
</figure>

### Description du tableau de bord de démonstration

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/grafana-demo-description.jpg --alt Description du tableau de bord démo de Grafana %}
  <figcaption>Description du tableau de bord démo de Grafana</figcaption>
</figure>

* Les lignes du tableau (étiquetées de A à C) représentent les 3 microservices, respectivement, Worker, Random Number Generator -RNG- and Hasher.

* Les colonnes (numérotées de 1 à 4) représentent différents métriques:
  - Dans la colonne 1, on peut voir le nombre de pods en cours d’exécution ainsi que la vitesse des traitements
  - Dans la colonne 2 est affiché l'historique des vitesses de traitement, pour chaque microservice,
  - Dans la colonne 3 s'affiche la consommation de CPU de chaque pod,
  - Dans la colonne 4, la consommation de RAM de chaque pod.

<hr class="hr-text" data-content="Démarrage">

## Démarrage de l’application

Une configuration Kubernetes a été créée avec des Replicas de 1 pod pour chaque microservice et des images Java compilées en Bytecode.

- Pour démarrer l’application dans Kubernetes, entrez :

{% highlight Bash %}
kubectl apply -f _kube/k8s-app-jvm.yml
{% endhighlight %}


- Vous devriez voir en sortie :

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

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/grafana-demo-starting-app.jpg --alt Démarrage de l'application dans Grafana %}
  <figcaption>Démarrage de l'application dans Grafana</figcaption>
</figure>
  

> note "Résultat"
> 
> - La vitesse de traitement observée, située dans la cellule A1, nous donne une mesure de base de l’efficacité de notre application : `3,20` cycles/s.
> - En fonction des ressources allouées à votre espace, vous pouvez obtenir un résultat différent.

<hr class="hr-text" data-content="Playing">

## Modification de la configuration de Kubernetes

### Aperçu

- Voyons la situation actuelle du déploiement en entrant :
{% highlight Bash %}
kubectl get deployment -n demo
{% endhighlight %}

- Ce qui devrait envoyer :
{% highlight Bash %}
NAME     READY   UP-TO-DATE   AVAILABLE   AGE
hasher   1/1     1            1           13m
redis    1/1     1            1           13m
rng      1/1     1            1           13m
worker   1/1     1            1           13m
{% endhighlight %}

### Augmentez le nombre de pods

- Pour augmenter les pods du `worker` à `2` : 

{% highlight Bash %}
kubectl scale deployment worker --replicas=2 -n demo
{% endhighlight %}

- Ce qui renvoie :

{% highlight Bash %}
deployment.apps/worker scaled
{% endhighlight %}

### Incidence sur l'application

- Jetons un coup d’œil au tableau de bord de Grafana :

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/grafana-demo-2-workers.jpg --alt Visualisation des 2 workers dans Grafana %}
  <figcaption>Visualisation des 2 workers dans Grafana</figcaption>
</figure>

> note "Résultats"
> 
> Vous remarquez que la vitesse de l'application est multipliée par `x2`.


### Augmentez encore le nombre de pods

- Passons à 10 workers :

{% highlight Bash %}
kubectl scale deployment worker --replicas=10 -n demo
{% endhighlight %}

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/grafana-demo-10-workers.jpg --alt Visualisation des 10 workers dans Grafana %}
  <figcaption>Visualisation des 10 workers dans Grafana</figcaption>
</figure>

> note "Résultats"
> 
> La vitesse du processus augmente, mais n’atteint pas exactement 10 fois plus : la latence des 2 microservices, rng et hasher, qui a légèrement augmenté, explique cela.

- Augmentons le nombre de pods pour `hasher` et `rng` : 

{% highlight Bash %}
kubectl scale deployment hasher rng --replicas=5 -n demo
{% endhighlight %}

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/grafana-demo-4-rng-hasher.jpg --alt Visualisation des microservices RNG et Hasher dans Grafana %}
  <figcaption>Visualisation des microservices RNG et Hasher dans Grafana</figcaption>
</figure>

> note "Résultats"
> 
> - L’augmentation du nombre de pods de `hasher` et `rng` a réduit leur latence, mais elle reste tout de même un peu plus élevée qu'au début,
> - Un autre facteur est limitant mais nous ne voyons pas lequel dans les données affichées.

### Déployons la version native de l’application

- Remplacez l'image actuelle des pods par leur version native en mettant à jour leur Deployment :
{% highlight Bash %}
kubectl set image deployment/hasher hasher=hasher-native:1.0.0 -n demo
kubectl set image deployment/rng rng=rng-native:1.0.0 -n demo
{% endhighlight %}

- Surveillez le déploiement :
{% highlight Bash %}
kubectl rollout status deployment/hasher -n demo
{% endhighlight %}

- Et ouvrez le tableau de bord Grafana :

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/grafana_demo_native_rng_hasher.jpg --alt Visualisation du déploiement des images natives dans Grafana %}
  <figcaption>Visualisation du déploiement des images natives dans Grafana</figcaption>
</figure>

> note "Résultats"
>
> **La latence**
> - Aucun changement dans la réactivité des microservices: sans doute, le code est trop simple pour bénéficier d'un build native.
> 
> **L’utilisation de l’UC**
> - Avec le Bytecode, l’utilisation du CPU avait tendance à diminuer avec le temps. Cela était dû à l'action du compilateur HotSpot `C2` qui produit un code natif de plus en plus optimisé avec le temps.
> - En revanche, l’utilisation du processeur natif est faible dès le départ.
> 
> **L’utilisation de la RAM**
> - Étonnamment, les applications natives utilisent plus de mémoire que celles en Bytecode : c'est d'autant plus étonnant que la réduction de l'empreinte mémoire est l'un des avantages cités par la communauté.
> - Est-ce à cause des versions Bêta employées dans cette démo ou bien une fuite de mémoire dans l’implémentation ?

<hr class="hr-text" data-content="Nettoyage">

## Supprimons tout

- Pour supprimer simplement l’application et tous ses microservices, saisissez :
{% highlight Bash %}
kubectl delete -f _kube/k8s-app-jvm.yml 
{% endhighlight %}

- qui supprimera toutes les configurations Kubernetes créées précédemment :

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

Nous avons appris à installer une stack Kubernetes complète afin de pouvoir mesurer les métriques d'une application.

Cependant, nous n’obtenons pas les résultats escomptés dans le contexte des applications natives. Une explication pourrait être un manque de la version Spring Beta : Spring Native vient de passer à la version 0.10.0-SNAPSHOT et c’est précisément la version où des améliorations de performance sont prévues. 

Je vais ouvrir un ticket auprès de l’équipe de Spring Boot pour leur demander leur analyse.

<hr class="hr-text" data-content="Que faire ensuite ?">

## Quelle est la prochaine étape ?

### Qu’est-ce qui manque pour une évaluation encore plus réaliste ?

- La configuration de Kubernetes doit toujours inclure une limite de ressources ce qui n’a pas été effectué dans cette démo.
- J’aurais pu utiliser des [Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/){:target="_blank" rel="noopener noreferrer nofollow"} (HPA) et encore mieux des HPA avec des métriques personnalisées (lisez [ce post](https://itnext.io/horizontal-pod-autoscale-with-custom-metrics-8cb13e9d475){:target="_blank" rel="noopener noreferrer nofollow"} pour plus de détails). 

> info "Question"
> - J'aurais aimé trouver quelque chose sur des Scalers qui s'auto-régulent et capables de maximiser une métrique mais rien à propos d’une telle chose...
> - Avez-vous déjà entendu parler de quelque chose du même genre ?
  

### Liens utiles

Voici quelques liens pour une lecture plus approfondie :

- La formation de Jérôme Patazzoni sur les conteneurs : <https://github.com/jpetazzo/container.training>{:target="_blank" rel="noopener noreferrer nofollow"}
- Les concepts dans Kubernetes : <https://kubernetes.io/docs/concepts/>{:target="_blank" rel="noopener noreferrer nofollow"}
- Surveillance de vos applications dans Kubernetes avec Prometheus et Spring Boot : <https://developer.ibm.com/technologies/containers/tutorials/monitoring-kubernetes-prometheus/>{:target="_blank" rel="noopener noreferrer nofollow"}
- Le client Prometheus pour Python : <https://github.com/prometheus/client_python>{:target="_blank" rel="noopener noreferrer nofollow"}
- Les métriques Prometheus personnalisées pour les applications exécutées dans Kubernetes : <https://zhimin-wen.medium.com/custom-prometheus-metrics-for-apps-running-in-kubernetes-498d69ada7aa>{:target="_blank" rel="noopener noreferrer nofollow"}


Et bien, voilà, c’est à votre tour de jouer avec les applications natives à présent !

Cheers...

> info "Et maintenant"
> * Cet article vous a plu ? N’hésitez pas à le dire à Disqus pour que le site progresse en visibilité
> * Vous avez une question ? Posez-la et je vous répondrai dès que possible
> 
> Merci!
>
>