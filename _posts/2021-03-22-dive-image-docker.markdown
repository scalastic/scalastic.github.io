---
layout: post
title: Dive, une plongée dans les images Docker
redirects:
- /dive-une-plongée-dans-les-images-docker/
date: 2021-03-22 15:0:00 +2
description: Comment voir facilement ce que contient une image Docker ? Dive est un outil qui permet d'explorer les répertoires et fichiers d'une image docker, les modifications apportées dans chaque couche de l'image et des informations pour réduire la taille de votre image.
img: dive-image-docker.jpg 
fig-caption: Photo de <a href="https://unsplash.com/@jamesthornton95?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">James Thornton</a> sur <a href="https://unsplash.com/s/photos/diving?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
tags: [Docker,Continuous-Integration,Tool]
---

La construction d'images Docker est devenue monnaie courante dans le monde des SI. Cependant et malgré l'utilisation d'images de référence, nos images Docker dans leur repository sont comme des boites noires dont personne ne sait trop de quoi elles sont vraiment constituées. Pire encore, dans un processus continu DevOps, aucun métrique ne permet de mesurer le niveau d'optimisation de notre image de conteneur.

Certes il existe les commandes `docker inspect <image>` ou encore `docker history <image>` mais ce sont là des commandes peu pratiques à manier.

C'est en cela que l'outil [Dive](https://github.com/wagoodman/dive){:target="_blank" rel="noopener noreferrer nofollow"} va nous permettre de plonger au coeur de nos images Docker / OCI et nous permettre de savoir enfin simplement ce qu'elles contiennent. 


<hr class="hr-text" data-content="Plan">

* TOC
{:toc}

<hr class="hr-text" data-content="Fonctionnalités">

## Les fonctionnalités

Passons en revue les caractéristiques de l'outil et voyons ce qu'il peut nous apporter :  

- Affichage du contenu de l'image Docker, pour chaque ***layer*** de l'image, il est possible de naviguer dans son **système de fichiers** 
- Indication des **modifications** au niveau de chaque ***layer*** (ajout, modification, suppression)
- Estimation d'un score d'**image efficiency**
- Intégration dans un **CI** possible pour calculer l'**image efficiency** et définir une limite blocante

<hr class="hr-text" data-content="Démo">

## Démonstration 

Voyons un cas concret et analysons une image générée par Builpacks et Spring Native : 

<script id="asciicast-ra66cmrst0hNBQ9hngDpbaMUl" src="https://asciinema.org/a/ra66cmrst0hNBQ9hngDpbaMUl.js" async></script>

Que nous apprend l'outil Dive :
- Notre image est faite de 6 ***layers*** dont nous pouvons voir les changements qu'ils opèrent dans le ***filesystem***
- Sur les 82 Mo de l'image, 481 octets peuvent être récupérés autant dire pas grand chose d'où le score ***image efficiency*** de 99%
- L'aspect visuel de l'outil rend plus compréhensible les actions des différentes couches : ajout d'un utilisateur `cnb`, ajout de l'exécutable dans le répertoire `worskpace`,...


## Conclusion

Cet outil simple devrait permettre à tout développeur de comprendre l'impact de chaque ligne de son **Dockerfile**. De plus, la taille des images étant de plus en plus critique dans le contexte des déploiements, c'est aussi un moyen d'imposer une limite ou du moins un niveau de qualité.

Et vous, qu'en pensez-vous ?

Cheers...

> info "Et maintenant"
> * Vous avez aimé cet article ? Dites-le ci-dessous afin que le blog gagne en visibilité.
> * Vous avez une question ? Posez-la en commentaire, je m'efforcerai d'y répondre dans les plus brefs délais !!
> 
> Merci à vous !
>
