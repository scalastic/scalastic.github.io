---
layout: post
title: JVM vs Native - An effective comparison of performances
date: 2021-04-22 21:00:00 +0200
description: How to effectively compare JVM versus Native applications - A complete guide built from Java Spring Boot, Spring Native, WebFlux, Docker, Kubernetes, Prometheus and Grafana
img: jvm-vs-native.jpg
fig-caption: Photo by <a href="https://unsplash.com/@jtylernix?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Tyler Nix</a> on <a href="https://unsplash.com/s/photos/surf?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [Spring-Boot, Spring-Native, Spring-WebFlux, GraalVM, Docker, Kubernetes, Prometheus, Grafana, Micoservices]
lang: en
locale: en_US
---


When it comes to comparing JVM-HotSpot and GraalVM-native executions, 
it is often hard to decide on application's architecture and technology to test and even what to measure.

Recently I came across an interesting training course about [containers and orchestration](https://github.com/jpetazzo/container.training){:target="_blank" rel="noopener noreferrer nofollow"} 
written by Jérôme Petazzoni. He uses a bunch of interacting Python and Ruby apps encapsulated in Docker containers. They act as 
a microservices mesh and measuring the number of completed cycles per second provides a good estimation of the 
system effectiveness. Being able to play with the number of running containers would be also a good illustration of what 
actually happens.

Actively following `Spring Native` developments, I therefore decided to port his demonstration application into Java using
the latest development versions of `Spring Boot` and reactive programming `WebFlux`.

> info "Source code"
> All sources are kept in <https://github.com/scalastic/hotspot-vs-native>{:target="_blank" rel="noopener noreferrer nofollow"}

<hr class="hr-text" data-content="Contents">

* TOC
{:toc}

<hr class="hr-text" data-content="Demonstration">

## The demo

### Objective

The main goal of this demo is to tweak the microservices' resources configuration and see how it affects the global
application's performance.

What are our levers for action?
- First, we could easily play with the **number of containers** running each
  microservice.
- Secondly, Java-based microservices are built on two types which can be easily switched: **JVM-based** and **Native**.

So let's do it.

### Requirements

In order to implement this solution, we'll need:
- A **Kubernetes** cluster
- **Prometheus**, **Grafana**
- **Metrics** coming from our microservices
- **Bytecode** and **native** built Java apps

Well it's not a big deal and this already exists:

- ***Spring Boot*** and ***Micrometer*** enable metrics exposure of Java applications
- Python code instrumented with ***prometheus_client*** library can expose metrics to prometheus
- I explained and scripted a complete Kubernetes stack installation in a previous article: [Locally install Kubernetes, Prometheus, and Grafana](https://scalastic.io/install-kubernetes/)
- ***Spring Boot Native*** can build either natively or in Bytecode any Java app

> info "Spring Versions" 
> 
> We'll be using the latest development versions of Spring Experimental stack as it's continuously fix bugs and 
> improve performances. However, you have to keep in mind this is still a Beta version and does not represent a final step:
> - Spring Boot `2.5.0-RC1`
> - Spring Native `0.10.0-SNAPSHOT`

<hr class="hr-text" data-content="Application Architecture">

## Application Architecture

![Application Architecture]({{site.baseurl}}/assets/img/application-architecture.jpg)

The application is composed of 5 microservices :
- `worker` the algorithm orchestrator [***Python***] which gets `1` a random number, `2` hash it, and `3` increment a counter in redis database.
- `rng` the random number generator [***Spring Boot***]
- `hasher` the hasher processor [***Spring Boot***]
- `redis` the database recording each complete execution cycle

<hr class="hr-text" data-content="Build">

## Build the app

The goal of these builds is to produce a Docker image for each microservice. For Java-based ones, there will be two images: 
one built as ***JVM-based*** image and the other one as ***native*** one.

> note "Optional"
> 
> I've pulled this stuf into a public registry on Docker Hub so you don't even need to worry about these builds.

### Requirements

However, if you wish to **build** the app, you will need to install :
- [GraalVM 21.1.0 Java 11 based](https://www.graalvm.org/docs/getting-started/#install-graalvm){:target="_blank" rel="noopener noreferrer nofollow"}
- [GraalVM Native Images](https://www.graalvm.org/docs/getting-started/#native-images){:target="_blank" rel="noopener noreferrer nofollow"}
- [Docker](https://www.docker.com/products/docker-desktop){:target="_blank" rel="noopener noreferrer nofollow"}

### The easy way

> warning "Note"
> - It should work on **linux** and **macOS** based systems - *and on **Windows** with some small modifications*
> - It will take time....... 10-20 min depending on your internet connection and processor! That's the price to compile to native code.

To do so, execute this script at the project root:
{% highlight Bash %}
./build_docker_images.sh
{% endhighlight %}


### The other way

> info "Info"
> 
> These are the script's commands syntax - just to reproduce.


- For a **non-java** app, execute:

{% highlight Bash %}
docker build -t <app_docker_tag> ./<app_dir>
{% endhighlight %}

- For **JVM-based** image:

{% highlight Bash %}
cd <app_dir>
mvn clean package
docker build -t <app_docker_tag> .
{% endhighlight %}

- For a **Java native** image:

{% highlight Bash %}
cd <app_dir>
mvn spring-boot:build-image
{% endhighlight %}

### No build at all

You can pull pre-built images from Docker Hub by entering:

{% highlight Bash %}
docker pull jeanjerome/rng-jvm:1.0.0
docker pull jeanjerome/hasher-jvm:1.0.0
docker pull jeanjerome/worker-python:1.0.0
docker pull jeanjerome/rng-native:1.0.0
docker pull jeanjerome/hasher-native:1.0.0
{% endhighlight %}

### List your local images

To list your local docker images, enter:

{% highlight Bash %}
docker images
{% endhighlight %}
At least, you should see these images in your local registry:
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
> Native images created time seems inaccurate. It's not, the explanation is here: 
> [Time Travel with Pack](https://medium.com/buildpacks/time-travel-with-pack-e0efd8bf05db){:target="_blank" rel="noopener noreferrer nofollow"}

<hr class="hr-text" data-content="Kubernetes Configuration">

## Configure Kubernetes

First, we need to define the kubernetes configuration of our application and configure Grafana to monitor accurate metrics.

### Kubernetes Stack Architecture

Let's have a look at how to set up these microservices into our kubernetes cluster.

Remember the application architecture :
- It will be deployed in a dedicated namespace `demo`
- Monitoring tool are located in the `monitoring` namespace

![Kubernetes Architecture]({{site.baseurl}}/assets/img/kubernetes-architecture.jpg)

1. We want to manage the number of ~~containers~~ - pods in this case -  per microservice . We could want to 
   scale up automatically this number depending on metrics. We also would like to change the image of the pod, passing 
   from a JVM image to a native image without the need to restart from scratch... Such Kubernetes resource already 
   exists: [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/){:target="_blank" rel="noopener noreferrer nofollow"}

2. We want our microservices to communicate each others in the Kubernetes cluster. That's the job of 
   [Service](https://kubernetes.io/docs/concepts/services-networking/){:target="_blank" rel="noopener noreferrer nofollow"} resource.

3. We'd like to access the web UI from outside the cluster: a Service typed with
   [NodePort](https://kubernetes.io/docs/concepts/services-networking/service/#nodeport){:target="_blank" rel="noopener noreferrer nofollow"} resource would be sufficient.

4. The Redis database does not need to be reached from the outside but only from the inside: that's already done by 
   [ClusterIP](https://kubernetes.io/docs/concepts/services-networking/service/){:target="_blank" rel="noopener noreferrer nofollow"} which is the default Service type in 
   Kubernetes.

5. We also want to monitor the application's metrics on Grafana via Prometheus: [found these good detailed explanations](https://developer.ibm.com/technologies/containers/tutorials/monitoring-kubernetes-prometheus/){:target="_blank" rel="noopener noreferrer nofollow"}

Have a look at the `_kube/k8s-app-jvm.yml` extract showing the Hasher Java microservice resources' configuration:

<details>
<summary>_kube/k8s-app-jvm.yml extract</summary>

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

## Configure Grafana dashboard

- Connect to your Grafana interface 
  > info ""
  > If you've followed my previous article [Locally install Kubernetes, Prometheus, and Grafana](https://scalastic.io/install-kubernetes/) you can reach Grafana at [http://localhost:3000/](http://localhost:3000/)
- Import the dashboard from the JSON definition `_grafana/demo-dashboard.json` from this repo
- Display the dashboard

You should see an empty dashboard as follows:

![Empty Demo Grafana dashboard]({{site.baseurl}}/assets/img/grafana-demo-empty.png)


### Description of the ***Demo Dashboard***

![Description of the Demo Grafana dashboard]({{site.baseurl}}/assets/img/grafana-demo-description.png)

The ***Grafana Demo Dashboard*** is composed of 3 rows (labeled from `A` to `C`), one for each microservice's pods 
(Worker, Random Number Generator -RNG- and Hasher) and monitored metrics (numbered `1` to `4`).

- In cells #1, `number of running pods` and `process speed` (functionally speaking) are represented.
- In cells #2, `historical process speed` is first monitored in the A row. On B and C, `Request Latency` to the underlying 
microservices `RNG` and `Hasher` are displayed.
- Cells #3 display the `pods' CPU consumption`.
- Cells #4 monitor the `pods' RAM consumption`.

<hr class="hr-text" data-content="Starting">

## Start the app

In this first step, all microservices' replicas are configured with 1 pod, and the Java-based microservices run on JVM.
All of this will also be created in a specific `demo` namespace.

- To start app's microservices, apply this configuration to the cluster:
{% highlight Bash %}
kubectl apply -f _kube/k8s-app-jvm.yml
{% endhighlight %}

You should see the output:
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

- Visualize the starting app in Grafana:

  ![Grafana dashboard starting app]({{site.baseurl}}/assets/img/grafana-demo-starting-app.png)

> note "Results"
> 
> - The speed metric located in the first cell of the first row give us a base measure of our application effectiveness: 
> `3.20` cycles/sec.
> 
> - Depending on your Kubernetes cluster's resources, you could get another result.

<hr class="hr-text" data-content="Playing">

## Play with Kubernetes configuration

### Overview

- Let's see the actual deployment's situation by entering:
{% highlight Bash %}
kubectl get deployment -n demo
{% endhighlight %}

- Which should return:
{% highlight Bash %}
NAME     READY   UP-TO-DATE   AVAILABLE   AGE
hasher   1/1     1            1           13m
redis    1/1     1            1           13m
rng      1/1     1            1           13m
worker   1/1     1            1           13m
{% endhighlight %}

### Increase pods' number

- Scale up `worker` pod to `2`: 

{% highlight Bash %}
kubectl scale deployment worker --replicas=2 -n demo
{% endhighlight %}

Which returns:
{% highlight Bash %}
deployment.apps/worker scaled
{% endhighlight %}

### Impact on application

- Let's have a look on Grafana dashboard:

![Grafana dashboard 2 workers]({{site.baseurl}}/assets/img/grafana-demo-2-workers.png)

> note "Results"
> 
> You can notice application process increases by `2`.


### Increase pods' number even more

- Let's try increasing to `10` workers:

{% highlight Bash %}
kubectl scale deployment worker --replicas=10 -n demo
{% endhighlight %}

![Grafana dashboard 10 workers]({{site.baseurl}}/assets/img/grafana-demo-10-workers.png)

> note "Results"
> 
> The process speed grows up but does not reach exactly 10 times more: latency of the 2 microservices, rng and hasher, has slightly increases.

-  Let's increase `hasher` and `rng` pods' number: 

{% highlight Bash %}
kubectl scale deployment hasher rng --replicas=4 -n demo
{% endhighlight %}
![Grafana dashboard 4 RNGs & Hashers]({{site.baseurl}}/assets/img/grafana-demo-4-rng-hasher.png)

Or even more:
{% highlight Bash %}
kubectl scale deployment hasher rng --replicas=5 -n demo
{% endhighlight %}

> note "Results"
> 
> For this 2 microservices, increasing the pods' number reduces their latency, but its remain a little above their initial values:
> another factor is influencing the app (?)

### Switch to native built app

- Replace jvm-based images with native ones by updating deployments with rollout:
{% highlight Bash %}
kubectl set image deployment/hasher hasher=hasher-native:1.0.0 -n demo
kubectl set image deployment/rng rng=rng-native:1.0.0 -n demo
{% endhighlight %}

- Watch the deployment rollout:
{% highlight Bash %}
kubectl rollout status deployment/hasher -n demo
{% endhighlight %}
- And the Grafana dashboard:

![Grafana dashboard native RNGs & Hashers]({{site.baseurl}}/assets/img/grafana_demo_native_rng_hasher.png)

> note "Results"
>
> **About Latency**
> - No change for the responsiveness of the microservices: sure, the code is too simple to benefit from a native build.
> 
> **About CPU usage**
> - JVM-based CPU usage tends to decrease with time. This is due to the HotSpot's `C2` compiler which produces very
> optimized native code in the long run.
> - By contrast, native-based CPU usage is low from the outset.
> 
> **About RAM usage**
> - Surprisingly Native-based apps are using more memory than JVM-based ones: I can't explain it as reduce footprint of
> native Java applications is one of the benefits claimed by the community.
> - Is it because of the Spring Native still in Beta version, or a memory leak in the implementation?

<hr class="hr-text" data-content="Cleaning">

## Clean all

To simply remove the app and all its microservices, enter:
{% highlight Bash %}
kubectl delete -f _kube/k8s-app-jvm.yml 
{% endhighlight %}
which will remove all the Kubernetes configuration created previously:

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

We have learned how to instrument a local station in order to collect metrics and measure impacts of Kubernetes configuration.

However, we do not achieve the expected results in the context of native application. One explanation could be a lack of the Spring Beta version: Spring Native has just moved to `0.10.0-SNAPSHOT` and it's precisely the version where performance improvements are planed. I will get in touch with Spring Boot's team to ask for their opinion.

<hr class="hr-text" data-content="What to do next?">

## What next?

### What is missing for a more realistic evaluation

- Kubernetes' configuration should always include resources limit (and also request) that has not been done in this demo.
- I could have used [Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/){:target="_blank" rel="noopener noreferrer nofollow"}
  (HPA) and even better HPA on custom metrics (see [this post](https://itnext.io/horizontal-pod-autoscale-with-custom-metrics-8cb13e9d475){:target="_blank" rel="noopener noreferrer nofollow"} 
  for more details). I wish I found some Automatic Scaler that regulate all pods in an application to maximize a specific 
  metric but nothing about such a thing... Did you ever hear something like that?
  

### Useful links

Here are some links for further reading:

- Jérôme Patazzoni's container training: <https://github.com/jpetazzo/container.training>{:target="_blank" rel="noopener noreferrer nofollow"}
- Kubernetes Concepts : <https://kubernetes.io/docs/concepts/>{:target="_blank" rel="noopener noreferrer nofollow"}
- Monitoring your apps in Kubernetes with Prometheus and Spring Boot: <https://developer.ibm.com/technologies/containers/tutorials/monitoring-kubernetes-prometheus/>{:target="_blank" rel="noopener noreferrer nofollow"}
- Prometheus Python Client: <https://github.com/prometheus/client_python>{:target="_blank" rel="noopener noreferrer nofollow"}
- Custom Prometheus Metrics for Apps Running in Kubernetes: <https://zhimin-wen.medium.com/custom-prometheus-metrics-for-apps-running-in-kubernetes-498d69ada7aa>{:target="_blank" rel="noopener noreferrer nofollow"}


Well, that's your turn playing with native apps now!

Cheers...

> info "And now"
> * You liked this article? Feel free to tell Disqus so the site increases in visibility
> * You have a question? Ask it, and I will get back to you as soon as possible
> 
> Thanks!
>