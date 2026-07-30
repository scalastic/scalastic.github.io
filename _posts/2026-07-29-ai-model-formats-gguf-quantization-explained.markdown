---
layout: post
title: "GGUF, Q4_K_M, IQ3_XXS : tout comprendre aux formats des modèles d'IA"
date: 2026-07-30 14:00:00 +0200
description: "Formats, quantifications et étiquettes des modèles d'IA expliqués simplement : GGUF, safetensors, Q4_K_M, MXFP4, LoRA. Et surtout, lequel télécharger."
img: ai-model-formats-gguf-quantization-explained.jpg
fig-caption: Illustration générée par IA
tags: ["IA", "LLM", "GGUF", "Quantification", "Safetensors", "LoRA", "MLX", "llama.cpp", "Hugging Face", "Open Weights"]
lang: fr
permalink: /ai-model-formats-gguf-quantization-explained/
status: finished
---


Vous voulez faire tourner un modèle d'IA sur votre machine. Vous arrivez sur Hugging Face, vous ouvrez la liste des fichiers, et vous tombez sur ça :

{% highlight text %}
model.safetensors
model-00001-of-00004.safetensors
Qwen3.5-35B-A3B-Q4_K_M.gguf
Qwen3.5-35B-A3B-UD-Q4_K_XL.gguf
Qwen3.5-35B-A3B-IQ3_XXS.gguf
mmproj-F16.gguf
adapter_model.safetensors
tokenizer.json
{% endhighlight %}

Huit fichiers, huit vocabulaires différents. Rien ne vous dit lequel prendre, ni pourquoi il y en a autant. Et la documentation, quand elle existe, suppose que vous savez déjà.

Le problème n'est pas que ces noms soient mal choisis. C'est qu'ils décrivent **des choses de nature complètement différente**, empilées dans un seul nom de fichier. `safetensors` est un format de stockage. `Q4_K_M` est une méthode de compression. `A3B` décrit l'architecture du modèle. `UD-` est une marque de fournisseur. `mmproj` est un composant séparé. `00001-of-00004` prévient qu'il manque trois autres fichiers. Tout cela cohabite sans hiérarchie visible.

Cet article démonte la pile, couche par couche. On part de ce qu'est réellement un modèle téléchargeable, on remonte vers les formats de fichiers, puis vers la précision numérique, puis vers la quantification, et on finit par les étiquettes exotiques que personne ne vous explique jamais. À la fin, vous saurez lire la grande majorité des noms que vous croiserez, et surtout savoir lequel télécharger.


<hr class="hr-text" data-content="Sommaire">

* TOC
{:toc}


<hr class="hr-text" data-content="Les bases">

## 1. Ce qu'on télécharge vraiment

### 1.1. Un modèle, c'est un gros tableau de nombres

Quand vous téléchargez un modèle de langage, vous ne téléchargez ni un programme, ni une base de connaissances au sens classique. Vous téléchargez **des poids** : des matrices de nombres, issues de l'entraînement, qui encodent tout ce que le modèle a appris.

Ces blocs de nombres portent un nom technique qui reviendra sans cesse dans cet article : un **tenseur** est un tableau de nombres, à une, deux ou plusieurs dimensions. Un modèle en contient des milliers, chacun étiqueté de façon à indiquer à quelle couche et à quelle fonction il sert, par exemple `model.layers.12.self_attn.q_proj.weight`.

Ces nombres n'ont aucun sens pris isolément. Ils ne prennent vie que quand un programme (le *runtime*, ou *moteur d'inférence*) les charge en mémoire et les fait travailler dans le bon ordre. C'est une distinction fondamentale, et elle explique la moitié de la confusion :

* Le **fichier de poids** est passif. C'est de la donnée.
* Le **runtime** (`llama.cpp`, Ollama, vLLM, MLX, LM Studio…) est actif. C'est du code.

Un format de fichier ne détermine donc pas seul la vitesse. Elle naît de la rencontre entre le format, la représentation numérique stockée, le runtime, ses kernels et le matériel.

### 1.2. Les paramètres : le premier chiffre à regarder

Dans `Llama-3.1-8B` ou `Qwen3.5-35B`, le nombre suivi de `B` désigne les **milliards de paramètres** (*billions*, en anglais). C'est la quantité de valeurs numériques stockées dans le modèle.

Ce chiffre gouverne deux choses : la capacité du modèle, et surtout **la mémoire qu'il faut pour le charger**. La formule de base est d'une simplicité désarmante :

> info ""
> **Mémoire ≈ nombre de paramètres × nombre d'octets par paramètre**

Un modèle de 8 milliards de paramètres stocké sur 2 octets chacun demande environ 16 Go. Sur 4 bits, le calcul théorique donne 4 Go ; en pratique une quantification 4 bits pèse plutôt 4,5 à 5 Go, parce qu'elle stocke aussi des facteurs d'échelle et conserve certains tenseurs en précision plus haute. C'est exactement ce que fait la quantification, et c'est pour ça qu'elle occupe la moitié de cet article.

Une précision qui évite bien des déconvenues : cette formule estime le poids des **paramètres**, pas la mémoire totale nécessaire à l'exécution. Il faut y ajouter le cache KV, les buffers du runtime, les activations temporaires et une marge pour le système.

> info ""
> **Les trois postes de mémoire qu'on oublie.**
>
> * **Le cache KV** garde les clés et valeurs d'attention des tokens déjà traités, pour éviter de tout recalculer à chaque nouveau token. Il grandit avec la longueur du contexte et le nombre de requêtes simultanées : c'est lui qui déborde sur les contextes longs.
> * **Les buffers du runtime** sont les espaces de travail réservés par le moteur au chargement. Leur taille dépend du modèle, du backend et du contexte maximal configuré.
> * **Les activations temporaires** sont les résultats intermédiaires produits couche après couche. Leur mémoire est recyclée en continu, mais leur pic monte avec le nombre de tokens traités ensemble.
>
> Comptez environ 20 % au-dessus du poids des poids pour un usage mono-utilisateur en contexte modéré. Ce n'est qu'un ordre de grandeur : à 100 000 tokens, le cache KV seul peut peser plusieurs dizaines de gigaoctets.


### 1.3. Et un modèle commercial, il pèse combien ?

La question vient naturellement : si un 8B demande 16 Go, que faudrait-il pour Claude Fable 5, GPT ou Gemini ? La réponse honnête est que **seuls leurs concepteurs le savent**. Les éditeurs de modèles fermés ne publient ni le nombre de paramètres, ni l'architecture exacte, ni la précision utilisée en production. Tous les chiffres qui circulent sont des estimations ou des fuites invérifiables, et les citer comme des faits serait malhonnête.

Ce qu'on peut faire, en revanche, c'est calibrer l'ordre de grandeur sur les plus gros modèles à poids ouverts, puisque la formule, elle, ne change pas :

| Modèle | Paramètres totaux | Actifs par token | Poids publiés | Si publié en BF16 |
| --- | --- | --- | --- | --- |
| Llama 4 Maverick | 400 milliards | 17 milliards | ~800 Go (BF16) | ~800 Go |
| DeepSeek-V4-Flash | 284 milliards | ~13 milliards | ~146 Go (FP4/FP8 mixte) | ~570 Go |
| DeepSeek-V4-Pro | 1 600 milliards | ~49 milliards | ~865 Go (FP4/FP8 mixte) | ~3,2 To |
| Kimi K3 | 2 800 milliards | 104 milliards | ~1,56 To (MXFP4) | ~5,6 To |

