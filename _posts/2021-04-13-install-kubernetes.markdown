---
layout: post
title: Locally install Kubernetes, Prometheus, and Grafana
date: 2021-04-13 17:51:20 +0200
description: How to install Kubernetes, Prometheus, and Grafana on macOS locally with Docker Desktop
img: install-kubernetes.jpg 
fig-caption: Photo by <a href="https://unsplash.com/@safesolvent?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Martin Reisch</a> on <a href="https://unsplash.com/s/photos/square-pattern?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [Kubernetes, Docker, Prometheus, Grafana, macOS]
lang: en
---

Sometimes it may be useful for development to have an effective monitoring toolset installed beside your Kubernetes cluster. The obvious choice would be to go to Prometheus and Grafana, two tools highly recognized.

And that's when you get into trouble.

In this article I'm going to show you how to succesfully install a Kubernetes platfom on your local machine particulary on macOS.


> info "Source code"
> - All scripts are kept in [https://github.com/scalastic/local-k8s-installation](https://github.com/scalastic/local-k8s-installation){:target="_blank" rel="noopener noreferrer nofollow"}


<hr class="hr-text" data-content="Table of contents">

* TOC
{:toc}

<hr class="hr-text" data-content="Kubernetes">

## Requirements

Each OS has its own characteristics and this is important in virtualization. This guide is intended to work on `macOS` and should not work for any other OS. Sorry about that!

> warning "Disclaimer"
> This procedure is working on macOS indeed - and it's a great deal. Hope this work on others systems with some 
> modification, but I can't guarantee.

## Kubernetes

Let's start with the simplest one. I'm using `Docker for Desktop` which comes with Kubernetes. You can find the installer at [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop){:target="_blank" rel="noopener noreferrer nofollow"}

{% figure caption:"Docker Desktop interface with components version" class:"article" %}
  ![Docker Desktop]({{site.baseurl}}/assets/img/docker-desktop.png)
{% endfigure %}

* After installation, you can grapple basic information from your cluster to verify everything's working fine:

{% highlight Zsh %}
% kubectl cluster-info
{% endhighlight %}

{% highlight Zsh %}
% kubectl get ns
{% endhighlight %}

- Or even:
  
{% highlight Zsh %}
% kubectl get all -A
{% endhighlight %}

> info "-A parameter"
> 
> Since Kube `1.14`, we don't have to use the `--all-namespaces` anymore! So don't...


<hr class="hr-text" data-content="Kubernetes Dashboard">

## Kubernetes Dashboard

`Dashboard` is a web UI of k8s API and provides an easy way to visualize and debug things:
  [https://github.com/kubernetes/dashboard](https://github.com/kubernetes/dashboard){:target="_blank" rel="noopener noreferrer nofollow"}
  

By default, `Dashboard` is protected by a token, and each time you'll access it, you'll be asked to provide one. It could 
really be annoying in the long run. Fortunately, `Kubernetes Dashboard` allows you to bypass the login page by adding `--enable-skip-login` to the 
configuration.

> info "Note"
> The provided configuration file is patched with this instruction ([line 198](https://github.com/scalastic/local-k8s-installation/blob/7b0857d64475a1b4c0d1f3680f8d48f076211de8/k8s/dashboard-v2.2.0-recommended.yaml#L198){:target="_blank" rel="noopener noreferrer nofollow"})

> error "Warning"
> Obviously this is only for local platform!

To deploy `Dashboard` - with no authentication - execute the following command:

{% highlight Zsh %}
% kubectl apply -f ./k8s/dashboard-v2.2.0-recommended.yaml
{% endhighlight %}

Then access your dashboard from your local workstation by creating a secure channel to your Kubernetes cluster. To do 
so, run the following command:

{% highlight Zsh %}
% kubectl proxy
{% endhighlight %}

The address is now:

[http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/](http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/){:target="_blank" rel="noopener noreferrer nofollow"}

> info "Tips"
> I know so don't forget to bookmark the URL!

You'll see this login page at first:

{% figure caption:"Dashboard login screen" class:"article" %}
![Dashboard Login Screen]({{site.baseurl}}/assets/img/dashboard-first-access.jpg)
{% endfigure %}

Just push the `skip` button to bypass authentication.

{% figure caption:"Dashboard main page" class:"article" %}
![Dashboard index page]({{site.baseurl}}/assets/img/dashboard-index.jpg)
{% endfigure %}

<hr class="hr-text" data-content="Metrics-Server">

## Metrics Server

`Metrics-Server` is used to crop metrics from k8s components and expose them to k8s API:
  [https://github.com/kubernetes-sigs/metrics-server](https://github.com/kubernetes-sigs/metrics-server){:target="_blank" rel="noopener noreferrer nofollow"}

`Metrics Server` serves the goals of core metrics pipelines: CPU and RAM. It's a cluster level component which 
periodically scrapes metrics from all Kubernetes nodes served by Kubelet. When installed, Kubernetes Dashboard displays this metrics.

To allow `Metrics Server` to collect its data over https, the original script has been modified to accept insecure TLS connections by adding `- --kubelet-insecure-tls` at [line 133](https://github.com/scalastic/local-k8s-installation/blob/7b0857d64475a1b4c0d1f3680f8d48f076211de8/k8s/metrics-server-components-v0.4.2.yaml#L133){:target="_blank" rel="noopener noreferrer nofollow"}.

> error "Warning"
> Once again, don't do this on your public servers!

Apply the configuration by entering :
{% highlight Zsh %}
% kubectl apply -f k8s/metrics-server-components-v0.4.2.yaml
{% endhighlight %}

When reloading the Dashboard, you should now see CPU and Memory Usages 🌈

You can try the `Pods` section, that's my favorite! 

{% figure caption:"Dashboard page with metrics. Beautiful!" class:"article" %}
![Dashboard with metrics page]({{site.baseurl}}/assets/img/dashboard-with-metrics.jpg)
{% endfigure %}

<hr class="hr-text" data-content="Kube State Metrics">

## Kube State Metrics

Unlike Metrics Server, `Kube State Metrics` is focused on generating numerous metrics from Kubernetes' object state 
(e.g. metrics based on deployments, replica sets, pods, etc.). It holds an entire snapshot of Kubernetes state in memory
and generates new metrics based off of it.

Having `Kube State Metrics` enables access to these metrics from monitoring systems such as `Prometheus`.

To install Kube State Metrics, launch the following:
{% highlight Zsh %}
% kubectl apply -f k8s/kube-state-metrics-v2.0.0-rc.1.yaml
{% endhighlight %}


<hr class="hr-text" data-content="Prometheus">

## Prometheus

As specified in the documentation, *Metrics Server* is useful for:

- CPU/Memory based horizontal autoscaling
- Automatically adjusting/suggesting resources needed by containers

But when its comes to:

- Have an accurate source of resource usage metrics
- Manage Horizontal autoscaling based on other resources than CPU/Memory

You should check out full monitoring solutions like `Prometheus` 
[https://prometheus.io](https://prometheus.io){:target="_blank" rel="noopener noreferrer nofollow"}.

In a few words, `Prometheus` is a monitoring and alerting system which:
- Collects data identified by a metric name
- Stores time-series in memory and on local disk for efficiency
- Allows notifications and alerting depending on data queries

Prometheus' maintainers provide binaries and Docker images for `Prometheus` components. 
With a bit of elbow grease, it is possible to create a k8s configuration file with everything we need:
- Access to resources we want to monitor at cluster level
- Role dedicated to Prometheus
- Prometheus executable configuration
- Docker image deployment
- Exposition through service
- And some specific paths due to Docker Desktop for Mac! 🥵

To install the `Prometheus` configuration, run the command:
{% highlight Zsh %}
% kubectl apply -f k8s/prometheus.yaml
{% endhighlight %}

You can now access `Prometheus` interface at:
[http://localhost:30000/](http://localhost:30000/){:target="_blank" rel="noopener noreferrer nofollow"}... but wait and see!!


<hr class="hr-text" data-content="Grafana">

## Grafana

`Grafana` [https://grafana.com/grafana/](https://grafana.com/grafana/){:target="_blank" rel="noopener noreferrer nofollow"} allows you to « *query, visualize and alert on 
metrics through a powerful user interface* » as the site puts.

In practice, you will develop your query in `Prometheus`, and when you're satisfied with, run on `Grafana` to 
monitor your service.

As you can see, the `Grafana` graphical interface offers numerous possibilities:

{% figure caption:"Grafana interface after complete installation. Woah!!" class:"article" %}
![Grafana interface]({{site.baseurl}}/assets/img/grafana-ui.jpg)
{% endfigure %}

To install Grafana, run the command:
{% highlight Zsh %}
% kubectl apply -f k8s/grafana-datasource.yaml
% kubectl apply -f k8s/grafana.yaml
{% endhighlight %}

Grafana will be listening on [http://localhost:3000](http://localhost:3000){:target="_blank" rel="noopener noreferrer nofollow"}. The default login is "admin" / "admin".

You can import this [dashboard](https://raw.githubusercontent.com/scalastic/local-k8s-installation/main/k8s/Docker%20Desktop%20Kubernetes%20All-in-one-1618321310777.json){:target="_blank" rel="noopener noreferrer nofollow"} right now to start monitoring your K8S cluster.

> info "👨🏻‍💻"
> 
> Configuring a dashboard in Grafana could be long, costly, and time-consuming. Collecting metrics depends on your host, VM/Virtualization Framework and OS on your pod. You will find lot of examples on the net but only few will work. 


That's all: get back to work!
Cheers...

> info "And now"
> * You liked this article? Tell it to Disqus so that the site increases its visibility
> * You have a question? Ask it, and I will get back to you as soon as possible
> 
> Thanks!
>
