---
layout: post
title: "Day 2: Discovering Kubernetes and Setting Up Your First Cluster for the CKA Certification"
date: 2025-01-03 15:09:00 +0100
description: "Explore the architecture of Kubernetes, its essential components, and learn to configure a Multi-node cluster with Kind to prepare for the CKA certification."
img: cka-day2-kubernetes-architecture.jpg
fig-caption: "Kubernetes architecture and the first steps towards mastering the CKA."
tags: ["Kubernetes", "CKA", "Cluster", "DevOps", "Certification", "Kind", "Kubectl", "Tutorial"]
lang: en
permalink: /cka-certification-day-2-kubernetes/
status: finished
seo_title: "CKA Certification: Day 2 - Discovering Kubernetes and Setting Up Your First Cluster"
seo_description: "A practical guide to understanding Kubernetes architecture, its components, and configuring a Multi-node cluster with Kind. Prepare effectively for the CKA certification."
series: "CKA Certification - Complete Training"
progression: "Day 2"
---

Kubernetes is the most widely used tool for orchestrating containers in Cloud Native and DevOps environments. It enables the management of application deployments while ensuring scalability, resilience, and optimized resource management. To lay a solid foundation for the CKA certification, it is essential to understand Kubernetes architecture and learn to configure your own cluster. This will help you master its components, practice and experiment, and meet the exam requirements.

In this article, we will cover the fundamentals of Kubernetes and its use. You will learn to configure a Multi-node cluster with Kind, install and use the Kubernetes client, kubectl, and execute your first commands to interact with a cluster. These skills are an important first step in preparing for the certification.

<hr class="hr-text" data-content="{{page.series}}">

> info "{{ page.progression }}"
> Welcome to the second step of your journey towards the Certified Kubernetes Administrator (CKA) certification. In this article, we will explore:
> - The architecture of Kubernetes and the role of its main components.
> - The specifics of the CKA exam, including available resources and the Kubernetes version used.
> - The setup of a Multi-node cluster with Kind and the use of the kubectl tool.
> - Initial practical commands to interact with your Kubernetes cluster.
>
> As with Day 1, this tutorial is designed to combine theory and practice to strengthen your technical skills and build confidence before the exam.

<hr class="hr-text" data-content="Table of Contents">

* TOC
{:toc}

<hr class="hr-text" data-content="Kubernetes Architecture">

## 1. Introduction to Kubernetes Architecture

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/cka-kubernetes-architecture.png --alt Kubernetes Cluster Architecture %}
  <figcaption>Kubernetes Cluster Architecture</figcaption>
</figure>

The architecture of Kubernetes is designed to orchestrate containers by dividing responsibilities between two main types of nodes: Master Nodes and Worker Nodes. Master Nodes are responsible for managing and controlling the entire cluster, while Worker Nodes run containerized workloads. This role separation ensures system availability, resilience, and scalability.

### 1.1. Main Components of the Master Node

The Master Node (also known as the Control Plane) is the brain of the Kubernetes cluster. It oversees all cluster operations and manages the desired states of deployed applications. Here are its main components:

- **API Server**:  
  - The entry point for all interactions with the cluster.  
  - Receives requests via the REST interface and forwards them to other components for processing.  
  - Also used by the `kubectl` client to interact with Kubernetes.

- **etcd**:  
  - A distributed key-value database that stores the cluster’s state, including configurations, metadata, and information about Kubernetes objects.  
  - Crucial for ensuring consistency and recovering the state in case of failures.

- **Controller Manager**:  
  - Consolidates multiple controllers responsible for the automated management of Kubernetes objects (e.g., ensuring a minimum number of pod replicas are running).  
  - Monitors the current cluster state and acts to maintain the desired state.

- **Scheduler**:  
  - Assigns newly created pods to available nodes based on defined resources and constraints (e.g., CPU, RAM, or node labels).  
  - Optimizes the utilization of cluster resources.

### 1.2. Components of Worker Nodes

Worker Nodes are the machines where containers are executed. Each Worker Node contains several components responsible for managing local resources and running workloads:

