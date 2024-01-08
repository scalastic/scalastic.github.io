---
layout: post
title: "Comment Installer le Nouveau LLM Apple Ferret sur son Mac"
date: 2024-01-08 16:04:00 +0100
description: "Découvrez comment installer et utiliser Ferret, le LLM d'Apple, sur Mac avec Apple Silicon - un guide complet."
img: ferret-apple-mac-llm.jpg
fig-caption: Apple Ferret dans un Mac avec <a href="#">DALL•E</a>
tags: [AI, LLM, Ferret, MacOS]
lang: fr
permalink: /ferret-apple-mac-llm/
status: finished
---

Développé en collaboration avec l'Université Cornell, Apple a présenté très discrètement sur GitHub, son tout premier
modèle de LLM, Ferret. Bien après OpenAI, Meta ou encore Google, Apple se lance donc, à son tour, dans la course aux LLM.
L'approche est toutefois différente. Open source et multimodal, ce modèle combine vision par ordinateur et traitement du
langage naturel, offrant des capacités uniques en termes de compréhension et d'analyse du texte et des images. Plus 
puissant que GPT-4 d’OpenAI au dire d'Apple, cette avancée promet d'enrichir les appareils de la firme, notamment en améliorant 
l'interprétation des données et peut-être même de Siri.

