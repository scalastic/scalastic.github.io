---
layout: post
title: Locally install Kubernetes, Prometheus, and Grafana
date: 2021-04-13 17:51:20 +0200
description: How to install Kubernetes, Prometheus, and Grafana on macOS locally with Docker Desktop
img: install-kubernetes.jpg 
fig-caption: Photo by <a href="https://unsplash.com/@safesolvent?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Martin Reisch</a> on <a href="https://unsplash.com/s/photos/square-pattern?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [Kubernetes, Docker, Prometheus, Grafana, macOS]
lang: en
permalink: /install-kubernetes-prometheus-grafana/
status: finished
---

Sometimes it may be useful for developers to have an effective monitoring toolset installed beside your Kubernetes cluster. The obvious choice would be to go to Prometheus and Grafana, two tools highly recognized.

And that's when you get into trouble.

In this article I'm going to show you how to succesfully install a complete Kubernetes platform on your local machine particulary on macOS.


> info "Source code"
> All scripts are kept in [https://github.com/scalastic/local-k8s-installation](https://github.com/scalastic/local-k8s-installation){:target="_blank" rel="noopener noreferrer nofollow"}


<hr class="hr-text" data-content="Contents">

* TOC
{:toc}

<hr class="hr-text" data-content="Notice">

## Notice

- This procedure is intended to work on **macOS** but should work on any other host. However I was not able to test it. 
- Things are more tying up with the Kubernetes distribution (**Docker Desktop**) than the OS itself.

<hr class="hr-text" data-content="Kubernetes">

## Kubernetes

- We'll be using **Docker Desktop** which comes with a ready-to-use Kubernetes cluster.

	1. Download the installer at [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop){:target="_blank" rel="noopener noreferrer nofollow"} and follow the instructions.

	2. Once installed, activate Kubernetes in the ***Preferences*** pane / ***Kubernetes*** / ***Enable Kubernetes***.

	3. You should now see all the **Docker Desktop** components in the ***About*** pane included Kubernetes:
<figure class="article">
  {% picture {{site.baseurl}}/assets/img/docker-desktop.png --alt Docker Desktop interface with components version %}
  <figcaption>Docker Desktop interface with components version</figcaption>
</figure>

- Grapple basic information from your cluster to verify everything's working fine:

{% highlight Zsh %}
% kubectl cluster-info
{% endhighlight %}


{% highlight Zsh %}
% kubectl get nodes
{% endhighlight %}

- Or even:
  
{% highlight Zsh %}
% kubectl get all -A
{% endhighlight %}

> info "-A parameter"
> 
> Since Kube `1.14`, we don't have to use the `--all-namespaces` anymore! So don't...


<hr class="hr-text" data-content="Dashboard">

## Dashboard

**Dashboard** is a web UI of k8s API and provides an easy way to visualize and debug things. You can find more about **Dashboard** at [https://github.com/kubernetes/dashboard](https://github.com/kubernetes/dashboard){:target="_blank" rel="noopener noreferrer nofollow"}
  

By default, **Dashboard** is protected by a token, and each time you'll access it, you'll be asked to provide one. It could 
really be annoying in the long run. Fortunately, **Dashboard** allows you to bypass the login page by adding `--enable-skip-login` to the 
configuration.

> info "Note"
> The provided configuration file is patched with this instruction ([line 198](https://github.com/scalastic/local-k8s-installation/blob/7b0857d64475a1b4c0d1f3680f8d48f076211de8/k8s/dashboard-v2.2.0-recommended.yaml#L198){:target="_blank" rel="noopener noreferrer nofollow"})


To deploy **Dashboard** - with no authentication - execute the following command:

{% highlight Zsh %}
% kubectl apply -f ./k8s/dashboard-v2.2.0-recommended.yaml
{% endhighlight %}

Then access your dashboard from your local workstation by creating a secure channel to your Kubernetes cluster. To do 
so, run the following command:

{% highlight Zsh %}
% kubectl proxy
{% endhighlight %}

The address is now:

<a href="http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/" rel="noopener noreferrer nofollow" target="_blank" data-proofer-ignore>http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/</a>


> info "Tips"
> I know so don't forget to bookmark the URL!

You'll see this login page at first:

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/dashboard-first-access.jpg --alt Dashboard login screen %}
  <figcaption>Dashboard login screen</figcaption>
</figure>

Just push the ***skip*** button to bypass authentication.

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/dashboard-index.jpg --alt Dashboard main page %}
  <figcaption>Dashboard main page</figcaption>
</figure>

<hr class="hr-text" data-content="Metrics-Server">

## Metrics Server

**Metrics-Server** is used to crop metrics from k8s components and exposes them to k8s API. The official repository is [https://github.com/kubernetes-sigs/metrics-server](https://github.com/kubernetes-sigs/metrics-server){:target="_blank" rel="noopener noreferrer nofollow"}

**Metrics Server** serves the goals of core metrics pipelines: CPU and RAM. The important thing is that ***Horizontal Pod Autoscaler*** uses this API to collect metrics. It's a cluster level component which 
periodically scrapes metrics from all Kubernetes nodes served by Kubelet. When installed, **Dashboard** displays automatically this metrics too.

> info "Note"
> To allow **Metrics Server** to collect its data over https, the original script has been modified to accept insecure TLS connections by adding `- --kubelet-insecure-tls` at [line 133](https://github.com/scalastic/local-k8s-installation/blob/7b0857d64475a1b4c0d1f3680f8d48f076211de8/k8s/metrics-server-components-v0.4.2.yaml#L133){:target="_blank" rel="noopener noreferrer nofollow"}.


Apply the configuration by entering :
{% highlight Zsh %}
% kubectl apply -f k8s/metrics-server-components-v0.4.2.yaml
{% endhighlight %}

When reloading the **Dashboard**, you should now see CPU and Memory Usages (after some time) 🌈

You can try the ***Pods*** section, this is my favorite! 

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/dashboard-with-metrics.jpg --alt Dashboard page with metrics. Beautiful! %}
  <figcaption>Dashboard page with metrics. Beautiful!</figcaption>
</figure>

<hr class="hr-text" data-content="Kube State Metrics">

## Kube State Metrics

Unlike **Metrics Server**, **Kube State Metrics** is focused on generating numerous metrics from Kubernetes' object state 
(e.g. metrics based on deployments, replica sets, pods, etc.). For this, it holds an entire snapshot of Kubernetes state in memory
and generates new metrics based off of it.

- Having **Kube State Metrics** enables access to these metrics from monitoring systems such as **Prometheus**, our concerne here.

- To install **Kube State Metrics**, launch the following:
{% highlight Zsh %}
% kubectl apply -f k8s/kube-state-metrics-v2.0.0-rc.1.yaml
{% endhighlight %}


<hr class="hr-text" data-content="Prometheus">

## Prometheus


**Prometheus** is a collecting, querying, monitoring, and alerting system. It is useful when it comes to:
- Collects data identified by a metric name
- Stores time-series in memory and on local disk for efficiency
- Allows notifications and alerting depending on data queries

Full documentation is accessible from [https://prometheus.io](https://prometheus.io){:target="_blank" rel="noopener noreferrer nofollow"}.

**Prometheus**' maintainers provide binaries and Docker images for **Prometheus** components. 
With a bit of elbow grease, it is possible to create a k8s configuration file with everything we need: Resources access, dedicated role, configuration, deployment, and service exposition.

To install the **Prometheus** configuration, run the command:
{% highlight Zsh %}
% kubectl apply -f k8s/prometheus.yaml
{% endhighlight %}

You can now access **Prometheus** interface at <a href="http://localhost:30000/" rel="noopener noreferrer nofollow" target="_blank" data-proofer-ignore>http://localhost:30000/</a> ... but wait and see!!


<hr class="hr-text" data-content="Grafana">

## Grafana

**Grafana** ([https://grafana.com/grafana/](https://grafana.com/grafana/){:target="_blank" rel="noopener noreferrer nofollow"}) allows you to « *query, visualize and alert on 
metrics through a powerful user interface* » as the site puts. 

> info "That's what Prometheus is already doing!?"
> Let's clarify : in practice, you will develop your query in **Prometheus**, and run on **Grafana** when you're satisfied.

To configure the **Prometheus** datasource and install **Grafana**, run the commands:
{% highlight Zsh %}
% kubectl apply -f k8s/grafana-datasource.yaml
% kubectl apply -f k8s/grafana.yaml
{% endhighlight %}

**Grafana** will be listening on <a href="http://localhost:3000/" rel="noopener noreferrer nofollow" target="_blank" data-proofer-ignore>http://localhost:3000/</a>. The default login is ***admin*** / ***admin***.

### Import Grafana dashboard

- By default, **Grafana** comes with nothing specific and you'll have to configure a dashboard. Fortunatly, you can easilly import pre-built ones via the **Grafana** interface. The principal dashboards' source is at [https://grafana.com/grafana/dashboards](https://grafana.com/grafana/dashboards){:target="_blank" rel="noopener noreferrer nofollow"}.

- I've made one specific to local Kubernetes cluster you can find here [Dashboard model](https://raw.githubusercontent.com/scalastic/local-k8s-installation/main/k8s/Docker%20Desktop%20Kubernetes%20All-in-one-1618321310777.json){:target="_blank" rel="noopener noreferrer nofollow"}.

It looks like this - as you can see, the **Grafana** graphical interface offers numerous possibilities - unlike **Prometheus**:

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/grafana-ui.jpg --alt Grafana interface after complete installation. Woah!! %}
  <figcaption>Grafana interface after complete installation. Woah!!</figcaption>
</figure>

> info "👨🏻‍💻"
> 
> Configuring a dashboard in Grafana could be long, costly, and time-consuming. Collecting metrics depends on your host, VM/Virtualization Framework and OS on your pod. You will have to get your hands dirty...

Well, that's your turn playing with the stack now!

Cheers...
