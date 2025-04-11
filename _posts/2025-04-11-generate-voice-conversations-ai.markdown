---
layout: post
title: "Comment générer des conversations vocales grâce à l'IA pour tester un outil de transcription"
date: 2025-04-11 13:47:00 +0100
description: "Un retour d'expérience sur la génération de dialogues audio synthétiques avec OuteTTS pour tester un outil de transcription de réunion."
img: generate-voice-conversations-ai.jpg
fig-caption: Photo générée avec Le Chat de Mistral AI
tags: ["TTS", "synthetic-voices", "AI", "OuteTTS"]
lang: fr
permalink: /generate-voice-conversations-ai/
status: finished
---

Développant seul un outil de transcription et d’analyse de réunions, j’ai rapidement eu besoin de fichiers audio réalistes pour le tester. N’ayant ni participants pour enregistrer des réunions fictives, ni enregistrements exploitables sous la main, j’ai décidé de créer un générateur de conversations vocales à partir de fichiers texte.

L’idée : partir d’un script de conversation structuré (avec plusieurs intervenants), et utiliser l’IA pour produire automatiquement un fichier audio où chaque personnage s’exprime avec une voix synthétique différente.

Pour cela, je me suis basé sur les modèles TTS existants de [HuggingFace](https://huggingface.co/models?pipeline_tag=text-to-speech&sort=trending){:target="_blank" rel="noopener noreferrer nofollow"} et j'ai sélectionné [**OuteTTS**](https://github.com/edwko/OuteTTS){:target="_blank" rel="noopener noreferrer nofollow"}, un projet open-source de synthèse vocale basé sur **llama.cpp** et la librairie **Transformers**, que du beau monde, et aussi capable de générer des voix naturelles dans différentes langues.

Dans cet article, je partage le fonctionnement du générateur que j’ai construit avec Python, comment j’ai géré les profils de locuteurs, les erreurs rencontrées, et les astuces pour obtenir un résultat fluide, personnalisable, et utile pour tester tout outil de transcription.

{% github_card jeanjerome/VoiceGenMeeting %}


<hr class="hr-text" data-content="Sommaire">

* TOC
{:toc}

<hr class="hr-text" data-content="Générateur">

## Le générateur : principe et structure

L’idée du générateur est simple : partir d’un fichier texte dans lequel chaque ligne correspond à une réplique, précédée du nom de l’intervenant, par exemple :

{% highlight plaintext %}
Marc : Bonjour à tous, on commence ?
Julie : Oui, je suis prête.
...
{% endhighlight %}

Le script identifie automatiquement les locuteurs, leur assigne une voix, puis génère chaque segment audio grâce au modèle OuteTTS. Tous les segments sont ensuite concaténés, avec un petit silence entre chaque prise de parole, pour produire un seul fichier `.wav` qui restitue toute la conversation.

J’ai choisi de construire un outil en ligne de commande, en Python, qui prend un fichier texte en entrée et génère un fichier audio en sortie. Le fonctionnement est assez modulaire et se découpe en plusieurs étapes :

1. **Lecture et parsing du fichier texte** : chaque ligne est analysée pour en extraire le nom du locuteur et son texte.
2. **Attribution d’une voix** : pour chaque nouvel interlocuteur, le script crée un profil vocal unique. C’est une fonctionnalité offerte par OuteTTS, qui permet de générer un clone de voix à partir d’un simple fichier audio d’environ 15 secondes.
3. **Génération des segments audio** : le modèle OuteTTS est invoqué pour chaque réplique, en utilisant la voix associée au locuteur concerné.
4. **Concaténation des segments** : les segments audio sont ensuite combinés dans l’ordre d’apparition, avec une courte pause entre chaque prise de parole pour rendre l’écoute plus naturelle.

Ce fonctionnement permet de simuler très facilement des réunions avec plusieurs intervenants, chacun doté d’une voix propre, à partir d’un simple fichier `.txt`. C’est un excellent moyen de produire des cas de test réalistes sans devoir passer par l’enregistrement audio manuel.

<hr class="hr-text" data-content="Générateur">

## Des voix sur mesure pour chaque interlocuteur

Pour que les conversations générées soient crédibles, il était essentiel que chaque intervenant ait sa propre voix. OuteTTS permet précisément cela : il est capable de créer un profil vocal personnalisé à partir d’un simple fichier audio.

Le script que j’ai développé suit une logique simple : lorsqu’un nouveau nom de locuteur est rencontré, il cherche un fichier audio correspondant dans un dossier `data/speakers`. Par exemple, si la ligne du fichier de transcription commence par `Julie : ...`, le script tentera de charger `data/speakers/julie.wav` (ou `.mp3`).

Si ce fichier existe, OuteTTS l’utilise pour générer un clone de voix en quelques secondes. En réalité, cette opération s’appuie sur `Whisper`, le modèle de transcription audio d’OpenAI, qui est utilisé en amont pour transcrire le fichier et segmenter précisément la voix. La durée utile du fichier est automatiquement tronquée à `15 secondes`, ce qui est suffisant pour capturer les caractéristiques vocales nécessaires.

Le profil généré est ensuite sauvegardé dans un fichier `.json` dans un dossier `data/profiles`, afin de ne pas avoir à le régénérer à chaque exécution. Si aucun fichier n’est trouvé, le script peut utiliser la voix par défaut proposée par le modèle, `en-female-1-neutral` (mais ce n'est pas le but).

Pour simplifier la préparation des voix, le script convertit automatiquement les fichiers `.mp3` (ou `.wav`) en mono, 44,1 kHz, et coupe à 15 secondes maximum si nécessaire. Cela garantit la compatibilité avec les exigences du modèle, tout en permettant d’utiliser des extraits vocaux simples, même enregistrés rapidement avec un micro de base.

Ce système rend la création de dialogues vocaux entièrement automatisable. Il suffit de préparer un script texte avec des noms de personnages, d’ajouter un court fichier vocal pour chacun, et de lancer le générateur pour obtenir une réunion fictive crédible en quelques minutes.

<hr class="hr-text" data-content="Les Pièges">

## Les pièges rencontrés et les ajustements nécessaires

Mettre en place un générateur de réunions audio semblait simple sur le papier… mais plusieurs détails techniques m’ont rapidement forcé à ajuster le tir. Voici quelques obstacles que j’ai rencontrés, et comment je les ai contournés.

### 1. Une seule voix disponible par défaut
En testant le modèle OuteTTS initial, je me suis vite rendu compte que le modèle ne propose qu’un seul profil vocal par défaut (`en-female-1-neutral`). Toute tentative de charger une autre voix renvoyait une erreur.

**Solution** : utiliser des fichiers audio personnalisés pour chaque intervenant. Cela m’a permis de générer dynamiquement autant de profils que nécessaire à partir de mes propres extraits (`marc.mp3`, `julie.wav`, etc.).


### 2. Format audio : Tensor ou WAV ?
Contrairement à ce que l’on pourrait attendre, la sortie `output.audio` retournée par OuteTTS **n’est pas toujours un fichier WAV**. Il s’agit en réalité d’un **tenseur brut** (typiquement un `numpy.ndarray` ou un `torch.Tensor`) représentant le signal audio.

**Solution** : au lieu de traiter le flux comme un fichier encodé (ce qui générait une erreur du type “a bytes-like object is required”), j’ai simplement converti le tenseur en tableau numpy via `np.asarray(output.audio, dtype='float32').flatten()`. Cette approche a résolu le problème et permis la concaténation correcte des segments.

### 3. Voix ralentie, grave, ou déformée
Lors de mes premiers tests, la voix générée était étrange : lente, grave, presque déformée. En réalité, cela venait d’un **mauvais taux d’échantillonnage** lors de l’enregistrement du fichier final.

**Solution** : fixer manuellement le `sample_rate` à **44 100 Hz**, ce qui correspond au taux de sortie audio attendu pour obtenir une voix normale et naturelle avec OuteTTS.

### 4. Incompatibilité avec NumPy 2.0
Une mise à jour de NumPy a introduit un `DeprecationWarning` lié à la gestion du paramètre `copy` lors de la conversion en array. Ce n’était pas bloquant, mais cela polluait la sortie console.

**Solution** : éviter `np.array(..., copy=True)` et préférer `np.asarray(...).copy()` pour garantir la compatibilité avec NumPy 2.0 tout en restant clair.

### 5. Découper automatiquement les fichiers audio trop longs
Certaines de mes sources audio dépassaient 30 secondes, ce qui posait problème à OuteTTS pour générer un profil de voix fiable. Le modèle coupe automatiquement à 15 secondes, mais mieux vaut le faire en amont.

**Solution** : j’ai intégré la librairie `pydub` pour convertir et tronquer automatiquement tout fichier `.mp3` ou `.wav` à 15 secondes, en mono et à 44,1 kHz. Cette étape garantit que les profils sont compatibles, même à partir de fichiers audio imparfaits.

Ces petits ajustements m’ont permis de stabiliser l’outil et d’obtenir une génération fluide, fiable, et surtout réutilisable dans différents contextes de test. Et comme souvent avec l’IA générative, le diable est dans les détails.


<hr class="hr-text" data-content="Conclusion">

## Conclusion

En combinant un simple fichier texte, quelques extraits audio, et un modèle open source comme OuteTTS, j’ai pu créer un outil capable de générer automatiquement des conversations vocales réalistes pour tester mon pipeline de transcription et d’analyse de réunions.

Ce générateur me permet de simuler des échanges multi-intervenants, de varier les voix, et de produire autant de cas de test que nécessaire, sans dépendre d’enregistrements réels ni mobiliser d'autres personnes.

Au-delà du test, cet outil ouvre la voie à d’autres usages : restitution vocale de comptes rendus, relecture audio synthétique de réunions, ou même génération de dialogues simulés à la volée dans des environnements d’apprentissage ou de prototypage d’agents conversationnels.

Le code complet est en open source. Si ce genre d’approche vous intéresse, ou si vous développez des outils de transcription, de TTS ou d’assistants vocaux, je serais ravi d’échanger avec vous.