> info ""
> **Dense ou MoE ?** Deux façons de construire un modèle, et deux lectures de la colonne « actifs par token ».
>
> * Un modèle **dense** fait travailler tous ses paramètres pour chaque token. Total et actifs se confondent.
> * Un modèle **MoE** (*Mixture of Experts*) remplace certaines couches par un ensemble d'**experts**, des sous-réseaux spécialisés. Un petit réseau appelé **routeur** en sélectionne quelques-uns à chaque token ; les autres restent inertes.
>
> D'où les deux nombres : les **paramètres totaux** dictent la mémoire, puisqu'il faut tout charger, et les **paramètres actifs** dictent le calcul. Le nommage de ces modèles, du type `35B-A3B`, est décrypté plus loin.

Trois enseignements se lisent directement dans ce tableau.

D'abord, **la basse précision n'est plus une opération de tiers : elle est dans la publication d'origine**. DeepSeek-V4 sort en FP4/FP8 mixte, Kimi K3 en MXFP4 obtenu par entraînement conscient de la quantification. Les éditeurs n'attendent plus qu'un tiers compresse leur modèle, ils livrent directement la version compressée.

Ensuite, **la mémoire se dimensionne sur le total, pas sur les paramètres actifs**. Kimi K3 n'active que 104 milliards de paramètres par token sur 2 800 milliards, soit moins de 4 %, et il faut malgré tout charger les 1,56 To. Un MoE économise du calcul, pas de la mémoire.

Enfin, **les plus gros modèles ne sont pas toujours publiés**. Le Llama 4 Behemoth de Meta, annoncé autour de 2 000 milliards de paramètres, n'a jamais reçu de poids publics : il sert de modèle enseignant pour distiller Scout et Maverick.

Un modèle propriétaire de premier plan se situe vraisemblablement dans ces eaux, voire au-dessus. À cette échelle, les poids ne tiennent plus sur une machine : ils sont répartis sur plusieurs dizaines de GPU de datacenter interconnectés, et le service est mutualisé entre des milliers d'utilisateurs simultanés. C'est ce qui explique, au-delà de la question de licence, que vous n'exécuterez pas Claude ou GPT sur votre portable : l'écart de mémoire avec un 8B se compte en centaines de fois.

> info ""
> À retenir : la formule **paramètres × octets par paramètre** ne connaît pas d'exception. Un modèle fermé n'échappe pas à la physique, il échappe seulement à la publication de ses chiffres.

### 1.4. « Open weights » n'est pas « open source »

Le vocabulaire marketing entretient ici une confusion qu'il vaut mieux lever tout de suite.