Ironie du sort, bien qu'Apple ait arrêté d'utiliser et de supporter les produits de NVidia depuis 2016, son modèle 
Ferret a été développé en utilisant les cartes graphiques très performantes de NVidia, les A100. Le code source 
disponible sur [GitHub](https://github.com/apple/ml-ferret){:target="_blank" rel="noopener noreferrer nofollow"} ne fonctionne donc pas sur les produits de la Pomme.

Voyons comment y remédier et testons les capacités et la réactivité de cette toute première version de Ferret sur nos 
machines "Made by Apple".

<hr class="hr-text" data-content="Sommaire">

* TOC
{:toc}

<hr class="hr-text" data-content="Prérequis">

## CUDA, MPS et Prérequis

La plus grande adhérence du code de Ferret réside dans son utilisation de CUDA, le framework pour GPU de NVidia.
Heureusement, la librairie utilisée est PyTorch qui a été portée et optimisée pour les GPU Apple Silicon. Le portage vers
l'architecture Metal d'Apple sera d'autant plus simple.

L'autre point à noter est la documentation sommaire sur l'installation et l'utilisation de Ferret sur le site de GitHub,
preuve s'il en est, qu'Apple réserve son modèle LLM uniquement aux chercheurs comme le précise ses conditions d'utilisation.

Alors cherchons ensemble comment faire tourner ce Ferret sur nos Mac. Pour cela, gardons en tête qu'une quantité
substantielle de mémoire GPU est nécessaire. Nos tests ont été réalisés sur un MacBook Pro avec 64 Go de mémoire.

<hr class="hr-text" data-content="Installation">

## Installation de Ferret

### Étape 1 : Configurer de Git

Commencez par installer Git Large File Storage (LFS) pour gérer les tailles importantes des fichiers dont nous allons
avoir besoin :

{% highlight shell %}
brew install git-lfs
git lfs install
{% endhighlight %}

### Étape 2 : Télécharger le Code Source de Ferret

Le code officiel de Ferret est disponible sur [https://github.com/apple/ml-ferret](https://github.com/apple/ml-ferret){:target="_blank" rel="noopener noreferrer nofollow"}. J'ai adapté ce code pour les
processeurs Silicon et le framework Metal Performance Shaders (MPS) d'Apple, disponible sur [https://github.com/jeanjerome/ml-ferret/tree/silicon](https://github.com/jeanjerome/ml-ferret/tree/silicon){:target="_blank" rel="noopener noreferrer nofollow"} :

- La branche **_main_** contient le code d'origine d'Apple.
- La branche **_silicon_** contient ma version adaptée.

Cette structuration facilite la comparaison entre les deux versions. Pour cloner le code :

{% highlight shell %}
git clone https://github.com/jeanjerome/ml-ferret
cd ml-ferret
git switch silicon
{% endhighlight %}


### Étape 3 : Créer un Environnement Virtuel Python

Ferret utilise Python, donc créons un environnement virtuel avec Conda pour isoler les dépendances :

{% highlight shell %}
conda create -n ferret python=3.10 -y
conda activate ferret
{% endhighlight %}

Installez ensuite les dépendances nécessaires :

{% highlight shell %}
pip install --upgrade pip
pip install -e .
pip install pycocotools
pip install protobuf==3.20.0
{% endhighlight %}

### Étape 4 : Installer le Modèle Vicuna

Placez le modèle Vicuna dans le répertoire `./model` à la racine du projet :

{% highlight shell %}
mkdir -p ./model
git lfs install
git clone https://huggingface.co/lmsys/vicuna-13b-v1.3 model
{% endhighlight %}

Patientez pendant le téléchargement du modèle.

### Étape 5 : Télécharger les Poids de Ferret

Apple fournit un fichier avec les différences entre les poids de Vicuna et Ferret. Téléchargez-les :

{% highlight shell %}
mkdir -p ./delta
curl -o ./delta/ferret-13b-delta.zip https://docs-assets.developer.apple.com/ml-research/models/ferret/ferret-13b/ferret-13b-delta.zip
unzip ./delta/ferret-13b-delta.zip
{% endhighlight %}

Cette étape peut prendre un peu de temps.


### Étape 6 : Transformer Vicuna en Ferret

Pour appliquer les modifications de Ferret sur Vicuna :

{% highlight shell %}
python -m ferret.model.apply_delta \
  --base ./model/vicuna-13b-v1.3 \
  --target ./model/ferret-13b-v1-3 \
  --delta ./delta/ferret-13b-delta
{% endhighlight %}

Suivez les logs pour confirmer le bon déroulement de l'opération :

{% highlight shell %}
/opt/homebrew/Caskroom/miniconda/base/envs/ferret/lib/python3.10/site-packages/bitsandbytes/cextension.py:34: UserWarning: The installed version of bitsandbytes was compiled without GPU support. 8-bit optimizers, 8-bit multiplication, and GPU quantization are unavailable.
warn("The installed version of bitsandbytes was compiled without GPU support. "
'NoneType' object has no attribute 'cadam32bit_grad_fp32'
Loading base model
Loading checkpoint shards: 100%|██████████████████████████████████████████████████████| 3/3 [00:04<00:00,  1.57s/it]
Loading delta
Loading checkpoint shards: 100%|██████████████████████████████████████████████████████| 3/3 [00:08<00:00,  2.94s/it]
Applying delta
Applying delta: 100%|█████████████████████████████████████████████████████████████| 421/421 [00:16<00:00, 26.04it/s]
Saving target model
{% endhighlight %}

Vous venez d'installer Ferret sur votre Mac.


<hr class="hr-text" data-content="Démarrage">

## Lancement de la démo de Ferret

La démo fournie par Apple permet d'apprécier les capacités du nouveau modèle via une interface web.

Ce démonstrateur inclut un contrôleur, un serveur web Gradio et un worker de modèle qui charge les poids et effectue 
l'inférence.

Lancez la démo avec ces commandes dans trois terminaux séparés :

### Étape 7 : Premier Terminal

Démarrez le contrôleur :

{% highlight shell %}
python -m ferret.serve.controller --host 0.0.0.0 --port 10000
{% endhighlight %}

Attendez le message indiquant que le contrôleur est opérationnel : `Uvicorn running on http://0.0.0.0:10000 (Press CTRL+C to quit)`

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/ferret-starting-controller.png --alt Démarrage du controleur %}
  <figcaption>Démarrage du controleur</figcaption>
</figure>

### Étape 8 : Deuxième Terminal

Lancez le serveur web :

{% highlight shell %}
python -m ferret.serve.gradio_web_server --controller http://localhost:10000 --model-list-mode reload --add_region_feature
{% endhighlight %}

Attendez que s'affiche la ligne `Running on local URL:  http://0.0.0.0:7860` :

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/ferret-starting-web-ui.png --alt Démarrage de l'interface Web %}
  <figcaption>Démarrage de l'interface Web</figcaption>
</figure>

### Étape 9 : Troisième Terminal

Exécutez le worker de modèle :

{% highlight shell %}
python -m ferret.serve.model_worker --host 0.0.0.0 --controller http://localhost:10000 --port 40000 --worker http://localhost:40000 --model-path ./model/ferret-13b-v1-3 --add_region_feature
{% endhighlight %}

Surveillez les logs pour vérifier que tout fonctionne correctement : `Uvicorn running on http://0.0.0.0:40000 (Press CTRL+C to quit)`

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/ferret-starting-worker-model.png --alt Démarrage du Modèle %}
  <figcaption>Démarrage du Modèle</figcaption>
</figure>

### Étape 10 : Accéder à la démo

Cliquez sur l'adresse [http://localhost:7860/](http://localhost:7860/){:target="_blank" rel="noopener noreferrer nofollow"} pour accéder à l'interface web de la démo.

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/ferret-web-interface.png --alt Interface du démonstrateur Ferret %}
  <figcaption>Interface du démonstrateur Ferret</figcaption>
</figure>


<hr class="hr-text" data-content="Test">

## Test de la démo

Apple a inclus des tests avec images et prompts pré-remplis pour évaluer Ferret.

Testons-les !

### Test 1 : Le chien et les furets

- Sélectionnez la première image (le chien blanc) dans `Examples`.
- Dans `Referring Input Type`, choisissez `Sketch`.
- Dessinez sur le chien et le furet dans `Image & Sketch`.
- Cliquez enfin sur le bouton `Soumettre` en face du prompt `What’s the relationship between object [region0] and object [region1]?`

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/ferret-test-the-dog-and-the-ferrets.png --alt Test du chien et des furets %}
  <figcaption>Test du chien et des furets</figcaption>
</figure>

Les réponses varient, mais restent cohérentes avec l'image et dépendent sans doute des pixels sélectionnés :