- **Kubelet**:  
  - An agent that runs and monitors the pods on its node.  
  - Communicates with the API Server to receive instructions and report the status of the pods.

- **Kube Proxy**:  
  - A networking component that ensures communication between services and pods.  
  - Manages routing rules and load balancing for exposed services.

- **Container Runtime**:  
  - Software responsible for running containers on the node. Kubernetes supports various runtimes, including Docker, containerd, and CRI-O (any engine compatible with the Container Runtime Interface or CRI).  
  - Ensures efficient isolation and execution of containers.

- **Pods**:  
  - Pods are the basic units of deployment in Kubernetes and group **one or more containers** that share the same network and volumes.  
  - **Role of Kubelet**: Kubelet ensures that the pods scheduled on the node are functioning correctly, interacts with the runtime to start/stop containers, and reports pod status to the API Server.  
  - **Role of Kube Proxy**: Kube Proxy manages network connectivity between pods and routes requests to the appropriate pods, balancing the load when necessary.

> info "What Does a Node Run On?"
> Kubernetes nodes can be deployed on a variety of platforms, including physical machines, virtual machines, or containerized environments. Kubernetes is designed to be infrastructure-agnostic, enabling users to deploy their cluster in a heterogeneous environment.

> info "How Is High Availability Achieved in a Kubernetes Cluster?"  
> High Availability (HA) in Kubernetes is achieved through several strategies:  
> - **Replication of Master Nodes**: Configuring multiple Master Nodes (a minimum of 3) reduces the risk of a single point of failure. These Master Nodes share responsibilities using etcd as a distributed database.  
> - **Management of Worker Nodes**: Kubernetes automatically detects Worker Node failures and redistributes the affected pods to other functional nodes.  
> - **Load Balancing and Heartbeats**: Mechanisms such as load balancers and "liveness probes" ensure that traffic is directed to operational components.

<hr class="hr-text" data-content="CKA Exam">

## 2. Overview of the Certified Kubernetes Administrator (CKA) Exam

The Certified Kubernetes Administrator (CKA) exam assesses candidates' practical skills in administering and managing Kubernetes clusters. It is designed to validate operational expertise in a real-world environment.

### 2.1. Exam Structure and Objectives

The exam lasts **2 hours** and focuses on practical scenarios. Candidates must solve real-world problems and perform tasks related to Kubernetes cluster management. The primary objectives include:  
- Managing and configuring clusters.  
- Networking and connectivity.  
- Security, including Role-Based Access Control (RBAC).  
- Resource management and application maintenance.

Proper preparation and regular practice of commands are essential for success in this practice-oriented format.

> info "Complete Information"
> Detailed information can be found on the Linux Foundation's dedicated page: [https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka-2/](https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka-2/){:target="_blank" rel="noopener noreferrer nofollow"}.

### 2.2. Kubernetes Version Used

The Certified Kubernetes Administrator (CKA) exam relies on a specific Kubernetes version. It is highly recommended to verify this version on the official website before starting your preparation. This ensures your knowledge and practical exercises align with the features and behaviors of the version used in the exam. Since Kubernetes evolves rapidly, commands or functionalities may vary between versions, making this verification essential.