* Un modèle **open weights** publie ses poids. Vous pouvez le télécharger, l'exécuter hors ligne, l'adapter. Mais les données d'entraînement et le code d'entraînement complet restent, en général, non publiés.
* Un modèle **open source** au sens de la [définition OSI](https://opensource.org/ai/open-source-ai-definition){:target="_blank" rel="noopener noreferrer nofollow"} fournit en plus les paramètres, le code nécessaire pour entraîner et exécuter le système, et des informations sur les données assez détaillées pour qu'une personne compétente puisse reconstruire un système substantiellement équivalent. La définition n'impose pas de publier le jeu de données brut, souvent bloqué par le droit d'auteur ou la vie privée. Certains projets vont plus loin : la famille [OLMo](https://allenai.org/olmo){:target="_blank" rel="noopener noreferrer nofollow"} d'AI2 publie aussi son dataset, ses journaux et ses centaines de checkpoints intermédiaires sous Apache 2.0.

Mistral AI occupe l'autre bout du spectre, et c'est le contre-exemple le plus instructif. Ses modèles sortent sous Apache 2.0, en versions base et instruct, ce qui est aussi permissif qu'OLMo côté licence. Mais l'éditeur [écrit noir sur blanc](https://help.mistral.ai/en/articles/347390-does-mistral-ai-disclose-its-training-datasets){:target="_blank" rel="noopener noreferrer nofollow"} qu'il ne divulgue pas les jeux de données d'entraînement, conservés comme actifs propriétaires au même titre que sa logique d'entraînement. Licence permissive et transparence des données sont donc deux axes indépendants : Apache 2.0 vous dit ce que vous pouvez faire du modèle, pas ce que vous saurez de lui.

La différence n'est pas que théorique, parce qu'elle se traduit dans la licence. Apache 2.0 et MIT sont approuvées par l'OSI et autorisent l'usage commercial, moyennant des obligations légères : conserver les mentions de copyright et de licence, plus une clause de brevets côté Apache 2.0. Les licences maison (la *Llama Community License* en est l'exemple le plus connu) peuvent au contraire imposer un seuil d'utilisateurs au-delà duquel une autorisation devient nécessaire, ou restreindre certains domaines d'application. Les clauses bougent d'une version à l'autre : la licence Llama 3 encadrait strictement l'usage des sorties pour améliorer un autre modèle, et la licence Llama 4 a assoupli ce point. Lisez la version exacte qui s'applique au modèle que vous téléchargez.

> warning ""
> Avant de bâtir un produit sur un modèle, **lisez sa licence**, pas son slogan. « Ouvert » ne veut rien dire juridiquement.


<hr class="hr-text" data-content="Anatomie">

## 2. Anatomie d'un dépôt de modèle

Les modèles se téléchargent depuis le [Hub Hugging Face](https://huggingface.co/models){:target="_blank" rel="noopener noreferrer nofollow"}, le catalogue central de l'écosystème, dont les filtres par tâche, bibliothèque, licence ou format sont le moyen le plus rapide de retrouver une variante précise. Chaque modèle y occupe un **dépôt**, techniquement un dépôt Git doublé d'un stockage pour gros fichiers, avec ses fichiers, sa model card et son historique de versions.

Ouvrez n'importe quel dépôt « standard » (non quantifié), et vous trouverez toujours à peu près la même chose :

{% highlight text %}
config.json                        → le plan d'architecture
model-00001-of-00004.safetensors   → les poids, morceau 1/4
model-00002-of-00004.safetensors   → les poids, morceau 2/4
...
model.safetensors.index.json       → la carte : quel poids dans quel morceau
tokenizer.json                     → le découpeur de texte
tokenizer_config.json              → sa configuration, dont le chat template
special_tokens_map.json            → les jetons spéciaux
generation_config.json             → les réglages de génération par défaut
README.md                          → la model card
{% endhighlight %}

### 2.1. `config.json` : le plan

Ce fichier décrit l'**architecture** : nombre de couches, taille du vocabulaire, nombre de têtes d'attention (pour chaque mot, elles repèrent quels autres mots du texte aident à le comprendre, par exemple à quoi renvoie un pronom ; chaque couche en compte plusieurs, qui travaillent en parallèle), dimensions internes. C'est le plan de montage. Sans lui, les poids ne sont qu'un tas de nombres qu'on ne sait pas assembler.

C'est aussi ce fichier que lit un runtime pour savoir s'il **sait** exécuter ce modèle. Quand `llama.cpp` ou vLLM vous répond « architecture non supportée », c'est ici que ça s'est joué.

### 2.2. Les shards : pourquoi votre modèle est en quatre morceaux

Les gros modèles sont découpés en fichiers de quelques gigaoctets, les *shards*, nommés `model-00001-of-00004.safetensors`. Ce n'est pas une variante, c'est **un seul fichier logique découpé**. Il vous les faut tous.

Le fichier `model.safetensors.index.json` contient la carte (`weight_map`) qui indique quel tenseur se trouve dans quel morceau. La même logique existe côté GGUF, où les fichiers sont nommés `...-00001-of-00003.gguf`.

> warning ""
> Au moment où ces lignes sont écrites, Ollama ne charge pas toujours directement un GGUF découpé, selon son mode de distribution et la version utilisée. Une fusion préalable avec `llama-gguf-split --merge` peut être nécessaire. LM Studio, lui, les gère nativement.

### 2.3. Le tokenizer : l'interprète

Un modèle ne lit pas du texte. Il lit des entiers. Le **tokenizer** fait la traduction dans les deux sens : il découpe votre phrase en *tokens* (des fragments de mots), les convertit en identifiants numériques, et fait le chemin inverse à la sortie.

C'est un composant **distinct des poids**, mais tout aussi indispensable. Servi avec un tokenizer incompatible, un modèle peut produire du charabia, ou subir une dégradation majeure sans pour autant devenir illisible.

### 2.4. Le chat template : le piège le plus courant

Dans `tokenizer_config.json`, ou dans un fichier dédié selon le dépôt, se cache souvent un **chat template** : le gabarit exact qui transforme une conversation en une seule chaîne de caractères, avec les bons marqueurs de rôle et les bons jetons de contrôle.

C'est un piège fréquent. Avec le bon tokenizer mais un mauvais chat template, un excellent modèle reste parfaitement lisible tout en suivant très mal les consignes, simplement parce qu'on lui a envoyé le prompt dans le mauvais moule ou parce qu'un jeton `<bos>` a été dupliqué. D'où la règle :

{% highlight python %}
from transformers import AutoTokenizer

tok = AutoTokenizer.from_pretrained("Qwen/Qwen3-0.6B")
messages = [{"role": "user", "content": "Bonjour"}]

# Utilisez toujours ceci...
inputs = tok.apply_chat_template(messages, tokenize=True, add_generation_prompt=True)

# ...plutôt que de fabriquer la chaîne de prompt à la main.
{% endhighlight %}


<hr class="hr-text" data-content="La carte mentale">

## 3. Quatre questions à ne jamais mélanger

Voici le cœur de l'article. La plupart des malentendus viennent du fait qu'un seul nom de fichier répond simultanément à quatre questions indépendantes. Séparez-les, et tout devient lisible.

| Question | Ce qu'elle décrit | Exemples de réponses |
| --- | --- | --- |
| **Dans quoi c'est rangé ?** | Le format de fichier, le conteneur | `safetensors`, `GGUF`, `ONNX`, `.pt` |
| **Avec quelle précision ?** | Le nombre de bits par poids | `BF16`, `FP8`, `Q4_K_M`, `NF4`, `MXFP4` |
| **Comment c'est spécialisé ?** | La méthode d'adaptation | modèle de base, `Instruct`, LoRA, finetune complet |
| **Avec quoi ça s'exécute ?** | Le runtime cible | `llama.cpp`, vLLM, MLX, ONNX Runtime |

Une analogie qui tient la route : le **format** est la valise ; la **quantification** est la façon dont vous pliez et compressez les vêtements ; l'**adapter** est un kit d'accessoires qu'on ajoute sans refaire la garde-robe ; le **finetune complet** consiste à refaire toute la garde-robe ; et le **tokenizer** est la langue que vous parlez une fois arrivé.

Le chemin de vie typique d'un modèle suit d'ailleurs cet ordre :

{% highlight text %}
Entraînement                 Adaptation                 Compression            Conversion
     │                           │                           │                     │
     ▼                           ▼                           ▼                     ▼
checkpoint BF16   ──►   LoRA / finetune complet   ──►   quantification   ──►   GGUF / MLX
(safetensors)              (adapter ou                 (Q4_K_M, AWQ,          (conteneur de
                         checkpoint complet)             NF4, MXFP4…)          déploiement)
{% endhighlight %}

Chaque étape est optionnelle et indépendante des autres. C'est pour cette raison qu'un même modèle existe en dizaines de variantes.

> note ""
> **Erreur classique n°1** : croire que « GGUF » est une quantification. Non : GGUF est un conteneur, qui peut contenir des poids non quantifiés (`F16`) aussi bien que du `Q4_K_M`.<br>
> **Erreur classique n°2** : croire que « MLX » est un format de fichier comparable à GGUF. Non : MLX est un framework et un outillage ; les dépôts MLX sont, en pratique, des safetensors.


<hr class="hr-text" data-content="Conteneurs">

## 4. Les formats de fichiers

### 4.1. Safetensors : le standard de fait

C'est le format par défaut de l'écosystème Hugging Face, et celui dans lequel arrive une grande partie des modèles à leur sortie.

Sa structure est volontairement minimale : 8 octets indiquant la taille de l'en-tête, puis un en-tête JSON décrivant chaque tenseur (nom, forme, type, décalage), puis les octets bruts des tenseurs, à la suite, sans trou.

{% highlight text %}
┌────────────┬─────────────────────────┬──────────────────────────┐
│  8 octets  │   en-tête JSON          │   données brutes         │
│  taille    │   {"model.layers.0...": │   (tenseurs contigus)    │
│  en-tête   │    {dtype, shape,       │                          │
│            │     data_offsets}}      │                          │
└────────────┴─────────────────────────┴──────────────────────────┘
{% endhighlight %}

Son nom vient de son argument principal : la **sécurité**. Le format historique de PyTorch (`.pt`, `.bin`, `.pth`) s'appuie sur `pickle`, le mécanisme de sérialisation de Python, qui peut déclencher l'**exécution de code arbitraire au chargement**. Le risque s'est nettement réduit depuis PyTorch 2.6, où `torch.load()` utilise par défaut `weights_only=True` et restreint fortement ce que le désérialiseur accepte. Il réapparaît dès qu'on repasse en `weights_only=False`. Safetensors, lui, ne contient que des données : il n'y a rien à exécuter.

S'y ajoutent des garde-fous concrets : en-tête limité à 100 Mo pour éviter les attaques par déni de service, et garantie que les plages d'octets ne se chevauchent pas. Enfin, le chargement est très rapide car les tenseurs peuvent être lus en `mmap`, sans copie intermédiaire.

> warning ""
> Préférez la variante safetensors quand elle existe. Ne chargez un ancien checkpoint PyTorch que depuis une source de confiance, et méfiez-vous du code qui force `weights_only=False` pour « faire marcher » un chargement.

### 4.2. GGUF : le format du local

`GGUF` (*GGML Universal File*) est le format de la famille [`llama.cpp`](https://github.com/ggml-org/llama.cpp){:target="_blank" rel="noopener noreferrer nofollow"}, et par ricochet celui d'Ollama, LM Studio, Jan, KoboldCpp et de la plupart des outils d'inférence locale.

Ses quatre propriétés de conception expliquent son succès :

* **Autonome dans le cas courant** : les poids, les métadonnées **et le tokenizer** tiennent dans le même fichier. Un seul `.gguf` suffit alors à lancer le modèle, sans `config.json` à côté ni dépôt à cloner. Les très gros modèles restent toutefois découpés en plusieurs GGUF, et les modèles multimodaux s'accompagnent d'un fichier compagnon.
* **Métadonnées clé-valeur typées** : le format est extensible sans casser la compatibilité ascendante.
* **Chargement par `mmap`** : le modèle est mappé en mémoire plutôt que lu d'un bloc, ce qui évite des copies et raccourcit le démarrage. Les premières lectures provoquent encore des défauts de page, et le runtime doit initialiser ses structures.
* **Optimisé pour l'inférence**, pas pour l'entraînement.

En contrepartie, GGUF est **fortement lié à son écosystème**. Un modèle n'existe en GGUF que si son architecture a été implémentée dans `llama.cpp`. C'est pourquoi les GGUF d'un modèle tout juste sorti arrivent parfois quelques jours après les safetensors.

{% highlight bash %}
# La chaîne officielle : safetensors → GGUF → GGUF quantifié → exécution
python convert_hf_to_gguf.py --outfile model-bf16.gguf --outtype bf16 --remote <repo_hf>
./build/bin/llama-quantize model-bf16.gguf model-Q4_K_M.gguf Q4_K_M
./build/bin/llama-cli -m model-Q4_K_M.gguf -p "Bonjour"
{% endhighlight %}

Notez bien la deuxième ligne : la quantification est une **étape distincte**, appliquée *à* un GGUF. C'est la preuve que GGUF n'est pas une quantification. Reste que lancer un GGUF suppose deux choses : que le runtime connaisse son architecture, et qu'il sache lire son type de quantification.

### 4.3. Les dépôts MLX : le chemin Apple Silicon

[MLX](https://github.com/ml-explore/mlx){:target="_blank" rel="noopener noreferrer nofollow"} est le framework de calcul d'Apple pour ses puces maison, pensé pour la **mémoire unifiée** et accéléré par Metal. `mlx-lm` en est le package Python dédié aux modèles de langage : génération, conversion, quantification, fine-tuning et serveur HTTP.

Point important pour éviter le contresens : **MLX n'est pas un format de fichier**. C'est un framework plus un outillage. Les dépôts MLX que vous trouvez sur le Hub (l'organisation `mlx-community` en héberge plusieurs milliers) sont en pratique des **safetensors**, accompagnés d'une configuration décrivant le schéma de quantification MLX (souvent en 4 bits avec un *group size* de 64).

{% highlight bash %}
# Convertir un modèle Hugging Face en dépôt MLX quantifié
python -m mlx_lm.convert --hf-path mistralai/Mistral-7B-v0.1 -q

# Générer du texte
python -m mlx_lm.generate --model mlx-community/Mistral-7B-Instruct-v0.3-4bit --prompt "Bonjour"

# Servir une API compatible OpenAI
mlx_lm.server --model mlx-community/Mistral-7B-Instruct-v0.3-4bit
{% endhighlight %}

Le verrou de compatibilité, ici, est surtout **matériel**, mais il s'est déplacé. `mlx-lm` reste conçu et documenté avant tout pour Apple Silicon, et c'est là que l'écosystème `mlx-community` prend son sens. Le framework MLX lui-même a depuis gagné un backend CUDA et une variante CPU pour Linux ; c'est l'accélération Metal, elle, qui suppose un Mac.

### 4.4. ONNX : la portabilité industrielle

`ONNX` est d'une autre nature : il ne stocke pas que des poids, il stocke **un graphe de calcul** plus des poids. Cela le rend portable entre runtimes et matériels très différents (CPU, GPU, NPU, accélérateurs embarqués) et permet des optimisations poussées via ONNX Runtime.

C'est le format qu'on croise en production embarquée, en edge computing et dans les chaînes d'inférence industrielles. Pour du LLM local sur poste de travail, il est nettement moins pratique que GGUF : plus d'ingénierie, moins de modèles prêts à l'emploi.

### 4.5. Récapitulatif des formats

| Format | Nature | Contient le tokenizer ? | Écosystème type | Bon pour |
| --- | --- | --- | --- | --- |
| **Safetensors** | Conteneur de tenseurs | Non (fichiers séparés) | Hugging Face, PyTorch, vLLM, MLX | Point de départ, entraînement, serveurs GPU |
| **GGUF** | Conteneur autonome | **Oui** | `llama.cpp`, Ollama, LM Studio | Inférence locale, CPU et GPU grand public |
| **ONNX** | Graphe + poids | Non | ONNX Runtime, embarqué | Portabilité multi-matériel, production edge |
| **`.pt` / `.bin`** | Sérialisation `pickle` | Non | PyTorch historique | Checkpoints anciens et reprise d'entraînement en environnement maîtrisé ; déconseillé pour distribuer des poids |


<hr class="hr-text" data-content="Précision">

## 5. La précision numérique, avant même de parler de quantification

Avant d'aborder les `Q4_K_M` et compagnie, il faut comprendre la couche du dessous : **avec combien de bits stocke-t-on un nombre ?**

### 5.1. Les formats flottants

| Format | Taille | Ce qu'il faut retenir |
| --- | --- | --- |
| **FP32** | 4 octets | La précision de référence historique. Aujourd'hui rare pour les LLM : trop coûteuse. |
| **FP16** | 2 octets | Moitié moins de mémoire, mais plage de valeurs étroite : risque de débordement à l'entraînement. |
| **BF16** | 2 octets | Même plage d'exposant que FP32, moins de mantisse. Plus robuste que FP16 à l'entraînement. **C'est le format natif de la plupart des modèles publiés.** |
| **FP8** | 1 octet | Deux fois plus compact que BF16, supporté nativement par les GPU récents. |
| **FP4** | 0,5 octet | La frontière basse du flottant. Nécessite des mécanismes d'échelle par bloc (voir plus bas). |

La différence FP16 / BF16 mérite une seconde d'attention car elle revient souvent. Les deux occupent 2 octets. FP16 répartit ces 16 bits en 5 bits d'exposant et 10 de mantisse ; BF16 en 8 bits d'exposant et 7 de mantisse. BF16 sacrifie donc de la finesse pour conserver **la même amplitude de valeurs que FP32**, ce qui évite les explosions et disparitions de gradients pendant l'entraînement. C'est pour cela qu'il s'est imposé.

### 5.2. La règle de calcul mémoire

C'est le calcul le plus utile de tout l'article :

| Précision | Octets / paramètre | Modèle 8 milliards | Modèle 70 milliards |
| --- | --- | --- | --- |
| FP32 | 4 | ~32 Go | ~280 Go |
| BF16 / FP16 | 2 | ~16 Go | ~140 Go |
| FP8 / INT8 | 1 | ~8 Go | ~70 Go |
| 4 bits | ~0,5 à 0,6 | ~4,5 à 5 Go | ~40 Go |

> note ""
> Le 4 bits n'est jamais exactement 0,5 octet par paramètre. Il faut y ajouter les **facteurs d'échelle** stockés pour chaque bloc de poids. Le `Q4_K_M` de `llama.cpp` pèse en réalité environ **4,89 bits par poids**, soit ~0,61 octet. C'est précisément pour ça qu'un modèle 8B en `Q4_K_M` fait ~4,9 Go et non 4 Go.

Et ce n'est que le poids du modèle. Il faut y ajouter le **cache KV**, qui grandit avec la longueur du contexte, et qui peut représenter plusieurs gigaoctets sur un contexte long. Comptez toujours une marge.


<hr class="hr-text" data-content="Quantification">

## 6. La quantification : compresser sans tout casser

### 6.1. Le principe

Quantifier, c'est **stocker les poids sur moins de bits**. Un poids qui occupait 16 bits n'en occupe plus que 4. On divise la mémoire par quatre.

Mais on ne peut pas simplement tronquer : on perdrait tout. L'astuce universelle est la **quantification par blocs** (*block-wise* ou *group-wise*). On découpe les poids en petits groupes (typiquement 32, 64 ou 128 valeurs) et pour chaque groupe on stocke :

* les valeurs, codées sur peu de bits (l'index dans une échelle réduite) ;
* un ou deux **facteurs d'échelle**, stockés en précision plus haute, qui permettent de reconstruire l'ordre de grandeur.

{% highlight text %}
Poids d'origine (BF16) :  [ 0.031  -0.128   0.094  ...  -0.011 ]   ← 16 bits chacun
                                        │
                          bloc de 32 valeurs + 1 échelle
                                        ▼
Poids quantifiés (4 bits) : [ 5  1  12  ...  7 ]  + échelle=0.0104   ← 4 bits chacun
{% endhighlight %}

C'est de là que vient le mot **block**, et c'est aussi de là que vient une ambiguïté fréquente. Si une fiche parle de « group size 64 » ou « block size 128 », il s'agit de quantification. Si elle parle de « 32 blocks » ou « 32 layers », il s'agit de l'**architecture** du Transformer, où un *block* désigne une couche complète (attention + réseau feed-forward). Deux sens, aucun rapport.

### 6.2. Quand quantifie-t-on ? PTQ contre QAT

Deux stratégies coexistent :

* **PTQ** (*Post-Training Quantization*) : on quantifie **après** l'entraînement. Rapide, ne demande qu'un peu de données de calibration, parfois aucune. C'est ce qui produit l'immense majorité des modèles quantifiés que vous téléchargez.
* **QAT** (*Quantization-Aware Training*) : on **simule** la quantification pendant l'entraînement (*fake quantization*), pour que le modèle apprenne à être robuste à la perte de précision. Nettement plus coûteux, mais nettement plus fidèle en très basse précision.

Pour un utilisateur, la distinction se lit sur la model card. Un modèle publié en QAT par son éditeur d'origine sera généralement meilleur, à taille égale, qu'une quantification PTQ faite par un tiers.

### 6.3. Les grandes familles de quantification

Un piège de vocabulaire à lever d'emblée : ces noms ne désignent pas tous la même catégorie d'objet. Certains sont des schémas de codage, d'autres des algorithmes, d'autres encore une bibliothèque ou un format de rangement. D'où la deuxième colonne.

| Nom | Nature | En clair | Où on le croise |
| --- | --- | --- | --- |
| **k-quants**<br>*Q4_K_M...* | Schéma de codage GGUF | Tous les tenseurs ne reçoivent pas le même nombre de bits : ceux qui supportent mal l'imprécision en gardent plus. | `llama.cpp`, Ollama, LM Studio |
| **IQ-quants**<br>*IQ4_XS...* | Schéma de codage GGUF | Même principe, mais un passage de calibration mesure d'abord quels poids comptent vraiment. Plus petit qu'un k-quant à qualité comparable, surtout sous 4 bits. | `llama.cpp`, Ollama, LM Studio |
| **GPTQ** | Algorithme de compression | Traite le modèle couche par couche, en corrigeant au passage les erreurs déjà introduites. | PyTorch, vLLM |
| **AWQ** | Algorithme de compression | Repère les poids qui reçoivent les signaux les plus forts et leur laisse plus de précision. | vLLM, TensorRT-LLM |
| **bitsandbytes**<br>*NF4, LLM.int8()...* | Bibliothèque Python | Compresse le modèle au moment du chargement, sans fichier compressé à préparer d'avance. La voie courte vers QLoRA. | Transformers, PEFT |
| **compressed-tensors** | Format de rangement | Ne compresse rien par lui-même : il permet de stocker dans un dépôt safetensors des poids compressés par différentes méthodes. | vLLM, LLM Compressor |

Un mot sur l'état des lieux en 2026 : **AWQ est devenu très courant** pour les nouvelles publications côté serveur GPU, porté par une meilleure qualité et des kernels plus rapides que GPTQ, tandis que **GGUF est l'un des formats dominants** en local. GPTQ reste utilisé et pris en charge par plusieurs runtimes ; ce sont surtout ses implémentations qui bougent, avec le remplacement progressif d'AutoGPTQ par GPTQModel. Un modèle récent sort typiquement en safetensors BF16, puis en GGUF et en AWQ dans les jours qui suivent.

### 6.4. Les formats FP4 : MXFP4 et NVFP4

Nouveaux venus, et de plus en plus visibles depuis que le matériel les supporte nativement. Kimi K3 en est l'illustration la plus spectaculaire : ses 2 800 milliards de paramètres sont publiés directement en MXFP4, avec des activations en MXFP8 et une quantification apprise dès l'étape de SFT. Les deux formats encodent les poids en **E2M1** (4 bits : 1 de signe, 2 d'exposant, 1 de mantisse), mais diffèrent sur la mécanique d'échelle :

| | **MXFP4** | **NVFP4** |
| --- | --- | --- |
| Taille de bloc | 32 valeurs | 16 valeurs |
| Échelle | une par bloc, en `E8M0` | une par bloc en FP8 (`E4M3`) **+** une par tenseur en FP32 |
| Gouvernance | Standard ouvert OCP, soutenu par AMD, Arm, Intel, Meta, Microsoft, NVIDIA, Qualcomm | Format NVIDIA, taillé pour les cœurs FP4 de Blackwell |
| À retenir | Multi-vendeur, portable | Blocs plus fins et double échelle : meilleure fidélité, mais lié à NVIDIA |

En pratique : les blocs de 16 et la double échelle donnent à NVFP4 une granularité plus fine, quand MXFP4 mise sur la portabilité multi-vendeur. Leur qualité relative dépend du modèle, du pipeline de calibration, des kernels et de la tâche. **Ne les traitez pas comme des substituts automatiques au FP8 ou au BF16** : comparez-les sur vos usages réels, en particulier sur le raisonnement et les longs contextes.


<hr class="hr-text" data-content="Décoder Q4_K_M">

## 7. Décoder un nom de quantification GGUF

C'est le moment de lire les étiquettes. Prenons `Q4_K_M` et démontons-la morceau par morceau.

{% highlight text %}
Q  4  _  K  _  M
│  │     │     │
│  │     │     └── variante : S (small), M (medium), L (large)
│  │     └──────── famille « k-quant »
│  └────────────── nombre de bits par poids
└───────────────── Quantized
{% endhighlight %}

* **`Q`** : le tenseur est quantifié (par opposition à `F16` ou `BF16`).
* **Le chiffre** : l'ordre de grandeur de la compression. `Q2` à `Q8`. Plus il est bas, plus c'est petit et plus la qualité se dégrade.
* **`K`** : la famille des *k-quants*, qui n'appliquent pas la même précision partout. Les tenseurs jugés sensibles reçoivent plus de bits.
* **`S` / `M` / `L`** : la variante à l'intérieur de la famille (*small*, *medium*, *large*). Ce ne sont pas trois crans d'un curseur uniforme, mais trois recettes qui répartissent différemment les types de quantification entre les tenseurs.

Le préfixe **`IQ`** (`IQ4_XS`, `IQ3_XXS`, `IQ2_M`…) désigne la seconde famille : les quantifications *importance-aware*. Elles s'appuient sur une **matrice d'importance** (*imatrix*), calculée en faisant passer un jeu de données de calibration dans le modèle pour mesurer quels poids comptent vraiment. Résultat : à qualité comparable, elles sont plus petites que les k-quants, surtout à très bas débit de bits. Leur vitesse de décodage dépend en revanche fortement du processeur, des jeux d'instructions disponibles et du backend. Mesurez-la sur votre machine plutôt que de la supposer.

La liste complète proposée par `llama-quantize`, de la plus agressive à la plus fidèle :

{% highlight text %}
2 bits   IQ1_S  IQ1_M  IQ2_XXS  IQ2_XS  IQ2_S  IQ2_M  Q2_K_S  Q2_K
3 bits   IQ3_XXS  IQ3_XS  IQ3_S  IQ3_M  Q3_K_S  Q3_K_M  Q3_K_L
4 bits   IQ4_XS  IQ4_NL  Q4_K_S  Q4_K_M
5 bits   Q5_K_S  Q5_K_M
6 bits+  Q6_K  Q8_0  F16
{% endhighlight %}

Et la recommandation pratique la plus répandue :

> info ""
> **`Q4_K_M` reste un excellent point de départ**, en particulier tant que vous n'avez pas de mesure propre à votre modèle et à votre matériel. Montez en `Q5_K_M` ou `Q6_K` si la qualité prime et que la mémoire suit. Descendez en `Q3_K_M` ou `Q2_K` uniquement si vous n'avez pas le choix. En dessous de 3 bits, la dégradation devient généralement perceptible sur les tâches de raisonnement.

Une heuristique utile : **un modèle plus gros fortement quantifié bat souvent un petit modèle peu quantifié**, à mémoire égale. Un 30B en `Q4_K_M` l'emporte fréquemment sur un 8B en `Q8_0`. Ce n'est pas une garantie : la tendance s'inverse parfois sur le code, les langues peu représentées ou les contextes longs. Comparez sur vos tâches réelles.


<hr class="hr-text" data-content="Étiquettes">

## 8. Les étiquettes d'écosystème : `UD-`, `UVMAX`, `Transcoded`

Passé les formats standards, vous croiserez des noms qui ne figurent dans aucune spécification. Ce ne sont ni des formats, ni des standards : ce sont des **recettes de quantification propres à un fournisseur**. Les traiter comme des étiquettes de pipeline, et non comme des promesses d'interopérabilité, est la bonne posture.

### 8.1. `UD-Q4_K_XL` : Unsloth Dynamic

Le préfixe **`UD-`** signifie *Unsloth Dynamic*. Le principe : au lieu d'appliquer un schéma uniforme, la méthode **analyse chaque couche** et choisit pour elle le type de quantification qui minimise la perte, en s'appuyant sur une calibration. Un `UD-Q4_K_XL` mélange donc plusieurs types et préserve certains tenseurs en précision plus haute ; la répartition exacte dépend de la recette construite pour ce modèle-là.

Deux conséquences :

* Le gain est surtout net **en très basse précision** (`Q2`, `Q3`), là où une quantification uniforme casse le modèle.
* Le suffixe **`XL`** ne fait pas partie de la spécification GGUF. C'est une convention de nommage propre à Unsloth, qui désigne une variante au budget de précision plus généreux.

Ces fichiers restent des GGUF standards : ils se chargent dans `llama.cpp` et les outils qui en dépendent, sans traitement particulier.

### 8.2. `UVMAX` : kernelpool

Autre schéma maison. Dans certains dépôts MLX de kernelpool, comme `kernelpool/Kimi-K3-2bit-UVMAX`, `UVMAX` désigne une recette de précision mixte : le nombre de bits est affecté **par classe de tenseurs**, en fonction de l'erreur de quantification mesurée pour chacune, plutôt qu'uniformément. Les experts des couches feed-forward y sont compressés agressivement, quand les composants sensibles (routeurs, attention, `lm_head`) sont préservés en précision plus haute. Ce n'est pas une norme, et rien ne garantit que l'étiquette recouvre la même recette ailleurs.

C'est de la quantification « au cas par cas ». Le gain de qualité à taille donnée peut être réel. En contrepartie, la portabilité est faible : ces dépôts visent un runtime précis, souvent `mlx-lm` ou `mlx-vlm`, et exigent parfois une version de développement non encore publiée.

### 8.3. `Transcoded`

Le terme n'a pas de définition standard. Dans certains dépôts MLX actuels, il décrit la conversion de checkpoints NVFP4, produits pour du matériel NVIDIA, vers une représentation exploitable par MLX, en tentant de préserver la logique de quantification d'origine. Ailleurs, il peut simplement vouloir dire « reconverti depuis un autre format ».

Ce n'est donc pas une méthode de compression, mais une **opération de conversion**. La question à se poser n'est pas « est-ce bon ? » mais « pour quel runtime ? ».

> warning ""
> Règle générale pour toute étiquette exotique : posez-vous quatre questions avant de télécharger. **Quel conteneur réel ? Quel runtime cible ? Quelles versions minimales ? Quel tokenizer ?** Si la model card ne répond pas, passez votre chemin.


<hr class="hr-text" data-content="Noms de modèles">

## 9. Décoder le nom du modèle lui-même

Le nom du modèle, avant même la quantification, encode déjà beaucoup d'information.

{% highlight text %}
Qwen3.5  -  35B  -  A3B  -  Instruct  -  GGUF
    │        │       │         │          │
    │        │       │         │          └──── format de distribution
    │        │       │         └─────────────── type d'entraînement
    │        │       └───────────────────────── paramètres actifs (MoE)
    │        └───────────────────────────────── paramètres totaux
    └────────────────────────────────────────── famille et version
{% endhighlight %}

Ce nom est un **composite pédagogique** : il réunit en une chaîne des segments que vous ne verrez pas toujours ensemble. Le dépôt officiel s'appelle `Qwen/Qwen3.5-35B-A3B`, décliné en `-Base` ; le suffixe `Instruct`, lui, est une convention très répandue ailleurs.

### 9.1. Base, Instruct, Chat

* **Base** (ou pas de suffixe) : le modèle brut, entraîné uniquement à prédire le token suivant. Il peut techniquement répondre ou poursuivre une conversation, mais son comportement est moins prévisible et bien moins adapté à un usage d'assistant. C'est le point de départ pour un fine-tuning.
* **Instruct** / **Chat** / **IT** : le modèle a subi un alignement sur instructions. C'est celui qu'il vous faut pour converser ou pour suivre des consignes.

Choisir un modèle *Base* en croyant prendre un assistant est l'une des déceptions les plus fréquentes des débuts.

### 9.2. Thinking, Reasoning

Le modèle passe par une phase de raisonnement avant sa réponse finale. Selon le modèle et son mode d'exécution, cette phase est générée explicitement entre des balises dédiées, ou reste partiellement masquée et résumée par le runtime. Meilleur sur les tâches de logique, de mathématiques et de code, au prix de beaucoup plus de tokens générés, donc de latence et de mémoire de contexte.

### 9.3. `A3B` et les modèles Mixture-of-Experts

Deux nombres dans un nom (`35B-A3B`) signalent une architecture **MoE** (*Mixture of Experts*) : le modèle contient 35 milliards de paramètres au total, mais n'en **active que 3 milliards par token**.

La conséquence pratique est contre-intuitive et vaut d'être retenue :

* La **mémoire** se dimensionne sur le total (35B) : il faut tout charger.
* Le **calcul par token** est très inférieur à celui d'un modèle dense de 35B, puisque seule une partie des experts est activée.

N'en déduisez pas qu'un `35B-A3B` ira aussi vite qu'un modèle dense de 3B. Les couches partagées, l'attention, le routeur, le nombre d'experts activés, le volume de lectures mémoire et la qualité des kernels MoE du backend pèsent tous sur le débit réel. Un MoE achète du calcul économisé, pas de la mémoire économisée.

### 9.4. Distill

Le modèle a été entraîné à imiter un modèle plus grand : c'est la **distillation de connaissance**. Un `DeepSeek-R1-Distill-Qwen-7B` n'est pas un R1 rétréci : c'est un Qwen 7B entraîné sur les sorties de R1. Il en hérite une partie du comportement, pas l'architecture.

### 9.5. Abliterated, Uncensored

Ces deux étiquettes ne sont pas synonymes, et les confondre mène à des surprises.

**Abliterated** désigne une famille de techniques d'**édition des poids** visant à réduire les directions internes associées au refus. On mesure la différence d'activations entre prompts anodins et prompts refusés, puis on retranche cette direction des poids. Ce n'est pas un contournement par prompt : c'est une modification permanente, avec des effets de bord possibles sur les autres capacités du modèle.

**Uncensored** est beaucoup plus vague. Selon le dépôt, l'étiquette recouvre une ablation, un fine-tuning sur un jeu de données différent, un simple changement de system prompt, ou une promesse purement commerciale. Lisez la model card avant d'en conclure quoi que ce soit.

### 9.6. `mmproj` : les modèles multimodaux

Un modèle **multimodal** accepte autre chose que du texte en entrée, le plus souvent des images, parfois de l'audio ou de la vidéo, et répond en texte. C'est ce qui permet de lui soumettre une photo ou une capture d'écran et de l'interroger dessus.

Dans la plupart des distributions GGUF multimodales, le modèle de langage est accompagné d'un fichier séparé, encore appelé **`mmproj`** par tradition (`mmproj-F16.gguf`). Il porte la projection qui amène l'image dans un espace que le modèle de langage comprend, et selon l'architecture d'autres éléments de l'encodeur visuel ainsi que des paramètres de prétraitement.

{% highlight bash %}
llama-server -m gemma-3-4b-it-Q4_K_M.gguf --mmproj mmproj-gemma-3-4b-it-F16.gguf
{% endhighlight %}

Oublier le `--mmproj`, c'est se retrouver avec un modèle qui ne voit rien.


<hr class="hr-text" data-content="Adaptation">

## 10. Adapter un modèle : LoRA contre finetune complet

Dernière couche du vocabulaire : comment spécialise-t-on un modèle ?

### 10.1. Le finetune complet

On poursuit l'entraînement du modèle sur des données spécifiques, **en mettant à jour tous les poids**. Contrôle maximal, adaptation profonde, mais chaque variante produit un checkpoint complet, aussi lourd que le modèle d'origine. Coûteux à entraîner, coûteux à stocker, coûteux à distribuer.

### 10.2. LoRA et les adapters

L'approche *parameter-efficient* renverse la logique : on **gèle** le modèle de base et on n'entraîne que de petits modules greffés dessus. **LoRA** (*Low-Rank Adaptation*) est la variante dominante.

Le résultat tient en deux fichiers :

{% highlight text %}
adapter_config.json           → quel modèle de base, quel rang, quelles couches ciblées
adapter_model.safetensors     → les poids de l'adapter
{% endhighlight %}

De quelques mégaoctets à plusieurs centaines selon le rang, les modules ciblés et la précision, contre plusieurs gigaoctets pour un checkpoint complet. On peut en stocker des dizaines, les charger à la demande, les échanger.

{% highlight python %}
from peft import LoraConfig, get_peft_model

config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    lora_dropout=0.05,
    task_type="CAUSAL_LM",
)
model = get_peft_model(base_model, config)
# ... entraînement ...
model.save_pretrained("./mon_adapter")
{% endhighlight %}

La contrainte : un adapter est **inutilisable sans son modèle de base exact**. Si vous téléchargez un `adapter_model.safetensors` sans lire quel modèle il cible, vous avez téléchargé un trousseau sans serrure.

### 10.3. QLoRA

La combinaison qui a démocratisé le fine-tuning : on charge le modèle de base **quantifié en 4 bits** (typiquement `NF4`, avec double quantification), gelé, et on entraîne un adapter LoRA par-dessus en précision plus haute.

Le modèle occupe le quart de sa mémoire habituelle, et seuls les quelques millions de paramètres de l'adapter reçoivent des gradients. C'est ce qui permet d'adapter un modèle de plusieurs dizaines de milliards de paramètres sur un seul GPU.

{% highlight python %}
from transformers import AutoModelForCausalLM, BitsAndBytesConfig

cfg = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_use_double_quant=True,
)
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3.1-8B",
    device_map="auto",
    quantization_config=cfg,
)
{% endhighlight %}

### 10.4. Fusionner ou pas

Un adapter peut rester séparé, le runtime le chargeant par-dessus la base, ou être **fusionné** dans les poids du modèle pour produire un checkpoint autonome.

Contrairement à une idée répandue, rester séparé fonctionne aussi côté GGUF. `llama.cpp` sait convertir un adapter PEFT en adapter GGUF, puis l'appliquer à un modèle de base avec `--lora` ou `--lora-scaled`. Vous pouvez même en charger plusieurs à la fois et ajuster leur poids, sans rien réécrire.

{% highlight bash %}
python convert_lora_to_gguf.py ./mon_adapter --base ./modele_de_base
llama-cli -m modele-Q4_K_M.gguf --lora mon_adapter-F16.gguf -p "Bonjour"
{% endhighlight %}

La fusion garde son utilité : distribuer un artefact unique, ou viser un runtime qui ne gère pas les adapters séparés.


<hr class="hr-text" data-content="Choisir">

## 11. Que choisir, concrètement

### 11.1. L'arbre de décision

{% highlight text %}
Je veux juste EXÉCUTER un modèle
│
├── Sur un Mac Apple Silicon
│   └── dépôt MLX 4-bit  (mlx-community/…-4bit)
│       └── modèle < 7B ou qualité critique ? → MLX 8-bit
│
├── Sur PC / Linux, CPU ou GPU grand public
│   └── GGUF Q4_K_M  ← le défaut robuste
│       ├── plus de RAM disponible ?     → Q5_K_M ou Q6_K
│       ├── mémoire très serrée ?        → IQ3_M ou Q3_K_M
│       └── qualité maximale en local ?  → Q8_0
│
└── Sur serveur GPU, plusieurs utilisateurs
    └── AWQ ou compressed-tensors via vLLM

Je veux ADAPTER un modèle
│
├── Budget GPU limité       → QLoRA (base 4-bit + adapter LoRA)
├── Budget confortable      → LoRA sur base BF16
└── Transformation profonde → finetune complet
{% endhighlight %}

### 11.2. Tableau de synthèse

| Option | Taille (modèle 8B) | Qualité | Matériel | Facilité |
| --- | --- | --- | --- | --- |
| Safetensors BF16 | ~16 Go | Référence | GPU, gros serveurs | Simple côté HF, lourd en RAM |
| GGUF `Q8_0` | ~8,5 Go | Quasi identique à BF16 | CPU/GPU avec RAM confortable | Très simple |
| GGUF `Q5_K_M` / `Q6_K` | ~5,7 à 6,6 Go | Très bonne | CPU/GPU grand public | Très simple |
| **GGUF `Q4_K_M`** | **~4,9 Go** | **Bonne, perte minime** | **CPU/GPU grand public** | **Très simple : le défaut** |
| GGUF `IQ3_M` / `Q3_K_M` | ~3,7 à 4 Go | Dégradation visible | Machines contraintes | Simple, à vérifier |
| GGUF `Q2_K` | ~3 Go | Dégradation nette | Dernier recours | À éviter sauf nécessité |
| MLX 4-bit | ~4,5 Go | Bonne | Principalement Apple Silicon via `mlx-lm` | Très simple sur Mac |
| AWQ 4-bit | ~5,5 Go | Bonne, kernels rapides | GPU NVIDIA | Bonne intégration vLLM |
| LoRA (adapter seul) | de quelques Mo à quelques centaines | Dépend de l'entraînement | Celui de la base | Simple, mais base obligatoire |

Les tailles sont des ordres de grandeur pour un modèle dense de 8 milliards de paramètres ; elles varient selon l'architecture, notamment la taille du vocabulaire.


<hr class="hr-text" data-content="Conclusion">

## Ce qu'il faut retenir

La confusion de l'écosystème vient d'un seul fait : **des mots très proches désignent des choses de nature différente**. Une fois la séparation faite, tout se range.

* **GGUF, Safetensors, ONNX** répondent à « dans quoi c'est rangé ». Ce sont des conteneurs.
* **`Q4_K_M`, `NF4`, `AWQ`, `MXFP4`, `UVMAX`** répondent à « avec combien de bits ». Ce sont des schémas de quantification.
* **Base, Instruct, LoRA, finetune** répondent à « comment c'est spécialisé ».
* **`llama.cpp`, vLLM, MLX, ONNX Runtime** répondent à « avec quoi ça s'exécute ».
* **Le tokenizer et le chat template** ne sont dans aucune de ces cases, et cassent tout quand on les néglige.

Pour démarrer sans se tromper, quatre décisions suffisent :

1. **Choisissez le matériel d'abord.** Mac Apple Silicon → MLX. Tout le reste → GGUF via `llama.cpp`, Ollama ou LM Studio.
2. **Prenez `Q4_K_M`** (ou MLX 4-bit) comme point de départ, et ne vous en écartez qu'avec une raison mesurée.
3. **Vérifiez le tokenizer et le chat template** avant de conclure qu'un modèle est mauvais. Très souvent, c'est le prompt qui est mal formé.
4. **Traitez `UD-`, `UVMAX`, `Transcoded` et consorts comme des étiquettes de fournisseur.** Elles peuvent être excellentes, mais elles exigent de lire la model card, pas le nom du fichier.

Le reste (`IQ3_XXS`, `NVFP4`, `A3B`, `mmproj`) n'est plus du jargon une fois qu'on sait à quelle question chaque terme répond.

> info ""
> **En une phrase :** le format est la valise, la quantification est la façon de plier, l'adapter est le kit d'accessoires, et le tokenizer est la langue qu'on parle une fois arrivé.


<hr class="hr-text" data-content="Sources">

## Pour aller plus loin

* [Spécification GGUF : ggml](https://github.com/ggml-org/ggml/blob/master/docs/gguf.md){:target="_blank" rel="noopener noreferrer nofollow"}
* [Types de quantification `llama-quantize`](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md){:target="_blank" rel="noopener noreferrer nofollow"}
* [Safetensors : format et spécification](https://github.com/safetensors/safetensors){:target="_blank" rel="noopener noreferrer nofollow"}
* [MLX LM : documentation](https://github.com/ml-explore/mlx-lm){:target="_blank" rel="noopener noreferrer nofollow"}
* [Unsloth Dynamic 2.0 GGUFs](https://unsloth.ai/docs/basics/unsloth-dynamic-2.0-ggufs){:target="_blank" rel="noopener noreferrer nofollow"}
* [PEFT : Parameter-Efficient Fine-Tuning](https://huggingface.co/docs/peft){:target="_blank" rel="noopener noreferrer nofollow"}
* [Support multimodal dans `llama.cpp`](https://github.com/ggml-org/llama.cpp/blob/master/docs/multimodal.md){:target="_blank" rel="noopener noreferrer nofollow"}
* [Open Compute Project : Microscaling Formats (MX)](https://www.opencompute.org/documents/ocp-microscaling-formats-mx-v1-0-spec-final-pdf){:target="_blank" rel="noopener noreferrer nofollow"}
* [Définition Open Source AI 1.0 : OSI](https://opensource.org/ai/open-source-ai-definition){:target="_blank" rel="noopener noreferrer nofollow"}
* [`torch.load` : sécurité et `weights_only`](https://docs.pytorch.org/docs/stable/generated/torch.load.html){:target="_blank" rel="noopener noreferrer nofollow"}
* [Adapters LoRA en GGUF dans `llama.cpp`](https://github.com/ggml-org/llama.cpp/discussions/10123){:target="_blank" rel="noopener noreferrer nofollow"}
* [MLX : installation et backends disponibles](https://ml-explore.github.io/mlx/build/html/install.html){:target="_blank" rel="noopener noreferrer nofollow"}
* [Model card officielle Qwen3.5-35B-A3B](https://huggingface.co/Qwen/Qwen3.5-35B-A3B){:target="_blank" rel="noopener noreferrer nofollow"}
* [Model card officielle Kimi K3](https://huggingface.co/moonshotai/Kimi-K3){:target="_blank" rel="noopener noreferrer nofollow"}
* [Quantification dans Transformers : AWQ, GPTQ, compressed-tensors](https://huggingface.co/docs/transformers/main_classes/quantization){:target="_blank" rel="noopener noreferrer nofollow"}