- **Essai 1** : `The object [497, 303, 791, 658] is a dog, and it’s standing next to another dog [307, 507, 459, 690]. They seem to be enjoying their time together in the snow.`
- **Essai 2** : `The object [457, 283, 817, 701] is a dog, and the object [318, 498, 464, 707] is a ferret. The dog and the ferret appear to be sitting together in the snow, suggesting a friendly interaction or companionship.`

> info "Limitations"
> Ferret peut consommer beaucoup de mémoire, et il peut être nécessaire de redémarrer le modèle entre deux tests.
> Sur mon MacBook M1 Max et ses 64 Go, 62 Go de RAM étaient utilisées, 2 Go de fichiers mis en cache et 20 Go pour le 
> fichier d'échange.


### Test 2 : Le ponton sur le lac

- Sélectionnez la deuxième image (le ponton).
- Sans dessiner, soumettez le prompt en cliquant sur le bouton `Soumettre` en face du prompt `What are the things I should be cautious about when I visit here? Tell me the coordinates in response.`

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/ferret-test-the-jetty-on-the-lake.png --alt Test du ponton sur le lac %}
  <figcaption>Test du ponton sur le lac</figcaption>
</figure>

- **Résultat** : `When you’re on the dock [218, 535, 810, 993], you should be mindful of a few things. Firstly, the water [0, 518, 998, 997] is a crucial aspect, and you should be careful not to go too close to the edge [731, 543, 998, 591]. Secondly, the surrounding trees [875, 366, 940, 510] [707, 385, 757, 535] [650, 393, 695, 529] [512, 420, 540, 526] [775, 375, 818, 522] could pose a hazard if you’re not cautious. Lastly, it’s important to be aware of the path [218, 535, 810,] to ensure you stay on the right track to avoid any unintentional falls or injuries.`

### Test 3 : Le salon

- Choisissez la troisième image (le salon).
- Soumettez le prompt sans dessiner en cliquant sur le bouton `Soumettre` en face du prompt `What are the things I should be cautious about when I visit here? Tell me the coordinates in response.`
- Ferret commence à nous répondre...

<figure class="article">
  {% picture {{site.baseurl}}/assets/img/ferret-test-the-living-room.png --alt Test du salon %}
  <figcaption>Test du salon</figcaption>
</figure>

- **Résultat** : 
  - Ferret rédige lentement sa réponse. On sent qu'il se sent à l'étroit dans les 64 Go de RAM.
  - Il parvient tout même à rédiger ceci : `The image depicts a cozy living room [12, 1, 982, 989] with various pieces of furniture [490, 588, 709, 883] and decorations [244, 27, 394, 110] [247, 28, 274, 109] [378, 43, 411, 108]. In the center, there is a colorful, multicolored rug [90, 689, 746, 994] on the floor. A flat-screen TV [1, 394, 93, 723] is mounted on the left wall, with remotes [5, 679, 60, 734] placed nearby. Two couches [513, 421, 938, 769] [501, 577, 993, 995] are arranged in the room, with one along the right wall and another on the far end of the room. A few chairs are also present, scattered around the room. A dining table [710, 392, 954, 511] [`
  - Avant de planter lamentablement avec un `NETWORK ERROR DUE TO HIGH TRAFFIC. PLEASE REGENERATE OR REFRESH THIS PAGE. (error_code: 1)`
  - Dans les logs, on peut lire : `Caught Unknown Error MPS backend out of memory (MPS allocated: 26.50 GB, other allocations: 55.14 GB, max allowed: 81.60 GB). Tried to allocate 10.00 KB on private pool. Use PYTORCH_MPS_HIGH_WATERMARK_RATIO=0.0 to disable upper limit for memory allocations (may cause system failure).`

Pas de solution donc pour mon MacBook Pro, les 80 Go occupés par Ferret ne suffisent pas...


<hr class="hr-text" data-content="Conclusion">

## Conclusion

En conclusion, l'intégration de Ferret, le dernier né des modèles LLM d'Apple, sur les machines équipées de processeurs 
Apple Silicon, représente une avancée notable dans le domaine de l'intelligence artificielle. Malgré quelques défis 
inhérents à l'adaptation du code initial, qui était conçu pour les GPU NVidia, les efforts de portage vers 
l'architecture Metal d'Apple ont été très simples.

L'installation et le déploiement de Ferret, bien qu'exigeant en termes de mémoire et de ressources, ouvrent des 
perspectives passionnantes pour les utilisateurs de Mac. Les démonstrations fournies avec le code source illustrent la 
puissance et la polyvalence de Ferret, capable d'analyser et d'interpréter des données visuelles et textuelles de 
manière approfondie.

Il est important de noter que cette implémentation de Ferret, malgré sa puissance, reste gourmande en ressources, 
particulièrement en mémoire vive. Nul doute qu'Apple va, à présent, adapter son nouveau modèle à ses 
machines et notamment aux iPhones. Son potentiel pour améliorer les applications existantes et en créer de nouvelles est
immense, et on peut s'attendre à ce que sa prochaine évolution apporte encore plus d'innovations et de fonctionnalités.