> info "Kubernetes Version for CKA 2025"
> As of early 2025, and at least until February 10, the version used for the CKA exam is **v1.31**.  
> To learn about the specific changes for the CKA 2025 exam, visit the dedicated page: [Program Changes - CKA 2025](https://training.linuxfoundation.org/certified-kubernetes-administrator-cka-program-changes/){:target="_blank" rel="noopener noreferrer nofollow"}.

### 2.3. Accessible Documentation During the Exam

During the exam, you have access to specific online resources to assist you:  
- [Kubernetes Documentation](https://kubernetes.io/docs){:target="_blank" rel="noopener noreferrer nofollow"}: The official documentation, essential for looking up information about Kubernetes concepts, commands, and objects.  
- [Kubernetes Blog](https://kubernetes.io/blog/){:target="_blank" rel="noopener noreferrer nofollow"}: Useful for news or relevant articles about Kubernetes, though rarely needed during the exam.  
- [Kubectl Reference](https://kubernetes.io/docs/reference/kubectl/quick-reference/){:target="_blank" rel="noopener noreferrer nofollow"}: An indispensable resource for quickly finding command options and syntaxes for `kubectl`.

These resources allow you to confirm or supplement your knowledge during the exam, but they must be used efficiently since time is limited. It is also worth noting that you will access this documentation, along with the exam content, through a virtualized environment. Preparing for this workflow is essential.

<hr class="hr-text" data-content="Cluster Setup">

## 3. Configuring a Multi-node Kubernetes Cluster with Kind

Kind (Kubernetes IN Docker) is a lightweight tool for deploying Kubernetes clusters for local development and testing. As its name suggests, Kind runs Kubernetes nodes (Master Nodes and Worker Nodes) as Docker containers on your machine. This eliminates the need for separate physical or virtual machines, making setup quick, portable, and ideal for test environments. This section provides a step-by-step guide to creating a Multi-node cluster using Kind.

### 3.1. Prerequisites

Before starting, ensure that Docker is installed and that the Docker daemon is running on your machine.

### 3.2. Installing Kind

There are several simple ways to install Kind on your machine:  
- Using **binaries**: [https://kind.sigs.k8s.io/docs/user/quick-start/#installing-from-release-binaries](https://kind.sigs.k8s.io/docs/user/quick-start/#installing-from-release-binaries){:target="_blank" rel="noopener noreferrer nofollow"}.  
- Using a **package manager**: [https://kind.sigs.k8s.io/docs/user/quick-start/#installing-with-a-package-manager](https://kind.sigs.k8s.io/docs/user/quick-start/#installing-with-a-package-manager){:target="_blank" rel="noopener noreferrer nofollow"}.


### 3.2. Examples of Installation Based on Your Operating System

#### 3.2.1. On Linux

{% highlight bash %}
# For AMD64 / x86_64
[ $(uname -m) = x86_64 ] && curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.26.0/kind-linux-amd64
# For ARM64
[ $(uname -m) = aarch64 ] && curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.26.0/kind-linux-arm64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
{% endhighlight %}

#### 3.2.2. On macOS

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

#### 3.2.3. On Windows

{% highlight powershell %}
curl.exe -Lo kind-windows-amd64.exe https://kind.sigs.k8s.io/dl/v0.26.0/kind-windows-amd64
Move-Item .\kind-windows-amd64.exe c:\some-dir-in-your-PATH\kind.exe
{% endhighlight %}

#### 3.2.4. Testing the Installation

{% highlight bash %}
kind --version
{% endhighlight %}

You should see the installed version displayed:

{% highlight plaintext %}
kind version 0.26.0
{% endhighlight %}

### 3.3. Creating the Multi-node Cluster

Once Kind is installed, follow these steps to configure a Kubernetes cluster with multiple nodes.

#### **Step 1**: Create a Configuration File for the Cluster

A YAML configuration file is required to define your cluster topology. Below is an example configuration for a cluster with 1 Master Node and 2 Worker Nodes:

- Create a file named `kind-cluster-config.yaml`:
{% highlight yaml %}
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
  - role: worker
  - role: worker
{% endhighlight %}

#### **Step 2**: Determine the Kubernetes Image to Use

By default, Kind uses the latest Kubernetes version packaged for the tool. However, for our CKA exam preparation, it is critical to use the same version as the one specified for the exam.

- Check the [Kind release page](https://github.com/kubernetes-sigs/kind/releases){:target="_blank" rel="noopener noreferrer nofollow"} to identify the appropriate image version. Look for the section listing pre-built images for the release.

   Example:
{% highlight markdown %}
Images pre-built for this release:
- v1.32.0: kindest/node:v1.32.0@sha256:c48c62eac5da28cdadcf560d1d8616cfa6783b58f0d94cf63ad1bf49600cb027
- v1.31.4: kindest/node:v1.31.4@sha256:2cb39f7295fe7eafee0842b1052a599a4fb0f8bcf3f83d96c7f4864c357c6c30
- v1.30.8: kindest/node:v1.30.8@sha256:17cd608b3971338d9180b00776cb766c50d0a0b6b904ab4ff52fd3fc5c6369bf
{% endhighlight %}

- For this article, the version specified for the CKA exam in early 2025 is **v1.31**. We will use the following image:
{% highlight plaintext %}
kindest/node:v1.31.4@sha256:2cb39f7295fe7eafee0842b1052a599a4fb0f8bcf3f83d96c7f4864c357c6c30
{% endhighlight %}

#### **Step 3**: Create the Cluster from the Configuration File

Use the following command to create the cluster, specifying the configuration file and the image for the selected version:

{% highlight bash %}
kind create cluster \
  --config kind-cluster-config.yaml \
  --image kindest/node:v1.31.4@sha256:2cb39f7295fe7eafee0842b1052a599a4fb0f8bcf3f83d96c7f4864c357c6c30 \
  --name multi-node-cluster
{% endhighlight %}

- **Explanation of the options**:  
  - `--config kind-cluster-config.yaml`: Defines the cluster topology based on the configuration file.  
  - `--image`: Specifies the Docker image containing the exact Kubernetes version to use.  
  - `--name multi-node-cluster`: Assigns a name to the cluster for easier management.

You should see the following logs displayed:

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

Your Multi-node Kubernetes cluster is now set up with the exact version used in the CKA exam, in this case, `v1.31.4`.

Let’s now explore how to interact with the cluster to validate its functionality.

#### **Step 4**: Verify the Cluster Creation

At this point, you only need two tools to perform initial verifications: `kind` and the `docker` client. Since Kind uses Docker containers to run Kubernetes nodes, these tools will allow you to quickly check if the cluster is operational.

##### 1. List Active Kind Clusters

Use the following command to display the clusters created with Kind:  
{% highlight bash %}
kind get clusters
{% endhighlight %}

You should see output like this:  
{% highlight plaintext %}
multi-node-cluster
{% endhighlight %}

This confirms that your "multi-node-cluster" is active.

##### 2. Display Node Details

To verify the created nodes and their roles, execute:  
{% highlight bash %}
docker ps --filter "name=multi-node-cluster"
{% endhighlight %}

This command lists all Docker containers corresponding to the cluster nodes, showing their roles (control-plane or worker) and statuses.

Example output:  
{% highlight plaintext %}
CONTAINER ID   IMAGE                  COMMAND                  CREATED             STATUS             PORTS                       NAMES
e035ef879a00   kindest/node:v1.31.4   "/usr/local/bin/entr…"   About an hour ago   Up About an hour   127.0.0.1:51483->6443/tcp   multi-node-cluster-control-plane
6abe3d65c3a4   kindest/node:v1.31.4   "/usr/local/bin/entr…"   About an hour ago   Up About an hour                               multi-node-cluster-worker
e7e120b8205a   kindest/node:v1.31.4   "/usr/local/bin/entr…"   About an hour ago   Up About an hour                               multi-node-cluster-worker2
{% endhighlight %}

Each container represents a node in your Kubernetes cluster. In this example, one control-plane node (`control-plane`) and two worker nodes (`worker`, `worker2`) have been created.

##### 3. Check Cluster Logs

You can also review Kind logs to diagnose potential issues during cluster startup:  
{% highlight bash %}
kind export logs --name multi-node-cluster
{% endhighlight %}

Example output:  
{% highlight plaintext %}
Exporting logs for cluster "multi-node-cluster" to:
/private/var/folders/j9/bnfyqnns4tzccm9jnvrxzx100000gn/T/436485870
{% endhighlight %}

This command exports the cluster logs to a local directory for detailed analysis:

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

With these checks, you can ensure that your cluster has been configured correctly. For more detailed information and full interaction with the cluster, it is now necessary to install and configure the `kubectl` client.

<hr class="hr-text" data-content="Kube Client">

## 4. Getting Started with kubectl

`kubectl` is the official Kubernetes command-line client. It allows interaction with the cluster, management of resources, and retrieval of detailed cluster state information. This section guides you through installing `kubectl` and introduces basic commands to explore and manage your cluster.

### 4.1. Download and Installation

The steps below provide examples for installing `kubectl` on different operating systems and configuring it to interact with a Kind cluster.

> warning ""
> There are multiple methods to install `kubectl` depending on your operating system and the package managers available.
>
> These examples reflect current practices and may evolve over time. For up-to-date information, refer to the official documentation: [https://kubernetes.io/docs/tasks/tools/install-kubectl/](https://kubernetes.io/docs/tasks/tools/install-kubectl/){:target="_blank" rel="noopener noreferrer nofollow"}.

Here are some examples tailored for major operating systems:

#### 4.1.1. Installation on Linux

- Download the `kubectl` binary:  
{% highlight bash %}
curl -LO https://dl.k8s.io/release/$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl
{% endhighlight %}

- Make it executable:  
{% highlight bash %}
chmod +x ./kubectl
{% endhighlight %}

- Move it to a directory included in your PATH:  
{% highlight bash %}
sudo mv ./kubectl /usr/local/bin/kubectl
{% endhighlight %}

#### 4.1.2. Installation on macOS

- Run the installation command:  
{% highlight bash %}
brew install kubectl
{% endhighlight %}

#### 4.1.3. Installation on Windows

- Check the latest stable version of the `kubectl` binary from [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt){:target="_blank" rel="noopener noreferrer nofollow"}.

- Download it, for example:  
{% highlight powershell %}
curl -LO https://dl.k8s.io/release/v1.32.0/bin/windows/amd64/kubectl.exe
{% endhighlight %}

- Add the binary to your PATH.

#### 4.1.4. Verify and Configure kubectl for the Kind Cluster

- Verify the installation in your shell:  
{% highlight shell %}
kubectl version --client
{% endhighlight %}

- You should see output similar to the following (versions may vary):  
{% highlight plaintext %}
Client Version: v1.32.0
Kustomize Version: v5.5.0
{% endhighlight %}

---
- Kind automatically configures the kubeconfig file to allow `kubectl` to interact with the cluster. To verify that `kubectl` is properly configured:  
{% highlight shell %}
kubectl cluster-info
{% endhighlight %}

- If the configuration is correct, you will see information about the cluster's API Server and Control Plane:  
{% highlight plaintext %}
Kubernetes control plane is running at https://127.0.0.1:51483
CoreDNS is running at https://127.0.0.1:51483/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
{% endhighlight %}

### 4.2. Basic Commands

Once `kubectl` is installed and configured, you can use the following commands to explore and interact with your cluster.

#### 4.2.1. Working with Contexts

> warning "For the CKA Exam"
> In Kubernetes, a context is a combination of **cluster, user, and namespace**.  
> It is crucial to work with the correct context, especially during the CKA exam, where context-related errors can lead to wasted time or misconfigurations.

Familiarize yourself with context management to avoid these issues. Here are some useful commands for working with contexts.

##### 4.2.1.1. Display the Current Configuration

{% highlight shell %}
kubectl config view
{% endhighlight %}

This command displays the complete current configuration, including clusters, users, and contexts defined in the kubeconfig file.

- Example output:  
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

##### 4.2.1.2. Add a New Context

To add a new context, use the following command:  
{% highlight shell %}
kubectl config set-context <context-name> \
  --cluster=<cluster-name> \
  --user=<user-name> \
  --namespace=<namespace>
{% endhighlight %}

For example:  
{% highlight shell %}
kubectl config set-context dev-cluster \
  --cluster=cluster-dev \
  --user=developer \
  --namespace=development
{% endhighlight %}

##### 4.2.1.3. Delete an Existing Context

Remove a specific context with the following command:  
{% highlight shell %}
kubectl config delete-context <context-name>
{% endhighlight %}

For example:  
{% highlight shell %}
kubectl config delete-context dev-cluster
{% endhighlight %}

##### 4.2.1.4. List Available Contexts

Use this command to list all available contexts:  
{% highlight shell %}
kubectl config get-contexts
{% endhighlight %}

- Example output:  
{% highlight plaintext %}
% kubectl config get-contexts
CURRENT   NAME                      CLUSTER                   AUTHINFO                  NAMESPACE
*         kind-multi-node-cluster   kind-multi-node-cluster   kind-multi-node-cluster
          production-cluster        prod-cluster              prod-user                 default
          dev-environment           dev-cluster               dev-user                  development
{% endhighlight %}

##### 4.2.1.5. Display the Active Context

{% highlight shell %}
kubectl config current-context
{% endhighlight %}

- Example output:  
{% highlight plaintext %}
% kubectl config current-context
kind-multi-node-cluster  
{% endhighlight %}

##### 4.2.1.6. Set a Default Context

{% highlight shell %}
kubectl config use-context kind-multi-node-cluster
{% endhighlight %}

- Example output:  
{% highlight plaintext %}
% kubectl config use-context kind-multi-node-cluster
Switched to context "kind-multi-node-cluster".
{% endhighlight %}

By configuring the context correctly, you ensure that all `kubectl` commands point to the intended cluster.

#### 4.2.2. Checking Cluster Status

- Display general information about a specific cluster:  
{% highlight shell %}
kubectl cluster-info --context kind-multi-node-cluster
{% endhighlight %}

- Example output:  
{% highlight plaintext %}
% kubectl cluster-info --context kind-multi-node-cluster
Kubernetes control plane is running at https://127.0.0.1:51483
CoreDNS is running at https://127.0.0.1:51483/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
{% endhighlight %}

#### 4.2.3. List Cluster Nodes

- Display the nodes in the cluster and their statuses:  
{% highlight shell %}
kubectl get nodes
{% endhighlight %}

- Example output:  
{% highlight plaintext %}
% kubectl get nodes
NAME                               STATUS   ROLES           AGE    VERSION
multi-node-cluster-control-plane   Ready    control-plane   139m   v1.31.4
multi-node-cluster-worker          Ready    <none>          139m   v1.31.4
multi-node-cluster-worker2         Ready    <none>          139m   v1.31.4
{% endhighlight %}

#### 4.2.4. Display Available Namespaces

- List all namespaces in the cluster:  
{% highlight shell %}
kubectl get namespaces
{% endhighlight %}

- Example output:  
{% highlight plaintext %}
% kubectl get namespaces
NAME                 STATUS   AGE
default              Active   140m
kube-node-lease      Active   140m
kube-public          Active   140m
kube-system          Active   140m
local-path-storage   Active   140m
{% endhighlight %}

#### 4.2.5. List Pods in a Namespace

- Check for any deployed pods in the default namespace:  
{% highlight shell %}
kubectl get pods
{% endhighlight %}

- Example output:  
{% highlight plaintext %}
% kubectl get pods
No resources found in default namespace.
{% endhighlight %}

---

- Check if there are any pods deployed in the `kube-system` namespace:  
{% highlight shell %}
kubectl get pods -n kube-system
{% endhighlight %}

- Example output:  
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

#### 4.2.6. Get Details of a Specific Resource

- Retrieve detailed information about a specific node:  
{% highlight shell %}
kubectl describe node <node-name>
{% endhighlight %}

- Example output:  
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

- Retrieve details about a pod:  
{% highlight shell %}
kubectl describe pod <pod-name>
{% endhighlight %}

- Example output:  
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

In this article, we explored the basics of configuring and interacting with a Kubernetes cluster. We covered key concepts such as Kubernetes architecture, setting up a cluster, installing the `kubectl` client, and using basic commands. These skills provide a foundation to deepen your understanding of Kubernetes and succeed in the CKA exam.

### Next Step

> info ""
> The next article in this series will focus on **Pods in Kubernetes**, the smallest deployable unit in the system. You will learn what a Pod is, how to create, manage, and interact with it, while also discovering its relationships with other cluster resources.<br><br>
> To progress in your learning, it is essential to practice regularly. Feel free to reproduce the commands and configurations from this article in a test environment. Continuous practice will enhance your mastery of the concepts and build your confidence for the exam.<br><br>
> Happy learning, and see you soon for the next chapter in this series!
